import React, { useState, useEffect } from 'react';
import Tab from './tab';
import { _ } from 'oss-web-toolkits';
import RightWindow from './right-window';

const Index = (props) => {
    const { userInfo, groupData, theme, currentGroup } = props;
    const [currentTab, hanldeCurrentTab] = useState(1);
    let countNum = {
        'sheet_status_2-3': {},
        sheet_status_2: {},
        sheet_status_3: {}
    };
    let countNumFirst = {
        first: {}
    };
    const [alarmCountNum, handleAlarmCountNum] = useState(countNum);
    const [alarmCountNumFilter, handleAlarmCountNumFilter] = useState(countNum);
    const [tabItem, setTabItem] = useState(null);
    const getCurrentTab = (e) => {
        hanldeCurrentTab(e);
    };

    const getCallBackData = (e, type) => {
        if (e && Array.isArray(e.changeEventWinInfoList)) {
            if (_.isEqual(e.changeEventWinInfoList[0]?.alarmCountResult.customCountIndex, alarmCountNum[type])) {
                return;
            }
            const newNum = _.cloneDeep(countNumFirst);
            newNum.first = e.changeEventWinInfoList[0]?.alarmCountResult.customCountIndex || {};
            // if (e.statisticsTreeList) {
            //     e.statisticsTreeList.forEach((item) => {
            //         newNum[item.statisticsFieldName] = item;
            //     });
            // }
            handleAlarmCountNum(newNum);
        }
    };
    const getCallBackDataFilter = (e) => {
        if (e && Array.isArray(e.statisticsTreeList)) {
            // if (_.isEqual(e.changeEventWinInfoList[0]?.alarmCountResult.customCountIndex, alarmCountNum[type])) {
            //     return;
            // }
            const newNum = _.cloneDeep(countNum);
            e.statisticsTreeList.forEach((item) => {
                newNum[item.statisticsFieldName] = item;
            });
            // console.log(newNum);
            handleAlarmCountNumFilter(newNum);
        }
    };
    const handleCurrentTabs = (item) => {
        // console.log(item);
        setTabItem(item);
    };
    return (
        <div className="window-view oss-imp-alart-common-bg" >
            <div className="header">故障跟踪</div>
            <div className="window-container">
                <div className="left-tabs">
                    <Tab
                        currentTab={getCurrentTab}
                        handleCurrentTabs={handleCurrentTabs}
                        alarmCountNum={alarmCountNum}
                        alarmCountNumFilter={alarmCountNumFilter}
                        theme={theme}
                    />
                </div>
                <div className="right-windows">
                    <RightWindow
                        userInfo={userInfo}
                        currentTab={currentTab}
                        getCallBackData={getCallBackData}
                        getCallBackDataFilter={getCallBackDataFilter}
                        groupData={groupData}
                        currentGroup={currentGroup}
                        tabItem={tabItem}
                    />
                </div>
            </div>
        </div>
    );
};
export default Index;
