import React, { useEffect, useState, useRef } from 'react';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
// import _isEmpty from 'lodash/isEmpty';
import './index.less';
import { Dropdown } from 'oss-ui';
// import GlobalMessage from '@Src/common/global-message';
import { sendLogFn } from '@Pages/components/auth/utils';
import { useUpdateEffect } from 'ahooks';
import { getSubCount } from '../../../api';
import { PUBLIC_OPINION } from '../../../types';
import Number from './number';

const Index = (props) => {
    const login = useLoginInfoModel();
    const [professional, setProfessional] = useState('');
    const [professionalList, setProfessionalList] = useState(props.data || []);
    const [subProfessional, setSubProfessional] = useState('');
    const [subProfessionalList, setSubProfessionalList] = useState([]);
    const currentProfessional = useRef('');
    const { receiveMsg, time, provinceId, timeType, setLowerFlag, benchType, noAuth, provinceList = [] } = props;
    const isProvinceMode = benchType;
    const clickProfessional = async (item) => {
        setLowerFlag(item.desc !== professional && item.code === '9');
        const param = {
            specialty: item?.code ? item.code : '',
            time,
            userId: login.userId,
            provinceId: provinceId === 'country' ? undefined : provinceId,
            timeType,
        };
        currentProfessional.current = item?.code;
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
        if (item.desc === professional) {
            setProfessional('');
            props.changeSubject && props.changeSubject({ code: '' }, 'professional');
            return;
        }
        const res = await getSubCount(param);

        if (res?.data) {
            props.changeSubject && props.changeSubject(item, 'professional');
            setSubProfessionalList(res.data.faultFailureClassCount || []);
        }
    };
    // };
    const clickSub = (ites) => {
        sendLogFn({ authKey: 'faultSchedule:switchFaultType' });
        setSubProfessional(ites.desc);
        props.changeSubject && props.changeSubject(ites, 'sub');
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const skipSpecialty = searchParams.get('specialty');
        const findItem = professionalList.find((e) => e.code === skipSpecialty);
        if (!skipSpecialty || !findItem) return;
        setProfessional(findItem.desc);
        clickProfessional(findItem);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [professionalList]);
    useEffect(() => {
        // getProfessional();
        setProfessionalList(props.data || []);
        // watchTabActiveChange();
    }, [props.data]);
    useEffect(() => {
        const { notificationType, latestReportStatus, specialty, provinceId: wsProvinceId, faultDistinctionType, source } = receiveMsg || {};
        if (!isProvinceMode && wsProvinceId !== provinceId && provinceId !== 'country') return;
        if (
            isProvinceMode &&
            noAuth &&
            login.currentZone.zoneLevel === '5' &&
            provinceList.findIndex((e) => e.zoneId == receiveMsg?.provinceId) === -1 &&
            login.currentZone.zoneId !== receiveMsg?.provinceId
        ) {
            return;
        }
        console.log('红点增加：', { receiveMsg });
        if (faultDistinctionType === 2 && source === 0) return;
        let payload = 0;
        switch (notificationType) {
            case 1:
                if (latestReportStatus == 2 || (latestReportStatus == 6 && specialty === PUBLIC_OPINION)) {
                    payload = 1;
                }
                break;
            case 4:
                payload = -1;
                break;
            case 5:
                payload = -1;
                if (receiveMsg.failureClassName == '舆情' || receiveMsg.failureClassName == '客诉') {
                    if (receiveMsg.provinceId !== '0') {
                        payload = 0;
                    }
                }
                break;
            default:
                payload = 0;
        }
        if (receiveMsg?.provinceId !== '0' && receiveMsg?.reportLevel?.indexOf('0') === -1) {
            payload = 0;
        }
        // 通知类型为1 上报状态为2  专业跟类别才会+1
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
    const updateProfessional = async () => {
        const params = {
            specialty: currentProfessional.current,
            time,
            userId: login.userId,
            provinceId: provinceId === 'country' ? undefined : provinceId,
            timeType,
        };
        const res = await getSubCount(params);

        if (res?.data) {
            setSubProfessionalList(res.data.faultFailureClassCount || []);
        }
    };
    useUpdateEffect(() => {
        updateProfessional();
    }, [provinceId, timeType]);
    const menu = (item) => {
        return (
            <div className={`group-workbench-menu-list ${item.desc === '客服舆情信息' ? 'last' : ''}`}>
                {subProfessionalList.map((ites) => {
                    return (
                        <div
                            className={`menu-list-item ${subProfessional === ites.desc ? 'active' : ''}`}
                            style={{ padding: subProfessionalList.length > 10 ? 0 : 5 }}
                            onClick={() => clickSub(ites)}
                        >
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
        <div className="group-workbench-professional">
            <div className="group-workbench-professional-content">
                <Dropdown
                    overlayClassName="group-workbench-dropdown"
                    overlay={menu([])}
                    visible={false}
                    placement="bottom"
                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                    arrow
                    trigger={['click']}
                    onClick={() => {
                        setSubProfessional('');
                        setProfessional('');
                        setSubProfessionalList([]);
                        clickProfessional('');
                    }}
                >
                    <div className="first-item specialty-item" data-professionid="all">
                        <div className={`button-item first${professional === '' ? ' active' : ''}`}>
                            <div className="button-item-name">全部</div>
                            <div className="button-item-num">
                                <Number number={professionalList[0]?.num} />
                            </div>
                            <div className="first-line" />
                        </div>
                        <div className={`line ${!professional ? 'bottom-line' : ''}`} />
                    </div>
                </Dropdown>
                {professionalList.slice(1).map((item, index) => {
                    return (
                        <Dropdown
                            overlayClassName="group-workbench-dropdown"
                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                            visible={item.desc === professional && subProfessionalList.length !== 0}
                            overlay={menu(item)}
                            destroyPopupOnHide
                            onClick={() => {
                                sendLogFn({ authKey: 'faultSchedule:switchProfession' });
                                setProfessional(item.desc);
                                clickProfessional(item);
                                setSubProfessional('');
                                setSubProfessionalList([]);
                            }}
                            // onVisibleChange={() => setProfessional('')}
                            placement={
                                index < 3 || item.desc === '本地承载网'
                                    ? 'bottomLeft'
                                    : index === professionalList.length - 2
                                    ? 'bottomRight'
                                    : 'bottom'
                            }
                            arrow
                            trigger={['click']}
                        >
                            <div
                                className={`dropdown-item specialty-item ${index === professionalList.length - 2 ? 'last-item' : ''}`}
                                data-professionid={item.code}
                            >
                                <div className={`button-item ${professional === item.desc ? 'active' : ''}`}>
                                    <div className="button-item-name">
                                        <div style={{ whiteSpace: 'nowrap' }}>{item.desc}</div>
                                        {item.visible && <div className="red-dot" />}
                                    </div>
                                    <Number number={item.num} />
                                    {index === 0 && <div className="first-line" />}
                                </div>

                                {index !== professionalList.length - 2 && (
                                    <div className={`line ${index == professionalList.length - 2 ? 'bottom-line' : ''}`} />
                                )}
                            </div>
                        </Dropdown>
                    );
                })}
            </div>
        </div>
    );
};
export default Index;
