import React, { useState, useEffect } from 'react';
import { Timeline, Modal, Spin } from 'oss-ui';
import { getMessageList } from '../../../group-workbench/api';
import useLoginInfoModel from '@Src/hox';
import './style.less';

interface Props {
    visible: boolean;
    data: {
        [key: string]: any;
    };
    setVisible: (data: boolean) => void;
}
// 阅读方式  1：IVR   2：调度工作台   3：钉钉
const readTypeTextMap = {
    1: 'IVR',
    2: '调度工作台',
    3: '钉钉',
};

const MsgModal: React.FC<Props> = (props) => {
    const { visible, setVisible, data } = props;
    const { flagId, topic } = data;

    const [loading, setLoading] = useState<boolean>(false);
    const [msgList, setMsgList] = useState<any[]>([]);
    const login = useLoginInfoModel();

    const getData = async () => {
        try {
            const data = {
                flagId,
                topic,
                userId: login.userId,
                userName: login.userName,
            };
            setLoading(true);
            const res = await getMessageList(data);
            setMsgList(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            getData();
        }
    }, [visible]);

    const handleCancel = () => {
        setVisible(false);
        setMsgList([]);
    };

    const footer = (
        <div className="msg-modal-footer">
            <button className="msg-modal-footer-button" onClick={handleCancel}>
                取消
            </button>
        </div>
    );

    return (
        <Modal
            width={539}
            title="已读消息"
            footer={footer}
            destroyOnClose
            visible={visible}
            style={{ top: 210 }}
            onCancel={handleCancel}
            wrapClassName="msg-modal"
        >
            <Spin spinning={loading}>
                <Timeline mode="left" className="msg-modal-timeline">
                    {msgList.map((item, index) => (
                        <Timeline.Item label={item.readTime} key={item.readId}>
                            <div className="msg-modal-timeline-name">{item.userName}</div>
                            <div className="msg-modal-timeline-notice">通过{readTypeTextMap[item.readType]}阅读了故障</div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Spin>
        </Modal>
    );
};

export default MsgModal;
