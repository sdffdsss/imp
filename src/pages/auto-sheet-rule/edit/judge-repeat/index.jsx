import React from 'react';
import { Form, Select, Checkbox, Radio, Row, Col, InputNumber } from 'oss-ui';
import './index.less';
import { _ } from 'oss-web-toolkits';
import CompSheetStatus from './comp-sheetStatus';
import formatReg from '@Common/formatReg';

export default React.forwardRef((props, ref) => {
    const initialValues = () => {
        return { level: 0, delayTime: 0 };
    };

    React.useEffect(() => {
        if (!(props.modelType === 'edit')) {
            // console.log('!!edit');
            if (ref.current && props.initialValues && _.isArray(props.initialValues)) {
                const initValue = props.initialValues;
                const filedValues = {
                    level: Number(getInitValueBykey(initValue, 'level')),
                    dupChaseSheet: getInitValueBykey(initValue, 'dupChaseSheet'),
                    uniqueAlarmFields: () => {
                        const uniqueAlarmFields = getInitValueBykey(initValue, 'uniqueAlarmFields');
                        if (uniqueAlarmFields) {
                            return uniqueAlarmFields.split(',').map((item) => Number.parseInt(item));
                        } 
                            return [];
                        
                    },
                    sheetStatus: () => {
                        const sheetStatus = getInitValueBykey(initValue, 'sheetStatus');
                        if (sheetStatus) {
                            return sheetStatus.split(',').map((item) => Number.parseInt(item));
                        } 
                            return [];
                        
                    },
                    delayTime: Number(getInitValueBykey(initValue, 'delayTime')),
                };

                ref.current.setFieldsValue(filedValues);
            }
        }
    }, [props.initialValues, props.modelType, ref]);

    /**
     * 通过Id获取表单元素初始值
     * @param {规则动作} data
     * @param {规则动作Key} key
     */
    const getInitValueBykey = (data, key) => {
        const item = data.find((item) => item.key === key);
        if (_.isEmpty(item)) {
            return false;
        } 
            return item.value;
        
    };

    return (
        <>
            <div className="judgeRepeat-title">规则动作</div>
            <Form
                name="judgeRepeatRule"
                ref={ref}
                initialValues={initialValues()}
                className="judgeRepeat-content"
                labelCol={{ span: 3 }}
            >
                <Form.Item label="规则优先级" name="level">
                    <Select
                        style={{ width: 120 }}
                        className="judgeRepeat-item"
                        options={[
                            { label: '高', value: 0 },
                            { label: '中', value: 1 },
                            { label: '低', value: 2 },
                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item label="判重后操作" name="dupChaseSheet">
                    <Radio.Group className="judgeRepeat-item">
                        <Radio value="1">判重抑制</Radio>
                        <Radio value="2">判重追单</Radio>
                    </Radio.Group>
                </Form.Item>
                <Row className="judgeRepeat-row">
                    <Col offset={3}>
                        <label className="judgeRepeat-remark">
                            （注：判重追单/判重抑制
                            包括工单状态和时间两部分的设置。当不勾选任何工单状态时，代表派单告警工单状态处于下面任何环节，符合判重条件的告警均可判重追单或抑制。当不填写时间时，代表对判重时长没要求。）
                        </label>
                    </Col>
                </Row>

                <Form.Item label="判重条件" name="uniqueAlarmFields">
                    <Checkbox.Group
                        className="judgeRepeat-item"
                        options={[
                            { label: '地区相同', value: 'region_id' },
                            { label: '区县相同', value: 'city_id' },
                            { label: '机房相同', value: 'site_no' },
                            { label: '网元相同', value: 'int_id' },
                            { label: '告警对象相同', value: 'eqp_int_id' },
                            { label: '告警标题相同', value: 'alarm_title_text' },
                            { label: '维护人员相同', value: 'specia_filed' },
                        ]}
                    ></Checkbox.Group>
                </Form.Item>

                <Form.Item label="工单状态" name="sheetStatus">
                    <CompSheetStatus className="judgeRepeat-item" userId={props.login.userId} dictName="sheet_status" />
                </Form.Item>
                <Form.Item
                    label="时间(分钟)"
                    name="delayTime"
                    rules={[
                        { required: true, message: '不能为空' },
                        {
                            validator: async (rule, val, callback) => {
                                const reg = formatReg.positiveInteger;
                                if (val && !reg.test(val)) {
                                    throw new Error(`必须为非负整数`);
                                }

                                const max = Math.pow(10, 12) - 1;
                                if (val && val > max) {
                                    throw new Error(`可输入的最大值为${max}`);
                                }
                            },
                        },
                    ]}
                >
                    <InputNumber min={0} className="judgeRepeat-item" />
                </Form.Item>
            </Form>
            {/* <Form ref={ref} initialValues={initialValues()} labelCol={{ span: 3 }}>
                <Form.Item
                    name="isNotJudgeRepeat"
                    label={
                        <Tooltip title="勾选并进行条件选择后符合该条件的告警将不再派单或抑制，下方其它动作不生效。">
                            进行判重操作
                        </Tooltip>
                    }
                >
                    <Radio.Group>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 3 }}>
                    <Button type="primary">条件选择</Button>
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                        <Form.Item label="规则优先级">
                            <Select
                                disabled={!getFieldValue('isNotJudgeRepeat')}
                                style={{ width: 120 }}
                                options={[
                                    { label: '高', value: 0 },
                                    { label: '中', value: 1 },
                                    { label: '低', value: 2 },
                                ]}
                            ></Select>
                        </Form.Item>
                    )}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                        <Form.Item label="判重后操作">
                            <Radio.Group disabled={!getFieldValue('isNotJudgeRepeat')}>
                                <Radio value="1">判重抑制</Radio>
                                <Radio value="2">判重追单</Radio>
                            </Radio.Group>
                        </Form.Item>
                    )}
                </Form.Item>
                <div>判重追单/抑制范围</div>
                <div style={{ marginBottom: '16px' }}>
                    （注：判重追单/抑制范围包括工单状态和时间两部分的设置。当不勾选任何工单状态时，代表派单告警工单状态处于下面任何环节，符合判重条件的告警均可判重追单或抑制。当不填写时间时，代表对判重时长没要求。）
                </div>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                        <Form.Item label="判重条件">
                            <Checkbox.Group
                                disabled={!getFieldValue('isNotJudgeRepeat')}
                                options={[
                                    { label: '地区相同', value: 'region_id' },
                                    { label: '区县相同', value: 'city_id' },
                                    { label: '机房相同', value: 'site_no' },
                                    { label: '网元相同', value: 'int_id' },
                                    { label: '告警对象相同', value: 'eqp_int_id' },
                                    { label: '告警标题相同', value: 'alarm_title_text' },
                                    { label: '维护人员相同', value: 'specia_filed' },
                                ]}
                            ></Checkbox.Group>
                        </Form.Item>
                    )}
                </Form.Item>
                <Form.Item label="工单状态">
                    <Checkbox.Group
                        options={[
                            { label: '待受理', value: '1' },
                            { label: '处理完成', value: '2' },
                            { label: '待审批', value: '3' },
                            { label: '处理超时', value: '4' },
                            { label: '待确认', value: '5' },
                            { label: 'T1处理中', value: '6' },
                            { label: 'T2处理中', value: '6' },
                            { label: 'T3处理中', value: '6' },
                        ]}
                    ></Checkbox.Group>
                </Form.Item>
                <Form.Item label="时间">
                    <InputNumber formatter={(value) => `${value}分钟`} />
                </Form.Item>
            </Form> */}
        </>
    );
});
