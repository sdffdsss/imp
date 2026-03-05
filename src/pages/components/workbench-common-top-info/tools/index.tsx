import React, { useEffect, useState, useMemo } from 'react';
import { Card } from 'oss-ui';
import SettingChange from '../components/setting-change';
import DndDropdown from '../components/dnd-dropdown';
import { getSettingData, saveSettingData } from '../api';
import { routeDataList } from '../constants';
import './index.less';

const Index = (props) => {
    const { loginInfo } = props;
    const [settingData, setSettingData] = useState<any[]>([]);

    const getSettingList = async () => {
        const { userInfo, systemInfo } = loginInfo;
        const { operations = [], userId } = JSON.parse(userInfo);
        const res = await getSettingData(systemInfo.appId || '110002', userId);
        if (res.data) {
            const list = res.data.map((item: any) => {
                const imgUrl = routeDataList.find((items) => items.name === item.toolName);
                const path = operations.find((items) => items.operId === String(item.menuId))?.path;

                return {
                    ...item,
                    imgUrl: imgUrl?.image,
                    openUrl: path ? '/' + path.split('/')?.slice(4)?.join('/') : '',
                };
            });
            setSettingData(list);
        }
    };

    const dropdownList = useMemo(() => {
        return settingData.map((item) => {
            return {
                value: item.menuId,
                label: item.toolName,
            };
        });
    }, [settingData]);

    function handleDropdownSave(operateData: any[]) {
        saveSettingData({
            userId: loginInfo.userId,
            workStationTools: operateData.map((item) => item.value).join(','),
            appId: loginInfo.systemInfo.appId || '110002',
        });
        setTimeout(() => {
            getSettingList();
        }, 500);
    }

    useEffect(() => {
        getSettingList();
    }, []);

    return (
        <div className="workbench-top-info-tools oss-imp-alart-common-bg">
            <Card
                className="card-extra"
                title={
                    <span className="view-component-home-card">
                        <span>工具</span>
                        <DndDropdown
                            data={dropdownList}
                            overlay={<></>}
                            onSave={handleDropdownSave}
                            placement="bottomRight"
                            className="dnd-dropdown"
                        />
                    </span>
                }
                bordered={false}
            >
                <SettingChange optionValues={settingData} theme={loginInfo.systemInfo.theme} />
            </Card>
        </div>
    );
};

export default Index;
