import { IZoneInfo } from './types';

export function initCurrentZoneInfo(systemInfo, userInfo): IZoneInfo {
    let currentZone: IZoneInfo = {};
    const firstZone = userInfo?.zones?.[0] || {};

    if (systemInfo?.currentZone?.zoneId) {
        currentZone = systemInfo?.currentZone;
    } else if (firstZone) {
        if (firstZone.zoneLevel === '3') {
            currentZone = { zoneId: firstZone.parentZoneId, zoneLevel: '2', zoneName: '' };
        } else {
            currentZone = firstZone;
        }
    }

    return currentZone;
}

export function initCurrentZoneLevelFlags(currentZone, userInfo) {
    const zoneLevel = currentZone.zoneLevel;

    const zoneLevelFlags = {
        // 全国级别
        isCountryZone: false,
        // 省份级别
        isProvinceZone: false,
        // 地市级别
        isCityZone: false,
        // 区县级别
        isCountyZone: false,
        // 大区级别
        isRegionZone: false,
        // 集团级别或者大区级别
        isCountryOrRegionZone: false,
    };

    if (zoneLevel === '1') {
        zoneLevelFlags.isCountryZone = true;
    } else if (zoneLevel === '2') {
        zoneLevelFlags.isProvinceZone = true;

        if (userInfo.zones[0].zoneLevel === '3') {
            zoneLevelFlags.isCityZone = true;
        }
    } else if (zoneLevel === '3') {
        zoneLevelFlags.isCityZone = true;
    } else if (zoneLevel === '4') {
        zoneLevelFlags.isCountyZone = true;
    } else if (zoneLevel === '5') {
        zoneLevelFlags.isRegionZone = true;
    }

    if (zoneLevel === '1' || zoneLevel === '5') {
        zoneLevelFlags.isCountryOrRegionZone = true;
    }

    return zoneLevelFlags;
}
