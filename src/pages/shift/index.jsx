import React, { PureComponent } from 'react';
import { Form, Input, Button, Row } from 'oss-ui';
import EditTable from './edit-table';
import constants from '@Src/common/constants';

class index extends PureComponent {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            loading: false,
        };
    }
    showModal = () => {
        this.setState({ visible: true });
    };
    /* handleSave = () => {
        console.log('保存');
        let experiencesForm = this.ref.experiencesForm;
        experiencesForm.validateFields(['vendor', 'professional'], (err, values) => {
             if (!err) {
                 
             } else {
                 console.log(err);
             }
         }); 
         const onFinish = (values) => {
            
          };
        
    };
 */

    handleSave = () => {
        this.formRef.current.validateFields().then((err, values) => {
            if (!err) {
            } else {
                console.log(err);
            }
            this.props.history.push({ pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/shift/shift-work`, state: this.props.location.state });
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };
    onFinish = (v) => {
        /* console.log(v);
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000); */
        this.formRef.current.validateFields().then((err, values) => {
            if (!err) {
            } else {
                console.log(err);
            }
            this.props.history.push({ pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/shift/shift-work`, state: this.props.location.state });
        });
    };

    render() {
        // const { isCreate = true } = this.props;
        const shiftMode = this.props?.location?.state;
        const postName = '值班长';
        const dutyName = '王强';
        // console.log('编辑页面：');
        // console.log(isCreate);
        // const titleWorld = '';
        // //判断shiftMode状态，1-交接班，2-替班
        // if (shiftMode === '1') {
        //     titleWorld = '交接班人员信息';
        // } else if (shiftMode === '2') {
        //     titleWorld = '替班人员信息';
        // }

        return (
            /*  <Modal
                width={800}
                style={{ height: '580px' }}
                title={titleWorld}
                visible={visible}
                centered
                onOk={this.handleSave}
                onCancel={this.handleCancel}
            > */
            <div>
                <Form
                    labelAlign="left"
                    height="30px"
                    labelCol={{ span: 2 }}
                    onFinish={this.onFinish}
                    wrapperCol={{ span: 24 }}
                    onOk={this.handleSave}
                    ref={this.formRef}
                >
                    <Form.Item name="templateName" label={postName}>
                        <span>{dutyName}</span>
                    </Form.Item>

                    <Form.Item name="description" label="">
                        <Input.TextArea></Input.TextArea>
                    </Form.Item>

                    <EditTable shiftMode={shiftMode}></EditTable>

                    <Row gutter={24} style={{ padding: '15px', width: '100%', marginLeft: '50%' }}>
                        <Button type="primary" htmlType="submit" className="volume-btn">
                            保存
                        </Button>
                    </Row>
                </Form>
            </div>
            /*   </Modal> */
        );
    }
}
export default index;
