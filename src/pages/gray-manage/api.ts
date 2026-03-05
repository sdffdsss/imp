import request from '@Common/api';

class ServiceApi {
    /**
     * @description: 获取省列表
     * @param {*}
     * @return {*}
     */
    getProvinces = () => {
        return request('api/zones', {
            type: 'get',
            baseUrlType: 'bocoServiceDiscovery',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                parent_zone_id: 0,
                zone_level: '2,5',
            },
        });
    };

    /**
     * @description: 获取用户信息
     * @param {*}
     * @return {*}
     */
    getUsers = (data) => {
        return request('api/users/zoneLevel', {
            type: 'get',
            baseUrlType: 'bocoServiceDiscovery',
            showSuccessMessage: false,
            defaultErrorMessage: '获取用户信息',
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
            data,
        });
    };

    /**
     * @description: 获取灰度列表
     * @param data
     * @return
     */
    getCanaryList = (data) => {
        return request('api/canary', {
            type: 'get',
            baseUrlType: 'bocoServiceDiscovery',
            data,
        });
    };

    /**
     * @description: 添加灰度数据
     * @param n*o
     * @return n*o
     */
    addNewCanaryData = (data) => {
        return request('api/canary', {
            type: 'post',
            baseUrlType: 'bocoServiceDiscovery',
            defaultSuccessMessage: '添加成功',
            defaultErrorMessage: '添加失败',
            data,
        });
    };

    /**
     *
     * @description: 删除灰度数据
     * @return
     */
    deleteCanaryData = (param) => {
        return request('api/canary', {
            type: 'delete',
            baseUrlType: 'bocoServiceDiscovery',
            defaultSuccessMessage: '删除成功',
            defaultErrorMessage: '删除失败',
            data: param,
        });
    };

    /**
     * @description: 添加灰度数据
     * @param n*o
     * @return n*o
     */
    editCanaryData = (data) => {
        return request('api/canary', {
            type: 'put',
            baseUrlType: 'bocoServiceDiscovery',
            defaultSuccessMessage: '修改成功',
            defaultErrorMessage: '修改失败',
            data,
        });
    };

    /**
     * @description: 批量修改
     * @param n*o
     * @return n*o
     */
    batchUpdateCanaryData = (data) => {
        return request('/api/canary/batchUpdate', {
            type: 'post',
            baseUrlType: 'bocoServiceDiscovery',
            defaultSuccessMessage: '修改成功',
            defaultErrorMessage: '修改失败',
            data,
        });
    };
}
export const Api = new ServiceApi();
