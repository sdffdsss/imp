import request from '@Src/common/api';

/**
 * @description: 业务故障-微信群及保障事件-数据获取
 * @param {*}
 * @return {*}
 */
export const getBusinessWechatEvent = (data) => {
    return new Promise((resolve) => {
        request('shiftofdutyBusinessChangeShifts/getAssursWxList', {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data,
        }).then((res) => {
            resolve(res);
        });
    });
};

// 查询字典
export const getNetworkFaultDict = (data) => {
    return request(`networkFault/dict`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
