import React, { useEffect, useState } from 'react';
import _isEmpty from 'lodash/isEmpty';
import { getCardsList, getViewList } from '../../api';
import './index.less';
import useLoginInfoModel from '@Src/hox';
import ViewIcon from '../../../img/view.svg';
import AddIcon from '../../../img/add.svg';
import ReadIcon from '../../../img/read.svg';
// import ReadIcon from '../../../img/read.svg';
import { Virtuoso as VList } from 'react-virtuoso';

const Index = (props) => {
    const { provinceId, selProfessional, receiveMsg, time, lightFlag, mapMode, cityId, benchType } = props;
    const { specialty, failureClass } = selProfessional;
    const [cardList, setCardList] = useState([]);
    const [viewList, setViewList] = useState([]);
    const [visible, setVisible] = useState(false);
    const login = useLoginInfoModel();

    const getCardsInfo = async () => {
        let param = {
            provinceId: provinceId === 'country' ? '0' : provinceId,
            specialty: specialty,
            failureClass: failureClass,
            time,
            userId: login.userId,
            cityId: cityId ? cityId : undefined,
        };
        if (mapMode === 'online') {
            param.provinceId = '0';
            param.cityId = undefined;
        }
        if (benchType) {
            param.accountProvinceId = param.provinceId;
        }
        const res = await getCardsList(param);
        if (res.data) {
            if (!lightFlag) {
                setCardList(
                    res.data.map((e) => {
                        return { ...e, new: false };
                    }),
                );
            }
            setCardList(res.data);
        }
    };
    const readCard = (index) => {
        let newCardList = cardList;
        // if (item.new) {
        newCardList[index].new = false;
        setCardList([...newCardList]);
        // }
    };
    const showReadModal = async () => {
        let param = {
            provinceId: provinceId === 'country' ? '0' : provinceId,
            specialty: specialty,
            failureClass: failureClass,
            time,
            userId: login.userId,
            cityId: cityId ? cityId : undefined,
        };
        if (mapMode === 'online') {
            param.provinceId = '0';
            param.cityId = undefined;
        }
        const res = await getViewList(param);
        if (res) {
            setVisible(true);
            setViewList(res.data);
        }
    };
    const tips = (item) => {
        let { countdownTime, flagId } = item;
        if (countdownTime) {
            let timer = setInterval(() => {
                if (countdownTime <= 0) {
                    clearInterval(timer);
                    document.getElementById(flagId).innerHTML = '0分0秒';
                    return;
                }
                countdownTime--;
                let seconds = countdownTime % 60;
                let minutes = Math.floor(countdownTime / 60) % 60;
                let str = minutes + '分' + seconds + '秒';
                let cardTips = document.getElementById(flagId);
                if (cardTips) {
                    cardTips.innerHTML = str;
                }
            }, 1000);
        } else {
            // document.getElementById(flagId).innerHTML = '';
        }
    };
    const bgStyle = (item, index) => {
        const { countdownTime } = item;
        console.log(countdownTime, '======');
        if (countdownTime > 1800) {
            return 'yellow';
        } else if (countdownTime < 1800 && countdownTime > 900) {
            return 'orange';
        } else if (countdownTime < 900 && countdownTime > 0) {
            return 'red';
        } else {
            return '';
        }
    };

    useEffect(() => {
        getCardsInfo();
    }, [specialty, failureClass, provinceId, cityId]);
    useEffect(() => {
        // getCardsInfo();
        if (receiveMsg?.profession) {
            const {
                failureTime,
                provinceName,
                profession,
                alarmType,
                reportNum,
                title,
                regionId,
                countdownContext,
                countdownTime,
                flagId,
                source,
                faultDistinctionType,
            } = receiveMsg;
            if (faultDistinctionType === 2 && source === 0) return;
            if (receiveMsg?.reportNum !== '首报') {
                const newCardList = cardList.map((e) => {
                    if (e.flagId === receiveMsg.flagId) {
                        let newData = {
                            ...e,
                            failureTime,
                            topic: title,
                            provinceName,
                            reportTypeName: reportNum,
                            specialtyName: profession,
                            failureClassName: alarmType,
                        };
                        return newData;
                    }
                    return e;
                });
                //  专业  故障   省份  地市  逐级对比
                if (receiveMsg?.professionId === specialty || !specialty) {
                    if (receiveMsg?.alarmTypeId === failureClass || !failureClass) {
                        if (
                            receiveMsg?.provinceId === provinceId ||
                            (receiveMsg.provinceId === '0' && provinceId === 'country') ||
                            !provinceId ||
                            provinceId === 'country'
                        ) {
                            if (receiveMsg?.regionId === cityId || !cityId) {
                                setCardList(newCardList);
                            }
                        }
                    }
                }
            } else {
                let newData = {
                    failureTime,
                    topic: title,
                    provinceName,
                    reportTypeName: reportNum,
                    specialtyName: profession,
                    failureClassName: alarmType,
                    countdownTime,
                    flagId,
                    new: true,
                };
                if (receiveMsg?.professionId === specialty || !specialty) {
                    if (receiveMsg?.alarmTypeId === failureClass || !failureClass) {
                        if (
                            receiveMsg?.provinceId === provinceId ||
                            (receiveMsg.provinceId === '0' && provinceId === 'country') ||
                            !provinceId ||
                            provinceId === 'country'
                        ) {
                            if (receiveMsg?.regionId === cityId || !cityId) {
                                cardList.unshift(newData);
                                setCardList([...cardList]);
                            }
                        }
                    }
                }
            }
        }
    }, [receiveMsg]);

    return (
        <div className="group-workbench-cards">
            <VList
                style={{ height: '100%' }}
                className="hide-scrollbar"
                data={cardList}
                itemContent={(index, item) => {
                    return (
                        <div
                            key={item.flagId}
                            className={`${item.new ? 'slide' : ''} cards-item ${bgStyle(item, index)}`}
                            onClick={() => readCard(index)}
                        >
                            <div className="cards-item-time">
                                <div className="header-left">
                                    {item.new && <div className="red-dot"></div>}
                                    <div className="fault-status">{item.autoFlag || '自动'}</div>
                                    {item.failureTime}
                                </div>
                                <div>
                                    <img src={ViewIcon} alt="" className="user-info-row-icon" onClick={() => showReadModal(item.flagId)} />
                                    <img src={AddIcon} alt="" className="user-info-row-icon" onClick={() => showReadModal(item.flagId)} />
                                    <img src={ReadIcon} alt="" className="user-info-row-icon" onClick={() => showReadModal(item.flagId)} />
                                </div>
                            </div>
                            <div className="cards-item-title">{item.topic}</div>
                            <div className="cards-item-enum">
                                <div className={`cards-item-enum-sub region`}>{item?.provinceName || '江苏省'}</div>
                                <div className={`cards-item-enum-sub`}>{item?.reportTypeName}</div>
                                <div className={`cards-item-enum-sub`}>{item?.specialtyName}</div>
                                <div className={`cards-item-enum-sub`}>{item?.failureClassName}</div>
                            </div>

                            {item.countdownTime && (
                                <div className={`tips tips-${item.flagId}`}>
                                    距离续报时间还剩<span id={item.flagId}>{tips(item)}</span>，请及时续报
                                </div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};
export default Index;
