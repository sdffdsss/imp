import { createContext } from 'react';
import { ContextType, TabButtonEnum } from './type';

const GlobalStateContext = createContext<ContextType>({
    mode: TabButtonEnum.CABLE,
    setGlobalState: undefined,
    changeIsEditingFlag: undefined,
});

export default GlobalStateContext;
