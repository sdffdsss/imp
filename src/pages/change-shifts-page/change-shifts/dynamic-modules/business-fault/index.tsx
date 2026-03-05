import React, { useEffect, useRef } from 'react';
import useLoginInfoModel from '@Src/hox';
import { Tooltip, message } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { useTableSelection } from '@Src/hooks';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import columns from './columns';
import * as api from './api';
import './index.less';

const rowKey = 'objectId';
export default function Index({ title, pageType, pattern, refreshFlag, schedulingObj, onSelectedKeysChange, saveItemInfoCheck, moduleId }) {
    const { currentZone, userName, loginId, userId } = useLoginInfoModel();
    const { groupId, workShiftId, dateTime, professionalTypes, workBeginTime: dutyBeginTime, workEndTime: dutyEndTime } = schedulingObj || {};

    const { selectedRows, setSelectedRows, onSelect, onSelectAll, noSelectedRows } = useTableSelection(rowKey);
    const firstRefreshFlagRef = useRef(true);

    const getBusinessFaultData = async (pagination) => {
        const { current: pageNum } = pagination;
        const { zoneId } = currentZone;
        const data = {
            provinceId: zoneId,
            ...pagination,
            pageNum,
            specialtys: professionalTypes,
            groupId,
            workShiftId,
            dateTime,
            dutyBeginTime,
            dutyEndTime,
            userName,
            loginId,
            userId,
        };
        if (_.isEmpty(professionalTypes)) {
            return {
                data: [],
                total: 0,
            };
        }
        const res = await api.getDutyBusinessFaultManagement(data);

        const { current, pageSize, total } = res;
        res['pagination'] = { current, pageSize, total };
        setSelectedRows((prev) => {
            const newSelectedRows = _.uniqBy([...prev, ...res.data?.filter((e) => e.explainFlag === '上')], 'objectId');
            const currentSelect = newSelectedRows.filter((e) => noSelectedRows.current.every((item) => item.objectId !== e.objectId));
            return currentSelect;
        });

        return res;
    };

    const businessFaultSave = async (item) => {
        // 校验是否可保存值班信息
        const checkResult = await saveItemInfoCheck();

        if (!checkResult) {
            return;
        }
        const { objectId, results } = item;
        const param = {
            objectId,
            results,
            userName,
        };
        const result = await api.updateFaultSheet(param);
        if (result.code === 200) {
            message.success('保存成功');
        } else {
            message.error('保存失败');
        }
    };

    useEffect(() => {
        onSelectedKeysChange(selectedRows.map((item) => item[rowKey]));
    }, [selectedRows]);

    useEffect(() => {
        if (refreshFlag === false) {
            firstRefreshFlagRef.current = true;
            setSelectedRows([]);
        }
    }, [refreshFlag]);

    return (
        <ChangeShiftsEditTable
            moduleId={moduleId}
            title={title}
            showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
            columns={columns}
            pattern={pattern}
            showNewEmptyRow={false}
            rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedRows.map((item) => item[rowKey]),
                onSelect,
                onSelectAll,
                getCheckboxProps: () => ({
                    disabled: pattern !== 'editable',
                }),
                columnWidth: 25,
                renderCell(checked, record, index, node) {
                    const isShow = selectedRows.find((e) => e[rowKey] === record[rowKey]);
                    if (isShow) {
                        return <Tooltip title="遗留到下个班次">{node}</Tooltip>;
                    }
                    return node;
                },
            }}
            rowKey={rowKey}
            tableColumnSettingConfigType="12"
            rowActions={[
                {
                    type: RowAction.edit,
                    actionProps: {
                        editMode: 'inline',
                        handleEditConfirm: businessFaultSave,
                    },
                },
            ]}
            refreshDataService={getBusinessFaultData}
            // refreshDataService={() => new Promise((resolve) => resolve({ pagination: {}, data: [] }))}
            startRefreshData={refreshFlag}
        />
    );
}
