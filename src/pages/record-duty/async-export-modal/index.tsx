import React, { useMemo } from 'react';
import { Table, Modal, Button, Progress } from 'oss-ui';
import { TableProps } from 'oss-ui/lib/table';
import './index.less';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onClick: () => void;
    onExport: () => void;
    onDownLoad: () => void;
    onClose: () => void;
    exportList: DataType[];
    total: number;
}
interface DataType {
    key: string;
    exportFormat: string;
    exportTime: string;
    exportTotal: string;
    exportState: string;
    exportSchedule: {
        status: 'exception' | 'success' | 'normal' | 'active' | undefined;
        percent: number;
    };
}
const AsyncExportModal: React.FC<Props> = (props) => {
    const { visible, setVisible, onExport, exportList, onDownLoad, onClose, total } = props;
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
                return (
                    <button
                        type="button"
                        className="async-export-down-button"
                        disabled={exportSchedule.percent !== 100 || exportSchedule.status === 'exception'}
                        onClick={onDownLoad}
                    >
                        下载
                    </button>
                );
            },
        },
    ];
    const onCancel = () => {
        onClose();
        setVisible(false);
    };
    const buttonDisabled = useMemo(() => {
        if (!exportList) return false;
        if (exportList.length === 0) return false;
        if (exportList[0]?.exportSchedule.status === 'exception') return false;
        return exportList[0]?.exportSchedule.percent !== 100;
    }, [exportList]);
    return (
        <Modal destroyOnClose title="导出" width={700} visible={visible} footer={null} onCancel={onCancel}>
            <div className="async-export-box">
                <div className="async-export-item">
                    <div>导出数据：{total}</div>
                    <div>导出格式：{total > 200000 ? 'ZIP' : 'EXCEL'}</div>
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
