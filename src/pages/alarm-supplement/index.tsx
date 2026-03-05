import React, { useRef, useState } from 'react';
import { VirtualTable } from 'oss-web-common';
import { ActionComp, ActionCompType } from '@Src/components/action-comp';
import DateRangeTime from '@Components/date-range-time';
import { Select, Tooltip } from 'oss-ui';
import { useHistory } from 'react-router';
import { supplementApi } from '@Src/common/api/service/supplementApi';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { getInitialProvince, getInitialProvinceOptions } from '@Common/utils/getInitialProvince';
import useLoginInfoModel from '@Src/hox';
import { SupplementListJson } from '@Src/common/interface/interface';
import { FormInstance } from 'oss-ui/es/form';
import { supplementStatusEnum } from './enums';
import AuthButton from '@Components/auth-button';
import moment from 'moment';
import constants from '@Src/common/constants';
import { TablePaginationConfig } from 'oss-ui/lib/table';

export default function AlarmSupplement() {
    const history = useHistory();
    const login = useLoginInfoModel();
    const formRef: { current: FormInstance | null | undefined } = useRef();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 50,
    });
    const actionRef: any = useRef();

    const getColumns = () => {
        const { current, pageSize } = pagination;
        return [
            {
                title: '序号',
                key: 'index',
                dataIndex: 'index',
                hideInSearch: true,
                width: '80px',
                render: (text: undefined, record: any, index: number) => (current! - 1) * pageSize! + index + 1,
            },
            {
                title: '任务名称',
                key: 'taskName',
                dataIndex: 'taskName',
                render: (text: string, record: SupplementListJson) => {
                    const { taskName } = record;
                    return (
                        <Tooltip title={taskName}>
                            <div
                                onClick={() => history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-supplement-detail/${record.taskId}`)}
                                title={taskName}
                                style={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: '#1677ff',
                                }}
                            >
                                {taskName.length > 12 ? taskName.slice(0, 12) + '...' : taskName}
                            </div>
                        </Tooltip>
                    );
                },
            },
            {
                title: '归属省份',
                key: 'provinceId',
                dataIndex: 'provinceId',
                width: '80px',
                initialValue: getInitialProvince(login),
                renderFormItem: () => <Select options={getInitialProvinceOptions(login)} />,
                render(text: string, record: SupplementListJson) {
                    return record.provinceName;
                },
            },
            {
                title: '任务状态',
                key: 'taskStatus',
                dataIndex: 'taskStatus',
                initialValue: -1,
                renderFormItem: () => <Select options={supplementStatusEnum} />,
                render(text: string, record: SupplementListJson) {
                    return record.taskStatusName;
                },
            },
            {
                title: '创建人',
                key: 'creatorName',
                dataIndex: 'creatorName',
                hideInSearch: true,
                width: '80px',
            },
            {
                title: '创建时间',
                key: 'createTime',
                dataIndex: 'createTime',
                width: '160px',
                sorter: (a: SupplementListJson, b: SupplementListJson) => moment(a.createTime).valueOf() - moment(b.createTime).valueOf(),
                renderFormItem: () => <DateRangeTime format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} />,
            },
            {
                title: '修改人',
                key: 'modifierName',
                dataIndex: 'modifierName',
                hideInSearch: true,
            },
            {
                title: '修改时间',
                key: 'modifyTime',
                width: '160px',
                dataIndex: 'modifyTime',
                hideInSearch: true,
                sorter: (a: SupplementListJson, b: SupplementListJson) => moment(a.modifyTime).valueOf() - moment(b.modifyTime).valueOf(),
            },
            {
                title: '任务ID',
                key: 'taskId',
                dataIndex: 'taskId',
                hideInSearch: true,
            },
            {
                title: '操作',
                key: 'actions',
                dataIndex: 'actions',
                hideInSearch: true,
                render: (text: string, record: SupplementListJson) => {
                    const { taskStatus } = record;
                    return [
                        <ActionComp
                            type={ActionCompType.detail}
                            onClick={() => {
                                sendLogFn({ authKey: 'MonitoringScheduling-AlarmCompensation-Detail' });
                                history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-supplement-detail/${record.taskId}`);
                            }}
                        />,
                        <ActionComp
                            authKey="alarmSupplement:edit"
                            disabled={taskStatus !== 0}
                            type={ActionCompType.edit}
                            onClick={() => history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-supplement-add/${record.taskId}`)}
                        />,
                        <ActionComp
                            disabled={taskStatus === 1}
                            title="是否确认删除该任务？"
                            type={ActionCompType.delete}
                            authKey="alarmSupplement:delete"
                            onClick={async (params: any) => {
                                await supplementApi.deleteSupplementTask(record.taskId, params);
                                actionRef.current?.reloadAndRest();
                            }}
                        />,
                    ];
                },
            },
        ];
    };

    const tableRequest = async ({ current, pageSize }) => {
        const values = formRef.current?.getFieldsValue();
        const { createTime, ...rest } = values;
        let beginTime = undefined;
        let endTime = undefined;
        if (createTime && createTime[0]) {
            beginTime = createTime[0].format('YYYY-MM-DD HH:mm');
        }
        if (createTime && createTime[1]) {
            endTime = createTime[1].format('YYYY-MM-DD HH:mm');
        }
        const result = await supplementApi.getSupplementList({
            pageSize,
            pageNum: current,
            beginTime,
            endTime,
            ...rest,
        });
        const { total, rows } = result;
        return { data: rows, total };
    };

    const goAdd = () => {
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-supplement-add`);
    };

    return (
        <VirtualTable
            global={window}
            formRef={formRef}
            columns={getColumns()}
            request={tableRequest}
            actionRef={actionRef}
            search={{
                span: 6,
            }}
            onChange={(pagination: TablePaginationConfig) => setPagination(pagination)}
            toolBarRender={() => [
                <AuthButton authKey="alarmSupplement:add" onClick={goAdd}>
                    + 新建
                </AuthButton>,
            ]}
        />
    );
}
