import convertXml from 'xml-js';
import request from '@Common/api';
import config from '../../config/default.js';

const { columnWith, detailColumnWith } = config;
export default class Columns {
    loadXml = ({ fullUrl }) => {
        return new Promise((resolve) => {
            try {
                request('', {
                    fullUrl,
                    type: 'get',
                }).then((xml) => {
                    const options = { ignoreComment: true, nativeTypeAttributes: true };
                    const xmlData = convertXml.xml2js(xml, options);
                    const formatedData = this.convertDataFormate(xmlData);
                    resolve(formatedData);
                });
            } catch (error) {
                console.error(`loadXml 出错：${  error}`);
            }
        });
    };
    convertDataFormate = ({ type = null, name = '', attributes = '', elements = [] }) => {
        let _ReportTitle = '';
            let _sql = {};
            let _countsql = '';
            let _Conditions = [];
            let _Columns = [];
            const _detailSql = {};
            // _detailCountSql = '',
            let _DetailColumns = [];
            // _DetailColumns_id = '',
            let _DetailColumns_group = {};
        switch (name) {
            case 'ReportTitle':
                const { title = '' } = attributes;
                _ReportTitle = title;
                break;
            case 'sql':
                const { dbName = '', sqlId = '' } = attributes;
                _sql = { dbName, sqlId };
                break;
            case 'countsql':
                _countsql = attributes.sqlId ?? '';
                break;
            case 'Condition':
                const { Name = '', Flag = '', ControlType = '', DefaultValue = '', DbName = '' } = attributes;
                _Conditions = { Name, Flag, ControlType, DefaultValue, DbName, sqlId: attributes.sqlId };
                break;
            case 'ColumnItem':
                const {
                    FieldName = '',
                    DisplayName = '',
                    IsSort = false,
                    IsHasDetail = false,
                    DetailWhereCondition = '',
                    Width = columnWith,
                } = attributes;
                _Columns = { FieldName, DisplayName, IsSort, IsHasDetail, DetailWhereCondition, Width };
                break;
            // case 'detailSql':
            //     const { DetailDbName = '', detailSqlId = '' } = attributes;
            //     _detailSql = { dbName: DetailDbName, sqlId: detailSqlId };
            //     break;
            // case 'detailCountSql':
            //     _detailCountSql = attributes.detailCountSql ?? '';
            // break;
            case 'DetailColumnItem':
                _DetailColumns = {
                    FieldName: attributes.FieldName ?? '',
                    DisplayName: attributes.DisplayName ?? '',
                    Width: attributes.Width ?? detailColumnWith,
                    IsSort: attributes.IsSort ?? false,
                };
                break;
            case 'DetailColumns':
                const { Title = '详情', Parent, DetailDbName, DetailSqlId, DetailCountSqlId } = attributes;

                // let _DetailColumns_group = {};
                let _DetailCol = [];
                for (const ele of elements) {
                    const eleItem = this.convertDataFormate(ele);
                    const { DetailColumns } = eleItem;
                    _DetailCol = _DetailCol.concat(DetailColumns);
                }
                _DetailColumns_group = { [Parent]: { Title, DetailDbName, DetailSqlId, DetailCountSqlId, DetailCol: _DetailCol } };
                break;
            default:
                for (const ele of elements) {
                    const eleItem = this.convertDataFormate(ele);
                    const {
                        ReportTitle,
                        sql,
                        countsql,
                        Conditions,
                        Columns,
                        detailSql,
                        // detailCountSql,
                        DetailColumns,
                        // DetailColumns_id,
                        DetailColumns_group,
                    } = eleItem;
                    _ReportTitle += ReportTitle;
                    Object.assign(_sql, sql);
                    _countsql += countsql;
                    _Conditions = _Conditions.concat(Conditions);
                    _Columns = _Columns.concat(Columns);
                    Object.assign(_detailSql, detailSql);
                    Object.assign(_DetailColumns_group, DetailColumns_group);
                    // _detailCountSql += detailCountSql;
                    _DetailColumns = _DetailColumns.concat(DetailColumns);
                    // _DetailColumns_id += DetailColumns_id;
                    // if (_DetailColumns_id && _DetailColumns.length > 0) {
                    //     _DetailColumns_group.push({ [_DetailColumns_id]: _DetailColumns });
                    // }
                }
        }
        return {
            ReportTitle: _ReportTitle,
            sql: _sql,
            countsql: _countsql,
            Conditions: _Conditions,
            Columns: _Columns,
            // detailSql: _detailSql,
            // detailCountSql: _detailCountSql,
            DetailColumns: _DetailColumns,
            // DetailColumns_id: _DetailColumns_id,
            DetailColumns_group: _DetailColumns_group,
        };
    };
}
