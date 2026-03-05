import actionss from '@Src/share/actions';
import constants from '@Common/constants';
import { useHistory } from 'react-router-dom';

export const usePush = () => {
    const history = useHistory();
    const pushActions = (url: string, label: string, search?: Record<string, any>) => {
        const { actions, messageTypes } = actionss;
        if (actions && actions.postMessage) {
            let entry = url;
            if (window.location.pathname.includes('/home-unicom')) {
                entry = `/unicom/home-unicom${url}`;
            } else {
                entry = `/unicom${url}`;
            }
            actions.postMessage(messageTypes.openRoute, {
                entry,
                search: {
                    ...search,
                },
            });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom${url}`);
        }
    };
    return [pushActions];
};
