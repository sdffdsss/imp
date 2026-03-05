import React from 'react';
import ChangeShiftsEditTable from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import columns from './columns';
import './index.less';

export default function Index({ title, pageType, refreshFlag, moduleId }) {
    return (
        <ChangeShiftsEditTable
            moduleId={moduleId}
            title={title}
            columns={columns}
            showNewEmptyRow={false}
            rowKey="sheetNo"
            tableColumnSettingConfigType="13"
            rowActions={[]}
            refreshDataService={() => new Promise((resolve) => resolve({ pagination: {}, data: [] }))}
            showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
            startRefreshData={refreshFlag}
        />
    );
}
