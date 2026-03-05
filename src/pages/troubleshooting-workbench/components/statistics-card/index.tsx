import React from 'react';
import './index.less';

interface Iprops {
    title: string;
    cityNumber: number;
    provinceNumber: number;
    x: number;
    y: number;
}

const StatisticsCard: React.FC<Iprops> = (props) => {
    const { title, cityNumber, provinceNumber, x, y } = props;
    return (
        <div className="statistics-card-container" style={{ top: y, left: x }}>
            <div className="statistics-card-title">{title}</div>
            <div className="statistics-card-content">涉及地市：{cityNumber}个</div>
            <div className="statistics-card-content">涉及省份：{provinceNumber}个</div>
        </div>
    );
};
export default StatisticsCard;
