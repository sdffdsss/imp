import request from '@Src/common/api';

const baseUrlType = 'unicom';

class UnicomApi {
    async executeIdList(data) {
        const result = await request('apply/executeIdList', {
            type: 'post',
            showSuccessMessage: false,
            baseUrlType,
            data,
        });
        return result;
    }
}

export const unicomApi = new UnicomApi;
