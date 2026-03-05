import React from 'react';
import { _ } from 'oss-web-toolkits';

import Dispatch from './dispatch';
import BeforeTransform from './before-transform';
import PreTreat from './pre-treat';
import Phonation from './phonation';
import SelfHeal from './self-heal';
import TimeoutCount from './timeout-count';
import LevelRedefine from './level-redefine';
import AutoClear from './auto-clear';
import JudgeRepeat from './judge-repeat';
import CategoryRedefine from './category-redefine';
import DispatchInhibition from './dispatch-inhibition';
import AlarmSubscription from './alarm-subscription';
import filterForm from './filter';
import request from '@Common/api';
import { isArray } from 'lodash';

/**
 * 规则管理各种类型的的规则动作保存时的处理逻辑
 */

/**
 * 派单规则 10
 * @param {*} values
 */
const formatDispatch = (values) => {
    const action = [
        { key: 'restrain_projectalarm', value: 1, valueDesc: '工程告警抑制派单' }, // 界面无该属性，此处为默认值
        { key: 'prehandle', value: Number(values.prehandle), valueDesc: '需要系统完成T1预处理' },
        { key: 'switch', value: Number(values.mainclearSubsendSwitch), valueDesc: '启用主告警清除后子告警继续派单' },
        { key: 'related', value: values.relatedAction, valueDesc: '关联关系动作' },
        { key: 'alarmHandleLevel', value: values.alarmHandleLevel, valueDesc: '故障处理级别' },
        { key: 'nonForwardProcess', value: '', valueDesc: '非派单时间段处理' },
        {
            key: 'timeperiod',
            value: '',
            valueDesc: '启用时间',
        },
        { key: 'Dayperiod', value: '', valueDesc: '启用日期' },
        {
            key: 'alarmType',
            value: '',
            valueDesc: '条件设置中告警类型',
        },
        {
            key: 'rule_priority',
            value: '',
            valueDesc: '规则优先级',
        },
        // {
        //     key: 'Delayseconds',
        //     value: '',
        //     valueDesc: '延迟时间',
        // },
        {
            key: 'Delayseconds',
            value: values.delayseconds,
            valueDesc: '延迟时间',
        },
        {
            key: 'dayOfWeek',
            value: '',
            valueDesc: '按工作日派单',
        },
        {
            key: 'holidays',
            value: '',
            valueDesc: '节假日不派单',
        },
        {
            key: 'alarmHandleTime',
            value: '',
            valueDesc: '故障处理时间',
        },
    ];
    if (values.dispatchTimerangeSwitch) {
        action.find((item) => item.key === 'nonForwardProcess').value = Number(values.nonForwardProcess);
        action.find((item) => item.key === 'timeperiod').value = `${values.forwardTime[0].format('HH:mm:ss')}~${values.forwardTime[1].format(
            'HH:mm:ss',
        )}`;
    }

    if (values.dayPeriodSwitch) {
        if (values.noEndDate) {
            action.find((item) => item.key === 'Dayperiod').value = `${values.startUseDate.format('YYYY-MM-DD')}~9999-12-31`;
        } else {
            action.find((item) => item.key === 'Dayperiod').value = `${values.startUseDate.format('YYYY-MM-DD')}~${values.endUseDate.format(
                'YYYY-MM-DD',
            )}`;
        }
    }

    if (values.mainclearSubsendSwitch) {
        action.find((item) => item.key === 'alarmType').value = values.alarmType;
    }

    if (values.rulePrioritySwitch) {
        action.find((item) => item.key === 'rule_priority').value = values.rulePriority;
    }

    // if (values.delayTime === 0) {
    //     action.find((item) => item.key === 'Delayseconds').value = values.delayseconds;
    // }

    if (!_.isEmpty(values.dayOfWeek)) {
        action.find((item) => item.key === 'dayOfWeek').value = _.join(values.dayOfWeek, ',');
    }

    if (!_.isEmpty(values.holidays)) {
        action.find((item) => item.key === 'holidays').value = _.join(values.holidays, ',');
    }
    if (values.alarmHandleTime) {
        action.find((item) => item.key === 'alarmHandleTime').value = values.alarmHandleTime;
    }

    return action;
};

