import React from 'react';
import { Table, Button, Progress } from 'oss-ui';
import { useEnvironmentModel } from '@Src/hox';
import { createFileFlow } from '@Common/utils/download';
import { _ } from 'oss-web-toolkits';

const Index = (props) => {
    const { userId } = props;
    const onDownLoad = (fileSrc) => {
        const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${fileSrc}`;
        const str = fileSrc.replace('/cloud-view-maintainteam/export/', '');
        // return fileSrc && window.open(`${useEnvironmentModel.data.environment.groupUrl.direct}${fileSrc}`);
        return fileSrc && createFileFlow(str, url);
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
    ];

    const downloadTemplate = async () => {
        const { curSelParmExport, mteamInfo } = props;
        const { columnList } = curSelParmExport;
        const { provinceName, regionName, professionalName, mteamModel, mteamName, dateTime } = mteamInfo;

        const params = {
            provinceName,
            regionName,
            professionName: professionalName,
            ruleType: mteamName,
            mteamModel,
            endTime: dateTime ? dateTime.format('YYYY-MM-DD') : '',
            startTime: dateTime ? dateTime.format('YYYY-MM-DD') : '',
            operator: userId,
            columnList: _.uniq(columnList.filter((item) => !['machineRoom', 'cityName', 'transSystem', 'networkType'].includes(item))),
        };
        // const result = await groupApi.getMaintenanceTemplate(params);
        // onDownLoad(result);
    };

    return (
        <div>
            <b>
                导入列表:{' '}
                <Button type="link" onClick={downloadTemplate}>
                    下载模板
                </Button>
            </b>
            <Table columns={columns} pagination={false} />
        </div>
    );
};

export default Index;
