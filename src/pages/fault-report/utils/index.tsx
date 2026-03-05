import React from 'react';
import { Form, Checkbox } from 'oss-ui';
import EllipsisText from '@Pages/components/ellipsis-text';
import NoticeTable from '../components/fault-notice/NoticeTable';
import NoticeTypeCheckbox from '../fault-report-add/fault-report-form/first-report-form/report-notice/components/NoticeTypeCheckbox';
import OriginalAlarmCount from '../fault-report-add/fault-report-form/first-report-form/original-alarm-count';
import FormUpload from '../components/form-upload';
import {
    ReportType,
    FAILURE_REPORTING_LEVEL_TEXT,
    ReportTypeText,
    FAULT_NOTIFICATION_ENUM,
    FAILURE_SOURCE_TYPE,
    FAILURE_REPORT_STATUS,
    MART_CABLE_MAJOR,
    PUBLIC_OPINION,
    CATEGORY_PUBLIC,
    CATEGORY_COMPLAINT,
} from '../type';
import TicketTable from '../fault-report-add/fault-report-form/association-ticket';
import AlarmTable from '../fault-report-add/fault-report-form/association-alarm';

// 专业为干线光缆时额外增加数据
const cableSectionData = (data) => {
    const { specialty, transSegIdName, reuseTransSeg, transSystem } = data;

    if (specialty === MART_CABLE_MAJOR) {
        return [
            {
                name: '传输段',
                value: transSegIdName || '未填写',
            },
            {
                name: '光缆段',
                value: reuseTransSeg || '未填写',
            },
            {
                name: '传输系统',
                value: transSystem || '未填写',
            },
        ];
    }
    return [];
};

// 专业为客服舆情信息时额外增加数据
const customerServiceData = (data) => {
    const { failureClass, publicSentiment } = data;
    const { vName, fansCount, forwardCommentsCount, voiceInfo, linkAddress, caseNum } = publicSentiment || {};

    const publicList = [
        {
            name: '大V名称',
            value: <EllipsisText text={vName} maxWidth={300} />,
        },
        {
            name: '粉丝数量',
            value: <EllipsisText text={fansCount} maxWidth={300} />,
        },
        {
            name: '转评数量',
            value: <EllipsisText text={forwardCommentsCount} maxWidth={300} />,
        },
        {
            name: '舆情声量',
            value: <EllipsisText text={voiceInfo} maxWidth={300} />,
        },
        {
            name: '舆情链接',
            value: <EllipsisText text={linkAddress} maxWidth={300} />,
        },
    ];

    // 故障类别-舆情
    if (failureClass === CATEGORY_PUBLIC) {
        return publicList;
    }
    // 故障类别-客诉
    if (failureClass === CATEGORY_COMPLAINT) {
        return [
            {
                name: '案例号码',
                value: <EllipsisText text={caseNum} maxWidth={300} />,
            },
        ];
    }
    return [];
};

