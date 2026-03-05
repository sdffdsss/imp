import React from 'react';
import './index.less';

interface LegendList {
    label: string;
    legendImgUrl: string;
}
interface Iprops {
    legendList: Array<LegendList>;
    top?: number | string;
    left?: number | string;
    right?: number | string;
}

const LegendCard: React.FC<Iprops> = (props) => {
    const { legendList, left, top, right } = props;
    return (
        <div className="legend-card-container" style={{ top, left, right }}>
            <div className="legend-card-title">图例</div>
            <div className="legend-card-list">
                {legendList.map((el, index) => (
                    <div className="legend-card-content" key={index}>
                        <span>{el.label}</span>
                        <img src={el.legendImgUrl} alt="" />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default LegendCard;
