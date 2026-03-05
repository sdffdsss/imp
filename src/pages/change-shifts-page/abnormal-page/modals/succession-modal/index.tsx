import React, { FC, useState, useEffect } from 'react';
import { Modal, Form, Select, message, Row, Col } from 'oss-ui';
import { useHistory } from 'react-router-dom';
import AuthButton from '@Pages/components/auth/auth-button';
import useLoginInfoModel from '@Src/hox';
import api from '@Pages/change-shifts-page/api';
import CustomModalFooter from '@Components/custom-modal-footer';

import styles from './style.module.less';

interface Props {}

const SuccessionModal: FC<Props> = () => {
    const [form] = Form.useForm();
    const { parsedUserInfo, currentZone } = useLoginInfoModel();
    const { userId, userName, userMobile } = parsedUserInfo;

    const [visible, setVisible] = useState<boolean>(false);
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const history = useHistory();

    const getGroups = async () => {
        const data = {
            provinceId: currentZone?.zoneId,
        };

        const res = await api.findGroupsByUser(data);

        const list = res.rows.map((item) => ({
            label: item.groupName,
            value: item.groupId,
        }));
        setOptions(list);
    };

    useEffect(() => {
        getGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        const values = await form.validateFields();

        const data = {
            ...values,
            provinceId: currentZone?.zoneId,
            userId,
            userName,
            userMobile,
        };

        const res = await api.findWorkShiftForGroupTake(data);

        if (+res.resultCode === 200) {
            setVisible(false);
            history.goBack();
        } else {
            message.error(res.resultMsg);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div className={styles['succession-modal']}>
            <AuthButton
                type="primary"
                className={styles['succession-modal-button']}
                onClick={showModal}
                authKey="changeShiftsSetting:takeover"
                unauthorizedDisplayMode="disabled"
            >
                我要接班
            </AuthButton>
            <p className={styles['succession-modal-text']}>“我要接班”可在未提前排班的情况下直接接班。接班成功后，系统排班将同步更新。</p>
            <Modal
                title="接班班组"
                visible={visible}
                maskClosable={false}
                onCancel={handleCancel}
                wrapClassName={styles['succession-modal-modal']}
                footer={<CustomModalFooter onOk={handleOk} onCancel={handleCancel} />}
            >
                <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                    <Form.Item
                        style={{ marginBottom: '10px' }}
                        name="groupId"
                        label="班组名称"
                        rules={[{ required: true, message: '请选择接班班组' }]}
                    >
                        <Select placeholder="请选择接班班组" allowClear options={options} />
                    </Form.Item>
                    <Row>
                        <Col offset={4} style={{ color: '#f00' }}>
                            选定班组后，您将自动加入到该班组下
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default SuccessionModal;
