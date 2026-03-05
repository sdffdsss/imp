import React, { useState, useEffect } from 'react';
import { Dropdown } from 'oss-ui';
import cls from 'classnames';
import { sendLogFn } from '@Pages/components/auth/utils';
import { getOnlineProvinceData } from '../../api';
import OnlineProvinceBg from '@Src/pages/troubleshooting-workbench/img/bg_online_province.png';
import OfflineProvinceBg from '@Src/pages/troubleshooting-workbench/img/bg_select_province.png';
import './index.less';

interface IProvinceItem {
    code: string;
    desc: string;
    num: number;
    zoneLat: string;
    zoneLng: string;
}

const countryItem = {
    code: 'country',
    desc: '全国',
    num: 0,
    zoneLat: '',
    zoneLng: '',
};

export default function Index({ onChange, provinceId, clickFlag, setClickFlag, goDownFlag, data, provinceOnlineCount, tempProvinceList, lowerFlag }) {
    // const [mode, setMode] = useState<'online' | 'fault'>('fault');
    const [modeInfo, setModeInfo] = useState<{
        mode: 'online' | 'fault';
        isOnline: boolean;
    }>({
        mode: 'fault',
        isOnline: false,
    });
    const [visible, setVisible] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<IProvinceItem>(countryItem);
    const [provinceList, setProvinceList] = useState<IProvinceItem[]>([]);
    const [onlineProvinceData, setOnlineProvinceData] = useState<{
        provinceOnlineCount: number;
        provinceOnlineDetailList: any[];
    }>({
        provinceOnlineCount: 0,
        provinceOnlineDetailList: [],
    });

    useEffect(() => {
        // refreshOnlineProvinceData();
        const timer = setInterval(() => {
            refreshOnlineProvinceData();
        }, 1000 * 60 * 3);

        return () => {
            clearInterval(timer);
        };
    }, []);
    useEffect(() => {
        setOnlineProvinceData({
            provinceOnlineCount,
            provinceOnlineDetailList: tempProvinceList,
        });
    }, [provinceOnlineCount, tempProvinceList]);

    useEffect(() => {
        // let param = {
        //     time,
        //     userId: login.userId,
        // };
        // getReportCount(param).then((res) => {
        //     if (res?.data) {
        //         setProvinceList([countryItem, ...res.data.faultProvinceCount]);
        //     }
        // });
        setProvinceList([countryItem, ...data]);
    }, [data]);

    useEffect(() => {
        onChange?.({
            modeInfo,
            selectedProvince,
        });
    }, [modeInfo, selectedProvince]);
    useEffect(() => {
        let selProvince = provinceList.find((e) => e.code === provinceId);
        if (selProvince && clickFlag) {
            setSelectedProvince(selProvince);
            setClickFlag(false);
        }
    }, [provinceId, goDownFlag]);

    function refreshOnlineProvinceData() {
        getOnlineProvinceData().then((res) => {
            if (res?.data) {
                setOnlineProvinceData(res.data);
            }
        });
    }

    function handleSelectProvince(item) {
        sendLogFn({ authKey: 'faultSchedule:switchProvince' });
        setSelectedProvince(item);
        // setMode('fault');
        setModeInfo({
            ...modeInfo,
            mode: 'fault',
        });
        setVisible(false);
    }

    return (
        <div className="group-workbench-province-select-wrapper" style={lowerFlag ? { top: 220 } : { top: 220 }}>
            {/* 直接换图片有个间隙 */}
            <div
                className="deco-button show-online-province-count-wrapper"
                style={{ backgroundImage: `url(${OnlineProvinceBg})`, opacity: modeInfo.isOnline ? 1 : 0 }}
                onClick={() => {
                    sendLogFn({ authKey: 'faultSchedule:switchProvince' });
                    // setMode(mode === 'online' ? 'fault' : 'online');
                    setModeInfo({
                        ...modeInfo,
                        isOnline: !modeInfo.isOnline,
                    });
                    setSelectedProvince(countryItem);
                }}
            >
                <b>{onlineProvinceData.provinceOnlineCount}</b>省在线/31省
            </div>
            <div
                className="deco-button show-online-province-count-wrapper"
                style={{ backgroundImage: `url(${OfflineProvinceBg})`, opacity: modeInfo.isOnline ? 0 : 1 }}
                onClick={() => {
                    sendLogFn({ authKey: 'faultSchedule:switchProvince' });
                    // setMode(mode === 'online' ? 'fault' : 'online');
                    setModeInfo({
                        ...modeInfo,
                        isOnline: !modeInfo.isOnline,
                    });
                    setSelectedProvince(countryItem);
                }}
            >
                <b>{onlineProvinceData.provinceOnlineCount}</b>省在线/31省
            </div>
            <div
                className="deco-button province-select-btn-wrapper"
                onClick={() => {
                    // setMode('fault');
                    setModeInfo({
                        ...modeInfo,
                        mode: 'fault',
                    });
                    setVisible(!visible);
                }}
            >
                <span className="cur-province-text" style={{ whiteSpace: 'nowrap' }}>
                    {selectedProvince.desc.length > 3 ? selectedProvince.desc.slice(0, 3) + '..' : selectedProvince.desc}
                </span>
                <Dropdown
                    getPopupContainer={(triggerNode) => triggerNode?.parentElement || document.body}
                    overlay={
                        <div className="group-workbench-province-list-wrapper">
                            {provinceList.map((item) => (
                                <div
                                    key={item.code}
                                    className={cls('province-item', { active: selectedProvince.code === item.code })}
                                    onClick={() => {
                                        handleSelectProvince(item);
                                    }}
                                >
                                    {item.desc}
                                </div>
                            ))}
                        </div>
                    }
                    placement="bottomRight"
                    visible={visible}
                >
                    <span className="switch-icon" />
                </Dropdown>
            </div>
        </div>
    );
}
