import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Row, Col, Icon, Radio, Modal, Tooltip, Button, Space } from 'oss-ui';
import { setSendSms, getSendSms } from './api';
import useLoginInfoModel from '@Src/hox';
// import AuthButton from '@Src/components/auth-button';
import EditModel from '@Src/pages/setting/views/monitor-setting/component/maintenance-edit';
import _cloneDeep from 'lodash/cloneDeep';
// import './index.less';

const Index = (props) => {
    const { type, row, messageModalVisible, setMessageModal } = props;
    const login = useLoginInfoModel();
    const [form] = Form.useForm();
    // 展示用数据源
    const [editVisible, setEditVisible] = useState(false);
    // const [choseModal, setChoseModal] = useState(false);
    const [editModleName, setEditModleName] = useState('');
    const [users, setUsers] = useState([]);

    const [checkTree, setCheckTree] = useState({
        shiftForemanName: [],
    });

    const handleSave = async () => {
        const formValues = form.getFieldsValue();
        const list = users?.map((item: any) => {
            return {
                userId: item.otherInfo?.userIdNum,
                userName: item.otherInfo?.zhName,
                mobilePhone: item.telephone,
            };
        });
        const params = {
            groupId: row.groupId,
            sendSmsFlag: formValues.useFlag,
            users: list,
        };
        const res = await setSendSms(params);
        console.log(res);
        if (res) {
            setMessageModal(false);
        }
    };
    const getData = async () => {
        const params = {
            groupId: row.groupId,
        };
        const res = await getSendSms(params);
        console.log(res);
        if (res.data) {
            form.setFieldsValue({
                useFlag: res.data.sendSmsFlag,
                shiftForemanName: res.data.users?.map((ite) => `${ite.userName}(${ite.mobilePhone})`).join(','),
            });
            setCheckTree({
                ...checkTree,
                shiftForemanName: res.data.users?.map((ite) => ite.userId) || [],
            });
        }
    };
    useEffect(() => {
        getData();
    }, []);
    const treeModalChange = (flag, userList, name) => {
        if (flag) {
            form.setFieldsValue({
                [name]: userList?.map((item) => item?.title).join(),
            });
            setCheckTree({
                ...checkTree,
                [name]: _cloneDeep(userList.map((item) => item?.otherInfo?.userIdNum)),
            });
            setUsers(userList);
            setEditVisible(false);
        } else {
            setEditVisible(flag);
        }
    };

    return (
        <Modal
            width={650}
            destroyOnClose
            title="值班短信通知设置"
            visible={messageModalVisible}
            onCancel={() => {
                setMessageModal(false);
            }}
            onOk={() => {
                handleSave();
                setMessageModal(false);
            }}
            footer={null}
        >
            <div className="monitor-modal">
                <div className="content">
                    <Form className="sabe-unicom-monitor-form" form={form} labelAlign="right">
                        <Row>
                            <Col span={24}>
                                <Form.Item label="是否启用" labelCol={{ span: 6 }} name="useFlag">
                                    <Radio.Group>
                                        <Radio value={0}>停用</Radio>
                                        <Radio value={1}>启用</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="异常值班通知对象" labelCol={{ span: 6 }} name="shiftForemanName">
                                    <Input
                                        disabled={type === 'view'}
                                        onClick={() => {
                                            setEditModleName('shiftForemanName');
                                            setCheckTree(_cloneDeep(checkTree));
                                            setEditVisible(true);
                                        }}
                                        style={{ width: '90%', marginRight: 8 }}
                                        title={type === 'view' ? row?.shiftForemanInfos?.map((item) => item.userName).join() : ''}
                                        suffix={
                                            !(type === 'view') && (
                                                <div>
                                                    <Icon
                                                        antdIcon
                                                        style={{ color: '#1890ff' }}
                                                        type="UserAddOutlined"
                                                        onClick={() => {
                                                            setEditModleName('shiftForemanName');
                                                            setCheckTree(_cloneDeep(checkTree));
                                                            setEditVisible(true);
                                                        }}
                                                    ></Icon>
                                                    <Tooltip title="若当班人在当班时间内没有值班，则短信告知给主管(通知对象)">
                                                        <Icon
                                                            antdIcon
                                                            style={{ color: '#1890ff', position: 'absolute', top: 7, right: -20 }}
                                                            type="QuestionCircleOutlined"
                                                        ></Icon>
                                                    </Tooltip>
                                                </div>
                                            )
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="sms-modal-footer" style={{ textAlign: 'center' }}>
                        <Space>
                            {type !== 'view' && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        handleSave();
                                        setMessageModal(false);
                                    }}
                                >
                                    保存
                                </Button>
                            )}
                            <Button
                                onClick={() => {
                                    setMessageModal(false);
                                }}
                            >
                                取消
                            </Button>
                        </Space>
                    </div>

                    {editModleName && (
                        <EditModel
                            visible={editVisible}
                            zoneId={login.systemInfo?.currentZone?.zoneId}
                            onChange={treeModalChange}
                            // cellData={cellData}
                            // onChange={this.editChange}
                            checkTree={checkTree[editModleName]}
                            editModleName={editModleName}
                            selectUserList={checkTree[editModleName]}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default Index;
