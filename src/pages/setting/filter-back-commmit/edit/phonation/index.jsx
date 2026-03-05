import React from 'react';
import { Checkbox, Form, Space, Row, Col, TimePicker, Button, Radio, Input } from 'oss-ui';
import moment from 'moment';

const playAlarmMap = [
    {
        label: '地市',
        value: 'region_name',
    },
    {
        label: '区县',
        value: 'city_name',
    },
    {
        label: '告警发声时间',
        value: 'event_time',
    },
    {
        label: '网元名称',
        value: 'eqp_label',
    },
    {
        label: '告警对象名称',
        value: 'ne_label',
    },
    {
        label: '告警标题',
        value: 'title_text',
    },
    {
        label: '网管告警级别',
        value: 'org_severity',
    },
    {
        label: '设备厂家',
        value: 'vendor_name',
    },
];

export default React.forwardRef((props) => {
    const initialValue = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                isVaildTime: false,
                useTime: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')],
                soundFlag: 0,
            };
        }
        return {
            ...initialValues,
            useTime: [moment(initialValues.startTime[0], 'HH:mm'), moment(initialValues.startTime[1], 'HH:mm')],
        };
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Form initialValues={initialValue()}>
                <Row>
                    <Col span={3} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        启用时间段<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={21}>
                        <Row>
                            <Col span={2}>
                                <Form.Item name="isVaildTime" valuePropName="checked">
                                    <Checkbox>启用</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={22}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item name="useTime" noStyle>
                                                <TimePicker.RangePicker format="HH:mm" disabled={!getFieldValue('isVaildTime')} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item labelCol={{ span: 3 }} name="mode" label="发声方式">
                    <Radio.Group>
                        <Radio value={0}>播放发声文件</Radio>
                        {/* <Radio value={1}>播放告警</Radio> */}
                    </Radio.Group>
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return getFieldValue('mode') === 0 ? (
                            <Form.Item wrapperCol={{ offset: 3 }}>
                                <Space>
                                    <span>声音文件:</span>
                                    <Form.Item noStyle>
                                        <Input style={{ width: 120 }} />
                                    </Form.Item>
                                    <Button type="primary">选择文件</Button>
                                    <Button>试听</Button>
                                </Space>
                            </Form.Item>
                        ) : (
                            <Form.Item wrapperCol={{ offset: 3 }}>
                                <Checkbox.Group options={playAlarmMap}></Checkbox.Group>
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            </Form>
        </>
    );
});
