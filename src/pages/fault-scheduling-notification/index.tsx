/* eslint-disable consistent-return */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import constants from '@Src/common/constants';
import { useHistory } from 'react-router-dom';
import { _ } from 'oss-web-toolkits';
import { Select, Input, Tooltip, Icon, Button, Modal } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { getProvinceAndRegions } from '@Common/utils/getProvince';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import AuthButton from '@Src/components/auth-button';
import useLoginInfoModel from '@Src/hox';
import { Api } from './api';
import Detail from './edit/edit-content';

import './index.less';

const FaultSchedulingNotification = () => {
    const history = useHistory();
    const formRef = useRef<any>(null);
    const actionRef = useRef<any>(null);
    const [provinceList, setProvinceList] = useState<any>([]);
    const [professionList, setProfessionList] = useState<any>([]);
    const [faultYypeList, setFaultYypeList] = useState<any>([]);

    const [viewId, setViewId] = useState<string>('');
    const [viewName, setViewName] = useState<string>('');

    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [provinceId, setProvinceId] = useState<string>('');

    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);

    const login = useLoginInfoModel();

    const { userId, userName, currentZone } = login;

    useEffect(() => {
        getProvinceData();
        getprofessionData();
        getFaultDictionaryData('fault_type');
    }, []);

    const faultLevelOptions = [
        {
            label: 'L1',
            value: '1',
        },
        {
            label: 'L2',
            value: '2',
        },
        {
            label: 'L3',
            value: '3',
        },
        {
            label: 'L4',
            value: '4',
        },
        {
            label: 'L5',
            value: '5',
        },
        {
            label: 'L6',
            value: '6',
        },
        {
            label: 'L7',
            value: '7',
        },
        {
            label: 'L8',
            value: '8',
        },
    ];

    const columns = useMemo(() => {
        return [
            {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                hideInSearch: true,
                width: 40,
                render: (text, record, index) => {
                    return index + 1 + (pageNum - 1) * pageSize;
                },
            },

            {
                title: '规则名称',
                dataIndex: 'notiveName',
                align: 'center',
                width: 150,
                sorter: true,
                renderFormItem: () => {
                    return <Input placeholder="" />;
                },
                render: (text, record) => {
                    return (
                        <div
                            onClick={() => handleModalView(record)}
                            title={text}
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
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
                title: '归属省份',
                dataIndex: 'provinceId',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select
                            placeholder="请选择"
                            showSearch
                            allowClear={provinceList.length > 1}
                            options={provinceList}
                            optionFilterProp="label"
                        />
                    );
                },
            },
            {
                title: '归属省份',
                dataIndex: 'provinceName',
                align: 'center',
                width: 60,
                hideInSearch: true,
            },
            {
                title: '归属专业',
                dataIndex: 'professionalType',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select
                            placeholder="全部"
                            mode="multiple"
                            maxTagCount={2}
                            showSearch
                            allowClear
                            options={professionList}
                            optionFilterProp="label"
                        />
                    );
                },
            },

            {
                title: '归属专业',
                dataIndex: 'professionalName',
                align: 'center',
                width: 60,
                ellipsis: true,
                hideInSearch: true,
            },

            {
                title: '是否启用',
                dataIndex: 'enableName',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
                sorter: true,
                filters: true,
                onFilter: false,
                valueEnum: {
                    1: { text: '启用' },
                    0: { text: '未启用' },
                },
            },
            {
                title: '故障场景',
                dataIndex: 'faulsScens',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select
                            placeholder="全部"
                            showSearch
                            allowClear
                            mode="multiple"
                            maxTagCount="responsive"
                            options={faultYypeList}
                            optionFilterProp="label"
                        />
                    );
                },
            },

            {
                title: '工单优先级',
                dataIndex: 'faulsLevels',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select
                            placeholder="全部"
                            showSearch
                            allowClear
                            mode="multiple"
                            maxTagCount="responsive"
                            options={faultLevelOptions}
                            optionFilterProp="label"
                        />
                    );
                },
            },
            // {
            //     title: '故障级别1',
            //     dataIndex: 'faulsLevels1',
            //     hideInTable: true,
            //     renderFormItem: () => {
            //         return (
            //             <Select
            //                 placeholder="全部"
            //                 showSearch
            //                 allowClear
            //                 mode="multiple"
            //                 maxTagCount="responsive"
            //                 options={faultLevelOptions}
            //                 optionFilterProp="label"
            //             />
            //         );
            //     },
            // },
            // {
            //     title: '故障级别2',
            //     dataIndex: 'faulsLevels2',
            //     hideInTable: true,
            //     renderFormItem: () => {
            //         return (
            //             <Select
            //                 placeholder="全部"
            //                 showSearch
            //                 allowClear
            //                 mode="multiple"
            //                 maxTagCount="responsive"
            //                 options={faultLevelOptions}
            //                 optionFilterProp="label"
            //             />
            //         );
            //     },
            // },
            {
                title: '描述',
                dataIndex: 'remark',
                align: 'center',
                hideInSearch: true,
                width: 120,
                ellipsis: true,
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                width: 60,
                sorter: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                hideInSearch: true,
                width: 120,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '修改人',
                dataIndex: 'modifier',
                align: 'center',
                hideInSearch: true,
                width: 60,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '修改时间',
                dataIndex: 'modifyTime',
                align: 'center',
                hideInSearch: true,
                width: 120,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '操作',
                dataIndex: 'actions',
                valueType: 'option',
                align: 'center',
                fixed: 'right',
                width: 120,
                render: (text, record) => {
                    let actions = [
                        <Tooltip title="版本查看">
                            <Button
                                style={{ padding: 0 }}
                                type="text"
                                onClick={() => handleModalView(record)}
                                // authKey="faultSchedulingNotification:history"
                            >
                                <Icon antdIcon type="SearchOutlined" />
                            </Button>
                        </Tooltip>,
                        <Tooltip title="通知记录">
                            <Button
                                style={{ padding: 0 }}
                                type="text"
                                title="通知记录"
                                // authKey="faultSchedulingNotification:record"
                                onClick={() => editClick(record, 'view')}
                            >
                                <Icon style={{ color: '#1597db' }} antdIcon type="CopyOutlined" />
                            </Button>
                        </Tooltip>,
                    ];

                    const { isAdmin } = JSON.parse(login.userInfo);
                    const { userId } = login;

                    if (isAdmin || record.creatorId === userId) {
                        actions = [
                            <Tooltip title={record?.enable ? '暂停' : '启用'}>
                                <AuthButton
                                    style={{ padding: 0 }}
                                    type="text"
                                    onClick={() => updateStatus(record)}
                                    authKey="faultSchedulingNotification:action"
                                >
                                    <Icon antdIcon type={record?.enable ? 'PauseCircleOutlined' : 'PlayCircleOutlined'} />
                                </AuthButton>
                            </Tooltip>,

                            <Tooltip title="编辑">
                                <AuthButton
                                    onClick={() => editClick(record, 'edit')}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="faultSchedulingNotification:edit"
                                >
                                    <Icon type="EditOutlined" antdIcon />
                                </AuthButton>
                            </Tooltip>,
                            <Tooltip title="删除">
                                <AuthButton
                                    addLog={true}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="faultSchedulingNotification:delete"
                                    onClick={() => deleteClick(record)}
                                >
                                    <Icon antdIcon type="DeleteOutlined" />
                                </AuthButton>
                            </Tooltip>,
                            ...actions,
                        ];
                    }
                    return actions;
                },
            },
        ];
    }, [provinceList, professionList, faultLevelOptions, faultYypeList, provinceId, pageNum]);

    const getNoticeData = async (params: any, sorter, filters) => {
        const { current, pageSize } = params;
        setPageNum(current);
        setPageSize(pageSize);
        const values = formRef.current?.getFieldsValue();
        const { provinceId, notiveName, professionalType, faulsScens, faulsLevels } = values || {};
        const queryParams: any = {
            pageNum: current,
            pageSize,
            notificationName: notiveName,
            provinceId: Number(provinceId),
            professionalTypes: professionalType,
            faulsScens,
            faulsLevels,
        };

        if (!_.isEmpty(sorter)) {
            const orderType = Object.values(sorter).toString();
            const orderColumn = Object.keys(sorter).toString();

            switch (orderColumn) {
                case 'notiveName':
                    queryParams.orderColumn = 'notificationName';
                    break;
                case 'enableName':
                    queryParams.orderColumn = 'ifEnable';
                    break;
                default:
                    queryParams.orderColumn = orderColumn;
                    break;
            }

            if (orderType === 'ascend') {
                queryParams.orderType = 'asc';
            } else {
                queryParams.orderType = 'desc';
            }
        }

        if (!_.isEmpty(filters)) {
            if (Array.isArray(filters.enableName) && filters.enableName.length === 1) {
                queryParams.ifEnable = filters.enableName.join(',');
            } else {
                queryParams.ifEnable = '';
            }
        }

        const res = await Api.getNoticeList(queryParams);
        const { data = [], total } = res || {};
        return {
            success: true,
            data,
            total,
        };
    };

    // 获取省份信息
    const getProvinceData = async () => {
        if (currentZone.zoneLevel === '1') {
            const options = await getProvinceAndRegions();
            const data = [{ label: '集团', value: 0 }].concat(options);
            data.sort((a, b) => {
                const isAContain = a.label.includes('大区') || a.label.includes('节点');
                const isBContain = b.label.includes('大区') || b.label.includes('节点');
                if (isAContain && !isBContain) {
                    return 1; // a在b后面
                } else if (!isAContain && isBContain) {
                    return -1; // a在b前面
                } else {
                    return 0; // 保持相对顺序
                }
            });
            setProvinceId('0');
            setProvinceList(data);
            formRef?.current?.setFieldsValue({ provinceId: 0 });
            actionRef?.current?.reload();
        } else {
            const { userId, systemInfo } = login;

            const res = await Api.getProvinceData(userId);

            let provinceList = res || [];
            provinceList = provinceList.filter((item) =>
                systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
            );

            const provinceId = provinceList[0].regionId;
            setProvinceId(provinceId);

            setProvinceList(provinceList.map((item) => ({ label: item.regionName, value: item.regionId })) || []);
            formRef?.current?.setFieldsValue({ provinceId });
            actionRef?.current?.reload();
        }
    };

    const getprofessionData = async () => {
        const { userId } = login;
        const data = {
            pageSize: 100,
            dictName: 'professional_type',
            en: false,
            modelId: 2,
            creator: userId,
        };
        const { data: res } = await Api.getprofession(data);
        let professionList = res.map((item) => ({ label: item.value, value: item.key })) || [];
        setProfessionList(professionList);
    };

    const getFaultDictionaryData = async (dictName) => {
        const res = (await Api.getFaultDictionary(dictName)) || [];
        const data = res.data.map((item) => ({ label: item.dName, value: item.dCode }));
        switch (dictName) {
            case 'fault_type':
                return setFaultYypeList(data);
        }
    };

    const goAdd = () => {
        let targetUrl = `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-scheduling-notification/new`;

        // const target = provinceList.find((item) => item.value === province_id);
        // if (province_id) {
        //     targetUrl = `/fault-scheduling-notification-add/new/${moduleId}/new/${province_id}/${target?.label}`;
        // }
        history.push({ pathname: targetUrl });
    };

    const editClick = (record, type) => {
        let targetUrl = `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-scheduling-notification/${type}`;
        sendLogFn({ authKey: 'faultSchedulingNotification:record' });
        // const province_id = this.formRef.current?.getFieldValue('province_id') || record.filterProvince;
        // const target = provinceList.find((item) => item.value === province_id);
        // if (province_id) {
        //     targetUrl = `/alarm-interrupt-monitor/${type}/${moduleId}/${record.monitorId}/${province_id}/${target?.label}`;
        // }
        history.push({ pathname: targetUrl, state: record });
    };

    const deleteClick = (record) => {
        console.log(record);
        const { noticeId } = record || {};
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '此操作将永久删除选中项，是否继续？',
            width: '350px',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: async () => {
                await Api.deleteNotice(noticeId);
                actionRef?.current?.reload();
            },
        });
    };

    const renderModal = () => {
        return (
            <Detail
                modeParams={{
                    type: 'edit',
                    id: viewId,
                    isCheck: true,
                }}
                mode={'read'}
            />
        );
    };

    const handleModalCancel = () => {
        setViewModalVisible(false);
    };

    const handleModalView = (value) => {
        sendLogFn({ authKey: 'faultSchedulingNotification:history' });
        setViewId(value?.noticeId);
        setViewName(value?.notiveName);

        setViewModalVisible(true);
    };

    const updateStatus = async (record) => {
        const { noticeId, enable } = record || {};

        const statusEnum = {
            0: 1,
            1: 0,
        };

        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '是否更新启用状态？',
            width: '350px',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: async () => {
                await Api.updateEnabledeStatus({
                    operatorId: userId,
                    operatorName: userName,
                    noticeId,
                    ifEnable: statusEnum[enable],
                });
                actionRef?.current?.reload();
            },
        });

        // const res = await Api.updateEnabledeStatus({
        //     noticeId,
        //     ifEnable: statusEnum[enable],
        // });
        // console.log(res);
    };

    const reset = () => {
        formRef.current?.resetFields();

        formRef.current?.setFieldsValue({ provinceId });
        actionRef.current?.reload();
    };

    return (
        <div className="fault-scheduling-notification-page">
            <VirtualTable
                manualRequest
                global={window}
                tableAlertRender={false}
                search={{
                    span: 4,
                    labelWidth: 80,
                    optionRender: (searchConfig, fromProps, dom) => {
                        return [<Button onClick={reset}>重置</Button>, ...dom.slice(1)];
                    },
                }}
                columns={columns}
                formRef={formRef}
                actionRef={actionRef}
                request={getNoticeData}
                toolBarRender={() => [
                    <AuthButton
                        onClick={goAdd}
                        // type="text"
                        // style={{ padding: 0 }}
                        authKey="faultSchedulingNotification:add"
                    >
                        <Icon antdIcon type="PlusOutlined" />
                        新建
                    </AuthButton>,
                ]}
            />
            <Modal
                destroyOnClose
                visible={viewModalVisible}
                width={1200}
                className="fault-scheduling-notification-view-modal"
                onCancel={() => {
                    handleModalCancel();
                }}
                footer={
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            type="default"
                            onClick={() => {
                                handleModalCancel();
                            }}
                        >
                            取消
                        </Button>
                    </div>
                }
                title={viewName}
            >
                {renderModal()}
            </Modal>
        </div>
    );
};

export default FaultSchedulingNotification;