const formatTransform = (values) => {
    // 初始化独立字段的值
    // debugger;
    console.log(values, '===val');
    let action = [
        {
            key: 'notificationType',
            value: isArray(values.notificationType) ? values.notificationType.join(',') : values.notificationType,
            valueDesc: '通知方式',
        },
        {
            key: 'delayTime',
            value: values.delayTime,
            valueDesc: '延迟时间',
        },
        {
            key: 'isUseSmsTitle',
            value: values.isUseSmsTitle,
            valueDesc: '使用告警发生模板',
        },
        {
            key: 'unlimitedTime',
            value: values.unlimitedTime,
            valueDesc: '不限次数',
        },
        {
            key: 'isDisplayInSms',
            value: values.isDisplayInSms,
            valueDesc: '短信中显示',
        },
        {
            key: 'sendMode',
            value: values.sendMode,
            valueDesc: '呼叫方式',
        },
        {
            key: 'frequency',
            value: values.frequency,
            valueDesc: '前转次数',
        },

        {
            key: 'noEndDate',
            value: values.noEndDate,
            valueDesc: '无结束日开关',
        },
        {
            key: 'whetherSmsMerge',
            value: values.whetherSmsMerge,
            valueDesc: '合并短信开关',
        },
        {
            key: 'smsMergeFields',
            value: values.smsMergeFields?.join(','),
            valueDesc: '合并短信专业',
        },

        {
            key: 'smsTitle',
            value: values.smsTitle,
            valueDesc: '短信内容',
        },
        {
            key: 'cancelSendFlag',
            value: values.isClearSMSContent ? 1 : 0,
            valueDesc: '清除告警是否发短信',
        },
        {
            key: 'cancelTitle',
            value: values.cancelTitle,
            valueDesc: '清除短信模板',
        },
        {
            key: 'synchroFilter',
            value: values.synchroFilter,
            valueDesc: '同步创建过滤器',
        },
        {
            key: 'unlimiteInterval',
            value: values.unlimiteInterval,
            valueDesc: '不限次数时间间隔',
        },
    ];
    // let originIntervalLArr = new Array(4)
    //     .fill(null)
    //     .map((item, index) => ({ key: `interval${index + 1}`, value: '', valueDesc: '前转时间间隔' }));
    // let originReceiverArr = new Array(5).fill(null).map((item, index) => ({
    //     key: index === 0 ? 'receiver' : `receiver${index + 1}`,
    //     value: '',
    //     valueDesc: '前转对象电话号码',
    // }));
    const receiverArr = values.everyTimes?.map((item) => ({
        key: item.id === 1 ? 'receiver' : `receiver${item.id}`,
        value: JSON.stringify({ u: item.userIds, d: '', t: item.temporaryNum }),
        valueDesc: '前转对象电话号码',
    }));
    const intervalLArr = values.everyTimes
        ?.filter((item) => item.id !== 1)
        .map((item) => ({
            key: `interval${item.id - 1}`,
            value: item.times,
            valueDesc: '前转时间间隔',
        }));
    // receiverArr = formatList(receiverArr, originReceiverArr);
    // intervalLArr = formatList(intervalLArr, originIntervalLArr);
    // 邮件发送规则主送人、抄送人字段处理

    let agentManReceiver = [];
    let copyManReceiver = [];
    let emailInterval = [];

    function receiverFieldGenMapFn(type) {
        return Object.values(values.emailSendRuleReceiverInfo?.[type] ?? {}).map((item, index) => ({
            key: index === 0 ? `${type}ManReceiver` : `${type}ManReceiver${index + 1}`,
            value: JSON.stringify({ u: item.users.map((itemIn) => itemIn.userId).join(','), d: '', t: item.temps.join(',') }),
            valueDesc: '邮件发送人地址',
        }));
    }
    function intervalFieldGenMapFn(type) {
        return Object.values(values.emailSendRuleReceiverInfo?.[type] ?? {}).map((item, index) => ({
            key: `interval${index}`,
            value: item.interval,
            valueDesc: '邮件发送时间间隔',
        }));
    }
    if (values.emailSendRuleReceiverInfo) {
        agentManReceiver = receiverFieldGenMapFn('agent');
        copyManReceiver = receiverFieldGenMapFn('copy');

        emailInterval = intervalFieldGenMapFn('agent').slice(1);
    }

    if (values.sendMode === 0) {
        action = [...action, ...(receiverArr || []), ...(intervalLArr || []), ...agentManReceiver, ...copyManReceiver, ...emailInterval];
    }
    console.log('action', action);
    if (values.isDisplayInSms && values.delayTime !== 0 && values.delayTime !== '0') {
        if (values.smsTitle.indexOf('短信延迟<delay_time>分钟发送') !== -1) {
            action.find((itm) => itm.key === 'smsTitle').value = values.smsTitle;
        } else {
            action.find((itm) => itm.key === 'smsTitle').value = `${values.smsTitle} 短信延迟<delay_time>分钟发送`;
        }
        if (values.cancelTitle && values.cancelTitle.indexOf('短信延迟<delay_time>分钟发送') !== -1) {
            action.find((itm) => itm.key === 'cancelTitle').value = values.cancelTitle;
        } else {
            action.find((itm) => itm.key === 'cancelTitle').value = `${values.cancelTitle} 短信延迟<delay_time>分钟发送`;
        }
    }
    if (!values.isDisplayInSms) {
        if (values.smsTitle.indexOf('短信延迟<delay_time>分钟发送') !== -1) {
            action.find((itm) => itm.key === 'smsTitle').value = values.smsTitle.replace('短信延迟<delay_time>分钟发送', '');
        }
        if (values.cancelTitle && values.cancelTitle.indexOf('短信延迟<delay_time>分钟发送') !== -1) {
            action.find((itm) => itm.key === 'cancelTitle').value = values.cancelTitle.replace('短信延迟<delay_time>分钟发送', '');
        }
    }
    if (values.isUseSmsTitle) {
        if (values.smsTitle.indexOf('告警已于<cancel_time>清除') !== -1) {
            action.find((itm) => itm.key === 'cancelTitle').value = action.find((itm) => itm.key === 'smsTitle').value;
        } else {
            action.find((itm) => itm.key === 'cancelTitle').value = `告警已于<cancel_time>清除${action.find((itm) => itm.key === 'smsTitle').value}`;
        }
    }
    // const action = {
    //     transformMode: values.transformMode,
    //     delayTime: values.delayTime,
    //     // forwardTime: values.forwardTime,
    //     timeperiod: `${values.useTime[0].format('HH:mm')}-${values.useTime[1].format('HH:mm')}`,
    //     forwardDate: Number(values.forwardDate),
    //     isClearSMSContent: Number(values.isClearSMSContent),
    //     numUpDownRepeatTimes: values.numUpDownRepeatTimes,
    //     sendMode: values.sendMode,
    // };

    if (values.sendMode === 3) {
        const mProvinceArr = values.everyTimes?.map((item) => ({
            key: item.id === 1 ? 'province' : `province${item.id}`,
            value: JSON.stringify({ id: item[`province`].value, name: item[`province`].label }),
            valueDesc: '省份信息',
        }));

        const mTeamArr = values.everyTimes?.map((item) => ({
            key: item.id === 1 ? 'relatedMeteam' : `relatedMeteam${item.id}`,
            value: JSON.stringify(
                item.relatedMeTeam.map((itemIn) => {
                    return { id: itemIn.value, name: itemIn.label };
                }),
            ),
            valueDesc: '维护班组信息',
        }));
        const mReceiverArr = values.everyTimes?.map((item) => ({
            key: item.id === 1 ? 'receiver' : `receiver${item.id}`,
            value: JSON.stringify({ u: '', d: '', t: item.temporaryNum, r: item.receiver.toString() }),
            valueDesc: '维护班组角色',
        }));

        action = [...action, ...(mReceiverArr || []), ...(intervalLArr || []), ...(mTeamArr || []), ...(mProvinceArr || [])];
    }

    if (values.modifyUseTime) {
        action = [
            ...action,
            {
                key: 'timePeriod',
                value: `${values.timePeriod[0].format('HH:mm:ss')}~${values.timePeriod[1].format('HH:mm:ss')}`,
                valueDesc: '启动时间段',
            },
        ];
    } else {
        action = [
            ...action,
            {
                key: 'timePeriod',
                value: '',
                valueDesc: '启动时间段',
            },
        ];
    }
    if (values.forwardDate) {
        if (values.noEndDate) {
            action = [
                ...action,
                {
                    key: 'dayPeriod',
                    value: `${values.startForwardDate.format('YYYY-MM-DD')}~9999-12-31`,
                    valueDesc: '前转时间-无结束日',
                },
            ];
        } else {
            action = [
                ...action,
                {
                    key: 'dayPeriod',
                    value: `${values.startForwardDate.format('YYYY-MM-DD')}~${values.endForwardDate.format('YYYY-MM-DD')}`,
                    valueDesc: '前转时间-有结束日',
                },
            ];
        }
    } else {
        action = [
            ...action,
            {
                key: 'dayPeriod',
                value: '',
                valueDesc: '前转时间-关闭',
            },
        ];
    }

    return action;
};
// const formatList = (originArr, checkArr) => {
//     let list = originArr.reduce((pre, cur) => {
//         let target = pre.find((ee) => ee.key === cur.key);
//         if (target) {
//             Object.assign(target, cur);
//         } else {
//             pre.push(cur);
//         }
//         return pre;
//     }, checkArr);

