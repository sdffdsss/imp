/* eslint-disable no-nested-ternary */
import request from '@Common/api';
import qs from 'qs';
import { _ } from 'oss-web-toolkits';
import convertXml from 'xml-js';
import configUrl from './config_url';
import SessionRegister, { statusBeanDefault } from './sessionRegister';
import { message } from 'antd';

const { rest_export, rest_release, baseUrlRest, rest_regist, rest_recordPage, pretreatment_info, sub_alarm_unicom, db_click_detail, rest_count } =
    configUrl;
const exportEumn = ['CSV', 'EXCEL', 'HTML'];
// 获取业务定制查询菜单
export const getCustomSearchMenuDatas = (userId) => {
    return request(`alarmmodel/query/v1/views?modelId=2&creator=${userId}`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

// 根据moduleId 获取规则数据
const getFilters = (userId, param, type) => {
    const defaultParam = {
        modelId: 2,
        moduleId: type,
        clientRequestInfo: JSON.stringify({
            clientRequestId: 'nomean',
            clientToken: 'string',
        }),
        orderFieldName: 'filterName',
        order: 1,
        creator: userId,
        current: 1,
        pageSize: 99999,
    };
    if (type === 'MY' || type === 'ALL' || type === 'SHARE') {
        defaultParam.moduleId = 1;
    }
    const paramData = _.assignIn(defaultParam, param);
    return request(`alarmmodel/filter/v1/filters?${qs.stringify(paramData, { arrayFormat: 'indices', encode: true })}`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取过滤器数据失败',
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

/**
 * @description: 更改过滤器类型
 */
export const getFilterByType = (userId, type) => {
    let filterType = {};
    switch (type) {
        case 'ALL':
            filterType = {};
            break;
        case 'MY':
            filterType = { needConditionList: 1 };
            break;
        case 'SHARE':
            filterType = { needConditionList: 2 };
            break;
        default:
            filterType = {};
            break;
    }
    return getFilters(userId, filterType, type);
};

// 获取规则的规则条件
export const getRuleConditions = (filterId, moduleId) => {
    return request('alarmmodel/filter/v1/filter', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            modelId: 2,
            moduleId: moduleId === 'MY' || moduleId === 'ALL' || moduleId === 'SHARE' ? 1 : moduleId,
            filterId,
        },
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

/**
 * 获取二次查询字段全量字段
 */
export const getAllOptions = () => {
    return request('alarmmodel/query/v1/allCommonfields', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            modelId: 2,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        },
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

// 获取二次查询字段默认已选字段
export const getDefaultSelectOptions = () => {
    return request('alarmmodel/query/v1/commonfields', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            modelId: 2,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        },
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

// 获取列模板数据
export const getColTempleteDatas = (userId) => {
    return request('v1/template/alarm-column', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            showType: 1,
            userId,
            pageSize: 100000,
            current: 1,
        },
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

// 获取列模板字段信息
export const setColumnsInfo = (xml, leftData, type) => {
    const options = { ignoreComment: true, nativeTypeAttributes: true };
    const xmlData = convertXml.xml2js(xml, options);
    if (type === 'query') {
        const columnsValue = _.get(xmlData, `elements[0].attributes.Columns`, '').toString();
        const columnsWidths = _.get(xmlData, `elements[0].attributes.ColumnWidths`, '').toString();
        if (columnsValue === 0) {
            return {
                queryAlarmColumnDefault: [],
            };
        }
        const columnsValueArr = columnsValue.split('|');
        const columnsWidthsArr = columnsWidths.split('|');
        const showInTableColumns = columnsValueArr.map((item, index) => {
            const field = item.split('#')[0];
            const id = _.find(leftData, (l) => l.field === item.split('#')[0])?.id;
            const name = _.find(leftData, (l) => l.field === field)?.name;
            const alias = item.split('#')[1] || _.find(leftData, (l) => l.field === field)?.name;
            const width = columnsWidthsArr[index] || 120;
            const fieldId = _.find(leftData, (l) => l.field === field)?.fieldId;
            return {
                hideInSearch: true,
                ellipsis: false,
                dataIndex: field,
                key: field,
                id,
                name,
                alias,
                fieldId,
                filters: true,
                onFilter: true,
                width: Number(width),
            };
        });
        const width = showInTableColumns.reduce((total, item) => {
            return total + (Number(item.width) || 120);
        }, 0);
        const columnsStateMap = {};
        showInTableColumns.forEach((element) => {
            columnsStateMap[element.dataIndex] = { show: true };
        });
        return {
            showInTableColumns,
            columnsStateMap,
            width,
        };
    }
    const columnsValue = _.get(xmlData, `elements[0].elements`, []).map((s) => ({
        name: s.name,
        data: _.get(s, `elements[0].attributes.Columns`, '').toString(),
        widths: _.get(s, `elements[0].attributes.ColumnWidths`, '').toString(),
    }));
    const active = _.find(columnsValue, (s) => s.name === 'ActiveBandSetting');
    // eslint-disable-next-line no-underscore-dangle
    const _columnsInfo = (active ? active.data : '').split('|');
    const showInTableColumns = _columnsInfo
        .map((item, index) => {
            const id = _.find(leftData, (l) => l.field === item)?.id;
            const field = item.split('#')[0];
            const name = _.find(leftData, (l) => l.field === item)?.name;
            const alias = item.split('#')[1] || _.find(leftData, (l) => l.field === field)?.name;
            const width = active.widths.split('|')[index] || 120;
            const fieldId = _.find(leftData, (l) => l.field === field)?.fieldId;
            return {
                ellipsis: false,
                hideInSearch: true,
                dataIndex: field,
                key: field,
                name,
                id,
                alias,
                fieldId,
                width: Number(width),
                filters: true,
                onFilter: true,
            };
        })
        .filter((s) => !!s);
    const width = showInTableColumns.reduce((total, item) => {
        return total + (Number(item.width) || 120);
    }, 0);
    const columnsStateMap = {};
    showInTableColumns.forEach((element) => {
        columnsStateMap[element.dataIndex] = { show: true };
    });
    return {
        showInTableColumns,
        columnsStateMap,
        width,
    };
};

// 定制查询保存
export const onOkCustomSearch = (SearchFormItem, type) => {
    if (SearchFormItem.parentFilterId === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete SearchFormItem.parentFilterId;
    }
    return request('alarmmodel/query/v1/view', {
        type: type === 'add' ? 'post' : 'put',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            alarmQueryView: SearchFormItem,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token') ?? 1,
            },
        },
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return null;
        });
};

// 业务定制查询详情接口
export const customSearchDetail = (viewId) => {
    return request('alarmmodel/query/v1/view', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data: {
            viewId,
        },
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return null;
        });
};

// 删除业务定制查询字段
export const delCustomSearch = (viewId, userId) => {
    return request('alarmmodel/query/v1/view', {
        type: 'delete',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data: {
            viewId,
            creator: userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token') ?? 1,
            }),
        },
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return null;
        });
};

export const getAlarmDetail = (alarmKeyList, timeRange) => {
    const registerDetail = () => {
        const newSessionRegister = _.cloneDeep(SessionRegister);
        newSessionRegister.mConditionMaps = {
            alarmIdList: {
                fieldId: 999,
                not: false,
                type: 'in',
                value: '1',
                values: alarmKeyList,
            },
        };
        newSessionRegister.dateBean = {
            startTime:
                timeRange && timeRange.current && timeRange.current.event_time && timeRange.current.event_time[0].format('YYYY-MM-DD HH:mm:ss'),
            fieldId: 62,
            not: false,
            endTime: timeRange && timeRange.current && timeRange.current.event_time && timeRange.current.event_time[1].format('YYYY-MM-DD HH:mm:ss'),
            type: 'type',
        };
        newSessionRegister.fieldIds = [];
        newSessionRegister.sessionId = `${new Date().getTime()}`;
        newSessionRegister.statusBean = {
            activeStatus: 1,
            fieldId: 68,
            not: false,
            status: [],
            type: 'eq',
        };
        return request(rest_regist, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: newSessionRegister,
            baseUrlType: baseUrlRest,
        })
            .then((res) => {
                if (res.status === 'success') {
                    return newSessionRegister.sessionId;
                }
                return false;
            })
            .catch(() => {
                return false;
            });
    };
    const getAlarmDetailBySession = (sessionId) => {
        return request(rest_recordPage, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: {
                pageSize: alarmKeyList.length,
                sessionId,
                startIndex: 0,
            },
            baseUrlType: baseUrlRest,
        })
            .then((res) => {
                if (res.data) {
                    return res.data;
                }
                return [];
            })
            .catch(() => {
                return [];
            });
    };
    return (async () => {
        const registerResult = await registerDetail();
        if (registerResult) {
            const alarmDetail = await getAlarmDetailBySession(registerResult);
            const datas = alarmDetail;
            return datas;
        }
        return [];
    })();
};

export const getPretreatmentInfo = (alarmList) => {
    const data = {
        fp0: alarmList[0].fp0.value,
        fp1: alarmList[0].fp1.value,
        fp2: alarmList[0].fp2.value,
        fp3: alarmList[0].fp3.value,
    };
    return request(pretreatment_info, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
        baseUrlType: baseUrlRest,
    })
        .then((res) => {
            if (res.data) {
                return res.data;
            }
            return '';
        })
        .catch(() => {
            return '';
        });
};

