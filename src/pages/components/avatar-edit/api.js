import request from '@Common/api';

export const getSelfAvatar = () => {
    return request('api/avatar/select', {
        type: 'get',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
    });
};

export const getUserAvatar = (data) => {
    return request('api/avatar/selectAll', {
        type: 'get',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data,
    });
};
export const saveUserAvatar = (data) => {
    return request('api/avatar/create', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

export const deleteUserAvatar = (data) => {
    return request('api/avatar/switchAvatar', {
        type: 'post',
        baseUrlType: 'bocoServiceDiscovery',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
