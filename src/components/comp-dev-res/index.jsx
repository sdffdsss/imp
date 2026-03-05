import React, { useEffect, useState } from 'react';
import { queryAlarmResource } from './api';
import './index.less';

const CompDevRes = (props) => {
    const { record } = props;
    const [dataSource, handleDataSource] = useState({});
    useEffect(() => {
        console.log(props);
        const showProfession = ['8', '26', '25'];
        if (record && Array.isArray(record)) {
            let resourceId = record[0]?.eqp_int_id?.value;
            let provinceName = record[0]?.province_name?.value;
            let professionalType = record[0]?.professional_type?.value;
            if (!showProfession.includes(professionalType)) {
                return handleDataSource({});
            }
            queryAlarmResource({
                resourceId,
                provinceName,
                professionalType,
            }).then((res) => {
                if (res && res.data) {
                    handleDataSource(res.data);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return dataSource.cuid ? (
        <div className="resource-check-container">
            <tr>
                <td>设备ID</td>
                <td>{dataSource.cuid}</td>
            </tr>
            <tr>
                <td>设备名称</td>
                <td>{dataSource.userlabel}</td>
            </tr>
            <tr>
                <td>设备类型</td>
                <td>{dataSource.objTypeName}</td>
                <td>设备厂家</td>
                <td>{dataSource.vendorName}</td>
            </tr>
            <tr>
                <td>所属机房</td>
                <td>{dataSource.roomName}</td>
            </tr>
            <tr>
                <td>所属局站</td>
                <td>{dataSource.siteName}</td>
            </tr>
            <tr>
                <td>所属网络</td>
                <td>{dataSource.gridName}</td>
            </tr>
            <tr>
                <td>专业</td>
                <td>{dataSource.professionalType}</td>
                <td>省份</td>
                <td>{dataSource.provinceName}</td>
            </tr>
            <tr>
                <td>地市</td>
                <td>{dataSource.regionName}</td>
            </tr>
        </div>
    ) : (
        <div>资源信息未找到!</div>
    );
};

export { CompDevRes };
