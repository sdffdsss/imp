import { sqlServices } from 'oss-web-common';
import sqlConfig from '@Common/services/configs';
import request from '@Common/api';

const defaultProxyConfigs = {
    multiplePropKey: 'apply/executeIdList',
    singlePropKey: 'apply/execute',
    baseUrlType: 'unicom',
};

export default sqlServices(request, sqlConfig, defaultProxyConfigs);
