import React from 'react';
import { Table, Input, Form } from 'oss-ui';
// import { rightClickShow1 } from '../../../alarm-window/alarm-show-config';
import './index.less';
const rightClickShow1 = [
    { label: '网元名称', fieldName: 'eqp_label' },
    { label: '告警对象名称', fieldName: 'ne_label' },
    { label: '告警标题', fieldName: 'title_text' },
];
const Component = (props) => {
    const { record, menuInfo, menuComponentFormRef } = props;
    const columns = rightClickShow1.map((item) => ({
        title: item.label,
        dataIndex: item.fieldName,
        ellipsis: true,
        render: (text, record) => text?.value,
    }));
    const textchange = (e) => {
        props.addDispatchChange && props.addDispatchChange({ reason: e.target.value });
    };
    const datas = record; // getRecordsRecursion(record, menuInfo.isRelated);
    return (
        <Form ref={menuComponentFormRef}>
            <div className="alarm-manual-clearing-table">
                <div className="alarm-manual-clearing-label">告警基本信息如下:</div>
                <Table size="small" dataSource={datas} columns={columns} pagination={false}></Table>
            </div>
            <div className="alarm-manual-clearing-textarea">
                <div className="alarm-manual-clearing-label">告警清除原因：</div>
                <Form.Item name="reason">
                    <Input.TextArea
                        onChange={textchange}
                        autoSize={{ minRows: 6, maxRows: 10 }}
                        placeholder="请填写告警清除原因，默认为：已阅读"
                    ></Input.TextArea>
                </Form.Item>
            </div>
            <div className="alarm-manual-clearing-tips">
                <span>是否清除：以上共{datas.length}条告警</span>
            </div>
        </Form>
    );
};

export default Component;
