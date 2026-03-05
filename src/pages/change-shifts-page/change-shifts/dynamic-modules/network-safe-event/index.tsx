import React, { useRef, useState } from 'react';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import useLoginInfoModel from '@Src/hox';
import { Button, Icon } from 'oss-ui';
import { sendLogFn } from '@Pages/components/auth/utils';
import Title from '../../components/dynamic-module-title';
import { columns } from './columns';
import * as api from './api';
import EditModel from './modal/edit';

import './index.less';

/**
 * 交接班-网络安全事件
 * @returns
 */
export default function Index({ title, pattern, schedulingObj, pageType, refreshFlag, loginInfo, saveItemInfoCheck, moduleId }) {
    const ref = useRef<any>(null);

    const { groupId, workShiftId, dateTime, lastWorkShiftId, workBeginTime, workEndTime, professionalType } = schedulingObj || {};
    const [modalVisible, setModalVisible] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [editType, setEditType] = useState({});

    const { currentZone } = useLoginInfoModel();
    const { zoneId } = currentZone;

    /**
     * @description: 打开编辑弹窗
     * @param {标记} flag  add: 新建  edit:编辑  look:查看
     * @return {*}
     */
    const showEditModal = async (record) => {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkSafeEvent-Edit' });
        setEditRow(record);
        setEditType('edit');
        setModalVisible(true);
    };

    /**
     * @description: 打开编辑弹窗
     * @param {标记} flag  add: 新建  edit:编辑  look:查看
     * @return {*}
     */
    const showAddModal = async () => {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkSafeEvent-Add' });
        setEditType('add');
        setEditRow({});
        setModalVisible(true);
    };

    const onModalClose = async () => {
        setModalVisible(false);
        setEditRow({});
    };

    const onModalOk = async () => {
        ref.current.refreshData();
        setModalVisible(false);
    };

    /**
     * 转换请求参数，并获取列表数据
     * @param pagination 组件发出的请求参数
     * @returns
     */
    const getNetWorkSafeEvent = async (pagination) => {
        if (professionalType?.length > 0) {
            const { current: pageNum } = pagination;
            const data = {
                provinceId: zoneId,
                pageNum,
                ...pagination,
                groupId,
                workShiftId,
                dateTime,
                dutyBeginTime: workBeginTime,
                dutyEndTime: workEndTime,
                professionIds: professionalType,
                userId: loginInfo.userId,
            };
            const res = await api.getNetWorkSafeEvent(data);
            const { current, pageSize, total } = res;
            res['pagination'] = { current, pageSize, total };
            return res;
        }
        return [];
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

    return (
        <>
            <ChangeShiftsEditTable
                moduleId={moduleId}
                title={title}
                pattern={pattern}
                // @ts-ignore
                ref={ref}
                columns={columns}
                rowActions={[
                    {
                        type: RowAction.edit,
                        actionProps: {
                            editMode: 'custom',
                            handleCustomEdit: showEditModal,
                        },
                    },
                ]}
                toolBarRender={
                    pattern === 'editable' && (
                        <Button type="primary" ghost onClick={showAddModal}>
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </Button>
                    )
                }
                startRefreshData={refreshFlag && professionalType?.length > 0}
                autoRefreshSetting={{ interval: 3 * 60 * 1000, enable: true }}
                refreshDataService={getNetWorkSafeEvent}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                tableColumnSettingConfigType="17"
            />
            {modalVisible && (
                <EditModel
                    visible={modalVisible}
                    editType={editType}
                    editRow={editRow}
                    onClose={onModalClose}
                    onOk={onModalOk}
                    handleSaveCheck={handleSaveCheck}
                />
            )}
        </>
    );
}
