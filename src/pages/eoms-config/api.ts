import request from '@Common/api';

class ServiceApi {
    /**
     * @description: 获取列表
     * @param data
     * @return
     */
    getEomsConfigList = (data) => {
        return request('/alarmmodel/dispatchConfig/v1/getDispatchEomsConfig', {
            type: 'get',
            baseUrlType: 'eomsConfigUrl',
            data,
        });
    };
    /**
     *
     * @description: 删除数据
     * @return
     */
    deleteEomsConfig = (data) => {
        return request('/alarmmodel/dispatchConfig/v1/deleteDispatchEomsConfig', {
            type: 'get',
            baseUrlType: 'eomsConfigUrl',
            defaultSuccessMessage: '删除成功',
            defaultErrorMessage: '删除失败',
            data,
        });
    };

    /**
     * @description: 添加数据
     * @param n*o
     * @return n*o
     */
    addOrUpdateEomsConfig = (data) => {
        return request('/alarmmodel/dispatchConfig/v1/addOrUpdateDispatchEomsConfig', {
            type: 'post',
            baseUrlType: 'eomsConfigUrl',
            defaultSuccessMessage: '保存成功',
            defaultErrorMessage: '保存失败',
            data,
        });
    };
}
export const Api = new ServiceApi();
