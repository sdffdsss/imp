import React from 'react';
import { Tabs } from 'oss-ui';
import DispatchNew from './dispatch-auto';
import ManualDelivery from './ManualDelivery';
// import useLoginInfoModel from '@Src/hox';
import './style.less';

const { TabPane } = Tabs;
const DispatchSetting = () => {
    // const login = useLoginInfoModel();
    // const { setUserName, setUserId, setIsAdmin, setUserInfo, setLoginId } = login;
    // useEffect(() => {
    //     setUserName('Admin');
    //     setUserId('0');
    //     setLoginId('admin');
    //     setIsAdmin(true);
    //     setUserInfo(JSON.stringify({ userId: '0', userName: 'Admin', loginId: 'admin', zones: [{ zoneId: '0', zoneLevel: '1' }] }));
    // }, []);
    return (
        <div className="dispatch-setting-page" style={{ height: '100%' }}>
            <Tabs
                type="card"

                // onChange={this.tabChange}
            >
                <TabPane tab="自动派单配置" key="1">
                    <DispatchNew />
                </TabPane>
                <TabPane tab="手动派单配置" key="2">
                    <ManualDelivery />
                </TabPane>
            </Tabs>
        </div>
    );
};
export default DispatchSetting;
