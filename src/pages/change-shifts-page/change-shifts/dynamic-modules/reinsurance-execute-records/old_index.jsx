import React, { Component, createRef } from 'react';
import { message } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import ChangeShiftsEditTable from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { sendLogFn } from '@Pages/components/auth/utils';
import columns from './columns';
import api from './api';
import './index.less';
// 暂时没用到
class Index extends Component {
    tableRef = createRef();

    // 重保执行记录
    requestExecuteSheet = async (pagetion) => {
        const { schedulingObj, pageType, loginInfo } = this.props;
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

    networkFaultRecordSave = async (item) => {
        const addUrl = 'reinsuranceExecutionRecord/createReinsuranceExecutionRecord';
        const modifyUrl = 'reinsuranceExecutionRecord/updateReinsuranceExecutionRecord';
        // recordId 判断是否新增
        const { executeTime, executor, remarks, executiveCondition } = item;
        const { groupId } = this.props.schedulingObj || {};
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
        console.log(param);
        // 校验是否可保存值班信息
        const checkResult = await this.props.saveItemInfoCheck();

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

    networkFaultRecordDelete = async (item) => {
        // 校验是否可保存值班信息
        const checkResult = await this.props.saveItemInfoCheck();

        if (!checkResult) {
            return;
        }

        const { groupId } = this.props.schedulingObj || {};
        const param = {
            groupId,
            recordId: item.recordId,
        };
        const result = await api.faultExecuteDelete(param);
        console.log(result);
    };
    saveAll = () => {
        const { editingKey, data } = this.tableRef.current;
        data.forEach((item) => {
            const flag = Object.keys(item).every((key) => {
                return item[key] && item[key] !== '';
            });
            console.log(flag);
            this.networkFaultRecordSave({ ...item, recordId: editingKey || undefined });
        });
    };
    render() {
        const { title, pattern, refreshFlag, pageType, moduleId } = this.props;

        return (
            <ChangeShiftsEditTable
                tableRef={this.tableRef}
                moduleId={moduleId}
                title={title}
                columns={columns}
                showNewEmptyRow
                startRefreshData={refreshFlag}
                rowKey="recordId"
                pattern={pattern}
                refreshDataService={this.requestExecuteSheet}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                rowActions={[
                    {
                        type: 'edit',
                        actionProps: {
                            editMode: 'inline',
                            handleEditConfirm: this.networkFaultRecordSave,
                        },
                    },
                    {
                        type: 'delete',
                        actionProps: {
                            handleDelete: this.networkFaultRecordDelete,
                        },
                    },
                    {
                        type: 'add',
                        actionProps: {
                            handleAdd: this.networkFaultRecordSave,
                        },
                    },
                ]}
            />
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
