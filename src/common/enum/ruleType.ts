/**
 * 规则类型
 */
enum ruleType {
    /**
     * 过滤器
     */
    filter = 1,

    /**
     * 告警自动确认规则
     */
    alarmAutoSumbit = 9,

    /**
     * 告警自动清除规则
     */
    alarmAutoClear = 60,

    /**
     * 派单规则
     */
    orderRule10 = 10,

    /**
     *     604: Dispatch, // 派单规则
     */
    dispatch604 = 604,

    /**
     *  短信前传
     */
    smsBeforeTransform = 4,

    /**
     *  IVR呼叫
     */
    ivrBeforeTransform = 14,

    /**
     *  呼叫并前转
     */
    callBeforeTransform = 18,

    /**
     *  预处理规则
     */
    preTreatRule = 7,

    /**
     *  告警发声规则
     */
    PhonationRule = 8,

    /**
     *  告警自愈
     */
    SelfHeal = 106,

    /**
     *  告警延时计数规则
     */
    TimeoutCount = 105,

    /**
     *  告警级别重定义规则
     */
    LevelRedefine = 2,

    /**
     *  告警类别重定义规则
     */
    CategoryRedefine = 3,

    /**
     *  告警延时清除规则
     */
    AutoClear = 67,

    /**
     *  告警判重规则
     */
    JudgeRepeat = 63,

    /**
     *  自动抑制派单规则
     */
    DispatchInhibition = 64,

    /**
     *告警订阅规则
     */
    AlarmSubscription107 = 107,

    /**
     *告警订阅规则
     */
    AlarmSubscriptionRule201 = 201,

    /**
     *告警查询规则
     */
    AlarmQueryRule = 6,

    /**
     *告警订阅规则
     */
    AlarmSubscriptionRule200 = 200,
}

export default ruleType;
