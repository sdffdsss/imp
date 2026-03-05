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
        parentKey: showItem.parentKey || [],
        alarm_id: { field: 'alarm_id', lable: alarmId, num: '-1', value: alarmId },
        rowKey: showItem.parentKey ? `${alarmId}_sub` : alarmId,
        key: alarmId,
        children: showItem?.hasSubAlarm?.value === '1' ? [{ alarm_id: '', key: '' }] : [],
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
    if (datas?.alarmRelationResultList?.length) {
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
    if (datas?.simpleAlarms?.length) {
        return datas.simpleAlarms.map((item) => {
            const showItem = Object.values(item)[0];
            // eslint-disable-next-line prefer-destructuring
            showItem.key = Object.keys(item)[0];
            return alarmCovert(showItem);
        });
    }
    return [];
};

export const getDatasWithSubAlarm = (alarms) => {
    let datas = [];
    _.forEach(alarms, (item) => {
        if (item.children && item.children.length) {
            datas = datas.concat(item.children);
        }
        datas.push(item);
    });
    return datas;
};
export const getAlarmContextMenu = (alarmContextMenu, version) => {
    if (version !== 'unicom') {
        return alarmContextMenu;
    }
    let currentMenu = alarmContextMenu;
    for (let menus of Object.values(currentMenu)) {
        const exIndex = menus.findIndex((me) => me.key === 'AlarmExport');
        if (exIndex >= 0) {
            menus.splice(exIndex, 1);
        }
    }
    return currentMenu;
};
