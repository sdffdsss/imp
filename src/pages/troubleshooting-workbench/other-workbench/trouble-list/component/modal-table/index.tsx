import React, { useRef } from 'react';
import TableItems from './TableItems';

import { FaultDetailListDataType } from '../../types';

import './index.less';

interface Iprops {
    onHandleSelect: (id: string) => void;
    currentItem: string;
    faultDetailListData: FaultDetailListDataType[];
    addCurrentPage: () => void;
}

const ModalTable: React.FC<Iprops> = (props) => {
    const { onHandleSelect, currentItem, faultDetailListData, addCurrentPage } = props;
    const timer = useRef<any>();
    const boxRef = useRef<HTMLDivElement>(null);
    const onScroll = (e: any) => {
        if (!boxRef.current) return;
        // ? 差值 = dom的高度 - ( 滚动高度 + 可视区域高度+20误差 )
        const heightDiff = boxRef.current.scrollHeight - (e.target.scrollTop + boxRef.current.clientHeight + 20);
        if (timer.current) {
            clearTimeout(timer.current);
        }
        if (heightDiff <= 0) {
            timer.current = setTimeout(() => {
                addCurrentPage();
            }, 500);
        }
    };
    return (
        <div className="table-container">
            <div className="table-title-box">
                <div className="table-title-name1">故障主题</div>
                <div className="table-title-name2">专业</div>
                <div className="table-title-name3">故障类别</div>
                <div className="table-title-name4">最新上报类型</div>
                <div className="table-title-name5">上报时间</div>
            </div>
            <div className="table-body-box" onScroll={onScroll} ref={boxRef}>
                {faultDetailListData.map((el) => {
                    const { faultCategory, faultTopic, profession, reportNewClass, reportTime, id } = el;
                    return (
                        <TableItems
                            id={id}
                            faultCategory={faultCategory}
                            faultTopic={faultTopic}
                            profession={profession}
                            reportNewClass={reportNewClass}
                            reportTime={reportTime}
                            onSelect={onHandleSelect}
                            currentItem={currentItem}
                        />
                    );
                })}
            </div>
        </div>
    );
};
export default ModalTable;
