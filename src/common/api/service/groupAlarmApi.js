import request from '@Src/common/api';

const baseUrlType = 'groupAlarmUrl';

class GroupAlarmApi {
    async queryAlarmstat(creator, provinceId) {
        const result = await request('alarmstat-query/queryAlarmstat', {
            data: { creator, provinceId },
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '值班长信息',
            baseUrlType,
        });
        return result?.data;
    }
}

export const groupAlarmApi = new GroupAlarmApi();
