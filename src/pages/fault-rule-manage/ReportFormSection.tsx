import React, { useEffect, useRef, useState } from 'react';
import { useSetState } from 'ahooks';
import { Form, Radio, Input, Row, Col, Select, Button, Space, InputNumber, Modal, message, Icon, Tooltip } from 'oss-ui';
import NoticeTypeCheckbox from '@Pages/fault-report/fault-report-add/fault-report-form/first-report-form/report-notice/components/NoticeTypeCheckbox';
import NoticeTable from '@Pages/fault-report/components/fault-notice/NoticeTable';
import UserSelect from '@Components/user-select';
import { Api } from './api';

interface ReportFormSectionProps {
    form: any;
    reportType: 'First' | 'Continue' | 'Final';
    disabled?: boolean;
    noticeTemplateList: any[];
    faultNoticeTemplateList: any[];
    setNoticeVisible: (visible: boolean, type?: 'notification') => void;
    parseIntOnly: (val?: string) => any;
    // 通知相关参数
    noticeTypeValue: any;
    setNoticeTypeValue: (value: any) => void;
    notificationUserInfos: any[];
    notificationTel?: string;
    onUserSelectModalOk: () => void;
    userSelectRef: any;
    getUserGroupList: any;
    getProvinceList: any;
    getUserTableData: any;
    noticeFinalData: any;
    // 联动相关
    onModifyPermissionChange?: (sourceType: string, value: boolean) => void;
    onModifyApprovalChange?: (sourceType: string, value: boolean) => void;
    // 权限控制
    isCountry?: boolean; // 是否为集团用户
    // 手工上报标识
    isManualReport?: boolean; // 是否为手工上报
    // 专业数据
    professionalList?: any[];
    // 规则专业信息（自动上报时使用）
    ruleProfessional?: any;
    // 新增：获取手工上报通知设置的接口
    getManualReportNotificationSetting?: (data: any) => Promise<any>;
}

