import { ModalProps } from 'antd';

export type TMode = 'new' | 'edit' | 'view' | 'review';

interface ICustomProps {
    mode?: TMode;
    customFooterRender?: Function;
    okAuthKey?: string;
    contentProps?: Record<string, any>;
    extra?: any;
    initialValues?: any;
    customProps?: any;
    siteList?: any[];
}

export type IProps = ICustomProps & ModalProps;

export interface IModalContentProps {
    mode: 'new' | 'edit' | 'view' | 'review';
    initialValues?: any;
    provinceList?: any[];
    enum?: any;
    onSwitchToEdit?: (draftData: any, sheetNo: string) => void;
    [key: string]: any;
}
