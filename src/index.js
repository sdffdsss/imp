import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'intersection-observer';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'oss-web-common';
import GlobalMessage from '@Src/common/global-message';
import Shift from '@Pages/shift';
import { Icon, ConfigProvider, Modal } from 'oss-ui';
import { logger } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import actions from './share/actions';
import constants from './common/constants';
import configureStore from './store';
import App from './App';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

// Trace = 0,
// Debug = 1,
// Info = 2,
// Warning = 3,
// Error = 4
logger.default.level = logger.Level.trace;

const BASENAME = constants.BASE_NAME;
// const appTypeFlag = window.location.pathname === '/chatOpsWeb/talk-view';
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_RENDER !== 'true') {
    // eslint-disable-next-line global-require
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
        trackHooks: false,
    });
}

Modal.config({
    rootPrefixCls: 'oss-ui',
});

Icon.createFromIconfontCN({
    scriptUrl: `${constants.STATIC_PATH}/iconfont/iconfont.js`,
    prefixCls: '', // 或者 直接调用 Icon.prefixCls = 'xxx';
});

const store = configureStore();

// 项目启动加载
export const bootstrap = async () => {
    logger.default.info('[alarm] bootstraped');
};

const render = async (props) => {
    const { container, curRoute = '/', onGlobalStateChange, setGlobalState } = props;
    // eslint-disable-next-line no-underscore-dangle
    if (!window.__INJECT_BY_SINGLE_SPA__) {
        await bootstrap();
    }
    if (props) {
        // 注入 actions 实例
        actions.setActions({ onGlobalStateChange, setGlobalState });
        actions.init();
    }

    ReactDOM.render(
        <React.StrictMode>
            <div className="oss-imp-alarm">
                <Provider store={store}>
                    <LocaleProvider localePath={constants.LOCALES_PATH}>
                        {
                            // eslint-disable-next-line no-underscore-dangle
                            window.__INJECT_BY_SINGLE_SPA__ ? (
                                <MemoryRouter>
                                    <App
                                        curRoute={curRoute}
                                        onGlobalStateChange={props.onGlobalStateChange}
                                        container={Document.body}
                                        uuid={props.uuid}
                                        src={props.src}
                                    />
                                </MemoryRouter>
                            ) : (
                                <BrowserRouter>
                                    <App container={Document.body} />
                                </BrowserRouter>
                            )
                        }
                    </LocaleProvider>
                </Provider>
            </div>
        </React.StrictMode>,
        (container || document).querySelector('#root'),
    );
};

// eslint-disable-next-line no-underscore-dangle
if (!window.__INJECT_BY_SINGLE_SPA__) {
    // eslint-disable-next-line global-require
    require('oss-ui/es/style/base.less');
    render({});
} else {
    /* eslint-disable-next-line no-underscore-dangle */
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = `${constants.MICRO_APP_URL}/`;
}

const storeGlobalState = (props) => {
    props.onGlobalStateChange((value, prev) => logger.default.debug(`[onGlobalStateChange - ${props.name}]:`, value, prev), true);
};

// 渲染微应用
export const mount = async (props) => {
    logger.default.debug('[alarm] props from main framework', props);
    const { container, isActive } = props;
    GlobalMessage.trigger('activeChangedFault', null, {
        isActive,
    });
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    storeGlobalState(props);
    if (props.renderType === 'modal_detail') {
        // 需要渲染 detail
        ReactDOM.render(
            <ConfigProvider prefixCls="oss-ui">
                <Shift />
            </ConfigProvider>,
            props.container.querySelector('#root'),
        );
    } else {
        // 现在的渲染逻辑
        render(props);
    }
};

// 卸载项目
export const unmount = async (props) => {
    const { container } = props;

    ReactDOM.unmountComponentAtNode((container || document).querySelector('#root'));
};

export const update = async (props) => {
    const { isActive } = props;
    GlobalMessage.trigger('activeChangeTheme', null, {
        isActive,
    });
    GlobalMessage.trigger('activeChanged', null, {
        isActive,
    });
    GlobalMessage.trigger('activeChangedFault', null, {
        isActive,
    });
    GlobalMessage.trigger('activeChangedGisMap', null, {
        isActive,
    });
};
