import React, { useRef } from 'react';
import { AlarmWindowWithProcessor } from '@Components/oss-alarm-window/es';
import Enums from '@Common/enum';
import useLoginInfoModel, { useEnvironmentModel, useAlarmWindowConfigModel } from '@Src/hox';
import { extendContextMenu } from '@Common/alarm-window-extend/extend-context-menus';
import { withResizeDetector } from 'react-resize-detector';
import { withModel } from 'hox';
import { logger } from 'oss-web-toolkits';
import shareActions from '@Src/share/actions';
import { windowTypeEnum } from '../common/enums';
import constants from '@Common/constants';
import { Button } from 'oss-ui';

function WindowCard({
    selectedRows,
    theme,
    height = 0,
    onAlarmDetailStatusChange,
    windowType,
    i,
    getCallBackData,
    windowBar,
    defaultSecondaryFilter,
    defaultSize,
    onTableSelect,
    onCellClick,
    contentWidth,
}) {
    let filterIdList;
    let filterNameList;
    let colDispTemplet;
    let windowId;
    // let statusDispTemplet;
    let registerWindow = [];
    let windowBarType;
    if (windowType === windowTypeEnum.DUTY) {
        filterIdList = selectedRows[0].filterIdList?.split(',').map(Number);
        filterNameList = selectedRows[0].filterNameList?.split(',');
        colDispTemplet = selectedRows[0].colDispTemplet;
        windowId = selectedRows[0].windowId;
        // statusDispTemplet = selectedRows[0].statusDispTemplet || 0;
        windowBarType = windowBar.split(',');
        windowBarType.forEach((item) => {
            registerWindow.push({
                winType: Number(item),
                winName: Enums.registerWindow.getName(item),
            });
        });
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
        // statusDispTemplet = selectedRows[i].statusDispTemplet || 0;
        if (selectedRows[i].windowBarType) {
            windowBarType = windowBar.split(',');
            windowBarType.forEach((item) => {
                registerWindow.push({
                    winType: Number(item),
                    winName: Enums.registerWindow.getName(item),
                });
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
            directSvcId: `znjk/${constants.CUR_ENVIRONMENT}/` + useEnvironmentModel.data.environment.iceUrl.directSvcId.direct.replace(/^\//, ''),
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
    const alarmWindowRef = useRef(null);
    const operatorRealAlarmRequest = (value) => {
        if (value?.res?.responseDataJSON) {
            // console.log(JSON.parse(value.res?.responseDataJSON));
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            getCallBackData && getCallBackData(JSON.parse(value.res?.responseDataJSON));
        }
    };
    // useEffect(() => {
    //     const data = tabItem;
    //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //     tabItem && alarmWindowRef?.current?.statisticsSecondaryFilterRequest({ statisticsFieldName: 'send_status_21', statisticsPath: '/' });
    // }, [tabItem]);
    // const onTreeSelect = (selectedKeys, e) => {

    //     this.ref.current.statisticsSecondaryFilterRequest(data);
    // };
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

    let customProps = {};
    if (windowTypeEnum.DUTY === windowType) {
        customProps = {
            title: selectedRows[0].windowName,
            windowId,
            columnBehaviorRecord: useAlarmWindowConfigModel.data.environment.columnBehaviorRecord,
        };
    } else {
        customProps = {
            title: selectedRows[i].windowName,
            windowId: selectedRows[i].windowId,
        };
    }
    let contextAndToolbar = useAlarmWindowConfigModel.data.environment.contextAndToolbar;
    console.log(contextAndToolbar);
    let newContextAndToolbar = {
        alarmContextMenu: {
            active: [
                {
                    key: 'SheetOperation',
                    name: '工单操作',
                    subMenus: [
                        {
                            key: 'ManualDispatchUnicom',
                            name: '手工派单',
                        },
                    ],
                },
            ],
        },
        alarmToolBar: {
            active: [],
        },
        longAlarmContextMenu: {},
    };
    const columnRender = (winType, column) => {
        if (winType === 'active') {
            let resColumn = column.filter((item) => item.key !== 'status_icon_column');
            resColumn.push({
                title: '操作',
                key: 'customStting',
                width: 160,
                ellipsis: true,
                coustomFilterType: null,
                sorter: false,
                field: 'customStting',
                sortFieldId: 'customStting',
                UnColumnModelUsed: false,
                getDisplayData: (_, record) => {
                    console.log(record);
                    return {
                        dom: (
                            <div className="">
                                <span style={{ color: '#1890ff', cursor: 'pointer' }} type="link">
                                    手工派单
                                </span>{' '}
                                <span style={{ color: '#1890ff', cursor: 'pointer' }} type="link">
                                    告警清除
                                </span>
                            </div>
                        ),
                    };
                },
            });
            return resColumn.map((item) => {
                return {
                    ...item,
                    width: contentWidth ? (contentWidth - 60) / 7 : item.width,
                };
            });
        } else {
            return column;
        }
    };
    return (
        <AlarmWindowWithProcessor
            {...customProps}
            ref={alarmWindowRef}
            defaultSecondaryFilter={defaultSecondaryFilter || null}
            getContainer={useLoginInfoModel.data.container}
            filterIdList={filterIdList}
            filterNameList={filterNameList}
            colDispTemplet={colDispTemplet}
            statusDispTemplet={0}
            registerWindow={registerWindow}
            alarmTitlelist={useAlarmWindowConfigModel.data.environment.alarmTitlelist}
            defaultSize={defaultSize || useAlarmWindowConfigModel.data.environment.defaultSize}
            needFp={false}
            frameInfo={frameInfo}
            height={height}
            onMaXshow={24}
            contextAndToolbar={newContextAndToolbar}
            extendContextMenu={formatExtendContextMenu}
            clickLock={useAlarmWindowConfigModel.data.environment.clickLock}
            autoUnLock={useAlarmWindowConfigModel.data.environment.autoUnLock}
            unLockTime={useAlarmWindowConfigModel.data.environment.clickLock}
            theme={theme}
            shareActions={shareActions}
            doubleClickType={useAlarmWindowConfigModel.data.environment.doubleClickType}
            exportHtmlType={useAlarmWindowConfigModel.data.environment.exportHtmlType}
            processorAction={{
                operatorEventListenerRealAlarm,
            }}
            operatorRealAlarmRequest={operatorRealAlarmRequest}
            removeClearAlarm={useAlarmWindowConfigModel.data.environment.removeClearAlarm}
            experienceUrl={'/unicom/setting/experiences'}
            onTableSelect={onTableSelect}
            onCellClick={onCellClick}
            customFilterHandle={false}
            columnRender={columnRender}
        />
    );
}

const ResizeDetector = withResizeDetector((props) => {
    return <WindowCard {...props} />;
});
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ResizeDetector);
