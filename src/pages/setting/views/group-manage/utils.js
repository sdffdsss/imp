// 框架省份切换
import useLoginInfoModel from '@Src/hox';
import { findDefaultGroupByUser } from './api';

export const getInitialProvince = (province, userInfo) => {
    const info = userInfo && JSON.parse(userInfo);
    let initialProvince = info.zones[0]?.zoneId;
    if (province) {
        return (initialProvince = province);
    }
    if (info.zones[0]?.zoneLevel === '3') {
        initialProvince = info.zones[0]?.parentZoneId;
    }
    return initialProvince;
};

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

export async function getDefaultGroupByUser(data) {
    const { zoneLevelFlags } = useLoginInfoModel.data;

    if (zoneLevelFlags.isCountryZone) {
        const res = await findDefaultGroupByUser(data);

        if (res.resultCode === '200' && res.resultObj) {
            return res.resultObj;
        }
    }

    if (data) {
        return { professionalNames: [''], groupName: '', professionalType: '', professionalName: '', groupId: undefined, professionalTypes: [] };
    }
    return {
        professionalNames: [''],
        groupName: '',
        professionalType: '-1',
        professionalName: '全部',
        groupId: undefined,
        professionalTypes: ['-1'],
    };
}
