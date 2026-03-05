import { ModalProps } from 'antd';

export type TMode = 'new' | 'edit' | 'view';

interface ICustomProps {
    mode?: TMode;
    customFooterRender?: Function;
    okAuthKey?: string;
    contentProps?: Record<string, any>;
}

export type IProps = ICustomProps & ModalProps;

export interface IModalContentProps {
    mode: 'new' | 'edit' | 'view';
    initialValues?: any;
}
