import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { message } from 'oss-ui';

// import useLoginInfoModel from '@Src/hox';
import ChangeShiftsEditTable from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { sendLogFn } from '@Pages/components/auth/utils';
import columns from './columns';
import api from './api';
import './index.less';

const Index = (props, ref) => {
    const { title, pattern, refreshFlag, pageType, moduleId } = props;
    const tableRef = useRef();
    const requestExecuteSheet = async (pagetion) => {
        const { schedulingObj, pageType, loginInfo } = props;
        const { groupId, workShiftId, dateTime, provinceId, professionalTypes, professionalType, lastWorkShiftId } = schedulingObj || {};
        if (!professionalType) {
            return {};
        }
        const data = {
            specialtys: professionalTypes,
            workShiftId,
            groupId,
            provinceId,
            dateTime,
            pageSize: pagetion?.pageSize || 5,
            pageNum: pagetion?.current || 1,
            userId: loginInfo.userId,
        };
        const result = await api.getExecuteSheet(data);
        result.pagination = {
            total: result?.total,
            pageSize: result?.pageSize,
            current: result?.current,
        };
        return result;
    };

    const networkFaultRecordSave = async (item) => {
        const addUrl = 'reinsuranceExecutionRecord/createReinsuranceExecutionRecord';
        const modifyUrl = 'reinsuranceExecutionRecord/updateReinsuranceExecutionRecord';
        // recordId 判断是否新增
        const { executeTime, executor, remarks, executiveCondition } = item;
        const { groupId } = props.schedulingObj || {};
        const param = {
            groupId,
            recordId: item.recordId,
            executor,
            remarks,
            executeTime,
            executiveCondition,
        };
        // const reg =
        //     /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/;
        // if (reg.test(executeTime)) {
        //     console.log('是日期格式');
        //     param.executeTime = executeTime;
        // } else {
        //     message.warn('请填写正确日期格式 如yyyy-MM-dd HH:mm:ss');
        //     return;
        // }
        sendLogFn({ authKey: 'workbench-Workbench-ReInsuranceExecutionRecord-Save' });
        // 校验是否可保存值班信息
        const checkResult = await props.saveItemInfoCheck();

        if (!checkResult) {
            return;
        }

        const result = await api.faultExecuteSave(item.recordId ? modifyUrl : addUrl, param);

        if (result.code === 200) {
            message.success('保存成功');
        } else {
            message.error('保存失败');

            throw new Error('保存失败');
        }
    };

    const networkFaultRecordDelete = async (item) => {
        // 校验是否可保存值班信息
        const checkResult = await props.saveItemInfoCheck();

        if (!checkResult) {
            return;
        }

        const { groupId } = props.schedulingObj || {};
        const param = {
            groupId,
            recordId: item.recordId,
        };
        const result = await api.faultExecuteDelete(param);
        console.log(result);
    };
    /**
     * 一键保存方法暴露，如果用到就往外传
     */
    const saveAll = async () => {
        const { editingKey, editingData, tempData } = tableRef.current.editingData();
        const flag = Object.keys(tempData).every((key) => {
            return tempData[key];
        });
        if (flag) {
            await networkFaultRecordSave({ ...tempData, recordId: undefined });
        }
        if (editingKey) {
            await networkFaultRecordSave({ ...editingData, recordId: editingKey });
        }
        tableRef.current.refreshAll();
    };
    useImperativeHandle(ref, () => {
        return {
            // wrapperSave: saveAll,
        };
    });
    return (
        <ChangeShiftsEditTable
            ref={tableRef}
            moduleId={moduleId}
            title={title}
            columns={columns}
            showNewEmptyRow
            startRefreshData={refreshFlag}
            rowKey="recordId"
            pattern={pattern}
            refreshDataService={requestExecuteSheet}
            showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
            rowActions={[
                {
                    type: 'edit',
                    actionProps: {
                        editMode: 'inline',
                        handleEditConfirm: networkFaultRecordSave,
                    },
                },
                {
                    type: 'delete',
                    actionProps: {
                        handleDelete: networkFaultRecordDelete,
                    },
                },
                {
                    type: 'add',
                    actionProps: {
                        handleAdd: networkFaultRecordSave,
                    },
                },
            ]}
        />
    );
};

export default forwardRef(Index);
