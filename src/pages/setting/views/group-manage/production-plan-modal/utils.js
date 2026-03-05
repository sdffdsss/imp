import { customAlphabet } from 'nanoid';
import { _ } from 'oss-web-toolkits';

export const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

export function transformWorkRecordConfigSave(data) {
    return data.reduce((accu, item) => {
        const [key, value] = item;

        const newValue = value?.map((item1) => {
            return item1.map((itemIn) => {
                const { type, subtype, value: valueTemp, compProps } = itemIn;
                let values;

                if (type === 'input') {
                    values = valueTemp;
                }

                if (type === 'select') {
                    values = compProps.options.map((itemTemp) => itemTemp.value);
                }

                if (type === 'radio') {
                    values = valueTemp;
                }
                return {
                    type,
                    identifier: `${type}_${subtype}`,
                    value: values,
                    result: values?.[0] || '',
                };
            });
        });
        return { ...accu, [key]: newValue };
    }, {});
}

export function transformWorkRecordConfigRetrieve(data) {
    return data.reduce((accu, item) => {
        const { planExecTime: key, workRecordConfig: value } = item;

        const newValue = value.map((item1) => {
            return item1.map((itemIn) => {
                let compProps = {};
                const [type, subtype1, subtype2] = itemIn.identifier.split('_');

                if (type === 'input') {
                    // eslint-disable-next-line no-case-declarations
                    let width = 0;

                    switch (subtype2) {
                        case undefined:
                        case '2':
                        case '':
                            width = 50;
                            break;
                        case '5':
                            width = (5 + 1) * 14;
                            break;
                        case '10':
                            width = 145;
                            break;
                        default:
                            break;
                    }

                    if (subtype1 === 'presets') {
                        width = '100%';
                    }

                    compProps = {
                        disabled: subtype1 === 'null',
                        style: {
                            width,
                        },
                        maxLength: 400,
                        defaultValue: itemIn.value?.[0],
                    };
                }

                if (type === 'select') {
                    compProps = {
                        options: itemIn.value.map((itemTemp) => ({ label: itemTemp, value: itemTemp })),
                        defaultValue: itemIn.value[0],
                    };
                }

                if (type === 'radio') {
                    compProps = {
                        options: itemIn.value,
                        maxLength: 400,
                    };
                }
                return {
                    fieldKey: nanoid(),
                    type,
                    subtype: [subtype1, subtype2].filter(Boolean).join('_'),
                    compProps,
                    value: itemIn.value,
                };
            });
        });

        return [...accu, [key, newValue]];
    }, []);
}
export function transformTableDataToSaveData(tableData, saveData) {
    const newSaveData = _.cloneDeep(saveData);
    newSaveData.mainProjects.forEach((item) => {
        item.subProjects.forEach((subItem) => {
            const temp = [];

            tableData.forEach((i) => {
                if (i.mainProject === item.mainProject && i.subProject === subItem.subProject) {
                    temp.push(i.workRecordConfig);
                }
            });
            subItem.workRecordConfig = transformWorkRecordConfigSave(temp) || [];
        });
    });

    return newSaveData;
}

const itmeSource = {
    name: '名称',
    startTime: '开始时间',
    type: '类型',
    endTime: '结束时间',
};
export const defineScheduleData = (data) => {
    const { date, advanceTime, delayTime } = data;
    if (!date || !Array.isArray(date)) {
        return '请完善班次';
    }
    let flag = false;
    date.map((item) => {
        Object.keys(item).forEach((itm) => {
            if ((!item[itm] && item[itm] !== 0) || item[itm] === '') {
                flag = itm;
            }
        });
    });
    if (flag) {
        return `请完善班次${itmeSource[flag]}`;
    }
    let crossSchedule = false;
    date.forEach((item) => {
        const sTime = item?.startTime;
        const sMinute = sTime.hour() * 60 + sTime.minute();
        const eTime = item?.endTime;
        const eMinute = eTime.hour() * 60 + eTime.minute();
        if (sMinute <= advanceTime || eMinute + delayTime >= 1440) {
            return (crossSchedule = `${item.name}时间设置有误，暂不支持当天交班的班次跨天接班`);
        }
    });
    if (crossSchedule) {
        return crossSchedule;
    }
    if (date[0]?.startTime?.format('HH:mm:ss') !== date[date.length - 1]?.endTime?.format('HH:mm:ss')) {
        return '最后一个班次结束时间要和第一个班次开始时间相等';
    }
    const newArr = date.map((item) => item.name);
    if (new Set(newArr).size !== newArr.length) {
        flag = 'name';
    }
    if (flag === 'name') {
        return `班次名称不能重复`;
    }
    if ((!advanceTime && advanceTime !== 0) || (!delayTime && delayTime !== 0)) {
        return '请完善提前/延后时间';
    }
    return 'success';
};
