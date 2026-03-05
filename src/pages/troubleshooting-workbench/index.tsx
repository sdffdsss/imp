import React, { useState, useEffect, useRef } from 'react';
import useLoginInfoModel from '@Src/hox';
import { useHistory } from 'react-router-dom';
import { MajorList } from '@Src/common/enum/majorFaultReportEnum';
import FaultReportModal from '@Src/pages/troubleshooting-workbench/components/header/fault-report-modal';
import GroupWorkBench from './group-workbench';
import ProvinceWorkBench from './province-workbench';
import constants from '@Common/constants';
import OtherWorkBench from './other-workbench';
import { workbenchType, MonitorCenterRoleEnum } from './types';
import {
    getFaultReportUserRole,
    getFaultReportRoleTypeName,
    getMonitorCenterRole,
    getShiftingOfDutyStatus,
    getManualReportDerivedRuleConfig,
} from './api';
import './index.less';
import { getFaultReportDetail } from '../fault-report/api';

const TroubleWorkbench = () => {
    const { zoneLevelFlags, userId, currentZone, userInfo, systemInfo, userZoneInfo } = useLoginInfoModel();
    const [timeType, setTimeType] = useState('0');
    const [curShowType, setCurShowType] = useState<workbenchType>('none');
    const [componentKey, setComponentKey] = useState('');

    // 重大故障上报参数
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [editType, setEditType] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [isView, setIsView] = useState(false);
    const [lowerFlag, setLowerFlag] = useState(false); // 本地承载时卡片左侧高度均下调
    const [noAuth, setNoAuth] = useState(false); // 集团右上角切换进入的省份调度台不可上报
    const [cardsDockedLeft, setCardsDockedLeft] = useState(true);
    const ReportRoleTypeNameRef = useRef();
    const groupRef = useRef();
    const provinceRef = useRef();
    const agentRequireParamsCacheRef = useRef({});
    const history = useHistory();
    const timeTypeList = [
        {
            name: '全部',
            value: '0',
        },
        {
            name: '月',
            value: '1',
        },
        {
            name: '周',
            value: '2',
        },
    ];

    function switchType() {
        getFaultReportRoleTypeName().then((res) => {
            ReportRoleTypeNameRef.current = res.data || '';
            if (zoneLevelFlags?.isCountryZone) {
                setCurShowType('group');
                setComponentKey('group');
            } else {
                if ((currentZone.zoneLevel === '2' || currentZone.zoneLevel === '5') && userZoneInfo.zoneLevel === '1') {
                    setNoAuth(true);
                    setCurShowType('province');
                    setComponentKey('province');
                    return;
                }
                getShiftingOfDutyStatus({ userId, regionId: currentZone.zoneId }).then((res) => {
                    if (res.resultCode === '1') {
                        // 当班人
                        setCurShowType('province');
                        setComponentKey('province');
                    } else {
                        getFaultReportUserRole().then((res) => {
                            // 故障上报人员分配的账号
                            if (res.data && res.data.length > 0) {
                                setCurShowType('province');
                                setComponentKey('province');
                            } else {
                                getMonitorCenterRole({ provinceId: currentZone.zoneId, userId }).then((res) => {
                                    setCurShowType(res.data === MonitorCenterRoleEnum['other-role'] ? 'other' : 'province');
                                    setComponentKey(res.data === MonitorCenterRoleEnum['other-role'] ? 'other' : 'province');
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    const timeTypeChange = (item) => {
        console.log(item);
        setTimeType(item.value);
    };
    const showFaultModal = (item, type, titles) => {
        console.log('item====', item);
        if (item?.causesAnalysis) {
            item.ai_causesAnalysis = item.causesAnalysis;
        }
        if (item?.influenceScope) {
            item.ai_influenceScope = item.influenceScope;
        }
        if (item?.reportDescribe) {
            item.ai_reportDescribe = item.reportDescribe;
        }
        if (item?.treatmentMeasure) {
            item.ai_treatmentMeasure = item.treatmentMeasure;
        }
        if (String(item?.failureLevel)) {
            item.ai_failureLevel = item.failureLevel;
        }
        if (String(item?.rootSpecialty)) {
            item.ai_rootSpecialty = item.rootSpecialty;
        }
        if (String(item?.isEffectBusiness)) {
            item.ai_isEffectBusiness = item.isEffectBusiness;
        }
        if (String(item?.businessImpactScope)) {
            item.ai_businessImpactScope = item.businessImpactScope;
        }
        if (String(item?.businessRecoverProcess)) {
            item.ai_businessRecoverProcess = item.businessRecoverProcess;
        }
        if (item.standardAlarmId) {
            getFaultReportDetail({
                lifeType: 1,
                modelId: 2,
                standardAlarmId: item.standardAlarmId,
            }).then((res) => {
                setCurrentItem({ ...res.data, ...item, isAgent: true });
            });
        } else {
            setCurrentItem({ ...item, isAgent: true });
        }
        setEditType(type);
        setTitle(titles);
        if (titles.indexOf('上传附件') >= 0) {
            const flagId = item?.flagId ? `flagId=${item?.flagId}` : '';
            const status = item?.latestReportStatus ? `&status=${item?.latestReportStatus}` : '';
            const faultDistinctionType = item?.faultDistinctionType ? `&type=${item?.faultDistinctionType}` : '';
            const btnKey = type ? `&btnKey=${type}` : '';
            history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?${flagId}${status}${faultDistinctionType}${btnKey}&isWorkbench=true`,
            );
        } else {
            setIsModalOpen(true);
        }
        setIsView(titles.indexOf('查看') >= 0);
    };

    const onFaultReportCancel = () => {
        setCurrentItem(null);
        setIsView(false);
        setIsModalOpen(false);
        setEditType('');
    };

    useEffect(() => {
        setCurShowType('none');
        const timer = setTimeout(() => {
            switchType();
            // eslint-disable-next-line no-undef
        }, 1000);
        // ceshi
        // const timer2 = setTimeout(() => {
        //     showFaultModal(
        //         { flagId: 'JT-20251224-006', standardAlarmId: '3822239791_938905031_20251224_303' },
        //         'faultReport:firstReportApplicationCancel',
        //         '取消上报',
        //     );
        // }, 3000);
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo, systemInfo, zoneLevelFlags, userId, currentZone]);
    const getStyle = (index) => {
        if (index === 0) {
            return {
                borderRadius: '6px 0px 0px 6px',
            };
        }
        if (index === timeTypeList.length - 1) {
            return {
                borderRadius: '0px 6px 6px 0px',
            };
        }
        return {};
    };
    const baseTimeTop = 210;
    const timeTop = cardsDockedLeft ? Math.max(baseTimeTop, 270) : baseTimeTop;
    return (
        <div className="dispatch-workbench-wrapper">
            {(curShowType === 'group' || curShowType === 'province') && (
                <div
                    className="time-type-list"
                    style={{
                        top: timeTop,
                        left: cardsDockedLeft ? 30 : 'auto',
                        right: cardsDockedLeft ? 'auto' : 12,
                    }}
                >
                    {timeTypeList.map((ites, index) => {
                        return (
                            <div
                                onClick={() => timeTypeChange(ites)}
                                className={`time-type-item ${ites.value === timeType ? 'selected-item' : ''}`}
                                style={getStyle(index)}
                            >
                                {ites.name}
                            </div>
                        );
                    })}
                </div>
            )}
            {curShowType === 'group' && (
                <GroupWorkBench
                    timeType={timeType}
                    lowerFlag={lowerFlag}
                    setLowerFlag={(bool) => setLowerFlag(bool)}
                    cardsDockedLeft={cardsDockedLeft}
                    setCardsDockedLeft={setCardsDockedLeft}
                    reportRoleTypeName={ReportRoleTypeNameRef.current}
                    showFaultModal={showFaultModal}
                />
            )}
            {curShowType === 'province' && (
                <ProvinceWorkBench
                    reportRoleTypeName={ReportRoleTypeNameRef.current}
                    timeType={timeType}
                    noAuth={noAuth}
                    cardsDockedLeft={cardsDockedLeft}
                    setCardsDockedLeft={setCardsDockedLeft}
                    showFaultModal={showFaultModal}
                />
            )}
            {curShowType === 'other' && <OtherWorkBench />}
            {isModalOpen && (
                <FaultReportModal
                    title={title}
                    visible={isModalOpen}
                    onCancel={onFaultReportCancel}
                    dataSource={currentItem}
                    isView={isView}
                    // goToListPage={goToListPage}
                    setFaultReportDataSource={setCurrentItem}
                    setIsView={setIsView}
                    isMajor={editType.includes('major') || Object.keys(MajorList).includes(editType)}
                    btnKey={editType}
                    cardsDockedLeft={cardsDockedLeft}
                    isManual={currentItem && currentItem?.flagId && !currentItem?.standardAlarmId}
                />
            )}
        </div>
    );
};

export default TroubleWorkbench;
