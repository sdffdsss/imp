import request from '@Common/api';

export const getAllZones = () => {
    return request('api/zones', {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showErrorMessage: true,
        showSuccessMessage: false,
    });
};
// 获取专业枚举
export const getEnumApi = (data) => {
    return request('dict/getDictByFieldNames', {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 备注分页查询
export const getNotesPageListApi = (data) => {
    return request('IntraNetwork/notesPageList', {
        type: 'post',
        baseUrlType: 'alarmLongUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 备注新增
export const addNotesApi = (data) => {
    return request('IntraNetwork/addNotes', {
        type: 'post',
        baseUrlType: 'alarmLongUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 备注修改
export const updateNotesApi = (data) => {
    return request('IntraNetwork/updateNotes', {
        type: 'post',
        baseUrlType: 'alarmLongUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 备注删除
export const deleteNotesApi = (query) => {
    return request(`IntraNetwork/deleteNotes/${query.id}`, {
        type: 'delete',
        baseUrlType: 'alarmLongUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
    });
};
// 查询视图映射关系
export const getIntraNetWorkViewMappingApi = (data) => {
    return request(`IntraNetwork/getIntraNetWorkViewMapping`, {
        type: 'post',
        baseUrlType: 'alarmLongUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
