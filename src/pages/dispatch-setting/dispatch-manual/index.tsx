import React from 'react';
import { Tabs } from 'oss-ui';
import ManualDelivery from '../ManualDelivery';
// import useLoginInfoModel from '@Src/hox';

import '../style.less';

const { TabPane } = Tabs;
const DispatchSetting = () => {
    return (
        <div className="dispatch-setting-page" style={{ height: '100%' }}>
            <Tabs
                type="card"

                // onChange={this.tabChange}
            >
                <TabPane tab="故障派单" key="1">
                    <ManualDelivery configType={0} />
                </TabPane>
                <TabPane tab="高铁派单" key="2">
                    <ManualDelivery configType={1} />
                </TabPane>
            </Tabs>
        </div>
    );
};
export default DispatchSetting;
