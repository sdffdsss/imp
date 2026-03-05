import request from '@Src/common/api';

const getDefaultProfession = async (data) => {
    return request('sysadminAlarm/getAlarmQueryConfig', {
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
        baseUrlType: 'filter',
    });
};
export { getDefaultProfession };
