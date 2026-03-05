import request from '@Src/common/api';

export function getDictEnums(dictName, userId) {
    return request('alarmmodel/field/v1/dict/entry', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data: {
            dictName,
            en: false,
            modelId: 2,
            creator: userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        },
    }).then((res) => {
        if (res && Array.isArray(res.data)) {
            return res.data;
        }
        return [];
    });
}
