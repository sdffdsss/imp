/* eslint-disable class-methods-use-this */
import request from '@Common/api';

class Api {
    // 获取弹窗group数据
    async getWorkbenchGroupData(areaId) {
        const result = await request('model-cache/v1/getGroupCacheForWorkbench', {
            type: 'get',
            baseUrlType: 'cacheUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data: { areaId },
        });

        return result.data;
    }
    // 获取工作台面板数据
    async getWorkbenchData(data) {
        const result = request('model-cache/v1/getCacheForWorkbench', {
            type: 'get',
            baseUrlType: 'cacheUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 获取八大专业数据
    async getProfessionData(data) {
        const result = request('dx/countrywide', {
            type: 'get',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 获取故障派单
    async getFaultDispatchData(data) {
        const result = request('dx/countrywide', {
            type: 'get',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 覆盖率
    async getCoverRateData(data) {
        const result = request('statis/getWorksheetCoverage', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 24小时工单
    async getFullHourData(data) {
        const result = request('statis/getWorksheetHourRecord', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data,
        });

        return result;
    }
    // 班组数据
    async getDutyGroupData(data) {
        const result = request('maintainTeam/getMteamSumStatistics', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data: data,
        });

        return result;
    }
    // 故障派单总量
    async getDispatchData(data) {
        const result = request('statis/getWorksheetDayStatics', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data: data,
        });
        return result;
    }
    // 派单成功率
    async getDispatchRate(data) {
        const result = request('statis/getWorksheetSuccRate', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data: data,
        });

        return result;
    }
    /**
     *
     * @param {areaId} 区域id
     */
    async getProvinceArea(areaId) {
        const result = await request('/model-cache/v1/getAreaCenterNumForWorkbench', {
            type: 'get',
            baseUrlType: 'cacheUrl',
            showSuccessMessage: false,
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败',
            data: { areaId },
        });

        return result.data;
    }

    async getFaultDiscover(data) {
        const result = request('alarm/mteam/v1/alarmStatistics', {
            type: 'get',
            baseUrlType: 'alarmMonitorUrl',
            showErrorMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }
}
export default new Api();
