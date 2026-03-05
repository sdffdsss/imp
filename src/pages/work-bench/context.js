import { createContext } from 'react';

export const GroupContext = createContext({
    groupId: undefined,
    groupName: undefined,
    centerName: undefined,
    refreshGroupInfo: () => {},
});
