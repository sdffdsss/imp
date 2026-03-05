import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Col, Row, message, Select, InputNumber, Table, Tooltip, Button, Icon } from 'oss-ui';
import { addTemporaryRoute, editTemporaryRoute, addFileFunc, deleteFileFunc, downLoadFileFunc } from '../api';
import { FormUpload } from '@Pages/components';
import { blobDownLoad } from '@Common/utils/download';
import moment from 'moment';
import SelectCondition from '@Pages/fault-report/columns/CompSelectCondition';
const { TextArea } = Input;

const AddEditModal = (props) => {
    const {
        isModalOpen,
        handleCancel,
        reloadTable,
        currentItem,
        editType,
        userId,
        userName,
        loginId,
        provinceId,
        currProvince,
        professionalList,
        didTheFaultRecover,
        affiliatedNetwork,
        wrapClassName,
        faultCauseList,
        majorName,
        groupSourceEnum,
    } = props;
    console.log(provinceId);
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [fileIdsArr, setFileIdsArr] = useState([]);
    const [fileListArr, setFileListArr] = useState([]);
    const columns = [
        {
            title: '已保存文件',
            dataIndex: 'fileName',
            align: 'center',
            key: 'fileName',
        },
        {
            title: '操作',
            dataIndex: 'actions',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (text, row) => [
                <Tooltip title="下载">
                    <Button onClick={() => downLoadFile(row)} type="text">
                        <Icon antdIcon type="DownloadOutlined" />
                    </Button>
                </Tooltip>,
                <Tooltip title="删除">
                    <Button disabled={editType === 'view'} onClick={() => deleteFile(row)} type="text">
                        <Icon antdIcon type="DeleteOutlined" />
                    </Button>
                </Tooltip>,
            ],
        },
    ];
    const downLoadFile = (row) => {
        downLoadFileFunc(row.fileId).then((res) => {
            if (res) {
                blobDownLoad(res, `${row.fileName}`);
            }
        });
    };
    const deleteFile = (row) => {
        deleteFileFunc(row.fileId).then((res) => {
            if (res.code === 200) {
                let copyArr = JSON.parse(JSON.stringify(fileListArr));
                copyArr.forEach((item, index) => {
                    if (item.fileId === row.fileId) {
                        copyArr.splice(index, 1);
                    }
                });
                setFileListArr(copyArr);
                message.success('删除成功!');
            }
        });
    };
    // 确认按钮
    const handleOk = async () => {
        if (props.handleSaveCheck) {
            const checkResult = await props.handleSaveCheck();

            if (!checkResult) {
                return;
            }
        }

        form.validateFields()
            .then((values) => {
                const {
                    recorderId,
                    recorder,
                    belongProvince,
                    majorType,
                    reportUnit,
                    receptionTime,
                    faultLocation,
                    faultRecovery,
                    interruptedScope,
                    owningNetwork,
                    faultDuration,
                    faultHandDuration,
                    obstaclePhenomenon,
                    causeObstacleText,
                    remarks,
                    groupSource,
                } = values;
                let data = {
                    recorder,
                    createdBy: loginId,
                    id: currentItem ? currentItem.id : undefined,
                    belongProvince: provinceId,
                    majorType,
                    reportUnit,
                    receptionTime: moment(receptionTime).format('YYYY-MM-DD HH:mm:ss'),
                    faultLocation,
                    faultRecovery,
                    interruptedScope,
                    owningNetwork,
                    faultDuration,
                    faultHandDuration,
                    obstaclePhenomenon,
                    causeObstacleText,
                    remarks,
                    faultCreateTime: startTime?.format('YYYY-MM-DD HH:mm:ss') || '',
                    faultOverTime: endTime?.format('YYYY-MM-DD HH:mm:ss') || '',
                    groupSource: majorName === '互联网专业' ? groupSource : undefined,
                };
                const attachmentArr = values.attachment; //文件数组
                new Promise((resolve, reject) => {
                    if (attachmentArr && attachmentArr.length) {
                        attachmentArr.forEach((item, index) => {
                            const formList = new FormData();
                            formList.append('file', item.xhr);
                            addFileFunc(formList).then((res) => {
                                fileIdsArr.push(res.data.fileId);
                                setFileIdsArr(fileIdsArr);
                                if (index + 1 === attachmentArr.length) {
                                    resolve();
                                }
                            });
                        });
                    } else {
                        resolve();
                    }
                }).then(() => {
                    fileListArr.forEach((item) => {
                        fileIdsArr.push(item.fileId);
                    });
                    data.fileIds = fileIdsArr;
                    if (currentItem) {
                        editTemporaryRoute(data).then((res) => {
                            if (res.code === 200) {
                                message.success('修改成功');
                                reloadTable?.();
                                handleCancel?.();
                            }
                        });
                    } else {
                        addTemporaryRoute(data).then((res) => {
                            if (res.code === 200) {
                                message.success('新增成功');
                                reloadTable?.();
                                handleCancel?.();
                            }
                        });
                    }
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };
    // 给表单项赋初始值
    const initialValue = useMemo(() => {
        switch (editType) {
            case 'edit':
                setFileListArr(currentItem.files);
                return {
                    ...currentItem,
                    receptionTime: currentItem.receptionTime && moment(currentItem.receptionTime),
                    belongProvince: { value: Number(provinceId), label: currProvince?.regionName },
                    startTime: currentItem.faultCreateTime && moment(currentItem.faultCreateTime),
                    endTime: currentItem.faultOverTime ? moment(currentItem.faultOverTime) : null,
                    faultDuration: currentItem.faultDuration || null,
                    faultHandDuration: currentItem.faultHandDuration || null,
                };
            case 'add':
                return {
                    recorder: userName,
                    recorderId: userId,
                    receptionTime: moment(),
                    faultRecovery: 2,
                    belongProvince: { value: Number(provinceId), label: currProvince?.regionName },
                    majorType: professionalList[0].value,
                    owningNetwork: 1,
                    groupSource: majorName === '互联网专业' ? groupSourceEnum?.[0] : undefined,
                };
            case 'view':
                setFileListArr(currentItem.files);
                return {
                    ...currentItem,
                    receptionTime: currentItem.receptionTime && moment(currentItem.receptionTime),
                    belongProvince: { value: Number(provinceId), label: currProvince?.regionName },
                    startTime: currentItem.faultCreateTime && moment(currentItem.faultCreateTime),
                    endTime: currentItem.faultOverTime ? moment(currentItem.faultOverTime) : null,
                    faultDuration: currentItem.faultDuration || null,
                    faultHandDuration: currentItem.faultHandDuration || null,
                };
        }
    }, []);
    const itemConfig = {
        // 查看下禁止编辑其他皆可编辑
        disabled: editType === 'view',
    };
    return (
        <>
            <Modal
                title={currentItem ? (editType === 'edit' ? '编辑' : '查看') : '新增'}
                visible={isModalOpen}
                width={wrapClassName ? 1200 : 1000}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{ disabled: editType === 'view' }}
                wrapClassName={wrapClassName}
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
                            <Form.Item label="省份" name="belongProvince" rules={[{ required: true }]}>
                                <SelectCondition
                                    disabled={editType === 'view'}
                                    labelInValue
                                    title="省份"
                                    id="key"
                                    label="value"
                                    dictName="province_id"
                                    searchName="province_id"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="专业" name="majorType" rules={[{ required: true, message: '请选择专业' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    placeholder="请选择专业"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {professionalList.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.label}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.reportUnit : ''}>
                                <Form.Item
                                    label="申告单位"
                                    placeholder="请输入申告单位"
                                    name="reportUnit"
                                    rules={[{ required: true, message: '请输入申告单位' }]}
                                >
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="受理时间" name="receptionTime" rules={[{ required: true, message: '请输入受理时间' }]}>
                                <DatePicker disabled={editType === 'view'} style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.recorder : ''}>
                                <Form.Item label="记录人" name="recorder" rules={[{ required: true, message: '请输入处理人' }]}>
                                    <Input disabled maxLength={50} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.faultLocation : ''}>
                                <Form.Item label="故障地点" name="faultLocation">
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障是否恢复" name="faultRecovery" rules={[{ required: true, message: '请选择故障是否恢复' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    placeholder="请选择故障是否恢复"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {didTheFaultRecover.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.lable}>
                                                {item.lable}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.interruptedScope : ''}>
                                <Form.Item label="中断业务范围" name="interruptedScope">
                                    <Input disabled={editType === 'view'} maxLength={200} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="所属网络" name="owningNetwork" rules={[{ required: true, message: '请选择所属网络' }]}>
                                <Select
                                    disabled={editType === 'view'}
                                    showSearch
                                    placeholder="请选择所属网络"
                                    maxTagCount="responsive"
                                    optionFilterProp="children"
                                >
                                    {affiliatedNetwork.map((item) => {
                                        return (
                                            <Select.Option value={item.value} key={item.value} label={item.lable}>
                                                {item.lable}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障发生时间" name="startTime" rules={[{ required: true, message: '请输入故障发生时间' }]}>
                                <DatePicker
                                    disabled={editType === 'view'}
                                    style={{ width: '100%' }}
                                    showTime
                                    onChange={(date) => {
                                        setStartTime(date);
                                    }}
                                    disabledDate={(current) => {
                                        return current && current > moment(endTime);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障恢复时间" name="endTime">
                                <DatePicker
                                    disabled={editType === 'view'}
                                    style={{ width: '100%' }}
                                    showTime
                                    onChange={(date) => {
                                        setEndTime(date);
                                    }}
                                    disabledDate={(current) => {
                                        return current && current < moment(startTime);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障历时(分钟)" name="faultDuration">
                                <InputNumber disabled={editType === 'view'} min={0} precision={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="故障受理历时(分钟)" name="faultHandDuration">
                                <InputNumber disabled={editType === 'view'} min={0} precision={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Tooltip title={editType === 'view' ? currentItem?.causeObstacleText : ''}>
                                <Form.Item label="故障原因" name="causeObstacleText">
                                    {majorName === '核心网' || majorName === '互联网专业' ? (
                                        <Select
                                            disabled={editType === 'view'}
                                            showSearch
                                            placeholder="请选择故障原因"
                                            maxTagCount="responsive"
                                            optionFilterProp="children"
                                            allowClear
                                        >
                                            {faultCauseList.map((item) => {
                                                return (
                                                    <Select.Option value={item.lable} key={item.lable} label={item.lable}>
                                                        {item.lable}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    ) : (
                                        <Input disabled={editType === 'view'} maxLength={200} />
                                    )}
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        {majorName === '互联网专业' && (
                            <Col span={12}>
                                <Form.Item label="班组来源" name="groupSource" rules={[{ required: true, message: '请选择班组来源' }]}>
                                    <Select disabled={editType === 'view'} showSearch placeholder="请选择班组来源">
                                        {groupSourceEnum.map((item) => {
                                            return (
                                                <Select.Option value={item.value} key={item} label={item}>
                                                    {item}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        <Col span={24}>
                            <Tooltip title={editType === 'view' ? currentItem?.obstaclePhenomenon : ''}>
                                <Form.Item label="障碍现象" name="obstaclePhenomenon" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                    <Input.TextArea disabled={editType === 'view'} autoSize={{ minRows: 4, maxRows: 10 }} maxLength={1000} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={24}>
                            <Tooltip title={editType === 'view' ? currentItem?.remarks : ''}>
                                <Form.Item label="备注" name="remarks" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                    <Input.TextArea disabled={editType === 'view'} autoSize={{ minRows: 4, maxRows: 10 }} maxLength={1000} />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="附件" name="attachment" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <FormUpload
                                    accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .zip"
                                    messageText="附件支持上传支持上传office文档和压缩包；"
                                    {...itemConfig}
                                />
                            </Form.Item>
                        </Col>
                        {editType !== 'add' && (
                            <Col span={20} offset={4}>
                                <Table dataSource={fileListArr} columns={columns} pagination={false} />
                            </Col>
                        )}
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddEditModal;
