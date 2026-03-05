import React, { PureComponent, Fragment } from 'react';
import { Icon, Row, Col, Checkbox, Space, Button, Tooltip, Radio } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import { getAlarmTitleListByTitleIds, getSiteNoListBySiteIds, saveAlarmTitleListByTitleIds } from './api';
import AddAlarmTitle from './add-alarm-title';

//行数据汇总
class AlarmTitleId extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            columns: [],
            visible: false,
            dataSource: [],
            isNull: '',
            isShowNullCheck: false,
        };
    }
    componentDidMount() {
        this.initConditionListById();
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.currentSelectedCondition) !== JSON.stringify(prevProps.currentSelectedCondition)) {
            this.initConditionListById();
        }
    }
    initConditionListById = async () => {
        const { rightValues, currentSelectedCondition, FILTER_EMUN, moduleId } = this.props;
        const conditionItem = rightValues?.find((item) => item.fieldName === currentSelectedCondition.enumName);
        let isShowNullCheck =
            currentSelectedCondition?.expressionList?.filter((item) => item.name === 'is_null' || item.name === 'not_null')?.length > 0;
        const newValueList = conditionItem?.valueList?.filter((v) => v.key !== 'NULL') || [];
        if (Array.isArray(newValueList) && newValueList?.length > 0) {
            const keyArray = newValueList.map((item) => {
                return item.key;
            });
            let funGetList = getAlarmTitleListByTitleIds;
            switch (currentSelectedCondition.enumName) {
                case 'alarm_title':
                    funGetList = getAlarmTitleListByTitleIds;
                    break;
                case 'site_no':
                    funGetList = getSiteNoListBySiteIds;
                    break;
                default:
                    break;
            }
            const res = await funGetList(keyArray);
            if (res && Array.isArray(res.data) && res.data.length > 0) {
                const list = res.data.map((item) => {
                    switch (currentSelectedCondition.enumName) {
                        case 'alarm_title':
                            return {
                                ...item,
                                key: item.titleId,
                                value: item.title,
                            };

                        case 'site_no':
                            return {
                                ...item,
                                key: item.siteId,
                                value: item.siteName,
                            };

                        default:
                            return item;
                    }
                });
                this.setState({ dataSource: list });
                return {
                    success: true,
                    total: res.total,
                    data: list,
                };
            }
            this.setState({ dataSource: [] });
        }
        const curItem = rightValues?.find(
            (item) => item.fieldName === currentSelectedCondition?.fieldName && item.fieldLabel === currentSelectedCondition?.fieldLabel,
        );
        let defaultIsNull = '';
        if (curItem?.compareType === 'is_null') {
            defaultIsNull = FILTER_EMUN.COMPARETYPE.ISNULL;
        } else if (curItem?.compareType === 'not_null') {
            defaultIsNull = FILTER_EMUN.COMPARETYPE.NOTNULL;
        }
        const roles = [
            {
                key: 'org_type',
                value: '告警类别',
            },
            {
                key: 'network_type_top',
                value: '一级网络类型',
            },
            {
                key: 'province_id',
                value: '省份名称',
            },
            {
                key: 'professional_type',
                value: '专业',
            },
            {
                value: '电联共享标识',
                key: 'is_share',
            },
        ];

        roles.forEach((item) => {
            if (currentSelectedCondition?.fieldName === item.key) {
                isShowNullCheck = false;
            }
        });

        if (moduleId === 604) {
            if (currentSelectedCondition?.fieldName === 'pivot_station_name') {
                isShowNullCheck = false;
            }
        }
        this.setState({
            isNull: defaultIsNull,
            isShowNullCheck,
        });
    };
    getCompareType = (currentCondition) => {
        let compareType = 'eq';
        // 专业网管ID特殊处理
        if (currentCondition.fieldName === 'nms_alarm_id') {
            compareType = 'in';
        } else {
            /** 高级条件中，字符类型默认展示like组 */
            compareType =
                // eslint-disable-next-line no-nested-ternary
                Number(currentCondition.valueSize) > 0
                    ? 'in'
                    : currentCondition.enableSelectGroup === 1
                    ? 'groupSelect'
                    : currentCondition.dataType === 'string' && moduleId === 63
                    ? 'in'
                    : currentCondition.dataType === 'string'
                    ? 'like'
                    : currentCondition.dataType === 'time'
                    ? 'between'
                    : currentCondition.dataType === 'date'
                    ? 'between'
                    : 'eq';
        }
        return compareType;
    };
    /**
     * 数据源更改通知
     */
    listDataChange = () => {
        const { dataSource } = this.state;
        const { onConditionDataChange, rightValues, currentSelectedCondition } = this.props;
        const rowDatasObj = dataSource.map((item) => {
            if (item) {
                return {
                    key: item.key,
                    value: item.value,
                };
            }
        });
        const nextRightValues = rightValues.map((item) => {
            return {
                ...item,
                valueList: item.fieldName === currentSelectedCondition.fieldName ? rowDatasObj : item.valueList,
                compareType: this.getCompareType(currentSelectedCondition),
            };
        });
        setTimeout(() => {
            onConditionDataChange(nextRightValues);
        }, 10);
        this.setState({
            isNull: '',
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
        setTimeout(() => {
            onConditionDataChange(nextRightValues);
        }, 10);
    };
    //添加按钮
    addItem = () => {
        this.setState({ visible: true });
    };
    //删除
    deleteItem = (row) => {
        const { dataSource } = this.state;
        const list = dataSource.filter((a) => a.key !== row.key);
        this.setState({ dataSource: list }, () => {
            this.listDataChange();
        });
    };
    //获取列信息
    getColumns = () => {
        const { currentSelectedCondition, disable } = this.props;
        switch (currentSelectedCondition.enumName) {
            case 'alarm_title':
                return this.getAlarmColumns(disable);

            case 'site_no':
                return this.getSiteColumns(disable);

            default:
                return [];
        }
    };
    //获取告警标题列信息
    getAlarmColumns = (disable) => {
        return [
            {
                title: '专业',
                align: 'left',
                dataIndex: 'professionalType',
                ellipsis: true,
                width: 20,
            },
            {
                title: '厂家',
                align: 'left',
                dataIndex: 'vendor',
                ellipsis: true,
                width: 20,
            },
            // {
            //     title: '设备类型',
            //     align: 'left',
            //     dataIndex: 'neType',
            //     ellipsis: true,
            //     width: 15,
            // },
            {
                title: '告警标题',
                align: 'left',
                dataIndex: 'title',
                width: 50,
            },
            {
                title: '告警标题ID',
                align: 'titleId',
                dataIndex: 'titleId',
                width: 30,
            },
            // {
            //     title: '厂家告警号',
            //     align: 'left',
            //     dataIndex: 'vendorAlarmId',
            //     ellipsis: true,
            //     width: 20,
            // },
            {
                title: '',
                dataIndex: 'titleId',
                width: 10,
                hideInSearch: true,
                align: 'center',
                fixed: 'right',
                render: (_, row) => {
                    return (
                        <Space size="middle">
                            <Tooltip title="删除" key="delete">
                                <Button
                                    type="text"
                                    disabled={disable}
                                    onClick={(params) => {
                                        this.deleteItem(row, params);
                                    }}
                                >
                                    <Icon antdIcon type="DeleteOutlined" />
                                </Button>
                            </Tooltip>
                        </Space>
                    );
                },
            },
        ];
    };
    //获取机房列信息
    getSiteColumns = (disable) => {
        return [
            {
                title: '省份',
                align: 'left',
                dataIndex: 'province',
                ellipsis: true,
                width: 10,
            },
            {
                title: '地市',
                align: 'left',
                dataIndex: 'region',
                ellipsis: true,
                width: 10,
            },
            {
                title: '机房名称',
                align: 'left',
                dataIndex: 'siteName',
                width: 45,
            },
            {
                title: '机房ID',
                align: 'left',
                dataIndex: 'siteId',
                ellipsis: true,
                width: 20,
            },
            {
                title: '',
                dataIndex: 'key',
                width: 10,
                hideInSearch: true,
                align: 'center',
                fixed: 'right',
                render: (_, row) => {
                    return (
                        <Space size="middle">
                            <Tooltip title="删除" key="delete">
                                <Button
                                    type="text"
                                    disabled={disable}
                                    onClick={(params) => {
                                        this.deleteItem(row, params);
                                    }}
                                >
                                    <Icon antdIcon type="DeleteOutlined" />
                                </Button>
                            </Tooltip>
                        </Space>
                    );
                },
            },
        ];
    };
    onRadioChange = (e) => {
        const { onConditionDataChange, rightValues, currentSelectedCondition } = this.props;
        const nextRightValues = rightValues.map((item) => {
            return {
                ...item,
                valueList: item.fieldName === currentSelectedCondition.fieldName ? [{ key: 'NULL', value: 'NULL' }] : item.valueList,
                compareType: item.fieldName === currentSelectedCondition.fieldName ? e.target.value : item.compareType,
            };
        });
        setTimeout(() => {
            onConditionDataChange(nextRightValues);
        }, 10);
        this.setState({
            isNull: e.target.value,
        });
    };
    handleOk = (dataSource, visible) => {
        const { currentSelectedCondition } = this.props;
        if (currentSelectedCondition.enumName === 'alarm_title' && dataSource.length > 0) {
            saveAlarmTitleListByTitleIds(dataSource);
        }
        this.setState({ visible, dataSource }, () => {
            this.listDataChange();
        });
    };
    handleCancel = (visible) => {
        this.setState({ visible });
    };
    render() {
        const { dataSource, visible, isNull, isShowNullCheck } = this.state;
        const { disabled, rightValues, currentSelectedCondition, FILTER_EMUN, moduleId } = this.props;
        const selectRightValue = rightValues?.find((item) => item.fieldName === currentSelectedCondition.fieldName);
        return (
            <Fragment>
                <Row style={{ margin: '5px 0' }}>
                    <Col span={1} />
                    <Col span={7}>
                        <Space size="large">
                            <Button
                                type="primary"
                                disabled={disabled}
                                onClick={() => {
                                    this.addItem();
                                }}
                            >
                                添加
                            </Button>
                        </Space>
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
                    {isShowNullCheck && (
                        <>
                            <Col span={1} />
                            <Col span={10}>
                                <Radio.Group
                                    value={isNull}
                                    disabled={disabled}
                                    onChange={(e) => {
                                        this.onRadioChange(e);
                                    }}
                                >
                                    <Radio value={FILTER_EMUN.COMPARETYPE.ISNULL}>空</Radio>
                                    <Radio value={FILTER_EMUN.COMPARETYPE.NOTNULL}>非空</Radio>
                                </Radio.Group>
                            </Col>
                        </>
                    )}
                </Row>
                <div style={{ height: 'calc(100% - 38px)' }}>
                    <VirtualTable
                        rowKey="id"
                        global={window}
                        tableAlertRender={false}
                        search={false}
                        options={false}
                        bordered
                        dataSource={dataSource}
                        columns={this.getColumns()}
                    />
                </div>
                {visible && (
                    <AddAlarmTitle
                        visible={visible}
                        currentSelectedCondition={currentSelectedCondition}
                        curExitDate={dataSource}
                        handleOk={this.handleOk}
                        handleCancel={this.handleCancel}
                    ></AddAlarmTitle>
                )}
            </Fragment>
        );
    }
}
export default AlarmTitleId;
