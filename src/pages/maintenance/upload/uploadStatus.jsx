import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Progress, Modal } from 'oss-ui';
import api from '../api';
import { useEnvironmentModel } from '@Src/hox';
import { useInterval } from 'ahooks';
import { _ } from 'oss-web-toolkits';
import { createFileFlow } from '@Common/utils/download';
import { groupApi } from '../../../common/api/service/groupApi';

const Index = (props) => {
    const { userId, callbackStatus, status } = props;
    const [data, handleData] = useState({});
    const [interval, setInterval] = useState(1000);
    const onDownLoad = (fileSrc) => {
        const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${fileSrc}`;
        const str = fileSrc.replace('/cloud-view-maintainteam/export/', '');
        // return fileSrc && window.open(`${useEnvironmentModel.data.environment.groupUrl.direct}${fileSrc}`);
        return fileSrc && createFileFlow(str, url);
    };

    const showMessage = () => {
        Modal.confirm({
            icon: null,
            content: data.message,
            cancelButtonProps: { style: { display: 'none' } },
        });
    };

    const columns = [
        {
            title: '导入时间',
            dataIndex: 'exportTimeStr',
        },
        {
            title: '导入总条数',
            dataIndex: 'total',
        },
        {
            title: '成功导入条数',
            dataIndex: 'successNum',
        },
        {
            title: '导入进度',
            dataIndex: 'progressShow',
            render: (_, record) => {
                if (record?.status === '500') {
                    return '导入异常！';
                }
                if (typeof record?.progressShow === 'string') {
                    return <Progress percent={record?.progressShow && parseInt(record.progressShow, 10)} />;
                }
            },
        },
        {
            title: '操作',
            dataIndex: '',
            render: (_, record) => {
                return (
                    <Space>
                        {record?.successNum !== record?.total && record?.progressShow === '100%' && (
                            <a
                                onClick={() => {
                                    onDownLoad(record.fileSrc);
                                }}
                            >
                                下载
                            </a>
                        )}
                        {record?.message && <a onClick={showMessage}>提示</a>}
                    </Space>
                );
            },
        },
    ];
    const getStatus = () => {
        api.importProcess({
            operator: userId,
        }).then((res) => {
            handleData(res);
            if (res?.progressShow === '100%' || res === null || res?.progressShow === null || res?.status === '500') {
                callbackStatus(false);
                setInterval(null);
            }
        });
    };
    // 查询导入状态
    useInterval(
        () => {
            getStatus();
        },
        interval,
        { immediate: true },
    );

    useEffect(() => {
        if (status) {
            setTimeout(() => {
                setInterval(1000);
            }, 1000);
        }
    }, [props]);

    const downloadTemplate = async () => {
        const { curSelParmExport, mteamInfo, userId } = props;
        const { columnList } = curSelParmExport;
        const { provinceName, regionName, professionalName, mteamModel, mteamName, dateTime } = mteamInfo;

        const params = {
            provinceName,
            regionName,
            professionName: professionalName,
            ruleType: mteamName,
            mteamModel,
            //startTime,
            endTime: dateTime ? dateTime.format('YYYY-MM-DD') : '',
            startTime: dateTime ? dateTime.format('YYYY-MM-DD') : '',
            operator: userId,
            columnList: _.uniq(columnList.filter((item) => !['machineRoom', 'cityName', 'transSystem', 'networkType'].includes(item))),
        };
        const result = await groupApi.getMaintenanceTemplate(params);
        onDownLoad(result);
    };

    return (
        <div>
            <b>
                导入列表:{' '}
                <Button type="link" onClick={downloadTemplate}>
                    下载模板
                </Button>
            </b>
            <Table dataSource={[data]} columns={columns} pagination={false} />
        </div>
    );
};

export default Index;
