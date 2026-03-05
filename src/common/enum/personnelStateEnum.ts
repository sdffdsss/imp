enum PersonnelStateEnum {
    /**
     * 班组人员无交接班：0
     */
    TeamMembersButIsNoShift = 0,

    /**
     * 当班待交班人员：1
     */
    TeamMembersAndWaitShift = 1,

    /**
     * 待接班人员：2
     */
    WaitTakeOver = 2,

    /**
     * 非班组成员：9
     */
    NotTeamMembers = 9,
}

export default PersonnelStateEnum;
