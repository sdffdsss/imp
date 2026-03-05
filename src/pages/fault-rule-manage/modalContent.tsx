import React, { useEffect, useRef, useState } from 'react';
import { useSetState } from 'ahooks';
import { Form, Radio, Input, Row, Col, Select, Button, Space, message, InputNumber, Checkbox, Modal } from 'oss-ui';
import { FAULT_NOTIFICATION_ENUM } from '@Pages/fault-report/type';
import uniqBy from 'lodash/uniqBy';
import { Api } from './api';
import { getMajorTypeList } from '@Pages/fault-report/api';
import useLoginInfoModel from '@Src/hox';
import ReportFormSection from './ReportFormSection';
import './index.less';

const ModalContent: React.FC<{
    form: any;
    editingRecord: any;
    enums: any;
    disabled?: boolean;
    isProvince?: boolean;
    isCountry?: boolean;
    noticeVisible?: boolean;
    setNoticeVisible: (visible: boolean, type?: 'notification') => void;
    noticeTemplateList: any[];
    faultNoticeTemplateList: any[];
    editData: any;
    editVisible?: boolean;
    reportType?: 'First' | 'Continue' | 'Final'; // 报告类型：首报、续报、终报
}> = ({
    form,
    editingRecord,
    enums,
    disabled,
    setNoticeVisible,
    noticeTemplateList,
    faultNoticeTemplateList,
    isProvince,
    noticeVisible,
    editData,
    editVisible,
    isCountry,
    reportType = 'first',
}) => {
    // 构造规则专业信息（自动上报时使用）
    const ruleProfessional = editingRecord?.professionalType
        ? {
              value: editingRecord.professionalType,
              label:
                  enums.faultReportDerivedRuleProfessionalType?.find((item: any) => item.value == `${editingRecord.professionalType}`)?.label || '',
          }
        : null;

    // 状态和引用
    const selectUseRef = useRef<any>({});
    const initializedRef = useRef(false);
    const prevEditDataRef = useRef<any>(null);
    const [state, setState] = useSetState({});
    const [firstNoticeTypeValue, setFirstNoticeTypeValue] = useState<any>({
        notificationType: [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING],
        notificationDetailList: [],
    });
    const [continueNoticeTypeValue, setContinueNoticeTypeValue] = useState<any>({
        notificationType: [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING],
        notificationDetailList: [],
    });
    const [finalNoticeTypeValue, setFinalNoticeTypeValue] = useState<any>({
        notificationType: [FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE, FAULT_NOTIFICATION_ENUM.DINGDING],
        notificationDetailList: [],
    });
    const [firstNotificationUserInfos, setFirstNotificationUserInfos] = useState<any[]>([]);
    const [continueNotificationUserInfos, setContinueNotificationUserInfos] = useState<any[]>([]);
    const [finalNotificationUserInfos, setFinalNotificationUserInfos] = useState<any[]>([]);
    const [firstNotificationTel, setFirstNotificationTel] = useState<string>('');
    const [continueNotificationTel, setContinueNotificationTel] = useState<string>('');
    const [finalNotificationTel, setFinalNotificationTel] = useState<string>('');
    const [userSelectModalVisible, setUserSelectModalVisible] = useState(false);
    const [noticeFinalData, setNoticeFinalData] = useState<any>({ temps: [] });
    const userSelectRef = useRef<any>(null);
    const [professionalList, setProfessionalList] = useState<any[]>([]);

    // 判断是否为手工上报
    const isManualReport = `${editingRecord?.ruleType}` === '3';

    // 获取专业列表
    const getProfessionalList = async () => {
        try {
            const res = await getMajorTypeList({});
            const list = res?.data || [];
            // 如果接口返回空数据，使用原来的枚举数据作为备用
            if (list.length === 0) {
                setProfessionalList(enums.faultReportDerivedRuleProfessionalType || []);
            } else {
                // 转换数据格式：{dCode, dName} -> {value, label}
                const formattedList = list.map((item: any) => ({
                    value: item.dCode,
                    label: item.dName,
                }));
                setProfessionalList(formattedList);
            }
        } catch (error) {
            console.error('获取专业列表失败:', error);
            // 出错时也使用枚举数据作为备用
            setProfessionalList(enums.faultReportDerivedRuleProfessionalType || []);
        }
    };

    // 初始化获取专业列表
    useEffect(() => {
        getProfessionalList();
    }, []);

    // 解析整数函数
    const parseIntOnly = (val?: string): any => {
        if (val === undefined || val === null) return '';
        const v = String(val);
        const only = v.replace(/[^\d]/g, '');
        return only;
    };

    // 重置通知相关状态的函数
    const resetNotificationStates = () => {
        setFirstNotificationUserInfos([]);
        setContinueNotificationUserInfos([]);
        setFinalNotificationUserInfos([]);
        setFirstNotificationTel('');
        setContinueNotificationTel('');
        setFinalNotificationTel('');
        setNoticeFinalData({ temps: [] });
    };

    // 监听弹窗关闭，重置通知状态
    useEffect(() => {
        if (!editVisible) {
            resetNotificationStates();
        }
    }, [editVisible]);

    // 监听编辑数据变化，重置通知状态（新建或编辑不同记录时）
    useEffect(() => {
        if (editData !== prevEditDataRef.current) {
            resetNotificationStates();
        }
    }, [editData]);

    // 包装API方法，传递userId
    const login = useLoginInfoModel();
    const { userId } = login;
    const getUserGroupList = Api.getUserGroupList;
    const getProvinceList = () => Api.getProvinceList(userId);
    const getUserTableData = Api.getUserTableData;

    // 用户选择Modal确认
    const onUserSelectModalOk = () => {
        try {
            if (userSelectRef.current?.getValues) {
                const values = userSelectRef.current.getValues();

                const tableData: any = [];
                const groupIds = Object.keys(values).filter((item) => item !== 'temps');

                groupIds.forEach((groupId) => {
                    values[groupId].forEach((item: any) => {
                        tableData.push({
                            ...item,
                            provinceNames: item.zoneName || item.provinceNames,
                        });
                    });
                });

                // setNotificationUserInfos(uniqBy(tableData, 'userId'));
                // setNotificationTel(values['temps']?.join(',') || '');
                // setNoticeFinalData(values);
            }
        } catch (error) {
            console.error('用户选择处理失败:', error);
        } finally {
            setUserSelectModalVisible(false);
        }
    };

    // 处理修改权限变化 - 联动设置，三个模块同步
    const handleModifyPermissionChange = (sourceType: string, value: boolean) => {
        // 同步时间值到其他模块
        const updateFields = {};

        // 生成表单字段名（用于UI更新）
        const getFormFieldNameForType = (type: string) => {
            const prefix = type === 'First' ? 'first' : type === 'Continue' ? 'continue' : 'final';
            return `whether${prefix}AllowModify`;
        };

        // 同步所有三个模块，包括触发变化的模块本身（与审核联动保持一致）
        // 更新表单字段（UI显示）
        updateFields[getFormFieldNameForType('First')] = value;
        updateFields[getFormFieldNameForType('Continue')] = value;
        updateFields[getFormFieldNameForType('Final')] = value;

        form.setFieldsValue(updateFields);

        // 强制触发表单重新渲染，确保UI更新
        form.validateFields([]);

        // 强制更新特定字段，确保UI同步
        Object.keys(updateFields).forEach((fieldName) => {
            form.setFieldsValue({ [fieldName]: updateFields[fieldName] });
        });
    };

    // 处理修改审核联动 - 任何模块变化都同步到其他模块
    const handleModifyApprovalChange = (sourceType: string, value: boolean) => {
        const updateFields = {};

        // 同步所有三个模块，包括触发变化的模块本身
        updateFields['firstRequiredModifyApproval'] = value;
        updateFields['continueRequiredModifyApproval'] = value;
        updateFields['finalRequiredModifyApproval'] = value;

        form.setFieldsValue(updateFields);
    };

    // 初始化通知模板数据
    useEffect(() => {
        if (editData !== prevEditDataRef.current) {
            prevEditDataRef.current = editData;
            initializedRef.current = false;
        }
        if (!initializedRef.current && noticeTemplateList.length > 0) {
            initializedRef.current = true;
            const getTemplateTitle = (templateId: string) => {
                const template = noticeTemplateList.find((item) => item.templateId === templateId);
                return template ? template.templateName || template.label || '' : templateId || '';
            };

            // 设置表单字段值（包括内容和模板ID）
            const formValues = {
                // 首报字段 - 内容和模板ID
                reportDescribe: getTemplateTitle(editData?.firstReportDescribe),
                influenceScope: getTemplateTitle(editData?.firstInfluenceScope),
                causesAnalysis: getTemplateTitle(editData?.firstCausesAnalysis),
                treatmentMeasure: getTemplateTitle(editData?.firstTreatmentMeasure),
                reportDescribeTemplateId: editData?.firstReportDescribe || '',
                influenceScopeTemplateId: editData?.firstInfluenceScope || '',
                causesAnalysisTemplateId: editData?.firstCausesAnalysis || '',
                treatmentMeasureTemplateId: editData?.firstTreatmentMeasure || '',

                // 续报字段 - 内容和模板ID
                continueReportDescribe: getTemplateTitle(editData?.continueReportDescribe),
                continueInfluenceScope: getTemplateTitle(editData?.continueInfluenceScope),
                continueCausesAnalysis: getTemplateTitle(editData?.continueCausesAnalysis),
                continueTreatmentMeasure: getTemplateTitle(editData?.continueTreatmentMeasure),
                continueReportDescribeTemplateId: editData?.continueReportDescribe || '',
                continueInfluenceScopeTemplateId: editData?.continueInfluenceScope || '',
                continueCausesAnalysisTemplateId: editData?.continueCausesAnalysis || '',
                continueTreatmentMeasureTemplateId: editData?.continueTreatmentMeasure || '',

                // 终报字段 - 内容和模板ID
                finalReportDescribe: getTemplateTitle(editData?.finalReportDescribe),
                finalInfluenceScope: getTemplateTitle(editData?.finalInfluenceScope),
                finalCausesAnalysis: getTemplateTitle(editData?.finalCausesAnalysis),
                finalTreatmentMeasure: getTemplateTitle(editData?.finalTreatmentMeasure),
                finalReportDescribeTemplateId: editData?.finalReportDescribe || '',
                finalInfluenceScopeTemplateId: editData?.finalInfluenceScope || '',
                finalCausesAnalysisTemplateId: editData?.finalCausesAnalysis || '',
                finalTreatmentMeasureTemplateId: editData?.finalTreatmentMeasure || '',
            };

            // 处理通知类型字段（从字符串转换为数组或从notificationDetailList提取）
            const getNotificationTypeFromDetailList = (detailList: any[]) => {
                if (Array.isArray(detailList) && detailList.length > 0) {
                    return detailList.map((item) => item.notificationType);
                }
                return ['2', '3']; // 默认值
            };

            const firstNotificationTypes = editData?.firstNotificationType
                ? editData.firstNotificationType.split(',')
                : getNotificationTypeFromDetailList(editData?.firstNotificationDetailList);

            const continueNotificationTypes = editData?.continueNotificationType
                ? editData.continueNotificationType.split(',')
                : getNotificationTypeFromDetailList(editData?.continueNotificationDetailList);

            const finalNotificationTypes = editData?.finalNotificationType
                ? editData.finalNotificationType.split(',')
                : getNotificationTypeFromDetailList(editData?.finalNotificationDetailList);

            const notificationTypeValues = {
                firstNotificationType: firstNotificationTypes,
                continueNotificationType: continueNotificationTypes,
                finalNotificationType: finalNotificationTypes,
            };

            // 添加通知详情列表字段
            const notificationDetailValues = {
                firstNotificationDetailList: editData?.firstNotificationDetailList || [],
                continueNotificationDetailList: editData?.continueNotificationDetailList || [],
                finalNotificationDetailList: editData?.finalNotificationDetailList || [],
            };

            // 合并所有字段值
            const allFormValues = { ...formValues, ...notificationTypeValues, ...notificationDetailValues };
            form.setFieldsValue(allFormValues);
        }
    }, [editData, noticeTemplateList]);

    // 处理通知模板选择后的内容自动填充
    useEffect(() => {
        if (!noticeVisible) {
            // 根据选择的模板ID填充对应内容到表单字段
            const templateFields = ['influenceScope', 'causesAnalysis', 'treatmentMeasure', 'faultDescTemplate'];
            templateFields.forEach((field) => {
                const templateId = selectUseRef.current[field];
                if (templateId) {
                    const templateTitle =
                        noticeTemplateList.find((e) => e.templateId === templateId)?.templateName ||
                        noticeTemplateList.find((e) => e.templateId === templateId)?.label ||
                        '';
                    form.setFieldsValue({ [field]: templateTitle });
                }
            });
        }
    }, [noticeVisible]);

    // 初始化表单数据和状态
    useEffect(() => {
        if (!form) return;

        // 设置基础字段默认值
        const basicFields = {
            whetherFillFaultNetwork: reportType === 'Continue' ? false : true,
        };

        Object.keys(basicFields).forEach((name) => {
            const currentValue = form?.getFieldValue?.(name);
            if (currentValue === undefined || currentValue === null || currentValue === '') {
                form?.setFieldsValue?.({ [name]: basicFields[name] });
            }
        });

        // 设置通知相关状态
        if (editingRecord) {
            setFirstNoticeTypeValue({
                notificationType: editData.firstNotificationType?.split(',') || ['2', '3'],
                notificationDetailList: editData.firstNotificationDetailList || [],
            });
            setContinueNoticeTypeValue({
                notificationType: editData.continueNotificationType?.split(',') || ['2', '3'],
                notificationDetailList: editData.continueNotificationDetailList || [],
            });
            setFinalNoticeTypeValue({
                notificationType: editData.finalNotificationType?.split(',') || ['2', '3'],
                notificationDetailList: editData.finalNotificationDetailList || [],
            });
            setFirstNotificationUserInfos(editData.firstNotificationUserInfos || []);
            setContinueNotificationUserInfos(editData.continueNotificationUserInfos || []);
            setFinalNotificationUserInfos(editData.finalNotificationUserInfos || []);
            setFirstNotificationTel(editData.firstNotificationTel || '');
            setContinueNotificationTel(editData.continueNotificationTel || '');
            setFinalNotificationTel(editData.finalNotificationTel || '');
        }
    }, [form, reportType, editingRecord, editData]);

    const hideMajorDisplay = `${editingRecord?.ruleType}` === '2';
    const [collapseBeforeReport, setCollapseBeforeReport] = useState(false);
    return (
        <Form form={form} layout="horizontal" labelCol={{ span: 8, style: { textAlign: 'left' } }} wrapperCol={{ span: 16 }}>
            <div className="sec-title" style={{ fontWeight: 600, fontSize: '14px' }}>
                规则基本信息
            </div>
            <div style={{ marginLeft: '24px' }}>
                <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500 }}>专业：</span>
                    <span>
                        {enums.faultReportDerivedRuleProfessionalType?.find((item: any) => item.value == `${editingRecord?.professionalType}`)
                            ?.label || '-'}
                    </span>
                    <span style={{ marginLeft: '100px', fontWeight: 500 }}>规则名称：</span>
                    <span>{editingRecord?.ruleName || '-'}</span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500 }}>规则描述：</span>
                    <span className="rule-desc-wrap">{editingRecord?.ruleDescription || '-'}</span>
                </div>
                <Row gutter={24}>
                    <Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>规则类型：</span>
                            <span>
                                {enums.faultReportDerivedRuleType?.find((item: any) => item.value === `${editingRecord?.ruleType}`)?.label || '-'}
                            </span>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>上报规则状态：</span>
                            <span>
                                {enums.faultReportDerivedRuleReportStatus?.find((item: any) => item.value === `${editingRecord?.reportStatus}`)
                                    ?.label || '-'}
                            </span>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>规则来源：</span>
                            <span>
                                {enums.faultReportDerivedRuleResource?.find((item: any) => item.value === `${editingRecord?.ruleSource}`)?.label ||
                                    '-'}
                            </span>
                        </div>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>故障识别规则状态：</span>
                            <span>
                                {enums.faultReportDerivedRuleStatus?.find((item: any) => item.value === `${editingRecord?.ruleStatus}`)?.label || '-'}
                            </span>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>规则ID：</span>
                            <span>{editingRecord?.ruleId || '-'}</span>
                        </div>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>生效省份：</span>
                            <span>{editingRecord?.provinceName || '-'}</span>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className="sec-title" style={{ fontWeight: 600, fontSize: '14px' }}>
                规则配置
            </div>
            {/* 首报前 - 仅在非手工上报时显示 */}
            {!isManualReport && (
                <Row gutter={16} style={{ marginTop: '8px', marginLeft: '16px' }}>
                    <Col span={24}>
                        <div
                            className="sec-title"
                            style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '4px',
                                        height: '4px',
                                        backgroundColor: '#1890ff',
                                        borderRadius: '50%',
                                        marginRight: '8px',
                                    }}
                                ></span>
                                首报前
                            </span>
                            <Button
                                type="text"
                                size="small"
                                onClick={() => setCollapseBeforeReport(!collapseBeforeReport)}
                                style={{ padding: '0 8px', color: '#1890ff', fontSize: '12px' }}
                            >
                                {collapseBeforeReport ? '﹀' : '︿'}
                            </Button>
                        </div>
                        {!collapseBeforeReport && (
                            <>
                                {/* 只有非省份级别才显示集团是否展示未确认故障 */}
                                {`${editingRecord?.ruleType}` !== '2' && (
                                    <Form.Item
                                        label="（1）集团是否展示未确认故障："
                                        name="whetherGroupDisplay"
                                        labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        <Form.Item name="whetherGroupDisplay" noStyle initialValue={false}>
                                            <Radio.Group
                                                options={[
                                                    { label: '是', value: true },
                                                    { label: '否', value: false },
                                                ]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                    </Form.Item>
                                )}
                                <Form.Item
                                    label={`（${`${editingRecord?.ruleType}` === '2' ? '1' : '2'}）是否延迟上报：`}
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <Space className="radio-inline-align" align="center" size={8} wrap>
                                        <Form.Item name="whetherDelayReport" noStyle>
                                            <Radio.Group
                                                options={[
                                                    { label: '是', value: true },
                                                    { label: '否', value: false },
                                                ]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.whetherDelayReport !== curr.whetherDelayReport}>
                                            {({ getFieldValue }) =>
                                                getFieldValue('whetherDelayReport') ? (
                                                    <>
                                                        <Space align="center" size={4} wrap>
                                                            <span className="text-span">自动识别的告警，在</span>
                                                            <Form.Item
                                                                name="delayReportMinutes"
                                                                style={{ marginBottom: 0, display: 'inline-flex', alignItems: 'center' }}
                                                                dependencies={['firstAutoReportMinutes']}
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                rules={[
                                                                    { required: true, message: 't4需大于0且小于t1' },
                                                                    ({ getFieldValue: gf }) => ({
                                                                        validator: async (_, value) => {
                                                                            if (value === undefined || value === null || value === '') return;
                                                                            const t4 = Number(value);
                                                                            const t1Raw = gf('firstAutoReportMinutes');
                                                                            const t1 =
                                                                                t1Raw === undefined || t1Raw === null || t1Raw === ''
                                                                                    ? undefined
                                                                                    : Number(t1Raw);
                                                                            if (!(t4 > 0)) {
                                                                                throw new Error('t4需大于0且小于t1');
                                                                            }
                                                                            if (t1 !== undefined && !(t4 < t1)) {
                                                                                throw new Error('t4需大于0且小于t1');
                                                                            }
                                                                        },
                                                                    }),
                                                                ]}
                                                            >
                                                                <InputNumber<number>
                                                                    min={Number(1)}
                                                                    max={Number(60)}
                                                                    style={{ width: 60 }}
                                                                    precision={0}
                                                                    step={Number(1)}
                                                                    parser={parseIntOnly}
                                                                    disabled={disabled}
                                                                />
                                                            </Form.Item>
                                                            <span className="text-span">分钟内清除，则不上报。</span>
                                                            <span className="text-span" style={{ color: '#4990e2' }}>
                                                                {`（注：填写的时间t4：0＜t4≤t1，即≤自动首报的设置时间t1）`}
                                                            </span>
                                                        </Space>
                                                    </>
                                                ) : null
                                            }
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                            </>
                        )}
                        <Col span={24}>
                            <div
                                style={{
                                    height: '0px',
                                    margin: '16px 0',
                                    borderTop: '2px dashed #d9d9d9',
                                    borderImageSlice: 1,
                                }}
                            ></div>
                        </Col>
                    </Col>
                </Row>
            )}

            {/* 首报 */}
            <ReportFormSection
                form={form}
                reportType="First"
                parseIntOnly={parseIntOnly}
                isManualReport={isManualReport}
                isCountry={isCountry}
                disabled={disabled}
                getUserGroupList={getUserGroupList}
                getProvinceList={getProvinceList}
                getUserTableData={getUserTableData}
                noticeTemplateList={noticeTemplateList}
                faultNoticeTemplateList={faultNoticeTemplateList}
                setNoticeVisible={setNoticeVisible}
                noticeTypeValue={firstNoticeTypeValue}
                setNoticeTypeValue={setFirstNoticeTypeValue}
                notificationUserInfos={firstNotificationUserInfos}
                notificationTel={firstNotificationTel}
                onUserSelectModalOk={onUserSelectModalOk}
                userSelectRef={userSelectRef}
                noticeFinalData={noticeFinalData}
                onModifyPermissionChange={handleModifyPermissionChange}
                onModifyApprovalChange={handleModifyApprovalChange}
                professionalList={professionalList}
                ruleProfessional={ruleProfessional}
                getManualReportNotificationSetting={Api.getManualReportDerivedRuleNotificationSetting}
            />

            {/* 续报 */}
            <ReportFormSection
                form={form}
                reportType="Continue"
                parseIntOnly={parseIntOnly}
                isManualReport={isManualReport}
                isCountry={isCountry}
                disabled={disabled}
                getUserGroupList={getUserGroupList}
                getProvinceList={getProvinceList}
                getUserTableData={getUserTableData}
                noticeTemplateList={noticeTemplateList}
                faultNoticeTemplateList={faultNoticeTemplateList}
                setNoticeVisible={setNoticeVisible}
                noticeTypeValue={continueNoticeTypeValue}
                setNoticeTypeValue={setContinueNoticeTypeValue}
                notificationUserInfos={continueNotificationUserInfos}
                notificationTel={continueNotificationTel}
                onUserSelectModalOk={onUserSelectModalOk}
                userSelectRef={userSelectRef}
                noticeFinalData={noticeFinalData}
                onModifyPermissionChange={handleModifyPermissionChange}
                onModifyApprovalChange={handleModifyApprovalChange}
                professionalList={professionalList}
                ruleProfessional={ruleProfessional}
                getManualReportNotificationSetting={Api.getManualReportDerivedRuleNotificationSetting}
            />

            {/* 终报 */}
            <ReportFormSection
                form={form}
                reportType="Final"
                parseIntOnly={parseIntOnly}
                isManualReport={isManualReport}
                isCountry={isCountry}
                disabled={disabled}
                getUserGroupList={getUserGroupList}
                getProvinceList={getProvinceList}
                getUserTableData={getUserTableData}
                noticeTemplateList={noticeTemplateList}
                faultNoticeTemplateList={faultNoticeTemplateList}
                setNoticeVisible={setNoticeVisible}
                noticeTypeValue={finalNoticeTypeValue}
                setNoticeTypeValue={setFinalNoticeTypeValue}
                notificationUserInfos={finalNotificationUserInfos}
                notificationTel={finalNotificationTel}
                onUserSelectModalOk={onUserSelectModalOk}
                userSelectRef={userSelectRef}
                noticeFinalData={noticeFinalData}
                onModifyPermissionChange={handleModifyPermissionChange}
                onModifyApprovalChange={handleModifyApprovalChange}
                professionalList={professionalList}
                ruleProfessional={ruleProfessional}
                getManualReportNotificationSetting={Api.getManualReportDerivedRuleNotificationSetting}
            />
        </Form>
    );
};

export default ModalContent;
