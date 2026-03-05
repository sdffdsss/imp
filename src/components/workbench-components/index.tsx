import React, { useState, CSSProperties, useEffect } from 'react';
import { Card, Button, Icon, message } from 'oss-ui';
import DropDownSetting from './dropdown-setting';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { getComponetField } from './component';
import actionss from '@Src/share/actions';
import useLoginInfoModel from '@Src/hox';
import _compact from 'lodash/compact';
import { customAlphabet } from 'nanoid';
import { logNew } from '@Common/api/service/log';
import dayjs from 'dayjs';
import { Crypto } from 'oss-web-toolkits';
import constants from '@Common/constants';
import './style.less';
import { _ } from 'oss-web-toolkits';
interface componentType {
    id: string;
    onComponentChange?: (value: string[]) => void;
    componentData?: string[];
    theme: string;
    style?: CSSProperties;
}
const nanoid = customAlphabet('1234567890', 15);
const ComponentCardIndex = ({ id, onComponentChange, componentData, style: propsStyle, onGroupChange }: componentType) => {
    const {
        userInfo,
        systemInfo: { theme },
        userId,
    } = useLoginInfoModel();
    // 配置中取出来的只用于初始化信息，支持组件内部修改
    const [moduleSettingInfo, setModuleSettingInfo] = useState(getComponetField(id));
    const [moduleStyle, setModuleStyle] = useState(propsStyle);
    // const [optionValue, setOptionValue] = useState<string[]>([]);
    const [settingData, setSettingData] = useState([]);
    const [loading, setLoading] = useState('');
    // useEffect(() => {
    //     componentData && setOptionValue(componentData || []);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const onOptionChange = (value, data, flag) => {
        const list = value.map((item) => {
            const fieldData: any = data.find((items) => items.value === item);
            return fieldData;
        });

        setSettingData(_compact(list));
        if (!flag) {
            onComponentChange && onComponentChange(value);
        }
    };

    const openType = (url: any, openId: any, name: any) => {
        const { operations = [], loginId } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
        const timeStamp = dayjs().format('YYYYMMDDHHmmss');
        const sign = Crypto.MD5.hash(`${loginId}imsa&znjk@2023${timeStamp}`);
        if (!fieldFlag) {
            message.warn(`您没有${name}权限，请联系管理员在角色管理中授权`);
            return;
        }
        logNew(`监控工作台${name}`, openId);
        switch (name) {
            case '告警流水中断监测':
                sendLogFn({ authKey: 'workbench-Workbench-AlarmInterruptMonitor-More' });
                break;
            case '监控待办':
                sendLogFn({ authKey: 'workbench-Workbench-MonitorBacklog-More' });
                break;
            case '调度待办':
                sendLogFn({ authKey: 'workbench-Workbench-DispatchBacklog-More' });
                break;
            default:
                break;
        }
        if (name === '智能监控助理') {
            const { entry } = fieldFlag;
            const url = `${entry}?account=${loginId}&timeStamp=${timeStamp}&sign=${sign}`;
            window.open(url);
            return;
        }
        const { actions, messageTypes } = actionss;
        let timer: any = null;
        actions.postMessage(messageTypes.closeTabs, {
            entry: url,
        });
        clearTimeout(timer);
        timer = setTimeout(() => {
            actions &&
                actions.postMessage &&
                actions.postMessage(messageTypes.openRoute, {
                    entry: url,
                });
        }, 1000);
    };

    const extraNode = (type: string | boolean | undefined, url, openId, name) => {
        if (!type) {
            return <></>;
        }
        let SettingNode = (
            <Button className="view-componet-action-button" style={{ paddingRight: 0 }} type="text" onClick={() => openType(url, openId, name)}>
                更多 <Icon type="RightOutlined" antdIcon style={{ verticalAlign: '-2px' }} />
            </Button>
        );
        switch (type) {
            case 'openUrl':
                SettingNode = (
                    <Button
                        className="view-componet-action-button"
                        style={{ paddingRight: 0 }}
                        type="text"
                        onClick={() => openType(url, openId, name)}
                    >
                        更多 <Icon type="RightOutlined" antdIcon style={{ verticalAlign: '-2px' }} />
                    </Button>
                );
                break;
            case 'setting':
                SettingNode = <DropDownSetting optionValue={componentData || []} onOptionChange={onOptionChange} />;
                break;
            default:
                SettingNode = <></>;
                break;
        }
        return SettingNode;
    };
    const loadingClick = _.debounce(() => {
        setLoading(nanoid());
    }, 1000);
    useEffect(() => {
        loadingClick();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
    return (
        <div className={`view-component-home-page ${moduleSettingInfo.key}${moduleSettingInfo.name === '工具' ? ' tools' : ''}`} style={moduleStyle}>
            <Card
                className={moduleSettingInfo.id === '0' ? 'card-extra' : ''}
                title={
                    moduleSettingInfo.config?.showTitle !== false && (
                        <div className="view-component-home-card">
                            {moduleSettingInfo?.title || moduleSettingInfo?.name} &nbsp;{' '}
                            {moduleSettingInfo?.extra?.loading && (
                                <span onClick={loadingClick}>
                                    {' '}
                                    <Icon
                                        style={{ zIndex: 20, position: 'relative', cursor: 'pointer', color: '#cecccc' }}
                                        type="SyncOutlined"
                                        antdIcon
                                    />
                                </span>
                            )}
                        </div>
                    )
                }
                extra={
                    moduleSettingInfo.config?.showTitle !== false &&
                    extraNode(
                        moduleSettingInfo?.extra?.type,
                        moduleSettingInfo?.extra?.openUrl,
                        moduleSettingInfo?.extra?.openId,
                        moduleSettingInfo?.title || moduleSettingInfo?.name,
                    )
                }
                bordered={false}
            >
                <moduleSettingInfo.component
                    optionValues={settingData}
                    theme={theme}
                    loading={loading}
                    // @ts-ignore
                    updateModuleSettingInfo={setModuleSettingInfo}
                    updateModuleStyle={setModuleStyle}
                    onGroupChange={onGroupChange}
                />
            </Card>
        </div>
    );
};
export default ComponentCardIndex;
