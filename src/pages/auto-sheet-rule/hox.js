import { useState } from 'react';
import { createModel } from 'hox';

const usePageInfo = () => {
    const [loadType, setLoadType] = useState('init');

    return {
        loadType,
        setLoadType,
    };
};
export default createModel(usePageInfo);
