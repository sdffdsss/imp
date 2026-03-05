export enum PrefixType {
    'circle' = 'circle',
    'rect' = 'rect',
    'arrow' = 'arrow',
}
export interface IProps {
    prefixType?: PrefixType;
    customRender?: React.ReactNode;
    [key: string]: any;
}
