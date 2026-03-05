import React, { useState, useRef, useEffect } from 'react';
import useLoginInfoModel from '@Src/hox';
import { Icon, message, Modal } from 'oss-ui';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import AddEditModal from '@Pages/setting/service-fault-management/professional/add-edit-modal';
import { deleteDutyBusinessFaultManagementPlatform } from '@Pages/setting/service-fault-management/professional/api';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { useTableSelection } from '@Src/hooks';
import AuthButton from '@Pages/components/auth/auth-button';
import { sendLogFn } from '@Pages/components/auth/utils';
import { getColumns } from './columns';
import * as api from './api';
import './index.less';

/**
 * 交接班-业务故障(自查)
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
    saveItemInfoCheck,
    provinceData,
    moduleId,
}) {
    const { currentZone, userName, userId, provinceId } = useLoginInfoModel();
    const firstRefreshFlagRef = useRef(true);
    const { selectedRows, setSelectedRows, onSelect, onSelectAll } = useTableSelection('id');

    const ref = useRef<any>(null);

    const { groupId, workShiftId, dateTime, professionalType } = schedulingObj || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editType, setEditType] = useState<any>('add');
    const [currentItem, setCurrentItem] = useState(undefined);
    // const [provinceData, setProvinceData] = useState<Array<any>>([]);
    const currProvince = provinceData.find((item) => item.regionId === provinceId);

    const { zoneId } = currentZone;

    async function handleAddModal() {
        // @ts-ignore
        setEditType('add');
        setCurrentItem(undefined);
        setIsModalVisible(true);
    }

    async function handleEditModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-Business-Fault-Edit' });
        setEditType('edit');
        setIsModalVisible(true);
        setCurrentItem(record);
    }

    async function handleModalClose() {
        setCurrentItem(undefined);

        setIsModalVisible(false);
    }

    useEffect(() => {
        if (refreshFlag === false) {
            firstRefreshFlagRef.current = true;
        }
    }, [refreshFlag]);

    /**
     * 转换请求参数，并获取列表数据
     * @param pagination 组件发出的请求参数
     * @returns
     */
    const getBusinessFaultCheck = async (pagination) => {
        if (professionalType?.length > 0) {
            const { current: pageNum } = pagination;

            const data = {
                provinceId: zoneId,
                ...pagination,
                pageNum,
                professionalType,
                majorIds: currentProfessional || 9996,
                groupId,
                workShiftId,
                dateTime,
                userId,
            };

            const res = await api.getDutyBusinessFaultManagement(data);

            const { current, pageSize, total } = res;
            res['pagination'] = { current, pageSize, total };
            if (firstRefreshFlagRef.current) {
                firstRefreshFlagRef.current = false;
                setSelectedRows(res.data.list?.filter((e) => e.explainFlag === '上') || []);
            }

            return { ...res, data: res.data.list || [] };
        }
        return [];
    };

    const reloadTable = async () => {
        ref.current.refreshData();
    };

    async function handleSaveCheck() {
        // 校验是否可保存值班信息
        const checkResult = await saveItemInfoCheck();

        if (!checkResult) {
            setIsModalVisible(false);
            return false;
        }

        return true;
    }

    const delCurrentUserClick = async (record) => {
        const result = await deleteDutyBusinessFaultManagementPlatform({ id: record.id, deletedBy: userId });
        if (result.code === 200) {
            message.success('删除成功');
            reloadTable();
        }
        // Modal.confirm({
        //     title: `是否确认删除`,
        //     onOk: async () => {
        //         const result = await deleteDutyBusinessFaultManagementPlatform({ id: record.id, deletedBy: userId });
        //         if (result.code === 200) {
        //             message.success('删除成功');
        //             reloadTable();
        //         } else {
        //             message.error(result.message);
        //         }
        //     },
        //     onCancel() {},
        // });
    };

    useEffect(() => {
        onSelectedKeysChange(selectedRows.map((item) => item.id));
    }, [selectedRows]);

    const columns = getColumns();

    return (
        <div>
            <ChangeShiftsEditTable
                moduleId={moduleId}
                showNewEmptyRow={false}
                columns={columns}
                pattern={pattern}
                // @ts-ignore
                ref={ref}
                title={title}
                startRefreshData={refreshFlag && professionalType?.length > 0}
                // @ts-ignore
                refreshDataService={getBusinessFaultCheck}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                tableColumnSettingConfigType="20"
                toolBarRender={
                    pattern === 'editable' && (
                        <AuthButton
                            type="primary"
                            authKey="workbench-Workbench-Business-Fault-Self-Check-Add"
                            ignoreAuth
                            ghost
                            onClick={handleAddModal}
                        >
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </AuthButton>
                    )
                }
                autoRefreshSetting={{ interval: 3 * 60 * 1000, enable: true }}
                rowKey="id"
                rowActions={[
                    {
                        type: RowAction.edit,
                        actionProps: {
                            editMode: 'custom',
                            handleCustomEdit: handleEditModal,
                        },
                    },
                    {
                        type: RowAction.delete,
                        actionProps: {
                            handleDelete: async (record) => delCurrentUserClick(record),
                        },
                    },
                ]}
            />
            {isModalVisible && (
                <AddEditModal
                    isModalOpen={isModalVisible}
                    editType={editType}
                    currentItem={currentItem}
                    userName={userName}
                    provinceData={provinceData}
                    userId={userId}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    handleCancel={handleModalClose}
                    reloadTable={reloadTable}
                    handleSaveCheck={handleSaveCheck}
                    wrapClassName="change-shifts-add-modal-root"
                />
            )}
        </div>
    );
}
