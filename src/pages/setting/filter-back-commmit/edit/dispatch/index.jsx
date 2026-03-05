import React from 'react';
import { Checkbox, Form, Row, Col, InputNumber, TimePicker, Select, DatePicker, Radio } from 'oss-ui';
import moment from 'moment';

export default React.forwardRef((props, ref) => {
    const initialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                restrainProjectAlarm: true,
                needT1: false,
                dispatchTimerangeTurnon: false,
                startForwardTime: moment('08:00', 'HH:mm'),
                endForwardTime: moment('18:00', 'HH:mm'),
                nonForwardProcess: 0,
                dayPeriod: false,
                startUseTime: moment(),
                endUseTime: moment().add(1, 'days'),
                noEndDate: false,
                dayOfWeek: [],
                holidays: 0,
                delayTime: 0,
                ruleSet: 0,
                childAlarm: false,
                sendSheetChildAlarm: 0,
                rulePriority: false,
                selectPriority: 2,
                relationAction: 0,
                alarmHandleLevel: 5,
            };
        }
        return {
            ...initialValues,
            restrainProjectAlarm: Boolean(initialValues.restrainProjectAlarm),
            needT1: Boolean(initialValues.needT1),
            // dispatchTimerangeTurnon: Boolean(initialValues.dispatchTimerangeTurnon),
            dayPeriod: Boolean(initialValues.dayPeriod),
            dayOfWeek: initialValues.dayOfWeek.split(','),
            childAlarm: Boolean(initialValues.childAlarm),
            rulePriority: Boolean(initialValues.rulePriority),
            relationAction: Boolean(initialValues.relationAction),
            alarmHandleLevel: Boolean(initialValues.alarmHandleLevel),
        };
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            <Row>
                <Col offset={1} span={16}>
                    <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} ref={ref} initialValues={initialValues()}>
                        <Form.Item valuePropName="checked" name="restrainProjectAlarm" label="工程告警抑制派单">
                            <Checkbox>启用</Checkbox>
                        </Form.Item>
                        <Form.Item valuePropName="checked" name="needT1" label="需要系统完成T1预处理">
                            <Checkbox>启用</Checkbox>
                        </Form.Item>
                        <Form.Item valuePropName="checked" label="派单时间段" name="dispatchTimerangeTurnon">
                            <Checkbox>启用</Checkbox>
                        </Form.Item>
                        <Row>
                            <Col offset={7} span={17}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item labelAlign="left" name="startForwardTime" labelCol={{ span: 7 }} label="开始时间">
                                                <TimePicker format="HH:mm" disabled={!getFieldValue('dispatchTimerangeTurnon')} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item labelAlign="left" name="endForwardTime" labelCol={{ span: 7 }} label="结束时间">
                                                {<TimePicker format="HH:mm" disabled={!getFieldValue('dispatchTimerangeTurnon')} />}
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                shouldUpdate
                                                labelAlign="left"
                                                name="nonForwardProcess"
                                                labelCol={{ span: 7 }}
                                                label="非派单时间段处理"
                                            >
                                                {
                                                    <Select
                                                        placeholder="请选择"
                                                        disabled={!getFieldValue('dispatchTimerangeTurnon')}
                                                        style={{ width: 180 }}
                                                        options={[
                                                            { label: '下个派单时段派单', value: 1 },
                                                            { label: '丢弃', value: 0 },
                                                        ]}
                                                    ></Select>
                                                }
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item valuePropName="checked" label="启用日期" name="dayPeriod">
                            <Checkbox>启用</Checkbox>
                        </Form.Item>
                        <Row style={{ marginBottom: '24px' }}>
                            <Col offset={7} span={17}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item
                                                        labelAlign="left"
                                                        name="startUseTime"
                                                        labelCol={{ span: 7 }}
                                                        wrapperCol={{ span: 17 }}
                                                        label="开始日期"
                                                    >
                                                        <DatePicker format="YYYY-MM-DD" disabled={!getFieldValue('dayPeriod')} />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={7}>结束日期:</Col>
                                    <Col span={17}>
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item noStyle name="endUseTime" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
                                                        <DatePicker
                                                            format="YYYY-MM-DD"
                                                            disabled={!getFieldValue('dayPeriod') || getFieldValue('noEndDate')}
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item name="noEndDate" noStyle valuePropName="checked">
                                                        <Checkbox style={{ marginLeft: '8px' }} disabled={!getFieldValue('dayPeriod')}>
                                                            无结束日
                                                        </Checkbox>
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Form.Item label="按工作日派单" name="dayOfWeek">
                            <Select
                                mode="multiple"
                                placeholder="请选择"
                                style={{ width: 220 }}
                                options={[
                                    { label: '周一', value: 2 },
                                    { label: '周二', value: 3 },
                                    { label: '周三', value: 4 },
                                    { label: '周四', value: 5 },
                                    { label: '周五', value: 6 },
                                    { label: '周六', value: 7 },
                                    { label: '周日', value: 1 },
                                ]}
                            ></Select>
                        </Form.Item>
                        <Form.Item label="节假日不派单" name="holidays">
                            <Select
                                style={{ width: 150 }}
                                options={[
                                    { label: '是', value: 0 },
                                    { label: '否', value: 1 },
                                ]}
                            ></Select>
                        </Form.Item>
                        <Form.Item label="延迟时间" name="delayTime">
                            <Radio.Group>
                                <Radio value={0}>
                                    规则设置
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item noStyle name="ruleSet">
                                                    <InputNumber disabled={getFieldValue('delayTime') === 1} style={{ marginLeft: 16 }} />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Radio>
                                <Radio value={1}>采用花名册或资源时延</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item valuePropName="checked" name="childAlarm" labelCol={{ span: 9 }} label="主告警清除后子告警派单功能">
                            <Checkbox>启用</Checkbox>
                        </Form.Item>
                        <Row>
                            <Col offset={9} span={15}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item wrapperCol={{ span: 24 }} name="sendSheetChildAlarm">
                                                <Radio.Group
                                                    disabled={!getFieldValue('childAlarm')}
                                                    options={[
                                                        { label: '条件设置中的告警为主告警', value: 0 },
                                                        { label: '条件设置中的告警为子告警', value: 1 },
                                                    ]}
                                                ></Radio.Group>
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '24px' }}>
                            <Col span={7} style={{ textAlign: 'right', lineHeight: '32px' }}>
                                规则优先级<span style={{ margin: '0 8px 0 2px' }}>:</span>
                            </Col>
                            <Col span={17}>
                                <Form.Item valuePropName="checked" name="rulePriority" noStyle>
                                    <Checkbox>启用</Checkbox>
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item noStyle name="selectPriority">
                                                <Select
                                                    disabled={!getFieldValue('rulePriority')}
                                                    style={{ width: 150 }}
                                                    options={[
                                                        { label: '低优先级', value: 0 },
                                                        { label: '较低优先级', value: 1 },
                                                        { label: '普通优先级(普通)', value: 2 },
                                                        { label: '较高优先级', value: 3 },
                                                        { label: '高优先级', value: 4 },
                                                    ]}
                                                ></Select>
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="关联关系动作" name="relationAction">
                            <Select
                                style={{ width: 180 }}
                                options={[
                                    { label: '独立派单', value: 0 },
                                    { label: '关联抑制', value: 1 },
                                    { label: '关联打包派单', value: 2 },
                                    { label: '只关联打包不单独派单', value: 3 },
                                    { label: '关联后主子均不派单', value: 4 },
                                ]}
                            ></Select>
                        </Form.Item>
                        <Form.Item label="故障处理级别" name="alarmHandleLevel">
                            <Select
                                style={{ width: 150 }}
                                options={[
                                    { label: '一级处理', value: 1 },
                                    { label: '二级处理', value: 2 },
                                    { label: '三级处理', value: 3 },
                                    { label: '四级处理', value: 4 },
                                    { label: '无', value: 5 },
                                ]}
                            ></Select>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
});
