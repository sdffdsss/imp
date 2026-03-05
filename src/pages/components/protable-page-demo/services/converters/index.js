import { createConverter } from '@Common/api/createConverter';
import { a } from './a';

const Converters = {
    a,
};

export const getConverter = createConverter(Converters);
