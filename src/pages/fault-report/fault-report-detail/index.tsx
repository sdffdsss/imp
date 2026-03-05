import React from 'react';
import PageContainer from '@Components/page-container';
import { Button } from 'oss-ui';
import { useHistory, useLocation } from 'react-router-dom';
import constants from '@Src/common/constants';
import NewFaultReportDetailContent from './NewFaultReportDetailContent';
import './index.less';

const FaultReportDetail = () => {
    const history = useHistory();
    const memoryLocation = useLocation();
    const globalLocation = window.location;
    const memorySearchParamsIns = new URLSearchParams(memoryLocation.search);
    const globalSearchParamsIns = new URLSearchParams(globalLocation.search);
    const flagId = memorySearchParamsIns.get('flagId') || globalSearchParamsIns.get('flagId');
    const isMajor = memorySearchParamsIns.get('isMajor') === 'true' || globalSearchParamsIns.get('isMajor') === 'true';
    const faultReportStatus = memorySearchParamsIns.get('faultReportStatus') || globalSearchParamsIns.get('faultReportStatus');
    const standardAlarmId = memorySearchParamsIns.get('standardAlarmId') || globalSearchParamsIns.get('standardAlarmId');

    const goBack = () => {
        if (!isMajor) {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report`);
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/major-fault-report?activeKey=5`);
        }
    };

    return (
        <PageContainer title={<span className="fault-report-detail-header-title">查看</span>}>
            <NewFaultReportDetailContent
                flagId={flagId}
                faultReportStatus={faultReportStatus}
                standardAlarmId={standardAlarmId && standardAlarmId !== 'null' ? standardAlarmId : ''}
                isMajor={isMajor}
            />
            <div className="fault-report-detail-back">
                <Button onClick={goBack}>取消</Button>
            </div>
        </PageContainer>
    );
};

export default FaultReportDetail;
