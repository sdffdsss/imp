import React, { useState, useEffect, useMemo, useRef } from 'react';
import constants from '@Src/common/constants';
import { Form, Input, Col, Row, DatePicker, Select, Button } from 'oss-ui';
import { Selector } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import { FormProps, FormItemProps } from 'oss-ui/es/form';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import FormUpload from '../../../components/form-upload';
import { ItemCard, TrunkCableField, FaultBusinessTable, ProvincesInvolved, PublicSentiment } from '../../../components';
import {
    failureReportingLevelList,
    failureReportingUsageList,
    ReportNoticeDefaultValue,
    FAILURE_SOURCE_TYPE,
    ReportType,
    MART_CABLE_MAJOR,
    PUBLIC_OPINION,
    CATEGORY_TRAFFIC,
    CATEGORY_PUBLIC,
    CATEGORY_COMPLAINT,
} from '../../../type';
import ReportNotice from './report-notice';
import { getEquipmentTypeList, getSubMajorTypeList } from '../../../api';
import OriginalAlarmCount from './original-alarm-count';

import TicketTable from '../association-ticket';
import AlarmTable from '../association-alarm';

export const noticeValidator = (rule, value, callback) => {
    try {
        const { notificationContent, notificationTel, notificationUser, notificationType } = value;
        if (notificationType) {
            if (!notificationTel && !notificationUser) {
                callback('通知对象不能为空！');
            }
            if (!notificationContent) {
                callback('通知内容不能为空！');
            }
        }
        callback();
    } catch (error) {
        callback(error);
    }
};

type FirstReportFormProps = {
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
    };
    onSpecialtyChange: () => void;
    onReportLevelChange: (val: any) => void;
    isProvinceZone: boolean;
    reportNoticeClassName?: string;
    noticeTemplateClassName?: string;
    noticeTemplateAddClassName?: string;
    userGroupSelectModalClassName?: string;
    goToListPage?: () => void;
    hideListButton?: boolean;
    ticketModalClassName?: string;
    noticeTypeData: ReportNoticeDefaultValue;
    // originalAlarmCount?: number;
    source: FAILURE_SOURCE_TYPE.AUTO | FAILURE_SOURCE_TYPE.MANUAL;
    standardAlarmId?: string;
    allReportList: any;
    draftData: any;
    darkTheme?: boolean;
    hasDraftStatus?: boolean;
    failureRecoverTimeDisabledDate?: (currentDate: moment.Moment) => boolean;
    failureRecoverTimeDisabledTime?: (currentDate: moment.Moment) => any;
    reportNoticeRef?: any;
    specialty?: any;
    restType: boolean;
    GNOCdisable: boolean;
    isWireless?: any;
    theme?: string; // 主题 ''| white
    isMajor: boolean; // 重大故障上报，新流程
    isFaultReportNew: boolean; // 是否新的故障上报
    ruleType?: number;
    onAlarmChange: (row: any, searchTime: any) => void;
} & FormProps &
    FormItemProps;

