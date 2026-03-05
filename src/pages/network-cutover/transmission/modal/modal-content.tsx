import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal, message, Tooltip, Button, Icon, Form, Input, DatePicker, Select, Row, Col, Table } from 'oss-ui';
import type { IModalContentProps } from './types';
import useLoginInfoModel from '@Src/hox';
import { blobDownLoad } from '@Src/common/utils/download';
import { findTransSegmentApi, getOpticalCableList, exportTransSegment } from '../../api';
import dayjs from 'dayjs';

function CutOverCableName({ value, disabled, onConfirm, onChange }) {
    const strref = useRef(value);
    return (
        <div style={{ width: '100%', display: 'flex' }}>
            <Input
                defaultValue={strref.current}
                style={{ flex: 'auto', marginRight: '16px' }}
                onChange={(e) => {
                    strref.current = e.target.value;
                    onChange(e.target.value);
                }}
                placeholder="请输入割接光缆名称"
                maxLength={1024}
                disabled={disabled}
            />
            <Button type="primary" onClick={() => onConfirm(strref.current)}>
                确认
            </Button>
        </div>
    );
}
function ProvinceName({ value }) {
    const { currentZone } = useLoginInfoModel();
    return value || currentZone?.zoneName;
}

export default forwardRef((props: IModalContentProps, ref) => {
    const { mode, initialValues } = props;
    const disabled = mode === 'view';
    const [dataSource, setDataSource] = useState(
        initialValues?.affectedSystems?.split(';').map((item, index) => {
            return {
                number: (index % 10) + 1,
                transSegmentName: item,
            };
        }) || [],
    );

    const { currentZone } = useLoginInfoModel();
    const [form] = Form.useForm();
    const strref = useRef(initialValues?.opticalCable || '');
    // 点击确定时需要调用此方法
    const formSubmit = async () => {
        return new Promise((resolve, reject) => {
            form.validateFields().then((values) => {
                if (values.planEndTime.isBefore(values.planStartTime)) {
                    message.warn('计划结束时间不能早于计划开始时间');
                    reject();
                } else if (values.cutoverStartTime && values.cutoverEndTime && values.cutoverEndTime.isBefore(values.cutoverStartTime)) {
                    message.warn('割接结束时间不能早于割接开始时间');
                    reject();
                } else {
                    resolve({
                        ...values,
                        provinceId: currentZone?.zoneId,
                        // impactOnNetwork: JSON.stringify(dataSource),
                        professionType: '3',
                        planStartTime: values.planStartTime.format('YYYY-MM-DD HH:mm:ss'),
                        planEndTime: values.planEndTime.format('YYYY-MM-DD HH:mm:ss'),
                        cutoverStartTime: values.cutoverStartTime ? values.cutoverStartTime.format('YYYY-MM-DD HH:mm:ss') : '',
                        cutoverEndTime: values.cutoverEndTime ? values.cutoverEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
                    });
                }
            });
        });
    };

    // useEffect(() => {
    //     getOpticalCableList({});
    // }, []);

    useImperativeHandle(ref, () => ({
        getValues: formSubmit,
    }));

    function downloadClick() {
        exportTransSegment({
            opticalCableName: strref.current,
            current: 1,
            pageSize: 0,
        }).then((res) => {
            blobDownLoad(res, `割接对网络（系统）影响${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
        });
    }

    function findTransSegment(str, current, pageSize) {
        findTransSegmentApi({
            opticalCableName: strref.current,
            current,
            pageSize,
        }).then((res) => {
            setDataSource(res.data);
        });
    }
    // UI部分是form，可以是任何内容 目前业务大部分modal中是form
    return (
        <Form layout="horizontal" labelCol={{ span: 8 }} form={form} initialValues={initialValues} labelAlign="left" wrapperCol={{ span: 14 }}>
            <Row>
                <Col span={8}>
                    <Form.Item required label="割接计划名称" name="planName" rules={[{ required: true, message: '请输入割接计划名称' }]}>
                        <Input placeholder="请输入割接计划名称" maxLength={128} disabled={disabled} />
                    </Form.Item>
                </Col>
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>
                <Col span={8}>
                    <Form.Item required label="计划开始时间" name="planStartTime" rules={[{ required: true, message: '请输入计划开始时间' }]}>
                        <DatePicker style={{ width: '100%' }} disabled={disabled} showTime />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        required
                        label="计划结束时间"
                        wrapperCol={{ span: 16 }}
                        name="planEndTime"
                        rules={[{ required: true, message: '请输入计划结束时间' }]}
                    >
                        <DatePicker style={{ width: '100%' }} disabled={disabled} showTime />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Form.Item label="省份" labelCol={{ span: 3 }} name="provinceName">
                        <ProvinceName />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item
                        required
                        label="割接光缆名称"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        name="opticalCable"
                        rules={[{ required: true, message: '请输入割接光缆名称' }]}
                    >
                        <CutOverCableName
                            disabled={disabled}
                            onConfirm={(str) => {
                                strref.current = str;
                                findTransSegment(str, 1, 0);
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span>割接对网络（系统）影响范围：</span>
                    <Button onClick={downloadClick} disabled={!strref.current}>
                        导出
                    </Button>
                </div>
                <Table
                    style={{ padding: '0' }}
                    size="small"
                    dataSource={dataSource}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        defaultPageSize: 10,
                    }}
                    columns={[
                        {
                            dataIndex: 'number',
                            title: '序号',
                            width: 100,
                            align: 'center',
                        },
                        {
                            dataIndex: 'transSegmentName',
                            title: '传输段名称',
                            align: 'center',
                        },
                    ]}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '11.12%' }}>割接段落:</div>
                <div style={{ width: '88.88%' }}>
                    <Form.Item required style={{ width: '100%' }} wrapperCol={{ span: 24 }} name="cutoverSegment">
                        <Input placeholder="请输入割接段落" maxLength={1024} style={{ width: '100%' }} disabled={disabled} />
                    </Form.Item>
                </div>
            </div>
            <Row>
                <Col span={8}>
                    <Form.Item label="割接开始时间" name="cutoverStartTime">
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" disabled={disabled} showTime />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="割接结束时间" name="cutoverEndTime">
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" disabled={disabled} showTime />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="割接结果" wrapperCol={{ span: 16 }} name="cutoverResult">
                        <Select
                            placeholder="请选择割接结果"
                            style={{ width: '100%' }}
                            options={[
                                {
                                    label: '未操作',
                                    value: 1,
                                },
                                {
                                    label: '割接失败',
                                    value: 2,
                                },
                                {
                                    label: '完成',
                                    value: 3,
                                },
                            ]}
                            disabled={disabled}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
});
