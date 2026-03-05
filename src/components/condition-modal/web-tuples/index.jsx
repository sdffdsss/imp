import React, { PureComponent, Fragment } from 'react';
import { Input, Icon, Row, Col, Checkbox, Select } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { getGroupDictDataByType, getRequestSessionId, getGroupsData } from './api';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import { _ } from 'oss-web-toolkits';
import { getInitialProvince } from './tools';

const { Option } = Select;
//行数据汇总
let rowSummary = [];
class WebTuples extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            selectedRowKeys: [],
            rowDatas: null,
            netTypeList: [], // 网元组下来数据
            netTypeVal: '', // 网元组选择值
            groupName: '', // 查询组名称
            columns: [
                {
                    title: '组名称',
                    align: 'center',
                    dataIndex: 'groupName',
                },
                {
                    title: '组类型',
                    align: 'center',
                    dataIndex: 'groupTypeName',
                },
            ],
            dataSource: [],
        };
    }

    componentDidMount() {
        rowSummary = [];
        this.getNetTypeList();
    }

    getNetTypeList = async () => {
        const data = {
            applicationType: 'group_network_type',
            sessionId: getRequestSessionId('getGroupDictDataByType'),
        };
        let { netTypeVal } = this.state;
        const { rightValues, currentSelectedCondition } = this.props;
        const res = await getGroupDictDataByType(data);
        if (res && res.data && Array.isArray(res.data)) {
            const handleArr = res.data.map((item, index) => {
                if (index === 0) {
                    netTypeVal = item.dictValue;
                }
                return {
                    value: item.dictValue,
                    label: item.dictNameCn,
                };
            });
            this.setState(
                {
                    netTypeList: handleArr,
                    netTypeVal,
                },
                () => {
                    this.getGroupsData();
                    const valueList = [];
                    rightValues.forEach((item) => {
                        if (item.fieldName === currentSelectedCondition.fieldName) {
                            item.valueList.forEach((items) => {
                                valueList.push(Number(items.key));
                                rowSummary.push({ groupId: Number(items.key), groupName: items.value });
                            });
                        }
                    });
                    this.setState({
                        selectedRowKeys: valueList,
                    });
                },
            );
        }
    };

    /**
     * 复选框change
     */
    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];
        selectedRowKeys = rows.map((row) => {
            return row.groupId;
        });
        this.setState({
            selectedRowKeys,
        });
    };

    /**
     * 复选框selected
     */
    onSelect = (record, selected, selectedRows) => {
        let a = [];
        if (selected) {
            rowSummary.push(_.last(selectedRows));
        } else {
            _.remove(rowSummary, (o) => o.groupId === record.groupId);
        }
        let selectedRowKeys = [];
        selectedRowKeys = rowSummary.map((row) => {
            return row.groupId;
        });
        this.setState(
            {
                rowDatas: rowSummary,
                selectedRowKeys,
            },
            () => {
                this.netTypeListDataChange();
            },
        );
    };

    onSelectAll = (selected, rows) => {
        const { dataSource } = this.state;
        if (selected) {
            rowSummary = _.uniq(
                _.concat(
                    rowSummary,
                    _.filter(rows, (item) => item),
                ),
            );
        } else {
            _.remove(rowSummary, (o) => _.find(dataSource, { groupId: o.groupId }));
        }
        let selectedRowKeys = [];
        selectedRowKeys = rowSummary.map((row) => {
            return row.groupId;
        });
        this.setState(
            {
                rowDatas: rowSummary,
                selectedRowKeys,
            },
            () => {
                this.netTypeListDataChange();
            },
        );
    };

    /**
     * 多选更改调用父级事件
     */
    netTypeListDataChange = () => {
        const { rowDatas } = this.state;
        const { onConditionDataChange, rightValues, currentSelectedCondition } = this.props;
        const rowDatasObj = rowDatas.map((item) => {
            if (item) {
                return {
                    key: item.groupId,
                    value: item.groupName,
                };
            }
        });
        const nextRightValues = rightValues.map((item) => {
            return {
                ...item,
                valueList: item.fieldName === currentSelectedCondition.fieldName ? rowDatasObj : item.valueList,
            };
        });
        onConditionDataChange(nextRightValues);
    };

    /**
     * 王元组下拉选择事件
     */
    netTypeListChange = (value) => {
        this.setState(
            {
                netTypeVal: value,
            },
            () => {
                this.getGroupsData();
            },
        );
    };

    /**
     * 获取组名称列表数据
     */
    getGroupsData = async () => {
        const { pagination, netTypeVal, groupName } = this.state;
        const { userId, login } = this.props;
        const { userInfo, systemInfo } = login;
        const userInfos = JSON.parse(userInfo);
        const data = {
            current: pagination.current,
            groupNetWorkType: netTypeVal,
            groupType: 1,
            groupId: -1,
            pageSize: pagination.pageSize,
            regionId: -1,
            userId,
            groupName,
            enableDefine: 1,
            netWorkGroupStatusList: [1, 3],
            netWorkGroupProvince: getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            sessionId: getRequestSessionId('getGroupsData'),
        };
        this.setState({
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
        });
        const res = await getGroupsData(data);
        if (res && res.data && Array.isArray(res.data)) {
            const handleArr = res.data.map((item) => {
                return {
                    ...item,
                    groupTypeName: item.groupNetWorkTypeName,
                };
            });
            this.setState({
                dataSource: handleArr,
                pagination: {
                    current: res.current,
                    pageSize: res.pageSize,
                    total: res.total,
                },
            });
        }
    };

    /**
     * 获取查询网元组名称
     */
    onSearchWebTuples = (event) => {
        this.setState({ groupName: event.target.value });
    };

    /**
     * 分页查询事件
     */
    onPageChange = (pagination) => {
        this.setState({ pagination }, () => {
            this.getGroupsData();
        });
    };

    /**
     * 勾选取反事件
     */
    onTxtNegativeChange = (e) => {
        const { onConditionDataChange, rightValues, FILTER_EMUN, currentSelectedCondition } = this.props;
        const reverse = e.target.checked ? FILTER_EMUN.REVERSE.TRUE : FILTER_EMUN.REVERSE.FALSE;
        const nextRightValues = rightValues.map((item) => {
            return {
                ...item,
                reverse: item.fieldName === currentSelectedCondition.fieldName ? reverse : item.reverse,
            };
        });
        onConditionDataChange(nextRightValues);
    };

    render() {
        const { dataSource, columns, pagination, selectedRowKeys, netTypeList, netTypeVal } = this.state;
        const { disabled, rightValues, currentSelectedCondition, FILTER_EMUN, moduleId } = this.props;
        const selectRightValue = rightValues?.find((item) => item.fieldName === currentSelectedCondition.fieldName);
        return (
            <Fragment>
                <Row style={{ margin: '5px 0' }}>
                    <Col span={1} />
                    <Col span={7}>
                        组类型：
                        <Select placeholder="请选择" style={{ width: '68%' }} onChange={this.netTypeListChange} value={netTypeVal}>
                            {netTypeList.map((item) => {
                                return <Option value={item.value}>{item.label}</Option>;
                            })}
                        </Select>
                    </Col>
                    <Col span={1} />
                    <Col span={10}>
                        <Input
                            suffix={<Icon antdIcon type="SearchOutlined" onClick={this.getGroupsData} />}
                            allowClear
                            onChange={this.onSearchWebTuples}
                        />
                    </Col>
                    <Col span={1} />
                    <Col span={4}>
                        {moduleId !== 63 && (
                            <Checkbox
                                checked={selectRightValue?.reverse === FILTER_EMUN.REVERSE?.TRUE}
                                disabled={disabled}
                                onChange={this.onTxtNegativeChange}
                            >
                                取反
                            </Checkbox>
                        )}
                    </Col>
                </Row>
                <div style={{ height: '400px' }}>
                    <VirtualTable
                        rowKey="groupId"
                        global={window}
                        tableAlertRender={false}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys,
                            //   onChange: this.onSelectChange,
                            onSelect: this.onSelect,
                            onSelectAll: this.onSelectAll,
                            getCheckboxProps: () => ({
                                disabled,
                            }),
                        }}
                        search={false}
                        options={false}
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination={pagination}
                        onChange={this.onPageChange}
                    />
                </div>
            </Fragment>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(WebTuples);
