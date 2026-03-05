import React, { useState, useEffect } from 'react';
// import AlarmFlowWindow from '@Components/alarm-flow-window';
import { Card } from 'oss-ui';
import { _ } from 'oss-web-toolkits';

const AlarmWindow = (props) => {
    const [alarmCardKey, setAlarmCardKey] = useState(new Date().getTime());
    useEffect(() => {
        setAlarmCardKey(new Date().getTime());
        return () => {};
    }, [props.lightInfo]);
    console.log(111);
    return (
        <>
            <Card
                size="small"
                title={_.get(props, 'lightInfo.name') ? `${_.get(props, 'lightInfo.name')}活动告警` : ''}
                style={{ height: 'calc(50% - 5px)', marginBottom: '10px' }}
            >
                {/* <AlarmFlowWindow key={alarmCardKey} winType="active" colunmsModelId={0} filterId={_.get(props, 'lightInfo.filterIds')} /> */}
            </Card>
            <Card
                size="small"
                title={_.get(props, 'lightInfo.name') ? `${_.get(props, 'lightInfo.name')}确认告警` : ''}
                style={{ height: 'calc(50% - 5px)' }}
            >
                {/* <AlarmFlowWindow key={alarmCardKey} winType="confirm" colunmsModelId={0} filterId={_.get(props, 'lightInfo.filterIds')} /> */}
            </Card>
        </>
    );
};

export default AlarmWindow;
