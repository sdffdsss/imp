import request from '@Common/api';
/**
 * @description: 获取省列表
 * @param {*}
 * @return {*}
 */
export const getProvinceData = async (userId, provinceId) => {
    return new Promise((reslove) => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
                provinceId,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                return [];
            });
    });
};
