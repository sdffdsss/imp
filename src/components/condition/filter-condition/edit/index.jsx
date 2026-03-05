/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { Modal, Table, ProTable, Form, Input, Button, Space, Typography, message, Icon } from 'oss-ui';
import { getShowColumnsByType, getSearchColumnsByType } from './columns';
import produce from 'immer';
import { getAlarmTitleList, dictEntry } from './api';
import { _ } from 'oss-web-toolkits';
import UploadComp from './upload';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showColumns: [],
            showDataSoruce: [],
            searchModalVisible: false,
            searchColums: [],
            manualModalVisible: false,
            showListKeys: [],
            showListRows: [],
            searchListKeys: [],
            searchListRows: [],
            filterData: [],
            uploadModalVisible: false,
            fieldType: ''
        };
        this.fieldNameTypeEnum = {
            title_text: '告警标题',
            standard_alarm_id: '网管告警Id',
            standard_alarm_name: '告警标准名'
        };
        this.tableRef = React.createRef();
        this.formRef = React.createRef();
        this.manualFormRef = React.createRef();
    }

    componentDidMount() {
        const { data } = this.props;
        const dataSource =
            data.value.map((item) => {
                return {
                    name: item
                };
            }) || [];
        this.setState({
            showColumns: getShowColumnsByType(data.fieldName),
            showDataSoruce: dataSource,
            filterData: dataSource,
            fieldType: data.fieldName
        });
    }

    /**
     * @description: 筛选
     * @param {*}
     * @return {*}
     */

    onSearch = () => {
        const { showDataSoruce } = this.state;
        const inputValue = this.formRef.current.getFieldValue('fieldName');
        let handleData = [];
        if (inputValue) {
            handleData = showDataSoruce.filter((item) => item.name.includes(inputValue));
        } else {
            handleData = showDataSoruce;
        }
        this.setState({
            filterData: handleData
        });
    };

    /**
     * @description: 监听选择
     * @param {*}
     * @return {*}
     */

    onShowListSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            showListKeys: selectedRowKeys,
            showListRows: selectedRows
        });
    };

    /**
     * @description: 获取查询列表
     * @param {*}
     * @return {*}
     */

    getSearchList = async (params) => {
        const { fieldType } = this.state;
        const { login } = this.props;
        try {
            const data = {
                current: params.current,
                pageSize: params.pageSize,
                title: params.title,
                vendorName: params?.vendorName?.label || ''
            };
            let res = {};
            if (fieldType === 'title_text') {
                res = await getAlarmTitleList(data);
            } else {
                const para = {
                    current: params.current,
                    pageSize: params.pageSize,
                    value: params.value,
                    dictName: fieldType,
                    creator: login.userId
                };
                res = await dictEntry(para);
            }
            if (res && Array.isArray(res.data)) {
                return {
                    data: res.data || [],
                    success: true,
                    total: res.total
                };
            }
        } catch (e) {}
    };

    /**
     * @description: 打开选择弹窗
     * @param {*}
     * @return {*}
     */

    showSearchModal = () => {
        const { fieldType } = this.state;
        this.setState(
            {
                searchModalVisible: true,
                searchColums: getSearchColumnsByType(fieldType)
            },
            () => {
                this?.tableRef?.current?.reload();
            }
        );
    };

    /**
     * @description: 选择框checkbox change
     * @param {*}
     * @return {*}
     */

    onSearchListChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            searchListKeys: selectedRowKeys,
            searchListRows: selectedRows
        });
    };

    /**
     * @description: 保存选择信息
     * @param {*}
     * @return {*}
     */

    onSaveSelected = () => {
        const { searchListRows, showDataSoruce, fieldType } = this.state;
        const nextData = produce(showDataSoruce, (draft) => {
            searchListRows.forEach((item) => {
                if (fieldType === 'title_text') {
                    if (!_.find(draft, { name: item.title })) {
                        draft.push({ name: item.title });
                    }
                } else if (!_.find(draft, { name: item.value })) {
                    draft.push({ name: item.value });
                }
            });
        });
        this.setState(
            {
                showDataSoruce: nextData,
                searchModalVisible: false,
                filterData: nextData
            },
            () => {
                this.formRef.current.resetFields();
            }
        );
    };

    /**
     * @description: 关闭选择弹窗
     * @param {*}
     * @return {*}
     */

    onCloseSearch = () => {
        this.setState({
            searchModalVisible: false
        });
    };

    /**
     * @description: 打开手工录入弹窗
     * @param {*}
     * @return {*}
     */

    openManualModal = () => {
        this.setState({
            manualModalVisible: true
        });
    };

    /**
     * @description: 保存手动录入数据
     * @param {*}
     * @return {*}
     */
    onSaveManualInfo = () => {
        const { showDataSoruce } = this.state;
        const inputValues = this.manualFormRef.current.getFieldValue('value');
        const reg = /,|，/;
        const infoList = inputValues.split(reg);
        let flag = true;
        const nextData = produce(showDataSoruce, (draft) => {
            infoList.forEach((item) => {
                if (item.length >= 1000) {
                    flag = false;
                }
                if (item && !_.find(draft, { name: item })) {
                    draft.push({ name: item });
                }
            });
        });
        if (!flag) {
            message.error('手工录入数据单条不得超过1000字');
            return;
        }
        this.setState(
            {
                showDataSoruce: nextData,
                filterData: nextData,
                manualModalVisible: false
            },
            () => {
                this.formRef.current.resetFields();
            }
        );
    };

    /**
     * @description: 关闭手工录入弹窗
     * @param {*}
     * @return {*}
     */

    onCloseManualModal = () => {
        this.setState({
            manualModalVisible: false
        });
    };

    /**
     * @description: 删除展示列表数据
     * @param {*}
     * @return {*}
     */

    deleteShowData = () => {
        const { showListKeys, showDataSoruce } = this.state;
        if (Array.isArray(showListKeys) && showListKeys.length === 0) {
            message.error('请选择要删除的选项');
            return;
        }
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '是否确认删除？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                const nextData = produce(showDataSoruce, (draft) => {
                    showListKeys.forEach((item) => {
                        if (_.find(draft, { name: item })) {
                            _.pull(draft, _.find(draft, { name: item }));
                        }
                    });
                });
                this.setState(
                    {
                        showDataSoruce: nextData
                    },
                    () => {
                        this.onSearch();
                    }
                );
            },
            onCancel() {}
        });
    };

    /**
     * @description: 保存信息
     * @param {*}
     * @return {*}
     */

    onSaveInfo = () => {
        const { showDataSoruce } = this.state;
        const value = showDataSoruce.map((item) => {
            return item.name;
        });
        this.onCloseShowModal();
        this.props.onChange && this.props.onChange(value);
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */

    onCloseShowModal = () => {
        this.props.onEditModalClose && this.props.onEditModalClose();
    };

    /**
     * @description: 打开上传弹窗
     * @param {*}
     * @return {*}
     */

    openUploadModal = () => {
        this.setState({
            uploadModalVisible: true
        });
    };

    /**
     * @description: 关闭上传弹窗
     * @param {*}
     * @return {*}
     */
    closeUploadModal = () => {
        this.setState({
            uploadModalVisible: false
        });
    };

    /**
     * @description: 保存上传信息
     * @param {*}
     * @return {*}
     */

    onUploadInfoSave = (infoList) => {
        const { showDataSoruce } = this.state;
        const nextData = produce(showDataSoruce, (draft) => {
            infoList.forEach((item) => {
                if (item && !_.find(draft, { name: item })) {
                    draft.push({ name: item });
                }
            });
        });
        this.setState(
            {
                showDataSoruce: nextData,
                filterData: nextData,
                uploadModalVisible: false
            },
            () => {
                this.formRef.current.resetFields();
            }
        );
    };

    render() {
        const {
            searchModalVisible,
            showColumns,
            searchColums,
            filterData,
            manualModalVisible,
            showListKeys,
            searchListKeys,
            uploadModalVisible,
            fieldType,
            showDataSoruce
        } = this.state;
        return (
            <>
                <Modal
                    visible={true}
                    title="编辑"
                    onOk={this.onSaveInfo}
                    onCancel={this.onCloseShowModal}
                    width={800}
                    style={{
                        position: 'relative'
                    }}
                >
                    <Form
                        layout="inline"
                        ref={this.formRef}
                        style={{
                            height: '30px'
                        }}
                    >
                        {Array.isArray(showDataSoruce) && showDataSoruce.length > 0 && (
                            <>
                                <Form.Item label={this.fieldNameTypeEnum[fieldType]} name="fieldName">
                                    <Input placeholder="请输入" />
                                </Form.Item>
                                <Form.Item>
                                    <Space>
                                        <Button type="primary" onClick={this.onSearch}>
                                            查询
                                        </Button>
                                        <Button type="primary" onClick={this.deleteShowData}>
                                            删除
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        )}
                        <Form.Item
                            style={{
                                position: 'absolute',
                                right: '20px'
                            }}
                        >
                            <Space>
                                <Button type="primary" onClick={this.showSearchModal}>
                                    选择
                                </Button>
                                <Button type="primary" onClick={this.openManualModal}>
                                    手工录入
                                </Button>
                                <Button type="primary" onClick={this.openUploadModal}>
                                    导入
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                    <Table
                        style={{
                            marginTop: '4px'
                        }}
                        columns={showColumns}
                        dataSource={filterData}
                        size="small"
                        rowKey="name"
                        rowSelection={{
                            onChange: this.onShowListSelectChange,
                            type: 'checkbox',
                            selectedRowKeys: showListKeys
                        }}
                        scroll={{ y: '350px' }}
                        pagination={false}
                    />
                </Modal>
                <Modal title="选择" visible={searchModalVisible} onOk={this.onSaveSelected} onCancel={this.onCloseSearch} width={900} destroyOnClose>
                    <ProTable
                        columns={searchColums}
                        request={this.getSearchList}
                        size="small"
                        rowKey={fieldType === 'title_text' ? 'titleId' : 'value'}
                        actionRef={this.tableRef}
                        scroll={{ y: '350px' }}
                        tableAlertRender={false}
                        options={false}
                        rowSelection={{
                            type: 'checkbox',
                            rowSelection: searchListKeys,
                            onChange: this.onSearchListChange
                        }}
                    />
                </Modal>
                <Modal
                    title="手工录入"
                    visible={manualModalVisible}
                    onOk={this.onSaveManualInfo}
                    onCancel={this.onCloseManualModal}
                    width={900}
                    destroyOnClose
                >
                    <Typography.Text type="danger">输入字符串用逗号隔开。</Typography.Text>
                    <Form ref={this.manualFormRef}>
                        <Form.Item name="value">
                            <Input.TextArea
                                style={{
                                    height: '400px'
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                {uploadModalVisible && (
                    <UploadComp onCloseModal={this.closeUploadModal} fieldType={fieldType} onUploadInfoSave={this.onUploadInfoSave} />
                )}
            </>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login
}))(Index);
