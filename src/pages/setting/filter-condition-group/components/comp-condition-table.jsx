import React from 'react';
import { Button, ProTable } from 'oss-ui';
// import { VirtualTable } from 'oss-web-common';
import ConditionselectComp from '../edit/negroup/neSelect';
import UploadComp from '../upload';

const dataSource = [{ regionName: '广东', neId: 123, neName: '网元名称', neType: '网元类型', neStatus: '网元状态', neVendor: '厂家', neEMS: 'EMS' }];

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dataSource,
            selectedRowKeys: [],
            modalVisible: false,
            uploadModalVisible: false
            // 当前选中的节点
        };
    }
    /**
     * 复选框change
     */
    onSelectChange = (selectedRowKeys) => {
        // let selectedRowKeys = [];
        // selectedRowKeys = rows.map((row) => {
        //     return row.windowId;
        // });
        this.setState({
            selectedRowKeys
        });
    };

    /**
     * @description: 删除网元信息组
     * @param {*}
     * @return {*}
     */
    delNeHandler = () => {
        const { selectedRowKeys } = this.state;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.props.onDeleteNe && this.props.onDeleteNe(selectedRowKeys);
    };

    // process(arr) {
    //     // 缓存用于记录
    //     const cache = [];
    //     for (const t of Object.keys(arr)) {
    //         // 检查缓存中是否已经存在
    //         if (cache.find((c) => c.fieldName === t.fieldName)) {
    //             // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
    //             cache.push(t);
    //         }
    //         // 不存在就说明以前没遇到过，把它记录下来
    //         else {
    //             continue;
    //         }
    //     }

    //     // 记录结果就是过滤后的结果
    //     return cache;
    // }

    /**
     * 复选框selected
     */
    // onSelect = (record, selected, selectedRows) => {
    //     this.setState({
    //         rowData: selectedRows,
    //     });
    // };

    // onSelectAll = (id, rows, changeRows) => {
    //     let selectedRowKeys = [];
    //     selectedRowKeys = rows.map((row) => {
    //         return row.windowId;
    //     });

    //     this.setState({
    //         selectedRowKeys: selectedRowKeys,
    //     });
    // };

    /** *
     *打开编辑界面
     */
    showModal = (key) => {
        this.setState({
            modalVisible: true,
            editStatus: key
        });
    };
    /**
     * @description: 关闭编辑界面弹窗
     * @param {*}
     * @return {*}
     */
    closeModal = () => {
        this.setState({
            modalVisible: false
        });
    };

    /**
     * @description: 打开上传文件弹窗
     * @param {*}
     * @return {*}
     */
    showUploadModal = () => {
        this.setState({
            uploadModalVisible: true
        });
    };

    /**
     * @description: 关闭上传文件弹窗
     * @param {*}
     * @return {*}
     */

    onCloseUploadModel = () => {
        this.setState({
            uploadModalVisible: false
        });
    };
    render() {
        const { selectedRowKeys, modalVisible, uploadModalVisible } = this.state;
        const { editState, compCode, columns, headerTitle } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
            // onSelect: this.onSelect,
            // onSelectAll: this.onSelectAll,
        };

        const scrollY = window.innerHeight - 266;
        return (
            <>
                <ProTable
                    headerTitle={headerTitle}
                    rowSelection={rowSelection}
                    ref={this.props.tableRef}
                    tableAlertRender={false}
                    tableAlertOptionRender={false}
                    request={(params, sorter, filter) => {
                        // 表单搜索项会从 params 传入，传递给后端接口。
                        console.log(params, sorter, filter);
                        return Promise.resolve({
                            data: dataSource,
                            success: true
                        });
                    }}
                    columns={columns}
                    borderd="true"
                    global={window}
                    options={false}
                    search={false}
                    scroll={{ y: scrollY }}
                    toolbar={{
                        search: {
                            onSearch: () => {
                                // alert(value);
                            }
                        },
                        actions: [
                            <Button key="select" type="primary" onClick={this.showModal.bind(this, 0)}>
                                添加
                            </Button>,
                            <Button key="select" type="primary" onClick={this.showUploadModal}>
                                导入
                            </Button>,
                            <Button key="delete" type="primary" onClick={this.delNeHandler}>
                                删除
                            </Button>,
                            <Button key="clear" type="primary">
                                清除
                            </Button>
                        ]
                    }}
                />
                <ConditionselectComp
                    compCode={compCode}
                    editStatus={editState ? 1 : 0}
                    visible={modalVisible}
                    closeModal={this.closeModal}
                ></ConditionselectComp>
                <UploadComp visible={uploadModalVisible} onCloseModal={this.onCloseUploadModel} />
            </>
        );
    }
}
