import React from 'react';
import { VirtualTable } from 'oss-web-common';
import { DatePicker, Select } from 'antd';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { simulationStatusEnum } from '../common/enums';
import { ruleApi } from '../service/ruleApi';
import moment from 'moment';
import { ActionComp } from '@Components/action-comp';
import { filterApi } from '../service/filterApi';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import AuthButton from '@Src/components/auth-button';
import { Button, Space, Icon, Modal } from 'oss-ui';
import { getUserProvinceId } from '../utils/loginInfo';
import constants from '@Common/constants';

export class Index extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.actionRef = React.createRef();
        this.state = {
            provinces: [],
        };
    }

    get api() {
        return ruleApi;
    }

    get format() {
        return 'YYYY-MM-DD HH:mm';
    }

    get createProvinceId() {
        return getUserProvinceId(this.props.login);
    }

    get userId() {
        return this.props.login.userId;
    }

    get columns() {
        const { provinces } = this.state;
        const { login } = this.props;

        const userInFo = JSON.parse(login.userInfo);
        const userInfo = {
            isAdmin: userInFo.isAdmin,
        };
        return [
            {
                key: 'index',
                dataIndex: 'index',
                title: '序号',
                width: '30px',
                hideInSearch: true,
                render(text, record, index) {
                    return index + 1;
                },
            },
            {
                key: 'ruleName',
                dataIndex: 'ruleName',
                title: '派单规则名称',
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '省份',
                key: 'createProvinceName',
                dataIndex: 'createProvinceName',
                hideInTable: false,
                // hideInSearch: this.createProvinceId?.toString() !== '0',
                renderFormItem: () => <Select optionFilterProp="label" options={provinces} />,
            },
            {
                key: 'startTime',
                dataIndex: 'startTime',
                title: '验证时间',
                hideInSearch: true,
                width: '60px',
                sorter: (a, b) => {
                    const aTime = moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    const bTime = moment(b.startTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    return aTime - bTime;
                },
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                key: 'origin',
                dataIndex: 'origin',
                title: '告警来源',
                width: 60,
                hideInSearch: true,
                render(text) {
                    return text === 1 ? '实时告警' : '历史告警';
                },
            },
            {
                key: 'typeDesc',
                dataIndex: 'typeDesc',
                title: '验证类型',
                width: '40px',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                key: 'alarmStartTime',
                dataIndex: 'alarmStartTime',
                title: '告警开始时间',
                width: '60px',
                hideInSearch: true,
                sorter: (a, b) => {
                    const aTime = moment(a.alarmStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    const bTime = moment(b.alarmStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    return aTime - bTime;
                },
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                key: 'alarmEndTime',
                dataIndex: 'alarmEndTime',
                title: '告警结束时间',
                width: '60px',
                hideInSearch: true,
                sorter: (a, b) => {
                    const aTime = moment(a.alarmStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    const bTime = moment(b.alarmStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    return aTime - bTime;
                },
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                key: 'statusDesc',
                dataIndex: 'statusDesc',
                title: '验证状态',
                width: '40px',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                key: 'status',
                dataIndex: 'status',
                title: '验证状态',
                width: '40px',
                hideInTable: true,
                initialValue: '',
                renderFormItem: () => <Select options={simulationStatusEnum} />,
            },
            {
                key: 'result',
                dataIndex: 'result',
                title: '验证结果',
                hideInSearch: true,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                key: 'creatorName',
                dataIndex: 'creatorName',
                title: '验证人员',
                hideInSearch: true,
                width: 60,
                render(text) {
                    return (
                        <div title={text} className="table-ellipsis">
                            {text}
                        </div>
                    );
                },
            },
            {
                key: 'operation',
                dataIndex: 'operation',
                title: '操作',
                hideInSearch: true,
                width: '100px',
                render: (text, record) => {
                    return (
                        <Space>
                            <ActionComp type="view" onClick={this.goDetail.bind(this, record.recordId)} />
                            {(login?.userId === record?.creator?.toString() || userInfo.isAdmin) && (
                                <ActionComp
                                    addLog
                                    type="delete"
                                    authKey="associationRulesVaUnicom:delete"
                                    onClick={this.deleteHistory.bind(this, record)}
                                />
                            )}
                        </Space>
                    );
                },
            },
            {
                key: 'range',
                dataIndex: 'range',
                title: '验证时间范围',
                hideInTable: true,
                renderFormItem: () => (
                    <DatePicker.RangePicker placeholder={['开始时间', '结束时间']} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                ),
            },
        ];
    }

    componentDidMount() {
        this.getProvinces();
    }

    async getProvinces() {
        let provinces = await filterApi.getProvinces(this.userId, true, true);
        const createProvinceName = getInitialProvince(this.props.login);
        provinces = provinces.filter((item) => item.value === createProvinceName);
        this.formRef.current?.setFieldsValue({ createProvinceName });
        this.setState({ provinces });

        setTimeout(() => {
            this.actionRef.current?.reload();
        }, 500);
    }

    goDetail = (recordId) => {
        this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/simulation-validation-detail/${recordId}`);
    };

    goAdd = () => {
        this.props.history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/simulation-validation-add`,
            state: {
                provinces: this.state.provinces,
            },
        });
    };

    tableRequest = async (params) => {
        const { pageSize, current } = params;
        const values = this.formRef.current.getFieldsValue();
        const { range, createProvinceName, ...rest } = values;
        let startTime = '';
        let endTime = '';
        if (range && Array.isArray(range)) {
            if (range[0]) {
                startTime = range[0].format(this.format) + ':00';
            }

            if (range[1]) {
                endTime = range[1].format(this.format) + ':00';
            }
        }
        const param = {
            pageSize,
            pageNum: current - 1,
            startTime,
            endTime,
            createProvinceId: createProvinceName || this.createProvinceId,
            ...rest,
        };
        const result = await this.api.getValidatorList(param);
        const { total, data } = result;
        return {
            data,
            total,
            success: true,
        };
    };

    deleteHistory = (record, params) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: async (params) => {
                const { recordId, ruleId, simulationId, type } = record;
                await this.api.deleteValidator({ recordId, ruleId, simulationId, type }, params);
                this.setState({ showModal: false });
                this.actionRef.current.reloadAndRest();
            },
            onCancel() {},
        });
    };

    onReset = () => {
        this.formRef.current?.setFieldsValue({ ruleName: '', createProvinceName: getInitialProvince(this.props.login), status: '', range: [] });
        this.actionRef.current?.reload();
    };

    render() {
        return (
            <VirtualTable
                x={100}
                manualRequest
                global={window}
                options={false}
                columns={this.columns}
                formRef={this.formRef}
                actionRef={this.actionRef}
                request={this.tableRequest}
                search={{
                    span: 6,
                    optionRender: (searchConfig, formProps, dom) => {
                        return [
                            ...dom.slice(1),
                            <Button onClick={this.onReset}>重置</Button>,
                            <AuthButton key="go" authKey="sheetRulesVaUnicom:add" onClick={this.goAdd}>
                                新建回归验证
                            </AuthButton>,
                        ];
                    },
                }}
            />
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
