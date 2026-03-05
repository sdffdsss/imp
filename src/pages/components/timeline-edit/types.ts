// eslint-disable-next-line
import { TimelineProps, TimelineItemProps } from 'antd';

// eslint-disable-next-line
export type modifyScopeType = 'importance' | 'record';

export interface ICustomItem {
    recordId?: string;
    userName: string;
    userId: string;
    operationTime: string;
    content: string;
    finishedFlag: 0 | 1;
    remainFlag: 0 | 1;
    prevFlag: 0 | 1;
    fileInfos: any[];
}

export interface ICustomeProps {
    modifyScope: modifyScopeType;
    needDefaultAddItem: boolean;
    showUserName: boolean;
    list: (ICustomItem & TimelineItemProps)[];
    pattern?: 'readonly' | 'editable';
    groupId: string;
    onSave: (data: ICustomItem[]) => void;
    onDelete: (recordId: string) => void;
    onUpload: (data: any) => Promise<any>;
    onDeleteFile: (data: any) => Promise<any>;
    onDownload: (data: any) => Promise<any>;
}
export type ComponentProps = ICustomeProps & TimelineProps;
