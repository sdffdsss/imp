import React, { useState } from 'react';
import { Modal, Icon, Tooltip, Form, Radio, message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import CustomModalFooter from '../../components/custom-modal-footer';
import './index.less';

const AlarmExport = (props) => {
    const [formInstance] = Form.useForm();
    const [showMode, changeShowMode] = useState(false);
    const onSave = () => {
        const formData = formInstance.getFieldsValue();
        const { exportFormat, exportLimits } = formData;
        // eslint-disable-next-line no-nested-ternary
        const condPageSize = exportLimits === 2 ? (props.exportLimits ? props.exportLimits : 10000) : null;
        props.onExport(exportFormat, condPageSize);
        changeShowMode(false);
    };
    const {
        login,
        tooltip = '告警导出',
        loading = false,
        html = true,
        exportDisable = false,
        exportDisableMsg = '',
        exportAllMsg = '（最多导出1万条）'
    } = props;
    const { container } = login;
    const theme = login?.systemInfo?.theme ?? 'light';
    let iconTheme = '';
    switch (theme) {
        case 'light':
        default:
            iconTheme = 'imp-alarm-export-2021-0710-light';
            break;
        case 'darkblue':
            iconTheme = 'imp-alarm-export-2021-0710-darkblue';
            break;
        case 'dark':
            iconTheme = 'imp-alarm-export-2021-0710-dark';
            break;
    }
    return (
        <main>
            <Tooltip title={tooltip}>
                <Icon
                    antdIcon
                    className={`imp-alarm-export-2021-0710 ${iconTheme}`}
                    // style={{ fontSize: '14px' }}
                    type="icondaochu1"
                    onClick={() => {
                        if (exportDisable) {
                            message.warn(exportDisableMsg);
                        } else {
                            changeShowMode(true);
                        }
                    }}
                />
            </Tooltip>
            <Modal
                className="alarm-query-export-setting-modal"
                title="导出条件"
                visible={showMode}
                maskClosable={false}
                closable={false}
                getContainer={container || null}
                footer={
                    <CustomModalFooter
                        okText="导出"
                        confirmLoading={loading}
                        onCancel={() => {
                            changeShowMode(false);
                        }}
                        onOk={onSave}
                    />
                }
            >
                <Form
                    form={formInstance}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ exportFormat: 0, exportLimits: 1 }}
                >
                    <Form.Item label="导出格式" name="exportFormat" initialValues="2">
                        <Radio.Group>
                            <Radio value={0}>csv&emsp;&emsp;&emsp;&ensp;&thinsp;</Radio>
                            <Radio value={1}>excel</Radio>
                            {html && <Radio value={2}>html</Radio>}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="导出范围" name="exportLimits">
                        <Radio.Group>
                            <Radio value={1}>当前页数据</Radio>
                            <Radio value={2}>
                                全量导出<span className="export-limits-option-all">{exportAllMsg}</span>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </main>
    );
};
export default withModel(useLoginInfoModel, (login) => ({
    login
}))(AlarmExport);
