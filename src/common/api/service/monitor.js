import request from '@Src/common/api';

const baseUrlType = 'monitor';

class Monitor {
    /**
     * @description 查询监测器列表
     * @param {*} data
     * @returns
     */
    async getMonitorList(data) {
        const result = await request('monitor/findMontiorList', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result || [];
    }

    /**
     * @description 添加监测器
     * @param {*} data
     * @returns
     */
    async addMonitorData(data) {
        const result = await request('monitor/addMontior', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '添加失败',
            data,
        });
        return result || [];
    }

    /**
     * @description 监测器更新
     * @param {*} data
     * @returns
     */
    async updateMonitorData(data) {
        const result = await request('monitor/updateMontior', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '更新成功',
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result || [];
    }

    /**
     * @description 删除监测器
     * @param {*} data
     * @returns
     */
    async deleteMontiorData(data) {
        const result = await request('monitor/deleteMontior', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '删除成功',
            defaultErrorMessage: '删除失败',
            data,
        });
        return result || [];
    }

    /**
     * @description 查询监测器
     * @param {*} data
     * @returns
     */
    async getMontiorData(monitorId) {
        const result = await request('monitor/getMontior', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                monitorId,
            },
        });
        return result || [];
    }

    /**
     * @description 查看监测器日志
     * @param {*} data
     * @returns
     */
    async getMonitorLogs(data) {
        const result = await request('monitor/findAlarmMonitorLogs', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result || [];
    }

    /**
     * @description 检测监测器名称是否重复
     * @param {*} data
     * @returns
     */
    async checkMontior(data) {
        const result = await request('monitor/checkMontior', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            showErrorMessage: false,
            data,
        });
        return result || [];
    }
}

export const monitor = new Monitor();
