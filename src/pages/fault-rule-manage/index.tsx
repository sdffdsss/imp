import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Modal, Icon, Select, Form, Radio, Input, Row, Col, Space, Table, Pagination } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import shareActions from '@Src/share/actions';
import { Api } from './api';
import { useSetState } from 'ahooks';
import AuthButton from '@Src/components/auth-button';
import useLoginInfoModel from '@Src/hox';
import FaultReport from '../fault-report';
import { getProvinceList, getZones } from '../fault-report/api';
import './index.less';

import ModalContent from './modalContent';
import NoticeTemplate from '@Components/notice-template';

// API数据字段名转换为表单字段名
const transformApiDataToForm = (apiData: any, noticeTemplateList: any[] = [], faultNoticeTemplateList: any[] = []) => {
    if (!apiData) return {};

    const transformedData = { ...apiData };

    // 根据模板ID获取模板内容
    const getTemplateContent = (templateId: string) => {
        // 如果模板ID为空、null或undefined，直接返回空字符串
        if (!templateId || templateId === 'null' || templateId === null) return '';
        // 使用宽松比较处理数字/字符串类型不匹配问题
        const template = noticeTemplateList.find((item) => item.templateId == templateId);
        return template ? template.templateContent || '' : '';
    };
    const getFaultTemplateContent = (templateId: string) => {
        // 如果模板ID为空、null或undefined，直接返回空字符串
        if (!templateId || templateId === 'null' || templateId === null) return '';
        // 使用宽松比较处理数字/字符串类型不匹配问题
        const template = faultNoticeTemplateList.find((item) => item.templateId == templateId);
        return template ? template.templateContent || '' : '';
    };

    const checkExist = (value: any) => {
        return noticeTemplateList.find((e) => Number(e.templateId) == Number(value));
    };
    const checkFaultExist = (value: any) => {
        return faultNoticeTemplateList.find((e) => Number(e.templateId) == Number(value));
    };

    // 根据模板ID获取模板内容用于显示
    transformedData.firstFaultDescribe = getTemplateContent(apiData.firstReportDescribe);
    transformedData.firstInfluenceScope = getTemplateContent(apiData.firstInfluenceScope);
    transformedData.firstCausesAnalysis = getTemplateContent(apiData.firstCausesAnalysis);
    transformedData.firstTreatmentMeasure = getTemplateContent(apiData.firstTreatmentMeasure);
    transformedData.firstBusinessRecovery = getTemplateContent(apiData.firstBusinessRecovery);
    transformedData.firstNotificationContent = getFaultTemplateContent(apiData.firstNotificationContent);

    transformedData.continueBusinessImpact = getTemplateContent(apiData.continueBusinessImpactScope);
    transformedData.continueInfluenceScope = getTemplateContent(apiData.continueInfluenceScope);
    transformedData.continueCausesAnalysis = getTemplateContent(apiData.continueCausesAnalysis);
    transformedData.continueTreatmentMeasure = getTemplateContent(apiData.continueTreatmentMeasure);
    transformedData.continueBusinessRecovery = getTemplateContent(apiData.continueBusinessRecoverProcess);
    transformedData.continueNotificationContent = getFaultTemplateContent(apiData.continueNotificationContent);

    transformedData.finalBusinessImpact = getTemplateContent(apiData.finalBusinessImpactScope);
    transformedData.finalInfluenceScope = getTemplateContent(apiData.finalInfluenceScope);
    transformedData.finalCausesAnalysis = getTemplateContent(apiData.finalCausesAnalysis);
    transformedData.finalTreatmentMeasure = getTemplateContent(apiData.finalTreatmentMeasure);
    transformedData.finalBusinessRecovery = getTemplateContent(apiData.finalBusinessRecoverProcess);
    transformedData.finalNotificationContent = getFaultTemplateContent(apiData.finalNotificationContent);

    // 设置模板ID用于下拉选择器的value
    transformedData.faultDescTemplateId = apiData.faultDescTemplate;

    // 首报模板ID
    transformedData.firstReportDescribeTemplateId = checkExist(+apiData.firstReportDescribe) ? +apiData.firstReportDescribe : '';
    transformedData.firstInfluenceScopeTemplateId = checkExist(+apiData.firstInfluenceScope) ? +apiData.firstInfluenceScope : '';
    transformedData.firstCausesAnalysisTemplateId = checkExist(+apiData.firstCausesAnalysis) ? +apiData.firstCausesAnalysis : '';
    transformedData.firstTreatmentMeasureTemplateId = checkExist(+apiData.firstTreatmentMeasure) ? +apiData.firstTreatmentMeasure : '';
    transformedData.firstBusinessRecoveryTemplateId = checkExist(+apiData.firstBusinessRecoverProcess) ? +apiData.firstBusinessRecoverProcess : '';
    transformedData.firstNotificationContentTemplateId = checkFaultExist(+apiData.firstNotificationContent)
        ? +apiData.firstNotificationContent || ''
        : '';

    // 为下拉选择器设置正确的字段名（与ReportFormSection中的state字段匹配）
    transformedData.causesAnalysis = apiData.firstCausesAnalysis;
    transformedData.treatmentMeasure = apiData.firstTreatmentMeasure;
    transformedData.influenceScope = apiData.firstInfluenceScope;

    // 续报模板ID - 修正字段映射
    transformedData.continueBusinessImpactTemplateId = checkExist(+apiData.continueBusinessImpactScope) ? +apiData.continueBusinessImpactScope : ''; // 修正：使用实际存在的字段
    transformedData.continueInfluenceScopeTemplateId = checkExist(+apiData.continueInfluenceScope) ? +apiData.continueInfluenceScope : '';
    transformedData.continueCausesAnalysisTemplateId = checkExist(+apiData.continueCausesAnalysis) ? +apiData.continueCausesAnalysis : '';
    transformedData.continueTreatmentMeasureTemplateId = checkExist(+apiData.continueTreatmentMeasure) ? +apiData.continueTreatmentMeasure : '';
    transformedData.continueBusinessRecoveryTemplateId = checkExist(+apiData.continueBusinessRecoverProcess)
        ? +apiData.continueBusinessRecoverProcess
        : '';
    transformedData.continueNotificationContentTemplateId = checkFaultExist(+apiData.continueNotificationContent)
        ? +apiData.continueNotificationContent || ''
        : '';

    // 终报模板ID - 修正字段映射
    transformedData.finalBusinessImpactTemplateId = checkExist(+apiData.finalBusinessImpactScope) ? +apiData.finalBusinessImpactScope : ''; // 修正：使用实际存在的字段
    transformedData.finalReportDescribeTemplateId = checkExist(+apiData.finalCausesAnalysis) ? +apiData.finalCausesAnalysis : ''; // 修正：使用实际存在的字段
    transformedData.finalInfluenceScopeTemplateId = checkExist(+apiData.finalInfluenceScope) ? +apiData.finalInfluenceScope : '';
    transformedData.finalCausesAnalysisTemplateId = checkExist(+apiData.finalCausesAnalysis) ? +apiData.finalCausesAnalysis : '';
    transformedData.finalTreatmentMeasureTemplateId = checkExist(+apiData.finalTreatmentMeasure) ? +apiData.finalTreatmentMeasure : '';
    transformedData.finalBusinessRecoveryTemplateId = checkExist(+apiData.finalBusinessRecoverProcess) ? +apiData.finalBusinessRecoverProcess : '';
    transformedData.finalNotificationContentTemplateId = checkFaultExist(+apiData.finalNotificationContent)
        ? +apiData.finalNotificationContent || ''
        : '';

    // 设置通知对象配置默认值
    // transformedData.continueNotificationConfig = apiData.continueNotificationConfig || 'auto';
    // transformedData.finalNotificationConfig = apiData.finalNotificationConfig || 'auto';

    // 处理LLM字段的null值，转换为默认值
    // Radio组件需要明确的true/false值，不能是null
    const llmFieldDefaults = {
        // 首报字段默认值
        whetherFirstFailureLevelLLM: true,
        whetherFirstRootSpecialtyLLM: true,
        whetherFirstReportDescribeLLM: true, // 根据业务逻辑调整
        whetherFirstInfluenceScopeLLM: true,
        whetherFirstCausesAnalysisLLM: true,
        whetherFirstTreatmentMeasureLLM: true,
        whetherFirstNoticeContentLLM: true,

        // 续报字段默认值
        whetherContinueFailureLevelLLM: true,
        whetherContinueRootSpecialtyLLM: true,
        whetherContinueBusinessImpactLLM: true,
        whetherContinueBusinessImpactScopeLLM: true,
        whetherContinueReportDescribeLLM: true,
        whetherContinueInfluenceScopeLLM: true,
        whetherContinueCausesAnalysisLLM: true,
        whetherContinueTreatmentMeasureLLM: true,
        whetherContinueBusinessRecoveryLLM: true,
        whetherContinueBusinessRecoverProcessLLM: true,
        whetherContinueIsEffectLLM: true,
        whetherContinueNoticeContentLLM: true,

        // 终报字段默认值
        whetherFinalFailureLevelLLM: true,
        whetherFinalRootSpecialtyLLM: true,
        whetherFinalBusinessImpactLLM: true,
        whetherFinalBusinessImpactScopeLLM: true,
        whetherFinalReportDescribeLLM: true,
        whetherFinalInfluenceScopeLLM: true,
        whetherFinalCausesAnalysisLLM: true,
        whetherFinalTreatmentMeasureLLM: true,
        whetherFinalBusinessRecoveryLLM: true,
        whetherFinalBusinessRecoverProcessLLM: true,
        whetherFinalIsEffectLLM: true,
        whetherFinalNoticeContentLLM: true,
    };

    // 将null的LLM字段转换为默认值
    Object.keys(llmFieldDefaults).forEach((field) => {
        if (transformedData[field] === null || transformedData[field] === undefined) {
            transformedData[field] = llmFieldDefaults[field];
        }
    });

    // 添加字段名映射，解决表单字段名与后端字段名不匹配的问题
    transformedData.whetherContinueBusinessImpactLLM =
        apiData.whetherContinueBusinessImpactScopeLLM ?? transformedData.whetherContinueBusinessImpactLLM;
    transformedData.whetherContinueBusinessRecoveryLLM =
        apiData.whetherContinueBusinessRecoverProcessLLM ?? transformedData.whetherContinueBusinessRecoveryLLM;
    transformedData.whetherFinalBusinessImpactLLM = apiData.whetherFinalBusinessImpactScopeLLM ?? transformedData.whetherFinalBusinessImpactLLM;
    transformedData.whetherFinalBusinessRecoveryLLM =
        apiData.whetherFinalBusinessRecoverProcessLLM ?? transformedData.whetherFinalBusinessRecoveryLLM;

    // 添加修改权限相关字段的映射
    transformedData.whetherfirstAllowModify = apiData.whetherFirstAllowModify ?? transformedData.whetherfirstAllowModify;
    transformedData.whethercontinueAllowModify = apiData.whetherContinueAllowModify ?? transformedData.whethercontinueAllowModify;
    transformedData.whetherfinalAllowModify = apiData.whetherFinalAllowModify ?? transformedData.whetherfinalAllowModify;

    // 添加修改审核相关字段的映射
    transformedData.firstRequiredModifyApproval = apiData.whetherFirstRequiredModifyApproval ?? transformedData.firstRequiredModifyApproval;
    transformedData.continueRequiredModifyApproval = apiData.whetherContinueRequiredModifyApproval ?? transformedData.continueRequiredModifyApproval;
    transformedData.finalRequiredModifyApproval = apiData.whetherFinalRequiredModifyApproval ?? transformedData.finalRequiredModifyApproval;

    return transformedData;
};

