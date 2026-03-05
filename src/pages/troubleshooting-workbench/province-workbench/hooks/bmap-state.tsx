import { useEffect, useRef, useState } from 'react';
import { usePersistFn, useSetState } from 'ahooks';
import { _ } from 'oss-web-toolkits';
import { message } from 'oss-ui';
import { getMapConfigApi } from '@Common/services/configService';
import { MAP_MODE, isProfessionalWithHeatmap, isProfessionalWithLinemap } from '../../components/bmap';

export const useBMapState = ({ zoneLevelFlags, currentZoneId, mapMode, areaId, selProfessional, mgmtZones }) => {
    const [state, setState] = useSetState({ areaId: null as any, mapMode: null as any, enableHeatmap: false, enableLinemap: false });
    const latestCache = useRef({ areaId });
    latestCache.current = {
        ...latestCache.current,
        areaId,
    };

    useEffect(() => {
        const getZoneId = () => {
            // 大区显示全国地图
            if (zoneLevelFlags.isRegionZone) {
                return 'china';
            }
            // 其他显示相应的地图
            return currentZoneId;
        };

        let abort = false;

        const findAreaId = async () => {
            const { data: configList } = await getMapConfigApi();
            if (abort) return;
            const zoneId = getZoneId();
            const areaItem = configList.find((d) => d.id === zoneId && Number(zoneId) !== 0);
            if (!areaItem && Number(zoneId) !== 0) {
                console.log(`%c[BMapGis WARN]: 当前zoneId(${zoneId})为未知区域，默认显示为全国地图`, 'color:red;');
            }
            setState({ areaId: areaItem ? areaItem.id : latestCache.current.areaId });
        };

        findAreaId();

        return () => {
            abort = true;
        };
    }, [zoneLevelFlags, currentZoneId, setState]);

    //
    useEffect(() => {
        if (state.areaId === null) return;
        setState({ mapMode: mapMode || MAP_MODE.FAULT });
    }, [mapMode, setState, state.areaId]);

    useEffect(() => {
        setState({ enableHeatmap: false, enableLinemap: false });
        if (state.areaId === null) return _.noop;
        const timer = setTimeout(() => {
            setState({
                enableHeatmap: isProfessionalWithHeatmap(selProfessional),
                enableLinemap: isProfessionalWithLinemap(selProfessional),
            });
        }, 100);
        return () => {
            clearTimeout(timer);
        };
    }, [state.areaId, selProfessional, setState]);

    const messageInfoRef = useRef<any>({});

    /**
     * 大区账号登录省份工作台，只允许下挂区域交互
     */
    const enableInteraction = usePersistFn((areaInfo) => {
        if (!zoneLevelFlags.isRegionZone || _.isEmpty(mgmtZones) || mgmtZones.some((d) => [areaInfo.id, areaInfo.parentId].includes(d.zoneId))) {
            return true;
        }

        if (messageInfoRef.current.id !== areaInfo.id) {
            messageInfoRef.current = areaInfo;
            message.error('无省份权限!', undefined, () => {
                messageInfoRef.current = {};
            });
        }

        return false;
    });

    return { state, setState, enableInteraction } as const;
};

export const useForceReInitMapGis = (ownerState) => {
    const [state, setState] = useState<any>({});

    const latestOwnerState = useRef(ownerState);
    latestOwnerState.current = ownerState;

    return {
        state: state === null ? { ...ownerState, forceReInitFlag: true } : state,
        forceReInitMapGis: usePersistFn(() => {
            setState({ ..._.mergeWith({}, latestOwnerState.current, () => null), forceReInitFlag: false });
            setTimeout(() => {
                setState(null);
            }, 500);
        }),
    };
};
