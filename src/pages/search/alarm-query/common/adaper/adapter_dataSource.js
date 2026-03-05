/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-underscore-dangle */
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import request from '../../../../../common/api';
import SessionRegister, { statusBeanDefault } from '../model/sessionRegister';
import configConf from '../../config/default';
import configUrl from '../../config/config_url';
import moment from 'moment';
import alarmconverter from '../operator/alarmconverter';

const {
    baseUrlRest,
    rest_release,
    rest_regist,
    rest_count,
    rest_recordPage,
    rest_export,
    alarm_detail_unicom,
    db_click_detail,
    pretreatment_info,
    sub_alarm_unicom,
} = configUrl;

const exportEumn = ['CSV', 'EXCEL', 'HTML'];
export default class DataSource {
    _sessionId = '';
    _fieldIdNames = [];
    _defaultfiledIds = [];
    _headerRow = [];
    _queryType = 'alarmField';
    _params = null;
    _needRegister = false;
    userId = null;
    otherConfig = {};
    pageConfig = {
        totalCount: 0,
        pageSize: 50,
    };
    _showInTableColumns = []; // 列模板中所有的列
    /**
     *
     * @param {*} _params  注册的参数
     * @param {*} _queryType alarmField|filterId|fp|customQuery 查询类型 通用查询|过滤器查询|唯一标识查询|业务查询视图
     * @param {*} param2 _fieldIdNames 列英文名、列id的映射关系， 默认查询列id
     * @param {*} _showInTableColumns 列模板改变时 传入的列集合
     * @param {*} pageSize 每页长度
     * @returns
     */
    async getAlarmData(_params, _queryType, { _fieldIdNames = [], _defaultfiledIds = [] }, _showInTableColumns, pageSize) {
        // 注册前先 清除

        this._params = _params;
        this._queryType = _queryType;
        if (_fieldIdNames.length === 0 || _showInTableColumns.length === 0) {
            return 'RegisterError';
        }
        this._fieldIdNames = _fieldIdNames;
        this._defaultfiledIds = _defaultfiledIds;
        this._showInTableColumns = _showInTableColumns;
        if (useEnvironmentModel?.data?.environment?.version === 'unicom') {
            const ps = pageSize || this.pageConfig.pageSize;
            this._sessionId = `${new Date().getTime()}`;
            const alarmPage = await this._getAlarm(0, ps);
            if (alarmPage === 'Error') {
                return [];
            }
            this.pageConfig.totalCount = alarmPage?.total;
            return alarmPage.data;
        }
        await this.unRegisterAsync();
        // 注册查询过滤条件
        const symbol_Register = await this.registerAsyncExe();
        if (symbol_Register !== 'RegisterError') {
            this._needRegister = false;
            // const recordCount = await this.selectAlarmRecordCountAsync();
            // this.pageConfig.totalCount = recordCount.data;
            // const records = await this._getAlarm(0, pageSize || this.pageConfig.pageSize);
            const promises = [this.selectAlarmRecordCountAsync(), this._getAlarm(0, pageSize || this.pageConfig.pageSize)];
            const resolved = await Promise.all(promises);
            this.pageConfig.totalCount = resolved[0]?.data;
            const records = resolved[1];
            const resData = records.data;
            return resData;
        }
        return symbol_Register;
    }
    registerAsyncExe() {
        try {
            const sessionRegister = this.constructSessionRegister();
            return request(rest_regist, {
                type: 'post',
                showSuccessMessage: false,
                showErrorMessage: false,
                data: sessionRegister,
                baseUrlType: baseUrlRest,
            });
        } catch (error) {
            return 'RegisterError';
        }
    }
    constructSessionRegister() {
        const self = this;
        const sessionRegister = _.cloneDeep(SessionRegister);
        // let alarmRegisterInfo = new alarmRegisterInfo();
        if (self._sessionId === undefined || self._sessionId === null || self._sessionId === '') {
            self._sessionId = `${new Date().getTime()}`;
        }
        sessionRegister.dateBean = this.getDateBean();
        // if (self._params.event_time && self._params.event_time.value[0] && self._params.event_time.value[1]) {
        // }
        if (self._params.filter_type && self._queryType === 'filterId') {
            const { value: filterType } = self._params.filter_type;
            sessionRegister.moduleId = ['myFilters', 'allFilters'].includes(filterType) ? 1 : 10;
        }
        const statusBean = this.getStatusBean();
        if (statusBean) {
            sessionRegister.statusBean = this.getStatusBean();
        } else if (useEnvironmentModel?.data?.environment?.version !== 'unicom') {
            sessionRegister.statusBean = statusBeanDefault;
        }
        sessionRegister.alarmOrigin = this.getAlarmOrigin();
        sessionRegister.fieldIds = this.getFieldIds();
        sessionRegister.defaultFieldIds = [64, 62, 68, 137, 33, 35, 7, 16, 30, 116, 23, 9, 4];
        sessionRegister.mConditionMaps = this.getmConditionMaps();
        sessionRegister.fieldConditions.conditionList = this.getConditionList();
        sessionRegister.sessionId = self._sessionId;
        sessionRegister.userId = self.userId;
        sessionRegister.loginProvinceId = self.loginProvinceId;
        return sessionRegister;
    }

