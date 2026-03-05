import React, { FC, CSSProperties } from 'react';
import './index.less';
import { clearConfirmDataType } from '../../type';

interface Iprops {
    taskTitle?: string;
    failureStyle?: CSSProperties | undefined;
    unitStyle?: CSSProperties | undefined;
    taskDetailData: clearConfirmDataType[];
    singleDetailTitle: string[];
    onAlarmStutasChange: (type) => void;
    taskType: string[];
}

const TaskDetail: FC<Iprops> = (props) => {
    const { taskTitle, failureStyle, taskDetailData, singleDetailTitle, onAlarmStutasChange, taskType } = props;
    const { allTask, noSendTask, failSendTask } = taskDetailData[0] || [];
    // console.log(taskDetailData);

    return (
        <div className="task-detail-containerwb">
            <div className="task-detail-header">
                <div className="header-top">
                    <span onClick={() => onAlarmStutasChange(taskType[0])}>{allTask || 0}</span>
                    <span>个</span>
                </div>
                <div className="header-bottom">{taskTitle}</div>
            </div>
            <div className="task-detail-content">
                <div className="content-top">
                    <div />
                    <div />
                </div>
                <div className="content-bottom"></div>
            </div>
            <div className="task-detail-footer">
                <div className="footer-left">
                    <div className="footer-top">
                        <span onClick={() => onAlarmStutasChange(taskType[1])}>{noSendTask || 0}</span>
                        <span>个</span>
                    </div>
                    <div className="footer-bottom">{singleDetailTitle[0]}</div>
                </div>
                <div className="footer-right" style={failSendTask ? failureStyle : undefined}>
                    <div className="footer-top">
                        <span onClick={() => onAlarmStutasChange(taskType[2])}>{failSendTask || 0}</span>
                        <span>个</span>
                    </div>
                    <div className="footer-bottom">{singleDetailTitle[1]}</div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
