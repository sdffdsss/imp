export const diffObjectList = (list1: any[], list2: any[], key: string) => {
    const isObjectInArray = (obj, arr) => {
        return arr.some((item) => {
            return key in item && item[key] === obj[key];
        });
    };

    // 找出在 s 中但不在 a 中的对象
    const diff = list1.filter((obj) => !isObjectInArray(obj, list2));
    return diff;
};
