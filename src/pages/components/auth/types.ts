export enum UnauthorizedDisplayMode {
    hide = 'hide',
    disabled = 'disabled',
}

export interface IAuthProps {
    authKey: string;
    unauthorizedDisplayMode?: keyof typeof UnauthorizedDisplayMode;
    ignoreAuth?: boolean;
}

export interface ILogProps {
    authKey: string;
    onClick: Function;
    sendLog?: boolean;
    hasAuth?: boolean;
}

export type TAuthContainer = IAuthProps & Omit<ILogProps, 'onClick'>;
