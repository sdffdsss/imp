import { useState } from 'react';
import { createModel } from 'hox';

const usePageInfo = () => {
    const [loadType, setLoadType] = useState('init');
    const [selectFilter, setSelectFilter] = useState('');

    return {
        loadType,
        setLoadType,
        selectFilter,
        setSelectFilter,
    };
};
export default createModel(usePageInfo);
