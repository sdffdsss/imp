import React, { useEffect, useState } from 'react';
import { message } from 'oss-ui';
import shareActions from '@Src/share/actions';
import { useHistory } from 'react-router-dom';
import useLoginInfoModel from '@Src/hox';
import dayjs from 'dayjs';
import Api from './api';
import noticeIcon from './img/notice.png';
import './index.less';

interface LapseUsersType {
    loginId: string;
    userId: string;
    userMobile: string;
    userName: string;
}
interface LeaveInfoType {
    flag: boolean;
    effectModule: string[];
    lapseUsers: LapseUsersType[];
    updateTime: string;
}
/**
 * @description 离职人员提示组件
 */
const SystemNotice = () => {
    const { parsedUserInfo, currentZone } = useLoginInfoModel();
    const history = useHistory();
    const [leaveInfo, setLeaveInfo] = useState<LeaveInfoType>({
        flag: false,
        effectModule: [],
        lapseUsers: [],
        updateTime: '',
    });
    const getLapseUser = async () => {
        const { userId, zones } = parsedUserInfo;
        const params = {
            userId,
            zoneId: currentZone?.zoneId ?? zones[0].zoneId,
        };
        const res = await Api.lapseUser(params);
        if (+res.code === 0) {
            setLeaveInfo({
                flag: res.data.flag,
                effectModule: res.data.effectModule ?? [],
                lapseUsers: res.data.lapseUsers ?? [],
                updateTime: res.data.updateTime ?? '',
            });
        }
    };
    const onCLose = () => {
        setLeaveInfo({ ...leaveInfo, flag: false });
    };
    const onJump = (modalName: string) => {
        const { operations } = parsedUserInfo;
        const { actions, messageTypes } = shareActions;
        const operationsName = operations.find((el) => el.operName === modalName);

        if (operationsName) {
            try {
                actions.postMessage(messageTypes.openRoute, {
                    entry: operationsName.path,
                });
            } catch (error) {
                /**
                 * @regex 匹配 /----/
                 */
                const regex = /\/(.*?)\//;
                const result = operationsName.path.replace(regex, '');
                history.push(`/${result}`);
            }
        } else {
            message.warn('暂无权限');
        }
    };
    useEffect(() => {
        getLapseUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={`system-notice ${leaveInfo.flag ? '' : 'none'}`}>
            <div className="triangle" />
            <div className="system-notice-content">
                <div className="notice-title">
                    <div className="notice-icon">
                        <img src={noticeIcon} alt="notice" />
                    </div>
                    <div className="notice-title-name">系统消息</div>
                </div>
                <div className="notice-content">
                    <div className="content-title">[重要通知] 失效人员名单确认及修改</div>
                    <div className="content-box">
                        <div className="notice-time">{dayjs(leaveInfo.updateTime).format('YYYY-MM-DD HH:mm')}</div>
                        <div className="notice-text">
                            以下人员名单已失效，请省分管理员尽快处理，在相关功能页面修改人员配置，否则会影响重要功能使用！
                        </div>
                        <div className="notice-people">失效人员名单:</div>
                        <div className="notice-name-list">
                            {leaveInfo.lapseUsers.map((el, index) => {
                                return (
                                    <span key={el.userId}>
                                        <span>
                                            {el.userName}({el.userMobile})
                                        </span>
                                        <span>{leaveInfo.lapseUsers.length !== index + 1 ? '，' : '。'}</span>
                                    </span>
                                );
                            })}
                        </div>
                        <div className="notice-model">影响的功能模块：</div>
                        <div className="notice-model-list">
                            {leaveInfo.effectModule.map((el, index) => {
                                return (
                                    <span key={el}>
                                        <a onClick={() => onJump(el)}>{el}</a>
                                        <span>{leaveInfo.effectModule.length !== index + 1 ? '，' : '。'}</span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="notice-bottom" onClick={onCLose}>
                    <span>关闭</span>
                </div>
            </div>
        </div>
    );
};

export default SystemNotice;
