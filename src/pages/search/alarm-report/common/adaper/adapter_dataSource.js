import request from '@Common/api';
import constants from '@Common/services/constants';
import configUrl from '../../config/config_url';
import moment from 'moment';
import Version from '@Common/path/getVersion';

const { baseUrlSqlm, sqlm_execute } = configUrl;

export default class DataSource {
    _params = null;
    pageConfig = {
        totalCount: 0,
        pageSize: 10,
    };
    pageSizeExport = 100000000;
    async queryDataSourceExport(params, { dbName, sqlId }) {
        try {
            const _params = this.convertParams(params);
            this._params = _params;
            const records = await this.queryDataSourceByPage({
                dbName,
                sqlId,
                pageSize: this.pageSizeExport,
                current: 1,
            });
            const dataSource = records?.data?.data ?? [];
            return dataSource.map((dataItem) => {
                const convert = {};
                for (const iterator in dataItem) {
                    // 驼峰转下划线
                    convert[iterator.replace(/([A-Z])/g, '_$1').toLowerCase()] = dataItem[iterator];
                }
                return convert;
            });
        } catch (error) {
            return 'Error';
        }
    }
    async queryDataSource(params, { dbName, sqlId }, countSqlId) {
        try {
            const _params = this.convertParams(params);
            this._params = _params;
            const countRes = await this.getDataBySql({ _params, dbName, sqlId: countSqlId });
            const totalCount = countRes?.data?.data?.[0]?.num ?? 0;
            if (totalCount === 0) {
                return [];
            }
            this.pageConfig.totalCount = totalCount;
            const { pageSize } = this.pageConfig;
            const records = await this.queryDataSourceByPage({
                dbName,
                sqlId,
                pageSize,
                current: 1,
            });
            const dataSource = records?.data?.data ?? [];
            return dataSource.map((dataItem) => {
                const convert = {};
                for (const iterator in dataItem) {
                    // 驼峰转下划线
                    convert[iterator.replace(/([A-Z])/g, '_$1').toLowerCase()] = dataItem[iterator];
                }
                return convert;
            });
        } catch (error) {
            return 'Error';
        }
    }
    getDataBySql({ _params = {}, dbName = constants.dbNames.NMOSDB, sqlId }) {
        return request(sqlm_execute, {
            type: 'post',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: {
                executeParam: {
                    dataSourceName: dbName,
                    parameter: _params,
                    sqlId: `com.boco.gutil.database.mapper.custom.CustomSqlMapper.${  sqlId}`,
                    statementType: 'select',
                },
                mapperFile: {
                    mapperId: `reportSql${Version}`,
                    moduleId: 'ossImpAlarmSqlModule',
                    systemId: 'ossImpAlarmSqlSystem',
                },
            },
            baseUrlType: baseUrlSqlm,
        });
    }
    queryDataSourceByPage({ dbName, sqlId, totalCount, pageSize, current }) {
        try {
            const { _params } = this;
            const index = {
                BegeinIndex: (current - 1) * pageSize,
                EndIndex: current * pageSize - 1,
            };
            return this.getDataBySql({ _params: { ..._params, ...index }, dbName, sqlId });
        } catch (error) {
            console.error(`queryDataSourceByPage 错误：${  error}`);
            throw error;
        }
    }
    convertParams(params) {
        const _params = {
            province: '-1',
            region_id: '-1',
            areaID: '-1',
            professional: '-1',
            prj_flag: '-1',
            severity: '-1',
            eqp_object_class: '-1',
            omcid: '-1',
            vendor: '-1',
            rows: '-1',
        };
        for (const index in params) {
            const { value } = params[index];
            if (value !== null && value !== '') {
                const _value = [].concat(value);
                switch (index) {
                    case 'timeRange':
                        _params.time1 = moment(_value[0]).format('YYYY-MM-DD HH:mm:ss');
                        _params.time2 = moment(_value[1]).format('YYYY-MM-DD HH:mm:ss');
                        break;
                    case 'province':
                        _params[index] = _value.map((item) => Number(item)).join(',');
                        break;
                    default:
                        _params[index] = _value.join(',');
                }
            }
        }
        return _params;
    }
    selectAlarmRecordCountAsync() {}
    _getAlarm(startIndex, pageSize) {}
}
