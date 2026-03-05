import request from '@Common/api';
class ServiceApi {
    /**
     * @description: 获取省列表
     * @param {*}
     * @return {*}
     */
    getProvinceData = (userId) => {
        return request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
            },
        });
    };

    /**
     * @description: 获取地市列表
     * @param {*}
     * @return {*}
     */
    getProvinceRegions = (provinceId, userId) => {
        return request('group/findProvinceRegions', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                parentRegionId: provinceId,
                creator: userId,
            },
        });
    };

    // 获取归属专业
    getprofession = (data) => {
        return request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 100,
                dictName: 'professional_type',
                en: false,
                modelId: 2,
                // creator: userInfo.userId,
            },
        });
    };

    // 获取故障调度通知数据
    getNoticeList = (data) => {
        return request('faultScheduling/queryNoticeList', {
            type: 'post',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
    };
    /**
     * @description: 故障通知新增/修改
     * @param {*}
     * @return {*}
     */
    addNotice = (data) => {
        return request('faultScheduling/modify', {
            type: 'PUT',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '操作失败',
            data,
        });
    };

    /**
     * @description: 派单规则
     * @param {*}
     * @return {*}
     */
    getDispatchRule = (data) => {
        return request('/alarmmodel/filter/v1/filters', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
    };

    /**
     * @description: 故障通知字段查询
     * @param {*}
     * @return {*}
     */
    getFaultDictionary = (dictName) => {
        return request('dict/queryDict', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                dictName,
            },
        });
    };

    /**
     * @description: 班组信息查询
     * @param {*}
     * @return {*}
     */
    getTeamInfo = (data) => {
        return request('alarmResourceByeoms/queryMainTainTeamInfo', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取班组数据失败，请检查服务filterUrl',
            data,
        });
    };

    /**
     * @description: 查询故障通知明细信息
     * @param {*}
     * @return {*}
     */
    getNotice = (noticeId) => {
        return request('faultScheduling/queryNotice', {
            type: 'get',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                noticeId,
            },
        });
    };

    /**
     * @description: 删除通知
     * @param {*}
     * @return {*}
     */
    deleteNotice = (noticeId) => {
        return request(`faultScheduling/removeNotice?noticeId=${noticeId}`, {
            type: 'DELETE',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: '删除成功',
            defaultErrorMessage: '删除失败',
        });
    };

    /**
     * @description: 更新启停状态
     * @param {*}
     * @return {*}
     */
    updateEnabledeStatus = (data) => {
        return request('faultScheduling/modifyEnable', {
            type: 'PUT',
            baseUrlType: 'noticeUrl',
            // showSuccessMessage: false,
            defaultSuccessMessage: '更新状态成功',
            defaultErrorMessage: '更新状态失败',
            data,
        });
    };

    /**
     * @description: 通知记录
     * @param {*}
     * @return {*}
     */
    getNoticeRecord = (data) => {
        return request('faultScheduling/queryNoticeRecord', {
            type: 'post',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
    };

    // 同省份重复名称校验
    checkNoticeName = (data) => {
        return request('faultScheduling/checkNoticeName', {
            type: 'get',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '规则名称重复',
            data,
        });
    };

    // 通知失败详情
    noticeFailDetail = (data) => {
        return request('faultScheduling/queryNoticeRecord', {
            type: 'get',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            data,
        });
    };

    // 获取非通知时间段处理枚举
    getOutTimeOperationEnum = () => {
        return request('dict/queryDict', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            data: {
                dictName: 'out_time_dispose',
            },
        }).then((res) => {
            if (res.code === 200) {
                return res.data.map((item) => ({
                    label: item.dName,
                    value: item.dCode,
                }));
            }

            return [];
        });
    };
}
export const Api = new ServiceApi();
