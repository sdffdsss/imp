import React from 'react';
import { Input, Form, Row, Col, Checkbox, Button, Space, Radio, message } from 'oss-ui';
import request from '@Common/api';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';

class Index extends React.PureComponent {
    formRef = React.createRef();
    radioList = [
        { label: '故障工单', value: '1' },
        { label: '督办工单', value: '7' },
    ];
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            columnsAlarm: [],
            rowKeys: [],
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
        const alarmIds = [];
        const dataSourceAlarm = [];
        const recordAlarmDetailList = [];
        const professionalTypes = [];
        const provinceIds = [];
        const regionIds = [];
        const intIds = [];
        record.forEach((item) => {
            // alarmIds.push(item.alarm_id?.value);
            alarmIds.push(item.standard_alarm_id?.value);
            dataSourceAlarm.push({
                eqp_label: item.eqp_label?.value,
                ne_label: item.ne_label?.value,
                title_text: item.title_text?.value,
                event_time: item.event_time?.value,
            });
        });
        this.getAlarmDetail('', alarmIds).then((res) => {
            if (res && res.length > 0) {
                res.forEach((i) => {
                    const key = Object.keys(i)?.[0];
                    if (key && alarmIds.indexOf(key) > -1) {
                        recordAlarmDetailList.push(i[key]);
                    }
                });
                console.log(recordAlarmDetailList, '====record', alarmIds, res);
                recordAlarmDetailList.forEach((items) => {
                    const arr = Object.values(items);
                    arr.forEach((item) => {
                        if (item.field === 'professional_type') {
                            professionalTypes.push(item.value);
                        }
                        if (item.field === 'province_id') {
                            provinceIds.push(item.value);
                        }
                        if (item.field === 'region_id') {
                            regionIds.push(item.value);
                        }
                        if (item.field === 'int_id') {
                            intIds.push(item.value);
                        }
                    });
                });
                // for (const alarm of res) {
                //     alarm.alarmFieldList.forEach((item) => {
                //         if (item.field === 'professional_type') {
                //             professionalTypes.push(item.value);
                //         }
                //         if (item.field === 'province_id') {
                //             provinceIds.push(item.value);
                //         }
                //         if (item.field === 'region_id') {
                //             regionIds.push(item.value);
                //         }
                //         if (item.field === 'int_id') {
                //             intIds.push(item.value);
                //         }
                //     });
                // }
                const curSelAlarm = {
                    professional_type: _.sortedUniq(professionalTypes).join(','),
                    province_id: _.sortedUniq(provinceIds).join(','),
                    region_id: _.sortedUniq(regionIds).join(','),
                    int_id: _.sortedUniq(intIds).join(','),
                };
                this.setState({
                    curSelAlarm,
                    dataSourceAlarm,
                });
            } else {
                message.error('获取告警信息失败!');
            }
        });
    };
    getAlarmDetail = (sessionId, selectRowKey) => {
        return request('alarm/detail/v1/alarms', {
            type: 'post',
            baseUrlType: 'exportUrl',
            // baseUrlType: 'viewItemUrl',
            // data: {
            //     alarmIdList: [].concat(selectRowKey),
            //     sessionId,
            // },
            data: [].concat(selectRowKey),
            showSuccessMessage: false,
            showErrorMessage: false,
        })
            .then((res) => {
                if (res) {
                    return res.data;
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
                dataIndex: 'sheetLabel',
                ellipsis: true,
                width: 80,
                hideInSearch: true,
                align: 'center',
            },
            {
                title: '工单状态',
                dataIndex: 'sheetStatus',
                ellipsis: true,
                align: 'center',
                hideInSearch: true,
                width: 80,
            },
            {
                title: '派单时间',
                dataIndex: 'forwardTime',
                align: 'center',
                width: 160,
                hideInSearch: true,
                ellipsis: true,
            },
        ];
        const columnsAlarm = [
            {
                title: '网元名称',
                dataIndex: 'eqp_label',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
                width: 140,
            },
            {
                title: '告警对象名称',
                dataIndex: 'ne_label',
                ellipsis: true,
                width: 140,
                hideInSearch: true,
                align: 'center',
            },
            {
                title: '告警标题',
                dataIndex: 'title_text',
                ellipsis: true,
                align: 'center',
                hideInSearch: true,
                width: 110,
            },
            {
                title: '告警发生时间',
                dataIndex: 'event_time',
                align: 'center',
                width: 160,
                hideInSearch: true,
                ellipsis: true,
            },
        ];
        this.setState({
            columns,
            columnsAlarm,
        });
    };
    searchData = () => {
        const { pagination, curSelAlarm } = this.state;
        this.props.menuComponentFormRef.current?.setFieldsValue({
            data: {
                sheetNo: '',
                clientName: 'reactor-client',
                isDup: false,
                repeatInterval: 100,
                repeatTimes: 2,
            },
        });
        const query = this.formRef.current.getFieldsValue();
        const parms = {
            pageIndex: String(pagination.current),
            pageSize: String(pagination.pageSize),
            currentDateFlag: '2',
            sheetStatusFlag: '2',
            provinceId: curSelAlarm.province_id,
            keyWord: query.keyWord || '',
            sheetType: query.sheetType || '',
        };
        if (query && query.checkItems && query.checkItems) {
            for (let key of query.checkItems) {
                switch (key) {
                    case '同一专业':
                        parms.professionalType = curSelAlarm.professional_type;
                        break;
                    case '同一地市':
                        parms.regionId = curSelAlarm.region_id;
                        break;
                    case '同一网元':
                        parms.intId = curSelAlarm.int_id;
                        break;
                    case '当日':
                        parms.currentDateFlag = '1';
                        break;
                    case '已受理':
                        parms.sheetStatusFlag = '1';
                        break;
                    default:
                        break;
                }
            }
        } else {
            message.error('至少选择一个快捷查询条件');
            return;
        }
        this.setState({
            dataSource: [],
            rowKeys: [],
            loading: true,
            pagination: { ...pagination, total: 0 },
        });
        //自测数据
        // parms.professionalType = '8';
        // parms.provinceId = '1150126687';
        // parms.sheetStatusFlag = '1';
        request('work/sheet/v1/getViewItemDataByPop', {
            data: parms,
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '工单信息失败',
            baseUrlType: 'failureSheetUrl',
        })
            .then((res) => {
                if (res.code === 200) {
                    const dataSource = res.data.rows.map((item, index) => {
                        return {
                            key: index,
                            ...item,
                        };
                    });
                    this.setState({
                        dataSource: dataSource || [],
                        loading: false,
                        pagination: { ...pagination, total: Number(res.data.total) },
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                });
            });
    };
    onPageChange = (pagination) => {
        this.setState({ pagination }, () => {
            this.searchData();
        });
    };
    onSelectedRowKeys = (rowKeys) => {
        this.setState({ rowKeys });
    };
    onCheckboxChange = () => {
        const { pagination } = this.state;
        this.setState({
            dataSource: [],
            rowKeys: [],
            pagination: { ...pagination, current: 1, total: 0 },
        });
    };
    render() {
        const { columns, columnsAlarm, dataSource, dataSourceAlarm, loading, pagination, rowKeys } = this.state;
        const xWidth = columns.reduce((total, item) => {
            return total + item.width;
        }, 0);
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                const query = this.formRef.current.getFieldsValue();
                const data = {
                    sheetNo: selectedRows.length > 0 ? selectedRows[0].sheetNo : '',
                    clientName: 'reactor-client',
                    isDup: false,
                    repeatInterval: 100,
                    repeatTimes: 2,
                    configType: query.sheetType,
                };
                this.props.menuComponentFormRef.current?.setFieldsValue({
                    data,
                });
                this.props?.addDispatchChange && this.props?.addDispatchChange(data);
                this.onSelectedRowKeys(selectedRowKeys);
            },
            selectedRowKeys: rowKeys,
        };
        return (
            <div className="add-to-sheet ">
                <Form ref={this.props.menuComponentFormRef}>
                    <div className="add-to-sheet-top-table" style={{ height: '120px' }}>
                        <VirtualTable
                            rowKey="key"
                            global={window}
                            columns={columnsAlarm}
                            dataSource={dataSourceAlarm}
                            search={false}
                            onReset={false}
                            scroll={{ x: xWidth, y: 120 }}
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                            bordered
                            options={false}
                            tableAlertRender={false}
                            pagination={false}
                            // headerTitle={'告警基本信息如下:'}
                            renderEmpty={<div>没有满足条件的数据</div>}
                        />
                    </div>
                    <div className="add-to-sheet-top-select" style={{ marginTop: '5px' }}>
                        <Form
                            name="validate_other"
                            ref={this.formRef}
                            initialValues={{
                                sheetType: '1',
                            }}
                        >
                            <Row>
                                <Col span={24}>
                                    <Form.Item name="sheetType" label="工单类型">
                                        <Radio.Group size="small" style={{ border: '0px' }} buttonStyle="solid" onChange={this.onCheckboxChange}>
                                            {this.radioList.map((item) => {
                                                return (
                                                    <Radio value={item.value} key={item} style={{ width: item.length * 20 + 14 }}>
                                                        {item.label}
                                                    </Radio>
                                                );
                                            })}
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item name="checkItems" label="快捷查询" initialValue={['同一专业']}>
                                        <Checkbox.Group size="small" style={{ border: '0px' }} buttonStyle="solid" onChange={this.onCheckboxChange}>
                                            {['同一专业', '同一地市', '同一网元', '当日', '已受理'].map((item) => {
                                                return (
                                                    <Checkbox value={item} key={item} style={{ width: item.length * 20 + 14 }}>
                                                        {item}
                                                    </Checkbox>
                                                );
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '6px' }}>
                                <Col span={18}>
                                    <Form.Item name="keyWord" label="工单编号/工单标题">
                                        <Input placeholder="工单编号或者工单标题或者主送人" allowClear onChange={this.onCheckboxChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={1} />
                                <Col span={2}>
                                    <Form.Item>
                                        <Space>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                onClick={() => {
                                                    this.searchData();
                                                }}
                                            >
                                                查询
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="add-to-sheet-tab" style={{ height: '390px' }}>
                        <VirtualTable
                            rowKey="key"
                            global={window}
                            columns={columns}
                            dataSource={dataSource}
                            onChange={this.onPageChange}
                            search={false}
                            onReset={false}
                            scroll={{ x: xWidth }}
                            pagination={pagination}
                            loading={loading}
                            bordered
                            dateFormatter="string"
                            options={false}
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                            rowSelection={{
                                type: 'radio',
                                ...rowSelection,
                            }}
                            tableAlertRender={false}
                            renderEmpty={<div>没有满足条件的数据</div>}
                        />
                    </div>
                </Form>
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
