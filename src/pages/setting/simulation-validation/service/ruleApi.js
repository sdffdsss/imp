import request from '@Common/api';
import qs from 'qs';

const baseUrlType = 'ruleUrl';

class RuleApi {
    async getRules(params) {
        const result = await request('correlation/v1/rules', {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                ...params,
                modelId: 2,
            },
        });
        return result;
    }

    async deleteRules(data, params) {
        const result = await request('correlation/v1/rule', {
            type: 'delete',
            baseUrlType,
            defaultSuccessMessage: '删除成功',
            defaultErrorMessage: '删除失败',
            data: {
                ...data,
                modelId: 2,
            },
            handlers: {
                params,
            },
        });
        return result;
    }

    async ruleXmlDownload(ruleId, ruleVersion) {
        const blob = await request('correlation/v1/rules/published/xmlDownload', {
            type: 'get',
            showSuccessMessage: false,
            baseUrlType,
            defaultErrorMessage: '下载失败!',
            responseType: 'blob',
            data: { ruleId, ruleVersion },
        });
        return blob;
    }

    async getSimulationRules(params) {
        const result = await request('alarmmodel/filter/v1/filters', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                ...params,
                modelId: 2,
                moduleId: 10,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        });
        return result;
    }

    /**
     * 获取关联告警告警字段
     * @param {Object} data
     * @param {number} data.current
     * @param {number} data.pageSize
     * @param {number} data.ruleId
     */
    async getHandleAlarm(data) {
        const result = await request(`correlation/v1/alarms`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    /**
     * 添加仿真验证
     * @param {Object} correlationRuleSimulationBo 传递参数
     * @param {string} correlationRuleSimulationBo.alarmStartTime 告警开始时间
     * @param {string} correlationRuleSimulationBo.alarmEndTime 告警结束时间
     * @param {string} correlationRuleSimulationBo.creator 创建人
     * @param {number} correlationRuleSimulationBo.origin 数据来源 1-从实时告警 2-从告警库
     * @param {number} correlationRuleSimulationBo.sendStrategy 发送策略 1-按历史告警活动时间间隔发送 2-按活动告警活动时间间隔发送
     * @param {number} correlationRuleSimulationBo.type 类型 1-模拟验证 2-回归验证
     * @param {string} correlationRuleSimulationBo.createProvinceId 省份id
     * @param {string} correlationRuleSimulationBo.createProvinceName 省份名称
     * @param {Object[]} recordList 规则列表
     * @param {number} recordList[].ruleId 规则id
     * @param {string} recordList[].ruleName 规则名称
     * @returns
     */
    async addValidator(correlationRuleSimulationBo, recordList, params) {
        const result = await request('dispatch/v1/ruleSimulation', {
            type: 'post',
            baseUrlType: 'ruleSimulationUrl',
            data: {
                recordList,
                correlationRuleSimulationBo,
            },
            handlers: {
                params,
            },
            showSuccessMessage: false,
        });
        return result?.data;
    }

    /**
     * 获取仿真验证历史列表
     * @param {Object} params
     * @param {number} params.pageNum 当前页页数 起始页为0
     * @param {number} params.pageSize 每页数量
     * @param {string} params.ruleName 规则名称
     * @param {string} params.startTime 开始验证时间
     * @param {string} params.endTime 结束验证时间
     * @param {string} params.status 验证状态 0-进行中 1-已完成
     * @param {string} params.type 类型 1-模拟验证 2-回归验证
     * @returns
     */
    async getValidatorList(params) {
        const { startTime = '', endTime = '', ...data } = params;
        const result = await request(`dispatch/v1/ruleSimulation?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`, {
            type: 'get',
            baseUrlType: 'ruleSimulationUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    /**
     * 获取验证详情
     * @param {string} recordId
     * @returns
     */
    async getValidatorDetail(recordId) {
        const result = await request('dispatch/v1/ruleSimulationDetail', {
            type: 'get',
            baseUrlType: 'ruleSimulationUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { recordId },
        });
        return result && result.data;
    }

    /**
     * 删除仿真验证历史
     * @param {Object} data
     * @param {number} data.recordId 仿真验证结果记录id  必填
     * @param {number} data.ruleId 规则id 必填
     * @param {number} data.simulationId 仿真验证id 必填
     * @param {number} data.type 验证类型 必填  1-模拟验证 2-回归验证
     * @returns
     */
    async deleteValidator(data, params) {
        const result = await request('dispatch/v1/ruleSimulation', {
            type: 'delete',
            baseUrlType: 'ruleSimulationUrl',
            defaultSuccessMessage: '删除成功',
            defaultErrorMessage: '删除失败',
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 获取自定义字段列表
     * @param {string} ruleId
     * @returns
     */
    async getCustomFields(ruleId) {
        const result = await request('correlation/v1/alarm/customFields', {
            type: 'get',
            baseUrlType,
            defaultErrorMessage: '获取数据失败',
            data: { ruleId },
        });
        return result?.data || [];
    }

    /**
     *
     * @param {string} recordId
     * @returns
     */
    async downloadValidateXml(recordId) {
        const result = await request('correlation/v1/ruleSimulation/xmlDownload', {
            type: 'get',
            baseUrlType,
            defaultErrorMessage: '下载失败',
            defaultSuccessMessage: '下载成功',
            responseType: 'blob',
            data: { recordId },
        });
        return result;
    }

    /**
     *
     * @param {number} recordId
     * @param {number} ruleId
     */
    async cancelValidate(recordId, ruleId, params) {
        const result = await request('dispatch/v1/ruleSimulation/cancelValidation', {
            type: 'get',
            baseUrlType: 'ruleSimulationUrl',
            defaultErrorMessage: '取消失败',
            defaultSuccessMessage: '取消成功',
            data: { recordId, ruleId },
            handlers: {
                params,
            },
        });
        return result.data;
    }

    /**
     * 获取仿真验证进度
     * @param {number} recordId
     * @returns
     */
    async getSimulationPercent(recordId) {
        const result = await request('dispatch/v1/ruleSimulation/schedule', {
            type: 'get',
            baseUrlType: 'ruleSimulationUrl',
            defaultErrorMessage: '获取验证进度失败',
            data: { recordId },
        });
        return result.data;
    }

    /**
     * 添加关联模式
     * @param {Object} correlationRelation
     * @param {string} relationType
     * @returns
     */
    async addRelation(correlationRelation, relationType, params) {
        const result = await request('correlation/v1/relation', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '保存成功',
            data: {
                relationType,
                correlationRelation,
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                },
            },
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async addRelationAlarm(data) {
        const result = await request('correlation/v1/relation/alarm', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存失败',
            data: { correlationRelationRecord: data },
        });
        return result;
    }

    async editRelationAlarm(data) {
        const result = await request('correlation/v1/relation/alarm', {
            type: 'put',
            baseUrlType,
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存失败',
            data: { correlationRelationRecord: data },
        });
        return result;
    }

    async addDragRelation(data, params) {
        const result = await request('correlation/v1/drag/relation', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存失败',
            data,
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async editDragRelation(data, params) {
        const result = await request('correlation/v1/drag/relation', {
            type: 'put',
            baseUrlType,
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存失败',
            data,
            handlers: {
                params,
            },
        });
        return result.data;
    }

    /**
     * 编辑关联模式
     * @param {Object} correlationRelation
     * @param {string} relationType
     * @returns
     */
    async editRelation(correlationRelation, relationType, params) {
        const result = await request('correlation/v1/relation', {
            type: 'put',
            baseUrlType,
            defaultSuccessMessage: '保存成功',
            data: {
                relationType,
                correlationRelation,
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                },
            },
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 获取质量监控列表
     * @param {Object} data
     * @param {string} data.alarmTitle 告警标题
     * @param {string} data.startTime 开始时间
     * @param {string} data.endTime 结束时间
     * @param {string} data.specialty 专业
     * @param {string} data.province 省份
     * @param {string} data.ruleName 关联规则名称
     * @param {string} data.relationType 关联类型
     * @param {string} data.vendor 厂家
     */
    async getQuailtyControlList(params) {
        const result = await request(`correlation/v1/monitoring/alarms?${qs.stringify(params)}`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
        });
        return result;
    }

    /**
     *
     * @param {string} ruleId
     * @param {string} ruleVersion
     */
    async getQualityControlXml(ruleId, ruleVersion) {
        const result = await request('correlation/v1/rules/published/getXmlInfo', {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取XML内容失败',
            data: { ruleId, ruleVersion },
        });
        return result.data;
    }

    /**
     * 质量监控导出
     * @param {Object} data
     * @param {string} data.alarmTitle 告警标题
     * @param {string} data.startTime 开始时间
     * @param {string} data.endTime 结束时间
     * @param {string} data.specialty 专业
     * @param {string} data.province 省份
     * @param {string} data.ruleName 关联规则名称
     * @param {string} data.relationType 关联类型
     * @param {string} data.vendor 厂家
     */
    async quailtyControlExport(data, params) {
        const result = await request(`correlation/v1/monitoring/export?${qs.stringify(data)}`, {
            type: 'get',
            baseUrlType,
            defaultSuccessMessage: '导出成功',
            defaultErrorMessage: '导出失败',
            responseType: 'blob',
            handlers: {
                params,
            },
        });
        return result;
    }

    // 获取质量监控专业列表
    async getQuailtyNetWorkType() {
        const result = await request('correlation/v1/monitoring/specialties', {
            type: 'get',
            baseUrlType,
            defaultErrorMessage: '获取数据失败',
        });
        return result.data || [];
    }

    /**
     * 获取规则详情
     * @param {number} ruleId
     * @returns
     */
    async getRuleDetail(ruleId) {
        const result = await request('correlation/v1/drag/queryAllRuleInfo', {
            type: 'get',
            baseUrlType,
            defaultErrorMessage: '获取数据失败',
            data: { ruleId },
        });
        return result?.data;
    }

    /**
     * 获取公用字段
     * @param {Object} data
     * @param {number} data.current
     * @param {number} data.pageSize
     * @param {number} data.ruleId
     * @param {string} data.createProvinceId
     * @param {string} data.fieldLabel
     */
    async getCommonFields(data) {
        const result = await request(`correlation/v1/alarm/fields`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    /**
     * 获取已选择字段
     * @param {Object} data
     * @param {number} data.current
     * @param {number} data.pageSize
     * @param {number} data.ruleId
     * @param {string} data.createProvinceId
     * @param {string} data.fieldLabel
     */
    async getAssignFields(data) {
        const result = await request('correlation/v1/alarm/assignFields', {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            data,
        });
        return result;
    }

    async addField(data, params) {
        const result = await request(`correlation/v1/alarm/field`, {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { correlationAlarmFieldList: data },
            handlers: {
                params,
            },
        });
        return result;
    }

    async addFieldValue(data, params) {
        const result = await request(`correlation/v1/alarm/field/value`, {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { correlationAlarmFieldValue: data },
            handlers: {
                params,
            },
        });
        return result;
    }

    async editFieldValue(data, params) {
        const result = await request(`correlation/v1/alarm/field/value`, {
            type: 'put',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { correlationAlarmFieldValue: data },
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 添加关联告警
     * @param {Object} data
     * @param {string} data.alarmAlias
     * @param {number} data.alarmDuration
     * @param {number} data.alarmDurationUnit
     * @param {number} data.alarmFilterId
     * @param {string} data.equipType
     * @param {string} data.networkType
     * @param {string} data.vendorId
     * @param {string} data.vendorId
     * @returns
     */
    async addAlarm(data, params) {
        const result = await request(`correlation/v1/alarm`, {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { correlationAlarm: data },
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     *
     * @param {number} alarmId
     * @returns
     */
    async removeAlarm(alarmId, params) {
        const result = await request(`correlation/v1/alarm`, {
            type: 'delete',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '删除失败',
            data: { alarmId },
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 删除关联模式
     * @param {number} relationId
     * @returns
     */
    async removeRelation(relationId, params) {
        const result = await request(`correlation/v1/relation`, {
            type: 'delete',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '删除失败',
            data: { relationId },
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 添加关联告警
     * @param {Object} data
     * @param {string} data.alarmAlias
     * @param {number} data.alarmDuration
     * @param {number} data.alarmDurationUnit
     * @param {number} data.alarmFilterId
     * @param {string} data.equipType
     * @param {string} data.networkType
     * @param {string} data.vendorId
     * @param {string} data.vendorId
     * @returns
     */
    async editAlarm(data, params) {
        const result = await request(`correlation/v1/alarm`, {
            type: 'put',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { correlationAlarm: data },
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     *
     * @param {Object} data
     * @param {string} data.fieldName
     * @param {number} data.ruleId
     * @returns
     */
    async deleteFieldValue(data, params) {
        const result = await request(`correlation/v1/alarm/field/value`, {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '删除成功',
            defaultErrorMessage: '获取数据失败',
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    async editField(data) {
        const result = await request(`correlation/v1/alarm/field`, {
            type: 'put',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { correlationAlarmFieldList: data },
        });
        return result;
    }

    /**
     * 获取公用字段
     * @param {Object} data
     * @param {number} data.current
     * @param {number} data.pageSize
     * @param {number} data.ruleId
     * @param {string} data.createProvinceId
     * @param {string} data.fieldLabel
     */
    async getRuleCustomFields(data) {
        const result = await request(`correlation/v1/alarm/field/values`, {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: data,
        });
        return result;
    }

    async saveRuleBasicInfo(data, params) {
        const result = await request(`correlation/v1/rule`, {
            type: 'post',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存数据失败',
            data: {
                correlationRule: data,
            },
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async editRuleBasicInfo(data, params) {
        const result = await request(`correlation/v1/rule`, {
            type: 'put',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存数据失败',
            data: {
                correlationRule: data,
            },
            handlers: {
                params,
            },
        });
        return result;
    }

    /**
     * 获取导入XML列表
     * @param {Object} data
     * @param {string} data.startTime
     * @param {string} data.endTime
     * @param {number} data.pageSize
     * @param {number} data.current
     * @param {number} data.createProvinceId
     * @returns
     */
    async getXmlImportList(data) {
        const result = await request(`correlation/v1/monitoring/queryUploadLog?${qs.stringify(data)}`, {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
        });
        return result;
    }

    /**
     * 删除导入XML日志
     * @param {number} importId
     * @returns
     */
    async deleteXmlImportLog(importId, params) {
        const result = await request(`correlation/v1/monitoring/deleteLog`, {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
            handlers: {
                params,
            },
            data: { importId },
        });
        return result;
    }

    /**
     * 导入XML
     * @param {Object} data
     * @param {number} data.createProvinceId 创建人所属集团或省份id
     * @param {string} data.createProvinceName 创建人所属集团或省份名称
     * @param {string} data.creator 创建人ID
     * @param {FormData} data.multipartFile 文件
     * @param {number} data.orginType 所属组织类型 1-集团 2-省内
     * @param {string} data.uploadStrategy 上传策略  0：不替换   1：替换
     * @returns
     */
    async importXml(data, params) {
        const result = await request(`correlation/v1/monitoring/uploadFile`, {
            type: 'post',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '任务创建成功',
            defaultErrorMessage: '任务创建失败',
            handlers: {
                params,
            },
            data,
        });
        return result;
    }

    /**
     * 获取导入XML详情
     * @param {Object} data
     * @param {number} data.importId 导入id
     * @param {number} data.pageSize
     * @param {number} data.current
     * @returns
     */
    async getImportXmlDetail(data) {
        const result = await request(`correlation/v1/monitoring/queryDetail`, {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
            data,
        });
        return result;
    }

    /**
     * 获取规则版本列表
     * @param {number} ruleId
     * @returns
     */
    async getRuleVersions(ruleId) {
        const result = await request(`correlation/v1/rules/published/getRuleVersionInfo`, {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
            data: { ruleId },
        });
        return result.data;
    }

    /**
     * 全量保存规则
     * @param {Object} data
     * @returns
     */
    async saveRuleAllInfo(data, params) {
        const result = await request(`correlation/v1/drag/updateRuleInfo`, {
            type: 'post',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data,
            handlers: {
                params,
            },
        });
        return result.data;
    }

    /**
     * 全量编辑规则
     * @param {Object} data
     * @returns
     */
    async editRuleAllInfo(data) {
        const result = await request(`correlation/v1/drag/updateRuleInfo`, {
            type: 'put',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存失败',
            data,
        });
        return result.data;
    }

    /**
     *
     * @param {Object} data
     * @param {number} data.pageNum
     * @param {number} data.pageSize
     * @param {number} data.ruleId
     * @param {string} data.createProvinceId
     */
    async getStatIndexs(data) {
        const result = await request('correlation/v1/statIndexs', {
            type: 'GET',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            data,
        });
        return result.data;
    }

    /**
     * 删除衍生告警
     * @param {number} generateAlarmId
     * @returns
     */
    async removeGenerateAlarm(generateAlarmId, params) {
        const result = await request('correlation/v1/generateAlarm', {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '删除成功',
            data: { generateAlarmId },
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async saveAllGenerateAlarmInfo(data, params) {
        const result = await request('correlation/v1/drag/generateAlarm', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '保存成功',
            data,
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async editAllGenerateAlarmInfo(data, params) {
        const result = await request('correlation/v1/drag/generateAlarm', {
            type: 'put',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '保存成功',
            data,
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async getRuleMonitoring(data) {
        const result = await request('correlation/v1/run/rule/monitoring', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async getRuleMonitorLog(data) {
        const result = await request('correlation/v1/run/rule/queryLogDetail', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    // 公共关联字段新增
    async publicAddField(data) {
        const result = await request('correlation/v1/alarm/model/addField', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result.data;
    }

    // 公共关联字段编辑
    async publicUpdateField(data) {
        const result = await request('correlation/v1/alarm/model/updateField', {
            type: 'put',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result.data;
    }

    // 公共关联字段删除
    async publicDeleteField(fieldId) {
        const result = await request('correlation/v1/alarm/model/deleteField', {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { fieldId },
        });
        return result.data;
    }

    // 公共关联字段下载模板
    async templateDownload() {
        const result = await request('correlation/v1/alarm/model/templateDownload', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '下载失败',
            defaultSuccessMessage: '下载成功',
            responseType: 'blob',
        });
        return result;
    }

    // 公共关联字段文件导入
    async uploadFile(data) {
        const result = await request('correlation/v1/alarm/model/uploadFile', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async getMonitoringAlarmCount(data) {
        const result = await request('correlation/v1/monitoring/subAlarmCount', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result.data;
    }

    async getMonitoringAlarmDetail(data) {
        const result = await request('correlation/v1/monitoring/subAlarmInfo', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result.data;
    }

    async queryRuleInfo(ruleId, provinceId) {
        const result = await request('correlation/v1/rule/queryRuleInfo', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { ruleId, provinceId },
        });
        return result.data;
    }

    async downloadXmlAll(ruleDelInfos, params) {
        const result = await request('correlation/v1/rules/published/xmlBatchDownload', {
            type: 'post',
            responseType: 'blob',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '下载失败',
            data: { ruleDelInfos },
            handlers: {
                params,
            },
        });
        return result;
    }

    async getRegionNameList(provinceId) {
        const result = await request('correlation/v1/monitoring/getRegions', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { provinceId },
        });
        return result.data;
    }

    async addAIRule(corrRuleAiExcavateInfo, params) {
        const result = await request('correlation/v1/excavate', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { corrRuleAiExcavateInfo },
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async editAIRule(corrRuleAiExcavateInfo, params) {
        const result = await request('correlation/v1/excavate', {
            type: 'put',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存失败',
            data: { corrRuleAiExcavateInfo },
            handlers: {
                params,
            },
        });
        return result.data;
    }

    async getAIRules(data) {
        const result = await request('correlation/v1/excavates', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async deleteAIRules(excavateId, userId, params) {
        const result = await request('correlation/v1/excavate', {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '删除失败',
            handlers: {
                params,
            },
            data: { excavateId, userId },
        });
        return result;
    }

    async getRuleIds(userProvinceId, ruleType) {
        const result = await request('correlation/v1/similarity/allRules', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { userProvinceId, ruleType },
        });
        return result.data;
    }

    async getSimilarityRules(data) {
        const result = await request('correlation/v1/similarity/rules', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async addSimilarity(ruleSimilarityInfo) {
        const result = await request('correlation/v1/similarity', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            defaultSuccessMessage: '创建成功',
            defaultErrorMessage: '创建失败',
            data: { ruleSimilarityInfo },
        });
        return result.data;
    }

    async getSimilarities(data) {
        const result = await request('correlation/v1/similarities', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async deleteSimilarity(similarityId, userId) {
        const result = await request('correlation/v1/similarity', {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '删除失败',
            data: { similarityId, userId },
        });
        return result;
    }

    async getSimilarityRecords(data) {
        const result = await request('correlation/v1/similarity/records', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async getSimilarityDetail(data) {
        const result = await request('correlation/v1/similarity/detail', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result.data;
    }

    async getAiDetailRules(data) {
        const result = await request('correlation/v1/excavate/getRules', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async getAiDetail(taskId, alarmRuleId) {
        const result = await request('correlation/v1/excavate/getRule', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { taskId, alarmRuleId },
        });
        return result;
    }

    async deleteAiDetail(taskId, alarmRuleId, params) {
        const result = await request('correlation/v1/excavate/deleteRule', {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '删除失败',
            defaultSuccessMessage: '删除成功',
            data: { taskId, alarmRuleId },
            handlers: {
                params,
            },
        });
        return result;
    }

    async getSharedRules(data) {
        const result = await request('correlation/v1/shares', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            showSuccessMessage: false,
            data,
        });
        return result;
    }

    async quoteRules(data, params) {
        const result = await request('correlation/v1/share/quote', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            defaultSuccessMessage: '引用成功',
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    async quoteAiRules(data, params) {
        const result = await request('correlation/v1/share/ai/quote', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            defaultSuccessMessage: '引用成功',
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    async shareRule(data, params) {
        const result = await request('correlation/v1/share', {
            type: 'post',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '共享失败',
            defaultSuccessMessage: '共享成功',
            data,
            handlers: {
                params,
            },
        });
        return result;
    }

    async cancelRule(ruleId, ruleVersion, userId, source, params) {
        const result = await request('correlation/v1/share/cancel', {
            type: 'delete',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '取消共享失败',
            defaultSuccessMessage: '取消共享成功',
            data: { ruleId, userId, ruleVersion, source },
            handlers: {
                params,
            },
        });
        return result;
    }

    async viewShareRule(data) {
        const result = await request('correlation/v1/share/ruleInfo', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            showSuccessMessage: false,
            data,
        });
        return result.data;
    }

    async getAllProvince() {
        const result = await request('correlation/v1/share/provinces', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            showSuccessMessage: false,
        });
        return (result.data || []).map((item) => ({ label: item.zone_name, value: item.zone_id }));
    }

    async getGenerateAlarm(data) {
        const result = await request('correlation/v1/generateAlarm/fields', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            showSuccessMessage: false,
            data,
        });
        return result.data;
    }

    async getAllFields(ruleId) {
        const result = await request('correlation/v1/alarm/model/selectAllField', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            showSuccessMessage: false,
            data: { ruleId },
        });
        return result.data;
    }

    async getAITaskList(data) {
        const result = await request('correlation/v1/excavates/queue', {
            type: 'get',
            baseUrlType: 'ruleUrl',
            defaultErrorMessage: '获取数据失败',
            showSuccessMessage: false,
            data,
        });
        return result;
    }
}

export const ruleApi = new RuleApi();
