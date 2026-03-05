import request from '@Common/api';
import moment from 'moment';

/**
 * @description: 获取监控中心列表
 * @param {*}
 * @return {*}
 */
export const getCenterListApi = (data) => {
    return request('v1/monitor-center/selectData', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const getCenterForControlList = (data) => {
    return request('group/findCentersForControlAccount', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取省份信息
 * @param {*}
 * @return {*}
 */
export const getProvinceList = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const getProvinceListForControl = (data) => {
    return request('group/findProvincesForControlAccount', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取灰度列表
 * @param data
 * @return
 */
export const findTrackList = (data) => {
    return request('shiftingOfDuty/findTrackList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const findTrackCount = (data) => {
    return request('shiftingOfDuty/findAllTrackCount', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getModalData = (data) => {
    return request('shiftofdutyEvealuation', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        data,
    });
};

export const saveModalData = (data) => {
    return request('shiftofdutyEvealuation', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        data,
    });
};

/**
 * @description: 根据值班记录信息导出维护作业计划详情--高勇提供
 * @param data
 * @return
 */
export const exportWorkingPlanRecordByTrackList = (data) => {
    return request('shiftingOfDuty/exportWorkingPlanRecordByTrackList', {
        type: 'get',
        baseUrlType: 'groupUrl',
        responseType: 'blob',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getGroupListApi = (data) => {
    return request('group/findGroupByCenter', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const getGroupListForControlApi = (data) => {
    return request('group/findGroupsForControlAccount', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
/**
 * @description: 值班评价导出--高勇提供
 * @param data
 * @return
 */
export const dutyEvaluateExport = (data) => {
    return request('shiftofdutyEvealuation/export', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        responseType: 'blob',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
/**
 * @description: 值班评价导出--高勇提供
 * @param data
 * @return
 */
export const dutyEvaluateExportAll = (data) => {
    return request('shiftofdutyEvealuation/exportAll', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        responseType: 'blob',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

const autoSendOrder = (data) => {
    return request('shiftingOfDuty/exportAllTrackListAsync', {
        type: 'post',
        baseUrlType: 'maintainTeamUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        data,
    });
};
const getExportProgressApi = (data) => {
    return request('shiftingOfDuty/exportProcess', {
        type: 'post',
        baseUrlType: 'maintainTeamUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        data,
    });
};
const fileDownLoadApi = (data) => {
    return request('alarmmodel/filter/v1/filter/export/download', {
        type: 'get',
        baseUrlType: 'alarmModelUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        responseType: 'blob',
        data,
    }).then((res) => {
        let fileName = '';
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        switch (data?.moduleId) {
            case '604':
                fileName = '高铁';
                break;
            case '605':
                fileName = '督办单';
                break;
            default:
                fileName = '';
                break;
        }
        downloadLink.download = `${fileName}派单规则导出${moment().format('YYYYMMDDHHmmss')}.xls`;
        // 触发点击事件执行下载
        downloadLink.click();
    });
};
export { autoSendOrder, getExportProgressApi, fileDownLoadApi };
