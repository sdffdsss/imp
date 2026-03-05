import React, { Fragment } from 'react';
import { Form, Row, Col, Switch, InputNumber, TimePicker, Select, Input, Icon, Tooltip, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import request from '@Src/common/api';
import { columns, getEditValues, initialValues } from './util';
import { _ } from 'oss-web-toolkits';
import formatReg from '@Common/formatReg';

export default React.forwardRef((props, ref) => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
    // const [form] = Form.useForm();

    const onTaskChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        ref.current.setFieldsValue({
            selectedTask: selectedRows[0].task_id,
            selectedTaskName: selectedRows[0].task_name,
        });
    };

    /**
     * 表单值变更事件
     */
    const onValuesChange = (changedValues) => {
        if (!_.isUndefined(changedValues.isforwardTime)) {
            ref.current.validateFields(['forwardTime']);
        }
    };

    /**
     * 表单校验-预处理任务选择，因为该属性在表单中的较后位置，单require校验容易被遮挡，因此添加自定义校验
     */
    const validatorTask = async (rule, val, callback) => {
        if (!val) {
            message.error('请选择预处理任务');
        } else {
            callback();
        }
    };
    const validatorNumber = async (rule, val, callback) => {
        const reg = formatReg.positiveInteger;
        if (val && !reg.test(val)) {
            throw new Error(`必须为非负整数`);
        }

        const max = Math.pow(10, 12) - 1;
        if (val > max) {
            throw new Error(`可输入的最大值为${max}`);
        } else {
            callback();
        }
    };
    /**
     * 编辑界面设置数值回填
     */
    React.useEffect(() => {
        if (!(props.modelType === 'new')) {
            if (ref.current && props.initialValues) {
                const editValues = getEditValues(props.initialValues);
                // debugger;
                ref.current.setFieldsValue(editValues);
                setSelectedRowKeys(editValues.selectedTask);
            }
        }
    }, [props.initialValues, props.modelType, ref]);

    return (
        <Fragment>
            <div style={{ marginBottom: '16px', lineHeight: '32px' }}>规则动作:</div>
            <Form
                name="preTreatRule"
                scrollToFirstError="true"
                ref={ref}
                initialValues={initialValues}
                labelCol={{ span: 4 }}
                onValuesChange={onValuesChange}
            >
                <Form.Item hidden label="工程告警不执行预处理" name="belongRuleID">
                    <Input allowClear />
                </Form.Item>
                <Form.Item valuePropName="checked" label="工程告警不执行预处理" name="isProjectAlarmNoProcess">
                    <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                </Form.Item>
                <Form.Item
                    label="预处理时延(分钟)"
                    name="delayTime"
                    rules={[
                        { required: true, message: `请输入预处理时延` },
                        {
                            validator: validatorNumber,
                        },
                    ]}
                >
                    <InputNumber min={0} style={{ width: '33.33%' }} />
                </Form.Item>
                <Row>
                    <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        预处理时间段<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={20}>
                        <Row>
                            <Col span={2}>
                                <Form.Item name="isforwardTime" valuePropName="checked">
                                    <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                name="forwardTime"
                                                rules={[
                                                    {
                                                        validator: async (rule, val, callback) => {
                                                            const remark = getFieldValue('isforwardTime');
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
                                                <TimePicker.RangePicker
                                                    style={{ width: '100%' }}
                                                    disabled={!getFieldValue('isforwardTime')}
                                                    format="HH:mm"
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item name="relationshipAction" label="关联关系动作">
                    <Select
                        style={{ width: '33.33%' }}
                        placeholder="请选择"
                        options={[
                            { label: '无', value: 1 },
                            { label: '抑制', value: 0 },
                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label={
                        <>
                            <span>预处理频次</span>
                            <Tooltip title="超过频次不再自动执行，0为无限制">
                                <Icon style={{ marginLeft: 8 }} antdIcon type="QuestionCircleOutlined" />
                            </Tooltip>
                        </>
                    }
                    name="frequency"
                    rules={[
                        { required: true, message: `请输入预处理频次` },
                        {
                            validator: validatorNumber,
                        },
                    ]}
                >
                    <InputNumber style={{ width: '33.33%' }} min={0} />
                </Form.Item>
                <Form.Item
                    name="selectedTaskName"
                    label="选择任务"
                    rules={[
                        { required: true, message: `请在下方列表中选择任务` },
                        {
                            validator: validatorTask,
                        },
                    ]}
                >
                    <Input style={{ width: '33.33%' }} disabled />
                </Form.Item>
                <Form.Item name="selectedTask" hidden label="选中的任务ID">
                    <Input />
                </Form.Item>
            </Form>
            <div min="400px" style={{ height: '30%' }}>
                <VirtualTable
                    bordered
                    global={window} // 必填项
                    size="small"
                    rowKey="task_id"
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    onRow={(record) => ({
                        onClick: () => {
                            onTaskChange([record.task_id], [record]);
                        },
                    })}
                    rowSelection={{
                        hideSelectAll: true,
                        onChange: onTaskChange,
                        selectedRowKeys,
                        type: 'radio',
                    }}
                    // scroll={{ x: 1090, y: 600 }}
                    columns={columns}
                    toolBarRender={false}
                    tableAlertRender={false}
                    search={false}
                    options={false}
                    pagination={{
                        pageSize: 10,
                    }}
                    request={(params, sorter, filter) => {
                        // 表单搜索项会从 params 传入，传递给后端接口。
                        return request('tasks', {
                            type: 'get',
                            baseUrlType: 'preProcessingManagementUrl',
                            showSuccessMessage: false,
                            data: {
                                page: params.current,
                                number: params.pageSize,
                            },
                        }).then((result) => {
                            return {
                                data: result.rows,
                                // success 请返回 true，
                                // 不然 table 会停止解析数据，即使有数据
                                success: true,
                                // 不传会使用 data 的长度，如果是分页一定要传
                                total: result.total,
                            };
                        });
                    }}
                />
            </div>
        </Fragment>
    );
});
