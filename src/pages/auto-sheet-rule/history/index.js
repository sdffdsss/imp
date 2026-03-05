import React, { PureComponent, Fragment } from 'react';
import { Button, Icon, message, Modal, Tooltip, Table } from 'oss-ui';
import FilterInfo from '@Src/components/filter-info';
import request from '@Src/common/api';
import { _ } from 'oss-web-toolkits';
import { getCommonMsgWithSelectFilter } from '../utils';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import { customAlphabet } from 'nanoid';
import AuthButton from '@Src/components/auth-button';

class Index extends PureComponent {
    state = {
        visible: false,
        selectedFilter: {},
        data: [],
        rowKey: null,
        selectedRowKeys: [],
    };

    columns = [
        {
            title: Number(this.props.data.moduleId) === 1 ? `过滤器` : `规则名称`,
            dataIndex: 'filterName',
        },
        {
            title: '修改人',
            dataIndex: 'modifier',
            render: (text) => {
                return text || '-';
            },
        },
        {
            title: '修改时间',
            dataIndex: 'modifyTime',
            render: (text) => {
                return text || '-';
            },
        },
    ];

    checkHistory = () => {
        const { data } = this.props;
        const msg = getCommonMsgWithSelectFilter(this.props.data.moduleId);

        if (!data || !data.filterId) {
            message.error(`请选择${msg}`);
            return;
        }

        this.setState({ visible: true });

        request('alarmmodel/filter/v1/filter/history', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '读取历史版本失败',
            data: {
                // TODO: 调试用数据
                moduleId: data.moduleId,
                modelId: 2,
                filterId: data.filterId,
            },
        }).then((res) => {
            if (_.get(res, 'data', []).length) {
                const nanoid = customAlphabet('1234567890', 15);
                const selectedKey = [];
                const dataList = res.data.map((item, index) => {
                    const key = nanoid();
                    if (index === 0) {
                        selectedKey.push(key);
                    }
                    return {
                        ...item,
                        key,
                    };
                });
                this.setState({
                    // data: res.data,
                    // selectedRowKeys: [res.data[0].modifyTime],
                    // selectedFilter: res.data[0]
                    data: dataList,
                    selectedRowKeys: selectedKey,
                    selectedFilter: dataList[0],
                });
            }
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleOk = () => {
        const {
            login: { userId },
            data,
        } = this.props;
        // console.log(userId);
        const { selectedFilter } = this.state;
        if (selectedFilter && Object.keys(selectedFilter).length > 0) {
            request('alarmmodel/filter/v1/filter/rollback', {
                type: 'post',
                baseUrlType: 'filterUrl',
                defaultSuccessMessage: '恢复历史版本成功',
                defaultErrorMessage: '恢复历史版本失败',
                data: {
                    clientRequestInfo: JSON.stringify({
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token'),
                    }),
                    createTime: selectedFilter.createTime,
                    filterId: data.filterId,
                    modelId: 2,
                    moduleId: selectedFilter.moduleId,
                    modifier: userId,
                    creator: userId,
                    requestInfo: {
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token'),
                    },
                },
            }).then(() => {
                this.setState({ visible: false }, () => {
                    this.props.onFresh();
                });
            });
        } else {
            message.error('没有可恢复的历史版本');
        }
    };

    /**
     * radio change
     */
    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];

        selectedRowKeys = rows.map((row) => {
            // return row.modifyTime;
            return row.key;
        });

        this.setState({
            selectedRowKeys,
            selectedFilter: rows[0],
        });
    };
    getAuthKey = () => {
        // const { data } = this.props;
        // switch (+data.moduleId) {
        //     case 604:
        //         return 'crhSheetRuleManage:history';
        //     case 605:
        //         return 'superviseSheetRuleManage:history';
        //     default:
        //     }
        return 'sheetRuleManage:history';
    };
    render() {
        const {
            iconMode,
            login: { container },
        } = this.props;
        const { visible, selectedFilter, data = {}, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio',
        };
        const authKey = this.getAuthKey();
        return (
            <Fragment>
                {iconMode ? (
                    <Tooltip title="查看历史">
                        <AuthButton onClick={this.checkHistory} authKey={authKey} type="text" style={{ padding: 0 }}>
                            <Icon antdIcon type="HistoryOutlined" />
                        </AuthButton>
                    </Tooltip>
                ) : (
                    <AuthButton onClick={this.checkHistory} authKey={authKey}>
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
                            rowKey="key"
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
    login,
}))(Index);
