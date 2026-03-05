import { ModalProps } from 'antd';

interface ICustomProps {
    customFooterRender?: Function;
    okAuthKey?: string;
    contentProps: Record<string, any>;
}

export type IProps = ICustomProps & ModalProps;

export interface IModalContentProps {
    initialValues?: any;
    currentProvinceId?: string | number;
    data?: Array<any>;
}
