import { IAuthProps, ILogProps } from '../types';
import useAuth from './useAuth';
import useLog from './useLog';

export default function useAuthLog(props: IAuthProps & ILogProps) {
    const { authKey, onClick, sendLog, unauthorizedDisplayMode, ignoreAuth } = props;

    const { disabled, show, hasAuth } = useAuth({ authKey, unauthorizedDisplayMode, ignoreAuth });
    const { clickEventHandle } = useLog({ authKey, hasAuth, onClick, sendLog });

    return {
        clickEventHandle,
        disabled,
        show,
    };
}
