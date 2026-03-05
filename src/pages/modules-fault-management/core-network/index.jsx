import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { VirtualTable } from 'oss-web-common';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { Button, Modal, message, Form, Input, Space, Tooltip, Icon, Select, DatePicker } from 'oss-ui';
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
//组件
const NetworkManagementSystemAlarmMonitoring = (props) => {
    const majorTypeParams = {
        value: 1,
        label: '核心网',
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const { userId, userName, provinceId, loginId } = useLoginInfoModel();
    const [provinceData, setProvinceData] = useState([]);
    const [professionalList, setProfessionalList] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const currProvince = provinceData.find((item) => `${item.provinceId}` === `${provinceId}`);
    const history = useHistory();
    // const searchTime=[moment().subtract(1,'month').startOf('month'), moment().endOf('day')]
    //枚举值
    const [professionalNetworkTypeList, setProfessionalNetworkTypeList] = useState([]); //专业网类型
    const [businessImpactSituationList, setBusinessImpactSituationList] = useState([]); //业务影响情况
    const [faultCauseList, setFaultCauseList] = useState([]); //故障原因
    const [processingResultsList, setProcessingResultsList] = useState([]); //处理结果
    //批量导入
    const [importVisible, setImportVisible] = useState(false);
    const [groupSourceEnum, setGroupSourceEnum] = useState([]); // 班组来源
    useEffect(() => {
        //初始化专业下拉框及选项
        setProfessionalList([majorTypeParams]);
        getProvinceData();
        // getTemporaryRouteList();
        //专业网类型
        getSelectList({ type: 200101 }).then((res) => {
            setProfessionalNetworkTypeList(res.data);
        });
        //业务影响情况
        getSelectList({ type: 200001 }).then((res) => {
            setBusinessImpactSituationList(res.data);
        });
        //故障原因
        getSelectList({ type: 200102 }).then((res) => {
            setFaultCauseList(res.data);
        });
        //处理结果
        getSelectList({ type: 200103 }).then((res) => {
            setProcessingResultsList(res.data);
        });
        // 班组来源
        findGroupByCenter({ operateUser: userId, professionalId: '1' }).then((res) => {
            setGroupSourceEnum(res.data);
        });
    }, []);
    const formRef = useRef();
    const defaultColumns = [
        // {
        //     title: '流水号',
        //     dataIndex: 'serialNo',
        //     key: 'serialNo',
        //     hideInSearch: true,
        //     align: 'center',
        //     ellipsis: true,
        // },
        {
            title: '故障所在省',
            dataIndex: 'faultProvince',
            key: 'faultProvince',
            align: 'center',
            ellipsis: true,
        },
        // {
        //     title: '专业',
        //     dataIndex: 'majorTypeText',
        //     key: 'majorTypeText',
        //     hideInSearch: true,
        //     align: 'center',
        //     ellipsis: true,
        // },
        {
            title: '专业',
            align: 'center',
            dataIndex: 'majorType',
            ellipsis: true,
            hideInTable: true,
            hideInSearch: true,
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
            title: '专业网类型',
            dataIndex: 'networkTypeText',
            key: 'networkTypeText',
            hideInSearch: true,
            align: 'center',
            width: 120,
        },
        {
            title: '专业网类型',
            align: 'center',
            dataIndex: 'networkType',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" maxTagCount="responsive" allowClear optionFilterProp="children">
                        {professionalNetworkTypeList.map((item) => {
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
            title: '故障发生时间',
            dataIndex: 'searchTime',
            hideInTable: true,
            valueType: 'dateTimeRange',
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime />;
            },
        },
        {
            title: '故障点所属地区',
            dataIndex: 'faultPointArea',
            key: 'faultPointArea',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '故障开始日期/时间',
            dataIndex: 'faultCreateTime',
            key: 'faultCreateTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
            sorter: true,
        },
        {
            title: '故障结束日期/时间',
            dataIndex: 'faultOverTime',
            key: 'faultOverTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
            sorter: true,
        },
        {
            title: '故障原因',
            dataIndex: 'causeObstacleText',
            key: 'causeObstacleText',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '业务影响情况',
            dataIndex: 'businessImpactText',
            key: 'businessImpactText',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '业务影响情况',
            align: 'center',
            dataIndex: 'businessImpact',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" maxTagCount="responsive" allowClear optionFilterProp="children">
                        {businessImpactSituationList.map((item) => {
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
            title: '中断业务历时(分钟)',
            dataIndex: 'interruptionDuration',
            key: 'interruptionDuration',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '故障记录',
            dataIndex: 'faultRecord',
            key: 'faultRecord',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '故障原因',
            align: 'center',
            dataIndex: 'causeObstacle',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" maxTagCount="responsive" allowClear optionFilterProp="children">
                        {faultCauseList.map((item) => {
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
            title: '处理结果',
            dataIndex: 'processingResultText',
            key: 'processingResultText',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '处理结果',
            align: 'center',
            dataIndex: 'processingResult',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            renderFormItem: () => {
                return (
                    <Select showSearch placeholder="全部" maxTagCount="responsive" allowClear optionFilterProp="children">
                        {processingResultsList.map((item) => {
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
            title: '是否脱点',
            dataIndex: 'isOffPointText',
            key: 'isOffPointText',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '处理人',
            dataIndex: 'recorder',
            key: 'recorder',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        // {
        //     title: '故障历时(分钟)',
        //     dataIndex: 'memo',
        //     key: 'memo',
        //     hideInSearch: true,
        //     align: 'center',
        //     width: 120,
        //     ellipsis: true,
        // },
        {
            title: '班组来源',
            dataIndex: 'groupSource',
            ellipsis: true,
            order: 3,
            align: 'center',
            search: false,
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
            faultProvince: searchData.faultProvince,
            majorType: majorTypeParams.value,
            faultStartTime: searchData.faultStartTime ? searchData.faultStartTime : null,
            faultEndTime: searchData.faultEndTime ? searchData.faultEndTime : null,
            networkType: searchData.networkType ? searchData.networkType : null,
            businessImpact: searchData.businessImpact ? searchData.businessImpact : null,
            causeObstacle: searchData.causeObstacle ? searchData.causeObstacle : null,
            processingResult: searchData.processingResult ? searchData.processingResult : null,
        };
        sendLogFn({ authKey: 'modules-fault-management-core-network:export' });
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
        sendLogFn({ authKey: 'modules-fault-management-core-network:check' });
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
            faultOverTime: {
                ascend: 4,
                descend: 3,
            },
        };
        console.log(sortMap);
        const data = {
            belongProvince: provinceId,
            faultProvince: params.faultProvince,
            majorType: majorTypeParams.value,
            faultStartTime: params.searchTime?.[0],
            faultEndTime: params.searchTime?.[1],
            networkType: params.networkType ? params.networkType : null,
            businessImpact: params.businessImpact ? params.businessImpact : null,
            causeObstacle: params.causeObstacle ? params.causeObstacle : null,
            processingResult: params.processingResult ? params.processingResult : null,
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
                request={getTemporaryRouteList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
            />
            {isModalOpen && (
                <AddEditModal
                    professionalNetworkTypeList={professionalNetworkTypeList}
                    businessImpactSituationList={businessImpactSituationList}
                    faultCauseList={faultCauseList}
                    processingResultsList={processingResultsList}
                    professionalList={professionalList}
                    groupSourceEnum={groupSourceEnum}
                    editType={editType}
                    isModalOpen={isModalOpen}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    userName={userName}
                    loginId={loginId}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
            {importVisible && (
                <UploadComp
                    majorType={majorTypeParams.value}
                    belongProvince={provinceId}
                    createdBy={loginId}
                    type={exportType.coreNetwork}
                    handleCancel={handleImportCancel}
                    isModalOpen={importVisible}
                    onUploadResult={reloadTable}
                />
            )}
        </div>
    );
};

export default NetworkManagementSystemAlarmMonitoring;
