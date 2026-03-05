import React, { useEffect, useRef, useState } from 'react';
import { VirtualTable } from 'oss-web-common';
import {
    getProvinceApi,
    getregionApi,
    professionalTypeApi,
    getRequsetApi,
    addDispatchManualConfigApi,
    editDispatchManualConfigApi,
    deleteDispatchManualConfigApi,
    publishDispatchManualConfigApi,
    networkTypeTopApi,
    modalTableApi,
} from './api';
import { Tooltip, Icon, Modal, Button, Form, Select, message, Table } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
// import { useParams } from 'react-router-dom';

interface optionsType {
    label: string;
    value: string;
}
interface IValueEnum {
    [key: string]: {
        text: string;
        status?: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
    };
}
interface columnsType {
    dataIndex: string;
    title: string;
    ellipsis?: boolean;
    hideInTable?: boolean;
    hideInSearch?: boolean;
    valueType?: string;
    initialValue?: any;
    order?: number;
    fieldProps?: {
        options?: optionsType[];
        onChange?: (e) => void;
        mode?: string;
    };
    valueEnum?: IValueEnum;
    render?: any;
}
const ManualOptions = [
    { label: '全部', value: '-1' },
    { label: '2.0', value: '0' },
    { label: '3.0', value: '1' },
];

const envirnmentOptions = [
    { label: '2.0和3.0', value: '0,1' },
    { label: '2.0', value: '0' },
    { label: '3.0', value: '1' },
];
interface getColumnsType {
    (provinceList: optionsType[], regionList: optionsType[], professionalList: optionsType[], networkTypeTopData: optionsType[], status: boolean);
}

