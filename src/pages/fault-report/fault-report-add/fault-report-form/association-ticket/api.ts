import request from '@Src/common/api';

// 获取专业
export const getDictEntryApi = (dictName, userId) => {
    return Promise.resolve(
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    const handleList = res.data;
                    return handleList;
                }
                return [];
            })
            .catch(() => {
                return [];
            }),
    );
};