// 表单数据字段名转换为API数据字段名
const transformFormDataToApi = (formData: any, noticeTemplateList: any[] = [], faultNoticeTemplateList: any[] = []) => {
    if (!formData) return {};
    const getTemplateId = (templateContent: string) => {
        // 如果模板内容为空、null或undefined，直接返回空字符串
        if (!templateContent || templateContent === 'null' || templateContent === null) return '';
        // 使用宽松比较处理数字/字符串类型不匹配问题
        const template = noticeTemplateList.find((item) => item.templateContent == templateContent);
        return template ? template.templateId || '' : '';
    };
    const getFaultTemplateId = (templateContent: string) => {
        // 如果模板内容为空、null或undefined，直接返回空字符串
        if (!templateContent || templateContent === 'null' || templateContent === null) return '';
        // 使用宽松比较处理数字/字符串类型不匹配问题
        const template = faultNoticeTemplateList.find((item) => item.templateContent == templateContent);
        return template ? template.templateId || '' : '';
    };

    // 基础数据转换
    const transformedData = { ...formData };
    // 确保所有字段都有值（null或具体值），不发送undefined
    Object.keys(transformedData).forEach((key) => {
        if (transformedData[key] === undefined) {
            transformedData[key] = null;
        }
    });

    // JSON解析辅助函数，带错误处理
    const safeJSONParse = (value: any, fieldName: string) => {
        if (!value) return null;
        if (typeof value !== 'string') return value;

        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn(`JSON解析失败 - 字段: ${fieldName}, 值: ${value}`, error);
            return null;
        }
    };

    // 通知类型转换为逗号分隔字符串的辅助函数
    const parseNotificationType = (value: any, fieldName: string) => {
        if (!value) return null;

        let parsedValue = value;
        if (typeof value === 'string') {
            try {
                parsedValue = JSON.parse(value);
            } catch (error) {
                console.warn(`通知类型JSON解析失败 - 字段: ${fieldName}, 值: ${value}`, error);
                return null;
            }
        }

        if (Array.isArray(parsedValue)) {
            return parsedValue.join(',');
        }

        return parsedValue;
    };

    // 确保所有API必需字段都存在，如果表单中没有就使用API文档的默认值
    const requiredApiFields = {
        // 基础配置
        ruleId: transformedData.ruleId,
        whetherDelayReport: transformedData.whetherDelayReport ?? true,
        delayReportMinutes: transformedData.delayReportMinutes ?? 5,
        whetherGroupDisplay: transformedData.whetherGroupDisplay ?? false,

        // 首报配置
        whetherFirstAutoReport: transformedData.whetherFirstAutoReport ?? true,
        firstAutoReportMinutes: transformedData.firstAutoReportMinutes ?? 15,
        whetherFirstAllowModify: (transformedData as any).whetherfirstAllowModify ?? (transformedData as any).whetherFirstAllowModify ?? true, // 字段名映射：表单字段是小写f，API字段是大写F
        allowFirstModifyMinutes: transformedData.allowFirstModifyMinutes ?? 15,
        whetherFirstRequiredModifyApproval: (transformedData as any).firstRequiredModifyApproval ?? false,

        // 首报LLM字段 - 使用表单实际值，如果没有则用true（业务需求）
        whetherFirstFailureLevelLLM: transformedData.whetherFirstFailureLevelLLM ?? true,
        whetherFirstRootSpecialtyLLM: transformedData.whetherFirstRootSpecialtyLLM ?? true,
        whetherFirstReportDescribeLLM: transformedData.whetherFirstReportDescribeLLM ?? true,
        whetherFirstCausesAnalysisLLM: transformedData.whetherFirstCausesAnalysisLLM ?? true,
        whetherFirstInfluenceScopeLLM: transformedData.whetherFirstInfluenceScopeLLM ?? true,
        whetherFirstTreatmentMeasureLLM: transformedData.whetherFirstTreatmentMeasureLLM ?? true,

        // 首报内容字段 - 字段名映射
        // 首报字段 - 存储模板ID，使用原有字段名
        firstReportDescribe: transformedData.firstReportDescribeTemplateId ?? getTemplateId(transformedData.firstFaultDescribe) ?? null,
        firstInfluenceScope: transformedData.firstInfluenceScopeTemplateId ?? getTemplateId(transformedData.firstInfluenceScope) ?? null,
        firstCausesAnalysis: transformedData.firstCausesAnalysisTemplateId ?? getTemplateId(transformedData.firstCausesAnalysis) ?? null,
        firstTreatmentMeasure: transformedData.firstTreatmentMeasureTemplateId ?? getTemplateId(transformedData.firstTreatmentMeasure) ?? null,

        // 首报通知字段
        firstNotificationUser: transformedData.firstNotificationUser ?? null,
        firstNotificationType: parseNotificationType(transformedData.firstNotificationType, 'firstNotificationType'),
        firstNotificationDetailList: safeJSONParse(transformedData.firstNotificationDetailList, 'firstNotificationDetailList'),
        firstNotificationTel: transformedData.firstNotificationTel ?? null,
        firstNotificationContent:
            transformedData.firstNotificationContentTemplateId ?? getFaultTemplateId(transformedData.firstNotificationContent) ?? null,

        // 续报配置 - 独立默认值，不继承首报
        whetherContinueAutoReport: transformedData.whetherContinueAutoReport ?? true,
        continueAutoReportMinutes: transformedData.continueAutoReportMinutes ?? 15,
        whetherContinueAllowModify:
            (transformedData as any).whethercontinueAllowModify ??
            (transformedData as any).whetherContinueAllowModify ??
            transformedData.whetherAllowModify ??
            true, // 字段名映射：表单字段是小写c，API字段是大写C
        allowContinueModifyMinutes: transformedData.allowContinueModifyMinutes ?? 15,
        whetherContinueRequiredModifyApproval: (transformedData as any).continueRequiredModifyApproval ?? false,

        // 续报LLM字段 - 使用表单实际值，如果没有则用true（业务需求）
        whetherContinueFailureLevelLLM: transformedData.whetherContinueFailureLevelLLM ?? true,
        whetherContinueRootSpecialtyLLM: transformedData.whetherContinueRootSpecialtyLLM ?? true,
        whetherContinueReportDescribeLLM: transformedData.whetherContinueReportDescribeLLM ?? true,
        whetherContinueCausesAnalysisLLM: transformedData.whetherContinueCausesAnalysisLLM ?? true,
        whetherContinueInfluenceScopeLLM: transformedData.whetherContinueInfluenceScopeLLM ?? true,
        whetherContinueTreatmentMeasureLLM: transformedData.whetherContinueTreatmentMeasureLLM ?? true,
        whetherContinueBusinessImpactScopeLLM: transformedData.whetherContinueBusinessImpactLLM ?? true,
        whetherContinueBusinessRecoverProcessLLM: transformedData.whetherContinueBusinessRecoveryLLM ?? true,
        whetherContinueIsEffectLLM: transformedData.whetherContinueIsEffectLLM !== undefined ? transformedData.whetherContinueIsEffectLLM : true,

        // 续报内容字段 - 存储模板ID，使用原有字段名
        continueBusinessImpactScope:
            transformedData.continueBusinessImpactTemplateId ?? getTemplateId(transformedData.continueBusinessImpact) ?? null,
        continueBusinessRecoverProcess:
            transformedData.continueBusinessRecoveryTemplateId ?? getTemplateId(transformedData.continueBusinessRecovery) ?? null,
        continueInfluenceScope: transformedData.continueInfluenceScopeTemplateId ?? getTemplateId(transformedData.continueInfluenceScope) ?? null,
        continueCausesAnalysis: transformedData.continueCausesAnalysisTemplateId ?? getTemplateId(transformedData.continueCausesAnalysis) ?? null,
        continueTreatmentMeasure:
            transformedData.continueTreatmentMeasureTemplateId ?? getTemplateId(transformedData.continueTreatmentMeasure) ?? null,

        // 续报通知字段
        continueNotificationUser: transformedData.continueNotificationUser ?? null,
        continueNotificationType: parseNotificationType(transformedData.continueNotificationType, 'continueNotificationType'),
        continueNotificationDetailList: safeJSONParse(transformedData.continueNotificationDetailList, 'continueNotificationDetailList'),
        continueNotificationTel: transformedData.continueNotificationTel ?? null,
        continueNotificationContent:
            transformedData.continueNotificationContentTemplateId ?? getFaultTemplateId(transformedData.continueNotificationContent) ?? null,
        continueNotificationConfig: transformedData.continueNotificationConfig ?? 'auto',

        // 终报配置 - 独立默认值，不继承首报
        whetherFinalAutoReport: transformedData.whetherFinalAutoReport ?? true,
        finalAutoReportMinutes: transformedData.finalAutoReportMinutes ?? 15,
        whetherFinalAllowModify:
            (transformedData as any).whetherfinalAllowModify ??
            (transformedData as any).whetherFinalAllowModify ??
            transformedData.whetherAllowModify ??
            true, // 字段名映射：表单字段是小写f，API字段是大写F
        allowFinalModifyMinutes: transformedData.allowFinalModifyMinutes ?? 15,
        whetherFinalRequiredModifyApproval: (transformedData as any).finalRequiredModifyApproval ?? false,

        // 终报LLM字段 - 使用表单实际值，如果没有则用true（业务需求）
        whetherFinalFailureLevelLLM: transformedData.whetherFinalFailureLevelLLM ?? true,
        whetherFinalRootSpecialtyLLM: transformedData.whetherFinalRootSpecialtyLLM ?? true,
        whetherFinalReportDescribeLLM: transformedData.whetherFinalReportDescribeLLM ?? true,
        whetherFinalCausesAnalysisLLM: transformedData.whetherFinalCausesAnalysisLLM ?? true,
        whetherFinalInfluenceScopeLLM: transformedData.whetherFinalInfluenceScopeLLM ?? true,
        whetherFinalTreatmentMeasureLLM: transformedData.whetherFinalTreatmentMeasureLLM ?? true,
        whetherFinalBusinessImpactScopeLLM: transformedData.whetherFinalBusinessImpactLLM ?? true,
        whetherFinalBusinessRecoverProcessLLM: transformedData.whetherFinalBusinessRecoveryLLM ?? true,
        whetherFinalIsEffectLLM: transformedData.whetherFinalIsEffectLLM !== undefined ? transformedData.whetherFinalIsEffectLLM : true,

        // 终报内容字段 - 存储模板ID，使用原有字段名
        finalBusinessImpactScope: transformedData.finalBusinessImpactTemplateId ?? getTemplateId(transformedData.finalBusinessImpact) ?? null,
        finalBusinessRecoverProcess: transformedData.finalBusinessRecoveryTemplateId ?? getTemplateId(transformedData.finalBusinessRecovery) ?? null,
        finalInfluenceScope: transformedData.finalInfluenceScopeTemplateId ?? getTemplateId(transformedData.finalInfluenceScope) ?? null,
        finalCausesAnalysis: transformedData.finalCausesAnalysisTemplateId ?? getTemplateId(transformedData.finalCausesAnalysis) ?? null,
        finalTreatmentMeasure: transformedData.finalTreatmentMeasureTemplateId ?? getTemplateId(transformedData.finalTreatmentMeasure) ?? null,

        // 终报通知字段
        finalNotificationUser: transformedData.finalNotificationUser ?? null,
        finalNotificationType: parseNotificationType(transformedData.finalNotificationType, 'finalNotificationType'),
        finalNotificationDetailList: safeJSONParse(transformedData.finalNotificationDetailList, 'finalNotificationDetailList'),
        finalNotificationTel: transformedData.finalNotificationTel ?? null,
        finalNotificationContent:
            transformedData.finalNotificationContentTemplateId ?? getFaultTemplateId(transformedData.finalNotificationContent) ?? null,
        finalNotificationConfig: transformedData.finalNotificationConfig ?? 'auto',

        // 通用字段

        whetherAllowModify: (transformedData as any).whetherfirstAllowModify ?? (transformedData as any).whetherFirstAllowModify ?? true,
        allowModifyMinutes: transformedData.allowFirstModifyMinutes ?? 15,
        whetherRequiredModifyApproval: (transformedData as any).firstRequiredModifyApproval ?? false,
        reportDescribe: transformedData.reportDescribe ?? null,
        causesAnalysis: transformedData.causesAnalysis ?? null,
        influenceScope: transformedData.influenceScope ?? null,
        treatmentMeasure: transformedData.treatmentMeasure ?? null,
    };

    return requiredApiFields;
};

