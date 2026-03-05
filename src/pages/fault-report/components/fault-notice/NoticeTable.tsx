import React, { useRef } from 'react';
import { Table, Tag, Button, Icon } from 'oss-ui';

import './index.less';

export default (props) => {
    const { 
        dataSource = [], 
        phoneList = [], 
        editable = false, 
        onTableDelete, 
        onTagDelete, 
        tableDeleteBtnType, 
        maxHeight, 
        faultLevel,
        isManualReport, // 是否手工上报
        ruleProfessional, // 规则基本信息中的专业
        manualProfessional // 手工上报弹窗传出的专业
    } = props;

    const columns: any = [
        // {
        //     title: '专业',
        //     dataIndex: 'professionalName',
        //     key: 'professionalName',
        //     align: 'center',
        //     width: 120,
        //     render: (text, record) => {
        //         // 手工上报使用弹窗传出的专业，自动上报使用规则基本信息中的专业
        //         if (isManualReport) {
        //             return manualProfessional?.label || '-';
        //         } else {
        //             return ruleProfessional?.label || text || '-';
        //         }
        //     },
        // },
        {
            title: '省份',
            dataIndex: 'provinceNames',
            key: 'provinceNames',
            width: 120,
            align: 'center',
        },
        {
            title: '用户组',
            dataIndex: 'groupNames',
            key: 'groupNames',
            align: 'center',
            render: (text) => {
                let str = text || '';
                if (str.length > 10) {
                    str = `${str.substring(0, 10)}...`;
                }
                return (
                    <div style={{ whiteSpace: 'nowrap' }} title={text}>
                        {str}
                    </div>
                );
            },
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
            align: 'center',
        },
        {
            title: '电话',
            dataIndex: 'userMobile',
            key: 'userMobile',
            align: 'center',
        },
        // 操作列
        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            align: 'center',
            render: (text, record) => {
                // 上报至集团不允许删除
                if (record.originType === 'origin' && faultLevel?.includes('0')) return null;
                return (
                    <Button
                        onClick={() => {
                            onTableDelete?.(record);
                        }}
                        type={tableDeleteBtnType === 'icon' ? 'link' : 'default'}
                    >
                        {tableDeleteBtnType === 'icon' ? <Icon antdIcon type="DeleteOutlined" /> : '删除'}
                    </Button>
                );
            },
        }
    ];
  

    const contentTableRef = useRef<any>();
    // const [tableHeight, setTableHeight] = useState<number>(0);

    // const handleResize = () => {
    //     if (contentTableRef.current.clientHeight) {
    //         setTableHeight(contentTableRef.current.clientHeight);
    //     }
    // };

    // 窗口宽度变化
    // useEffect(() => {
    //     // 监听
    //     window.addEventListener('resize', handleResize);
    //     // 销毁
    //     return () => window.removeEventListener('resize', handleResize);
    // });

    // 设置高度
    // useEffect(() => {
    //     if (contentTableRef.current.clientHeight) {
    //         setTableHeight(contentTableRef.current.clientHeight);
    //     }
    // }, [contentTableRef?.current?.clientHeight, dataSource]);

    return (
        <div className="fault-report-notice-content">
            <div className="fault-report-notice-content-table">
                <Table dataSource={dataSource} columns={columns} ref={contentTableRef} pagination={false} scroll={{ y: maxHeight || 500 }} />
            </div>
            <div
                className="fault-report-notice-content-phone"
                style={{ display: 'none' }}
            >
                临时手机号码：
                {phoneList.map((item, index) => {
                    return (
                        <div key={index} className="fault-report-notice-content-phone-item">
                            <Tag
                                closable={editable}
                                onClose={(e) => {
                                    e.preventDefault();
                                    onTagDelete?.(item);
                                }}
                            >
                                {item}
                            </Tag>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
