import React, { useState, useRef, useEffect } from 'react';
import useLoginInfoModel from '@Src/hox';
import { Icon, message, Tooltip } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { useTableSelection } from '@Src/hooks';
import AuthButton from '@Pages/components/auth/auth-button';
import { sendLogFn } from '@Pages/components/auth/utils';
import CreateModal from './modal/index';
import './index.less';
import { columns } from './columns';
import * as api from './api';
import { TMode } from './modal/types';

/**
 * 交接班-业务平台监控日报
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
    moduleId,
}) {
    const ref = useRef<any>(null);
    const firstRefreshFlagRef = useRef(true);

    const { groupId, workShiftId, lastWorkShiftId, dateTime, workBeginTime, workEndTime, professionalType } = schedulingObj || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editType, setEditType] = useState<TMode>('new');
    const { selectedRows, onSelect, onSelectAll, setSelectedRows, noSelectedRows } = useTableSelection('id');

    const [currentItem, setCurrentItem] = useState(undefined);

    const [initialValues, setInitialValues] = useState({});

    const { currentZone, userName, userId } = useLoginInfoModel();

    const { zoneId } = currentZone;

    async function handleAddModal() {
        sendLogFn({ authKey: 'workbench-Workbench-Business-platform-monitors-daily-Add' });
        setCurrentItem(undefined);
        setEditType('new');
        setInitialValues({
            provinceId: zoneId,
            watchMan: userName,
            time: moment(),
            professionalType: currentProfessional?.value ? String(currentProfessional?.value) : '85',
            completion: '否',
        });
        setIsModalVisible(true);
    }

    async function handleEditModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-Business-platform-monitors-daily-Edit' });
        setCurrentItem(record);
        setEditType('edit');
        setInitialValues({
            ...record,
            time: moment(record['time']),
            provinceId: zoneId,
            professionalType: record?.professionalType ? String(record?.professionalType) : '85',
        });
        setIsModalVisible(true);
    }
    async function handleModalClose() {
        setCurrentItem(undefined);
        setInitialValues({});
        setIsModalVisible(false);
    }

    async function handleOk(values) {
        // 校验是否可保存值班信息
        const checkResult = await saveItemInfoCheck();

        if (!checkResult) {
            setIsModalVisible(false);
            return;
        }

        let res;
        try {
            if (editType === 'new') {
                res = await api.saveBusinessPlatformMonitorDaily({ groupId, workShiftId, dateTime, ...values });
            } else if (editType === 'edit') {
                res = await api.updateBusinessPlatformMonitorDaily({ ...(currentItem || {}), ...values });
            }
            if (res.code === 200) {
                message.success('保存成功');
                ref.current.refreshData();
            } else {
                message.error('保存失败');
            }
            setIsModalVisible(false);
            return res;
        } catch (error) {
            message.error('保存失败');
            return res;
        }
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
    const getBusinessPlatformMonitorDaily = async (pagination) => {
        if (professionalType?.length > 0) {
            const { current: pageNum } = pagination;

            const data = {
                provinceId: zoneId,
                pageNum,
                ...pagination,
                dutyBeginTime: workBeginTime,
                dutyEndTime: workEndTime,
                specialtys: professionalType,
                groupId,
                workShiftId,
                dateTime,
                userId,
            };
            const res = await api.getBusinessPlatformMonitorDaily(data);
            const { current, pageSize, total } = res;
            res['pagination'] = { current, pageSize, total };
            setSelectedRows((prev) => {
                const newSelectedRows = _.uniqBy([...prev, ...res.data?.filter((e) => e.explainFlag === '上')], 'id');
                const currentSelect = newSelectedRows.filter((e) => noSelectedRows.current.every((item) => item.id !== e.id));
                return currentSelect;
            });
            // setSelectedRows(res.data?.filter((e) => e.explainFlag === '上') || []);

            return res;
        }
        return {
            data: [],
            pagination: {
                current: 1,
                pageSize: 5,
                total: 0,
            },
        };
    };
    const deleteBusinessPlatformMonitorDailyData = async (record) => {
        const res = await api.deleteBusinessPlatformMonitorDaily({ recordId: record.id });
        if (res.code === 200) {
            message.success('删除成功');
            ref.current.refreshData();
        } else {
            message.error('删除失败');
        }
    };
    useEffect(() => {
        onSelectedKeysChange(selectedRows.map((item) => item.id));
    }, [selectedRows]);

    return (
        <>
            <ChangeShiftsEditTable
                actionWitdth={80}
                moduleId={moduleId}
                showNewEmptyRow={false}
                columns={columns}
                pattern={pattern}
                // @ts-ignore
                ref={ref}
                title={title}
                refreshDataService={getBusinessPlatformMonitorDaily}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                startRefreshData={refreshFlag && professionalType?.length > 0}
                toolBarRender={
                    pattern === 'editable' && (
                        <AuthButton
                            ignoreAuth
                            authKey="workbench-Workbench-Business-platform-monitors-daily-Add"
                            type="primary"
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
                            handleDelete: deleteBusinessPlatformMonitorDailyData,
                        },
                    },
                ]}
            />
            {isModalVisible && (
                <CreateModal
                    visible={isModalVisible}
                    mode={editType}
                    contentProps={{ initialValues }}
                    onCancel={handleModalClose}
                    onOk={handleOk}
                    wrapClassName="change-shifts-add-modal-root"
                />
            )}
        </>
    );
}
