import React from 'react';
import { Tabs, Card } from 'oss-ui';
import PageContainer from '@Components/page-container';
import AlarmColTemplate from './alarm-col-template';
import QueryAlarmColTemplate from './query-alarm-col-template';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

const { TabPane } = Tabs;

class Index extends React.PureComponent {
    static defaultProps = {
        ifMonitorView: false,
    };
    constructor(props) {
        super(props);
        this.state = {
            ifMonitorView: false,
            data: [],
            tabValue: '1',
        };
    }

    onTabChange = (v) => {
        this.setState({ tabValue: v });
    };

    render() {
        const { tabValue } = this.state;
        const { ifMonitorView = false, login } = this.props;
        const { userName } = login;
        return (
            <PageContainer showHeader={false}>
                {ifMonitorView ? (
                    <AlarmColTemplate login={login}></AlarmColTemplate>
                ) : (
                    <div
                        style={{
                            height: '100%',
                            display: tabValue === '1' ? 'flex' : 'inherit',
                            flexDirection: 'column',
                        }}
                    >
                        <Tabs onChange={this.onTabChange} type="card">
                            <TabPane tab="告警列表模板管理" key="1" />
                            <TabPane tab="告警查询列表模板管理" key="2" />
                        </Tabs>

                        {tabValue === '1' && (
                            <Card bordered={false} style={{ height: 'calc(100% - 38px)' }} bodyStyle={{ padding: 0, height: '100%' }}>
                                <AlarmColTemplate login={login}></AlarmColTemplate>
                            </Card>
                        )}
                        {tabValue === '2' && (
                            <Card bordered={false} style={{ height: '100%' }} bodyStyle={{ padding: 0, height: '100%' }}>
                                <QueryAlarmColTemplate userName={userName} userId={this.props.login.userId}></QueryAlarmColTemplate>
                            </Card>
                        )}
                    </div>
                )}
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
