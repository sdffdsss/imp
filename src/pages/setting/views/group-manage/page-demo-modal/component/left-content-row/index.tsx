import React from 'react';
import './index.less';

interface IProps {
    data: string[];
    title: string;
}
const LeftContentRow: React.FC<IProps> = (props) => {
    const { data, title } = props;
    return (
        <div className="left-content-row">
            <div className="left-content-row-label">
                <span title={title} className="title-tooltip-style">
                    {title}
                </span>
            </div>
            <div className="left-content-row-tabList">
                {data.map((item, index) => {
                    const dataKey = item + index;
                    return (
                        <div className="tab-name" key={dataKey} title={item}>
                            {item}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default LeftContentRow;
