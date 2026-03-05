import React from 'react';
import { Modal } from 'oss-ui';
import { _ } from 'oss-web-toolkits';

import SearchProtable from '../../../alarm-query/alarm-query-protable/index';
import DataSourceAdapter from './common/adaper/adapter_dataSource';

export default class DrawerMenu extends React.PureComponent {
    constructor(prop) {
        super(prop);
        this.dataSourceAdapter = new DataSourceAdapter();
        this.state = {
            loading: false,
            dataSource: [],
            // columns: [{ dataIndex: 'user', title: '' }],
            key: '',
            pagination: { pageSize: this.dataSourceAdapter.pageConfig.pageSize },
            scroll: { y: '321px' }
        };
    }
    componentDidMount() {}

    componentDidUpdate() {
        const { detailModalKey, modalRecord, detaildbName, detailSql, detailCountSql, DetailColumns, DetailWhereCondition } = this.props;
        let { key, loading } = this.state;
        const { dataSourceAdapter } = this;
        if (detailModalKey !== key) {
            key = detailModalKey;
            const columns = [];
            let scrollX = 0;
            for (const column of DetailColumns) {
                const { FieldName, DisplayName, Width } = column;
                scrollX += Width;
                columns.push({ hideInSearch: true, key: FieldName, dataIndex: FieldName, title: DisplayName, width: Width });
            }
            // const columns = DetailColumns.map((column) => {
            //     const { FieldName, DisplayName, Width } = column;
            //     return { hideInSearch: true, dataIndex: FieldName, title: DisplayName };
            // });
            if (loading) {
                return;
            }
            loading = true;
            dataSourceAdapter.queryDataSource(modalRecord, DetailWhereCondition, detaildbName, detailSql, detailCountSql).then((data) => {
                if (data !== 'Error') {
                    // this.setState({});
                    const total = dataSourceAdapter.pageConfig.totalCount;
                    this.setState({
                        dataSource: data,
                        pagination: { ...this.state.pagination, total },
                        loading: false
                    });
                }
            });
            this.setState({ loading, columns, key, scroll: { ...this.state.scroll, x: scrollX } });
            setTimeout(() => {
                this.setState({ loading: false });
            }, 3000);
        }
    }
    onChange = (key, { current, pageSize }) => {
        const { dataSourceAdapter } = this;
        const { detailSql: sqlId, detaildbName: dbName } = this.props;
        try {
            dataSourceAdapter.queryDataSourceByPage({ dbName, sqlId, pageSize, current }).then((records) => {
                const _dataSource = records?.data?.data ?? [];
                const dataSource = _dataSource.map((dataItem) => {
                    const convert = {};
                    for (const iterator in dataItem) {
                        // 驼峰转下划线 （数字认为是驼峰）
                        convert[_.snakeCase(iterator)] = dataItem[iterator];
                    }
                    return convert;
                });
                this.setState({
                    dataSource,
                    pagination: {
                        ...this.state.pagination,
                        current,
                        pageSize
                    }
                });
            });
        } catch (error) {
            console.error(error);
        }
    };
    render() {
        const { title, visible, onOk, onCancel, width } = this.props;
        const { loading, dataSource, columns, key, pagination, scroll } = this.state;
        const { onChange } = this;
        return (
            <Modal
                title={title}
                width={width}
                visible={visible}
                onOk={onOk}
                maskClosable={false}
                bodyStyle={{ height: '440px', padding: '24px 14px' }}
                onCancel={onCancel}
                footer={null}
                // footer={
                //     <CustomModalFooter
                //         render={() => {
                //             return (
                //                 <Button key="back" onClick={onCancel}>
                //                     确定
                //                 </Button>
                //             );
                //         }}
                //     />
                // }
            >
                <SearchProtable
                    type="alarm-report"
                    key={key}
                    search={false}
                    toolBarRender={false}
                    // showSearchPanel={false}
                    options={{ reload: false, fullScreen: false }}
                    loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={pagination}
                    onChange={onChange}
                    scroll={scroll}
                ></SearchProtable>
            </Modal>
        );
    }
}
