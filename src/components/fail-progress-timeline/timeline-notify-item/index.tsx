import React, { useState } from 'react';
import { NoticeListItemType, NoticeDetailType } from '../type';
import NotifierDetailsModal from '../NotifierDetailsModal';
import './index.less';
import classNames from 'classnames';

interface Props {
    dataSource: NoticeListItemType;
    onNoticeChange?: (item: NoticeListItemType) => void;
    noticeDetail?: NoticeDetailType;
}

const TimelineNotifyItem: React.FC<Props> = (props) => {
    const { dataSource, onNoticeChange, noticeDetail } = props;
    const { noticeTypeDesc, noticeTime, noticeRole } = dataSource;
    const [visible, setVisible] = useState<boolean>(false);

    const openNotifierDetails = () => {
        onNoticeChange && onNoticeChange(dataSource);
        setVisible(true);
    };

    return (
        <>
            <NotifierDetailsModal visible={visible} setVisible={setVisible} noticeDetail={noticeDetail} />
            <div
                className={classNames('fail-progress-timeline-notify-item', { gray: noticeTypeDesc === '故障恢复通知' })}
                onClick={openNotifierDetails}
            >
                <div className="fail-progress-timeline-notify-item-card">
                    <div className="fail-progress-timeline-notify-item-card-title">{noticeTypeDesc}</div>
                    <div className="fail-progress-timeline-notify-item-card-content">
                        <div className="fail-progress-timeline-notify-item-card-content-time">{noticeTime}</div>
                        <div className="fail-progress-timeline-notify-item-card-content-role">
                            <div>通知角色：</div>
                            <span>{noticeRole}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TimelineNotifyItem;
