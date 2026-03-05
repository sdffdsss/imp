import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import request from '@Common/api';
// @ts-ignore
import faultMock from './mock/fault.json';
// @ts-ignore
import heatmapMock from './mock/heatmap.json';
// @ts-ignore
import lineMock from './mock/line.json';

/**
 * @doc http://10.10.2.8:9091/project/703/interface/api/37710
 */
export const getOnlineDataApi = () => {
    return request('api/online/province', {
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'userInfolUrl',
    }).then((response) => {
        return {
            onlineData: response?.data || [],
            response,
        };
    });
};

/**
 * @doc http://10.10.2.8:9091/project/628/interface/api/33570
 */
export const getFaultReportDataApi = (options: { selProfessional: any; areaId: any; areaParam: any; timeType: any }, extra: any = {}) => {
    const { selProfessional, areaId, areaParam, timeType, ...restParams } = options;
    const param: any = {
        specialty: selProfessional?.specialty || '',
        failureClass: selProfessional?.failureClass || '',
        timeType,
        ...restParams,
    };
    if (areaId && areaId !== 'country' && areaId !== 'china' && !param.provinceId) {
        param.provinceId = areaParam[areaId] || undefined;
        if (!param.provinceId && extra.mapConfigList) {
            const areaInfo = extra.mapConfigList.find((d) => [Number(d.id), Number(d.adcode)].includes(Number(areaId)));
            if (areaInfo) {
                param.provinceId = areaInfo.id;
            }
        }
    }

    let api = request('faultReport/getReportFailureClassCount', {
        type: 'get',
        data: param,
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'fault',
    });

    if (faultMock.enableMock) {
        api = Promise.resolve(faultMock);
    }

    return api.then((response) => {
        const dataArr = response?.data || {};
        const aParam = {};
        dataArr.faultProvinceCount?.forEach((p) => {
            aParam[parseFloat(p.areaId)] = p.code;
        });
        dataArr.faultCityCount?.forEach((p) => {
            aParam[parseFloat(p.areaId)] = p.code;
        });

        return {
            faultReportData: dataArr,
            areaParam: aParam,
            areaId,
        };
    });
};

/**
 * @doc http://10.10.2.8:9091/project/633/interface/api/40023
 * @param params.regionId 初始化使用zoneId，下钻使用行政区划代码
 * @param params.regionLevel 初始化大区和全国为1，按照地图下钻级别传
 * @param params.specialty 所选专业
 */
export const getHeatmapDataApi = (params?: { regionId?: any; regionLevel?: any; specialty?: any }) => {
    let api: any = null;

    try {
        api = request('faultWorkSheet/reportStatistics', {
            baseUrlType: 'filter',
            showErrorMessage: false,
            showSuccessMessage: false,
            type: 'get',
            data: {
                regionId: params?.regionId ?? _.get(useLoginInfoModel, 'data.currentZone.zoneId'),
                regionLevel: params?.regionLevel,
                specialty: params?.specialty,
            },
        });
    } catch {
        //
    }

    if (heatmapMock.enableMock) {
        api = Promise.resolve(heatmapMock);
    }

    if (api) {
        return api.then((res) => {
            return _.get(res, 'dataObject.result');
        });
    }
    return [];
};
export const getLineDataApi = (params?: { regionId?: any; regionLevel?: any; specialty?: any }) => {
    let api: any = null;

    try {
        api = request('fiberOpticTrunkCable/queryMapData', {
            baseUrlType: 'filter',
            showErrorMessage: false,
            showSuccessMessage: false,
            type: 'post',
            data: {
                regionId: params?.regionId ?? _.get(useLoginInfoModel, 'data.currentZone.zoneId'),
                mapLevel: 1,
            },
        });
    } catch {
        //
    }

    if (api) {
        return api.then((res) => {
            return _.get(res, 'dataObject');
        });
    }
    return [];
};

export const getRelatedLineDataApi = (params?: { regionId?: any; regionLevel?: any; specialty?: any }) => {
    let api: any = null;

    try {
        api = request('fiberOpticTrunkCable/queryMapData', {
            baseUrlType: 'filter',
            showErrorMessage: false,
            showSuccessMessage: false,
            type: 'post',
            data: {
                regionId: params?.regionId ?? _.get(useLoginInfoModel, 'data.currentZone.zoneId'),
                mapLevel: 1,
            },
        });
    } catch {
        //
    }

    if (api) {
        return api.then((res) => {
            return _.get(res, 'dataObject');
        });
    }
    return [];
};
