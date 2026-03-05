import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Row, Col, Button, Radio, Input, Icon, Modal, Image } from 'oss-ui';
import { ItemCard, LayoutItem, DefaultIcon, FaultInfoItem, FaultNotice, FaultBusinessTable } from '../components';
import { formatFaultInfo, formatFirst, formatContinue } from '../utils';
import { MART_CABLE_MAJOR, FAILURE_REPORTING_LEVEL_TEXT } from '../type';
import OriginalAlarmCount from '../fault-report-add/fault-report-form/first-report-form/original-alarm-count';
import { getFaultReportDetail, getFaultLifeCycle, getAllReportList } from '../api';
import FileDown from '../components/file-down';
import AlarmTable from '../fault-report-add/fault-report-form/association-alarm';
import TicketTable from '../fault-report-add/fault-report-form/association-ticket';
import './index.less';

const NewFaultReportDetailContent = (props) => {
    const { flagId, dataSource, faultReportStatus, theme, standardAlarmId } = props;

    const [faultReportDetail, setFaultReportDetail] = useState<any>({
        faultNoticeList: [],
    });
    const imageRef = useRef<any>();
    const [faultReportDetailVisible, setFaultReportDetailVisible] = useState<boolean>(false);
    const [imageVisible, setImageVisible] = useState<boolean>(false);
    const [reportLifeCycleData, setReportLifeCycleData] = useState<any>({ resultList: [], screenShoot: '' });

    // 故障报告历史记录相关状态
    const [allReportList, setAllReportList] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false);

    const [currentButton, setCurrentButton] = useState<number>(0);

    const { faultNoticeList = [], fileList = [] } = faultReportDetail;

    const cycleLifeRef = useRef<HTMLDivElement>(null);

    // 根据截图重新组织基本信息字段布局
    const formatBasicInfo = (item) => {
        const displayValue = (value) => value || '未填写';

        return [
            // 第1行：故障标识 | 故障主题
            {
                name: '故障标识',
                value: displayValue(item.flagId),
                span: 8,
            },
            {
                name: '故障主题',
                value: displayValue(item.topic),
                span: 16,
            },
            // 第2行：故障描述（占全行）
            {
                name: '故障描述',
                value: displayValue(item.reportDescribe),
                span: 24,
            },
            // 第3行：上报专业 | 子专业 | 故障类别
            {
                name: '上报专业',
                value: displayValue(item.specialtyName),
                span: 8,
            },
            {
                name: '子专业',
                value: displayValue(item.subSpecialtyName),
                span: 8,
            },
            {
                name: '故障类别',
                value: displayValue(item.failureClassName),
                span: 8,
            },
            // 第4行：问题省份 | 地市 | 故障发生地点
            {
                name: '归属省份',
                value: displayValue(item.provinceName),
                span: 8,
            },
            {
                name: '地市',
                value: displayValue(item.cityName),
                span: 8,
            },
            {
                name: '故障发生地点',
                value: displayValue(item.actionScene),
                span: 8,
            },
            // 第5行：故障发生时间 | 故障恢复时间 | 故障持续时间
            {
                name: '故障发生时间',
                value: displayValue(item.failureTime),
                span: 8,
            },
            {
                name: '故障恢复时间',
                value: displayValue(item.failureRecoverTime),
                span: 8,
            },
            {
                name: '故障持续时间',
                value: displayValue(item.failureDurationTime),
                span: 8,
            },
            // 第6行：故障上报级别 | 上报方式 | 故障确认状态 (只有手工上报才显示故障确认状态)
            {
                name: '故障上报级别',
                value: displayValue(
                    item.reportLevel !== null && item.reportLevel !== undefined
                        ? item.reportLevel
                            .split(',')
                            ?.map((level) => FAILURE_REPORTING_LEVEL_TEXT[level] || level)
                            .join('、')
                        : null,
                ),
                span: 8,
            },
            {
                name: '上报用途',
                value: displayValue(item.application || '未填写'),
                span: 8,
            },
            // 故障确认状态：只有自动识别故障才显示，手工上报不显示
            ...(item.source !== 0
                ? [
                    {
                        name: '故障确认状态',
                        value: displayValue(item.alarmStatus),
                        span: 8,
                    },
                ]
                : [{ name: '', value: '', span: 8 }]), // 占位保持布局

            // 干线光缆专业字段
            ...(item.specialty === MART_CABLE_MAJOR
                ? [
                    {
                        name: '传输段',
                        value: displayValue(item.transSegIdName),
                        span: 8,
                    },
                    {
                        name: '光缆段',
                        value: displayValue(item.reuseTransSeg),
                        span: 8,
                    },
                    {
                        name: '传输系统',
                        value: displayValue(item.transSystem),
                        span: 8,
                    },
                ]
                : []),
        ];
    };

    const basicInfo = formatBasicInfo(faultReportDetail);
    const faultInfo = formatFaultInfo(faultReportDetail);

    // 获取已提交的所有数据
    const getAllReportListData = async () => {
        if (flagId) {
            const data = {
                flagId,
                // reportUser 参数可以为空，API会根据flagId获取所有相关记录
            };

            setLoadingData(true);
            try {
                const res = await getAllReportList(data);
                setLoadingData(false);
                if (res && res.data && Array.isArray(res.data)) {
                    // 将原始记录转换为卡片结构 { name, dataList }
                    const finalAllData = res.data.map((record: any, index: number) => {
                        // 根据 reportStatus 判断类型并设置 name
                        const status = Number(record.reportStatus);
                        const statusNameMap: Record<number, string> = {
                            1: '草稿',
                            2: '首报',
                            21: '首报申请',
                            22: '首报修改申请',
                            23: '首报修改',
                            4: '续报',
                            41: '续报申请',
                            42: '续报修改申请',
                            43: '续报修改',
                            5: '终报草稿',
                            6: '终报',
                            60: '终报',
                            61: '终报申请',
                            62: '终报修改申请',
                            63: '终报修改',
                        };
                        const name = statusNameMap[status] || '未知';

                        const isFirstLike = status === 2 || status === 21 || status === 22 || status === 23;
                        const dataList = isFirstLike ? formatFirst(record) : formatContinue(record);

                        return {
                            name,
                            status,
                            dataList,
                            raw: record,
                            faultReportDetailCardId: record.disposeId,
                            meta: {
                                reportUserName: record.reportUserName,
                                telephone: record.telephone,
                                deptName: record.deptName,
                                reportTime: record.reportTime || record.createTime || record.lastModifyTime,
                                continueTimes: record.continueTimes,
                            },
                        };
                    });
                    console.log('即将设置状态，数据:', finalAllData);
                    setAllReportList(res.data);
                    setAllData(finalAllData);
                    console.log('状态设置完成');
                } else {
                    console.log('数据格式不正确:', res);
                }
            } catch (error) {
                setLoadingData(false);
                console.error('获取故障报告历史记录失败:', error);
            }
        }
    };

    // 故障报告历史记录展开/收起状态
    const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

    // 切换卡片展开/收起状态
    const toggleCardExpanded = (cardId: string) => {
        setExpandedCards((prev) => {
            const currentExpanded = prev[cardId] !== undefined ? prev[cardId] : true;
            return {
                ...prev,
                [cardId]: !currentExpanded,
            };
        });
    };

    // 渲染每一个故障报告历史卡片
    const faultListDom = () => {
        console.log('faultListDom called. allReportList:', allReportList, 'type:', typeof allReportList, 'isArray:', Array.isArray(allReportList));

        if (!Array.isArray(allReportList) || allReportList.length === 0) {
            return null;
        }

        const finalStageFiles = allReportList
            .filter((r: any) => [6, 63].includes(Number(r?.reportStatus)))
            .sort((a: any, b: any) => {
                const at = new Date(a?.reportTime || a?.createTime || a?.lastModifyTime || 0).getTime();
                const bt = new Date(b?.reportTime || b?.createTime || b?.lastModifyTime || 0).getTime();
                return at - bt;
            })
            .reduce((acc: any[], r: any) => {
                if (Array.isArray(r?.uploudFiles) && r.uploudFiles.length) {
                    acc.push(...r.uploudFiles);
                }
                return acc;
            }, []);

        // 先渲染一个简单的测试卡片
        const testCards = allData.map((i, cardIndex) => {
            const { name, status, dataList, faultReportDetailCardId = '', meta, raw } = i;
            console.log(`渲染卡片 ${cardIndex}:`, { name, dataListLength: dataList?.length, dataList });

            // 确保dataList存在且有数据
            if (!dataList || !Array.isArray(dataList)) {
                console.warn(`卡片 ${cardIndex} 的 dataList 无效:`, dataList);
                return null;
            }

            const cardId = `${faultReportDetailCardId}_${cardIndex}`;
            const isFirstReport = [2, 21, 22, 23].includes(Number(status));
            const isExpanded = expandedCards[cardId] !== undefined ? expandedCards[cardId] : true;
            const isContinueLike = [4, 41, 42, 43].includes(Number(status));
            const isFinalLike = [6, 60, 61, 62, 63].includes(Number(status));
            const basicFieldNames = new Set([
                '上报专业',
                '子专业',
                '故障类别',
                '故障主题',
                '故障描述',
                '故障上报级别',
                '上报用途',
                '故障标识',
                '归属省份',
                '地市',
                '上报人',
                '联系方式',
                '上报人部门',
                '上报时间',
                '故障发生时间',
                '故障恢复时间',
                '故障发生地点',
            ]);

            const continueHiddenNames = new Set([
                '追加类型',
                '追加人',
                '追加时间',
                '故障上报级别',
                '故障类别',
                '故障恢复时间',
                '故障发生地点',
                '业务恢复时间',
            ]);

            const finalHiddenNames = new Set(['追加类型', '追加人', '追加时间', '故障上报级别', '故障类别', '故障恢复时间', '故障发生地点']);

            const filteredList = isFirstReport
                ? dataList.filter((item: any) => !basicFieldNames.has(item?.name))
                : isContinueLike
                    ? dataList.filter((item: any) => !continueHiddenNames.has(item?.name) && item?.name !== '')
                    : isFinalLike
                        ? dataList.filter((item: any) => !finalHiddenNames.has(item?.name) && item?.name !== '')
                        : dataList;

            const orderedList = (() => {
                if (!isFinalLike) return filteredList;
                const finalOrder = [
                    '故障等级预警',
                    '根因专业',
                    '是否影响业务',
                    '业务恢复时间',
                    '故障网络影响范围',
                    '故障业务影响范围',
                    '故障原因分析',
                    '故障处理进展',
                    '业务恢复进展',
                    '追加附件',
                    '通知内容',
                    '通知对象',
                ];
                const getIndex = (n: any) => {
                    const idx = finalOrder.indexOf(n);
                    return idx === -1 ? 999 : idx;
                };
                return [...filteredList].sort((a: any, b: any) => getIndex(a?.name) - getIndex(b?.name));
            })();

            const displayDataList = orderedList.map((item: any) => {
                if (!item) return item;
                if (isFirstReport) {
                    const next: any = { ...item };
                    if (next?.name === '故障等级预警' || next?.name === '根因专业') {
                        next.span = 12;
                    }
                    if (
                        next?.name === '故障网络影响范围' ||
                        next?.name === '故障原因分析' ||
                        next?.name === '故障处理进展' ||
                        next?.name === '故障描述' ||
                        next?.name === '通知内容' ||
                        next?.name === '通知对象'
                    ) {
                        next.span = 24;
                    }
                    if (next?.name === '附件') {
                        next.span = 24;
                        if (!next?.uploudFiles || next.uploudFiles.length === 0) {
                            next.value = '未上传';
                        } else {
                            next.value = null;
                        }
                    }
                    return next;
                }
                if (isContinueLike || isFinalLike) {
                    const next: any = { ...item };
                    if (next?.name === '追加附件') {
                        next.name = '附件';
                        next.children = null;
                        next.span = 24;
                        if (Number(status) === 6) {
                            next.uploudFiles = finalStageFiles;
                        } else {
                            next.uploudFiles = raw?.uploudFiles;
                        }
                    }

                    if (next?.name === '故障等级预警' || next?.name === '根因专业' || next?.name === '是否影响业务') {
                        next.span = 8;
                    }

                    if (isFinalLike && next?.name === '业务恢复时间') {
                        next.span = 24;
                    }

                    if (
                        next?.name === '故障网络影响范围' ||
                        next?.name === '故障业务影响范围' ||
                        next?.name === '故障原因分析' ||
                        next?.name === '故障处理进展' ||
                        next?.name === '业务恢复进展' ||
                        next?.name === '通知内容' ||
                        next?.name === '通知对象'
                    ) {
                        next.span = 24;
                    }

                    if (next?.name === '附件') {
                        next.span = 24;
                        if (!next?.uploudFiles || next.uploudFiles.length === 0) {
                            next.value = '未上传';
                        } else {
                            // 有附件时不设置value，让LayoutItem组件处理附件显示
                            next.value = null;
                        }
                    }
                    return next;
                }
                return item;
            });

            const headerInfoText = [meta?.reportUserName, meta?.telephone, meta?.deptName, meta?.reportTime].filter(Boolean).join('      ');

            const displayTitle = (() => {
                if (isContinueLike && meta?.continueTimes) {
                    const suffix = String(name || '').startsWith('续报') ? String(name).slice(2) : '';
                    return `续报${meta.continueTimes}${suffix}`;
                }
                return name;
            })();

            return (
                <ItemCard
                    key={cardIndex}
                    title={displayTitle}
                    faultReportDetailCardId={faultReportDetailCardId}
                    subtitle={
                        <span
                            style={{
                                display: 'inline-block',
                                maxWidth: 900,
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '12px',
                                color: '#1890ff',
                                letterSpacing: '0.5px',
                                lineHeight: '1.5',
                                paddingTop: '0px',
                                marginTop: '-2px',
                            }}
                            title={headerInfoText}
                        >
                            {headerInfoText}
                        </span>
                    }
                    extra={
                        <div
                            onClick={() => toggleCardExpanded(cardId)}
                            style={{
                                cursor: 'pointer',
                                padding: '4px',
                                color: '#1890ff',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                userSelect: 'none',
                            }}
                        >
                            {isExpanded ? '﹀' : '︿'}
                        </div>
                    }
                >
                    {isExpanded && (
                        <Row gutter={[16, 16]}>
                            {displayDataList.map((item: any, index) => {
                                console.log(`渲染字段 ${index}:`, item);
                                return item?.hidden ? null : (
                                    <Col span={item?.span ? item?.span : 8} key={index}>
                                        <LayoutItem name={item?.name} value={item?.value}>
                                            {!!item?.children && (
                                                <div style={{ width: item?.name ? 'calc(100% - 150px)' : '100%' }}>{item?.children}</div>
                                            )}
                                            {item?.uploudFiles && item?.uploudFiles.length > 0 && (
                                                <FileDown fileList={item?.uploudFiles} />
                                            )}
                                        </LayoutItem>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </ItemCard>
            );
        });

        console.log('渲染完成，返回卡片数组:', testCards);
        return testCards;
    };

    const getFaultReportDetailData = async () => {
        console.log(faultReportStatus, dataSource);
        if (flagId && flagId !== 'null') {
            const data = {
                flagId,
                faultReportStatus: faultReportStatus && faultReportStatus !== 'null' ? faultReportStatus : '1',
            };
            const res = await getFaultReportDetail(data);
            console.log(res);
            setFaultReportDetail(res.data || {});
            return;
        }
        if (dataSource?.standardAlarmId || standardAlarmId) {
            const data = {
                standardAlarmId: dataSource?.standardAlarmId || standardAlarmId,
                lifeType: 1,
            };
            const res = await getFaultReportDetail(data);
            setFaultReportDetail(res.data || {});
            return;
        }
        setFaultReportDetail(dataSource || {});
    };

    useEffect(() => {
        getFaultReportDetailData();
        getAllReportListData();
    }, [flagId]);

    const onGetFaultLifeCycle = async (type: string, continueType: string, reportLevel: string, time: string) => {
        const params: any = {
            flagId,
            type,
            time,
        };
        if (type === '2') {
            params.continueType = continueType;
            params.reportLevel = reportLevel;
        }

        const res = await getFaultLifeCycle(params);
        if (res.code === 200) {
            const resData = {
                resultList: res.data.resultList ?? [],
                screenShoot: res.data.screenShoot ?? '',
            };
            setReportLifeCycleData(resData);
        }
    };
    const lifeCycleClick = (title: string, continueType: string, reportLevel: string, time: string) => {
        let type: string;
        switch (title) {
            case '故障取消上报':
                type = '1';
                break;
            case '故障通知':
                type = '2';
                break;
            default:
                return;
        }
        onGetFaultLifeCycle(type, continueType, reportLevel, time);
        if (type === '1') {
            setImageVisible(true);
        }
        if (type === '2') {
            setFaultReportDetailVisible(true);
        }
    };
    const { reportCancelList, reportLifeCycleList } = faultReportDetail;
    console.log(basicInfo);
    // 检查是否有取消上报信息
    const hasCancelReport = !!(
        faultReportDetail?.reportCancelList?.faultReportStatus !== undefined &&
        (faultReportDetail.reportCancelList.cancelDetail || faultReportDetail.reportCancelList.cancelCause)
    );

    // 检查是否是手工上报
    const isManualReport = Number(faultReportDetail?.source) === 0;

    return (
        <div className="fault-report-detail" ref={imageRef}>
            {/* 基本信息始终展示 */}
            <ItemCard title="基本信息">
                <Row gutter={[8, 8]}>
                    {basicInfo.map((item: any, index) => (
                        <Col span={item?.span ? item?.span : 8} key={index}>
                            <LayoutItem name={item?.name} value={item?.value}>
                                {item?.domData &&
                                    item?.domData.map((dom, i) => (
                                        <DefaultIcon type={dom.reportType} key={i}>
                                            <span className="fault-report-detail-tag-box">{dom.reportType}</span>
                                            {dom.contentTxt}
                                        </DefaultIcon>
                                    ))}
                            </LayoutItem>
                        </Col>
                    ))}
                </Row>
            </ItemCard>

            {/* 如果故障已取消上报，只展示基本信息和取消上报信息 */}
            {hasCancelReport ? (() => {
                // 复用首报续报终报的headerInfoText逻辑
                const cancelHeaderInfoText = [
                    faultReportDetail?.reportUserName || faultReportDetail?.reportCancelList?.cancelUserName,
                    faultReportDetail?.telephone || faultReportDetail?.reportCancelList?.cancelUserPhone,
                    faultReportDetail?.deptName || faultReportDetail?.reportCancelList?.cancelUserDept,
                    faultReportDetail?.createTime || faultReportDetail?.reportCancelList?.cancelTime
                ].filter(Boolean).join('      ');

                return (
                    <ItemCard
                        title="取消上报信息"
                        subtitle={
                            <span
                                style={{
                                    display: 'inline-block',
                                    maxWidth: 900,
                                    verticalAlign: 'middle',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '12px',
                                    color: '#1890ff',
                                    letterSpacing: '0.5px',
                                    lineHeight: '1.5',
                                    paddingTop: '0px',
                                    marginTop: '-2px',
                                }}
                                title={cancelHeaderInfoText}
                            >
                                {cancelHeaderInfoText}
                            </span>
                        }
                    >
                        <LayoutItem
                            name="取消原因"
                            value={faultReportDetail?.reportCancelList?.cancelCause || '未填写'}
                        />
                        <LayoutItem
                            name="取消详情"
                            value={faultReportDetail?.reportCancelList?.cancelDetail || '未填写'}
                        />
                        <LayoutItem
                            name="附件"
                            value="未上传"
                        />
                    </ItemCard>
                );
            })() : (
                <>
                    {/* 关联告警独立模块 - 对所有故障显示 */}

                    <ItemCard
                        title="关联告警"
                        subtitle={
                            Number(faultReportDetail?.source) !== 0 ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginBottom: '25px',
                                        alignItems: 'center',
                                        position: 'absolute',
                                        right: '16px',
                                        top: '16px',
                                    }}
                                >
                                    <span>原始告警数：</span>
                                    <OriginalAlarmCount standardAlarmId={faultReportDetail?.standardAlarmId} source={faultReportDetail?.source} />
                                </div>
                            ) : null
                        }
                    >
                        <div style={{ overflowX: 'auto' }}>
                            <Row gutter={[16, 16]}>
                                {faultInfo.map((item, index) => {
                                    // 只渲染关联告警相关的项（包括标题和表格）
                                    const isAlarmRelated = item?.name === '' && React.isValidElement(item?.children) && item.children.type === AlarmTable;

                                    return isAlarmRelated && !item?.hidden ? (
                                        <Col span={item?.span ? item?.span : 24} key={index}>
                                            <LayoutItem name={item?.name} value={item?.value}>
                                                {!!item?.children && <div style={{ width: '100%' }}>{item?.children}</div>}
                                                {item?.domData && (
                                                    <div>
                                                        {item?.domData.map((dom) => (
                                                            <FaultInfoItem {...dom} />
                                                        ))}
                                                    </div>
                                                )}
                                            </LayoutItem>
                                        </Col>
                                    ) : null;
                                })}
                            </Row>
                        </div>
                    </ItemCard>


                    {/* 关联工单独立模块 - 在未确认重大告警时也显示 */}
                    <ItemCard title="关联工单">
                        <Row gutter={[16, 16]}>
                            {faultInfo.map((item, index) => {
                                // 只渲染关联工单相关的项（包括标题和表格）
                                const isTicketRelated =
                                    item?.name === '' && React.isValidElement(item?.children) && item.children.type === TicketTable;

                                return isTicketRelated && !item?.hidden ? (
                                    <Col span={item?.span ? item?.span : 24} key={index}>
                                        <LayoutItem name={item?.name} value={item?.value}>
                                            {!!item?.children && <div style={{ width: '100%' }}>{item?.children}</div>}
                                            {item?.domData && (
                                                <div>
                                                    {item?.domData.map((dom) => (
                                                        <FaultInfoItem {...dom} />
                                                    ))}
                                                </div>
                                            )}
                                        </LayoutItem>
                                    </Col>
                                ) : null;
                            })}
                        </Row>
                    </ItemCard>

                    {/* 展示故障报告历史记-*/}
                    {faultListDom()}
                </>
            )}
        </div>
    );
};
export default NewFaultReportDetailContent;
