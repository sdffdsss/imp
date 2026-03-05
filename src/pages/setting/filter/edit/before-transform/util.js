import moment from 'moment';
import { _ } from 'oss-web-toolkits';

const formatList = (originArr, checkArr) => {
    const list = originArr
        .reduce((pre, cur) => {
            const target = pre.find((ee) => ee.id === cur.id);
            if (target) {
                Object.assign(target, cur);
            } else {
                pre.push(cur);
            }
            return pre;
        }, checkArr)
        .sort((a, b) => a.id - b.id)
        .map((item, index) => ({ ...item, id: index + 1 }));
    return list;
};

/**
 *获取表单编辑回填值
 * @param {*} props
 */
export const getEditValues = (initialValues) => {
    const newValues = {};
    const receiverArr = [];
    const intervalArr = [];
    const provinceArr = [];
    const relatedMeteamArr = [];
    const receiverEnumsArr = ['receiver', 'receiver2', 'receiver3', 'receiver4', 'receiver5'];
    const intervalEnumsArr = ['interval', 'interval1', 'interval2', 'interval3', 'interval4'];
    const provinceEnumsArr = ['province', 'province2', 'province3', 'province4', 'province5'];
    const relatedMeteamEnumsArr = ['relatedMeteam', 'relatedMeteam2', 'relatedMeteam3', 'relatedMeteam4', 'relatedMeteam5'];

    const emailReceiverInfo = {
        agent: {},
        copy: {},
    };
    const emailReceiverFieldReg = /(agent|copy)ManReceiver(\d)?$/;
    _.forEach(initialValues, (item) => {
        const { key } = item;
        const { value } = item;
        const matchArr = key.match(emailReceiverFieldReg);
        const [, type, sortNum = 1] = matchArr || [];
        // debugger;
        if ((key === 'delayTime' || key === 'sendMode' || key === 'frequency') && value) {
            newValues[key] = +value;
        } else if (key === 'dayPeriod' && value) {
            newValues.forwardDate = true;
            if (value.split('~').length === 1) {
                newValues.startForwardDate = moment(value.split('~')[0], 'YYYY-MM-DD');
                newValues.noEndDate = 1;
            } else {
                newValues.startForwardDate = moment(value.split('~')[0], 'YYYY-MM-DD');
                if (value.split('~')[1] === '9999-12-31') {
                    newValues.noEndDate = 1;
                    newValues.endForwardDate = null;
                } else {
                    newValues.endForwardDate = moment(value.split('~')[1], 'YYYY-MM-DD');
                }
            }
        } else if (key === 'timePeriod' && value) {
            newValues[key] = [moment(value.split('~')[0], 'HH:mm:ss'), moment(value.split('~')[1], 'HH:mm:ss')];
            newValues.modifyUseTime = true;
        } else if (key === 'cancelSendFlag' && value === '1') {
            newValues.isClearSMSContent = true;
        } else if (_.findIndex(receiverEnumsArr, (receiver) => receiver === key) !== -1) {
            if (initialValues.find((itemIn) => itemIn.key === 'sendMode')?.value === '3') {
                receiverArr.push({
                    id: _.findIndex(receiverEnumsArr, (receiver) => receiver === key) + 1,
                    temporaryNum: JSON.parse(value || '{}')?.t,
                    receiver: JSON.parse(value || '{}')?.r?.split(','),
                });
            } else {
                receiverArr.push({
                    id: _.findIndex(receiverEnumsArr, (receiver) => receiver === key) + 1,
                    temporaryNum: JSON.parse(value || '{}')?.t,
                    userIds: JSON.parse(value || '{}')?.u,
                });
            }
        } else if (_.findIndex(provinceEnumsArr, (province) => province === key) !== -1) {
            provinceArr.push({
                id: _.findIndex(provinceEnumsArr, (province) => province === key) + 1,
                province: {
                    label: JSON.parse(value || '{}')?.name,
                    value: JSON.parse(value || '{}')?.id,
                },
            });
        } else if (_.findIndex(relatedMeteamEnumsArr, (relatedMeteam) => relatedMeteam === key) !== -1) {
            relatedMeteamArr.push({
                id: _.findIndex(relatedMeteamEnumsArr, (province) => province === key) + 1,
                relatedMeTeam: JSON.parse(value || '[]').map((itemIn) => ({
                    label: itemIn.name,
                    value: itemIn.id,
                })),
            });
        } else if (_.findIndex(intervalEnumsArr, (receiver) => receiver === key) !== -1) {
            // 邮件规则
            const emailReceiverIntervalFieldReg = /interval(\d)$/;
            const [, number] = key.match(emailReceiverIntervalFieldReg) || [];
            // 说明是邮件规则
            if (initialValues.find((item) => item.key === 'agentManReceiver')) {
                emailReceiverInfo.agent[number].interval = +value;
            } else {
                intervalArr.push({ id: _.findIndex(intervalEnumsArr, (receiver) => receiver === key) + 1, times: +value });
            }
        } else if (matchArr) {
            // 邮件规则主送人
            Object.assign(emailReceiverInfo[type], {
                [sortNum - 1]: {
                    interval: undefined,
                    users: JSON.parse(value || '{}')?.u,
                    temps: JSON.parse(value || '{}')?.t ? JSON.parse(value || '{}')?.t.split(',') : [],
                },
            });
        } else if (key === 'synchroFilter' || key === 'whetherSmsMerge') {
            newValues[key] = value === 'true';
        } else if (key === 'smsMergeFields') {
            newValues[key] = value?.split(',').map((e) => e);
        } else {
            newValues[key] = value;
        }
    });

    let list = [];

    if (initialValues.find((itemIn) => itemIn.key === 'sendMode')?.value === '3') {
        list = receiverArr.map((item, index) => {
            return {
                ...item,
                ...(intervalArr[index - 1] || {}),
                ...provinceArr[index],
                ...relatedMeteamArr[index],
                id: index + 1,
            };
        });
    } else {
        list = formatList(receiverArr, intervalArr).slice(0, newValues.frequency);
    }
    if (newValues.noEndDate === 'true' || newValues.noEndDate === true) {
        newValues.noEndDate = true;
    } else if (newValues.noEndDate === 'false' || newValues.noEndDate === false) {
        newValues.noEndDate = false;
    } else {
        newValues.noEndDate = false;
    }

    if (newValues.isUseSmsTitle === 'true') {
        newValues.isUseSmsTitle = true;
    } else {
        newValues.isUseSmsTitle = false;
    }
    if (newValues.unlimitedTime === 'true') {
        newValues.unlimitedTime = true;
    } else {
        newValues.unlimitedTime = false;
    }
    if (newValues.isDisplayInSms === 'true') {
        newValues.isDisplayInSms = true;
    } else {
        newValues.isDisplayInSms = false;
    }

    newValues.everyTimes = list;
    newValues.emailReceiverInfo = emailReceiverInfo;
    return newValues;
};

// 页面初始值
export const initialValues = {
    delayTime: 0,
    modifyUseTime: false,
    timePeriod: [moment('08:00:00', 'HH:mm:ss'), moment('18:00:00', 'HH:mm:ss')],
    forwardDate: false,
    startForwardDate: moment(),
    endForwardDate: moment().add(1, 'days'),
    noEndDate: 0,
    isClearSMSContent: false,
    frequency: 1,
    sendMode: 0,
    everyTimes: [{ userGroup: undefined, times: undefined, userIds: '', temporaryNum: undefined }],
    synchroFilter: false,
    sendNo: false,
    isUseSmsTitle: false,
    unlimitedTime: false,
    isDisplayInSms: false,
    whetherSmsMerge: false,
    smsMergeFields: [],
    notificationType: ['1', '2'],
};
