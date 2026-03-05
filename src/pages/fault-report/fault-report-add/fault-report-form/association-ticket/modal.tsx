import { Button, Input, Modal, message, DatePicker, Form, Row, Col, Select } from 'oss-ui';
import { ColumnsType } from 'oss-ui/es/table';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';

import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import dayjs from 'dayjs';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import TicketTable from './ticket-table';
import { getDictEntryApi } from './api';
import { getViewItemData } from '../../../api';

type Props = {
    visible: boolean;
    onCancle: () => void;
    onSaveCallback: (selectedRows: DataType[]) => void;
    selectedRows: any[];
    ticketModalClassName?: string;
    login?: any;
};
export interface DataType {
    key: React.Key;
    sheetNo: string;
    sheetTitle: string;
    sheetStatus: string;
    forwardTime: string;
}

export const columns: ColumnsType<DataType> = [
    {
        title: '工单编号',
        dataIndex: 'sheetNo',
        align: 'center',
        width: 200,
        ellipsis: true,
    },
    {
        title: '工单标题',
        dataIndex: 'sheetTitle',
        align: 'center',
        width: 500,
        ellipsis: true,
    },
    {
        title: '专业',
        dataIndex: 'professionalType',
        align: 'center',
        width: 100,
    },
    {
        title: '工单状态',
        dataIndex: 'sheetStatus',
        align: 'center',
        width: 100,
    },
    {
        title: '派单时间',
        dataIndex: 'forwardTime',
        align: 'center',
        width: 200,
    },
];
interface ProfessionalListType {
    label: string;
    value: string;
}
function Index(props: Props) {
    const { visible, onCancle, onSaveCallback, selectedRows: selectedRowsProps, ticketModalClassName } = props;
    const { userId, currentZone, zoneLevelFlags, mgmtZones } = useLoginInfoModel();
    const [data, setData] = useState<DataType[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [form] = Form.useForm();
    // const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(initSelectedRowKeys);
    const [selectedRows, setSelectedRows] = useState<DataType[]>(selectedRowsProps);
    const [professionalList, setProfessionalList] = useState<ProfessionalListType[]>([]);
    const [keyWord, setKeyWord] = useState('');
    const paginationRef = useRef({
        current: 1,
        total: 0,
        pageSize: 10,
    });

    const rowSelection = {
        // onChange: (_selectedRowKeys, _selectedRows: DataType[]) => {
        //     console.log(`_selectedRowKeys:`, _selectedRowKeys, 'selectedRows: ', _selectedRows);
        //     setSelectedRowKeys(_selectedRowKeys);
        //     setSelectedRows(_selectedRows);
        // },
        defaultSelectedRowKeys: selectedRows.map((item) => item.sheetNo),
        onSelect(record, selected) {
            if (selected) {
                setSelectedRows((prev) => [...prev, record]);
            } else {
                setSelectedRows((prev) => {
                    return produce(prev, (draft) => {
                        const index = draft.findIndex((item) => item.sheetNo === record.sheetNo);

                        if (index > -1) {
                            draft.splice(index, 1);
                        }
                    });
                });
            }
        },
        onSelectAll(selected, curSelectedRows, changeRows) {
            if (selected) {
                setSelectedRows((prev) => _.uniqBy([...prev, ...changeRows], 'sheetNo'));
            } else {
                setSelectedRows((prev) => _.differenceBy(prev, changeRows, 'sheetNo'));
            }
        },
    };

    const handleSearch = () => {
        (async () => {
            const { profession = [], dispatchTime } = form.getFieldsValue();
            const [startTime, endTime] = dispatchTime;
            setTableLoading(true);

            let provinceId;
            if (zoneLevelFlags.isRegionZone) {
                provinceId = mgmtZones.map((item) => item.zoneId).join(',');
            } else if (zoneLevelFlags.isProvinceZone) {
                provinceId = currentZone.zoneId;
            }
            const params = {
                viewPageArgs: {
                    province_id: provinceId,
                    key_word: keyWord,
                    forward_start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
                    forward_end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
                    pageIndex: paginationRef.current.current,
                    pageSize: paginationRef.current.pageSize,
                    user_id: userId,
                    sheet_type: '1',
                    /**
                     * 2        待受理
                     * 3        处理中
                     * 4        处理完成
                     * 7        待审批
                     * 8        处理超时
                     * 9        待确认
                     * 10        已销单
                     * 12        待处理
                     * 13        待定性
                     * 14        待终止审核
                     * 15        异常归档
                     * 16        待处理完成
                     * 17        待业务恢复
                     * 19        上传故障报告
                     * 20        故障报告审核
                     * 21        待归档
                     * 22        待定性审核
                     * 23        挂起
                     */
                    sheet_status: '2,3,4,7,8,9,10,12,13,14,15,16,17,19,20,21,22,23',
                    professional_type: profession.join(','),
                    // alarm_status: '',
                },
                viewItemId: 'orderStatisticsList',
                viewPageId: 'fault-order',
            };
            const res = await getViewItemData(params);
            if (res?.code !== 200) {
                return;
            }
            const page = res?.data?.viewItemData.page ?? {
                current: 1,
                total: 0,
                pageSize: 10,
            };
            paginationRef.current = {
                current: Number(page.current),
                total: Number(page.total),
                pageSize: Number(page.pageSize),
            };
            const rows = (res?.data?.viewItemData?.rows || []).map((itemRow) => ({
                ...itemRow,
                key: itemRow?.sheetNo,
            }));
            setTableLoading(false);
            setData(rows);
        })();
    };
    const getDictEntryData = async () => {
        const res = await getDictEntryApi('professional_type', userId);
        const newData = res.map((el) => {
            return {
                label: el.value,
                value: el.key,
            };
        });

        setProfessionalList([{ label: '全部', value: 'all' }, ...newData]);
    };
    useEffect(() => {
        getDictEntryData();
        handleSearch();
    }, []);

    const handleCancle = () => {
        onCancle();
    };

    function onTableChange(newPagination, filters, sorter, { action }) {
        if (action === 'paginate') {
            paginationRef.current = newPagination;
            handleSearch();
        }
    }
    const disableDate = (current) => {
        return moment().subtract(2, 'day').startOf('day').isAfter(current, 'second') || moment().isBefore(current, 'second');
    };

    const onSelectChange = (value: string[]) => {
        let thisValue = value;
        const allValue = professionalList.map((el) => el.value);
        if (value.includes('all')) {
            if (value.length === allValue.length) {
                thisValue = [];
            } else {
                thisValue = allValue;
            }
        }
        thisValue = thisValue.filter((el) => el !== 'all');
        form.setFieldsValue({
            profession: thisValue,
        });
    };

    return (
        <Modal
            className={ticketModalClassName}
            visible={visible}
            width={1200}
            title="关联工单"
            onCancel={handleCancle}
            destroyOnClose
            footer={
                <div className="association-ticket-modal-footer">
                    <div>
                        <Button onClick={handleCancle}>取消</Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                console.log('=selectedRows==', selectedRows);
                                if (!selectedRows.length) {
                                    message.warn('至少选择一个工单');
                                    return;
                                }
                                onSaveCallback?.(selectedRows);
                                handleCancle();
                            }}
                        >
                            添加
                        </Button>
                    </div>
                </div>
            }
        >
            <div style={{ minHeight: 360 }}>
                <div className="association-ticket-modal-search">
                    <Form
                        labelAlign="right"
                        name="baseFilterForm"
                        form={form}
                        initialValues={{ dispatchTime: [moment().subtract(2, 'day').startOf('day'), moment()] }}
                    >
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item labelCol={{ span: 6 }} label="派单时间" name="dispatchTime">
                                    <DatePicker.RangePicker
                                        placeholder={['起始时间', '结束时间']}
                                        showTime
                                        allowClear={false}
                                        getPopupContainer={((triggerNode) => triggerNode.parentElement) as any}
                                        disabledDate={disableDate}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item labelCol={{ span: 6 }} label="专业" name="profession">
                                    <Select
                                        style={{ width: 150 }}
                                        allowClear={false}
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                        mode="multiple"
                                        maxTagCount={1}
                                        options={professionalList}
                                        onChange={onSelectChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={1} />
                            {/* <Col span={2}>
                            <Select
                                style={{ width: 100 }}
                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                options={[
                                    { label: '工单编号', value: '工单编号' },
                                    { label: '工单标题', value: '工单标题' },
                                ]}
                                defaultValue={['工单编号']}
                            />
                        </Col> */}
                            <Col span={8}>
                                <Form.Item label="关键字" name="workOrderNo">
                                    <Input
                                        placeholder="输入工单编号或标题进行搜索"
                                        style={{ width: 320, marginRight: 8 }}
                                        value={keyWord}
                                        onChange={(e) => {
                                            setKeyWord(e.target.value.trim());
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        paginationRef.current = {
                                            current: 1,
                                            total: 0,
                                            pageSize: 10,
                                        };
                                        handleSearch();
                                    }}
                                >
                                    搜索
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <TicketTable
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    rowKey="sheetNo"
                    columns={columns}
                    dataSource={data}
                    loading={tableLoading}
                    pagination={paginationRef.current}
                    onChange={onTableChange}
                />
            </div>
        </Modal>
    );
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
