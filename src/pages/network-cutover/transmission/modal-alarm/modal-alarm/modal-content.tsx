import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal, message, Tooltip, Button, Icon, Form, Input, DatePicker, ProTable, Radio, Select, Row, Space, Col, Table } from 'oss-ui';
import type { IModalContentProps } from './types';
import useLoginInfoModel from '@Src/hox';
import { usePersistFn } from 'ahooks';
import { recordNewPage } from '../../../api';
import moment from 'moment';

export default forwardRef((props: IModalContentProps, ref) => {
    const { selectView, planDetail } = props;
    const [columns, setColumns] = useState([]);
    const formRef = useRef();
    const paginationRef = useRef({ current: 1, pageSize: 10 });

    const { userId, currentZone } = useLoginInfoModel();

    const getList = usePersistFn(async (params) => {
        if (params?.current) {
            paginationRef.current = {
                pageSize: params.pageSize,
                current: params.current,
            };
        }

        const fieldsValue = formRef.current?.getFieldsValue();
        const endTime = fieldsValue.endTime ? moment(fieldsValue.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        const startTime = fieldsValue.startTime ? moment(fieldsValue.startTime).format('YYYY-MM-DD HH:mm:ss') : '';

        const allParams = {
            alarmOrigin: 0,
            alarmsenceId: 0,
            asc: false,
            fieldConditions: {
                conditionList: [
                    {
                        fieldId: 398,
                        not: false,
                        type: 'in',
                        value: '',
                        values: planDetail.transSegmentIds?.split(',') || [],
                    },
                ],
                logicalAnd: true,
                not: true,
            },
            mConditionMaps: {},
            fieldIds: selectView.alarmFieldList.map((item) => item.fieldId),
            logicalAnd: true,
            sessionId: Date.now(),
            sortFieldId: -1,
            userId,
            dateBean: {
                endTime,
                fieldId: 62,
                not: false,
                startTime,
                type: 'type',
            },
            loginProvinceId: currentZone?.zoneId,
            pageSize: paginationRef.current.pageSize,
            startIndex: paginationRef.current.current,
        };
        const res = await recordNewPage({ ...allParams });

        return {
            data:
                res.data?.map((item) => {
                    return Object.values(item).reduce((accu, itemIn) => {
                        return {
                            ...accu,
                            [itemIn.field]: itemIn?.lable || itemIn?.value,
                        };
                    }, {});
                }) || [],
            success: true,
            total: res.total || 0,
        };
    });

    useEffect(() => {
        const tableColumns = selectView.alarmFieldList.map((item) => {
            return {
                dataIndex: item.fieldName,
                title: item.displayName,
                align: 'center',
                hideInSearch: true,
                width: Math.floor(900 / selectView.alarmFieldList.length),
                ellipsis: true,
            };
        });

        const searchColumns = [
            {
                dataIndex: 'startTime',
                title: '割接开始时间',
                align: 'center',
                hideInTable: true,
                initialValue: planDetail.planStartTime ? moment(planDetail.planStartTime) : null,
                renderFormItem: () => {
                    return <DatePicker showTime />;
                },
            },
            {
                dataIndex: 'endTime',
                title: '割接结束时间',
                align: 'center',
                hideInTable: true,
                initialValue: planDetail.planEndTime ? moment(planDetail.planEndTime) : null,
                renderFormItem: () => {
                    return <DatePicker showTime />;
                },
            },
        ];

        setColumns([...tableColumns, ...searchColumns]);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            getList();
        }, 1000 * 60 * 5);

        return () => {
            clearInterval(timer);
        };
    }, []);

    if (columns.length === 0) {
        return;
    }
    // UI部分是form，可以是任何内容 目前业务大部分modal中是form
    return (
        <ProTable
            formRef={formRef}
            columns={columns}
            options={{ reload: true, density: false, setting: false }}
            pagination={{ defaultPageSize: 10, showSizeChanger: false }}
            request={getList}
        />
    );
});
