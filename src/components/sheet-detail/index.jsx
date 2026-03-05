import React from 'react';
import request from '@Common/api';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { Table, Form } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
class Index extends React.PureComponent {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            columnsAlarm: [],
            rowKeys: [0],
            curSelAlarm: {},
            checkItems: [],
            searchItems: [],
            dataSource: [],
            dataSourceAlarm: [],
            loading: false,
            scrollY: window.innerHeight - 300,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            sheet_no: '', // 右键放置工单值
        };
    }

    componentDidMount() {
        this.setColumns();
        this.initAlarmDate();
    }
    initAlarmDate = () => {
        const { record } = this.props;
        console.log(record);
        const data = {
            fp0: record[0]?.fp0?.value,
            fp1: record[0]?.fp1?.value,
            fp2: record[0]?.fp2?.value,
            fp3: record[0]?.fp3?.value,
            provinceId: record[0]?.province_id?.value,
            forwardTime: record[0]?.event_time?.value,
        };
        // const data = { fp0: '1732170262', fp1: '3525404146', fp2: '980262989', fp3: '1446841676', provinceId: '-662225376' };

        this.getAlarmDetail(data);
    };
    getAlarmDetail = (data) => {
        request('work/sheet/v1/getSheetDetailByView', {
            type: 'post',
            baseUrlType: 'failureSheetUrl',
            data,
            showSuccessMessage: false,
            showErrorMessage: false,
        })
            .then((res) => {
                if (res) {
                    this.setState({
                        dataSource: res.data.map((item, index) => {
                            return { ...item, id: index };
                        }),
                    });
                    this.props.menuComponentFormRef.current?.setFieldsValue({
                        data: { ...res.data[0], loginId: this.props.login.loginId },
                    });
                }
                return [];
            })
            .catch(() => {
                return [];
            });
    };
    setColumns = () => {
        const columns = [
            {
                title: '工单类型',
                dataIndex: 'sheetType',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
                width: 100,
            },
            {
                title: '工单编号',
                dataIndex: 'sheetNo',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
                width: 230,
            },
            {
                title: '工单标题',
                dataIndex: 'sheetTitle',
                ellipsis: true,
                width: 80,
                hideInSearch: true,
                align: 'center',
            },
        ];

        this.setState({
            columns,
        });
    };
    onSelectedRowKeys = (rowKeys) => {
        this.setState({ rowKeys });
    };

    render() {
        const { columns, dataSource, loading, rowKeys } = this.state;
        const xWidth = columns.reduce((total, item) => {
            return total + item.width;
        }, 0);
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(selectedRows);
                // const data = dataSource.find((item) => item.sheet_no === selectedRowKeys[0]) || {};
                // console.log(data);
                this.props.menuComponentFormRef.current?.setFieldsValue({
                    data: { ...selectedRows[0], loginId: this.props.login.loginId },
                });
                // this.props?.addDispatchChange && this.props?.addDispatchChange(data);
                this.onSelectedRowKeys(selectedRowKeys);
            },
            selectedRowKeys: rowKeys,
        };
        console.log(rowKeys);
        return (
            <div className="sheet-detail-page">
                <Form ref={this.props.menuComponentFormRef}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={dataSource}
                        onReset={false}
                        scroll={{ x: xWidth }}
                        pagination={false}
                        loading={loading}
                        bordered
                        dateFormatter="string"
                        options={false}
                        rowClassName={(_, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        rowSelection={{
                            type: 'radio',
                            ...rowSelection,
                        }}
                        tableAlertRender={false}
                        renderEmpty={<div>没有满足条件的数据</div>}
                    />
                </Form>
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
