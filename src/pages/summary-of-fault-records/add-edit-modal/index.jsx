import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, Select, InputNumber, message, Button } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import { addTemporaryRoute, editTemporaryRoute, getDeviceAndfault, getSelectCardTypeList } from '../api';

const { TextArea } = Input;

const AddEditModal = (props) => {
    console.log(props);
    const {
        isModalOpen,
        handleCancel,
        reloadTable,
        currentItem,
        editType,
        userId,
        userName,
        provinceIdForModal,
        deviceTypeList,
        initFormData = {},
        activeKey,
    } = props;
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [failurePropertySelectList, setFailurePropertySelectList] = useState([]);
    const [faultReasonSelectList, setFaultReasonSelectList] = useState([]);
    const [deviceTypeSelectList, setDeviceTypeSelectList] = useState([]);
    const [nowRememberList, setNowRememberList] = useState([]);
    const [nowProfessionalType, setNowProfessionalType] = useState('');
    const [groupSourceSelectList, setGroupSourceSelectList] = useState([]);
    const [equipmentManufacturerList, setEquipmentManufacturerList] = useState([]);
    const fixedEquipmentManufacturerList = [
        { value: '华为', key: '8', label: '华为' },
        { value: '中兴', key: '7', label: '中兴' },
        { value: '烽火', key: '202', label: '烽火' },
        { value: '贝尔', key: '12', label: '贝尔' },
    ];
    // 确认按钮
    const handleOk = async () => {
        form.validateFields()
            .then(async (values) => {
                const {
                    provinceName,
                    professionalType,
                    faultStartTime,
                    faultEndTime,
                    sheetNo,
                    faultLocation,
                    deviceVendor,
                    faultLevel,
                    line,
                    isProtected,
                    effectSystem,
                    effectSystemNameProtectValid,
                    effectSystemNameNoProtected,
                    effectSystemNameProtectLose,
                    isProtectedValid,
                    faultTempTime,
                    isEffectBusiness,
                    effectedBusinessTake,
                    faultDurationMinutes,
                    effectedCustomNum,
                    isAutoDispatch,
                    isSmsIntime,
                    isReportedNormally,
                    problemDispatch,
                    board,
                    pigtail,
                    flange,
                    powerSupply,
                    faultyOpticalCable,
                    faultAttribute,
                    groupSource,
                    deviceType,
                    faultReason,
                    faultReasonStr,
                    cardType,
                    faultChannel,
                    bearerService,
                    faultReasonDesc,
                    other,
                } = values;
                const data = {
                    id: currentItem ? currentItem.id : undefined,
                    provinceName: provinceName || undefined,
                    professionalType,
                    faultStartTime: faultStartTime ? moment(faultStartTime).format('YYYY-MM-DD HH:mm:ss') : faultStartTime,
                    faultEndTime: faultEndTime ? moment(faultEndTime).format('YYYY-MM-DD HH:mm:ss') : faultEndTime,
                    sheetNo,
                    faultLocation,
                    deviceVendor: deviceVendor ? (typeof deviceVendor === 'object' ? deviceVendor.label : deviceVendor) : '',
                    faultLevel,
                    line,
                    isProtected,
                    effectSystem,
                    effectSystemNameProtectValid,
                    effectSystemNameNoProtected,
                    effectSystemNameProtectLose,
                    isProtectedValid,
                    faultTempTime: faultTempTime ? moment(faultTempTime).format('YYYY-MM-DD HH:mm:ss') : faultTempTime,
                    isEffectBusiness,
                    effectedBusinessTake,
                    faultDurationMinutes,
                    effectedCustomNum,
                    isAutoDispatch,
                    isSmsIntime,
                    isReportedNormally,
                    problemDispatch,
                    board,
                    pigtail,
                    flange,
                    powerSupply,
                    faultyOpticalCable,
                    //存储时更名faultAttribute，deviceType，faultReason 后加Id
                    faultAttributeId: faultAttribute,
                    groupSource,
                    deviceTypeId: deviceType ? deviceType : null,
                    faultReasonId: faultReason,
                    faultReasonStr,
                    cardType: cardType ? cardType : null,
                    faultChannel,
                    bearerService,
                    faultReasonDesc,
                    other,
                    informant: userName,
                    operator: userName,
                    dataProvince: provinceIdForModal,
                    regionalScope: activeKey,
                };
                if (activeKey === '1') {
                    data.problemDispatch = undefined;
                    data.isReportedNormally = undefined;
                    data.board = undefined;
                    data.pigtail = undefined;
                    data.flange = undefined;
                    data.powerSupply = undefined;
                    data.other = undefined;
                    data.line = undefined;
                    data.faultyOpticalCable = undefined;
                }
                const result = (await currentItem) ? editTemporaryRoute(data) : addTemporaryRoute(data);
                result.then((res) => {
                    if (res.code === 200) {
                        reloadTable && reloadTable();
                        handleCancel && handleCancel();
                    } else {
                        message.error(res.message);
                    }
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };
    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        const reSetData = () => {
            setEquipmentManufacturerList(fixedEquipmentManufacturerList);
            //还原下拉列表
            //记录当前选择的专业ID
            setNowProfessionalType(currentItem.professionalType);
            //获取故障属性列表
            console.log(currentItem, initFormData);
            getDeviceAndfault(currentItem.professionalType || initFormData.professionalType, null, 'fault').then((res) => {
                if (res.data) {
                    setFailurePropertySelectList(res.data);
                }
            });
            getSelectCardTypeList('groupSource').then((res) => {
                if (res.data['groupSource']) {
                    setGroupSourceSelectList(res.data['groupSource']);
                }
            });
            //获取设别类型列表
            getDeviceAndfault(currentItem.professionalType, null, 'device').then((res) => {
                if (res.data) {
                    //为传输网时只记录设备类型
                    if (currentItem.profession === '传输网') {
                        setNowRememberList(res.data);
                        if (currentItem.faultAttribute == '设备故障') {
                            setDeviceTypeSelectList(res.data);
                        } else {
                            setDeviceTypeSelectList([]);
                        }
                    } else {
                        setNowRememberList([]);
                        setDeviceTypeSelectList(res.data);
                    }
                }
            });
            //获取设备原因列表
            //请求设备原因列表 参数为当前专业ID ,故障属性ID, dicName
            let sendReasonParam = '';
            //当为传输网且故障属性为设备故障时传输设备类型
            if (currentItem.professionalType == '3' && currentItem.faultAttribute == '设备故障') {
                sendReasonParam = currentItem.deviceTypeId;
            } else {
                sendReasonParam = currentItem.faultAttributeId;
            }
            getDeviceAndfault(currentItem.professionalType, sendReasonParam, 'fault').then((res) => {
                if (res.data) {
                    setFaultReasonSelectList(res.data);
                }
            });
            return {
                provinceName: currentItem.provinceName || '',
                professionalType: currentItem.professionalType,
                faultStartTime: currentItem.faultStartTime && moment(currentItem.faultStartTime),
                faultEndTime: currentItem.faultEndTime && moment(currentItem.faultEndTime),
                sheetNo: currentItem.sheetNo,
                faultLocation: currentItem.faultLocation,
                deviceVendor: currentItem.deviceVendor,
                faultLevel: currentItem.faultLevel,
                line: currentItem.line,
                isProtected: currentItem.isProtected,
                effectSystem: currentItem.effectSystem,
                effectSystemNameProtectValid: currentItem.effectSystemNameProtectValid,
                effectSystemNameNoProtected: currentItem.effectSystemNameNoProtected,
                effectSystemNameProtectLose: currentItem.effectSystemNameProtectLose,
                isProtectedValid: currentItem.isProtectedValid,
                faultTempTime: currentItem.faultTempTime && moment(currentItem.faultTempTime),
                isEffectBusiness: currentItem.isEffectBusiness,
                effectedBusinessTake: currentItem.effectedBusinessTake,
                faultDurationMinutes: currentItem.faultDurationMinutes,
                effectedCustomNum: currentItem.effectedCustomNum,
                isAutoDispatch: currentItem.isAutoDispatch,
                isSmsIntime: currentItem.isSmsIntime,
                isReportedNormally: currentItem.isReportedNormally,
                problemDispatch: currentItem.problemDispatch,
                board: currentItem.board,
                pigtail: currentItem.pigtail,
                flange: currentItem.flange,
                powerSupply: currentItem.powerSupply,
                faultyOpticalCable: currentItem.faultyOpticalCable,
                //还原的时候以下三个内容通过表格数据后面有Id的还原
                faultAttribute: currentItem.faultAttributeId,
                groupSource: currentItem.groupSource,
                deviceType: currentItem.deviceTypeId,
                faultReason: currentItem.faultReasonId,
                faultReasonStr: currentItem.faultReasonStr,
                cardType: currentItem.cardType,
                faultChannel: currentItem.faultChannel,
                bearerService: currentItem.bearerService,
                faultReasonDesc: currentItem.faultReasonDesc,
                other: currentItem.other,
                informant: currentItem.informant,
            };
        };

        switch (editType) {
            case 'edit':
                //还原设备类型选项
                return reSetData();
            case 'add':
                if (!_.isEmpty(initFormData)) {
                    getDeviceAndfault(initFormData.professionalType, null, 'fault').then((res) => {
                        if (res.data) {
                            setFailurePropertySelectList(res.data);
                        }
                    });
                    getSelectCardTypeList('groupSource').then((res) => {
                        if (res.data['groupSource']) {
                            setGroupSourceSelectList(res.data['groupSource']);
                        }
                    });
                }
                return {
                    recorder: userName,
                    recorderId: userId,
                    provinceName: undefined,
                    faultLevel: '一般',
                    isAutoDispatch: 1,
                    isSmsIntime: 1,
                    professionalType: '3',
                    informant: userName,
                    isProtectedValid: 0,
                    isProtected: 0,
                    ...initFormData,
                };
            case 'view':
                return reSetData();
            default:
                return {};
        }
    }, []);
    useEffect(() => {
        // 组件挂载时立即调用
        if (editType === 'add') {
            changeProList('3');
        }
    }, [editType]);
    const changeProList = (value, options) => {
        //debugger
        getSelectCardTypeList('groupSource').then((res) => {
            if (res.data['groupSource']) {
                setGroupSourceSelectList(res.data['groupSource']);
                // form.setFieldsValue({
                //     groupSource: res.rows[0].groupName
                // });
            }
        });
        //记录当前选择的专业ID
        setNowProfessionalType(value);
        setEquipmentManufacturerList(fixedEquipmentManufacturerList);
        //获取故障属性列表
        getDeviceAndfault(value, null, 'fault').then((res) => {
            if (res.data) {
                setFailurePropertySelectList(res.data);
            }
        });
        //获取设别类型列表
        getDeviceAndfault(value, null, 'device').then((res) => {
            if (res.data) {
                //为传输网时只记录设备类型
                // if (options.label === '传输网') {
                //     setNowRememberList(res.data); //记录传输网的设别类型 但不做显示
                //     setDeviceTypeSelectList([]);
                // } else {
                //     setNowRememberList([]); //清空记录的专属传输网列表数据
                //     setDeviceTypeSelectList(res.data);
                // }
                setNowRememberList(res.data); //记录传输网的设别类型 但不做显示
                setDeviceTypeSelectList([]);
            }
        });
        const listArr = ['faultAttribute', 'deviceType', 'faultReason'];
        const formData = form.getFieldsValue();
        listArr.forEach((item) => {
            formData[item] = undefined;
        });
        form.setFieldsValue(formData);
    };

    const changeFailurePropertyList = (value, options) => {
        setFaultReasonSelectList([]);
        if (options.label === '设备故障' && nowRememberList.length > 0) {
            setDeviceTypeSelectList(nowRememberList);
        } else {
            //请求故障原因原因列表 参数为当前专业ID ,故障属性ID, dicName
            getDeviceAndfault(nowProfessionalType, value, 'fault').then((res) => {
                if (res.data) {
                    setFaultReasonSelectList(res.data);
                }
            });
        }
        form.setFieldsValue({ faultReason: undefined });
        //为传输网则清空设备类型及列表
        if (nowRememberList.length > 0) {
            if (options.label !== '设备故障') {
                setDeviceTypeSelectList([]);
            }
            form.setFieldsValue({ deviceType: undefined });
        }
    };
    const changeDeviceTypeSelectList = (value, options) => {
        //如果是传输网 设备故障  请求故障原因
        if (nowRememberList.length > 0) {
            //请求设备原因列表 参数为当前专业ID ,故障属性ID, dicName
            getDeviceAndfault(nowProfessionalType, value, 'fault').then((res) => {
                if (res.data) {
                    setFaultReasonSelectList(res.data);
                }
            });
            form.setFieldsValue({ faultReason: undefined });
        }
    };
    return (
        <>
            <Modal
                title={editType === 'view' ? '查看故障记录汇总' : currentItem ? '编辑' : '新增'}
                visible={isModalOpen}
                width={1000}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleOk}
                //okButtonProps={{ disabled: editType === 'view' }}
                footer={
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                            取消
                        </Button>
                        <Button type="primary" onClick={handleOk} disabled={editType === 'view'}>
                            确定
                        </Button>
                    </div>
                }
            >
                <Form
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    layout="horizontal"
                    form={form}
                    initialValues={initialValue}
                >
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item label="专业" name="professionalType" rules={[{ required: true, message: '请选择专业' }]}>
                                <Select onChange={changeProList} disabled>
                                    {deviceTypeList.map((item) => {
                                        return (
                                            <Select.Option value={item.key} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障等级" name="faultLevel" rules={[{ required: true, message: '请选择故障等级' }]}>
                                <Select
                                    options={[
                                        {
                                            value: '一般',
                                            label: '一般',
                                        },
                                        {
                                            value: '紧急',
                                            label: '紧急',
                                        },
                                    ]}
                                    disabled={editType === 'view'}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障省份" name="provinceName" rules={[{ required: true, message: '请输入故障省份' }]}>
                                <Input maxLength={50} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障地点" name="faultLocation" rules={[{ required: true, message: '请输入故障地点' }]}>
                                <Input maxLength={50} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        {/*                        <Col span={24}>
                            <Form.Item
                                label="影响系统名称:"
                                name="effectSystem"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入影响系统名称' }]}
                            >
                                <Input maxLength={200} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>*/}
                        <Col span={24}>
                            <Form.Item
                                label="影响系统名称(保护有效):"
                                name="effectSystemNameProtectValid"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: false, message: '请输入影响系统名称（保护有效）' }]}
                            >
                                <TextArea
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="影响系统名称(无保护):"
                                name="effectSystemNameNoProtected"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: false, message: '请输入影响系统名称（无保护）' }]}
                            >
                                <TextArea
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="影响系统名称(保护失效):"
                                name="effectSystemNameProtectLose"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: false, message: '请输入影响系统名称（保护失效）' }]}
                            >
                                <TextArea
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="故障波道"
                                name="faultChannel"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: false, message: '请输入故障波道' }]}
                            >
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="承载业务"
                                name="bearerService"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: false, message: '请输入承载业务' }]}
                            >
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="设备厂商" name="deviceVendor">
                                <Select disabled={editType === 'view'}>
                                    {equipmentManufacturerList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障临时带通时间" name="faultTempTime">
                                <DatePicker style={{ width: '100%' }} showTime disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障开始时间" name="faultStartTime">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    showTime
                                    onChange={(date) => {
                                        setStartTime(date);
                                    }}
                                    disabledDate={(current) => {
                                        return current && current > moment(endTime);
                                    }}
                                    disabled={editType === 'view'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障结束时间" name="faultEndTime">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    showTime
                                    onChange={(date) => {
                                        setEndTime(date);
                                    }}
                                    disabledDate={(current) => {
                                        return current && current < moment(startTime);
                                    }}
                                    disabled={editType === 'view'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障历时（分钟）" name="faultDurationMinutes" rules={[{ required: false, message: '请输入故障历时' }]}>
                                <InputNumber min={0} disabled style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="是否影响业务" name="isEffectBusiness" rules={[{ required: false, message: '请选择是否影响业务' }]}>
                                <Select
                                    options={[
                                        {
                                            value: 1,
                                            label: '是',
                                        },
                                        {
                                            value: 0,
                                            label: '否',
                                        },
                                    ]}
                                    disabled={editType === 'view'}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="影响业务历时(分钟)"
                                name="effectedBusinessTake"
                                rules={[{ required: false, message: '请输入影响业务历时' }]}
                            >
                                <InputNumber min={0} max={999999999} disabled={editType === 'view'} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="影响专线客户数量(条)"
                                name="effectedCustomNum"
                                rules={[{ required: false, message: '请输入影响专线客户数量' }]}
                            >
                                <InputNumber min={0} max={999999999} disabled={editType === 'view'} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障属性" name="faultAttribute" rules={[{ required: true, message: '请选择故障属性' }]}>
                                <Select onChange={changeFailurePropertyList} disabled={editType === 'view'}>
                                    {failurePropertySelectList.map((item) => {
                                        return (
                                            <Select.Option value={item.key} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="班组来源" name="groupSource" rules={[{ required: true, message: '请选择班组来源' }]}>
                                <Select disabled={editType === 'view'} showSearch>
                                    {groupSourceSelectList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/*                        <Col span={12}>
                            <Form.Item label="故障原因" name="faultReason" rules={[{ required: true, message: '请选择故障原因' }]}>
                                <Select disabled={editType === 'view'}>
                                    {faultReasonSelectList.map((item) => {
                                        return (
                                            <Select.Option value={item.key} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>*/}
                        <Col span={24}>
                            <Form.Item
                                label="故障原因"
                                name="faultReasonStr"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入故障原因' }]}
                            >
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="是否自动派单" name="isAutoDispatch" rules={[{ required: false, message: '请选择是否自动派单' }]}>
                                <Select
                                    options={[
                                        {
                                            value: 1,
                                            label: '是',
                                        },
                                        {
                                            value: 0,
                                            label: '否',
                                        },
                                    ]}
                                    disabled={editType === 'view'}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="是否及时收到短信" name="isSmsIntime" rules={[{ required: false, message: '请选择是否及时收到短信' }]}>
                                <Select
                                    options={[
                                        {
                                            value: 1,
                                            label: '是',
                                        },
                                        {
                                            value: 0,
                                            label: '否',
                                        },
                                    ]}
                                    disabled={editType === 'view'}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="自动派单存在问题" name="problemDispatch" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea
                                    rows={1}
                                    maxLength={200}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item
                                label={<span style={{ whiteSpace: 'pre-wrap' }}>OTDR测试断点及告警{'\n'}是否正常上报</span>}
                                name="isReportedNormally"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={{
                                        minRows: 2,
                                    }}
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="板卡/光模块" name="board" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="尾纤" name="pigtail" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="法兰盘/衰耗器" name="flange" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="电源" name="powerSupply" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="其他" name="other" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea
                                    rows={1}
                                    maxLength={200}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="线路" name="line" rules={[{ required: false, message: '请选择线路' }]}>
                                <Select
                                    options={[
                                        {
                                            value: '市政施工',
                                            label: '市政施工',
                                        },
                                        {
                                            value: '偷盗、外力破坏',
                                            label: '偷盗、外力破坏',
                                        },
                                        {
                                            value: '割接',
                                            label: '割接',
                                        },
                                        {
                                            value: '火烧断',
                                            label: '火烧断',
                                        },
                                        {
                                            value: '车压挂',
                                            label: '车压挂',
                                        },
                                        {
                                            value: '鼠蚁害',
                                            label: '鼠蚁害',
                                        },
                                        {
                                            value: '断纤、大衰耗',
                                            label: '断纤、大衰耗',
                                        },
                                        {
                                            value: '洪水等灾害（管道杆路等附属设施受损)',
                                            label: '洪水等灾害（管道杆路等附属设施受损)',
                                        },
                                    ]}
                                    disabled={editType === 'view'}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={activeKey === '1' ? 24 : 12}>
                            <Form.Item
                                labelCol={{ span: activeKey === '1' ? 4 : '' }}
                                wrapperCol={{ span: activeKey === '1' ? 20 : '' }}
                                label="填报人"
                                name="informant"
                                rules={[{ required: true, message: '请输入填报人' }]}
                            >
                                <Input maxLength={999} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ display: activeKey === '1' ? 'none' : '' }}>
                            <Form.Item label="故障光缆名称" name="faultyOpticalCable" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <TextArea
                                    rows={1}
                                    maxLength={500}
                                    disabled={editType === 'view'}
                                    autoSize={true} // 完全自适应，无行数限制
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        resize: 'none', // 禁用手动调整大小
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        {/*                        <Col span={12}>
                            <Form.Item label="工单编号" name="sheetNo">
                                <Input maxLength={999} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="是否保护:" name="isProtected" rules={[{ required: true, message: '请选择是否保护' }]}>
                                <Select
                                    options={[
                                        {
                                            value: 1,
                                            label: '是',
                                        },
                                        {
                                            value: 0,
                                            label: '否',
                                        },
                                    ]}
                                    disabled={editType === 'view'}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="是否保护生效:" name="isProtectedValid" rules={[{ required: true, message: '请选择是否保护生效' }]}>
                                <Select
                                    options={[
                                        {
                                            value: 1,
                                            label: '是',
                                        },
                                        {
                                            value: 0,
                                            label: '否',
                                        },
                                    ]}
                                    disabled={editType === 'view'}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="设备类型" name="deviceType">
                                <Select disabled={editType === 'view'} onChange={changeDeviceTypeSelectList}>
                                    {deviceTypeSelectList.map((item) => {
                                        return (
                                            <Select.Option value={item.key} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="板卡类型" name="cardType">
                                <Select disabled={editType === 'view'}>
                                    {cardTypeList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.key} label={item.value}>
                                                {item.value}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="故障描述"
                                name="bearerService"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入故障描述' }]}
                            >
                                <TextArea rows={1} maxLength={2000} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="处理结果"
                                name="faultReasonDesc"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                rules={[{ required: true, message: '请输入处理结果' }]}
                            >
                                <TextArea rows={1} maxLength={2000} disabled={editType === 'view'} />
                            </Form.Item>
                        </Col>*/}
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddEditModal;
