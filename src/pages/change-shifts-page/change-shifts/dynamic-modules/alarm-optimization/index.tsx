import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import useLoginInfoModel from '@Src/hox';
import { Button, Icon, message, Tooltip } from 'oss-ui';
import moment from 'moment';
import { useTableSelection } from '@Src/hooks';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import { sendLogFn } from '@Pages/components/auth/utils';
import CreateModal from './modal/index';
import './index.less';
import { columns } from './columns';
import * as api from './api';
import { TMode } from './modal/types';

/**
 * 交接班-告警与优化
 * @param param0
 * @returns
 */
export default function Index({
    title,
    pattern,
    schedulingObj,
    onSelectedKeysChange,
    pageType,
    refreshFlag,
    loginInfo,
    saveItemInfoCheck,
    moduleId,
}) {
    const ref = useRef<any>(null);
    const firstRefreshFlagRef = useRef(true);

    const { workBeginTime, workEndTime, professionalType, groupId, workShiftId, lastWorkShiftId, dateTime } = schedulingObj || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editType, setEditType] = useState<TMode>('new');
    const { selectedRows, onSelect, onSelectAll, setSelectedRows, noSelectedRows } = useTableSelection('id');
    const [currentItem, setCurrentItem] = useState(undefined);
    const [initialValues, setInitialValues] = useState({});

    const { currentZone, userId, userName } = useLoginInfoModel();

    const { zoneId, zoneName } = currentZone;

    async function handleAddModal() {
        sendLogFn({ authKey: 'workbench-Workbench-Shift-AlarmOptimization-Add' });
        setCurrentItem(undefined);
        setEditType('new');
        setInitialValues({
            province: { value: zoneId, label: zoneName },
            createUserName: userName,
            createUserId: userId,
            optimizationCompleteFlag: '否',
            optimizationFlag: '否',
            alarmLevel: '严重',
            createTime: moment(),
            firstTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
            lastTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
            clearTime: moment(moment().format('YYYY-MM-DD 00:00:00')),
            repeatTimes: 0,
        });
        setIsModalVisible(true);
    }

    async function handleEditModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-Shift-AlarmOptimization-Edit' });
        setCurrentItem(record);
        setEditType('edit');

        setInitialValues({
            ...record,
            province: { value: `${record.provinceId}`, label: record.ProvinceName },
            professional: { value: record.professionId, label: record.professionName },

            lastTime: record.lastTime && moment(record.lastTime),
            firstTime: record.firstTime && moment(record.firstTime),
            clearTime: record.clearTime && moment(record.clearTime),
            createTime: record.createTime && moment(record.createTime),
            createUserName: userName,
            createUserId: userId,
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
            const params = {
                ...(currentItem || {}),
                ...values,
            };

            delete params.province;

            if (editType === 'new') {
                res = await api.addAlarmOptimizationManagement(params);
            } else if (editType === 'edit') {
                res = await api.editAlarmOptimizationManagement(params);
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
        onSelectedKeysChange(selectedRows.map((item) => item.id));
    }, [selectedRows]);

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
                professionIds: professionalType,
                dutyBeginTime: workBeginTime,
                dutyEndTime: workEndTime,
                groupId,
                workShiftId,
                dateTime,
                userId: loginInfo.userId,
            };
            const res = await api.getAlarmOptimizationManagement(data);
            const { current, pageSize, total } = res;
            res['pagination'] = { current, pageSize, total };

            // setSelectedRows(res.data?.filter((e) => e.explainFlag === '上') || []);

            setSelectedRows((prev) => {
                const newSelectedRows = _.uniqBy([...prev, ...res.data?.filter((e) => e.explainFlag === '上')], 'id');
                const currentSelect = newSelectedRows.filter((e) => noSelectedRows.current.every((item) => item.id !== e.id));
                return currentSelect;
            });

            return res;
        }
        return [];
    };

    return (
        <>
            <ChangeShiftsEditTable
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
                        <Button type="primary" ghost onClick={handleAddModal}>
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </Button>
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
                tableColumnSettingConfigType="25"
                rowActions={[
                    {
                        type: RowAction.edit,
                        actionProps: {
                            editMode: 'custom',
                            handleCustomEdit: handleEditModal,
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
                    width={1200}
                    wrapClassName="change-shifts-add-modal-root"
                />
            )}
        </>
    );
}
