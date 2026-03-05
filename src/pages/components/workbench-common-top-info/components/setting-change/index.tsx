import React, { useEffect, useState, useRef, useMemo } from 'react';
import { message, Carousel } from 'oss-ui';
import { Crypto, _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import constants from '@Src/common/constants';
import actionss from '@Src/share/actions';
import { logNew } from '@Common/api/service/log';
import { getInitialProvince, getInitialProvinceOptions } from '@Common/utils/getInitialProvince';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import useLoginInfoModel from '@Src/hox';
import { ReactComponent as WindowSvg1 } from '../../img/u600.svg';
import { ReactComponent as WindowSvg2 } from '../../img/u3255.svg';
import { checkUserNameInCeneterApi } from './api';
import './index.less';

interface SettingType {
    toolName: string;
    menuId: number;
    imgUrl: string;
    openUrl: string;
    outsideMenuId: number;
    isPlaceholder?: boolean;
}

const SettingChange = (props) => {
    const { optionValues } = props;
    const [settingData, setSettingData] = useState<SettingType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const ref: any = useRef(null);
    const login = useLoginInfoModel();
    const province5Gc = [-1139861561, 1150126687, -662225376, 354339340, -640755821, -1489894494, 1059902420, 1161128211, -988740465];
    const show5Gc = province5Gc.find((item) => String(item) === String(getInitialProvince(login)));
    const carouselRef: any = useRef(null);
    useEffect(() => {
        const datas = optionValues.filter((item) => {
            if (item.toolName === '5GC可视化监控' && !['1', '5'].includes(getInitialProvinceOptions(login)[0]?.level) && !show5Gc) {
                return false;
            }
            return true;
        });
        if (datas.length % 6) {
            // 最后一页不足6个填充至6个
            for (let i = 0; i < datas.length % 6; i++) {
                datas.push({
                    buttonKey: null,
                    imgUrl: '',
                    menuId: '',
                    openUrl: '',
                    outsideMenuId: '',
                    toolName: '',
                    toolType: '',
                });
            }
        }
        setSettingData(datas);
    }, [optionValues]);

    const checkUserNameInCeneterData = async () => {
        const params = { operateUser: login.userId, provinceId: login.provinceId };
        const result = await checkUserNameInCeneterApi(params);
        if (result.code === 200) {
            return true;
        }
        return false;
    };

    const openType = async (item: any) => {
        console.log('item', item);
        const { userInfo, userZoneInfo } = useLoginInfoModel.data;
        const { operations = [], loginId, zones } = JSON.parse(userInfo);
        const { openUrl, toolName, outsideMenuId } = item;

        if (!openUrl) {
            message.warn(`您没有${toolName === '国际网络监控' ? `${toolName}-工具` : toolName}权限，请联系管理员在角色管理中授权`);
            return;
        }

        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${openUrl}`));
        console.log(
            'item',
            operations,
            openUrl,
            String(`/znjk/${constants.CUR_ENVIRONMENT}/main${openUrl}`),
            operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${openUrl}`)),
        );

        // 新版日志记录，有需要再加
        switch (toolName) {
            case '故障上报':
                if (zones[0].zoneId !== '0' && !(await checkUserNameInCeneterData())) {
                    message.warn('您不在监控中心的指定角色中，暂无上报权限');
                    return;
                }
                if (!fieldFlag) {
                    message.warn('您没有故障上报的权限，请联系管理员在角色管理中授权');
                    return;
                }
                sendLogFn({ authKey: 'workbenches:faultUpload' });
                break;
            case '国际网络监控':
                // eslint-disable-next-line no-case-declarations
                const hasPermissionMenuValue = ['international-resource-monitor-international', 'international-resource-monitor-domestic'].filter(
                    (item) => operations.some((itemIn) => item === itemIn.key),
                );

                if (hasPermissionMenuValue.length === 0) {
                    message.warn('您没有国际网络监控/国内网络监控的权限，请联系管理员在角色管理中授权');
                    return;
                }

                break;
            case '无线运营一省一屏':
                if (userZoneInfo.zoneLevel === '5') {
                    message.warn('暂未对大区开放权限');
                    return;
                }
                break;
            default:
                break;
        }

        outsideMenuId && logNew(`监控工作台${toolName}`, outsideMenuId);
        if (openUrl === '/znjkzl') {
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
                entry: openUrl,
            });
    };

    const toLeft = _.throttle(
        () => {
            setPage(page - 1);
            carouselRef.current.prev();
        },
        500,
        { leading: false, trailing: true },
    );

    const toReft = _.throttle(
        () => {
            setPage(page + 1);
            carouselRef.current?.next();
        },
        500,
        { leading: false, trailing: true },
    );

    return (
        <div
            ref={ref}
            className="workbench-top-info-setting-view-page"
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
            <Carousel ref={carouselRef} dots={false} slidesToShow={6} slidesToScroll={6} infinite={false}>
                {settingData.map((item) => {
                    return (
                        <div
                            key={item.menuId}
                            style={{ opacity: item.menuId ? 1 : 0, pointerEvents: item.menuId ? 'auto' : 'none' }}
                            className="workbench-tool-item"
                            onClick={() => openType(item)}
                        >
                            {!item.isPlaceholder ? (
                                <div className="item-content-wrapper">
                                    {item.menuId && (
                                        <img
                                            width={49}
                                            height={49}
                                            alt={item.toolName}
                                            src={
                                                item.imgUrl
                                                    ? `${constants.STATIC_PATH}/images/home-work/new-tool-icons/${item.imgUrl}`
                                                    : `${constants.STATIC_PATH}/images/home-work/${
                                                          props.theme === 'light' ? 'new-image' : 'new-image-darkBlue'
                                                      }/zbbbcx.png`
                                            }
                                        />
                                    )}
                                    <div className="workbench-top-info-setting-view-page-field-content">{item.toolName}</div>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </Carousel>
            {isMouseOver && settingData.length > page * 6 && (
                <div className="right-btn" onClick={toReft}>
                    {props.theme === 'light' ? <WindowSvg1 /> : <WindowSvg2 />}
                </div>
            )}
        </div>
    );
};
export default SettingChange;
