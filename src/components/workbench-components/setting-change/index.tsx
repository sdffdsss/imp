import React, { useEffect, useState, useRef } from 'react';
// import { getSettingData, routeDataList } from './api';
import { message } from 'oss-ui';
import constants from '@Src/common/constants';
import actionss from '@Src/share/actions';
import { ReactComponent as WindowSvg1 } from '../img/u600.svg';
import { ReactComponent as WindowSvg2 } from '../img/u3255.svg';
import { logNew } from '@Common/api/service/log';
import './style.less';
import useLoginInfoModel from '@Src/hox';
import { Crypto } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import { getInitialProvince, getInitialProvinceOptions } from '@Common/utils/getInitialProvince';

interface settingType {
    label: string;
    value: string;
    imgUrl: string;
    openUrl: string;
    type: string;
}
const SettingChange = (props) => {
    const { optionValues } = props;
    const [settingData, setSettingData] = useState<settingType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [leftScroll, setLeftScroll] = useState<number>(0);
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const ref: any = useRef(null);
    const login = useLoginInfoModel();
    const province5Gc = [-1139861561, 1150126687, -662225376, 354339340, -640755821, -1489894494, 1059902420, 1161128211, -988740465];
    const show5Gc = province5Gc.find((item) => String(item) === String(getInitialProvince(login)));
    // const getSettingList = async () => {
    //     const res = await getSettingData();
    //     console.log(constants.STATIC_PATH);
    //     if (res.data) {
    //         const list = res.data.map((item) => {
    //             const imgUrl = routeDataList.find((items) => items.name === item.name);
    //             return {
    //                 ...item,
    //                 imgUrl: imgUrl?.image,
    //             };
    //         });
    //         setSettingData(list);
    //     }
    // };
    // useEffect(() => {
    //     getSettingList();
    // }, []);
    useEffect(() => {
        setSettingData(
            optionValues.filter((item) => {
                if (item.toolName === '5GC可视化监控' && !['1', '5'].includes(getInitialProvinceOptions(login)[0]?.level) && !show5Gc) {
                    return false;
                }
                return true;
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionValues]);
    const openType = (url, label, type, name) => {
        if (!url) {
            message.warn(`您没有${label}权限，请联系管理员在角色管理中授权`);
            return;
        }
        const { userInfo } = useLoginInfoModel.data;
        const { operations = [], loginId } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
        type && logNew(`监控工作台${name}`, type);
        if (url === '/znjkzl') {
            // 智能监控助理跳转
            const { entry } = fieldFlag;
            const timeStamp = dayjs().format('YYYYMMDDHHmmss');
            const sign = Crypto.MD5.hash(`${loginId}imsa&znjk@2023${timeStamp}`);
            const url = `${entry}?account=${loginId}&timestamp=${timeStamp}&sign=${sign}`;
            window.open(url);
            return;
        }
        const { actions, messageTypes } = actionss;
        actions &&
            actions.postMessage &&
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
            });
    };

    const toLeft = () => {
        setPage(page - 1);
        setLeftScroll(leftScroll + (ref?.current?.offsetWidth - 24 || 0));
        // setLeftScroll(0);
    };
    const toReft = () => {
        setPage(page + 1);
        setLeftScroll(leftScroll - (ref?.current?.offsetWidth - 24 || 0));
        // setLeftScroll(0);
    };
    return (
        <div
            ref={ref}
            className="setting-view-page"
            style={{ height: '100%', margin: '0 -12px', padding: '0 12px', overflow: 'hidden' }}
            onMouseOverCapture={() => setIsMouseOver(true)}
            onMouseLeave={() => {
                setIsMouseOver(false);
            }}
        >
            {isMouseOver && page !== 1 && (
                <div className="left-btn" onClick={toLeft}>
                    {props.theme === 'light' ? <WindowSvg1 /> : <WindowSvg2 />}
                </div>
            )}
            <div
                // gutter={[0, 10]}
                style={{
                    width: 5000,
                    display: 'flex',
                    height: '100%',
                    alignContent: 'space-evenly',
                    flexWrap: 'nowrap',
                    overflowY: 'hidden',
                    transform: `translateX(${leftScroll}px)`,
                    transition: 'all 1s ease 0s',
                }}
            >
                {settingData.map((item) => {
                    return (
                        <div key={item.value} style={{ width: (ref?.current?.offsetWidth - 24) / 6, height: 107 }}>
                            <div className="setting-view-page-field" style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    className="setting-view-page-field-image"
                                    onClick={() => openType(item?.openUrl, item?.label, item.type, item.label)}
                                >
                                    <img
                                        height={110}
                                        width={110}
                                        alt={item.label}
                                        src={
                                            item.imgUrl
                                                ? `${constants.STATIC_PATH}/images/home-work/${
                                                      props.theme === 'light' ? 'new-image' : 'new-image-darkBlue'
                                                  }/` + item.imgUrl
                                                : `${constants.STATIC_PATH}/images/home-work/${
                                                      props.theme === 'light' ? 'new-image' : 'new-image-darkBlue'
                                                  }/zbbbcx.png`
                                        }
                                    />
                                </div>
                                <div className="setting-view-page-field-content">{item.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isMouseOver && settingData.length > page * 6 && (
                <div className="right-btn" onClick={toReft}>
                    {props.theme === 'light' ? <WindowSvg1 /> : <WindowSvg2 />}
                </div>
            )}
        </div>
    );
};
export default SettingChange;
