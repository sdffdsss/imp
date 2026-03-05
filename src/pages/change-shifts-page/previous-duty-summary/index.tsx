import React, { useEffect, useState } from 'react';
import { withModel } from 'hox';
import { Table, Button, message } from 'oss-ui';

import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import PageContainer from '@Components/page-container';
import { useHistory } from 'react-router-dom';
import GlobalMessage from '@Src/common/global-message';
import utils from './utils';
import api from '../api';
import './index.less';

/**
 * 交接班--上班次总结
 */
function PreviousDutySummary(props) {
    const history = useHistory();
    const [dataSource, setDataSource] = useState([]);
    // const { groupId, workShiftId, dateTime } = props.location.state;
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    let groupId = searchParams.get('groupId');
    let workShiftId = searchParams.get('workShiftId');
    let dateTime = searchParams.get('dateTime');
    const init = () => {
        api.getPreviousShiftSummaryData({ groupId, workShiftId, dateTime })
            .then((res) => {
                if (res.data) {
                    const { modules } = res.data;
                    const newData: any = [];
                    modules.forEach((module) => {
                        const { types, ...newModule } = module;
                        types.forEach((type) => {
                            newData.push({ ...newModule, ...type });
                        });
                    });
                    const dataToRowSpan: any = utils.convertDataToRowSpan(newData, 'moduleName');
                    setDataSource(dataToRowSpan);
                }
            })
            .catch((e) => {
                message.error(e);
            });
    };
    const watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on(
            'activeChanged',
            ({ isActive }) => {
                if (isActive) {
                    const { search: newSearch } = window.location;
                    const newSearchParams = new URLSearchParams(newSearch);
                    const newGroupId = newSearchParams.get('groupId');
                    const newWorkShiftId = newSearchParams.get('workShiftId');
                    const newDateTime = newSearchParams.get('dateTime');
                    if (newGroupId !== groupId || newWorkShiftId !== workShiftId || newDateTime !== dateTime) {
                        groupId = newGroupId;
                        workShiftId = newWorkShiftId;
                        dateTime = newDateTime;
                        init();
                    }
                }
            },
            null,
        );
    };
    useEffect(() => {
        watchTabActiveChange();
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 返回
    const goBack = () => {
        history.goBack();
    };

    return (
        <PageContainer
            title={<span className="previous-duty-summary-header-title">上班次总结</span>}
            extra={
                <>
                    {/* <Button onClick={goBack} style={{ marginLeft: 20 }}>
                        返回
                    </Button> */}
                </>
            }
        >
            <Table
                columns={utils.columns}
                dataSource={dataSource}
                bordered
                size="small"
                pagination={false}
                rowKey={(record) => `${record.moduleId}-${record.moduleTypeId}`}
            />
        </PageContainer>
    );
}

export default withModel([useLoginInfoModel, useEnvironmentModel], (sysInfo) => ({
    login: sysInfo[0],
    envConfig: sysInfo[1],
}))(PreviousDutySummary);
