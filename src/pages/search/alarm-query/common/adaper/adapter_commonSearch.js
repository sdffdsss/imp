import { _ } from 'oss-web-toolkits';
import searchInitConfig from '../../config/config_searchForm';
import searchCommon from '../../config/config_searchCommon';

const getSearchInitConfig = () => {
    return searchInitConfig.map((searchConfig) => {
        const { commonColumns } = searchConfig;
        if (_.isArray(commonColumns)) {
            // const columns = searchCommon.filter(({ dataIndex }) => commonColumns.includes(dataIndex));
            const columns = commonColumns.map((dataIndex) => searchCommon.get(dataIndex));
            searchConfig.columns = columns;
        }
        return searchConfig;
    });
};
export default getSearchInitConfig;
