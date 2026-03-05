import actionss from '@Src/share/actions';
import { useHistory } from 'react-router-dom';
import constants from '@Common/constants';

export const useNavigatePage = () => {
    const history = useHistory();
    const getUrlSearchParams = () => {
        const search = new URLSearchParams(window.location.search);

        const params: any = {};
        search.forEach((value, key) => {
            params[key] = value;
        });

        return params;
    };
    const setUrlSearchParams = (params: Record<string, any>) => {
        const search = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                search.set(key, params[key]);
            }
        });
        return search.toString();
    };

    const pushActions = (url: string, search: Record<string, any>) => {
        const { actions, messageTypes } = actionss;
        let timer;
        if (actions && actions.postMessage) {
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
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom${url}?${setUrlSearchParams(search)}`);
        }
    };

    return { pushActions, getUrlSearchParams };
};
