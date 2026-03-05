export enum ModalType {
    CREATE,
    EDIT,
    VIEW,
}

export const ModalTypeMap = {
    [ModalType.CREATE]: '新增',
    [ModalType.EDIT]: '编辑',
    [ModalType.VIEW]: '查看',
};

export type DictByFieldNameKey =
    | 'dutyManagerProfession'
    | 'dutyManagerReinsuranceLogo'
    | 'dutyManagerReinsuranceType'
    | 'dutyManagerReinsuranceLevel'
    | 'dutyManagerReinsuranceUrgency';
