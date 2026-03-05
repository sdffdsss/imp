import React, { useEffect, useState } from 'react';
import { Icon } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { getView, getRegion } from './fault-dispatched/api';
import FaultDispathched from './fault-dispatched';
import './style.less';
const FaultScheduling = () => {
    const [leftValue, setLeftValue] = useState({ secondaryFilter: 0 });

    const login = useLoginInfoModel();
    const [windowData, setWindowData] = useState({});
    const [provinceList, setProvinceList] = useState([]);
    // const provinceList: any = useRef([]);
    const getViewList = async (userId) => {
        const data = {
            current: 1,
            pageSize: 20,
            showType: 2,
            userId: userId,
            windowType: 1,
            windowName: '待调度勿删',
        };
        const res = await getView(data);
        if (res.data) {
            setWindowData(res.data[0]);
        }
    };
    const getRegionData = async (id) => {
        const res = await getRegion(id);
        if (res.data) {
            setProvinceList(res.data.map((item) => item.zoneId));
        }
    };
    useEffect(() => {
        const { userId, systemInfo, userInfo } = login;
        const userInfoParse = (userInfo && JSON.parse(userInfo)) || {};
        const userInfos = systemInfo?.currentZone?.zoneId ? systemInfo.currentZone : userInfoParse.zones[0];
        if (userInfos.zoneLevel === '5') {
            getRegionData(userInfos.zoneId);
        }

        getViewList(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onResultChange = (data) => {
        setLeftValue(data);
    };
    return (
        <div className="fault-scheduling-page">
            <div className="fault-scheduling-page-body">
                <div className="fault-scheduling-page-body-tody">
                    <div className="img">
                        <Icon type="icondispatch" />
                    </div>
                    <div className="txt">
                        <span className="title">今日待调度</span>
                        <span className="value">{leftValue?.secondaryFilter}</span>
                    </div>
                </div>
            </div>
            <div className="fault-scheduling-page-table">
                <FaultDispathched provinceList={provinceList} viewData={windowData} onResultChange={onResultChange} />
            </div>
        </div>
    );
};
export default FaultScheduling;
