import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Icon from './img/updateIcon.png';
import './index.less';

interface IProps {
    onClick: () => void;
    autoUpdateTime: number;
}

const UpdateTime: React.FC<IProps> = (props) => {
    const { onClick, autoUpdateTime } = props;

    const [updateTime, setUpdateTime] = useState<string>(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    const updateClick = () => {
        onClick();
        setUpdateTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    };
    useEffect(() => {
        // 定时更新时间
        const timer = setInterval(() => {
            updateClick();
        }, autoUpdateTime);
        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="header-update">
            <img src={Icon} alt="更新" width={18} className="update-icon-btn" onClick={updateClick} />
            <div className="update-time">更新时间：{updateTime}</div>
        </div>
    );
};

export default UpdateTime;
