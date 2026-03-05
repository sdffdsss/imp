import React from 'react';
import { Checkbox, Form, Row, Col, Table, InputNumber, TimePicker, Select, Input, Icon, Tooltip } from 'oss-ui';
import moment from 'moment';
// import request from '../../../../../common/api';
import Enums from '@Common/enum';

const columns = [
    {
        dataIndex: 'taskId',
        title: '任务id',
        width: 120,
    },
    {
        dataIndex: 'subType',
        title: '任务类型',
        width: 200,
        render: (text, record) => {
            return Enums.taskMap.getName(text);
        },
    },
    {
        dataIndex: 'name',
        title: '任务名称',
        ellipsis: true,
        width: 200,
    },
    {
        dataIndex: 'objectName',
        title: '设备类型',
        width: 120,
    },
    {
        dataIndex: 'vendorText',
        title: '厂家',
        width: 150,
    },
    {
        dataIndex: 'cmdline',
        title: '任务脚本',
        width: 220,
    },
    {
        dataIndex: 'description',
        title: '任务描述',
        ellipsis: true,
        width: 150,
    },
];

export default React.forwardRef((props, ref) => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
    const [taskList] = React.useState([
        {
            taskId: 30009,
            subType: '活动告警触发',
            name: '华为_LTE小区不可用告警',
            objectName: 'ENodeB',
            vendorText: '华为',
            cmdline: 'LTECellUnavailable_1HW.groovy',
            description: '华为_LTE小区不可用告警',
        },
        {
            taskId: 30008,
            subType: '活动告警触发',
            name: '中兴_gNodeB退服',
            objectName: 'GNodeB',
            vendorText: '中兴',
            cmdline: 'GNodeBOutService5G_ZTE.groovy',
            description: '中兴_gNodeB退服',
        },
        {
            taskId: 30007,
            subType: '活动告警触发',
            name: '爱立信_网元链路断',
            objectName: 'GNodeB',
            vendorText: '爱立信',
            cmdline: 'NELinkBreak5G_ALX.groovy',
            description: '爱立信_网元链路断',
        },
        {
            taskId: 30005,
            subType: '活动告警触发',
            name: '中兴_DU小区退服',
            objectName: 'GNodeB',
            vendorText: '中兴',
            cmdline: 'DUServiceUnavailable5G_ZTE.groovy',
            description: '中兴_DU小区退服',
        },
        {
            taskId: 30004,
            subType: '活动告警触发',
            name: 'OSPF接口认证失败预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'OSPFInterfaceAuthenticationFailed.groovy',
            description: 'OSPF接口认证失败预处理',
        },
        {
            taskId: 30003,
            subType: '活动告警触发',
            name: 'linkDown智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'LinkDown.groovy',
            description: 'linkDown智能预处理',
        },
        {
            taskId: 30002,
            subType: '活动告警触发',
            name: '物理实体拔出告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'PhysicalEntityChange.groovy',
            description: '物理实体拔出告警智能预处理',
        },
        {
            taskId: 30001,
            subType: '活动告警触发',
            name: 'OSPF接口状态改变告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'OSPFInterfaceStateChange.groovy',
            description: 'OSPF接口状态改变告警智能预处理',
        },
        {
            taskId: 30000,
            subType: '活动告警触发',
            name: 'ISIS邻居状态变化告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'ISISNeighborStateChange.groovy',
            description: 'ISIS邻居状态变化告警智能预处理',
        },
        {
            taskId: 29999,
            subType: '活动告警触发',
            name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'SDHAndCREError.groovy',
            description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        },
        {
            taskId: 29998,
            subType: '活动告警触发',
            name: '存储介质使用率超过预警极限告警预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'StorageMediumUsageExceedsLimit.groovy',
            description: '存储介质使用率超过预警极限告警预处理',
        },
        {
            taskId: 29997,
            subType: '活动告警触发',
            name: 'BGP状态改变告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'BGPStateChange.groovy',
            description: 'BGP状态改变告警智能预处理',
        },
        {
            taskId: 29996,
            subType: '活动告警触发',
            name: '中兴_gNodeB退服',
            objectName: 'GNodeB',
            vendorText: '中兴',
            cmdline: 'GNodeBOutService5G_ZTE.groovy',
            description: '中兴_gNodeB退服',
        },
        {
            taskId: 29995,
            subType: '活动告警触发',
            name: '爱立信_网元链路断',
            objectName: 'GNodeB',
            vendorText: '爱立信',
            cmdline: 'NELinkBreak5G_ALX.groovy',
            description: '爱立信_网元链路断',
        },
        {
            taskId: 29994,
            subType: '活动告警触发',
            name: '中兴_DU小区退服',
            objectName: 'GNodeB',
            vendorText: '中兴',
            cmdline: 'DUServiceUnavailable5G_ZTE.groovy',
            description: '中兴_DU小区退服',
        },
        {
            taskId: 29993,
            subType: '活动告警触发',
            name: 'OSPF接口认证失败预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'OSPFInterfaceAuthenticationFailed.groovy',
            description: 'OSPF接口认证失败预处理',
        },
        {
            taskId: 29992,
            subType: '活动告警触发',
            name: 'linkDown智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'LinkDown.groovy',
            description: 'linkDown智能预处理',
        },
        {
            taskId: 29991,
            subType: '活动告警触发',
            name: '物理实体拔出告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'PhysicalEntityChange.groovy',
            description: '物理实体拔出告警智能预处理',
        },
        {
            taskId: 29990,
            subType: '活动告警触发',
            name: 'OSPF接口状态改变告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'OSPFInterfaceStateChange.groovy',
            description: 'OSPF接口状态改变告警智能预处理',
        },
        {
            taskId: 29989,
            subType: '活动告警触发',
            name: 'ISIS邻居状态变化告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'ISISNeighborStateChange.groovy',
            description: 'ISIS邻居状态变化告警智能预处理',
        },
        {
            taskId: 29988,
            subType: '活动告警触发',
            name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'SDHAndCREError.groovy',
            description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        },
        {
            taskId: 29987,
            subType: '活动告警触发',
            name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'SDHAndCREError.groovy',
            description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        },
        {
            taskId: 29986,
            subType: '活动告警触发',
            name: '存储介质使用率超过预警极限告警预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'StorageMediumUsageExceedsLimit.groovy',
            description: '存储介质使用率超过预警极限告警预处理',
        },
        {
            taskId: 29985,
            subType: '活动告警触发',
            name: 'BGP状态改变告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'BGPStateChange.groovy',
            description: 'BGP状态改变告警智能预处理',
        },
        {
            taskId: 29984,
            subType: '活动告警触发',
            name: '中兴_gNodeB退服',
            objectName: 'GNodeB',
            vendorText: '中兴',
            cmdline: 'GNodeBOutService5G_ZTE.groovy',
            description: '中兴_gNodeB退服',
        },
        {
            taskId: 29983,
            subType: '活动告警触发',
            name: '爱立信_网元链路断',
            objectName: 'GNodeB',
            vendorText: '爱立信',
            cmdline: 'NELinkBreak5G_ALX.groovy',
            description: '爱立信_网元链路断',
        },
        {
            taskId: 29982,
            subType: '活动告警触发',
            name: '中兴_DU小区退服',
            objectName: 'GNodeB',
            vendorText: '中兴',
            cmdline: 'DUServiceUnavailable5G_ZTE.groovy',
            description: '中兴_DU小区退服',
        },
        {
            taskId: 29981,
            subType: '活动告警触发',
            name: 'OSPF接口认证失败预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'OSPFInterfaceAuthenticationFailed.groovy',
            description: 'OSPF接口认证失败预处理',
        },
        {
            taskId: 29980,
            subType: '活动告警触发',
            name: 'linkDown智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'LinkDown.groovy',
            description: 'linkDown智能预处理',
        },
        {
            taskId: 29979,
            subType: '活动告警触发',
            name: '物理实体拔出告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'PhysicalEntityChange.groovy',
            description: '物理实体拔出告警智能预处理',
        },
        {
            taskId: 29978,
            subType: '活动告警触发',
            name: 'OSPF接口状态改变告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'OSPFInterfaceStateChange.groovy',
            description: 'OSPF接口状态改变告警智能预处理',
        },
        {
            taskId: 29977,
            subType: '活动告警触发',
            name: 'ISIS邻居状态变化告警智能预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'ISISNeighborStateChange.groovy',
            description: 'ISIS邻居状态变化告警智能预处理',
        },
        {
            taskId: 29976,
            subType: '活动告警触发',
            name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
            objectName: 'router',
            vendorText: '华为',
            cmdline: 'SDHAndCREError.groovy',
            description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        },
    ]);
    const [form] = Form.useForm();

    // React.useEffect(() => {
    //     request('sysadminFilter/commonoptions',{
    //         type: 'post',
    //         baseUrlType: 'filter',
    //         showSuccessMessage: false,
    //         data: {
    //             commonOptionType: 'TPretreatTask',
    //             iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
    //             param: {},
    //         },
    //     }).then((res) => {
    //         if (res && Array.isArray(res.data)) {
    //             setTaskList(res.data);
    //         }
    //     });
    // }, []);

    const onTaskChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);

        form.setFieldsValue({
            selectedTask: selectedRows[0].taskId,
            selectedTaskName: selectedRows[0].name,
        });
    };

    const initialValues = () => {
        const { initialValues } = props;

        if (!initialValues) {
            return {
                belongRuleID: -1,
                isProjectAlarmNoProcess: true,
                delayTime: 30,
                isforwardTime: false,
                forwardTime: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')],
                relationshipAction: 1,
                frequency: 0,
                selectedTask: '',
                selectedTaskName: '',
            };
        }

        return {
            ...initialValues,
            forwardTime: [moment(initialValues.startTime, 'HH:mm'), moment(initialValues.endTime, 'HH:mm')],
        };
    };
    return (
        <>
            <div style={{ marginBottom: '16px', lineHeight: '32px' }}>规则动作:</div>
            <Form form={form} ref={ref} initialValues={initialValues()} labelCol={{ span: 4 }}>
                <Form.Item hidden label="工程告警不执行预处理" name="belongRuleID">
                    <Input />
                </Form.Item>
                <Form.Item valuePropName="checked" label="工程告警不执行预处理" name="isProjectAlarmNoProcess">
                    <Checkbox>启用</Checkbox>
                </Form.Item>
                <Form.Item label="预处理延时时间" name="delayTime">
                    <InputNumber min={0} style={{ width: '33.33%' }} formatter={(value) => `${value}分钟`} />
                </Form.Item>
                <Row>
                    <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        预处理时间段<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={20}>
                        <Row>
                            <Col span={2}>
                                <Form.Item name="isforwardTime" valuePropName="checked">
                                    <Checkbox>启用</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item noStyle name="forwardTime">
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
                >
                    <Form.Item name="frequency" noStyle label="预处理频次">
                        <InputNumber style={{ width: '33.33%' }} min={0} />
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    name="selectedTaskName"
                    label="选择任务"
                    rules={[
                        {
                            required: true,
                            message: '请选择任务',
                        },
                    ]}
                >
                    <Input style={{ width: '33.33%' }} disabled />
                </Form.Item>
                <Form.Item
                    name="selectedTask"
                    hidden
                    label="选择任务"
                    rules={[
                        {
                            required: true,
                            message: '请选择任务',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Row>
                    <Col span={24} style={{ transform: 'translate(-10px, 0)' }}>
                        <Table
                            size="small"
                            rowKey="taskId"
                            rowClassName={(record, index) =>
                                index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double'
                            }
                            onRow={(record) => ({
                                onClick: () => {
                                    onTaskChange([record.taskId], [record]);
                                },
                            })}
                            rowSelection={{
                                hideSelectAll: true,
                                onChange: onTaskChange,
                                selectedRowKeys,
                                type: 'radio',
                            }}
                            dataSource={taskList}
                            scroll={{ x: 1090, y: 400 }}
                            columns={columns}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    );
});
