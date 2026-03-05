import { _ } from 'oss-web-toolkits';
import { fixedMap } from '../content/alarm-list/constants';

export function converter(data) {
    return data;
}

export function fieldListConverter(data) {
    const { userConfigs } = data;
    const { alarmConfigs, circuitConfigs } = userConfigs;

    return {
        userConfigs: {
            alarmConfigs: alarmConfigs?.map((item) => {
                const temp = _.clone(item);

                temp.fixed = fixedMap[String(item.fixed)];
                temp.show = Boolean(item.show);

                return temp;
            }),
            circuitConfigs: circuitConfigs?.map((item) => {
                const temp = _.clone(item);

                temp.fixed = fixedMap[String(item.fixed)];
                temp.show = Boolean(item.show);

                return temp;
            }),
        },
    };
}

export function fieldListSaveConverter(data) {
    const { alarmConfigs, circuitConfigs } = data;
    return {
        ...data,
        alarmConfigs: alarmConfigs.map((item) => {
            const temp = _.clone(item);
            // eslint-disable-next-line
            temp.fixed = item.fixed === 'left' ? 1 : item.fixed === 'right' ? 2 : 0;
            temp.show = Number(item.show);

            return temp;
        }),
        circuitConfigs: circuitConfigs.map((item) => {
            const temp = _.clone(item);
            // eslint-disable-next-line
            temp.fixed = item.fixed === 'left' ? 1 : item.fixed === 'right' ? 2 : 0;
            temp.show = Number(item.show);

            return temp;
        }),
    };
}

function circuitListFieldTransformer(data, isSelect, startIndex) {
    return data.map((circuitItem, circuitIndex) => {
        const id = Object.values(_.omit(circuitItem, 'alarmInfo')).join(',');

        return {
            ...circuitItem,
            id: `${id}-${Math.ceil(Math.random() * 1000)}`,
            index: startIndex + circuitIndex,
            alarmInfo: circuitItem.alarmInfo.map((item, index) => {
                return Object.entries(item).reduce((accu, [key, value]) => {
                    return {
                        ...accu,
                        index: index + 1,
                        [key]: key === 'standard_alarm_id' ? value.value : value.lable || value.value,
                        checked: isSelect,
                        originData: item,
                    };
                }, {});
            }),
        };
    });
}

export function alarmListConverter(res, config) {
    const { needMarkSelected = false } = config || {};
    const { selectData, notSelectData, data, alarmSeverity = {}, circuitTotal = 0, pageNum = 1, pageSize = 100 } = res;

    let index = (pageNum - 1) * pageSize + 1;

    const formatSelectData = circuitListFieldTransformer(selectData ?? [], needMarkSelected, index);
    index += selectData?.length || 0;
    const formatNotSelectData = circuitListFieldTransformer(notSelectData ?? [], false, index);

    const formatHistoryData = circuitListFieldTransformer(data ?? [], false, index);

    const alarmStatsData = {
        ...alarmSeverity,
        levelTotal: Object.values(alarmSeverity).reduce((accu, item) => {
            return accu + item;
        }, 0),
        circuitTotal,
    };

    return { ...res, selectData: formatSelectData, notSelectData: formatNotSelectData, data: formatHistoryData, alarmStatsData };
}

export function alarmFieldValueDict(data) {
    return data.map((item) => {
        return { value: item.dCode, label: item.dName };
    });
}
