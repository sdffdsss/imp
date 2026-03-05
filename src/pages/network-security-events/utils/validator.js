/* eslint-disable */

/**
 *
 * @param {*} str
 * @param {*} byte
 * @returns
 */
export const isLegalLength = (str, byte = 60) => {
    let realLength = 0;
    if (str) {
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
        }

        return realLength <= byte;
    } else {
        return true;
    }
    //eslint
};
