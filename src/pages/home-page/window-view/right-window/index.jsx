import React, { useEffect, useState, useRef } from 'react';
import WindowCard from '../window-wrapper';
import { _ } from 'oss-web-toolkits';
import { getDefaultViews } from '../../api';

const Index = (props) => {
    const { currentTab, getCallBackData, currentGroup, getCallBackDataFilter, tabItem } = props;
    const [windowData, handleWindowData] = useState({});
    const windowCard = useRef(null);
    // const { systemInfo, userId } = userInfo;
    const getView = async () => {
        // const zoneId = systemInfo.currentZone?.zoneId;
        const groupId = currentGroup[0]?.groupId;
        if (!groupId) {
            return;
        }
        const res = await getDefaultViews(groupId);
        let newData = {};
        let ids = [];
        let names = [];
        if (res && res.data && Array.isArray(res.data)) {
            res.data.forEach((item) => {
                ids = [...ids, ...item.filterIdList?.split(',')];
                names = [...names, ...item.filterNameList?.split(',')];
            });
        }
        newData.filterIdList = _.union(ids)?.toString() || '';
        newData.filterNameList = _.union(names)?.toString() || '';
        newData.colDispTemplet = res.data[0]?.colDispTemplet || 0;
        newData.statusDispTemplet = res.data[0]?.statusDispTemplet || 0;
        newData.windowId = res.data[0]?.windowId || 0;
        newData.windowName = res.data[0]?.windowName || '';
        handleWindowData(newData);
    };
    useEffect(() => {
        getView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGroup]);
    return (
        <div style={{ height: '100%' }}>
            {windowData.filterIdList ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div
                        style={{
                            visibility: currentTab === 1 ? 'visible' : 'hidden',
                            height: '100%',
                            position: 'absolute',
                            width: '100%',
                        }}
                    >
                        <WindowCard
                            selectedRows={[{ ...windowData }]}
                            i={0}
                            windowType="duty"
                            getCallBackData={(e) => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                getCallBackData && getCallBackData(e, 'first');
                            }}
                            windowBar={'1'}
                        />
                    </div>
                    <div
                        style={{
                            visibility: currentTab === 2 || currentTab === 3 || currentTab === 4 ? 'visible' : 'hidden',
                            height: '100%',
                            position: 'absolute',
                            width: '100%',
                        }}
                        className="hide-status"
                    >
                        <WindowCard
                            ref={windowCard}
                            selectedRows={[{ ...windowData, colDispTemplet: 1136595618 }]}
                            i={0}
                            windowType="duty"
                            getCallBackData={(e) => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                getCallBackDataFilter && getCallBackDataFilter(e);
                            }}
                            windowBar={'1'}
                            defaultSize="default"
                            tabItem={tabItem}
                            // defaultSecondaryFilter={{
                            //     logicalAnd: true,
                            //     conditionList: [
                            //         {
                            //             operator: 'in',
                            //             fieldName: 'sheet_status',
                            //             value: ['2', '3'],
                            //             not: false
                            //         }
                            //     ],
                            //     not: false
                            // }}
                        />
                    </div>
                    {/*
                    <div
                        style={{
                            visibility: currentTab === 3 ? 'visible' : 'hidden',
                            height: '100%',
                            position: 'absolute',
                            width: '100%'
                        }}
                        className="hide-status"
                    >
                        <WindowCard
                            selectedRows={[{ ...windowData, colDispTemplet: 1136595618 }]}
                            i={0}
                            windowType="duty"
                            defaultSize="default"
                            windowBar={'1'}
                            getCallBackData={(e) => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                getCallBackData && getCallBackData(e, 'third');
                            }}
                            customFilterHandle={false}
                            defaultSecondaryFilter={{
                                logicalAnd: true,
                                conditionList: [
                                    {
                                        operator: 'in',
                                        fieldName: 'sheet_status',
                                        value: ['2'],
                                        not: false
                                    }
                                ],
                                not: false
                            }}
                        />
                    </div> */}
                    {/* <div
                        style={{
                            visibility: currentTab === 4 ? 'visible' : 'hidden',
                            height: '100%',
                            position: 'absolute',
                            width: '100%'
                        }}
                        className="hide-status"
                    >
                        <WindowCard
                            selectedRows={[{ ...windowData, colDispTemplet: 1136595618 }]}
                            i={0}
                            windowType="duty"
                            defaultSize="default"
                            windowBar={'1'}
                            getCallBackData={(e) => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                getCallBackData && getCallBackData(e, 'fourth');
                            }}
                            customFilterHandle={false}
                            defaultSecondaryFilter={{
                                logicalAnd: true,
                                conditionList: [
                                    {
                                        operator: 'in',
                                        fieldName: 'sheet_status',
                                        value: ['3'],
                                        not: false
                                    }
                                ],
                                not: false
                            }}
                        />
                    </div> */}
                </div>
            ) : (
                currentTab
            )}
        </div>
    );
};

export default Index;
