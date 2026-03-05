import moment from 'moment';
import { _ } from 'oss-web-toolkits';

/**
 *获取表单编辑回填值
 * @param {*} props
 */
export const getEditValues = (initialValues) => {
    const newValues = {};
    const receiverArr = [];
    const intervalArr = [];
    const receiverEnumsArr = ['receiver', 'receiver2', 'receiver3', 'receiver4', 'receiver5'];
    const intervalEnumsArr = ['interval', 'interval1', 'interval2', 'interval3', 'interval4'];

    _.forEach(initialValues, (item) => {
        const {key} = item;
        const {value} = item;
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
            newValues[key] = [moment(value.split('-')[0], 'HH:mm'), moment(value.split('-')[1], 'HH:mm')];
            newValues.modifyUseTime = true;
        } else if (key === 'cancelSendFlag' && value) {
            newValues.isClearSMSContent = 1;
        } else if (_.findIndex(receiverEnumsArr, (item) => item === key) !== -1) {
            receiverArr.push({
                id: _.findIndex(receiverEnumsArr, (item) => item === key) + 1,
                temporaryNum: JSON.parse(value).t,
                userIds: JSON.parse(value).u,
            });
        } else if (_.findIndex(intervalEnumsArr, (item) => item === key) !== -1) {
            intervalArr.push({ id: _.findIndex(intervalEnumsArr, (item) => item === key) + 1, times: +value });
        } else {
            newValues[key] = value;
        }
    });

    const list = formatList(receiverArr, intervalArr).slice(0, newValues.frequency);

    // list = formatList(list, newArrs);
    newValues.everyTimes = list;
    // 未明确是否需要回填如果时间开关未开启时填入新建的默认时间还是为空
    // if (!newValues.modifyUseTime) {
    //     newValues.timePeriod = [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')];
    // }
    // if (!newValues.forwardDate) {
    //     newValues.startForwardDate = moment();
    //     newValues.endForwardDate = moment().add(1, 'days');
    // }
    return newValues;
};
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

// 页面初始值
export const initialValues = {
    delayTime: 0,
    modifyUseTime: false,
    timePeriod: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')],
    forwardDate: false,
    startForwardDate: moment(),
    endForwardDate: moment().add(1, 'days'),
    noEndDate: 0,
    isClearSMSContent: 0,
    frequency: 1,
    sendMode: 0,
    everyTimes: [{ userGroup: undefined, times: undefined, userIds: '', temporaryNum: undefined }],
};
