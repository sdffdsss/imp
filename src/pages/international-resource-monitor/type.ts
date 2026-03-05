import { Dispatch, SetStateAction } from 'react';

export enum TabButtonEnum {
    CABLE = 'cable', // 海缆监控
    LANDCABLE = 'landCable', // 陆缆监控通道
    HISTORY = 'history', // 历史记录
}

export enum TabButtonHistoryEnum {
    CABLEHISTORY = 'history/cable', // 海缆监控
    LANDCABLEHISTORY = 'history/landCable', // 陆缆监控通道
}

export type ContextValueType = {
    mode: TabButtonEnum | TabButtonHistoryEnum; // 保存当前点击的按钮状态
};

type SetStateType = Dispatch<SetStateAction<ContextValueType>>;

export interface ContextType extends ContextValueType {
    setGlobalState?: SetStateType; // 修改 context 内容
    changeIsEditingFlag?: (flag: boolean) => void; // 是否有正在编辑的内容
}

export type GetContextValue = [
    contextValue: ContextValueType,
    changeContextValue: (data: Partial<ContextValueType>) => void, // 修改 context 内容
];

export enum IsDelete {
    VALALLATA = 0, // 有效数据
    INVALIDDATA = 1, // 无效数据
    FULLDATA = 2, // 全量数据（包括已删除数据）
}

export const TabList = [
    {
        name: '海缆监控',
        id: TabButtonEnum.CABLE,
    },
    {
        name: '陆缆通道监控',
        id: TabButtonEnum.LANDCABLE,
    },
    {
        name: '历史记录',
        id: TabButtonEnum.HISTORY,
        children: [
            {
                name: '海缆监控',
                id: TabButtonHistoryEnum.CABLEHISTORY,
            },
            {
                name: '陆缆通道监控',
                id: TabButtonHistoryEnum.LANDCABLEHISTORY,
            },
        ],
    },
];
