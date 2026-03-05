import { ModalProps } from 'antd';

type TMode = 'new' | 'edit' | 'view';

interface ICustomProps {
    mode?: TMode;
    customFooterRender?: Function;
    okAuthKey?: string;
    contentProps?: Record<string, any>;
}

export type IProps = ICustomProps &
    ModalProps & {
        onOk?: (e: React.MouseEvent<HTMLElement>, any) => void;
    };

export interface IModalContentProps {
    initialValues?: any;
}
