import React, { FC, useState, useEffect } from 'react';
import { Modal, Table } from 'oss-ui';
import { ColumnsType } from 'oss-ui/es/table';
import type { PaginationProps } from 'antd';
import EllipsisText from '@Pages/components/ellipsis-text';
import { getOpticalCableDetailsList } from '../../../api';
import './style.less';

interface Props {
    visible: boolean;
    setVisible: (data: boolean) => void;
    paramsData: Record<string, any>;
}

const DetailModal: FC<Props> = (props) => {
    const { visible, setVisible, paramsData } = props;

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageNum, setPageNum] = useState<number>(1);

    const getList = async (data) => {
        const res = await getOpticalCableDetailsList(data);
        if (+res.code === 200) {
            setPageNum(data.pageNum);
            setDataSource(res.dataObject);
            setTotal(res.total);
        }
    };

    useEffect(() => {
        const { startProvince, endProvince, startCity, endCity, regionId } = paramsData;
        const data = {
            pageNum: 1,
            pageSize: 10,
            startProvince,
            endProvince,
            startCity,
            endCity,
            regionId,
        };
        getList(data);
    }, [paramsData]);

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const columns: ColumnsType<any> = [
        {
            title: '起始省份',
            dataIndex: 'startProvince',
            key: 'startProvince',
            align: 'center',
            render: (text) => <EllipsisText text={text} maxLength={3} />,
        },
        {
            title: '起始地市',
            dataIndex: 'startRegion',
            key: 'startRegion',
            align: 'center',
            render: (text) => <EllipsisText text={text} maxLength={4} />,
        },
        {
            title: '中止省份',
            dataIndex: 'endProvince',
            key: 'endProvince',
            align: 'center',
            render: (text) => <EllipsisText text={text} maxLength={3} />,
        },
        {
            title: '中止地市',
            dataIndex: 'endRegion',
            key: 'endRegion',
            align: 'center',
            render: (text) => <EllipsisText text={text} maxLength={4} />,
        },
        {
            title: '传输系统',
            dataIndex: 'transSystem',
            key: 'transSystem',
            align: 'left',
            width: 150,
            render: (text) => <EllipsisText text={text} maxLength={12} />,
        },
        {
            title: '传输段(放大段)',
            dataIndex: 'transSeg',
            key: 'transSeg',
            align: 'left',
            width: 230,
            render: (text) => <EllipsisText text={text} maxLength={20} />,
        },
        {
            title: '传输段ID',
            dataIndex: 'transSegId',
            key: 'transSegId',
            align: 'center',
            width: 135,
            render: (text) => <EllipsisText text={text} maxLength={16} />,
        },
        {
            title: '当前是否故障',
            dataIndex: 'isAlarm',
            key: 'isAlarm',
            align: 'center',
            width: 90,
            render: (text, record) => {
                return +record.isAlarm === 0 ? '否' : '是';
            },
        },
        {
            title: '光缆段名称',
            dataIndex: 'cableSegmentName',
            key: 'cableSegmentName',
            align: 'left',
            width: 240,
            render: (text) => <EllipsisText text={text} maxLength={18} />,
        },
    ];

    const onChange: PaginationProps['onChange'] = (page, pageSize) => {
        const { startProvince, endProvince, startCity, endCity, regionId } = paramsData;
        const data = {
            pageNum: page,
            pageSize,
            startProvince,
            endProvince,
            startCity,
            endCity,
            regionId,
        };
        getList(data);
    };

    const showTotal: PaginationProps['showTotal'] = (totals) => {
        return `共${totals}条 第${pageNum}页`;
    };

    // 设置故障行类名
    const rowClassName = (record) => {
        if (Number(record.isAlarm) === 1) {
            return 'fault-line';
        }
        return '';
    };

    return (
        <Modal
            title="光缆详情"
            visible={visible}
            width={1250}
            onOk={handleOk}
            onCancel={handleCancel}
            wrapClassName="optic-cable-detail-modal"
            footer={false}
            destroyOnClose
        >
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName={rowClassName}
                scroll={{y: 440}}
                pagination={{
                    total,
                    defaultPageSize: 10,
                    showTotal,
                    onChange,
                    showSizeChanger: false,
                }}
            />
            ;
        </Modal>
    );
};

export default DetailModal;
