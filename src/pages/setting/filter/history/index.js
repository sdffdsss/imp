import React, { PureComponent, Fragment } from 'react';
import { Icon, message, Modal, Tooltip, Table } from 'oss-ui';
import FilterInfo from '@Src/components/filter-info';
import { getCommonMsgWithSelectFilter } from '../utils';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import { getFilterHistory, rollbackHistory } from '../api';
import AuthButton from '@Src/components/auth-button';

class Index extends PureComponent {
    state = {
        visible: false,
        selectedFilter: {},
        data: [],
        selectedRowKeys: []
    };

    columns = [
        {
            title: Number(this.props.data.moduleId) === 1 ? `过滤器` : `规则名称`,
            dataIndex: 'filterName',
            render: (text) => {
                return text || '-';
            }
        },
        {
            title: '修改人',
            dataIndex: 'modifier',
            render: (text) => {
                return text || '-';
            }
        },
        {
            title: '修改时间',
            dataIndex: 'modifyTime',
            render: (text) => {
                return text || '-';
            }
        }
    ];

    /**
     * @description: 打开历史弹窗
     * @param {*}
     * @return {*}
     */

    checkHistory = async () => {
        const { data } = this.props;
        const msg = getCommonMsgWithSelectFilter(this.props.data.moduleId);

        if (!data || !data.filterId) {
            message.error(`请选择${msg}`);
            return;
        }

        this.setState({ visible: true });
        const params = {
            moduleId: data.moduleId,
            filterId: data.filterId
        };
        const res = await getFilterHistory(params);
        if (Array.isArray(res?.data) && res.data.length > 0) {
            this.setState({
                data: res.data,
                selectedRowKeys: [res.data[0].modifyTime],
                selectedFilter: res.data[0]
            });
        } else {
            message.warning('暂无可恢复的历史版本');
            this.setState({
                data: [],
                selectedRowKeys: [],
                selectedFilter: {}
            });
        }
    };

    /**
     * @description: 关闭历史弹窗
     * @param {*}
     * @return {*}
     */

    handleCancel = () => {
        this.setState({ visible: false });
    };

    /**
     * @description: 保存修改历史
     * @param {*}
     * @return {*}
     */

    handleOk = async () => {
        const {
            login: { userId },
            data
        } = this.props;

        const { selectedFilter } = this.state;
        if (selectedFilter && Object.keys(selectedFilter).length > 0) {
            const params = {
                createTime: selectedFilter.createTime,
                filterId: data.filterId,
                moduleId: selectedFilter.moduleId,
                modifier: userId,
                creator: userId
            };
            await rollbackHistory(params);
            this.setState({ visible: false }, () => {
                this.props.onFresh();
            });
        } else {
            message.error('没有可恢复的历史版本');
        }
    };

    /**
     * @description: 点击切换radio
     * @param {*}
     * @return {*}
     */

    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];
        // todo 由于数据原因 filterId存在重复，这块使用modifytimemodify作为key
        selectedRowKeys = rows.map((row) => {
            return row.modifyTime;
        });

        this.setState({
            selectedRowKeys,
            selectedFilter: rows[0]
        });
    };

    render() {
        const {
            iconMode,
            login: { container },
            moduleId,
            buttonKes
        } = this.props;
        const { visible, selectedFilter, data = {}, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };
        return (
            <Fragment>
                {iconMode ? (
                    <Tooltip title="查看历史">
                        <AuthButton onClick={this.checkHistory} authKey={buttonKes.history[moduleId]} type="text" style={{ padding: 0 }}>
                            <Icon antdIcon type="HistoryOutlined" />
                        </AuthButton>
                    </Tooltip>
                ) : (
                    <AuthButton onClick={this.checkHistory} authKey={buttonKes.history[moduleId]}>
                        <Icon antdIcon type="HistoryOutlined" />
                        历史
                    </AuthButton>
                )}
                <Modal
                    centered
                    title="历史管理"
                    width="70%"
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    visible={visible}
                    bodyStyle={{ height: '500px' }}
                    okText={'恢复'}
                    getContainer={container}
                >
                    <div style={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Table
                            rowKey="modifyTime"
                            rowSelection={rowSelection}
                            style={{ width: '40%' }}
                            scroll={{ y: 353 }}
                            columns={this.columns}
                            dataSource={data}
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        />
                        <div style={{ flex: 'auto', width: '60%' }}>
                            <FilterInfo data={selectedFilter} type="history" />
                        </div>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login
}))(Index);
