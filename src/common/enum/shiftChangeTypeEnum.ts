enum ShiftChangeTypeEnum {
    /**
     * 有班组无交接班的人员: 0
     */
    MemberNonSchedule = '0',

    /**
     * 当班待交班人员：1
     */
    Handover = '1',

    /**
     * 待接班人员：2
     */
    Takeover = '2',

    /**
     * 交班完成人员 值班记录查看：3
     */
    DutyRecords = '3',

    /**
     * 没有班组的人员: 9
     */
    NonTeamMember = '9',
    /**
     *该班组已经交班，但是该人员未交班打卡:1001
     */
    NeedClockOff = '1001',

    /**
     * 该班组已经接班，但是该人员未接班打卡:1002
     */
    NeedClockOn = '1002',
}

export default ShiftChangeTypeEnum;
