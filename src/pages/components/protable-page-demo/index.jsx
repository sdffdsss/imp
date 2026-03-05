import React, { PureComponent, createRef } from 'react';
import { withModel } from 'hox';
import { Tooltip, Icon, Button, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import PageContainer from '@Components/page-container';
import AuthButton from '@Components/auth-button';
import useLoginInfoModel from '@Src/hox';
import { getDataSourceApi, deleteItemApi, exportFileApi } from './services/api';
import getColumns from './constants/columns';
import { authKeys } from './constants/auth-keys';
import Modal from './modal';

class Index extends PureComponent {
    tableRef = createRef();
    formRef = createRef();

    actionColumn = {
        title: '操作',
        dataIndex: 'actions',
        search: false,
        align: 'center',
        width: 120,
        fixed: 'right',
        render: (text, row) => [
            <Tooltip title="编辑" key="edit">
                <AuthButton authKey={authKeys.edit} onClick={() => this.itemAction(row, 'edit')} type="text" logFalse>
                    <Icon antdIcon type="EditOutlined" />
                </AuthButton>
            </Tooltip>,
            <Tooltip title="删除" key="delete">
                <AuthButton authKey={authKeys.delete} onClick={() => this.deleteItem(row)} type="text" logFalse>
                    <Icon antdIcon type="DeleteOutlined" />
                </AuthButton>
            </Tooltip>,
            <Tooltip title="查看" key="show">
                <Button onClick={() => this.itemAction(row, 'view')} type="text">
                    <Icon antdIcon type="SearchOutlined" />
                </Button>
            </Tooltip>,
        ],
    };

    constructor(props) {
        super(props);

        const { currentZone } = props.loginInfo;

        this.state = {
            modalProps: {
                visible: false,
                mode: 'new',
                contentProps: {},
            },
            columns: getColumns({
                currentZone,
            }),
        };
    }

    componentDidMount() {}

    requestDataSource = async (params, sort) => {
        const searchFormData = this.formRef.current.getFieldsValue(true); // 防止初次请求获取不到 initialValue 的问题

        const requestParams = {
            ...searchFormData,
            ...params,
        };
        const res = await getDataSourceApi(requestParams);

        if (res.code === 200) {
            return {
                data: res.data || [],
                success: true,
                total: res.total,
            };
        }
        return {
            data: [],
            success: false,
            total: 0,
        };
    };

    itemAction = (item, actionType) => {
        this.setState({
            modalProps: {
                modalMode: actionType,
                visible: true,
                contentProps: {
                    initialValues: item,
                },
            },
        });
    };

    handleExport = () => {
        const formData = this.formRef.current.getFieldsValue(true);
        exportFileApi(formData);
    };

    deleteItem = (row) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认删除?',
            onOk: async () => {
                try {
                    const res = await deleteItemApi(row);
                    if (res.code === 200) {
                        message.success('删除成功');

                        this.tableRef.current?.reload();
                    } else {
                        message.error('删除失败');
                    }
                } catch {
                    message.error('接口错误');
                }
            },
            onCancel() {},
        });
    };

    onOk = () => {
        this.setState((prev) => {
            return {
                ...prev,
                modalProps: {
                    ...prev.modalProps,
                    visible: false,
                },
            };
        });

        this.tableRef.current?.reload();
    };

    onCancel = () => {
        this.setState((prev) => {
            return {
                ...prev,
                modalProps: {
                    ...prev.modalProps,
                    visible: false,
                },
            };
        });
    };

    render() {
        const { modalProps, columns } = this.state;

        return (
            <PageContainer showHeader={false} divider={false}>
                <VirtualTable
                    global={window}
                    toolBarRender={() => [
                        <AuthButton authKey={authKeys.add} onClick={() => this.itemAction(undefined, 'new')} type="primary" logFalse>
                            新建
                        </AuthButton>,
                        <AuthButton
                            icon={<Icon antdIcon type="ExportOutlined" key="Export" />}
                            authKey={authKeys.export}
                            onClick={this.handleExport}
                            logFalse
                        >
                            导出
                        </AuthButton>,
                    ]}
                    actionRef={this.tableRef}
                    columns={columns.concat(this.actionColumn)}
                    request={this.requestDataSource}
                    formRef={this.formRef}
                    scroll={{ x: 'max-content' }}
                />
                <Modal {...modalProps} onOk={this.onOk} onCancel={this.onCancel} />
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (loginInfo) => ({
    loginInfo,
}))(Index);
