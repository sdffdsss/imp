/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Modal, Icon, Tooltip, Form, Radio, message, Table, Button, Progress } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import request from '../../common/api';
import CustomModalFooter from '../custom-modal-footer';
import configUrl from './config/url';
import { useEnvironmentModel } from '@Src/hox';
import useQueryExportList from './useQueryExportList';
import { createFileFlow } from '@Common/utils/download';
import './index.less';

const { baseUrlRest, unicom_export_all } = configUrl;
const AlarmExport = (props) => {
    const [formInstance] = Form.useForm();
    const [showMode, changeShowMode] = useState(false);
    const { dataSource, loading, setReFresh, clear } = useQueryExportList({ userId: props.userId });
    useEffect(() => {
        if (showMode) {
            setReFresh(showMode);
        }
        return () => {
            clear?.();
        };
    }, [setReFresh, showMode]);

    const downloadRender = (text, record) => {
        const { progress, progressNum } = record;
        let btnDisabled = true;
        if (progress === '100%' || progressNum === 100) {
            btnDisabled = false;
        }
        return (
            <Button
                type="text"
                icon={<Icon antdIcon style={{ fontSize: '18px' }} type="DownloadOutlined" />}
                onClick={() => {
                    const { fileSrc } = record;
                    // fileSrc && window.open(`${useEnvironmentModel.data.environment.filter.direct}${fileSrc}`);
                    createFileFlow(fileSrc);
                }}
                disabled={btnDisabled}
            ></Button>
        );
    };
    const progressRender = (text, record) => {
        const { progressNum } = record;
        return <Progress percent={progressNum} steps={5} />;
    };
    // 导出状态：导出状态有3个枚举值：导出完成，正在导出，导出异常
    const statusRender = (text, record) => {
        const { status, progress, progressNum } = record;
        let statusStr = '';
        if (status === '500') {
            statusStr = '导出异常';
        }
        if (status === '200') {
            if (progress === '100%' || progressNum === 100) {
                statusStr = '导出完成';
            } else {
                statusStr = '正在导出';
            }
        }
        return statusStr;
    };
    const columnCls = 'alarm-query-export-alaquery-table-th';
    const columns = [
        {
            title: '导出格式',
            dataIndex: 'type',
            key: 'type',
            className: `${columnCls}`,
        },
        {
            title: '导出时间',
            dataIndex: 'exportTime',
            key: 'exportTime',
            className: `${columnCls}`,
        },
        {
            title: '导出总量(条)',
            dataIndex: 'count',
            key: 'count',
            className: `${columnCls}`,
        },
        {
            title: '导出状态',
            dataIndex: 'status',
            key: 'status',
            className: `${columnCls}`,
            render: (...rest) => statusRender(...rest),
        },
        {
            title: '导出进度',
            dataIndex: 'progress',
            key: 'progress',
            className: `${columnCls}`,
            render: (...rest) => progressRender(...rest),
        },
        {
            title: '下载',
            dataIndex: 'download',
            key: 'download',
            className: `${columnCls}`,
            render: (...rest) => downloadRender(...rest),
        },
    ];

    const onSave = () => {
        const { exportDisable = false, exportDisableMsg = '' } = props;
        if (exportDisable) {
            message.warn(exportDisableMsg);
            return;
        }
        const formData = formInstance.getFieldsValue();
        const { exportFormat, exportLimits } = formData;
        const condCurrent = null;
        const condPageSize = null;
        switch (exportLimits) {
            case 1:
                props.onExport(exportFormat, condPageSize, condCurrent, () => {
                    changeShowMode(false);
                });
                break;
            case 2:
            default:
                const record = dataSource?.[0] ?? {};
                if (dataSource.length !== 0 && record?.status === '200' && record?.progress !== '100%' && record?.progressNum !== 100) {
                    message.warn('有其他任务正在导出，请完成后再执行');
                    return;
                }

                const { sessionId, userId } = props;
                request(useLoginInfoModel.data.platFlag ? 'sysadminAlarm/exportInitByPlatform' : unicom_export_all, {
                    type: 'post',
                    showSuccessMessage: false,
                    showErrorMessage: false,
                    data: {
                        sessionId,
                        userId,
                        exportType: exportFormat,
                    },
                    baseUrlType: baseUrlRest,
                })
                    .then((res) => {
                        const { code, message: txt } = res;
                        switch (code) {
                            case '200':
                            default:
                                message.success(txt);
                                break;
                            case '500':
                                message.warn(txt);
                                break;
                        }
                        setReFresh(true);
                    })
                    .catch(() => {
                        message.warn('服务器繁忙，请稍后再试');
                    });
                break;
        }
    };

    const { login, tooltip = '告警导出', loading: currExpLoading = false, html = true } = props;
    const { container } = login;
    const theme = login?.systemInfo?.theme ?? 'light';
    let iconTheme = '';
    switch (theme) {
        case 'light':
        default:
            iconTheme = 'imp-alarm-export-alaquery-2021-0710-light';
            break;
        case 'darkblue':
            iconTheme = 'imp-alarm-export-alaquery-2021-0710-darkblue';
            break;
        case 'dark':
            iconTheme = 'imp-alarm-export-alaquery-2021-0710-dark';
            break;
    }
    return (
        <main className="alarm-export-btn">
            <Tooltip title={tooltip}>
                <Icon
                    antdIcon
                    className={`imp-alarm-export-alaquery-2021-0710 ${iconTheme}`}
                    type="icondaochu1"
                    onClick={() => {
                        changeShowMode(true);
                    }}
                />
            </Tooltip>
            <Modal
                className="alarm-query-export-alaquery-setting-modal"
                title="导出条件"
                visible={showMode}
                maskClosable={false}
                onCancel={() => changeShowMode(false)}
                getContainer={container || null}
                footer={null}
            >
                <Form
                    form={formInstance}
                    name="basic"
                    labelCol={{ span: 6 }}
                    layout="inline"
                    className="alarm-query-export-alaquery-form"
                    initialValues={{ exportFormat: 0, exportLimits: 1, exportBatches: 1 }}
                >
                    <Form.Item span={15}>
                        <Form.Item label="导出格式" name="exportFormat" initialValues="2">
                            <Radio.Group className="alarm-query-export-radio-group">
                                <Radio value={0}>csv&emsp;&emsp;&emsp;&ensp;&thinsp;</Radio>
                                <Radio value={1}>excel</Radio>
                                {html && <Radio value={2}>html</Radio>}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="导出范围" name="exportLimits" className="alaquery-export-limits-20210713">
                            <Radio.Group className="alarm-query-export-radio-group">
                                <Radio value={1}>{'当前页数据'}</Radio>
                                <Radio value={2}>{'全量数据'}</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item span={9}>
                        <CustomModalFooter
                            okText="导出"
                            okButtonProps={{ loading: loading || currExpLoading }}
                            onCancel={() => {
                                changeShowMode(false);
                            }}
                            onOk={onSave}
                        />
                    </Form.Item>
                </Form>
                <Table
                    className="alarm-query-export-alaquery-table"
                    title={() => (
                        <span className="alarm-query-export-alaquery-table-title">
                            全量导出列表 <span style={{ color: 'rgb(253,0,0)', fontSize: 14 }}>（该统计数包含挂接的子告警数量）</span>
                        </span>
                    )}
                    loading={loading}
                    size="small"
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                ></Table>
            </Modal>
        </main>
    );
};
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(AlarmExport);
