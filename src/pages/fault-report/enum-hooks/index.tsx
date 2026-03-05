import { useState, useEffect } from 'react';
import useLoginInfoModel from '@Src/hox';
import {
    getRegionList,
    getReportLevelList,
    getReportTypeList,
    getMajorTypeList,
    getEquipmentTypeList,
    getCityParentRegionList,
    getFaultReportStatusList,
    getIsEffectBusinessList,
} from '../api';
import { RegionType } from '../type';

interface Props {
    province: string | number;
}

const useEnumHooks = (props: Props) => {
    const { userId, userInfo } = useLoginInfoModel();

    const [regionList, setRegionList] = useState<RegionType[]>([]);
    const [reportLevelList, setReportLevelList] = useState<RegionType[]>([]);
    const [isEffectBusinessList, setIsEffectBusinessList] = useState<RegionType[]>([]);
    const [reportTypeList, setReportTypeList] = useState<RegionType[]>([]);
    const [majorList, setMajorList] = useState<RegionType[]>([]);
    const [equipmentTypeList, setEquipmentTypeList] = useState<RegionType[]>([]);
    const [cityParentRegionList, setCityParentRegionList] = useState<RegionType[]>([]);
    const [faultReportStatusList, setFaultReportStatusList] = useState<RegionType[]>([]);

    const { province } = props;

    // 获取归属地市
    const getRegionEnumData = async () => {
        if (!province) {
            return;
        }

        const data = {
            parentRegionId: province,
            creator: userId,
        };
        // 获取归属地市
        const res = await getRegionList(data);
        if (Array.isArray(res)) {
            const currentUserInfo = JSON.parse(userInfo);
            if (currentUserInfo?.zones[0].zoneLevel === '3') {
                setRegionList(res);
                return;
            }
            if (Array.isArray(res.filter((item) => item.regionName === '省本部')) && res.filter((item) => item.regionName === '省本部')[0]) {
                res.unshift(
                    ...res.splice(
                        res.findIndex((i) => i.regionName === '省本部'),
                        1,
                    ),
                );
            }
            setRegionList(res || []);
        }
    };
    // 获取归属省份
    const getCityParentRegionEnumData = async () => {
        if (!province) {
            return;
        }

        const data = {
            parent_zone_id: province,
        };
        // 获取归属省份
        const res = await getCityParentRegionList(data);

        if (res && res._embedded && res._embedded.zoneResourceList) {
            const currentUserInfo = JSON.parse(userInfo);
            if (currentUserInfo?.zones[0].zoneLevel === '3') {
                setCityParentRegionList(
                    res._embedded.zoneResourceList.map((item) => {
                        return {
                            ...item,
                            regionName: item.zoneName,
                            regionId: String(item.zoneId),
                        };
                    }),
                );
                return;
            }
        }
    };

    // 获取是否影响业务
    const getIsEffectBusinessEnumData = async () => {
        const data = {};
        const res = await getIsEffectBusinessList(data);
        setIsEffectBusinessList(res?.data || []);
    };

    // 获取故障上报级别类型
    const getReportLevelEnumData = async () => {
        const data = {};
        const res = await getReportLevelList(data);
        setReportLevelList(res?.data || []);
    };

    // 获取最新上报类型
    const getreportTypeEnumData = async () => {
        const res = await getReportTypeList({});
        setReportTypeList(res?.data || []);
    };

    // 获取故障上报状态类型
    const getFaultReportStatusEnumData = async () => {
        const res = await getFaultReportStatusList({});
        setFaultReportStatusList(res?.data || []);
    };

    // 获取专业类型
    const getMajorEnumData = async () => {
        const res = await getMajorTypeList({});
        setMajorList(res?.data || []);
    };
    // 获取设备类别类型
    const getEquipmentEnumData = async () => {
        const data = {};
        const res = await getEquipmentTypeList(data);

        setEquipmentTypeList(res?.data || []);
    };

    // 初始获取枚举值
    useEffect(() => {
        if (province) {
            getRegionEnumData();
            getCityParentRegionEnumData();
        }
    }, [province]);

    useEffect(() => {
        getReportLevelEnumData();
        getreportTypeEnumData();
        getMajorEnumData();
        getEquipmentEnumData();
        getFaultReportStatusEnumData();
        getIsEffectBusinessEnumData();
    }, []);

    return {
        regionList,
        reportLevelList,
        reportTypeList,
        majorList,
        equipmentTypeList,
        cityParentRegionList,
        faultReportStatusList,
        isEffectBusinessList,
    };
};

export default useEnumHooks;
