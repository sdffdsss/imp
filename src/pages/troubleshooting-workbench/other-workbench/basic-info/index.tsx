import React, { useEffect, useState } from 'react';
import useLoginInfoModel from '@Src/hox';
import TimeRender from '@Src/pages/components/workbench-common-top-info/components/show-time';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import Avatar from '@Pages/components/avatar-edit';
import { getUserInfo } from '../../api';
import { judgeOnDuty, findGroupByUser } from '../api';
import UserLogo from '../svgs/icon/user-logo.png';
import UserLogoDarkBlue from '../svgs/icon/user-log-darkBlue.png';
import TimeIcon from '../img/work/time.png';
import LoginIcon from '../img/work/login.png';
import './style.less';

const BasicInfo = (props) => {
    const { theme } = props;
    const [factoryInfo, setFactoryInfo] = useState();
    const [onDuty, setOnDuty] = useState(true);
    const [currentGroup, handleCurrentGroup] = useState([]);
    const [startTime, setStarTime] = useState(null);
    const login = useLoginInfoModel();
    const { userId } = login;

    const getUserInfoData = async () => {
        const data = await getUserInfo(userId);
        if (+data.code === 200) {
            setFactoryInfo(data.data.deptAndTitle);
        }
    };
    const judgeIfOnDuty = async () => {
        const res = await judgeOnDuty({ operateUser: login.userId });
        if (+res.code === 200) {
            setOnDuty(false);
        } else {
            setOnDuty(true);
        }
    };
    const findGroupByUsers = async () => {
        const res = await findGroupByUser({ operateUser: login.userId, provinceId: getInitialProvince(login) });
        if (res && res.rows && Array.isArray(res.rows)) {
            handleCurrentGroup(res.rows);
            setStarTime(res.rows[0]?.scheduleBeginTime);
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
    }, []);
    useEffect(() => {
        getUserInfoData();
        judgeIfOnDuty();
        findGroupByUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="basic-info-workbench-dispatch">
            <div className="my-center-portrait">
                <div className="logo-container">
                    <Avatar size={80} />
                </div>
                {/* <div className="header">
                    <span>{login.userName}</span>
                </div> */}
            </div>
            {currentGroup.length <= 0 ? (
                <div className="basic-info-right-mode1">
                    <p className="basic-info-right-mode1-p1">您好，{login.userName}，</p>
                    <p className="basic-info-right-mode1-p2">祝您开心每一天！</p>
                    <p className="basic-info-right-mode1-p3">{factoryInfo}</p>
                </div>
            ) : (
                <div className="basic-info-right-mode2">
                    <p className="basic-info-right-mode2-p1">你好，{login.userName}！</p>
                    <p className="basic-info-right-mode2-p2">
                        <img src={TimeIcon} alt="img not found" />
                        <span className="basic-info-right-mode2-p2-label">当班时长</span>
                        <span className="basic-info-right-mode2-p2-time">{!onDuty ? <TimeRender startTime={startTime} color="#1890ff" /> : 0}</span>
                    </p>
                    <p className="basic-info-right-mode2-p3">
                        <img src={LoginIcon} alt="img not found" />
                        <span className="basic-info-right-mode2-p3-label">值班班组</span>
                        <span className="basic-info-right-mode2-p3-name">{currentGroup && currentGroup[0] && currentGroup[0]?.groupName}</span>
                    </p>
                </div>
            )}
        </div>
    );
};
export default BasicInfo;