export const getSubAlarm = (record) => {
    const data = {
        alarmId: record?.standard_alarm_id?.value,
        startTime: record?.event_time?.value,
    };
    return request(sub_alarm_unicom, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
        baseUrlType: baseUrlRest,
    })
        .then((res) => {
            if (res.data) {
                return res.data;
            }
            return [];
        })
        .catch(() => {
            return [];
        });
};

export const getDbClickDetail = (alarmList, timeRange) => {
    const data = _.cloneDeep(SessionRegister);
    data.mConditionMaps = {
        alarmIdList: {
            fieldId: 999,
            not: false,
            type: 'in',
            value: '1',
            values: alarmList.map((item) => item.key),
        },
    };
    data.dateBean = {
        startTime: timeRange && timeRange.current && timeRange.current.event_time && timeRange.current.event_time[0].format('YYYY-MM-DD HH:mm:ss'),
        fieldId: 62,
        not: false,
        endTime: timeRange && timeRange.current && timeRange.current.event_time && timeRange.current.event_time[1].format('YYYY-MM-DD HH:mm:ss'),
        type: 'type',
    };
    data.fieldIds = [7, 18, 33, 25, 62, 136, 34, 15, 38, 171, 114, 19, 169, 24, 228, 9, 4, 37, 30, 110];
    data.sessionId = `${new Date().getTime()}`;
    data.statusBean = {
        activeStatus: alarmList[0].active_status.value,
        fieldId: 68,
        not: false,
        status: [],
        type: 'eq',
    };
    return request(db_click_detail, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
        baseUrlType: baseUrlRest,
    })
        .then((res) => {
            if (res.data) {
                return JSON.parse(res.data);
            }
            return [];
        })
        .catch(() => {
            return [];
        });
};

