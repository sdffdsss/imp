export interface MockDataType {
    name: string;
    id: string;
}
export interface GroupsDataType {
    groupName: string;
    users: string[];
}
export interface LeftDutyDataType {
    shiftForemans: string[];
    groups: Array<GroupsDataType>;
}

export interface ProfessionalsType {
    professionalName: string;
    groupCount: number;
}
export interface MiddleDataType {
    allGroupCount: number;
    jkGroupCount: number;
    ddGroupCount: number;
    professionalCount: number;
    professionals: Array<ProfessionalsType>;
}
export interface RightDataItemType {
    groupName: string;
    userCount: number;
}

export interface RightDataType {
    rowsData: RightDataItemType[];
    totalCount: number;
}
