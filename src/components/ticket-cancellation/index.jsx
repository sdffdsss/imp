/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Form, Input, Modal, Table } from 'oss-ui';

const TicketCancellation = (props) => {
    const [formRef] = Form.useForm();
    const columns = [
        { title: '网元名称', dataIndex: 'eqp_label' },
        { title: '告警对象名称', dataIndex: 'ne_label' },
        { title: '告警标题', dataIndex: 'title_text' },
        { title: '告警发生时间', dataIndex: 'event_time' }
    ];
    const dataSource = props.record.map((item) => {
        return {
            eqp_label: item.eqp_label?.value,
            ne_label: item.ne_label?.value,
            title_text: item.title_text?.value,
            event_time: item.event_time?.value
        };
    });
    useEffect(() => {
        Modal.confirm({
            title: '请填写撤销原因',
            centered: true,
            bodyStyle: { overflow: 'hidden' },
            content: (
                <Form form={formRef}>
                    <Form.Item name="deleteInfo" rules={[{ required: true, message: '撤销原因不能为空' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            ),
            onOk: (close) => {
                formRef.validateFields().then((values) => {
                    props.menuComponentFormRef.current?.setFieldsValue({
                        data: {
                            deleteInfo: values.deleteInfo,
                            sender: props.userInfo.userName
                        }
                    });
                    close();
                });
            },
            onCancel: (close) => {
                close();
            }
        });
    }, []);

    return (
        <div>
            <Form ref={props.menuComponentFormRef}>
                <div>告警基本信息如下：</div>
                <Table columns={columns} dataSource={dataSource} pagination={false}></Table>
            </Form>
        </div>
    );
};
export default TicketCancellation;
