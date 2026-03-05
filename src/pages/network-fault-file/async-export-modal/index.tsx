import React, { useMemo } from 'react';
import { Table, Modal, Button, Progress } from 'oss-ui';
import { TableProps } from 'oss-ui/lib/table';
import { DataType } from './type';
import './index.less';

interface Props {
    visible: boolean;
    onExport: () => void;
    onDownLoad: () => void;
    onDelete: () => void;
    onClose: () => void;
    exportList: DataType[];
    total: number;
}

/**
 * @description 异步导出弹窗模版 建议整个直接复制
 * @param props
 * @returns
 */
const AsyncExportModal: React.FC<Props> = (props) => {
    const { visible, onExport, exportList, onDownLoad, onClose, total, onDelete } = props;
    const asyncExportTable: TableProps<DataType>['columns'] = [
        {
            title: '导出格式',
            dataIndex: 'exportFormat',
            key: 'exportFormat',
            align: 'center',
        },
        {
            title: '导出时间',
            dataIndex: 'exportTime',
            key: 'exportTime',
            align: 'center',
        },
        {
            title: '导出总量',
            dataIndex: 'exportTotal',
            key: 'exportTotal',
            align: 'center',
        },
        {
            title: '导出状态',
            dataIndex: 'exportState',
            key: 'exportState',
            align: 'center',
        },
        {
            title: '导出进度',
            dataIndex: 'exportSchedule',
            key: 'exportSchedule',
            align: 'center',
            render: (text, { exportSchedule }) => {
                return <Progress percent={exportSchedule.percent} size="small" status={exportSchedule.status} />;
            },
        },
        {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            align: 'center',
            render: (text, { exportSchedule }) => {
                const disableFlag = exportSchedule.percent !== 100 || exportSchedule.status === 'exception';
                if (disableFlag) {
                    return (
                        <button type="button" className="async-export-down-button" onClick={onDelete}>
                            删除
                        </button>
                    );
                }
                return (
                    <button type="button" className="async-export-down-button" onClick={onDownLoad}>
                        下载
                    </button>
                );
            },
        },
    ];
    const onCancel = () => {
        onClose();
    };
    const buttonDisabled = useMemo(() => {
        if (!exportList) return false;
        if (exportList.length === 0) return false;
        if (exportList[0]?.exportSchedule.status === 'exception') return false;
        return exportList[0]?.exportSchedule.percent !== 100;
    }, [exportList]);
    return (
        <Modal destroyOnClose title="导出" width={700} visible={visible} footer={null} onCancel={onCancel} maskClosable={false}>
            <div className="async-export-box">
                <div className="async-export-item">
                    <div>导出数据：{total}</div>
                    <div>导出格式：EXCEL</div>
                    <div className="async-export-button-box">
                        <Button type="primary" onClick={onExport} disabled={buttonDisabled}>
                            导出
                        </Button>
                        <Button onClick={onCancel}>取消</Button>
                    </div>
                </div>
                <div className="async-list-title">导出列表</div>
                <Table columns={asyncExportTable} dataSource={exportList} pagination={false} />
            </div>
        </Modal>
    );
};

export default AsyncExportModal;
