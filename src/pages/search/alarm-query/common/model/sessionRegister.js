export default {
    alarmOrigin: 0,
    alarmsenceId: 0,
    asc: false,
    fieldConditions: {
        conditionList: [],
        logicalAnd: true,
        not: true,
    },
    mConditionMaps: {},
    // dateBean: {
    //     endTime: '2020-09-17 18:00:00',
    //     fieldId: 62,
    //     not: false,
    //     startTime: '2000-01-01 00:00:00',
    //     type: 'type',
    // },

    // fieldIds: [9, 7, 136, 16, 18, 33, 30, 62, 68, 69],
    fieldIds: [62, 68, 69],
    logicalAnd: true,
    sessionId: '12345678',
    sortFieldId: -1,
    userId: null,
    // statusBean: {
    //     activeStatus: 1,
    //     fieldId: 68,
    //     not: false,
    //     status: [0, 1, 2, 3, 4, 5, 6, 7],
    //     type: 'eq',
    // },
};
const statusBeanDefault = {
    activeStatus: 1,
    fieldId: 68,
    not: false,
    status: [0, 1, 2, 3, 4, 5, 6, 7],
    type: 'eq',
};
export { statusBeanDefault };