//     return list;
// };
export const formatPretreat = (values) => {
    // 初始化独立字段的值
    const action = [
        {
            key: 'restrain_projectalarm',
            value: Number(values.isProjectAlarmNoProcess),
            valueDesc: '工程告警不执行预处理',
        },
        { key: 'delayTime', value: values.delayTime, valueDesc: '延迟时间' },
        { key: 'Timeperiod', value: '', valueDesc: '预处理时间段' },
        { key: 'related', value: values.relationshipAction, valueDesc: '关联关系动作' },
        { key: 'frequency', value: values.frequency, valueDesc: '预处理频次' },
        { key: 'autoTaskId', value: values.selectedTask, valueDesc: '选择任务id' },
        { key: 'autoTaskName', value: values.selectedTaskName, valueDesc: '选择任务名称' },
    ];

    if (values.isforwardTime) {
        action.find((item) => item.key === 'Timeperiod').value = `${values.forwardTime[0].format('HH:mm:ss')}~${values.forwardTime[1].format(
            'HH:mm:ss',
        )}`;
    }

    return action;
};

export const formatPhonation = (values) => {
    // 初始化独立字段的值
    let action = [
        {
            key: 'IsValid',
            value: values.IsValid,
        },
        {
            key: 'SoundFlag',
            value: values.SoundFlag,
        },
    ];
    if (values.IsValid) {
        action = [
            ...action,
            {
                key: 'Timeperiod',
                value: `${values.Timeperiod[0].format('HH:mm:ss')}-${values.Timeperiod[1].format('HH:mm:ss')}`,
            },
        ];
    }
    if (values.SoundFlag === 0) {
        action = [
            ...action,
            { key: 'SoundPath_1', value: values.SoundPath_1 || null },
            { key: 'FileName_1', value: values.FileName_1 || null },
            { key: 'FileExtension_1', value: values.FileExtension_1 || null },
            { key: 'SoundPath_2', value: values.SoundPath_2 || null },
            { key: 'FileName_2', value: values.FileName_2 || null },
            { key: 'FileExtension_2', value: values.FileExtension_2 || null },
            { key: 'SoundPath_3', value: values.SoundPath_3 || null },
            { key: 'FileName_3', value: values.FileName_3 || null },
            { key: 'FileExtension_3', value: values.FileExtension_3 || null },
            { key: 'SoundPath_0', value: values.SoundPath_0 || null },
            { key: 'FileName_0', value: values.FileName_0 || null },
            { key: 'FileExtension_0', value: values.FileExtension_0 || null },
        ];
    } else {
        const soundText_1 = values.SoundText_1.map((item) => `\${${item}}`);
        const soundText_2 = values.SoundText_2.map((item) => `\${${item}}`);
        const soundText_0 = values.SoundText_0.map((item) => `\${${item}}`);
        const soundText_3 = values.SoundText_3.map((item) => `\${${item}}`);
        action = [
            ...action,
            { key: 'SoundText_1', value: soundText_1.join('') },
            { key: 'SoundText_2', value: soundText_2.join('') },
            { key: 'SoundText_0', value: soundText_0.join('') },
            { key: 'SoundText_3', value: soundText_3.join('') },
        ];
    }
    return action;
};

