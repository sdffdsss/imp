import React, { useState, useEffect } from 'react';
import { Input, TimePicker, Select, Row, Col, Modal, Tag } from 'oss-ui';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ScheduleTransfer from '../shcedule-transfer';
import './index.less';
import moment from 'moment';

const Nzh = require('nzh');
const nzhcn = Nzh.cn;

const ScheduleItem = (props) => {
    const { data, index, columns, userSource = [] } = props;
    const { name, startTime, type, endTime } = data;
    const [modalVisible, handleModalVisible] = useState(false);
    const [userTargetKeys, handleUserTargetKeys] = useState([]);
    const [nameSource, handleNameSource] = useState({});
    useEffect(() => {
        handleUserTargetKeys(data?.userGroup.map((item) => item.userId));
    }, [data]);
    const handleDel = () => {
        props.delete && props.delete();
    };
    const handleModalOk = () => {
        const curArr = [];
        userTargetKeys.forEach((item) => {
            const ites = userSource.find((e) => e.userId === item);
            curArr.push(ites);
        });
        props.itemChange && props.itemChange(curArr);
        // props.itemChange && props.itemChange(userSource.filter((item) => userTargetKeys.includes(item.userId)));
        handleModalVisible(false);
    };
    const handleModalCanel = () => {
        handleUserTargetKeys(data?.userGroup.map((item) => item.userId));
        handleModalVisible(false);
    };
    const handleAddUser = () => {
        handleModalVisible(true);
    };
    const onTransferChange = (e) => {
        handleUserTargetKeys(e);
    };
    const mockData = [
        { key: 1, mobilePhone: 111, userName: '张三', userId: 1 },
        { key: 2, mobilePhone: 222, userName: '李四', userId: 2 },
        { key: 3, mobilePhone: 333, userName: '王五', userId: 3 },
    ];
    const handleUserItemClose = (item) => {
        userTargetKeys.splice(
            userTargetKeys.findIndex((itm) => itm === item.userId),
            1,
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
                        data.userGroup.map((item, index) => {
                            return (
                                <Tag
                                    key={index}
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
