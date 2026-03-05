import React, { useState, useRef, useEffect } from 'react';
import { AlarmWindow } from '@Components/oss-alarm-window/es';
import { getAllAlarmColumns } from '@Src/pages/setting/views/col-template/common/rest';
import { getAlarmDetail, getDbClickDetail, getPretreatmentInfo, getSubAlarm } from '../common/api';
import { ProTable } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel, useAlarmWindowConfigModel } from '@Src/hox';
import { extendContextMenu } from '@Common/alarm-window-extend/extend-context-menus';
import AlarmDetailContainer from '@Components/alarm-detail-container';
import { alarmFormatter } from './dataHandler';
import shareActions from '@Src/share/actions';
import constants from '@Common/constants';
import './index.less';
import { _ } from 'oss-toolkits';
import { withModel } from 'hox';

const Index = (props) => {
    const { needFp } = useAlarmWindowConfigModel.data.environment;
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([]);
    const [allCol, setAllCol] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchButtonLoading, setSearchButtonLoading] = useState(false);
    const [pageSize, setPageSize] = useState(50);
    const [scrollY, setScrollY] = useState(0);
    const [searchCollapse, setSearchCollapse] = useState(true);

    const [drawerStatus, setDrawerStatus] = useState('close');
    const [drawerData, setDrawerData] = useState({});

    const alarmWindowContainer = useRef();
    // 告警查询初始化页面的时候不触发查询
    const isInit = useRef(true);
    // 条件变化时触发需要注册的查询
    const needRegister = useRef(true);
    const formParamsBak = useRef({});
    const alarmDetailInfo = useRef(null);
    const alarmConfig = {
        alarmContextMenu: useAlarmWindowConfigModel.data.environment.contextAndToolbar.alarmContextMenu,
        alarmToolBar: {
            active: props?.alarmToolBarActive ?? ['AlarmExport', 'ColumnSettings', 'tableSize'],
        },
    };

    const onTableSelect = (selectRowKeys, registerInfo, clickType) => {
        alarmDetailInfo.current = { selectRowKeys, registerInfo, clickType };
        if (clickType === 'click' && ['open', 'unfold', 'fixed', 'free'].includes(drawerStatus)) {
            setDrawerData({ sessionId: registerInfo?.clientSessionId, selectRowKey: selectRowKeys[0] });
        }
    };

    const onAlarmDetailStatusChange = (status) => {
        const { selectRowKeys, registerInfo } = alarmDetailInfo.current;
        if (!status || status === 'open') {
            if (drawerStatus === 'fixed') {
                setDrawerStatus('fixed');
            } else {
                setDrawerStatus('open');
            }
            setDrawerData({ sessionId: registerInfo?.clientSessionId, selectRowKey: selectRowKeys[0] });
        } else if (status === 'close') {
            setDrawerStatus(status);
            setDrawerData({});
        } else if (status === 'fixed') {
            setDrawerStatus(status);
            // 抽屉与原有布局分占页面
        } else if (status === 'free') {
            setDrawerStatus(status);
            // 抽屉正常蒙层方式展示
        } else {
            setDrawerStatus(status);
        }
    };

    const formatExtendContextMenu = extendContextMenu.map((item) => {
        const newItem = { ...item };
        if (item.key === 'NewAlarmDetails') {
            newItem.action = () => onAlarmDetailStatusChange('open');
        }
        return newItem;
    });

    const {
        login: { systemInfo },
    } = props;

    const getColumns = async () => {
        const column = await getAllAlarmColumns();
        // 所有备选列
        setAllCol(column);
    };

    useEffect(() => {
        getColumns();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const scrollHeight = alarmWindowContainer?.current?.offsetHeight - 48;
        if (dataSource.length) {
            setScrollY(scrollHeight - 50);
        } else {
            setScrollY(scrollHeight);
        }
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource, searchCollapse]);

    useEffect(() => {
        setDataSource([]);
        return () => {};
    }, [props.activeKey]);

    // format方法和流水窗处保持一致
    const formatColumns = (datas) => {
        if (!allCol || !allCol.length || !datas || !datas.length) {
            return [];
        }

        const renderSeverity = (text, record, dataIndex) => {
            const needColor = ['org_severity', 'fp0', 'first_column'];
            const colors = {
                1: { backgroundColor: '#eb3223', color: '#fff' },
                2: { backgroundColor: '#f1a83c', color: '#fff' },
                3: { backgroundColor: '#fffd56', color: '#000' },
                4: { backgroundColor: '#54b3ff', color: '#fff' },
            };
            const showContent = (() => {
                if (dataIndex === 'first_column') {
                    return needFp ? record.fp0?.lable || record.fp0?.value : '';
                }
                return record[dataIndex]?.lable || record[dataIndex]?.value || '';
            })();

            let msg = text?.lable || text?.value;
            if (needColor.includes(dataIndex)) {
                msg = (
                    <div
                        style={{
                            backgroundColor: colors[record.org_severity?.value]?.backgroundColor,
                            textAlign: 'center',
                            margin: -8,
                            position: 'relative',
                            height: 35,
                            lineHeight: '35px',
                            color: colors[record.org_severity?.value]?.color,
                            padding: '0 8px',
                        }}
                    >
                        {showContent}
                    </div>
                );
            }
            return msg;
        };

        let nextDatas = datas.filter((item) => _.find(allCol, (col) => col.field === item.dataIndex));
        nextDatas = nextDatas.map((item) => {
            const columnItem = _.find(allCol, (col) => col.field === item.dataIndex);
            return {
                title: item.alias || item.title,
                dataIndex: item.dataIndex,
                width: item.width || 120,
                ellipsis: true,
                sorter: false,
                field: item.dataIndex,
                valueType: columnItem.id,
                sortFieldId: columnItem.id,
                id: columnItem.id,
                UnColumnModelUsed: false,
                render: (text, record) => renderSeverity(text, record, item.dataIndex),
            };
        });
        nextDatas.unshift({
            title: '',
            dataIndex: 'first_column',
            width: 50,
            ellipsis: true,
            sorter: false,
            field: 'first_column',
            valueType: 71,
            sortFieldId: 71,
            id: 71,
            UnColumnModelUsed: true,
            render: (text, record) => renderSeverity(text, record, 'first_column'),
        });
        return nextDatas;
    };

    // 不用重写
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const handleFetch = ({ current, pageSize }) => {
        if (pageSize) {
            setPageSize(pageSize);
        }
        // 阻止界面初始化时就调用查询接口
        if (isInit.current && props.alarmQueryMode !== 'alarm-window') {
            return;
        }
        const { activeKey = '1', searchRef, onSubmit = new Promise(), onChange = new Promise() } = props;
        setLoading(true);
        if (needRegister.current) {
            onSubmit(activeKey, pageSize)?.then((result) => {
                formParamsBak.current = searchRef.current.getFieldsValue();
                if (result && result.data) {
                    setCurrentPage(current);
                    setTotal(result.total);
                    setDataSource(alarmFormatter(result.data));
                } else {
                    setCurrentPage(1);
                    setTotal(0);
                    setDataSource([]);
                }
                setLoading(false);
                setSearchButtonLoading(false);
                needRegister.current = false;
            });
        } else {
            onChange(activeKey, { current, pageSize }).then((result) => {
                if (result) {
                    setCurrentPage(current);
                    setTotal(result.total);
                    setDataSource(alarmFormatter(result.data));
                    setLoading(false);
                }
            });
        }
    };

    useEffect(() => {
        setDataSource([]);
        const nextColumns = formatColumns(props.showInTableColumns);
        // 工具栏列设置中已选列
        setColumns(nextColumns);
        // props.onHeaderRow(nextColumns);
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allCol, props.showInTableColumns, props.alarmWindowModeCondChange]);

    // 与流水窗不通用的方法集合，由外部传入
    const extendEventMap = {
        // 工具栏列设置
        ColumnSettings: (value) => {
            const nextValue = value.map((item) => ({ ...item, dataIndex: item.field, title: item.name, filters: true, onFilter: true }));
            setColumns(formatColumns(nextValue));
            props.onHeaderRow(formatColumns(nextValue));
            needRegister.current = true;
            isInit.current = false;
            setSearchButtonLoading(true);
            handleFetch({ current: 1 });
        },
        // 工具栏导出接口调用
        AlarmExport: (value) => {
            // 右键导出的返回值为对象,工具栏导出的返回值为数值
            const { activeKey = '1', alarmExport } = props;
            if (_.isObject(value)) {
                const alarmList = value.actionRecords;
                alarmExport({ activeKey, currentPage, pageSize, type: value?.data?.operateProps?.exportFileFormat, alarmList });
            } else {
                alarmExport({ activeKey, currentPage, pageSize, total, type: value });
            }
        },
        // 右键时获取告警详情事件，records：已选告警
        getRecordsDetail: async (records, callback) => {
            // 调用右键接口
            const result = await getAlarmDetail(
                [].concat(records).map((item) => item.key),
                formParamsBak,
                dataSource,
            );
            callback(alarmFormatter(result));
        },
        // 告警查询双击详情查询
        onTableDoubleClick: async (records, callback) => {
            const result = await getDbClickDetail([].concat(records), formParamsBak);
            callback(result);
        },

        // 双击告警详情里获取预处理信息接口
        getPretreatment: async (records, callback) => {
            const result = await getPretreatmentInfo([].concat(records));
            callback(result);
        },
    };

    const getAlarmDetailByIds = () => {
        const idList = drawerData?.selectRowKey || [];
        return (async () => {
            const result = await getAlarmDetail([].concat(idList), formParamsBak, dataSource);
            return alarmFormatter(result);
        })();
    };

    const frameInfoForAlarmWindow = {
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
            zoneId: useLoginInfoModel.data?.currentZone?.zoneId,
            operationsButton: JSON.parse(useLoginInfoModel.data.userInfo)?.operationsButton || [],
            buttonAuthorize: useEnvironmentModel.data.environment.buttonAuthorize,
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
            alarmFilterUrl: `${useEnvironmentModel.data.environment.alarmFilterUrl?.direct}/`,
        },
    };

    const onCollapse = (collapsed) => {
        setSearchCollapse(collapsed);
    };

    const onExpandLoading = async (record) => {
        setLoading(true);
        const result = await getSubAlarm(record);
        setLoading(false);
        if (result) {
            const newDataSource = _.cloneDeep(dataSource);
            const currentRow = _.find(newDataSource, (item) => item.key === record.key);
            if (currentRow) {
                currentRow.children = alarmFormatter(result);
                setDataSource(newDataSource);
            }
        }
    };

    return (
        <div className="alarm-search-window">
            <AlarmDetailContainer
                detailStatus={drawerStatus}
                drawerData={drawerData}
                onAlarmDetailStatusChange={onAlarmDetailStatusChange}
                getAlarmDetail={getAlarmDetailByIds}
            >
                <ProTable
                    // search={props.showSearchPanel ? { ...props.showSearchPanel, onCollapse } : false}
                    formRef={props.searchRef}
                    loading={searchButtonLoading}
                    columns={props.searchColumns}
                    onSubmit={() => {
                        setDataSource([]);
                        isInit.current = false;
                        needRegister.current = true;
                        setSearchButtonLoading(true);
                        handleFetch({ current: 1 });
                    }}
                    search={{
                        onCollapse,
                        span: 6,
                        labelWidth: 100,
                    }}
                    tableRender={() => (
                        <div ref={alarmWindowContainer} className="search-alarm-window-container">
                            <AlarmWindow
                                loading={loading}
                                statisticsItems={[]}
                                columns={columns}
                                allCol={allCol}
                                winType={'active'}
                                toolBarStatus={{}}
                                pagination={{
                                    current: currentPage,
                                    position: 'bottom',
                                    defaultCurrent: 1,
                                    pageSize,
                                    size: 'small',
                                    total,
                                    showTotal: () => `共 ${total} 条`,
                                }}
                                total={total}
                                dataSource={dataSource}
                                onFetch={handleFetch}
                                scrollY={scrollY}
                                contextAndToolbar={alarmConfig}
                                extendEventMap={extendEventMap}
                                extendContextMenu={formatExtendContextMenu}
                                toolBarRender={props.toolBarRender}
                                frameInfo={frameInfoForAlarmWindow}
                                theme={systemInfo?.theme}
                                defaultSize={'small'}
                                shareActions={shareActions}
                                doubleClickType={useAlarmWindowConfigModel.data.environment.doubleClickType}
                                exportHtmlType={useAlarmWindowConfigModel.data.environment.exportHtmlType}
                                onTableSelect={onTableSelect}
                                onAlarmDetailStatusChange={onAlarmDetailStatusChange}
                                onExpandLoading={useEnvironmentModel.data.environment.version === 'unicom' ? onExpandLoading : null}
                                expandedRowKeys={[]}
                                experienceUrl={'/unicom/setting/experiences'}
                            />
                        </div>
                    )}
                ></ProTable>
            </AlarmDetailContainer>
        </div>
    );
};

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