export const formatSelfHeal = (values) => {
    // 初始化独立字段的值
    const action = {
        delayTime: values.delayTime,
    };

    return action;
};

export const formatTimeoutCount = (values) => {
    // 初始化独立字段的值
    const action = {
        delayTime: values.delayTime,
    };

    return action;
};

export const formatLevelRedefine = (values) => {
    // 初始化独立字段的值
    // const action = {
    //     url: values.url,
    // };
    const action = [{ key: 'url', value: values.url, valueDesc: '重定义到' }];

    return action;
};

export const formatCategoryRedefine = (values) => {
    // 初始化独立字段的值
    // const action = {
    //     url: values.url,
    // };
    const action = [{ key: 'url', value: values.url, valueDesc: '重定义到' }];

    return action;
};

export const formatAutoClear = (values) => {
    // 初始化独立字段的值
    const action = {
        delayTime: values.delayTime,
    };

    return action;
};

/**
 * 判重规则
 * @param {*} values
 */
export const formatJudgeRepeat = (values) => {
    // 初始化独立字段的值
    let times = values.time;
    if (values.type === 2) {
        times = '当天';
    }
    values.status.forEach((item, ind) => {
        if (item === '已归档') {
            // eslint-disable-next-line no-param-reassign
            values.status[ind] = '5';
        }
        if (item === '异常归档') {
            // eslint-disable-next-line no-param-reassign
            values.status[ind] = '15';
        }
    });
    const action = [
        { key: 'level', value: values.level, valueDesc: '规则优先级' },
        { key: 'dupChaseSheet', value: '0', valueDesc: '判重后操作' },
        { key: 'uniqueAlarmFields', value: _.join(values.uniqueAlarmFields, ','), valueDesc: '判重条件' },
        { key: 'sheetStatusCheck', value: `true;${times};${_.join([...values.status], ',')}`, valueDesc: '工单状态' },
    ];
    if (!values.rejectAlarm) {
        action.push({ key: 'rejectAlarm', value: `true;${times};${_.join(values.status, ',')}`, valueDesc: '是否支持追单' });
    }

    return action;
};

