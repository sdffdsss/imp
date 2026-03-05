import React, { useEffect, useState, useRef } from 'react';
import { Layout, ConfigProvider } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import GlobalMessage from '@Src/common/global-message';
import { useHistory } from 'react-router-dom';
// import { getVersionRelease } from 'version-update-webpack-plugin/src/index';
import { AliveScope } from 'react-activation';
import customizeRenderEmpty from '@Components/empty';
import ErrorBoundaryBlank from '@Components/error-boundary-blank';
import shareActions from '@Src/share/actions';
import constants from '@Common/constants';
import 'oss-ui/es/style/index.less';
import zhCN from 'oss-ui/lib/locale/zh_CN';

import { setLoginInfo, initTestLoginInfo } from './initialize';
import GlobalFonts from './components/global-fonts';
import './styles/App.less';
import routes, { mapRoutes, Switch } from './routes';

const { Content } = Layout;

// if (process.env.NODE_ENV === 'production') {
//     getVersionRelease(process.env.CURRENT_VERSION, `${constants.MICRO_APP_URL}/RELEASE_VERSION.json`);
// }
const changeTheme = (theme) => {
    const { actions, messageTypes } = shareActions;
    actions && actions.postMessage && actions.postMessage(messageTypes.changeTheme, theme);
};
const OssUnicom = (props) => {
    const { appTypeFlag } = props;
    return (
        <>
            <GlobalFonts />
            {appTypeFlag ? <OssImpAlarmApp {...props} /> : <OssImpAlarm {...props} />}
        </>
    );
};
function OssImpAlarmApp(props) {
    const { curRoute } = props;
    const history = useHistory();

    useEffect(() => {
        if (curRoute && curRoute !== '/home-unicom/alarm-window-unicom/custom-window') {
            history.push(curRoute);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // <ConfigProvider locale={zhCN} renderEmpty={customizeRenderEmpty}>
        <Layout className="oss-imp">
            <Content className="alarm-content">
                <ErrorBoundaryBlank>
                    <Switch>
                        <AliveScope>{mapRoutes(routes)}</AliveScope>
                    </Switch>
                </ErrorBoundaryBlank>
            </Content>
        </Layout>
        // </ConfigProvider>
    );
}
function OssImpAlarm(props) {
    const { environmentLoaded, reload } = useEnvironmentModel();
    const { curRoute, appTypeFlag } = props;
    const history = useHistory();
    const [haveLoginInfoFlag, setHaveLoginInfoFlag] = useState(false);

    const { userId, systemInfo, setContainer, setUuIdValue, setSrcString } = useLoginInfoModel();
    const userIdCacheRef = useRef(userId);
    const needBypassUserInfoControl = appTypeFlag || constants.appTypeFlag;

    useEffect(() => {
        if (curRoute) {
            if (!userIdCacheRef.current) {
                userIdCacheRef.current = userId;
                if (!userId) {
                    history.push(curRoute);
                }
            } else {
                userIdCacheRef.current = userId;

                if (curRoute) {
                    history.push(curRoute);
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
        if (needBypassUserInfoControl) {
            setHaveLoginInfoFlag(true);
        } else if (process.env.NODE_ENV === 'development' && !constants.isMicroApp) {
            initTestLoginInfo().then(() => {
                setHaveLoginInfoFlag(true);
            });
        } else if (props.onGlobalStateChange) {
            let isFirstChangeState = true;

            props.onGlobalStateChange((value) => {
                const { userInfo, systemInfo } = value;
                userIdCacheRef.current = userInfo.userId;
                setLoginInfo(value);
                setContainer(props.container);
                setUuIdValue(props.uuid);
                setSrcString(props.src);
                if (isFirstChangeState && systemInfo?.theme !== 'light') {
                    changeTheme(systemInfo?.theme);
                    isFirstChangeState = false;
                }
                setHaveLoginInfoFlag(true);
            }, true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let currentTheme = null;
        GlobalMessage.off('activeChangeTheme', null, null);
        GlobalMessage.on('activeChangeTheme', ({ isActive }) => {
            if (isActive && currentTheme !== systemInfo?.theme) {
                changeTheme(systemInfo?.theme);
                currentTheme = systemInfo?.theme;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [systemInfo?.theme]);

    useEffect(() => {
        // environment.json没加载回来导致environmentLoaded为false，页面不渲染
        const timer = setTimeout(() => {
            if (!environmentLoaded) {
                reload();
            }
        }, 3500);
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environmentLoaded]);

    return (
        <ConfigProvider locale={zhCN} renderEmpty={customizeRenderEmpty}>
            <Layout className="oss-imp">
                <Content className="alarm-content" id="imp-unicom-content-root">
                    <ErrorBoundaryBlank>
                        {environmentLoaded && haveLoginInfoFlag && (
                            <Switch>
                                <AliveScope>{mapRoutes(routes)}</AliveScope>
                            </Switch>
                        )}
                    </ErrorBoundaryBlank>
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default OssUnicom;
