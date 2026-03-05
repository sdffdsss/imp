import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Modal, message, Tooltip, Button, Icon, Form, Input, DatePicker, Select, Row, Col, Table } from 'oss-ui';
import type { IModalContentProps } from './types';
import useLoginInfoModel from '@Src/hox';
import { getViewColumns } from '../../../api';

export default forwardRef((props: IModalContentProps, ref) => {
    const { initialValues, mode } = props;
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowsCache, setSelectedRowsCache] = useState([]);
    const disabled = mode === 'view';
    const [form] = Form.useForm();
    const { userId } = useLoginInfoModel();

    const formSubmit = () => {
        return new Promise((resolve, reject) => {
            form.validateFields().then((values) => {
                if (selectedRowsCache.length > 0) {
                    resolve({
                        ...values,
                        creator: mode === 'new' ? userId : initialValues.creator,
                        alarmFieldList: selectedRowsCache,
                    });
                } else {
                    message.warning('请至少选择1个告警展示字段');
                    reject();
                }
            });
        });
    };

    useImperativeHandle(ref, () => ({
        getValues: formSubmit,
    }));

    useEffect(() => {
        getViewColumns().then((res) => {
            if (res.code === 200) {
                setDataSource(res.data);
            }
        });
    }, []);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            setSelectedRowsCache(initialValues.alarmFieldList);
        }
    }, [initialValues]);

    return (
        <>
            <Form form={form}>
                <Form.Item required name="viewName" label="视图名称" rules={[{ required: true, message: '请输入视图名称' }]}>
                    <Input disabled={disabled} maxLength={128} />
                </Form.Item>
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>
            </Form>
            <Table
                style={{ padding: '0' }}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRowsCache.map((item) => item.fieldId),
                    getCheckboxProps: () => {
                        return { disabled };
                    },
                    onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRowsCache(selectedRows);
                    },
                }}
                bordered
                size="small"
                dataSource={dataSource}
                rowKey="fieldId"
                columns={[
                    {
                        dataIndex: 'displayOrder',
                        title: '序号',
                        align: 'center',
                    },
                    {
                        dataIndex: 'displayName',
                        title: '名称',
                        align: 'center',
                    },
                    {
                        dataIndex: 'fieldName',
                        title: '字段',
                        align: 'center',
                    },
                ]}
            />
        </>
    );
});
