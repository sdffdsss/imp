import request from '@Src/common/api';

export const getCityParentApi = (data) => {
    const api = request(`api/users/${data.userId}/mgmt/zones`, {
        type: 'get',
        data: {},
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'securityManagerUrl',
    });

    return api.then((response) => {
        return {
            province: response.data?.[0] || {},
        };
    });
};

/**
 * 获取区域信息接口
 * @param parentZoneId 父节点id
 * @returns
 */
export async function getZones(parentZoneId, zoneLevel?) {
    return request('bss/api/zones', {
        type: 'get',
        baseUrlType: 'userMangeUrl',
        data: {
            parentZoneId,
            zoneLevel,
        },
        // 是否需要显示成功消息提醒
        showSuccessMessage: false,
        // 成功提醒内容
        defaultSuccessMessage: '保存成功',
        // 是否需要显示失败消息提醒
        showErrorMessage: false,
    });
}
/**
 * 获取区域信息接口
 * @param parentZoneId 父节点id
 * @returns
 */
export function getConfiguration(data) {
    return request('v1/workStation/getLargeScreenConfiguration', {
        type: 'get',
        baseUrlType: 'filterUrl',
        data,
        // 是否需要显示成功消息提醒
        showSuccessMessage: false,
        // 成功提醒内容
        defaultSuccessMessage: '保存成功',
        // 是否需要显示失败消息提醒
        showErrorMessage: false,
    });
}

export function updateConfiguration(data) {
    return request('v1/workStation/addOrUpdateLargeScreenConfiguration', {
        type: 'post',
        baseUrlType: 'filterUrl',
        data,
        // 是否需要显示成功消息提醒
        showSuccessMessage: false,
        // 成功提醒内容
        defaultSuccessMessage: '保存成功',
        // 是否需要显示失败消息提醒
        showErrorMessage: false,
    });
}

// 获取图片
export function getThumbnailImg(data) {
    return request('systemAnnexes/downloadAnnexes', {
        type: 'get',
        baseUrlType: 'cacheUrl',
        data,
        // 是否需要显示成功消息提醒
        showSuccessMessage: false,
        // 成功提醒内容
        defaultSuccessMessage: '保存成功',
        // 是否需要显示失败消息提醒
        showErrorMessage: false,
        responseType: 'blob',
    });
}

// 获取重大故障
export const getFaultReportSpecialtyApi = (data: any) => {
    return request('production/getFaultReportSpecialty', {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'productionOperationScreenUrl',
        data,
    });
};
