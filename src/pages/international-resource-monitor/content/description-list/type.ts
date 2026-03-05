export interface DescriptionItemDataType {
    faultDescription: string;
    id: string;
    alarmRelations?: [];
    createId?: string | number;
    createTime?: string;
    modifyId?: null | string;
    modifyTime?: null | string;
    isDelete?: 0 | 1; // 是否删除，0 未删除 1 已删除
}

export interface InsertData {
    faultDescription: string;
    createId: number | string;
    alarmRelations: [];
}
