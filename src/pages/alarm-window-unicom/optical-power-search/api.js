import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';

export const getOpticalPowerList = (data) => {
    return request('/opticalPower/getTaskHistory', {
        type: 'post',
        baseUrlType: 'noticeUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};

export const getOpticalPowerTaskResult = (data) => {
    return request('/opticalPower/getTaskResult', {
        type: 'post',
        baseUrlType: 'noticeUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};

export const getAlarmDetail = (standard_alarm_id) => {
    return request('alarm/detail/v1/alarms', {
        type: 'post',
        baseUrlType: 'exportUrl',
        data: [standard_alarm_id],
        showSuccessMessage: false,
        showErrorMessage: false,
    }).then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
            const alarmInfo = res.data[0][standard_alarm_id];
            return Object.entries(alarmInfo).reduce((accu, item) => {
                if (item[0].toLowerCase() !== item[0]) {
                    return accu;
                }
                return { ...accu, [_.camelCase(item[0])]: item[0] === 'special_field3' ? item[1].lable : item[1].value };
            }, {});
        }
        return {};
    });
};

export const openSearchTask = async (standard_alarm_id) => {
    const detail = await getAlarmDetail(standard_alarm_id);

    if (_.isEmpty(detail)) {
        return {
            code: 500,
            message: '查询告警详情失败',
            data: null,
        };
    }

    // 光功率是否可用判断 告警，为专业(传输网)+网络类型(本地或二干)+对象类型(PORT)，告警满足这个条件，才可进行光功率查询
    if (
        detail.professionalType?.toString() !== '3' ||
        (detail.networkType?.toString() !== '25100508' && detail.networkType?.toString() !== '25100509') ||
        detail.objectClass?.toString() !== '706'
    ) {
        return {
            code: 500,
            message: '仅传输网本地或二干的端口告警才支持查询光功率',
            data: null,
        };
    }

    const data = _.pick(detail, [
        'alarmSource',
        // 'cityId',
        // 'cityName',
        'eqpLabel',
        'idn',
        'locateInfo',
        'specialField0',
        'specialField3',
        'neLabel',
        'provinceId',
        'provinceName',
        'regionId',
        'regionName',
        'transSegName',
        'transSystemName',
    ]);

    return request('/opticalPower/createTask', {
        type: 'post',
        baseUrlType: 'noticeUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data: {
            ...data,
            locatedRoom: data.specialField0,
            nodeType: data.specialField3,
            specialField0: undefined,
            specialField3: undefined,
            userId: useLoginInfoModel.data.userId,
        },
    }).then((res) => {
        return {
            ...res,
            data: {
                taskId: res.data,
                resourceId: detail.idn,
            },
        };
    });
};

export const getZones = (data) => {
    return request('/api/zones', {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};

// 获取地市用户所在省信息
export const getCityUserBelongProvince = () => {
    return request('alarmmodel/field/v1/dict/entry', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data: {
            // pageSize: 1,
            dictName: 'province_id',
            en: false,
            modelId: 2,
            creator: useLoginInfoModel.data.userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        },
    });
};
