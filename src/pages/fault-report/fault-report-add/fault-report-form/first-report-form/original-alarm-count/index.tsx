import React, { useEffect, useState } from 'react';
import { Button } from 'oss-ui';
import { createFileFlow } from '@Common/utils/download';
import { FAILURE_SOURCE_TYPE } from '../../../../type';
import { getOriginalAlarmCount, exportAlarm } from '../../../../api';

import './index.less';

type OriginalAlarmCountProps = {
    standardAlarmId?: string;
    source?: FAILURE_SOURCE_TYPE.AUTO | FAILURE_SOURCE_TYPE.MANUAL;
};
const OriginalAlarmCount: React.FC<OriginalAlarmCountProps> = (props) => {
    const { standardAlarmId, source } = props;

    const [originalAlarmCount, setOriginalAlarmCount] = useState<number | string>('');

    const onClick = async () => {
        const params = {
            activeIds: [standardAlarmId],
            fieldIds: [33, 90, 138, 7, 9, 30, 62, 4, 52, 56, 164, 362],
        };
        // exportAlarm(params);
        const res = await exportAlarm(params);
        if (!res) return;
        if (res.fileUrl) {
            createFileFlow(res.fileUrl);
        }
    };

    useEffect(() => {
        if (source === FAILURE_SOURCE_TYPE.AUTO) {
            getOriginalAlarmCount({ standardAlarmId }).then((res) => {
                if (res) {
                    setOriginalAlarmCount(res.total);
                }
            });
        }
    }, [standardAlarmId, source]);

    return (
        <div className="original-alarm-count-container">
            <span className="original-alarm-count">{originalAlarmCount}</span>
            <Button type="primary" onClick={onClick}>
                导出
            </Button>
        </div>
    );
};
export default OriginalAlarmCount;
