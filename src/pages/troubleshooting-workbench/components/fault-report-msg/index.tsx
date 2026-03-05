import React, { useEffect, useRef, useReducer } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { nanoid } from 'nanoid';
import useLoginInfoModel from '@Src/hox';
import GlobalMessage from '@Src/common/global-message';
import './index.less';

export default function Index({ newMsgs, workbenchType = 'group', onSpeakEnd }) {
    const { mgmtZones, zoneLevelFlags, currentZone } = useLoginInfoModel();
    const voiceDataRef = useRef<SpeechSynthesisVoice[]>([]);
    const speechSynthesisUtteranceInsRef = useRef<SpeechSynthesisUtterance>();
    const [, forceUpdate] = useReducer((state) => {
        return state + 1;
    }, 0);
    const curShowListRef = useRef<any[]>([]);
    const isMountRef = useRef(true);

    function speakSpeechSynthesis(utteranceIns) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.speak(utteranceIns);
        } else {
            console.warn('当前浏览器不支持合成语音播放，请升级浏览器版本。');
        }
    }

    function setTextAndPlayUtterance() {
        speechSynthesisUtteranceInsRef.current!.text = curShowListRef.current[0].voiceContext;
        speakSpeechSynthesis(speechSynthesisUtteranceInsRef.current);
    }
    function startPlayUtteranceQueue() {
        if (curShowListRef.current.length === 1) {
            setTextAndPlayUtterance();
        }
    }

    function pollingPlayUtteranceQueue() {
        if (curShowListRef.current.length === 0) {
            return;
        }

        setTextAndPlayUtterance();
    }

    function handleMsgFade(operateIndex) {
        const specialtyListDoms = document.querySelectorAll('.specialty-item');
        const curFaultBelongSpecialtyDom = Array.from(specialtyListDoms).find((item) => {
            // @ts-ignore
            return item.dataset.professionid === curShowListRef.current[operateIndex].specialty;
        });

        const {
            left: belongLeft,
            top: belongTop,
            width: belongWidth,
            height: belongHeight,
        } = curFaultBelongSpecialtyDom?.getBoundingClientRect() || {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        };

        const destX = belongLeft + belongWidth / 2;
        const destY = belongTop + belongHeight / 2;

        const newMsgDoms = document.querySelectorAll('.new-msg-item');

        const {
            left: curMsgLeft,
            top: curMsgTop,
            width: curMsgWidth,
            height: curMsgHeight,
        } = newMsgDoms[operateIndex]?.getBoundingClientRect() || {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        };

        const curX = curMsgLeft + curMsgWidth / 2;
        const curY = curMsgTop + curMsgHeight / 2;

        anime({
            targets: newMsgDoms[operateIndex],
            opacity: 0,
            translateX: destX - curX,
            translateY: destY - curY,
            scale: 0,
            duration: 600,
            easing: 'linear',
            begin() {
                onSpeakEnd(curShowListRef.current[operateIndex]);
            },
            complete() {
                if (operateIndex === 0) {
                    window.speechSynthesis.cancel();
                    const secondMsgDom = newMsgDoms[1];

                    if (curShowListRef.current[1] && secondMsgDom) {
                        anime({
                            targets: secondMsgDom,
                            translateY: `-${curMsgHeight}`,
                            duration: 600,
                            easing: 'linear',
                            complete() {
                                curShowListRef.current.shift();
                                // @ts-ignore
                                secondMsgDom.style.transform = 'translateY(0)';
                                forceUpdate();

                                pollingPlayUtteranceQueue();
                            },
                        });
                    } else {
                        curShowListRef.current.shift();
                        forceUpdate();
                    }
                } else {
                    curShowListRef.current.splice(1, 1);
                }
            },
        });
    }

    function initSynthesisUtterance() {
        const ins = new window.SpeechSynthesisUtterance();
        ins.volume = 1; // 声音的音量，区间范围是0到1，默认是1。
        ins.rate = 1; // 设置播放语速，范围：0.1 - 10之间    正常为1倍播放
        ins.pitch = 1; // 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1。
        ins.lang = 'zh-CN'; // 使用的语言，字符串， 例如："zh-cn"

        const voiceItem = voiceDataRef.current.find((item) => item.lang === ins.lang && item.localService);
        // @ts-ignore
        ins.voiceURI = voiceItem?.voiceURI;

        ins.onend = () => {
            handleMsgFade(0);
        };
        ins.onerror = (e) => {
            console.log('语音合成出错', e, e.error === 'not-allowed' ? '需要用户操作才可开启语音转换' : e.error);
        };

        return ins;
    }

    function onCloseItem(data) {
        handleMsgFade(curShowListRef.current.findIndex((item) => item.id === data.id));
    }

    useEffect(() => {
        voiceDataRef.current = window.speechSynthesis.getVoices();

        if (voiceDataRef.current.length === 0) {
            window.speechSynthesis.onvoiceschanged = function onvoiceschanged() {
                voiceDataRef.current = window.speechSynthesis.getVoices();
                speechSynthesisUtteranceInsRef.current = initSynthesisUtterance();
            };
        } else {
            speechSynthesisUtteranceInsRef.current = initSynthesisUtterance();
        }
    }, []);

    useEffect(() => {
        if (!isMountRef.current && newMsgs && speechSynthesisUtteranceInsRef.current) {
            // 通知类型 1:故障通知 2:倒计时通知，3：活动告警，4：清除告警
            if (newMsgs.notificationType === 4 || newMsgs.notificationType === 5) {
                return;
            }
            if (zoneLevelFlags.isCountryZone && newMsgs.notificationType !== 1) {
                return;
            }

            if (zoneLevelFlags.isRegionZone) {
                if (!mgmtZones.find((item) => item.zoneId === newMsgs.provinceId)) {
                    return;
                }
            }

            if (zoneLevelFlags.isProvinceZone) {
                if (currentZone.zoneId !== newMsgs.provinceId && !newMsgs.involvedProvince?.includes(currentZone.zoneId.toString())) {
                    return;
                }
            }

            if (!newMsgs.voiceContext) {
                return;
            }
            curShowListRef.current = [...curShowListRef.current, { ...newMsgs, id: nanoid(), specialty: newMsgs.specialty || 'all' }];

            forceUpdate();

            startPlayUtteranceQueue();
        }
        isMountRef.current = false;
    }, [newMsgs]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        const fn = ({ isActive }) => {
            setTimeout(() => {
                if (!isActive) {
                    if (curShowListRef.current.length > 0) {
                        window.speechSynthesis.cancel();
                        curShowListRef.current = [];
                        forceUpdate();
                    }
                }
            }, 1000);
        };

        GlobalMessage.on('activeChanged', fn, null);

        return () => {
            GlobalMessage.off('activeChanged', fn, null);
        };
    });

    const firstMsg = curShowListRef.current[0];
    const secondMsg = curShowListRef.current[1];

    return (
        <div className="group-workbench-fault-report-msg-wrapper" style={{ top: 320 }}>
            {firstMsg && (
                <div className="new-msg-item" key={`${firstMsg.id}`}>
                    {workbenchType === 'group' ? (
                        <>
                            {firstMsg.provinceName}
                            <span className="specialty-name">{firstMsg.specialtyName}</span>
                            发生
                            {firstMsg.topic}
                        </>
                    ) : (
                        firstMsg.voiceContext
                    )}
                    <span
                        className="close-icon"
                        onClick={() => {
                            onCloseItem(firstMsg);
                        }}
                    />
                </div>
            )}
            {secondMsg && (
                <div className="new-msg-item" key={`${secondMsg.id}`}>
                    {workbenchType === 'group' ? (
                        <>
                            {secondMsg.provinceName}
                            <span className="specialty-name">{secondMsg.specialtyName}</span>
                            发生
                            {secondMsg.topic}
                        </>
                    ) : (
                        secondMsg.voiceContext
                    )}
                    <span
                        className="close-icon"
                        onClick={() => {
                            onCloseItem(secondMsg);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