const ReportFormSection: React.FC<ReportFormSectionProps> = (props) => {
    const {
        form,
        reportType,
        parseIntOnly,
        isManualReport,
        isCountry,
        disabled,
        getUserGroupList,
        getProvinceList,
        getUserTableData,
        noticeTemplateList,
        faultNoticeTemplateList,
        setNoticeVisible,
        onModifyPermissionChange,
        onModifyApprovalChange,
        professionalList,
        ruleProfessional,
        noticeTypeValue,
        notificationUserInfos,
        notificationTel,
        getManualReportNotificationSetting,
    } = props;

    // 创建每个模块独立的通知类型状态
    const [localNoticeTypeValue, setLocalNoticeTypeValue] = useState<any>({
        notificationType: noticeTypeValue?.notificationType || [], // 不设置默认值
        notificationDetailList: noticeTypeValue?.notificationDetailList || [],
    });

    // 创建每个模块独立的通知用户状态
    const [localNotificationUserInfos, setLocalNotificationUserInfos] = useState<any[]>([]);
    const [localNotificationTel, setLocalNotificationTel] = useState<any>(notificationTel || '');

    // 创建每个模块独立的用户选择弹窗状态
    const [userSelectModalVisible, setUserSelectModalVisible] = useState(false);
    const [noticeFinalData, setNoticeFinalData] = useState<any>({ temps: [] });
    const userSelectRef = useRef<any>(null);

    // 专业信息状态
    const [currentProfessional, setCurrentProfessional] = useState<any>(null);

    // 当用户选择弹窗打开时，滚动到专业列表
    useEffect(() => {
        if (userSelectModalVisible && isManualReport && userSelectRef.current?.scrollToProfessionalList) {
            // 延迟执行，确保弹窗已经完全打开
            setTimeout(() => {
                userSelectRef.current.scrollToProfessionalList();
            }, 100);
        }
    }, [userSelectModalVisible, isManualReport]);

    // 初始化通知数据到表单字段
    useEffect(() => {
        if (!form) {
            return;
        }

        // 设置默认通知类型到表单
        const fieldName =
            reportType === 'First' ? 'firstNotificationType' : reportType === 'Continue' ? 'continueNotificationType' : 'finalNotificationType';
        const detailFieldName =
            reportType === 'First'
                ? 'firstNotificationDetailList'
                : reportType === 'Continue'
                ? 'continueNotificationDetailList'
                : 'finalNotificationDetailList';

        // 延迟设置，确保表单已经完全初始化
        setTimeout(() => {
            // 从表单中读取已有数据（编辑时会有数据）
            const existingNotificationType = form.getFieldValue(fieldName);
            const existingNotificationDetailList = form.getFieldValue(detailFieldName);

            // 读取通知用户和电话数据
            const userFieldName =
                reportType === 'First' ? 'firstNotificationUser' : reportType === 'Continue' ? 'continueNotificationUser' : 'finalNotificationUser';
            const telFieldName =
                reportType === 'First' ? 'firstNotificationTel' : reportType === 'Continue' ? 'continueNotificationTel' : 'finalNotificationTel';

            const existingNotificationUser = form.getFieldValue(userFieldName);
            const existingNotificationTel = form.getFieldValue(telFieldName);

            // 解析已有数据
            let parsedNotificationType = [];
            let parsedNotificationDetailList = [];

            try {
                if (existingNotificationType) {
                    parsedNotificationType =
                        typeof existingNotificationType === 'string' ? JSON.parse(existingNotificationType) : existingNotificationType;
                }
                if (existingNotificationDetailList) {
                    parsedNotificationDetailList =
                        typeof existingNotificationDetailList === 'string'
                            ? JSON.parse(existingNotificationDetailList)
                            : existingNotificationDetailList;
                }
            } catch (error) {
                console.warn(`[${reportType}] 解析表单数据失败:`, error);
            }

            // 只使用表单中已有的数据，不设置默认值
            const finalNotificationType = Array.isArray(parsedNotificationType) && parsedNotificationType.length > 0 ? parsedNotificationType : [];
            const finalNotificationDetailList =
                Array.isArray(parsedNotificationDetailList) && parsedNotificationDetailList.length > 0 ? parsedNotificationDetailList : [];

            // 从notificationDetailList中提取通知类型列表用于NoticeTypeCheckbox组件
            const notificationTypes = finalNotificationDetailList.length > 0 ? finalNotificationDetailList.map((item) => item.notificationType) : [];

            console.log(`[${reportType}] 通知数据回填调试:`, {
                existingNotificationDetailList,
                finalNotificationDetailList,
                notificationTypes,
            });

            // 更新本地状态
            // setLocalNoticeTypeValue({
            //     notificationType: notificationTypes.length > 0 ? notificationTypes : finalNotificationType,
            //     notificationDetailList: finalNotificationDetailList,
            // });

            // 更新通知用户和电话状态
            // if (existingNotificationTel) {
            //     setLocalNotificationTel(existingNotificationTel);
            // }

            // 处理通知用户数据
            if (existingNotificationUser) {
                // 将用户ID字符串转换为用户对象数组
                const userIds =
                    typeof existingNotificationUser === 'string'
                        ? existingNotificationUser.split(',')
                        : Array.isArray(existingNotificationUser)
                        ? existingNotificationUser
                        : [existingNotificationUser];

                // 过滤有效的用户ID
                const validUserIds = userIds.filter((userId) => userId && userId !== 'null' && userId !== '').map((userId) => userId.trim());

                if (validUserIds.length > 0) {
                    // 转换为NoticeTable需要的格式
                    const userInfos = validUserIds.map((userId) => ({
                        userId: userId,
                        userName: `用户${userId}`, // 可以通过API查询获取真实用户名
                        professionalName: '', // 专业信息
                        provinceNames: '', // 省份信息
                        groupNames: '', // 用户组信息
                        userMobile: '', // 手机号信息
                    }));

                    // setLocalNotificationUserInfos(userInfos);
                    console.log('转换后的用户数据:', userInfos);

                    // 如果需要获取真实用户信息，可以在这里调用API
                    // getUserTableData({ userIds: validUserIds }).then(res => {
                    //     if (res && res.data) {
                    //         const realUserInfos = res.data.map(user => ({
                    //             userId: user.userId,
                    //             userName: user.userName,
                    //             deptName: user.deptName,
                    //             phone: user.phone,
                    //             email: user.email
                    //         }));
                    //         setLocalNotificationUserInfos(realUserInfos);
                    //     }
                    // });
                }
            }
        }, 200);
    }, [form, reportType]);
    useEffect(() => {
        setLocalNoticeTypeValue({
            ...localNoticeTypeValue,
            notificationType: noticeTypeValue?.notificationType || [],
            notificationDetailList: noticeTypeValue?.notificationDetailList || [],
        });
        setLocalNotificationUserInfos(notificationUserInfos || []);
        setLocalNotificationTel(notificationTel || '');
    }, [noticeTypeValue]);

    // 独立的用户选择处理函数
    const onUserSelectModalOk = () => {
        try {
            if (userSelectRef.current?.getValues) {
                const values = userSelectRef.current.getValues();

                // 获取专业信息（手工上报时）
                const professionalInfo =
                    isManualReport && userSelectRef.current?.getCurrentProfessional ? userSelectRef.current.getCurrentProfessional() : null;

                const tableData: any = [];
                const groupIds = Object.keys(values).filter((item) => item !== 'temps');

                groupIds.forEach((groupId) => {
                    values[groupId].forEach((item: any) => {
                        tableData.push({
                            ...item,
                            provinceNames: item.zoneName || item.provinceNames,
                            professionalName: professionalInfo?.label || '', // 添加专业信息
                        });
                    });
                });

                setLocalNotificationUserInfos(tableData);
                setLocalNotificationTel(values['temps']?.join(',') || '');
                setNoticeFinalData(values);

                // 保存专业信息
                if (professionalInfo) {
                    setCurrentProfessional(professionalInfo);
                }

                // 将通知用户数据设置到表单字段
                const fieldName =
                    reportType === 'First'
                        ? 'firstNotificationUser'
                        : reportType === 'Continue'
                        ? 'continueNotificationUser'
                        : 'finalNotificationUser';
                const telFieldName =
                    reportType === 'First' ? 'firstNotificationTel' : reportType === 'Continue' ? 'continueNotificationTel' : 'finalNotificationTel';

                form?.setFieldsValue({
                    [fieldName]: tableData.map((item) => item.userId).join(','),
                    [telFieldName]: values['temps']?.join(',') || '',
                });

                setUserSelectModalVisible(false);
            }
        } catch (error) {
            console.error('用户选择处理失败:', error);
        } finally {
            setUserSelectModalVisible(false);
        }
    };

    // 表格删除处理函数
    const handleTableDelete = (record: any) => {
        const newTableData = localNotificationUserInfos.filter((item) => !(item.userId === record.userId && item.groupNames === record.groupNames));
        setLocalNotificationUserInfos(newTableData);

        // 更新表单字段
        const fieldName =
            reportType === 'First' ? 'firstNotificationUser' : reportType === 'Continue' ? 'continueNotificationUser' : 'finalNotificationUser';
        form?.setFieldsValue({
            [fieldName]: newTableData.map((item) => item.userId).join(','),
        });
    };

    // 标签删除处理函数
    const handleTagDelete = (tag: string) => {
        const newPhoneList = localNotificationTel.split(',').filter((phone) => phone !== tag);
        const newPhoneString = newPhoneList.join(',');
        setLocalNotificationTel(newPhoneString);

        // 更新表单字段
        const telFieldName =
            reportType === 'First' ? 'firstNotificationTel' : reportType === 'Continue' ? 'continueNotificationTel' : 'finalNotificationTel';
        form?.setFieldsValue({
            [telFieldName]: newPhoneString,
        });
    };

    // 手工上报保存处理函数
    const handleManualReportSave = async () => {
        try {
            // 获取选中的专业信息
            const professionalInfo = userSelectRef.current?.getCurrentProfessional ? userSelectRef.current.getCurrentProfessional() : null;

            // 获取选中的用户信息
            const values = userSelectRef.current?.getValues();
            if (!values || !professionalInfo) {
                message.warn('请选择专业和用户');
                return;
            }

            // 构建用户ID字符串
            const groupIds = Object.keys(values).filter((item) => item !== 'temps');
            const userIds: string[] = [];

            groupIds.forEach((groupId) => {
                values[groupId]?.forEach((item: any) => {
                    userIds.push(item.userId);
                });
            });

            if (userIds.length === 0) {
                message.warn('请选择用户');
                return;
            }

            // 构建接口参数
            const reportTypeMap = {
                First: 0,
                Continue: 1,
                Final: 2,
            };

            const params = {
                reportType: reportTypeMap[reportType] || 0,
                professionalType: professionalInfo.value,
                notificationUser: userIds.join(','),
            };

            // 调用接口
            const response = await Api.saveOrUpdateManualReportDerivedRuleNotificationSetting(params);

            if (response) {
                // 手工上报：不关闭弹窗，只重置选择状态
                // 只清空用户列表，不重置专业（避免重新请求数据）
                if (userSelectRef.current?.clearUserList) {
                    userSelectRef.current.clearUserList();
                }
            }
        } catch (error) {
            console.error('手工上报保存失败:', error);
            message.error('保存失败');
        }
    };

    // 判断是否显示"故障等级预警"和"根因专业"行
    const shouldShowLevelAndSpecialty = () => {
        // 手工上报首报不显示，其他情况都显示
        return !(isManualReport && reportType === 'First');
    };

    // 动态计算序号 - 手工上报首报时，第3项隐藏，后续序号减1
    const getSequenceNumber = (baseNumber: number) => {
        if (isManualReport && reportType === 'First' && baseNumber > 3) {
            return baseNumber - 1;
        }
        return baseNumber;
    };

    // 根据reportType生成对应的字段名
    const getFieldName = (baseName: string) => {
        const prefix = reportType === 'First' ? 'first' : reportType === 'Continue' ? 'continue' : 'final';
        return prefix + baseName.charAt(0).toUpperCase() + baseName.slice(1);
    };

    // 获取报告类型对应的标题
    const getReportTitle = (type: string) => {
        const titles = {
            First: '首报',
            Continue: '续报',
            Final: '终报',
        };
        return titles[type] || '首报';
    };

    // 获取默认通知模板
    const getDefaultTemplate = (type: string) => {
        const templates = {
            first: '【通用】故障上报统一模板',
            continue: '【通用】故障进展上报统一模板',
            final: '【通用】故障终报统一模板',
        };
        return templates[type] || templates.first;
    };

    // 获取通知内容模板的默认值
    const getNoticeTemplateDefaultValue = () => {
        if (!noticeTemplateList.length) return '';

        // 手工上报使用统一模板逻辑
        if (isManualReport) {
            const targetTemplate = getDefaultTemplate(reportType);
            const foundTemplate = noticeTemplateList.find((item) =>
                item.label?.includes(targetTemplate.replace('【通用】', '').replace('统一模板', '')),
            );
            return foundTemplate?.templateId || noticeTemplateList[0].templateId;
        }

        // 现有逻辑：按不同类型选择不同模板
        if (reportType === 'Final') {
            const foundTemplate = noticeTemplateList.find((item) => item.label?.includes('故障终报统一模板'));
            return foundTemplate?.templateId || noticeTemplateList[0].templateId;
        } else if (reportType === 'Continue') {
            const foundTemplate = noticeTemplateList.find((item) => item.label?.includes('故障进展上报统一模板'));
            return foundTemplate?.templateId || noticeTemplateList[0].templateId;
        } else {
            return noticeTemplateList[0].templateId;
        }
    };

    // 判断是否显示"是否影响业务"字段（续报显示，终报也显示）
    const shouldShowBusinessImpact = () => {
        return reportType === 'Continue' || reportType === 'Final';
    };

    // 判断是否显示"业务恢复进展"字段（续报显示，终报也显示）
    const shouldShowBusinessRecovery = () => {
        return reportType === 'Continue' || reportType === 'Final';
    };

    const selectUseRef = useRef<any>({
        reportDescribe: '',
        influenceScope: '',
        causesAnalysis: '',
        treatmentMeasure: '',
        faultDescTemplate: '',
        businessImpactScope: '',
        businessRecovery: '',
    });

    const [state, setState] = useSetState({
        reportDescribe: '',
        influenceScope: '',
        causesAnalysis: '',
        treatmentMeasure: '',
        faultDescTemplate: '',
        businessImpactScope: '',
        businessRecovery: '',
        noticeContentTemplate: '',
    });

    const [collapseBeforeReport, setCollapseBeforeReport] = useState(false);

    // 初始化表单字段默认值
    useEffect(() => {
        // 定义需要设置默认值的字段配置
        const defaultFields = [
            {
                name: `whether${getFieldName('AllowModify')}`,
                value: true,
            },
            {
                name: getFieldName('ModifyMinutes'),
                value: 15,
            },
            {
                name: getFieldName('RequiredModifyApproval'),
                value: false,
            },
            {
                name: 'whetherFillFaultNetwork',
                value: reportType === 'Continue' ? false : true,
            },
        ];

        // 批量设置默认值
        defaultFields.forEach(({ name, value }) => {
            const currentValue = form?.getFieldValue?.(name);
            if (currentValue === undefined || currentValue === null || currentValue === '') {
                form?.setFieldsValue?.({ [name]: value });
            }
        });
    }, [form, reportType]);

    // 监听表单字段变化，同步更新state中的模板选择值
    // 使用定时器延迟执行，确保父组件已经将API数据设置到表单中
    useEffect(() => {
        if (!form) return;

        // 同步函数：从表单读取模板ID并更新state
        const syncTemplateIdsToState = () => {
            // 获取故障描述模板ID（首报特有）
            const faultDescTemplateId = reportType === 'First' ? form.getFieldValue('firstReportDescribe') : undefined;

            // 读取模板ID字段
            // 首报使用无前缀的TemplateId字段，续报和终报使用有前缀的TemplateId字段
            const getTemplateIdFieldName = (baseName: string) => {
                if (reportType === 'First') {
                    return `${baseName}TemplateId`;
                }
                return `${reportType.toLowerCase()}${baseName.charAt(0).toUpperCase()}${baseName.slice(1)}TemplateId`;
            };

            const influenceScopeTemplateId = form.getFieldValue(getTemplateIdFieldName('influenceScope'));
            const causesAnalysisTemplateId = form.getFieldValue(getTemplateIdFieldName('causesAnalysis'));
            const treatmentMeasureTemplateId = form.getFieldValue(getTemplateIdFieldName('treatmentMeasure'));
            const businessRecoveryTemplateId = form.getFieldValue(getTemplateIdFieldName('businessRecovery'));
            const noticeContentTemplateId = form.getFieldValue(`${reportType.toLowerCase()}NoticeContentTemplateId`);

            // 只有当有数据时才更新state
            if (
                faultDescTemplateId ||
                influenceScopeTemplateId ||
                causesAnalysisTemplateId ||
                treatmentMeasureTemplateId ||
                businessRecoveryTemplateId ||
                noticeContentTemplateId
            ) {
                setState({
                    faultDescTemplate: faultDescTemplateId || '',
                    influenceScope: influenceScopeTemplateId || '',
                    causesAnalysis: causesAnalysisTemplateId || '',
                    treatmentMeasure: treatmentMeasureTemplateId || '',
                    businessRecovery: businessRecoveryTemplateId || '',
                    noticeContentTemplate: noticeContentTemplateId || '',
                });
            }
        };

        // 立即执行一次
        syncTemplateIdsToState();

        // 延迟500ms再执行一次，确保API数据已经设置到表单
        const timer = setTimeout(() => {
            syncTemplateIdsToState();
        }, 500);

        return () => clearTimeout(timer);
    }, [form, reportType, setState, noticeTemplateList]);

    return (
        <>
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
                            {getReportTitle(reportType)}
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
                            <Col span={24}>
                                <Form.Item
                                    label={
                                        <>
                                            <span>{`（1）是否自动${getReportTitle(reportType)}`}</span>
                                            {isManualReport && reportType === 'First' && (
                                                <Tooltip title="配置“是”，则首报不需要专业主管审核；配置“否”则首报需要专业主管审核">
                                                    <Icon antdIcon type="QuestionCircleOutlined" style={{ marginLeft: 2, marginTop: -1 }} />
                                                </Tooltip>
                                            )}
                                        </>
                                    }
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <Space className="radio-inline-align" align="center" size={8} wrap>
                                        <Form.Item
                                            name={
                                                reportType === 'First'
                                                    ? 'whetherFirstAutoReport'
                                                    : reportType === 'Continue'
                                                    ? 'whetherContinueAutoReport'
                                                    : 'whetherFinalAutoReport'
                                            }
                                            noStyle
                                            initialValue={true}
                                        >
                                            <Radio.Group
                                                options={[
                                                    { label: '是', value: true },
                                                    { label: '否', value: false },
                                                ]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prev, curr) => {
                                                const fieldName =
                                                    reportType === 'First'
                                                        ? 'whetherFirstAutoReport'
                                                        : reportType === 'Continue'
                                                        ? 'whetherContinueAutoReport'
                                                        : 'whetherFinalAutoReport';
                                                return prev[fieldName] !== curr[fieldName];
                                            }}
                                        >
                                            {({ getFieldValue }) => {
                                                const fieldName =
                                                    reportType === 'First'
                                                        ? 'whetherFirstAutoReport'
                                                        : reportType === 'Continue'
                                                        ? 'whetherContinueAutoReport'
                                                        : 'whetherFinalAutoReport';
                                                return getFieldValue(fieldName) === false ? (
                                                    <>
                                                        <Space align="center" size={4} wrap>
                                                            <span className="text-span">
                                                                {reportType === 'First'
                                                                    ? '故障发生'
                                                                    : reportType === 'Continue'
                                                                    ? '续报申请或阶段反馈推送'
                                                                    : '终报申请或返单推送'}
                                                            </span>
                                                            <Form.Item
                                                                name={
                                                                    reportType === 'First'
                                                                        ? 'firstAutoReportMinutes'
                                                                        : reportType === 'Continue'
                                                                        ? 'continueAutoReportMinutes'
                                                                        : 'finalAutoReportMinutes'
                                                                }
                                                                style={{ marginBottom: 0, display: 'inline-flex', alignItems: 'center' }}
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message:
                                                                            reportType === 'First'
                                                                                ? 't1需大于0且小于等于15'
                                                                                : reportType === 'Continue'
                                                                                ? 't2需大于等于15且小于等于60'
                                                                                : 't3需大于等于15且小于等于60',
                                                                    },
                                                                    ({ getFieldValue: gf }) => ({
                                                                        validator: async (_, value) => {
                                                                            if (value === undefined || value === null || value === '') return;
                                                                            const timeValue = Number(value);
                                                                            if (reportType === 'First') {
                                                                                if (!(timeValue > 0 && timeValue <= 15)) {
                                                                                    throw new Error('t1需大于0且小于等于15');
                                                                                }
                                                                            } else {
                                                                                if (!(timeValue >= 15 && timeValue <= 60)) {
                                                                                    throw new Error(
                                                                                        reportType === 'Continue'
                                                                                            ? 't2需大于等于15且小于等于60'
                                                                                            : 't3需大于等于15且小于等于60',
                                                                                    );
                                                                                }
                                                                            }
                                                                        },
                                                                    }),
                                                                ]}
                                                            >
                                                                <InputNumber<number>
                                                                    min={Number(reportType === 'First' ? 1 : 15)}
                                                                    max={Number(reportType === 'First' ? 15 : 60)}
                                                                    style={{ width: 60 }}
                                                                    precision={0}
                                                                    step={Number(1)}
                                                                    parser={parseIntOnly}
                                                                    disabled={disabled}
                                                                />
                                                            </Form.Item>
                                                            <span className="text-span">分钟后，自动{getReportTitle(reportType)}。</span>
                                                            <span className="text-span" style={{ color: '#4990e2' }}>
                                                                {reportType === 'First'
                                                                    ? '（注：填写的时间t1：0＜t1≤15且t1≥t4，即≥延迟上报的时间）'
                                                                    : reportType === 'Continue'
                                                                    ? '（注：填写的时间t2：15 ≤ t2 ≤ 60）'
                                                                    : '（注：填写的时间t3：15≤t3≤60）'}
                                                            </span>
                                                        </Space>
                                                    </>
                                                ) : null;
                                            }}
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label={`（2）${getReportTitle(reportType)}是否允许修改`}
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <Space className="radio-inline-align" align="center" size={8} wrap>
                                        <Form.Item name={`whether${getFieldName('AllowModify')}`} noStyle initialValue={true}>
                                            <Radio.Group
                                                options={[
                                                    { label: '是', value: true },
                                                    { label: '否', value: false },
                                                ]}
                                                disabled={disabled}
                                                onChange={(e) => {
                                                    if (onModifyPermissionChange) {
                                                        onModifyPermissionChange(reportType, e.target.value);
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prev, curr) =>
                                                prev[`whether${getFieldName('AllowModify')}`] !== curr[`whether${getFieldName('AllowModify')}`]
                                            }
                                        >
                                            {({ getFieldValue }) =>
                                                getFieldValue(`whether${getFieldName('AllowModify')}`) ? (
                                                    <>
                                                        <Space align="center" size={4} wrap>
                                                            <span className="text-span">{getReportTitle(reportType)}</span>
                                                            <Form.Item
                                                                name={`allow${reportType}ModifyMinutes`}
                                                                // initialValue={15}
                                                                style={{ marginBottom: 0, display: 'inline-flex', alignItems: 'center' }}
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                rules={[
                                                                    { required: true, message: 't5需大于等于15' },
                                                                    () => ({
                                                                        validator: async (_, value) => {
                                                                            if (value === undefined || value === null || value === '') return;
                                                                            const t5 = Number(value);
                                                                            if (!(t5 >= 15)) {
                                                                                throw new Error('t5需大于等于15');
                                                                            }
                                                                        },
                                                                    }),
                                                                ]}
                                                            >
                                                                <InputNumber<number>
                                                                    min={Number(15)}
                                                                    max={Number(60)}
                                                                    style={{ width: 60 }}
                                                                    precision={0}
                                                                    step={Number(1)}
                                                                    parser={parseIntOnly}
                                                                    disabled={disabled}
                                                                    onChange={(value) => {
                                                                        if (value) {
                                                                            // 同步时间值到其他模块
                                                                            const updateFields = {};
                                                                            // 生成正确的字段名
                                                                            const getFieldNameForType = (type: string) => {
                                                                                const prefix =
                                                                                    type === 'First'
                                                                                        ? 'allow' + type
                                                                                        : type === 'Continue'
                                                                                        ? 'allow' + type
                                                                                        : 'allow' + type;
                                                                                return prefix + 'ModifyMinutes';
                                                                            };

                                                                            if (reportType !== 'First') {
                                                                                updateFields[getFieldNameForType('First')] = value;
                                                                            }
                                                                            if (reportType !== 'Continue') {
                                                                                updateFields[getFieldNameForType('Continue')] = value;
                                                                            }
                                                                            if (reportType !== 'Final') {
                                                                                updateFields[getFieldNameForType('Final')] = value;
                                                                            }

                                                                            console.log('修改时间联动更新字段:', updateFields);
                                                                            form.setFieldsValue(updateFields);
                                                                        }
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                            <span className="text-span">分钟内，支持修改上报内容。</span>
                                                            <span
                                                                className="text-span"
                                                                style={{ color: '#4990e2' }}
                                                            >{`（注：填写的时间t5：15≤t5≤60）`}</span>
                                                        </Space>
                                                    </>
                                                ) : null
                                            }
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                            </Col>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prev, curr) =>
                                    prev[`whether${getFieldName('AllowModify')}`] !== curr[`whether${getFieldName('AllowModify')}`]
                                }
                            >
                                {({ getFieldValue }) =>
                                    getFieldValue(`whether${getFieldName('AllowModify')}`) ? (
                                        <Col span={24}>
                                            <Form.Item
                                                label={`${getReportTitle(reportType)}修改是否需要审核`}
                                                labelCol={{ span: 4, style: { textAlign: 'left', marginLeft: 30 } }}
                                                wrapperCol={{ span: 20 }}
                                            >
                                                <Space size={8} wrap>
                                                    <Form.Item name={getFieldName('RequiredModifyApproval')} noStyle initialValue={false}>
                                                        <Radio.Group
                                                            options={[
                                                                { label: '是', value: true },
                                                                { label: '否', value: false },
                                                            ]}
                                                            disabled={disabled}
                                                            onChange={(e) => {
                                                                if (onModifyApprovalChange) {
                                                                    onModifyApprovalChange(reportType, e.target.value);
                                                                }
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Space>
                                            </Form.Item>
                                        </Col>
                                    ) : null
                                }
                            </Form.Item>

                            {/* 故障等级预警和根因专业 - 手工首报不显示，手工续报终报显示 */}
                            {(!isManualReport || (isManualReport && reportType !== 'First')) && (
                                <Col span={24}>
                                    <Form.Item
                                        label={`（3）故障等级预警`}
                                        labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', whiteSpace: 'nowrap' }}>
                                                <span style={{ marginRight: '8px' }}>是否填充大模型推荐内容：</span>
                                                <Form.Item
                                                    name={
                                                        reportType === 'First'
                                                            ? 'whetherFirstFailureLevelLLM'
                                                            : reportType === 'Continue'
                                                            ? 'whetherContinueFailureLevelLLM'
                                                            : 'whetherFinalFailureLevelLLM'
                                                    }
                                                    noStyle
                                                >
                                                    <Radio.Group
                                                        options={[
                                                            { label: '是', value: true },
                                                            { label: '否', value: false },
                                                        ]}
                                                        disabled={disabled}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginRight: shouldShowBusinessImpact() ? '20px' : '0',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                <span style={{ marginRight: '8px' }}>根因专业：</span>
                                                <span style={{ marginRight: '8px' }}>是否填充大模型推荐内容：</span>
                                                <Form.Item
                                                    name={
                                                        reportType === 'First'
                                                            ? 'whetherFirstRootSpecialtyLLM'
                                                            : reportType === 'Continue'
                                                            ? 'whetherContinueRootSpecialtyLLM'
                                                            : 'whetherFinalRootSpecialtyLLM'
                                                    }
                                                    noStyle
                                                >
                                                    <Radio.Group
                                                        options={[
                                                            { label: '是', value: true },
                                                            { label: '否', value: false },
                                                        ]}
                                                        disabled={disabled}
                                                    />
                                                </Form.Item>
                                            </div>
                                            {shouldShowBusinessImpact() && (
                                                <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                                    <span style={{ marginRight: '8px' }}>是否影响业务：</span>
                                                    <span style={{ marginRight: '8px' }}>是否填充大模型推荐内容：</span>
                                                    <Form.Item
                                                        name={reportType === 'Continue' ? 'whetherContinueIsEffectLLM' : 'whetherFinalIsEffectLLM'}
                                                        noStyle
                                                    >
                                                        <Radio.Group
                                                            options={[
                                                                { label: '是', value: true },
                                                                { label: '否', value: false },
                                                            ]}
                                                            disabled={disabled}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            )}
                                        </div>
                                    </Form.Item>
                                </Col>
                            )}

                            {/* 首报特有字段：故障描述 */}
                            {reportType === 'First' && (
                                <Col span={24}>
                                    <Form.Item
                                        label={`（${getSequenceNumber(4)}）故障描述：`}
                                        labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            {/* 手工上报不显示"是否填充大模型推荐内容"配置项，其他情况正常显示 */}
                                            {!isManualReport && (
                                                <Form.Item
                                                    name={`whether${reportType}ReportDescribeLLM`}
                                                    style={{ marginBottom: 0 }}
                                                    initialValue={true}
                                                >
                                                    <Radio.Group
                                                        options={[
                                                            { label: '填充大模型推荐内容', value: true },
                                                            { label: '填充模版', value: false },
                                                        ]}
                                                        disabled={disabled}
                                                        style={{ display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                    />
                                                </Form.Item>
                                            )}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}ReportDescribeLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}ReportDescribeLLM`;
                                                    return (
                                                        <>
                                                            <Form.Item
                                                                name={`${reportType.toLowerCase()}ReportDescribeTemplateId`}
                                                                style={{
                                                                    display: isManualReport
                                                                        ? 'block'
                                                                        : !getFieldValue(fieldName) || getFieldValue(fieldName) === null
                                                                        ? 'block'
                                                                        : 'none',
                                                                }}
                                                            >
                                                                <Select
                                                                    style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                                    options={noticeTemplateList}
                                                                    fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                                    onChange={(val: any, opt: any) => {
                                                                        const templateIdField = `${reportType.toLowerCase()}ReportDescribeTemplateId`;
                                                                        const contentField = `${reportType.toLowerCase()}FaultDescribe`;
                                                                        // 如果找不到对应选项，设置为空
                                                                        form.setFieldsValue({
                                                                            [templateIdField]: opt?.templateId || val,
                                                                            [contentField]: opt?.templateContent || '',
                                                                        });
                                                                    }}
                                                                    disabled={disabled}
                                                                />
                                                            </Form.Item>
                                                            {(isManualReport || !getFieldValue(fieldName) || getFieldValue(fieldName) === false) && (
                                                                <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true)}>
                                                                    模板管理
                                                                </Button>
                                                            )}
                                                        </>
                                                    );
                                                }}
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prev, curr) => {
                                            const fieldName = `whether${reportType}ReportDescribeLLM`;
                                            return prev[fieldName] !== curr[fieldName];
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            const fieldName = `whether${reportType}ReportDescribeLLM`;
                                            return (
                                                <Form.Item
                                                    name={`${reportType.toLowerCase()}FaultDescribe`}
                                                    style={{ display: isManualReport ? 'block' : !getFieldValue(fieldName) ? 'block' : 'none' }}
                                                >
                                                    <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                            )}

                            {/* 续报和终报特有字段：故障网络影响范围 */}
                            {(reportType === 'Continue' || reportType === 'Final') && (
                                <Col span={24}>
                                    <Form.Item
                                        label={`（${getSequenceNumber(4)}）故障网络影响范围：`}
                                        labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            {/* 续报和终报始终显示"是否填充大模型推荐内容"配置项 */}
                                            {(reportType === 'Continue' || reportType === 'Final' || (reportType === 'First' && !isManualReport)) && (
                                                <Form.Item
                                                    name={`whether${reportType}InfluenceScopeLLM`}
                                                    style={{ marginBottom: 0 }}
                                                    initialValue={true}
                                                >
                                                    <Radio.Group
                                                        options={[
                                                            { label: '填充大模型推荐内容', value: true },
                                                            { label: '填充模版', value: false },
                                                        ]}
                                                        disabled={disabled}
                                                        style={{ display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                    />
                                                </Form.Item>
                                            )}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    return (
                                                        <>
                                                            <Form.Item
                                                                name={`${reportType.toLowerCase()}InfluenceScopeTemplateId`}
                                                                style={{
                                                                    display:
                                                                        !getFieldValue(fieldName) || getFieldValue(fieldName) === null
                                                                            ? 'block'
                                                                            : 'none',
                                                                }}
                                                            >
                                                                <Select
                                                                    style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                                    options={noticeTemplateList}
                                                                    fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                                    onChange={(val: any, opt: any) => {
                                                                        // 根据reportType设置对应的模板ID字段
                                                                        const templateIdField = `${reportType.toLowerCase()}InfluenceScopeTemplateId`;
                                                                        const influenceScopeField = `${reportType.toLowerCase()}InfluenceScope`;
                                                                        form.setFieldsValue({
                                                                            [templateIdField]: opt?.templateId || val,
                                                                            [influenceScopeField]: opt?.templateContent || '',
                                                                        });
                                                                    }}
                                                                    disabled={disabled}
                                                                />
                                                            </Form.Item>
                                                        </>
                                                    );
                                                }}
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    return (
                                                        (!getFieldValue(fieldName) || getFieldValue(fieldName) === false) && (
                                                            <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true)}>
                                                                模板管理
                                                            </Button>
                                                        )
                                                    );
                                                }}
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prev, curr) => {
                                            const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                            return prev[fieldName] !== curr[fieldName];
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                            return (
                                                <Form.Item
                                                    name={`${reportType.toLowerCase()}InfluenceScope`}
                                                    style={{ display: !getFieldValue(fieldName) ? 'block' : 'none' }}
                                                >
                                                    <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                            )}

                            {/* 首报特有字段：故障网络影响范围 */}
                            {reportType === 'First' && (
                                <Col span={24}>
                                    <Form.Item
                                        label={`（${getSequenceNumber(5)}）故障网络影响范围：`}
                                        labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            {/* 手工上报不显示"是否填充大模型推荐内容"配置项，其他情况正常显示 */}
                                            {!isManualReport && (
                                                <Form.Item
                                                    name={`whether${reportType}InfluenceScopeLLM`}
                                                    style={{ marginBottom: 0 }}
                                                    initialValue={true}
                                                >
                                                    <Radio.Group
                                                        options={[
                                                            { label: '填充大模型推荐内容', value: true },
                                                            { label: '填充模版', value: false },
                                                        ]}
                                                        disabled={disabled}
                                                        style={{ display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                    />
                                                </Form.Item>
                                            )}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    return (
                                                        <Form.Item
                                                            name={`${reportType.toLowerCase()}InfluenceScopeTemplateId`}
                                                            style={{
                                                                display: !isManualReport
                                                                    ? !getFieldValue(fieldName) || getFieldValue(fieldName) === null
                                                                        ? 'block'
                                                                        : 'none'
                                                                    : 'block',
                                                            }}
                                                        >
                                                            <Select
                                                                style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                                options={noticeTemplateList}
                                                                fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                                onChange={(val: any, opt: any) => {
                                                                    // 根据reportType设置对应的模板ID字段
                                                                    const templateIdField = `${reportType.toLowerCase()}InfluenceScopeTemplateId`;
                                                                    const influenceScopeField = `${reportType.toLowerCase()}InfluenceScope`;
                                                                    form.setFieldsValue({
                                                                        [templateIdField]: opt?.templateId || val,
                                                                        [influenceScopeField]: opt?.templateContent || '',
                                                                    });
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                        </Form.Item>
                                                    );
                                                }}
                                            </Form.Item>
                                            {/* 只有当选择填充模版时才显示模板管理按钮 */}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                                    const shouldShowButton = isManualReport
                                                        ? true
                                                        : !getFieldValue(fieldName) || getFieldValue(fieldName) === false;
                                                    return (
                                                        shouldShowButton && (
                                                            <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true)}>
                                                                模板管理
                                                            </Button>
                                                        )
                                                    );
                                                }}
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prev, curr) => {
                                            const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                            return prev[fieldName] !== curr[fieldName];
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            const fieldName = `whether${reportType}InfluenceScopeLLM`;
                                            return (
                                                <Form.Item
                                                    name={`${reportType.toLowerCase()}InfluenceScope`}
                                                    style={{
                                                        display: isManualReport ? 'block' : !getFieldValue(fieldName) ? 'block' : 'none',
                                                    }}
                                                >
                                                    <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                            )}

                            {/* 续报和终报特有字段：故障业务影响范围 */}
                            {(reportType === 'Continue' || reportType === 'Final') && (
                                <Col span={24}>
                                    <Form.Item
                                        label={`（${getSequenceNumber(5)}）故障业务影响范围：`}
                                        labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            {/* 续报和终报始终显示，首报仅在非手工上报时显示 */}
                                            {(reportType === 'Continue' || reportType === 'Final' || (reportType === 'First' && !isManualReport)) && (
                                                <Form.Item
                                                    name={`whether${reportType}BusinessImpactLLM`}
                                                    style={{ marginBottom: 0 }}
                                                    initialValue={true}
                                                >
                                                    <Radio.Group
                                                        options={[
                                                            { label: '填充大模型推荐内容', value: true },
                                                            { label: '填充模版', value: false },
                                                        ]}
                                                        disabled={disabled}
                                                        style={{ display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                    />
                                                </Form.Item>
                                            )}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}BusinessImpactLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}BusinessImpactLLM`;
                                                    return (
                                                        <Form.Item
                                                            name={`${reportType.toLowerCase()}BusinessImpactTemplateId`}
                                                            style={{
                                                                display:
                                                                    !getFieldValue(fieldName) || getFieldValue(fieldName) === null ? 'block' : 'none',
                                                            }}
                                                        >
                                                            <Select
                                                                style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                                options={noticeTemplateList}
                                                                fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                                // value={state.businessImpactScope ? Number(state.businessImpactScope) : undefined}
                                                                onChange={(val: any, opt: any) => {
                                                                    // selectUseRef.current.businessImpactScope = opt?.templateId;
                                                                    // setState({
                                                                    //     businessImpactScope: opt?.templateId || '',
                                                                    // });
                                                                    // 根据reportType设置对应的模板ID字段
                                                                    const templateIdField = `${reportType.toLowerCase()}BusinessImpactTemplateId`;
                                                                    const businessImpactField = `${reportType.toLowerCase()}BusinessImpact`;
                                                                    form.setFieldsValue({
                                                                        [businessImpactField]: opt?.templateContent || '',
                                                                        [templateIdField]: opt?.templateId || val,
                                                                    });
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                        </Form.Item>
                                                    );
                                                }}
                                            </Form.Item>
                                            {/* 只有当选择填充模版时才显示模板管理按钮 */}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}BusinessImpactLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}BusinessImpactLLM`;
                                                    return (
                                                        (!getFieldValue(fieldName) || getFieldValue(fieldName) === false) && (
                                                            <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true)}>
                                                                模板管理
                                                            </Button>
                                                        )
                                                    );
                                                }}
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prev, curr) => {
                                            const fieldName = `whether${reportType}BusinessImpactLLM`;
                                            return prev[fieldName] !== curr[fieldName];
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            const fieldName = `whether${reportType}BusinessImpactLLM`;
                                            return (
                                                <Form.Item
                                                    name={`${reportType.toLowerCase()}BusinessImpact`}
                                                    style={{ display: !getFieldValue(fieldName) ? 'block' : 'none' }}
                                                >
                                                    <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                            )}

                            {/* 三者通用 */}
                            <Col span={24}>
                                <Form.Item
                                    label={`（${getSequenceNumber(6)}）故障原因分析：`}
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                        {/* 续报和终报始终显示，首报仅在非手工上报时显示 */}
                                        {(reportType === 'Continue' || reportType === 'Final' || (reportType === 'First' && !isManualReport)) && (
                                            <Form.Item name={`whether${reportType}CausesAnalysisLLM`} style={{ marginBottom: 0 }} initialValue={true}>
                                                <Radio.Group
                                                    options={[
                                                        { label: '填充大模型推荐内容', value: true },
                                                        { label: '填充模版', value: false },
                                                    ]}
                                                    disabled={disabled}
                                                    style={{ display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                />
                                            </Form.Item>
                                        )}
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prev, curr) => {
                                                const fieldName = `whether${reportType}CausesAnalysisLLM`;
                                                return prev[fieldName] !== curr[fieldName];
                                            }}
                                        >
                                            {({ getFieldValue }) => {
                                                const fieldName = `whether${reportType}CausesAnalysisLLM`;
                                                return (
                                                    <Form.Item
                                                        name={`${reportType.toLowerCase()}CausesAnalysisTemplateId`}
                                                        style={{
                                                            display:
                                                                reportType === 'Continue' ||
                                                                reportType === 'Final' ||
                                                                (reportType === 'First' && !isManualReport)
                                                                    ? !getFieldValue(fieldName)
                                                                        ? 'block'
                                                                        : 'none'
                                                                    : 'block',
                                                        }}
                                                    >
                                                        <Select
                                                            style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                            options={noticeTemplateList}
                                                            fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                            onChange={(val: any, opt: any) => {
                                                                // 根据reportType设置对应的模板ID字段
                                                                const templateIdField = `${reportType.toLowerCase()}CausesAnalysisTemplateId`;
                                                                const causesAnalysisField = `${reportType.toLowerCase()}CausesAnalysis`;
                                                                form.setFieldsValue({
                                                                    [templateIdField]: opt?.templateId || val,
                                                                    [causesAnalysisField]: opt?.templateContent || '',
                                                                });
                                                            }}
                                                            disabled={disabled}
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        {/* 只有当选择填充模版时才显示模板管理按钮 */}
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prev, curr) => {
                                                const fieldName = `whether${reportType}CausesAnalysisLLM`;
                                                return prev[fieldName] !== curr[fieldName];
                                            }}
                                        >
                                            {({ getFieldValue }) => {
                                                const fieldName = `whether${reportType}CausesAnalysisLLM`;
                                                const shouldShowRadio =
                                                    reportType === 'Continue' ||
                                                    reportType === 'Final' ||
                                                    (reportType === 'First' && !isManualReport);
                                                const shouldShowButton = shouldShowRadio
                                                    ? !getFieldValue(fieldName) || getFieldValue(fieldName) === false
                                                    : true;
                                                return (
                                                    shouldShowButton && (
                                                        <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true)}>
                                                            模板管理
                                                        </Button>
                                                    )
                                                );
                                            }}
                                        </Form.Item>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prev, curr) => {
                                        const fieldName = `whether${reportType}CausesAnalysisLLM`;
                                        return prev[fieldName] !== curr[fieldName];
                                    }}
                                >
                                    {({ getFieldValue }) => {
                                        const fieldName = `whether${reportType}CausesAnalysisLLM`;
                                        return (
                                            <Form.Item
                                                name={`${reportType.toLowerCase()}CausesAnalysis`}
                                                style={{
                                                    display:
                                                        reportType === 'Continue' ||
                                                        reportType === 'Final' ||
                                                        (reportType === 'First' && !isManualReport)
                                                            ? !getFieldValue(fieldName)
                                                                ? 'block'
                                                                : 'none'
                                                            : 'block',
                                                }}
                                            >
                                                <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                            {/* 故障处理进度 */}
                            <Col span={24}>
                                <Form.Item
                                    label={
                                        reportType === 'Final'
                                            ? `（${getSequenceNumber(7)}）业务处理进展：`
                                            : `（${getSequenceNumber(7)}）业务处理进展：`
                                    }
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                        {/* 续报和终报始终显示，首报仅在非手工上报时显示 */}
                                        {(reportType === 'Continue' || reportType === 'Final' || (reportType === 'First' && !isManualReport)) && (
                                            <Form.Item
                                                name={`whether${reportType}TreatmentMeasureLLM`}
                                                style={{ marginBottom: 0 }}
                                                initialValue={true}
                                            >
                                                <Radio.Group
                                                    options={[
                                                        { label: '填充大模型推荐内容', value: true },
                                                        { label: '填充模版', value: false },
                                                    ]}
                                                    disabled={disabled}
                                                    style={{ display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                />
                                            </Form.Item>
                                        )}
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prev, curr) => {
                                                const fieldName = `whether${reportType}TreatmentMeasureLLM`;
                                                return prev[fieldName] !== curr[fieldName];
                                            }}
                                        >
                                            {({ getFieldValue }) => {
                                                const fieldName = `whether${reportType}TreatmentMeasureLLM`;
                                                return (
                                                    <Form.Item
                                                        name={`${reportType.toLowerCase()}TreatmentMeasureTemplateId`}
                                                        style={{
                                                            display:
                                                                reportType === 'Continue' ||
                                                                reportType === 'Final' ||
                                                                (reportType === 'First' && !isManualReport)
                                                                    ? !getFieldValue(fieldName)
                                                                        ? 'block'
                                                                        : 'none'
                                                                    : 'block',
                                                        }}
                                                    >
                                                        <Select
                                                            style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                            options={noticeTemplateList}
                                                            fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                            onChange={(val: any, opt: any) => {
                                                                // 根据reportType设置对应的字段
                                                                const contentField = `${reportType.toLowerCase()}TreatmentMeasure`;
                                                                const templateIdField = `${reportType.toLowerCase()}TreatmentMeasureTemplateId`;
                                                                form.setFieldsValue({
                                                                    [templateIdField]: opt?.templateId || val,
                                                                    [contentField]: opt?.templateContent || '',
                                                                });
                                                            }}
                                                            disabled={disabled}
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prev, curr) => {
                                                const fieldName = `whether${reportType}TreatmentMeasureLLM`;
                                                return prev[fieldName] !== curr[fieldName];
                                            }}
                                        >
                                            {({ getFieldValue }) => {
                                                const fieldName = `whether${reportType}TreatmentMeasureLLM`;
                                                const shouldShowRadio =
                                                    reportType === 'Continue' ||
                                                    reportType === 'Final' ||
                                                    (reportType === 'First' && !isManualReport);
                                                const shouldShowButton = shouldShowRadio
                                                    ? !getFieldValue(fieldName) || getFieldValue(fieldName) === false
                                                    : true;
                                                return (
                                                    shouldShowButton && (
                                                        <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true)}>
                                                            模板管理
                                                        </Button>
                                                    )
                                                );
                                            }}
                                        </Form.Item>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prev, curr) => {
                                        const fieldName = `whether${reportType}TreatmentMeasureLLM`;
                                        return prev[fieldName] !== curr[fieldName];
                                    }}
                                >
                                    {({ getFieldValue }) => {
                                        const fieldName = `whether${reportType}TreatmentMeasureLLM`;
                                        return (
                                            <Form.Item
                                                name={`${reportType.toLowerCase()}TreatmentMeasure`}
                                                style={{
                                                    display:
                                                        reportType === 'Continue' ||
                                                        reportType === 'Final' ||
                                                        (reportType === 'First' && !isManualReport)
                                                            ? !getFieldValue(fieldName)
                                                                ? 'block'
                                                                : 'none'
                                                            : 'block',
                                                }}
                                            >
                                                <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>

                            {/* 续报和终报特有字段：业务恢复进展 */}
                            {shouldShowBusinessRecovery() && (
                                <Col span={24}>
                                    <Form.Item
                                        label={
                                            reportType === 'Final'
                                                ? `（${getSequenceNumber(8)}）业务恢复进展：`
                                                : `（${getSequenceNumber(8)}）业务恢复进展：`
                                        }
                                        labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            {/* 续报和终报始终显示，首报仅在非手工上报时显示 */}
                                            {(reportType === 'Continue' || reportType === 'Final' || (reportType === 'First' && !isManualReport)) && (
                                                <Form.Item
                                                    name={`whether${reportType}BusinessRecoveryLLM`}
                                                    style={{ marginBottom: 0 }}
                                                    initialValue={true}
                                                >
                                                    <Radio.Group
                                                        options={[
                                                            { label: '填充大模型推荐内容', value: true },
                                                            { label: '填充模版', value: false },
                                                        ]}
                                                        disabled={disabled}
                                                        style={{ display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                    />
                                                </Form.Item>
                                            )}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}BusinessRecoveryLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}BusinessRecoveryLLM`;
                                                    return (
                                                        <Form.Item
                                                            name={`${reportType.toLowerCase()}BusinessRecoveryTemplateId`}
                                                            style={{
                                                                display:
                                                                    reportType === 'Continue' ||
                                                                    reportType === 'Final' ||
                                                                    (reportType === 'First' && !isManualReport)
                                                                        ? !getFieldValue(fieldName)
                                                                            ? 'block'
                                                                            : 'none'
                                                                        : 'block',
                                                            }}
                                                        >
                                                            <Select
                                                                style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                                options={noticeTemplateList}
                                                                fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                                onChange={(val: any, opt: any) => {
                                                                    // 根据reportType设置对应的字段
                                                                    const contentField = `${reportType.toLowerCase()}BusinessRecovery`;
                                                                    const templateIdField = `${reportType.toLowerCase()}BusinessRecoveryTemplateId`;
                                                                    form.setFieldsValue({
                                                                        [templateIdField]: opt?.templateId || val,
                                                                        [contentField]: opt?.templateContent || '',
                                                                    });
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                        </Form.Item>
                                                    );
                                                }}
                                            </Form.Item>
                                            {/* 只有当选择填充模版时才显示模板管理按钮 */}
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prev, curr) => {
                                                    const fieldName = `whether${reportType}BusinessRecoveryLLM`;
                                                    return prev[fieldName] !== curr[fieldName];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const fieldName = `whether${reportType}BusinessRecoveryLLM`;
                                                    const shouldShowRadio =
                                                        reportType === 'Continue' ||
                                                        reportType === 'Final' ||
                                                        (reportType === 'First' && !isManualReport);
                                                    const shouldShowButton = shouldShowRadio
                                                        ? !getFieldValue(fieldName) || getFieldValue(fieldName) === false
                                                        : true;
                                                    return (
                                                        shouldShowButton && (
                                                            <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true)}>
                                                                模板管理
                                                            </Button>
                                                        )
                                                    );
                                                }}
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prev, curr) => {
                                            const fieldName = `whether${reportType}BusinessRecoveryLLM`;
                                            return prev[fieldName] !== curr[fieldName];
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            const fieldName = `whether${reportType}BusinessRecoveryLLM`;
                                            return (
                                                <Form.Item
                                                    name={`${reportType.toLowerCase()}BusinessRecovery`}
                                                    style={{
                                                        display:
                                                            reportType === 'Continue' ||
                                                            reportType === 'Final' ||
                                                            (reportType === 'First' && !isManualReport)
                                                                ? !getFieldValue(fieldName)
                                                                    ? 'block'
                                                                    : 'none'
                                                                : 'block',
                                                    }}
                                                >
                                                    <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                            )}

                            {/* 三者通用 */}

                            <Col span={24}>
                                <Form.Item
                                    label={
                                        reportType === 'Continue'
                                            ? `（${getSequenceNumber(9)}）通知内容：`
                                            : shouldShowBusinessRecovery()
                                            ? `（${getSequenceNumber(9)}）通知内容：`
                                            : `（${getSequenceNumber(8)}）通知内容：`
                                    }
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                        <Form.Item name={`${reportType.toLowerCase()}NotificationContentTemplateId`}>
                                            <Select
                                                style={{ width: 180, display: 'flex', gap: '8px 4px', flexWrap: 'nowrap' }}
                                                options={faultNoticeTemplateList}
                                                placeholder={getDefaultTemplate(reportType)}
                                                fieldNames={{ label: 'templateName', value: 'templateId' }}
                                                onChange={(val: any, opt: any) => {
                                                    // 同时设置模板内容和模板ID
                                                    const noticeContentField = `${reportType.toLowerCase()}NotificationContent`;
                                                    const templateIdField = `${reportType.toLowerCase()}NotificationContentTemplateId`;
                                                    form.setFieldsValue({
                                                        [templateIdField]: opt?.templateId || val,
                                                        [noticeContentField]: opt?.templateContent || '',
                                                    });
                                                }}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                        <Button disabled={disabled} type="primary" onClick={() => setNoticeVisible(true, 'notification')}>
                                            模板管理
                                        </Button>
                                    </div>
                                </Form.Item>
                                <Form.Item name={`${reportType.toLowerCase()}NotificationContent`}>
                                    <Input.TextArea rows={4} disabled={true} style={{ marginLeft: 30 }} />
                                </Form.Item>
                            </Col>

                            {/* 三者通用 */}
                            <Col span={24}>
                                <Form.Item
                                    label={
                                        reportType === 'Continue'
                                            ? `（${getSequenceNumber(10)}）通知方式`
                                            : shouldShowBusinessRecovery()
                                            ? `（${getSequenceNumber(10)}）通知方式`
                                            : `（${getSequenceNumber(9)}）通知方式`
                                    }
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                    style={{ marginBottom: 0 }}
                                ></Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item wrapperCol={{ span: 24 }} style={{ paddingLeft: 30 }}>
                                    <NoticeTypeCheckbox
                                        //@ts-ignore
                                        dataSource={localNoticeTypeValue}
                                        key={`${reportType}-${JSON.stringify(localNoticeTypeValue)}`}
                                        onChange={(value) => {
                                            setLocalNoticeTypeValue(value);
                                            // 根据reportType生成对应的API字段名
                                            const fieldName =
                                                reportType === 'First'
                                                    ? 'firstNotificationType'
                                                    : reportType === 'Continue'
                                                    ? 'continueNotificationType'
                                                    : 'finalNotificationType';
                                            const detailFieldName =
                                                reportType === 'First'
                                                    ? 'firstNotificationDetailList'
                                                    : reportType === 'Continue'
                                                    ? 'continueNotificationDetailList'
                                                    : 'finalNotificationDetailList';

                                            // 确保数据格式正确
                                            const notificationType = Array.isArray(value.notificationType) ? value.notificationType : [];
                                            const notificationDetailList = Array.isArray(value.notificationDetailList)
                                                ? value.notificationDetailList
                                                : [];

                                            form.setFieldsValue({
                                                [fieldName]: JSON.stringify(notificationType),
                                                [detailFieldName]: JSON.stringify(notificationDetailList),
                                            });
                                        }}
                                        disabled={disabled}
                                    />
                                </Form.Item>

                                {/* 隐藏的表单字段用于存储通知类型数据 - 使用textarea来支持数组数据 */}
                                <Form.Item
                                    name={
                                        reportType === 'First'
                                            ? 'firstNotificationType'
                                            : reportType === 'Continue'
                                            ? 'continueNotificationType'
                                            : 'finalNotificationType'
                                    }
                                    style={{ display: 'none' }}
                                >
                                    <Input.TextArea style={{ display: 'none' }} style={{ marginLeft: 30 }} />
                                </Form.Item>
                                <Form.Item
                                    name={
                                        reportType === 'First'
                                            ? 'firstNotificationDetailList'
                                            : reportType === 'Continue'
                                            ? 'continueNotificationDetailList'
                                            : 'finalNotificationDetailList'
                                    }
                                    style={{ display: 'none' }}
                                >
                                    <Input.TextArea style={{ display: 'none' }} style={{ marginLeft: 30 }} />
                                </Form.Item>
                            </Col>
                            {/*通知对象 三者通用 */}
                            <Col span={24}>
                                <Form.Item
                                    label={
                                        reportType === 'Continue'
                                            ? `（${getSequenceNumber(11)}）通知对象`
                                            : shouldShowBusinessRecovery()
                                            ? `（${getSequenceNumber(11)}）通知对象`
                                            : `（${getSequenceNumber(10)}）通知对象`
                                    }
                                    labelCol={{ span: 4, style: { textAlign: 'left' } }}
                                    wrapperCol={{ span: 20 }}
                                    style={{ marginBottom: 0 }}
                                ></Form.Item>
                            </Col>
                            {/* 通知对象配置 */}
                            {/* {(reportType === 'Continue' || reportType === 'Final') && (
                                <Col span={24}>
                                    <Form.Item wrapperCol={{ span: 24 }}>
                                        <Radio.Group
                                            defaultValue="auto"
                                            onChange={(e) => {
                                                const fieldName =
                                                    reportType === 'Continue' ? 'continueNotificationConfig' : 'finalNotificationConfig';
                                                form.setFieldsValue({ [fieldName]: e.target.value });
                                            }}
                                        >
                                            <Radio value="auto">自动通知上一次通知人</Radio>
                                            <Radio value="config">读取配置的通知对象</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            )} */}
                            <Col span={24}>
                                <Form.Item wrapperCol={{ span: 24 }} style={{ paddingLeft: 30 }}>
                                    <Button
                                        type="primary"
                                        onClick={() => setUserSelectModalVisible(true)}
                                        disabled={disabled}
                                        style={{ marginBottom: 12 }}
                                    >
                                        选择用户
                                    </Button>
                                    <NoticeTable
                                        dataSource={isManualReport ? [] : localNotificationUserInfos}
                                        phoneList={localNotificationTel?.split(',') || []}
                                        isManualReport={isManualReport}
                                        manualProfessional={currentProfessional}
                                        ruleProfessional={ruleProfessional}
                                        editable
                                        onTableDelete={handleTableDelete}
                                        onTagDelete={handleTagDelete}
                                        tableDeleteBtnType="default"
                                        faultLevel={[]}
                                    />
                                </Form.Item>

                                {/* 隐藏的表单字段用于存储通知用户数据 */}
                                <Form.Item
                                    name={
                                        reportType === 'First'
                                            ? 'firstNotificationUser'
                                            : reportType === 'Continue'
                                            ? 'continueNotificationUser'
                                            : 'finalNotificationUser'
                                    }
                                    style={{ display: 'none' }}
                                >
                                    <Input />
                                </Form.Item>
                                {/* 隐藏字段存储模板ID */}
                                <Form.Item name="faultDescTemplateId" style={{ display: 'none' }}></Form.Item>
                            </Col>
                        </>
                    )}
                    {/* 隐藏字段 - 不需要折叠 */}
                    <Col span={24}>
                        <Form.Item name={`${reportType.toLowerCase()}ReportDescribeTemplateId`} style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={`${reportType.toLowerCase()}InfluenceScopeTemplateId`} style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={`${reportType.toLowerCase()}CausesAnalysisTemplateId`} style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={`${reportType.toLowerCase()}TreatmentMeasureTemplateId`} style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        {/* 续报和终报的模板ID字段 */}
                        {reportType === 'Continue' && (
                            <>
                                <Form.Item name="continueReportDescribeTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="continueInfluenceScopeTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="continueCausesAnalysisTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="continueTreatmentMeasureTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                            </>
                        )}
                        {reportType === 'Final' && (
                            <>
                                <Form.Item name="finalReportDescribeTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="finalInfluenceScopeTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="finalCausesAnalysisTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="finalTreatmentMeasureTemplateId" style={{ display: 'none' }}>
                                    <Input />
                                </Form.Item>
                            </>
                        )}
                        <Form.Item
                            name={
                                reportType === 'First'
                                    ? 'firstNotificationTel'
                                    : reportType === 'Continue'
                                    ? 'continueNotificationTel'
                                    : 'finalNotificationTel'
                            }
                            style={{ display: 'none' }}
                        >
                            <Input />
                        </Form.Item>
                        {/* 续报和终报的通知对象配置字段 */}
                        {(reportType === 'Continue' || reportType === 'Final') && (
                            <Form.Item
                                name={reportType === 'Continue' ? 'continueNotificationConfig' : 'finalNotificationConfig'}
                                initialValue="auto"
                                style={{ display: 'none' }}
                            >
                                <Input />
                            </Form.Item>
                        )}
                    </Col>
                </Col>
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
            </Row>

            {/* 用户选择Modal */}
            <Modal
                width="85vw"
                style={{ height: '80vh' }}
                bodyStyle={{ height: '70vh', overflow: 'auto' }}
                title="选择用户"
                destroyOnClose
                maskClosable={false}
                visible={userSelectModalVisible}
                onCancel={() => {
                    if (isManualReport) {
                        // 手工上报：直接关闭弹窗，不回填数据
                        setUserSelectModalVisible(false);
                        // 重置用户选择组件
                        if (userSelectRef.current?.reset) {
                            userSelectRef.current.reset();
                        }
                    } else {
                        // 自动上报：正常关闭
                        setUserSelectModalVisible(false);
                        // 重置用户选择组件
                        if (userSelectRef.current?.reset) {
                            userSelectRef.current.reset();
                        }
                    }
                }}
                onOk={() => {
                    if (isManualReport) {
                        // 手工上报：调用接口，不关闭弹窗
                        handleManualReportSave();
                    } else {
                        // 自动上报：正常回填，关闭弹窗
                        onUserSelectModalOk();
                        // 重置用户选择组件
                        if (userSelectRef.current?.reset) {
                            userSelectRef.current.reset();
                        }
                        // 清空用户列表
                        if (userSelectRef.current?.clearUserList) {
                            userSelectRef.current.clearUserList();
                        }
                    }
                }}
                afterClose={() => {
                    // 弹窗完全关闭后重置用户选择组件
                    if (userSelectRef.current?.reset) {
                        userSelectRef.current.reset();
                    }
                }}
            >
                <UserSelect
                    ref={userSelectRef}
                    getUserGroupList={getUserGroupList}
                    getProvinceList={getProvinceList}
                    getUserTableData={getUserTableData}
                    ruleType="userMobile"
                    mode="edit"
                    noticeFinalData={noticeFinalData}
                    faultLevel={[]}
                    isManualReport={isManualReport}
                    professionalList={professionalList || []}
                    reportType={reportType}
                    getManualReportNotificationSetting={getManualReportNotificationSetting}
                />
            </Modal>
        </>
    );
};

export default ReportFormSection;
