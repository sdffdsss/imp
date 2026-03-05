import moment from 'moment';
import { _ } from 'oss-web-toolkits';
/**
 *获取表单编辑回填值
 * @param {*} props
 */
export const getEditValues = (initialValues) => {
    const newValues = {};
    if (initialValues && Array.isArray(initialValues)) {
        initialValues.forEach((item) => (newValues[item.key] = item.value));
    }
    _.forEach(newValues, (value, key) => {
        if (key === 'SoundFlag') {
            newValues[key] = +value;
        } else if (key === 'SoundText') {
            // eslint-disable-next-line no-useless-escape
            newValues[key] = value.match(/[^\{\}]+(?=\})/g);
        } else if (key === 'IsValid') {
            newValues[key] = value !== 'false';
        } else if (key === 'Timeperiod' && value) {
            newValues[key] = [moment(value.split('-')[0], 'HH:mm'), moment(value.split('-')[1], 'HH:mm')];
        }
    });
    return newValues;
};
/**
 * 通过Id获取表单元素初始值
 * @param {规则动作} data
 * @param {规则动作Key} key
 */

// 页面初始值
export const initialValues = {
    IsValid: false,
    Timeperiod: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')],
    SoundFlag: 0
};
