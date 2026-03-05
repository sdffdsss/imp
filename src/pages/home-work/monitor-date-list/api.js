import request from '@Common/api';
import { blobDownLoad } from '@Common/utils/download';

/**
 * @description: 获取监控中心列表
 * @param {*}
 * @return {*}
 */
export const getCenterList = (data) => {
    return request('v1/monitor-center/selectData', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const updateWorkingScheduleBatch = (params, param) => {
    return new Promise((reslove) => {
        request('schedule/updateWorkingScheduleBatch', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: params,
            handlers: {
                params: param,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                reslove(null);
            });
    });
};

// 编辑班次
export const updateRule = (data) => {
    return request('workShiftRule/saveRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};

// 自动排班
export const autoSchedule = (data, params) => {
    return request('schedule/updateWorkingScheduleAuto', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
        handlers: {
            params,
        },
    });
};

// 获取班次
export const getRule = (data) => {
    return request('workShiftRule/getRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};

// 获取值班长班组数据
export const findScheduleListByShiftForeman = (data) => {
    return request('schedule/findScheduleListByShiftForeman', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};

// 获取值班长-值班人员数据
export const findShiftForemanGroupUserList = (data) => {
    return request('group/findShiftForemanGroupUserList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};
// 获取值班长-查询值班长班组班次规则
export const getShiftForemanRule = (data) => {
    return request('workShiftRule/getShiftForemanRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};
// 获取值班长-修改值班长班组班次规则
export const saveShiftForemanRule = (data) => {
    return request('workShiftRule/saveShiftForemanRule', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: 'false',
        showSuccessMessage: false,
        data,
    });
};
/**
 * 按姓名-手机号或账号生成班表导出模板
 * @param {*} data
 * @returns
 */
export const createImportTemplate = (data) => {
    return request('schedule/createImportTemplate', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });
};

/**
 * 下载失败原因
 * @param {*} fileName
 * @returns
 */
export function downloadFailReasonApi(fileUrl) {
    // eslint-disable-next-line no-param-reassign
    fileUrl = fileUrl?.slice(1);

    const array = fileUrl?.split('/');
    const name = array?.length > 0 ? array[array?.length - 1] : '失败原因.xlsx';

    request(fileUrl, {
        type: 'get',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        data: {},
        responseType: 'blob',
    }).then((ress) => {
        blobDownLoad(ress, name);
    });
}
