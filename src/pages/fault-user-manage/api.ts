import request from '@Common/api';

// 获取故障用户管理列表数据
export const getDataList = (data: any) => {
    return request('api/fault/role/list', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 获取专业和角色的字典数据
export const getDictByFieldName = (params: any) => {
    return request('api/dict/getDictByFieldName', {
        type: 'get',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params,
    });
};
// 获取用户列表（对齐安全管理功能角色：分权/分域参数体系）
export const getUserList = (params: any, zoneId?: string, zoneLevel?: string) => {
    return request('api/users/zoneLevel', {
        type: 'get',
        baseUrlType: 'bocoServiceDiscovery',
        data: {
            page_num: params ? params.pageNum : 1,
            page_size: params ? params.pageSize : 10,
            zone_id: zoneId || '',
            user_name: params && params.userName ? params.userName : '',
            role_type: 1,
            zone_level: zoneLevel || '1',
            flag: String(zoneLevel || '1') === '1' ? '1' : '2',
        },
        showErrorMessage: true,
        showSuccessMessage: false,
    });
};
// 已选角色回填
export const getSelectedRoles = (params: any) => {
    return request('api/fault/role/users/selected', {
        type: 'get',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: {
            roleId: params?.roleId,
            page_num: params?.pageNum ?? params?.page_num,
            page_size: params?.pageSize ?? params?.page_size,
            loginIdOrUserName: params?.loginIdOrUserName ?? params?.searchName,
        },
    });
};
// 新增角色
export const addRole = (params: any) => {
    return request('api/fault/role/add', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params,
    });
};
// 删除角色
export const deleteRole = (params: any) => {
    return request('api/fault/role/delete', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params,
    });
};
// 编辑角色
export const editRole = (params: any) => {
    return request('api/fault/role/update', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params
    });
};
// 角色添加用户
export const addUserToRole = (params: any) => {
    return request('api/fault/role/users/add', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params,
    });
};
// 角色删除用户
export const deleteUserFromRole = (params: any) => {
    return request('api/fault/role/users/remove', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: params,
    });
};
