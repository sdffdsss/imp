import React, { useState, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import { useSetState } from 'ahooks';
import useLoginInfoModel from '@Src/hox';
import AlarmQuery from '@Src/pages/search/alarm-query';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { Radio, Select, Button } from 'oss-ui';
import { logNew } from '@Common/api/service/log';
import SwitchIcon from '../img/work/switch.png';
import TroubleListContent from './component/trouble-list-content';
import TroubleStatsContent from './component/trouble-stats-content';
import './style.less';

interface TroubleListProps {
    setShowType: (type: string) => void;
    setSheetInfo: (type: any) => void;
    failMapInfo?: any;
}

type PanelShowType = 'stats' | 'list';
type DispatchPanelType = '1' | '2' | '3' | '4';

const TroubleList = (props: TroubleListProps) => {
    const { systemInfo, userInfo } = useLoginInfoModel();
    const { zones } = JSON.parse(userInfo);

    const [compareType, setCompareType] = useState('1');
    const [refreshTime, setRefreshTime] = useState('');

    const [dispatchPanelType, setDispatchPanelType] = useState<DispatchPanelType>('1');
    const [panelCurShowType, setPanelCurShowType] = useState<PanelShowType>('stats');
    const [state, setState] = useSetState({
        drawerVisible: false,
        condition: {},
    });
    const updateRefreshTimeFnRef = useRef(() => {
        setRefreshTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    });
    const timerRef = useRef<NodeJS.Timer>();

    const troubleDispatchPanelTypesMap = useMemo(() => {
        const options = [
            {
                label: '分级别故障',
                value: '1',
            },
            {
                label: '待手工派单',
                value: '2',
            },
            {
                label: '已上报故障',
                value: '3',
            },
            {
                label: '超时故障',
                value: '4',
            },
        ];
        return options;
    }, []);
    const onDrawerClose = () => {
        setState({ drawerVisible: false, condition: {} });
    };
    const currentZoneId = () => {
        const { failMapInfo } = props;
        if (failMapInfo?.failMapParams?.province) {
            return failMapInfo?.failMapParams?.province;
        }
        if (systemInfo.currentZone?.zoneId) {
            return systemInfo.currentZone?.zoneId;
        }
        if (zones[0] && zones[0].zoneLevel === '3') {
            return zones[0].parentZoneId;
        }
        if (zones[0]) {
            return zones[0].zoneId;
        }
        return undefined;
    };

    useEffect(() => {
        updateRefreshTimeFnRef.current();
        timerRef.current = setInterval(() => {
            updateRefreshTimeFnRef.current();
        }, 1000 * 60 * 3);

        return () => {
            clearInterval(timerRef.current!);
        };
    }, []);

    const onSelectChange = (e) => {
        if (e.target.value === '1') {
            logNew(`调度工作台故障类型`, '300041');
            sendLogFn({ authKey: 'troubleshootingWorkbench:alarmType' });
        } else {
            logNew(`调度工作台专业维度`, '300042');
        }
        setCompareType(e.target.value);
    };

    function handleSwitchClick() {
        if (panelCurShowType === 'stats') {
            clearInterval(timerRef.current!);
        } else {
            updateRefreshTimeFnRef.current();

            timerRef.current = setInterval(() => {
                updateRefreshTimeFnRef.current();
            }, 1000 * 60 * 3);
        }
        sendLogFn({ authKey: 'troubleshootingWorkbench:switchPanel' });
        setPanelCurShowType((prev) => (prev === 'stats' ? 'list' : 'stats'));
        onDrawerClose();
    }
    const onListClick = (item) => {
        const condition = {
            event_time: {
                operator: 'between',
                value: [moment(item.forwardTime).subtract(3, 'day'), moment(item.forwardTime).add(1, 'day')],
            },
            sheet_no: {
                operator: 'eq',
                value: item.sheetNo,
            },
        };
        setState({
            drawerVisible: true,
            condition,
        });
    };

    return (
        <div className="trouble-panel-continer">
            <div className="header">
                <div className="trouble-list-header-left">
                    故障调度看板
                    <Button className="trouble-list-header-left-button" onClick={handleSwitchClick}>
                        <img src={SwitchIcon} alt="" className="trouble-list-header-left-switch" />
                        切换
                    </Button>
                    <span className="refreshTime">{`更新时间：${refreshTime}`}</span>
                </div>
                {panelCurShowType === 'list' && (
                    <div className="header-switch">
                        {dispatchPanelType === '1' && (
                            <Radio.Group
                                value={compareType}
                                buttonStyle="solid"
                                onChange={(value) => {
                                    onDrawerClose();
                                    onSelectChange(value);
                                }}
                            >
                                <Radio.Button className="switch-left" value="1" style={{ width: '90px', textAlign: 'center' }}>
                                    故障类型
                                </Radio.Button>
                                <Radio.Button className="switch-right" value="2" style={{ width: '70px', textAlign: 'center' }}>
                                    专业
                                </Radio.Button>
                            </Radio.Group>
                        )}
                        <Select
                            options={troubleDispatchPanelTypesMap}
                            style={{ width: 208, marginLeft: 20 }}
                            value={dispatchPanelType}
                            onChange={(value) => {
                                setDispatchPanelType(value);
                                onDrawerClose();
                            }}
                        />
                    </div>
                )}
            </div>
            {panelCurShowType === 'list' && (
                <TroubleListContent
                    compareType={compareType}
                    failMapInfo={props.failMapInfo}
                    dispatchPanelType={dispatchPanelType}
                    setShowType={props.setShowType}
                    setSheetInfo={props.setSheetInfo}
                    updateRefreshTimeFn={updateRefreshTimeFnRef.current}
                    curZoneId={currentZoneId()}
                    onListClick={onListClick}
                />
            )}
            {panelCurShowType === 'stats' && <TroubleStatsContent curZoneId={currentZoneId()} />}
            <div className="trouble-panel-drawer" style={{ transform: `translateY(${state.drawerVisible ? '0' : '100%'})` }}>
                <div className="trouble-panel-drawer-close" onClick={onDrawerClose}>
                    关闭
                </div>
                {state.drawerVisible && (
                    <AlarmQuery
                        mode="alarm-window"
                        search={false}
                        condition={state.condition}
                        operId="300044"
                        alarmToolBarActive={['ColumnSettings']}
                    />
                )}
            </div>
        </div>
    );
};
export default TroubleList;
