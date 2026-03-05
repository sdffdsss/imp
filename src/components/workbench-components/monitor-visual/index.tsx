import React, { useEffect, useState, useRef, useContext } from 'react';
import { Tabs, Spin, Image } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import './style.less';
import { getTeamGroups, getVisualMonitoringData, findGroupByUser } from './api';
// import { ReactComponent as WindowSvg1 } from '../img/u600.svg';
// import { ReactComponent as WindowSvg2 } from '../img/u3255.svg';
// import _isEmpty from 'lodash/isEmpty';
import TodoTask from '@Src/components/workbench-components/todo-task';
import { GroupContext } from '@Pages/work-bench/context';
const MonitorVisual = (props) => {
    // const { TabPane } = Tabs;
    const login = useLoginInfoModel();
    const groupInfo = useContext(GroupContext);

    // const [teamId, setTeamId] = useState(0);
    // const [tabList, setTabList] = useState<any[]>([]);
    const [alarmTodoData, setAlarmTodoData] = useState<any[]>([]);
    const [loadings, setLoading] = useState(false);
    // const [isShow, setIsShow] = useState(false);
    const timerRef = useRef<NodeJS.Timer>();
    const curInfo = login.userInfo && JSON.parse(login.userInfo);
    const { environment: env } = useEnvironmentModel.data;

    // const getInitialProvince = (province, userInfo) => {
    //     const info = userInfo && JSON.parse(userInfo);
    //     let initialProvince = info.zones[0]?.zoneId;
    //     if (province) {
    //         return (initialProvince = province);
    //     }
    //     if (info.zones[0]?.zoneLevel === '3') {
    //         initialProvince = info.zones[0]?.parentZoneId;
    //     }
    //     return initialProvince;
    // };
    // const getView = async () => {
    //     const { systemInfo, userId, userInfo } = login;
    //     let zoneId = systemInfo.currentZone?.zoneId;

    //     if (!zoneId) {
    //         const info = JSON.parse(userInfo) || {};
    //         zoneId = info.zones[0]?.zoneLevel === '3' ? info.zones[0]?.parentZoneId : info.zones[0]?.zoneId;
    //     }

    //     const groupData = await findGroupByUser({ operateUser: userId, provinceId: zoneId });
    //     if (!_isEmpty(groupData.rows)) {
    //         if (groupData.rows[0].scheduleBeginTime) {
    //             setTeamId(groupData.rows[0].groupId);
    //             setTabList([{ groupId: groupData.rows[0].groupId, groupName: groupData.rows[0].groupName }]);
    //         } else {
    //             setTeamId(groupData.rows[0].groupId);
    //             setTabList(
    //                 groupData.rows.map((item) => {
    //                     return { groupId: item.groupId, groupName: item.groupName };
    //                 }),
    //             );
    //         }
    //         return;
    //     }
    //     const provinceId = getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
    //     const param = {
    //         creator: login.userId,
    //         provinceId,
    //     };
    //     getTeamGroups(param).then((res) => {
    //         if (res && res.data) {
    //             setTeamId(res.data[0]?.groupId);
    //             setTabList(res.data);
    //         }
    //     });
    // };

    const getData = (flag) => {
        if (groupInfo?.groupId) {
            // const areaId = getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
            const areaId = login.systemInfo?.currentZone?.zoneId ? login.systemInfo?.currentZone?.zoneId : curInfo.zones[0]?.zoneId;
            let param = {
                teamId: groupInfo?.groupId,
                level: login.systemInfo?.currentZone?.zoneId
                    ? login.systemInfo?.currentZone?.zoneLevel === '5'
                        ? '1'
                        : login.systemInfo?.currentZone?.zoneLevel
                    : curInfo.zones[0]?.zoneLevel,
                userId: login.userId,
            };
            if (areaId !== '0') {
                param['areaId'] = areaId;
            }

            setLoading(flag);
            getVisualMonitoringData(param)
                .then((res) => {
                    if (res && res.data) {
                        const resData = res.data;
                        setAlarmTodoData(resData.alarmTodoData);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setAlarmTodoData([]);
                    setLoading(false);
                });
        }
    };
    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     interval = setInterval(function () {
    //         getData();
    //     }, 30000);
    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, []);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        getData(true);
        if (env.needPollUser?.includes(curInfo?.userId)) {
            timerRef.current = setInterval(() => {
                getData(false);
            }, 30000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupInfo?.groupId]);
    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     getView();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            getData(false);
        }, 30000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [login]);
    useEffect(() => {}, []);
    // const callback = (groupId) => {
    //     setTeamId(groupId);
    //     // setFiledSheet('totalCount');
    // };
    return (
        <div className="monitor-visual-page oss-imp-alart-common-bg workbench-monitor-visual">
            {/* <div className="monitor-visual-page-header">
                <span className="monitor-visual-page-header-title">故障处理待办</span>
                <Button className="monitor-visual-page-header-more" type="text">
                    {'more >'}
                </Button>
            </div> */}
            {/* <div
                className={`monitor-visual-page-change-btn ${isShow && 'show'}`}
                onClick={() => {
                    setIsShow(!isShow);
                }}
            >
                {props.theme === 'light' ? <WindowSvg1 /> : <WindowSvg2 />}
            </div>
            <div className={`monitor-visual-page-tabs  ${isShow && 'show'}`}>
                <Tabs defaultActiveKey="1" onChange={callback} tabPosition="right">
                    {tabList.map((group) => {
                        return <TabPane tab={<span title={group.groupName}>{group.groupName}</span>} key={group.groupId} />;
                    })}
                </Tabs>
            </div> */}
            <div className="monitor-visual-page-content">
                <Spin spinning={loadings}>
                    <TodoTask alarmTodoData={alarmTodoData} nodeType="1" onAlarmStutasChange={() => {}} />
                </Spin>
            </div>
        </div>
    );
};
export default MonitorVisual;
