import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Tag } from 'oss-ui';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ScheduleTransfer from '../shcedule-transfer';
import './index.less';

const Nzh = require('nzh');
const nzhcn = Nzh.cn;

const ScheduleItem = (props) => {
    const { data, index, columns, userSource = [] } = props;
    const [modalVisible, handleModalVisible] = useState(false);
    const [userTargetKeys, handleUserTargetKeys] = useState([]);
    useEffect(() => {
        handleUserTargetKeys(data?.userGroup.map((item) => item.userId));
    }, [data]);
    const handleDel = () => {
        props.delete && props.delete();
    };
    const handleModalOk = () => {
        props.itemChange && props.itemChange(userSource.filter((item) => userTargetKeys.includes(item.userId)));
        handleModalVisible(false);
    };
    const handleModalCanel = () => {
        handleModalVisible(false);
    };
    const handleAddUser = () => {
        handleModalVisible(true);
    };
    const onTransferChange = (e) => {
        handleUserTargetKeys(e);
    };
    const handleUserItemClose = (item) => {
        userTargetKeys.splice(
            userTargetKeys.findIndex((itm) => itm === item.userId),
            1
        );
        handleUserTargetKeys(userTargetKeys);
        props.itemChange && props.itemChange(userSource.filter((item) => userTargetKeys.includes(item.userId)));
    };
    return (
        <Row gutter={24} className="auto-schedule-item" style={{ marginLeft: '0', marginRight: '0' }}>
            <Col className="group-col" span={2}>{`第${nzhcn.encodeS(index + 1)}组:`}</Col>
            <Col span={17} style={{ paddingLeft: 0 }}>
                <div className="usergroup-container">
                    {data &&
                        Array.isArray(data.userGroup) &&
                        data.userGroup.map((item) => {
                            return (
                                <Tag
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        handleUserItemClose(item);
                                    }}
                                >
                                    {item.userName}-{item.mobilePhone}
                                </Tag>
                            );
                        })}
                </div>
            </Col>
            <Col span={2}>
                <PlusOutlined className="plus" onClick={handleAddUser} />
            </Col>
            <Col span={2}>
                {index === 0 ? null : (
                    <DeleteOutlined
                        className="delete"
                        onClick={() => {
                            handleDel();
                        }}
                    />
                )}
            </Col>
            <Modal visible={modalVisible} title="选择人员" destroyOnClose onOk={handleModalOk} onCancel={handleModalCanel}>
                <div className="auto-schedule-list-container">
                    <ScheduleTransfer columns={columns} dataSource={userSource} targetKeys={userTargetKeys} onTransferChange={onTransferChange} />
                </div>
            </Modal>
        </Row>
    );
};

export default ScheduleItem;