const FaultRuleManage: React.FC = () => {
    const actionRef = useRef<any>();
    const cacheDataRef = useRef<any>([]);
    const mockDerivedRulesMapRef = useRef<Record<string, any[]>>({});
    const [visible, setVisible] = useState<boolean>(false);
    const [faultReportDerivedRuleId, setFaultReportDerivedRuleId] = useState<string | undefined>(undefined);
    const [noticeVisible, setNoticeVisible] = useState(false);
    const [ifNoticeType, setIfNoticeType] = useState(false);
    const [noticeTemplateList, setNoticeTemplateList] = useState([]);
    const [faultNoticeTemplateList, setFaultNoticeTemplateList] = useState([]);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [editReadonly, setEditReadonly] = useState<boolean>(false);
    const [editingRecord, setEditingRecord] = useState<any>();
    const [editForm] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);
    const [derivedPageState, setDerivedPageState] = useState<Record<string, { current: number; pageSize: number }>>({});
    const currentProvinceIdsRef = useRef<string[]>([]);
    const [pronvinceList, setPronvinceList] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>({});
    const [enums, setEnums] = useSetState({
        faultReportDerivedRuleProfessionalType: [],
        faultReportDerivedRuleType: [],
        faultReportDerivedRuleResource: [],
        faultReportDerivedRuleStatus: [],
        faultReportDerivedRuleReportStatus: [],
    });
    const getDerivedRuleStatusRank = (status: any) => {
        // 已启用 > 已停用
        const s = `${status}`;
        if (s === '1') return 0;
        return 1;
    };

    const getMockDerivedRules = (parent: any) => {
        const key = `${parent?.ruleId || ''}`;
        if (!key) return [];
        if (mockDerivedRulesMapRef.current[key]) return mockDerivedRulesMapRef.current[key];

        const provinceIds = pronvinceList?.map((e) => `${e.value}`) || [];
        const pickProvinceId = (i: number) => {
            if (!provinceIds.length) return '';
            return provinceIds[i % provinceIds.length];
        };

        const list = Array.from({ length: 12 }).map((_, idx) => {
            const provinceId = pickProvinceId(idx);
            const provinceName = pronvinceList?.find((e) => `${e.value}` === `${provinceId}`)?.label || '';
            const ruleStatus = idx % 3 === 0 ? '2' : '1';
            return {
                id: `${key}-${idx + 1}`,
                index: idx + 1,
                professionalType: parent?.professionalType ?? '1',
                ruleType: parent?.ruleType ?? '1',
                provinceId,
                provinceName,
                ruleName: `${parent?.ruleName || '规则'} - 衍生规则${idx + 1}`,
                ruleId: `${key}${String(idx + 1).padStart(2, '0')}`,
                ruleDescription: `【mock】${parent?.ruleDescription || ''}（衍生规则${idx + 1}）`,
                ruleStatus,
            };
        });

        mockDerivedRulesMapRef.current[key] = list;
        return list;
    };

    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            hideInSearch: true,
            width: 50,
            render: (val: any) => val,
        },
        {
            title: '规则名称',
            dataIndex: 'ruleName',
            width: 180,
            render: (val: any, row: any) => {
                const isExpanded = expandedRowKeys.includes(row?.ruleId);
                return (
                    <div
                        title={val}
                        className="ellipsis"
                        // style={{ color: '#1677ff', cursor: 'pointer' }}
                        // onClick={() => {
                        //     const key = row?.ruleId;
                        //     if (!key) return;
                        //     setExpandedRowKeys((prev) => {
                        //         if (prev.includes(key)) {
                        //             return prev.filter((e) => e !== key);
                        //         }
                        //         return [...prev, key];
                        //     });
                        // }}
                    >
                        {val}
                        {isExpanded ? '（收起）' : ''}
                    </div>
                );
            },
        },
        {
            title: '规则描述',
            dataIndex: 'ruleDescription',
            width: 180,
            render: (val: any) => {
                return (
                    <div title={val} className="ellipsis">
                        {val}
                    </div>
                );
            },
        },
        {
            title: '专业',
            dataIndex: 'professionalType',
            align: 'center',
            initialValue: [''],
            renderFormItem: () => (
                <Select
                    showSearch
                    mode="multiple"
                    options={enums.faultReportDerivedRuleProfessionalType?.filter((item: any) => item.value !== '16') || []}
                    optionFilterProp="label"
                />
            ),
            render: (val: any) => enums.faultReportDerivedRuleProfessionalType?.find((item: any) => item.value === `${val}`)?.label || '-',
        },
        {
            title: '规则类型',
            dataIndex: 'ruleType',
            align: 'center',
            initialValue: '',
            render: (val: any) => enums.faultReportDerivedRuleType?.find((item: any) => item.value === `${val}`)?.label || '-',
            renderFormItem: () => <Select showSearch options={enums.faultReportDerivedRuleType || []} optionFilterProp="label" />,
        },
        {
            title: '生效省份',
            dataIndex: 'provinceId',
            align: 'center',
            initialValue: '',
            render: (val: any, row) => {
                return (
                    <div title={row.provinceName} className="ellipsis">
                        {row.provinceName}
                    </div>
                );
            },
            renderFormItem: () => <Select showSearch options={pronvinceList} optionFilterProp="label" allowClear />,
        },
        {
            title: '上报规则状态',
            dataIndex: 'reportStatus',
            align: 'center',
            initialValue: '',
            render: (val: any) => enums.faultReportDerivedRuleReportStatus?.find((item: any) => item.value === `${val}`)?.label || '-',
            renderFormItem: () => <Select showSearch options={enums.faultReportDerivedRuleReportStatus || []} optionFilterProp="label" />,
        },
        {
            title: '已上报故障数',
            dataIndex: 'faultCount',
            align: 'center',
            hideInSearch: true,
            render: (val: any, row: any) => (
                <span
                    style={{ color: val === 0 ? '#000' : 'blue' }}
                    onClick={() => {
                        if (val) {
                            setFaultReportDerivedRuleId(row?.ruleId);
                            setVisible(true);
                        }
                    }}
                >
                    {val}
                </span>
            ),
        },
        {
            title: '上报规则启用时间',
            dataIndex: 'reportEnableTime',
            align: 'center',
            hideInSearch: true,
        },
        {
            title: '上报规则停用时间',
            dataIndex: 'reportDisableTime',
            align: 'center',
            hideInSearch: true,
        },
        {
            title: '规则来源',
            dataIndex: 'ruleSource',
            align: 'center',
            initialValue: '',
            render: (val: any) => enums.faultReportDerivedRuleResource?.find((item: any) => item.value === `${val}`)?.label || '-',
            renderFormItem: () => <Select showSearch options={enums.faultReportDerivedRuleResource || []} optionFilterProp="label" />,
        },
        {
            title: '故障识别规则状态',
            dataIndex: 'ruleStatus',
            align: 'center',
            width: 160,
            initialValue: '',
            render: (val: any) => enums.faultReportDerivedRuleStatus?.find((item: any) => item.value === `${val}`)?.label || '-',
            renderFormItem: () => <Select showSearch options={enums.faultReportDerivedRuleStatus || []} optionFilterProp="label" />,
        },
        {
            title: '规则id',
            dataIndex: 'ruleId',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'actions',
            valueType: 'option',
            fixed: 'right',
            width: 140,
            align: 'center',
            hideInSearch: true,
            render: (_: any, row: any) => [
                <AuthButton
                    type="text"
                    authKey="troubleshootingWorkbench:enableRule"
                    disabled={!checkEnable(row) || ifSwitchRegion || +row.ruleSource === 3}
                    title={row.reportStatus === 1 ? '停用上报规则' : '启用上报规则'}
                    onClick={() => {
                        Modal.confirm({
                            title: `提示`,
                            content: `是否确认${row.reportStatus === 1 ? '停用' : '启用'}规则?`,
                            okText: '确认',
                            okType: 'danger',
                            onOk: () => {
                                if (row.reportStatus === 1) {
                                    Api.disableFaultReportDerivedRule([row.ruleId]).then(() => {
                                        message.success('停用成功');
                                        actionRef.current?.reload?.();
                                    });
                                } else {
                                    Api.enableFaultReportDerivedRule([row.ruleId]).then(() => {
                                        message.success('启用成功');
                                        actionRef.current?.reload?.();
                                    });
                                }
                            },
                        });
                    }}
                >
                    <Icon antdIcon type={row.reportStatus === 1 ? 'PauseCircleOutlined' : 'PlayCircleOutlined'} />
                </AuthButton>,
                <Button
                    type="text"
                    authKey="troubleshootingWorkbench:ruleSetting"
                    title="配置规则"
                    // disabled={!checkEnable(row) || ifSwitchRegion}
                    onClick={() => {
                        editOrViewRule(row, 'edit');
                    }}
                >
                    <Icon antdIcon type="EditOutlined" />
                </Button>,
                <Button
                    type="text"
                    title="查看规则"
                    onClick={() => {
                        editOrViewRule(row, 'view');
                    }}
                >
                    <Icon antdIcon type="EyeOutlined" />
                </Button>,
            ],
        },
    ];
    const { actions, messageTypes } = shareActions;
    const { zoneLevelFlags, userId, currentZone, provinceId, container, userInfo } = useLoginInfoModel.data;
    const login = useLoginInfoModel();
    const ifSwitchRegion = JSON.parse(userInfo)?.zones[0]?.zoneId !== currentZone.zoneId && JSON.parse(userInfo)?.zones[0]?.zoneLevel !== '3';

    const request = async (_params: any) => {
        if (pronvinceList.length === 0) return;
        const params = {
            current: _params.current || 1,
            pageSize: _params.pageSize || 20,
            ruleId: _params.ruleId || undefined,
            ruleName: _params.ruleName || undefined,
            ruleDescription: _params.ruleDescription || undefined,
            ruleStatus: _params.ruleStatus ? [_params.ruleStatus] : undefined,
            professionalTypes: _params.professionalType?.filter((e) => !e).length === 1 ? undefined : _params.professionalType || undefined,
            ruleTypes: _params.ruleType ? [_params.ruleType] : undefined,
            ruleSources: _params.ruleSource ? [_params.ruleSource] : undefined,
            reportStatus: _params.reportStatus ? [_params.reportStatus] : undefined,
            provinceIds: _params.provinceId ? [_params.provinceId] : pronvinceList.map((e) => e.value),
        };

        currentProvinceIdsRef.current = (params.provinceIds || []).map((e) => `${e}`);
        return Api.getDataList(params)
            .then((res) => {
                cacheDataRef.current = res.data || [];

                if (res && Array.isArray(res.data)) {
                    const dataWithIndex = (res.data || []).map((item: any, i: number) => ({
                        ...item,
                        index: (params.current - 1) * params.pageSize + i + 1,
                    }));
                    return {
                        success: true,
                        total: res.total,
                        data: dataWithIndex,
                    };
                } else {
                    return {
                        success: true,
                        total: 0,
                        data: [],
                    };
                }
            })
            .catch(() => {
                return {
                    success: true,
                    total: 0,
                    data: [],
                };
            });
    };

    const editOrViewRule = (row, type) => {
        setEditingRecord(row);
        setEditReadonly(type === 'view');
        editForm.resetFields();
        Api.getFaultReportDerivedRuleConfig({ ruleId: row.ruleId }).then((res) => {
            if (res) {
                setEditData(res.data);

                // 如果模板列表已加载，立即转换数据；否则等待模板列表加载完成
                if (noticeTemplateList.length > 0) {
                    const transformedData = transformApiDataToForm(res.data, noticeTemplateList, faultNoticeTemplateList);
                    editForm.setFieldsValue(transformedData);
                } else {
                    // 模板列表未加载完成，先设置原始数据，等模板列表加载后再更新
                    editForm.setFieldsValue(res.data);
                }
            }
        });
        setEditVisible(true);
    };

    const handleBatchEnable = () => {
        Modal.confirm({
            title: '提示',
            content: '是否确认批量启用规则？',
            onOk: () => {
                const operateList = cacheDataRef.current
                    .filter(
                        (item) =>
                            item.reportStatus === 2 &&
                            selectedRowKeys.includes(item.ruleId) &&
                            (zoneLevelFlags.isCountryZone ? item.ruleType === 1 : item.ruleType === 2),
                    )
                    .map((e) => e.ruleId);
                if (!operateList.length) {
                    message.warning(`没有可操作的数据(${zoneLevelFlags.isCountryZone ? '集团' : '省份'}制定的已停用规则)`);
                    return;
                }
                Api.enableFaultReportDerivedRule(operateList).then(() => {
                    message.success(`${operateList.length}条规则启用成功`);
                    actionRef.current?.reload?.();
                });
            },
            onCancel() {},
        });
    };

    const handleBatchDisable = () => {
        Modal.confirm({
            title: '提示',
            content: '是否确认批量停用规则？',
            onOk: () => {
                const operateList = cacheDataRef.current
                    .filter(
                        (item) =>
                            item.reportStatus === 1 &&
                            selectedRowKeys.includes(item.ruleId) &&
                            (zoneLevelFlags.isCountryZone ? item.ruleType === 1 : item.ruleType === 2),
                    )
                    .map((e) => e.ruleId);
                if (!operateList.length) {
                    message.warning(`没有可操作的数据(${zoneLevelFlags.isCountryZone ? '集团' : '省份'}制定的已启用规则)`);
                    return;
                }
                Api.disableFaultReportDerivedRule(operateList).then(() => {
                    message.success(`${operateList.length}条规则停用成功`);
                    actionRef.current?.reload?.();
                });
            },
            onCancel() {},
        });
    };

    const handleAddDerivedRule = () => {
        if (actions && actions.postMessage) {
            setTimeout(() => {
                actions?.postMessage?.(messageTypes.openRoute, {
                    entry: `/rules/association-rules/views/province-rule-manage/edit/2`,
                    extraContent: { search: { isFromSpecialRoute: true } },
                });
            }, 100);
        } else {
            console.log('跳转失败');
        }
    };
    const checkEnable = (record: any) => {
        if (zoneLevelFlags.isProvinceZone && record.ruleType === 3) {
            return false;
        }
        // 不管在什么层级下，ruleType为3的都可以编辑
        if (record.ruleType === 3) {
            return true;
        }
        if (zoneLevelFlags.isCountryZone) {
            return record.ruleType === 1;
        }
        if (zoneLevelFlags.isRegionZone) {
            return record.ruleType === 2;
        }
        if (zoneLevelFlags.isProvinceZone) {
            return record.ruleType === 2;
        }
        return false;
    };
    const onNoticeCancel = () => {
        setNoticeVisible(false);
        setIfNoticeType(false);
    };
    const getNoticeTemplateList = () => {
        const params = {
            provinceId,
            pageIndex: 1,
            pageSize: 100,
            templateType: '5',
        };
        Api.getNoticeTemplateList(params).then((res) => {
            if (res && res.data) {
                const smsList = res.data.map((item) => ({
                    ...item,
                    label: item.templateName,
                    value: item.templateId,
                }));
                setNoticeTemplateList(smsList);
            }
            return res;
        });
        const faultParams = {
            provinceId,
            pageIndex: 1,
            pageSize: 100,
            faultDistinctionType: '1',
        };
        Api.getNoticeTemplateList(faultParams).then((res) => {
            if (res && res.data) {
                const smsList = res.data.map((item) => ({
                    ...item,
                    label: item.templateName,
                    value: item.templateId,
                }));
                setFaultNoticeTemplateList(smsList);
            }
            return res;
        });
    };

    useEffect(() => {
        const dictNames = [
            'faultReportDerivedRuleProfessionalType',
            'faultReportDerivedRuleType',
            'faultReportDerivedRuleResource',
            'faultReportDerivedRuleStatus',
            'faultReportDerivedRuleReportStatus',
        ];
        dictNames.map((item) => {
            Api.getDictList(item).then((res) => {
                const list = res.data || [];
                list.unshift({
                    dCode: '',
                    dName: '全部',
                });

                setEnums({
                    [item]: list.map((e) => {
                        return {
                            label: e.dName,
                            value: e.dCode,
                        };
                    }),
                });
            });
        });

        getProvinceList({ creator: userId }).then((res) => {
            if (res && Array.isArray(res)) {
                const Reg = /(^自管节点)|澳门|香港|台湾/;
                let list = res.filter((item) => !Reg.test(item.regionName));
                if (zoneLevelFlags.isCountryZone) {
                    list = [...list];
                }
                // else if (zoneLevelFlags.isRegionZone) {
                //     list = [...list].filter((e) => e.regionId === currentZone.zoneId);
                //     getZones({ parent_zone_id: currentZone.zoneId }).then((ress) => {
                //         list = list.concat(
                //             ress._embedded.zoneResourceList.map((e) => ({
                //                 regionId: e.zoneId + '',
                //                 regionName: e.zoneName,
                //             })),
                //         );
                //         const optionList = list.map((item) => ({
                //             label: item.regionName,
                //             value: item.regionId,
                //         }));
                //         setPronvinceList(optionList);
                //         setTimeout(() => {
                //             actionRef?.current?.reload?.();
                //         }, 100);

                //         return;
                //     });
                // }
                else {
                    list = [...list].filter((e) => e.regionId === currentZone.zoneId);
                }

                const optionList = list.map((item) => ({
                    label: item.regionName,
                    value: item.regionId,
                }));
                setPronvinceList(optionList);
                setTimeout(() => {
                    actionRef?.current?.reload?.();
                }, 100);
            }
        });
        getNoticeTemplateList();
    }, []);

    useEffect(() => {
        if (editData && noticeTemplateList.length > 0) {
            const transformedData = transformApiDataToForm(editData, noticeTemplateList);

            editForm.setFieldsValue(transformedData);
        }
    }, [noticeTemplateList, editData]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <VirtualTable
                actionRef={actionRef}
                global={window}
                columns={columns}
                request={request}
                rowKey={(record: any) => record?.ruleId || record?.id || `${Math.random()}`}
                bordered
                expandable={{
                    expandedRowKeys,
                    expandIcon: false,
                    expandIconColumnIndex: -1,
                    fixed: true,
                    expandedRowRender: (record: any) => {
                        const parentKey = `${record?.ruleId || ''}`;
                        const pageState = derivedPageState[parentKey] || { current: 1, pageSize: 5 };
                        const allList = getMockDerivedRules(record);
                        const provinceFilter = currentProvinceIdsRef.current;
                        const filteredList = allList
                            .filter((item) => {
                                if (!provinceFilter?.length) return true;
                                return provinceFilter.includes(`${item.provinceId}`);
                            })
                            .sort((a, b) => {
                                const ra = getDerivedRuleStatusRank(a.ruleStatus);
                                const rb = getDerivedRuleStatusRank(b.ruleStatus);
                                if (ra !== rb) return ra - rb;
                                return 0;
                            });
                        const total = filteredList.length;
                        const start = (pageState.current - 1) * pageState.pageSize;
                        const end = start + pageState.pageSize;
                        const pageData = filteredList.slice(start, end);

                        const derivedColumns: any[] = [
                            {
                                title: '序号',
                                dataIndex: 'index',
                                width: 60,
                                align: 'center',
                                render: (_: any, __: any, idx: number) => start + idx + 1,
                            },
                            {
                                title: '规则名称',
                                dataIndex: 'ruleName',
                                width: 260,
                                render: (val: any) => (
                                    <div title={val} className="ellipsis">
                                        {val}
                                    </div>
                                ),
                            },
                            {
                                title: '规则描述',
                                dataIndex: 'ruleDescription',
                                width: 320,
                                render: (val: any) => (
                                    <div title={val} className="ellipsis">
                                        {val}
                                    </div>
                                ),
                            },
                            {
                                title: '专业',
                                dataIndex: 'professionalType',
                                width: 110,
                                align: 'center',
                                render: (val: any) => (
                                    <div
                                        title={enums.faultReportDerivedRuleProfessionalType?.find((e: any) => e.value === `${val}`)?.label || '-'}
                                        className="ellipsis"
                                    >
                                        {enums.faultReportDerivedRuleProfessionalType?.find((e: any) => e.value === `${val}`)?.label || '-'}
                                    </div>
                                ),
                            },
                            {
                                title: '规则类型',
                                dataIndex: 'ruleType',
                                width: 110,
                                align: 'center',
                                render: (val: any) => (
                                    <div
                                        title={enums.faultReportDerivedRuleType?.find((e: any) => e.value === `${val}`)?.label || '-'}
                                        className="ellipsis"
                                    >
                                        {enums.faultReportDerivedRuleType?.find((e: any) => e.value === `${val}`)?.label || '-'}
                                    </div>
                                ),
                            },
                            {
                                title: '生效省份',
                                dataIndex: 'provinceId',
                                width: 110,
                                align: 'center',
                                render: (_: any, row: any) => (
                                    <div title={row.provinceName || '-'} className="ellipsis">
                                        {row.provinceName || '-'}
                                    </div>
                                ),
                            },
                            {
                                title: '故障识别规则状态',
                                dataIndex: 'ruleStatus',
                                width: 120,
                                align: 'center',
                                render: (val: any) => (
                                    <div
                                        title={enums.faultReportDerivedRuleStatus?.find((e: any) => e.value === `${val}`)?.label || '-'}
                                        className="ellipsis"
                                    >
                                        {enums.faultReportDerivedRuleStatus?.find((e: any) => e.value === `${val}`)?.label || '-'}
                                    </div>
                                ),
                            },
                            {
                                title: '规则id',
                                dataIndex: 'ruleId',
                                width: 120,
                                align: 'center',
                                render: (val: any) => (
                                    <div title={val} className="ellipsis">
                                        {val}
                                    </div>
                                ),
                            },
                        ];

                        return (
                            <div style={{ padding: '8px', background: '#fafafa' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 24, marginBottom: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: '24px' }}>规则明细</div>
                                        <Button
                                            type="link"
                                            size="small"
                                            style={{ padding: 0, height: 24, lineHeight: '24px' }}
                                            onClick={() => {
                                                setExpandedRowKeys((prev) => prev.filter((e) => e !== record?.ruleId));
                                            }}
                                        >
                                            <Icon antdIcon type="UpOutlined" />
                                            收起
                                        </Button>
                                    </div>

                                    <Pagination
                                        size="small"
                                        current={pageState.current}
                                        pageSize={pageState.pageSize}
                                        total={total}
                                        showSizeChanger={false}
                                        showQuickJumper={false}
                                        showTotal={(t: number, range: [number, number]) => `第${range[0]}-${range[1]}条/总共${t}条`}
                                        onChange={(current: number, pageSize: number) => {
                                            setDerivedPageState((prev) => ({
                                                ...prev,
                                                [parentKey]: { current, pageSize: pageSize || 5 },
                                            }));
                                        }}
                                    />
                                </div>
                                <Table
                                    rowKey={(r: any) => r.id}
                                    size="small"
                                    bordered
                                    columns={derivedColumns}
                                    dataSource={pageData}
                                    pagination={false}
                                    scroll={{ x: 'max-content' }}
                                />
                            </div>
                        );
                    },
                    onExpand: (expanded: boolean, record: any) => {
                        const key = record?.ruleId;
                        if (!key) return;
                        setExpandedRowKeys((prev) => {
                            if (expanded) return prev.includes(key) ? prev : [...prev, key];
                            return prev.filter((e) => e !== key);
                        });
                    },
                }}
                tableAlertRender={false}
                tableAlertOptionRender={false}
                search={{ span: 6, labelWidth: 150 }}
                scroll={{ x: 'max-content' }}
                className="fault-rule-table"
                toolBarRender={() => [
                    <AuthButton
                        authKey="troubleshootingWorkbench:enableRule"
                        onClick={handleBatchEnable}
                        disabled={!selectedRowKeys.length || ifSwitchRegion}
                        title="批量启用上报规则"
                    >
                        批量启用
                    </AuthButton>,
                    <AuthButton
                        authKey="troubleshootingWorkbench:enableRule"
                        onClick={handleBatchDisable}
                        disabled={!selectedRowKeys.length || ifSwitchRegion}
                        title="批量停用上报规则"
                    >
                        批量停用
                    </AuthButton>,
                    <AuthButton authKey="rulesMg:add" onClick={handleAddDerivedRule} title="新增重大故障衍生规则">
                        新增重大故障衍生规则
                    </AuthButton>,
                ]}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys: any[]) => setSelectedRowKeys(keys),
                }}
            />
            <Modal
                title="已上报故障"
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    setFaultReportDerivedRuleId(undefined);
                }}
                destroyOnClose
                footer={null}
                width={1200}
            >
                <FaultReport
                    key={faultReportDerivedRuleId || 'fault-report-derived'}
                    derived={true}
                    faultReportDerivedRuleId={faultReportDerivedRuleId}
                />
            </Modal>
            <Modal
                title={`${editReadonly ? '查看' : '配置'}上报规则`}
                visible={editVisible}
                maskClosable={false}
                onCancel={() => {
                    setEditVisible(false);
                    setEditingRecord({});
                    editForm.resetFields(); // 重置表单所有字段
                }}
                destroyOnClose
                className="edit-rule-modal"
                width={1200}
                footer={
                    editReadonly
                        ? [
                              <Button
                                  key="close"
                                  onClick={() => {
                                      setEditVisible(false);
                                      setEditingRecord({});
                                      editForm.resetFields(); // 重置表单所有字段
                                  }}
                              >
                                  关闭
                              </Button>,
                          ]
                        : [
                              <Button
                                  key="ok"
                                  type="primary"
                                  onClick={() => {
                                      editForm.validateFields().then((values) => {
                                          // 检查表单中的通知数据
                                          const notificationFields = [
                                              'firstNotificationType',
                                              'firstNotificationDetailList',
                                              'firstNotificationUser',
                                              'firstNotificationTel',
                                              'continueNotificationType',
                                              'continueNotificationDetailList',
                                              'continueNotificationUser',
                                              'continueNotificationTel',
                                              'finalNotificationType',
                                              'finalNotificationDetailList',
                                              'finalNotificationUser',
                                              'finalNotificationTel',
                                          ];

                                          const notificationData = {};
                                          notificationFields.forEach((field) => {
                                              notificationData[field] = values[field];
                                          });

                                          // 转换表单数据为API格式
                                          const transformedData = transformFormDataToApi(values, noticeTemplateList, faultNoticeTemplateList);
                                          Api.updateFaultReportDerivedRuleConfig({ ...transformedData, ruleId: editingRecord.ruleId }).then((res) => {
                                              if (res.code === 200) {
                                                  message.success('更新成功');
                                                  setEditVisible(false);
                                                  setEditingRecord({});
                                                  editForm.resetFields(); // 重置表单所有字段
                                                  actionRef.current?.reload();
                                              } else {
                                                  message.error(res.message || '更新失败');
                                              }
                                          });
                                      });
                                  }}
                              >
                                  确认
                              </Button>,
                              <Button
                                  key="close"
                                  onClick={() => {
                                      setEditVisible(false);
                                      setEditingRecord({});
                                      editForm.resetFields(); // 重置表单所有字段
                                  }}
                              >
                                  关闭
                              </Button>,
                          ]
                }
            >
                <ModalContent
                    form={editForm}
                    editingRecord={editingRecord}
                    enums={enums}
                    disabled={editReadonly}
                    noticeTemplateList={noticeTemplateList}
                    faultNoticeTemplateList={faultNoticeTemplateList}
                    noticeVisible={noticeVisible}
                    setNoticeVisible={(bool, type) => {
                        setNoticeVisible(bool);
                        if (type) {
                            setIfNoticeType(true);
                        }
                    }}
                    isProvince={zoneLevelFlags.isProvinceZone}
                    isCountry={zoneLevelFlags.isCountryZone}
                    editData={editData}
                    editVisible={editVisible}
                />
            </Modal>
            <Modal
                title="模板管理"
                width={800}
                bodyStyle={{ height: '450px' }}
                onCancel={onNoticeCancel}
                visible={noticeVisible}
                destroyOnClose
                className={'notice-template-modal'}
                getContainer={container}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={onNoticeCancel}> 关闭</Button>
                    </div>
                }
            >
                <NoticeTemplate
                    provinceId={provinceId}
                    login={login}
                    reloadList={getNoticeTemplateList}
                    templateList={!ifNoticeType ? noticeTemplateList : faultNoticeTemplateList}
                    templateType={!ifNoticeType ? '5' : false}
                />
            </Modal>
        </div>
    );
};

export default FaultRuleManage;
