import React, { Component, createRef } from 'react';
import useLoginInfoModel from '@Src/hox';
import urlSearch from '@Common/utils/urlSearch';
import SystemNotice from '@Components/system-notice';
import WorkbenchCommonTopInfo from '@Pages/components/workbench-common-top-info';
import { withModel } from 'hox';
import GlobalMessage from '@Src/common/global-message';
import { _ } from 'oss-web-toolkits';
import WorkBench from './workBench';
import { getWorkStationConfiguration } from './api';
import { GroupContext } from './context';

const elementSource = [
    {
        id: '1',
        direction: 'left',
    },
    {
        id: '5',
        direction: 'right',
    },
    {
        id: '7',
        direction: 'right',
    },
    {
        id: '2',
        direction: 'right',
    },
    {
        id: '8',
        direction: 'right',
    },
    {
        id: '9',
        direction: 'right',
    },
];

class Index extends Component {
    TopInfoRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            itemsLeft: [],
            itemsRight: [],
            count: false,
            groupInfo: undefined,
        };
        this.checkBenchType = props?.location?.state?.type;
        this.userIdCache = props.login.userId;
    }

    componentDidMount() {
        this.init();
        // this.watchUserChangeFromOtherTab();
    }

    componentDidUpdate(prevProps) {
        if (this.props.login.userId !== prevProps.login.userId || this.props.login.currentZone !== prevProps.login.currentZone) {
            _.debounce(() => {
                // this.init();
            }, 1000);
        }
    }

    componentWillUnmount() {
        GlobalMessage.off('activeChanged', this.userChangeCallbackFromOtherTab);
    }

    init = () => {
        const { benchType = '1' } = this.props;

        const params = this.checkBenchType
            ? {
                  configType: this.checkBenchType || benchType,
              }
            : {
                  userId: this.props.login.userId,
              };
        getWorkStationConfiguration({ ...params, appId: this.props.login.systemInfo.appId || '110002' }).then((res) => {
            if (res?.data?.upToDateWorkStationConfig) {
                const itemsList = JSON.parse(res.data.upToDateWorkStationConfig) || [];

                this.setState({
                    itemsLeft: itemsList.filter((item) => item.direction === 'left').filter((item) => item.id !== '0'),
                    itemsRight: itemsList.filter((item) => item.direction === 'right'),
                });
            } else {
                this.setState({
                    itemsLeft: elementSource.filter((item) => item.direction === 'left').filter((item) => item.id !== '0'),
                    itemsRight: elementSource.filter((item) => item.direction === 'right'),
                });
            }
        });
    };

    userChangeCallbackFromOtherTab = ({ isActive }) => {
        if (this.userIdCache !== this.props.login.userId && isActive) {
            setTimeout(() => {
                // 初始化状态
                this.setState({
                    itemsLeft: [],
                    itemsRight: [],
                    count: false,
                });
                this.checkBenchType = this.props?.location?.state?.type;

                this.userIdCache = this.props.login.userId;

                this.init();
            }, 1000);
        }
    };

    /**
     * @description: 其他tab下微应用主动切换登录用户后，流水窗需要刷新
     */
    watchUserChangeFromOtherTab = () => {
        GlobalMessage.on('activeChanged', this.userChangeCallbackFromOtherTab);
    };

    onModuleModify = (params) => {
        if (!params) return;
        const { count, itemsLeft, itemsRight } = this.state;
        this.setState(
            {
                itemsLeft: params
                    .filter((item) => item.extra.direction === 'left')
                    .filter((item) => item.id !== '0')
                    .map((it) => ({
                        id: it.id,
                        direction: it.direction,
                        config: itemsLeft.filter((itm) => itm.id === it.id)[0]?.config || [],
                    })),
                itemsRight: params
                    .filter((item) => item.extra.direction === 'right')
                    .filter((item) => item.id !== '0')
                    .map((it) => ({
                        id: it.id,
                        direction: it.direction,
                        config: itemsRight.filter((itm) => itm.id === it.id)[0]?.config || [],
                    })),
            },
            () => {
                this.setState({
                    count: !count,
                });
            },
        );
    };

    onGroupChange = (data) => {
        this.setState({ groupInfo: { ...data, refreshGroupInfo: this.TopInfoRef.current.refreshGroupInfo } });
    };

    render() {
        const { count, groupInfo } = this.state;
        const { login, location } = this.props;
        const urlData = urlSearch(window.location.href);
        if (urlData.provinceId && login?.systemInfo?.currentZone?.zoneId) {
            login.systemInfo.currentZone.zoneId = urlData.provinceId;
        }
        const defaultData = [...this.state.itemsLeft, ...this.state.itemsRight];
        return (
            <GroupContext.Provider value={groupInfo}>
                <div className={login.systemInfo.theme === 'darkblue' ? 'workbench-main-cotainer-darkBlue' : 'workbench-main-cotainer'}>
                    <SystemNotice />
                    <div className="top-box-wrapper">
                        <WorkbenchCommonTopInfo
                            ref={this.TopInfoRef}
                            loginInfo={this.props.login}
                            location={this.props.location}
                            onModuleModify={this.onModuleModify}
                            onGroupChange={this.onGroupChange}
                            isManagementButtonVisible
                        />
                    </div>
                    {defaultData.length ? (
                        <WorkBench
                            defaultData={defaultData}
                            login={login}
                            benchType={this.checkBenchType}
                            count={count}
                            location={location}
                            history={this.props.history}
                            theme={login.systemInfo.theme}
                            onGroupChange={this.onGroupChange}
                        />
                    ) : null}
                </div>
            </GroupContext.Provider>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
