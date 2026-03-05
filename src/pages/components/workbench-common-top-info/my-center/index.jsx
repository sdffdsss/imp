import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Select } from 'oss-ui';
import { useUpdateEffect } from 'ahooks';
import { urlSearchObjFormat } from '@Common/utils/urlSearchObjFormat';
import { getUserInfo, queryShiftingOfDutyNow, getShiftingOfDutyStatus, getWorkShiftRuleByGroupId, findGroupsByUser } from '../api';
// import TimeRender from '../components/show-time';
import MessageSvgDarkBlue2 from '../img/svgs/group-darkblue.png';
import MessageSvgDarkBlue3 from '../img/svgs/time-darkblue.png';
import Avatar from '../../avatar-edit';
import MessageSvgDarkBlue4 from '../img/svgs/center-darkblue.png';
import './index.less';

const showChangeShiftsState = ['1', '2', '1001', '1002'];

export default forwardRef(({ loginInfo, onGroupChange }, ref) => {
    const isMonitorViewPage = window.location.pathname.includes('monitor-view');
    const searchObj = urlSearchObjFormat(window.location.search);
    const [currentGroup, handleCurrentGroup] = useState([]);
    const [onDuty, setOnDuty] = useState(false);
    const [dePart, setDepart] = useState('');
    // const [startTime, setStarTime] = useState(null);
    const { userId, currentZone } = loginInfo;
    const [groupInfo, setGroupInfo] = useState(undefined);

    const getShiftingOfDutyStatusData = async () => {
        const data = {
            userId,
            regionId: currentZone?.zoneId,
        };
        const result = await getShiftingOfDutyStatus(data);

        return result;
    };

    const queryGroups = async () => {
        const res = await queryShiftingOfDutyNow({ userId });

        return res?.resultObj?.groupList || [];
    };

    const getWorkShiftRuleByGroupIdData = async (groupId) => {
        const res = await getWorkShiftRuleByGroupId({ groupId });

        return res?.resultObj;
    };

    const findGroupsByUserData = async () => {
        const data = {
            operateUser: userId,
            regionId: currentZone?.zoneId,
        };

        const res = await findGroupsByUser(data);

        return res?.rows;
    };

    const getUserInfos = async () => {
        const res = await getUserInfo(userId);
        if (res.data) {
            setDepart(res.data.deptAndTitle);
        }
    };

    useUpdateEffect(() => {
        if (groupInfo && !groupInfo.centerName) {
            getWorkShiftRuleByGroupIdData(groupInfo.groupId).then((data) => {
                setGroupInfo(data);
            });
        } else {
            onGroupChange?.(groupInfo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupInfo]);

    useImperativeHandle(ref, () => ({
        refreshGroupInfo: () => {
            getWorkShiftRuleByGroupIdData(groupInfo?.groupId).then((data) => {
                setGroupInfo(data);
            });
        },
    }));
    useEffect(() => {
        getShiftingOfDutyStatusData().then((res) => {
            if (res.resultCode === '0') {
                queryGroups().then((groups) => {
                    if (groups.length > 0) {
                        setOnDuty(true);

                        setGroupInfo(groups[0]);
                        handleCurrentGroup(groups);
                    } else {
                        // 没排班时，还是会有班组需要获取班组数据供右侧监控待办请求数据用
                        findGroupsByUserData().then((res1) => {
                            setOnDuty(false);
                            getUserInfos();
                            setGroupInfo(res1?.[0]);
                        });
                    }
                });
                return;
            }
            if (showChangeShiftsState.includes(res.resultCode)) {
                if (res.resultObj?.groupId) {
                    getWorkShiftRuleByGroupIdData(res.resultObj.groupId).then((data) => {
                        setGroupInfo(data);
                    });
                }
                queryGroups().then((groups) => {
                    handleCurrentGroup(groups);
                });
                setOnDuty(true);
            } else {
                setOnDuty(false);
                if (isMonitorViewPage && searchObj.groupId) {
                    getWorkShiftRuleByGroupIdData(searchObj.groupId).then((data) => {
                        setGroupInfo(data);
                        handleCurrentGroup([data]);
                    });
                } else {
                    getUserInfos();
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return (
        <div className="workbench-top-my-center-wrapper">
            <Avatar />
            {onDuty || (isMonitorViewPage && searchObj.groupId) ? (
                <div className="user-info">
                    <div className="user-name">您好，{loginInfo.userName}！</div>
                    <div className="on-duty">
                        <img src={MessageSvgDarkBlue3} height={13} width={13} alt="班次时间" />
                        <span className="on-duty-des bold">班次时间</span>
                        <span className="on-duty-content">
                            {groupInfo?.onDutyRule?.beginTime || ''}-{groupInfo?.onDutyRule?.endTime || ''}
                        </span>
                    </div>
                    <div className="on-duty">
                        <img src={MessageSvgDarkBlue2} height={13} width={13} alt="值班班组" />
                        <span className="on-duty-des bold">值班班组 </span>
                        {currentGroup?.length > 0 && (
                            <Select
                                size="small"
                                value={String(groupInfo?.groupId)}
                                options={currentGroup.map((item) => {
                                    return {
                                        label: item.groupName,
                                        value: String(item.groupId),
                                    };
                                })}
                                className="group-select"
                                onChange={(value) => {
                                    const selectedGroup = currentGroup.find((item) => String(item.groupId) === String(value));

                                    setGroupInfo(selectedGroup);
                                }}
                            />
                        )}
                    </div>
                    <div className="on-duty">
                        <img src={MessageSvgDarkBlue4} height={13} width={13} alt="值班班组" />
                        <span className="on-duty-des bold">监控中心 </span>
                        <span className="on-duty-content">{groupInfo?.centerName}</span>
                    </div>
                </div>
            ) : (
                <div className="user-info">
                    <div className="hello-msg">
                        <div className="bold">您好，{loginInfo.userName}，</div>
                        <div className="bold">祝您开心每一天！</div>
                    </div>
                    <div className="user-depart">
                        <span>{dePart}</span>
                    </div>
                </div>
            )}
        </div>
    );
});
