import { useEnvironmentModel } from '@Src/hox';
import { _ } from 'oss-web-toolkits';

const alarmCovert = (showItem) => {
    const alarmId = `${showItem.fp0?.value}_${showItem.fp1?.value}_${showItem.fp2?.value}_${showItem.fp3?.value}`;
    _.forOwn(showItem, (value) => {
        if (typeof value.value === 'number') {
            // eslint-disable-next-line no-param-reassign
            value.value = String(value.value);
        }
    });
    return {
        ...showItem,
        alarm_id: { field: 'alarm_id', lable: alarmId, num: '-1', value: alarmId },
        key: alarmId,
        children: showItem?.hasSubAlarm?.value === '1' ? [{ alarm_id: '', key: '' }] : []
    };
};

export const alarmFormatter = (datas) => {
    const { version } = useEnvironmentModel.data.environment;
    // 联通版本处理逻辑
    if (version === 'unicom') {
        return datas.map((showItem) => {
            return alarmCovert(showItem);
        });
    }
    // 通用版本处理逻辑
    if (datas.alarmRelationResultList.length) {
        const alarmsPool = datas.simpleAlarms.map((item) => {
            const showItem = Object.values(item)[0];
            // eslint-disable-next-line prefer-destructuring
            showItem.key = Object.keys(item)[0];
            return showItem;
        });
        return datas.alarmRelationResultList.map((item) => {
            let showItem = {};
            const mainAlarm = _.find(alarmsPool, (s) => s.key === item.parentAlarmId);
            if (mainAlarm) {
                showItem = alarmCovert(mainAlarm);
                if (item.childAlarmId && item.childAlarmId.length) {
                    showItem.children = [];
                    _.forEach(item.childAlarmId, (childId) => {
                        const childAlarm = _.find(alarmsPool, (s) => s.key === childId);
                        if (childAlarm) {
                            showItem.children.push(alarmCovert(childAlarm));
                        }
                    });
                }
            }
            return alarmCovert(showItem);
        });
    }
    return datas.simpleAlarms.map((item) => {
        const showItem = Object.values(item)[0];
        // eslint-disable-next-line prefer-destructuring
        showItem.key = Object.keys(item)[0];
        return alarmCovert(showItem);
    });
};
