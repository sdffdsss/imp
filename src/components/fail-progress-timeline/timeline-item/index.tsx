import React, { useState } from 'react';
import constants from '@Src/common/constants';
import TimelineNotifyItem from '../timeline-notify-item';
import { TimeLineItemProps } from '../type';
import DispatchDetails from '../DispatchDetailsModal';
import './index.less';
import classNames from 'classnames';

const TimelineItem = (props: TimeLineItemProps) => {
    const { dataSource, index = 0, onNoticeChange, noticeDetail } = props;
    const { operateTime, operateType, operateDetail, noticeList, circleType } = dataSource;
    // const hasAttachment = files && files.length > 0;
    // const limitCount = hasAttachment ? 29 : 40;
    // const tooLong = operateDetail.length > limitCount;
    // const finalDetail = tooLong ? `${operateDetail.substring(0, limitCount)}...` : operateDetail;

    const [visible, setVisible] = useState<boolean>(false);

    const TimelineNotifyDom = noticeList?.map((item, index) => {
        return <TimelineNotifyItem dataSource={item} key={index} onNoticeChange={onNoticeChange} noticeDetail={noticeDetail} />;
    });

    const openDispatchDetails = () => {
        setVisible(true);
    };

    return (
        <>
            <DispatchDetails visible={visible} setVisible={setVisible} dataSource={dataSource} />
            <div className="fail-progress-timeline-item">
                <div className="fail-progress-timeline-item-card" onClick={openDispatchDetails}>
                    <div className="fail-progress-timeline-item-card-time-box">{operateTime || '--'}</div>
                    <div className="fail-progress-timeline-item-card-main-box">
                        <div className="fail-progress-timeline-item-card-main-box-title">
                            <div className="item-card-title-index">{index + 1}</div>
                            <div className="item-card-title-text">{operateType}</div>
                        </div>
                        <div className="fail-progress-timeline-item-card-main-box-content">
                            <div className="item-card-content-text">
                                {operateDetail}
                                {/* {(tooLong || hasAttachment) && (
                                    <Button className="card-show-more-btn" type="link" onClick={openDispatchDetails}>
                                        更多
                                    </Button>
                                )} */}
                            </div>
                            {/* {hasAttachment && (
                                <div className="item-card-content-attachment">
                                    {(files || []).map((item, index) => {
                                        return index < 2 ? (
                                            <Button className="card-download-btn" type="link"  onClick={() => { downloadAccessory(item)}}>
                                                {item.createPName}
                                            </Button>
                                        ) : null;
                                    })}
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
                <div className="fail-progress-timeline-item-content">
                    <div className="fail-progress-timeline-item-line" />
                    {!!noticeList?.length && (
                        <div
                            className={classNames('fail-progress-timeline-item-icon', {
                                gray: noticeList.find((item) => item.noticeTypeDesc === '故障恢复通知'),
                            })}
                        >
                            <img src={constants.IMAGE_PATH + '/fail-progress-timeline/sound.png'} alt="sound" />
                        </div>
                    )}
                    {circleType && <div className="fail-progress-timeline-item-circle" />}
                    <div className="fail-progress-timeline-item-notify-list">{TimelineNotifyDom}</div>
                </div>
            </div>
        </>
    );
};
export default TimelineItem;
