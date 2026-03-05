import request from '@Src/common/api';
import qs from 'qs';

const baseUrlType = 'filterUrl';

// 规则组管理接口集
class RuleGroupApi {
    /**
     * 查询左边树一级节点列表
     * @param
     * @returns
     */
    async getLeftTreeData() {
        const result = await request('alarmmodel/groups/v1/group/type', {
            type: 'get',
            baseUrlType,
            data: {},
            // 是否需要显示失败消息提醒
            showErrorMessage: false
        });
        return result;
    }

    /**
     * 查询左边树二级节点列表
     * @param {Object} data
     * @param {Object} data.modelId
     * @param {Object} data.userId
     * @param {Object} data.businessId
     * @returns
     */
    async getTreeData(data) {
        const result = await request('alarmmodel/groups/v1/groups/tree', {
            type: 'get',
            baseUrlType,
            data,
            // 是否需要显示失败消息提醒
            showErrorMessage: false
        });
        return result;
    }

    /**
     * 删除
     * @param {Object} data
     * @param {Object} data.filterGroupNames
     * @param {Object} data.moduleId
     * @returns
     */
    async deleteRuleGroup(data) {
        const result = await request('alarmmodel/groups/v1/group', {
            type: 'delete',
            baseUrlType,
            // defaultSuccessMessage: '删除成功',
            data
        });
        return result;
    }

    /**
     * 查询点击左边树-右边列表
     * @param {Object} data
     * @param {Object} data.modelId
     * @param {Object} data.userId
     * @param {Object} data.businessId
     * @level {int} 判断类型级别
     * @returns
     */
    async getRuleGroups(data, level) {
        let url = '';
        if (level === 0) {
            url = 'alarmmodel/groups/v1/groups';
        }
        if (level === 1) {
            url = 'alarmmodel/groups/v1/group';
        }
        const result = await request(url, {
            type: 'get',
            baseUrlType,
            data,
            // 是否需要显示失败消息提醒
            showErrorMessage: false
        });
        return result;
    }

    /**
     * 导出列表数据
     * @url {string}
     * @returns
     */
    async exportRuleGroup(url) {
        const result = await request(url, {
            type: 'get',
            baseUrlType: 'filterUrl',
            // 是否需要显示失败消息提醒
            showErrorMessage: false,
            defaultErrorMessage: '导出失败，请检查服务',
            responseType: 'blob'
        });
        return result;
    }

    /**
     * 增加、编辑接口
     * @param {Object} data
     * @url {string}
     * @returns
     */
    async editRuleGroup(data, type) {
        const result = await request('alarmmodel/groups/v1/group', {
            type,
            baseUrlType,
            data,
            // 是否需要显示失败消息提醒
            showErrorMessage: true
        });

        return result;
    }

    /**
     * 节假日枚举接口
     * @param {Object} data
     * @url {string}
     * @returns
     */
    async getHolidaysEnum(data) {
        const url = `alarmmodel/filter/v1/filter/dispatch/holidays?${qs.stringify(data, {
            arrayFormat: 'indices',
            encode: true
        })}`;
        const result = await request(url, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false
        });
        return result;
    }
}

export const ruleGroupApi = new RuleGroupApi();
