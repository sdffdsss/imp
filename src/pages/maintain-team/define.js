import React from 'react';

function maintainTeamColumns(handleSearch) {
    return [
        { dataIndex: 'rowKey', key: 'rowKey', hideInTable: true },
        { dataIndex: 'mteamId', key: 'mteamId', hideInTable: true },
        { dataIndex: 'professionalId', key: 'professionalId', hideInTable: true },
        { dataIndex: 'provinceId', key: 'provinceId', hideInTable: true },
        { title: '专业名称', ellipsis: true, dataIndex: 'professionalName', key: 'professionalName', width: 60, sorter: true },
        { title: '省份名称', ellipsis: true, dataIndex: 'provinceName', key: 'provinceName', width: 60, sorter: true },
        {
            title: '班组名称',
            dataIndex: 'mteamName',
            key: 'mteamName',
            sorter: true,
            render: (text, record) => {
                return (
                    <div
                        onClick={() => {
                            handleSearch(record);
                        }}
                        title={text}
                        style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            ellipsis: true,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#1677ff',
                        }}
                    >
                        {text}
                    </div>
                );
            },
        },
        { title: '班组模式', ellipsis: true, dataIndex: 'mteamModelName', key: 'mteamModelName', sorter: true, width: 60 },
        { title: '班组维度', ellipsis: true, dataIndex: 'dimensions', key: 'dimensions', width: 60, sorter: true },
        { title: '告警判别字段', ellipsis: true, dataIndex: 'alarmsFieldsCond', key: 'alarmsFieldsCond', width: 100, sorter: true },
        { title: '创建人', ellipsis: true, dataIndex: 'creator', key: 'creator', width: 60, sorter: true },
        { title: '创建时间', ellipsis: true, dataIndex: 'createTime', key: 'createTime', width: 120, valueType: 'dateTime', sorter: true },
        { title: '最后修改人', ellipsis: true, dataIndex: 'modifier', key: 'modifier', width: 70, sorter: true },
        { title: '最后修改时间', ellipsis: true, dataIndex: 'latestTime', key: 'latestTime', width: 120, valueType: 'dateTime', sorter: true },
    ].map((item) => {
        return {
            ...item,
            align: 'center',
            hideInSearch: true,
        };
    });
}

const moduleId = 62;
const modelId = 2;

export { maintainTeamColumns, moduleId, modelId };
