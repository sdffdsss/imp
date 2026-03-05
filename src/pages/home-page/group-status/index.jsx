import React, { useEffect, useState } from 'react';
import { Table } from 'oss-ui';
import { findResourceStatistics, getFilterDetailByFilterIds, getProvinceData, getProvinceRegions } from '../api';
import Demo from './maps';
import { _ } from 'oss-web-toolkits';

const Index = (props) => {
    const { userInfo, groupData, theme } = props;
    const columns = [
        {
            title: <span className="table-title">网元类型</span>,
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text) => {
                return text;
            },
        },
        {
            title: <span className="table-title">资源数量（个）</span>,
            dataIndex: 'num',
            align: 'center',
            key: 'age',
        },
    ];

    const [mockData, handleMockData] = useState([]);
    const [provinceList, handleProvinceList] = useState([]);
    const [regionList, handleRegionList] = useState([]);

    const getTableData = async () => {
        const { userId } = userInfo;
        let info = {};
        if (userInfo.userInfo) {
            info = JSON.parse(userInfo.userInfo);
        }
        const zones = info.zones[0];
        const res = groupData;
        const newRes = [];
        let idList = [];
        if (!res.data) {
            return;
        }
        if (res && res.data && Array.isArray(res.data)) {
            res.data.map((item) => {
                return (idList = [...idList, ...item.filterIdList?.split(',')]);
            });
        }
        const result = await getFilterDetailByFilterIds(_.union(idList));
        const provinceNameList = await getProvinceData(userId);
        const regionNameList = await getProvinceRegions(zones?.zoneLevel === '3' ? zones?.parentZoneId : zones?.zoneId, userId);
        let newProvinceList = [];
        let newRegionList = [];
        const newList = [];
        const newNameList = [];
        result.data.map((item) => {
            newProvinceList = [...newProvinceList, ...item.provinceIds?.split(',')];
            newRegionList = [...newRegionList, ...item.regionIds?.split(',')];
            return newRes.push({
                professionalTypes: item.professionals || null,
                provinceIds: item.provinceIds || null,
                regionIds: item.regionIds || null,
            });
        });
        provinceNameList.map((itm) => {
            if (newProvinceList.includes(itm.regionId)) {
                newList.push(itm.regionId);
            }
        });
        regionNameList.map((itm) => {
            if (newRegionList.includes(itm.regionId)) {
                newNameList.push(itm.regionName);
            }
        });
        handleProvinceList(_.union(newList));
        handleRegionList(_.union(newNameList));
        findResourceStatistics({
            params: newRes,
            operateUser: userId,
        }).then((res) => {
            if (res && res.rows && Array.isArray(res.rows)) {
                const newList = [];
                res.rows.map((item, idx) => {
                    return newList.push({
                        key: idx,
                        name: item.objTypeName,
                        num: item.count,
                    });
                });
                handleMockData(newList);
            }
        });
    };

    useEffect(() => {
        getTableData();
    }, [groupData]);

    var obj = document.getElementById('oss-ui-table-cell-scrollbar');
    obj?.removeAttribute('class');

    return (
        <div
            className={theme === 'light' ? 'group-status' : 'group-status group-status-drakblue'}
            // style={{ background: theme === "light" ? "white" : "" }}
        >
            <div className="header" style={{ height: '50px' }}>
                班组情况
            </div>
            <div className="status-container">
                <div className="status-map">
                    <Demo userInfo={userInfo} provinceList={provinceList} regionList={regionList} theme={theme} />
                </div>
                <div className={theme === 'light' ? 'status-table' : 'status-table-drakblue'}>
                    <Table
                        columns={columns}
                        dataSource={mockData}
                        pagination={false}
                        scroll={{ y: 230 }}
                        size="middle"
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        bordered={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default Index;
