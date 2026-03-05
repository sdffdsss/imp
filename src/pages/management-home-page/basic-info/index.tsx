import React, { useRef, useEffect, useState } from 'react';
import useLoginInfoModel from '@Src/hox';
import { getUserInfo, getUserCount } from '../api';
import GlobalMessage from '@Src/common/global-message';
import UserLogo from './userLogo.svg';
import './style.less';
const BasicInfo = () => {
    const [timeInfo, setTimeInfo] = useState();
    const [count, setCount] = useState(0);
    const [onlineTime, setOnlineTime] = useState();
    const basicInfoRef: any = useRef();
    const login = useLoginInfoModel();
    const getUserInfoData = async () => {
        const { userId } = login;
        const data = await getUserInfo(userId);
        const counts = await getUserCount();
        if (data) {
            setTimeInfo(data.loginTime);
            setOnlineTime(data.onlineTime);
        }
        if (counts.data) {
            setCount(counts.data.count);
        }
    };
    useEffect(() => {
        let timer: any = null;
        clearTimeout(timer);
        timer = setTimeout(() => {
            getUserInfoData();
        }, 1000 * 60);
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlineTime]);
    useEffect(() => {
        getUserInfoData();
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on(
            'activeChanged',
            ({ isActive }) => {
                if (isActive) {
                    getUserInfoData();
                }
            },
            null,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // const [avatarValue, setAvatarValue] = useState(64);
    return (
        <div ref={basicInfoRef} className="basic-info-workbench">
            <div className="basic-info-workbench-info">
                <div className="basic-info-workbench-info-image">
                    <img height={'100%'} width={'100%'} src={UserLogo} alt="userLogo" />
                </div>
                {/* <Avatar size={avatarValue} icon={} /> */}
                <div className="basic-info-workbench-info-name">
                    <div className="basic-info-workbench-info-name-title">
                        您好,<span>{login.userName}</span>{' '}
                    </div>
                    <div className="basic-info-workbench-info-name-time">
                        在线时长 <span style={{ marginLeft: '10px' }}>{onlineTime}</span>
                    </div>
                </div>
            </div>
            <div className="basic-info-workbench-time">
                登录时间：<span>{timeInfo}</span> 在线用户：<span>{count}</span>
            </div>
        </div>
    );
};
export default BasicInfo;
