import React, { useState, useEffect } from 'react';
import { Tooltip, Spin, message } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import constants from '@Common/constants';
import { sendLogFn } from '@Pages/components/auth/utils';
import GlobalMessage from '@Common/global-message';
import { getCityParentApi, getZones, getConfiguration, getThumbnailImg, getFaultReportSpecialtyApi } from './api';

import suffixImg from './img/suffix.png';
import styles from './index.module.less';
import './style.less';

const bg = `${constants.IMAGE_PATH}/screen-console/bg.jpeg`;
const itemBg = `${constants.IMAGE_PATH}/screen-console/item_bg.png`;
const itemBgActive = `${constants.IMAGE_PATH}/screen-console/item_bg_active.png`;
const slash = `${constants.IMAGE_PATH}/screen-console/slash.png`;

function Item({ index, data, onClick }) {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className={styles['large-screen-console-screen-item']}
            style={{ backgroundImage: `url(${isHover ? itemBgActive : itemBg})` }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={() => onClick(data)}
        >
            <div className={styles['large-screen-console-screen-item-title']}>{data.text}</div>
            <div className={styles['large-screen-console-screen-item-thumbnail']}>
                <img src={data.imgUrl} alt="" className={styles['large-screen-console-screen-item-thumbnail-img']} />
            </div>
            <Tooltip
                title={data.desc}
                // eslint-disable-next-line no-nested-ternary
                placement={index === 0 || index === 3 ? 'bottomRight' : index === 1 || index === 4 ? 'bottom' : 'bottomLeft'}
                overlayClassName={`large-screen-console-screen-item-desc-tooltip ${data.id}`}
            >
                <div className={styles['large-screen-console-screen-item-description']}>{data.desc}</div>
            </Tooltip>
            {/* {data.desc?.length > 90 ? (
                <Tooltip
                    title={data.desc}
                    // eslint-disable-next-line no-nested-ternary
                    placement={index === 0 || index === 3 ? 'bottomRight' : index === 1 || index === 4 ? 'bottom' : 'bottomLeft'}
                    overlayClassName={`large-screen-console-screen-item-desc-tooltip ${data.id}`}
                >
                    <div className={styles['large-screen-console-screen-item-description']}>{data.desc}</div>
                </Tooltip>
            ) : (
                <div className={styles['large-screen-console-screen-item-description']}>{data.desc}</div>
            )} */}
        </div>
    );
}

function readImgData(thumbnailId) {
    return new Promise((resolve) => {
        const imgCache = localStorage.getItem('large-screen-console-img-cache');

        if (imgCache) {
            const parseCache = JSON.parse(imgCache);
            const correspondingImg = parseCache[thumbnailId];

            if (correspondingImg) {
                resolve({ [thumbnailId]: correspondingImg });
            } else {
                const reader = new FileReader();

                reader.onload = (event) => {
                    resolve({ [thumbnailId]: event.target.result });
                };
                reader.onerror = () => {
                    resolve({ [thumbnailId]: '' });
                };
                getThumbnailImg({ annexesId: thumbnailId }).then((res) => {
                    reader.readAsDataURL(res);
                });
            }
        } else {
            const reader = new FileReader();

            reader.onload = (event) => {
                resolve({ [thumbnailId]: event.target.result });
            };
            reader.onerror = () => {
                resolve({ [thumbnailId]: '' });
            };
            getThumbnailImg({ annexesId: thumbnailId }).then((res) => {
                reader.readAsDataURL(res);
            });
        }
    });
}

