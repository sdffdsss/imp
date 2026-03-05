import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';

const useMonitorBlock = (isBlock = true) => {
    const history = useHistory();
    const [unblock, setUnblock] = useState(null);

    const onNavigator = useCallback(
        (action, nextLocation) => {
            if (isBlock) {
                return;
            }
            if (action === 'PUSH') {
                history.push(nextLocation);
            } else if (action === 'POP') {
                history.goBack();
            } else if (action === 'REPLACE') {
                history.replace(nextLocation);
            }
        },
        [history, isBlock]
    );

    useEffect(() => {
        if (!isBlock) {
            return;
        }

        const cancel = history.block((nextLocation, action) => {
            // unblock && unblock();
            onNavigator(action, nextLocation);
            return false;
        });

        setUnblock(cancel);
    }, [isBlock, history, onNavigator]);

    return { unblock };
};

export default useMonitorBlock;