// 处理首报字段
export const formatFirst = (item) => {
    const {
        flagId,
        provinceName,
        cityName,
        reportUserName,
        telephone,
        deptName,
        failureTime,
        failureLevelName,
        actionScene,
        topic,
        specialtyName,
        subSpecialtyName,
        failureClassName,
        reportLevelName,
        reportDescribe,
        influenceScope,
        causesAnalysis,
        treatmentMeasure,
        faultNotice,
        source,
        standardAlarmId,
        relationAlarmDetails,
        faultWorkNoDetails,
        failureRecoverTime,
        publicSentiment,
        reportTime,
        uploudFiles,
        application,
        rootSpecialtyName,
    } = item;
    const { notificationUserInfos, notificationContent, notificationType, notificationTel, notificationDetailList, whetherNotifyGNOC, dtName } =
        faultNotice || {};
    const noticeTypeValue = {
        notificationType: notificationType?.split(',') || [],
        notificationDetailList: notificationDetailList || [],
    };

    const { involvedProvinceName } = publicSentiment || {};

    return [
        {
            name: '故障标识',
            value: flagId ?? '未填写',
        },
        {
            name: '故障主题',
            value: topic ?? '未填写',
            span: 16,
        },
        {
            name: '上报专业',
            value: specialtyName ?? '未填写',
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '子专业',
            value: subSpecialtyName ?? '未填写',
        },
        {
            name: '故障类别',
            value: failureClassName ?? '未填写',
        },
        {
            name: '归属省份',
            value: provinceName ?? '未填写',
        },
        {
            name: '地市',
            value: cityName ?? '未填写',
        },
        item.specialty === PUBLIC_OPINION
            ? {
                  name: '涉及省份',
                  value: <EllipsisText text={involvedProvinceName} maxWidth={300} />,
              }
            : {
                  name: '故障发生地点',
                  value: actionScene ?? '未填写',
              },
        {
            name: '故障发生时间',
            value: failureTime ?? '未填写',
        },
        {
            name: '故障恢复时间',
            value: failureRecoverTime ?? '未填写',
        },
        {
            name: '故障上报级别',
            value: reportLevelName ?? '未填写',
        },
        {
            name: '上报用途',
            value: application ?? '未填写',
        },
        {
            name: '根因专业',
            value: rootSpecialtyName ?? '未填写',
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '故障等级预警',
            value: failureLevelName ?? '未填写',
        },
        ...cableSectionData(item),
        ...customerServiceData(item),
        {
            name: '原始告警数',
            span: 24,
            hidden: true, // 在历史记录中隐藏
            children: <OriginalAlarmCount standardAlarmId={standardAlarmId} source={source} />,
        },
        {
            name: '关联告警',
            span: 24,
            hidden: true, // 在历史记录中隐藏
            children: <div />,
        },
        {
            name: '',
            span: 24,
            hidden: true, // 在历史记录中隐藏
            children: <AlarmTable mode="readonly" value={relationAlarmDetails} />,
        },
        {
            name: '关联工单',
            span: 24,
            hidden: true, // 在历史记录中隐藏
            children: <div />,
        },
        {
            name: '',
            span: 24,
            hidden: true, // 在历史记录中隐藏
            children: <TicketTable mode="readonly" value={faultWorkNoDetails} />,
        },
        {
            name: '故障描述',
            value: reportDescribe ?? '未填写',
            span: 24,
        },
        {
            name: '故障网络影响范围',
            value: influenceScope ?? '未填写',
            span: 24,
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '故障原因分析',
            value: causesAnalysis ?? '未填写',
            span: 24,
        },
        {
            name: '故障处理进展',
            value: treatmentMeasure ?? '未填写',
            span: 24,
        },
        {
            name: '附件',
            span: 12,
            value: uploudFiles && uploudFiles.length > 0 ? null : '未填写',
            uploudFiles,
        },
        {
            name: '通知内容',
            span: 24,
            value: notificationContent || '未填写',
        },
        {
            name: '通知对象',
            span: 24,
            children: (() => {
                // 构建通知方式数组
                const notificationItems = [];
                
                // 检查各种通知方式是否有数据
                const hasIVRData = whetherNotifyGNOC || (notificationUserInfos && notificationUserInfos.length > 0) || (notificationTel && notificationTel.trim());
                const hasSMSData = (notificationUserInfos && notificationUserInfos.length > 0) || (notificationTel && notificationTel.trim());
                // 钉钉数据需要检查是否有实际的群组信息，而不是仅仅有配置
                const hasDingDingData = notificationDetailList && notificationDetailList.some(detail => 
                    String(detail?.notificationType) === String(FAULT_NOTIFICATION_ENUM.DINGDING)
                );
                
                // 检查是否有任何通知方式被选中且有数据
                const hasAnyNotificationData = 
                    ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.IVR) && hasIVRData) ||
                    ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE) && hasSMSData) ||
                    ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.DINGDING) && hasDingDingData);
                
                                
                // 如果没有任何有效的通知数据，显示未填写
                if (!hasAnyNotificationData) {
                    return <div>未填写</div>;
                }
                
                // IVR通知 - 只有在选中且有数据时才显示
                if ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.IVR) && hasIVRData) {
                    notificationItems.push({
                        type: 'IVR',
                        label: 'IVR',
                        content: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: 'rgba(24, 144, 255, 0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>IVR</span>
                                {whetherNotifyGNOC && <span style={{ marginRight: '8px' }}>GNOC值班室</span>}
                                {notificationUserInfos?.map((user, index) => (
                                    <span key={index} style={{ marginRight: '8px' }}>{user.userName} {user.userMobile}</span>
                                ))}
                                {notificationTel?.split(',').filter((phone) => phone.trim()).map((phone, index) => (
                                    <span key={`temp-${index}`} style={{ marginRight: '8px' }}>{phone.trim()}</span>
                                ))}
                            </div>
                        )
                    });
                }
                
                // 短信通知 - 只有在选中且有数据时才显示
                if ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE) && hasSMSData) {
                    notificationItems.push({
                        type: 'SMS',
                        label: '短信',
                        content: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: 'rgba(24, 144, 255, 0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>短信</span>
                                {notificationUserInfos?.map((user, index) => (
                                    <span key={index} style={{ marginRight: '8px' }}>{user.userName} {user.userMobile}</span>
                                ))}
                                {notificationTel?.split(',').filter((phone) => phone.trim()).map((phone, index) => (
                                    <span key={`temp-${index}`} style={{ marginRight: '8px' }}>{phone.trim()}</span>
                                ))}
                            </div>
                        )
                    });
                }
                
                // 钉钉通知 - 只要有配置就显示
                if ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.DINGDING) && hasDingDingData) {
                    const dingDingGroups = notificationDetailList?.filter((detail) => 
                        String(detail?.notificationType) === String(FAULT_NOTIFICATION_ENUM.DINGDING)
                    );
                    
                    if (dingDingGroups && dingDingGroups.length > 0) {
                        notificationItems.push({
                            type: 'DINGDING',
                            label: '钉钉',
                            content: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ backgroundColor: 'rgba(24, 144, 255, 0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>钉钉</span>
                                    {dtName || '钉钉群聊'}
                                </div>
                            )
                        });
                    }
                }
                
                // 渲染通知数组
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {notificationItems.map((item, index) => (
                            <div key={item.type}>{item.content}</div>
                        ))}
                    </div>
                );
            })(),
        },
    ].filter(Boolean);
};

