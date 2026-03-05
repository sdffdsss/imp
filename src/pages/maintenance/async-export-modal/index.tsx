import React, { useEffect, useMemo, useState } from 'react';
import { Table, Modal, Button, Progress, Form, Input, DatePicker } from 'oss-ui';
import { Moment } from 'moment';
import { TableProps } from 'oss-ui/lib/table';
import { DataType } from './type';
import './index.less';

interface Props {
    visible: boolean;
    asyncExportFormInitData: any;
    onExport: (value: any) => void;
    onDownLoad: () => void;
    onClose: () => void;
    exportList: DataType[];
    exportBtnLoading: boolean;
}

/**
 * @description 运维调度班表导出
 * @param props
 * @returns
 */
const AsyncExportModal: React.FC<Props> = (props) => {
    const { visible, onExport, exportList, onDownLoad, onClose, asyncExportFormInitData, exportBtnLoading } = props;
    const [form] = Form.useForm();
    const asyncExportTable: TableProps<DataType>['columns'] = [
        {
            title: '导出格式',
            dataIndex: 'exportFormat',
            key: 'exportFormat',
            align: 'center',
        },
        {
            title: '导出时间',
            dataIndex: 'exportTime',
            key: 'exportTime',
            align: 'center',
        },
        {
            title: '导出总量',
            dataIndex: 'exportTotal',
            key: 'exportTotal',
            align: 'center',
        },
        {
            title: '导出状态',
            dataIndex: 'exportState',
            key: 'exportState',
            align: 'center',
        },
        {
            title: '导出进度',
            dataIndex: 'exportSchedule',
            key: 'exportSchedule',
            align: 'center',
            render: (text, { exportSchedule }) => {
                return <Progress percent={exportSchedule.percent} size="small" status={exportSchedule.status} />;
            },
        },
        {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            align: 'center',
            render: (text, { exportSchedule }) => {
                return (
                    <button
                        type="button"
                        className="async-export-down-button"
                        disabled={exportSchedule.percent !== 100 || exportSchedule.status === 'exception'}
                        onClick={onDownLoad}
                    >
                        下载
                    </button>
                );
            },
        },
    ];
    const onCancel = () => {
        onClose();
    };

    const disabledDate = (current: Moment) => {
        const [startDate, endDate] = form.getFieldValue('dateTime');
        const tooLate = startDate && current.diff(startDate, 'days') > 30;
        const tooEarly = endDate && endDate.diff(current, 'days') > 30;
        return !!tooEarly || !!tooLate;
    };
    const onExportClick = () => {
        const { exportType } = asyncExportFormInitData;
        const value = form.getFieldsValue();
        onExport({ ...value, exportType });
    };
    useEffect(() => {
        form.setFieldsValue(asyncExportFormInitData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asyncExportFormInitData]);

    const buttonDisabled = useMemo(() => {
        if (!exportList) return false;
        if (exportList.length === 0) return false;
        if (exportList[0]?.exportSchedule.status === 'exception') return false;
        return exportList[0]?.exportSchedule.percent !== 100;
    }, [exportList]);
    return (
        <Modal destroyOnClose title="导出" width={700} visible={visible} footer={null} onCancel={onCancel}>
            <div className="async-export-box">
                <div className="async-export-item">
                    <Form form={form} layout="inline">
                        <div className="export-form-item">
                            <Form.Item name="provinceName" label="归属省份">
                                <Input placeholder="请输入" style={{ width: 200 }} disabled />
                            </Form.Item>
                            <Form.Item name="regionName" label="归属地市">
                                <Input placeholder="请输入" style={{ width: 200 }} disabled />
                            </Form.Item>
                            <Form.Item name="professionalName" label="归属专业">
                                <Input placeholder="请输入" style={{ width: 200 }} disabled />
                            </Form.Item>
                            <Form.Item name="mteamName" label="班组">
                                <Input placeholder="请输入" style={{ width: 200 }} disabled />
                            </Form.Item>
                            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.exportType !== curValues.exportType}>
                                {({ getFieldValue }) => {
                                    return getFieldValue('exportType') === 'duty' ? (
                                        <Form.Item name="dateTime" label="日期">
                                            <DatePicker.RangePicker style={{ width: 200 }} disabledDate={disabledDate} />
                                        </Form.Item>
                                    ) : null;
                                }}
                            </Form.Item>
                        </div>
                    </Form>
                    <p className="async-export-tip">注：最多支持导出31天的排班表</p>
                </div>
                <div className="async-export-button-box">
                    <Button type="primary" onClick={onExportClick} disabled={buttonDisabled || exportBtnLoading}>
                        导出
                    </Button>
                    <Button onClick={onCancel}>取消</Button>
                </div>
                <div className="async-list-title">导出列表</div>
                <Table columns={asyncExportTable} dataSource={exportList} pagination={false} />
            </div>
        </Modal>
    );
};

export default AsyncExportModal;
