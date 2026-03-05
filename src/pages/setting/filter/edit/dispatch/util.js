/* eslint-disable radix */
import moment from 'moment';
import { _ } from 'oss-web-toolkits';

/**
 * 通过Id获取表单元素初始值
 * @param {规则动作} data
 * @param {规则动作Key} key
 */
const getInitValueBykey = (data, key) => {
    const tempObj = data.find((item) => item.key === key);
    if (_.isEmpty(tempObj)) {
        return false;
    }
    return tempObj.value;
};
/**
 *获取表单编辑回填值
 * @param {*} props
 */
export const getEditValues = (initialValues) => {
    let newValues = {};
    if (initialValues && Array.isArray(initialValues)) {
        newValues = {
            ...newValues,
            // 工程抑制派单，删除
            // restrainProjectAlarm:
            //     getInitValueBykey(initialValues, 'restrain_projectalarm') === '1' ? true : false,
            prehandle: getInitValueBykey(initialValues, 'prehandle') === '1',
            mainclearSubsendSwitch: getInitValueBykey(initialValues, 'switch') === '1',
            relatedAction: Number.parseInt(getInitValueBykey(initialValues, 'related')),
            alarmHandleLevel: Number.parseInt(getInitValueBykey(initialValues, 'alarmHandleLevel')),
        };
        const timeperiod = getInitValueBykey(initialValues, 'timeperiod');
        if (timeperiod) {
            newValues = {
                ...newValues,
                dispatchTimerangeSwitch: true,
                forwardTime: [moment(timeperiod.split('~')[0], 'HH:mm:ss'), moment(timeperiod.split('~')[1], 'HH:mm:ss')],
                nonForwardProcess: Number.parseInt(getInitValueBykey(initialValues, 'nonForwardProcess')),
            };
        }
        const dayperiod = getInitValueBykey(initialValues, 'Dayperiod');
        if (dayperiod) {
            const arr = dayperiod.split('~');
            if (arr[1] === '9999-12-31') {
                newValues = {
                    ...newValues,
                    noEndDate: 1,
                    startUseDate: moment(arr[0], 'YYYY-MM-DD'),
                    endUseDate: null,
                };
            } else {
                newValues = {
                    ...newValues,
                    noEndDate: 0,
                    startUseDate: moment(arr[0], 'YYYY-MM-DD'),
                    endUseDate: moment(arr[1], 'YYYY-MM-DD'),
                };
            }
            newValues = {
                ...newValues,
                dayPeriodSwitch: true,
            };
        }

        const alarmType = getInitValueBykey(initialValues, 'alarmType');

        if (alarmType) {
            newValues = {
                ...newValues,
                mainclearSubsendSwitch: true,
                alarmType,
            };
        }
        const rulePriority = getInitValueBykey(initialValues, 'rule_priority');
        if (rulePriority) {
            newValues = {
                ...newValues,
                rulePrioritySwitch: true,
                rulePriority: Number.parseInt(rulePriority),
            };
        }

        const delayseconds = getInitValueBykey(initialValues, 'Delayseconds');
        if (delayseconds) {
            newValues = {
                ...newValues,
                // delayTime: 0,//删除了花名册及资源时延，仅保留延时时间设置。
                delayseconds: Number.parseInt(delayseconds),
            };
        }

        const dayOfWeek = getInitValueBykey(initialValues, 'dayOfWeek');

        if (dayOfWeek) {
            newValues = {
                ...newValues,
                dayOfWeek: dayOfWeek.split(',').map((item) => Number.parseInt(item)),
            };
        }
        const holidays = getInitValueBykey(initialValues, 'holidays');

        if (holidays) {
            newValues = {
                ...newValues,
                holidays: holidays.split(',').map((item) => Number.parseInt(item)),
            };
        }
        const alarmHandleTime = getInitValueBykey(initialValues, 'alarmHandleTime');

        if (alarmHandleTime) {
            newValues = {
                ...newValues,
                alarmHandleTime: Number.parseInt(alarmHandleTime),
            };
        }
    }
    return newValues;
};

// 页面初始值
export const initialValues = {
    // 派单时间段
    forwardTime: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')],
    // 非派单时间段处理
    nonForwardProcess: 0,

    startUseDate: moment(), // 启用日期-开始时间
    endUseDate: moment().add(1, 'days'), // 启用日期-结束时间
    // 无结束日
    noEndDate: false,
    // 规则设置
    delayTime: 0,
    // 延迟时间-规则设置
    delayseconds: 0,
    // 主告警清除后子告警派单功能
    switch: false,
    alarmType: 'main_mainclear_subsend',

    // 规则优先级
    rulePriority: 2,
    // 关联关系动作
    relatedAction: 0,
    // 故障处理级别
    alarmHandleLevel: 5,
};
