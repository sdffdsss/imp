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
/**
 * 规则管理各种类型的的规则动作保存时的处理逻辑
 */

/**
 * 派单规则 10
 * @param {*} values
 */
const formatDispatch = (values, modelId) => {
    let isDispatch = '';
    if (modelId === '605') {
        isDispatch = '';
    } else {
        isDispatch = values.filterIdType ? '' : '1';
    }

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
        {
            key: 'alarm_recovery',
            value: values.alarm_recovery,
            valueDesc: '是否自动告警追加',
        },
        {
            key: 'alarm_recovery_time_end',
            value: values.alarm_recovery_time_end_real || values.alarm_recovery_time_end,
            valueDesc: '告警追加时限',
        },
        {
            key: 'alarm_recovery_condition',
            value: Array.isArray(values.alarm_recovery_condition) ? values.alarm_recovery_condition.join(',') : values.alarm_recovery_condition,
            valueDesc: '告警追加条件',
        },
        {
            key: 'synchroFilter',
            value: values.synchroFilter,
            valueDesc: '同步创建过滤器',
        },
        {
            key: 'filterIdType',
            value: isDispatch,
            valueDesc: '是否派单',
        },
        {
            key: 'faultType',
            value: values.faultType ? values.faultType : '',
            valueDesc: '故障类别',
        },
        {
            key: 'dispatchProfession',
            value: values.dispatchProfession,
            valueDesc: '派单专业',
        },
        {
            key: 'copyLocal',
            value: !!values.copyLocal,
            valueDesc: '是否抄送本端',
        },
        // {
        //     key: 'ruleSwitch',
        //     value: values.ruleSwitch,
        //     valueDesc: '分享至规则库'
        // },
        // {
        //     key: 'ruleType',
        //     value: values.ruleType,
        //     valueDesc: '规则类型'
        // }
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
    let action = [
        // {
        //     key: 'transformMode',
        //     value: values.transformMode,
        //     valueDesc: '前转模式',
        // },
        {
            key: 'delayTime',
            value: values.delayTime,
            valueDesc: '延迟时间',
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
            key: 'smsTitle',
            value: values.smsTitle,
            valueDesc: '短息内容',
        },
        {
            key: 'cancelSendFlag',
            value: values.isClearSMSContent,
            valueDesc: '清除告警是否发短信',
        },
        {
            key: 'cancelTitle',
            value: values.cancelTitle,
            valueDesc: '清除短信模板',
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
    const receiverArr = values.everyTimes.map((item) => ({
        key: item.id === 1 ? 'receiver' : `receiver${item.id}`,
        value: JSON.stringify({ u: item.userIds, d: '', t: item.temporaryNum }),
        valueDesc: '前转对象电话号码',
    }));
    const intervalLArr = values.everyTimes
        .filter((item) => item.id !== 1)
        .map((item) => ({
            key: `interval${item.id - 1}`,
            value: item.times,
            valueDesc: '前转时间间隔',
        }));
    // receiverArr = formatList(receiverArr, originReceiverArr);
    // intervalLArr = formatList(intervalLArr, originIntervalLArr);
    action = [...action, ...receiverArr, ...intervalLArr];
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

    if (values.modifyUseTime) {
        action = [
            ...action,
            {
                key: 'timePeriod',
                value: `${values.timePeriod[0].format('HH:mm')}-${values.timePeriod[1].format('HH:mm')}`,
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
                value: `${values.Timeperiod[0].format('HH:mm')}-${values.Timeperiod[1].format('HH:mm')}`,
            },
        ];
    }
    if (values.SoundFlag === 0) {
        action = [
            ...action,
            { key: 'SoundPath', value: values.SoundPath },
            { key: 'FileName', value: values.FileName },
            { key: 'FileExtension', value: values.FileExtension },
        ];
    } else {
        const soundText = values.SoundText.map((item) => `\${${item}}`);
        action = [...action, { key: 'SoundText', value: soundText.join('') }];
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
    const action = [
        { key: 'level', value: values.level, valueDesc: '规则优先级' },
        { key: 'dupChaseSheet', value: '', valueDesc: '判重后操作' },
        { key: 'uniqueAlarmFields', value: _.join(values.uniqueAlarmFields, ','), valueDesc: '判重条件' },
        { key: 'sheetStatus', value: _.join(values.sheetStatus, ','), valueDesc: '工单状态' },
        { key: 'delayTime', value: '', valueDesc: '延迟时间' },
    ];

    return action;
};

export const formatDispatchInhibition = (values) => {
    // 初始化独立字段的值
    const action = [
        { key: 'IsValid', value: Number(values.timeperiodSwitch), valueDesc: '是否启用' },
        { key: 'timeperiod', value: '', valueDesc: '启用时间段' },
    ];

    if (values.timeperiodSwitch) {
        action.find((item) => item.key === 'timeperiod').value = `${values.timeperiod[0].format('HH:mm')}~${values.timeperiod[1].format('HH:mm')}`;
    }
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
    1: Default, // 过滤器
    9: Default, // 告警自动确认规则
    60: Default, // 告警自动清除规则
    10: Dispatch, // 派单规则
    604: Dispatch, // 派单规则
    605: Dispatch, // 督办单派单规则
    606: Dispatch, // 督办单派单规则
    607: Dispatch, // 故障派单通知规则
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
    // 6: 告警查询规则
    // 200:告警订阅规则
};

/**
 * 过滤器编辑界面--规则动作部分数据整理
 */
export const moduleIdFormatMap = {
    10: formatDispatch,
    604: formatDispatch,
    605: formatDispatch,
    606: formatDispatch,
    607: formatDispatch,
    4: formatTransform,
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
};

/**
 * 过滤器编辑界面， 没有右侧规则动作界面的moduleId集合
 */
export const hasActionIds = ['1', '68', '201'];

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
export const defaultFilterConditionList = (login, provinceName, id) => {
    const { userInfo } = login;
    const { zones, systemInfo } = JSON.parse(userInfo);
    const list = [
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
            fieldLabel: '专业',
            fieldName: 'professional_type',
            dataType: 'integer',
            itemDesc: '1',
            reverse: 2,
            compareType: 'in',
            valueList: [],
        },
    ];
    if (id === 10 || id === 604 || id === 605 || id === 606 || id === 607) {
        list.push({
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
        });
    }
    if (id === 604) {
        list.push({
            fieldLabel: '高铁线路名称',
            fieldName: 'pivot_station_name',
            dataType: 'string',
            itemDesc: '0',
            reverse: 2,
            compareType: 'like',
            valueList: [],
        });
    }
    return list;
};
