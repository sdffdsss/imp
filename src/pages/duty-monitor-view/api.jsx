import request from '@Common/api';
class Api {
    async getAlarmData(data) {
        const result = request('dx/shiftForeman', {
            type: 'get',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 左上统计数据
    async getTopLeftData(data) {
        const result = request('statis/getGlobalStatisticRecord', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 中断监测列表
    async getInterruptData(data) {
        const result = request('monitor/getMonitorRecord', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 割接工单列表查询
    async getCutSheetData(data) {
        // const result = request('fault/work/sheet/v1/getProjectReservationInfo', {
        //     type: 'post',
        //     baseUrlType: 'failureSheetUrl',
        //     showSuccessMessage: false,
        //     showErrorMessage: true,
        //     defaultErrorMessage: '获取数据失败',
        //     data,
        // });

        //修改新数据来源
        const result = request('/shiftOfDutySheet/getEngineeringCutOver', {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }
    async getCutSheetDataDetailUrl(data) {
        const result = request('/shiftOfDutySheet/queryCuttingWorkSheetDetail', {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }
    // 投诉工单列表查询
    async getComplaintSheetData(data) {
        const result = request('fault/work/sheet/v1/getComplaintWorkOrderInfo', {
            type: 'post',
            baseUrlType: 'failureSheetUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    //重大故障列表
    async getBigErrorData(data) {
        const result = request('statis/getMajorFaultRecord', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
}
export default new Api();