const ManualDelivery = (props) => {
    const login = useLoginInfoModel();
    const { userId } = login;
    const [provinceData, setPrivnceData] = useState<optionsType[]>([]);
    const [regionData, setRegionData] = useState<optionsType[]>([{ label: '全部', value: '-1' }]);
    const [columns, setColumns] = useState<columnsType[]>([]);
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const [professionalData, setProfessionalData] = useState<optionsType[]>([]);
    const [visible, setVisible] = useState(false);
    const [fieldInfo, setFieldInfo] = useState({ title: '新增', id: '', field: {} });
    const [status, setStatus] = useState(false);
    const formRef: any = useRef(null);
    const formRefTable: any = useRef(null);
    const actionRef: any = useRef(null);
    const [networkTypeTopData, setNetworkTypeTopData] = useState<optionsType[]>([]);
    const [manualOptionsAdd, setManualOptionsAdd] = useState([{ label: '2.0', value: '0' }]);
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [manualDispatchSelectedRows, setManualDispatchSelectedRows] = useState<any>([]);
    const provinceChange = (value, field?: string | boolean) => {
        getRegionData(value);
        if (field === 'form') {
            formRef?.current.setFieldsValue({
                regionId: { label: '全部', value: '-1' },
            });
        }
    };
    const { configType } = props;
    const changeTableSelect = (val) => {
        console.log(val);
        formRef?.current.setFieldsValue({
            manualDispatchType: val[0],
        });
        setManualDispatchSelectedRows(val);
    };
    const getColumns: getColumnsType = (provinceList, regionList, professionalList, networkTypeTopList, statuss) => {
        setColumns([
            {
                dataIndex: 'status',
                title: '发布状态',
                ellipsis: true,
                valueType: 'select',
                hideInTable: true,
                initialValue: '0',
                order: 1,
                valueEnum: {
                    0: { text: '草稿' },
                    1: { text: '已发布' },
                },
            },

            {
                dataIndex: 'provinceId',
                title: '省份',
                ellipsis: true,
                hideInTable: true,
                valueType: 'select',
                initialValue: '-1',
                fieldProps: {
                    onChange: (e) => provinceChange(e),
                    options: provinceList,
                },
            },
            {
                dataIndex: 'networkTypeTop',
                title: '一级网络类型',
                ellipsis: true,
                hideInTable: true,
                valueType: 'select',
                initialValue: '-1',
                fieldProps: {
                    options: networkTypeTopList,
                },
            },

            {
                dataIndex: 'provinceName',
                title: '省份',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                dataIndex: 'regionName',
                title: '地市',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                dataIndex: 'professionalTypes',
                title: '专业',
                ellipsis: true,
                valueType: 'select',
                hideInTable: true,
                initialValue: ['-1'],
                fieldProps: {
                    mode: 'multiple',
                    options: professionalList,
                    onChange: (value) => professSearchChange(value),
                },
            },
            {
                dataIndex: 'professionalTypeNames',
                title: '专业',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                dataIndex: 'networkTypeTopName',
                title: '一级网络类型',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                dataIndex: 'environmentStatus',
                title: '环境状态',
                ellipsis: true,
                hideInSearch: true,
                valueEnum: {
                    '0,1': { text: '2.0和3.0' },
                    '0': { text: '2.0' },
                    '1': { text: '3.0' },
                },
            },
            {
                dataIndex: 'manualDispatchType',
                title: '手工派单环境',
                ellipsis: true,
                valueType: 'select',
                initialValue: '-1',
                order: 1,
                fieldProps: {
                    options: ManualOptions,
                },
            },
            {
                dataIndex: 'action',
                title: '操作',
                hideInSearch: true,
                render: (text, row) => [
                    <div>
                        <Tooltip title="编辑">
                            <Button disabled={statuss} style={{ padding: '3px 5px' }} type="text" onClick={() => editField(row)}>
                                {' '}
                                <Icon
                                    antdIcon
                                    key="search"
                                    type="EditOutlined"
                                    // onClick={this.searchDetails.bind(this, row)}
                                />
                            </Button>
                        </Tooltip>

                        <Tooltip title="删除">
                            <Button disabled={statuss} style={{ padding: '3px 5px' }} type="text" onClick={() => deleteField(row)}>
                                {' '}
                                <Icon antdIcon key="delete" type="DeleteOutlined" />
                            </Button>
                        </Tooltip>
                    </div>,
                ],
            },
        ]);
    };
    const getTableColumns = () => {
        setTableColumns([
            {
                dataIndex: 'manualDispatchUrl',
                title: '手工派单地址',
                ellipsis: true,
            },
            {
                dataIndex: 'sheetEchoUrl',
                title: '手工派单回显地址',
                ellipsis: true,
            },
            {
                dataIndex: 'remark',
                title: '备注',
                ellipsis: true,
            },
        ]);
    };
    const reloadRequest = () => {
        actionRef.current.reloadAndRest();
    };
    const editField = (row) => {
        setVisible(true);
        const professIds = row.professionalTypes.split(',');
        const professionalTypes = professionalData.filter((item) => professIds.includes(item.value));
        const manualDispatchTypeTable = [row.manualDispatchType];
        setFieldInfo({
            title: '编辑',
            id: row.dispatchManualConfigRelationId,
            field: {
                provinceId: { label: row.provinceName, value: row.provinceId },
                regionId: { label: row.regionName, value: row.regionId },
                professionalTypes: professionalTypes,
                environmentStatus: row.environmentStatus,
                manualDispatchType: row.manualDispatchType,
                networkTypeTop: { label: row.networkTypeTopName, value: row.networkTypeTop },
            },
        });
        setManualDispatchSelectedRows(manualDispatchTypeTable);
    };
    const deleteField = async (field) => {
        console.log(field);
        const result = await deleteDispatchManualConfigApi({ dispatchManualConfigRelationId: field.dispatchManualConfigRelationId, configType });
        if (result) {
            reloadRequest();
        }
    };
    const getProvinceData = async () => {
        const result = await getProvinceApi(userId);
        if (result.data) {
            const data = result.data.map((item) => {
                return {
                    value: item.key,
                    label: item.value,
                };
            });
            setPrivnceData([{ label: '全部', value: '-1' }, ...data]);
        }
    };
    const getRegionData = async (value) => {
        const result = await getregionApi(value, userId);
        if (result) {
            const data = result.map((item) => {
                return {
                    value: item.regionId,
                    label: item.regionName,
                };
            });
            setRegionData([{ label: '全部', value: '-1' }, ...data]);
        }
    };
    const getProfessionalTypeData = async () => {
        const result = await professionalTypeApi(userId);
        if (result.data) {
            const data = result.data.map((item) => {
                return {
                    value: item.key,
                    label: item.value,
                };
            });
            setProfessionalData([{ label: '全部', value: '-1' }, ...data]);
        }
    };
    const getNetworkTypeTopData = async () => {
        const result = await networkTypeTopApi(userId);
        if (result.data) {
            const data = result.data.map((item) => {
                return {
                    value: item.key,
                    label: item.value,
                };
            });
            setNetworkTypeTopData([{ label: '全部', value: '-1' }, ...data]);
        }
    };
    const getModalTableData = async () => {
        const result = await modalTableApi(configType);
        if (result.data) {
            setTableData(result.data || []);
        }
    };
    useEffect(() => {
        getProvinceData();
        getProfessionalTypeData();
        getNetworkTypeTopData();
        getModalTableData();
    }, []);
    const getRequestData = async (params) => {
        const data = formRefTable?.current.getFieldsValue();

        params = {
            configType,
            ...params,
            ...data,
        };
        console.log(params);
        if (params?.manualDispatchType === '-1') {
            delete params.manualDispatchType;
        }
        if (params?.regionId === '-1') {
            delete params.regionId;
        }
        if (params?.provinceId === '-1') {
            delete params.provinceId;
        }
        if (params?.provinceId === '-1') {
            delete params.provinceId;
        }
        if (params?.professionalTypes === '-1' || params.professionalTypes === '' || params.professionalTypes.length === 0) {
            delete params.professionalTypes;
        } else {
            params.professionalTypes = params.professionalTypes.join(',');
        }
        if (params?.networkTypeTop === '-1') {
            delete params.networkTypeTop;
        }
        if (params.status === '1') {
            setStatus(true);
        } else {
            params.status = 0;
            setStatus(false);
        }
        const result = await getRequsetApi(params);

        return {
            success: true,
            total: result?.total || 0,
            data: result?.data || [],
        };
    };
    useEffect(() => {
        getColumns(provinceData, regionData, professionalData, networkTypeTopData, status);
        getTableColumns();
    }, [provinceData, regionData, professionalData, status, networkTypeTopData]);
    const add = () => {
        setVisible(true);
        setFieldInfo({
            title: '新增',
            id: '',
            field: {
                provinceId: undefined,
                networkTypeTop: undefined,
                regionId: { label: '全部', value: '-1' },
                professionalTypes: [{ label: '全部', value: '-1' }],
                environmentStatus: '0,1',
                manualDispatchType: undefined,
            },
        });
    };
    const envirnmentChange = (value) => {
        if (value === '0' || value === '1') {
            formRef.current.setFieldsValue({
                manualDispatchType: value,
            });
            setManualOptionsAdd(ManualOptions.filter((item) => item.value === value));
        } else {
            formRef.current.setFieldsValue({
                manualDispatchType: '0',
            });
            setManualOptionsAdd(ManualOptions.filter((item) => item.value === '0'));
        }
    };
    const onSave = () => {
        formRef.current.validateFields().then(async (value) => {
            console.log(value);
            let data = {
                configType,
                environmentStatus: value.environmentStatus,
                manualDispatchType: value.manualDispatchType,
                professionalTypeNames: value.professionalTypes?.map((item) => item.label)?.join(',') || '',
                professionalTypes: value.professionalTypes?.map((item) => item.value).join(',') || '',
                provinceId: value.provinceId.value,
                networkTypeTop: value.networkTypeTop.value,
                networkTypeTopName: value.networkTypeTop.label,
                provinceName: value.provinceId.label,
                regionId: value.regionId.value,
                regionName: value.regionId.label,
            };
            let result: any = null;
            if (fieldInfo.id) {
                result = await editDispatchManualConfigApi({
                    ...data,
                    configType,
                    dispatchManualConfigRelationId: fieldInfo.id,
                });
            } else {
                result = await addDispatchManualConfigApi(data);
            }
            if (result) {
                setVisible(false);
                onCancel();
                message.success('保存成功');
                reloadRequest();
            }
        });
    };
    const onCancel = () => {
        setVisible(false);
        setManualOptionsAdd(ManualOptions.filter((item) => item.value !== '-1'));
        setManualDispatchSelectedRows([]);
        formRef.current.setFieldsValue({
            provinceId: undefined,
            networkTypeTop: undefined,
            regionId: { label: '全部', value: '-1' },
            professionalTypes: [{ label: '全部', value: '-1' }],
            environmentStatus: '0,1',
            manualDispatchType: undefined,
        });
    };
    const professSearchChange = (value) => {
        console.log(value);
        if (value.length > 1 && value[value.length - 1] !== '-1') {
            if (value.find((item) => item === '-1')) {
                formRefTable.current.setFieldsValue({
                    professionalTypes: value.filter((item) => item !== '-1'),
                });
            }
        } else {
            if (value.find((item) => item === '-1')) {
                formRefTable.current.setFieldsValue({
                    professionalTypes: ['-1'],
                });
            }
        }
    };
    const professChange = (value) => {
        if (value.length > 1 && value[value.length - 1]?.value !== '-1') {
            if (value.find((item) => item.value === '-1')) {
                formRef.current.setFieldsValue({
                    professionalTypes: value.filter((item) => item.value !== '-1'),
                });
            }
        } else {
            if (value.find((item) => item.value === '-1')) {
                formRef.current.setFieldsValue({
                    professionalTypes: [{ label: '全部', value: '-1' }],
                });
            }
        }
    };
    const publish = async () => {
        const result = await publishDispatchManualConfigApi(configType);
        if (result.data) {
            formRefTable?.current.setFieldsValue({
                status: '1',
            });
            // setStatus(true);
            reloadRequest();
            message.success('发布成功');
        }
    };
    const batchDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warn('数据不能为空');
            return;
        }
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: `此操作将永久删除选中项，是否继续操作？`,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: async () => {
                const result = await deleteDispatchManualConfigApi({ dispatchManualConfigRelationId: selectedRowKeys.join(','), configType });
                if (result) {
                    message.success('删除成功');
                    reloadRequest();
                }
            },
            onCancel() {},
        });
    };
    const deleteChange = (data) => {
        setselectedRowKeys(data);
    };
    return (
        <div className="automatic-dispatch-page" style={{ height: '100%' }}>
            <VirtualTable
                actionRef={actionRef}
                formRef={formRefTable}
                // params={{ status: status ? '1' : '0' }}
                rowKey="dispatchManualConfigRelationId"
                toolBarRender={() => [
                    <Button
                        onClick={() => {
                            publish();
                        }}
                    >
                        <Icon antdIcon type="PlusOutlined" />
                        一键发布
                    </Button>,
                    <Button
                        onClick={() => {
                            add();
                        }}
                    >
                        <Icon antdIcon type="PlusOutlined" />
                        新增
                    </Button>,
                    <Button
                        onClick={() => {
                            batchDelete();
                        }}
                        disabled={status}
                    >
                        <Icon antdIcon type="DeleteOutlined" />
                        批量删除
                    </Button>,
                ]}
                columns={columns}
                request={getRequestData}
                global={window}
                rowSelection={{
                    selectedRowKeys,
                    onChange: deleteChange,
                }}
            />
            <Modal
                destroyOnClose
                wrapClassName="dispatch-setting-modal-manual"
                onCancel={onCancel}
                onOk={onSave}
                visible={visible}
                title={fieldInfo.title}
            >
                <Form initialValues={fieldInfo.field} ref={formRef} labelAlign="right" labelCol={{ span: 6 }}>
                    <Form.Item required label="省份" name="provinceId" rules={[{ required: true, message: '省份不能为空' }]}>
                        <Select
                            labelInValue
                            onChange={(field) => provinceChange(field.value, 'form')}
                            options={provinceData.filter((item) => item.value !== '-1')}
                        />
                    </Form.Item>
                    <Form.Item required label="地市" rules={[{ required: true, message: '地市不能为空' }]} name="regionId">
                        <Select labelInValue options={regionData} />
                    </Form.Item>
                    <Form.Item required label="专业" rules={[{ required: true, message: '专业不能为空' }]} name="professionalTypes">
                        <Select labelInValue mode="multiple" onChange={(value) => professChange(value)} options={professionalData} />
                    </Form.Item>
                    <Form.Item required label="一级网络类型" rules={[{ required: true, message: '网络类型不能为空' }]} name="networkTypeTop">
                        <Select labelInValue options={networkTypeTopData.filter((item) => item.value !== '-1')} />
                    </Form.Item>
                    <Form.Item required label="环境状态" rules={[{ required: true, message: '环境状态不能为空' }]} name="environmentStatus">
                        <Select onChange={(field) => envirnmentChange(field)} options={envirnmentOptions} />
                    </Form.Item>
                    <Form.Item required label="手工派单环境" rules={[{ required: true, message: '手工派单环境不能为空' }]} name="manualDispatchType">
                        {/* <Select options={manualOptionsAdd} /> */}
                        <Table
                            dataSource={tableData}
                            columns={tableColumns}
                            rowKey="manualDispatchType"
                            rowSelection={{
                                type: 'radio',
                                hideSelectAll: true,
                                onChange: (val) => changeTableSelect(val),
                                selectedRowKeys: manualDispatchSelectedRows || [],
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ManualDelivery;
