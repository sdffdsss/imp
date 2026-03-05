import request from '@Common/api';
import moment from 'moment';

export const getUserInfo = (userId: string) => {
    return request(`api/users/${userId}/deptAndTitle`, {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
export const getReportCount = (data) => {
    return request('faultReport/getReportSpecialtyCount', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data,
    });
};

export const getSubCount = (data) => {
    return request(`faultReport/getReportFailureClassCount`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getCardsList = (data) => {
    return request(`faultReport/getReportDetails`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const findGroupByUser = (data) => {
    return request('schedule/findGroupByUser', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取自动通报设置树
export const queryReportSettingTree = (data) => {
    return request('faultReport/queryReportSettingTree', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取当前用户声光配置
export const getLightSetting = (data) => {
    return request(`v1/voiceLightSet/${data}`, {
        type: 'get',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
// 获取当前用户声光配置
export const saveLightSetting = (data) => {
    return request('v1/voiceLightSet', {
        type: 'post',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取在线省份数据
export const getOnlineProvinceData = (data = {}) => {
    return request('api/online/province', {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取自动通报设置
export const queryReportSetting = (data) => {
    return request('faultReport/queryReportSetting', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 新增或修改故障通知设置配置
export const saveOrUpdateReportSetting = (data) => {
    return request('faultReport/saveOrUpdateReportSetting', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 是否当班
export const getShiftingOfDutyStatus = (data) => {
    return request('shiftingOfDuty/status', {
        type: 'get',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 是否故障上报人员分配的账号
export const getFaultReportUserRole = () => {
    return request('api/fault/role/user', {
        type: 'get',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {},
    });
};
export const clearInfos = (data) => {
    return request('faultReport/reportRead', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 确认用户是否在值班班组
export const judgeOnDuty = (data) => {
    return request('group/findGruopUserList', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

// 获取待办数量
export const getTodoCountApi = (data) => {
    return request('faultReportProcess/getFaultReportProcessCount', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

// 获取监控中心角色
export const getMonitorCenterRole = (data) => {
    return request('v1/monitor-center/getMonitorCenterRole', {
        type: 'get',
        baseUrlType: 'ruleBaseUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
// 获取故障上报角色名称
export const getFaultReportRoleTypeName = () => {
    return request('faultReportProcess/getFaultReportRoleTypeName', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: false,
    });
};

// 获取光缆详情弹窗列表
export const getOpticalCableDetailsList = (data) => {
    return request('fiberOpticTrunkCable/queryOneLine', {
        type: 'post',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取故障涉及数统计
export const getFaultInvolveCount = (data) => {
    return request('faultReport/getFaultInvolveCount', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 获取地图打点信息
export const getFaultEquipmentInfo = (data) => {
    return request('faultReport/getFaultEquipmentInfo', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 取消上报
export const cancelFaultInfo = (data) => {
    return request('faultReport/cancelReport', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取所有专业
export const getProfessionalListApi = (data) => {
    return request('faultReport/getReportSpecialtyCount', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
export const checkUserNameInCeneterApi = (data) => {
    return request('group/checkUserNameInCeneter', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 同步集中存档
export const syncCentralizationApi = (params) => {
    return request(`faultReport/syncCentralization`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    });
};

// 获取大区下省份
export const getZones = (data) => {
    return request('/api/zones', {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};

export const confirmReport = (data) => {
    return request('faultReportProcess/reportUpdateDirectReview ', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};
export const confirmNomralReport = (data) => {
    return request('faultReportProcess/reportDirectReview ', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};

export const getCardBtnList = (data) => {
    return request('faultReportProcess/getFaultReportButtonPermission ', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};

export const getFaultReportDetail = (data) => {
    return request('faultReport/queryReportDetail', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            modelId: 2,
            ...data,
        },
    });
};

export const getManualReportDerivedRuleConfig = (data) => {
    return request('faultReportDerivedRule/getManualReportDerivedRuleConfig', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const getOnDutyUserByProvinceId = (data) => {
    return request('schedule/getOnDutyUserByProvinceId', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
