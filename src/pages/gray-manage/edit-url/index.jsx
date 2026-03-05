import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { Api } from '../api';
import { useEnvironmentModel } from '@Src/hox';

// eslint-disable-next-line @typescript-eslint/naming-convention
class index extends PureComponent {
    grayManageForm = React.createRef();

    constructor(props) {
        super(props);
        const radioOptions = useEnvironmentModel.data.environment?.grayManage?.radioOptions || [];
        this.state = {
            envType: 0,
            redirectUrl: '',
            radioOptions,
        };
    }

    componentDidMount = async () => {
        const { editRow, editRows, isBatchUpdate } = this.props;
        const { radioOptions } = this.state;
        if (!isBatchUpdate && editRow && !_.isEmpty(editRow)) {
            const redirectUrlRadio = radioOptions.find((obj) => {
                return obj.text === editRow.redirectUrl;
            });
            this.setState(
                {
                    envType: redirectUrlRadio?.value,
                    redirectUrl: editRow.redirectUrl,
                },
                () => {
                    const params = {
                        canaryRelationId: editRow.canaryRelationId,
                        canaryRelationName: editRow.canaryRelationName,
                        redirectUrl: editRow.redirectUrl,
                        redirectUrlRadioItem: redirectUrlRadio?.value,
                    };
                    this?.grayManageForm?.current?.setFieldsValue(params);
                },
            );
        } else if (isBatchUpdate && editRows) {
            this.setState(
                {
                    envType: radioOptions ? radioOptions[0]?.value : 0,
                    redirectUrl: radioOptions ? radioOptions[0]?.text : '',
                },
                () => {
                    const params = {
                        redirectUrlRadioItem: radioOptions ? radioOptions[0]?.value : 0,
                        redirectUrl: radioOptions ? radioOptions[0]?.text : '',
                    };
                    this?.grayManageForm?.current?.setFieldsValue(params);
                },
            );
        }
    };

    onJumpTypeChange = (e) => {
        const { radioOptions } = this.state;
        this.setState({
            envType: e.target.value,
            redirectUrl: radioOptions[e.target.value].text,
        });
        this?.grayManageForm?.current?.setFieldsValue({ redirectUrl: radioOptions[e.target.value].text });
    };
    /**
     * @description: 点击保存
     * @param n*o
     * @return n*o
     */

    handleSave = async () => {
        const { redirectUrl } = this.state;
        const { editRow, editRows, isBatchUpdate } = this.props;
        if (!isBatchUpdate && editRow) {
            const params = {
                canaryId: editRow.canaryId,
                canaryType: editRow.canaryType,
                canaryRelationId: editRow.canaryRelationId,
                canaryRelationName: editRow.canaryRelationName,
                redirectUrl,
            };
            await Api.editCanaryData(params);
            this.props.okCallback(params);
        } else if (isBatchUpdate && editRows) {
            // batchUpdateCanaryData
            const params = {
                canaryIds: editRows,
                redirectUrl,
            };
            await Api.batchUpdateCanaryData(params);
            this.props.okCallback(params);
        }
    };

    onRedirectUrlChange = (e) => {
        this.setState({
            redirectUrl: e.target.value,
        });
    };

    render() {
        const { handleCancel, isBatchUpdate } = this.props;
        const { envType, redirectUrl, radioOptions } = this.state;
        return (
            <Modal width={800} title="编辑" visible centered onOk={this.handleSave} onCancel={handleCancel}>
                <Form labelAlign="right" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} ref={this.grayManageForm}>
                    {!isBatchUpdate && (
                        <Form.Item label="ID" name="canaryRelationId">
                            <Input disabled />
                        </Form.Item>
                    )}
                    {!isBatchUpdate && (
                        <Form.Item label="名称" name="canaryRelationName">
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item label="跳转环境" key="redirectUrlRadioItem" name="redirectUrlRadioItem">
                        <Radio.Group options={radioOptions} defaultValue={envType} value={envType} onChange={this.onJumpTypeChange} />
                    </Form.Item>
                    <Form.Item label="跳转URL" name="redirectUrl" rules={[{ required: true, message: '请填写跳转URL' }]}>
                        <Input placeholder="请输入URL" value={redirectUrl} onChange={this.onRedirectUrlChange} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default index;
