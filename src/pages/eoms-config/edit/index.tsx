import React from 'react';
import { Modal, Form, Input, Select, message } from 'oss-ui';
import { Api } from '../api';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';

interface Props {
    editRow: any;
    okCallback: any;
    handleCancel: any;
}
interface States {}
class Index extends React.PureComponent<Props, States> {
    editForm: any = React.createRef();

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        this.initData();
    };

    initData = () => {
        const { editRow } = this.props;

        this.editForm?.current?.setFieldsValue({
            sheetSource: editRow?.sheetSource,
            regionName: editRow?.regionName,
            status: editRow?.status || 0 ? 1 : 0,
        });
    };
    /**
     * @description: 点击保存
     * @param n*o
     * @return n*o
     */

    handleSave = async () => {
        const formValues = this.editForm?.current?.getFieldsValue();
        const { sheetSource, regionName, status } = formValues;
        if (!sheetSource || sheetSource === '') {
            message.warning('请填写大区标识！');
            return;
        }
        if (!regionName || regionName === '') {
            message.warning('请填写大区名称！');
            return;
        }

        const params = {
            sheetSource,
            regionName,
            status,
        };
        console.log(params);
        await Api.addOrUpdateEomsConfig(params);
        this.props.okCallback(params);
    };

    render() {
        const { handleCancel, editRow } = this.props;

        return (
            <Modal width={800} title="新建" visible centered onOk={this.handleSave} onCancel={handleCancel}>
                <Form labelAlign="right" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} ref={this.editForm}>
                    <Form.Item label="大区标识" key="sheetSource" name="sheetSource" rules={[{ required: true, message: '请填写大区标识' }]}>
                        <Input placeholder="请输入大区标识" disabled={editRow} />
                    </Form.Item>
                    <Form.Item label="大区名称" key="regionName" name="regionName" rules={[{ required: true, message: '请填写大区名称' }]}>
                        <Input placeholder="请输入大区名称" />
                    </Form.Item>
                    <Form.Item label="派单开关" key="status" name="status" rules={[{ required: true, message: '请选择派单开关' }]}>
                        <Select>
                            <option key={0} value={0}>
                                关闭
                            </option>
                            <option key={1} value={1}>
                                开启
                            </option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
