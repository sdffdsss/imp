export enum ModalEnumType {
    CREATE, // 创建
    EDIT, // 编辑
    VIEW, // 只读
}
export type ModeTypeValue = 'read' | 'edit' | 'update';
export const ModeTypeTitle = {
    [ModalEnumType.VIEW]: '查看',
    [ModalEnumType.CREATE]: '新增',
    [ModalEnumType.EDIT]: '编辑',
};
