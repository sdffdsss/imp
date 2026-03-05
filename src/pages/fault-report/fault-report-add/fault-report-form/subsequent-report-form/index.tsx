import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Form, Input, Col, Row, Select, DatePicker } from 'oss-ui';
import { Selector } from 'antd-mobile';
import { FormProps, FormItemProps } from 'oss-ui/es/form';
import useLoginInfoModel from '@Src/hox';
import CustomTextarea from './custom-textarea';
import ReportNotice from '../first-report-form/report-notice';

import { ItemCard, FormUpload, FaultBusinessTable, TrunkCableField } from '../../../components';
import {
    continueReportTypeList,
    failureReportingLevelList,
    ReportNoticeDefaultValue,
    FAILURE_SOURCE_TYPE,
    ReportType,
    PUBLIC_OPINION,
    MART_CABLE_MAJOR,
    WIRELESS_NET,
} from '../../../type';
import { getEquipmentTypeList } from '../../../api';
import TicketTable from '../association-ticket';

type SubsequentReportFormProps = {
    allEnumData: {
        equipmentTypeList: {
            dCode: string;
            dName: string;
        }[];
        reportLevelList: {
            dCode: string;
            dName: string;
        }[];
        majorList: {
            dCode: string;
            dName: string;
        }[];
        regionList: {
            regionId: string;
            regionName: string;
        }[];
        isEffectBusinessList: {
            dCode: string;
            dName: string;
        }[];
    };
    latestReport: any;
    allReportList: any;
    reportNoticeClassName?: string;
    onSpecialtyChange?: (type: string) => void;
    noticeTemplateClassName?: string;
    noticeTemplateAddClassName?: string;
    userGroupSelectModalClassName?: string;
    // draftData: any;
    noticeTypeData: ReportNoticeDefaultValue;
    originalAlarmCount?: number;
    source?: FAILURE_SOURCE_TYPE.AUTO | FAILURE_SOURCE_TYPE.MANUAL;
    ticketModalClassName?: string;
    darkTheme?: boolean;
    hasDraftStatus?: boolean;
    failureRecoverTimeDisabledDate?: (currentDate: moment.Moment) => boolean;
    failureRecoverTimeDisabledTime?: (currentDate: moment.Moment) => any;
    firstReportFailureTime?: string;
    reportNoticeRef?: any;
    GNOCdisable: boolean;
    isWireless?: any;
    title?: string;
    isMajor?: boolean;
    btnKey?: string;
    onConTypeChange?: (type: ReportType) => void;
    onCustomTextareaChange?: (values: any) => void;
} & FormProps &
    FormItemProps;

type EnumType = {
    dCode: string;
    dName: string;
}[];

