import request from '@Common/api';
import defaultConfig from '../../config/default';
import configUrl from '../../config/config_url';
import AlarmColor from '../render/alarmColor';
import getData from '@Common/services/dataService';
// import Version from '@Common/path/getVersion';
import constants from '@Common/services/constants';

const { mapperId, columnWith, defautFields, crruentColumns, ellipsisFieldName, fieldIdNamesFromSql } = defaultConfig;
const { iceEndpoint, baseUrlRest, rest_columnInfo } = configUrl;
export default class Columns {
    constructor(props) {
        // alarm-window 模式 从外部触发getColumnsInfo
        if (!fieldIdNamesFromSql && props.mode !== 'alarm-window') {
            this.getColumnsInfo();
        }
    }
    AlarmColor = new AlarmColor();
    // 这里放sql下沉查出的所有列
    _showInTableColumns = [];

    // 这里是所有列id和英文名的映射关系
    _fieldIdNames = [];
    // 查询时 默认filedIds 和 列定义filedIds 组合在一起
    _defaultfiledIds = [];
    getColumnsInfo() {
        return new Promise((resolve) => {
            request(rest_columnInfo, {
                type: 'post',
                showSuccessMessage: false,
                showErrorMessage: false,
                data: {
                    category: 'alarm',
                    iceEndpoint,
                },
                baseUrlType: baseUrlRest,
                // baseUrlType: filter,
            }).then((result) => {
                if (result && result.data) {
                    this._fieldIdNames = result.data;
                    this._defaultfiledIds = defautFields.map((fieldName) => {
                        const filed = this._fieldIdNames.find((field) => field.filedName === fieldName);
                        return filed.filedId;
                    });
                    resolve('ok');
                }
            });
        });
    }
    getInitColumnsStateMap() {
        // 以后crruentColumns 从数据库表里出
        // 现在暂时配在 /config/default.js 里crruentColumns
        // const crruentColumns = crruentColumns;
        const hideColumns = this._showInTableColumns.filter((col) => !crruentColumns.includes(col.dataIndex));
        // let hideColumns = [];
        const columnsStateMap = {};
        for (const iterator of hideColumns) {
            columnsStateMap[iterator.dataIndex] = { show: false };
        }
        const width = (this._showInTableColumns.length - hideColumns.length) * columnWith;
        return { columnsStateMap, width };
    }
    getCrruentColumns() {
        return new Promise(function () {
            const sqlId = 'alarmSearch_selectAlarmColTemplatesById';

            const data = {
                executeParam: {
                    dataSourceName: constants.dbNames.NMOSDB,
                    parameter: {},
                    sqlId: `com.boco.gutil.database.mapper.custom.CustomSqlMapper.${sqlId}`,
                    statementType: 'select',
                },
                mapperFile: {
                    mapperId: `${mapperId}`,
                    moduleId: 'ossImpAlarmSqlModule',
                    systemId: 'ossImpAlarmSqlSystem',
                },
            };
            getData(sqlId, { showSuccessMessage: false, showErrorMessage: false }, {}, -1, data).then(() => {
                // res;
            });
        });
    }
    getAllColumns() {
        if (this._showInTableColumns.length > 0) {
            return new Promise((resolve) => {
                resolve(this._showInTableColumns);
            });
        }
        return new Promise(
            function (resolve) {
                request('common/getDictToPaasByName', {
                    type: 'get',
                    baseUrlType: 'filter',
                    showSuccessMessage: false,
                    defaultErrorMessage: '获取字典键值失败',
                    data: {
                        dictName: 'alarmColInfo',
                    },
                })
                    .then((res) => {
                        const showInTableColumns = [];
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        // const { data } = res;
                        if (res.dataObject) {
                            for (const item of res.dataObject) {
                                const { DB_FIELD, REC_ID, COL_NAME_ZH } = item;
                                if (fieldIdNamesFromSql) {
                                    this._fieldIdNames.push({ filedId: REC_ID, filedName: DB_FIELD });
                                }
                                const column = {
                                    key: DB_FIELD,
                                    dataIndex: DB_FIELD,
                                    valueType: REC_ID,
                                    title: COL_NAME_ZH,
                                    width: columnWith,
                                    hideInSearch: true,
                                    ellipsis: false,
                                };
                                // 根据配置 设置字段超长隐藏
                                if (ellipsisFieldName.includes(DB_FIELD)) {
                                    column.ellipsis = true;
                                }
                                if (item.DB_FIELD === 'org_severity') {
                                    column.render = this.AlarmColor.renderAlramInTable;
                                }
                                showInTableColumns.push(column);
                            }
                            this._showInTableColumns = showInTableColumns;
                            // const width = showInTableColumns.length * defaultConfig.columnWith;
                            // resolve({ showInTableColumns, width });
                            resolve({ showInTableColumns });
                        } else {
                            resolve('Error');
                        }
                    })
                    .catch(function () {
                        // 处理 getJSON 和 前一个回调函数运行时发生的错误
                        resolve('Error');
                    });
            }.bind(this),
        );
    }
    // 仅仅用来获取 列id 和 Name 的映射关系
    getAllColumns_fieldIdNames() {
        if (!fieldIdNamesFromSql || this._fieldIdNames.length > 0) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        return new Promise(
            function (resolve) {
                request('common/getDictToPaasByName', {
                    type: 'get',
                    baseUrlType: 'filter',
                    showSuccessMessage: false,
                    defaultErrorMessage: '获取字典键值失败',
                    data: {
                        dictName: 'alarmColInfo',
                    },
                })
                    .then((res) => {
                        if (res.dataObject) {
                            for (const item of res.dataObject) {
                                const { DB_FIELD, REC_ID } = item;
                                this._fieldIdNames.push({ filedId: REC_ID, filedName: DB_FIELD });
                            }
                            resolve('');
                        } else {
                            resolve('Error');
                        }
                    })
                    .catch(function () {
                        // 处理 getJSON 和 前一个回调函数运行时发生的错误
                        resolve('Error');
                    });
            }.bind(this),
        );
    }
}
