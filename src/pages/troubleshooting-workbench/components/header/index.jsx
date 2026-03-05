import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import useLoginInfoModel from '@Src/hox';
import { Image, message, Badge } from 'oss-ui';
import constants from '@Src/common/constants';
import Notice from '@Pages/work-bench/group-notice';
import { logNew } from '@Common/api/service/log';
import { sendLogFn } from '@Pages/components/auth/utils';
import { useHistory } from 'react-router-dom';
import actionss from '@Src/share/actions';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import Avatar from '@Pages/components/avatar-edit';
import { openRoute } from '@Src/hooks';
import NoticeSetting from './notice-setting';
import {
    getUserInfo,
    queryReportSettingTree,
    findGroupByUser,
    judgeOnDuty,
    getTodoCountApi,
    checkUserNameInCeneterApi,
    getManualReportDerivedRuleConfig,
    getOnDutyUserByProvinceId,
} from '../../api';
import SignalSetting from './signal-setting';
import MessageSvgDarkBlue2 from '../../svgs/group-darkblue.png';
import MessageSvgDarkBlue3 from '../../svgs/time-darkblue.png';
import TimeRender from './show-time';
import FaultReportModal from './fault-report-modal';

import './index.less';

const btns = [
    {
        name: '我的任务',
        path: '/unicom/home/troubleshooting-workbench/major-fault-report',
        key: '7',
        openId: '300016',
    },
    {
        name: '故障上报(新)',
        key: '8',
        path: '/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?isNew=true',
        src: '/images/fault-report.png',
        authKey: 'troubleshootingWorkbench:faultReportAdd',
        // openId: '300015',
    },
    {
        name: '故障上报',
        key: '1',
        path: '/unicom/home/troubleshooting-workbench/fault-report/fault-report-add',
        src: '/images/fault-report.png',
        authKey: 'troubleshootingWorkbench:faultReportAdd',
        // openId: '300015',
    },
    {
        name: '故障上报查询',
        path: '/unicom/home/troubleshooting-workbench/fault-report',
        key: '5',
        openId: '300016',
    },
    {
        name: '通报设置',
        path: '/unicom/home/troubleshooting-workbench/fault-report/fault-report-add',
        authKey: 'troubleshootingWorkbench:dispatch',
        key: '2',
    },
    {
        name: '交接班',
        key: '3',
        path: '/unicom/management-home-page/change-shifts-page',
        src: '/images/交接班 6.png',
        openId: '300034',
    },
    {
        name: '提醒设置',
        path: '/unicom/home/troubleshooting-workbench/fault-report/fault-report-add',
        authKey: 'troubleshootingWorkbench:light',
        key: '4',
    },
    {
        name: '上报规则管理',
        path: '/unicom/home-unicom/troubleshooting-workbench/fault-report/rule-manage',
        authKey: 'troubleshootingWorkbench:ruleManage',
        openId: '300016',
        key: '6',
    },
];
const Index = (props, ref) => {
    const login = useLoginInfoModel();
    const [dePart, setDepart] = useState('');
    const [onDuty, setOnDuty] = useState(false);
    // 通报设置弹窗
    const [noticeSettingVisible, setNoticeSettingVisible] = useState(false);
    // 声光设置弹窗
    const [signalSettingVisible, setSignalSettingVisible] = useState(false);
    // 故障上报弹窗
    const [faultReportVisible, setFaultReportVisible] = useState(false);
    // 我的待办数量
    const [todoCount, setTodoCount] = useState(0);

    const [faultReportDataSource, setFaultReportDataSource] = useState(null);
    const [isView, setIsView] = useState(false);

    const [reportSettingTree, setReportSettingTree] = useState([]);
    const [currentGroup, handleCurrentGroup] = useState([]);
    const [startTime, setStarTime] = useState(null);
    const [ruleConfig, setRuleConfig] = useState(null);
    const [faultParam, setFaultParam] = useState(null);
    const [onDutyUser, setOnDutyUser] = useState(false);
    const history = useHistory();
    const { userInfo } = useLoginInfoModel();
    const { getSetting, workbenchType = 'group', timeType, noAuth } = props;

    const getUserInfos = async () => {
        const res = await getUserInfo(login.userId);
        if (res.data) {
            setDepart(res.data.deptAndTitle);
        }
    };
    const findGroupByUsers = async () => {
        const res = await findGroupByUser({ operateUser: login.userId, provinceId: getInitialProvince(login) });
        if (res && res.rows && Array.isArray(res.rows)) {
            handleCurrentGroup(res.rows);
            setStarTime(res.rows[0]?.scheduleBeginTime);
        }
    };
    const getReportSettingTree = async () => {
        const res = await queryReportSettingTree(login.userId);
        if (res.data) {
            setReportSettingTree(res.data);
        }
    };
    const getRuleConfig = async () => {
        const res = await getManualReportDerivedRuleConfig({ provinceId: getInitialProvince(login) });
        if (res && res.data) {
            setRuleConfig(res.data);
        }
    };

    const getOnDutyUser = async () => {
        const res = await getOnDutyUserByProvinceId({ provinceId: getInitialProvince(login) });
        if (res.rows?.length > 0) {
            const user = res.rows.find((item) => String(item.userId) === String(login.userId));
            if (user) {
                setOnDutyUser(true);
            }
        }
    };
    const pushActions = (url, label, openId, name) => {
        console.log('click item', 'openId', openId);
        const { operations = [] } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));

        if (!fieldFlag || !url) {
            message.warn(`您没有${label}权限，请联系管理员在角色管理中授权`);
            return;
        }

        logNew(`调度工作台${name}`, openId);
        const { actions, messageTypes } = actionss;
        console.log('url', url, openId, actions);

        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: `${url}`,
                search: {
                    operId: openId,
                },
            });
            // openRoute(url.slice(7), { operId: openId });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url}`);
        }
    };

    const checkUserNameInCeneterData = async () => {
        const params = { operateUser: login.userId, provinceId: login.provinceId };
        const result = await checkUserNameInCeneterApi(params);
        if (result.code === 200) {
            return true;
        }
        return false;
    };

    const onClick = async (item) => {
        const { key, path, name, openId } = item;
        const { operationsButton = [], zones } = JSON.parse(userInfo);
        const fieldFlag = operationsButton.find((items) => items.key === item.authKey);
        setFaultParam(null);
        switch (key) {
            case '1':
                sendLogFn({ authKey: item.authKey });
                if (noAuth) {
                    message.warn('暂无权限');
                    return;
                }
                if (zones[0].zoneId !== '0' && !(await checkUserNameInCeneterData())) {
                    message.warn('您不在监控中心的指定角色中，暂无上报权限');
                    return;
                }
                if (!fieldFlag) {
                    message.warn(`您没有${name}权限，请联系管理员在角色管理中授权`);
                    return;
                }
                setFaultReportVisible(true);
                break;
            case '2':
                sendLogFn({ authKey: item.authKey });
                if (!fieldFlag) {
                    message.warn(`您没有${name}权限，请联系管理员在角色管理中授权`);
                } else {
                    setNoticeSettingVisible(true);
                    getReportSettingTree();
                }
                break;
            case '3':
                pushActions(path, name, openId, name);
                break;
            case '4':
                sendLogFn({ authKey: item.authKey });
                if (!fieldFlag) {
                    message.warn(`您没有提醒设置权限，请联系管理员在角色管理中授权`);
                } else {
                    setSignalSettingVisible(true);
                }
                break;
            case '5':
                pushActions(path, name, openId, name);
                break;
            case '6':
                pushActions(path, name, openId, name);
                break;
            case '7':
                pushActions(path, name, openId, name);
                break;
            case '8':
                sendLogFn({ authKey: item.authKey });
                if (!onDutyUser) {
                    message.warn('非当班监控人员，无上报权限！');
                    return;
                }
                setFaultParam({
                    isMajor: true,
                    isFaultReportNew: true,
                    btnKey: 'majorFaultReport:firstReportApplication',
                    title: ruleConfig?.whetherFirstAutoReport ? '首报申请' : '手动上报',
                });
                setFaultReportVisible(true);
                break;
            default:
                break;
        }
    };

    const onFaultReportCancel = () => {
        setIsView(false);
        setFaultReportDataSource(null);
        setFaultReportVisible(false);
    };

    const goToListPage = () => {
        sendLogFn({ authKey: 'faultSchedule:faultQuery' });
        onFaultReportCancel();
        const faultListBtn = btns.find((item) => item.key === '5');
        const { path, name, openId } = faultListBtn;
        pushActions(path, name, openId, name);
    };

    const judgeIfOnDuty = async () => {
        const res = await judgeOnDuty({ userId: login.userId });
        if (res.rows?.length > 0) {
            setOnDuty(true);
            findGroupByUsers();
        } else {
            setOnDuty(false);
            getUserInfos();
        }
    };
    const getTodoCount = async () => {
        const res = await getTodoCountApi();
        if (res.code === 200) {
            setTodoCount(res.data.tobeReadCount + res.data.todoCount);
        }
    };
    useEffect(() => {
        // getUserInfos();
        // getReportSettingTree();
        // findGroupByUsers();
        judgeIfOnDuty();
        getTodoCount();
        getRuleConfig();
        getOnDutyUser();
        const timer = setInterval(() => {
            getTodoCount();
        }, 60000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    useImperativeHandle(
        ref,
        () => {
            return {
                onShowFaultReport: (item, viewFlag) => {
                    setFaultReportDataSource(item);
                    setIsView(!!viewFlag);
                    setFaultReportVisible(true);
                },
                // onShowFaultReport: setFaultReportVisible(true),
            };
        },
        [],
    );

    return (
        <div className="dispatch-workbench-common-header">
            <div className="dispatch-workbench-common-header-left background">
                <Avatar size={88} />
                {onDuty ? (
                    <div className="user-info">
                        <div>您好，{login.userName}！</div>
                        <div className="on-duty">
                            <img src={MessageSvgDarkBlue3} height={13} width={13} alt="" />
                            <span className="on-duty-des">当班时长</span>
                            <TimeRender startTime={startTime} />
                        </div>
                        <div className="on-duty">
                            <img src={MessageSvgDarkBlue2} height={13} width={13} alt="" />
                            <span className="on-duty-des">值班班组</span>
                            <span className="on-duty-content">{currentGroup && currentGroup[0] && currentGroup[0]?.groupName}</span>
                        </div>
                    </div>
                ) : (
                    <div className="user-info">
                        <div>您好，{login.userName}，</div>
                        <div>祝您开心每一天！</div>
                        <div className="user-depart">
                            <span>{dePart}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="dispatch-workbench-common-header-center background">
                {btns
                    .filter((item) => item.key !== (workbenchType === 'province' ? '2' : '3'))
                    .map((item) => {
                        return (
                            <div className="btns-item" onClick={() => onClick(item)}>
                                {item.key === '7' && (
                                    <Badge count={todoCount || 0} overflowCount={99} style={{ marginLeft: '-10px' }}>
                                        <Image preview={false} width="64px" src={`${constants.IMAGE_PATH}/group-workbench/tool${item.key}.png`} />
                                    </Badge>
                                )}
                                {item.key !== '7' && (
                                    <Image preview={false} width="64px" src={`${constants.IMAGE_PATH}/group-workbench/tool${item.key}.png`} />
                                )}
                                <div className="btns-item-title">{item.name}</div>
                            </div>
                        );
                    })}
            </div>
            <div className="dispatch-workbench-common-header-right background">
                <Notice />
            </div>
            {noticeSettingVisible && (
                <NoticeSetting
                    visible={noticeSettingVisible}
                    reportSettingTree={reportSettingTree}
                    cardsDockedLeft={props.cardsDockedLeft}
                    onCancel={() => {
                        setNoticeSettingVisible(false);
                    }}
                />
            )}
            {signalSettingVisible && (
                <SignalSetting
                    timeType={timeType}
                    cardsDockedLeft={props.cardsDockedLeft}
                    getSetting={getSetting}
                    visible={signalSettingVisible}
                    setVisible={setSignalSettingVisible}
                />
            )}

            {faultReportVisible && (
                <FaultReportModal
                    visible={faultReportVisible}
                    onCancel={onFaultReportCancel}
                    dataSource={faultReportDataSource}
                    isView={isView}
                    goToListPage={goToListPage}
                    setFaultReportDataSource={setFaultReportDataSource}
                    setIsView={setIsView}
                    updateCardList={props.updateCardList}
                    cardsDockedLeft={props.cardsDockedLeft}
                    isManual
                    {...faultParam}
                />
            )}
        </div>
    );
};
export default forwardRef(Index);
