import React from 'react';

const getDefaultColor = (record: any, type: any = '') => {
    if ((record?.total === 0 || record?.total === '--') && record?.provinceName !== '集团') {
        return '#FAB2B2';
    }
    if (type === '总计' || record?.provinceName === '总计') {
        return 'lightsteelblue';
    }
    return '';
};

export const getExistColumns = (roots: any, networkKeys: any, enums: any, rootNetworkLayerOptions: any) => {
    const cols: any = [
        {
            title: (
                <div className="headerCell">
                    <div className="title afer">根因专业</div>
                    <div className="title before">网络类型</div>
                    <div className="title end">上报省份</div>
                </div>
            ),
            dataIndex: 'provinceName',
            key: 'provinceName',
            width: 105,
            fixed: 'left',
            align: 'center',
            // 设置整列背景色
            onCell: (record: any) => ({
                style: {
                    backgroundColor: getDefaultColor(record, ''),
                    width: 105,
                },
            }),
            onHeaderCell: () => ({
                style: {
                    width: 105,
                },
            }),
        },
    ];
    if (roots?.length > 0) {
        roots.forEach((key: any) => {
            const existCol: any = enums?.rootCauseProfession?.find((item: any) => item.key === key);
            if (existCol) {
                const col = {
                    key: existCol.key,
                    title: existCol.value,
                    hideInSearch: true,
                    align: 'center',
                    // width: 960,
                    children: [],
                };
                if (networkKeys?.length > 0) {
                    let newNetworkKeys = networkKeys;
                    if (rootNetworkLayerOptions) {
                        newNetworkKeys = rootNetworkLayerOptions[existCol.key]?.map((item: any) => item.key);
                    }
                    newNetworkKeys.forEach((n: any) => {
                        const netCol: any = enums?.networkLayer?.find((item: any) => item.key === n);
                        if (netCol) {
                            const colN = {
                                title: netCol.value,
                                key: `col${key}${n}`,
                                dataIndex: `col${key}${n}`,
                                align: 'center',
                                width: 120,
                                hideInSearch: true,
                                // 设置整列背景色
                                onCell: (record: any) => ({
                                    style: {
                                        backgroundColor: getDefaultColor(record, ''),
                                    },
                                }),
                                onHeaderCell: () => ({
                                    style: {
                                        height: 48,
                                    },
                                }),
                            };
                            col.children.push(colN);
                        }
                    });
                } else {
                    enums?.networkLayer?.forEach((n: any) => {
                        const colN = {
                            title: n.value,
                            key: `col${key}${n.key}`,
                            dataIndex: `col${key}${n.key}`,
                            align: 'center',
                            width: 120,
                            hideInSearch: true,
                            // 设置整列背景色
                            onCell: (record: any) => ({
                                style: {
                                    backgroundColor: getDefaultColor(record, ''),
                                },
                            }),
                            onHeaderCell: () => ({
                                style: {
                                    height: 48,
                                },
                            }),
                        };
                        col.children.push(colN);
                    });
                }
                cols.push(col);
            }
        });
    } else {
        enums?.rootCauseProfession?.forEach((item: any) => {
            const col = {
                key: item.key,
                title: item.value,
                hideInSearch: true,
                align: 'center',
                // width: 960,
                children: [],
            };
            if (networkKeys?.length > 0) {
                networkKeys.forEach((n: any) => {
                    const netCol: any = enums?.networkLayer?.find((w: any) => w.key === n);
                    if (netCol) {
                        const colN = {
                            title: netCol.value,
                            key: `col${item.key}${n}`,
                            dataIndex: `col${item.key}${n}`,
                            align: 'center',
                            width: 120,
                            hideInSearch: true,
                            // 设置整列背景色
                            onCell: (record: any) => ({
                                style: {
                                    backgroundColor: getDefaultColor(record, ''),
                                },
                            }),
                            onHeaderCell: () => ({
                                style: {
                                    height: 48,
                                },
                            }),
                        };
                        col.children.push(colN);
                    }
                });
            } else {
                enums?.networkLayer?.forEach((n: any) => {
                    const colN = {
                        title: n.value,
                        key: `col${item.key}${n.key}`,
                        dataIndex: `col${item.key}${n.key}`,
                        align: 'center',
                        width: 120,
                        hideInSearch: true,
                        // 设置整列背景色
                        onCell: (record: any) => ({
                            style: {
                                backgroundColor: getDefaultColor(record, ''),
                            },
                        }),
                        onHeaderCell: () => ({
                            style: {
                                height: 48,
                            },
                        }),
                    };
                    col.children.push(colN);
                });
            }
            cols.push(col);
        });
    }
    cols.push({
        title: '总计',
        hideInSearch: true,
        align: 'center',
        // width: 240,
        children: [
            {
                title: '集约化网络故障数',
                key: 'jiYueHuatotal',
                dataIndex: 'jiYueHuatotal',
                align: 'center',
                width: 105,
                hideInSearch: true,
                // 设置整列背景色
                onCell: (record: any) => ({
                    style: {
                        backgroundColor: getDefaultColor(record, '总计'),
                    },
                }),
                // 设置表头背景色
                onHeaderCell: () => ({
                    style: {
                        backgroundColor: 'lightsteelblue',
                        height: 48,
                    },
                }),
            },
            {
                title: '省内故障数',
                key: 'shengNeitotal',
                dataIndex: 'shengNeitotal',
                align: 'center',
                width: 105,
                hideInSearch: true,
                // 设置整列背景色
                onCell: (record: any) => ({
                    style: {
                        backgroundColor: getDefaultColor(record, '总计'),
                    },
                }),
                // 设置表头背景色
                onHeaderCell: () => ({
                    style: {
                        backgroundColor: 'lightsteelblue',
                        height: 48,
                    },
                }),
            },
            {
                title: '总数',
                key: 'total',
                dataIndex: 'total',
                align: 'center',
                width: 105,
                hideInSearch: true,
                // 设置整列背景色
                onCell: (record: any) => ({
                    style: {
                        backgroundColor: getDefaultColor(record, '总计'),
                    },
                }),
                // 设置表头背景色
                onHeaderCell: () => ({
                    style: {
                        backgroundColor: 'lightsteelblue',
                        height: 48,
                    },
                }),
            },
        ],
        // 设置表头背景色
        onHeaderCell: () => ({
            style: {
                backgroundColor: 'lightsteelblue !important',
            },
        }),
        className: 'totalHeader',
    });
    return cols;
};
