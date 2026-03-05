/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Tabs, Form, Row, Col, Input, Switch, Space, Icon, Tooltip, Button, message, Popconfirm, Select, DatePicker } from 'oss-ui';
import PageContainer from '@Components/page-container';
import { VirtualTable } from 'oss-web-common';
import GroupTree from './groupTree';
import UserTree from './userTree';
import request from '@Src/common/api';
import moment from 'moment';
// import { textChangeRangeIsUnchanged } from 'typescript';
import { logNew } from '@Common/api/service/log';
import useLoginInfoModel from '@Src/hox';
import urlSearch from '@Common/utils/urlSearch';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import './style.less';
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            key: 1,
            groupData: [],
            treeList: [],
            groupKeys: [],
            editId: '',
            userId: '',
            zoneId: '',
            reset: false,
            operId: '',
        };
        this.columns = [
            {
                title: '姓名',
                dataIndex: 'zhName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '部门',
                dataIndex: 'deptName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '手机号',
                dataIndex: 'mobilephone',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'action',
                hideInSearch: true,
                fixed: 'right',
                width: 60,
                align: 'center',
                render: (text, row) => {
                    return (
                        <Space>
                            {/* <Tooltip title="编辑">
                                <Icon type="EditOutlined" antdIcon onClick={this.showEditModal.bind(this, editEnumType.EDIT, row)} />
                            </Tooltip> */}
                            <Popconfirm
                                title="确认删除此条记录吗?"
                                onConfirm={this.deleteGroupHandler.bind(this, row)}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Tooltip title="删除">
                                    <Icon type="DeleteOutlined" antdIcon />
                                </Tooltip>
                            </Popconfirm>
                            {/* <Tooltip title="查看" trigger={['hover', 'click']}>
                                <Icon type="SearchOutlined" antdIcon onClick={this.showEditModal.bind(this, editEnumType.READ, row)} />
                            </Tooltip> */}
                        </Space>
                    );
                },
            },
        ];
        this.scrollX = this.columns.reduce((total, item) => {
            return total + item.width;
        });
    }
    componentDidMount() {
        const { srcString } = useLoginInfoModel.data;
        const urlData = urlSearch(srcString);
        if (urlData.operId) {
            this.setState({
                operId: urlData.operId,
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.editId !== prevProps.editId && this.props.editId !== '') {
            this.setState(
                {
                    editId: this.props.editId,
                },
                () => {
                    this.handleSmsInfo();
                },
            );
        }
        if (this.props.zoneId !== prevProps.zoneId) {
            this.setState({
                userId: this.props.userId,
                zoneId: this.props.zoneId,
            });
        }
    }
    handleSmsInfo = (type) => {
        const { editId } = this.state;
        const query = this.formRef.current.getFieldsValue();
        request('manualShortNote/queryOneDetail', {
            type: 'get',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            data: {
                id: editId,
            },
        }).then((res) => {
            if (res && res.code === 200) {
                const data = res.data;
                this.formRef.current.setFieldsValue({
                    isTimedTask: data.isTimedTask === 1 ? true : false,
                    smsContent: data.smsContent,
                    handMobile: data.handMobile,
                    sendDate: data.isTimedTask === 1 && moment(data.sendDate) > moment() ? moment(data.sendDate) : false,
                });
                this.setState({ treeList: data.userDtos, groupKeys: data.userDtos.map((item) => item.userId) });
            } else {
                message.error(res.message);
            }
        });
    };
    componentWillUnmount() {}
    onTabClick = (key) => {
        this.setState({ key }, () => {});
    };
    handleReset = () => {
        const { reset } = this.state;
        this.formRef.current.setFieldsValue({
            isTimedTask: 0,
            smsContent: '',
            handMobile: '',
            sendDate: '',
        });
        this.setState({ treeList: [], groupKeys: [], editId: '', reset: !reset });
        this.props.handleReset('');
    };
    handleSendOrDraft = (type) => {
        const { treeList, editId } = this.state;
        const query = this.formRef.current.getFieldsValue();
        const parmData = {
            smsContent: query.smsContent,
            operator: this.props.userId,
            regionId: this.props.zoneId,
            // id: editId === '' ? undefined : editId,
            isTimedTask: query.isTimedTask ? 1 : 0,
            handMobile: query.handMobile,
            tableMobile: treeList
                .map((item) => {
                    return item.mobilephone;
                })
                .join(','),
            sendDate: moment(query.sendDate).format('YYYY-MM-DD HH:mm:ss'),
            shortNoteType: type,
        };
        if (query.isTimedTask && !query.sendDate) {
            message.error('请定义定时发送时间');
            return;
        }
        if (query.isTimedTask && moment(query.sendDate) < moment()) {
            message.error('定时发送时间已过,请重新定义时间');
            return;
        }
        if (!parmData.smsContent || (!parmData.handMobile && !parmData.tableMobile)) {
            message.error('请补全电话号码/信息正文');
            return;
        }
        const url = 'manualShortNote/insertOne'; // editId === '' ? 'manualShortNote/insertOne' : 'manualShortNote/updateOne';
        request(url, {
            type: 'put',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            data: {
                ...parmData,
            },
        }).then((res) => {
            if (res && res.code === 200) {
                message.success(type === 1 ? '草稿保存成功' : '短信发送成功');
                this.handleReset();
            } else {
                message.error(res.message);
            }
        });
    };
    changeTreeList = (Keys, list, checked) => {
        const { treeList } = this.state;
        if (checked) {
            let array = treeList.concat(list);
            let result = [];
            let obj = [];
            result = array.reduce((prev, cur) => {
                if (obj[cur.key]) {
                } else {
                    obj[cur.key] = true;
                    prev.push(cur);
                }
                return prev;
            }, []);
            this.setState({
                treeList: result,
                groupKeys: result.map((a) => a.key),
            });
        } else {
            const uncheckedList = treeList.filter((a) => !Keys.includes(a.key));
            this.setState({
                treeList: uncheckedList,
                groupKeys: uncheckedList.map((a) => a.key),
            });
        }
    };
    deleteGroupHandler = (row) => {
        if (this.state.operId) {
            logNew('短信/彩信', this.state.operId);
        } else {
            logNew('监控工作台短信/彩信', '300003');
        }
        const { groupKeys, treeList } = this.state;
        const keys = groupKeys.filter((a) => !(a === row.key));
        const list = treeList.filter((a) => a.key !== row.key);
        this.setState({ groupKeys: keys, treeList: list });
    };
    render() {
        const { TabPane } = Tabs;
        const { treeList, groupKeys, userId, zoneId, reset } = this.state;
        return (
            <Form name="sendSms" ref={this.formRef} className="sending-sms-form" labelAlign="center">
                <Row className="send-sms-top-row">
                    <Col className="sms-input-message-wrapper" span={6}>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="定时发送" valuePropName="checked" name="isTimedTask">
                                    <Switch
                                        checkedChildren="开"
                                        onChange={() => {
                                            if (this.state.operId) {
                                                logNew('短信/彩信', this.state.operId);
                                            } else {
                                                logNew('监控工作台短信/彩信', '300003');
                                            }
                                            sendLogFn({ authKey: 'workbenches:delayedSend' });
                                        }}
                                        unCheckedChildren="关"
                                        size="small"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item name="sendDate" style={{ display: 'inline-block', width: 'calc(100% - 2px)' }}>
                                                <DatePicker
                                                    disabledDate={(current) => {
                                                        return current < moment();
                                                    }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    placeholder="发送时间"
                                                    disabled={!getFieldValue('isTimedTask')}
                                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="smsContent"
                                    label=""
                                    placeholder="请输入短信正文。。。"
                                    rules={[{ max: 1000, type: 'string', message: '总长度不能超过500字（1汉字=2位）' }]}
                                >
                                    <Input.TextArea rows={20} placeholder="请输入短信正文。。。" maxLength={500} allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={18} className="send-sms-right-part">
                        <Row gutter={12} className="send-sms-table">
                            <Col className="sms-message-group" span={8}>
                                <Tabs defaultActiveKey="1" size="large" type="card" onTabClick={this.onTabClick}>
                                    <TabPane
                                        tab={
                                            <span>
                                                <span style={{ marginRight: 5 }}>{'短信群组'}</span>
                                            </span>
                                        }
                                        key={1}
                                    >
                                        <GroupTree
                                            groupKeys={groupKeys}
                                            userId={userId}
                                            zoneId={zoneId}
                                            reset={reset}
                                            changeTreeList={this.changeTreeList}
                                        />
                                    </TabPane>
                                    <TabPane
                                        tab={
                                            <span>
                                                <span style={{ marginRight: 5 }}>{'短信用户'}</span>
                                            </span>
                                        }
                                        key={2}
                                    >
                                        <UserTree
                                            groupKeys={groupKeys}
                                            userId={userId}
                                            zoneId={zoneId}
                                            reset={reset}
                                            changeTreeList={this.changeTreeList}
                                        />
                                    </TabPane>
                                </Tabs>
                            </Col>
                            <Col span={16}>
                                <PageContainer showHeader={false}>
                                    <VirtualTable
                                        search={false}
                                        global={window}
                                        x={this.scrollX}
                                        bordered
                                        size="small"
                                        onReset={this.onTableReset}
                                        request={this.getListHandler}
                                        columns={this.columns}
                                        rowKey="groupId"
                                        actionRef={this.actionRef}
                                        formRef={this.formRef}
                                        dataSource={treeList}
                                    />
                                </PageContainer>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="handMobile"
                                    label=""
                                    rules={[
                                        {
                                            validator: async (rule, val, callback) => {
                                                const reg = new RegExp('^1[3456789][0-9]{9}(,1[3456789][0-9]{9})*$');
                                                if (reg.test(val) || !val) {
                                                    callback();
                                                } else {
                                                    throw new Error('请输入正确格式');
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        autoSize={{ minRows: 2, maxRows: 2 }}
                                        //style={{ height: '20px' }}
                                        maxLength={119}
                                        placeholder="手工输入电话号码，手机号请用逗号隔开"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} />
                    <Col span={12}>
                        <Space size="large">
                            <Button
                                onClick={() => {
                                    if (this.state.operId) {
                                        logNew('短信/彩信', this.state.operId);
                                    } else {
                                        logNew('监控工作台短信/彩信', '300003');
                                    }
                                    this.handleReset();
                                }}
                            >
                                重置
                            </Button>

                            <Button
                                type="primary"
                                onClick={() => {
                                    if (this.state.operId) {
                                        logNew('短信/彩信', this.state.operId);
                                    } else {
                                        logNew('监控工作台短信/彩信', '300003');
                                    }
                                    sendLogFn({ authKey: 'workbenches:sendSms' });
                                    this.handleSendOrDraft(2);
                                }}
                            >
                                发送
                            </Button>
                            <Button
                                onClick={() => {
                                    if (this.state.operId) {
                                        logNew('短信/彩信', this.state.operId);
                                    } else {
                                        logNew('监控工作台短信/彩信', '300003');
                                    }
                                    sendLogFn({ authKey: 'workbenches:saveDraft' });
                                    this.handleSendOrDraft(1);
                                }}
                            >
                                存为草稿
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        );
    }
}
export default Index;
