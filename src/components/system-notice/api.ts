import request from '@Common/api';

class Api {
    lapseUser = async (data) => {
        const result = request('api/users/lapseUser', {
            type: 'post',
            baseUrlType: 'bocoServiceDiscovery',
            showErrorMessage: false,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    };
}
export default new Api();
