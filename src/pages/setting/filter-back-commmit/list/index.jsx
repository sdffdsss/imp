/* eslint-disable no-param-reassign */
import React from 'react';
import { Button, Icon, ProTable } from 'oss-ui';
import Copy from '../copy';
import Delete from '../delete';
import Export from '../export';
import History from '../history';
import './index.less';
import { _ } from 'oss-web-toolkits';
import constants from '@Src/common/constants';
import { filterColumns, commonRuleColumns, preTreatColumns, anotherFilterCondition } from './columns';
import getData from '@Common/services/dataService';
import produce from 'immer';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        const commonActions = {
            title: '操作',
            valueType: 'option',
            width: 120,
            dataIndex: 'actions',
            fixed: 'right',
            render: (text, record) => [
                <Icon type="EditOutlined" title="编辑" antdIcon onClick={this.editFilterClick.bind(this, record)} />,
                <Copy key={1} moduleId={props.moduleId} iconMode onFresh={props.onFresh} data={record} />,
                <Delete key={2} iconMode onFresh={props.onFresh} data={record} />,
                <Export key={3} iconMode data={record} />,
                <History key={4} iconMode data={record} />,
            ],
        };
        const columns =
            // eslint-disable-next-line no-nested-ternary
            props.moduleId === '1'
                ? [...filterColumns, commonActions]
                : props.moduleId === '7'
                ? [...preTreatColumns, commonActions]
                : [...commonRuleColumns, commonActions];

        this.state = {
            gender: undefined,
            name: '',
            data: [],
            EditingFilterInfo: null,
            showFilters: props.data,
            columns,
            pagination: {
                current: 1,
                pageSize: 20,
                total: 0,
                pageSizeOptions: [20, 50, 100],
            },
            scrollY: window.innerHeight - 360,
        };
    }

    componentDidMount() {
        Promise.all([
            this.getZoneData(),
            this.getProvinceData(),
            this.getNetworkTypeData(),
            this.getOrgSeverityData(),
            this.getDeviceTypeData(),
            this.getDeviceVendorData(),
        ]).then((res) => {
            const districtValueEnum = {};
            const provinceValueEnum = {};
            const networkTypeValueEnum = {};
            const orgSeverityValueEnum = {};
            const deviceTypeValueEnum = {};
            const deviceVendorValueEnum = {};

            if (res[0].data && res[0].data.data && Array.isArray(res[0].data.data)) {
                res[0].data.data.forEach((item) => {
                    if (item.districtId && item.districtName) {
                        districtValueEnum[item.districtId] = { text: item.districtName };
                    }
                });
            }

            if (res[1].data && res[1].data.data && Array.isArray(res[1].data.data)) {
                res[1].data.data.forEach((item) => {
                    provinceValueEnum[item.provinceId] = { text: item.provinceName };
                });
            }

            if (res[2].data && res[2].data.data && Array.isArray(res[2].data.data)) {
                res[2].data.data.forEach((item) => {
                    networkTypeValueEnum[item.id] = { text: item.txt };
                });
            }

            if (res[3].data && res[3].data.data && Array.isArray(res[3].data.data)) {
                res[3].data.data.forEach((item) => {
                    orgSeverityValueEnum[item.id] = { text: item.txt };
                });
            }

            if (res[4].data && res[4].data.data && Array.isArray(res[4].data.data)) {
                res[4].data.data.forEach((item) => {
                    deviceTypeValueEnum[item.id] = { text: item.txt };
                });
            }

            if (res[5].data && res[5].data.data && Array.isArray(res[5].data.data)) {
                res[5].data.data.forEach((item) => {
                    deviceVendorValueEnum[item.id] = { text: item.txt };
                });
            }

            const otherFilterCondition = produce(anotherFilterCondition, (draft) => {
                draft[0].valueEnum = districtValueEnum;
                draft[1].valueEnum = provinceValueEnum;
                draft[2].valueEnum = networkTypeValueEnum;
                draft[3].valueEnum = orgSeverityValueEnum;
                draft[4].valueEnum = deviceTypeValueEnum;
                draft[5].valueEnum = deviceVendorValueEnum;
            });

            this.setState({
                columns: [...this.state.columns, ...otherFilterCondition],
            });
        });
    }

    // 查找大区字段可选值
    getZoneData = () => {
        return getData('SelectDistrictId', { showSuccessMessage: false, showErrorMessage: false }, {}, -1, {});
    };

    // 查找省份字段可选值
    getProvinceData = () => {
        return getData('SelectProvinceId', { showSuccessMessage: false, showErrorMessage: false }, {}, -1, {});
    };

    // 查找一级专业字段可选值
    getNetworkTypeData = () => {
        return getData('SelectNetworkTypeTop', { showSuccessMessage: false, showErrorMessage: false }, {}, -1, {});
    };

    // 查找网元告警级别字段可选值
    getOrgSeverityData = () => {
        return getData('SelectOrgSeverity', { showSuccessMessage: false, showErrorMessage: false }, {}, -1, {});
    };

    // 查找设备类型字段可选值
    getDeviceTypeData = () => {
        return getData('SelectEqpObjectClass', { showSuccessMessage: false, showErrorMessage: false }, {}, -1, {});
    };

    // 查找设备厂家字段可选值
    getDeviceVendorData = () => {
        return getData('SelectTiaAlarmDict', { showSuccessMessage: false, showErrorMessage: false }, {}, -1, {});
    };

    // 新建/编辑跳转
    editFilterClick = (record) => {
        this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/edit/${this.props.moduleId}/${record.id}`);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                showFilters: this.props.data,
                pagination: {
                    current: 1,
                    pageSize: 20,
                    pageSizeOptions: [20, 50, 100],
                    total: this.props.data.length,
                },
            });
        }
    }

    onSubmit = (searchCondition) => {
        const searchConditionCopy = {};
        console.log(searchConditionCopy);

        _.each(searchCondition, (value, key) => {
            if (value) {
                searchConditionCopy[key] = searchCondition[key];
            }
        });
        console.log(searchConditionCopy);

        if (_.has(searchConditionCopy, 'id')) {
            searchConditionCopy.FILTER_ID = searchConditionCopy.id;
            delete searchConditionCopy.id;
        }

        if (_.has(searchConditionCopy, 'name')) {
            searchConditionCopy.FILTER_NAME = searchConditionCopy.name;
            delete searchConditionCopy.name;
        }

        if (_.has(searchConditionCopy, 'isValid')) {
            // eslint-disable-next-line no-nested-ternary
            searchConditionCopy.IS_VALID = searchConditionCopy.isValid === 'true' ? '1' : searchConditionCopy.isValid === 'false' ? '0' : '-1';
            delete searchConditionCopy.isValid;
        }
        console.log(searchConditionCopy);
        this.props.onFresh(searchConditionCopy);
    };

    onSearchCollapse = (collapsed) => {
        this.setState({
            scrollY: collapsed ? window.innerHeight - 360 : window.innerHeight - 420,
        });
    };

    onTableChange = (pagination) => {
        this.setState({ pagination });
    };

    render() {
        const { columns, showFilters, scrollY, pagination } = this.state;
        const { onModeChange, moduleId } = this.props;

        const xWidth = columns.reduce((total, item) => {
            return total + item.width;
        }, 0);
        return (
            <div className="list-mode-wrapper oss-imp-alarm-protable-search">
                <ProTable
                    dataSource={showFilters}
                    columns={columns}
                    rowKey="id"
                    size="small"
                    pagination={pagination}
                    onSubmit={this.onSubmit}
                    scroll={{ x: xWidth, y: scrollY }}
                    dateFormatter="string"
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    form={{
                        textAlign: 'right',
                        labelCol: { span: 6 },
                    }}
                    onChange={this.onTableChange}
                    search={{
                        onCollapse: this.onSearchCollapse,
                        span: 6,
                    }}
                    bordered
                    options={{ reload: true, setting: true, fullScreen: false }}
                    toolBarRender={() => [
                        <Button
                            key="1"
                            onClick={() => this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/edit/${moduleId}/new`)}
                        >
                            <Icon antdIcon type="PlusOutlined" />
                            新建
                        </Button>,
                        <Button key="2" onClick={onModeChange}>
                            <Icon antdIcon type="ApartmentOutlined" />
                            树型
                        </Button>,
                    ]}
                />
            </div>
        );
    }
}
