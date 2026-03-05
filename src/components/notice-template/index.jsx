import React, { PureComponent } from 'react';
import { Row, Col, Table, Space, Icon, Typography, Input, Popconfirm, message, Tooltip } from 'oss-ui';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import Edit from './edit';
import './index.less';

export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editTemplateInfo: null,
            editVisible: false,
            type: 'create',
            smsTemplateList: _.cloneDeep(props.templateList),
            selectedTemplate: null,
        };
        this.searchChange = _.debounce(this.searchChange, 400);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.templateList, prevProps.templateList)) {
            // 当传入的type发生变化时，更新state
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                smsTemplateList: this.props.templateList,
            });
        }
    }

    newClick = () => {
        this.setState({
            editVisible: true,
            editTemplateInfo: null,
            type: 'create',
        });
    };
    onClickRow = (record) => {
        return {
            onClick: () => {
                this.setState({
                    rowId: record.label,
                    selectedTemplate: record,
                });
            },
        };
    };
    setRowClassName = (record) => {
        return record.label === this.state.rowId ? 'clickRowStyls' : '';
    };
    deleteItem = () => {
        const record = this.state.selectedTemplate;
        if (record) {
            if (record.canDelete) {
                request(`faultReport/deleteTemplate?faultDistinctionType=${this.props.isWireless ? 2 : 1}`, {
                    type: 'post',
                    baseUrlType: 'fault',
                    showSuccessMessage: false,
                    data: [record.templateId],
                })
                    .then(() => {
                        message.success('删除模板成功');
                        this.props.reloadList().then((res) => {
                            console.log(res, 'res');
                            // this.setState({
                            //     selectedTemplate: { ...this.state.selectedTemplate, value },
                            // });
                            const firstItem = res.data[0] || {};
                            this.setState({
                                rowId: firstItem.templateName,
                                selectedTemplate: {
                                    ...firstItem,
                                    label: firstItem.templateName,
                                    value: firstItem.templateId,
                                },
                            });
                        });
                    })
                    .catch(() => {
                        // message.error('删除模板失败');
                    });
            } else {
                message.error('该模板不可删除');
            }
            // console.log(this.props.login, '删除');
        } else {
            message.error('请选择模板进行删除');
        }
    };
    editItem = () => {
        const record = this.state.selectedTemplate;
        if (record) {
            if (record.canEdit) {
                this.setState({
                    editVisible: true,
                    editTemplateInfo: record,
                    type: 'editItem',
                });
            } else {
                message.error('该模板不可编辑');
            }
        } else {
            message.error('请选择模板进行编辑');
        }
    };
    onEditVisibleChange = (visible) => {
        this.setState({
            editVisible: visible,
        });
    };
    searchChange = (e) => {
        let newArr = [];

        if (e.target.value) {
            newArr = this.props.templateList.filter((item) => item.label.includes(e.target.value));
        } else {
            newArr = this.props.templateList;
        }

        this.setState({
            smsTemplateList: _.cloneDeep(newArr),
        });
    };
    setSmsContentValue = (value) => {
        this.setState({
            // eslint-disable-next-line react/no-access-state-in-setstate
            selectedTemplate: { ...this.state.selectedTemplate, templateContent: value },
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
                                            <Icon onClick={this.newClick} type="iconxinjian1" />
                                        </Tooltip>
                                        <Tooltip title="编辑">
                                            <Icon onClick={this.editItem} type="iconbianji1" />
                                        </Tooltip>
                                        <Popconfirm
                                            title="确定删除该模板?"
                                            onConfirm={this.deleteItem}
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                        >
                                            <Tooltip title="删除">
                                                <Icon type="icontrash" style={{ fontSize: 19, display: 'flex', alignItems: 'center' }} />
                                            </Tooltip>
                                        </Popconfirm>
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
                                        this.searchChange(e);
                                    }}
                                    suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }} />}
                                    style={{ width: 200, height: 28 }}
                                />
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
                                            ellipsis: true,
                                        },
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
                            // rows={10}
                            disabled
                            value={selectedTemplate ? selectedTemplate.templateContent : ''}
                            showCount
                            className="left-list-container-textarea"
                            maxLength={600}
                        />
                    </Col>
                </Row>
                {editVisible && (
                    <Edit
                        setSmsContentValue={this.setSmsContentValue}
                        reloadList={this.props.reloadList}
                        type={this.state.type}
                        templateInfo={editTemplateInfo}
                        visible={editVisible}
                        onVisibleChange={this.onEditVisibleChange}
                        provinceId={this.props.provinceId}
                        noticeTemplateAddClassName={this.props.noticeTemplateAddClassName}
                        isWireless={this.props.isWireless}
                        templateType={this.props.templateType}
                    />
                )}
            </>
        );
    }
}
