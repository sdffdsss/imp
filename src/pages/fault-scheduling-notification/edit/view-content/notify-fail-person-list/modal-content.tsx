import React, { forwardRef, useState } from 'react';
import { Form, Input, Table } from 'oss-ui';
import type { IModalContentProps } from './types';

export default forwardRef((props: IModalContentProps) => {
    const { data } = props;
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<any>(data || []);

    function filter(e) {
        setDataSource(data?.filter((item) => item.phone?.includes(e.target.value)));
    }
    // UI部分是form，可以是任何内容 目前业务大部分modal中是form
    return (
        <Form
            labelCol={{
                span: 2,
            }}
            wrapperCol={{
                span: 8,
            }}
            form={form}
        >
            <Form.Item label="通知号码" labelAlign="left">
                <Input onPressEnter={filter} />
            </Form.Item>
            <Table
                dataSource={dataSource}
                bordered
                pagination={{
                    showSizeChanger: true,
                    showTotal: (total, range) => {
                        console.log(range);
                        return `第${range[0] === range[1] ? range[0] : range[0] + '-' + range[1]}条/总共 ${total} 条`;
                    },
                    size: 'small',
                }}
                scroll={{ y: 400 }}
                columns={[
                    {
                        dataIndex: 'index',
                        align: 'center',
                        title: '序号',
                        width: 60,
                        render(text, record, index) {
                            return index + 1;
                        },
                    },
                    {
                        dataIndex: 'phone',
                        title: '通知号码',
                        align: 'center',
                        width: 120,
                    },
                    {
                        dataIndex: 'sendTime',
                        title: '通知时间',
                        align: 'center',
                        width: 180,
                    },
                    {
                        dataIndex: 'res',
                        title: '通知结果',
                        align: 'center',
                        width: 100,
                        render() {
                            return '失败';
                        },
                    },
                    {
                        dataIndex: 'result',
                        align: 'center',
                        title: '通知失败原因',
                        width: 200,
                    },
                ]}
            />
        </Form>
    );
});
