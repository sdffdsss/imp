// @ts-ignore
import isObjectLike from '@antv/util/lib/is-object-like.js';
import isArrayLike from '@antv/util/lib/is-array-like.js';
import isString from '@antv/util/lib/is-string.js';

/**
 * 增加对function的对比
 * @param {*} value
 * @param {*} other
 */
const isEqual = function (value: any, other: any) {
    if (value === other) {
        return true;
    }
    if (!value || !other) {
        return false;
    }
    if (isString(value) || isString(other)) {
        return false;
    }
    if (isArrayLike(value) || isArrayLike(other)) {
        if (value.length !== other.length) {
            return false;
        }
        let rst = true;
        for (let i = 0; i < value.length; i++) {
            if (isDiffFunction(value[i], other[i])) {
                rst = value[i].toString() === other[i].toString();
            } else {
                rst = isEqual(value[i], other[i]);
            }
            if (!rst) {
                break;
            }
        }
        return rst;
    }
    if (isObjectLike(value) || isObjectLike(other)) {
        if (typeof value === 'function' && typeof other === 'function') {
            return value.toString() === other.toString();
        }

        const valueKeys = Object.keys(value);
        const otherKeys = Object.keys(other);
        if (valueKeys.length !== otherKeys.length) {
            return false;
        }
        let rst = true;
        for (let i = 0; i < valueKeys.length; i++) {
            if (isDiffFunction(value[valueKeys[i]], other[valueKeys[i]])) {
                rst = value[valueKeys[i]].toString() === other[valueKeys[i]].toString();
            } else {
                rst = isEqual(value[valueKeys[i]], other[valueKeys[i]]);
            }
            if (!rst) {
                break;
            }
        }
        return rst;
    }
    return false;
};

function isDiffFunction(v: any, o: any) {
    return typeof v === 'function' && typeof o === 'function';
}

export { isEqual as _isEqual };