export const formatDispatchInhibition = (values) => {
    // 初始化独立字段的值
    const action = [
        { key: 'IsValid', value: Number(values.timeperiodSwitch), valueDesc: '是否启用' },
        { key: 'timeperiod', value: '', valueDesc: '启用时间段' },
    ];

    if (values.timeperiodSwitch) {
        action.find((item) => item.key === 'timeperiod').value = `${values.timeperiod[0].format('HH:mm:ss')}~${values.timeperiod[1].format(
            'HH:mm:ss',
        )}`;
    }
    return action;
};

export const formatFilter = (values) => {
    // 初始化独立字段的值
    const action = [
        { key: 'max_delay_time_seconds', value: Number(values.delayTime), valueDesc: '是否启用' },
        { key: 'unit', value: values.unit, valueDesc: '时延单位 0: 秒  1：分' },
    ];

    return action;
};
// 字段未定
export const formatAlarmSubscrition = (values) => {
    // 初始化独立字段的值
    const action = {
        zone: values.zone,
        node: values.node,
    };

    return action;
};

const Default = () => {
    return <></>;
};

/**
 *过滤器编辑界面-个性化规则动作界面集合
 */
export const moduleIdEditContentMap = {
    1: filterForm, // 过滤器
    9: Default, // 告警自动确认规则
    60: Default, // 告警自动清除规则
    10: Dispatch, // 派单规则
    4: BeforeTransform, // 短信前传
    14: BeforeTransform, // IVR呼叫
    18: BeforeTransform, // 呼叫并前转
    7: PreTreat, // 预处理规则
    8: Phonation, // 告警发声规则
    106: SelfHeal, // 告警自愈
    105: TimeoutCount, // 告警延时计数规则
    2: LevelRedefine, // 告警级别重定义规则
    3: CategoryRedefine, // 告警类别重定义规则
    67: AutoClear, // 告警延时清除规则
    63: JudgeRepeat, // 告警判重规则
    64: DispatchInhibition, // 自动抑制派单规则
    107: AlarmSubscription,
    201: Default, // 告警订阅规则
    70: BeforeTransform, // 邮件发送规则
    // 6: 告警查询规则
    // 200:告警订阅规则
};

