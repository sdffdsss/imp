import request from '@Common/api';
import useLoginInfoModel from '@Src/hox';

class ServiceApi {
    getDataList = (data) => {
        if (!data) {
            return null;
        }
        return request('faultReportDerivedRule/getFaultReportDerivedRuleList', {
            type: 'post',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            showErrorMessage: true,
            data,
        });
    };
    enableFaultReportDerivedRule = (data) => {
        if (!data) {
            return null;
        }
        return request('faultReportDerivedRule/enableFaultReportDerivedRule', {
            type: 'post',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            showErrorMessage: true,
            data,
        });
    };
    disableFaultReportDerivedRule = (data) => {
        if (!data) {
            return null;
        }
        return request('faultReportDerivedRule/disableFaultReportDerivedRule', {
            type: 'post',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            showErrorMessage: true,
            data,
        });
    };
    getFaultReportDerivedRuleConfig = (data) => {
        if (!data) {
            return null;
        }
        return request('faultReportDerivedRule/getFaultReportDerivedRuleConfig', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            showErrorMessage: true,
            data,
        });
    };
    updateFaultReportDerivedRuleConfig = (data) => {
        if (!data) {
            return null;
        }
        return request('faultReportDerivedRule/updateFaultReportDerivedRuleConfig', {
            type: 'post',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            showErrorMessage: true,
            data,
        });
    };
    getDictList = (val) => {
        return request('dict/queryDict', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            defaultErrorMessage: '获取角色列表失败',
            data: {
                dictName: val,
            },
        });
    };
    getNoticeTemplateList = (data) => {
        return request('faultReport/queryTemplate', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            defaultErrorMessage: '获取角色列表失败',
            data,
        });
    };
    
    // 获取短信模板字段变量
    getSmsTemplateFields = (data) => {
        return request('serviceDiscovery/cloud.alarm.model.define/alarmmodel/filter/v1/filter/smsfields', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            defaultErrorMessage: '获取模板字段失败',
            data,
        });
    };
    
    // 用户选择相关API
    getUserGroupList = ({ zoneId, zoneLevel }) => {
        return request('api/user/groups/list', {
            type: 'get',
            baseUrlType: 'userMangeUrl',
            showSuccessMessage: false,
            data: {
                zone_id: zoneId,
                zone_level: zoneLevel,
            },
        });
    };

    getProvinceList = (userId) => {
        return request(`api/users/${userId}/mgmt/zonesAndGroup`, {
            type: 'get',
            baseUrlType: 'userMangeUrl',
            showSuccessMessage: false,
            data: {},
        });
    };

    getUserTableData = (groupId) => {
        if (!groupId) {
            return Promise.resolve({});
        }
        return request(`api/user/groups/${groupId}/pageUsers`, {
            type: 'get',
            baseUrlType: 'userMangeUrl',
            showSuccessMessage: false,
            data: {
                pageSize: 999999,
                pageNum: 1,
            },
        });
    };

    // 获取手工上报衍生规则通知人设置
    getManualReportDerivedRuleNotificationSetting = (data) => {
        if (!data) {
            return null;
        }
        return request('faultReportDerivedRule/getManualReportDerivedRuleNotificationSetting', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取通知设置失败',
            data,
        });
    };

    // 保存或更新手工上报规则通知设置
    saveOrUpdateManualReportDerivedRuleNotificationSetting = (data) => {
        if (!data) {
            return null;
        }
        return request('faultReportDerivedRule/saveOrUpdateManualReportDerivedRuleNotificationSetting', {
            type: 'post',
            baseUrlType: 'fault',
            showSuccessMessage: true,
            showErrorMessage: true,
            successMessage: '保存成功',
            defaultErrorMessage: '保存失败',
            data,
        });
    };
}
export const Api = new ServiceApi();
