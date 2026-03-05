import React from 'react';
import { Icon } from 'oss-ui';
import downloadAccessory from './download';
import './index.less';

interface Props {
    fileList?: {
        originalFileName: string;
    }[];
}

const FileDown: React.FC<Props> = (props) => {
    const { fileList } = props;
    if (!fileList || !fileList.length) {
        return null;
    }
    return (
        <div className="fault-report-file-down">
            {fileList?.map((item, index) => {
                return (
                    <div key={index} onClick={() => downloadAccessory(item)}>
                        <Icon antdIcon type="PaperClipOutlined" style={{ color: 'rgb(86, 199, 252)' }} />
                        {item.originalFileName}
                    </div>
                );
            })}
        </div>
    );
};

export default FileDown;
