import React, { useEffect, useState, useRef, useContext } from 'react';
import { Carousel, Button, Spin, Row, Col } from 'oss-ui';
import './style.less';
import useLoginInfoModel from '@Src/hox';
import { useUpdateEffect } from 'ahooks';
import { getView } from './api';
import { useHistory } from 'react-router-dom';
import actionss from '@Src/share/actions';
import constants from '@Common/constants';
import { logNew } from '@Common/api/service/log';
import { GroupContext } from '@Pages/work-bench/context';
import { ReactComponent as WindowSvg1 } from '../img/u600.svg';
import { ReactComponent as WindowSvg2 } from '../img/u3255.svg';
// import { _ } from 'oss-web-toolkits';
// let pagetion = {
//     current: 1,
//     pageSize: 16,
//     total: 0,
// };
const MonitorTitle = () => {
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const carouselRef: any = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const groupInfo = useContext(GroupContext);
    const login = useLoginInfoModel();
    const history = useHistory();
    const pagetion: any = useRef({
        current: 1,
        pageSize: 9,
        total: 0,
    });
    const [viewList, setViewList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    // 获取故障类型列表
    const getViewList = async () => {
        const zoneId = login.systemInfo?.currentZone?.zoneId;
        const userInFo = JSON.parse(login.userInfo);
        const userId = login.userId;

        const groupId = groupInfo?.groupId;
        const groupProfessional = groupInfo?.professionalType?.split(',').map(Number);

        const zoneInfo = userInFo?.zones;
        const userProvinceId =
            zoneInfo && zoneInfo[0]?.zoneLevel && (parseInt(zoneInfo[0].zoneLevel, 10) === 1 ? zoneInfo[0]?.zoneId : zoneInfo[0].zoneLevel_2Id);

        const param = zoneId
            ? { zoneId: zoneId, userId, groupId, groupProfessional }
            : { zoneId: userProvinceId, userId, groupId, groupProfessional };
        const queryDate = {
            pageSize: pagetion.current.pageSize,
            current: pagetion.current.current,
            ...param,
        };
        setLoading(true);
        const res = await getView(queryDate);
        if (res.data && res.data.length > 0) {
            const sortList = res.data.map((item: { groupName: any; groupId: any }) => {
                return {
                    name: item.groupName,
                    id: item.groupId,
                };
            });
            // list = this.getTreeData(sortList);
            pagetion.current.total = res.total;
            setViewList(sortList);
        }
        setLoading(false);
    };
    const handleBeforeChange = (from, to) => {
        if (to !== currentSlide) {
            // 确保不是同一页面
            setCurrentSlide(to);
            pagetion.current.current = to + 1;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            getViewList(); // 更新当前页码
        }
    };
    useUpdateEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        getViewList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupInfo]);
    const pushActions = async (item: { id: any; name: any }) => {
        logNew('监控工作台监控中心视图', '300020');
        // const res = await getViewData(item.id);
        const url = `/unicom/home-unicom/view/duty-window/view/unicom`;
        const { actions, messageTypes } = actionss;
        if (actions && actions.postMessage) {
            // if (!_isEmpty(res.data)) {
            //     res.data.forEach((items) => {
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
                uuid: `/znjk/${constants.CUR_ENVIRONMENT}/main${url}/${item.id}`,
                search: {
                    centerWindowId: item.id,
                    centerWindowName: item.name,
                },
            });
            // });
            // } else {
            //     message.warning('未关联自定义视图');
            // }
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url.slice(7)}`);
        }
    };
    const renderItem = (current: number) => {
        if (current !== pagetion.current.current) {
            return;
        }
        return viewList.map((item) => {
            return (
                <Col span={8} className="monitor-item" key={item.id}>
                    <Button
                        className="monitor-item-name"
                        type="text"
                        onClick={() => {
                            pushActions(item);
                        }}
                    >
                        {getStrLength(item.name, 12)?.res ? (
                            <div className="monitor-item-name-show">
                                <div>{getStrLength(item.name, 12)?.word1}</div>
                                <div>{getStrLength(item.name, 12)?.word2}</div>
                            </div>
                        ) : (
                            <div className="monitor-item-name-show">{item.name}</div>
                        )}
                    </Button>
                </Col>
            );
        });
    };

    const getStrLength = (str: string, n: number) => {
        var strReg = /[^x00-xff]/g;
        var _str = str.replace(strReg, '**');
        var _len = _str.length;
        if (_len > n) {
            var _newLen = Math.floor(n / 2);
            var _strLen = str.length;
            for (var i = _newLen; i < _strLen; i++) {
                var _newStr = str.substr(0, i).replace(strReg, '**');
                if (_newStr.length >= n) {
                    return { word1: str.substr(0, i), res: true, word2: str.substr(i) };
                }
            }
        } else {
            return { res: false };
        }
        return { res: false };
    };

    const toLeft = _.throttle(
        () => {
            pagetion.current.current -= 1;
            carouselRef.current.prev();
        },
        500,
        { leading: false, trailing: true },
    );

    const toRight = _.throttle(
        () => {
            pagetion.current.current += 1;
            carouselRef.current?.next();
        },
        500,
        { leading: false, trailing: true },
    );

    const renderCarouselItem = () => {
        if (!pagetion.current.total) {
            return;
        }
        const tabCount = Math.ceil(pagetion.current.total / pagetion.current.pageSize);
        const list: any = [];
        let count = 1;
        while (count <= tabCount) {
            list.push(
                <div className="monitor-title-page-list-item" key={count}>
                    <div className="monitor-title-page-list-item">
                        <Row style={{ height: '100%' }} gutter={20}>
                            {renderItem(count)}
                        </Row>
                    </div>
                </div>,
            );
            count++;
        }
        return list;
    };

    // const renderCarouselItem = () => {
    //     const tabCount = Math.round(pagetion.current.total / pagetion.current.pageSize);
    //     const list: any = [];
    //     for (let index = 0; index < tabCount + 1; index++) {
    //         list.push(index + 1);
    //     }
    //     return list.map((item) => {
    //         return (
    //             <div className="monitor-title-page-list-item" key={item}>
    //                 <div className="monitor-title-page-list-item">
    //                     <Row style={{ height: '100%', alignContent: 'flex-start' }} gutter={20}>
    //                         {renderItem(item)}
    //                     </Row>
    //                 </div>
    //             </div>
    //         );
    //     });
    // };

    return (
        <div
            className="monitor-title-page oss-imp-alart-common-bg"
            onMouseOverCapture={() => setIsMouseOver(true)}
            onMouseLeave={() => {
                setIsMouseOver(false);
            }}
        >
            {/* <div className="monitor-title-page-header">
                <span className="monitor-title-page-header-title">监控中心视图</span>
            </div> */}
            <div className="monitor-title-page-list">
                <Spin spinning={loading}>
                    {isMouseOver && pagetion.current.current !== 1 && (
                        <div className="left-btn" onClick={toLeft}>
                            <WindowSvg1 />
                            {/* {props.theme === 'light' ? <WindowSvg1 /> : <WindowSvg2 />} */}
                        </div>
                    )}
                    <Carousel ref={carouselRef} beforeChange={handleBeforeChange}>
                        {renderCarouselItem()}
                    </Carousel>
                    {isMouseOver && pagetion.current.total > pagetion.current.current * pagetion.current.pageSize && (
                        <div className="right-btn" onClick={toRight}>
                            <WindowSvg1 />
                            {/* {props.theme === 'light' ? <WindowSvg1 /> : <WindowSvg2 />} */}
                        </div>
                    )}
                </Spin>
            </div>
        </div>
    );
};
export default MonitorTitle;
