import useLoginInfoModel from '@Src/hox';
import request from '@Common/api';

const getZones = (data) => {
    return request('/api/zones', {
        type: 'get',
        baseUrlType: 'userInfolUrl',
        showSuccessMessage: false,
        showErrorMessage: true,
        data,
    });
};
export const getProvince = async () => {
    const { provinceId, zoneLevelFlags } = useLoginInfoModel.data;
    const result: any = await getZones({ parent_zone_id: 0 });
    // eslint-disable-next-line no-underscore-dangle
    const fullList = result?._embedded.zoneResourceList;
    let list = [];
    if (zoneLevelFlags.isCountryZone) {
        list = fullList.filter((item: any) => item.zoneLevel === 2);
    } else if (zoneLevelFlags.isRegionZone) {
        list = fullList.filter((item: any) => item.parentZoneId === Number(provinceId));
    } else if (zoneLevelFlags.isProvinceZone) {
        list = fullList.filter((item: any) => item.zoneId === Number(provinceId));
    } else if (zoneLevelFlags.isCityZone) {
        list = fullList.filter((item: any) => item.parentZoneId === Number(provinceId));
    }
    const optionList = list.map((item: any) => {
        return {
            label: item.zoneName,
            value: item.zoneId,
        };
    });
    return optionList || [];
};

export const getProvinceAndRegions = async () => {
    const { provinceId, zoneLevelFlags } = useLoginInfoModel.data;
    const result: any = await getZones({ parent_zone_id: 0 });
    // eslint-disable-next-line no-underscore-dangle
    const fullList = result?._embedded.zoneResourceList;
    let list = [];
    if (zoneLevelFlags.isCountryZone) {
        list = fullList.filter((item: any) => item.zoneLevel === 2 || item.zoneLevel === 5);
    } else if (zoneLevelFlags.isRegionZone) {
        list = fullList.filter((item: any) => item.parentZoneId === Number(provinceId));
    } else if (zoneLevelFlags.isProvinceZone) {
        list = fullList.filter((item: any) => item.zoneId === Number(provinceId));
    } else if (zoneLevelFlags.isCityZone) {
        list = fullList.filter((item: any) => item.parentZoneId === Number(provinceId));
    }
    const optionList = list.map((item: any) => {
        return {
            label: item.zoneName,
            value: item.zoneId,
        };
    });
    return optionList || [];
};
