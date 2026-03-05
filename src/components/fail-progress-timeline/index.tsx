import React from 'react';
import DrawerButton from './DrawerButton';
import TimelineItem from './timeline-item';
import { Empty } from 'oss-ui';
import { DataSource, NoticeListItemType, NoticeDetailType } from './type';
import './index.less';

interface Props {
    finalData: DataSource[];
    onNoticeChange?: (item: NoticeListItemType) => void;
    noticeDetail: NoticeDetailType;
}

const FailProgressTimeline: React.FC<Props> = (props) => {
    const { finalData, onNoticeChange, noticeDetail } = props;

    return (
        <DrawerButton>
            <div className="fail-progress-timeline">
                {finalData.length > 0 ? (
                    finalData.map((item, index) => {
                        return (
                            <TimelineItem dataSource={item} key={index} index={index} onNoticeChange={onNoticeChange} noticeDetail={noticeDetail} />
                        );
                    })
                ) : (
                    <div style={{ width: '100%', textAlign: 'center', paddingTop: '50px' }}>
                        <Empty description="暂无进展" />
                    </div>
                )}
            </div>
        </DrawerButton>
    );
};
export default FailProgressTimeline;
