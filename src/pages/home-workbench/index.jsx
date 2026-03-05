/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import actionss from '@Src/share/actions';
import { Icon, Timeline, message, Carousel } from 'oss-ui';
import { PaperClipOutlined } from '@ant-design/icons';
import anime from 'animejs/lib/anime.es.js';
// import getData from './dataServiceUnicom';
import moment from 'moment';
import request from '@Common/api';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import GlobalMessage from '@Src/common/global-message';
import { createFileFlow } from '@Common/utils/download';
import { _ } from 'oss-web-toolkits';
import './style.less';

let animtions = null;
let scrollDiv = null;
// let scrollInterval = '';
class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            announcement: [],
            listMarginTop: '0',
            animate: false,
            loading: false,
            monitorCenterList: [],
            treeData: [],
            testData: {},
        };
        this.motiorTimeLine = React.createRef(null);
        this.carouseRef = React.createRef(null);
        this.timer = null;
        this.scrollTimer = null;
        this.handleDownLoad = _.debounce(this.handleDownLoad, 500);
    }

    getViewData = (current) => {
        const { userInfo } = this.state;
        const {
            login: { systemInfo },
        } = this.props;
        const zoneId = systemInfo.currentZone?.zoneId;
        const param = zoneId ? { provinceId: zoneId } : { provinceId: userInfo.userProvinceId };
        request(`/v1/center-view/new`, {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: {
                current,
                pageSize: 16,
                ...param,
                // provinceId: userInfo.userProvinceId,
            },
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res.data && res.data.length > 0) {
                let list = [];
                const sortList = _.sortBy(res.data, (item) => item.orderNum);

                list = this.getTreeData(sortList);
                // }
                this.setState({
                    monitorCenterList: list,
                    testData: { total: res.total > 48 ? 48 : res.total },
                });
            }
        });
    };

    getNotice = () => {
        clearTimeout(this.timer);
        const { userInfo, announcement } = this.state;
        const {
            login: { systemInfo },
        } = this.props;
        const zoneId = systemInfo.currentZone?.zoneId;
        // const {公告部分是否切换省份，等待后续提优化
        //     login: { systemInfo },
        // } = this.props;
        // const zoneId = systemInfo.currentZone?.zoneId;
        // const param = zoneId ? { provinceId: zoneId } : {provinceId: userInfo.userProvinceI};
        // this.setState({
        //     loading: true
        // });
        request(`homepage/announcement/v1/notice/toShow`, {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: {
                provinceId: userInfo?.isSuperAdmin ? null : zoneId ? zoneId : userInfo?.userProvinceId,
                status: '2',
            },
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then((res) => {
                if (res.data) {
                    const data = res.data.map((item) => {
                        return {
                            ...item,
                            key: item.noticeId,
                            time: moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
                            title: item.noticeTitle,
                            field: item.noticeText,
                        };
                    });
                    if (_.isEqual(data, announcement)) {
                        return;
                    }
                    this.setState(
                        {
                            announcement: data,
                        },
                        () => {
                            // animtions && animtions.reset();
                            // this.scrollUp();
                        },
                    );
                } else {
                    // message.error('获取数据失败');
                }
            })
            .catch(() => {
                return clearTimeout(this.timer);
            });
        this.timer = setTimeout(() => {
            this.getNotice();
        }, 600000);
        // getData('selectNoticeByType', { showSuccessMessage: false, showErrorMessage: false }, { type: 1 })
        //     .then((res) => {
        //         if (res.dealResult) {
        //             if (res.data && res.data.data) {
        //                 const data = res.data.data.map((item) => {
        //                     return {
        //                         ...item,
        //                         key: item.noticeId,
        //                         time: moment(item.datetime).format('YYYY-MM-DD HH:mm:ss'),
        //                         field: item.notice,
        //                     };
        //                 });
        //                 this.setState(
        //                     {
        //                         announcement: data,
        //                         loading: false,
        //                     },
        //                     () => {
        //                         this.scrollUp();
        //                     },
        //                 );
        //             }
        //         } else {
        //             message.error('获取数据失败');
        //         }
        //     })
        //     .catch(() => {
        //         this.setState({
        //             loading: false,
        //         });
        //         message.error('获取数据失败');
        //     });
    };
    scrollUp = () => {
        const timeLine = document.querySelectorAll('.timeline');
        const yTrans = [];
        let lenHeight = 0;
        let yHeight = 0;
        anime.set('.timeline', {
            translateY(el, i) {
                lenHeight += timeLine[i].scrollHeight;
                if (i > 0) {
                    const heig = yHeight;
                    yTrans[i] = { y: heig };
                    yHeight += timeLine[i].scrollHeight;
                    return heig;
                }
                yHeight += timeLine[i].scrollHeight;
                yTrans[i] = { y: 0 };
                return 0;
            },
        });

        const time = (timeLine.length / 10) * 100000;
        animtions = anime({
            targets: yTrans,
            duration: time, // 走一周持续时间
            easing: 'linear',
            y: `-=${lenHeight}`,
            loop: true,
            update() {
                anime.set('.timeline', {
                    translateY(el, i) {
                        if (yTrans[i].y < -timeLine[i].scrollHeight) {
                            return lenHeight + yTrans[i].y;
                        }
                        return yTrans[i].y % lenHeight;
                    },
                });
            },
        });
    };

    watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on('activeChanged', ({ isActive }) => {
            if (isActive) {
                setTimeout(() => {
                    this.getNotice();
                }, 2000);
            } else {
                clearTimeout(this.timer);
                clearTimeout(this.scrollTimer);
            }
        });
    };

    componentDidMount() {
        this.watchTabActiveChange();
        const userInFo = JSON.parse(this.props.login.userInfo);
        const zoneInfo = userInFo?.zones;
        const userInfo = {
            userProvinceId:
                zoneInfo && zoneInfo[0]?.zoneLevel && (parseInt(zoneInfo[0].zoneLevel, 10) === 1 ? zoneInfo[0]?.zoneId : zoneInfo[0].zoneLevel_2Id),
            groupUser: zoneInfo && zoneInfo[0]?.zoneLevel ? parseInt(zoneInfo[0].zoneLevel, 10) === 1 : false,
            userId: this.props.login.userId,
            userName: this.props.login.userName,
            userProvinceName: zoneInfo && zoneInfo[0]?.zoneName,
            userMobile: userInFo.userMobile,
            isSuperAdmin: !!(userInFo.isAdmin && this.props.login.userId === 0),
        };

        this.setState(
            {
                userInfo,
            },
            async () => {
                // await this.getSelectData();
                this.getNotice();
                this.getViewData(1);
                this.getDivScroll();
            },
        );
        scrollDiv = document.getElementById('motiorTimeLine');
        scrollDiv.addEventListener('scroll', (e) => {
            this.onDivScroll(e);
        });
    }

    onScrollDivOver = () => {
        if (scrollDiv) {
            clearTimeout(this.scrollTimer);
        }
    };

    onScrollDivOut = () => {
        if (scrollDiv) {
            this.getDivScroll();
        }
    };

    getDivScroll = () => {
        clearTimeout(this.scrollTimer);
        scrollDiv.scrollTop += 1;
        this.scrollTimer = setTimeout(() => {
            this.getDivScroll();
        }, 20);
    };

    onDivScroll = (event) => {
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom) {
            scrollDiv.scrollTop = 0;
        }
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
        clearTimeout(this.scrollTimer);
    }
    getTreeData = (list) => {
        const { length } = list;
        let treeData = [];
        if (length > 0 && length <= 2) {
            list.forEach((item, index) => {
                if (index === 0) {
                    treeData = [
                        {
                            key: 0,
                            data: [item],
                        },
                    ];
                    return;
                }
                treeData[index] = {
                    key: index,
                    data: [item],
                };
            });
        }
        if (length > 2 && length <= 4) {
            list.forEach((item, index) => {
                if (index < 2) {
                    if (index === 0) {
                        treeData = [
                            {
                                key: 0,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[0] = {
                        key: 0,
                        data: [...treeData[0].data, item],
                    };
                } else {
                    if (index === 2) {
                        treeData = [
                            ...treeData,
                            {
                                key: 1,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[1] = {
                        key: 1,
                        data: [...treeData[1].data, item],
                    };
                }
            });
        }
        if (length > 4 && length <= 6) {
            list.forEach((item, index) => {
                if (index < 3) {
                    if (index === 0) {
                        treeData = [
                            {
                                key: 0,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[0] = {
                        key: 0,
                        data: treeData[0]?.data ? [...treeData[0].data, item] : [item],
                    };
                } else {
                    if (index === 3) {
                        treeData = [
                            ...treeData,
                            {
                                key: 1,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[1] = {
                        key: 1,
                        data: treeData[1].data ? [...treeData[1].data, item] : [item],
                    };
                }
            });
        }
        if (length > 6 && length < 10) {
            list.forEach((item, index) => {
                if (index < 3) {
                    if (index === 0) {
                        treeData = [
                            {
                                key: 0,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[0] = {
                        key: 0,
                        data: [...treeData[0].data, item],
                    };
                } else if (index >= 3 && index < 6) {
                    if (index === 3) {
                        treeData = [
                            ...treeData,
                            {
                                key: 1,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[1] = {
                        key: 1,
                        data: [...treeData[1].data, item],
                    };
                } else {
                    if (index === 6) {
                        treeData = [
                            ...treeData,
                            {
                                key: 2,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[2] = {
                        key: 2,
                        data: [...treeData[2].data, item],
                    };
                }
            });
        }
        if (length >= 10) {
            list.forEach((item, index) => {
                if (index < 4) {
                    if (index === 0) {
                        treeData = [
                            {
                                key: 0,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[0] = {
                        key: 0,
                        data: [...treeData[0].data, item],
                    };
                } else if (index >= 4 && index < 8) {
                    if (index === 4) {
                        treeData = [
                            ...treeData,
                            {
                                key: 1,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[1] = {
                        key: 1,
                        data: [...treeData[1].data, item],
                    };
                } else if (index >= 8 && index < 12) {
                    if (index === 8) {
                        treeData = [
                            ...treeData,
                            {
                                key: 2,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[2] = {
                        key: 2,
                        data: [...treeData[2].data, item],
                    };
                } else {
                    if (index === 12) {
                        treeData = [
                            ...treeData,
                            {
                                key: 3,
                                data: [item],
                            },
                        ];
                        return;
                    }
                    treeData[3] = {
                        key: 3,
                        data: [...treeData[3].data, item],
                    };
                }
            });
        }
        return treeData;
    };
    pushActions = (url) => {
        // shareActions.postMessage(messageTypes.openRoute, {
        //     entry: `/gcss/keyassure-view`,
        // });
        const { actions, messageTypes } = actionss;
        actions &&
            actions.postMessage &&
            actions.postMessage(messageTypes.openRoute, {
                entry: `${url}`,
            });
        // this.props.history.push({
        //     pathname: url,
        //     state: {
        //         viewData: data,
        //     },
        // });
    };

    pushActionsSearch = (url, id, name) => {
        // shareActions.postMessage(messageTypes.openRoute, {
        //     entry: `/gcss/keyassure-view`,
        // });
        const { actions, messageTypes } = actionss;
        actions &&
            actions.postMessage &&
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
                uuid: `${url}/${id}`,
                search: {
                    // viewData: data,
                    centerWindowId: id,
                    centerWindowName: name,
                },
            });
    };
    animteActions = (flag) => {
        if (flag) {
            animtions && animtions.play();
        } else {
            animtions && animtions.pause();
        }
    };
    onScroll = (event) => {
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 100;
        if (isBottom) {
            scrollDiv.scrollTop -= 100;
        }
    };
    acrouselChange = (value) => {
        this.getViewData(value + 1);
    };
    beforeChange = () => {
        this.setState({
            monitorCenterList: [],
        });
    };
    downLoad = (name, id) => {
        // const link = document.createElement('a');
        // link.href = `${useEnvironmentModel.data.environment.monitorSetUrl.direct}/homepage/announcement/v1/export?fileName=${name}&noticeId=${id}`; // window.URL.createObjectURL(result.fileurl);
        const url = `${useEnvironmentModel.data.environment.monitorSetUrl.direct}/homepage/announcement/v1/export?fileName=${name}&noticeId=${id}`; // window.URL.createObjectURL(result.fileurl);
        // link.click();
        return createFileFlow(name, url);
        // window.URL.revokeObjectURL(link.href);
    };
    handleDownLoad = (name, id) => {
        this.downLoad(name, id);
    };
    renderFileList = (item) => {
        if (item.fileList && Array.isArray(item.fileList)) {
            return item.fileList.map((itm) => (
                <div className="download">
                    <PaperClipOutlined />
                    <span
                        onClick={() => {
                            this.handleDownLoad(itm, item.noticeId);
                        }}
                    >
                        {itm}
                    </span>
                </div>
            ));
        }
    };
    render() {
        const { announcement, loading, monitorCenterList, testData } = this.state;
        const sortNum = Math.ceil(testData.total / 16) || 1;
        const arr = [];
        for (let i = 0; i < sortNum; i += 1) {
            arr.push(i);
        }
        return (
            <div className="home-list oss-imp-alart-common-bg">
                <div className="home-list-title">监控工作台</div>
                <div className="home-list-info">
                    <div className="home-list-info-field-second">
                        <div className="home-list-info-field-title">
                            <img src={require('./img/u455.png')} alt="" className="home-list-info-field-img" />
                            <span className="home-list-info-field-title-content"> 告警发现派单</span>
                        </div>
                        <div
                            className="home-list-info-field-first-content-second"
                            // onClick={this.pushActions.bind(this, '/unicom/duty-window')}
                        >
                            {/* <div className="home-list-info-field-icon bg-purple">
                                <Icon type="iconjiankong"></Icon>
                            </div> */}
                            {/* <div className="home-list-info-field-icon-title mt20">监控视图</div> */}
                            <div
                                className="home-list-info-field-moitor-content bg-blue1"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/alarm-window-unicom/duty-window')}
                            >
                                <div className="home-list-info-field-icon bg-purple">
                                    <Icon type="iconjiankong" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">当班监控视图</div>
                            </div>
                            <div
                                className="home-list-info-field-moitor-content mt10 bg-green2"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/alarm-window-unicom/custom-window')}
                            >
                                <div className="home-list-info-field-icon bg-green5">
                                    <Icon type="iconjiankong" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">自定义视图</div>
                            </div>
                        </div>
                        <div className="home-list-info-field-first-content mt20 monitor-hover">
                            {/* <div className="home-list-info-field-icon bg-yellow">
                                <Icon type="iconzidingyi"></Icon>
                            </div>
                            <div className="home-list-info-field-icon-title mt20">监控中心视图</div> */}
                            <div
                                className="home-list-info-field-monitor"
                                // style={{ marginBottom: 10, height: 'calc(100% - 10px)' }}
                            >
                                <Carousel afterChange={this.acrouselChange} ref={this.carouseRef} beforeChange={this.beforeChange}>
                                    {arr.map(() => {
                                        return (
                                            <div className="home-list-info-field-monitor-content bg-green1">
                                                {monitorCenterList &&
                                                    monitorCenterList.map((items) => (
                                                        <div key={items.key} className="home-list-info-field-monitor-content-item">
                                                            {items.data.map((itemss) => (
                                                                <div
                                                                    style={{ width: `${100 / items.data.length}%` }}
                                                                    key={itemss.id}
                                                                    onClick={this.pushActionsSearch.bind(
                                                                        this,
                                                                        `/unicom/home-unicom/view/duty-window/view/unicom`,
                                                                        itemss.id,
                                                                        itemss.name,
                                                                    )}
                                                                    className="home-list-info-field-monitor-content-item-row"
                                                                    title={itemss.name}
                                                                >
                                                                    <div className="home-single-value">
                                                                        {/* <Tooltip title={itemss.name}> */}
                                                                        <span
                                                                            style={{
                                                                                display: 'block',
                                                                                width: '80%',
                                                                                textOverflow: 'ellipsis',
                                                                                overflow: 'hidden',
                                                                            }}
                                                                        >
                                                                            {itemss.name}
                                                                        </span>
                                                                        {/* </Tooltip> */}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                            </div>
                                        );
                                    })}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                    <div className="home-list-info-field-second ml36">
                        <div className="home-list-info-field-title">
                            <img src={require('./img/u455.png')} alt="" className="home-list-info-field-img" />
                            <span className="home-list-info-field-title-content">告警跟踪管理</span>
                        </div>
                        <div className="home-list-info-field-second-box">
                            <div className="home-list-info-field-second-content bg-green2 monitor-mange-hover">
                                <div className="home-list-info-field-icon bg-green5">
                                    <Icon type="iconjiaojieban1" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">交接班视图</div>
                                <div className="home-list-info-field-moitor-manange">
                                    <div
                                        className="home-list-info-field-moitor-content condition-action-1"
                                        onClick={this.pushActions.bind(this, '/unicom/home-unicom/monitor-manage/1')}
                                    >
                                        监控人员视图
                                    </div>
                                    <div
                                        className="home-list-info-field-moitor-content condition-action-2"
                                        onClick={this.pushActions.bind(this, '/unicom/home-unicom/monitor-manage/2')}
                                    >
                                        值班长视图
                                    </div>
                                </div>
                            </div>
                            <div
                                className="home-list-info-field-second-content bg-red1 ml12"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/send-sms')}
                            >
                                <div className="home-list-info-field-icon bg-red2">
                                    <Icon type="iconxinxiduanxinxiaoxitixingyoujiansixinyouxiang" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">短信/彩信</div>
                            </div>
                            <div
                                className="home-list-info-field-second-content bg-red1 mt20"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/maintenance-quick-query')}
                            >
                                <div className="home-list-info-field-icon bg-red2">
                                    <Icon type="iconrichenganpai" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">故障调度表</div>
                            </div>
                            <div
                                className="home-list-info-field-second-content bg-green2 ml12 mt20"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/monitor-date-list-search')}
                            >
                                <div className="home-list-info-field-icon bg-green5">
                                    <Icon type="iconpaibanbiao" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">监控值班表</div>
                            </div>
                        </div>
                    </div>
                    <div className="home-list-info-field-second ml36">
                        <div className="home-list-info-field-title">
                            <img src={require('./img/u455.png')} alt="" className="home-list-info-field-img" />
                            <span className="home-list-info-field-title-content">告警统计分析</span>
                        </div>
                        <div className="home-list-info-field-second-box">
                            <div
                                className="home-list-info-field-second-content bg-blue1"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/failure-sheet')}
                            >
                                <div className="home-list-info-field-icon bg-purple">
                                    <Icon type="icongongdanchaxun" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">工单查询</div>
                            </div>
                            <div
                                className="home-list-info-field-second-content bg-red1 ml12"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/failure-sheet-long')}
                            >
                                <div className="home-list-info-field-icon bg-purple">
                                    <Icon type="icongongdanchaxun" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">超长工单查询</div>
                            </div>
                            <div
                                className="home-list-info-field-second-content bg-green1 mt20"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/search/alarm-query')}
                            >
                                <div className="home-list-info-field-icon bg-yellow">
                                    <Icon type="icongaojingchaxun" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">告警查询</div>
                            </div>
                            <div
                                className="home-list-info-field-second-content bg-green2 ml12 mt20"
                                onClick={this.pushActions.bind(this, '/unicom/home-unicom/alarm-window-long')}
                            >
                                <div className="home-list-info-field-icon  bg-green5">
                                    <Icon type="icongaojingchaxun" />
                                </div>
                                <div className="home-list-info-field-icon-title mt20">超长告警查询</div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="home-list-info-field-first ml36" style={{ width: '12vw' }}>
                        <div className="home-list-info-field-title">
                            <img src={require('./img/u455.png')} alt="" className="home-list-info-field-img" />
                            <span className="home-list-info-field-title-content">告警统计分析</span>
                        </div>
                        <div
                            className="home-list-info-field-first-content bg-blue1"
                            onClick={this.pushActions.bind(this, '/unicom/failure-sheet')}
                        >
                            <div className="home-list-info-field-icon bg-purple">
                                <Icon type="icongongdanchaxun"></Icon>
                            </div>
                            <div className="home-list-info-field-icon-title mt20">工单查询</div>
                        </div>
                        <div
                            className="home-list-info-field-first-content mt20 bg-green1"
                            onClick={this.pushActions.bind(this, '/unicom/search/alarm-query')}
                        >
                            <div className="home-list-info-field-icon bg-yellow">
                                <Icon type="icongaojingchaxun"></Icon>
                            </div>
                            <div className="home-list-info-field-icon-title mt20">告警查询</div>
                        </div>
                    </div> */}
                    <div className="home-list-info-field-three ml36 bg-blue2">
                        <div className="home-list-info-field-title">
                            <Icon type="icongonggao" />
                            <span className="home-list-info-field-title-content">公告</span>
                        </div>
                        <div className="home-list-info-field-three-content">
                            <div
                                className="monitor-manage-table-right-tabs-timeline"
                                id="motiorTimeLine"
                                onMouseEnter={() => {
                                    this.onScrollDivOver();
                                }}
                                onMouseLeave={() => {
                                    this.onScrollDivOut();
                                }}
                            >
                                <Timeline mode="left">
                                    {announcement &&
                                        announcement.map((item) => {
                                            return (
                                                <Timeline.Item className="timeline" style={{ width: '100%' }} key={item.key}>
                                                    <div className="moitor-manage-table-right-tabs-timeline-time" style={{ width: '100%' }}>
                                                        {item.time}
                                                    </div>
                                                    <div style={{ width: '100%' }}>
                                                        <b>{item.isGroup === 'true' ? `【集团】${item.title}` : item.title}</b>
                                                    </div>
                                                    <div style={{ width: '90%' }}>{item.field}</div>
                                                    <div style={{ width: '90%' }}>{this.renderFileList(item)}</div>
                                                </Timeline.Item>
                                            );
                                        })}
                                </Timeline>
                                <div style={{ height: '200px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Home);