const SubsequentReportForm: React.FC<SubsequentReportFormProps> = (props) => {
    const {
        allEnumData,
        latestReport,
        allReportList,
        reportNoticeClassName,
        noticeTemplateClassName,
        noticeTemplateAddClassName,
        userGroupSelectModalClassName,
        // draftData,
        noticeTypeData,
        ticketModalClassName,
        darkTheme,
        hasDraftStatus,
        failureRecoverTimeDisabledDate,
        failureRecoverTimeDisabledTime,
        firstReportFailureTime,
        reportNoticeRef,
        onSpecialtyChange,
        GNOCdisable,
        isWireless,
        title,
        isMajor,
        btnKey,
        onConTypeChange,
        onCustomTextareaChange,
    } = props;
    const { zoneLevelFlags } = useLoginInfoModel();
    const { reportLevelList, isEffectBusinessList, majorList } = allEnumData;
    const { influenceScope, causesAnalysis, treatmentMeasure, businessImpactScope, businessRecoverProcess } = latestReport || {};
    const [reportNoticeError, setReportNoticeError] = useState('');
    const [equipmentTypeList, setEquipmentTypeList] = useState<EnumType>([]);
    const [continueType, setContinueType] = useState(ReportType.RENEWAL);
    const [isEffectBusiness, setIsEffectBusiness] = useState(false);

    const onReportNoticeChange = (values) => {
        const { notificationContent, notificationTel, notificationUser, notificationType } = values;
        if (notificationType) {
            if (!notificationTel && !notificationUser && notificationType !== '3') {
                setReportNoticeError('通知对象不能为空！');
            } else if (!notificationContent) {
                setReportNoticeError('通知内容不能为空！');
            } else {
                setReportNoticeError('');
            }
        } else {
            setReportNoticeError('');
        }
    };

    // 终报校验故障网络影响范围
    const influenceScopeValidator = (rule, value) => {
        const { influenceScope: influenceScopeVal, influenceScopeFollow } = value || {};
        const isNeed = isWireless || (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0);
        if (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0 && isNeed) {
            if (!influenceScopeVal && influenceScopeFollow === 'no') {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('请填写故障网络影响范围!');
            }
            if (!influenceScopeVal && influenceScopeFollow === 'yes') {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('请填写故障网络影响范围!');
            }
        }
        if (continueType === ReportType.FINAL_REPORT && isNeed) {
            if (!influenceScopeVal) {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('请填写故障网络影响范围!');
            }
        }
        return Promise.resolve();
    };
    const causesAnalysisValidator = (rule, value) => {
        const { causesAnalysis: causesAnalysisVal, causesAnalysisFollow } = value || {};

        if (!causesAnalysisVal && causesAnalysisFollow === 'no') {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('请填写故障原因分析!');
        }
        if (!causesAnalysisVal && causesAnalysisFollow === 'yes') {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('请填写故障原因分析!');
        }
        return Promise.resolve();
    };
    const treatmentMeasureValidator = (rule, value) => {
        const { treatmentMeasure: treatmentMeasureVal, treatmentMeasureFollow } = value || {};

        if (!treatmentMeasureVal && treatmentMeasureFollow === 'no') {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('请填写故障处理进展!');
        }
        if (!treatmentMeasureVal && treatmentMeasureFollow === 'yes') {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('请填写故障处理进展!');
        }
        return Promise.resolve();
    };
    const onContinueTypeChange = (value, form) => {
        setContinueType(value);
        if (value === ReportType.RENEWAL) {
            form?.setFieldsValue({
                rootSpecialty: form?.getFieldValue('rootSpecialty') || '',
            });
        }
        onConTypeChange?.(value);
    };

    useEffect(() => {
        // 只要追加类型变了，就通知子组件，不管有没有草稿状态
        reportNoticeRef?.current?.handleReportTypeChange?.(continueType);
    }, [continueType, reportNoticeRef]);

    useEffect(() => {
        switch (btnKey) {
            case 'majorFaultReport:progressReportEditApplication':
            case 'majorFaultReport:progressReportEdit':
            case 'majorFaultReport:progressReportSupplementalApplication':
            case 'majorFaultReport:progressReportSupplemental':
            case 'majorFaultReport:progressReportApplication':
                setContinueType(ReportType.RENEWAL);
                break;
            case 'majorFaultReport:finalReportEditApplication':
            case 'majorFaultReport:finalReportEdit':
            case 'majorFaultReport:finalReportApplication':
                setContinueType(ReportType.FINAL_REPORT);
                break;
            default:
                break;
        }
    }, [btnKey]);

    useEffect(() => {
        if (allReportList && allReportList[0]) {
            const { specialty } = allReportList[0];
            const data = { parentId: specialty };
            getEquipmentTypeList(data).then((res) => {
                setEquipmentTypeList(res.data || []);
            });
        }
    }, [allReportList]);
    useEffect(() => {
        onSpecialtyChange?.('continue');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allReportList]);
    const currentMajor = allReportList?.[0]?.specialty;
    const firstRenewal = allReportList.filter((r) => r.continueType === ReportType.RENEWAL).length === 0;

    const formatMajorList = () => {
        // 非集团账号将客服舆情信息专业过滤掉
        if (isWireless) {
            return majorList.filter((item) => item.dName === '无线网');
        }
        if (!zoneLevelFlags.isCountryZone) {
            return majorList.filter((item) => item.dCode !== PUBLIC_OPINION);
        }
        return majorList;
    };
    const formatRootMajorList = () => {
        if (!zoneLevelFlags.isCountryZone) {
            return majorList.filter((item) => item.dCode !== PUBLIC_OPINION);
        }
        return majorList;
    };

    const checkIsDisabled = () => {
        let isDisabled = false;
        if (isMajor) {
            switch (btnKey) {
                case 'majorFaultReport:progressReportApprove':
                case 'majorFaultReport:progressReportEditApplication':
                case 'majorFaultReport:progressReportEditApprove':
                case 'majorFaultReport:finalReportApprove':
                case 'majorFaultReport:finalReportEditApplication':
                case 'majorFaultReport:finalReportEditApprove':
                case 'faultReport:finalReport':
                case 'majorFaultReport:finalReportEdit':
                    isDisabled = true;
                    break;
                default:
                    isDisabled = false;
                    break;
            }
        }
        return isDisabled;
    };

    return (
        <ItemCard title={title || '续报'} hideDivider>
            <Row>
                <Col span={8}>
                    <Form.Item noStyle shouldUpdate>
                        {(form) => {
                            return (
                                <Form.Item
                                    label="追加类型"
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                    name="continueType"
                                    rules={[{ required: true, message: '请选择追加类型！' }]}
                                >
                                    <Select
                                        disabled={checkIsDisabled()}
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                        onChange={(v) => onContinueTypeChange(v, form)}
                                    >
                                        {continueReportTypeList.map((item) => {
                                            return (
                                                <Select.Option key={item.value} value={item.value}>
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="追加人"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 13 }}
                        rules={[{ required: true, message: '请输入追加人！' }]}
                        name="reportUserName"
                        // hidden
                    >
                        <Input bordered={false} disabled />
                    </Form.Item>
                    <Form.Item name="reportUser" hidden>
                        <Input bordered={false} disabled />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="故障上报级别"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 15 }}
                        name="reportLevel"
                        rules={[{ required: true, message: '请选择故障上报级别！' }]}
                    >
                        <Selector disabled className="fault-report-form-selector" multiple options={failureReportingLevelList} />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="故障等级预警"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 13 }}
                        name="failureLevel"
                        rules={[{ required: true, message: '请选择故障等级预警！' }]}
                    >
                        <Select
                            disabled={currentMajor === WIRELESS_NET}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                        >
                            {reportLevelList
                                .filter((item) => item.dCode !== '6')
                                .map((item) => {
                                    // 续报终报过滤待确认
                                    return (
                                        <Select.Option key={item.dCode} value={item.dCode}>
                                            {item.dName}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="故障类别"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 13 }}
                        name="failureClassHis"
                        rules={[{ required: true, message: '请选择故障类别！' }]}
                    >
                        <Select placeholder="请选择" allowClear getPopupContainer={(triggerNode) => triggerNode.parentElement}>
                            {equipmentTypeList.map((item) => {
                                return (
                                    <Select.Option key={item.dCode} value={item.dCode}>
                                        {item.dName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="故障恢复时间"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 13 }}
                        name="failureRecoverTime"
                        tooltip={{
                            title: '首报、续报请填写故障预计恢复时间，终报请填写故障实际恢复时间',
                            color: darkTheme ? 'rgb(4, 97, 189)' : 'rgb(255, 252, 242)',
                            placement: 'bottomLeft',
                            overlayStyle: { maxWidth: 500, color: '#000' },
                            overlayInnerStyle: darkTheme
                                ? { color: 'rgb(255, 255, 255)', border: '1px solid rgb(0, 165, 255)', borderRadius: '4px' }
                                : { color: 'rgb(51, 51, 51)', border: '1px solid rgb(153, 153, 153)', borderRadius: '4px' },
                            arrowPointAtCenter: true,
                        }}
                        rules={[
                            { required: true, message: '请选择故障恢复时间！' },
                            {
                                validator: (_, value) => {
                                    if (!value || value.isBefore(moment(firstReportFailureTime))) {
                                        return Promise.reject(new Error('故障恢复时间必须在故障发生时间之后!'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker
                            showTime
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={failureRecoverTimeDisabledDate}
                            disabledTime={failureRecoverTimeDisabledTime}
                            allowClear={false}
                            getPopupContainer={((triggerNode) => triggerNode.parentElement) as any}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="是否影响业务"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 13 }}
                        name="isEffectBusiness"
                        rules={[{ required: true, message: '请选择是否影响业务！' }]}
                    >
                        <Select placeholder="请选择" allowClear getPopupContainer={(triggerNode) => triggerNode.parentElement}>
                            {isEffectBusinessList.map((item) => {
                                return (
                                    <Select.Option key={item.dCode} value={item.dCode}>
                                        {item.dName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            const continueTypeTemp = getFieldValue('continueType');

                            return (
                                <Form.Item
                                    label="根因专业"
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                    name="rootSpecialty"
                                    rules={[{ required: continueTypeTemp === ReportType.FINAL_REPORT, message: '请选择根因专业！' }]}
                                >
                                    <Select placeholder="请选择" getPopupContainer={(triggerNode) => triggerNode.parentElement} allowClear>
                                        {formatRootMajorList().map((item) => {
                                            return (
                                                <Select.Option key={item.dCode} value={item.dCode} placeholder="请选择根因专业">
                                                    {item.dName}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="故障发生地点"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 15 }}
                        name="actionScene"
                        rules={[{ required: true, message: '请填写故障发生地点！' }]}
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                </Col>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        const continueTypeTemp = getFieldValue('continueType');
                        if (continueTypeTemp === ReportType.FINAL_REPORT) {
                            return (
                                <Col span={8}>
                                    <Form.Item
                                        label="业务恢复时间"
                                        name="businessRecoverTime"
                                        dependencies={['isEffectBusiness']}
                                        labelCol={{ span: 9 }}
                                        wrapperCol={{ span: 13 }}
                                        rules={[
                                            // ({ getFieldValue }) => ({
                                            //     required: getFieldValue('isEffectBusiness') === '1',
                                            // }),
                                            ({ getFieldValue }) => ({
                                                validator: async (_, val) => {
                                                    const isEffectBusinessValue = getFieldValue('isEffectBusiness');
                                                    if (isEffectBusinessValue === '1') {
                                                        if (!val) {
                                                            return Promise.reject(new Error('请选择业务恢复时间！'));
                                                        }
                                                    }
                                                    if (val && val.isBefore(moment(firstReportFailureTime))) {
                                                        return Promise.reject(new Error('业务恢复时间必须在故障发生时间之后!'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                    >
                                        <DatePicker
                                            showTime
                                            style={{ width: '100%' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            disabledDate={failureRecoverTimeDisabledDate}
                                            disabledTime={failureRecoverTimeDisabledTime}
                                            allowClear={false}
                                            getPopupContainer={((triggerNode) => triggerNode.parentElement) as any}
                                        />
                                    </Form.Item>
                                </Col>
                            );
                        }
                        return null;
                    }}
                </Form.Item>

                {/* 干线光缆专业下需要额外展示的字段 */}
                {currentMajor === MART_CABLE_MAJOR && <TrunkCableField />}

                <Col span={24}>
                    <Form.Item noStyle name="faultWorkNoDetails">
                        <TicketTable ticketModalClassName={ticketModalClassName} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="故障网络影响范围"
                        name="influenceScope"
                        required={isWireless || (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0)}
                        rules={[{ validator: influenceScopeValidator }]}
                    >
                        <CustomTextarea
                            textAreaProps={{ showCount: true, maxLength: 1000, style: { height: 62 } }}
                            latestData={influenceScope}
                            radioFieldName="influenceScopeFollow"
                            textFieldName="influenceScope"
                            defaultRadioValue="yes"
                            onChange={onCustomTextareaChange}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="故障业务影响范围"
                        name="businessImpactScope"
                        dependencies={['isEffectBusiness']}
                        required={isEffectBusiness || isWireless || (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0)}
                        rules={[
                            // ({ getFieldValue }) => ({
                            //     required: getFieldValue('isEffectBusiness') === '1',
                            // }),
                            ({ getFieldValue }) => ({
                                validator: async (_, val) => {
                                    const isEffectBusinessValue = getFieldValue('isEffectBusiness');
                                    setIsEffectBusiness(isEffectBusinessValue === '1');
                                    const { businessImpactScope: businessImpactScopeVal, businessImpactScopeFollow } = val || {};
                                    console.log(latestReport, val, '===val');
                                    if (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0) {
                                        if (!businessImpactScopeVal && businessImpactScopeFollow === 'no') {
                                            // eslint-disable-next-line prefer-promise-reject-errors
                                            return Promise.reject('请填写故障业务影响范围!');
                                        }
                                        if (!businessImpactScopeVal && businessImpactScopeFollow === 'yes') {
                                            // eslint-disable-next-line prefer-promise-reject-errors
                                            return Promise.reject('请填写故障业务影响范围!');
                                        }
                                    } else {
                                        if (isEffectBusinessValue === '1' || isWireless) {
                                            if (!businessImpactScopeVal) {
                                                return Promise.reject('请填写故障业务影响范围!');
                                            }
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <CustomTextarea
                            isVisibleByFollow={firstRenewal}
                            textAreaProps={{ showCount: true, maxLength: 1000, style: { height: 62 } }}
                            latestData={businessImpactScope}
                            radioFieldName="businessImpactScopeFollow"
                            textFieldName="businessImpactScope"
                            defaultRadioValue={firstRenewal ? 'no' : 'yes'}
                            onChange={onCustomTextareaChange}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="故障原因分析"
                        name="causesAnalysis"
                        required
                        rules={[{ validator: causesAnalysisValidator }]}
                        tooltip={{
                            title: '首报、续报请填写故障原因初判信息，终报请填写实际故障原因',
                            color: darkTheme ? 'rgb(4, 97, 189)' : 'rgb(255, 252, 242)',
                            placement: 'bottomLeft',
                            overlayStyle: { maxWidth: 500, color: '#000' },
                            overlayInnerStyle: darkTheme
                                ? { color: 'rgb(255, 255, 255)', border: '1px solid rgb(0, 165, 255)', borderRadius: '4px' }
                                : { color: 'rgb(51, 51, 51)', border: '1px solid rgb(153, 153, 153)', borderRadius: '4px' },
                            arrowPointAtCenter: true,
                        }}
                    >
                        <CustomTextarea
                            textAreaProps={{
                                showCount: true,
                                maxLength: 1000,
                                style: { height: 62 },
                                placeholder:
                                    latestReport?.faultDistinctionType === 2 && latestReport?.source === 0
                                        ? '请填写发生故障的根因专业、具体故障网元以及直接原因。'
                                        : '',
                            }}
                            latestData={causesAnalysis}
                            radioFieldName="causesAnalysisFollow"
                            textFieldName="causesAnalysis"
                            defaultRadioValue="no"
                            onChange={onCustomTextareaChange}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="故障处理进展" name="treatmentMeasure" required rules={[{ validator: treatmentMeasureValidator }]}>
                        <CustomTextarea
                            textAreaProps={{ showCount: true, maxLength: 1000, style: { height: 62 } }}
                            latestData={treatmentMeasure}
                            radioFieldName="treatmentMeasureFollow"
                            textFieldName="treatmentMeasure"
                            defaultRadioValue="no"
                            onChange={onCustomTextareaChange}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="业务恢复进展"
                        name="businessRecoverProcess"
                        dependencies={['isEffectBusiness']}
                        rules={[
                            // ({ getFieldValue }) => ({
                            //     required: getFieldValue('isEffectBusiness') === '1',
                            // }),
                            ({ getFieldValue }) => ({
                                required:
                                    getFieldValue('isEffectBusiness') === '1' ||
                                    isWireless ||
                                    (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0),
                                validator: async (_, val) => {
                                    const isEffectBusinessValue = getFieldValue('isEffectBusiness');
                                    const { businessRecoverProcess: businessRecoverProcessVal, businessRecoverProcessFollow } = val || {};
                                    console.log(latestReport, val, '===val22');
                                    if (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0) {
                                        if (!businessRecoverProcessVal && businessRecoverProcessFollow === 'no') {
                                            // eslint-disable-next-line prefer-promise-reject-errors
                                            return Promise.reject('请填写业务恢复进展!');
                                        }
                                        if (!businessRecoverProcessVal && businessRecoverProcessFollow === 'yes') {
                                            // eslint-disable-next-line prefer-promise-reject-errors
                                            return Promise.reject('请填写业务恢复进展!');
                                        }
                                    } else {
                                        if (isEffectBusinessValue === '1' || isWireless) {
                                            if (!businessRecoverProcessVal) {
                                                // eslint-disable-next-line prefer-promise-reject-errors
                                                return Promise.reject('请填写业务恢复进展!');
                                            }
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <CustomTextarea
                            isVisibleByFollow={firstRenewal}
                            textAreaProps={{
                                showCount: true,
                                maxLength: 1000,
                                style: { height: 62 },
                                placeholder:
                                    latestReport?.faultDistinctionType === 2 && latestReport?.source === 0
                                        ? '参考故障业务影响范围填写业务恢复情况，区分4G/5G业务填报。'
                                        : '',
                            }}
                            latestData={businessRecoverProcess}
                            radioFieldName="businessRecoverProcessFollow"
                            textFieldName="businessRecoverProcess"
                            defaultRadioValue={firstRenewal ? 'no' : 'yes'}
                            onChange={onCustomTextareaChange}
                        />
                    </Form.Item>
                </Col>
                {currentMajor === MART_CABLE_MAJOR && (
                    <Col span={24}>
                        <Form.Item label="故障影响业务详情">
                            <FaultBusinessTable data={{ standardAlarmId: allReportList?.[0]?.standardAlarmId }} />
                        </Form.Item>
                    </Col>
                )}

                <Col span={12}>
                    <Form.Item label="追加附件" name="uploudFiles" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                        <FormUpload isWireless={isWireless || (latestReport?.faultDistinctionType === 2 && latestReport?.source === 0)} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item noStyle name="notice">
                                    <ReportNotice
                                        onChange={onReportNoticeChange}
                                        tableDeleteBtnType="icon"
                                        templateBtnType="primary"
                                        reportNoticeError={reportNoticeError}
                                        className={reportNoticeClassName}
                                        noticeTemplateClassName={noticeTemplateClassName}
                                        noticeTemplateAddClassName={noticeTemplateAddClassName}
                                        userGroupSelectModalClassName={userGroupSelectModalClassName}
                                        defaultValue={noticeTypeData}
                                        labelColSpan={3}
                                        wrapperColSpan={21}
                                        reportType={continueType}
                                        hasDraftStatus={hasDraftStatus}
                                        ref={reportNoticeRef}
                                        GNOCdisable={GNOCdisable}
                                        faultLevel={getFieldValue('reportLevel')}
                                        isWireless={latestReport?.faultDistinctionType === 2 && latestReport?.source === 0}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Col>
            </Row>
        </ItemCard>
    );
};
export default SubsequentReportForm;
