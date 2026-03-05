import React, { Component } from 'react';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import ChangeShiftsEditTable from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import columns from './columns';
import api from './api';
import './index.less';

class Index extends Component {
    // 重保调度单
    requestReinsuranceSheet = async (pagetion) => {
        const { schedulingObj, pageType, loginInfo } = this.props;
        const { groupId, provinceId, dateTime, workShiftId, professionalTypes, professionalType, lastWorkShiftId, workBeginTime, workEndTime } =
            schedulingObj || {};

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
            dutyBeginTime: workBeginTime,
            dutyEndTime: workEndTime,
            userId: loginInfo.userId,
        };
        const result = await api.getReinsuranceSheet(data);
        result.pagination = {
            total: result?.total,
            pageSize: result?.pageSize,
            current: result?.current,
        };
        return result;
    };

    render() {
        const { title, pattern, refreshFlag, pageType, moduleId } = this.props;

        return (
            <ChangeShiftsEditTable
                moduleId={moduleId}
                title={title}
                startRefreshData={refreshFlag}
                columns={columns}
                showNewEmptyRow={false}
                rowKey="sheetNumber"
                pattern={pattern}
                tableColumnSettingConfigType="14"
                rowActions={[]}
                autoRefreshSetting={{ enable: true, interval: 60 * 3 * 1000 }}
                refreshDataService={this.requestReinsuranceSheet}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
            />
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