/**
 * 过滤器编辑界面--规则动作部分数据整理
 */
export const moduleIdFormatMap = {
    10: formatDispatch,
    4: formatTransform,
    70: formatTransform,
    14: formatTransform,
    18: formatTransform,
    7: formatPretreat,
    8: formatPhonation,
    6: formatSelfHeal,
    105: formatTimeoutCount,
    2: formatLevelRedefine,
    3: formatCategoryRedefine,
    67: formatAutoClear,
    63: formatJudgeRepeat,
    64: formatDispatchInhibition,
    107: formatAlarmSubscrition,
    1: formatFilter, // 过滤器
};

/**
 * 过滤器编辑界面， 没有右侧规则动作界面的moduleId集合
 */
export const hasActionIds = ['68', '201'];

/**
 *过滤器编辑界面， 需要显示私有选项字段的列表
 */
export const showPrivateFields = ['filter', '1'];

const getInitialProvince = (province, userInfo) => {
    const info = userInfo && JSON.parse(userInfo);
    let initialProvince = info.zones[0]?.zoneId;
    if (province) {
        return (initialProvince = province);
    }
    if (info.zones[0]?.zoneLevel === '3') {
        initialProvince = info.zones[0]?.parentZoneId;
    }
    return initialProvince;
};

/**
 * 过滤器编辑界面--新增默认值
 */
