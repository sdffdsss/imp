import React from 'react';
import { Form, Input, Card, Row, Col, Select } from 'oss-ui';
import './index.less';
import formatReg from '@Common/formatReg';
import request from '@Common/api';

class FormComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            displayControlId: 'none', // 控制告警id列表的显示与隐藏
            displayControlTitle: 'none', // 控制告警title列表的显示与隐藏
            idCheckedText: '', // 告警ID
            titleCheckedText: '', // 告警标题
            alarmTitleDatas: [],
            alarmId: []
        };
    }

    // 查询告警标题所有信息
    getAlarmDatas = (type, value) => {
        const { frowardRef } = this.props;
        const formInstance = frowardRef.current.getFieldsValue();
        const query = {
            vendorId: formInstance.vendorId,
            eqpObjectClass: formInstance.eqpObjectClass,
            objectClass: formInstance.objectClass,
            condition: value
        };
        let url = '';
        if (type === 'id') {
            url = 'alarmmodel/dict/v1/getNmsAlarmId';
        } else {
            url = 'alarmmodel/dict/v1/getTitleText';
        }
        return request(url, {
            type: 'GET',
            baseUrlType: 'filterUrl',
            data: {
                ...query
            },
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
            defaultErrorMessage: '获取数据失败'
        })
            .then((res) => {
                return res;
            })
            .catch(() => {
                return [];
            });
    };
    /**
     * 告警标题和告警ID输入时匹配检测搜索到的包含内容的长度提示
     */
    changeAlarmMethod = async (value, changeName) => {
        if (changeName === '网关告警ID') {
            const res = await this.getAlarmDatas('id', value);
            if (res && res.data) {
                this.setState({ alarmId: res.data });
            } else {
                this.setState({ alarmId: [] });
            }
        } else {
            const res = await this.getAlarmDatas('title', value);
            if (res && res.data) {
                this.setState({ alarmTitleDatas: res.data });
            } else {
                this.setState({ alarmTitleDatas: [] });
            }
        }
    };
    // 新增/编辑时，获取告警标题和告警ID的值，用于其发生变化时获取表单数据
    // eslint-disable-next-line consistent-return
    changeAlarm = (type, event) => {
        const title = '告警标题';
        const id = '网关告警ID';
        const { receiveParams } = this.props;
        // eslint-disable-next-line no-control-regex
        if (type === 'title') {
            this.changeAlarmMethod(event.target.value, title);
            this.setState({ titleCheckedText: event.target.value }, () => {
                receiveParams(this.state.titleCheckedText, 'title');
            });
        } else {
            this.changeAlarmMethod(event.target.value, id);
            this.setState({ idCheckedText: event.target.value }, () => {
                receiveParams(this.state.idCheckedText, 'id');
            });
            // 获取告警ID的值传给父页面用于发送请求
        }
    };

    // 点击文本框时显示下拉框
    showAddList = (type, event) => {
        event.nativeEvent.stopImmediatePropagation();
        if (type === 'title') {
            this.setState({ displayControlTitle: 'block', displayControlId: 'none' });
        } else {
            this.setState({ displayControlId: 'block', displayControlTitle: 'none' });
        }
    };

    // 隐藏下拉框
    hiddenSearchList = () => {
        this.setState({ displayControlId: 'none', displayControlTitle: 'none' });
    };

    // 点击下拉框的内容选中给文本框赋值
    alarmChecked = (type, event) => {
        // 阻止冒泡
        event.nativeEvent.stopImmediatePropagation();
        const { receiveParams, frowardRef } = this.props;
        const text = event.target.innerHTML;
        if (type === 'title') {
            this.setState({ displayControlTitle: 'none', titleCheckedText: text }, () => {
                receiveParams(this.state.titleCheckedText, 'title');
                frowardRef.current.setFieldsValue({
                    titleText: text
                });
            });
        } else {
            this.setState({ displayControlId: 'none', idCheckedText: text }, () => {
                receiveParams(this.state.idCheckedText, 'id');
                frowardRef.current.setFieldsValue({
                    nmsAlarmId: text
                });
            });
        }
    };

    // 当页面为编辑时 初始化时获取告警标题和告警ID的值，用于如果不改变其值的情况下收集表单的值
    componentDidMount() {
        const { receiveParams, isEdit, rowData, getDictEntry } = this.props;
        getDictEntry('sub_alarm_type');
        getDictEntry('eqp_object_class');
        getDictEntry('vendor_id');
        getDictEntry('object_class');
        if (isEdit === 'edit' || isEdit === 'look') {
            // 编辑状态下初始化的时候给告警id和告警title赋值(其值应该是rowData.alarmid)
            this.setState(
                {
                    idCheckedText: rowData.nmsAlarmId,
                    titleCheckedText: rowData.titleText
                },
                () => {
                    receiveParams(this.state.titleCheckedText, 'title');
                    receiveParams(this.state.idCheckedText, 'id');
                }
            );
        }
        // 绑定全局点击事件
        document.addEventListener('click', this.hiddenSearchList);
    }

    render() {
        const { frowardRef, isEdit, rowData, alarmSub, alarmObj, vendorDatas, networkType } = this.props;
        const { alarmId, alarmTitleDatas } = this.state;
        let initialValues = {};
        if (isEdit === 'edit' || isEdit === 'look') {
            initialValues = {
                subAlarmType: String(rowData.subAlarmType),
                objectClass: String(rowData.objectClass),
                vendorId: String(rowData.vendorId),
                eqpObjectClass: String(rowData.eqpObjectClass),
                memo: rowData.memo,
                titleText: rowData.titleText,
                nmsAlarmId: rowData.nmsAlarmId
            };
        }
        // 模拟 文本框输入时模糊匹配的数据源。后期需要调接口拿到。从父页面传入
        const { displayControlId, displayControlTitle, idCheckedText, titleCheckedText } = this.state;
        return (
            <div
                style={{
                    height: '100%',
                    overflow: 'scroll'
                }}
            >
                <Form ref={frowardRef} initialValues={initialValues}>
                    <Card gutter={8} bordered={false}>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="subAlarmType"
                                    label="告警子类型"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择告警子类型'
                                        }
                                    ]}
                                >
                                    <Select showSearch={true} placeholder="请选择" disabled={isEdit === 'look'} optionFilterProp="children">
                                        {alarmSub && alarmSub.map((type) => <Select.Option key={type.key}>{type.value}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    name="objectClass"
                                    label="告警对象类型"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择告警对象类型'
                                        }
                                    ]}
                                >
                                    <Select showSearch placeholder="请选择" disabled={isEdit === 'look'} optionFilterProp="children">
                                        {alarmObj && alarmObj.map((type) => <Select.Option key={type.key}>{type.value}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                                <Form.Item
                                    name="vendorId"
                                    label="厂家"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择厂家'
                                        }
                                    ]}
                                >
                                    <Select showSearch placeholder="请选择" disabled={isEdit === 'look'} optionFilterProp="children">
                                        {vendorDatas && vendorDatas.map((type) => <Select.Option key={type.key}>{type.value}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="eqpObjectClass"
                                    label="网元类型"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择'
                                        }
                                    ]}
                                >
                                    <Select showSearch placeholder="请选择" disabled={isEdit === 'look'} optionFilterProp="children">
                                        {networkType && networkType.map((type) => <Select.Option key={type.key}>{type.value}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            {isEdit && (
                                <Col span={24} className="accordion-container">
                                    <Form.Item
                                        name="titleText"
                                        label="告警标题"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        rules={[
                                            { pattern: formatReg.noEmpety, message: '不能存在空格' },
                                            {
                                                validator: (rule, value, callback) => {
                                                    // eslint-disable-next-line no-control-regex
                                                    const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                                    if (valueLength > 400) {
                                                        callback('总长度不能超过400位（1汉字=2位）');
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            disabled={isEdit === 'look'}
                                            onClick={this.showAddList.bind(this, 'title')}
                                            autoComplete="off"
                                            value={titleCheckedText}
                                            onChange={this.changeAlarm.bind(this, 'title')}
                                        />
                                    </Form.Item>
                                    <div className="condition-list-title" style={{ display: displayControlTitle }}>
                                        {alarmTitleDatas.map((item) => {
                                            return (
                                                <div className="condition-item">
                                                    <span className="spanName" onClick={this.alarmChecked.bind(this, 'title')}>
                                                        {item}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            )}
                            {!isEdit && (
                                <Col span={24} className="accordion-container">
                                    <Form.Item
                                        name="titleText"
                                        label="告警标题"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        rules={[
                                            { pattern: formatReg.noEmpety, message: '不能存在空格' },
                                            {
                                                validator: (rule, value, callback) => {
                                                    // eslint-disable-next-line no-control-regex
                                                    const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                                    if (valueLength > 400) {
                                                        callback('总长度不能超过400位（1汉字=2位）');
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            value={titleCheckedText}
                                            disabled={isEdit === 'look'}
                                            onChange={this.changeAlarm.bind(this, 'title')}
                                            onClick={this.showAddList.bind(this, 'title')}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                    <div className="condition-list-title" style={{ display: displayControlTitle }}>
                                        {alarmTitleDatas.map((item) => {
                                            return (
                                                <div className="condition-item">
                                                    <span className="spanName" onClick={this.alarmChecked.bind(this, 'title')}>
                                                        {item}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {isEdit && (
                                <Col span={24} className="accordion-container">
                                    <Form.Item
                                        name="nmsAlarmId"
                                        label="网管告警ID"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        rules={[
                                            { pattern: formatReg.noEmpety, message: '不能存在空格' },
                                            {
                                                validator: (rule, value, callback) => {
                                                    // eslint-disable-next-line no-control-regex
                                                    const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                                    if (valueLength > 400) {
                                                        callback('总长度不能超过400位（1汉字=2位）');
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            disabled={isEdit === 'look'}
                                            onClick={this.showAddList.bind(this, 'id')}
                                            autoComplete="off"
                                            value={idCheckedText}
                                            onChange={this.changeAlarm.bind(this, 'id')}
                                        />
                                    </Form.Item>
                                    <div className="condition-list-title" style={{ display: displayControlId }}>
                                        {alarmId.map((item) => {
                                            return (
                                                <div className="condition-item">
                                                    <span className="spanName" onClick={this.alarmChecked.bind(this, 'id')}>
                                                        {item}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            )}
                            {!isEdit && (
                                <Col span={24} className="accordion-container">
                                    <Form.Item
                                        name="nmsAlarmId"
                                        label="网管告警ID"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        rules={[
                                            { pattern: formatReg.noEmpety, message: '不能存在空格' },
                                            {
                                                validator: (rule, value, callback) => {
                                                    // eslint-disable-next-line no-control-regex
                                                    const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                                    if (valueLength > 400) {
                                                        callback('总长度不能超过400位（1汉字=2位）');
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            value={idCheckedText}
                                            disabled={isEdit === 'look'}
                                            onChange={this.changeAlarm.bind(this, 'id')}
                                            onClick={this.showAddList.bind(this, 'id')}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                    <div className="condition-list" style={{ display: displayControlId }}>
                                        {alarmId.map((item) => {
                                            return (
                                                <div className="condition-item">
                                                    <span className="spanName" onClick={this.alarmChecked.bind(this, 'id')}>
                                                        {item}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="memo"
                                    label="描述"
                                    rules={[
                                        {
                                            max: 1000,
                                            type: 'string'
                                        }
                                    ]}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <Input.TextArea value={isEdit ? initialValues.memo : ''} disabled={isEdit === 'look'} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>
        );
    }
}
export default React.forwardRef((props, ref) => <FormComponent frowardRef={ref} {...props} />);
