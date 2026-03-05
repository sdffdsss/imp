import { getMicroUrl } from 'oss-web-common';

const { PUBLIC_URL, NODE_ENV, REACT_APP_CONFIG_HOST, REACT_APP_CONFIG_LOCAL } = process.env;

// eslint-disable-next-line no-underscore-dangle
const appTypeFlag =
    window.location.pathname.indexOf('/chatOpsWeb/talk-view') !== -1 ||
    window.location.pathname.indexOf('/chatOpsWeb/talk-list') !== -1 ||
    window.location.pathname.indexOf('/chatOpsWeb/dispatch-setting') !== -1 ||
    window.location.pathname.indexOf('/view/setting-robot') !== -1;

const isMicroApp = window.__INJECT_BY_SINGLE_SPA__ || appTypeFlag;
const isEnvProduction = NODE_ENV === 'production';

const BASE_NAME = isMicroApp ? window.BASE_PATH + 'unicom' : '';
const MICRO_APP_URL = isMicroApp && isEnvProduction ? getMicroUrl(window) + BASE_NAME : PUBLIC_URL;

const CUR_ENVIRONMENT = window.BASE_PATH?.split('/')[2] || 'local';

const STATIC_PATH = `${MICRO_APP_URL}/static`;
const IMAGE_PATH = `${STATIC_PATH}/images`;
const IMP_ALARM_REPORT = `${MICRO_APP_URL}/report`;
const LOCALES_PATH = `${STATIC_PATH}/locales`;
// const LOCALES_PATH_APP = `${STATIC_PATH}/locales`
const MOCK_DATA_PATH = `${STATIC_PATH}/data`;
const MAP_PATH = `${IMAGE_PATH}/img`;

export default {
    BASE_NAME,
    CUR_ENVIRONMENT,
    STATIC_PATH,
    IMAGE_PATH,
    LOCALES_PATH,
    IMP_ALARM_REPORT,
    MICRO_APP_URL,
    MOCK_DATA_PATH,
    CONFIG_HOST: REACT_APP_CONFIG_HOST || window.location.pathname.split('/').slice(0, 3).join('/'),
    CONFIG_LOCAL: REACT_APP_CONFIG_LOCAL,
    MAP_PATH,
    isMicroApp,
    appTypeFlag,
};
