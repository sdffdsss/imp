import React, { useState, useEffect, useRef } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Icon, Modal, Tooltip, Space, Button, Select, Popconfirm, DatePicker, message } from 'oss-ui';
import { getNoticeList, addNotice, deleteNotice, updateNotice, publishNotice } from './api';
import useLoginInfoModel from '@Src/hox';
import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import EditModal from './component/editModal';
import request from '@Src/common/api';
import { getInitialProvince } from './utils';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import AuthButton from '@Src/components/auth-button';
import DateRangeTime from '@Components/date-range-time';

const { RangePicker } = DatePicker;

const Index = () => {
    const formRef = useRef();
    const actionRef = useRef();
    const [provinceData, handleProvinceData] = useState([]);

    // 多选id
    const [selectedRowKeys, handleSelectedRowKeys] = useState([]);
    // 多选行数据
    const [selectedRows, handleSelectedRows] = useState([]);
    // 当前用户log信息
    const [currentUserInfo, getCurrentUserInfo] = useState({});
    const login = useLoginInfoModel();
    const { systemInfo } = login;
    const titleEnum = {
        add: '新增公告',
        edit: '编辑公告',
        view: '查看'
    };
    const useModal = (initTitle, initContent) => {
        const [visible, setVisible] = useState(false);
        const [title, setTitle] = useState(initTitle);
        const [content, setContent] = useState(initContent);
        const CustomModal = () => {
            const modalTitle = (
                <div>
                    <span>{titleEnum[title]}</span>
                    <CloseOutlined
                        style={{ float: 'right' }}
                        onClick={() => {
                            setVisible(false);
                        }}
                    />
                </div>
            );
            return (
                <Modal
                    visible={visible}
                    title={modalTitle}
                    closable={false}
                    footer={null}
                    style={{
                        minWidth: '600px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {content}
                </Modal>
            );
        };
        const show = (contentItem, obj) => {
            if (content) {
                setContent(
                    <EditModal
                        type={contentItem}
                        onCancel={() => {
                            setVisible(false);
                        }}
                        onOk={() => {
                            setVisible(false);
                            actionRef.current?.reload();
                        }}
                        rowData={obj || {}}
                        login={login}
                    />
                );
                setTitle(contentItem);
            }
            setVisible(true);
        };
        const hide = (delay) => {
            if (delay) {
                setTimeout(() => setVisible(false), delay);
            } else {
                setVisible(false);
            }
        };
        return {
            show,
            hide,
            CustomModal,
            setTitle,
            setContent
        };
    };
    const { show, CustomModal } = useModal('系统提示', '正在初始化...');
    const handleEdit = (record) => {
        show('edit', {
            ...login,
            ...formRef?.current?.getFieldsValue(),
            provinceData,
            ...record
        });
    };

    // 发布公告
    const handleUpload = (rowData, type, publishStatus) => {
        if (type === 'multiple') {
            const notices = [];
            selectedRows.map((item) => {
                const par = {
                    cutTime: item.cutTime,
                    publishTime: item.publishTime,
                    status: item.status,
                    noticeId: item.noticeId
                };
                if (!item.cutTime) {
                    delete par.cutTime;
                }
                if (!item.publishTime) {
                    delete par.publishTime;
                }
                return notices.push(par);
            });
            publishNotice(
                {
                    notices,
                    publishType: publishStatus,
                    publishMan: login.userName
                },
                currentUserInfo
            ).then((res) => {
                if (res.code === 200) {
                    actionRef.current?.reload();
                    handleSelectedRowKeys([]);
                } else {
                    message.warn('发布异常');
                }
            });
        }
        if (type === 'single' && rowData) {
            const parSingle = {
                cutTime: rowData.cutTime || '',
                publishTime: rowData.publishTime,
                status: rowData.status,
                noticeId: rowData.noticeId
            };
            if (!rowData.cutTime) {
                delete parSingle.cutTime;
            }
            if (!rowData.publishTime) {
                delete parSingle.publishTime;
            }
            publishNotice(
                {
                    notices: [parSingle],
                    publishType: publishStatus,
                    publishMan: login.userName
                },
                currentUserInfo
            ).then((res) => {
                if (res.code === 200) {
                    actionRef.current?.reload();
                    handleSelectedRowKeys([]);
                } else {
                    message.warn('发布异常');
                }
            });
        }
    };

    // 删除公告
    const handleDelete = (rowData, type, params) => {
        if (type === 'single') {
            deleteNotice([rowData.noticeId], params).then((res) => {
                if (res.code === 200) {
                    actionRef.current?.reload();
                }
            });
        }
        if (type === 'multiple') {
            deleteNotice(selectedRowKeys, params).then((res) => {
                if (res.code === 200) {
                    actionRef.current?.reload();
                }
            });
        }
    };
    // 获取当前用户log信息
    const handleCurrentUserInfo = (info) => {
        getCurrentUserInfo(info);
    };

    const deleteItem = (record, type, params) => {
        Modal.confirm({
            title: '提示',
            content: '此操作将永久删除选中项，是否继续操作？',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                handleDelete(record, type, params);
            },
            onCancel: () => {}
        });
    };
    const columns = [
        {
            title: '归属省份',
            dataIndex: 'provinceName',
            hideInSearch: true
        },
        {
            title: '归属省份',
            dataIndex: 'provinceId',
            hideInTable: true,
            initialValue: provinceData.length && getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            renderFormItem: (item, { type, ...rest }) => {
                return (
                    <Select
                        showSearch
                        filterOption={(e, opt) => {
                            if (opt?.children.indexOf(e) > -1) {
                                return true;
                            }
                        }}
                        {...rest}
                        placeholder={`请选择省份`}
                        align="left"
                    >
                        {provinceData
                            .filter((item) => getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo) === item.regionId)
                            .map((items) => {
                                return (
                                    <Select.Option key={items.regionId} value={items.regionId}>
                                        {items.regionName}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                );
            }
        },
        {
            title: '公告标题',
            dataIndex: 'noticeTitle'
        },
        {
            title: '创建人',
            dataIndex: 'creatorName',
            hideInSearch: true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true,
            render: (text, record) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
            sorter: true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInTable: true,
            initialValue: [moment().subtract(2, 'days'), moment()],
            renderFormItem: () => {
                return <DateRangeTime placeholder={['开始日期', '结束日期']} />;
            }
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime',
            hideInSearch: true,
            sorter: true
        },
        {
            title: '截止时间',
            dataIndex: 'cutTime',
            hideInSearch: true,
            sorter: true,
            render: (_, record) => {
                return record.cutTime || '无结束日';
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            hideInSearch: true,
            render: (text) => {
                switch (text) {
                    case '1':
                        return '待发布';
                    case '2':
                        return '已发布';
                    case '3':
                        return '取消发布';
                    default:
                        break;
                }
            },
            sorter: true
        },
        {
            title: '是否全国公告',
            dataIndex: 'isGroup',
            hideInSearch: true,
            render: (_, record) => {
                return record.isGroup === 'true' ? '是' : '否';
            }
        },
        {
            title: '操作',
            hideInSearch: true,
            render: (_, record) => {
                return (
                    <Space>
                        <Tooltip title="编辑">
                            <AuthButton
                                onClick={() => {
                                    handleEdit(record);
                                }}
                                type="text"
                                style={{ padding: 0 }}
                                authKey="unicomNotice:edit"
                            >
                                <Icon type="EditOutlined" antdIcon />
                            </AuthButton>
                        </Tooltip>
                        <Popconfirm
                            title={`是否确认${record.status === '2' ? '取消':''}发布该公告?`}
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => {
                                handleUpload(record, 'single', record.status ==='2'?'2':'1');
                            }}
                        >
                            <Tooltip title={record.status === '2' ? "取消发布": "发布"} trigger={['hover', 'click']}>
                                <AuthButton
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey={record.status === '2' ? "unicomNotice:unpublish" : "unicomNotice:publish"}
                                    onClick={(params) => {
                                        handleCurrentUserInfo(params);
                                    }}
                                    addLog={true}
                                >
                                    <Icon type="CloudUploadOutlined" antdIcon />
                                </AuthButton>
                            </Tooltip>
                        </Popconfirm>
                        <Tooltip title="删除">
                            <AuthButton
                                type="text"
                                style={{ padding: 0 }}
                                authKey="unicomNotice:delete"
                                onClick={(params) => {
                                    deleteItem(record, 'single', params);
                                }}
                                addLog={true}
                            >
                                <Icon type="DeleteOutlined" antdIcon />
                            </AuthButton>
                        </Tooltip>
                    </Space>
                );
            }
        }
    ];

    // 获取归属省份
    const getProvinceData = () => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: login.userId
            }
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const list = res;
                handleProvinceData(res);
                const obj = {};
                list.map((item) => {
                    obj[item.regionId] = { text: item.regionName };
                    return obj;
                });
            }
        });
    };
    useEffect(() => {
        getProvinceData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 获取公告列表
    const getNoticeData = async (e, sorter) => {
        handleSelectedRows([]);
        handleSelectedRowKeys([]);
        let orderType = '';
        let orderFieldName = '';
        if (!_isEmpty(sorter)) {
            // 当排序的对象不为空时，取出对象的value
            orderType = Object.values(sorter).toString();
            if (orderType === 'ascend') {
                orderType = '2';
            } else {
                orderType = '1';
            }
            orderFieldName = Object.keys(sorter).toString();
            if (orderFieldName === 'createTime') {
                orderFieldName = 'create_time';
            }
            if (orderFieldName === 'cutTime') {
                orderFieldName = 'cut_time';
            }
            if (orderFieldName === 'publishTime') {
                orderFieldName = 'publish_time';
            }
        }
        const params = {
            pageNo: e.current,
            pageSize: e.pageSize,
            provinceId: e.provinceId || getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            noticeTitle: e.noticeTitle,
            creator: login.userId,
            startTime:
                e.createTime && e.createTime[0]
                    ? moment(e.createTime[0]).format('YYYY-MM-DD 00:00:00')
                    : moment().subtract('days', 2).startOf('day').format('YYYY-MM-DD 00:00:00'),
            endTime:
                e.createTime && e.createTime[1]
                    ? moment(e.createTime[1]).format('YYYY-MM-DD 23:59:59')
                    : moment().endOf('day').format('YYYY-MM-DD 23:59:59'),
            orderType,
            orderField: orderFieldName
        };

        // 删除空参数
        Object.keys(params).map((item) => {
            if (!params[item]) {
                return delete params[item];
            }
        });
        if (orderType === '') {
            delete params.orderType;
        }
        if (orderFieldName === '') {
            delete params.orderFieldName;
        }
        const res = await getNoticeList(params);
        if (!res) {
            return {
                success: false,
                total: 0,
                data: []
            };
        }
        return {
            success: true,
            total: res.total,
            data: res.data || []
        };
    };

    // 点击新增按钮
    const handleAdd = () => {
        show('add', {
            ...login,
            ...formRef?.current?.getFieldsValue(),
            provinceData
        });
    };
    const toolBarRender = () => {
        return [
            <Popconfirm
                title={`是否确认取消发布${selectedRowKeys.length}条公告？`}
                okText="确认"
                cancelText="取消"
                onConfirm={() => {
                    handleUpload({}, 'multiple', '2');
                }}
            >
                <AuthButton
                    authKey="unicomNotice:unpublish"
                    disabled={!selectedRowKeys?.length}
                    onClick={(params) => {
                        handleCurrentUserInfo(params);
                    }}
                    addLog={true}
                >
                    取消发布
                </AuthButton>
            </Popconfirm>,
            <Popconfirm
                title={`是否确认发布${selectedRowKeys.length}条公告？`}
                okText="确认"
                cancelText="取消"
                onConfirm={() => {
                    handleUpload({}, 'multiple', '1');
                }}
            >
                <AuthButton
                    authKey="unicomNotice:publish"
                    disabled={!selectedRowKeys?.length}
                    onClick={(params) => {
                        handleCurrentUserInfo(params);
                    }}
                    addLog={true}
                >
                    发布公告
                </AuthButton>
            </Popconfirm>,
            <AuthButton
                authKey="unicomNotice:delete"
                disabled={!selectedRowKeys?.length}
                onClick={(params) => {
                    deleteItem({}, 'multiple', params);
                }}
                addLog={true}
            >
                删除公告
            </AuthButton>,
            <AuthButton
                authKey="unicomNotice:add"
                icon={<PlusSquareOutlined />}
                onClick={() => {
                    handleAdd();
                }}
            >
                新增
            </AuthButton>
        ];
    };

    const onSelectChange = (ids, rows) => {
        handleSelectedRowKeys(rows.map((item) => item.noticeId));
        handleSelectedRows(rows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (ids, rows) => {
            onSelectChange(ids, rows);
        }
    };
    return (
        <div style={{ height: '100%' }}>
            {provinceData.length && (
                <VirtualTable
                    global={window}
                    actionRef={actionRef}
                    formRef={formRef}
                    columns={columns}
                    toolBarRender={toolBarRender}
                    tableAlertRender={false}
                    tableAlertOptionRender={false}
                    request={getNoticeData}
                    rowKey="noticeId"
                    rowSelection={rowSelection}
                />
            )}
            <CustomModal />
        </div>
    );
};
export default Index;
