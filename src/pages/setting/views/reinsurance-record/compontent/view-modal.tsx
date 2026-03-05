import { Button, Col, Form, Icon, Input, Modal, Row, Select, Upload, message, DatePicker } from 'oss-ui';
import React, { useRef, useState } from 'react';
import { ModalType, ModalTypeMap, DictByFieldNameKey } from '../types';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { CreateReinsuranceRecord, UpdateReinsuranceRecord, DownloadFile, UploadFile } from '../api';
import { QueryDetail, Attachement } from '../api-types';
import dayjs from 'dayjs';
import moment from 'moment';
import { UploadProps } from 'oss-ui/lib/upload';
import { blobDownLoad } from '@Common/utils/download';

type IProps = {
    modalVisabled: boolean; // 控制弹窗
    modalType: ModalType; // 弹窗类型
    setModalVisabled: React.Dispatch<React.SetStateAction<boolean>>;
    rowDetail?: QueryDetail;
    dictByFieldNameList: Partial<{
        [key in DictByFieldNameKey]: Array<{
            key: string;
            value: any;
        }>;
    }>;
    onLoad: () => void;
    setRowDetail: React.Dispatch<React.SetStateAction<QueryDetail | undefined>>;
    provinceList;
};

export default function ViewModal(props: IProps) {
    const { modalVisabled, setModalVisabled, modalType, dictByFieldNameList, rowDetail, onLoad, setRowDetail, provinceList } = props;
    const { userName } = useLoginInfoModel.data;
    const {
        dutyManagerProfession = [],
        dutyManagerReinsuranceLogo = [],
        dutyManagerReinsuranceType = [],
        dutyManagerReinsuranceLevel = [],
        dutyManagerReinsuranceUrgency = [],
    } = dictByFieldNameList;
    const [loading, setLoading] = useState<boolean>(false);

    const login = useLoginInfoModel();
    const { provinceId } = login;

    const isDisabled = modalType === ModalType.VIEW;
    const { Dragger, LIST_IGNORE } = Upload;
    const [useform] = Form.useForm();
    const formRef = useRef(null);
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const initValues =
        modalType === ModalType.CREATE
            ? {
                  reinsuranceLogo: '1',
                  reinsuranceType: '1',
                  reinsuranceLevel: '1',
                  urgency: '1',
                  recorder: userName,
                  provinceId: provinceId,
              }
            : {
                  ...rowDetail,
                  reinsuranceEndTime: rowDetail && moment(dayjs(rowDetail?.reinsuranceEndTime).format(dateFormat)),
                  reinsuranceStartTime: rowDetail && moment(dayjs(rowDetail?.reinsuranceStartTime).format(dateFormat)),
                  reinsuranceLogo: String(rowDetail?.reinsuranceLogo),
                  reinsuranceType: String(rowDetail?.reinsuranceType),
                  reinsuranceLevel: String(rowDetail?.reinsuranceLevel),
                  urgency: String(rowDetail?.urgency),
                  professionType: String(rowDetail?.professionType),
                  provinceId: `${rowDetail?.provinceId}`,
                  annexesIds: rowDetail?.annexesList?.map((item) => ({
                      uid: item.annexesId,
                      name: item.annexesName,
                      status: 'done',
                      url: item.annexesPath,
                  })),
              };
    const handleCancle = (): void => {
        setModalVisabled(false);
        setRowDetail(undefined);
    };
    const upLoadFileType = ['application/x-rar', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const upLoadFileName = ['.rar', '.zip', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx'];
    const getValues = useform.getFieldsValue();
    console.log('==rowDetail', rowDetail, getValues);
    const handleSave = async (): Promise<void> => {
        if (modalType === ModalType.VIEW) {
            handleCancle();
            return;
        }

        const formValue = await useform.validateFields();
        let annexesIds: Attachement[] = [];
        if (formValue?.annexesIds) {
            const _fileList = formValue?.annexesIds?.fileList
                ? formValue?.annexesIds?.fileList?.map((annexesItem) => {
                      return annexesItem?.response?.data;
                  })
                : formValue?.annexesIds?.map((annexesItem) => {
                      return annexesItem?.uid;
                  });
            annexesIds = [..._fileList];
        }
        const param = {
            ...formValue,
            professionType: Number(formValue?.professionType),
            reinsuranceLevel: Number(formValue?.reinsuranceLevel),
            reinsuranceLogo: Number(formValue?.reinsuranceLogo),
            reinsuranceType: Number(formValue?.reinsuranceType),
            urgency: Number(formValue?.urgency),
            reinsuranceStartTime: dayjs(formValue?.reinsuranceStartTime).format(dateFormat),
            reinsuranceEndTime: dayjs(formValue?.reinsuranceEndTime).format(dateFormat),
            annexesIds: annexesIds,
            provinceId: modalType === ModalType.CREATE ? formValue.provinceId : rowDetail?.provinceId,
        };
        setLoading(true);
        let res: any = null;
        if (modalType === ModalType.CREATE) {
            res = await CreateReinsuranceRecord(param);
        } else {
            res = await UpdateReinsuranceRecord(param);
        }

        if (res.code !== 200) {
            handleCancle();
            message.error(res.message);
            return;
        }
        message.success(res.message);
        handleCancle();
        onLoad();
    };

    /**
     * 文件上传
     * @param {*} param
     */
    const uploadScripts = async ({ file, onError, onSuccess }: any) => {
        const params = new FormData();
        params.append('file', file);
        const data = await UploadFile(params);
        if (data.code === 200) {
            onSuccess(data, file);
        } else {
            onError(data, file);
        }
    };

    const uploadProps: UploadProps = {
        beforeUpload: (file): string | void => {
            const isUpLoad = upLoadFileType.includes(file.type) || upLoadFileName.some((item) => file.name.endsWith(item));
            const max20M = 20 * 1048576;
            const is20MSize = file.size >= max20M;
            if (!isUpLoad) {
                message.error('仅支持上传office文档和压缩包');
                return LIST_IGNORE;
            }

            if (is20MSize) {
                message.error('仅支持上传20m大小');
                return LIST_IGNORE;
            }
        },
        onChange: (info) => {
            console.log('==info==', info);
        },
        defaultFileList: rowDetail?.annexesList?.map((item) => ({
            uid: item?.annexesId || '',
            name: item?.annexesName || '',
            status: 'done',
            response: {
                data: item?.annexesId,
            },
        })),
        onDownload: (file): void => {
            console.log('==file==', file?.url, file);
        },
        showUploadList: {
            showDownloadIcon: true,
            downloadIcon: (file) => {
                return (
                    <div
                        style={{ marginRight: 8 }}
                        onClick={async () => {
                            const annexesId = file?.response?.data || file?.uid;
                            const res = await DownloadFile({ annexesId: annexesId });
                            blobDownLoad(res, `${file.name}`);
                        }}
                    >
                        下载
                    </div>
                );
            },
            showRemoveIcon: true,
        },

        customRequest: uploadScripts,

        // action: `${useEnvironmentModel?.data?.environment?.reinsuranceRecordUrl?.direct}/reinsuranceRecord/uploadFile`,
    };

    return (
        <>
            {/* <Row gutter={24}>
                <Col span={4} offset={10}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={handleSave} loading={loading}>
                            确定
                        </Button>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item>
                        <Button onClick={handleCancle}>取消</Button>
                    </Form.Item>
                </Col>
            </Row> */}
            <Modal
                title={`重保记录${ModalTypeMap[modalType]}`}
                onCancel={handleCancle}
                onOk={handleSave}
                visible={modalVisabled}
                width={800}
                destroyOnClose
                okButtonProps={{ loading: loading, disabled: modalType === ModalType.VIEW }}
            >
                <Form style={{ padding: 20 }} initialValues={initValues} form={useform} ref={formRef}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="省份"
                                name="provinceId"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <Select disabled style={{ width: '100%' }}>
                                    {provinceList.map((item) => (
                                        <Select.Option key={item.zoneId} value={item.zoneId} label={item.zoneName}>
                                            {item.zoneName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} offset={8}>
                            <Form.Item
                                label="专业"
                                name="professionType"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <Select
                                    disabled={isDisabled}
                                    allowClear={true}
                                    options={(dutyManagerProfession || []).map((item) => ({ label: item.value, value: item.key }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="主题"
                                name="topic"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                    {
                                        max: 50,
                                        message: '输入不超过50字符',
                                    },
                                ]}
                            >
                                <Input disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="记录人"
                                name="recorder"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <Input disabled allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            {modalType !== ModalType.CREATE ? (
                                <Form.Item
                                    label="申请编号"
                                    name="applicationNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: '此项必填',
                                        },
                                    ]}
                                >
                                    <Input disabled allowClear={true} />
                                </Form.Item>
                            ) : null}
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="电路编号"
                                name="circuitNumber"
                                rules={[
                                    {
                                        max: 30,
                                        message: '输入不超过30字符',
                                    },
                                ]}
                            >
                                <Input disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={16}>
                            <Form.Item
                                label="申请部门"
                                name="applicationDepartment"
                                rules={[
                                    {
                                        max: 30,
                                        message: '输入不超过30字符',
                                    },
                                ]}
                            >
                                <Input disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="联系电话"
                                rules={[
                                    {
                                        pattern: /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
                                        message: '请输入正确的手机号',
                                    },
                                ]}
                                name="contactNumber"
                            >
                                <Input disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={16}>
                            <Form.Item
                                label="公司名称"
                                name="companyName"
                                rules={[
                                    {
                                        max: 30,
                                        message: '输入不超过30字符',
                                    },
                                ]}
                            >
                                <Input disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="重保标识"
                                name="reinsuranceLogo"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <Select
                                    disabled={isDisabled}
                                    allowClear={true}
                                    options={(dutyManagerReinsuranceLogo || []).map((item) => ({ label: item.value, value: item.key }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="重保类型"
                                name="reinsuranceType"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <Select
                                    disabled={isDisabled}
                                    allowClear={true}
                                    options={(dutyManagerReinsuranceType || []).map((item) => ({ label: item.value, value: item.key }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="重保级别"
                                name="reinsuranceLevel"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <Select
                                    disabled={isDisabled}
                                    allowClear={true}
                                    options={(dutyManagerReinsuranceLevel || []).map((item) => ({ label: item.value, value: item.key }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="紧急程度"
                                name="urgency"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <Select
                                    disabled={isDisabled}
                                    allowClear={true}
                                    options={(dutyManagerReinsuranceUrgency || []).map((item) => ({ label: item.value, value: item.key }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="重保开始时间"
                                name="reinsuranceStartTime"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="重保结束时间"
                                name="reinsuranceEndTime"
                                rules={[
                                    {
                                        required: true,
                                        message: '此项必填',
                                    },
                                ]}
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="电路路径"
                                name="circuitPath"
                                rules={[
                                    {
                                        max: 30,
                                        message: '输入不超过30字符',
                                    },
                                ]}
                            >
                                <Input disabled={isDisabled} allowClear={true} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label="附件" name="annexesIds">
                                <Dragger disabled={isDisabled} {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <Icon antdIcon={true} type="InboxOutlined" />
                                    </p>
                                    <p className="ant-upload-text">点击或者拖拽上传附件</p>
                                    <p className="ant-upload-text">支持上传office文档和压缩包</p>
                                </Dragger>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}