export const defaultFilterConditionList = (login, moduleId, provinceName) => {
    const { userInfo, systemInfo } = login;
    const { zones } = JSON.parse(userInfo);
    if (moduleId === '1' || moduleId === '63') {
        return [
            {
                fieldLabel: '告警类别',
                fieldName: 'org_type',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [
                    {
                        key: '1',
                        value: '设备告警',
                    },
                    {
                        key: '2',
                        value: '性能告警',
                    },
                ],
            },
            {
                fieldLabel: '一级网络类型',
                fieldName: 'network_type_top',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [
                    {
                        key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo) === '0' ? '0' : '1',
                        value: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo) === '0' ? '总部' : '省内',
                    },
                ],
            },
            {
                fieldLabel: '省份名称',
                fieldName: 'province_id',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList:
                    zones[0].zoneLevel === '5' || zones[0].zoneLevel === '1'
                        ? []
                        : zones[0].zoneLevel === '3'
                        ? [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: provinceName,
                              },
                          ]
                        : [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: zones[0].zoneName,
                              },
                          ],
            },
            {
                fieldLabel: '专业',
                fieldName: 'professional_type',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [],
            },
        ];
    } else if (moduleId === '4' || moduleId === '14' || moduleId === '70') {
        const eUnionSharedIdField = [
            {
                fieldLabel: '电联共享标识',
                fieldName: 'is_share',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [
                    {
                        key: '0',
                        value: '未知',
                    },
                    {
                        key: '1',
                        value: '联通共享电信',
                    },
                    {
                        key: '2',
                        value: '联通不共享电信',
                    },
                ],
            },
        ];
        return [
            {
                fieldLabel: '告警类别',
                fieldName: 'org_type',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [
                    {
                        key: '1',
                        value: '设备告警',
                    },
                    {
                        key: '2',
                        value: '性能告警',
                    },
                ],
            },
            {
                fieldLabel: '一级网络类型',
                fieldName: 'network_type_top',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [
                    {
                        key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo) === '0' ? '0' : '1',
                        value: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo) === '0' ? '总部' : '省内',
                    },
                ],
            },
            {
                fieldLabel: '省份名称',
                fieldName: 'province_id',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList:
                    zones[0].zoneLevel === '5' || zones[0].zoneLevel === '1'
                        ? []
                        : zones[0].zoneLevel === '3'
                        ? [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: provinceName,
                              },
                          ]
                        : [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: zones[0].zoneName,
                              },
                          ],
            },
            {
                fieldLabel: '专业',
                fieldName: 'professional_type',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [],
            },
            {
                conditionGroup: null,
                dataType: 'integer',
                enableAdvanceSetting: 2,
                enableSelectGroup: null,
                enumName: 'alarm_resource_status',
                expressionList: [{ name: 'in', label: '包含' }],
                fieldLabel: '告警工程状态',
                fieldName: 'alarm_resource_status',
                fieldViewIndex: null,
                isEnum: 1,
                isRepeated: 2,
                pageUrl: null,
                selectGroupType: null,
                valueSize: 1,
                reverse: 1,
                compareType: 'in',
                valueList: [
                    {
                        key: '2',
                        value: '工程状态',
                    },
                ],
            },
        ].concat(moduleId === '4' || moduleId === '14' ? eUnionSharedIdField : []);
    } else if (moduleId === '8' || moduleId === '64') {
        return [
            {
                fieldLabel: '告警类别',
                fieldName: 'org_type',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [
                    {
                        key: '1',
                        value: '设备告警',
                    },
                    {
                        key: '2',
                        value: '性能告警',
                    },
                ],
            },
            {
                fieldLabel: '省份名称',
                fieldName: 'province_id',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList:
                    zones[0].zoneLevel === '5' || zones[0].zoneLevel === '1'
                        ? []
                        : zones[0].zoneLevel === '3'
                        ? [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: provinceName,
                              },
                          ]
                        : [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: zones[0].zoneName,
                              },
                          ],
            },
        ];
    } else {
        return [
            {
                fieldLabel: '告警类别',
                fieldName: 'org_type',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList: [
                    {
                        key: '1',
                        value: '设备告警',
                    },
                    {
                        key: '2',
                        value: '性能告警',
                    },
                ],
            },
            {
                fieldLabel: '省份名称',
                fieldName: 'province_id',
                dataType: 'integer',
                itemDesc: '1',
                reverse: 2,
                compareType: 'in',
                valueList:
                    zones[0].zoneLevel === '5' || zones[0].zoneLevel === '1'
                        ? []
                        : zones[0].zoneLevel === '3'
                        ? [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: provinceName,
                              },
                          ]
                        : [
                              {
                                  key: getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo),
                                  value: zones[0].zoneName,
                              },
                          ],
            },
        ];
    }
};
export const buttonKes = {
    add: {
        1: 'alarmFilters:add',
        4: 'forwardRuleManage:add',
        70: 'emailSendRuleManage:add',
        8: 'alarmSound:add',
        64: 'autpInDispatch:add',
        14: 'ivrRuleManage:add',
        63: 'alarmFollowUpRuleManage:add',
    },
    edit: {
        1: 'alarmFilters:edit',
        4: 'forwardRuleManage:edit',
        70: 'emailSendRuleManage:edit',
        8: 'alarmSound:edit',
        64: 'autpInDispatch:edit',
        14: 'ivrRuleManage:edit',
        63: 'alarmFollowUpRuleManage:edit',
    },
    tree: {
        1: 'alarmFilters:tree',
        4: 'forwardRuleManage:tree',
        70: 'emailSendRuleManage:tree',
        8: 'alarmSound:tree',
        64: 'autpInDispatch:tree',
        14: 'ivrRuleManage:tree',
        63: 'alarmFollowUpRuleManage:tree',
    },
    copy: {
        1: 'alarmFilters:copy',
        4: 'forwardRuleManage:copy',
        70: 'emailSendRuleManage:copy',
        8: 'alarmSound:copy',
        64: 'autpInDispatch:copy',
        14: 'ivrRuleManage:copy',
        63: 'alarmFollowUpRuleManage:copy',
    },
    delete: {
        1: 'alarmFilters:delete',
        4: 'forwardRuleManage:delete',
        70: 'emailSendRuleManage:delete',
        8: 'alarmSound:delete',
        64: 'autpInDispatch:delete',
        14: 'ivrRuleManage:delete',
        63: 'alarmFollowUpRuleManage:delete',
    },
    export: {
        1: 'alarmFilters:export',
        4: 'forwardRuleManage:export',
        70: 'emailSendRuleManage:export',
        8: 'alarmSound:export',
        64: 'autpInDispatch:export',
        14: 'ivrRuleManage:export',
        63: 'alarmFollowUpRuleManage:export',
    },
    history: {
        1: 'alarmFilters:history',
        4: 'forwardRuleManage:history',
        70: 'emailSendRuleManage:history',
        8: 'alarmSound:history',
        64: 'autpInDispatch:history',
        14: 'ivrRuleManage:history',
        63: 'alarmFollowUpRuleManage:history',
    },
    batchDelete: {
        1: 'alarmFilters:batchDelete',
    },
};
