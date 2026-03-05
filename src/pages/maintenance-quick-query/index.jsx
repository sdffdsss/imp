import React from 'react';
import { Tabs } from 'oss-ui';
import { withModel } from 'hox';
import FuzzyQuery from './maintenance-fuzzy-query';
import QuickQuery from './maintenance-quick-query';
import { logNew } from '@Common/api/service/log';
import GlobalMessage from '@Src/common/global-message';
import useLoginInfoModel from '@Src/hox';
import { sendLogFn } from '@Pages/components/auth/utils';
import './style.less';

const { TabPane } = Tabs;
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            noFlag1: false,
            noFlag2: false,
            tabValue: '1',
            componentKey: Date.now(),
        };
        this.userIdCache = useLoginInfoModel.data.userId;
    }

    componentDidMount() {
        this.watchUserChangeFromOtherTab();
    }

    componentDidUpdate() {}

    componentWillUnmount() {
        GlobalMessage.off('activeChanged', this.userChangeCallbackFromOtherTab);
    }

    userChangeCallbackFromOtherTab = ({ isActive }) => {
        const newUserId = useLoginInfoModel.data.userId;

        if (this.userIdCache !== newUserId && isActive) {
            setTimeout(() => {
                this.userIdCache = newUserId;
                this.setState({
                    noFlag1: false,
                    noFlag2: false,
                    tabValue: '1',
                    componentKey: Date.now(),
                });
            }, 1000);
        }
    };

    /**
     * @description: 其他tab下微应用主动切换登录用户后
     */
    watchUserChangeFromOtherTab = () => {
        GlobalMessage.on('activeChanged', this.userChangeCallbackFromOtherTab);
    };

    noTitlChange = (flag) => {
        const { tabValue } = this.state;
        this.setState({
            [tabValue === '1' ? 'noFlag1' : 'noFlag2']: flag,
        });
    };
    tabChange = (value) => {
        // logNew('监控工作台运维调度表', '300006');
        if (value === '1') {
            sendLogFn({ authKey: 'workbenches:OpsQuickQuery' });
        } else if (value === '2') {
            sendLogFn({ authKey: 'workbenches:OpsDimQuery' });
        }
        this.setState({
            tabValue: value,
        });
    };
    render() {
        const { noFlag1, noFlag2, tabValue, componentKey } = this.state;
        return (
            <div className="card-container">
                <Tabs
                    key={componentKey}
                    type="card"
                    tabBarExtraContent={
                        tabValue === '1'
                            ? noFlag1 && <div style={{ color: '#f50', paddingRight: 10, fontSize: 14, fontWeight: 'bold' }}>标红的值班人员不存在</div>
                            : noFlag2 && <div style={{ color: '#f50', paddingRight: 10, fontSize: 14, fontWeight: 'bold' }}>标红的值班人员不存在</div>
                    }
                    onChange={this.tabChange}
                >
                    <TabPane tab="快捷查询" key="1">
                        <FuzzyQuery noTitlChange={this.noTitlChange} />
                    </TabPane>
                    <TabPane tab="模糊查询" key="2">
                        <QuickQuery noTitlChange={this.noTitlChange} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
