import request from '@Src/common/api';
import selectedModuleByGroupConverter from './converters/getSelectedModuleByGroup';

/**
 * @description: 登录人员交接班状态
 * @param {*}
 * @return {*}
 */
const getShiftingOfDutyStatus = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/status', {
            type: 'get',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 交班操作
 * @param {*}
 * @return {*}
 */
const shiftingOfDutyHandOver = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/handOver', {
            type: 'PUT',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 交班校验
 * @param {*}
 * @return {*}
 */
const checkHandSubmit = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/checkHandSubmit', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 接班操作
 * @param {*}
 * @return {*}
 */
const shiftingOfDutyTakeOver = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/takeOver', {
            type: 'PUT',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 接班校验
 * @param {*}
 * @return {*}
 */
const checkTakeSubmit = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/checkTakeSubmit', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 查询当前页面的详情
 * @param {*}
 * @return {*}
 */
const queryShiftingOfDutyNow = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/queryShiftingOfDutyNow', {
            type: 'GET',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 保存值班信息 保存后调用
 * @param {*}
 * @return {*}
 */
const saveDutyMessage = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/saveDutyMessage', {
            type: 'PUT',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 上传附件 保存先调用
 * @param {*}
 * @return {*}
 */
const uploudFile = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/uploudFile', {
            type: 'POST',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 下载附件
 * @param {*}
 * @return {*}
 */
const downloadFile = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/dowloadFile', {
            type: 'GET',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
            responseType: 'blob',
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 删除值班记录
 * @param {*}
 * @return {*}
 */
const deleteDutyMessage = (data) => {
    return new Promise((reslove) => {
        request('shiftingOfDuty/deleteDutyMessage', {
            type: 'PUT',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 故障记录操作历史查询
 * @param {*}
 * @return {*}
 */
const faultOperateHistoryList = (data) => {
    return request('faultOperateHistory/pageList', {
        type: 'POST',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 故障记录操作历史查询-专业字典查询
 * @param {*}
 * @return {*}
 */
const professionDic = (dicKey) => {
    //
    return request('/dict/getDictByFieldNames', {
        type: 'POST',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data: [dicKey],
    });
};

/**
 * @description: 获取班组关联的组件模块信息
 * @param {*}
 * @return {*}
 */
const getSelectedModuleByGroup = (data) => {
    return request('group/getSelectedModuleByGroup', {
        type: 'POST',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    }).then((res) => {
        return selectedModuleByGroupConverter(res);
    });
};

/**
 * @description: 获取班组关联的组件模块信息
 * @param {*}
 * @return {*}
 */
const getPreviousShiftSummaryData = (data) => {
    return request('/previousShiftSummary', {
        type: 'GET',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 值班管理工单遗留
 * @param {*}
 * @return {*}
 */
const sheetStay = (data) => {
    return request('dutyManager/handLeaveOver', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 连续交接班-根据账号获取人员信息
 * @param {*}
 * @return {*}
 */
const postPersonInfo = (data) => {
    return request('shiftingOfDuty/getUserByLoginId', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 连续交接班-获取下一班次的人员信息
 * @param {*}
 * @return {*}
 */
const postNextClassesInfo = (data) => {
    return request('shiftingOfDuty/getNextShiftOfDutyUser', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 连续交接班-连续性接班保存功能
 * @param {*}
 * @return {*}
 */
const postChangeShiftsSave = (data) => {
    return request('shiftingOfDuty/continuityTakeOver', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 连续交接班-获取短信验证码
 * @param {*}
 * @return {*}
 */
const postSMSCode = (data) => {
    return request('api/mobile/verify', {
        type: 'post',
        baseUrlType: 'userMangeUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 连续交接班-验证短信验证码
 * @param {*}
 * @return {*}
 */
const putSMSCode = (data) => {
    return request('api/mobile/verify', {
        type: 'put',
        baseUrlType: 'userMangeUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 获取当前省市下班组列表
 * @param {*}
 * @return {*}
 */
const findGroupsByUser = (data) => {
    return request('group/findGroupWithWorkShiftList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 为当前人员查找班组内可接班的班次并加入班次
 * @param {*}
 * @return {*}
 */
const findWorkShiftForGroupTake = (data) => {
    return request('shiftingOfDuty/findWorkShiftForGroupTake', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 交接班打卡接口
 * @param {*}
 * @return {*}
 */
const handOrTakePunchCard = (data) => {
    return request('shiftingOfDuty/punchCard', {
        type: 'put',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });
};

/**
 * @description: 校验是否可保存值班信息 该班次交班后不可保存
 * @param {*}
 * @return {*}
 */
const checkSaveDutyMessage = (data) => {
    return request('shiftingOfDuty/checkSaveDutyMessage', {
        type: 'PUT',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

// 获取归属省份
const getProvinceData = (userId) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取省份数据失败',
        data: {
            creator: userId,
        },
    });
};

// 删除工作记录附件
const deleteFile = (params) => {
    return request('shiftingOfDuty/deleteFile', {
        type: 'DELETE',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        params,
    });
};
// 导出记录
const exportDutyRecord = (params) => {
    return request('shiftingOfDuty/exportDutyContentInfo', {
        type: 'GET',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        responseType: 'blob',
        params,
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
export const findGroupByCenter = (params) => {
    return request('networkCutoverInfo/findGroupByCenter', {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};
export default {
    getShiftingOfDutyStatus,
    shiftingOfDutyHandOver,
    shiftingOfDutyTakeOver,
    queryShiftingOfDutyNow,
    checkHandSubmit,
    checkTakeSubmit,
    saveDutyMessage,
    uploudFile,
    downloadFile,
    deleteDutyMessage,
    faultOperateHistoryList,
    professionDic,
    getSelectedModuleByGroup,
    getPreviousShiftSummaryData,
    sheetStay,
    postPersonInfo,
    postNextClassesInfo,
    postChangeShiftsSave,
    postSMSCode,
    putSMSCode,
    findGroupsByUser,
    findWorkShiftForGroupTake,
    handOrTakePunchCard,
    checkSaveDutyMessage,
    getProvinceData,
    deleteFile,
    exportDutyRecord,
    getTaskDetail,
};
