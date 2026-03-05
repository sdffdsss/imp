export function transformFilterModalFields(data, action) {
    if (action === 'show') {
        return data.map((item) => {
            return {
                fieldInfo: {
                    label: item.codeName,
                    value: item.code,
                },
                operator: item.selectLogic ?? 'in',
                value: Array.isArray(item.selectContentList) ? item.selectContentList : undefined,
                dictName: item.dictName,
            };
        });
    }

    return data.map((item) => {
        return {
            code: item.fieldInfo.value,
            codeName: item.fieldInfo.label,
            selectLogic: item.operator,
            // eslint-disable-next-line
            selectContent: item.value ? (Array.isArray(item.value) ? item.value.join(',') : item.value) : '',
        };
    });
}
