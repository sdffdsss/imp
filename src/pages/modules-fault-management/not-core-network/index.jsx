import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { _ } from 'oss-web-toolkits';
import { VirtualTable } from 'oss-web-common';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { Button, Modal, message, Form, Input, Space, Tooltip, Icon, Select, DatePicker } from 'oss-ui';
import { useColumnsState } from '@Src/hooks';
const { RangePicker } = DatePicker;
import { getTemporaryRoute, exportTemporaryRoute, getProvinceList, deleteTemporaryRoute, getSelectList } from './api';
import { findGroupByCenter } from '../../network-cutover/api';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import moment from 'moment';
import { blobDownLoad } from '@Common/utils/download';
import './index.less';
import AuthButton from '@Src/components/auth-button';
//import UploadComp from '../modal';
import UploadComp from '../upload';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
import AddEditModal from './add-edit-modal';
import { useHistory, useParams } from 'react-router-dom';
import { exportType } from '../enum';

const majorTypeList = [
    { value: 9998, label: 'ATM专业', url: '/modules-fault-management/atm' },
    { value: 9999, label: '互联网专业', url: '/modules-fault-management/intel' },
    { value: 9997, label: '大客户平台专业', url: '/modules-fault-management/bigCustom' },
    { value: 80, label: '云监控专业', url: '/modules-fault-management/cloud' },
];
//组件
const NetworkManagementSystemAlarmMonitoring = (props) => {
    let majorTypeParams = majorTypeList.filter((item) => {
        return props.pathname.includes(item.url);
    });
    majorTypeParams = majorTypeParams[0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const { userId, userName, provinceId, loginId } = useLoginInfoModel();
    const [provinceData, setProvinceData] = useState([]);
    const [professionalList, setProfessionalList] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const columnsState = useColumnsState({ configType: 26 });
    const currProvince = provinceData.find((item) => `${item.provinceId}` === `${provinceId}`);
    const history = useHistory();
    // const searchTime=[moment().subtract(1,'month').startOf('month'), moment().endOf('day')]
    //枚举值
    const [didTheFaultRecover, setDidTheFaultRecover] = useState([]); //故障是否恢复
    const [affiliatedNetwork, setAffiliatedNetwork] = useState([]); //所属网络
    const [faultCauseList, setFaultCauseList] = useState([]); //故障原因
    const [groupSourceEnum, setGroupSourceEnum] = useState([]); // 班组来源
    //批量导入
    const [importVisible, setImportVisible] = useState(false);

    useEffect(() => {
        //初始化专业下拉框及选项
        setProfessionalList([majorTypeParams]);
        getProvinceData();
        // getTemporaryRouteList();
        //故障是否恢复
        getSelectList({ type: 200104 }).then((res) => {
            setDidTheFaultRecover(res.data);
        });
        //故障原因
        getSelectList({ type: 1038077 }).then((res) => {
            setFaultCauseList(res.data);
        });
        //所属网络
        getSelectList({ type: 200105 }).then((res) => {
            console.log(res);
            setAffiliatedNetwork(res.data);
        });
        // 班组来源
        findGroupByCenter({ operateUser: userId, professionalId: '9999' }).then((res) => {
            setGroupSourceEnum(res.data);
        });
    }, []);
    const formRef = useRef();
    const defaultColumns = [
        {
            title: '流水号',
            dataIndex: 'serialNo',
            key: 'serialNo',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '省份',
            dataIndex: 'belongProvinceText',
            key: 'belongProvinceText',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '省份',
            dataIndex: 'belongProvince',
            hideInTable: true,
            initialValue: provinceId,
            renderFormItem: (item, { fieldProps }, form) => {
                return (
                    <Select showSearch placeholder="全部" maxTagCount="responsive" optionFilterProp="children">
                        return (
                        <Select.Option value={`${currProvince?.provinceId}`} key={currProvince?.provinceId} label={currProvince?.regionName}>
                            {currProvince?.regionName}
                        </Select.Option>
                        );
                    </Select>
                );
            },
        },
        {
            title: '专业',
            dataIndex: 'majorTypeText',
            key: 'majorTypeText',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '专业',
            align: 'center',
            dataIndex: 'majorType',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            initialValue: majorTypeParams.value,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" maxTagCount="responsive" optionFilterProp="children">
                        {professionalList.map((item) => {
                            return (
                                <Select.Option value={item.value} key={item.value} label={item.label}>
                                    {item.label}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '申告单位',
            dataIndex: 'reportUnit',
            key: 'reportUnit',
            hideInSearch: false,
            align: 'center',
            width: 120,
        },
        {
            title: '所属网格',
            dataIndex: 'owningNetworkText',
            key: 'owningNetworkText',
            hideInSearch: false,
            align: 'center',
            width: 120,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" allowClear maxTagCount="responsive" optionFilterProp="children">
                        {affiliatedNetwork.map((item) => {
                            return (
                                <Select.Option value={item.value} key={item.value} label={item.lable}>
                                    {item.lable}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '故障原因',
            dataIndex: 'causeObstacleText',
            key: 'causeObstacleText',
            hideInSearch: false,
            align: 'center',
            width: 120,
        },
        {
            title: '故障地点',
            dataIndex: 'faultLocation',
            key: 'faultLocation',
            hideInSearch: false,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '受理时间',
            dataIndex: 'receptionTime',
            key: 'receptionTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
            sorter: true,
        },
        {
            title: '受理时间',
            dataIndex: 'receiveTime',
            hideInTable: true,
            valueType: 'dateTimeRange',
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime />;
            },
        },
        {
            title: '故障是否恢复',
            dataIndex: 'faultRecoveryText',
            key: 'faultRecoveryText',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '故障是否恢复',
            align: 'center',
            dataIndex: 'faultRecovery',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" maxTagCount="responsive" allowClear optionFilterProp="children">
                        {didTheFaultRecover.map((item) => {
                            return (
                                <Select.Option value={item.value} key={item.value} label={item.lable}>
                                    {item.lable}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            },
        },
        {
            title: '故障恢复时间',
            dataIndex: 'faultOverTime',
            key: 'faultOverTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '中断业务范围',
            dataIndex: 'interruptedScope',
            key: 'interruptedScope',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '故障发生时间',
            dataIndex: 'faultCreateTime',
            key: 'faultCreateTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
            sorter: true,
        },
        {
            title: '故障发生时间',
            dataIndex: 'searchTime',
            hideInTable: true,
            valueType: 'dateTimeRange',
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime />;
            },
        },
        {
            title: '故障历时（分钟）',
            dataIndex: 'faultDuration',
            key: 'faultDuration',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '故障受理历时(分钟)',
            dataIndex: 'faultHandDuration',
            key: 'faultHandDuration',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '障碍现象',
            dataIndex: 'obstaclePhenomenon',
            key: 'obstaclePhenomenon',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '记录人',
            dataIndex: 'recorder',
            key: 'recorder',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '班组来源',
            dataIndex: 'groupSource',
            key: 'groupSource',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
            hideInTable: majorTypeParams.value !== 9999,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (text, row) => [
                <Tooltip title="编辑">
                    {/* <AuthButton
                        key="edit"
                        onClick={() => showUserEditViewClick(row, 'edit')}
                        authKey="cuttingExecutionRecord:edit"
                        type="text"
                        antdIcon
                    >
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </AuthButton> */}
                    <AuthButton
                        key="edit"
                        onClick={() => showUserEditViewClick(row, 'edit')}
                        authKey="modulesFaultManagement:edit"
                        type="text"
                        antdIcon
                    >
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="查看">
                    <Button key="show" onClick={() => showUserEditViewClick(row, 'view')} type="text" antdIcon={true}>
                        <Icon key="userEdit" antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>,
                <Tooltip title="删除">
                    {/* <AuthButton
                        key="delete"
                        onClick={() => delCurrentUserClick(row)}
                        authKey="cuttingExecutionRecord:delete"
                        type="text"
                        antdIcon
                        addLog
                    >
                        <Icon key="userDel" antdIcon type="DeleteOutlined" />
                    </AuthButton> */}
                    <AuthButton
                        key="delete"
                        onClick={() => delCurrentUserClick(row)}
                        authKey="modulesFaultManagement:delete"
                        type="text"
                        antdIcon
                        addLog
                    >
                        <Icon key="userDel" antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>,
            ],
        },
    ];
    // 导出
    const handleExport = () => {
        const data = {
            belongProvince: provinceId,
            majorType: majorTypeParams.value,
            faultStartTime: searchData.faultStartTime ? searchData.faultStartTime : null,
            faultEndTime: searchData.faultEndTime ? searchData.faultEndTime : null,
            receptionStartTime: searchData.receptionStartTime ? searchData.receptionStartTime : null,
            receptionEndTime: searchData.receptionEndTime ? searchData.receptionEndTime : null,
            reportUnit: searchData.reportUnit ? searchData.reportUnit : null,
            faultRecovery: searchData.faultRecovery ? searchData.faultRecovery : null,
            faultLocation: searchData.faultLocation ? searchData.faultLocation : null,
            causeObstacleText: searchData.causeObstacleText ? searchData.causeObstacleText : null,
            owningNetworkText: searchData.owningNetworkText ? searchData.owningNetworkText : null,
        };
        switch (majorTypeParams.value) {
            case 9998:
                sendLogFn({ authKey: 'modules-fault-management-atm:export' });
                break;
            case 9999:
                sendLogFn({ authKey: 'modules-fault-management-intel:export' });
                break;
            case 9997:
                sendLogFn({ authKey: 'modules-fault-management-bigCustom:export' });
                break;
            case 80:
                sendLogFn({ authKey: 'modules-fault-management-cloud:export' });
                break;
            default:
                break;
        }
        console.log(majorTypeParams);

        exportTemporaryRoute(data).then((res) => {
            if (res) {
                blobDownLoad(res, `网络故障管理-${majorTypeParams.label}${moment().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };

    // 重加载
    const tableRef = useRef();
    const reloadTable = () => {
        setTimeout(() => {
            tableRef.current.reload();
        }, 1000);
    };
    // 新增
    const handleAdd = () => {
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };
    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
        switch (majorTypeParams.value) {
            case 9998:
                sendLogFn({ authKey: 'modules-fault-management-atm:check' });
                break;
            case 9999:
                sendLogFn({ authKey: 'modules-fault-management-intel:check' });
                break;
            case 9997:
                sendLogFn({ authKey: 'modules-fault-management-bigCustom:check' });
                break;
            case 80:
                sendLogFn({ authKey: 'modules-fault-management-cloud:check' });
                break;
            default:
                break;
        }
    };
    //删除
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                await deleteTemporaryRoute({ id: record.id, deletedBy: loginId });
                message.success('删除成功');
                reloadTable();
            },
            onCancel() {},
        });
    };
    // 获取列表数据
    const getTemporaryRouteList = async (params, sort) => {
        const sortKey = Object.keys(sort)[0];

        const sortMap = {
            faultCreateTime: {
                ascend: 2,
                descend: 1,
            },
            receptionTime: {
                ascend: 4,
                descend: 3,
            },
        };

        const data = {
            belongProvince: provinceId,
            majorType: majorTypeParams.value,
            faultStartTime: params.searchTime?.[0],
            faultEndTime: params.searchTime?.[1],
            receptionStartTime: params.receiveTime?.[0],
            receptionEndTime: params.receiveTime?.[1],
            reportUnit: params.reportUnit ? params.reportUnit : null,
            faultRecovery: params.faultRecovery ? params.faultRecovery : null,
            faultLocation: params.faultLocation ? params.faultLocation : null,
            owningNetworkText: params.owningNetworkText ? params.owningNetworkText : null,
            causeObstacleText: params.causeObstacleText ? params.causeObstacleText : null,
            pageNum: params.current,
            pageSize: params.pageSize,
            showOrder: sortMap?.[sortKey]?.[sort?.[sortKey]] || 1,
        };
        const res = await getTemporaryRoute(data);
        setSearchData(data);
        return res;
    };
    // 获取归属省份
    const getProvinceData = async () => {
        const data = {
            creator: userId,
        };
        const res = await getProvinceList(data);
        if (res && Array.isArray(res)) {
            const list = res;
            setProvinceData(list);
        }
    };
    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // 批量导入
    const handleImport = () => {
        setImportVisible(true);
    };
    // 取消
    const handleImportCancel = () => {
        setImportVisible(false);
    };
    if (_.isEmpty(columnsState.value)) {
        return null;
    }
    return (
        <div className="maintain-job-content">
            <VirtualTable
                global={window}
                toolBarRender={() => [
                    <AuthButton type="primary" authKey="modulesFaultManagement:add" onClick={handleAdd}>
                        新增
                    </AuthButton>,
                    <AuthButton authKey="modulesFaultManagement:import" onClick={handleImport}>
                        <Icon antdIcon type="ExportOutlined" /> 批量导入
                    </AuthButton>,
                    <Button onClick={handleExport}>导出</Button>,
                ]}
                columns={defaultColumns}
                columnsState={columnsState}
                request={getTemporaryRouteList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
            />
            {isModalOpen && (
                <AddEditModal
                    majorName={majorTypeParams.label}
                    didTheFaultRecover={didTheFaultRecover}
                    affiliatedNetwork={affiliatedNetwork}
                    faultCauseList={faultCauseList}
                    professionalList={professionalList}
                    groupSourceEnum={groupSourceEnum}
                    editType={editType}
                    isModalOpen={isModalOpen}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    loginId={loginId}
                    userName={userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
            {importVisible && (
                <UploadComp
                    majorName={majorTypeParams.label}
                    majorType={majorTypeParams.value}
                    belongProvince={provinceId}
                    createdBy={loginId}
                    type={exportType.bigCustomer}
                    handleCancel={handleImportCancel}
                    isModalOpen={importVisible}
                    onUploadResult={reloadTable}
                />
            )}
        </div>
    );
};

export default NetworkManagementSystemAlarmMonitoring;
