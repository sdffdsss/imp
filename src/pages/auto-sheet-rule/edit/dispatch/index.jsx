import React, { useState, useRef, useEffect } from 'react';
import { Checkbox, Switch, Form, InputNumber, TimePicker, Select, DatePicker, Button, Row, Col } from 'oss-ui';
import './index.less';
import { getEditValues, initialValues } from './util';
import request from '@Src/common/api';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import formatReg from '@Common/formatReg';
import qs from 'qs';

import { filterApi } from '../../../../common/api/service/filterApi';
import { getRuleData } from './api';
import Field from '@ant-design/pro-field';
import DatePickTime from '@Components/date-pick-time';

const dayOfWeekSource = [
    { label: '周一', value: 2 },
    { label: '周二', value: 3 },
    { label: '周三', value: 4 },
    { label: '周四', value: 5 },
    { label: '周五', value: 6 },
    { label: '周六', value: 7 },
    { label: '周日', value: 1 },
];

const rulePrioritySource = [
    { label: '低优先级', value: 0 },
    { label: '较低优先级', value: 1 },
    { label: '普通优先级(普通)', value: 2 },
    { label: '较高优先级', value: 3 },
    { label: '高优先级', value: 4 },
];

const relatedActionSource = [
    { label: '独立派单', value: 0 },
    { label: '关联抑制', value: 1 },
    { label: '关联打包派单', value: 2 },
    { label: '只关联打包不单独派单', value: 4 },
    { label: '关联后主子均不派单', value: 5 },
];

const dispatchProfessionOption = [
    { label: '根因专业', value: 0 },
    { label: '告警专业', value: 1 },
];
// const alarmHandleLevelSource = [
//     { label: '一级处理', value: 1 },
//     { label: '二级处理', value: 2 },
//     { label: '三级处理', value: 3 },
//     { label: '四级处理', value: 4 },
//     { label: '无', value: 5 },
// ];

/** *
 * 派单规则编辑，10
 */
