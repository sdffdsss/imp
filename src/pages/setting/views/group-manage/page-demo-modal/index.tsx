import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import useLoginInfoModel from '@Src/hox';
import { DutyManStatistics, GroupAndProfessionalStatistics, GroupUserStatistics } from './api';
import IMG from './image';
import { LeftDutyDataType, MiddleDataType, RightDataItemType, RightDataType } from './type';
import { getPieChartOption, getBarChartOption } from './chartOption';
import LeftContentRow from './component/left-content-row';
import ProfessionList from './component/profession-list';
import UpdateTime from './component/updateTime';
import './index.less';

const initDutyData = {
    shiftForemans: [],
    groups: [],
};
const initMiddleData = {
    allGroupCount: 0,
    jkGroupCount: 0,
    ddGroupCount: 0,
    professionalCount: 0,
    professionals: [],
};
const initRightData = {
    rowsData: [],
    totalCount: 0,
};
enum MyEnum {
    CHART_TIME_STEP = 5000,
}
const PageDemoModal: React.FC = () => {
    const pieChartRef = useRef<HTMLDivElement>(null);
    const barChartRef = useRef<HTMLDivElement>(null);
    const [leftDutyData, setLeftDutyData] = useState<LeftDutyDataType>(initDutyData);
    const [middleData, setMiddleData] = useState<MiddleDataType>(initMiddleData);
    const [rightData, setRightData] = useState<RightDataType>(initRightData);
    const [chartPageData, setChartPageData] = useState<RightDataItemType[]>([]);
    const login = useLoginInfoModel();
    let { zoneId } = login.systemInfo.currentZone ?? JSON.parse(login.userInfo).zones[0];
    if (login.zoneLevelFlags.isCityZone) {
        zoneId = JSON.parse(login.userInfo).zones[0].zoneLevel_2Id;
    }
    const getOnDutyManStatistics = async () => {
        const params = { provinceId: zoneId };
        const res = await DutyManStatistics(params);
        if (res.code === 0) {
            setLeftDutyData(res.data);
        }
    };
    const getGroupAndProfessionalStatistics = async () => {
        const params = { provinceId: zoneId };
        const res = await GroupAndProfessionalStatistics(params);
        if (res.code === 0) {
            setMiddleData(res.data);
        }
    };

    const onLeftUpdateClick = () => {
        getOnDutyManStatistics();
    };

    const onCarouselChartData = () => {
        const copyRowsData = JSON.parse(JSON.stringify(rightData.rowsData));
        const dataFragment = copyRowsData.splice(0, 6);
        setChartPageData([...dataFragment]);
        setRightData({ ...rightData, rowsData: [...copyRowsData, ...dataFragment] });
    };

    const getGroupUserStatistics = async () => {
        const params = { provinceId: zoneId };
        const res = await GroupUserStatistics(params);
        if (res.code === 0) {
            const copyRowsData = JSON.parse(JSON.stringify(res.rows));
            const initData = copyRowsData.splice(0, 6);
            setChartPageData([...initData]);
            setRightData({
                rowsData: [...copyRowsData, ...initData],
                totalCount: res.total,
            });
        }
    };
    const onRightUpdateClick = () => {
        setChartPageData([]);
        getGroupUserStatistics();
    };
    useEffect(() => {
        getOnDutyManStatistics();
        getGroupAndProfessionalStatistics();
        getGroupUserStatistics();
        onCarouselChartData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (pieChartRef.current) {
            const myChart = echarts.init(pieChartRef.current);
            const option = getPieChartOption(middleData);
            myChart.setOption(option);
        }
    }, [middleData]);
    useEffect(() => {
        let timer: any;
        const myChart = echarts.init(barChartRef.current as HTMLElement);
        const option = getBarChartOption(chartPageData);
        myChart.setOption(option);

        if (rightData.rowsData.length <= 6) return () => {};
        if (!timer) {
            timer = setInterval(() => {
                onCarouselChartData();
            }, MyEnum.CHART_TIME_STEP);
        }
        myChart.on('mouseover', () => {
            clearInterval(timer);
        });
        myChart.off('mouseout');
        myChart.on('mouseout', () => {
            clearInterval(timer);
            timer = setInterval(() => {
                onCarouselChartData();
            }, MyEnum.CHART_TIME_STEP);
        });
        return () => {
            clearInterval(timer);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartPageData, rightData]);

    return (
        <div className="page-demo-mode">
            <div className="page-demo-mode-left">
                <div className="left-header">
                    <div className="left-header-title">今日当班</div>
                    <UpdateTime onClick={onLeftUpdateClick} autoUpdateTime={1000 * 60 * 30} />
                </div>
                <div className="left-content">
                    <div className="left-content-row-first">
                        <div className="left-content-row-first-label">当班值班长</div>
                        <div className="left-content-row-first-tabList">
                            {leftDutyData.shiftForemans.length > 0
                                ? leftDutyData.shiftForemans.map((item) => (
                                      <div className="tab-name" key={item} title={item}>
                                          {item}
                                      </div>
                                  ))
                                : '无'}
                        </div>
                    </div>
                    <div className="content-small-title">各班组当班人</div>
                    {leftDutyData.groups.length > 0 ? (
                        leftDutyData.groups.map((el) => {
                            return <LeftContentRow data={el.users} title={el.groupName} />;
                        })
                    ) : (
                        <div>无</div>
                    )}
                </div>
            </div>
            <div className="page-demo-mode-center">
                <div className="center-above">
                    <div className="center-above-left">
                        <div className="chart-root" ref={pieChartRef} />
                    </div>
                    <div className="center-above-right">
                        <div className="group-name">
                            <img src={IMG.duty} alt="" />
                            <div className="group-name-info">
                                <div className="group-name-info-title">监控班组</div>
                                <div className="group-name-info-num">
                                    <span className="omit-num" title={`${middleData.jkGroupCount}`}>
                                        {middleData.jkGroupCount}
                                    </span>
                                    <span>&nbsp;&nbsp;个</span>
                                </div>
                            </div>
                        </div>
                        <div className="group-name">
                            <img src={IMG.group} alt="" />
                            <div className="group-name-info">
                                <div className="group-name-info-title">调度班组</div>
                                <div className="group-name-info-num">
                                    <span className="omit-num" title={`${middleData.ddGroupCount}`}>
                                        {middleData.ddGroupCount}
                                    </span>
                                    <span>&nbsp;&nbsp;个</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="center-bottom">
                    <div className="center-bottom-left">
                        <div className="profession-cover">
                            <img src={IMG.dispatch} alt="" />
                            <div className="center-bottom-info">
                                <div className="center-bottom-info-title">覆盖专业</div>
                                <div className="center-bottom-info-num">
                                    <span>{middleData.professionalCount}</span>
                                    <span>&nbsp;&nbsp;个</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="center-bottom-right">
                        {middleData.professionals.length > 0 ? (
                            <ProfessionList data={middleData.professionals} />
                        ) : (
                            // <ProfessionList data={mockdata} />
                            '班组暂未关联专业'
                        )}
                    </div>
                </div>
            </div>
            <div className="page-demo-mode-right">
                <div className="left-click">《</div>
                <div className="right-click">》</div>
                <div className="right-header">
                    <div className="right-header-title">
                        <span>班组成员</span>
                        <span>
                            <span className="person-num">{rightData.totalCount}</span>
                            <span>人</span>
                        </span>
                    </div>
                    <UpdateTime onClick={onRightUpdateClick} autoUpdateTime={1000 * 60 * 60 * 24} />
                </div>
                <div className="right-content">
                    <div className="bar-chart-root" ref={barChartRef} />
                </div>
            </div>
        </div>
    );
};
export default PageDemoModal;