// 获取所有告警列数据
export const getAllColumns = () => {
    return request('v1/alarm/columns', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: {},
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

/**
 * @description: 获取默认列模版
 */
export const getDefaultColumns = (userName) => {
    const queryParam = {
        optionKey: `${userName}.QueryAlarmBandOption`,
    };
    return request('v1/template/search-alarm-column', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: queryParam,
        // 是否需要显示失败消息提醒
        showErrorMessage: '获取默认列模板失败',
        showSuccessMessage: false,
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};
const unRegisterAsync = (sessionId) => {
    if (sessionId === '') {
        return false;
    }
    return request(rest_release, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            sessionId,
        },
        baseUrlType: baseUrlRest,
    })
        .then(() => {})
        .catch(() => {});
};
// 注册
export const register = async (userId, searchParams, showInTableColumns, columns, searchColumns, customDetail, sessionId) => {
    // 注册前先注销
    await unRegisterAsync(sessionId);
    const newSessionRegister = _.cloneDeep(SessionRegister);
    if (searchParams.alarm_origin === undefined || (Array.isArray(searchParams.alarm_origin) && searchParams.alarm_origin.length === 0)) {
        newSessionRegister.alarmOrigin = '0';
    } else {
        newSessionRegister.alarmOrigin = searchParams.alarm_origin;
    }
    newSessionRegister.userId = userId;
    newSessionRegister.sessionId = `${new Date().getTime()}`;
    if (!searchParams.active_status || (Array.isArray(searchParams.active_status) && searchParams.active_status.length === 0)) {
        newSessionRegister.statusBean = statusBeanDefault;
    } else {
        newSessionRegister.statusBean = {
            activeStatus: 1,
            fieldId: 68,
            not: false,
            status: searchParams.active_status,
        };
    }
    const fieldIds = [];
    if (showInTableColumns) {
        showInTableColumns.forEach((item) => {
            if (item.dataIndex !== 'first_column') {
                fieldIds.push(item.fieldId || item.id);
            }
        });
    }

    // 必传 62告警发生时间，68告警清除状态，137省id，33网管告警级别,35网管告警ID,7网元名称,16告警对象名称,30告警标题,116归属设备网元ID
    newSessionRegister.fieldIds = Array.from(new Set(fieldIds.concat([62, 68, 137, 33, 35, 7, 16, 30, 116])));
    newSessionRegister.dateBean = {
        startTime: searchParams.event_time && searchParams.event_time[0].format('YYYY-MM-DD HH:mm:ss'),
        fieldId: 62,
        not: false,
        endTime: searchParams.event_time && searchParams.event_time[1].format('YYYY-MM-DD HH:mm:ss'),
        type: 'type',
    };

    // 'event_time', 'active_status','group_id' 不放一般条件里，
    // 'alarm_origin' 一般条件和特殊条件都不放，直接放alarmOrigin 中
    const conditionList = [];
    const extraArr = ['alarm_origin', 'event_time', 'active_status', 'group_id', 'filter_id', 'filter_type'];
    _.forOwn(searchParams, (value, key) => {
        if (value !== undefined && value !== null && value.length !== 0 && !extraArr.includes(key) && key.indexOf('_condition') === -1) {
            const valueType = _.find(searchColumns, (item) => item.dataIndex === key)?.valueType;
            const dataIndex = _.find(searchColumns, (item) => item.dataIndex === key)?.dataIndex;
            let type = '';
            switch (valueType) {
                case 'dateTimeRange':
                    type = 'between';
                    break;
                case 'enumeration':
                    type = 'in';
                    break;
                case 'enumSingle':
                    type = 'eq';
                    break;
                case 'textAddSelect':
                    type = searchParams[`${key}_condition`];
                    break;
                default:
                    type = 'eq';
                    break;
            }
            if (dataIndex === 'alarm_abnormal_type' || dataIndex === 'is_undistributed_send_status') {
                type = 'eq';
            }
            conditionList.push({
                fieldId: _.find(columns, (item) => item.field === key)?.fieldId,
                not: 'false',
                type,
                values:
                    valueType === 'dateTimeRange'
                        ? [value[0].format('YYYY-MM-DD HH:mm:ss'), value[1].format('YYYY-MM-DD HH:mm:ss')]
                        : Array.isArray(value)
                        ? value
                        : [value],
                value: Array.isArray(value) ? '' : value,
            });
        }
    });
    newSessionRegister.fieldConditions.conditionList = conditionList;

    // 针对特殊条件处理
    // 过滤器查询里面的 过滤器id \ 业务定制查询里面的过滤器id 都需要单独存到mConditionMaps字段中
    _.forOwn(searchParams, (value, key) => {
        if (key === 'filter_id' && Array.isArray(searchParams.filter_id) && searchParams.filter_id.length === 0) {
            newSessionRegister.mConditionMaps = {};
        } else if (key === 'filter_id' && searchParams.filter_id !== undefined) {
            newSessionRegister.mConditionMaps.filterId = {
                fieldId: 999,
                not: false,
                type: 'in',
                value,
                values: [value],
            };
        }
    });
    if (!_.isEmpty(customDetail) && (customDetail.parentFilterId || String(customDetail.parentFilterId) === '0')) {
        newSessionRegister.mConditionMaps.filterId = {
            fieldId: 999,
            not: false,
            type: 'in',
            value: customDetail.parentFilterId,
            values: [customDetail.parentFilterId],
        };
    }
    return request(rest_regist, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: newSessionRegister,
        baseUrlType: baseUrlRest,
    })
        .then((res) => {
            if (res.status === 'success') {
                return newSessionRegister.sessionId;
            }
            return false;
        })
        .catch(() => {
            return false;
        });
};