export default React.forwardRef((props, ref) => {
    const { disabled, filterIdStateChange, moduleId } = props;
    const mode = disabled ? 'read' : 'edit';
    const [holidaysEnum, setHolidaysEnum] = useState([]);
    const [additionClauses, setAdditionClauses] = useState([]);

    const [ruleSource, handleRuleSource] = useState([]);
    const [faultTypeList, setFaultTypeList] = useState([]);
    const isFirstDispatchProfessional = useRef(true);

    useEffect(() => {
        if (props.provinceId) {
            getRuleData({
                provinceId: props.provinceId,
            }).then((res) => {
                if (res && res.data && Array.isArray(res.data)) {
                    handleRuleSource(
                        res.data.map((item) => {
                            return {
                                label: item.desc,
                                value: item.id,
                            };
                        }),
                    );
                }
            });
        }
    }, [props.provinceId]);

    useEffect(() => {
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                modelId: 2,
                dictName: 'fault_type',
                value: '',
                current: 1,
                pageSize: 50,
                creator: props.login.userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && Array.isArray(res.data)) {
                setFaultTypeList(
                    res.data.map((item) => {
                        return {
                            label: item.value,
                            value: item.key,
                        };
                    }),
                );
            } else {
                setFaultTypeList([]);
            }
        });
    }, []);

    /**
     * 表单值变更事件
     */
    const onValuesChange = (changedValues) => {
        if (changedValues.filterIdType === false || changedValues.filterIdType === true) {
            let filterIdTypeFlag = false;
            if (props.initialValues?.filterIdType !== changedValues.filterIdType && changedValues.filterIdType) {
                filterIdTypeFlag = true;
            }
            console.log(filterIdTypeFlag);
            filterIdStateChange(changedValues.filterIdType, filterIdTypeFlag);
            if (changedValues.filterIdType === true) {
                ref.current.setFieldsValue({
                    relatedAction: 0,
                });
            } else {
                ref.current.setFieldsValue({
                    delayseconds: 0,
                });
                console.log(ref.current.getFieldValue(['delayseconds']));
            }
        }
        if (changedValues.alarmHandleLevel) {
            const level = changedValues.alarmHandleLevel;
            ref.current.setFieldsValue({
                relatedAction: level === 5 ? null : level * 10,
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
        if (!_.isUndefined(changedValues.dispatchProfession)) {
            props.getDispatchSpecialized(changedValues.dispatchProfession);
        }
    };

    const getAdditionClauses = async () => {
        const result = await filterApi.getAdditionClauses();
        setAdditionClauses(result);
    };

    useEffect(() => {
        getAdditionClauses();
    }, []);

    const getHolidaysEnum = () => {
        const param = {
            years: [moment().year(), moment().year() + 1],
        };
        const url = `alarmmodel/filter/v1/filter/dispatch/holidays?${qs.stringify(param, {
            arrayFormat: 'indices',
            encode: true,
        })}`;
        request(url, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
        }).then((res) => {
            if (res && res.data) {
                setHolidaysEnum(res.data);
            }
        });
    };
    useEffect(() => {
        getHolidaysEnum();
        if (props.modelType !== 'new') {
            if (ref.current) {
                if (props.actionInfoFormCache && !_.isEmpty(props.actionInfoFormCache)) {
                    ref.current.setFieldsValue({ ...props.actionInfoFormCache });
                } else if (props.initialValues && props.initialValues.filterProperties) {
                    const editValues = getEditValues(props.initialValues.filterProperties);
                    const { ruleType, ruleSwitch } = props.initialValues;
                    if (isFirstDispatchProfessional.current) {
                        props.getDispatchSpecialized(editValues.dispatchProfession);
                        isFirstDispatchProfessional.current = false;
                    }
                    ref.current.setFieldsValue({ ...editValues, ruleType, ruleSwitch: ruleSwitch === 1 });
                }
            }
        }
    }, [props.initialValues, props.modelType, props.actionInfoFormCache, ref]);

    const validateTime = async (rule, value) => {
        const alarm_recovery_time_end = ref.current.getFieldValue('alarm_recovery_time_end');
        if (alarm_recovery_time_end === '当天') {
            return;
        }
        if (!value) {
            throw new Error('请输入告警追加时限');
        }
        if (isNaN(value) || Number(value) < 0 || value.toString().includes('.') || value.toString().includes('-')) {
            throw new Error('请输入一个正整数');
        }
    };

    const onTimeChange = (value) => {
        if (value === -1) {
            ref.current.validateFields(['validate']);
        }
    };

    /**
     * 编辑界面设置数值回填
     */

    // 渲染switch
    const switchRender = (rule) => {
        if (mode === 'read' && rule) {
            return '开';
        }
        if (mode === 'read' && !rule) {
            return '关';
        }
        if (mode !== 'read') {
            return <Switch checkedChildren="开" unCheckedChildren="关" size="small" />;
        }
    };

    const sourceToEnum = (source = {}) => {
        const arr = {};
        source.map((item) => {
            arr[item.value] = { text: item.label };
        });
        return arr;
    };
    // 筛选不需要字段
    const formOverflowList = ['605'];

    const nonForwardProcessOptions = [
        { label: '下个派单时段派单', value: 1 },
        { label: '丢弃', value: 0 },
    ];

    return (
        <>
            {/* <Button
                onClick={() => {
                    const a = ref.current.getFieldsValue();
                    console.log(a);
                }}
            >
                测试2
            </Button> */}
            <Form
                labelCol={{ span: 5 }}
                ref={ref}
                className="dispatch-content"
                initialValues={initialValues}
                onValuesChange={onValuesChange}
                name="dispatchRule"
            >
                {/* <Form.Item
                    valuePropName="checked"
                    wrapperCol={{ span: 2 }}
                    name="restrainProjectAlarm"
                    label="工程告警抑制派单"
                >
                    <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                </Form.Item> */}
                {/* <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Form.Item valuePropName="checked" wrapperCol={{ span: 2 }} name="prehandle" label="需要系统完成T1预处理">
                                {switchRender(getFieldValue('prehandle'))}
                            </Form.Item>
                        );
                    }}
                </Form.Item> */}
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return formOverflowList.includes(moduleId) ? null : (
                            <Form.Item label="是否派单" name="filterIdType" valuePropName="checked" shouldUpdate>
                                {switchRender(getFieldValue('filterIdType'))}
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                        getFieldValue('filterIdType') ? (
                            <>
                                {formOverflowList.includes(moduleId) ? null : (
                                    <Form.Item label="派单专业" required name="dispatchProfession">
                                        <Field
                                            mode={mode}
                                            valueEnum={sourceToEnum(dispatchProfessionOption)}
                                            renderFormItem={() => {
                                                return (
                                                    <Select
                                                        placeholder="请选择"
                                                        style={{ width: 150 }}
                                                        className="dispatch-item-font"
                                                        options={dispatchProfessionOption}
                                                    />
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                )}

                                <Form.Item label="派单时间段">
                                    <div style={{ display: 'grid', gridTemplateColumns: '50px 260px 200px' }}>
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item
                                                        name="dispatchTimerangeSwitch"
                                                        valuePropName="checked"
                                                        className="dispatch-item-display"
                                                    >
                                                        {switchRender(getFieldValue('dispatchTimerangeSwitch'))}
                                                    </Form.Item>
                                                );
                                            }}
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
                                                        <Field
                                                            mode={mode}
                                                            valueType="timeRange"
                                                            renderFormItem={() => {
                                                                return (
                                                                    <DatePickTime
                                                                        format="HH:mm:ss"
                                                                        disabled={!getFieldValue('dispatchTimerangeSwitch')}
                                                                    />
                                                                );
                                                            }}
                                                            render={(value) => {
                                                                const [start, end] = value;

                                                                return (
                                                                    <div>
                                                                        {start.format('HH:mm:ss')} - {end.format('HH:mm:ss')}
                                                                    </div>
                                                                );
                                                            }}
                                                        />
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
                                                        <Field
                                                            mode={mode}
                                                            valueEnum={{
                                                                0: {
                                                                    text: '丢弃',
                                                                },
                                                                1: {
                                                                    text: '下个派单时段派单',
                                                                },
                                                            }}
                                                            renderFormItem={() => {
                                                                return (
                                                                    <Select
                                                                        placeholder="请选择"
                                                                        disabled={!getFieldValue('dispatchTimerangeSwitch')}
                                                                        style={{ width: 150 }}
                                                                        options={nonForwardProcessOptions}
                                                                    />
                                                                );
                                                            }}
                                                            render={(value) => {
                                                                const thisItem = nonForwardProcessOptions.find((el) => el.value === value);
                                                                return <div style={{ width: 150 }}>{thisItem?.label}</div>;
                                                            }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </div>
                                </Form.Item>
                                <Form.Item label="启用日期">
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item valuePropName="checked" name="dayPeriodSwitch" className="dispatch-item-display" noStyle>
                                                    {switchRender(getFieldValue('dayPeriodSwitch'))}
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                    <span className="dispatch-item-margin dispatch-item-font" style={{ marginLeft: '38px' }}>
                                        时间段：
                                    </span>
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
                                                        <Field
                                                            mode={mode}
                                                            valueType="date"
                                                            renderFormItem={() => {
                                                                return (
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
                                                                );
                                                            }}
                                                            render={(value) => {
                                                                return (
                                                                    <div style={{ width: 65, lineHeight: '30px' }}>{value.format('YYYY-MM-DD')}</div>
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        <span className="dispatch-item-line">-</span>
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
                                                        <Field
                                                            mode={mode}
                                                            valueType="date"
                                                            renderFormItem={() => {
                                                                return (
                                                                    <DatePicker
                                                                        disabledDate={(current) => {
                                                                            return (
                                                                                current &&
                                                                                getFieldValue('startUseDate') &&
                                                                                current < getFieldValue('startUseDate').endOf('day')
                                                                            );
                                                                        }}
                                                                        format="YYYY-MM-DD"
                                                                        placeholder="结束日期"
                                                                        disabled={!getFieldValue('dayPeriodSwitch') || getFieldValue('noEndDate')}
                                                                    />
                                                                );
                                                            }}
                                                            render={(value) => {
                                                                if (!value) return null;
                                                                return (
                                                                    <div style={{ width: 65, lineHeight: '30px' }}>{value.format('YYYY-MM-DD')}</div>
                                                                );
                                                            }}
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
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            return getFieldValue('noEndDate') ? '无结束日' : '';
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Checkbox
                                                                    checked={getFieldValue('noEndDate')}
                                                                    disabled={!getFieldValue('dayPeriodSwitch')}
                                                                >
                                                                    无结束日
                                                                </Checkbox>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="按工作日派单" name="dayOfWeek">
                                    <Field
                                        mode={mode}
                                        valueEnum={sourceToEnum(dayOfWeekSource)}
                                        renderFormItem={() => {
                                            return (
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    placeholder="请选择"
                                                    className="dispatch-item-font "
                                                    style={{ width: '60%' }}
                                                    options={dayOfWeekSource}
                                                />
                                            );
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {() => {
                                        const arr = {};
                                        if (holidaysEnum) {
                                            holidaysEnum.map((item) => {
                                                arr[item.id] = { text: `${item.year} - ${item.name}` };
                                                return arr;
                                            });
                                        }
                                        return (
                                            <Form.Item label="节假日不派单" name="holidays">
                                                <Field
                                                    mode={mode}
                                                    valueEnum={arr}
                                                    renderFormItem={() => {
                                                        return (
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
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                <Form.Item
                                    label="延迟时间(分钟)"
                                    name="delayseconds"
                                    style={{ marginBottom: 0 }}
                                    rules={[
                                        { required: true, message: '不能为空' },
                                        {
                                            validator: async (rule, val) => {
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
                                    <Field
                                        mode={mode}
                                        renderFormItem={() => {
                                            return <InputNumber min={0} style={{ width: '60%' }} className="dispatch-item-font" />;
                                        }}
                                    />
                                </Form.Item>
                                <div>
                                    <Row>
                                        <Col span={5}></Col>
                                        <Col span={19} className="dispatch-annotation">
                                            字段说明：以告警发现时间为基准，延迟派单的时间
                                        </Col>
                                    </Row>
                                </div>
                                {/* <Form.Item valuePropName="checked" label="主告警清除后子告警派单功能">
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item valuePropName="checked" name="mainclearSubsendSwitch" className="dispatch-item-display">
                                                    {switchRender(getFieldValue('mainclearSubsendSwitch'))}
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item name="alarmType" className="dispatch-item-display dispatch-item-margin dispatch-item-font">
                                                    <Field
                                                        mode={mode}
                                                        valueType="radio"
                                                        valueEnum={{
                                                            main_mainclear_subsend: {
                                                                text: '条件设置中的告警为主告警',
                                                            },
                                                            sub_mainclear_subsend: {
                                                                text: '条件设置中的告警为子告警',
                                                            },
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Radio.Group
                                                                    disabled={!getFieldValue('mainclearSubsendSwitch')}
                                                                    options={[
                                                                        { label: '条件设置中的告警为主告警', value: 'main_mainclear_subsend' },
                                                                        { label: '条件设置中的告警为子告警', value: 'sub_mainclear_subsend' },
                                                                    ]}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item> */}
                                <Form.Item label="是否抄送本端">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item name="copyLocal" valuePropName="checked" style={{ marginBottom: 0 }}>
                                                        {switchRender(getFieldValue('copyLocal'))}
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        <Form.Item style={{ marginLeft: 20, marginBottom: 0, paddingTop: 4, color: 'rgba(0,0,0,0.25)' }}>
                                            字段说明：仅适用于告警对端派单规则
                                        </Form.Item>
                                    </div>
                                </Form.Item>

                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return formOverflowList.includes(moduleId) ? null : (
                                            <Form.Item name="alarm_recovery" label="是否自动告警追加" valuePropName="checked">
                                                {switchRender(getFieldValue('alarm_recovery'))}
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) =>
                                        getFieldValue('alarm_recovery') ? (
                                            <>
                                                <Form.Item label="告警追加时限" name="validate">
                                                    <Row style={{ alignItems: 'flex-start' }}>
                                                        <Col>
                                                            <Field
                                                                mode={mode}
                                                                render={() => {
                                                                    const str = getFieldValue('alarm_recovery_time_end') === 0 ? '自定义' : '当天';
                                                                    return <span style={{ lineHeight: '28px' }}>{str}</span>;
                                                                }}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Form.Item name="alarm_recovery_time_end" style={{ margin: 0 }}>
                                                                            <Select onChange={onTimeChange} style={{ width: '100px' }}>
                                                                                <Select.Option value={0}>自定义</Select.Option>
                                                                                <Select.Option value={'当天'}>当天</Select.Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        {!getFieldValue('alarm_recovery_time_end') ? (
                                                            <Col style={{ marginLeft: '10px' }}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    className="alarm_recovery_time_end"
                                                                    name="alarm_recovery_time_end_real"
                                                                    rules={[{ validator: validateTime }]}
                                                                >
                                                                    <Field
                                                                        mode={mode}
                                                                        renderFormItem={() => {
                                                                            return <InputNumber />;
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        ) : null}
                                                        {!getFieldValue('alarm_recovery_time_end') ? (
                                                            <Col style={{ marginLeft: '10px', marginTop: '2px' }}>
                                                                <span style={{ lineHeight: '22px' }}>分钟</span>
                                                            </Col>
                                                        ) : null}
                                                    </Row>
                                                </Form.Item>
                                                <Form.Item noStyle shouldUpdate>
                                                    {() => {
                                                        const arr = [];
                                                        additionClauses.map((item) => {
                                                            arr[item.fieldName] = { text: item.fieldLabel };
                                                            return arr;
                                                        });
                                                        return (
                                                            <Form.Item name="alarm_recovery_condition" label="告警追加条件">
                                                                <Field
                                                                    mode={mode}
                                                                    valueEnum={arr}
                                                                    renderFormItem={() => {
                                                                        return (
                                                                            <Checkbox.Group>
                                                                                {additionClauses.map((item) => (
                                                                                    <Checkbox key={item.fieldId} value={item.fieldName}>
                                                                                        {item.fieldLabel}
                                                                                    </Checkbox>
                                                                                ))}
                                                                            </Checkbox.Group>
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        );
                                                    }}
                                                </Form.Item>
                                            </>
                                        ) : null
                                    }
                                </Form.Item>
                                {formOverflowList.includes(moduleId) ? null : (
                                    <Form.Item valuePropName="checked" label="规则优先级">
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item valuePropName="checked" name="rulePrioritySwitch" className="dispatch-item-display">
                                                        {switchRender(getFieldValue('rulePrioritySwitch'))}
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item
                                                        name="rulePriority"
                                                        className="dispatch-item-display dispatch-item-margin dispatch-item-font"
                                                    >
                                                        <Field
                                                            mode={mode}
                                                            valueEnum={sourceToEnum(rulePrioritySource)}
                                                            renderFormItem={() => {
                                                                return (
                                                                    <Select
                                                                        disabled={!getFieldValue('rulePrioritySwitch')} // rule_priority
                                                                        style={{ width: 150 }}
                                                                        className="dispatch-item-font"
                                                                        options={rulePrioritySource}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </Form.Item>
                                )}

                                <Form.Item label="关联关系动作" name="relatedAction">
                                    <Field
                                        mode={mode}
                                        valueEnum={sourceToEnum(relatedActionSource)}
                                        renderFormItem={() => {
                                            return <Select style={{ width: '60%' }} className="dispatch-item-font " options={relatedActionSource} />;
                                        }}
                                    />
                                </Form.Item>
                                {/* {formOverflowList.includes(moduleId) ? null : ( */}
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item label="同步创建过滤器" name="synchroFilter" valuePropName="checked" shouldUpdate>
                                                {switchRender(getFieldValue('synchroFilter'))}
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                {/* )} */}
                                {formOverflowList.includes(moduleId) ? null : (
                                    <Form.Item valuePropName="checked" label="分享至规则库">
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item valuePropName="checked" name="ruleSwitch" className="dispatch-item-display">
                                                        {switchRender(getFieldValue('ruleSwitch'))}
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate>
                                            {({ getFieldValue }) => {
                                                if (getFieldValue('ruleSwitch')) {
                                                    return (
                                                        <Form.Item
                                                            label="规则类型"
                                                            name="ruleType"
                                                            className="dispatch-item-display dispatch-item-margin dispatch-item-font"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '请选择规则库',
                                                                },
                                                            ]}
                                                        >
                                                            <Field
                                                                mode={mode}
                                                                valueEnum={sourceToEnum(ruleSource)}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Select
                                                                            disabled={!getFieldValue('ruleSwitch')} // rule_priority
                                                                            style={{ width: 150 }}
                                                                            className="dispatch-item-font"
                                                                            options={ruleSource}
                                                                        />
                                                                    );
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    );
                                                }
                                            }}
                                        </Form.Item>
                                    </Form.Item>
                                )}

                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item label="故障类别" required name="faultType" shouldUpdate>
                                                <Field
                                                    mode={mode}
                                                    valueEnum={sourceToEnum(faultTypeList)}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Select
                                                                placeholder="请选择"
                                                                style={{ width: 150 }}
                                                                className="dispatch-item-font"
                                                                options={faultTypeList}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item label="派单专业" required name="dispatchProfession" shouldUpdate>
                                    <Field
                                        mode={mode}
                                        valueEnum={sourceToEnum(dispatchProfessionOption)}
                                        renderFormItem={() => {
                                            return (
                                                <Select
                                                    disabled
                                                    placeholder="请选择"
                                                    style={{ width: 150 }}
                                                    className="dispatch-item-font"
                                                    options={dispatchProfessionOption}
                                                />
                                            );
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="不派单时间段">
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item name="dispatchTimerangeSwitch" valuePropName="checked" className="dispatch-item-display">
                                                    {switchRender(getFieldValue('dispatchTimerangeSwitch'))}
                                                </Form.Item>
                                            );
                                        }}
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
                                                    <Field
                                                        mode={mode}
                                                        className=""
                                                        valueType="timeRange"
                                                        renderFormItem={() => {
                                                            return (
                                                                <TimePicker.RangePicker
                                                                    format="HH:mm:ss"
                                                                    disabled={!getFieldValue('dispatchTimerangeSwitch')}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="不派单启用日期">
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item valuePropName="checked" name="dayPeriodSwitch" className="dispatch-item-display" noStyle>
                                                    {switchRender(getFieldValue('dayPeriodSwitch'))}
                                                </Form.Item>
                                            );
                                        }}
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
                                                        <Field
                                                            mode={mode}
                                                            valueType="date"
                                                            renderFormItem={() => {
                                                                return (
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
                                                                );
                                                            }}
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
                                                        <Field
                                                            mode={mode}
                                                            valueType="date"
                                                            renderFormItem={() => {
                                                                return (
                                                                    <DatePicker
                                                                        disabledDate={(current) => {
                                                                            return (
                                                                                current &&
                                                                                getFieldValue('startUseDate') &&
                                                                                current < getFieldValue('startUseDate').endOf('day')
                                                                            );
                                                                        }}
                                                                        format="YYYY-MM-DD"
                                                                        placeholder="结束日期"
                                                                        disabled={!getFieldValue('dayPeriodSwitch') || getFieldValue('noEndDate')}
                                                                    />
                                                                );
                                                            }}
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
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            return getFieldValue('noEndDate') ? '无结束日' : '';
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Checkbox
                                                                    checked={getFieldValue('noEndDate')}
                                                                    disabled={!getFieldValue('dayPeriodSwitch')}
                                                                >
                                                                    无结束日
                                                                </Checkbox>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item valuePropName="checked" label="规则优先级">
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item valuePropName="checked" name="rulePrioritySwitch" className="dispatch-item-display">
                                                    {switchRender(getFieldValue('rulePrioritySwitch'))}
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item
                                                    name="rulePriority"
                                                    className="dispatch-item-display dispatch-item-margin dispatch-item-font"
                                                >
                                                    <Field
                                                        mode={mode}
                                                        valueEnum={sourceToEnum(rulePrioritySource)}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select
                                                                    disabled={!getFieldValue('rulePrioritySwitch')} // rule_priority
                                                                    style={{ width: 150 }}
                                                                    className="dispatch-item-font"
                                                                    options={rulePrioritySource}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item label="同步创建过滤器" name="synchroFilter" valuePropName="checked" shouldUpdate>
                                                {switchRender(getFieldValue('synchroFilter'))}
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                <Form.Item valuePropName="checked" label="分享至规则库">
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item valuePropName="checked" name="ruleSwitch" className="dispatch-item-display">
                                                    {switchRender(getFieldValue('ruleSwitch'))}
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            if (getFieldValue('ruleSwitch')) {
                                                return (
                                                    <Form.Item
                                                        label="规则类型"
                                                        name="ruleType"
                                                        className="dispatch-item-display dispatch-item-margin dispatch-item-font"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请选择规则库',
                                                            },
                                                        ]}
                                                    >
                                                        <Field
                                                            mode={mode}
                                                            valueEnum={sourceToEnum(ruleSource)}
                                                            renderFormItem={() => {
                                                                return (
                                                                    <Select
                                                                        disabled={!getFieldValue('ruleSwitch')} // rule_priority
                                                                        style={{ width: 150 }}
                                                                        className="dispatch-item-font"
                                                                        options={ruleSource}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }
                                        }}
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item
                                    label="延迟时间(分钟)"
                                    name="delayseconds"
                                    hidden={true}
                                    rules={[
                                        { required: true, message: '不能为空' },
                                        {
                                            validator: async (rule, val) => {
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
                                    <Field
                                        mode={mode}
                                        renderFormItem={() => {
                                            return <InputNumber min={0} style={{ width: '60%' }} className="dispatch-item-font" />;
                                        }}
                                    />
                                </Form.Item>
                            </>
                        )
                    }
                </Form.Item>

                {/* <Form.Item label="延迟时间" name="delayTime">
                    
                   <Radio.Group className="dispatch-item-font">
                        <Radio value={0}>
                            <span>规则设置</span>
                            <Form.Item noStyle shouldUpdate>
                                {({ getFieldValue }) => {
                                    return (
                                        <Form.Item noStyle name="delayseconds">
                                            <InputNumber
                                                disabled={getFieldValue('delayTime') === 1}
                                                className="dispatch-item-margin"
                                                min={0}
                                            />
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                            <span>（分钟）</span>
                        </Radio>
                        <Radio value={1}>采用花名册或资源时延</Radio>
                    </Radio.Group> </Form.Item> */}

                {/* <Form.Item label="故障处理级别">
                    <Form.Item name="alarmHandleLevel" noStyle className="dispatch-item-time">
                        <Field
                            mode={mode}
                            valueEnum={sourceToEnum(alarmHandleLevelSource)}
                            renderFormItem={() => {
                                return <Select style={{ width: '30%' }} className="dispatch-item-font " options={alarmHandleLevelSource} />;
                            }}
                        />
                    </Form.Item>
                    <Form.Item noStyle name="alarmHandleTime" className="dispatch-item-time dispatch-item-font">
                        <Field
                            mode={mode}
                            renderFormItem={() => {
                                return <InputNumber className="dispatch-item-margin" min={0} />;
                            }}
                        />
                    </Form.Item>

                    <span className="dispatch-item-font">（分钟）</span>
                </Form.Item> */}
            </Form>
        </>
    );
});
