import { _ } from 'oss-web-toolkits';
import { valueTypeMap } from '../convert/valueType';
import { customQuery } from '../../config/config_searchForm';
import commonField from '../../config/config_searchCommon';
import request from '@Common/api';

/**
 * 获取定制全量表单项
 */
export function getAllOptions() {
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
    }).then((res) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
            const _allOptions = res.data
                .filter((f) => !(f?.fieldName?.includes('#') ?? false))
                .map((item, index) => {
                    const { filedAlias, fieldName, dataType, enumName, defaultValue = 'test' } = item;
                    return {
                        id: index + 1,
                        name: filedAlias,
                        field: fieldName,
                        defaultValue,
                        dataType,
                        enumName,
                    };
                });
            return _allOptions;
        }
        return [];
    });
}
export function getDefaultOptions() {
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
    }).then((res) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
            const _allOptions = res.data
                .filter((f) => !(f?.fieldName?.includes('#') ?? false))
                .map((item, index) => {
                    const { filedAlias, fieldName, dataType, enumName, defaultValue = 'test' } = item;
                    return {
                        id: index + 1,
                        name: filedAlias,
                        field: fieldName,
                        defaultValue,
                        dataType,
                        enumName,
                    };
                });
            return _allOptions;
        }
        return [];
    });
}
/**
 *  获取业务查询菜单
 * @param {查询条件的全量配置} searchConfig
 * @returns 获取已有业务报表配置，返回业务查询菜单
 */
export function getSearchForm(searchConfigAll, userId) {
    const searchConfig = searchConfigAll[0];
    let startIndex = searchConfigAll.length + 1;
    // const SearchFormDiyConfig = [
    //     {
    //         tab: '业务查询报表1',
    //         menuOptions: ['del', 'edit'],
    //         columns: [{ dataIndex: 'event_time' }, { dataIndex: 'eqp_label' }],
    //     },
    //     { tab: '业务查询报表2', menuOptions: ['del', 'edit'], columns: [{ dataIndex: 'active_status' }] },
    // ];
    // setSearchFormDiy(SearchFormDiyConfig);
    // columnTemplateId: null;
    // columnTemplateName: null;
    // createTime: null;
    // creator: '1';
    // creatorName: 'dxh';
    // fieldList: null;
    // isExport: null;
    // modelId: 2;
    // modifyTime: null;
    // otherFieldList: null;
    // parentFilterId: null;
    // parentFilterName: null;
    // viewDesc: null;
    // viewId: 1304861891;
    // viewName:
    return request(`alarmmodel/query/v1/views?modelId=2&creator=${userId}`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {},
    })
        .then((res) => {
            const _diysConfig =
                res?.data?.map((item) => {
                    const { creator, viewName, viewId, viewDesc = '', isExport = false } = item;
                    const searchConfigCloned = _.cloneDeep(searchConfig);
                    const diyItem = {
                        desc: decodeURI(viewDesc),
                        exportFlag: isExport,
                        exportPeriod: 'week',
                        id: viewId,
                        tab: decodeURI(viewName),
                        userId: creator,
                    };
                    return {
                        ...searchConfigCloned,
                        ...diyItem,
                        key: startIndex++,
                        columns: [],
                        queryType: 'customQuery',
                        config: {
                            search_colNum: 3,
                            search_labelWidth: '100',
                            ...customQuery,
                        },
                    };
                }) ?? [];
            return _diysConfig;
        })
        .catch(() => {
            return [];
        });
    // const _diysConfig = JSON.parse(localStorage.getItem('SearchFormDiyConfig'));
    // if (!_diysConfig) {
    //     return [];
    // }
    // const diysConfig = _diysConfig.map((diyItem) => {
    //     const columnsFilter = diyItem.columns.map(({ dataIndex: key, dataIndex, dataType, defaultValue, enumName, name: title }, index) => {
    //         return {
    //             key,
    //             dataIndex,
    //             dataType,
    //             defaultValue: {
    //                 value: switchDefaultValue(defaultValue),
    //             },
    //             fieldEnum: enumName,
    //             showOperator: true,
    //             title,
    //         };
    //     });
    //     const searchConfigCloned = _.cloneDeep(searchConfig);
    //     return { ...searchConfigCloned, ...diyItem, key: startIndex++, columns: columnsFilter, queryType: 'customQuery' };
    // });
    // return diysConfig;
}
/**
 * 新增业务查询配置接口
 * @param {} SearchFormItem
 * @returns 新增结果
 */
export async function addSearchFormDiy(SearchFormItem) {
    if (SearchFormItem.parentFilterId === undefined) {
        delete SearchFormItem.parentFilterId;
    }
    return request('alarmmodel/query/v1/view', {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            alarmQueryView: SearchFormItem,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token') ?? 1,
            },
        },
    }).then((res) => {
        return [];
    });
}
/**
 * 更新业务查询配置接口
 * @param {} SearchFormItem
 * @returns 更新结果
 */
export async function updateSearchFormDiy(SearchFormItem) {
    if (SearchFormItem.parentFilterId === undefined) {
        delete SearchFormItem.parentFilterId;
    }
    return request('alarmmodel/query/v1/view', {
        type: 'put',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            alarmQueryView: SearchFormItem,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token') ?? 1,
            },
        },
    }).then(() => {
        return [];
    });
}
/**
 *  删除指定业务查询
 * @param {要删除的业务查询Tab} tabName
 * @returns 删除结果
 */