// 获取规则详情接口
export const getRulesDetails = (moduleId, ruleId) => {
    return request('alarmmodel/filter/v1/filter', {
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: true,
        data: {
            moduleId,
            filterId: ruleId,
            modelId: 2,
        },
        baseUrlType: 'filterUrl',
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

// 列表查询获取告警数据
export const getAlarmCount = (sessionId) => {
    return request(rest_count, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            sessionId,
        },
        baseUrlType: baseUrlRest,
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

// 告警分页查询
export const getAlarmDatas = (startIndex, pageSize, sessionId) => {
    return request(rest_recordPage, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            sessionId,
            pageSize,
            startIndex,
        },
        baseUrlType: baseUrlRest,
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};

const exportAlarmByIds = (showInTableColumns, searchParams, alarmList, exportType) => {
    const registerDetail = () => {
        const newSessionRegister = _.cloneDeep(SessionRegister);
        newSessionRegister.sessionId = `${new Date().getTime()}`;
        if (searchParams.event_time && searchParams.event_time[0] && searchParams.event_time[1]) {
            newSessionRegister.dateBean = {
                startTime: searchParams.event_time && searchParams.event_time[0].format('YYYY-MM-DD HH:mm:ss'),
                fieldId: 62,
                not: false,
                endTime: searchParams.event_time && searchParams.event_time[1].format('YYYY-MM-DD HH:mm:ss'),
                type: 'type',
            };
        }
        if (!searchParams.active_status) {
            newSessionRegister.statusBean = statusBeanDefault;
        } else {
            newSessionRegister.statusBean = {
                activeStatus: 1,
                fieldId: 68,
                not: false,
                status: searchParams.active_status,
            };
        }
        if (searchParams.alarm_origin === undefined) {
            newSessionRegister.alarmOrigin = '0';
        } else {
            newSessionRegister.alarmOrigin = searchParams.alarm_origin;
        }
        const fieldIds = [];
        showInTableColumns.forEach((item) => {
            fieldIds.push(item.fieldId);
        });
        // 必传 62告警发生时间，68告警清除状态，137省id，33网管告警级别,35网管告警ID,7网元名称,16告警对象名称,30告警标题,116归属设备网元ID
        newSessionRegister.fieldIds = Array.from(new Set(fieldIds.concat([62, 68, 137, 33, 35, 7, 16, 30, 116])));
        newSessionRegister.mConditionMaps = {
            alarmIdList: {
                fieldId: 999,
                not: false,
                type: 'in',
                value: '1',
                values: alarmList.map((item) => `${item.fp0.value}_${item.fp1.value}_${item.fp2.value}_${item.fp3.value}`),
            },
        };
        return request(rest_regist, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: newSessionRegister,
            baseUrlType: baseUrlRest,
        })
            .then((res) => {
                if (res.status === 'success') {
                    return newSessionRegister.sessionId;
                }
                return false;
            })
            .catch(() => {
                return false;
            });
    };

    const exportBySession = (sessionIdRes) => {
        const data = {
            capacity: 0,
            exportFormat: exportEumn[exportType],
            pageSize: alarmList.length,
            sessionId: sessionIdRes,
            startIndex: 0,
        };
        return request(rest_export, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data,
            baseUrlType: baseUrlRest,
        })
            .then((res) => {
                return res;
            })
            .catch(() => {
                message.error('导出失败！');
                return false;
            });
    };
    return (async () => {
        const registerResult = await registerDetail();
        if (registerResult) {
            const alarmDetail = await exportBySession(registerResult);
            return alarmDetail;
        }
        return [];
    })();
};

// 告警导出
export const exportAlarm = ({ showInTableColumns, sessionId, searchParams, exportType, alarmList, total }) => {
    if (alarmList && alarmList.length) {
        return exportAlarmByIds(showInTableColumns, searchParams, alarmList, exportType);
    }
    return request(rest_export, {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            capacity: 0,
            exportFormat: exportEumn[exportType],
            pageSize: total <= 100000 ? total : 100000,
            sessionId,
            startIndex: 0,
        },
        baseUrlType: baseUrlRest,
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            message.error('导出失败！');
            return false;
        });
};

// 省市区联动接口
export const getPRCDatas = (provinceId, regionId) => {
    return request('alarmmodel/province/linkage/three', {
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            provinceId,
            regionId,
            clientRequestId: 'nomean',
            clientToken: localStorage.getItem('access_token'),
        },
        baseUrlType: 'filterUrl',
    })
        .then((res) => {
            return res;
        })
        .catch(() => {
            return false;
        });
};
