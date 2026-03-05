import { _ } from 'oss-web-toolkits';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import useLoginInfoModel from '@Src/hox';
import { Button, Icon, Tooltip } from 'oss-ui';
import CoreEditModal from '@Pages/modules-fault-management/core-network/add-edit-modal';
import NotCoreEditModal from '@Pages/modules-fault-management/not-core-network/add-edit-modal';
import { useTableSelection } from '@Src/hooks';
import { sendLogFn } from '@Pages/components/auth/utils';
import { findGroupByCenter } from '@Pages/change-shifts-page/api';
import { coreNetWorkColumns, notCoreNetColumns, networkColumns } from './columns';
import * as api from './api';

import './index.less';

const majorTypeList = [
    { value: 1, label: '核心网' },
    { value: 9998, label: 'ATM专业' },
    { value: 9999, label: '互联网专业' },
    { value: 9997, label: '大客户平台专业' },
    { value: 80, label: '云监控专业' },
];

/**
 * 交接班-网络故障自查
 * @returns
 */
export default function Index({
    title,
    pattern,
    currentProfessional,
    schedulingObj,
    onSelectedKeysChange,
    pageType,
    refreshFlag,
    loginInfo,
    saveItemInfoCheck,
    provinceData,
    moduleId,
}) {
    const { currentZone, userName, userId, provinceId, loginId } = useLoginInfoModel();
    const { selectedRows, setSelectedRows, onSelect, onSelectAll, noSelectedRows } = useTableSelection('id');
    const { groupId, workShiftId, lastWorkShiftId, dateTime, workBeginTime } = schedulingObj || {};

    const ref = useRef<any>(null);
    const firstRefreshFlagRef = useRef(true);

    const [modalVisible, setModalVisible] = useState(false);
    // const [provinceData, setProvinceData] = useState<Array<any>>([]);
    const [currentItem, setCurrentItem] = useState(undefined);
    const [editType, setEditType] = useState({});
    const [professionalNetworkTypeList, setProfessionalNetworkTypeList] = useState([]); // 专业网类型
    const [businessImpactSituationList, setBusinessImpactSituationList] = useState([]); // 业务影响情况
    const [faultCauseList, setFaultCauseList] = useState([]); // 故障原因
    const [processingResultsList, setProcessingResultsList] = useState([]); // 处理结果
    const [professionalList, setProfessionalList] = useState<any>([]);

    const [didTheFaultRecover, setDidTheFaultRecover] = useState([]); // 故障是否恢复
    const [affiliatedNetwork, setAffiliatedNetwork] = useState([]); // 所属网络

    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const [groupSourceEnum, setGroupSourceEnum] = useState([]); // 班组来源
    const [notCoreGroupSourceEnum, setNotCoreGroupSourceEnum] = useState([]); // 班组来源
    const { zoneId } = currentZone;
    let isCoreNetwork = false;
    let professType = '1';
    let columns;

    function checkIsCoreNetwork() {
        if (String(currentProfessional?.value) === '1') {
            columns = coreNetWorkColumns;
            isCoreNetwork = true;
        } else if (String(currentProfessional?.value) === '9999') {
            columns = networkColumns;
            isCoreNetwork = false;
            professType = '9999';
        } else {
            columns = notCoreNetColumns;
            isCoreNetwork = false;
        }
    }

    checkIsCoreNetwork();

    // 获取归属省份
    // async function getProvinceData() {
    //     const data = {
    //         creator: userId,
    //     };
    //     const res = await api.getProvinceList(data);
    //     if (res && Array.isArray(res)) {
    //         const list = res;
    //         setProvinceData(list);
    //     }
    // }

    /**
     * @description: 打开编辑弹窗
     * @param {标记} flag  add: 新建  edit:编辑  look:查看
     * @return {*}
     */
    const showAddModal = async () => {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkFaultCheck-Add' });
        setEditType('add');
        setCurrentItem(undefined);
        setModalVisible(true);
    };

    /**
     * @description: 打开编辑弹窗
     * @param {标记} flag  add: 新建  edit:编辑  look:查看
     * @return {*}
     */
    const showEditModal = async (record) => {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkFaultCheck-Edit' });
        setCurrentItem(record);
        setEditType('edit');
        setModalVisible(true);
    };

    const reloadTable = () => {
        ref.current.refreshData();
    };

    async function handleModalClose() {
        setModalVisible(false);
        setCurrentItem(undefined);
    }

    useEffect(() => {
        if (refreshFlag === false) {
            firstRefreshFlagRef.current = true;
            setSelectedRows([]);
        }
    }, [refreshFlag]);

    /**
     * 转换请求参数，并获取列表数据
     * @param pagination 组件发出的请求参数
     * @returns
     */
    const getNetworkFaultCheckList = async (pagination) => {
        const { current: pageNum } = pagination;

        const data = {
            provinceIds: zoneId,
            pageNum,
            ...pagination,
            workShiftId,
            groupId,
            dateTime,
            dutyBeginTime: `${dateTime} ${workBeginTime}`,
            specialtys: currentProfessional.value,
            userId: loginInfo.userId,
        };
        let res;
        if (isCoreNetwork) {
            res = await api.getNetworkFaultCheckCoreNetWork(data);
        } else {
            res = await api.getNetworkFaultCheckNotCore(data);
        }

        const { current, pageSize, total } = res;
        res['pagination'] = { current, pageSize, total };

        setSelectedRows((prev) => {
            const newSelectedRows = _.uniqBy([...prev, ...res.data?.filter((e) => e.explainFlag === '上')], 'id');
            const currentSelect = newSelectedRows.filter((e) => noSelectedRows.current.every((item) => item.id !== e.id));
            return currentSelect;
        });

        return res;
    };

    async function handleSaveCheck() {
        // 校验是否可保存值班信息
        const checkResult = await saveItemInfoCheck();

        if (!checkResult) {
            setModalVisible(false);
            return false;
        }

        return true;
    }

    useEffect(() => {
        // getProvinceData();
        if (currentProfessional) {
            const temp = currentProfessional;
            temp['value'] = Number(currentProfessional?.value);
            setProfessionalList([temp]);
        }

        if (isCoreNetwork) {
            // 专业网类型
            api.getSelectList({ type: 200101 }).then((res) => {
                setProfessionalNetworkTypeList(res.data);
            });
            // 业务影响情况
            api.getSelectList({ type: 200001 }).then((res) => {
                setBusinessImpactSituationList(res.data);
            });
            // 故障原因
            api.getSelectList({ type: 200102 }).then((res) => {
                setFaultCauseList(res.data);
            });
            // 处理结果
            api.getSelectList({ type: 200103 }).then((res) => {
                setProcessingResultsList(res.data);
            });
            // 班组来源
            findGroupByCenter({ operateUser: userId, professionalId: '1' }).then((res) => {
                setGroupSourceEnum(res.data);
            });
        } else {
            api.getSelectList({ type: 200104 }).then((res) => {
                setDidTheFaultRecover(res.data);
            });
            // 故障原因
            api.getSelectList({ type: 1038077 }).then((res) => {
                setFaultCauseList(res.data);
            });
            // 所属网络
            api.getSelectList({ type: 200105 }).then((res) => {
                setAffiliatedNetwork(res.data);
            });
            // 班组来源
            findGroupByCenter({ operateUser: userId, professionalId: '9999' }).then((res) => {
                setNotCoreGroupSourceEnum(res.data);
            });
        }
    }, []);

    useEffect(() => {
        onSelectedKeysChange(selectedRows.map((item) => item.id));
    }, [selectedRows]);
    const tableColumnSettingConfigType = useMemo(() => {
        if (isCoreNetwork) {
            return 18;
        }
        if (professType === '9999') {
            return 26;
        }
        return 19;
    }, [isCoreNetwork, professType]);

    return (
        <>
            <ChangeShiftsEditTable
                moduleId={moduleId}
                title={title}
                columns={columns}
                pattern={pattern}
                // @ts-ignore
                ref={ref}
                rowActions={[
                    {
                        type: RowAction.edit,
                        actionProps: {
                            editMode: 'custom',
                            handleCustomEdit: showEditModal,
                        },
                    },
                ]}
                rowKey="id"
                tableColumnSettingConfigType={tableColumnSettingConfigType}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRows.map((item) => item.id),
                    onSelect,
                    onSelectAll,
                    getCheckboxProps: () => ({
                        disabled: pattern !== 'editable',
                    }),
                    columnWidth: 25,
                    renderCell(checked, record, index, node) {
                        const isShow = selectedRows.find((e) => e.id === record.id);
                        if (isShow) {
                            return <Tooltip title="遗留到下个班次">{node}</Tooltip>;
                        }
                        return node;
                    },
                }}
                toolBarRender={
                    pattern === 'editable' && (
                        <Button type="primary" ghost onClick={showAddModal}>
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </Button>
                    )
                }
                autoRefreshSetting={{ interval: 3 * 60 * 1000, enable: true }}
                refreshDataService={getNetworkFaultCheckList}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                startRefreshData={refreshFlag}
            />
            {modalVisible && isCoreNetwork && (
                <CoreEditModal
                    professionalNetworkTypeList={professionalNetworkTypeList}
                    businessImpactSituationList={businessImpactSituationList}
                    faultCauseList={faultCauseList}
                    processingResultsList={processingResultsList}
                    professionalList={professionalList}
                    editType={editType}
                    isModalOpen={modalVisible}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    loginId={loginId}
                    userName={userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    handleCancel={handleModalClose}
                    reloadTable={reloadTable}
                    handleSaveCheck={handleSaveCheck}
                    wrapClassName="change-shifts-add-modal-root"
                    groupSourceEnum={groupSourceEnum}
                />
            )}
            {modalVisible && !isCoreNetwork && (
                <NotCoreEditModal
                    majorName={currentProfessional?.label}
                    didTheFaultRecover={didTheFaultRecover}
                    affiliatedNetwork={affiliatedNetwork}
                    faultCauseList={faultCauseList}
                    professionalList={professionalList}
                    editType={editType}
                    isModalOpen={modalVisible}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    loginId={loginId}
                    userName={userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    handleCancel={handleModalClose}
                    reloadTable={reloadTable}
                    handleSaveCheck={handleSaveCheck}
                    wrapClassName="change-shifts-add-modal-root"
                    groupSourceEnum={notCoreGroupSourceEnum}
                />
            )}
        </>
    );
}
