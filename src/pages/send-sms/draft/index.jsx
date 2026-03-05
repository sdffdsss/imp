/* eslint-disable no-underscore-dangle */
import React from 'react';
import PageContainer from '@Components/page-container';
import { VirtualTable } from 'oss-web-common';
import { Space, Icon, Tooltip, Form, Input, Popconfirm, message, DatePicker } from 'oss-ui';
import moment from 'moment';
import request from '@Src/common/api';
// import DateRangeTime from '@Components/date-range-time';
import { logNew } from '@Common/api/service/log';
import useLoginInfoModel from '@Src/hox';
import urlSearch from '@Common/utils/urlSearch';
import { sendLogFn } from '@Src/pages/components/auth/utils';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.actionRef = React.createRef();
        this.state = {
            first: true,
            operId: '',
        };
        this.columns = [
            {
                dataIndex: 'rank',
                align: 'center',
                width: 80,
                title: '序号',
                render: (text, record, index) => {
                    return index + 1;
                },
                hideInSearch: true,
            },
            {
                title: '短信正文',
                dataIndex: 'smsContent',
                align: 'center',
                ellipsis: true,
            },
            {
                title: '收件人号码',
                dataIndex: 'mobiles',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '发送方式',
                dataIndex: 'isTimedTaskName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '发送人',
                dataIndex: 'operatorName',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '发送时间',
                dataIndex: 'sendDate',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '日期',
                hideInTable: true,
                dataIndex: 'createTime',
                align: 'center',
                ellipsis: true,
                width: 180,
                initialValue: [moment().subtract(2, 'day').startOf('day'), moment().startOf('day')],
                renderFormItem: (item, { fieldProps }, form) => {
                    return <DatePicker.RangePicker {...fieldProps} form={form} format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} />;
                },
            },
            {
                title: '收件人号码',
                hideInTable: true,
                dataIndex: 'handMobile',
                align: 'center',
                ellipsis: true,
                renderFormItem: () => {
                    return (
                        <Form.Item
                            name="handMobile"
                            label=""
                            rules={[
                                {
                                    validator: async (rule, val, callback) => {
                                        // const reg = new RegExp('^1[3578][0-9]{9}(,1[3578][0-9]{9})*$');
                                        const reg = new RegExp('^[0-9]{0,11}(,[0-9]{0,11})*$');
                                        if (reg.test(val) || !val) {
                                            callback();
                                        } else {
                                            throw new Error('请输入正确格式');
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="请输入完整手机号，多个请用逗号隔开" allowClear />
                        </Form.Item>
                    );
                },
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
                            <Tooltip title="编辑">
                                <Icon type="EditOutlined" antdIcon onClick={this.showEditModal.bind(this, row)} />
                            </Tooltip>
                            <Popconfirm title="确认删除此条记录吗?" onConfirm={this.deleteHandler.bind(this, row)} okText="确认" cancelText="取消">
                                <Tooltip title="删除">
                                    <Icon type="DeleteOutlined" antdIcon />
                                </Tooltip>
                            </Popconfirm>
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
    componentWillUnmount() {}
    /**
     * @description: 获取班组列表
     * @param {*}
     * @return {*}
     */

    getListHandler = (params) => {
        if (this.state.operId) {
            logNew('短信/彩信', this.state.operId);
        } else {
            logNew('监控工作台短信/彩信', '300003');
        }
        sendLogFn({ authKey: 'workbenches:draftRecordQuery' });
        const { first } = this.state;
        const data = {
            operator: this.props.userId,
            pageNum: params.current,
            pageSize: params.pageSize,
            shortNoteType: 1,
            sendDateBegin: params.createTime && moment(params.createTime[0]).format('YYYY-MM-DD'),
            sendDateEnd: params.createTime && moment(params.createTime[1]).format('YYYY-MM-DD'),
            mobile: params.handMobile,
            smsContent: params.smsContent,
        };
        if (first) {
            data.sendDateBegin = moment().subtract(2, 'day').startOf('day').format('YYYY-MM-DD');
            data.sendDateEnd = moment().startOf('day').format('YYYY-MM-DD');
            this.setState({ first: false });
        }
        return request('manualShortNote/queryInfoByCondition', {
            type: 'post',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            data: {
                ...data,
            },
        }).then((res) => {
            if (Array.isArray(res.data)) {
                return {
                    success: true,
                    total: res.total,
                    data: res.data || [],
                };
            }
            return {
                success: true,
                total: 0,
                data: [],
            };
        });
    };
    showEditModal = (row) => {
        if (this.state.operId) {
            logNew('短信/彩信', this.state.operId);
        } else {
            logNew('监控工作台短信/彩信', '300003');
        }
        sendLogFn({ authKey: 'workbenches:draftRecordEdit' });
        this.props.reSendSms(row.id);
    };
    deleteHandler = (row) => {
        if (this.state.operId) {
            logNew('短信/彩信', this.state.operId);
        } else {
            logNew('监控工作台短信/彩信', '300003');
        }
        sendLogFn({ authKey: 'workbenches:draftRecordDelete' });
        request('manualShortNote/deleteOne', {
            type: 'delete',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            data: {
                id: row.id,
            },
        }).then((res) => {
            if (res && res.code === 200) {
                this.actionRef.current.reload();
                message.success('删除成功');
            } else {
                message.error(res.message);
            }
        });
    };
    /**
     * @description: 重置表格
     * @param {*}
     * @return {*}
     */
    onTableReset = () => {};

    render() {
        return (
            <PageContainer showHeader={false}>
                <VirtualTable
                    search={{
                        span: 6,
                    }}
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
                />
            </PageContainer>
        );
    }
}
export default Index;
