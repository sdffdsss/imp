import React from 'react';

interface IProps {
    dotColor: string;
    name: string;
    num: number;
}
const ProfessionListItem: React.FC<IProps> = (props) => {
    const { dotColor, name, num } = props;
    return (
        <div className="profession-list-item">
            <div className="profession-list-item-tag">
                <div className="item-dot" style={{ backgroundColor: dotColor }} />
                <div className="item-name" title={name}>
                    {name}
                </div>
            </div>
            <div className="item-num">{num}个班组</div>
        </div>
    );
};
export default ProfessionListItem;
