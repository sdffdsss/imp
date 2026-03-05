import dataService from '@Common/services/dataService';
import { _ } from 'oss-web-toolkits';
import Version from '@Common/path/getVersion';
import constants from '@Common/services/constants';

export default class DataSource {
    _params = null;
    pageConfig = {
        totalCount: 0,
        pageSize: 10
    };
    async queryDataSource(params, DetailWhereCondition, dbName, sqlId, countSqlId) {
        try {
            const _params = this.convertParams(params, DetailWhereCondition);
            this._params = _params;
            const countRes = await this.getDataBySql({ _params, dbName, sqlId: countSqlId });
            const totalCount = countRes?.data?.data?.[0]?.num ?? 0;
            if (totalCount === 0) {
                return totalCount;
            }
            this.pageConfig.totalCount = totalCount;
            const { pageSize } = this.pageConfig;
            const records = await this.queryDataSourceByPage({
                dbName,
                sqlId,
                pageSize,
                current: 1
            });
            const dataSource = records?.data?.data ?? [];
            return dataSource.map((dataItem) => {
                const convert = {};
                for (const iterator in dataItem) {
                    // 驼峰转下划线 （数字认为是驼峰）
                    convert[_.snakeCase(iterator)] = dataItem[iterator];
                }
                return convert;
            });
        } catch (error) {
            return 'Error';
        }
    }

    getDataBySql({ _params = {}, dbName = constants.dbNames.NMOSDB, sqlId }) {
        const data = {
            executeParam: {
                dataSourceName: dbName,
                parameter: _params,
                sqlId: `com.boco.gutil.database.mapper.custom.CustomSqlMapper.${sqlId}`,
                statementType: 'select'
            },
            mapperFile: {
                mapperId: `reportSql${Version}`,
                moduleId: 'ossImpAlarmSqlModule',
                systemId: 'ossImpAlarmSqlSystem'
            }
        };
        return dataService(sqlId, { showSuccessMessage: false, showErrorMessage: false }, {}, 1, data);
    }
    queryDataSourceByPage({ dbName, sqlId, totalCount, pageSize, current }) {
        try {
            const { _params } = this;
            const index = {
                BegeinIndex: (current - 1) * pageSize,
                EndIndex: current * pageSize - 1
            };
            return this.getDataBySql({ _params: { ..._params, ...index }, dbName, sqlId });
        } catch (error) {
            console.error(`queryDataSourceByPage 错误：${error}`);
            throw error;
        }
    }
    convertParams(params, DetailWhereCondition) {
        return { ...params, DetailWhereCondition };
    }
    selectAlarmRecordCountAsync() {}
    _getAlarm(startIndex, pageSize) {}
}
