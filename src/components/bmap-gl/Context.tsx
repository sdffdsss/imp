import React from 'react';
import type { BMapApi } from './map';

const MapContext = React.createContext<BMapApi | null>(null);

const Provider: React.FC<{ api: BMapApi }> = (props) => {
    return <MapContext.Provider value={props.api}>{props.api.map && props.children}</MapContext.Provider>;
};

const useMapContext = () => React.useContext(MapContext);

export {
    //
    Provider,
    useMapContext,
};
