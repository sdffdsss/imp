import React, { useState, useEffect } from 'react';
import './style.less';
//import { VirtualTable } from 'oss-web-common';
import { Modal, Button } from 'oss-ui';
import AlarmQuery from '@Src/pages/search/alarm-query';

// const columns = [
//     {
//         title: '省份',
//         key: 'sf',
//         dataIndex: 'sf',
//         ellipsis: true,
//     },
//     {
//         title: '地市',
//         key: 'ds',
//         dataIndex: 'ds',
//         ellipsis: true,
//     },
// ];
interface AlarmTableModalProps {
    visible: boolean;
    closeModal: () => void;
    condition: any;
}

const AlarmTable = (props: AlarmTableModalProps) => {
    const { visible, closeModal, condition } = props;
    const [conditions, setConditions] = useState({ sheet_no: { operator: 'eq', value: '' } });

    useEffect(() => {
        setConditions(condition);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [condition]);

    /**
     * @description: 获取列表数据
     * @param params
     * @return n*o
     */

    // const getTableData = async () => {
    //     return {
    //         success: true,
    //         total: 2,
    //         data: [
    //             {
    //                 sf: '1',
    //                 ds: '1',
    //             },
    //             {
    //                 sf: '1',
    //                 ds: '1',
    //             },
    //         ],
    //     };
    // };

    return (
        <Modal
            title="告警列表"
            visible={visible}
            width={1000}
            getContainer={false}
            className="alarm-table-content"
            onCancel={() => {
                closeModal();
            }}
            footer={
                <Button
                    onClick={() => {
                        closeModal();
                    }}
                >
                    取消
                </Button>
            }
        >
            <div style={{ height: '400px' }}>
                {/* <VirtualTable
                    global={window}
                    columns={columns}
                    request={getTableData}
                    rowKey="id"
                    bordered
                    dateFormatter="string"
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    options={false}
                    search={false}
                /> */}
                <AlarmQuery mode="alarm-window" search={false} condition={conditions} />
            </div>
        </Modal>
    );
};
export default AlarmTable;
