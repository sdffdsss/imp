import { useEnvironmentModel } from '@Src/hox';

const getDbNames = () => {
    const { environment: env } = useEnvironmentModel.data;
    return env?.default?.dbNames;
};
const getDbType = () => {
    const { environment: env } = useEnvironmentModel.data;
    return env?.default?.dbType ?? '';
};
const getVersion = () => {
    const { environment: env } = useEnvironmentModel.data;
    return env?.version ?? '';
};
export default {
    dbNames: getDbNames(),
    dbType: getDbType(),
    version: getVersion(),
};
