import { useEffect, useRef, useState } from 'react';
import { usePersistFn, useSetState } from 'ahooks';
import { _ } from 'oss-web-toolkits';
import { MAP_MODE, isProfessionalWithHeatmap, isProfessionalWithLinemap } from '../../components/bmap';

export const useBMapState = ({ selProfessional, mapMode, areaId }) => {
    const [state, setState] = useSetState({ enableHeatmap: false, enableLinemap: false });

    useEffect(() => {
        setState({ enableHeatmap: false, enableLinemap: false });

        if (mapMode === MAP_MODE.ONLINE) {
            return _.noop;
        }

        const timer = setTimeout(() => {
            setState({
                enableHeatmap: isProfessionalWithHeatmap(selProfessional),
                enableLinemap: isProfessionalWithLinemap(selProfessional),
            });
        }, 100);
        return () => {
            clearTimeout(timer);
        };
    }, [selProfessional, mapMode, areaId, setState]);

    return [state] as const;
};

export const useForceReInitMapGis = (ownerState) => {
    const [state, setState] = useState<any>({});

    const latestOwnerState = useRef(ownerState);
    latestOwnerState.current = ownerState;

    return {
        state: state === null ? { ...ownerState, forceReInitFlag: true } : state,
        forceReInitMapGis: usePersistFn(() => {
            setState({
                ..._.mergeWith({}, latestOwnerState.current, () => null),
                forceReInitFlag: false,
            });
            setTimeout(() => {
                setState(null);
            }, 500);
        }),
    };
};