export default function Index() {
    const { systemInfo, parsedUserInfo: userInfo, userId } = useLoginInfoModel();
    const { environment } = useEnvironmentModel();
    // const { productionOperationAuth } = environment;
    const [currentConfig, setCurrentConfig] = useState([]);

    useEffect(() => {
        getConfiguration({ userId }).then((res) => {
            if (res.code === 0) {
                const thumbnailIds = res.data.reduce((accu, item) => {
                    return [...accu, ...item.children.map((itemIn) => itemIn.thumbnailId)];
                }, []);

                const uniqueIds = [...new Set(thumbnailIds)];

                const promiseArr = uniqueIds.map((item) => {
                    return readImgData(item);
                });

                Promise.all(promiseArr).then((resArr) => {
                    const imgDataMap = resArr.reduce((accu, item) => {
                        return { ...accu, ...item };
                    }, {});

                    localStorage.setItem('large-screen-console-img-cache', JSON.stringify(imgDataMap));

                    const resData = res.data.map((item) => {
                        return {
                            ...item,
                            children: item.children.map((itemIn) => {
                                return {
                                    ...itemIn,
                                    imgUrl: imgDataMap[itemIn.thumbnailId],
                                };
                            }),
                        };
                    });

                    setCurrentConfig(resData);
                });
            } else {
                message.error(res.message);
            }
        });
    }, [userId]);

    useEffect(() => {
        function fn({ isActive }) {
            const tabWrapper = document.querySelector('.framework-tab');

            if (isActive) {
                tabWrapper?.classList.add('framework-tab-large-screen-console-page-item');
            } else {
                tabWrapper?.classList.remove('framework-tab-large-screen-console-page-item');
            }
        }
        fn({ isActive: true });
        GlobalMessage.on('activeChanged', 'large-screen-console', fn);

        return () => {
            GlobalMessage.off('activeChanged', 'large-screen-console', fn);
        };
    }, []);

    async function jumpToBigScreen(item) {
        const { url, text, operKey, authorizeUrl, largeScreenId } = item;
        const { operations = [] } = userInfo;

        sendLogFn({ authKey: operKey });
        if (!url) {
            message.error(`大屏页面地址未配置！`);
            return;
        }

        const hasAuth = !!operations.find((itemIn) => itemIn.key === operKey);

        // if (largeScreenId === 'production-operation' && hasAuth) {
        //     hasAuth = !!productionOperationAuth?.includes(userId);
        // }

        if (!hasAuth) {
            message.error(`您没有${text}权限，请联系管理员在角色管理中授权`);
            return;
        }
        if (largeScreenId === 'core-fault' || largeScreenId === 'railway' || largeScreenId === 'holiday') {
            // 2026-02-02 maofw：兼容二级目录的假日大屏跳转 单独跳转http地址不在使用我们自己pod。临时在配置中心增加一个假日大屏跳转配置，生产库表暂时不变。等完全割接后，修改数据库表为http地址，然后删除配置中心的临时配置
            let jumpUrl = null;
            if (largeScreenId === 'holiday') {
                jumpUrl = environment?.largeScreen?.holidayUrl || url;
            } else {
                jumpUrl = url;
            }
            const globalUniqueID = localStorage.getItem('globalUniqueID');
            // if (largeScreenId === 'railway') {
            //     return window.open(`${url.split('#')[0]}&globalUniqueID=${globalUniqueID}#${url.split('#')[1]}`);
            // }
            // eslint-disable-next-line consistent-return
            // return window.open(`${url}&globalUniqueID=${globalUniqueID}`);
            return window.open(jumpUrl.replace('${globalUniqueID}', globalUniqueID));
        }
        if (largeScreenId === 'fault') {
            // 故障调度需要先判断是否有故障，若有则跳转，无则提示
            getFaultReportSpecialtyApi({
                timeType: 3,
                provinceName: '集团',
                specialtyType: '传输网',
            }).then((res) => {
                const localAccessToken = `Bearer ${
                    localStorage.getItem('access_token') ||
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjYyMjU5NzQyMDksImlhdCI6MTcyNjEzOTU3NCwidXNlcklkIjoiOTY4NjE3IiwianRpIjoiOWFlNzc3MWRjMTlhMWM0OTI4Yjg4MGMzNzVkNTIwOTc1ZjRjNTBkOSJ9.WoLpHb2UraYVVQFsxTiv-UzI7zjN7ahtxvxDDE9vBUo'
                }`;
                if (res.data.count) {
                    // 跳转
                    return window.open(`${url}&token=${localAccessToken}&eventId=${res.data.details[0]?.eventId}`);
                }
                const jumpznjkssoUrl = `${environment.jumpznjkssoNoVal?.url}&token=${localAccessToken}`;
                return window.open(jumpznjkssoUrl);
            });
        } else {
            const userInfos = userInfo || {};
            const firstZone = userInfos?.zones?.[0] || {};
            let zoneId;
            let zoneName;
            const param = {
                userId,
            };
            let finalUrl = '';
            const { origin } = window.location;

            if (url.startsWith('http')) {
                const localAccessToken = `Bearer ${
                    localStorage.getItem('access_token') ||
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjYyMjU5NzQyMDksImlhdCI6MTcyNjEzOTU3NCwidXNlcklkIjoiOTY4NjE3IiwianRpIjoiOWFlNzc3MWRjMTlhMWM0OTI4Yjg4MGMzNzVkNTIwOTc1ZjRjNTBkOSJ9.WoLpHb2UraYVVQFsxTiv-UzI7zjN7ahtxvxDDE9vBUo'
                }`;

                finalUrl = `${authorizeUrl}?znjk_token=${localAccessToken}&redirect_url=${origin}/znjk/${
                    constants.CUR_ENVIRONMENT
                }/redirect/index.html?return_url=${encodeURIComponent(url)}`;
            } else {
                if (systemInfo.currentZone?.zoneId) {
                    zoneId = systemInfo.currentZone.zoneId;
                    zoneName = systemInfo.currentZone.zoneName;
                    if (systemInfo.currentZone.zoneLevel === '5') {
                        const res = await getZones(systemInfo.currentZone?.zoneId);
                        zoneName = res.data.map((e) => e.zoneName).toString();
                    }
                    finalUrl = `${origin}/znjk/${constants.CUR_ENVIRONMENT}/main${url}&zoneId=${zoneId}&zoneName=${zoneName}`;
                } else if (firstZone) {
                    if (firstZone.zoneLevel === '3') {
                        zoneId = firstZone.parentZoneId;
                        const res = await getCityParentApi(param);
                        zoneName = res.province?.zoneName;
                        finalUrl = `${origin}/znjk/${constants.CUR_ENVIRONMENT}/main${url}&zoneId=${zoneId}&zoneName=${zoneName}`;
                    } else {
                        zoneId = firstZone.zoneId;
                        zoneName = firstZone.zoneName;
                        finalUrl = `${origin}/znjk/${constants.CUR_ENVIRONMENT}/main${url}&zoneId=${zoneId}&zoneName=${zoneName}`;
                    }
                } else {
                    finalUrl = `${origin}/znjk/${constants.CUR_ENVIRONMENT}/main${url}`;
                }
            }
            console.log('大屏跳转地址', finalUrl);

            window.open(finalUrl);
        }
    }

    return (
        <Spin spinning={!currentConfig} wrapperClassName="large-screen-console-page-spinning">
            <div className={styles['large-screen-console-page-container']} style={{ background: `url(${bg}) center center / 100% 100% no-repeat` }}>
                {currentConfig?.map(({ name, children }) => {
                    return (
                        <div className={styles['group-wrapper']}>
                            <div className={styles['group-name-wrapper']}>
                                <img src={suffixImg} className={styles['group-suffix']} alt="" />
                                <div className={styles['group-name']}>{name}</div>
                                <div className={styles['bg-slash']} style={{ backgroundImage: `url(${slash})` }} />
                            </div>
                            <div className={styles['children']}>
                                {children.map((item) => (
                                    <Item key={`item-${item.largeScreenId}`} data={item} onClick={jumpToBigScreen} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Spin>
    );
}
