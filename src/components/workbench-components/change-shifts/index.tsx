import React, { useState, useEffect, useRef, useContext } from 'react';
import useLoginInfoModel from '@Src/hox';
import DutyCalendar from '@Src/components/workbench-components/duty-calendar';
import ChangeShiftsWb from '@Src/pages/change-shifts-page/change-shifts/indexWb';
import shareActions from '@Src/share/actions';
import { GroupContext } from '@Pages/work-bench/context';
import { queryShiftingOfDutyNow, getShiftingOfDutyStatus } from './api';

const showChangeShiftsState = ['0', '1', '2', '1001', '1002'];
const ChangeShifts = (props) => {
    const [personnelState, setPersonnelState] = useState(''); // 0：班组人员无交接班,1：当班待交班人员,2：待接班人员,9：非班组成员
    const [loading, setLoading] = useState(true);
    const { updateModuleSettingInfo, updateModuleStyle, onGroupChange } = props;
    const groupInfo = useContext(GroupContext);

    // const timer: any = useRef();
    const { userId, currentZone } = useLoginInfoModel();

    const getShiftingOfDutyStatusData = async () => {
        const data = {
            userId,
        };
        const result = await queryShiftingOfDutyNow(data);
        setLoading(false);

        if (result.resultObj?.groupList.length === 0) {
            setPersonnelState('500');
        } else {
            const result1 = await getShiftingOfDutyStatus({ ...data, regionId: currentZone?.zoneId });
            setPersonnelState(result1.resultCode);
        }
    };
    const handleTimer = () => {
        // if (timer.current) {
        //     clearTimeout(timer.current);
        // }
        // timer.current = setInterval(() => {
        //     getShiftingOfDutyStatusData();
        // }, 1000 * 60 * 3);
        getShiftingOfDutyStatusData();
    };
    useEffect(() => {
        // handleTimer();
        return () => {
            // if (timer.current) {
            //     clearTimeout(timer.current);
            // }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (showChangeShiftsState.includes(personnelState)) {
            updateModuleStyle({ height: 1348 });
        } else {
            updateModuleStyle({ height: 804 });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personnelState]);

    useEffect(() => {
        if (props.loading) {
            handleTimer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loading]);
    useEffect(() => {
        let title = '交接班';
        let url = '';
        if (showChangeShiftsState.includes(personnelState)) {
            // 只有当班人员是值班记录
            url = '/unicom/home-unicom/setting/change-shifts-page';
            title = '值班记录';
        } else {
            url = '/unicom/home-unicom/monitor-date-list-search';
            title = '值班日历';
        }
        updateModuleSettingInfo((data) => {
            const nval = { ...data };
            nval.name = title;
            nval.extra.openUrl = url;
            return nval;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personnelState]);

    const handleSwitchUser = (newUserId) => {
        const { actions, messageTypes } = shareActions;

        actions?.postMessage?.(messageTypes.switchUser, {
            successorId: newUserId,
        });

        setTimeout(() => {
            handleTimer();
        }, 1000);
    };

    if (loading) {
        return null;
    }

    return showChangeShiftsState.includes(personnelState) ? (
        <ChangeShiftsWb
            key={groupInfo?.groupId}
            // statusInfo={statusInfo} // 不用传递给子组件，子组件内部自动3分钟更新
            personnelState={personnelState}
            refreshFlag={props.loading}
            groupInfo={groupInfo}
            operId="300047"
            onCompChange={getShiftingOfDutyStatusData}
            handleSwitchUser={handleSwitchUser}
        />
    ) : (
        <DutyCalendar onGroupChange={onGroupChange} />
    );
};
export default ChangeShifts;
