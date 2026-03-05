import formatReg from '@Common/formatReg';

/**
 *限制InputNumber只能输入0及正整数的数字
 */
export const limitDecimals = (value) => {
    return value.replace(formatReg.positiveIntegerWithZeroNew, '');
};
