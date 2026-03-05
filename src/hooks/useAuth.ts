import useLoginInfoModel from '@Src/hox';
import constants from '@Src/common/constants';

export const useAuth = () => {
    const { parsedUserInfo } = useLoginInfoModel();

    const isHasAuth = (authKey: string) => {
        const { operationsButton } = parsedUserInfo;
        const findAuth = operationsButton.find((item) => item.key === authKey);
        return !!findAuth;
    };
    const isHasPathAuth = (path: string) => {
        const { operations } = parsedUserInfo;
        const findAuth = operations.find((item) => item.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${path}`));

        return !!findAuth;
    };
    return { isHasAuth, isHasPathAuth };
};
