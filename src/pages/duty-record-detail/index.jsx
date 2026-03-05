import React, { useEffect, useState } from 'react';
import { message } from 'oss-ui';
import ChangeShifts from '@Pages/change-shifts-page/change-shifts';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { urlSearchObjFormat } from '@Common/utils/urlSearchObjFormat';

export default function Index() {
    const [schedulingObj, setSchedulingObj] = useState(null);

    useEffect(() => {
        const schedulingObjTemp = urlSearchObjFormat(window.location.search, 'obj');

        if (
            schedulingObjTemp.hasOwnProperty('groupId') &&
            schedulingObjTemp.hasOwnProperty('workShiftId') &&
            schedulingObjTemp.hasOwnProperty('dateTime')
        ) {
            setSchedulingObj(schedulingObjTemp);
        } else {
            message.error('缺少班组参数');
        }
    }, []);

    return schedulingObj && <ChangeShifts isLog type={ShiftChangeTypeEnum.DutyRecords} schedulingObj={schedulingObj} />;
}
