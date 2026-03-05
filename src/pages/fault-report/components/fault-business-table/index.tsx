import { Table } from 'oss-ui';
import { ColumnsType } from 'oss-ui/es/table';
import React, { FC, useEffect, useState, useRef } from 'react';
import EllipsisText from '@Pages/components/ellipsis-text';
import { getFailureBusinessDetailsList } from '../../api';
import './style.less';

interface Props {
    maxHeight?: number;
    data: Record<string, any>;
}

const FaultBusinessTable: FC<Props> = (props) => {
    const { maxHeight, data } = props;

    const [isMore, setIsMore] = useState(true); // 是否还有数据
    const [page, setPage] = useState(1); // 页码
    const [total, setTotal] = useState(0); // 总条数
    const [dataSource, setDataSource] = useState<any[]>([]); // 数据

    const scrollRef = useRef<any>();

    const getList = async (pages: number) => {
        if (page !==1 && pages === page) {
            return;
        }
        const params = {
            pageNum: pages,
            pageSize: 10,
            standardAlarmId: data?.standardAlarmId,
            // standardAlarmId: '590290398_3189621253_3580783951_1064833205',
        };
        const res = await getFailureBusinessDetailsList(params);
        if (res.total) {
            setTotal(res.total);
            setDataSource([...dataSource, ...res.dataObject]);
        }
    };

    useEffect(() => {
        if (data?.standardAlarmId) {
            getList(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: ColumnsType<any> = [
        {
            title: '省份',
            dataIndex: 'province',
            key: 'province',
            align: 'center',
            width: 60,
            render: (text) => <EllipsisText text={text} maxLength={3} />,
        },
        {
            title: '地市',
            dataIndex: 'region',
            key: 'region',
            align: 'center',
            width: 60,
            render: (text) => <EllipsisText text={text} maxLength={4} />,
        },
        {
            title: '传输系统',
            dataIndex: 'transSystem',
            key: 'transSystem',
            align: 'center',
            width: 180,
            render: (text) => <EllipsisText text={text} maxLength={12} />,
        },
        {
            title: '传输段',
            dataIndex: 'transSeg',
            key: 'transSeg',
            align: 'center',
            width: 240,
            render: (text) => <EllipsisText text={text} maxLength={20} />,
        },
        {
            title: '电路名称',
            dataIndex: 'traphNo',
            key: 'traphNo',
            align: 'center',
            width: 150,
            render: (text) => <EllipsisText text={text} maxLength={10} />,
        },
        {
            title: '速率',
            dataIndex: 'rate',
            key: 'rate',
            align: 'center',
            width: 80,
            render: (text) => <EllipsisText text={text} maxLength={4} />,
        },
        {
            title: '专业',
            dataIndex: 'specialty',
            key: 'specialty',
            align: 'center',
            width: 80,
            render: (text) => <EllipsisText text={text} maxLength={5} />,
        },
        {
            title: '路由',
            dataIndex: 'route',
            key: 'route',
            align: 'center',
            width: 100,
            render: (text) => <EllipsisText text={text} maxLength={7} />,
        },
        {
            title: '是否党政专线',
            dataIndex: 'line',
            key: 'line',
            align: 'center',
            width: 120,
            render: (text) => <EllipsisText text={text} maxLength={6} />,
        },
    ];

    const onScrollCapture = async () => {
        const dom: any = scrollRef.current;
        if (dom) {
            // scrollTop会有小数点导致等式不成立，解决方案：四舍五入
            if (Math.ceil(dom.scrollTop) + dom.clientHeight === dom.scrollHeight) {
                if (Math.ceil(total / 10) === page) {
                    setIsMore(false);
                    return;
                }
                getList(page + 1);
                setPage(page + 1);
            }
        }
    };

    return (
        <div className="fault-report-notice-content fault-business-table">
            <div className="fault-report-notice-content-table-head">
                <Table dataSource={[]} columns={columns} pagination={false}/>
            </div>
            {/* <ul className="table-header">
                {columns.map((item) => (
                    <li key={item.key}>
                        {item.title}
                    </li>
                ))}
            </ul> */}

            <div
                className="fault-report-notice-content-table"
                onScrollCapture={onScrollCapture}
                style={{ height: dataSource.length ? 270 : 30, overflowY: 'scroll' }}
                ref={scrollRef}
            >
                <Table columns={columns} dataSource={dataSource} size="small" pagination={false} />
                {/* {!isMore ? <div className="no-more">已经到底啦</div> : null} */}
            </div>
        </div>
    );
};

export default FaultBusinessTable;
