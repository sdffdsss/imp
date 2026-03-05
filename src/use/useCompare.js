import { useRef } from 'react';
import { _ } from 'oss-web-toolkits';

const useCompare = (value) => {
    const ref = useRef(null);

    if (_.isEqual(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
};

export default useCompare;
