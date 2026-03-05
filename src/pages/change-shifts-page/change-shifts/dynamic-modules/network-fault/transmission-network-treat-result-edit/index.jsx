import React, { useState, useEffect } from 'react';
import { Form, Modal, Radio, Input, Typography } from 'oss-ui';
import CustomModalFooter from '@Components/custom-modal-footer';

const templateMap = {
    equipemnt: '机房   板卡的故障.处理方式:   (更换板卡或者倒带后)  恢复',
    routes: '距   机房   km处,光缆因   (原因)中断.处理方式:   (熔接或者倒带后)  恢复',
};

function InputReadPretty({ value }) {
    return <Typography.Paragraph>{value}</Typography.Paragraph>;
}

export default function ViewModal(props) {
    const { value, onChange, record } = props;
    const [innerValue, setInnerValue] = useState(value);
    // const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const formInitialValues = {
        solveType: record.faultReasonDesc ? '' : 'equipemnt',
        dealResult: record.faultReasonDesc || templateMap['equipemnt'],
    };

    const isTransNetworkResult = record.professionalType === '3';

    // function onClick() {
    //     if (isTransNetworkResult) {
    //         setVisible(true);
    //     }
    // }

    function onFormChange(changedValues) {
        if (changedValues.hasOwnProperty('solveType')) {
            if (templateMap[changedValues.solveType]) {
                form.setFieldsValue({ dealResult: templateMap[changedValues.solveType] });
                onChange(templateMap[changedValues.solveType]);
                return;
            }
            form.setFieldsValue({ dealResult: record?.faultReasonDesc });
            onChange(record?.faultReasonDesc);
        }
        if (changedValues.hasOwnProperty('dealResult')) {
            onChange(changedValues.dealResult);
        }
    }
    useEffect(() => {
        if (!record.faultReasonDesc) {
            onChange(templateMap['equipemnt']);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Form wrapperCol={{ span: 24 }} initialValues={formInitialValues} form={form} onValuesChange={onFormChange}>
                <Form.Item label="" name="solveType" style={{ marginBottom: 0, display: isTransNetworkResult ? 'block' : 'none' }}>
                    <Radio.Group>
                        <Radio value="equipemnt">设备</Radio>
                        <Radio value="routes">线路</Radio>
                        <Radio value="empty">无模板</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }} name="dealResult">
                    <Input.TextArea maxLength={2000} />
                </Form.Item>
            </Form>
            {/* <Input.TextArea
                rows={1}
                value={innerValue}
                onClick={onClick}
                autoSize
                onChange={(event) => {
                    setInnerValue(event.target.value);
                    onChange(event.target.value);
                }}
                maxLength={2000}
            /> */}
            {/* <Modal
                title="编辑故障记录"
                visible={visible}
                width={600}
                onCancel={() => {
                    setVisible(false);
                }}
                footer={
                    <CustomModalFooter
                        onOk={() => {
                            const newValue = form.getFieldValue('dealResult');
                            setInnerValue(newValue);
                            setVisible(false);
                            onChange(newValue);
                        }}
                        onCancel={() => {
                            setVisible(false);
                        }}
                    />
                }
            >
                <Form wrapperCol={{ span: 18 }} labelCol={{ span: 4 }} initialValues={formInitialValues} form={form} onValuesChange={onFormChange}>
                    <Form.Item label="工单号" name="sheetNo">
                        <InputReadPretty />
                    </Form.Item>
                    <Form.Item label="工单标题" name="sheetTitle">
                        <InputReadPretty />
                    </Form.Item>
                    <Form.Item label="故障处理" name="solveType">
                        <Radio.Group>
                            <Radio value="equipemnt">设备</Radio>
                            <Radio value="routes">线路</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4, span: 18 }} name="dealResult">
                        <Input.TextArea maxLength={2000} />
                    </Form.Item>
                </Form>
            </Modal> */}
        </>
    );
}
