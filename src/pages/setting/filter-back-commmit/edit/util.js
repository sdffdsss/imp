/**
 * 规则管理各种类型的的规则动作保存时的处理逻辑
 */
export const formatDispatch = (values) => {
    // 初始化独立字段的值
    const action = {
        restrainProjectAlarm: Number(values.restrainProjectAlarm),
        needT1: Number(values.needT1),
        startForwardTime: values.startForwardTime.format('HH:mm'),
        endForwardTime: values.endForwardTime.format('HH:mm'),
        nonForwardProcess: values.nonForwardProcess,
        dayPeriod: Number(values.dayPeriod),
        dayOfWeek: values.dayOfWeek.join(','),
        delayTime: values.delayTime,
        childAlarm: Number(values.childAlarm),
        rulePriority: Number(values.rulePriority),
        relationAction: Number(values.relationAction),
        alarmHandleLevel: Number(values.alarmHandleLevel),
    };

    if (action.dayPeriod) {
        action.startUseTime = values.startUseTime.format('YYYY-MM-DD');
        action.noEndDate = Number(values.noEndDate);

        if (!values.noEndDate) {
            action.endUseTime = values.endUseTime;
        }
    }

    if (values.delayTime === 0) {
        action.ruleSet = values.ruleSet;
    }

    if (values.childAlarm) {
        action.sendSheetChildAlarm = values.sendSheetChildAlarm;
    }

    if (values.rulePriority) {
        action.rulePrioritySelectValue = values.selectPriority;
    }

    return action;
};

export const formatTransform = (values) => {
    // 初始化独立字段的值
    const action = {
        pattern14checked: values.transformMode === 'pattern14checked' ? 'checked' : '',
        pattern4checked: values.transformMode === 'pattern4checked' ? 'checked' : '',
        pattern18checked: values.transformMode === 'pattern18checked' ? 'checked' : '',
        delayTime: values.delayTime,
        // forwardTime: values.forwardTime,
        startUseTime: values.useTime[0].format('HH:mm'),
        endUseTime: values.useTime[1].format('HH:mm'),
        forwardDate: Number(values.forwardDate),
        isClearSMSContent: Number(values.isClearSMSContent),
        numUpDownRepeatTimes: values.numUpDownRepeatTimes,
        sendMode: values.sendMode,
    };

    if (values.forwardTime) {
        action.startForwardDate = values.startForwardDate;
        action.noEndDate = values.noEndDate;

        if (!values.noEndDate) {
            action.endForwardDate = values.endForwardDate;
        }
    }

    return action;
};

export const formatPretreat = (values) => {
    // 初始化独立字段的值
    const action = {
        belongRuleID: values.belongRuleID,
        isProjectAlarmNoProcess: Number(values.isProjectAlarmNoProcess),
        delayTime: values.delayTime,
        isforwardTime: values.isforwardTime,
        startTime: values.forwardTime[0].format('HH:mm'),
        endTime: values.forwardTime[1].format('HH:mm'),
        relationshipAction: values.relationshipAction,
        frequency: values.frequency,
        selectedTask: values.selectedTask,
        selectedTaskName: values.selectedTaskName,
    };

    return action;
};

export const formatPhonation = (values) => {
    // 初始化独立字段的值
    const action = {
        isVaildTime: Number(values.isVaildTime),
        startVaildTime: values.useTime[0].format('HH:mm'),
        endVaildTime: values.useTime[1].format('HH:mm'),
    };

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
    const action = {
        url: values.url,
    };

    return action;
};

export const formatCategoryRedefine = (values) => {
    // 初始化独立字段的值
    const action = {
        url: values.url,
    };

    return action;
};

export const formatAutoClear = (values) => {
    // 初始化独立字段的值
    const action = {
        delayTime: values.delayTime,
    };

    return action;
};

export const formatJudgeRepeat = (values) => {
    // 初始化独立字段的值
    const action = {
        url: values.url,
    };

    return action;
};

export const formatDispatchInhibition = (values) => {
    // 初始化独立字段的值
    const action = {
        startTime: values.forwardTime[0].format('HH:mm'),
        endTime: values.forwardTime[1].format('HH:mm'),
    };

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
