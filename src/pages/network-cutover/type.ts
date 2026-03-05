/* eslint-disable @typescript-eslint/naming-convention */
import type { Moment } from 'moment';

export enum MODAL_TYPE {
    EDIT = 1, // 编辑
    BUILD = 2, // 新建
    SEARCH = 3, // 查看
}

export const MODAL_TYPE_NAME = {
    [MODAL_TYPE.EDIT]: '编辑',
    [MODAL_TYPE.BUILD]: '新建',
    [MODAL_TYPE.SEARCH]: '查看',
};

export enum MAJOR_ENUM {
    BUSINESS = 85, // 业务平台专业
    ATM = 9998, // ATM专业
    CORE = 1, // 核心网专业
    TRANSMISSION = 3, // 传输网专业
    INTERNET = 9999, // 互联网专业
}

// 枚举初始数据类型
export type ENUMS_TYPES = {
    label?: string;
    key?: string;
    value: string;
}[];
// 枚举初始数据类型
export type ENUMS_TYPES_LABEL = {
    label: string;
    value: string;
}[];
// 所需枚举类型
export type ALL_ENUMS = {
    professionalEnum?: ENUMS_TYPES;
    cutoverAckStatusEnum?: ENUMS_TYPES;
    recordSourceEnum?: ENUMS_TYPES_LABEL;
    nmsTypeEnum?: ENUMS_TYPES;
    affiliatedNetworkEnum?: ENUMS_TYPES;
    completionStatusEnum?: ENUMS_TYPES;
    networkCutProfessionEnum?: ENUMS_TYPES;
    cutoverProfessionEnum?: ENUMS_TYPES_LABEL;
    cutoverClassificationEnum?: ENUMS_TYPES_LABEL;
    cutoverFinishStatusEnum?: ENUMS_TYPES_LABEL;
    operateLevelEnum?: ENUMS_TYPES_LABEL;
    isEffectBusinessEnum?: ENUMS_TYPES_LABEL;
    recordSourcePlatformEnum?: any;
    groupSourceEnum?: any;
};

export interface ActionType {
    reload: (resetPageIndex?: boolean) => void;
    reloadAndRest: () => void;
    reset: () => void;
    clearSelected?: () => void;
    startEditable: (rowKey: string | number) => boolean;
    cancelEditable: (rowKey: string | number) => boolean;
}

export const YES_NO_OPTION = [
    {
        value: 0,
        label: '否',
    },
    {
        value: 1,
        label: '是',
    },
];

export const YES_NO_VALUE_ENUM = {
    0: {
        text: '否',
    },
    1: {
        text: '是',
    },
};

export type FormatValueEnumFn = (enumData?: ENUMS_TYPES, field?: number[]) => { [key: number]: { text: string } };

export type FormatOptionFn = (enumData?: ENUMS_TYPES, field?: number[]) => { label: string; value: number }[];

export type ConvertParamsFileDataFn = (
    fileList: { response?: string | number; id?: string | number; status: 'success' | 'error' | 'done' | 'uploading' | 'removed' }[],
) => string;

type fileType = {
    annexPath: string;
    annexName: string;
    id: string | number;
};

export type ConvertFileDataFn = (list?: fileType[]) => fileType[]['length'] extends 0
    ? []
    : {
          url: fileType['annexPath'];
          name: fileType['annexName'];
          id: fileType['id'];
          status: 'done';
      }[];

export type DisabledDateFn = (current: Moment, start?: string | Moment, end?: string | Moment) => boolean;

export type DisabledTimeFn = (
    current: Moment | null,
    start?: string | Moment,
    end?: string | Moment,
) => {
    disabledHours: () => number[];
    disabledMinutes: () => number[];
    disabledSeconds: () => number[];
};

// 是否中断业务
export const TRUEORFALSE_INTERRUPT_BUSINESS = new Map([
    [0, '否'],
    [1, '是'],
]);

// 是否在大屏显示
export const YES_NO_SHOW_ON_SCREEN = [
    {
        value: 0,
        label: '否',
    },
    {
        value: 1,
        label: '是',
    },
];
