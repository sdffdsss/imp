import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { genAuthResult } from '../utils';
import { IAuthProps } from '../types';

export default function useAuth(props: IAuthProps) {
    const { authKey, unauthorizedDisplayMode = 'hide', ignoreAuth = false } = props;

    const loginInfo = useLoginInfoModel();
    const { environment } = useEnvironmentModel();
    const { buttonAuthorize } = environment;

    let show = false;
    let disabled = false;
    let hasAuth = false;

    if (ignoreAuth) {
        show = true;
        disabled = false;
        hasAuth = true;
    } else {
        const {
            show: showTemp,
            disabled: disabledTemp,
            hasAuth: hasAuthTemp,
        } = genAuthResult({ loginInfo, buttonAuthorize, authKey, unauthorizedDisplayMode });

        show = showTemp;
        disabled = disabledTemp;
        hasAuth = hasAuthTemp;
    }

    return {
        disabled,
        show,
        hasAuth,
    };
}
