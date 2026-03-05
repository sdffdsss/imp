import { _ } from 'oss-web-toolkits';

export const createConverter = (Converters: Record<string, (...args: any[]) => any>) => {
    return (name: string, ...injectArgs: any[]) => {
        return (res: any) => _.get(Converters, name)(res, ...injectArgs);
    };
};
