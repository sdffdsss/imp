import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Row, Col, Button, Radio, Input, Icon, Modal, Image } from 'oss-ui';
import { ItemCard, LayoutItem, DefaultIcon, FaultInfoItem, FaultNotice, FaultBusinessTable } from '../components';
import { formatBasicInfo, formatFaultInfo } from '../utils';
import LifeCycleArrow from './LifeCycleArrow';
import arrow from './img/arrow-dub.png';
import { getFaultReportDetail, getFaultLifeCycle } from '../api';
import FileDown from '../components/file-down';
import { MART_CABLE_MAJOR } from '../type';
import './index.less';

const FaultReportDetailContent = (props) => {
    const { flagId, dataSource, faultReportStatus, theme, standardAlarmId } = props;

    const [faultReportDetail, setFaultReportDetail] = useState<any>({
        faultNoticeList: [],
    });
    const imageRef = useRef<any>();
    const [faultReportDetailVisible, setFaultReportDetailVisible] = useState<boolean>(false);
    const [imageVisible, setImageVisible] = useState<boolean>(false);
    const [reportLifeCycleData, setReportLifeCycleData] = useState<any>({ resultList: [], screenShoot: '' });

    const [currentButton, setCurrentButton] = useState<number>(0);

    const { faultNoticeList = [], fileList = [] } = faultReportDetail;

    const cycleLifeRef = useRef<HTMLDivElement>(null);
    const basicInfo = formatBasicInfo(faultReportDetail);
    const faultInfo = formatFaultInfo(faultReportDetail);
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
        setFaultReportDetail(dataSource);
    };
    const handleRightArrowClick = () => {
        if (!cycleLifeRef.current) return;
        cycleLifeRef.current.scrollLeft += 100;
    };
    const handleLeftArrowClick = () => {
        if (!cycleLifeRef.current) return;
        cycleLifeRef.current.scrollLeft -= 100;
    };
    useEffect(() => {
        getFaultReportDetailData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return (
        <div className="fault-report-detail" ref={imageRef}>
            <ItemCard title="基本信息">
                <Row gutter={[16, 16]}>
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
            <ItemCard title="故障信息">
                <Row gutter={[16, 16]}>
                    {faultInfo.map((item, index) => {
                        return item?.hidden ? null : (
                            <Col span={item?.span ? item?.span : 8} key={index}>
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
                        );
                    })}
                </Row>
            </ItemCard>
            {faultReportDetail?.specialty === MART_CABLE_MAJOR && (
                <ItemCard title="故障影响业务详情">
                    <FaultBusinessTable data={faultReportDetail} />
                </ItemCard>
            )}
            {faultReportDetail?.source !== 2 && (
                <ItemCard
                    title="故障通知"
                    subtitle={
                        <div className="fault-report-detail-button-list">
                            {faultNoticeList?.map((item: any, index) => {
                                return (
                                    <Button
                                        type={currentButton === index ? 'primary' : 'default'}
                                        onClick={() => setCurrentButton(index)}
                                        key={index}
                                    >
                                        {item.reportType}
                                    </Button>
                                );
                            })}
                        </div>
                    }
                >
                    <FaultNotice data={faultNoticeList?.[currentButton]} fileData={fileList?.[currentButton] || {}} />
                </ItemCard>
            )}
            <ItemCard title="故障取消信息">
                <div className="fault-cancel-info-row1">
                    <div className="fault-cancel-info-title">是否取消：</div>
                    <div className="fault-cancel-info-content">
                        <Radio.Group value={reportCancelList?.faultReportStatus}>
                            <Radio value="0" className="radio-item">
                                是
                            </Radio>
                            <Radio value="1" className="radio-item">
                                否
                            </Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div className="fault-cancel-info-row2">
                    <div className="fault-cancel-info-title">取消说明：</div>
                    <div className="fault-input-container">
                        <Input.TextArea value={reportCancelList?.cancelDetail} disabled style={{ resize: 'none', height: 128 }} />
                    </div>
                </div>
                <div className="fault-cancel-info-row3">
                    <div className="fault-cancel-info-title">取消原因：</div>
                    <div className="fault-input-container">
                        <Input.TextArea value={reportCancelList?.cancelCause} disabled style={{ resize: 'none' }} />
                    </div>
                </div>
                <div className="fault-cancel-info-row4">
                    <div className="fault-cancel-info-title">追加附件：</div>
                    <div className="fault-upload">
                        {faultReportStatus === '0' &&
                            fileList?.map((el) => {
                                return <FileDown fileList={el.contentFiles} />;
                            })}
                    </div>
                </div>
                <div className="fault-cancel-tip">附件支持上传图片word/excel/ppt/pdf文件,每个附件不超过2M</div>
            </ItemCard>
            <ItemCard title="故障生命周期">
                <div className="life-cycle-container">
                    <div className="fault-arrow-left" onClick={handleLeftArrowClick}>
                        <img src={arrow} alt="arrow " />
                    </div>
                    <div className="fault-life-cycle-box" ref={cycleLifeRef}>
                        {reportLifeCycleList
                            ?.filter((item) => item?.name)
                            ?.map((el, index) => {
                                return (
                                    <LifeCycleArrow
                                        title={el?.name}
                                        time={el?.time}
                                        name={el?.operator}
                                        index={index}
                                        onClick={lifeCycleClick}
                                        continueType={el?.continueType}
                                        reportLevel={el?.reportLevel}
                                        theme={theme}
                                    />
                                );
                            })}
                    </div>
                    <div className="fault-arrow-right" onClick={handleRightArrowClick}>
                        <img src={arrow} alt="arrow " />
                    </div>
                </div>
            </ItemCard>
            <Modal
                visible={faultReportDetailVisible}
                title="故障通知详情"
                footer={null}
                width={800}
                getContainer={false}
                onCancel={() => setFaultReportDetailVisible(false)}
                className="fault-notice-detail-modal"
            >
                <div className="fault-notice-detail-container">
                    <div className="fault-notice-detail-list">
                        {reportLifeCycleData.resultList.map((el) => {
                            return (
                                <div className="fault-notice-detail-list-item" key={el.details}>
                                    <div className="item-title">{el.type}</div>
                                    <div className="item-name">{el.details}</div>
                                    <div className="item-result">{el.result}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="fault-notice-detail-footer">
                        <Button type="primary" onClick={() => setFaultReportDetailVisible(false)}>
                            关闭
                        </Button>
                    </div>
                </div>
            </Modal>

            <Image
                src={reportLifeCycleData?.screenShoot}
                style={{ display: 'none' }}
                preview={{
                    visible: imageVisible,
                    src: reportLifeCycleData?.screenShoot,
                    onVisibleChange: (value) => {
                        setImageVisible(value);
                    },
                    getContainer: imageRef.current,
                }}
            />
        </div>
    );
};
export default FaultReportDetailContent;
