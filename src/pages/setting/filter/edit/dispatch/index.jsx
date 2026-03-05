import React, { Fragment, useState } from 'react';
import { Checkbox, Switch, Form, InputNumber, TimePicker, Select, DatePicker, Radio } from 'oss-ui';
import { getEditValues, initialValues } from './util';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import formatReg from '@Common/formatReg';
import { getHolidaysEnum } from '../../api';
import './index.less';

/** *
 * 派单规则编辑，10
 */
export default React.forwardRef((props, ref) => {
    const [holidaysEnum, setHolidaysEnum] = useState([]);
    /**
     * 表单值变更事件
     */
    const onValuesChange = (changedValues) => {
        if (changedValues.alarmHandleLevel) {
            const level = changedValues.alarmHandleLevel;
            ref.current.setFieldsValue({
                alarmHandleTime: level === 5 ? null : level * 10,
            });
        }
        if (!_.isUndefined(changedValues.noEndDate)) {
            if (changedValues.noEndDate) {
                ref.current.setFieldsValue({
                    endUseDate: null,
                });
            }
            ref.current.validateFields(['endUseDate']);
        }
        if (!_.isUndefined(changedValues.dispatchTimerangeSwitch)) {
            ref.current.validateFields(['forwardTime']);
        }
        if (!_.isUndefined(changedValues.dayPeriodSwitch)) {
            ref.current.validateFields(['startUseDate', 'endUseDate']);
        }
    };

    /**
     * @description: 获取假期枚举值
     * @param {*}
     * @return {*}
     */

    const getHolidaysEnumHandler = async () => {
        const param = {
            years: [moment().year(), moment().year() + 1],
        };
        const res = await getHolidaysEnum(param);
        if (res && res.data) {
            setHolidaysEnum(res.data);
        }
    };

    React.useEffect(() => {
        getHolidaysEnumHandler();
        if (!(props.modelType === 'new')) {
            if (ref.current && props.initialValues) {
                const editValues = getEditValues(props.initialValues);
                ref.current.setFieldsValue(editValues);
            }
        }
    }, [props.initialValues, props.modelType, ref]);

    /**
     * 编辑界面设置数值回填
     */

    return (
        <Fragment>
            <div className="dispatch-title">规则动作:</div>
            <Form
                labelCol={{ span: 5 }}
                ref={ref}
                className="dispatch-content"
                initialValues={initialValues}
                onValuesChange={onValuesChange}
                name="dispatchRule"
            >
                <Form.Item valuePropName="checked" wrapperCol={{ span: 2 }} name="prehandle" label="需要系统完成T1预处理">
                    <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                </Form.Item>
                <Form.Item label="派单时间段">
                    <Form.Item name="dispatchTimerangeSwitch" valuePropName="checked" className="dispatch-item-display">
                        <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item
                                    name="forwardTime"
                                    className="dispatch-item-display dispatch-item-font dispatch-item-margin dispatch-forwardTime-width"
                                    label="时间段"
                                    rules={[
                                        {
                                            validator: async (rule, val) => {
                                                const remark = getFieldValue('dispatchTimerangeSwitch');
                                                if (remark) {
                                                    if (!val) {
                                                        throw new Error('不能为空');
                                                    }
                                                    if (!(val[0] < val[1])) {
                                                        throw new Error('开始时间必须早于结束时间');
                                                    }
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <TimePicker.RangePicker format="HH:mm" disabled={!getFieldValue('dispatchTimerangeSwitch')} />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item
                                    shouldUpdate
                                    name="nonForwardProcess"
                                    className="dispatch-item-display dispatch-item-margin dispatch-item-font"
                                    label="非派单时间段处理"
                                >
                                    {
                                        <Select
                                            placeholder="请选择"
                                            disabled={!getFieldValue('dispatchTimerangeSwitch')}
                                            style={{ width: 120 }}
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
                </Form.Item>
                <Form.Item label="启用日期">
                    <Form.Item valuePropName="checked" name="dayPeriodSwitch" className="dispatch-item-display" noStyle>
                        <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                    </Form.Item>
                    <span className="dispatch-item-margin dispatch-item-font">时间段：</span>
                    <Form.Item labelCol={{ span: 5 }} className="dispatch-item-display" noStyle>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item
                                        name="startUseDate"
                                        // dependencies={['endUseDate']}
                                        className="dispatch-item-time"
                                        rules={[
                                            {
                                                validator: async (rule, val) => {
                                                    const remark = getFieldValue('dayPeriodSwitch');
                                                    if (remark) {
                                                        if (!val) {
                                                            throw new Error('不能为空');
                                                        }
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            disabledDate={(current) => {
                                                // Can not select days after end date
                                                if (!getFieldValue('endUseDate')) {
                                                    return false;
                                                }
                                                return current && current > getFieldValue('endUseDate');
                                            }}
                                            format="YYYY-MM-DD"
                                            placeholder="开始日期"
                                            disabled={!getFieldValue('dayPeriodSwitch')}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                        <span className="dispatch-item-line">—</span>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item
                                        name="endUseDate"
                                        className="dispatch-item-time"
                                        rules={[
                                            {
                                                validator: async (rule, val) => {
                                                    const remark = getFieldValue('dayPeriodSwitch') && !getFieldValue('noEndDate');
                                                    if (remark) {
                                                        if (!val) {
                                                            throw new Error('不能为空');
                                                        }
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            disabledDate={(current) => {
                                                // Can not select days before beigin date
                                                // moment().endOf('day');
                                                return current && current < getFieldValue('startUseDate').endOf('day');
                                            }}
                                            format="YYYY-MM-DD"
                                            placeholder="结束日期"
                                            disabled={!getFieldValue('dayPeriodSwitch') || getFieldValue('noEndDate')}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item
                                    name="noEndDate"
                                    className="dispatch-item-display dispatch-item-margin dispatch-item-font"
                                    valuePropName="checked"
                                >
                                    <Checkbox disabled={!getFieldValue('dayPeriodSwitch')}>无结束日</Checkbox>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Form.Item>
                <Form.Item label="按工作日派单" name="dayOfWeek">
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="请选择"
                        className="dispatch-item-font "
                        style={{ width: '60%' }}
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
                        style={{ width: '60%' }}
                        mode="multiple"
                        placeholder="请选择"
                        className="dispatch-item-font"
                        options={
                            holidaysEnum && holidaysEnum.length > 0
                                ? _.map(holidaysEnum, (item) => {
                                      return { value: item.id, label: `${item.year} - ${item.name}` };
                                  })
                                : []
                        }
                    ></Select>
                </Form.Item>
                <Form.Item
                    label="延迟时间(分钟)"
                    name="delayseconds"
                    rules={[
                        { required: true, message: '不能为空' },
                        {
                            validator: async (rule, val) => {
                                const reg = formatReg.positiveInteger;
                                if (val && !reg.test(val)) {
                                    throw new Error(`必须为非负整数`);
                                }

                                // eslint-disable-next-line no-restricted-properties
                                const max = Math.pow(10, 12) - 1;
                                if (val && val > max) {
                                    throw new Error(`可输入的最大值为${max}`);
                                }
                            },
                        },
                    ]}
                >
                    <InputNumber min={0} style={{ width: '60%' }} className="dispatch-item-font" />
                </Form.Item>
                <Form.Item valuePropName="checked" label="主告警清除后子告警派单功能">
                    <Form.Item valuePropName="checked" name="mainclearSubsendSwitch" className="dispatch-item-display">
                        <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item name="alarmType" className="dispatch-item-display dispatch-item-margin dispatch-item-font">
                                    <Radio.Group
                                        disabled={!getFieldValue('mainclearSubsendSwitch')}
                                        options={[
                                            { label: '条件设置中的告警为主告警', value: 'main_mainclear_subsend' },
                                            { label: '条件设置中的告警为子告警', value: 'sub_mainclear_subsend' },
                                        ]}
                                    ></Radio.Group>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Form.Item>
                <Form.Item valuePropName="checked" label="规则优先级">
                    <Form.Item valuePropName="checked" name="rulePrioritySwitch" className="dispatch-item-display">
                        <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            return (
                                <Form.Item name="rulePriority" className="dispatch-item-display dispatch-item-margin dispatch-item-font">
                                    <Select
                                        disabled={!getFieldValue('rulePrioritySwitch')} // rule_priority
                                        style={{ width: 150 }}
                                        className="dispatch-item-font"
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
                </Form.Item>
                <Form.Item label="关联关系动作" name="relatedAction">
                    <Select
                        style={{ width: '60%' }}
                        className="dispatch-item-font "
                        options={[
                            { label: '独立派单', value: 0 },
                            { label: '关联抑制', value: 1 },
                            { label: '关联打包派单', value: 2 },
                            { label: '只关联打包不单独派单', value: 3 },
                            { label: '关联后主子均不派单', value: 4 },
                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item label="故障处理级别">
                    <Form.Item name="alarmHandleLevel" noStyle className="dispatch-item-time">
                        <Select
                            style={{ width: '30%' }}
                            className="dispatch-item-font "
                            options={[
                                { label: '一级处理', value: 1 },
                                { label: '二级处理', value: 2 },
                                { label: '三级处理', value: 3 },
                                { label: '四级处理', value: 4 },
                                { label: '无', value: 5 },
                            ]}
                        ></Select>
                    </Form.Item>
                    <Form.Item noStyle name="alarmHandleTime" className="dispatch-item-time dispatch-item-font">
                        <InputNumber className="dispatch-item-margin" min={0}></InputNumber>
                    </Form.Item>

                    <span className="dispatch-item-font">（分钟）</span>
                </Form.Item>
            </Form>
        </Fragment>
    );
});