type EnumType = {
    dCode: string;
    dName: string;
}[];
const FirstReportForm: React.FC<FirstReportFormProps> = (props) => {
    const {
        allEnumData,
        onSpecialtyChange,
        onReportLevelChange,
        isProvinceZone: propsIsProvinceZone,
        reportNoticeClassName,
        noticeTemplateClassName,
        noticeTemplateAddClassName,
        userGroupSelectModalClassName,
        goToListPage,
        hideListButton,
        noticeTypeData,
        // originalAlarmCount,
        standardAlarmId,
        source,
        ticketModalClassName,
        allReportList,
        draftData,
        darkTheme,
        hasDraftStatus,
        failureRecoverTimeDisabledDate,
        failureRecoverTimeDisabledTime,
        reportNoticeRef,
        restType,
        GNOCdisable,
        isWireless,
        isMajor,
        isFaultReportNew,
        ruleType,
        onAlarmChange,
    } = props;
    const { systemInfo, userInfo, zoneLevelFlags } = useLoginInfoModel();
    const parseUserInfo = userInfo && JSON.parse(userInfo);

    const { majorList, regionList, reportLevelList } = allEnumData;
    const { currentZone } = systemInfo;

    const history = useHistory();

    const [currentMajor, setCurrentMajor] = useState<any>();
    const currentMajorRef = useRef<any>(currentMajor);
    currentMajorRef.current = currentMajor;
    const [currentCategory, setCurrentCategory] = useState<null | string>(null); // 当前选中的故障类别
    const [subMajorList, setSubMajorList] = useState<EnumType>([]);
    const [equipmentTypeList, setEquipmentTypeList] = useState<EnumType>([]);
    const [reportNoticeError, setReportNoticeError] = useState('');
    const frameVisible = window.location.href.indexOf('hideNav') !== -1; // 是否为嵌入的故障上报
    const [assAlarmVisible, setAssAlarmVisible] = useState(false);
    const [assTicketVisible, setAssTicketVisible] = useState(false);
    const finalRegionList = useMemo(() => {
        if (propsIsProvinceZone) {
            return regionList;
        }
        return [
            {
                label: currentZone?.zoneName || parseUserInfo?.zones?.[0]?.zoneName,
                value: currentZone?.zoneId || parseUserInfo?.zones?.[0]?.zoneId,
            },
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [regionList, propsIsProvinceZone, systemInfo]);

    const goBack = () => {
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report`);
    };

    useEffect(() => {
        if (currentMajorRef.current === undefined) {
            return;
        }
        const data = { parentId: currentMajorRef.current };
        getSubMajorTypeList(data).then((res) => {
            setSubMajorList(res.data);
        });
        getEquipmentTypeList(data).then((res) => {
            let optionsList = res.data;
            // 客服舆情信息下 故障类别只展示客诉、舆情
            if (currentMajorRef.current === PUBLIC_OPINION) {
                optionsList = optionsList.filter((item) => item.dCode !== CATEGORY_TRAFFIC);
            }
            setEquipmentTypeList(optionsList);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMajorRef.current]);

    useEffect(() => {
        if ((allReportList && allReportList[0]) || draftData) {
            const { specialty, failureClass } = allReportList[0] || draftData;
            setCurrentMajor(specialty);
            setCurrentCategory(failureClass);
        }
    }, [allReportList, draftData]);
    useEffect(() => {
        if (props.specialty) {
            const timer = setTimeout(() => {
                setCurrentMajor(props.specialty);
            }, 300);
        }
    }, [props.specialty]);

    // 重置时触发
    useEffect(() => {
        setCurrentMajor(null);
        setCurrentCategory(null);
    }, [restType]);
    useEffect(() => {
        if (isWireless) {
            setCurrentMajor('11');
            setCurrentCategory(null);
        }
    }, []);

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

    // 客服舆情信息专业故障的手工上报，只有集团支持，大区和省份和地市账号无法选择该专业手工上报故障
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
    const lastFailureReportingLevelList = useMemo(() => {
        return (
            failureReportingLevelList?.map((item) => ({
                ...item,
                disabled: (ruleType === 1 && item.value === '0') || (ruleType === 2 && item.value === '1'),
            })) || []
        );
    }, [ruleType]);

    const onAlarmTableChange = (rows, searchTime) => {
        if (rows.length > 0) {
            onAlarmChange?.(rows[0], searchTime);
        }
    };
    return (
        <>
            <ItemCard
                title="基本信息"
                hideDivider
                extra={
                    !hideListButton &&
                    !frameVisible && (
                        <Button type="primary" onClick={goToListPage || goBack} style={{ marginLeft: 20 }}>
                            故障查询
                        </Button>
                    )
                }
            >
                <Row>
                    <Col span={8}>
                        <Form.Item label="故障标识" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }} name="flagId">
                            <Input bordered={false} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            label="故障主题"
                            labelCol={{ span: 4, style: { marginLeft: 17 } }}
                            wrapperCol={{ span: 20 }}
                            rules={[{ required: true, message: '请输入故障主题！' }]}
                            name="topic"
                        >
                            <Input
                                // placeholder="请输入故障主题"
                                maxLength={40}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="上报专业"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            name="specialty"
                            rules={[{ required: true, message: '请选择上报专业！' }]}
                        >
                            <Select
                                placeholder="请选择"
                                disabled={isMajor && !isFaultReportNew}
                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                onChange={(v) => {
                                    setCurrentMajor(v);
                                    setCurrentCategory(null);
                                    onSpecialtyChange?.();
                                }}
                            >
                                {formatMajorList().map((item) => {
                                    return (
                                        <Select.Option key={item.dCode} value={item.dCode} placeholder="请选择专业">
                                            {item.dName}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    {currentMajor !== PUBLIC_OPINION && (
                        <Col span={8}>
                            <Form.Item label="子专业" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="subSpecialty">
                                <Select placeholder="请选择" allowClear getPopupContainer={(triggerNode) => triggerNode.parentElement}>
                                    {subMajorList.map((item) => {
                                        return (
                                            <Select.Option key={item.dCode} value={item.dCode}>
                                                {item.dName}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={8}>
                        <Form.Item
                            label="故障类别"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            name="failureClass"
                            rules={[{ required: true, message: '请选择故障类别！' }]}
                        >
                            <Select
                                placeholder="请选择"
                                allowClear
                                onChange={setCurrentCategory}
                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                            >
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
                        <Form.Item label="归属省份" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }} name="provinceName">
                            <Input bordered={false} disabled />
                        </Form.Item>
                        <Form.Item name="province" hidden>
                            <Input bordered={false} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="地市"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            name="city"
                            rules={[{ required: true, message: '请选择地市！' }]}
                        >
                            <Select
                                allowClear
                                placeholder="请选择地市"
                                disabled={!propsIsProvinceZone}
                                labelInValue
                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                            >
                                {finalRegionList.map((region) => {
                                    return (
                                        <Select.Option key={region.regionId} value={region.regionId}>
                                            {region.regionName}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* 客服舆情信息专业下不同展示 */}
                    {currentMajor === PUBLIC_OPINION ? (
                        <ProvincesInvolved />
                    ) : (
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
                    )}
                    <Col span={8}>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item
                                        label="故障发生时间"
                                        labelCol={{ span: 9 }}
                                        wrapperCol={{ span: 15 }}
                                        name="failureTime"
                                        rules={[
                                            { required: true, message: '请选择故障发生时间！' },
                                            {
                                                validator: (_, value) => {
                                                    const startTime = getFieldValue('failureRecoverTime');
                                                    if (value && startTime && !value.isAfter(startTime)) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value && startTime && !value.isBefore(startTime)) {
                                                        return Promise.reject(new Error('发生时间不能大于发生时间'));
                                                    }
                                                    if (!value) {
                                                        return Promise.resolve();
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
                                            disabledDate={(current) => {
                                                return current && current > moment().endOf('day');
                                            }}
                                            disabledTime={(current) => {
                                                if (current) {
                                                    const now = moment();
                                                    const date = now.date();
                                                    const hour = now.hour();
                                                    const minute = now.minute();
                                                    const second = now.second();

                                                    return {
                                                        disabledHours: () => {
                                                            if (current.date() < date) {
                                                                return [];
                                                            }
                                                            return Array.from({ length: 23 - hour }).map((item, index) => index + 1 + hour);
                                                        },
                                                        disabledMinutes: (selectedHour) => {
                                                            if (current.date() < date) {
                                                                return [];
                                                            }
                                                            if (selectedHour < hour) {
                                                                return [];
                                                            }
                                                            return Array.from({ length: 59 - minute }).map((item, index) => index + 1 + minute);
                                                        },
                                                        disabledSeconds: (selectedHour, selectedMinute) => {
                                                            if (current.date() < date) {
                                                                return [];
                                                            }
                                                            if (selectedHour < hour) {
                                                                return [];
                                                            }
                                                            if (selectedMinute < minute) {
                                                                return [];
                                                            }
                                                            return Array.from({ length: 59 - second }).map((item, index) => index + 1 + second);
                                                        },
                                                    };
                                                }
                                                return {
                                                    disabledHours: () => [],
                                                    disabledMinutes: () => [],
                                                    disabledSeconds: () => [],
                                                };
                                            }}
                                            allowClear={false}
                                            getPopupContainer={((triggerNode) => triggerNode.parentElement) as any}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item
                                        label="故障恢复时间"
                                        labelCol={{ span: 9 }}
                                        wrapperCol={{ span: 15 }}
                                        name="failureRecoverTime"
                                        rules={[
                                            {
                                                validator: (_, value) => {
                                                    const startTime = getFieldValue('failureTime');
                                                    if (value && startTime && !value.isBefore(startTime)) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value && startTime && !value.isAfter(startTime)) {
                                                        return Promise.reject(new Error('恢复时间不能小于发生时间'));
                                                    }
                                                    if (!value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject();
                                                },
                                            },
                                        ]}
                                        tooltip={{
                                            title: '首报、续报请填写故障预计恢复时间，终报请填写故障实际恢复时间',
                                            color: darkTheme ? 'rgb(4, 97, 189)' : 'rgb(255, 252, 242)',
                                            // placement: 'bottomLeft',
                                            overlayStyle: { maxWidth: 500, color: '#000' },
                                            overlayInnerStyle: darkTheme
                                                ? { color: 'rgb(255, 255, 255)', border: '1px solid rgb(0, 165, 255)', borderRadius: '4px' }
                                                : { color: 'rgb(51, 51, 51)', border: '1px solid rgb(153, 153, 153)', borderRadius: '4px' },
                                            arrowPointAtCenter: true,
                                        }}
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
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="故障上报级别"
                            labelCol={{ span: 8, style: { marginLeft: 16 } }}
                            wrapperCol={{ span: 16 }}
                            name="reportLevel"
                            rules={[{ required: true, message: '请选择故障上报级别！' }]}
                        >
                            <Selector
                                className="fault-report-form-selector"
                                multiple
                                options={lastFailureReportingLevelList}
                                onChange={(v) => {
                                    onReportLevelChange?.(v);
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="上报用途"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            name="application"
                            rules={[{ required: true, message: '请选择故障上报用途！' }]}
                        >
                            <Selector className="fault-report-form-selector" options={failureReportingUsageList} />
                        </Form.Item>
                    </Col>
                </Row>
            </ItemCard>
            <ItemCard
                title="关联告警"
                hideDivider
                extra={
                    currentMajor !== PUBLIC_OPINION &&
                    !standardAlarmId && (
                        <Button
                            type="primary"
                            disabled={!currentMajor}
                            onClick={() => {
                                setAssAlarmVisible(true);
                            }}
                            style={{ marginBottom: 8 }}
                        >
                            +
                        </Button>
                    )
                }
                extraStyle={{ top: 8, left: 120 }}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item label="原始告警数" hidden={source === FAILURE_SOURCE_TYPE.MANUAL}>
                            <OriginalAlarmCount standardAlarmId={standardAlarmId} source={source} />
                        </Form.Item>
                    </Col>

                    {currentMajor !== PUBLIC_OPINION && !standardAlarmId && (
                        <Col span={24}>
                            <Form.Item noStyle name="relationAlarmDetails">
                                <AlarmTable
                                    ticketModalClassName={ticketModalClassName}
                                    specialty={currentMajor}
                                    assTicketVisible={assAlarmVisible}
                                    setAssTicketVisible={setAssAlarmVisible}
                                    onChange={onAlarmTableChange}
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>
            </ItemCard>
            <ItemCard
                title="关联工单"
                hideDivider
                extra={
                    currentMajor !== PUBLIC_OPINION && (
                        <Button
                            type="primary"
                            onClick={() => {
                                setAssTicketVisible(true);
                            }}
                            style={{ marginBottom: 8 }}
                        >
                            +
                        </Button>
                    )
                }
                extraStyle={{ top: 8, left: 120 }}
            >
                <Row>
                    {currentMajor !== PUBLIC_OPINION && (
                        <Col span={24}>
                            <Form.Item noStyle name="faultWorkNoDetails">
                                <TicketTable
                                    ticketModalClassName={ticketModalClassName}
                                    assTicketVisible={assTicketVisible}
                                    setAssTicketVisible={setAssTicketVisible}
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>
            </ItemCard>
            <ItemCard title="首报" hideDivider>
                <Row>
                    <Col span={8}>
                        <Form.Item label="根因专业" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="rootSpecialty">
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
                    </Col>

                    {currentMajor !== PUBLIC_OPINION && (
                        <Col span={16}>
                            <Form.Item dependencies={['specialty']}>
                                {({ getFieldValue }) => {
                                    const disabled = String(getFieldValue('specialty')) === '11';

                                    return (
                                        <Form.Item
                                            label="故障等级预警"
                                            labelCol={{ span: 4, style: { marginLeft: 0 } }}
                                            wrapperCol={{ span: 10 }}
                                            name="failureLevel"
                                        >
                                            <Select
                                                placeholder="请选择"
                                                disabled={disabled}
                                                allowClear
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            >
                                                {reportLevelList.map((item) => {
                                                    return (
                                                        <Select.Option key={item.dCode} value={item.dCode}>
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
                    )}

                    {/* 当故障类别选择“舆情/客诉”，则除以上字段，增加显示以下字段 */}
                    {(currentCategory === CATEGORY_PUBLIC || currentCategory === CATEGORY_COMPLAINT) && (
                        <PublicSentiment currentCategory={currentCategory} />
                    )}

                    {/* 干线光缆专业下需要额外展示的字段 */}
                    {currentMajor === MART_CABLE_MAJOR && <TrunkCableField />}
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="故障描述" name="reportDescribe" rules={[{ required: true, message: '请填写故障描述！' }]}>
                            <Input.TextArea allowClear className="report-custom-textarea" showCount maxLength={1000} rows={3} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="故障网络影响范围" name="influenceScope" rules={[{ required: true, message: '请填写故障网络影响范围！' }]}>
                            <Input.TextArea allowClear className="report-custom-textarea" showCount maxLength={1000} rows={3} />
                        </Form.Item>
                    </Col>

                    {currentMajor !== PUBLIC_OPINION && (
                        <Col span={24}>
                            <Form.Item
                                label="故障原因分析"
                                name="causesAnalysis"
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
                                <Input.TextArea className="report-custom-textarea" showCount maxLength={1000} rows={3} />
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={24}>
                        <Form.Item label="故障处理进展" name="treatmentMeasure">
                            <Input.TextArea className="report-custom-textarea" showCount maxLength={1000} rows={3} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="附件" name="uploudFiles">
                            <FormUpload />
                        </Form.Item>
                    </Col>

                    {currentMajor === MART_CABLE_MAJOR && (
                        <Col span={24}>
                            <Form.Item label="故障影响业务详情">
                                <FaultBusinessTable data={{ standardAlarmId }} />
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                <Row>
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
                                            reportType={hasDraftStatus ? undefined : ReportType.FIRST_NEWSPAPER}
                                            ref={reportNoticeRef}
                                            GNOCdisable={GNOCdisable}
                                            faultLevel={getFieldValue('reportLevel')}
                                            isWireless={isWireless}
                                            theme={props.theme}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                </Row>
            </ItemCard>
        </>
    );
};
export default FirstReportForm;
