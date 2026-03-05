import zoneLevel from '../enum/zoneLevel';
import request from '@Src/common/api';

/**
 * 获取区域信息接口
 * @param parentZoneId 父节点id
 * @returns
 */
async function getZones(parentZoneId, zoneLevel?) {
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
 * 集团用户-->集团
 * 大区用户-->当前大区
 * 省份用户-->当前省份
 * 地市用户-->当前省份
 * @param relationZone 用户归属区域
 * @param currentZone 当前选择区域
 * @returns
 */
async function getZonesNormalCase(relationZone, currentZone) {
    let provincesList: Array<any> = [];

    // 记录下此人本身的归属区域id与级别
    const { zoneLevel: initialZoneLevel, parentZoneId } = relationZone;
    if (initialZoneLevel === zoneLevel.company) {
        switch (currentZone?.zoneLevel) {
            case zoneLevel.company:
                // provincesList = provincesListAll.filter((item) => (currentZone?.zoneId ? currentZone?.zoneId === item.regionId : true));
                provincesList = [currentZone];
                break;
            case zoneLevel.region:
            case zoneLevel.province:
                provincesList = [currentZone];
                break;
            default:
                break;
        }
    } else if (initialZoneLevel === zoneLevel.region) {
        switch (currentZone?.zoneLevel) {
            case zoneLevel.region:
                provincesList = [currentZone];
                break;

            case zoneLevel.province:
                provincesList = [currentZone];
                break;
            default:
                break;
        }
    } else if (initialZoneLevel === zoneLevel.province) {
        provincesList = [relationZone];
    } else if (initialZoneLevel === zoneLevel.city) {
        // 如果是地市用户，需要用地市id找到省信息
        const { data: provincesListAll } = await getZones(undefined, zoneLevel.province);

        provincesList = provincesListAll.filter((item) => {
            return item.zoneId === parentZoneId;
        });
    } else if (initialZoneLevel === zoneLevel.county) {
        // TODO - 暂时没有区县用户
    }
    return provincesList;
}

/**
 * 集团用户-->集团+8个大区
 * 大区用户-->当前大区
 * 省份用户-->当前省份
 * 地市用户-->当前地市
 * @param relationZone 用户归属区域
 * @param currentZone 当前选择区域
 */
async function getZonesCaseOne(relationZone, currentZone) {
    let provincesList: Array<any> = [];

    // 记录下此人本身的归属区域id与级别
    const { zoneLevel: initialZoneLevel, zoneId: initialProvinceId } = relationZone;

    if (initialZoneLevel === zoneLevel.company) {
        const { data: provincesListAll } = await getZones(initialProvinceId);

        switch (currentZone?.zoneLevel) {
            case zoneLevel.company:
                provincesListAll.unshift(currentZone);
                provincesList = provincesListAll;
                break;
            case zoneLevel.region:
            case zoneLevel.province:
                provincesList = [currentZone];
                break;
            default:
                break;
        }
    } else if (initialZoneLevel === zoneLevel.region) {
        provincesList = [currentZone || relationZone];
    } else if (initialZoneLevel === zoneLevel.province) {
        provincesList = [relationZone];
    } else if (initialZoneLevel === zoneLevel.city) {
        provincesList = [relationZone];
    }

    return provincesList;
}

export { getZonesNormalCase, getZonesCaseOne };
