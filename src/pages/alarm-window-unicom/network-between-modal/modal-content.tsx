import moment from 'moment';
import { useSetState } from 'ahooks';
import React, { useEffect, useState, useRef } from 'react';
import { Space, Tooltip, Button, Icon, Modal, Form, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import useLoginInfoModel from '@Src/hox';
import { useAuth } from '@Src/hooks';
import { tableColumns } from './columns';
import ModalEdit from './modal-edit';
import * as Api from './api';
import { authData } from './auth';
import './index.less';

const ModalContent = (props: any) => {
    const { currentZone, zoneLevelFlags, userId, userZoneInfo } = useLoginInfoModel();
    const { isHasAuth } = useAuth();
    const isRemarkReport = isHasAuth(authData.remarkReport);
    let isDisabled = currentZone.zoneId !== userZoneInfo.zoneId;

    if (zoneLevelFlags.isCityZone) {
        isDisabled = false;
    }

    const { viewData } = props;
    const actionRef = useRef<any>();
    const [formState, setFormState] = useState<any>({
        visible: false,
        visibleMode: null,
    });
    const [form] = Form.useForm();
    const [enums, setEnums] = useSetState({
        networkTypeOptions: [],
        provinceList: [],
    });
    const modalTitleMap = {
        create: '新增',
        edit: '编辑',
        view: '查看',
    };

    const updateTableData = () => {
        actionRef.current.reload();
    };
    const getNotesPageListData = async (value: any) => {
        const { current, pageSize, intraProfessionalTypeCn, createTime, provinceName, notes, creator } = value || {};
        console.log(value, 'value');
        const params = {
            current,
            intraProfessionalTypeList: intraProfessionalTypeCn || [viewData.professionalId],
            notes,
            pageSize,
            provinceIdList: provinceName || [Number(currentZone.zoneId)],
            reportTimeBegin: createTime ? createTime?.[0] : moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            reportTimeEnd: createTime ? createTime?.[1] : moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            reporter: creator,
        };

        if (params.provinceIdList.length === 0) {
            params.provinceIdList = [Number(currentZone.zoneId)];
        }
        const res = await Api.getNotesPageListApi(params);

        if (res.code === 200) {
            return {
                data: res.data,
                total: res.total,
            };
        }
        return { data: [], total: 0 };
    };
    const onCreate = () => {
        const value = {
            provinceId: +currentZone.zoneId,
            intraProfessionalType: viewData.professionalId,
        };
        form.setFieldsValue(value);
        setFormState({ visible: true, visibleMode: 'create' });
    };
    const onEdit = (record: any) => {
        const value = {
            provinceId: record.provinceId,
            intraProfessionalType: String(record.intraProfessionalType),
            notes: record.notes,
            id: record.id,
        };
        form.setFieldsValue(value);
        setFormState({ visible: true, visibleMode: 'edit' });
    };

    const onModalCancel = () => {
        form.resetFields();
        setFormState({ visible: false, visibleMode: null });
    };

    const onView = (record) => {
        const value = {
            provinceId: record.provinceId,
            intraProfessionalType: String(record.intraProfessionalType),
            notes: record.notes,
        };
        form.setFieldsValue(value);
        setFormState({ visible: true, visibleMode: 'view' });
    };

    const onDelete = async (record: any) => {
        Modal.confirm({
            content: '是否确认删除该条数据？',
            onOk: async () => {
                const res = await Api.deleteNotesApi({ id: record.id });
                if (res.code === 200) {
                    message.success('数据删除成功');
                    updateTableData();
                }
            },
        });
    };

    const onEditSubmit = async () => {
        const values = await form.validateFields();
        const { provinceId, intraProfessionalType, notes, id } = values || {};
        const params: any = {
            provinceId,
            intraProfessionalType,
            notes,
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            creator: userId,
        };

        let apiFun: any;

        if (formState.visibleMode === 'create') {
            apiFun = Api.addNotesApi;
        }
        if (formState.visibleMode === 'edit') {
            params.modifier = userId;
            params.id = id;
            delete params.createTime;
            delete params.creator;
            apiFun = Api.updateNotesApi;
        }
        const res = await apiFun(params);

        if (res.code === 200) {
            if (formState.visibleMode === 'create') {
                message.success('新增成功');
            }
            if (formState.visibleMode === 'edit') {
                message.success('修改成功');
            }

            onModalCancel();
            updateTableData();
        } else {
            message.error(res.message);
        }
    };

    const getAllZonesList = async () => {
        const res = await Api.getAllZones();
        const temp1 = res?.['_embedded']?.zoneResourceList;
        if (zoneLevelFlags.isCountryZone) {
            setEnums({ provinceList: temp1.filter((item) => [1].includes(item.zoneLevel)) });
        } else if (zoneLevelFlags.isRegionZone) {
            setEnums({ provinceList: temp1.filter((item) => item.zoneId === Number(currentZone.zoneId)) });
        } else if (zoneLevelFlags.isProvinceZone) {
            setEnums({ provinceList: temp1.filter((item) => item.zoneId === Number(currentZone.zoneId)) });
        } else if (zoneLevelFlags.isCityZone) {
            setEnums({ provinceList: temp1.filter((item: any) => item.parentZoneId === Number(currentZone.zoneId)) });
        }
    };
    const getEnumsList = async () => {
        const res = await Api.getEnumApi(['intraProfessionalType']);
        const options = res.data.intraProfessionalType.map((el) => {
            return { label: el.value, value: el.key };
        });
        setEnums({ networkTypeOptions: options });
    };

    useEffect(() => {
        getAllZonesList();
        getEnumsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const operationRender = (_: string, record: any) => {
        return (
            <Space>
                {isRemarkReport ? (
                    <>
                        <Tooltip title="编辑" key="edit">
                            <Button type="text" style={{ padding: 0 }} onClick={() => onEdit(record)} disabled={isDisabled}>
                                <Icon antdIcon type="EditOutlined" />
                            </Button>
                        </Tooltip>
                        <Tooltip title="删除" key="delete">
                            <Button type="text" style={{ padding: 0 }} onClick={() => onDelete(record)} disabled={isDisabled}>
                                <Icon antdIcon type="DeleteOutlined" />
                            </Button>
                        </Tooltip>
                    </>
                ) : null}

                <Tooltip title="查看" key="show">
                    <Button type="text" style={{ padding: 0 }} onClick={() => onView(record)}>
                        <Icon antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>
            </Space>
        );
    };

    const columns = tableColumns({
        operationRender,
        enums,
        initProvinceValue: [Number(currentZone.zoneId)],
        initIntraProfessionalType: [viewData.professionalId],
    });

    return (
        <>
            <div className="network-between-modal">
                <VirtualTable
                    size="small"
                    columns={columns}
                    global={window}
                    actionRef={actionRef}
                    request={getNotesPageListData}
                    search={{ span: 4 }}
                    toolBarRender={() => [
                        isRemarkReport && (
                            <Button key="create" onClick={onCreate} disabled={isDisabled}>
                                新建
                            </Button>
                        ),
                    ]}
                />
            </div>
            <Modal
                title={modalTitleMap[formState.visibleMode]}
                width={1000}
                visible={formState.visible}
                onCancel={onModalCancel}
                className="custom-window-network-between-modal"
                footer={
                    <div className="modal-footer">
                        {formState.visibleMode !== 'view' && (
                            <Button type="primary" onClick={onEditSubmit}>
                                保存
                            </Button>
                        )}
                        <Button onClick={onModalCancel}>取消</Button>
                    </div>
                }
            >
                <ModalEdit enums={enums} form={form} mode={formState.visibleMode} />
            </Modal>
        </>
    );
};
export default ModalContent;
