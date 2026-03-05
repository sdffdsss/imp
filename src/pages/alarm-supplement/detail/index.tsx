import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import { CommonTitle } from '@Components/common-title';
import { Button, Col, Form, Icon, Progress, Row, Table, Tooltip } from 'oss-ui';
import { useHistory, useParams } from 'react-router-dom';
import { supplementApi } from '@Src/common/api/service/supplementApi';
import { useLoading } from '@Src/common/utils/useLoading';
import { Loading } from '@Src/components/loading';
import { AlarmSheetDetailJson, SupplementDetailJson } from '@Src/common/interface/interface';
import { VirtualTable } from 'oss-web-common';
import { useEnvironmentModel } from '@Src/hox';
import { download } from '@Src/common/utils/download';
import constants from '@Src/common/constants';
import moment from 'moment';

export default function AlarmSupplementDetail() {
    const history = useHistory();
    const params = useParams();
    const [detail, setDetail] = useState<SupplementDetailJson>({} as SupplementDetailJson);
    const timer: any = useRef(undefined);

    const detailColumns = [
        {
            title: '告警总数',
            key: 'alarmCount',
            dataIndex: 'alarmCount',
        },
        {
            title: '补派成功数',
            key: 'successCount',
            dataIndex: 'successCount',
        },
        {
            title: '派单失败数',
            key: 'failCount',
            dataIndex: 'failCount',
        },
        {
            title: '工单数',
            key: 'alarmSheetCount',
            dataIndex: 'alarmSheetCount',
        },
    ];

    const columns = [
        {
            title: '序号',
            key: 'index',
            dataIndex: 'index',
            render: (text: string, record: AlarmSheetDetailJson, index: number) => index + 1,
        },
        {
            title: '对象类型',
            key: 'objectClass',
            dataIndex: 'objectClass',
        },
        {
            title: '工单标题',
            key: 'alarmTitle',
            dataIndex: 'alarmTitle',
            ellipsis: true,
        },
        {
            title: '告警发生时间',
            key: 'eventTime',
            dataIndex: 'eventTime',
        },
        {
            title: '派单状态',
            key: 'sheetSendStatus',
            dataIndex: 'sheetSendStatus',
        },
        {
            title: '派单时间',
            key: 'forwardTime',
            dataIndex: 'forwardTime',
        },
        {
            title: '工单号',
            key: 'sheetNo',
            dataIndex: 'sheetNo',
        },
        {
            title: '派单失败原因',
            key: 'failedReason',
            dataIndex: 'failedReason',
            ellipsis: true,
        },
        {
            title: '省份',
            key: 'provinceName',
            dataIndex: 'provinceName',
        },
        {
            title: '地市',
            key: 'regionName',
            dataIndex: 'regionName',
        },
        {
            title: '区县',
            key: 'cityName',
            dataIndex: 'cityName',
        },
        {
            title: '专业',
            key: 'professionalTypeName',
            dataIndex: 'professionalTypeName',
        },
        {
            title: '厂家',
            key: 'vendorName',
            dataIndex: 'vendorName',
        },
        {
            title: '清除状态',
            key: 'alarmStatus',
            dataIndex: 'alarmStatus',
        },
        {
            title: '网元名称',
            key: 'eqpLabel',
            dataIndex: 'eqpLabel',
            ellipsis: true,
        },
        {
            title: '告警对象名称',
            key: 'neLabel',
            dataIndex: 'neLabel',
            ellipsis: true,
        },
    ];

    const goBack = () => {
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-supplement`);
    };

    const [getTaskDetail, pageLoading] = useLoading(async () => {
        const result = await supplementApi.getTaskDetail(params?.taskId);
        setDetail(result);
        if (result?.finishPercent !== 100) {
            timer.current = setTimeout(() => {
                getTaskDetail();
            }, 3000);
        }
    });

    useEffect(() => {
        getTaskDetail();
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const tableRequest = async ({ pageSize, current }) => {
        const { rows, total } = await supplementApi.getAlarmSheetDetail({ pageSize, pageNum: current, taskId: params?.taskId });
        return { data: rows, total };
    };

    const renderTitleRight = () => (
        <Button type="primary" onClick={goBack}>
            返回
        </Button>
    );

    const onExport = async () => {
        const url = await supplementApi.exportAlarmSheetDetail({ pageNum: 1, pageSize: 999999, taskId: params?.taskId });
        download(useEnvironmentModel.data.environment.serviceDiscovery + url, `告警补派导出${moment().format('YYYYMMDD')}.xlsx`);
    };

    return (
        <div className="alarm-supplement-detail">
            <CommonTitle title="任务基本信息" renderRight={renderTitleRight} />
            <Row gutter={24}>
                <Col span={6}>
                    <Form.Item label="任务名称">{detail?.taskName}</Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="定时执行">{detail?.cronTime}</Form.Item>
                </Col>
            </Row>
            <CommonTitle title="任务结果" />
            <Form.Item label="任务进展" wrapperCol={{ span: 20 }}>
                <Progress percent={detail?.finishPercent} />
            </Form.Item>
            <Form.Item label="结果统计" wrapperCol={{ span: 8 }}>
                <Table pagination={false} columns={detailColumns} dataSource={[detail]} />
            </Form.Item>
            <p style={{ fontWeight: 'bold' }}>结果详情:</p>
            <Loading loading={pageLoading} />
            <VirtualTable
                global={window}
                columns={columns}
                search={false}
                request={tableRequest}
                pagination={{ defaultPageSize: 50 }}
                toolBarRender={() => [
                    <Tooltip title="导出">
                        <span style={{ cursor: 'pointer' }} onClick={onExport}>
                            <Icon antdIcon type="ExportOutlined" />,
                        </span>
                    </Tooltip>,
                ]}
            />
        </div>
    );
}
