import React, { forwardRef } from 'react';
import MyCenter from './my-center';
import Tools from './tools';
import Notice from './notice';
import './index.less';

const Index = (props, ref) => {
    const { loginInfo, isManagementButtonVisible = false, location, onModuleModify = () => {}, onGroupChange } = props;

    return (
        <div className="workbench-common-top-info-wrapper">
            <div className="top-box-item left oss-imp-alart-common-bg">
                <MyCenter ref={ref} loginInfo={loginInfo} onGroupChange={onGroupChange} />
            </div>
            <div className="top-box-item center">
                <Tools loginInfo={loginInfo} />
            </div>
            <div className="top-box-item right">
                <Notice
                    theme={loginInfo.systemInfo.theme}
                    location={location}
                    onModuleModify={onModuleModify}
                    isManagementButtonVisible={isManagementButtonVisible}
                />
            </div>
        </div>
    );
};
export default forwardRef(Index);
