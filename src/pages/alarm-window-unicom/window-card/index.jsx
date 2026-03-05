import React, { useState, useRef, useEffect } from 'react';
import { AlarmWindowWithProcessor } from '@Components/oss-alarm-window/es';
import Enums from '@Common/enum';
import useLoginInfoModel, { useEnvironmentModel, useAlarmWindowConfigModel, useStatusConfigModel } from '@Src/hox';
import { extendContextMenu } from '@Common/alarm-window-extend/extend-context-menus';
import useAuth from '@Pages/components/auth/hooks/useAuth';
import { sendLogFn } from '@Pages/components/auth/utils';
import { withResizeDetector } from 'react-resize-detector';
import { withModel } from 'hox';
import { logger } from 'oss-web-toolkits';
import constants from '@Common/constants';
import shareActions from '@Src/share/actions';
import { message } from 'oss-ui';
import { windowTypeEnum } from '../common/enums';
import OpticalPowerSearchResultModal from '../optical-power-search/result';
import OpticalPowerSearchList from '../optical-power-search/list';
import { openSearchTask } from '../optical-power-search/api';
import NetworkBetweenModal from '../network-between-modal';
import { getIntraNetWorkViewMappingApi } from '../network-between-modal/api';

function WindowCard({
    selectedRows,
    onDeleteItem,
    onMaxShowItem,
    onMaXshow,
    theme,
    height = 0,
    onTableSelect,
    onAlarmDetailStatusChange,
    windowType,
    i,
    onCellClick,
    operId,
}) {
    let filterIdList;
    let filterNameList;
    let colDispTemplet;
    let windowId;
    let statusDispTemplet;
    let registerWindow = [];
    let windowBarType;
    let gateUrl;
    const statusConfig = useStatusConfigModel();

    const login = useLoginInfoModel();
    const { show: hasAuth } = useAuth({ authKey: 'OpticalPowerSearch:rightMenu' });
    const [detailVisible, setDetailVisible] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [networkBetweenModalVisible, setNetworkBetweenModalVisible] = useState(false);
    const [detailParams, setDetailParams] = useState(null);
    const clickViewData = useRef();

    const [extendToolbar, setExtendToolbar] = useState([
        {
            key: 'OpticalPowerHistory',
            title: '光功率查询历史记录',
            icon: 'iconguanggonglv',
            width: 1400,
            customHandler: () => {
                setHistoryVisible(true);
            },
        },
    ]);

    const rightClickTargetRef = useRef(null);
    const { userInfo, systemInfo } = login;
    const info = userInfo ? JSON.parse(userInfo) : {};
    if (windowType === windowTypeEnum.DUTY) {
        filterIdList = selectedRows.filterIdList?.toString().split(',').map(Number);
        filterNameList = selectedRows.filterNameList?.toString().split(',');
        colDispTemplet = selectedRows.colDispTemplet;
        windowId = selectedRows.windowId;
        statusDispTemplet = selectedRows.statusDispTemplet || 0;
        windowBarType = selectedRows.windowBarType.split(',');
        windowBarType.forEach((item) => {
            registerWindow.push({ winType: Number(item), winName: Enums.registerWindow.getName(item) });
        });
        gateUrl = selectedRows.webSocketUrl;
    } else {
        if (selectedRows[i].filterIdList) {
            filterIdList = selectedRows[i].filterIdList.toString().split(',').map(Number);
        } else {
            filterIdList = Array.isArray(selectedRows[i].filterId) ? selectedRows[i].filterId : [selectedRows[i].filterId];
        }
        if (selectedRows[i].filterNameList) {
            filterNameList = selectedRows[i].filterNameList;
        } else {
            filterNameList = [selectedRows[i].filterName];
        }
        colDispTemplet = selectedRows[i]?.colDispTemplet;
        statusDispTemplet = selectedRows[i].statusDispTemplet || 0;
        gateUrl = selectedRows[i]?.webSocketUrl;
        if (selectedRows[i].windowBarType) {
            windowBarType = selectedRows[i].windowBarType.split(',');
            windowBarType.forEach((item) => {
                registerWindow.push({ winType: Number(item), winName: Enums.registerWindow.getName(item) });
            });
        } else {
            registerWindow = useAlarmWindowConfigModel.data.environment.registerWindow;
        }
    }

    const frameInfo = {
        serviceConfig: {
            isUseIceGrid: useEnvironmentModel.data.environment.iceUrl.isUseIceGrid.direct,
            icegridUrl: useEnvironmentModel.data.environment.iceUrl.icegridUrl.direct,
            icegridBackupUrl: useEnvironmentModel.data.environment.iceUrl.icegridBackupUrl.direct,
            icegridSvcId: `znjk/${constants.CUR_ENVIRONMENT}/` + useEnvironmentModel.data.environment.iceUrl.icegridSvcId.direct.replace(/^\//, ''),
            directSvcId:
                `znjk/${constants.CUR_ENVIRONMENT}/` + (gateUrl || useEnvironmentModel.data.environment.iceUrl.directSvcId.direct).replace(/^\//, ''),
            directServiceUrl: useEnvironmentModel.data.environment.iceUrl.directServiceUrl.direct,
            batchSize: useAlarmWindowConfigModel.data.environment.batchSize,
            clientTimeOutSeconds: 3000,
            refreshInterval: useEnvironmentModel.data.environment.iceUrl.refreshInterval.direct,
        },
        userInfo: {
            userId: useLoginInfoModel.data.userId,
            userName: useLoginInfoModel.data.userName,
            loginId: JSON.parse(useLoginInfoModel.data.userInfo)?.loginId || '',
            operationsButton: JSON.parse(useLoginInfoModel.data.userInfo)?.operationsButton || [],
            buttonAuthorize: useEnvironmentModel.data.environment.buttonAuthorize,
            zoneId: useLoginInfoModel.data?.currentZone?.zoneId,
            zoneName: systemInfo?.currentZone?.zoneId || info?.zones[0]?.zoneName,
            operId,
        },
        otherService: {
            alarmSoundUrl: `${useEnvironmentModel.data.environment.alarmSoundUrl?.direct}/`,
            filterUrl: `${useEnvironmentModel.data.environment.filterUrl?.direct}/`,
            experienceUrl: `${useEnvironmentModel.data.environment.experienceUrl?.direct}/`,
            viewItemUrl: `${useEnvironmentModel.data.environment.viewItemUrl?.direct}/`,
            noticeUrl: `${useEnvironmentModel.data.environment.noticeUrl?.direct}/`,
            viewItemExportUrl: `${useEnvironmentModel.data.environment.viewItemExportUrl?.direct}/`,
            allLifeUrl: `${useEnvironmentModel.data.environment.allLifeUrl?.direct}/`,
            outboundMail: `${useEnvironmentModel.data.environment.outboundMail?.direct}/`,
        },
    };

    const operatorEventListenerRealAlarm = (session, num) => {
        logger.default.info('time:\n', session, num);
    };

    // const contextmenuActionMap = { NewAlarmDetails: () => onAlarmDetailStatusChange('open') };

    // const formatContextMenu = getContextMenu(contextmenuActionMap);

    const formatExtendContextMenu = extendContextMenu.map((item) => {
        const newItem = { ...item };
        if (item.key === 'NewAlarmDetails') {
            newItem.action = () => onAlarmDetailStatusChange('open');
        }
        // if (item.key === 'AlarmSearch') {
        //     console.log(item);
        //     // actions.postMessage(messageTypes.closeTabs, {
        //     //     entry: '/unicom/home-unicom/alarm-window-unicom/duty-window',
        //     // });
        // }
        return newItem;
    });
    const getIntraNetWorkViewMappingData = async () => {
        let id = '';
        if (windowTypeEnum.DUTY === windowType) {
            id = i;
        } else {
            id = selectedRows[i].windowId;
        }

        const res = await getIntraNetWorkViewMappingApi({ windowId: id });
        if (res.code === 200 && res.data) {
            setExtendToolbar([
                ...extendToolbar,
                {
                    key: 'NetworkBetweenReport',
                    title: '网内网间备注上报',
                    icon: 'iconshangbao',
                    width: 1400,
                    customHandler: () => {
                        clickViewData.current = res.data;
                        // clickViewData.current = {
                        //     "windowId": 3183172301,
                        //     "windowName": "核心网重点告警监控_江苏",
                        //     "provinceId": 0,
                        //     "provinceName": "江苏省",
                        //     "professionalId": "1",
                        //     "professionalName": "核心网"
                        // }
                        setNetworkBetweenModalVisible(true);
                    },
                },
            ]);
        }
    };
    useEffect(() => {
        getIntraNetWorkViewMappingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let customProps = {};

    if (windowTypeEnum.DUTY === windowType) {
        customProps = {
            title: selectedRows.windowName,
            windowId,
            columnBehaviorRecord: useAlarmWindowConfigModel.data.environment.columnBehaviorRecord,
        };
    } else {
        customProps = {
            title: selectedRows[i].windowName,
            windowId: selectedRows[i].windowId,
        };
    }
    console.log(extendToolbar);
    return (
        <div style={{ border: '2px solid #ccc', width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', boxShadow: '0 0 5px 5px #ccc' }}>
            <AlarmWindowWithProcessor
                {...customProps}
                getContainer={Document.body}
                filterIdList={filterIdList}
                filterNameList={filterNameList}
                colDispTemplet={colDispTemplet}
                statusDispTemplet={statusDispTemplet}
                registerWindow={registerWindow}
                alarmTitlelist={useAlarmWindowConfigModel.data.environment.alarmTitlelist}
                defaultSize={useAlarmWindowConfigModel.data.environment.defaultSize}
                needFp={useAlarmWindowConfigModel.data.environment.needFp}
                statusConfig={statusConfig.environment.statusConfig}
                frameInfo={frameInfo}
                onDeleteItem={onDeleteItem}
                height={height}
                onMaXshow={onMaXshow}
                onMaxShowItem={onMaxShowItem}
                contextAndToolbar={useAlarmWindowConfigModel.data.environment.contextAndToolbar}
                extendContextMenu={formatExtendContextMenu.concat(
                    hasAuth
                        ? [
                              {
                                  name: '光功率查询',
                                  key: 'OpticalPowerSearch',
                                  type: 'normal',
                                  width: 1000,
                                  pageType: 'jump',
                                  shouldAction: (record, target) => {
                                      rightClickTargetRef.current = target;
                                      return true;
                                  },
                                  action: ({ actionRecords }) => {
                                      console.log('actionRecords', actionRecords);
                                      sendLogFn({ authKey: 'OpticalPowerSearch:rightMenu' });
                                      //   setDetailParams({ taskId: '187d9509-0f92-4967-8edf-a212f569eb29', resourceId: '' });
                                      //   setDetailVisible(true);
                                      openSearchTask(rightClickTargetRef.current?.standard_alarm_id?.value).then((res) => {
                                          if (res.code === 200) {
                                              setDetailParams(res.data);
                                              setDetailVisible(true);
                                          } else {
                                              message.warn(res.message);
                                          }
                                      });
                                  },
                              },
                          ]
                        : [],
                )}
                clickLock={useAlarmWindowConfigModel.data.environment.clickLock}
                autoUnLock={useAlarmWindowConfigModel.data.environment.autoUnLock}
                unLockTime={useAlarmWindowConfigModel.data.environment.clickLock}
                theme={theme}
                shareActions={shareActions}
                doubleClickType={useAlarmWindowConfigModel.data.environment.doubleClickType}
                exportHtmlType={useAlarmWindowConfigModel.data.environment.exportHtmlType}
                processorAction={{ operatorEventListenerRealAlarm }}
                removeClearAlarm={useAlarmWindowConfigModel.data.environment.removeClearAlarm}
                onTableSelect={onTableSelect}
                onCellClick={onCellClick}
                experienceUrl="/unicom/setting/experiences"
                extendToolbar={extendToolbar}
            />
            <OpticalPowerSearchList visible={historyVisible} setVisible={setHistoryVisible} />
            <NetworkBetweenModal visible={networkBetweenModalVisible} setVisible={setNetworkBetweenModalVisible} viewData={clickViewData.current} />
            <OpticalPowerSearchResultModal
                params={detailParams}
                visible={detailVisible}
                onCancel={() => {
                    setDetailParams(null);
                    setDetailVisible(false);
                }}
            />
        </div>
    );
}

const ResizeDetector = withResizeDetector((props) => {
    return <WindowCard {...props} />;
});
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ResizeDetector);
