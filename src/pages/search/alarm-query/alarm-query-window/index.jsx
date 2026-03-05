import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { AlarmWindow } from '@Components/oss-alarm-window/es';
import { getAllAlarmColumns } from '@Src/pages/setting/views/col-template/common/rest';
import { getAlarmDetail, getDbClickDetail, getPretreatmentInfo, getSubAlarm } from '../common/adaper/adapter_dataSource';
import { ProTable } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel, useAlarmWindowConfigModel } from '@Src/hox';
import { extendContextMenu } from '@Common/alarm-window-extend/extend-context-menus';
import AlarmDetailContainer from '@Components/alarm-detail-container';
import { alarmFormatter, getDatasWithSubAlarm, getAlarmContextMenu } from './dataHandler';
import shareActions from '@Src/share/actions';
import constants from '@Common/constants';
import './index.less';
import { _ } from 'oss-toolkits';
import { withModel } from 'hox';
import { getDefaultProfession } from '../api';

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
    const [, setIsDataBlank] = useState(false);

    const alarmWindowContainer = useRef();
    // 告警查询初始化页面的时候不触发查询
    const isInit = useRef(true);
    // 条件变化时触发需要注册的查询
    const needRegister = useRef(true);
    const formParamsBak = useRef({});
    const alarmDetailInfo = useRef(null);
    const dataSourceBak = useRef([]);
    const formRef = useRef(null);
    const platRef = useRef(null);
    const resetRef = useRef(false);
    const alarmConfig = {
        alarmContextMenu: getAlarmContextMenu(
            useAlarmWindowConfigModel.data.environment.contextAndToolbar.alarmContextMenu,
            useEnvironmentModel.data.environment.version,
        ),
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
        login: { systemInfo, userInfo },
    } = props;

    const getColumns = async () => {
        const column = await getAllAlarmColumns();
        // 所有备选列
        setAllCol(column);
        if (props.seacrhFlag) {
        }
    };

    useEffect(() => {
        getColumns();
        setTimeout(() => {
            // 通用查询初次进来查询
            if (props.activeKey === '1') {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                getData();
            }
        }, 3500);
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (props.seacrhFlag) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            // getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.seacrhFlag]);
    useEffect(() => {
        const scrollHeight = alarmWindowContainer?.current?.offsetHeight - 48;
        if (dataSource.length) {
            setScrollY(scrollHeight - 50);
        } else {
            setScrollY(scrollHeight);
        }
        if (dataSource.length === 0) {
            setIsDataBlank(true);
        } else {
            setIsDataBlank(false);
        }
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource, searchCollapse]);

    useEffect(() => {
        setDataSource([]);
        dataSourceBak.current = [];
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
                            textAlign: dataIndex === 'first_column' ? 'left' : 'center',
                            margin: -8,
                            position: 'relative',
                            height: 35,
                            lineHeight: '35px',
                            color: colors[record.org_severity?.value]?.color,
                            padding: '0 8px',
                            paddingLeft: record?.hasSubAlarm?.value === '1' && dataIndex === 'first_column' ? '25px' : '8px',
                        }}
                    >
                        {record?.parentKey?.length && dataIndex === 'first_column' ? (
                            <span
                                style={{
                                    position: 'absolute',
                                    height: '100%',
                                    borderLeft: '1.5px solid #000',
                                    marginLeft: `${record?.parentKey?.length * 15 - 7}px`,
                                    paddingLeft: '11px',
                                }}
                            >
                                {showContent}
                            </span>
                        ) : (
                            <span style={{ paddingLeft: '4px' }}>{showContent}</span>
                        )}
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

    const getSubAlarmBatch = async (datas) => {
        const hasSubRecords = datas.filter((item) => item.hasSubAlarm?.value === '1');
        if (hasSubRecords.length > 0) {
            const promiseList = [];
            _.forEach(hasSubRecords, (item) => {
                promiseList.push(getSubAlarm(item));
            });
            const result = await Promise.all(promiseList);
            return datas.map((item) => {
                const newItem = { ...item };
                if (newItem.hasSubAlarm?.value === '1') {
                    const index = _.findIndex(hasSubRecords, (r) => r?.standard_alarm_id?.value === item?.standard_alarm_id?.value);
                    if (index > -1) {
                        newItem.children = alarmFormatter(result[index]);
                    }
                }
                return newItem;
            });
        }
        return datas;
    };
    const getSearchParams = () => {
        const { search } = window.location;
        const searchParams = new URLSearchParams(search);
        const overSkipType = searchParams.get('overSkipType');
        return {
            overSkipType,
        };
    };
    const isOverviewSkip = () => {
        const { overSkipType } = getSearchParams();

        let params = {};
        if (overSkipType === 'day') {
            params = {
                alarm_title_text: {
                    operator: 'eq',
                    value: '[衍生关联]5G消息平台发生通断类故障,[衍生关联]VoLTE短信网关发生通断类故障,[衍生关联]集约化短信中心发生通断类故障,[衍生关联]视频彩铃平台发生通断类故障',
                },
                event_time: {
                    operator: 'between',
                    value: [moment().startOf('day'), moment().endOf('day')],
                },
            };
        }
        if (overSkipType === 'month') {
            params = {
                alarm_title_text: {
                    operator: 'eq',
                    value: '[衍生关联]5G消息平台发生通断类故障,[衍生关联]VoLTE短信网关发生通断类故障,[衍生关联]集约化短信中心发生通断类故障,[衍生关联]视频彩铃平台发生通断类故障',
                },
                event_time: {
                    operator: 'between',
                    value: [moment().startOf('month'), moment().endOf('month')],
                },
            };
        }
        return params;
    };

    // 不用重写
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const handleFetch = ({ current, pageSize }) => {
        const { overSkipType } = getSearchParams();
        if (pageSize) {
            setPageSize(pageSize);
        }
        // 阻止界面初始化时就调用查询接口
        if (isInit.current && props.alarmQueryMode !== 'alarm-window' && !overSkipType) {
            return;
        }
        const { activeKey = '1', onSubmit = new Promise(), onChange = new Promise() } = props;
        let { formParams = {} } = props;
        if (isInit.current) {
            formParams = isOverviewSkip();
        }
        setLoading(true);
        setDataSource([]);
        dataSourceBak.current = [];
        if (needRegister.current) {
            onSubmit(activeKey, formParams, pageSize)?.then(async (result) => {
                formParamsBak.current = formParams;
                if (result && result.data) {
                    setCurrentPage(current);
                    setTotal(result.total);
                    // const datas = await getSubAlarmBatch(result.data);
                    setDataSource(alarmFormatter(result.data));
                    dataSourceBak.current = alarmFormatter(result.data);
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
            onChange(activeKey, { current, pageSize }).then(async (result) => {
                setCurrentPage(current);
                setTotal(result.total);
                // const datas = await getSubAlarmBatch(result.data);
                setDataSource(alarmFormatter(result.data));
                dataSourceBak.current = alarmFormatter(result.data);
                setLoading(false);
            });
        }
    };
    useEffect(() => {
        const { overSkipType } = getSearchParams();
        if (props.showInTableColumns.length === 0) return;
        if (overSkipType) {
            handleFetch({ current: 1 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.showInTableColumns]);
    useEffect(() => {
        setDataSource([]);
        dataSourceBak.current = [];
        const nextColumns = formatColumns(props.showInTableColumns);
        // 工具栏列设置中已选列
        setColumns(nextColumns);
        props.onHeaderRow(nextColumns);
        if (!isInit.current || props.alarmQueryMode === 'alarm-window') {
            needRegister.current = true;
            setSearchButtonLoading(true);
            handleFetch({ current: 1 });
        }
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allCol, props.showInTableColumns, props.alarmWindowModeCondChange]);
    useEffect(() => {
        const { search } = window.location;
        const searchParams = new URLSearchParams(search);
        const eventTime = searchParams.get('event_time');
        formRef.current?.setFieldsValue({
            event_time: {
                operator: 'between',
                // eslint-disable-next-line no-nested-ternary
                value: eventTime
                    ? [moment(eventTime).startOf('day'), moment(eventTime).add(1, 'day').startOf('day')]
                    : platRef.current
                    ? [null, null]
                    : [moment().subtract(1, 'day').startOf('day'), moment().endOf('day')],
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [platRef.current]);

    // 与流水窗不通用的方法集合，由外部传入
    const extendEventMap = {
        // 工具栏列设置
        ColumnSettings: (value) => {
            const nextValue = value.map((item) => ({ ...item, dataIndex: item.field, title: item.name }));
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
                getDatasWithSubAlarm(dataSourceBak.current),
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
            const result = await getAlarmDetail([].concat(idList), formParamsBak, getDatasWithSubAlarm(dataSourceBak.current));
            return alarmFormatter(result);
        })();
    };
    const info = JSON.parse(userInfo) || {};
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
            operationsButton: JSON.parse(useLoginInfoModel.data.userInfo)?.operationsButton || [],
            buttonAuthorize: useEnvironmentModel.data.environment.buttonAuthorize,
            operId: props.operId,
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
            alarmFilterUrl: `${useEnvironmentModel.data.environment.alarmFilterUrl?.direct}/`,
        },
    };

    const onCollapse = (collapsed) => {
        setSearchCollapse(collapsed);
    };

    const onExpandLoading = async (record) => {
        console.log(record);
        if (!record.children || !_.find(record.children, (item) => !!item.key)) {
            setLoading(true);
            const result = await getSubAlarm(record);
            setLoading(false);
            if (result) {
                const newDataSource = _.cloneDeep(dataSourceBak.current);
                const allItem = [];
                const getItems = (data) => {
                    data?.forEach((item) => {
                        allItem.push(item);
                        if (Array.isArray(item.children)) {
                            getItems(item.children);
                        }
                    });
                };
                getItems(newDataSource);
                const currentRow = _.find(allItem, (item) => item.key === record.key);
                if (currentRow) {
                    currentRow.children = alarmFormatter(result.map((item) => ({ ...item, parentKey: currentRow.parentKey.concat(currentRow.key) })));
                    setDataSource(newDataSource);
                    dataSourceBak.current = newDataSource;
                }
            }
        }
    };
    const getData = () => {
        setDataSource([]);
        dataSourceBak.current = [];
        isInit.current = false;
        needRegister.current = true;
        setSearchButtonLoading(true);
        handleFetch({ current: 1 });
    };

    const resetValue = () => {
        const noDefaultList = ['cancel_time', 'last_event_time_str', 'intending_send_time', 'professional_type'];
        const obj = formRef.current?.getFieldsValue();
        if (obj) {
            Object.keys(obj)?.forEach((key) => {
                if (noDefaultList.includes(key)) {
                    console.log(key);
                } else {
                    if (obj[key]?.value) {
                        formRef.current?.setFieldsValue({
                            [key]: {
                                ...obj[key],
                                value: null,
                            },
                        });
                    }
                }
            });
        }
    };

    const onValuesChange = (changedValues) => {
        if (resetRef.current) {
            return;
        }
        if (Object.keys(changedValues).includes('professional_type')) {
            if (changedValues.professional_type.value?.length === 1 && changedValues.professional_type.value?.[0] === 85) {
                // 平台专业
                useLoginInfoModel.data.setPlatFlag(true);
                platRef.current = true;
                resetValue();
            } else {
                useLoginInfoModel.data.setPlatFlag(false);
                if (platRef.current) {
                    resetValue();
                }
                platRef.current = false;
            }
        }
    };
    const handleReset = async () => {
        resetRef.current = true;
        const res = await getDefaultProfession({ userId: useLoginInfoModel.data.userId });
        const curProfessional = res.data[0].professional_type?.split(',').map((e) => +e);
        formRef.current?.setFieldsValue({
            professional_type: {
                operator: 'in',
                value: curProfessional,
            },
        });
        setTimeout(() => {
            resetRef.current = false;
        }, 1000);
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
                    search={props.showSearchPanel ? { ...props.showSearchPanel, onCollapse, collapsed: searchCollapse } : false}
                    loading={searchButtonLoading}
                    className={`${!loading && 'oss-imp-alarm-protable-empty-show'}`}
                    columns={props.searchColumns}
                    onSubmit={() => {
                        // onCollapse(true);
                        getData();
                    }}
                    form={{
                        onValuesChange,
                    }}
                    formRef={formRef}
                    onReset={handleReset}
                    pagination={false}
                    tableRender={() => (
                        <div ref={alarmWindowContainer} className={`search-alarm-window-container `}>
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
                                    showTotal: () => (
                                        <span>
                                            <span style={{ color: 'rgb(253,0,0)' }}>（该统计数不包含挂接的子告警数量）</span> 共 {total} 条
                                        </span>
                                    ),
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
                                onExpandLoading={onExpandLoading}
                                getSubAlarmBatch={getSubAlarmBatch}
                                // expandedRowKeys={[]}
                            />
                        </div>
                    )}
                />
            </AlarmDetailContainer>
            {/* {isDataBlank && <div className="alarm-query-data-blank">没有满足条件的数据</div>} */}
        </div>
    );
};

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