// 处理续报字段
export const formatContinue = (item, isShowUpload = false) => {
    const {
        continueType,
        reportUserName,
        createTime,
        reportLevelName,
        failureLevelName,
        failureClassName,
        influenceScope,
        businessImpactScope,
        causesAnalysis,
        treatmentMeasure,
        businessRecoverProcess,
        uploudFiles,
        faultNotice,
        reportStatus,
        reportStatusName,
        faultWorkNoDetails,
        failureRecoverTime,
        isEffectBusiness,
        businessRecoverTime,
        rootSpecialtyName,
        faultDistinctionType,
        source,
        actionScene,
    } = item;
    const isFinalReport = String(reportStatus) === FAILURE_REPORT_STATUS.FINAL_REPORT || reportStatusName === '已归档';

    const { notificationUserInfos, notificationContent, notificationType, notificationTel, notificationDetailList, whetherNotifyGNOC, dtName } =
        faultNotice || {};
    const noticeTypeValue = {
        notificationType: notificationType?.split(',') || [],
        notificationDetailList: notificationDetailList || [],
    };
    return [
        {
            name: '追加类型',
            value: ReportTypeText[Number(continueType)] ?? '未填写',
        },
        {
            name: '追加人',
            value: reportUserName ?? '未填写',
        },
        {
            name: '追加时间',
            value: createTime ?? '未填写',
        },
        {
            name: '故障上报级别',
            value: reportLevelName ?? '未填写',
        },

        {
            name: '故障等级预警',
            value: failureLevelName ?? '未填写',
        },
        {
            name: '故障类别',
            value: failureClassName ?? '未填写',
        },
        {
            name: '故障恢复时间',
            value: failureRecoverTime ?? '未填写',
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '是否影响业务',
            value: isEffectBusiness ?? '未填写',
        },
        {
            name: '根因专业',
            value: rootSpecialtyName ?? '未填写',
        },
        {
            name: '故障发生地点',
            value: actionScene ?? '未填写',
        },
        item.specialty !== PUBLIC_OPINION &&
            continueType === ReportType.FINAL_REPORT && {
                name: '业务恢复时间',
                value: businessRecoverTime ?? '未填写',
            },
        ...cableSectionData(item),
        {
            name: '',
            span: 24,
            children: <TicketTable mode="readonly" value={faultWorkNoDetails} />,
        },
        {
            name: '故障网络影响范围',
            value: influenceScope || '未填写',
            span: 24,
        },
        {
            name: '故障业务影响范围',
            span: 24,
            value: businessImpactScope || '未填写',
        },
        {
            name: '故障原因分析',
            value: causesAnalysis || '未填写',
            span: 24,
        },
        {
            name: '故障处理进展',
            value: treatmentMeasure || '未填写',
            span: 24,
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '业务恢复进展',
            span: 24,
            value: businessRecoverProcess || '未填写',
        },
        {
            name: '追加附件',
            span: 12,
            value: (isFinalReport || isShowUpload) && uploudFiles && uploudFiles.length > 0 ? null : '未填写',
            uploudFiles: isFinalReport || isShowUpload ? uploudFiles : undefined,
            children:
                isFinalReport || isShowUpload ? (
                    <Form.Item label="" noStyle name="uploudFiles" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                        <FormUpload isWireless={faultDistinctionType === 2 && source === 0} />
                    </Form.Item>
                ) : null,
        },
        {
            name: '通知内容',
            span: 24,
            value: notificationContent || '未填写',
        },
        {
            name: '通知对象',
            span: 24,
            children: (() => {
                // 构建通知方式数组
                const notificationItems = [];
                
                // 检查各种通知方式是否有数据
                const hasIVRData = whetherNotifyGNOC || (notificationUserInfos && notificationUserInfos.length > 0) || (notificationTel && notificationTel.trim());
                const hasSMSData = (notificationUserInfos && notificationUserInfos.length > 0) || (notificationTel && notificationTel.trim());
                // 钉钉数据需要检查是否有实际的群组信息，而不是仅仅有配置
                const hasDingDingData = notificationDetailList && notificationDetailList.some(detail => 
                    String(detail?.notificationType) === String(FAULT_NOTIFICATION_ENUM.DINGDING)
                );
                
                // 检查是否有任何通知方式被选中且有数据
                const hasAnyNotificationData = 
                    ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.IVR) && hasIVRData) ||
                    ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE) && hasSMSData) ||
                    ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.DINGDING) && hasDingDingData);
                
                                
                // 如果没有任何有效的通知数据，显示未填写
                if (!hasAnyNotificationData) {
                    return <div>未填写</div>;
                }
                
                // IVR通知 - 只有在选中且有数据时才显示
                if ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.IVR) && hasIVRData) {
                    notificationItems.push({
                        type: 'IVR',
                        label: 'IVR',
                        content: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: 'rgba(24, 144, 255, 0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>IVR</span>
                                {whetherNotifyGNOC && <span style={{ marginRight: '8px' }}>GNOC值班室</span>}
                                {notificationUserInfos?.map((user, index) => (
                                    <span key={index} style={{ marginRight: '8px' }}>{user.userName} {user.userMobile}</span>
                                ))}
                                {notificationTel?.split(',').filter((phone) => phone.trim()).map((phone, index) => (
                                    <span key={`temp-${index}`} style={{ marginRight: '8px' }}>{phone.trim()}</span>
                                ))}
                            </div>
                        )
                    });
                }
                
                // 短信通知 - 只有在选中且有数据时才显示
                if ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.SHORT_MESSAGE) && hasSMSData) {
                    notificationItems.push({
                        type: 'SMS',
                        label: '短信',
                        content: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: 'rgba(24, 144, 255, 0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>短信</span>
                                {notificationUserInfos?.map((user, index) => (
                                    <span key={index} style={{ marginRight: '8px' }}>{user.userName} {user.userMobile}</span>
                                ))}
                                {notificationTel?.split(',').filter((phone) => phone.trim()).map((phone, index) => (
                                    <span key={`temp-${index}`} style={{ marginRight: '8px' }}>{phone.trim()}</span>
                                ))}
                            </div>
                        )
                    });
                }
                
                // 钉钉通知 - 只要有配置就显示
                if ((notificationType?.split(',') || []).includes(FAULT_NOTIFICATION_ENUM.DINGDING) && hasDingDingData) {
                    const dingDingGroups = notificationDetailList?.filter((detail) => 
                        String(detail?.notificationType) === String(FAULT_NOTIFICATION_ENUM.DINGDING)
                    );
                    
                    if (dingDingGroups && dingDingGroups.length > 0) {
                        notificationItems.push({
                            type: 'DINGDING',
                            label: '钉钉',
                            content: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ backgroundColor: 'rgba(24, 144, 255, 0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>钉钉</span>
                                    {dtName || '钉钉群聊'}
                                </div>
                            )
                        });
                    }
                }
                
                // 渲染通知数组
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {notificationItems.map((item, index) => (
                            <div key={item.type}>{item.content}</div>
                        ))}
                    </div>
                );
            })(),
        },
    ].filter(Boolean);
};

