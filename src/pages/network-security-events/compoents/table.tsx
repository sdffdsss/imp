import React, { useRef, useState, useEffect } from 'react';
import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import { Button, Icon, message, Modal, Tooltip } from 'oss-ui';
import AuthButton from '@Components/auth-button';
import { FormInstance } from 'oss-ui/lib/form/index.js';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { VirtualTable } from 'oss-web-common';
import { blobDownLoad } from '@Common/utils/download';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import EditModel from './edit';
import { api, getColumns, AUTH_KEY, unsealFlagOptions } from '../utils';

export const TableIndex = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editType, setEditType] = useState('add');
    const [editRow, setEditRow] = useState({});
    const actionRef = useRef<ActionType>();
    const formRef = useRef<FormInstance>();
    const { userId, currentZone, frameInfo } = props.loginInfo;
    const { zoneId, zoneName } = currentZone;

    const [professionalTypeInitial, setProfessionalTypeInitial] = useState([]);
    const [loading, setLoading] = useState(true);
    /**
     * @description: 打开编辑弹窗
     * @param {标记} flag  add: 新建  edit:编辑  look:查看
     * @return {*}
     */
    const showModal = (flag, record) => {
        const newRecord = { ...record };
        if (record) {
            newRecord.professionId = record.professionId?.toString();
        }
        setEditRow(newRecord);
        setEditType(flag);
        setModalVisible(true);
        sendLogFn({ authKey: 'network-security-events:check' });
    };

    /**
     * 列表数据删除
     * @param recordId
     */
    const deleteRecord = (recordId) => {
        api.deleteRecord({ id: recordId })
            .then((res) => {
                if (res.code === 200) {
                    actionRef?.current?.reload();
                    message.success(`记录${recordId}删除成功`);
                } else {
                    message.error(`记录${recordId}删除失败`);
                }
            })
            .catch((error) => {
                message.warn('服务器繁忙，请稍后再试', error);
            });
    };

    /**
     * 列表数据导出
     */
    const exportData = () => {
        const fromValues = formRef.current?.getFieldsValue(true);

        const { pluggingTime2Search, professionName, ...params } = fromValues;
        sendLogFn({ authKey: 'network-security-events:export' });
        api.exportRecord({
            ...params,
            pluggingTimeStart: pluggingTime2Search[0],
            pluggingTimeEnd: pluggingTime2Search[1],
            professionIds: professionName,
            provinceId: zoneId,
        }).then((res) => {
            if (res) {
                blobDownLoad(res, `网络安全事件${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };
    /**
     * 打开删除确认框
     * @param recordId  记录ID
     */
    const showDeleteConfirm = (recordId) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '是否确认删除？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            width: '350px',
            onOk: () => {
                deleteRecord(recordId);
            },
            onCancel() {},
        });
    };
    const renderOptions = (text, record) => [
        <Tooltip key={1} title="编辑">
            <AuthButton key={1} onClick={_.partial(showModal, 'edit', record)} type="text" style={{ padding: 0 }} authKey={`${AUTH_KEY}:edit`}>
                <Icon type="EditOutlined" antdIcon />
            </AuthButton>
        </Tooltip>,
        <Tooltip key={3} title="查看">
            <Button key={3} onClick={_.partial(showModal, 'look', record)} type="text" style={{ padding: 0 }}>
                <Icon antdIcon type="SearchOutlined" />
            </Button>
        </Tooltip>,
        <Tooltip key={3} title="删除">
            <AuthButton key={3} onClick={_.partial(showDeleteConfirm, record.id)} type="text" style={{ padding: 0 }} authKey={`${AUTH_KEY}:delete`}>
                <Icon antdIcon type="DeleteOutlined" />
            </AuthButton>
        </Tooltip>,
    ];

    const getData = async (params) => {
        // 表单搜索项会从 params 传入，传递给后端接口。

        const { current, ...myParams } = _.cloneDeep(params);
        myParams.pageNum = current;
        if (!myParams.pluggingTimeStart) {
            myParams.pluggingTimeStart = dayjs().subtract(2, 'month').format('YYYY-MM-DD HH:mm:ss');
            myParams.pluggingTimeEnd = dayjs().format('YYYY-MM-DD HH:mm:ss');
        }

        return api
            .list(myParams)
            .then(
                (res) => {
                    // console.log('***********************55555555555555555555');
                    return { data: res.data || [], success: true, total: res.total || 0 };
                },
                (error) => {
                    message.error(error);
                    // console.log('***********************888', error);
                    return {
                        data: [],
                        success: false,
                        total: 0,
                    };
                },
            )
            .catch((e) => {
                message.error(e);
                return {
                    data: [],
                    success: false,
                    total: 0,
                };
            });
    };

    const dic = {
        professionDic: props.professionDic,
        unsealFlagDic: unsealFlagOptions,
        provinceDic: [{ label: zoneName, value: zoneId.toString() }],
        professionalTypeInitial,
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('professionalTypes')) {
            const professionalTypes = searchParams.get('professionalTypes').split(',');
            setProfessionalTypeInitial(professionalTypes);
            setLoading(false);
            formRef.current?.setFieldsValue({
                professionName: professionalTypes,
            });

            formRef.current?.submit();
        } else {
            getDefaultGroupByUser().then((res) => {
                setProfessionalTypeInitial(res.professionalTypes);
                setLoading(false);

                formRef.current?.setFieldsValue({
                    professionName: res.professionalTypes,
                });
                formRef.current?.submit();
            });
        }
    }, []);

    return (
        <>
            {!loading && (
                <VirtualTable
                    bordered
                    defaultCollapsed
                    global={window} // 必填项
                    columns={getColumns({ dic, renderOptions, professionalTypeInitial })}
                    params={{
                        provinceId: zoneId,
                    }}
                    request={getData}
                    rowKey={(record) => record.id}
                    size="small"
                    tableAlertOptionRender={false}
                    tableAlertRender={false}
                    options={{ reload: true, setting: true, fullScreen: false }}
                    form={{
                        align: 'left',
                        labelCol: { span: 6 },
                    }}
                    search={{
                        span: 6,
                    }}
                    toolBarRender={() => [
                        <AuthButton key={1} onClick={_.partial(showModal, 'add', null)} authKey={`${AUTH_KEY}:add`}>
                            <span>新增</span>
                        </AuthButton>,

                        <Button
                            key={1}
                            onClick={() => {
                                exportData();
                            }}
                        >
                            <span>导出</span>
                        </Button>,
                    ]}
                    actionRef={actionRef}
                    formRef={formRef}
                />
            )}
            {modalVisible && (
                <EditModel
                    visible={modalVisible}
                    editType={editType}
                    editRow={editRow}
                    refreshTable={actionRef.current?.reload}
                    onClose={() => {
                        setModalVisible(false);
                        setEditRow({});
                    }}
                    loginInfo={{ frameInfo, userId, zoneId, zoneName }}
                    dic={dic}
                />
            )}
        </>
    );
};
interface ActionType {
    reload: (resetPageIndex?: boolean) => void;
    reloadAndRest: () => void;
    reset: () => void;
    clearSelected?: () => void;
}
