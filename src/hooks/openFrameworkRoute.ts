import { useHistory } from 'react-router-dom';
import shareActions from '@Src/share/actions';
import constants from '@Common/constants';
import { urlSearchObjFormat } from '@Common/utils/urlSearchObjFormat';

let timer;

export function openRoute(url, search) {
    const { actions, messageTypes } = shareActions;

    actions?.postMessage(messageTypes.closeTabs, {
        entry: `/unicom${url}`,
    });

    clearTimeout(timer);

    timer = setTimeout(() => {
        actions.postMessage(messageTypes.openRoute, {
            entry: `/unicom${url}`,
            search,
        });
    }, 500);
}

export function openFrameworkRouteFn({ history, url, search }) {
    const { actions } = shareActions;

    if (actions?.postMessage) {
        openRoute(url, search);
    } else {
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom${url}?${urlSearchObjFormat(search, 'str')}`);
    }
}

export function useOpenFrameworkRoute() {
    const history = useHistory();

    return (url, search) => openFrameworkRouteFn({ history, url, search });
}
