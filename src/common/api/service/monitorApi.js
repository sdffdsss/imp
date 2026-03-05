import request from '@Src/common/api';

const baseUrlType = 'monitorUrl';

class MonitorApi {
    async getLoginUserInfo(userId) {
        const result = await request(`api/users/${userId}/userType`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败'
        });
        return result || [];
    }

    async handoverCheck(nextDutierCode) {
        const result = await request(`api/users/${nextDutierCode}/operations`, {
            type: 'get',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败'
        });
        return result;
    }
}

export const monitorApi = new MonitorApi;