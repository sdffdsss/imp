import React from 'react';
import { VirtualTable } from 'oss-web-common';
import { Card, Button } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { withRouter } from 'react-router';
import { filterApi } from '../../../../common/api/service/filterApi';
import { monitor } from '../../../../common/api/service/monitor';
import constants from '@Common/constants';

const REFRESH_TIME = 10000;
class ViewContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.actionRef = React.createRef();
        this.state = {
            monitorId: this.props.match.params.id,
            moduleId: this.props.match.params.moduleId,
            columns: [
                {
                    title: '监测时间',
                    dataIndex: 'monitorTime',
                    align: 'center',
                    hideInSearch: true,
                },
                {
                    title: '监测状态',
                    dataIndex: 'businessStatus',
                    align: 'center',
                    hideInSearch: true,
                    render: (text) => (text === 1 ? '正常' : '异常'),
                },
                {
                    title: '描述',
                    dataIndex: 'logContent',
                    align: 'center',
                    hideInSearch: true,
                },
            ],
        };
    }
    refreshTimer = null;

    componentDidMount() {
        this.refreshData();
    }

    componentWillUnmount() {
        clearTimeout(this.refreshTimer);
    }

    refreshData = () => {
        this.actionRef.current.reload();
        this.refreshTimer = setTimeout(() => {
            this.refreshData();
        }, REFRESH_TIME);
    };

    handleCancel = () => {
        this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-interrupt-monitor/${this.state.moduleId}`);
    };

    getViewData = async (params) => {
        const res = await monitor.getMonitorLogs({
            current: params.current,
            pageSize: params.pageSize,
            monitorId: Number(this.state.monitorId),
        });
        const { total, data } = res;
        return {
            data,
            total,
            success: true,
        };
    };

    render() {
        const { columns } = this.state;
        return (
            <Card bodyStyle={{ height: '100%', overflow: 'auto' }} style={{ height: '100%' }}>
                <div style={{ height: `calc(100% - 60px)` }}>
                    <VirtualTable
                        global={window}
                        columns={columns}
                        actionRef={this.actionRef}
                        request={this.getViewData}
                        x={'100%'}
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        borderd="true"
                        search={false}
                        toolBarRender={false}
                    />
                </div>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <Button type="primary" onClick={this.handleCancel}>
                        关闭
                    </Button>
                </div>
            </Card>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(withRouter(ViewContent));
