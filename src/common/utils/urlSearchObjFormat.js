/* eslint-disable */
import { _ } from 'oss-web-toolkits';

export function urlSearchObjFormat(params, dest = 'obj') {
    const searchParams = new URLSearchParams(params);

    if (dest === 'obj') {
        if (_.isPlainObject(params)) {
            return params;
        }
        const returnObj = {};
        // 显示键/值对
        for (const [key, value] of searchParams.entries()) {
            returnObj[key] = value;
        }

        return returnObj;
    } else if (dest === 'str') {
        if (_.isString(params)) {
            return params;
        }

        return searchParams.toString();
    }
}
