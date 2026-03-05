import { Tooltip } from 'oss-ui';
import React from 'react';

interface Iprops {
    faultTopic?: string;
    profession?: string;
    faultCategory?: string;
    reportNewClass?: string;
    reportTime?: string;
    id: string;
    onSelect?: (id: string) => void;
    currentItem: string;
}
const TableItems: React.FC<Iprops> = (props) => {
    const { faultCategory, faultTopic, profession, reportNewClass, reportTime, id, onSelect, currentItem } = props;
    const onHandleClick = () => {
        onSelect?.(id);
    };
    // 一行18个字，字体大小为14
    const textLength = 14 * 18;
    const getTextWidth = (text: string) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = `14px 微软雅黑`;
            return context.measureText(text).width;
        }
        return 0;
    };
    return (
        <div className={`table-body-box-column ${currentItem === id ? 'table-column-select' : ''}`} key={id} onClick={onHandleClick}>
            {getTextWidth(faultTopic as string) > textLength ? (
                <Tooltip title={faultTopic}>
                    <div className="table-column-part1">{faultTopic}</div>
                </Tooltip>
            ) : (
                <div className="table-column-part1">{faultTopic}</div>
            )}

            <div className="table-column-part2">{profession}</div>
            <div className="table-column-part3">{faultCategory}</div>
            <div className="table-column-part4">{reportNewClass}</div>
            <div className="table-column-part5">{reportTime}</div>
        </div>
    );
};
export default TableItems;
