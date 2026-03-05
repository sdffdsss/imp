import type { PaginationProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, useState } from 'react';
import { Modal, Table, Button, message } from 'oss-ui';
import type { TableRowSelection } from 'antd/es/table/interface';
import { postCutoverList } from '../../../api';
import { MAJOR_ENUM } from '../../../type';
import style from './style.module.less';

interface Props {
    visible: boolean;
    provinceId: number;
    setVisible: (data: boolean) => void;
    okCallback: (data: Record<string, any>) => void;
}

const WorkOrderModal: FC<Props> = (props) => {
    const { provinceId, visible, setVisible, okCallback } = props;

    const [total, setTotal] = useState<number>(0);
    const [loading, setLoaidng] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<Record<string, any> | null>(null);

    // 需要查询限制登录者省份和专业为 业务平台专业
    const defaultParmas = {
        provinceId,
        professionType: MAJOR_ENUM.BUSINESS,
    };

    const getList = async (params) => {
        setLoaidng(true);
        try {
            const res = await postCutoverList(params);
            if (res.code === 200) {
                setDataSource(res.data);
                setTotal(res.total);
            }
        } catch {
            message.error('接口错误');
        } finally {
            setLoaidng(false);
        }
    };

    useEffect(() => {
        if (visible) {
            getList({
                ...defaultParmas,
                current: 1,
                pageSize: 20,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const handleCancel = () => {
        setSelectedRows(null);
        setVisible(false);
    };

    const onOk = () => {
        if (selectedRows) {
            okCallback(selectedRows);
            handleCancel();
        } else {
            message.warn('请选择一条工单!');
        }
    };

    const columns: ColumnsType<Record<string, any>> = [
        {
            title: '工单编号',
            dataIndex: 'sheetNo',
            key: 'sheetNo',
            align: 'center',
        },
        {
            title: '主题',
            dataIndex: 'theme',
            key: 'theme',
            align: 'center',
        },
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTime',
            key: 'cutoverStartTime',
            align: 'center',
        },
        {
            title: '割接结束时间',
            dataIndex: 'cutoverEndTime',
            key: 'cutoverEndTime',
            align: 'center',
        },
    ];

    const rowSelection: TableRowSelection<Record<string, any>> = {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRow) => {
            setSelectedRows(selectedRow[0]);
        },
    };

    const onChange: PaginationProps['onChange'] = (current, pageSize) => {
        getList({
            ...defaultParmas,
            current,
            pageSize,
        });
    };

    const footer = (
        <div className={style.footer}>
            <Button type="primary" onClick={onOk}>
                确定
            </Button>
            <Button onClick={handleCancel}>取消</Button>
        </div>
    );

    return (
        <Modal title="选择工单" visible={visible} width={800} footer={footer} onCancel={handleCancel} destroyOnClose>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowSelection={{ ...rowSelection }}
                size="middle"
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                    onChange,
                    showTotal: (totalNum, range) => `第 ${range[0]}-${range[1]} 条/总共 ${totalNum} 条`,
                    showSizeChanger: true,
                    defaultPageSize: 20,
                    total,
                }}
            />
        </Modal>
    );
};

export default WorkOrderModal;
