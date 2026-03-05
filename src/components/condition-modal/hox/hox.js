import { useState } from 'react';
import { createModel } from 'hox';

const usePageInfo = () => {
    const [leftCheckedData, setLeftCheckedData] = useState({});
    return {
        leftCheckedData,
        setLeftCheckedData,
    };
};
export default createModel(usePageInfo);

