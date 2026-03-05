import { Button, Icon, ProTable, Modal, Spin, Select, Tooltip, message, DatePicker } from 'oss-ui';
import React, { useEffect, useRef, useState } from 'react';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import ViewModal from './compontent/view-modal';
import './index.less';
import { ModalType, DictByFieldNameKey } from './types';
import {
    QueryReinsuranceRecordsRequest,
    QueryReinsuranceRecordsResponse,
    BatchGetDictByFieldNameResponse,
    QueryDetailData,
    QueryDetail,
} from './api-types';
import {
    BatchGetDictByFieldName,
    QueryReinsuranceRecords,
    ExportReinsuranceRecords,
    QueryReinsuranceRecordDetail,
    DeleteReinsuranceRecordDetail,
} from './api';
import useLoginInfoModel from '@Src/hox';
import { blobDownLoad } from '@Common/utils/download';
import AuthButton from '@Components/auth-button';
import moment from 'moment';
import { getZonesNormalCase } from '@Common/utils/commonProvincesList';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';

interface IRecordProps {}

function transferValueEnum(
    data: Array<{
        key: string;
        value: any;
    }> = [],
) {
    let obj = {};
    for (let i = 0; i < data.length; i++) {
        obj[data[i]?.key] = data[i]?.value;
    }
    return obj;
}

