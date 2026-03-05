import request from '@Src/common/api';

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
    getDictEntry = async (data, isSelect = false) => {
        const { modelId, creator, pageSize, dictName } = data;
        const result = await request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize,
                dictName,
                en: false,
                modelId,
                creator,
            }
        });
        return isSelect ? result.data.map(item => ({ label: item.value, value: item.key })) : result.data;
    };

    /**
     * 查询专业列表
     * @param {string} creator 
     * @param {boolean} isSelect 
     * @returns 
     */
    async getProfessionList(creator, isSelect = false) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'professional_type' }, isSelect);
        return result;
    }

    /**
     * 查询厂家列表
     * @param {string} creator 
     * @param {boolean} isSelect
     * @returns 
     */
    async getVendorList(creator, isSelect = false) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'vendor_id' }, isSelect);
        return result;
    }

    /**
     * 查询设备类型列表
     * @param {string} creator 
     * @param {boolean} isSelect
     * @returns 
     */
    async getEquipTypeList(creator, isSelect = false) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'eqp_object_class' }, isSelect);
        return result;
    }

    /**
     * 查询省份列表
     * @param {string} creator 
     * @param {boolean} isSelect 
     * @returns 
     */
    async getProvinces(creator, needGroup, isSelect = false) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'province_id' }, isSelect);
        if (!needGroup) {
            const key = isSelect ? 'value' : 'key'
            const index = result.findIndex(item => item[key] === '0');
            if (index !== -1) {
                result.splice(index, 1);
            }
        }
        return result;
    }

    async getRegions(creator, needGroup, isSelect = false) {
        const result = await this.getDictEntry({ modelId: 2, pageSize: 2500, creator, dictName: 'region_id' }, isSelect);
        if (!needGroup) {
            const key = isSelect ? 'value' : 'key';
            const index = result.findIndex(item => item[key] === '1');
            if (index !== -1) {
                result.splice(index, 1);
            }
        }
        return result;
    }

    /**
     * 添加过滤器
     * @param {Object} data 
     * @returns 
     */
    async addFilter(data) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            data: { alarmModelFilter: data },
        });
        return result.data;
    }

    /**
     * 修改过滤器
     * @param {Object} data 
     * @returns 
     */
    async editFilter(data) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'put',
            baseUrlType,
            showSuccessMessage: false,
            data: { alarmModelFilter: data },
        });
        return result.data;
    }

    /**
     * 获取规则条件详情
     * @param {number} filterId 
     */
    async getFilterData(filterId) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            data: {
                filterId,
                modelId: 2,
                moduleId: 197,
            },
        });
        return result.data;
    }

    async getConditionList(ruleTypeId) {
        const result = await request('alarmmodel/filter/v1/filter/conditions', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                modelId: 2,
                ruleTypeId,
            }
        });
        return result.data || [];
    }

    async getFilter(filterId, modelId, moduleId) {
        const result = await request('alarmmodel/filter/v1/filter', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId,
                moduleId,
                filterId,
            },
        });
        return result.data;
    }

    async getAlarmFieldType(modelId) {
        const result = await request(`alarmmodel/field/v1/baseDataTypes`, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { modelId }
        });
        return result.data;
    };

    /**
     * 获取全量告警字段
     * @param {Object} data 
     * @param {number} data.modelId
     * @param {number} data.current
     * @param {number} data.pageSize
     * @returns 
     */
    async getAllAlarmFields(data) {
        const result = await request(`alarmmodel/field/v1/alarmModel/field`, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data
        });
        return result;
    }
}

export const filterApi = new FilterApi();
