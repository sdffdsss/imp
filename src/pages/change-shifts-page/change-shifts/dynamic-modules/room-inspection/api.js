import request from '@Src/common/api';

/**
 * @description: 机房巡检表-数据获取
 * @param {*}
 * @return {*}
 */
export const getRoomInspection = (data) => {
    return request('inspection/select', {
        type: 'get',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};

/**
 * @description: 机房巡检表-数据保存
 * @param {*}
 * @return {*}
 */
export const saveRoomInspection = (mode, data) => {
    return request(`inspection/${mode}`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
