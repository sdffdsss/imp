import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Modal, Button, Icon, Table } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import shareActions from '@Src/share/actions';
import CustomModalFooter from '@Components/custom-modal-footer';
import AlarmCol from '../../alarm-column';

const Index = (props) => {
    const [options, setOptions] = useState([]);
    const [alarmColumn, setAlarmColumn] = useState([]);
    const [templateModalDataSource, setTemplateModalDataSource] = useState([]);
    const [templateModal, setTemplateModal] = useState(false);
    const frameInfo = useLoginInfoModel();
    const handleDetail = () => {
        setTemplateModal(true);
    };
    const handleEdit = () => {};
    const alarmColumnChange = ({ showInTableColumns }) => {
        const dataSource = showInTableColumns.map((item, index) => {
            const { dataIndex, title } = item;
            return { dataIndex, title, number: index + 1 };
        });

        setTemplateModalDataSource(dataSource);
        // setAlarmColumn(alarmColumn);
    };
    const templateChange = (templateId) => {
        props.templateChange(templateId);
    };
    const templateModalColumns = [
        { key: 'number', dataIndex: 'number', title: '序号' },
        { key: 'tilte', dataIndex: 'title', title: '名称' },
        { key: 'dataIndex', dataIndex: 'dataIndex', title: '字段' }
    ];
    const openColTemplate = () => {
        const { actions, messageTypes } = shareActions;
        actions.postMessage(messageTypes.openRoute, {
            entry: '/alarm/setting/views/col-template'
        });
    };
    return (
        <Row gutter={10}>
            <Col span={9}>
                <Form.Item label="选择列模板" labelCol={{ span: 8 }} name="columnTemplateId">
                    <AlarmCol
                        columnTemplateId={props.columnTemplateId}
                        templateChange={templateChange}
                        alarmColumnChange={alarmColumnChange}
                        loading={true}
                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                    ></AlarmCol>
                </Form.Item>
            </Col>
            <Col>
                <Button icon={<Icon antdIcon={true} type={'SearchOutlined'} />} onClick={handleDetail}>
                    {'列模板查看'}
                </Button>
            </Col>
            <Col>
                <Button icon={<Icon antdIcon={true} type={'CalendarOutlined'} />} onClick={openColTemplate}>
                    {'列模板管理'}
                </Button>
            </Col>
            <Modal
                title="列模板查看"
                visible={templateModal}
                // onOk={this.ModalHandleOk}
                onCancel={() => {
                    setTemplateModal(false);
                }}
                // // className="alarm-query-form-sort-drag-modal-del"
                footer={
                    <CustomModalFooter
                        onOk={() => {
                            setTemplateModal(false);
                        }}
                        onCancel={() => {
                            setTemplateModal(false);
                        }}
                    />
                }
                // destroyOnClose={true}
                maskClosable={false}
                getContainer={frameInfo.container}
            >
                <Table
                    // rowSelection={rowSelection}
                    columns={templateModalColumns}
                    dataSource={templateModalDataSource}
                    size="small"
                    pagination={false}
                    scroll={{ y: 350 }}
                ></Table>
            </Modal>
        </Row>
    );
};
export default Index;