// 处理查看详情基本信息
export const formatBasicInfo = (item) => {
    const {
        flagId,
        provinceName,
        cityName,
        reportUserName,
        telephone,
        deptName,
        failureTime,
        reportTime,
        actionScene,
        topic,
        specialtyName,
        subSpecialtyName,
        failureClassName,
        reportLevel,
        failureLevelNameList,
        failureRecoverTime,
        failureDurationTime,
        publicSentiment,
        application,
        isEffectBusinessList,
        businessRecoverTime,
        rootSpecialtyNameList,
    } = item;
    console.log(item, 'item');
    const { involvedProvinceName } = publicSentiment || {};

    const reportLevelText = reportLevel
        ? reportLevel
              .split(',')
              ?.map((item) => {
                  return FAILURE_REPORTING_LEVEL_TEXT[item];
              })
              .join('、')
        : null;

    return [
        {
            name: '上报专业',
            value: specialtyName ?? '未填写',
        },

        item.specialty !== PUBLIC_OPINION && {
            name: '子专业',
            value: subSpecialtyName ?? '未填写',
        },
        {
            name: '故障类别',
            value: failureClassName ?? '未填写',
        },
        {
            name: '故障主题',
            value: topic ?? '未填写',
            span: 16,
        },
        {
            name: '故障上报级别',
            value: reportLevelText ?? '未填写',
        },
        {
            name: '上报用途',
            value: application ?? '未填写',
        },
        {
            name: '故障标识',
            value: flagId ?? '未填写',
        },
        {
            name: '归属省份',
            value: provinceName ?? '未填写',
        },
        {
            name: '地市',
            value: cityName ?? '未填写',
        },
        {
            name: '上报人',
            value: reportUserName ?? '未填写',
        },
        {
            name: '联系方式',
            value: telephone ?? '未填写',
        },

        {
            name: '上报人部门',
            value: deptName ?? '未填写',
        },
        {
            name: '故障发生时间',
            value: failureTime ?? '未填写',
        },
        {
            name: '故障恢复时间',
            value: failureRecoverTime ?? '未填写',
        },
        {
            name: '故障持续时间',
            value: failureDurationTime ?? '未填写',
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '业务恢复时间',
            value: businessRecoverTime ?? '未填写',
        },
        {
            name: '上报时间',
            value: reportTime ?? '未填写',
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '是否影响业务',
            span: 24,
            domData: isEffectBusinessList,
            value: isEffectBusinessList ? undefined : (item.isEffectBusiness ?? '未填写'),
        },

        item.specialty !== PUBLIC_OPINION && {
            name: '故障等级预警',
            span: 24,
            domData: failureLevelNameList,
            value: failureLevelNameList ? undefined : (item.failureLevelName ?? '未填写'),
        },
        {
            name: '根因专业',
            span: 24,
            domData: rootSpecialtyNameList,
            value: rootSpecialtyNameList ? undefined : (item.rootSpecialtyName ?? '未填写'),
        },
        item.specialty === PUBLIC_OPINION
            ? {
                  name: '涉及省份',
                  value: <EllipsisText text={involvedProvinceName} maxWidth={300} />,
              }
            : {
                  name: '故障发生地点',
                  value: actionScene ?? '未填写',
              },
        ...(item.source === FAILURE_SOURCE_TYPE.AUTO ? [{ name: '故障确认状态', value: item.alarmStatus ?? '未填写' }] : []),
        ...cableSectionData(item),
        ...customerServiceData(item),
    ].filter(Boolean);
};

