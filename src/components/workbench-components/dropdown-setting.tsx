import React, { useEffect, useState } from 'react';
import { Button, Icon, Checkbox, Space } from 'oss-ui';
import { getSettingData, routeDataList } from './api';
import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import useLoginInfoModel from '@Src/hox';
import AuthButton from '@Components/auth-button';
import { logNew } from '@Common/api/service/log';
import { getInitialProvince, getInitialProvinceOptions } from '@Common/utils/getInitialProvince';

interface settingType {
    label: string;
    value: string;
    imgUrl: string;
}
const DropDownSetting = ({ onOptionChange, optionValue }) => {
    const login = useLoginInfoModel();
    const [settingData, setSettingData] = useState<settingType[]>([]);
    const [toolsVisible, setToolsVisible] = useState(false);
    const [value, setValue] = useState([]);
    const { userInfo, systemInfo } = login;
    const getSettingList = async () => {
        const { operations = [] } = JSON.parse(userInfo);
        const res = await getSettingData(systemInfo.appId || '110002');
        if (res.data) {
            console.log(getInitialProvinceOptions(login)[0]?.level, '-------')
            const province5Gc = [-1139861561, 1150126687, -662225376, 354339340, -640755821, -1489894494, 1059902420, 1161128211, -988740465];
            const show5Gc = province5Gc.find(item => String(item) === String(getInitialProvince(login)));
            const list = res.data.filter(item => {
                if (item.toolName === '5GC可视化监控' && !['1', '5'].includes(getInitialProvinceOptions(login)[0]?.level) && !show5Gc) {
                    return false;
                }
                return true;
            }).map((item) => {
                const imgUrl = routeDataList.find((items) => items.name === item.toolName);
                return {
                    // id: item.menuId,
                    // name: item.toolName,
                    imgUrl: imgUrl?.image,
                    value: item.menuId,
                    label: item.toolName,
                    type: item.toolType,
                    openUrl: operations.find((items) => items.operId === String(item.menuId))?.path,
                };
            });
            // onOptionChange(optionValue, list);
            setSettingData(list);
        }
    };
    useEffect(() => {
        getSettingList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        optionValue && setValue(optionValue);
        !_isEmpty(optionValue) && !_isEmpty(settingData) && onOptionChange(optionValue, settingData, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionValue, settingData]);
    const handleChange = (values) => {
        setValue(values);
    };
    const openSetting = () => {
        logNew('监控工作台工具', '200001');
        setToolsVisible(true);
    };
    const handleToolsVisible = () => {
        setToolsVisible(false);
        setValue(optionValue);
        onOptionChange(optionValue, settingData, true);
    };
    const handleSaveChange = () => {
        setToolsVisible(false);
        onOptionChange(value, settingData);
    };
    return (
        <div className="drop-down-setting">
            <AuthButton
                className="tools-config-button"
                icon={<Icon antdIcon type="SettingOutlined" style={{ fontSize: 20 }} />}
                authKey="workbenchManage:setting"
                onClick={() => openSetting()}
                logFalse
            >
                管理
            </AuthButton>
            <div className={classNames('tools-dropdown', toolsVisible ? '' : 'hidden')}>
                <div className="tools-dropdown-select">
                    <Checkbox.Group
                        options={settingData}
                        value={value}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                    />
                </div>
                <div className="tools-dropdown-footer">
                    <Space>
                        <Button
                            onClick={() => {
                                handleToolsVisible();
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                handleSaveChange();
                            }}
                        >
                            完成
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    );
};
export default DropDownSetting;
