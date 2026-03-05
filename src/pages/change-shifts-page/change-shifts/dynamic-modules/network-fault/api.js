import request from '@Src/common/api';
/**
 * @description: 更新故障记录通过id
 * @param {*}
 * @return {*}
 */
const updateFaultSheet = (data) => {
    return new Promise((reslove) => {
        request('faultRecord/update', {
            type: 'POST',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};
/**
 * @description: 遗留保存接口
 * @param {*}
 * @return {*}
 */
const saveRemainState = (data) => {
    return new Promise((reslove) => {
        request('faultRecord/saveRemainState', {
            type: 'POST',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};
/**
 * @description: 网络故障列表
 * @param {*}
 * @return {*}
 */
const getTaskDetail = (data) => {
    return new Promise((reslove) => {
        request('dutyManager/networkWorkSheetTable', {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};
/**
 * @description: 删除工单
 * @param {*}
 * @return {*}
 */
const deleteFaultSheet = (data) => {
    return new Promise((reslove) => {
        request(`faultRecord/updateAsDeleteById?id=${data.id}&groupId=${data.groupId}&operator=${data.operator}&dataProvince=${data.dataProvince}`, {
            type: 'delete',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
        }).then((res) => {
            reslove(res);
        });
    });
};

const getSelectCardTypeList = (dictNames) => {
    return request('dict/getDictByFieldNames', {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data: dictNames,
    });
};

const getSupplementOrderApi = (dictNames) => {
    return request('dutyManager/supplementWorkSheetTable', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: '获取数据失败',
        showSuccessMessage: false,
        data: dictNames,
    });
};

/**
 * @description: 值班管理工单遗留
 * @param {*}
 * @return {*}
 */
const sheetStay = (data) => {
    return request('dutyManager/handLeaveOverToDuty', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

const getSelectedTab = (data) => {
    return request('dutyManager/getNetworkorkSheetTableSwitch', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

const setSelectedTab = (data) => {
    return request('dutyManager/setNetworkorkSheetTableSwitch', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

export default {
    getTaskDetail,
    updateFaultSheet,
    deleteFaultSheet,
    getSupplementOrderApi,
    sheetStay,
    saveRemainState,
    getSelectCardTypeList,
    getSelectedTab,
    setSelectedTab,
};
