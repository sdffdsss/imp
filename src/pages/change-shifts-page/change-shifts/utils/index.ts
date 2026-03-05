/**
 * 对应模块数组中有几项就说明有几种展示形式，空数组的说明不根据专业区分展现形式。不为空数组，未出现在数组中的专业id项，理论上在班组配置模块管理时该模块不会被选择
 * 每项中的专业id枚举见接口：serviceDiscovery/cloud-duty-manager-unicom/dict/getDictByFieldNames
 */
const moduleShowFormMap = {
    1: [[]],
    2: [[]],
    3: [[]],
    4: [[]],
    5: [[]],
    6: [[]],
    7: [[]],
    8: [[]],
    9: [[]],
    10: [[]],
    11: [[]],
    12: [[]],
    13: [[]],
    14: [[]],
    15: [[]],
    16: [[]],
    17: [[]],
    18: [[]],
    19: [['1'], ['9998', '9999', '9997', '80']],
    20: [[]],
    21: [[]],
    22: [[]],
    23: [['9996'], ['1'], ['9999'], ['9998']],
    24: [[]],
    25: [[]],
    26: [[]],
    27: [[]],
    28: [[]],
    29: [[]],
};

export function formatDynamicModules(data) {
    const returnArr: any[] = [];

    data.filter((item) => Boolean(item.checked) && item.moduleId !== 27 && item.moduleId !== 30).forEach((item) => {
        const { moduleId } = item;

        const professionals = (item.professionalTypes ?? []).map((itemP, index) => {
            const professionalNamesArr = item.professionalName?.split(',') || [];

            return {
                label: professionalNamesArr[index],
                value: itemP,
            };
        });

        if (moduleShowFormMap[moduleId].length === 1) {
            returnArr.push({
                ...item,
                professionals,
                title: item.moduleName,
                uniqueId: `${item.moduleId}`,
            });
        } else {
            (item.professionalTypes ?? []).forEach((itemIn, indexIn) => {
                const professionalNames = item.professionalName.split(',');
                const professionalName = professionalNames[indexIn];

                returnArr.push({
                    ...item,
                    professionals,
                    currentProfessional: { label: professionalName, value: itemIn },
                    title: `${item.moduleName}-${professionalName}`,
                    uniqueId: `${item.moduleId}-${itemIn}`,
                });
            });
        }
    });

    return returnArr;
}