    selectAlarmRecordCountAsync() {
        const self = this;
        return request(rest_count, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: {
                // iceEndpoint: iceEndpoint,
                sessionId: self._sessionId,
            },
            baseUrlType: baseUrlRest,
        });
    }
    _getAlarm(startIndex, pageSize, registParams) {
        const self = this;
        if (useEnvironmentModel?.data?.environment?.version === 'unicom') {
            try {
                const register = this.constructSessionRegister();

                return request(useLoginInfoModel.data.platFlag ? 'sysadminAlarm/recordPageByPlatform' : rest_recordPage, {
                    type: 'post',
                    showSuccessMessage: false,
                    showErrorMessage: false,
                    data: {
                        ...register,
                        sessionId: self._sessionId,
                        pageSize,
                        startIndex,
                        ...self.otherConfig,
                    },
                    baseUrlType: baseUrlRest,
                });
            } catch (error) {
                console.log(error, '==error');
                return 'Error';
            }
        } else {
            if (self._needRegister) {
                return self.getAlarmData(...registParams);
            }
            return request(rest_recordPage, {
                type: 'post',
                showSuccessMessage: false,
                showErrorMessage: false,
                data: {
                    // iceEndpoint: iceEndpoint,
                    sessionId: self._sessionId,
                    pageSize,
                    startIndex,
                    ...self.otherConfig,
                },
                baseUrlType: baseUrlRest,
            });
        }
    }

    exportAlarm({ startIndex, pageSize, exportType, alarmList, total }) {
        const self = this;
        if (alarmList && alarmList.length) {
            if (useEnvironmentModel?.data?.environment?.version === 'unicom') {
                return this.exportAlarmByIdsUnicom(alarmList, exportType);
            }
            return this.exportAlarmByIds(alarmList, exportType);
        }
        // if (!self._sessionId) {
        //     this.registerAsyncExe().then((symbol) => {
        //         if (symbol === 'RegisterError') {
        //             return;
        //         }
        //     });
        // }
        if (useEnvironmentModel?.data?.environment?.version === 'unicom') {
            return request(useLoginInfoModel.data.platFlag ? 'sysadminAlarm/exportByPlatform' : rest_export, {
                type: 'post',
                showSuccessMessage: false,
                showErrorMessage: false,
                data: {
                    sessionId: self._sessionId,
                    pageSize,
                    startIndex,
                    exportType,
                },
                baseUrlType: baseUrlRest,
            });
        }
        return request(rest_export, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: {
                capacity: 0,
                exportFormat: exportEumn[exportType],
                pageSize: total <= 100000 ? total : 100000,
                sessionId: self._sessionId,
                startIndex: 0,
            },
            baseUrlType: baseUrlRest,
        });
    }
    unRegisterAsync() {
        const self = this;
        if (self._sessionId === null || self._sessionId === '') {
            return null;
        }
        return request(rest_release, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: {
                // iceEndpoint: iceEndpoint,
                sessionId: self._sessionId,
            },
            baseUrlType: baseUrlRest,
        });
    }

    getDateBean() {
        const params = this._params;
        const time = params.event_time?.value || [];
        const filed = this._fieldIdNames.find((item) => {
            return item.filedName === 'event_time';
        });
        const dateBean = {
            endTime: time[1]?.format('YYYY-MM-DD HH:mm:ss') || null,
            fieldId: filed.filedId,
            not: false,
            startTime: time[0]?.format('YYYY-MM-DD HH:mm:ss') || null,
            type: 'type',
        };
        if (!time[1] || !time[0]) {
            return null;
        }
        return dateBean;
    }
    getStatusBean() {
        const params = this._params;
        if (!params.active_status) {
            return null;
        }
        let status = [];
        if (params.active_status.value) {
            status = params.active_status.value.map((item) => Number(item));
        }
        const filed = this._fieldIdNames.find((item) => {
            return item.filedName === 'active_status';
        });
        const dateBean = {
            activeStatus: 1,
            fieldId: filed.filedId,
            not: false,
            status,
        };
        return dateBean;
    }
    getAlarmOrigin() {
        const { alarm_origin = { value: 0 } } = this._params;
        return alarm_origin.value;
    }
    setHeaderRow(HeaderRow) {
        this._needRegister = true;
        this._headerRow = HeaderRow.filter((row) => !_.isEmpty(row) && row.dataIndex);
    }
    getFieldIds() {
        // let fieldIds = this._headerRow.map((header) => header.valueType);
        // fieldIds = fieldIds.concat(this._defaultfiledIds);

        // 根据列定义 改变参数
        const searchFields = this._headerRow.length === 0 ? this._showInTableColumns : this._headerRow;
        // 不根据列定义改变参数，一直查全量列模板数据
        // const searchFields = this._showInTableColumns;
        const fieldIdNames = this._fieldIdNames;
        // 收集未匹配的列模板
        const nofindIds = [];
        let fieldIds = searchFields.map((header) => {
            const field = fieldIdNames.find((item) => item.filedName === header.dataIndex);
            if (!field?.filedName) {
                nofindIds.push(field?.filedName);
            }
            return field?.filedId ?? null;
        });
        // 62告警发生时间，68告警清除状态，137省id，33网管告警级别,35网管告警ID,7网元名称
        // 16告警对象名称,30告警标题,116归属设备网元ID,23专业,9设备类型,4厂家id
        fieldIds = fieldIds.filter((f) => f !== null);
        fieldIds = fieldIds.concat([457, 462]);
        return Array.from(new Set(fieldIds));
    }
    getConditionList() {
        let conditionList = [];
        let params = this._params;
        const fieldIdNames = this._fieldIdNames;
        const filterField = configConf.dontSearchFieldName;

        filterField.forEach((field) => {
            const { [field]: f, ...cparams } = this._params;
            params = cparams;
        });
        // const queryType = this._queryType;
        // eslint-disable-next-line no-restricted-syntax
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const element = params[key];
                const condition = this._conditionConvert(key, element, fieldIdNames, 'ConditionList');
                const timeScope = [425, 154, 69]; // 三个时间范围，为空就不传
                if (condition.value?.beginTime === null && timeScope.includes(condition.fieldId)) {
                    console.log(condition);
                } else {
                    conditionList = conditionList.concat(condition);
                }
            }
        }

        return conditionList;
    }
    /**
     *
     * @param {*} fieldName
     * @param {*} param1
     * @param {*} fieldIdNames
     * @param {*} type  'ConditionList' | 'mConditionMaps'
     */
    _conditionConvert(fieldName, { operator = null, value = [] }, fieldIdNames, type) {
        // 'event_time', 'active_status','group_id' 不放一般条件里，
        // 'alarm_origin' 一般条件和特殊条件都不放，直接放alarmOrigin 中
        if (['alarm_origin'].includes(fieldName) || (type === 'ConditionList' && ['event_time', 'active_status', 'filter_id'].includes(fieldName))) {
            return [];
        }
        if (fieldName === 'locate_info') {
            value = value.trim();
        }
        // 省市区联动的条件 单独处理
        if (fieldName === 'province_region_city') {
            const conditions = [];
            const prc = ['province_id', 'region_id', 'city_id'];

            for (const key in value) {
                const condition = this._conditionConvert(prc[key], { operator, value: value[key] }, fieldIdNames);
                conditions.push(condition);
            }
            return conditions;
        }
        // 其他的条件
        const condition = {
            fieldId: -1,
            not: false,
            type: 'eq',
            value: '',
            values: [],
        };

        // const filed = fieldIdNames.find((item) => {
        //     return item.filedName === fieldName;
        // });
        // if (filed) {
        //     condition.fieldId = filed.filedId;
        // }

        const fields = [];
        fieldIdNames.forEach(function (item) {
            fields[item.filedId] = item.filedName;
        });
        condition.fieldId = alarmconverter.findColunmsByFieldName(fields, fieldName);

        if (['ne', 'noLike'].includes(operator)) {
            condition.not = true;
        }
        const valueArray = [].concat(value);
        // condition.type = alarmconverter.filterOperatorsConvert(operator, valueArray.length);
        condition.type = alarmconverter.filterOperatorsConvertNew(operator, valueArray.length);
        switch (operator) {
            case 'between':
                // eslint-disable-next-line no-case-declarations
                const times = {};
                if (valueArray.length === 2) {
                    times.beginTime = valueArray[0]?.format('YYYY-MM-DD HH:mm:ss') || null;
                    times.endTime = valueArray[1]?.format('YYYY-MM-DD HH:mm:ss') || null;
                } else {
                    times.beginTime = valueArray[0]?.format('YYYY-MM-DD HH:mm:ss') || null;
                    times.endTime = null;
                }
                condition.value = times;
                break;
            default:
                if (valueArray.length === 1) {
                    condition.value = `${value}`;
                }
                condition.values = valueArray.map((v) => `${v}`);
        }

        return condition;
    }
    // _conditionConvert(fieldName, { operator = null, value = [] }, fieldIdNames, type) {
    //     //'event_time', 'active_status','circuit_group_id' 不放一般条件里，
    //     if (type === 'ConditionList' && ['event_time', 'active_status', 'circuit_group_id'].includes(fieldName)) {
    //         return [];
    //     }
    //     // 省市区联动的条件 单独处理
    //     if (fieldName === 'province_region_city') {
    //         let conditions = [];
    //         let prc = ['province_id', 'region_id', 'city_id'];
    //         for (const key in value) {
    //             const condition = this._conditionConvert(prc[key], { operator, value: value[key] }, fieldIdNames);
    //             conditions.push(condition);
    //         }
    //         return conditions;
    //     }
    //     // 其他的条件
    //     let condition = {
    //         fieldId: -1,
    //         not: false,
    //         type: 'eq',
    //         value: {},
    //     };
    //     const filed = fieldIdNames.find((item) => {
    //         return item.filedName === fieldName;
    //     });
    //     if (filed) {
    //         condition.fieldId = filed.filedId;
    //     }

    //     if (['ne', 'noLike'].includes(operator)) {
    //         condition.not = true;
    //     }
    //     let valueArray = [].concat(value);
    //     condition.type = alarmconverter.filterOperatorsConvert(operator, valueArray.length);
    //     switch (operator) {
    //         case 'between':
    //             let times = {};
    //             if (valueArray.length === 2) {
    //                 times.beginTime = valueArray[0].format('yyyy-MM-dd hh:mm:ss');
    //                 times.endTime = valueArray[1].format('yyyy-MM-dd hh:mm:ss');
    //             } else {
    //                 times.beginTime = valueArray[0].format('yyyy-MM-dd hh:mm:ss');
    //                 times.endTime = moment().format('yyyy-MM-dd hh:mm:ss');
    //             }
    //             condition.value = times;
    //             break;
    //         default:
    //             if (valueArray.length === 1) {
    //                 condition.value = {
    //                     value: value + '',
    //                 };
    //             } else if (valueArray.length > 1) {
    //                 condition.value = {
    //                     values: value.map((v) => v + ''),
    //                 };
    //             }
    //     }

    //     return condition;
    // }
    getmConditionMaps() {
        // sessionRegister
        const mConditionMaps = {};
        const params = this._params;
        const fieldIdNames = this._fieldIdNames;
        // const mConditionField = ['circuit_group_id', 'filter_id'];
        const mConditionField = ['group_id', 'filter_id'];
        const mParams = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const field of mConditionField) {
            if (this._params[field]) {
                mParams[field] = this._params[field];
            }
        }
        if (Object.keys(mParams).length === 0) {
            return mConditionMaps;
        }
        const queryType = this._queryType;
        switch (queryType) {
            case 'alarmField':
                // let condition = [];
                // for (const key in mParams) {
                //     const element = mParams[key];
                //     condition = this._conditionConvert(key, element, fieldIdNames, 'mConditionMaps');
                // }
                // mConditionMaps.groupId = condition;
                break;
            case 'filterId':
            case 'customQuery':
                const key = 'filter_id';
                const element = params[key];
                if (element) {
                    const condition = this._conditionConvert(key, element, fieldIdNames, 'mConditionMaps');
                    // condition.fieldId = 999;
                    mConditionMaps.filterId = condition;
                }
                break;
            case 'fp':
            default:
                break;
        }
        return mConditionMaps;
    }
    exportAlarmByIds = (alarmList, exportType) => {
        const registerDetail = () => {
            const newSessionRegister = _.cloneDeep(SessionRegister);
            newSessionRegister.sessionId = `${new Date().getTime()}`;
            newSessionRegister.dateBean = this.getDateBean();
            // if (this._params.event_time && this._params.event_time.value[0] && this._params.event_time.value[1]) {
            // }
            const statusBean = this.getStatusBean();
            if (statusBean) {
                newSessionRegister.statusBean = this.getStatusBean();
            } else {
                newSessionRegister.statusBean = statusBeanDefault;
            }
            newSessionRegister.alarmOrigin = this.getAlarmOrigin();
            newSessionRegister.fieldIds = this.getFieldIds();
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

        const exportBySession = (sessionId) => {
            const data = {
                capacity: 0,
                exportFormat: exportEumn[exportType],
                pageSize: alarmList.length,
                sessionId,
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
                    if (res.data) {
                        return res;
                    }
                    return {};
                })
                .catch(() => {
                    return {};
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
    exportAlarmByIdsUnicom = (alarmList, exportType) => {
        const registerDetail = () => {
            const newSessionRegister = _.cloneDeep(SessionRegister);
            newSessionRegister.sessionId = `${new Date().getTime()}`;
            newSessionRegister.dateBean = this.getDateBean();
            // if (this._params.event_time && this._params.event_time.value[0] && this._params.event_time.value[1]) {
            // }
            const statusBean = this.getStatusBean();
            if (statusBean) {
                newSessionRegister.statusBean = this.getStatusBean();
            }
            newSessionRegister.alarmOrigin = this.getAlarmOrigin();
            newSessionRegister.fieldIds = this.getFieldIds();
            newSessionRegister.mConditionMaps = {
                alarmIdList: {
                    fieldId: 999,
                    not: false,
                    type: 'in',
                    value: '1',
                    values: alarmList.map((item) => `${item.fp0.value}_${item.fp1.value}_${item.fp2.value}_${item.fp3.value}`),
                },
            };
            return newSessionRegister;
        };
        const self = this;
        const exportBySession = (newSessionRegister) => {
            const data = {
                ...newSessionRegister,
                capacity: 0,
                exportType,
                pageSize: alarmList.length,
                // sessionId,
                userId: self.userId,
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
                    if (res.fileUrl) {
                        return res;
                    }
                    return {};
                })
                .catch(() => {
                    return {};
                });
        };
        return (async () => {
            const newSessionRegister = registerDetail();
            if (newSessionRegister) {
                const alarmDetail = await exportBySession(newSessionRegister);
                return alarmDetail;
            }
            return [];
        })();
    };
}
export const getAlarmDetail = (alarmKeyList, timeRange, dataSource) => {
    if (useEnvironmentModel?.data?.environment?.version === 'unicom') {
        const data = alarmKeyList.map((item) => {
            const selItem = _.find(dataSource, (d) => d.alarm_id.value === item);
            return selItem && selItem.professional_type?.value === '85' ? `${selItem.standard_alarm_id?.value}&85` : selItem.standard_alarm_id?.value;
        });
        return request(alarm_detail_unicom, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data,
            baseUrlType: baseUrlRest,
        })
            .then((res) => {
                if (res.code === 0) {
                    return res.data.map((item) => {
                        const showItem = Object.values(item)[0];
                        const alarmId = `${showItem.fp0?.value}_${showItem.fp1?.value}_${showItem.fp2?.value}_${showItem.fp3?.value}`;
                        return {
                            ...showItem,
                            alarm_id: {
                                field: 'alarm_id',
                                lable: alarmId,
                                num: '-1',
                                value: alarmId,
                            },
                            key: alarmId,
                        };
                    });
                }
                return [];
            })
            .catch(() => {
                return [];
            });
    }
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
            startTime: timeRange?.current?.event_time?.value[0]?.format('YYYY-MM-DD HH:mm:ss'),
            fieldId: 62,
            not: false,
            endTime: timeRange?.current?.event_time?.value[1]?.format('YYYY-MM-DD HH:mm:ss'),
            type: 'type',
        };
        newSessionRegister.fieldIds = [];
        newSessionRegister.sessionId = `${new Date().getTime()}`;
        newSessionRegister.statusBean = {
            activeStatus: 1,
            fieldId: 68,
            not: false,
            status: [...new Set(alarmKeyList.map((item) => _.find(dataSource, (d) => d.alarm_id.value === item)?.active_status?.value))],
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
        startTime: timeRange?.current?.event_time?.value[0]?.format('YYYY-MM-DD HH:mm:ss'),
        fieldId: 62,
        not: false,
        endTime: timeRange?.current?.event_time?.value[1]?.format('YYYY-MM-DD HH:mm:ss'),
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
