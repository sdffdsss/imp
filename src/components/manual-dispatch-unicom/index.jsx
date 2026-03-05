import React from 'react';
import { Table, Form } from 'oss-ui';
// import { getRecordsRecursion } from '../../../alarm-window/common/dataHandler';
// import { rightClickShow2 } from '../../../alarm-window/alarm-show-config';
import './style.less';
const rightClickShow2 = [
    { label: '网元名称', fieldName: 'eqp_label' },
    { label: '告警对象名称', fieldName: 'ne_label' },
    { label: '告警标题', fieldName: 'title_text' },
    { label: '告警发生时间', fieldName: 'event_time' },
];
const Component = (props) => {
    const { record, menuInfo, menuComponentFormRef } = props;
    console.log(record);
    const columns = rightClickShow2.map((item) => ({
        title: item.label,
        dataIndex: item.fieldName,
        ellipsis: true,
        render: (text, record) => text?.value,
    }));
    const datas = record; // getRecordsRecursion(record, menuInfo.isRelated);
    const initialValues = {
        clientName: 'reactor-client', //客户端名称
        sheetNo: '', //工单号
        isDup: false, //是否判重，true/false,是，sheetNo不能为空
        repeatTimes: 2, //调用emos接口重试次数
        repeatInterval: 100, //重试间隔时间
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            menuComponentFormRef.current.setFieldsValue({ hostAlarm: selectedRows });
        },
    };
    const rowKey = (record) => {
        return record.alarm_id?.value;
    };
    return (
        <Form initialValues={initialValues} ref={menuComponentFormRef}>
            <div className="alarm-acknowledgement-table">
                <div className="alarm-acknowledgement-label">告警基本信息如下:</div>
                <Table
                    size="small"
                    dataSource={datas}
                    columns={columns}
                    pagination={false}
                    rowKey={rowKey}
                    // rowSelection={{ type: 'radio', ...rowSelection }}
                ></Table>
            </div>
            <div className="alarm-manual-clearing-tips">
                <span>以上共{datas.length}条告警,是否确认手工派单？</span>
            </div>
        </Form>
    );
};

export default Component;
