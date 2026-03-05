import React, { CSSProperties } from 'react';
import { ColumnGroupType, TableProps, ColumnType, TablePaginationConfig } from 'oss-ui/lib/table';

export enum RowAction {
    edit = 'edit',
    delete = 'delete',
    view = 'view',
    add = 'add',
}

export type RefreshDataServiceType = (params?: Record<string, any>) => Promise<{
    pagination: TablePaginationConfig;
    data: any[];
}>;

export interface FinalColumnType<RecordType> extends ColumnType<RecordType> {
    editable: boolean;
}

export interface IEditAction {
    type: RowAction.edit;
    actionProps: {
        editMode: 'inline' | 'custom';
        handleCustomEdit?: (params?: Record<string, any>) => Promise<any>;
        handleEditConfirm?: (params?: Record<string, any>) => Promise<any>;
    };
}

export interface IDeleteAction {
    type: RowAction.delete;
    actionProps: {
        handleDelete?: (params?: Record<string, any>) => Promise<any>;
    };
}

export interface IViewAction {
    type: RowAction.view;
    actionProps: {
        handleView?: (params?: Record<string, any>) => Promise<any>;
    };
}

export interface IAddNewAction {
    type: RowAction.add;
    actionProps: {
        handleAdd?: (params?: Record<string, any>) => Promise<any>;
    };
}
// type ActionType = IEditAction | IDeleteAction | IViewAction | IAddNewAction;
export type RowActions = Array<IEditAction | IDeleteAction | IViewAction>;

export enum Pattern {
    readonly = 'readonly',
    editable = 'editable',
}

export interface IProps<RecordType> extends TableProps<RecordType> {
    actionWitdth?: number;
    refreshDataService: RefreshDataServiceType;
    defaultPageSize?: number;
    columns?: (ColumnGroupType<any> | FinalColumnType<any>)[];
    // editableColumnKeys: ColumnKeyType[];
    rowActions: RowActions;
    pattern?: keyof typeof Pattern;
    paginationPosition?: TablePaginationConfig['position'];
    titleRender?: React.ReactNode;
    leftToolBarRender?: React.ReactNode;
    toolBarRender?: React.ReactNode;
    showNewEmptyRow?: boolean;
    autoRefreshSetting?: {
        enable: boolean;
        interval?: number;
    };
    style?: CSSProperties;
    startRefreshData?: boolean;
    dataSourceTransform?: Function;
    needIndexColumn?: boolean;
    showRefreshButton?: boolean;
    moduleId?: number;
    onForceSelectRow?: (...args: any) => void;
    tableColumnSettingConfigType?: string | number;
    ref: any;
    titleSuffix?: React.ReactNode;
    forceHideActionColumn: boolean;
}
