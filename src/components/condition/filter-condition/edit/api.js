import request from '@Common/api';

export const getAlarmTitleList = (data) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/filter/v1/filter/alarm/titles', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                ruleTypeId: 1,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

export const uploadFile = (data) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/filter/v1/filter/condition/value', {
            type: 'post',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

export const dictEntry = (data) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                en: false,
                modelId: 2,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
