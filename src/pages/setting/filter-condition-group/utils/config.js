import React from 'react';
import Delete from '../delete';
import SelectComp from '../components/comp-select';
import { Icon, Tooltip, Space } from 'oss-ui';
import Export from '../export';
import AuthButton from '@Src/components/auth-button';

/**
 * 网元组配置
 */
export const conf2Necondition = (scope, onProvinceChange, cityList, initProvince) => {
    const { login } = scope.props;
    console.log(login.userId);
    return {
        groupEditComp: 10,
        conditionEditComp: 11,
        groupColumns: [
            {
                title: '序号',
                dataIndex: 'index',
                width: 80,
                align: 'center',
                hideInSearch: true,
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                title: '组名称',
                dataIndex: 'groupName',
                align: 'center',
                width: 120,
                sorter: true,
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span className="btn-text-container" onClick={scope?.showNeList.bind(scope, record)}>
                                {text}
                            </span>
                        </Tooltip>
                    );
                },
            },
            {
                title: '组类型',
                dataIndex: 'groupTypeName',
                align: 'center',
                hideInSearch: true,
                width: 120,
            },
            {
                title: '归属省份',
                dataIndex: 'groupProvinceLabel',
                align: 'center',
                width: 120,
                hideInSearch: true,
            },
            {
                title: '归属地市',
                dataIndex: 'regionName',
                align: 'center',
                width: 120,
                hideInSearch: true,
            },
            {
                title: '归属省份',
                dataIndex: 'provinceId',
                align: 'center',
                width: 120,
                hideInTable: true,
                initialValue: Number(initProvince),
                renderFormItem: () => {
                    return (
                        <SelectComp
                            onChange={(e) => {
                                onProvinceChange(e);
                            }}
                            dictName="province_id"
                            id="key"
                            label="value"
                            mode=""
                        />
                    );
                },
            },
            {
                title: '归属地市',
                dataIndex: 'regionId',
                align: 'center',
                width: 120,
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <SelectComp
                            cityList={cityList}
                            dictName="region_id"
                            id="key"
                            label="value"
                            mode=""
                            addOptions={[{ label: '全省', value: -1 }]}
                        />
                    );
                },
            },
            {
                title: '归属专业',
                dataIndex: 'groupProfessionalLabel',
                align: 'center',
                width: 120,
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '归属专业',
                dataIndex: 'professionType',
                align: 'center',
                width: 120,
                hideInTable: true,
                renderFormItem: () => {
                    return <SelectComp dictName="professional_type" id="key" label="value" mode="multiple" />;
                },
            },
            // {
            //     title: '状态',
            //     dataIndex: 'groupStatus',
            //     align: 'center',
            //     hideInSearch: true,
            //     width: 120,
            // },
            {
                title: '状态',
                dataIndex: 'enableDefine',
                align: 'center',
                hideInSearch: true,
                width: 120,
                valueEnum: {
                    false: { text: '未启用' },
                    true: { text: '已启用' },
                },
            },
            {
                title: '生效状态',
                dataIndex: 'groupStatus',
                align: 'center',
                hideInSearch: true,
                width: 120,
            },
            {
                title: '描述',
                dataIndex: 'description',
                width: 200,
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                width: 130,
                align: 'center',
                hideInSearch: true,
                render: (text) => text || '-',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width: 180,
                align: 'center',
                hideInSearch: true,
                sorter: true,
                render: (text) => text || '-',
            },
            {
                title: '最近修改人',
                dataIndex: 'updateUserName',
                width: 120,
                align: 'center',
                hideInSearch: true,
                render: (text) => text || '-',
            },
            {
                title: '最近修改时间',
                dataIndex: 'modifyTime',
                width: 180,
                align: 'center',
                sorter: true,
                render: (text) => text || '-',
                hideInSearch: true,
            },
            {
                title: '操作',
                valueType: 'option',
                width: 120,
                dataIndex: 'actions',
                align: 'center',
                fixed: 'right',
                render: (text, record) => {
                    return [
                        <Space>
                            <Tooltip title="编辑" key={1}>
                                <AuthButton
                                    onClick={scope?.showEditGroupModal?.bind(scope, 1, record)}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="networkGroup:edit"
                                >
                                    <Icon type="EditOutlined" title="编辑" antdIcon />
                                </AuthButton>
                            </Tooltip>
                            {(JSON.parse(login.userInfo).isAdmin || String(login.userId) === String(record.createUser)) && (
                                <Tooltip title="上传" key={2}>
                                    <AuthButton
                                        onClick={scope?.showUploadModal?.bind(scope, record)}
                                        type="text"
                                        style={{ padding: 0 }}
                                        authKey="networkGroup:upload"
                                    >
                                        <Icon type="UploadOutlined" antdIcon />
                                    </AuthButton>
                                </Tooltip>
                            )}
                            <Tooltip title="导出" key={3}>
                                <Export scope={scope} buttonType="icon" data={record} />
                            </Tooltip>
                            <Tooltip title="删除" key={4}>
                                <Delete scope={scope} data={record} buttonType="icon" type="table" onReloadTable={scope.onReloadTable} />
                            </Tooltip>
                        </Space>,
                    ];
                },
            },
        ],
        conditionColumns: [
            {
                title: '序号',
                dataIndex: 'index',
                width: 80,
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '归属地市',
                dataIndex: 'regionName',
                width: 200,
                hideInSearch: true,
            },
            {
                title: '网元id',
                dataIndex: 'neId',
                width: 200,
                hideInSearch: true,
            },
            {
                title: '网元名称',
                dataIndex: 'neName',
                width: 200,
            },
            {
                title: '网元类型',
                dataIndex: 'neType',
                width: 200,
                hideInSearch: true,
            },
            {
                title: '网元状态',
                dataIndex: 'neStatus',
                width: 200,
                hideInSearch: true,
            },

            {
                title: '所属厂家',
                dataIndex: 'neVendor',
                width: 200,
                hideInSearch: true,
            },
            {
                title: '所属EMS',
                dataIndex: 'neEMS',
                width: 200,
                hideInSearch: true,
            },
            {
                title: '所属机房',
                dataIndex: 'neRoom',
                width: 200,
                hideInSearch: true,
            },
            {
                title: '操作',
                valueType: 'option',
                width: 160,
                dataIndex: 'actions',
                fixed: 'right',
                render: (text, record) => [<Delete key={2} iconMode scope={scope} data={record} />],
            },
        ],
    };
};

export const getGroupConf = (scope, currentgroup, onProvinceChange, initProvince, cityList) => {
    // console.log(state)
    // switch (Number(currentgroup)) {
    //     case 1:
    //         return conf2Necondition(scope);
    //     default:
    //         return false;
    // }
    return conf2Necondition(scope, onProvinceChange, cityList, initProvince);
};
