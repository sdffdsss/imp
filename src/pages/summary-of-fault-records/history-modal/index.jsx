import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Modal, message, VirtualTable, ProTable } from 'oss-ui';
import { faultOperateHistoryList } from '../api';
import { getColumns } from './columns';
import './index.less';

const HistoryModal = (props) => {
    const { isModalOpen, handleCancel, currentItem } = props;

    const getData = async () => {
        const { id: faultRecordId } = currentItem;
        return faultOperateHistoryList({ faultRecordId })
            .then(
                (res) => {
                    return { data: res.data || [], success: true, total: res.total || 0 };
                },
                (error) => {
                    message.error(error);
                    return {
                        data: [],
                        // success 请返回 true，
                        // 不然 table 会停止解析数据，即使有数据
                        success: false,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: 0,
                    };
                },
            )
            .catch((e) => {
                message.error(e);
                return {
                    data: [],
                    // success 请返回 true，
                    // 不然 table 会停止解析数据，即使有数据
                    success: false,
                    // 不传会使用 data 的长度，如果是分页一定要传
                    total: 0,
                };
            });
    };

    return (
        <>
            <Modal title={'查看故障记录操作历史'} visible={isModalOpen} width={1200} destroyOnClose onCancel={handleCancel} footer={null}>
                <ProTable
                    global={window} // 必填项
                    columns={getColumns()}
                    request={getData}
                    rowKey={(record) => record.id}
                    size="small"
                    scroll={{ x: 'max-content' }}
                    tableAlertOptionRender={false}
                    tableAlertRender={false}
                    form={{
                        align: 'left',
                        labelCol: { span: 6 },
                    }}
                    toolBarRender={false}
                    search={false}
                />
            </Modal>
        </>
    );
};

export default HistoryModal;
