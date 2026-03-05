import React, { PureComponent } from 'react';
import { Row, Col, Table, Space, Icon, Typography, Input, message, Tooltip, Modal } from 'oss-ui';
import Edit from './edit';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import './index.less';

export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editTemplateInfo: null,
            editVisible: false,
            type: 'create',
            smsTemplateList: _.cloneDeep(props.smsTemplateList),
            selectedTemplate: null,
            hrpFactSelectedRowData: {}
        };
        this.searhChange = _.debounce(this.searhChange, 400);
    }

    componentDidUpdate(prevProps) {
        const { smsTemplateList } = this.props;
        if (!_.isEqual(smsTemplateList, prevProps.smsTemplateList)) {
            // 当传入的type发生变化时，更新state
            this.setState({
                smsTemplateList
            });
        }
    }

    newClick = () => {
        this.setState({
            editVisible: true,
            editTemplateInfo: null,
            type: 'create'
        });
    };
    onClickRow = (record) => {
        return {
            onClick: () => {
                this.setState({
                    rowId: record.label,
                    selectedTemplate: record
                });
            }
        };
    };
    setRowClassName = (record) => {
        return record.label === this.state.rowId ? 'clickRowStyls' : '';
    };
    deleteItem = () => {
        const record = this.state.selectedTemplate;
        const slef = this.props;

        if (record) {
            Modal.confirm({
                title: '',
                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                content: '是否确认删除？',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                prefixCls: 'oss-ui-modal',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                onOk() {
                    let usrName = '';

                    if (slef.optionKey) {
                        usrName = slef.optionKey;
                    } else {
                        usrName = slef.login.userName;
                    }

                    request('alarmmodel/filter/v1/filter/smsTemplate', {
                        type: 'delete',
                        baseUrlType: 'filterUrl',
                        showSuccessMessage: false,
                        data: {
                            userName: usrName,

                            requestInfo: {
                                clientRequestId: 'nomean',
                                clientToken: localStorage.getItem('access_token')
                            },
                            templateName: record.label
                        }
                    })
                        .then(() => {
                            message.success('删除模板成功');
                            slef.reloadList();
                        })
                        .catch(() => {
                            message.error('删除模板失败');
                        });
                },
                onCancel() {}
            });
        } else {
            message.error('请选择模板进行删除');
        }
    };
    editItem = () => {
        const record = this.state.selectedTemplate;
        if (record) {
            this.setState({
                editVisible: true,
                editTemplateInfo: record,
                type: 'editItem'
            });
        } else {
            message.error('请选择模板进行编辑');
        }
    };
    onEditVisibleChange = (visible) => {
        this.setState({
            editVisible: visible
        });
    };
    searhChange = (e) => {
        let newArr = [];

        if (e.target.value) {
            newArr = this.props.smsTemplateList.filter((item) => item.label.includes(e.target.value));
        } else {
            newArr = this.props.smsTemplateList;
        }

        this.setState({
            smsTemplateList: _.cloneDeep(newArr)
        });
    };
    setSmsContentValue = (value) => {
        this.setState({
            selectedTemplate: { ...this.state.selectedTemplate, value }
        });
    };
    render() {
        const { editTemplateInfo, editVisible, selectedTemplate, smsTemplateList } = this.state;

        return (
            <>
                <Row gutter={16}>
                    <Col span={6}>
                        <Row justify="space-between">
                            <Col span={10}>
                                <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                    模板列表
                                </Typography.Title>
                            </Col>
                            <Col span={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography.Title style={{ fontSize: '15px', lineHeight: '24px' }} level={5}>
                                    <Space size="small">
                                        <Tooltip title="新增">
                                            <Icon onClick={this.newClick} type="iconxinjian1"></Icon>
                                        </Tooltip>
                                        <Tooltip title="编辑">
                                            <Icon onClick={this.editItem} type="iconbianji1"></Icon>
                                        </Tooltip>

                                        <Tooltip title="删除">
                                            <Icon
                                                onClick={this.deleteItem}
                                                type="icontrash"
                                                style={{ fontSize: 19, display: 'flex', alignItems: 'center' }}
                                            />
                                        </Tooltip>
                                    </Space>
                                </Typography.Title>
                            </Col>
                        </Row>
                        <div className="left-list-container">
                            <div className="left-list-container-search">
                                <Input
                                    placeholder="请输入列表名称查询"
                                    onChange={(e) => {
                                        e.persist();
                                        this.searhChange(e);
                                    }}
                                    suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }}></Icon>}
                                    style={{ width: 200, height: 28 }}
                                ></Input>
                            </div>
                            {smsTemplateList.length ? (
                                <Table
                                    className="left-list-container-table"
                                    size="small"
                                    showHeader={false}
                                    rowClassName={this.setRowClassName}
                                    columns={[
                                        {
                                            dataIndex: 'label',
                                            title: '名称',
                                            ellipsis: true
                                        }
                                    ]}
                                    dataSource={smsTemplateList}
                                    onRow={this.onClickRow}
                                    scroll={{ y: 250 }}
                                    pagination={false}
                                />
                            ) : null}
                        </div>
                    </Col>
                    <Col span={18}>
                        <Row justify="space-between">
                            <Col span={22}>
                                <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                    <span> 模板详情</span> <span className="color-item">（长度不超过600字）</span>
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Input.TextArea
                            disabled
                            value={selectedTemplate ? selectedTemplate.value : ''}
                            showCount
                            className="left-list-container-textarea"
                            maxLength={600}
                        />
                    </Col>
                </Row>
                {editVisible && (
                    <Edit
                        setSmsContentValue={this.setSmsContentValue}
                        optionKey={this.props.optionKey}
                        reloadList={this.props.reloadList}
                        type={this.state.type}
                        templateInfo={editTemplateInfo}
                        visible={editVisible}
                        onVisibleChange={this.onEditVisibleChange}
                        onValuesChange={this.props.onValuesChange}
                    />
                )}
            </>
        );
    }
}
