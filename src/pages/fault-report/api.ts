import request from '@Common/api';
import moment from 'moment';
// import qs from 'qs';

/**
 * @description: 获取省份信息
 * @param {*}
 * @return {*}
 */
export const getProvinceList = (data) => {
    return request('group/findProvinces', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取省份数据失败',
        showSuccessMessage: false,
        data,
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

/**
 * @description: 获取地市信息
 * @param {*}
 * @return {*}
 */
export const getRegionList = (data) => {
    return request('group/findProvinceRegions', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取地市信息数据失败',
        showSuccessMessage: false,
        data,
    });
};
/**
 * @description: 获取地市所属省的地市列表
 * @param {*}
 * @return {*}
 */
export const getCityParentRegionList = (data) => {
    return request('api/zones', {
        type: 'get',
        baseUrlType: 'userMangeUrl',
        showErrorMessage: '获取地市信息数据失败',
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取故障上报级别枚举
 * @param {*}
 * @return {*}
 */
export const getReportLevelList = (data) => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: '获取故障上报级别枚举数据失败',
        showSuccessMessage: false,
        data: {
            dictName: 'fault_level',
            ...data,
        },
    });
};

/**
 * @description: 获取故障是否影响业务枚举
 * @param {*}
 * @return {*}
 */
export const getIsEffectBusinessList = (data) => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: '获取故障上报是否影响业务枚举数据失败',
        showSuccessMessage: false,
        data: {
            dictName: 'is_effect',
            ...data,
        },
    });
};
/**
 * @description: 获取专业枚举
 * @param {*}
 * @return {*}
 */
export const getMajorTypeList = (data) => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: '获取专业枚举数据失败',
        showSuccessMessage: false,
        data: {
            dictName: 'fault_specialty',
            ...data,
        },
    });
};
/**
 * @description: 获取子专业枚举
 * @param {*}
 * @return {*}
 */
export const getSubMajorTypeList = (data) => {
    const { parentId } = data;
    if (parentId === undefined) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: '获取子专业枚举数据失败',
        showSuccessMessage: false,
        data: {
            dictName: 'fault_sub_specialty',
            parentId,
        },
    });
};

/**
 * @description: 获取故障类别枚举
 * @param {*}
 * @return {*}
 */
export const getEquipmentTypeList = (data) => {
    const { parentId } = data;
    if (parentId === undefined) {
        return Promise.resolve([]);
    }
    // eslint-disable-next-line consistent-return
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取故障类别枚举数据失败',
        data: {
            dictName: 'fault_class',
            parentId,
        },
    });
};

/**
 * @description: 获取最新上报类型枚举
 * @param {*}
 * @return {*}
 */
export const getReportTypeList = (data) => {
    return request('group/findProvinceRegions', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: '获取最新上报类型枚举数据失败',
        showSuccessMessage: false,
        data,
    });
};

/**
 * @description: 获取故障上报管理列表数据
 * @param {*}
 * @return {*}
 */