export async function delSearchFormDiy(viewId, userId) {
    return request('alarmmodel/query/v1/view', {
        type: 'delete',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token') ?? 1,
            }),
            // requestInfo: {
            //     clientRequestId: 'nomean',
            //     clientToken: localStorage.getItem('access_token') ?? 1,
            // },
            creator: userId,
            viewId,
        },
    });
}
/**
 * 视图详情查询请求
 * @param {*} viewId
 * @returns
 */
function getViewDetail(viewId) {
    return request(`alarmmodel/query/v1/view?viewId=${viewId}`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
    });
}

const getInitialProvince = (province, userInfo) => {
    const info = userInfo && JSON.parse(userInfo);
    let initialProvince = info.zones[0]?.zoneId;
    if (province) {
        return (initialProvince = province);
    }
    if (info.zones[0]?.zoneLevel === '3') {
        initialProvince = info.zones[0]?.parentZoneId;
    }
    return initialProvince;
};

/**
 * 查询视图详情
 * @param {*} viewId
 */
export async function customQueryDetail(viewId, login) {
    const origin = await getViewDetail(viewId);
    const originList = origin?.data?.fieldList ?? [];
    originList.sort((a, b) => a.orderField - b.orderField);
    const PromiseAll = originList.filter((item) => item.isEnum === 1 && item.enumName).map(({ enumName }) => getEntry(enumName));
    const enumNameAll = await Promise.allSettled(PromiseAll);
    console.log(enumNameAll);
    const columns = originList.map((field) => {
        const { fieldName: key, fieldName: dataIndex, filedAlias: title, isEnum, dataType, enumName } = field;
        let column = { key, dataIndex, title, valueType: valueTypeMap(isEnum, dataType, dataIndex) };
        if (isEnum === 1 && enumName) {
            const dictArr = enumNameAll.find((e) => (e?.value?.data?.[0]?.dictName ?? '-1') === enumName) ?? [];
            let fieldEnum = dictArr?.value?.data.map((dict) => {
                return { key: dict.key, value: dict.value };
            });
            if (dictNMame === 'province_id') {
                fieldEnum = fieldEnum.filter((item) => getInitialProvince(login?.systemInfo?.currentZone?.zoneId, login?.userInfo) === item.key);
            }
            column.fieldEnum = fieldEnum;
        }
        if (dataIndex === 'event_time') {
            column.defaultValue = {
                value: ['yesterday', 'today'],
            };
        }
        //关联查询配置和通用查询同步
        if (dataIndex === 'alarm_origin') {
            column = commonField.get(dataIndex);
        } else {
            column.valueType === 'enumeration' && (column.fieldMode = 'multiple');
        }
        return column;
    });
    return { columns, customFilterId: origin?.data?.parentFilterId ?? -1, columnTemplateId: origin?.data?.columnTemplateId ?? -1 };
}
export function getEntry(enumName, userId = 1) {
    return request(`alarmmodel/field/v1/dict/entry`, {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        data: {
            pageSize: 2500,
            dictName: enumName,
            modelId: 2,
            creator: userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        },
    });
}
// function setSearchFormDiy(SearchFormDiyConfig) {
//     localStorage.removeItem('SearchFormDiyConfig');
//     SearchFormDiyConfig.sort((a, b) => {
//         return a.id - b.id;
//     });
//     localStorage.setItem('SearchFormDiyConfig', JSON.stringify(SearchFormDiyConfig));
// }

export async function getViewInfoForEdit(viewId) {
    const origin = await getViewDetail(viewId);
    const validata = origin.data;
    validata.fieldList = validata?.fieldList?.map((other, index) => {
        const { filedAlias, fieldName } = other;
        return {
            id: index + 1,
            name: filedAlias,
            field: fieldName,
        };
    });
    //
    return validata;
    // "columnTemplateId": 0,  //引用的列模板ID
    // "columnTemplateName": "string", //引用的列模板名称
    // "createTime": "2021-04-23T03:43:21.051Z", //创建时间
    // "creator": "string",  //创建人ID
    // "creatorName": "string",//创建人名称
    // "fieldList": [  //已经选中的视图条件
    //   {
    //       "dataType": "string",  //数据类型
    //       "enumName": "string", //枚举字段名称
    //       "fieldName": "string",  //告警字段英文名
    //       "filedAlias": "string", //字段别名（中文名）
    //       "isEnum": 0  //是否枚举，1：是，2：否
    //   }
    // ],
    // "isExport": 0,  //是否可导出,1：是，2：否
    // "modelId": 0, //所属模型id
    // "modifyTime": "2021-04-23T03:43:21.051Z", //修改时间
    // "otherFieldList": [ //未选中的视图条件
    //   {
    //       "dataType": "string", //数据类型
    //       "enumName": "string", //枚举字段名称
    //       "fieldName": "string",  //告警字段英文名
    //       "filedAlias": "string", //字段别名（中文名）
    //       "isEnum": 0 //是否枚举，1：是，2：否
    //   }
    // ],
    // "parentFilterId": 0,   //引用的过滤器ID
    // "parentFilterName": "string", //引用的过滤器名称
    // "viewDesc": "string", //视图描述
    // "viewId": 0,  //视图ID
    // "viewName": "string"   //视图名称
}
export function switchDefaultValue(DefaultValue) {
    return DefaultValue;
}
