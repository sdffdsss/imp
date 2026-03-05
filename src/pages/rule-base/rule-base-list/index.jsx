import React, { Fragment } from 'react';
import { withModel } from 'hox';
import { Space, Tooltip, Icon, Modal, Button } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import request from '@Src/common/api';
import RuleDetail from '../../auto-sheet-rule/edit';
import { logNew } from '@Common/api/service/log';
import constants from '@Src/common/constants';

class RuleBaselist extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '序号',
                    dataIndex: 'xh',
                    align: 'center',
                    width: 80,
                    hideInSearch: true,
                    ellipsis: true,
                    render: (text, record, index) => {
                        return index + 1;
                    },
                },
                {
                    title: '规则名称',
                    dataIndex: 'filterName',
                    align: 'center',
                    width: 200,
                    hideInSearch: true,

                    render: (text, record) => {
                        return (
                            <div
                                onClick={this.viewSheetClick.bind(this, record)}
                                title={text}
                                style={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    ellipsis: true,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: '#1677ff',
                                }}
                            >
                                {text}
                            </div>
                        );
                    },
                },
                {
                    title: '省份',
                    dataIndex: 'provinceName',
                    align: 'center',
                    width: 100,
                    hideInSearch: true,
                    ellipsis: true,
                },
                {
                    title: '类型',
                    dataIndex: 'ruleTypeDesc',
                    align: 'center',
                    width: 100,
                    hideInSearch: true,
                    ellipsis: true,
                },
                {
                    title: '引用次数',
                    dataIndex: 'citations',
                    align: 'center',
                    width: 100,
                    hideInSearch: true,
                    ellipsis: true,
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 200,
                    hideInSearch: true,
                    ellipsis: true,
                    render: (text) => {
                        return moment(text).format('YYYY-MM-DD HH:mm:ss');
                    },
                },
                {
                    title: '创建人',
                    dataIndex: 'creatorName',
                    align: 'center',
                    width: 100,
                    hideInSearch: true,
                    ellipsis: true,
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'actions',
                    fixed: 'right',
                    width: '120px',
                    align: 'center',
                    render: (text, row) => {
                        const { type, login } = this.props;
                        const userInFo = JSON.parse(this.props.login.userInfo);
                        return [
                            <Space>
                                <Tooltip title="引用">
                                    <Icon key="1" antdIcon={true} type="ShareAltOutlined" onClick={this.editFilterClick.bind(this, row)} />
                                </Tooltip>
                                <Tooltip title="查看">
                                    <Icon key="2" antdIcon={true} type="SearchOutlined" onClick={this.viewSheetClick.bind(this, row)} />
                                </Tooltip>
                                {userInFo.isAdmin &&
                                    type === 'details' &&
                                    row.provinceId ===
                                        Number.parseInt(this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo)) && (
                                        <Tooltip title="删除">
                                            <Icon key="3" antdIcon={true} type="DeleteOutlined" onClick={this.delRowClickGroup.bind(this, row)} />
                                        </Tooltip>
                                    )}
                            </Space>,
                        ];
                    },
                },
            ],
            viewSheetId: '',
            viewModalTitle: '',
            viewModalVisible: false,
        };
    }

    componentDidMount() {}

    // 新建/编辑/拷贝跳转
    editFilterClick = (row) => {
        logNew(`规则引用`, '500175');
        //this.props?.history.push({ pathname: '/auto-sheet-rule/new/10/new/list', state: { row: row, type: 'ruleBase' } });
        this.props?.history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/edit/10/${row.filterId}/list`,
            state: { row: row, type: 'ruleBase' },
        });
    };

    /**
     * @description: 删除规则库
     * @param {*}
     * @return {*}
     */

    delRowClickGroup = (row) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认删除规则库？',
            onOk: () => {
                this.delRowClick(row);
            },
            onCancel() {},
        });
    };

    // 删除
    delRowClick = (row) => {
        request('rule/base/v1/removeRuleBase', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '删除规则失败',
            data: {
                ruleId: row.ruleId,
            },
        }).then((res) => {
            if (res && res.code === 200) {
                this.props.getRuleBase();
            }
        });
    };

    onPageChange = (page, pageSize) => {
        this.props.onPageChange(page, pageSize);
    };

    /**
     * @description: 查看
     * @param n*o
     * @return n*o
     */

    viewSheetClick = (record) => {
        logNew(`规则查看`, '500176');

        // console.log(record, type);
        this.setState(
            {
                viewSheetId: record.filterId,
                viewModalTitle: record.filterName,
            },
            () => {
                this.setState({
                    viewModalVisible: true,
                });
            },
        );
    };

    onModalCancel = () => {
        this.setState({
            viewModalVisible: false,
        });
    };

    renderModal = () => {
        const { viewSheetId } = this.state;
        return (
            <div>
                <RuleDetail
                    match={{
                        params: {
                            type: 'edit',
                            moduleId: 10,
                            id: viewSheetId,
                            isCheck: true,
                            pageType: 'ruleBase',
                        },
                    }}
                />
            </div>
        );
    };

    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    render() {
        const { columns, viewModalTitle, viewModalVisible } = this.state;
        const { dataSource, pagination } = this.props;
        return (
            <Fragment>
                <VirtualTable
                    rowKey="rosterIntId"
                    global={window}
                    columns={columns}
                    dataSource={dataSource}
                    onChange={this.onPageChange}
                    onReset={false}
                    pagination={pagination}
                    bordered
                    dateFormatter="string"
                    options={false}
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    search={false}
                />
                <Modal
                    destroyOnClose
                    title={viewModalTitle}
                    width={1200}
                    visible={viewModalVisible}
                    onCancel={this.onModalCancel}
                    footer={
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                type="default"
                                onClick={() => {
                                    this.onModalCancel();
                                }}
                            >
                                取消
                            </Button>
                        </div>
                    }
                >
                    {this.renderModal()}
                </Modal>
            </Fragment>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(RuleBaselist);