export const getFaultReportList = (data) => {
    return request('faultReport/queryReportByCondition', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 导出故障上报管理列表数据
 * @param {*}
 * @return {*}
 *
 * !! 弃用
 */
export const exportFaultReportList = (data) => {
    return request('faultReport/exportReportByCondition', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        responseType: 'blob',
        data: {
            ...data,
        },
    });
};

/**
 * @description: 删除单条故障上报
 * @param {*}
 * @return {*}
 */
export const deleteFault = (data) => {
    return request('faultReport/deleteReport', {
        type: 'delete',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        params: {
            ...data,
        },
    });
};

/**
 * @description: 获取故障上报管理详情
 * @param {*}
 * @return {*}
 */
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

/**
 * @description: 下载附件
 * @param {*}
 * @return {*}
 */

export const downloadByEmosAnnex = (data) => {
    return request(`faultReport/dowloadFile`, {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        responseType: 'blob',
    });
};

/**
 * @description: 击续报查询所有上报信息
 * @param {*}
 * @return {*}
 */

export const getAllReportList = (data) => {
    return request('faultReport/queryAllReportList', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 首次上报
 * @param {*}
 * @return {*}
 */

export const firstReport = (data) => {
    return request('faultReport/firstReport', {
        type: 'put',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 首次上报-故障上报
 * @param {*}
 * @return {*}
 */

export const faultFirstReport = (data) => {
    return request('faultReportProcess/firstReport', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 首报审核
 * @param {*}
 * @return {*}
 */

export const firstReportApprove = (data) => {
    return request('faultReportProcess/firstReportReview', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 首报审核-直接通过
 * @param {*}
 * @return {*}
 */

export const firstReportDirectReview = (data) => {
    return request('faultReportProcess/firstReportDirectReview', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 首报修改
 * @param {*}
 * @return {*}
 */

export const firstReportEdit = (data) => {
    return request('faultReportProcess/firstReportUpdate', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 续报
 * @param {*}
 * @return {*}
 */

export const continueReport = (data) => {
    return request('faultReport/continueReport', {
        type: 'put',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 续报审核/终报审核
 * @param {*}
 * @return {*}
 */

export const continueReportApprove = (data) => {
    return request('faultReportProcess/continueReportReview', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 续报/终报审核-直接通过
 * @param {*}
 * @return {*}
 */

export const continueReportDirectReview = (data) => {
    return request('faultReportProcess/continueReportDirectReview', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 续报修改/终报修改
 * @param {*}
 * @return {*}
 */

export const continueReportUpdate = (data) => {
    return request('faultReportProcess/continueReportUpdate', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

export const getDeptsInfo = (data) => {
    return request('api/depts', {
        type: 'get',
        baseUrlType: 'userMangeUrl',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

// 上传文件
export const fileUpload = (data) => {
    return request('faultReport/uploudFile', {
        type: 'post',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除文件
export const fileDelete = (data) => {
    return request('faultReport/deleteFile', {
        type: 'delete',
        baseUrlType: 'fault',
        showErrorMessage: false,
        showSuccessMessage: false,
        params: data,
    });
};

// 获取上报状态枚举
export const getFaultReportStatusList = (data) => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: '获取上报状态枚举数据失败',
        showSuccessMessage: false,
        data: {
            dictName: 'fault_report_status',
            ...data,
        },
    });
};

// 获取工单
export const getViewItemData = (data) => {
    return request('work/sheet/v1/getViewItemData', {
        type: 'post',
        baseUrlType: 'failureSheetUrl',
        showErrorMessage: '关联工单查询失败',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

// 获取原始告警数
export const getOriginalAlarmCount = (data) => {
    return request('sysadminAlarm/originalAlarmCount', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: '获取原始告警数失败',
        showSuccessMessage: false,
        params: {
            ...data,
        },
    });
};

// 告警导出
export const exportAlarm = (data) => {
    return request('largeScreen/exportToDoTaskDetailMap', {
        type: 'post',
        baseUrlType: 'filter',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        data,
    });
};

// 获取自动上报的关联工单信息
export const getAutoFpWorkSheets = (data) => {
    return request('faultReport/reportOperateInit', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '初始化关联工单信息失败',
        data,
    });
};

/**
 * 根据专业获取默认用户组下用户信息
 * @param data.specialtyId 专业id
 * @returns
 */
export const getUsersBySpecialtyList = async (data: { specialtyId: any }) => {
    try {
        const res = await request(`api/user/groups/${data.specialtyId}/usersBySpecialty`, {
            type: 'get',
            baseUrlType: 'userInfolUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取默认用户组下用户信息失败',
            // data,
        });

        /**
         * - 服务端的接口与故障上报接口返回的字段不一致，前端在这里统一
         * - originData 是服务端的原始数据
         */
        return {
            ...res,
            originData: res.data,
            data: res.data
                ?.map((d) => {
                    return {
                        ...d,
                        provinceIds: d.zoneId,
                        provinceNames: d.zoneName,
                    };
                })
                .filter((item) => !!item.userMobile),
        };
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @description: 获取光缆段枚举
 * @param {*}
 * @return {*}
 */
export const getCableSectionList = (data) => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showErrorMessage: ' 获取光缆段枚举数据失败',
        showSuccessMessage: false,
        data: {
            dictName: 'fault_trunk_cable',
            ...data,
        },
    });
};

/**
 * @description: 获取故障影响业务详情列表数据
 * @param {*}
 * @return {*}
 */
export const getFailureBusinessDetailsList = (data) => {
    return request('fiberOpticTrunkCable/businessDetail', {
        type: 'post',
        baseUrlType: 'filter',
        showErrorMessage: ' 获取故障影响业务详情列表数据失败',
        showSuccessMessage: false,
        data,
    });
};
/**
 * @description 点击生命周期箭头
 * @param {Object} data { flagId,Type }type---1取消上报节点  ---2故障通知节点
 * @return {*}
 */
export const getFaultLifeCycle = (data): any => {
    return request('faultReport/getFaultLifeCycle', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取列表数据失败',
        data,
    });
};

// 首保校验
export const validateReport = (data): any => {
    return request('faultReport/validateRelationAlarm', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取列表数据失败',
        data,
    });
};

// 导出
export const faultReportExport = (data): any => {
    return request('faultReport/export/report', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取列表数据失败',
        data,
    });
};

// 导出进度
export const getProcessApi = (data): any => {
    return request('/faultReport/export/getProcess', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取列表数据失败',
        data,
    });
};
// 下载
export const exportDownloadApi = (data): any => {
    return request('/faultReport/export/download', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取列表数据失败',
        responseType: 'blob',
        data,
    }).then((res) => {
        console.log(res);
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // 兼容不同浏览器的URL对象
        // @ts-ignore
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = `故障导出${moment().format('YYYYMMDDHHmmss')}.xls`;
        // 触发点击事件执行下载
        downloadLink.click();
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

/**
 * @description: 获取通知人员角色等信息
 * @param {*}
 * @return {*}
 */
export const getFaultUsers = (data) => {
    return request('api/fault/role/usersBatch', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 根据告警ID获取上报规则基础信息
 * @param {*}
 * @return {*}
 */
export const getFaultReportDerivedRule = (data) => {
    return request('faultReportDerivedRule/getFaultReportDerivedRuleByStandardAlarmId', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 根据告警ID获取上基础信息
 * @param {*}
 * @return {*}
 */
export const queryDetailByAlarmId = (data) => {
    return request('faultReportProcess/queryDetailByAlarmId', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 根据告警查询上报模板
 * @param {*}
 * @return {*}
 */
export const queryRuleConfigReportInfo = (data) => {
    return request('faultReportProcess/queryRuleConfigReportInfo', {
        type: 'post',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};

/**
 * @description: 根据告警ID获取上报规则基础信息
 * @param {*}
 * @return {*}
 */
export const getManualReportDerivedRuleNotificationSetting = (data) => {
    return request('faultReportDerivedRule/getManualReportDerivedRuleNotificationSetting', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        data: {
            ...data,
        },
    });
};
