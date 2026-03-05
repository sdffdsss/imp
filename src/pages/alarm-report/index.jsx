import React from 'react';
import { SimpleReport } from 'oss-simple-report';
import useLoginInfoModel from '../../hox';

import { withModel } from 'hox';
import constants from '../../common/constants';
import dataService from '../../common/services/dataService';
import request from '../../common/api';

const Index = (props) => {
    const version = 'unicom';
    const reportBasePath = constants.IMP_ALARM_REPORT;
    const reportid = new URLSearchParams(window.location.search).get('reportid') ?? false;
    const frameInfo = props?.login ?? null;
    console.log(props);
    return (
        <SimpleReport
            version={version}
            reportid={reportid}
            reportBasePath={reportBasePath}
            dataService={dataService}
            request={request}
            frameInfo={frameInfo}
        />
    );
};
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