// 处理查看详情故障信息
export const formatFaultInfo = (item) => {
    const {
        reportDescribe,
        influenceScopeList,
        causesAnalysisList,
        businessImpactScopeList,
        treatmentMeasureList,
        businessRecoverProcessList,
        fileList,
        source,
        standardAlarmId,
        faultWorkNoDetails,
        relationAlarmDetails,
        faultReportStatus,
    } = item;
    return [
        item.specialty !== PUBLIC_OPINION && {
            name: '原始告警数',
            span: 24,
            hidden: source !== FAILURE_SOURCE_TYPE.AUTO,
            children: <OriginalAlarmCount standardAlarmId={standardAlarmId} source={source} />,
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '关联告警',
            span: 24,
        },

        item.specialty !== PUBLIC_OPINION && {
            name: '',
            span: 24,
            children: <AlarmTable mode="readonly" value={relationAlarmDetails} />,
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '关联工单',
            span: 24,
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '',
            span: 24,
            children: <TicketTable mode="readonly" value={faultWorkNoDetails} />,
        },
        {
            name: '故障描述',
            value: reportDescribe ?? '未填写',
            span: 24,
        },
        {
            name: '故障网络影响范围',
            span: 24,
            domData: influenceScopeList,
            value: influenceScopeList ? undefined : (item.influenceScope ?? '未填写'),
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '故障业务影响范围',
            span: 24,
            domData: businessImpactScopeList,
            value: businessImpactScopeList ? undefined : (item.businessImpactScope ?? '未填写'),
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '故障原因分析',
            span: 24,
            domData: causesAnalysisList,
            value: causesAnalysisList ? undefined : (item.causesAnalysis ?? '未填写'),
        },
        {
            name: '故障处理进展',
            span: 24,
            domData: treatmentMeasureList,
            value: treatmentMeasureList ? undefined : (item.treatmentMeasure ?? '未填写'),
        },
        item.specialty !== PUBLIC_OPINION && {
            name: '业务恢复进展',
            span: 24,
            domData: businessRecoverProcessList,
            value: businessRecoverProcessList ? undefined : (item.businessRecoverProcess ?? '未填写'),
        },
        faultReportStatus !== '0' && fileList?.length
            ? {
                  name: '追加附件',
                  span: 24,
                  domData: fileList,
              }
            : null,
    ].filter(Boolean);
};
