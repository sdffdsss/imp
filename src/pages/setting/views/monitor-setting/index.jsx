import React, { useState, useEffect, useRef } from 'react';
import { Icon, Modal, Tooltip, Space, Button, Select, Popconfirm, message } from 'oss-ui';
import EditModal from './component/editModal';
import PageContainer from '@Components/page-container';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import request from '@Src/common/api';
import useLoginInfoModel from '@Src/hox';
import { getMonitorCenter, getMonitorCenterDetail, deleteMonitorCenter, validateMonitorCenter } from './api';
import { getInitialProvince } from './utils';
import AuthButton from '@Src/components/auth-button';
import urlSearch from '@Common/utils/urlSearch';
import { logNew } from '@Common/api/service/log';
import './index.less';

const Index = () => {
    // return <>111</>
    const formRef = useRef();
    const actionRef = useRef();
    const login = useLoginInfoModel();
    const [provinceData, handleProvinceData] = useState([]);
    const [operId, setOperId] = useState('');
    // 当前用户log信息
    const [currentUserInfo, getCurrentUserInfo] = useState({});
    const [groupFilterProvince, setGroupFilterProvince] = useState({});
    const titleEnum = {
        add: '新增',
        edit: '编辑',
        view: '查看',
    };
    useEffect(() => {
        const { srcString } = login;
        const urlData = urlSearch(srcString);
        if (urlData.operId) {
            setOperId(urlData.operId);
        }
    }, []);
    const useModal = (initTitle, initContent) => {
        const [visible, setVisible] = useState(false);
        const [title, setTitle] = useState(initTitle);
        const [content, setContent] = useState(initContent);
        const CustomModal = () => {
            return (
                <Modal
                    className="views-monitor-setting-modal"
                    visible={visible}
                    width={1200}
                    title={`${titleEnum[title]}监控中心`}
                    closable
                    footer={null}
                    onCancel={() => {
                        setVisible(false);
                    }}
                    // style={{
                    //     minWidth: '1200px',
                    //     position: 'relative',
                    //     overflow: 'hidden',
                    // }}
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
                        data={provinceData}
                        rowData={obj || {}}
                        groupFilterProvince={groupFilterProvince}
                    />,
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
            setContent,
        };
    };

    const { show, CustomModal } = useModal('系统提示', '正在初始化...');

    // 获取归属省份
    const getProvinceData = () => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: login.userId,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const list = res;
                console.log('===获取省份数据失败==', res);
                handleProvinceData(res);
                const obj = {};
                list.map((item) => {
                    obj[item.regionId] = { text: item.regionName };
                    return obj;
                });
                const id = getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
                formRef.current?.setFieldsValue({
                    provinceId: id,
                });
                setGroupFilterProvince(res.find((province) => province.regionId === id));
            }
        });
    };
    useEffect(() => {
        getProvinceData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdd = () => {
        show('add');
    };
    const handleEdit = async (id, params) => {
        await getMonitorCenterDetail({ id }, params).then((res) => {
            show('edit', res.data);
        });
    };
    const handleView = async (id, params) => {
        await getMonitorCenterDetail({ id }, params).then((res) => {
            show('view', res.data);
        });
    };
    const toolBarRender = () => {
        return [
            <AuthButton
                authKey="monitorSetting:add"
                logFalse={operId}
                onClick={() => {
                    if (operId) {
                        logNew('监控中心设置', operId);
                    }
                    handleAdd();
                }}
            >
                新建
            </AuthButton>,
        ];
    };

    const getMonitorCenterList = async (e, sorter) => {
        let orderType = '';
        let orderFieldName = '';
        if (!_.isEmpty(sorter)) {
            // 当排序的对象不为空时，取出对象的value
            orderType = Object.values(sorter).toString();
            if (orderType === 'ascend') {
                orderType = 'asc';
            } else {
                orderType = 'desc';
            }
            orderFieldName = Object.keys(sorter).toString();
        }
        const params = {
            current: e.current,
            pageSize: e.pageSize,
            provinceId: getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
            centerName: e.centerName,
            userId: login.userId,
            orderType,
            orderFieldName,
        };
        if (orderType === '') {
            delete params.orderType;
        }
        if (orderFieldName === '') {
            delete params.orderFieldName;
        }
        const res = await getMonitorCenter(params);
        return {
            success: true,
            total: res.total,
            data: res.data || [],
        };
    };

    const handleDelete = async (id, params) => {
        await deleteMonitorCenter({ centerId: id, userId: login.userId }, params);
        actionRef.current?.reload();
    };

    const beforeSearchSubmit = (e) => {
        const params = {
            ...e,
            provinceId: formRef.current?.getFieldsValue().provinceId,
        };
        return params;
    };

    // 获取当前用户log信息
    const handleCurrentUserInfo = (info) => {
        getCurrentUserInfo(info);
    };

    const deleteItem = (record, params) => {
        validateMonitorCenter({ centerId: record.centerId }).then((res) => {
            if (res.code === -1) {
                message.warn(res.message);
            } else {
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
                        handleDelete(record.centerId, params);
                    },
                    onCancel: () => {},
                });
            }
        });
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: 50,
            hideInSearch: true,
            ellipsis: true,
            render: (text, record, index) => {
                return index + 1;
            },
        },
        {
            title: '监控中心名称',
            dataIndex: 'centerName',
            sorter: true,

            render: (text, record) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            handleView(record.centerId);
                        }}
                    >
                        <div style={{ textDecoration: 'underline', cursor: 'pointer' }}>{text}</div>
                    </Button>
                );
            },
        },
        {
            title: '归属省份',
            dataIndex: 'provinceName',
            hideInSearch: true,
        },
        {
            title: '归属省份',
            dataIndex: 'provinceId',
            hideInTable: true,
            initialValue: getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
            // valueEnum: enumObj,
            renderFormItem: (item, { type, ...rest }) => {
                return (
                    <Select {...rest} placeholder={`请选择省份`} align="left">
                        {provinceData.map((items) => {
                            if (items.regionId === getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo)) {
                                return (
                                    <Select.Option key={items.regionId} value={items.regionId}>
                                        {items.regionName}
                                    </Select.Option>
                                );
                            }
                        })}
                    </Select>
                );
            },
        },
        {
            title: '描述',
            dataIndex: 'desc',
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: '关联班组',
            dataIndex: 'associatedGroup',
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: '创建人',
            dataIndex: 'creatorName',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '修改时间',
            dataIndex: 'modifyTime',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            hideInSearch: true,
            render: (_, record) => {
                return (
                    <Space>
                        {(login.userId === record.creatorId || login.isAdmin) && (
                            <Tooltip title="编辑">
                                <AuthButton
                                    onClick={(params) => {
                                        if (operId) {
                                            logNew('监控中心设置', operId);
                                        }
                                        handleEdit(record.centerId, params);
                                    }}
                                    logFalse
                                    type="text"
                                    addLog={true}
                                    style={{ padding: 0 }}
                                    authKey="monitorSetting:edit"
                                >
                                    <Icon type="EditOutlined" antdIcon />
                                </AuthButton>
                            </Tooltip>
                        )}
                        {(login.userId === record.creatorId || login.isAdmin) && (
                            <Tooltip title="删除">
                                <AuthButton
                                    logFalse
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="monitorSetting:delete"
                                    onClick={(params) => {
                                        if (operId) {
                                            logNew('监控中心设置', operId);
                                        }
                                        deleteItem(record, params);
                                    }}
                                    addLog={true}
                                >
                                    <Icon type="DeleteOutlined" antdIcon />
                                </AuthButton>
                            </Tooltip>
                        )}
                        <Tooltip title="查看" trigger={['hover', 'click']}>
                            <Button type="text" style={{ padding: 0 }}>
                                <Icon
                                    type="SearchOutlined"
                                    antdIcon
                                    onClick={() => {
                                        handleView(record.centerId);
                                    }}
                                />
                            </Button>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    return (
        <div style={{ height: '100%' }}>
            {Boolean(provinceData.length) && (
                <VirtualTable
                    global={window}
                    columns={columns}
                    toolBarRender={toolBarRender}
                    request={getMonitorCenterList}
                    formRef={formRef}
                    actionRef={actionRef}
                    rowKey="centerId"
                    beforeSearchSubmit={beforeSearchSubmit}
                />
            )}
            <CustomModal />
        </div>
    );
};

export default Index;