const Record: React.FC<IRecordProps> = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [spinLoading, setSpinLoading] = useState<boolean>(true);
    const [modalVisabled, setModalVisabled] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.CREATE);
    const [rowDetail, setRowDetail] = useState<QueryDetail | undefined>();
    const [dictByFieldNameList, setDictByFieldNameList] = useState<
        Partial<{
            [key in DictByFieldNameKey]: Array<{
                key: string;
                value: any;
            }>;
        }>
    >({});
    const [provinceList, setProvinceList] = useState<Array<any>>([]);

    const [allowClick, setAllowClick] = useState(true);
    const { dutyManagerProfession = [], dutyManagerReinsuranceLevel = [], dutyManagerReinsuranceUrgency = [] } = dictByFieldNameList;

    const { userInfo, systemInfo } = useLoginInfoModel.data;
    const login = useLoginInfoModel();
    const { provinceId } = login;
    const [professionInit, setProfessionInit] = useState([]);

    // 初始化columns
    const columnsInitValue = {
        dutyManagerProfession: professionInit,
        dutyManagerReinsuranceLevel: dutyManagerReinsuranceLevel.map((item) => item.key),
        dutyManagerReinsuranceUrgency: dutyManagerReinsuranceUrgency.map((item) => item.key),
        reinsuranceStartTimeRagne: [moment().subtract(2, 'month').startOf('day'), moment().startOf('day')],
        provinceId: provinceId,
    };

    const ref = useRef<any>(null);
    const actionRef = useRef<any>(null);
    const refValue = ref?.current?.getFieldsValue();
    const dateFormat = 'YYYY-MM-DD';
    const dateFormatStartTime = `${dateFormat} 00:00:00`;
    const dateFormatEndTime = `${dateFormat} 23:59:59`;

    const handleSearch = async (
        param,
    ): Promise<{
        success: boolean;
        total: number;
        data: QueryDetailData[];
    }> => {
        setLoading(true);

        const params: QueryReinsuranceRecordsRequest = {
            startTime: param?.reinsuranceStartTimeRagne?.length > 0 ? moment(param?.reinsuranceStartTimeRagne[0]).format(dateFormatStartTime) : '',
            endTime: param?.reinsuranceStartTimeRagne?.length > 1 ? moment(param?.reinsuranceStartTimeRagne[1]).format(dateFormatEndTime) : '',
            provinceId: param.provinceId,
            specialtys: param?.professionTypeName.includes('-1') ? [] : param?.professionTypeName, // 专业
            topic: param?.topic || null,
            applicationDepartment: param?.applicationDepartment || null,
            reinsuranceLevels: param?.reinsuranceLevelName, // 重保级别
            urgencies: param?.urgencyName, // 紧急程度
            pageSize: param?.pageSize,
            pageNum: param?.current,
        };
        const res: QueryReinsuranceRecordsResponse = await QueryReinsuranceRecords(params);
        setLoading(false);
        if (res.code !== 200) {
            return {
                success: false,
                data: [],
                total: 0,
            };
        }
        return {
            success: true,
            total: res.total,
            data: res?.data || [],
        };
    };

    const getDetail = async (applicationNumber) => {
        // 如果是非创建 并且 有id，则发起请求
        if (applicationNumber) {
            const res = await QueryReinsuranceRecordDetail({ applicationNumber });
            if (res.code === 200) {
                setRowDetail(res.data);
                setModalVisabled(true);
                setAllowClick(true);
            }
        }
    };

    const handleEdit = (itemRecord): void => {
        setModalType(ModalType.EDIT);
        setAllowClick(false);
        getDetail(itemRecord?.applicationNumber);
    };

    const handleCreate = (): void => {
        setModalVisabled(true);
        setModalType(ModalType.CREATE);
    };

    const handleDelete = async (itemRecord): Promise<void> => {
        console.log('===edel record==', itemRecord);
        const res = await DeleteReinsuranceRecordDetail({ applicationNumber: itemRecord?.applicationNumber });
        if (res.code === 200) {
            message.success(res.message);
            // actionRef.current.reloadAndRest();
            actionRef.current.reload();
        }
    };

    const handleView = (itemRecord): void => {
        setModalType(ModalType.VIEW);
        setAllowClick(false);
        getDetail(itemRecord?.applicationNumber);
        sendLogFn({ authKey: 'reinsurance-record:check' });
    };

    const handleExport = async (param): Promise<void> => {
        const params: QueryReinsuranceRecordsRequest = {
            startTime: param?.reinsuranceStartTimeRagne?.length > 0 ? moment(param?.reinsuranceStartTimeRagne[0]).format(dateFormatStartTime) : '',
            endTime: param?.reinsuranceStartTimeRagne?.length > 1 ? moment(param?.reinsuranceStartTimeRagne[1]).format(dateFormatEndTime) : '',
            provinceId: param.provinceId,
            professionTypes: param?.professionTypeName, //专业
            topic: param?.topic || null,
            applicationDepartment: param?.applicationDepartment || null,
            reinsuranceLevels: param?.reinsuranceLevelName, // 重保级别
            urgencies: param?.urgencyName, // 紧急程度
        };
        sendLogFn({ authKey: 'reinsurance-record:export' });
        const res = await ExportReinsuranceRecords(params);

        blobDownLoad(res, `重保记录${moment().format('YYYYMMDDHHmmss')}.xlsx`);
    };
    const onModal = (itemRecord): void => {
        Modal.confirm({
            icon: <Icon antdIcon={true} type="WarningOutlined" style={{ color: '#faad14' }}></Icon>,
            content: `${itemRecord.topic},确认删除吗？`,
            okText: '删除',
            title: '提示',
            onOk() {
                handleDelete(itemRecord);
            },
        });
    };

    useEffect(() => {
        (async (): Promise<void> => {
            // 获取配置
            const res: BatchGetDictByFieldNameResponse = await BatchGetDictByFieldName([
                'dutyManagerProfession',
                'dutyManagerReinsuranceLogo',
                'dutyManagerReinsuranceType',
                'dutyManagerReinsuranceLevel',
                'dutyManagerReinsuranceUrgency',
            ]);
            if (res.code === 200) {
                setDictByFieldNameList(res.data);

                const searchParams = new URLSearchParams(window.location.search);

                if (searchParams.has('professionalTypes')) {
                    const professionalTypes = searchParams.get('professionalTypes').split(',');
                    setProfessionInit(professionalTypes);
                } else {
                    const res1 = await getDefaultGroupByUser();
                    setProfessionInit(res1.professionalTypes);
                }
                setSpinLoading(false);
            }

            const info = userInfo && JSON.parse(userInfo);
            getZonesNormalCase(info?.zones[0], systemInfo?.currentZone).then((res) => {
                setProvinceList(res);
            });
        })();
    }, []);

    const columns: any = [
        {
            title: '流水号',
            dataIndex: 'applicationNumber',
            key: 'applicationNumber',
            search: false,
            align: 'center',
        },
        {
            title: '申请部门',
            dataIndex: 'applicationDepartment',
            key: 'applicationDepartment',
            align: 'center',
            disable: true,
        },
        {
            title: '省份',
            dataIndex: 'provinceId',
            key: 'provinceId',
            align: 'center',
            search: true,
            // hideInTable: true,
            initialValue: columnsInitValue.provinceId,
            renderFormItem: () => {
                return (
                    <Select disabled>
                        {provinceList.map((item) => {
                            return (
                                <Select.Option value={item.zoneId} key={item.zoneId} label={item.zoneName}>
                                    {item.zoneName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
            render(text: string, record) {
                return record.provinceName;
            },
        },
        // {
        //     title: '省份',
        //     dataIndex: 'provinceName',
        //     key: 'provinceName',
        //     align: 'center',
        //     search: false,
        //     renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        //         if (type === 'form') {
        //             return null;
        //         }
        //         return <Input {...rest} disabled />;
        //     },
        // },
        {
            title: '专业',
            dataIndex: 'professionTypeName',
            key: 'professionTypeName',
            multiple: true,
            initialValue: columnsInitValue.dutyManagerProfession,
            valueEnum: transferValueEnum([{ key: '-1', value: '全部' }, ...dutyManagerProfession]),
            align: 'center',
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
                if (type === 'form') {
                    return null;
                }

                return (
                    <Select
                        {...rest}
                        options={[{ label: '全部', value: '-1' }, ...(rest.options?.slice(0, -1) || [])]}
                        mode="multiple"
                        optionFilterProp="label"
                        maxTagCount="responsive"
                    />
                );
            },
        },
        {
            title: '主题',
            dataIndex: 'topic',
            key: 'topic',
            align: 'center',
        },
        {
            title: '记录人',
            dataIndex: 'recorder',
            key: 'recorder',
            align: 'center',
            search: false,
        },
        {
            title: '重保级别',
            dataIndex: 'reinsuranceLevelName',
            key: 'reinsuranceLevelName',
            initialValue: columnsInitValue.dutyManagerReinsuranceLevel,
            valueType: 'checkbox',
            valueEnum: transferValueEnum(dutyManagerReinsuranceLevel),
            align: 'center',
        },
        {
            title: '紧急程度',
            dataIndex: 'urgencyName',
            key: 'urgencyName',
            valueType: 'checkbox',
            initialValue: columnsInitValue.dutyManagerReinsuranceUrgency,
            valueEnum: transferValueEnum(dutyManagerReinsuranceUrgency),
            align: 'center',
        },
        {
            title: '重保开始时间',
            dataIndex: 'reinsuranceStartTimeRagne',
            key: 'reinsuranceStartTimeRagne',
            align: 'center',
            valueType: 'dateTimeRange',
            initialValue: columnsInitValue.reinsuranceStartTimeRagne,
            hideInTable: true,
            renderFormItem: () => {
                return <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} format={dateFormat} />;
            },
        },
        {
            title: '重保开始时间',
            dataIndex: 'reinsuranceStartTime',
            key: 'reinsuranceStartTime',
            align: 'center',
            search: false,
        },
        {
            title: '重保结束时间',
            dataIndex: 'reinsuranceEndTime',
            key: 'reinsuranceEndTime',
            align: 'center',
            search: false,
        },
        {
            title: '操作',
            key: 'operate',
            fixed: 'right',
            align: 'center',
            search: false,
            width: 80,
            render: (text, record) => (
                <>
                    <Tooltip title="编辑">
                        <AuthButton
                            onClick={() => allowClick && handleEdit(record)}
                            type="text"
                            style={{ padding: 0 }}
                            authKey="reinsurance-record:edit"
                        >
                            <span className="reinsurance-record-content-edit-icon">
                                <Icon antdIcon={true} type="EditOutlined" />
                            </span>
                        </AuthButton>
                    </Tooltip>
                    <Tooltip title="删除">
                        <AuthButton onClick={() => onModal(record)} type="text" style={{ padding: 0 }} authKey="reinsurance-record:delete">
                            <span className="reinsurance-record-content-edit-icon">
                                <Icon antdIcon={true} type="DeleteOutlined" />
                            </span>
                        </AuthButton>
                    </Tooltip>
                    <Tooltip title="查看">
                        <span onClick={() => allowClick && handleView(record)} className="reinsurance-record-content-view-icon">
                            <Icon antdIcon={true} type="SearchOutlined" />
                        </span>
                    </Tooltip>
                </>
            ),
        },
    ];
    return (
        <div>
            <Spin spinning={spinLoading}>
                {!spinLoading && (
                    <ProTable
                        columns={columns}
                        loading={loading}
                        scroll={{ x: 1300 }}
                        formRef={ref}
                        actionRef={actionRef}
                        request={async (params, sort, filter) => {
                            const res = await handleSearch(params);
                            return {
                                ...res,
                            };
                        }}
                        toolBarRender={(_, { selectedRowKeys }) => [
                            <AuthButton
                                authKey={'reinsurance-record:add'}
                                icon={<Icon antdIcon={true} type="PlusOutlined" />}
                                type="primary"
                                ghost
                                onClick={handleCreate}
                            >
                                {'新建'}
                            </AuthButton>,
                            // <Button
                            //     icon={<Icon antdIcon={true} type="PlusOutlined" />}
                            //     type="primary"
                            //     ghost
                            //     onClick={handleCreate}
                            // >
                            //     {'新建'}
                            // </Button>,
                            <Button
                                icon={<Icon antdIcon={true} type="DownloadOutlined" />}
                                type="primary"
                                onClick={() => {
                                    handleExport(refValue);
                                }}
                            >
                                {'导出'}
                            </Button>,
                        ]}
                    />
                )}
                {modalVisabled && (
                    <ViewModal
                        modalVisabled={modalVisabled}
                        setModalVisabled={setModalVisabled}
                        modalType={modalType}
                        rowDetail={rowDetail}
                        setRowDetail={setRowDetail}
                        dictByFieldNameList={dictByFieldNameList}
                        onLoad={() => {
                            actionRef.current.reload();
                        }}
                        provinceList={provinceList}
                    />
                )}
            </Spin>
        </div>
    );
};

export default Record;
