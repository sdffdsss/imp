import request from '@Src/common/api';
import qs from 'qs';

const baseUrlType = 'filterUrl';

class FilterApi {
    /**
     * 字典值查询
     * @param {Object} data
     * @param {number} data.modelId
     * @param {string} data.creator
     * @param {number} data.pageSize
     * @param {string} data.dictName
     * @returns
     */
    getDictEntry = async (data) => {
        const { modelId, creator, pageSize, dictName, hasAdditionZone, zoneId } = data;
        const result = await request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize,
                dictName,
                // en: false,
                modelId,
                creator,
                // hasAdditionZone,
                zoneId,
            },
        });
        return result.data;
    };
    /**
     * 查询省份列表
     * @param {string} creator
     * @returns
     */
    async getProvinceList(creator, zoneObj) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'province_id', hasAdditionZone: false, ...zoneObj });
        return result;
    }
    /**
     * 查询专业列表
     * @param {string} creator
     * @returns
     */
    async getProfessionList(creator) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'professional_type' });
        return result;
    }

    /**
     * 查询sheet status
     * @param {string} creator
     * @returns
     */
    async getSheetStatus(creator) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'sheet_status' });
        return result;
    }

    // 获取追加条件选项
    async getAdditionClauses() {
        const result = await request('alarmmodel/filter/v1/recovery/field', {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
        });
        return result?.data;
    }

    /**
     * 新增过滤器
     * @param {Object} data
     * @returns
     */
    async addFilter(data, params) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'post',
            baseUrlType,
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 新增过滤器
     * @param {Object} data
     * @returns
     */
    async editFilter(data, params) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'put',
            baseUrlType,
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 获取告警中断监控列表
     * @param {Object} data
     * @returns
     */
    async getInterruptMonitorList(data) {
        const result = await request(`alarmmodel/filter/v1/filters?${qs.stringify(data)}`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
        });
        return result;
    }

    /**
     *
     * @param {Object} data
     * @param {Object} data.filterId
     * @param {Object} data.moduleId
     * @param {Object} data.modelId
     * @param {Object} data.modifier
     * @returns
     */
    async deleteInterrupt(data, params) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'delete',
            baseUrlType,
            defaultSuccessMessage: '删除成功',
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 获取已有过滤器列表
     * @param {Object} data
     * @param {string} data.creator
     * @param {number} data.modelId
     * @param {number} data.moduleId
     * @param {number} data.current
     * @param {number} data.pageSize
     * @returns
     */
    async getFilterList(data) {
        const result = await request(`alarmmodel/filter/v1/filters`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            data,
        });
        return result?.data;
    }

    /**
     * 获取已有过滤器列表(只有id和名称)
     * @param {Object} data
     * @param {string} data.creator
     * @param {number} data.modelId
     * @param {number} data.moduleId
     * @param {number} data.current
     * @param {number} data.pageSize
     * @returns
     */
    async getFilterNameList(data) {
        const result = await request(`interruptalarm/filter/v1/filters`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            data,
        });
        return result?.data;
    }

    /**
     * 获取过滤器详情
     * @param {Object} data
     * @param {Object} data.modelId
     * @param {Object} data.moduleId
     * @param {Object} data.filterId
     * @returns
     */
    async getFilterDetail(data) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
            data,
        });
        return result?.data;
    }

    /**
     * 获取告警中断监控查看列表
     * @param {Object} data
     * @param {Object} data.current
     * @param {Object} data.pageSize
     * @param {Object} data.filterId
     * @returns
     */
    async getInterruptTable(data) {
        const result = await request('interruptalarm/filter/v1/filterProcess', {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            data,
        });
        return result;
    }

    async professionalAndObjectTypes(data) {
        const result = await request('sysadminAlarm/ProfessionalAndObjectTypes', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            data,
        });
        return result.data;
    }
}

export const filterApi = new FilterApi();
