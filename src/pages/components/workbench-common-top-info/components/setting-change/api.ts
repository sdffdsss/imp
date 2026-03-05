import request from '@Common/api';

export const checkUserNameInCeneterApi = (data) => {
    return request('group/checkUserNameInCeneter', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
