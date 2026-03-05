import React, { useEffect, useRef } from 'react';
import WindowCard from './window-card';
// import useLoginInfoModel from '@Src/hox';
// import { getView } from './api';
import _isEmpty from 'lodash/isEmpty';
import './style.less';
const FaultDispathched = ({ viewData, onResultChange }) => {
    const contentRef: any = useRef();
    useEffect(() => {
        // getViewList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getCallBackChange = (e) => {
        if (e.changeEventWinInfoList) {
            const data = e.changeEventWinInfoList[0]?.alarmCountResult?.customCountIndex || {};
            onResultChange(data);
        }
    };
    return (
        <div className="fault-dispathched-page">
            <div className="fault-dispathched-page-window" ref={contentRef}>
                {!_isEmpty(viewData) && (
                    <WindowCard
                        // ref={windowCard}
                        selectedRows={viewData}
                        i={0}
                        contentWidth={contentRef?.current?.clientWidth}
                        windowType="duty"
                        defaultSize="default"
                        getCallBackData={(e) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            getCallBackChange(e);
                        }}
                        tabItem={1}
                        windowBar={'1'}
                    />
                )}
            </div>
        </div>
    );
};
export default FaultDispathched;
