import React from 'react';
import { Image, Progress, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import * as echarts from 'echarts';
import moment from 'moment';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import WorkbenchCommonTopInfo from '@Pages/components/workbench-common-top-info';
import SystemNotice from '@Components/system-notice';
import constants from '@Src/common/constants';
import { AlarmList } from './components/alarm-list';
import DetailModal from './components/modal';
import Img1 from './img/img_1.png';
import Img2 from './img/img_2.png';
import Img3 from './img/img_3.png';
import Img4 from './img/img_4.png';
import Img5 from './img/img_success.png';
import Img6 from './img/img_error.png';
import { getPieChartOption, getLineChartOption, getBarChartOption } from './echarts-options';
import Api from './api.jsx';
import './index.less';

class Index extends React.Component {
    pieDomRef = React.createRef();
    pieChartInsRef = React.createRef();

    lineDomRef = React.createRef();
    lineChartInsRef = React.createRef();

    barDomRef = React.createRef();
    barChartInsRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: {},
            professionData: [],
            alarmTotal: 0,
            totalLabel: '',
            groupData: [],
            coverData: [],
            fullHourData: [],
            dutyGroupData: {},
            totalData: {},
            successRate: 0,
            faultDiscoverUpdateTime: new Date(),
            faultDispatchUpdateTime: new Date(),
            monitoringCenterupdateTime: '',
        };
        this.timer = null;
    }
    componentDidMount() {
        this.initData();
        this.timerTenM = setInterval(() => {
            this.initFaultDiscover();
        }, 600000);
        this.timerOneH = setInterval(() => {
            this.initFaultDispatchOneH();
        }, 3600000);
        this.timerOneD = setInterval(() => {
            this.initFaultDispatchOneD();
            this.initCenterData();
        }, 86400000);
    }
    componentWillUnmount() {
        clearInterval(this.timerTenM);
        clearInterval(this.timerOneH);
        clearInterval(this.timerOneD);
    }
    initFaultDiscover() {
        const { zoneId } = useLoginInfoModel.data.currentZone;
        Api.getProfessionData({ regionId: zoneId }).then((res) => {
            if (res.dataObject) {
                this.setState({
                    professionData: res.dataObject?.operationStatistics || [],
                    faultDiscoverUpdateTime: new Date(),
                });
            }
        });
        Api.getFaultDiscover({ provinceId: zoneId }).then((res) => {
            this.setState({
                alarmTotal: res.data.total,
                totalLabel: res.data.totalLabel,
                groupData: res.data.alarmClassificationList,
                faultDiscoverUpdateTime: new Date(),
            });
        });
    }

    initFaultDispatchOneH() {
        const { zoneId } = useLoginInfoModel.data.currentZone;
        Api.getDispatchData({ provinceId: zoneId }).then((res) => {
            if (res.data) {
                this.setState({
                    totalData: res.data[0],
                    faultDispatchUpdateTime: new Date(),
                });
            }
        });
        Api.getDispatchRate({ provinceId: zoneId }).then((res) => {
            if (res.data) {
                window.console.log(res.data);
                this.setState({
                    successRate: res.data[0]?.succRate,
                    faultDispatchUpdateTime: new Date(),
                });
            }
        });
        Api.getFullHourData({ provinceId: zoneId }).then((res) => {
            if (res.data) {
                const that = this;
                this.setState(
                    {
                        fullHourData: res.data,
                        faultDispatchUpdateTime: new Date(),
                    },
                    () => that.renderLineChart(),
                );
            }
        });
    }

    initFaultDispatchOneD() {
        const { zoneId } = useLoginInfoModel.data.currentZone;
        const userId = this.props.login?.userId;
        Api.getDutyGroupData({ operator: userId, provinceId: zoneId }).then((res) => {
            if (res.data) {
                const that = this;
                this.setState(
                    {
                        dutyGroupData: res.data,
                        faultDispatchUpdateTime: new Date(),
                    },
                    () => that.renderPieChart(),
                );
            }
        });
    }
    initFaultDispatch() {
        this.initFaultDispatchOneH();
        this.initFaultDispatchOneD();
    }

    initCenterData() {
        const { zoneId } = useLoginInfoModel.data.currentZone;
        Api.getWorkbenchData({ areaId: zoneId }).then((res) => {
            if (res.data) {
                this.setState({
                    data: res.data,
                    monitoringCenterupdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                });
            }
        });
    }
    initData() {
        const { zoneId } = useLoginInfoModel.data.currentZone;

        this.initCenterData();
        this.initFaultDiscover();
        Api.getCoverRateData({ provinceId: zoneId }).then((res) => {
            if (res.data) {
                const that = this;
                this.setState(
                    {
                        coverData: res.data || [],
                    },
                    () => that.renderBarChart(),
                );
            }
        });
        this.initFaultDispatch();
        const resizeObserver = new ResizeObserver((entries) => {
            for (let index = 0; index < entries.length; index += 1) {
                const entry = entries[index];

                if (entry.target === this.pieDomRef.current) {
                    this.renderPieChart();
                } else if (entry.target === this.lineDomRef.current) {
                    this.renderLineChart();
                } else if (entry.target === this.barDomRef.current) {
                    this.renderBarChart();
                }
            }
        });
        resizeObserver.observe(this.pieDomRef.current);
        resizeObserver.observe(this.lineDomRef.current);
        resizeObserver.observe(this.barDomRef.current);
    }

    renderPieChart() {
        Promise.resolve().then(() => {
            const pieChartOption = getPieChartOption();
            const { dutyGroupData } = this.state;
            if (dutyGroupData.allCount) {
                pieChartOption.title.text = `${dutyGroupData.allCount}个`;
                pieChartOption.series[0].data[0].value = dutyGroupData.bjMteamCount;
                pieChartOption.series[0].data[1].value = dutyGroupData.zbMteamCount;
            }

            if (!this.pieChartInsRef.current) {
                this.pieChartInsRef.current = echarts.init(this.pieDomRef.current);
            }
            this.pieChartInsRef.current?.setOption(pieChartOption);
            this.pieChartInsRef.current?.resize();
        });
    }

    renderLineChart() {
        if (this.lineChartInsRef.current) {
            this.lineChartInsRef.current.showLoading();
        }
        Promise.resolve().then(() => {
            const { fullHourData } = this.state;
            const lineChartOption = getLineChartOption();

            if (fullHourData.length === 0) {
                lineChartOption.yAxis.nameTextStyle.padding = [0, 0, 0, 50];
            }

            lineChartOption.xAxis.data = fullHourData.map((e) => e.timeHour);
            const hourRate = [];
            const weekRate = [];
            lineChartOption.xAxis.data.forEach((item, index) => {
                hourRate[index] = fullHourData.find((e) => e.timeHour === item)?.for24Count;
                weekRate[index] = fullHourData.find((e) => e.timeHour === item)?.weekAvgCount;
            });
            lineChartOption.series[1].data = hourRate;
            lineChartOption.series[0].data = weekRate;

            if (!this.lineChartInsRef.current) {
                this.lineChartInsRef.current = echarts.init(this.lineDomRef.current);
            }
            this.lineChartInsRef?.current?.setOption(lineChartOption);
            this.lineChartInsRef?.current?.hideLoading();
        });
    }

    renderBarChart() {
        if (this.barChartInsRef.current) {
            this.barChartInsRef.current.showLoading();
        }
        const { coverData } = this.state;
        Promise.resolve().then(() => {
            const lineBarChartOption = getBarChartOption();

            if (coverData.length === 0) {
                lineBarChartOption.yAxis[0].nameTextStyle.padding = [0, 0, 0, 50];
            }
            lineBarChartOption.xAxis.data = coverData.map((e) => e.professionalType);
            lineBarChartOption.series[0].data = coverData.map((e) => e.coverage);

            if (!this.barChartInsRef.current) {
                this.barChartInsRef.current = echarts.init(this.barDomRef.current);
            }
            this.barChartInsRef.current?.setOption(lineBarChartOption);
            this.barChartInsRef.current?.hideLoading();
        });
    }

    renderLeftItem = (info) => {
        const { imgPath, title, num, picWidth } = info;
        return (
            <section className={`${title === '监控中心数' ? 'left-item-a' : 'left-item'}`} onClick={() => title === '监控中心数' && this.showModal()}>
                <Image width={`${picWidth}px`} preview={false} src={imgPath} />
                <div className="left-item-right">
                    <section className="left-item-text">
                        <span className="left-item-text-content">{title}</span>
                    </section>
                    <section className="left-item-num">
                        <span className="num-content">{num}</span>
                        <span className="num-unit">个</span>
                    </section>
                </div>
            </section>
        );
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    closeModal = () => {
        this.setState({
            visible: false,
        });
    };

    handleRefreshFaultDiscover = () => {
        this.initFaultDiscover();
    };
    handleRefreshFaultDispatch = () => {
        this.initFaultDispatch();
    };
    renderSecondRightItem = (info) => {
        const { title, num } = info;
        return (
            <section className="second-center-item">
                <span>{title}</span>
                <span>
                    <span className="bold-num" style={{ marginRight: 17 }}>
                        {num}
                    </span>
                    <span>人</span>
                </span>
            </section>
        );
    };

    renderThirdItem = (info) => {
        const { title, num } = info;
        return (
            <section className="right-item">
                <div style={{ marginLeft: 13 }}>{title}</div>
                <div>
                    <span className="bold-num" style={{ marginRight: 17 }}>
                        {num}
                    </span>
                    <span>个</span>
                </div>
            </section>
        );
    };

    renderRightItem = (info) => {
        const { imgPath, title1, num1, title2, num2, showPercent } = info;
        return (
            <div className="fourth-item">
                <div className="fourth-item-pic-box">
                    <Image width="78px" preview={false} src={imgPath} style={{ marginRight: 20 }} />
                </div>
                <div className="fourth-item-box">
                    <div className="fourth-item-inner">
                        <div>{title1}</div>
                        <div>
                            <span className="bold-num" style={{ marginRight: 7 }}>
                                {num1}
                            </span>
                            <span>个</span>
                        </div>
                    </div>
                    <div className="fourth-item-inner">
                        <div>{title2}</div>
                        <div>
                            <span className="bold-num" style={{ marginRight: 7 }}>
                                {num2}
                            </span>
                            <span>{showPercent ? '%' : '个'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { visible, data, professionData, alarmTotal, groupData, dutyGroupData, totalData, totalLabel, monitoringCenterupdateTime } = this.state;
        const {
            monitorCenterNum,
            monitorGroupNum,
            monitorPersonnelNum,
            dutyPersonnelNum,
            dispatcherNum,
            ownPersonnelNum,
            monitorCenterViewNum,
            customViewNum,
            activeUserNum,
            activeUserRate,
            dispatchRuleTotalNum,
            dispatchGroupNum,
        } = data;
        return (
            <div className="integrated-monitoring">
                <div className="workbench-common-top-info">
                    <WorkbenchCommonTopInfo loginInfo={this.props.login} isManagementButtonVisible={false} />
                </div>
                <div className="integrated-monitoring-header">
                    <div className="update-time-box">
                        <span>更新时间：{monitoringCenterupdateTime}</span>
                    </div>
                    <div className="left-part">
                        {this.renderLeftItem({
                            title: '监控中心数',
                            num: monitorCenterNum,
                            imgPath: `${constants.IMAGE_PATH}/monitor/监控中心数.png`,
                            picWidth: 40,
                        })}
                        {this.renderLeftItem({
                            title: '监控班组数',
                            num: monitorGroupNum,
                            imgPath: `${constants.IMAGE_PATH}/monitor/监控班组数.png`,
                            picWidth: 40,
                        })}
                        {this.renderLeftItem({
                            title: '调度班组数',
                            num: dispatchGroupNum,
                            imgPath: `${constants.IMAGE_PATH}/monitor/监控班组数.png`,
                            picWidth: 40,
                        })}
                    </div>
                    <div className="second-part">
                        <div className="second-left">
                            <Image width="89px" preview={false} src={`${constants.IMAGE_PATH}/monitor/监控人员数.png`} />
                            <section>监控中心人员</section>
                            <div>
                                <span className="num-content">{monitorPersonnelNum}</span>
                                <span className="num-unit">人</span>
                            </div>
                        </div>
                        <div className="second-center">
                            {this.renderSecondRightItem({
                                title: '值班监控人员',
                                num: dutyPersonnelNum,
                            })}
                            {this.renderSecondRightItem({
                                title: '自有人员',
                                num: ownPersonnelNum,
                            })}
                        </div>
                        <div className="second-right">
                            <Image width="89px" preview={false} src={`${constants.IMAGE_PATH}/monitor/调度人员数.png`} />
                            <section>调度人员</section>
                            <div>
                                <span className="num-content">{dispatcherNum}</span>
                                <span className="num-unit">人</span>
                            </div>
                        </div>
                    </div>
                    <div className="third-part">
                        <section className="third-part-top">
                            <Image width="66px" preview={false} src={`${constants.IMAGE_PATH}/monitor/监控视图.png`} />
                        </section>
                        <section className="third-part-right">
                            {this.renderThirdItem({
                                title: '监控中心视图数',
                                num: monitorCenterViewNum,
                            })}
                            {this.renderThirdItem({
                                title: '自定义视图数',
                                num: customViewNum,
                            })}
                        </section>
                    </div>
                    <div className="fourth-part">
                        {this.renderRightItem({
                            imgPath: `${constants.IMAGE_PATH}/monitor/活跃用户数.png`,
                            title1: '活跃用户数',
                            num1: activeUserNum,
                            title2: '本周活跃用户率',
                            num2: activeUserRate,
                            showPercent: true,
                        })}
                    </div>
                </div>
                <div className="integrated-monitoring-content">
                    <div className="content-left">
                        <header className="content-title">
                            <span>故障发现</span>
                            <div className="refresh">
                                <i className="refresh-icon" onClick={_.debounce(this.handleRefreshFaultDiscover, 500)}>
                                    <Icon
                                        style={{ zIndex: 20, position: 'relative', cursor: 'pointer', color: '#cecccc' }}
                                        type="SyncOutlined"
                                        antdIcon
                                    />
                                </i>
                                <span className="update-time">{`更新时间：${moment(this.state.faultDiscoverUpdateTime).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                )}`}</span>
                            </div>
                        </header>
                        <div style={{ display: 'flex', marginBottom: '10px' }} className="content-left-top">
                            <section
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginRight: 10,
                                    paddingLeft: 30,
                                    fontSize: '16px',
                                    textAlign: 'center',
                                }}
                            >
                                <Image preview={false} style={{ width: '3.5vw' }} src={`${constants.IMAGE_PATH}/monitor/一级告警.png`} />
                                <div style={{ width: '151px' }}>
                                    {totalLabel.length > 8 ? (
                                        <>
                                            <p style={{ marginBottom: '0' }}>{totalLabel.slice(0, 4)}</p>
                                            <p style={{ marginBottom: '0' }}>{totalLabel.slice(4)}</p>
                                        </>
                                    ) : (
                                        totalLabel
                                    )}
                                </div>
                                <div className="num-content">{alarmTotal}</div>
                            </section>
                            <section style={{ flex: 1, marginLeft: '10px' }}>
                                <AlarmList data={groupData} />
                            </section>
                        </div>
                        <div className="content-left-bottom">
                            <header className="content-left-bottom-title">
                                <div
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: '#3377FF',
                                        marginRight: 6,
                                    }}
                                />
                                <span style={{ fontWeight: 700, fontSize: '16px', lineHeight: '50px' }}>本地网专业活动告警量</span>
                            </header>
                            <div className="content-left-bottom-content">
                                {professionData.map((item) => (
                                    <div className="content-left-bottom-item" key={item.key}>
                                        <div className="content-left-bottom-left">
                                            <Image
                                                preview={false}
                                                width={25}
                                                height={25}
                                                src={`${constants.IMAGE_PATH}/monitor/${item.name}.png`}
                                                alt={item.name}
                                            />
                                            <span style={{ marginLeft: '19px', fontSize: '14px' }}>{item.name}</span>
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: '20px' }}>{item.activeAlarm}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="content-right">
                        <header className="content-title">
                            <span>故障派单</span>
                            <div className="refresh">
                                <i className="refresh-icon" onClick={_.debounce(this.handleRefreshFaultDispatch, 500)}>
                                    <Icon
                                        style={{ zIndex: 20, position: 'relative', cursor: 'pointer', color: '#cecccc' }}
                                        type="SyncOutlined"
                                        antdIcon
                                    />
                                </i>
                                <span className="update-time">{`更新时间：${moment(this.state.faultDispatchUpdateTime, 'YY-mm-dd HH:MM:SS').format(
                                    'YYYY-MM-DD HH:mm:ss',
                                )}`}</span>
                            </div>
                        </header>
                        <div className="content-right-top">
                            <div className="section-wrapper">
                                <section className="section-1">
                                    <div className="section-1-left">
                                        <div>
                                            <Image preview={false} width="57px" height="57px" src={Img1} />
                                            <span>
                                                <span>派单成功率</span>
                                                <span>
                                                    <span className="num">{this.state.successRate}</span>
                                                    <span>%</span>
                                                </span>
                                            </span>
                                        </div>
                                        <div>
                                            <Image preview={false} width="57px" src={Img2} />
                                            <span>
                                                <span>派单规则总量</span>
                                                <span>
                                                    <span className="num">{dispatchRuleTotalNum}</span>
                                                    <span>条</span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="dispatch-num">
                                        <Progress
                                            type="dashboard"
                                            format={() => (
                                                <div style={{ fontSize: '14px' }}>
                                                    <span style={{ color: 'rgb(24, 144, 255)', fontSize: 24, fontWeight: 'bold' }}>
                                                        {this.state?.totalData?.totalCount}
                                                    </span>
                                                    条
                                                </div>
                                            )}
                                            trailColor="rgb(225, 239, 255)"
                                            width={160}
                                            percent={52}
                                            strokeWidth={10}
                                        />
                                        <div className="text">当日派单量</div>
                                    </div>
                                    <div className="section-1-right">
                                        <div>
                                            <Image preview={false} width="57px" height="57px" src={Img5} />
                                            <span>
                                                <span>当日派单成功量</span>
                                                <span>
                                                    <span className="num">{totalData?.succCount}</span>
                                                    <span>条</span>
                                                </span>
                                            </span>
                                        </div>
                                        <div>
                                            <Image preview={false} width="57px" src={Img6} />
                                            <span>
                                                <span>当日派单失败量</span>
                                                <span>
                                                    <span className="num">{totalData?.totalCount - totalData?.succCount}</span>
                                                    <span>条</span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <section className="section-3">
                                <div className="pie-chart-wrapper">
                                    <div className="pie-chart-dom" ref={this.pieDomRef} />
                                    <div className="text">维护班组</div>
                                </div>
                                <div className="num-stats">
                                    <div className="item-stats item-stats-1">
                                        <Image preview={false} width="28px" src={Img3} />
                                        <div className="text-wrapper">
                                            <div className="text-title">值班班组</div>
                                            <div>
                                                <span>{dutyGroupData?.zbMteamCount}</span>个
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-stats item-stats-2">
                                        <Image preview={false} width="28px" src={Img4} />
                                        <div className="text-wrapper">
                                            <div className="text-title">包机班组</div>
                                            <div>
                                                <span>{dutyGroupData?.bjMteamCount}</span>个
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="content-right-bottom">
                            <div className="bottom-left">
                                <div className="bottom-title">
                                    <span></span>关键场景-自动派单覆盖率
                                </div>
                                <div className="bottom-content">
                                    <div ref={this.barDomRef} style={{ width: '100%', height: '100%' }}></div>
                                </div>
                            </div>
                            <div className="bottom-right">
                                <div className="bottom-title">
                                    <span></span>近24小时派单量
                                </div>
                                <div className="bottom-content">
                                    <div ref={this.lineDomRef} style={{ width: '100%', height: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SystemNotice />
                {visible && <DetailModal visible={visible} closeModal={this.closeModal} />}
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
