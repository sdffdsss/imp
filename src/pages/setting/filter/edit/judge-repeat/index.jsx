/* eslint-disable no-restricted-properties */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import { Form, Select, Checkbox, Radio, Row, Col, InputNumber } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import CompSheetStatus from './comp-sheetStatus';
import formatReg from '@Common/formatReg';
import { getStatus, getTypes } from './api.js';
import './index.less';

export default React.forwardRef((props, ref) => {
    const [statusList, setStatusList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const initialValues = () => {
        return { level: 1, delayTime: 0, type: 2, time: 0, rejectAlarm: true };
    };

    /**
     * @description 通过Id获取表单元素初始值
     * @param {规则动作} data
     * @param {规则动作Key} key
     */
    const getInitValueBykey = (data, key) => {
        const tempObj = data.find((item) => item.key === key);
        if (_.isEmpty(tempObj)) {
            return false;
        }
        return tempObj.value;
    };

    useEffect(() => {
        getTypes().then((res) => {
            setTypeList(res.data);
        });
        getStatus().then((res) => {
            setStatusList(res.data);
            if (props.modelType === 'new' && ref.current) {
                ref.current.setFieldsValue({
                    status: res.data.filter((item) => item.value === '已归档' || item.value === '异常归档').map((itm) => `${itm.key}`),
                });
            }
        });
    }, []);

    useEffect(() => {
        if (props.modelType !== 'new') {
            if (ref.current && props.initialValues && _.isArray(props.initialValues)) {
                const initValue = props.initialValues;
                const cobineValus = getInitValueBykey(initValue, 'sheetStatusCheck');
                let times = 0;
                let types = [];
                let type = 2;
                if (cobineValus) {
                    if (cobineValus.split(';')[1] === '当天') {
                        times = 0;
                    } else {
                        times = cobineValus.split(';')[1];
                    }
                }
                if (cobineValus) {
                    types = cobineValus.split(';')[2] ? cobineValus.split(';')[2].split(',') : [];
                    type = cobineValus.split(';')[1] === '当天' ? 2 : 1;
                }
                let fiedls = [];
                const uniqueAlarmFields = getInitValueBykey(initValue, 'uniqueAlarmFields');
                if (uniqueAlarmFields) {
                    fiedls = uniqueAlarmFields.split(',');
                }
                const filedValues = {
                    level: Number(getInitValueBykey(initValue, 'level')),
                    dupChaseSheet: '0',
                    uniqueAlarmFields: fiedls,
                    type,
                    time: times,
                    status: types,
                    rejectAlarm: getInitValueBykey(initValue, 'rejectAlarm') ? false : true,
                };

                ref.current.setFieldsValue(filedValues);
            }
        }
    }, [props.initialValues, props.modelType, ref]);

    const itemStyle = {
        marginBottom: '20px !importent',
    };
    console.log(statusList);
    return (
        <>
            <div className="judgeRepeat-title">规则动作</div>
            <Form name="judgeRepeatRule" ref={ref} initialValues={initialValues()} className="judgeRepeat-content" labelCol={{ span: 3 }}>
                <Form.Item label="追单时限" shouldUpdate itemStyle={itemStyle}>
                    {({ getFieldValue }) => {
                        return (
                            <Row gutter={24} style={{ width: '800px' }}>
                                <Col span={4}>
                                    <Form.Item name="type">
                                        <Select
                                            options={[
                                                { label: '自定义', value: 1 },
                                                { label: '当天', value: 2 },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="time"
                                        noStyle
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入追单时限',
                                            },
                                        ]}
                                    >
                                        <InputNumber disabled={getFieldValue('type') === 2} />
                                    </Form.Item>
                                </Col>
                                <span className="time-name">分钟</span>
                            </Row>
                        );
                    }}
                </Form.Item>
                <Form.Item label="追单条件" name="uniqueAlarmFields" rules={[{ required: true, message: '不能为空' }]} itemStyle={itemStyle}>
                    <Checkbox.Group
                        options={typeList.map((itm) => ({
                            label: itm.fieldLabel,
                            value: itm.fieldName,
                        }))}
                    />
                </Form.Item>
                <Form.Item label="不追工单" name="status" itemStyle={itemStyle}>
                    <Select mode="multiple">
                        {statusList.map((item) => {
                            return <Select.Option value={`${item.key}`}>{item.value}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                <Row>
                    <Col span={6}>
                        <Form.Item
                            label="优先级"
                            name="level"
                            labelCol={{
                                span: 12,
                            }}
                            wrapperCol={{
                                span: 12,
                            }}
                            rules={[
                                { required: true, message: '不能为空' },
                                {
                                    validator: async (rule, val) => {
                                        const reg = formatReg.positiveInteger;
                                        if (val && !reg.test(val)) {
                                            throw new Error(`必须为非负整数`);
                                        }

                                        const max = 100;
                                        if (val && val > max) {
                                            throw new Error(`可输入的最大值为${max}`);
                                        }
                                    },
                                },
                            ]}
                        >
                            <InputNumber min={1} className="judgeRepeat-item" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <span
                            style={{
                                marginLeft: '20px',
                                color: 'red',
                                lineHeight: '26px',
                            }}
                        >
                            优先级越高，数字越小
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col offset={1}>
                        <Form.Item label="" name="rejectAlarm" valuePropName="checked" itemStyle={itemStyle}>
                            <Checkbox>已派单告警清除后，需支持追单</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
});
