import React, { useRef, useState, useEffect } from 'react';

const tips = (props) => {
    const [countdownTime, setCountdownTime] = useState(props.item?.countdownTime);
    const timerRef = useRef(null);
    // const { flagId } = props;

    const transferData = (info, type) => {
        console.log(info);
        const {
            flagId,
            voiceContextUp,
            voiceContextDown,
            provinceId,
            topic,
            provinceName,
            cityId,
            cityName,
            reportTypeName,
            specialtyName,
            specialty,
            failureClassName,
            failureClass,
            failureTime,
            source,
            countdownContextUp,
            countdownContextDown,
            // countdownTime,
            standardAlarmId,
            latestReportStatus,
            reportStatus,
        } = info;
        const message = {
            flagId,
            topic,
            provinceId,
            provinceName,
            cityId,
            cityName,
            reportTypeName,
            specialtyName,
            specialty,
            failureClassName,
            failureClass,
            failureTime,
            source,
            countdownContextUp,
            countdownContextDown,
            countdownTime,
            standardAlarmId,
            latestReportStatus,
            notificationType: 2,
            reportStatus,
            voiceContext: type === '1小时' ? voiceContextUp.replace('${countdownTime}', '1小时') : voiceContextDown.replace('${countdownTime}', type),
            countdownContext: type === '1小时' ? countdownContextUp : countdownContextDown,
        };
        return message;
    };

    useEffect(() => {
        const { flagId, latestReportStatus, reportStatus, faultDistinctionType, source } = props.item || {};
        setCountdownTime(props.item?.countdownTime);
        let resetTime = 3600 - props.item?.countdownTime;
        if (countdownTime || resetTime) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            const cardTips = document.getElementById(flagId);
            const cards = document.getElementById(`cards-${flagId}`);
            const cardContent = document.getElementById(`content-${flagId}`);
            if (cardContent) {
                if (resetTime <= 1800 && resetTime > 900) {
                    cardContent.classList.add('tips-yellow');
                } else if (resetTime <= 900 && resetTime > 300) {
                    cardContent.classList.add('tips-orange');
                } else if (resetTime <= 300) {
                    cardContent.classList.add('tips-red');
                }

                if (latestReportStatus !== '2') {
                    cardContent.innerHTML = '';
                }
            }
            timerRef.current = setInterval(() => {
                // let cardContent = document.getElementById(`content-${flagId}`);
                if (resetTime <= 0) {
                    if (resetTime === 0) {
                        props.pushMessage && props.pushMessage(transferData(props.item, '1小时'));
                    }
                    if (resetTime < -5) {
                        if (resetTime <= -82800) {
                            if (resetTime < -82805) {
                                clearInterval(timerRef.current);
                                if (cardContent && cards && latestReportStatus !== '6') {
                                    cardContent.innerHTML = '故障发生已超过24小时，请及时终报';
                                    cards.style.animation = '';
                                }
                                return;
                            }
                            if (cardContent && cards && latestReportStatus !== '6') {
                                cardContent.innerHTML = '故障发生已超过24小时，请及时终报';
                                cards.style.animation = 'redFlicker 1s infinite';
                            }
                            resetTime--;
                            return;
                        }
                        if (cardContent && cards && latestReportStatus === '2') {
                            // cardTips.innerHTML = '1小时';
                            cardContent.innerHTML = '首报时间已超过1小时，请及时续报';
                            cards.style.animation = '';
                        }
                        resetTime--;
                        return;
                    }
                    if (cardContent && cards && latestReportStatus === '2') {
                        // cardTips.innerHTML = '1小时';
                        cardContent.innerHTML = '首报时间已超过1小时，请及时续报';
                        cards.style.animation = 'redFlicker 1s infinite';
                    }
                    resetTime--;
                    return;
                }
                resetTime--;
                const seconds = resetTime % 60;
                const minutes = Math.floor(resetTime / 60) % 60;
                const str = minutes + '分' + seconds + '秒';
                if (cardTips && cards) {
                    // if (cardTips && cards) {
                    if (latestReportStatus === '2') {
                        cardTips.innerHTML = str;
                        if (resetTime > 1795 && resetTime < 1801) {
                            cards.style.animation = 'yellowFlicker 1s infinite';
                            cards?.classList.add('yellow');
                            cardContent?.classList.add('tips-yellow');
                        } else if (resetTime > 895 && resetTime < 901) {
                            cards.style.animation = 'orangeFlicker 1s infinite';
                            cards?.classList.remove('yellow');
                            cards?.classList.add('orange');
                            cardContent?.classList.remove('tips-yellow');
                            cardContent?.classList.add('tips-orange');
                            if (resetTime === 900) {
                                props.pushMessage && props.pushMessage(transferData(props.item, '15分钟'));
                            }
                        } else if (resetTime < 301 && resetTime > 295) {
                            cards.style.animation = 'redFlicker 1s infinite';
                            cards?.classList.remove('orange');
                            cards?.classList.add('red');
                            cardContent?.classList.remove('tips-orange');
                            cardContent?.classList.add('tips-red');
                            if (resetTime === 300) {
                                props.pushMessage && props.pushMessage(transferData(props.item, '5分钟'));
                            }
                        } else {
                            cards.style.animation = '';
                        }
                    } else {
                        if (cardContent) {
                            cardContent.innerHTML = '';
                        }
                    }
                }
            }, 1000);
        }
        return () => {
            clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.item.latestReportStatus]);
    return <span id={props.item?.flagId}></span>;
};

export default tips;
