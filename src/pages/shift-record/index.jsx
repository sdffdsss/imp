import React from 'react';
import { Button, Input, Modal, Icon } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import DateRangeTime from '@Components/date-range-time';
import { queryChangeShiftLog } from './api';
import request from '@Common/api';
import { useEnvironmentModel } from '@Src/hox';
import { createFileFlow } from '@Common/utils/download';
import constants from '@Common/constants';

class ShiftRecord extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    actionRef = React.createRef();
    formRef = React.createRef();

    get columns() {
        return [
            {
                title: '日期',
                key: 'dateTime',
                dataIndex: 'dateTime',
                ellipsis: true,
                hideInTable: true,
                initialValue: [moment().startOf('month'), moment()],
                renderFormItem: (item, { fieldProps }, form) => {
                    return (
                        <DateRangeTime
                            {...fieldProps}
                            form={form}
                            format="YYYY-MM-DD"
                            placeholder={['开始日期', '结束日期']}
                            showTime={false}
                            allowClear={false}
                        />
                    );
                },
            },
            {
                title: '关键字',
                key: 'searchValue',
                dataIndex: 'searchValue',
                ellipsis: true,
                hideInTable: true,
                renderFormItem: () => {
                    return <Input placeholder="请输入换班信息/被换班信息/操作人" />;
                },
            },
            {
                title: '换班信息',
                dataIndex: 'changeUsers',
                key: 'changeUsers',
                hideInSearch: true,
                ellipsis: true,
                align: 'center',
            },
            {
                title: '换班日期',
                dataIndex: 'changeDateTime',
                key: 'changeDateTime',
                hideInSearch: true,
                ellipsis: true,
                align: 'center',
            },
            {
                title: '被换班信息',
                dataIndex: 'beChangedUsers',
                key: 'beChangedUsers',
                hideInSearch: true,
                ellipsis: true,
                align: 'center',
            },
            {
                title: '被换班日期',
                dataIndex: 'beChangedDateTime',
                key: 'beChangedDateTime',
                hideInSearch: true,
                ellipsis: true,
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'operateUser',
                key: 'operateUser',
                hideInSearch: true,
                ellipsis: true,
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'insertDbTime',
                key: 'insertDbTime',
                hideInSearch: true,
                ellipsis: true,
                align: 'center',
            },
        ];
    }

    componentDidMount() {}

    /**
     * @description: 获取列表数据
     * @param params
     * @return n*o
     */

    getTableData = async (params) => {
        const formValues = this.formRef.current.getFieldsValue();
        const { searchValue, dateTime } = formValues;
        const { pageSize, current } = params;
        const { login } = this.props;
        const { userId } = login;
        const data = {
            canaryRelationName: searchValue,
            pageSizeNew: pageSize,
            pageNumNew: current,
            beginDate: moment(dateTime[0]).format('YYYY-MM-DD'),
            endDate: moment(dateTime[1]).format('YYYY-MM-DD'),
            keyValue: searchValue ? searchValue : '',
            operator: userId,
            provinceId: this.props.location?.state?.provinceId,
        };
        try {
            const result = await queryChangeShiftLog(data);
            return {
                success: true,
                total: result?.total || 0,
                data: result.rows || [],
            };
        } catch (e) {
            return {
                success: true,
                total: 0,
                data: [],
            };
        }
    };

    exportTable = () => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '是否导出换班记录？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const formValues = this.formRef.current.getFieldsValue();
                const { searchValue, dateTime } = formValues;
                const { login } = this.props;
                const { userId } = login;
                const data = {
                    canaryRelationName: searchValue,
                    beginDate: moment(dateTime[0]).format('YYYY-MM-DD'),
                    endDate: moment(dateTime[1]).format('YYYY-MM-DD'),
                    keyValue: searchValue ? searchValue : '',
                    operator: userId,
                    provinceId: this.props.location?.state?.provinceId,
                };
                request('schedule/exportChangeShiftLog', {
                    type: 'POST',
                    baseUrlType: 'groupUrl',
                    showSuccessMessage: false,
                    defaultErrorMessage: false,
                    data,
                }).then((res) => {
                    console.log(useEnvironmentModel.data.environment.groupUrl.direct + res.fileurl);
                    // window.open(useEnvironmentModel.data.environment.groupUrl.direct + res.fileurl);
                    createFileFlow(res.fileurl, useEnvironmentModel.data.environment.groupUrl.direct + res.fileurl);
                });
            },
        });
    };

    returnTable = () => {
        this.props.history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/management-home-page/core/group-manage`,
        });
    };

    render() {
        const {} = this.state;
        return (
            <div style={{ height: '100%' }}>
                <VirtualTable
                    x={100}
                    global={window}
                    columns={this.columns}
                    actionRef={this.actionRef}
                    formRef={this.formRef}
                    request={this.getTableData}
                    rowKey="canaryId"
                    bordered
                    dateFormatter="string"
                    search={{
                        span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 4, xxl: 6 },
                        optionRender: (searchConfig, formProps, dom) => [
                            ...dom.slice(1, 2),
                            <Button key="export" onClick={this.exportTable}>
                                导出
                            </Button>,
                            <Button key="return" onClick={this.returnTable}>
                                返回
                            </Button>,
                        ],
                    }}
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    options={false}
                />
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ShiftRecord);
