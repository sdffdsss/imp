import { Modal, message, Tooltip, Button, Icon, Form, Input, DatePicker, Select, Row, Col, Table, Space } from 'oss-ui';
import AuthButton from '@Pages/components/auth/auth-button';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import React, { FC, useState, useEffect, useRef } from 'react';
import { postCutoverList, postMajorEnum, exportCutoverReport, deleteById } from '../api';
import { ALL_ENUMS, ActionType } from '../type';
import { blobDownLoad } from '@Src/common/utils/download';
import { useColumnsState } from '@Src/hooks';
import getColumns from './columns';
import { authData } from '../auth';
import ModalPlan from './modal';
import ModalView from './modal-view';
import ModalAlarm from './modal-alarm';

interface Props {}

const Transmission: FC<Props> = () => {
    const formRef: any = useRef();
    const tableRef = useRef<ActionType>();
    const { provinceId } = useLoginInfoModel();
    const [editType, setEditType] = useState('new');
    const [initialValues, setInitialValues] = useState(null);
    const [enums, setEnums] = useState<ALL_ENUMS>({});
    const [visible, setVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [alarmVisible, setAlarmVisible] = useState(false);
    const [planDetail, setPlanDetail] = useState(null);
    const columnsState = useColumnsState({ configType: 29 });

    const getEnums = async () => {
        const professionalEnum = await postMajorEnum(['dutyProfessional']);
        setEnums({
            professionalEnum: professionalEnum?.data?.dutyProfessional || [],
        });
    };

    useEffect(() => {
        getEnums();
    }, []);

    const getList = async (params, sort) => {
        const newSort = {
            orderFieldName: Object.keys(sort)[0],
            orderType: sort[Object.keys(sort)[0]],
        };
        const formData = formRef.current.getFieldsValue(true); // 防止初次请求获取不到 initialValue 的问题
        const allParams = {
            ...formData,
            ...params,
            ...newSort,
        };
        const res = await postCutoverList({ ...allParams });
        if (res.code === 200) {
            return {
                data: res.data || [],
                success: true,
                total: res.total,
            };
        }
        return {
            data: [],
            success: false,
            total: 0,
        };
    };

    // 删除列表项
    const deleteClick = (row) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认删除?',
            onOk: async () => {
                try {
                    const res = await deleteById({ id: row?.id });
                    if (res.code === 200) {
                        message.success('删除成功');
                        tableRef.current?.reload();
                    } else {
                        message.error('删除失败');
                    }
                } catch {
                    message.error('接口错误');
                }
            },
            onCancel() {},
        });
    };

    // 表格配置
    const columns = getColumns({
        deleteClick,
        provinceId,
        enums,
    });
    const editClick = (row) => {
        setEditType('edit');
        setInitialValues({
            ...row,
            planStartTime: row.planStartTime ? moment(row.planStartTime) : null,
            planEndTime: row.planEndTime ? moment(row.planEndTime) : null,
            cutoverStartTime: row.cutoverStartTime ? moment(row.cutoverStartTime) : null,
            cutoverEndTime: row.cutoverEndTime ? moment(row.cutoverEndTime) : null,
        });
        setVisible(true);
    };
    const downloadClick = (row) => {
        exportCutoverReport({
            id: row?.id,
        }).then((res) => {
            blobDownLoad(res, `割接报告${moment().format('YYYYMMDDHHmmss')}.xlsx`);
        });
    };
    const actionColumn = {
        title: '操作',
        dataIndex: 'actions',
        hideInSearch: true,
        align: 'center',
        render: (_, row) => (
            <Space>
                <Tooltip title="编辑" key="edit">
                    <AuthButton authKey={authData.edit} type="text" style={{ padding: 0 }} onClick={() => editClick(row)}>
                        <Icon antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>
                <Tooltip title="删除" key="delete">
                    <AuthButton authKey={authData.delete} type="text" style={{ padding: 0 }} onClick={() => deleteClick(row)}>
                        <Icon antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>
                <Tooltip title="查看告警视图" key="show">
                    <Button
                        type="text"
                        onClick={() => {
                            setPlanDetail(row);
                            setAlarmVisible(true);
                        }}
                        style={{ padding: 0 }}
                    >
                        <Icon antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>
                <Tooltip title="导出割接报告" key="down" onClick={() => downloadClick(row)}>
                    <Button type="text" style={{ padding: 0 }}>
                        <Icon antdIcon type="DownloadOutlined" />
                    </Button>
                </Tooltip>
            </Space>
        ),
    };

    return (
        <div style={{ height: '100%' }}>
            <VirtualTable
                global={window}
                columns={columns.concat(actionColumn)}
                request={getList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
                columnsState={columnsState}
                toolBarRender={() => [
                    <AuthButton
                        authKey={authData.cutoverViewManage}
                        onClick={() => {
                            setViewVisible(true);
                        }}
                    >
                        割接视图管理
                    </AuthButton>,
                    <AuthButton
                        authKey={authData.addCutoverPlan}
                        type="primary"
                        onClick={() => {
                            setEditType('new');
                            setInitialValues(null);
                            setVisible(true);
                        }}
                    >
                        新增割接计划
                    </AuthButton>,
                ]}
            />
            <ModalPlan
                visible={visible}
                mode={editType}
                onCancel={() => setVisible(false)}
                width={900}
                bodyStyle={{ padding: '16px 30px' }}
                title="割接计划"
                contentProps={{ initialValues }}
                destroyOnClose
                onOk={() => {
                    setVisible(false);
                    tableRef.current?.reload();
                }}
            />
            <ModalView destroyOnClose visible={viewVisible} onCancel={() => setViewVisible(false)} width={1000} title="割接视图" contentProps={{}} />
            <ModalAlarm
                destroyOnClose
                visible={alarmVisible}
                contentProps={{ planDetail }}
                onCancel={() => setAlarmVisible(false)}
                width={600}
                title="选择视图"
            />
        </div>
    );
};

export default Transmission;
