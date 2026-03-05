/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Button, Tabs } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './style.less';
import { monitorApi } from '@Common/api/service/monitorApi';
import Sending from './sending';
import Sent from './sent';
import Draft from './draft';
import { logNew } from '@Common/api/service/log';
import urlSearch from '@Common/utils/urlSearch';
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.actionRef = React.createRef();
        this.state = {
            activeKey: '1',
            editId: '',
            userId: '',
            zoneId: '',
            operId: '',
        };
        this.zoneLevelEnums = {
            1: 'country',
            2: 'province',
            3: 'city',
            4: 'district',
            5: 'area',
        };
    }
    componentDidMount() {
        const { srcString } = useLoginInfoModel.data;
        const urlData = urlSearch(srcString);
        if (urlData.operId) {
            this.setState({
                operId: urlData.operId,
            });
        }
        this.getLoginUserInfo();
    }
    /**
     * @description: 获取当前登陆用户角色问题
     * @param {*}
     * @return {*}
     */
    getLoginUserInfo = async () => {
        const {
            login: { userId, systemInfo, userInfo },
        } = this.props;
        const { zones } = JSON.parse(userInfo);
        let zoneId = '';
        if (systemInfo?.currentZone?.zoneId) {
            zoneId = systemInfo.currentZone.zoneId;
            this.setState({ userId, zoneId });
        } else {
            this.setState({ userId, zoneId: zones[0].zoneId });
        }
    };
    componentWillUnmount() {}
    onTabClick = (key) => {
        if (this.state.operId) {
            logNew('短信/彩信', this.state.operId);
        } else {
            logNew('监控工作台短信/彩信', '300003');
        }
        this.setState({ activeKey: key }, () => {});
    };
    reSendSms = (editId) => {
        this.setState({ activeKey: '1', editId });
    };
    handleReset = (editId) => {
        this.setState({ editId });
    };
    render() {
        const { TabPane } = Tabs;
        const { activeKey, editId, userId, zoneId } = this.state;
        return (
            <div className="send-sms">
                <Tabs className="send-sms-tabs" tabBarGutter={20} size="large" type="card" activeKey={activeKey} onTabClick={this.onTabClick}>
                    <TabPane
                        tab={
                            <span>
                                <span style={{ marginRight: 5 }}>{'短信发送'}</span>
                            </span>
                        }
                        key={1}
                    >
                        <Sending userId={userId} zoneId={zoneId} editId={editId} handleReset={this.handleReset} />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <span style={{ marginRight: 5 }}>{'已发送记录'}</span>
                            </span>
                        }
                        key={2}
                    >
                        <Sent userId={userId} zoneId={zoneId} reSendSms={this.reSendSms} />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <span style={{ marginRight: 5 }}>{'草稿'}</span>
                            </span>
                        }
                        key={3}
                    >
                        <Draft userId={userId} zoneId={zoneId} reSendSms={this.reSendSms} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
