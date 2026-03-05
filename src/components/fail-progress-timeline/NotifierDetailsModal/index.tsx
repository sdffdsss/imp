import React from 'react';
import { Modal, Table, ConfigProvider, Tooltip } from 'oss-ui';
import { ColumnsType } from 'oss-ui/es/table';
import CustomModalFooter from '../../custom-modal-footer';
import { User, NoticeDetailType } from '../type';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    noticeDetail?: NoticeDetailType;
}

const NotifierDetailsModal: React.FC<Props> = (props) => {
    const { visible, setVisible, noticeDetail } = props;

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const columns: ColumnsType<User> = [
        {
            title: '通知角色',
            dataIndex: 'noticeRole',
            key: 'key',
            width: 100,
            align: 'center',
        },
        {
            title: '角色人员',
            dataIndex: 'noticeUser',
            key: 'key',
            align: 'left',
            // render: (roleList) => {
            //     return (
            //         <div style={{ textAlign: 'left' }}>
            //             {roleList.map((item, index) => {
            //                 if (index + 1 === roleList.length) {
            //                     return `${item.name}（${item.phone}）`;
            //                 } else {
            //                     return `${item.name}（${item.phone}）、`;
            //                 }
            //             })}
            //         </div>
            //     );
            // },
        },
        {
            title: '通知详情',
            dataIndex: 'noticeDetails',
            key: 'key',
            align: 'left',
            render: (text) => {
                return (
                    <Tooltip
                        title={() => {
                            return (
                                <div>
                                    {text.split('\n').map((line) => (
                                        <span>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </div>
                            );
                        }}
                        overlayClassName="tooltip-render"
                    >
                        {text
                            .split('\n')
                            .slice(0, 3)
                            .map((line, ind) => (
                                <span>
                                    {line}
                                    {ind === 2 && '...'}
                                    <br />
                                </span>
                            ))}
                    </Tooltip>
                );
            },
        },
    ];

    return (
        <Modal
            title="通知人详情"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            footer={
                <CustomModalFooter
                    onCancel={() => {
                        setVisible(false);
                    }}
                    onOk={handleOk}
                />
            }
        >
            <ConfigProvider renderEmpty={() => <div>暂无数据</div>}>
                <Table dataSource={noticeDetail || []} columns={columns} pagination={false} />
            </ConfigProvider>
        </Modal>
    );
};

export default NotifierDetailsModal;
