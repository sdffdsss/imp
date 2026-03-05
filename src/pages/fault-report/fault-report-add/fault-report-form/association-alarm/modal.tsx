import { Button, Input, Modal, message, DatePicker, Select, Form, Row, Col } from 'oss-ui';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { customAlphabet } from 'nanoid';
import TicketTable from './ticket-table';
import { getTableData, getSpecialtyOptionsApi, getSubAlarm } from './rest.js';

type Props = {
    visible: boolean;
    onCancle: () => void;
    onSaveCallback: (selectedRows: any, searchTime: any) => void;
    selectedRows: any[];
    ticketModalClassName?: string;
    login?: any;
    columns?: any;
    fieldIds?: any;
    specialty?: any;
};
export interface DataType {
    key: React.Key;
    sheetTitle: string;
    sheetStatus: string;
    forwardTime: string;
    standard_alarm_id?: string;
}

const { RangePicker } = DatePicker;

const nanoid = customAlphabet('4567890', 15);

function Index(props: Props) {
    const { visible, onCancle, onSaveCallback, ticketModalClassName } = props;
    const { userId, provinceId } = useLoginInfoModel();
    const [data, setData] = useState<any>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(props.selectedRows?.map((item) => item.standard_alarm_id));
    const [selectedRows, setSelectedRows] = useState<any>(props.selectedRows || []);
    const [searchKey, setSearchKey] = useState('');
    const [time, setTime] = useState<any>([moment().subtract(1, 'day').startOf('day'), moment().endOf('day')]);
    // const [pagination, setPagination] = useState({
    //     current: 1,
    //     pageSize: 20,
    //     total: 0,
    // });
    const [specialtyOptions, setSpecialtyOptions] = useState<any>([]);
    const [specialty, setSpecialty] = useState<any>('');
    const [type, setType] = useState<any>('告警标题');
    const paginationRef = useRef({
        current: 1,
        total: 0,
        pageSize: 10,
    });
    const [searchTime, setSearchTime] = useState<any>([]);
    const dataRef = useRef([]);
    const disableDate = (current) => {
        // Can not select days before today and today
        return (current && current < moment().subtract(1, 'day').startOf('day')) || current > moment().endOf('day');
        // return current && current < dayjs().endOf('day') || current > dayjs().endOf('day') ;
    };

    const rowSelection = {
        // onChange: (_selectedRowKeys, _selectedRows: DataType[]) => {
        //     console.log(`_selectedRowKeys:`, _selectedRowKeys, 'selectedRows: ', _selectedRows, selectedRowKeys, '=====321');
        //     setSelectedRowKeys(_selectedRowKeys);
        //     setSelectedRows(_selectedRows);
        // },
        defaultSelectedRowKeys: selectedRows.filter((e) => e).map((item) => item.standard_alarm_id),
        selectedRowKeys,
        onSelect(record, selected) {
            if (selected) {
                if (record.hasSubAlarm) {
                    const temp = [...selectedRows];
                    temp.push(record);
                    record.children?.forEach((ite) => {
                        temp.push(ite);
                    });
                    setSelectedRows(
                        _.uniqBy(
                            temp.filter((e) => e),
                            'standard_alarm_id',
                        ),
                    );
                } else {
                    setSelectedRows((prev) => [...prev, record].filter((e) => e));
                }
            } else {
                if (record.hasSubAlarm) {
                    setSelectedRows((prev) => {
                        return produce(prev, (draft) => {
                            const index = draft.findIndex((item) => item.standard_alarm_id === record?.standard_alarm_id);
                            if (index > -1) {
                                draft.splice(index, 1);
                            }
                            record.children?.forEach((e) => {
                                const subIndex = draft.findIndex((item) => item.standard_alarm_id === e?.standard_alarm_id);
                                if (subIndex > -1) {
                                    draft.splice(subIndex, 1);
                                }
                            });
                        });
                    });
                } else {
                    setSelectedRows((prev) => {
                        return produce(prev, (draft) => {
                            const index = draft.findIndex((item) => item.standard_alarm_id === record?.standard_alarm_id);

                            if (index > -1) {
                                draft.splice(index, 1);
                            }
                        });
                    });
                }
                setSelectedRows((prev) => {
                    return produce(prev, (draft) => {
                        const index = draft.findIndex((item) => item.standard_alarm_id === record?.standard_alarm_id);

                        if (index > -1) {
                            draft.splice(index, 1);
                        }
                    });
                });
            }
        },
        onSelectAll(selected, curSelectedRows, changeRows) {
            if (selected) {
                setSelectedRows((prev) => _.uniqBy([...prev, ...changeRows], 'standard_alarm_id'));
            } else {
                setSelectedRows((prev) => _.differenceBy(prev, changeRows, 'standard_alarm_id'));
            }
        },
    };

    const handleSearch = (val) => {
        setTableLoading(true);
        (async () => {
            const param = {
                dateBean: {
                    endTime: moment(time[1]).format('YYYY-MM-DD HH:mm:ss'),
                    fieldId: 62,
                    not: false,
                    startTime: moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
                    type: 'type',
                },
                statusBean: {
                    activeStatus: 1,
                    fieldId: 68,
                    not: false,
                    status: [1],
                },
                fieldConditions: {
                    conditionList: [
                        {
                            fieldId: 23,
                            not: false,
                            type: 'in',
                            value: val || specialty,
                            values: [val || specialty],
                        },
                    ],
                    logicalAnd: true,
                    not: true,
                },
                userId,
                pageSize: paginationRef.current.pageSize || 10,
                startIndex: paginationRef.current.pageSize * (paginationRef.current.current - 1),
                alarmOrigin: 0,
                alarmsenceId: 0,
                fieldIds: props.fieldIds.split(',').map((e) => +e),
                loginProvinceId: provinceId,
            };
            if (searchKey) {
                param.fieldConditions.conditionList[1] = {
                    fieldId: type === '告警标题' ? 30 : 35,
                    not: false,
                    type: 'eq',
                    value: searchKey,
                    values: [searchKey],
                };
            }

            const res = await getTableData(param);
            setSearchTime([moment(time[0]).format('YYYY-MM-DD HH:mm:ss'), moment(time[1]).format('YYYY-MM-DD HH:mm:ss')]);
            if (res.data) {
                // setData(res.data);
                const resData = res.data;
                let list = resData.map((item, index) => {
                    let field: any = {};

                    Object.keys(item).forEach((items) => {
                        field = {
                            ...field,
                            [items]: item[items].lable === '' ? item[items].value : item[items].lable,
                        };
                        if (items === 'org_severity') {
                            field = {
                                ...field,
                                [items]: item[items].value,
                            };
                        }
                        if (items === 'province_id') {
                            field = {
                                ...field,
                                provinceId: item.province_id.value,
                            };
                        }
                    });
                    return {
                        ...field,
                        id: nanoid(),
                        field: item,
                        alarm_id: `${field.fp0}_${field.fp1}_${field.fp2}_${field.fp3}_${dayjs(field.time_stamp).unix()}000_${field.provinceId}`,
                        alarmId: field.standard_alarm_id,
                    };
                });
                const paginationNew = {
                    current: paginationRef.current.current,
                    total: +res.total,
                    pageSize: paginationRef.current.pageSize,
                };
                list = list.map((item) => {
                    if (item.hasSubAlarm === 1) {
                        return {
                            ...item,
                            children: [],
                        };
                    }
                    return {
                        ...item,
                        // children: [],
                    };
                });
                /* const unSelRows = list.filter((item) => !selectedRowKeys.includes(item.alarmId));
                list = selectedRows.concat(unSelRows); */
                dataRef.current = list;
                // dataRef.current = dataRef.current.concat(list);
                paginationRef.current = paginationNew;
                setData(dataRef.current);
                // setPagination(paginationNew);
                setTableLoading(false);
            }
        })();
    };

    const onTimePickerChange = (times, timeString) => {
        console.log(times, timeString);
        setTime(times);
    };
    const getSpecialtyOptions = async () => {
        const param = {
            dictName: 'fault_report_alarm_specialty',
            parentId: props.specialty,
        };
        const res = await getSpecialtyOptionsApi(param);
        if (res.data) {
            setSpecialtyOptions(
                res.data.map((e) => {
                    return { label: e.dName, value: e.dCode };
                }),
            );
            setSpecialty(res.data[0]?.dCode);
            handleSearch(res.data[0]?.dCode);
        }
    };

    const onExpand = (bool, record) => {
        if (bool) {
            getSubAlarm(record).then((res) => {
                const newDataSource = _.cloneDeep(data);
                const alarm = newDataSource.find(
                    (item) => item.fp0 === record.fp0 && item.fp1 === record.fp1 && item.fp2 === record.fp2 && item.fp3 === record.fp3,
                );
                alarm.children = res.map((item, index) => {
                    let field: any = {};
                    Object.keys(item).forEach((items) => {
                        field = {
                            ...field,
                            [items]: item[items].lable === '' ? item[items].value : item[items].lable,
                        };
                        if (items === 'org_severity') {
                            field = {
                                ...field,
                                [items]: item[items].value,
                            };
                        }
                        if (items === 'province_id') {
                            field = {
                                ...field,
                                provinceId: item.province_id.value,
                            };
                        }
                    });
                    return {
                        ...field,
                        dropLine: '—',
                        id: nanoid(),
                        field: item,
                        alarm_id: `${field.fp0}_${field.fp1}_${field.fp2}_${field.fp3}_${dayjs(field.time_stamp).unix()}000_${field.provinceId}`,
                        alarmId: field.standard_alarm_id,
                    };
                });
                setData(newDataSource);
            });
        }
    };

    useEffect(() => {
        setSelectedRowKeys(selectedRows?.map((item) => item.standard_alarm_id));
    }, [selectedRows]);

    useEffect(() => {
        getSpecialtyOptions();
    }, []);

    const handleCancle = () => {
        onCancle();
    };

    function onTableChange(newPagination, filters, sorter, { action }) {
        if (action === 'paginate') {
            paginationRef.current = newPagination;
            handleSearch(false);
        }
    }
    return (
        <Modal
            className={`${ticketModalClassName} alarm-ticket-modal`}
            visible={visible}
            width={1200}
            title="关联告警"
            onCancel={handleCancle}
            destroyOnClose
            getContainer={false}
            footer={
                <div className="association-ticket-modal-footer">
                    <div>
                        <Button onClick={handleCancle}>取消</Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                console.log('=selectedRows==', selectedRows);
                                if (!selectedRows.length) {
                                    message.warn('至少选择一条告警');
                                    return;
                                }
                                Modal.confirm({
                                    title: '提示',
                                    content: '将根据选择的第一条告警，按照模板自动带出故障内容，是否确认？',
                                    onOk: () => {
                                        onSaveCallback?.(selectedRows, searchTime);
                                        handleCancle();
                                    },
                                    onCancel() {},
                                });
                            }}
                        >
                            添加
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="association-alarm-modal-search">
                <Form labelAlign="right" name="baseFilterForm">
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item labelCol={{ span: 6 }} label="时间" rules={[{ required: true, message: '请选择时间范围！' }]}>
                                <RangePicker
                                    disabledDate={disableDate}
                                    placeholder={['起始时间', '结束时间']}
                                    value={time}
                                    onChange={onTimePickerChange}
                                    showTime
                                    allowClear={false}
                                    getPopupContainer={((triggerNode) => triggerNode.parentElement) as any}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item labelCol={{ span: 6 }} label="专业">
                                <Select
                                    style={{ width: 100 }}
                                    defaultValue={specialtyOptions[0]?.value}
                                    value={specialty}
                                    onChange={(val) => setSpecialty(val)}
                                    options={specialtyOptions}
                                    allowClear={false}
                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Select
                                style={{ width: 100 }}
                                value={type}
                                onChange={(val) => {
                                    setType(val);
                                    setSearchKey('');
                                }}
                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                options={[
                                    { label: '告警标题', value: '告警标题' },
                                    { label: '网管告警id', value: '网管告警id' },
                                ]}
                            />
                            <Input
                                style={{ width: 300, margin: '0 8px' }}
                                value={searchKey}
                                onChange={(e) => {
                                    setSearchKey(e.target.value.trim());
                                }}
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    paginationRef.current = {
                                        current: 1,
                                        total: 0,
                                        pageSize: 10,
                                    };
                                    handleSearch(false);
                                }}
                            >
                                搜索
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            {/* <div style={{ height: 450 }}> */}
            <TicketTable
                rowSelection={{
                    preserveSelectedRowKeys: true,
                    type: 'checkbox',
                    ...rowSelection,
                }}
                rowKey="standard_alarm_id"
                columns={props.columns || []}
                dataSource={data}
                loading={tableLoading}
                pagination={paginationRef.current}
                onChange={onTableChange}
                onExpand={onExpand}
            />
            {/* </div> */}
        </Modal>
    );
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
