// import request from '@Common/api';
import getData from '@Common/services/dataService';

// const DEFAULT_BASE_URL = 'default';

/**
 * 列表数据查询
 * @param {*} params
 */
export const getList = async (params) => {
    return getData(
        ['SelectMajorsingleMonitoringTable', 'SelectMajorsingleMonitoringTableNum'],
        { showSuccessMessage: false, defaultErrorMessage: '获取数据失败，请检查服务' },
        {}
    ).then((res) => {
        console.log(res);
        let rowData = [];
            let total = 0;
        if (res.dealResult) {
            const {data} = res;
            total = data.SelectMajorsingleMonitoringTableNum.data.data[0].tatol;
            rowData = data.SelectMajorsingleMonitoringTable.data.data.map((item) => {
                let dataFailTypeName = '';
                if (item.dataFailType === 0) {
                    dataFailTypeName = '无派单';
                } else if (item.dataFailType === 1) {
                    dataFailTypeName = '派单失败';
                } else if (item.dataFailType === 2) {
                    dataFailTypeName = '派单延迟';
                }
                return { ...item, dataKey: item.fp0, dataFailTypeName };
            });
        }
        console.log(rowData);
        console.log(total);
        return {
            data: rowData,
            success: true,
            total,
        };
    });
};
export const getThresholdList = (params) => {
    return getData(
        ['SelectMajorsingleThresholdTable', 'SelectMajorsingleThresholdTableNum'],
        { showSuccessMessage: false, defaultErrorMessage: '获取数据失败，请检查服务' },
        {}
    ).then((res) => {
        let rowData = [];
            let total = 0;
        if (res.dealResult) {
            const {data} = res;
            total = data.SelectMajorsingleThresholdTableNum.data.data[0].total;
            rowData = data.SelectMajorsingleThresholdTable.data.data.map((item) => {
                let dataFailTypeName = '';
                if (item.dataFailType === 0) {
                    dataFailTypeName = '无派单';
                } else if (item.dataFailType === 1) {
                    dataFailTypeName = '派单失败';
                } else if (item.dataFailType === 2) {
                    dataFailTypeName = '派单延迟';
                }
                return { ...item, dataKey: item.intId, dataFailTypeName };
            });
        }
        return {
            data: rowData,
            success: true,
            total,
        };
    });
};
