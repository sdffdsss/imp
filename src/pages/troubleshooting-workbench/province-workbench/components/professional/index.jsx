import React, { useEffect, useState, useRef } from 'react';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import './index.less';
import { Dropdown } from 'oss-ui';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import { sendLogFn } from '@Pages/components/auth/utils';
import { getReportCount, getSubCount, getZones } from '../../../api';
import Number from './number';
import { PROFESSIONAL_TYPE } from './constants';
import { PUBLIC_OPINION } from '../../../types';

const Index = (props) => {
    const login = useLoginInfoModel();
    const [professional, setProfessional] = useState('');
    const [professionalList, setProfessionalList] = useState([]);
    const [subProfessional, setSubProfessional] = useState('');
    const [subProfessionalList, setSubProfessionalList] = useState([]);
    const { receiveMsg, time, timeType, noAuth, provinceList } = props;
    const getProfessional = async () => {
        const param = {
            userId: login.userId,
            time,
            provinceId: getInitialProvince(login),
            timeType,
        };
        const res = await getReportCount(param);
        if (res?.data) {
            setProfessionalList(res.data.faultSpecialtyCount);
            if (!professional) {
                setProfessional(res.data.faultSpecialtyCount[0]?.desc);
            }
        }
    };
    const clickProfessional = async (item) => {
        const param = {
            specialty: item?.code ? item.code : '',
            time,
            userId: login.userId,
            provinceId: getInitialProvince(login),
            accountProvinceId: getInitialProvince(login),
            timeType,
        };
        if (item.visible) {
            const selInd = professionalList.findIndex((e) => e.code === item.code);
            if (selInd > -1) {
                const newList = professionalList.map((e, ind) => {
                    return {
                        ...e,
                        visible: ind === selInd ? false : e.visible,
                    };
                });
                setProfessionalList([...newList]);
            }
        }
        if (item.desc === professional || item.desc === '全部') {
            setProfessional('全部');
            props.changeSubject && props.changeSubject({ code: '' }, PROFESSIONAL_TYPE.PROFESSIONAL);
            return;
        }
        const res = await getSubCount(param);
        if (res?.data) {
            props.changeSubject && props.changeSubject(item, PROFESSIONAL_TYPE.PROFESSIONAL);
            setSubProfessionalList(res.data.faultFailureClassCount || []);
        }
    };
    // const watchTabActiveChange = () => {
    //     GlobalMessage.off('activeChanged', null, null);
    //     GlobalMessage.on('activeChanged', ({ isActive }) => {
    //         if (!isActive) {
    //             // console.log(professional, '=======');
    //             // setTimeout(() => {
    //             //     setProfessional('');
    //             //     props.changeSubject && props.changeSubject({ code: '' }, PROFESSIONAL_TYPE.PROFESSIONAL);
    //             // }, 0);
    //         } else {
    //             // clearTimeout(timer);
    //         }
    //     });
    // };
    const clickSub = (ites) => {
        sendLogFn({ authKey: 'faultSchedule:switchFaultType' });
        setSubProfessional(ites.desc);
        props.changeSubject && props.changeSubject(ites, PROFESSIONAL_TYPE.SUB);
    };

    const updateSubProfessional = async () => {
        if (professional) {
            const par = professionalList.find((e) => e.desc === professional);
            const param = {
                specialty: par?.code ? par.code : '',
                time,
                userId: login.userId,
                provinceId: getInitialProvince(login),
                accountProvinceId: getInitialProvince(login),
                timeType,
            };
            const res = await getSubCount(param);
            if (res?.data) {
                props.changeSubject && props.changeSubject(par, PROFESSIONAL_TYPE.PROFESSIONAL);
                setSubProfessionalList(res.data.faultFailureClassCount || []);
            }
        }
    };

    useEffect(() => {
        getProfessional();
        // watchTabActiveChange();
    }, []);
    useEffect(() => {
        getProfessional();
        updateSubProfessional();
    }, [timeType]);
    useEffect(() => {
        console.log('receiveMsg', receiveMsg);
        const { notificationType, latestReportStatus, specialty, faultDistinctionType, flagId, source } = receiveMsg || {};
        if ((faultDistinctionType === 2 && source === 0) || !flagId) return;
        // 通知类型为1 上报状态为2  专业跟类别才会+1
        let payload = 0;
        switch (notificationType) {
            case 1:
                if (
                    latestReportStatus == 2 ||
                    (latestReportStatus == 6 && specialty === PUBLIC_OPINION && receiveMsg.involvedProvince?.includes(getInitialProvince(login)))
                ) {
                    payload = 1;
                }
                break;
            case 4:
                payload = -1;
                break;
            case 5:
                payload = -1;
                if (receiveMsg.failureClassName == '舆情' || receiveMsg.failureClassName == '客诉') {
                    if (receiveMsg.provinceId !== getInitialProvince(login)) {
                        payload = 0;
                    }
                }
                break;
            default:
                payload = 0;
        }
        if (receiveMsg?.provinceId === '0' && specialty !== PUBLIC_OPINION) {
            // 集团账号上报的不通知省份工作台
            payload = 0;
        }
        // todo: 之前注掉原因不详导致计数错误，现在放开了
        if (specialty !== PUBLIC_OPINION) {
            if (noAuth && login.currentZone.zoneLevel === '5') {
                if (provinceList.findIndex((e) => e.zoneId == receiveMsg?.provinceId) === -1) {
                    payload = 0;
                }
            } else {
                if (receiveMsg?.provinceId !== getInitialProvince(login)) {
                    payload = 0;
                }
            }
        }
        if (payload) {
            // if (notificationType == 1 && latestReportStatus == 2) {
            if (receiveMsg?.specialtyName) {
                const selInd = professionalList.findIndex((e) => e.desc === receiveMsg.specialtyName);
                const curInd = professionalList.findIndex((e) => e.desc === professional);
                const selSubInd = subProfessionalList.findIndex((e) => e.desc === receiveMsg.failureClassName);
                const curSubInd = subProfessionalList.findIndex((e) => e.desc === subProfessional);
                // 专业新增
                if (selInd > -1) {
                    const newList = professionalList.map((e, ind) => {
                        return {
                            ...e,
                            num: (ind === 0 && specialty !== '16') || ind === selInd ? e.num + payload : e.num, // 客服舆情总数不变
                            visible: !!(ind === selInd && selInd !== curInd && payload === 1),
                        };
                    });
                    setProfessionalList([...newList]);
                }
                // 故障类别新增
                if (selInd === curInd && selSubInd > -1) {
                    const newList = subProfessionalList.map((e, ind) => {
                        return {
                            ...e,
                            num: ind === selSubInd ? e.num + payload : e.num,
                            visible: !!(ind === selSubInd && selSubInd !== curSubInd && payload === 1),
                        };
                    });
                    setSubProfessionalList([...newList]);
                }
            }
        }
    }, [receiveMsg]);
    const menu = (item) => {
        return (
            <div className={`province-workbench-menu-list ${item.desc === '客服舆情信息' ? 'last' : ''}`}>
                {subProfessionalList.map((ites) => {
                    return (
                        <div className={`menu-list-item ${subProfessional === ites.desc ? 'active' : ''}`} onClick={() => clickSub(ites)}>
                            <div className="name">{ites.desc}</div>
                            <div className={`num ${ites.num > 0 ? 'showNum' : ''}`}>
                                <Number number={ites.num} />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="province-workbench-professional">
            <div className="province-workbench-professional-content">
                {professionalList.map((item, index) => {
                    return (
                        <Dropdown
                            overlayClassName={`province-workbench-dropdown`}
                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                            visible={item.desc === professional && subProfessionalList.length !== 0}
                            overlay={menu(item)}
                            destroyPopupOnHide
                            onClick={() => {
                                sendLogFn({ authKey: 'faultSchedule:switchProfession' });
                                setSubProfessional('');
                                setSubProfessionalList([]);
                                setProfessional(item.desc);
                                clickProfessional(item);
                            }}
                            placement="bottom"
                            // arrow
                            trigger={['click']}
                        >
                            <div
                                className={`dropdown-item specialty-item ${index === professionalList.length - 1 ? 'last' : ''}`}
                                data-professionid={item.code}
                            >
                                <div className={`button-item ${professional === item.desc ? 'active' : ''}`}>
                                    <div className="button-item-name">
                                        <div style={{ whiteSpace: 'nowrap' }}>{item.desc}</div>
                                        {item.visible && <div className="red-dot" />}
                                    </div>
                                    <Number number={item.num} />
                                </div>
                            </div>
                        </Dropdown>
                    );
                })}
            </div>
        </div>
    );
};
export default Index;

export {
    //
    PROFESSIONAL_TYPE,
};
