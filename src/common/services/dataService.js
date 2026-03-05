import { sqlServices } from 'oss-web-common';
import sqlConfig from './configs';
import request from '@Common/api';

const defaultProxyConfigs = {
    multiplePropKey: 'apply/executeIdList',
    singlePropKey: 'apply/execute',
    baseUrlType: 'default',
};

export default sqlServices(request, sqlConfig, defaultProxyConfigs);
