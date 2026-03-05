import React from 'react';
import FileDown from '../file-down';
import './index.less';

interface Props {
    reportType: string;
    reportUserName: string;
    createTime: string;
    contentTxt: string;
    contentFiles: any[];
}

const FaultInfoItem: React.FC<Props> = (props) => {
    const { reportType, reportUserName, createTime, contentTxt, contentFiles } = props;

    return (
        <div className="fault-info-item">
            <div className="fault-info-item-context">
                <div className="fault-info-item-context-box">
                    <div className="fault-info-item-context-box-type">
                        <span className="fault-report-detail-tag-box">{reportType}</span>
                    </div>
                    <div className="fault-info-item-context-box-name" title={reportUserName}>
                        {reportUserName}
                    </div>
                    <div className="fault-info-item-context-box-time">{createTime}</div>
                </div>
            </div>
            {contentTxt && <div className="fault-info-item-context-box-remark">{contentTxt}</div>}
            <FileDown fileList={contentFiles} />
        </div>
    );
};

export default FaultInfoItem;
