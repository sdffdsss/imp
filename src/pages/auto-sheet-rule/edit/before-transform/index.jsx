import React from 'react';
import {
    Switch,
    Space,
    Form,
    Row,
    Col,
    Modal,
    InputNumber,
    TimePicker,
    Select,
    DatePicker,
    Radio,
    Input,
    Button,
    Tabs,
    Table,
    Checkbox,
    message,
} from 'oss-ui';
import request from '@Common/api';
import SMSTemplate from '@Components/sms-template';
import Edit from '@Components/sms-template/edit';
import Immutable from 'immutable';
import { _ } from 'oss-web-toolkits';
import { getEditValues, initialValues } from './util';
import formatReg from '@Common/formatReg';
import { limitDecimals } from '@Common/format';

const { TabPane } = Tabs;

export default React.forwardRef((props, ref) => {
    const ENUMSNUMS = ['一', '二', '三', '四', '五'];
    const [visible, setVisible] = React.useState(false);
    const [editVisible, setEditVisible] = React.useState(false);
    const [tabNum, setTabNum] = React.useState(
        props.modelType === 'new'
            ? 1
            : props.initialValues && Array.isArray(props.initialValues) && props.initialValues.find((item) => item.key === 'frequency')
                ? props.initialValues.find((item) => item.key === 'frequency').value
                : 1
    );
    const [optionKey, setOptionKey] = React.useState('');
    const [selectValue, setSelectValue] = React.useState(undefined);
    const [userGroupList, setUserGroupList] = React.useState([]);
    const [smsTemplateList, setSmsTemplateList] = React.useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = React.useState({ rowKeys: [] });
    const [userTableData, setUserTableData] = React.useState({ tableData: [] });
    const [tabKey, setTabKey] = React.useState('0');
    const [form] = Form.useForm();
    const setInitialValues = () => {
        const { modelType } = props;
        if (!(modelType === 'new') && ref.current) {
            const { initialValues } = props;
            const editValues = getEditValues(initialValues);
            ref.current.setFieldsValue(editValues);
        }
    };

    const showSMSTemplateClick = () => {
        setVisible(true);
    };
    const showSMSTemplateEditClick = () => {
        setEditVisible(true);
    };
    const onEditVisibleChange = (visible) => {
        setEditVisible(visible);
    };
    const onCancel = () => {
        setVisible(false);
    };
    const tabNumChange = (value) => {
        if (/^[1-5]$/.test(value)) {
            setTabNum(value);
        }
        if (!value) {
            setTabNum(1);
        }
    };
    const userGroupChang = (value, option, key) => {
        getUserTableData(key, value);
    };

    const getSmsTemplateList = () => {
        request('alarmmodel/filter/v1/filter/smsTemplate', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                userName: props.login.userName,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data) {
                setOptionKey(res.data.optionKey);
                if (res.data.smsTemplateList && res.data.smsTemplateList.length) {
                    const smsList = res.data.smsTemplateList.map((item) => ({
                        label: item.templateName,
                        value: item.templateContent,
                    }));
                    setSelectValue(undefined);
                    // form.setFieldsValue({ smsTitle: '', cancelTitle: '' });
                    setSmsTemplateList(smsList);
                }
            } else if (res && !res.data) {
                // 后端没数据时无法返回optionKey，需要从上层获取
                setOptionKey(props.login.userName);
            }
        });
    };
    const renderTabs = () => {
        const tabArr = [];
        for (let i = 1; i <= tabNum; i++) {
            tabArr.push({
                id: i,
                name: `第${ENUMSNUMS.find((item, index) => index + 1 === i)}次`,
                userGroup: undefined,
                times: i === 1 ? undefined : 0,
                userIds: '',
            });
        }
        if (tabNum < form.getFieldValue('everyTimes').length) {
            const $newData = Immutable.fromJS(form.getFieldValue('everyTimes'));
            // console.log($newData.pop().toJS(), $newData.setSize(tabNum).toJS());
            form.setFieldsValue({ everyTimes: $newData.setSize(tabNum).toJS() });
        } else if (form.getFieldValue('everyTimes').length === 1 && !form.getFieldValue('everyTimes')[0].id) {
            form.setFieldsValue({ everyTimes: tabArr });
        } else {
            form.setFieldsValue({ everyTimes: _.unionBy(form.getFieldValue('everyTimes'), tabArr, 'id') });
        }
    };

    const disabledDate = (current) => {
        // Can not select days before beigin date
        return current && current < form.getFieldValue('startForwardDate').endOf('day');
    };
    const disabledDateBegin = (current) => {
        // Can not select days after end date
        if (!form.getFieldValue('endForwardDate')) {
            console.log(form.getFieldValue('endForwardDate'));
            return false;
        }
        return current && current > form.getFieldValue('endForwardDate');

    };
    const getUserGroupList = () => {
        request('alarmmodel/filter/v1/filter/usergroup', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data) {
                const list = res.data.map((item) => ({ label: item.groupName, value: item.groupId }));
                setUserGroupList(list);
            }
        });
    };
    const getUserTableData = (key, groupId) => {
        request('alarmmodel/filter/v1/filter/userinfo', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                groupId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data) {
                if (key != null) {
                    setUserTableData({ ...userTableData, [`tableData${key}`]: res.data });
                } else {
                    setUserTableData({ ...userTableData, tableData: res.data });
                }
            }
        });
    };
    const rowChange = (selectedRowKey, selectedRows, fieldName) => {
        const everyTimesList = _.cloneDeep(form.getFieldValue('everyTimes'));
        everyTimesList[fieldName].userIds = selectedRows.map((item) => item.userId).join();
        form.setFieldsValue({ everyTimes: everyTimesList });
        setSelectedRowKeys({ ...selectedRowKeys, [`${fieldName}_rowKeys`]: selectedRowKey });
    };
    const rowSelection = {
        hideSelectAll: true,
    };
    const setSmsContentValue = (value) => {
        form.setFieldsValue({ smsTitle: value });
        form.setFieldsValue({ cancelTitle: `告警已于<cancel_time>清除，${value}` });
    };
    React.useEffect(() => {
        renderTabs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabNum]);
    React.useEffect(() => {
        getUserGroupList();
        getUserTableData();
        getSmsTemplateList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        setInitialValues();
        const keyObj = {};
        form.getFieldValue('everyTimes').forEach((item, index) => (keyObj[`${index}_rowKeys`] = item.userIds ? item.userIds.split(',') : []));
        setSelectedRowKeys({ ...selectedRowKeys, ...keyObj });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialValues]);
    const smsTitleChange = (e) => {
        // console.log(e.target.value);
        setSmsContentValue(e.target.value);
    };
    const forwardDateChange = (checked) => {
        if (!checked) {
            form.setFieldsValue({ noEndDate: checked });
        }
    };

    const changeTab = (activeKey) => {
        if (activeKey === tabKey) {

        } else {
            const list = form.getFieldValue('everyTimes');
            const num = list.findIndex((item, index) => {
                if (index < activeKey) {
                    return !item.userIds && !item.temporaryNum;
                }
            });
            if (num === -1) {
                setTabKey(activeKey);
            } else {
                message.error(`第${num + 1}次前转未设置用户，请设置`);
            }
        }
    };
    const noEndDateChange = (e) => {
        if (e.target.checked) {
            form.setFieldsValue({ endForwardDate: null });
            form.validateFields(['endForwardDate']);
        }
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>

            <Form
                initialValues={initialValues} // , transformMode: props.moduleId
                labelCol={{ span: 3 }}
                form={form}
                ref={ref}
            >
                {/* <Form.Item label="前转模式" name="transformMode">
                    <Radio.Group
                        options={[
                            { label: 'IVR呼叫', value: 14 },
                            { label: '短信前转', value: 4 },
                            { label: '呼叫并前转', value: 18 },
                        ]}
                    ></Radio.Group>
                </Form.Item> */}

                <Form.Item
                    label="延时时间（分钟）"
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
                    <InputNumber min={0} maxLength={12} formater={limitDecimals} parser={limitDecimals} />
                </Form.Item>

                <Row>
                    <Col span={3} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        启用时间<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={21}>
                        <Row>
                            <Col span={3}>
                                <Form.Item valuePropName="checked" name="modifyUseTime">
                                    <Switch size="small" checkedChildren="开" unCheckedChildren="关"></Switch>
                                </Form.Item>
                            </Col>
                            <Col span={21} pull={1}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                name="timePeriod"
                                                rules={[
                                                    {
                                                        validator: async (rule, val, callback) => {
                                                            const remark = getFieldValue('modifyUseTime');
                                                            if (remark) {
                                                                if (!val) {
                                                                    throw new Error('不能为空');
                                                                }
                                                                if (val[0].format() === val[1].format()) {
                                                                    throw new Error('开始时间不能等于结束时间');
                                                                }
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <TimePicker.RangePicker format="HH:mm" disabled={!getFieldValue('modifyUseTime')} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col span={6} push={1} style={{ marginLeft: 9 }}>
                        <Form.Item labelCol={{ span: 7 }} label="前转日期" name="forwardDate" valuePropName="checked">
                            <Switch size="small" checkedChildren="开" unCheckedChildren="关" onChange={forwardDateChange}></Switch>
                        </Form.Item>
                    </Col>
                    <Col span={7} pull={1}>
                        <Row>
                            <Col span={24}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                labelAlign="left"
                                                labelCol={{ span: 6 }}
                                                label="开始日期"
                                                name="startForwardDate"
                                                dependencies={['endForwardDate']}
                                                rules={[
                                                    {
                                                        validator: async (rule, val, callback) => {
                                                            const switchforwardDate = getFieldValue('forwardDate');
                                                            if (switchforwardDate) {
                                                                if (!val) {
                                                                    throw new Error('开始时间不能为空');
                                                                }
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    disabledDate={disabledDateBegin}
                                                    format="YYYY-MM-DD"
                                                    disabled={!getFieldValue('forwardDate')}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={9} pull={2}>
                        <Row align="middle">
                            <Col span={5}>
                                <div style={{ marginTop: '-20px' }}>结束日期:</div>
                            </Col>
                            <Col span={19}>
                                <Space>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item
                                                    name="endForwardDate"
                                                    rules={[
                                                        {
                                                            validator: async (rule, val, callback) => {
                                                                const remark = getFieldValue('forwardDate') && !getFieldValue('noEndDate');
                                                                if (remark) {
                                                                    if (!val) {
                                                                        throw new Error('结束时间不能为空');
                                                                    }
                                                                } else {
                                                                    callback();
                                                                }
                                                            },
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker
                                                        disabledDate={disabledDate}
                                                        format="YYYY-MM-DD"
                                                        disabled={!getFieldValue('forwardDate') || getFieldValue('noEndDate')}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>

                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item name="noEndDate" valuePropName="checked">
                                                    <Checkbox
                                                        onChange={noEndDateChange}
                                                        disabled={!getFieldValue('forwardDate')}
                                                        style={{ marginLeft: '8px' }}
                                                    >
                                                        无结束日
                                                    </Checkbox>
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Space>
                                {/* <span>无结束日</span> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item label="选择模板" style={{ marginBottom: 0 }}>
                    <Input.Group>
                        <Row gutter={8}>
                            <Col>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={(value, option) => {
                                        setSelectValue(option.label);
                                        form.setFieldsValue({ smsTitle: value });
                                        form.setFieldsValue({ cancelTitle: `告警已于<cancel_time>清除，${value}` });
                                    }}
                                    value={selectValue}
                                    placeholder="请选择模板"
                                    options={smsTemplateList}
                                ></Select>
                            </Col>
                            <Col>
                                <Button onClick={showSMSTemplateClick}>模板管理</Button>
                            </Col>
                            <Col>
                                <Button onClick={showSMSTemplateEditClick}>编辑</Button>
                            </Col>
                            <Col>
                                <Form.Item name="isClearSMSContent" valuePropName="checked">
                                    <Checkbox style={{ marginLeft: '8px' }}>清除告警发短信</Checkbox>
                                </Form.Item>
                            </Col>

                            {editVisible && (
                                <Edit
                                    modalContainer={props.login.container}
                                    reloadList={getSmsTemplateList}
                                    smsTemplateList={smsTemplateList}
                                    type="edit"
                                    setSmsContentValue={setSmsContentValue}
                                    optionKey={optionKey}
                                    visible={editVisible}
                                    onVisibleChange={onEditVisibleChange}
                                />
                            )}
                        </Row>
                    </Input.Group>
                </Form.Item>
                <Form.Item name="smsTitle" wrapperCol={{ offset: 3 }}>
                    <Input.TextArea onChange={smsTitleChange} autoSize={{ minRows: 2, maxRows: 5 }} allowClear />
                </Form.Item>
                <Form.Item name="cancelTitle" hidden>
                    <Input.TextArea allowClear />
                </Form.Item>
                <Form.Item label="前转次数" name="frequency" rules={[{ required: true, message: '不能为空' }]}>
                    <InputNumber onChange={tabNumChange} min={1} max={5} formater={limitDecimals} parser={limitDecimals} />
                </Form.Item>
                <Form.Item label="呼叫方式" name="sendMode">
                    <Radio.Group
                        options={[
                            { label: '自定义发送', value: 0 },
                            { label: '外呼系统确定呼叫人员', value: 1, disabled: true },
                            { label: '网元确定呼叫人员', value: 2, disabled: true },
                            { label: '匹配受理人规则', value: 3, disabled: true },
                        ]}
                    ></Radio.Group>
                </Form.Item>
                <Row>
                    <Col span={3}>
                        <div></div>
                    </Col>
                    <Col span={21}>
                        <Form.List name="everyTimes">
                            {(fields) => (
                                <Tabs type="card" onChange={changeTab} activeKey={tabKey}>
                                    {fields.map((field) => (
                                        <TabPane tab={`第${ENUMSNUMS.find((item, index) => index === field.name)}次`} key={field.key}>
                                            {
                                                <>
                                                    <Row>
                                                        <Col span={11}>
                                                            <Form.Item
                                                                style={{ marginLeft: 10 }}
                                                                label="用户组"
                                                                name={[field.name, 'userGroup']}
                                                                fieldKey={[field.fieldKey, 'userGroup']}
                                                            >
                                                                <Select
                                                                    style={{ width: 120, marginLeft: 3 }}
                                                                    allowClear
                                                                    placeholder="请选择用户组"
                                                                    onChange={(...arg) => {
                                                                        userGroupChang(...arg, field.name);
                                                                    }}
                                                                    options={userGroupList}
                                                                ></Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                hidden={true}
                                                                name={[field.name, 'userIds']}
                                                                fieldKey={[field.fieldKey, 'userIds']}
                                                            >
                                                                <Input allowClear></Input>
                                                            </Form.Item>
                                                        </Col>

                                                        {field.name !== 0 && (
                                                            <Col span={13} pull={5}>
                                                                <Form.Item
                                                                    labelCol={{ span: 6 }}
                                                                    label="时间间隔（分钟）"
                                                                    name={[field.name, 'times']}
                                                                    fieldKey={[field.fieldKey, 'times']}
                                                                >
                                                                    <InputNumber
                                                                        style={{ marginLeft: 5 }}
                                                                        min={0}
                                                                        formater={limitDecimals}
                                                                        parser={limitDecimals}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                    <Table
                                                        rowKey={(record) => `${record.userId}`}
                                                        key={field.name}
                                                        bordered
                                                        scroll={{ y: 230 }}
                                                        rowSelection={{
                                                            ...rowSelection,
                                                            selectedRowKeys: selectedRowKeys[`${field.name}_rowKeys`]
                                                                ? selectedRowKeys[`${field.name}_rowKeys`]
                                                                : selectedRowKeys.rowKeys,
                                                            onChange: (...arg) => {
                                                                rowChange(...arg, field.name);
                                                            },
                                                        }}
                                                        dataSource={
                                                            userTableData[`tableData${field.name}`]
                                                                ? userTableData[`tableData${field.name}`]
                                                                : userTableData.tableData
                                                        }
                                                        columns={[
                                                            {
                                                                dataIndex: 'userName',
                                                                title: '用户名',
                                                                width: 200,
                                                            },
                                                            {
                                                                dataIndex: 'mobilephone',
                                                                title: '电话',
                                                                width: 200,
                                                                ellipsis: true,
                                                            },
                                                        ]}
                                                    />
                                                    <Row>
                                                        <Col span={24}>
                                                            <Form.Item label="临时手机号码" style={{ marginLeft: 10 }} labelCol={{ span: 3 }}>
                                                                <Row align="middle">
                                                                    <Col>
                                                                        {' '}
                                                                        <span>(以逗号分隔)</span>
                                                                    </Col>
                                                                    <Col>
                                                                        {' '}
                                                                        <Form.Item
                                                                            rules={[
                                                                                {
                                                                                    validator: async (rule, val, callback) => {
                                                                                        const reg = new RegExp('^1[3578][0-9]{9}(,1[3578][0-9]{9})*$');
                                                                                        if (reg.test(val) || !val) {
                                                                                            callback();
                                                                                        } else {
                                                                                            throw new Error('请输入正确格式');
                                                                                        }
                                                                                    },
                                                                                },
                                                                            ]}
                                                                            noStyle
                                                                            name={[field.name, 'temporaryNum']}
                                                                            fieldKey={[field.fieldKey, 'temporaryNum']}
                                                                        >
                                                                            <Input style={{ marginLeft: 5 }} allowClear />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </>
                                            }
                                        </TabPane>
                                    ))}
                                </Tabs>
                            )}
                        </Form.List>
                    </Col>
                </Row>
            </Form>

            <Modal
                title="短信模板管理"
                width={800}
                bodyStyle={{ height: '450px' }}
                onCancel={onCancel}
                visible={visible}
                destroyOnClose={true}
                getContainer={props.login.container}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={onCancel}> 关闭</Button>
                    </div>
                }
            >
                <SMSTemplate optionKey={optionKey} login={props.login} reloadList={getSmsTemplateList} smsTemplateList={smsTemplateList} />
            </Modal>
        </>
    );
});
