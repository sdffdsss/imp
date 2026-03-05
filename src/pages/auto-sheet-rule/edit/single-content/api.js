import request from '@Src/common/api';
/** *
 *派单内容新增时初始化
 */
const addWorksheet = (params) => {
    return new Promise((reslove) => {
        request('alarmmodel/filter/v1/filter/addWorksheet', {
            type: 'post',
            baseUrlType: 'singleContentUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '派单内容新增初始化失败',
            data: params,
        }).then((res) => {
            reslove(res.data);
        });
    });
};

/**
 * @description: 获取角色列表
 */
const getRolesDictionary = () => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'noticeUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取角色列表失败',
        data: {
            dictName: 'team_group_roles',
        },
    });
};
const getEnumOptions = (params) => {
    return request('alarmmodel/filter/v1/filter/getEnumByFieldName', {
        type: 'get',
        baseUrlType: 'singleContentUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取角色列表失败',
        params,
    });
};

export default {
    addWorksheet,
    getRolesDictionary,
    getEnumOptions,
};
