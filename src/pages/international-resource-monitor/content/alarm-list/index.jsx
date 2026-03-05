import React, { PureComponent, createRef } from 'react';
import { Tooltip, message, Modal, Space, Spin, Icon, ProTable } from 'oss-ui';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import cls from 'classnames';
import useLoginInfoModel from '@Src/hox';
import { createFileFlow } from '@Common/utils/download';
import constants from '@Common/constants';
import { sendLogFn } from '@Pages/components/auth/utils';
import { circuitRowKey, alarmRowKey, actionsKey, circuitId, alarmId } from './constants';
import { newAddId } from '../description-list/constants';
import {
    getAlarmDataSourceApi,
    deleteAlarmItemApi,
    getFieldsListApi,
    updateUserConfigColumnApi,
    getEditAlarmDataSourceApi,
    exportAlarmApi,
    getHistoryAlarm,
    saveFilterConditionApi,
    queryVoiceAlarmApi,
} from '../../services/api';
import Icon14 from './img/icon-14.png';
import Icon15 from './img/icon-15.png';
import Icon16 from './img/icon-16.png';
import Icon16Open from './img/icon-16-open.png';
import Icon17 from './img/icon-17.png';
import IconExpand from './img/expand.png';
import IconRetract from './img/retract.png';
import IconBatchDelete from './img/batch-delete.png';
import IconTopFilter from './img/icon-top-filter.png';
import IconMuted from './img/icon-muted.png';
import IconNotMuted from './img/icon-not-muted.png';
import Title from '../components/title';
import AlarmStats from './alarm-stats';
import { TabButtonEnum, TabButtonHistoryEnum } from '../../type';
import FilterModal from './filter-modal';
import { transformFilterModalFields } from './utils';
import SubList from './sub-list';
import { ReactComponent as DeleteSvg } from './img/delete.svg';
import TableHeader from '../components/table-header';
import EditTableItem from '../components/edit-table-item';

import ColumnSetting from '../components/column-setting';

import './index.less';

class Index extends PureComponent {
    tableRef = createRef();
    containerRef = createRef();
    tableBodyRef = createRef();
    audioRef = createRef();

    tablePagination = {
        current: 1,
        total: 0,
        pageSize: 20,
    };

    timer = null;
    sessionIdCache;
    alarmColumnsUserConfigCache = [];

    // 数据返回后是否再查找发声接口
    shouldQueryNewAlarmAPI = false;

    // 数据刷新后是否执行展开/收起动作
    needExtractOrExpand = true;

    constructor(props) {
        super(props);

        this.historyFlag = this.props.mode.startsWith(TabButtonEnum.HISTORY);

        this.state = {
            containerHeight: 0,
            dataSource: [],
            lockFlag: this.historyFlag,
            expandAllFlag: false,
            loading: false,
            filterModalVisible: false,
            expandedRowKeys: [],
            circuitConfigs: [], // 父亲表格表头列设置数据
            childrenColumns: [], // 子表格表头
            alarmStatsData: {},
            currentClickRow: {}, // 当前点中行
            tableLoading: true,
            bothSidesIsInteractingFlag: false, // 两侧数据正在进行交互
            voiceFlag: false,
            defaultColumnsMap: null,
            allColumnsState: {}, // 记录所有列设置数据
        };

        this.rowSelection = {
            type: 'checkbox',
            columnWidth: '32px',
            alwaysShowAlert: false,
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
            getCheckboxProps: (record) => {
                const count = record.alarmInfo.filter((item) => item.checked).length;
                // 如果有选中但未全选indeterminate为true
                return {
                    indeterminate: count > 0 && count < record.alarmInfo.length,
                };
            },
        };

        this.requestDataSource = _.debounce(this.requestDataSource, 500);
    }

    componentDidMount() {
        this.initTableRectHeight();

        this.bindTableScrollEvent();

        // 初始获取列设置和表头
        this.getFieldsList();

        if (this.state.lockFlag) {
            this.resetTablePagination(true);
        } else {
            this.startTimer();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.lockFlag !== this.state.lockFlag) {
            this.handleLockChange();
        }

        if (prevProps.selectedFaultDesc !== this.props.selectedFaultDesc) {
            this.handleRowClick({});

            if (this.props.selectedFaultDesc) {
                this.switchLockFlag(true);
                this.resetTablePagination(true);
            } else {
                this.switchLockFlag(false);
            }
        }
        if (prevProps.clickRelateIconFlag !== this.props.clickRelateIconFlag) {
            this.handleClickRelateIconFlagChange();
        }
        // 告诉父级选中的元素
        if (prevState.dataSource !== this.state.dataSource) {
            const selectList = [];
            this.state.dataSource.forEach((item1) => {
                item1.alarmInfo.forEach((item2) => {
                    if (item2.checked) {
                        selectList.push(item2);
                    }
                });
            });
            this.props.onSelectRowsChange(selectList);

            if (this.needExtractOrExpand) {
                if (this.tablePagination.current === 1) {
                    this.executeExpandOrRetract();
                } else if (this.state.expandAllFlag) {
                    const nextPageData = _.difference(this.state.dataSource, prevState.dataSource);

                    this.executeExpandOrRetract([...this.state.expandedRowKeys, ...nextPageData.map((item) => item[circuitRowKey])]);
                }
            } else {
                this.needExtractOrExpand = true;
            }
        }
    }

    componentWillUnmount() {
        this.tableBodyRef.current?.removeEventListener('scroll', this.handleTableScroll);
        clearInterval(this.timer);
    }

    initTableRectHeight = () => {
        const containerHeight = this.containerRef.current.getBoundingClientRect()?.height;

        this.setState({ containerHeight }, () => {
            // 为了把横向滚动条放在页面最下方
            const tBody = this.containerRef.current.getElementsByClassName('oss-ui-table-body')[0];
            if (tBody) {
                tBody.style.height = `${this.state.containerHeight - 90}px`;
                tBody.style.maxHeight = `${this.state.containerHeight - 90}px`;
            }
        });
    };

    bindTableScrollEvent = () => {
        if (!this.tableBodyRef.current) {
            this.tableBodyRef.current = this.containerRef.current.querySelector('div.oss-ui-table-body');
            this.tableBodyRef.current?.addEventListener('scroll', _.throttle(this.handleTableScroll, 500));
        }
    };

    resetTablePagination = (needRequest) => {
        this.tablePagination = { current: 1, total: 0, pageSize: 20 };

        if (needRequest) {
            // 请求数据
            this.requestDataSource();
        }
    };

    startTimer = () => {
        this.stopTimer();
        this.resetTablePagination(true);
        this.timer = setInterval(() => {
            this.resetTablePagination(true);
        }, 1000 * 60);
    };

    stopTimer = () => {
        clearInterval(this.timer);
    };

    handleClickRelateIconFlagChange = () => {
        const { clickRelateIconFlag } = this.props;

        if (clickRelateIconFlag) {
            this.setState({ expandAllFlag: true });
            this.switchLockFlag(true);
            this.resetTablePagination(true);
        } else {
            this.switchLockFlag(false);
        }
    };

    // 父级单项修改
    onSelect = (record, selected) => {
        const { dataSource } = this.state;

        const circuitIndex = dataSource.findIndex((item) => item[circuitRowKey] === record[circuitRowKey]);

        const newAlarmInfo = dataSource[circuitIndex].alarmInfo.map((item) => {
            return {
                ...item,
                checked: selected,
            };
        });

        const nextData = produce(dataSource, (draft) => {
            draft[circuitIndex].alarmInfo = newAlarmInfo;
        });

        this.setState({
            dataSource: nextData,
        });
    };

    // 父级全选或取消选中
    onSelectAll = (selected, selectedRows, changeRows) => {
        const { dataSource } = this.state;
        const nextData = produce(dataSource, (draft) => {
            changeRows.forEach((item) => {
                const circuitIndex = dataSource.findIndex((item2) => item2[circuitRowKey] === item[circuitRowKey]);
                const newAlarmInfo = dataSource[circuitIndex].alarmInfo.map((item3) => {
                    return {
                        ...item3,
                        checked: selected,
                    };
                });
                draft[circuitIndex].alarmInfo = newAlarmInfo;
            });
        });

        this.setState({
            dataSource: nextData,
        });
    };

    requestDataSource = async (current) => {
        const { dataSource } = this.state;
        const { clickRelateIconFlag, selectedFaultDesc, mode } = this.props;
        const requestPageNum = current ?? this.tablePagination.current;
        const isReload = requestPageNum === 1;

        const requestParams = {
            userId: useLoginInfoModel.data.userId,
            pageNum: requestPageNum,
            pageSize: this.tablePagination.pageSize,
            relationId: selectedFaultDesc?.id && selectedFaultDesc.id !== newAddId ? selectedFaultDesc.id : undefined,
            faultType: mode.replace(`${TabButtonEnum.HISTORY}/`, '') === TabButtonEnum.CABLE ? 1 : 2,
        };
        let res;
        if (this.historyFlag) {
            res = await getHistoryAlarm(requestParams);
        } else if (clickRelateIconFlag) {
            res = await getEditAlarmDataSourceApi(requestParams);
        } else {
            res = await getAlarmDataSourceApi(requestParams);
        }

        const { total, pageNum, selectData = [], notSelectData = [], data = [], sessionId, alarmStatsData } = res;
        this.sessionIdCache = sessionId;

        this.tablePagination.total = Number(total);
        this.tablePagination.current = pageNum;
        const newDataSource = [...(isReload ? [] : dataSource), ...selectData, ...notSelectData, ...data];
        const bothSidesIsInteractingFlag = this.judgeBothSidesIsInteractingFlag();

        this.setState({
            loading: false,
            tableLoading: false,
            alarmStatsData,
            dataSource: newDataSource,
            bothSidesIsInteractingFlag,
        });

        // 非历史记录、声音开启、两侧非交互状态时才播放
        if (!this.historyFlag && this.shouldQueryNewAlarmAPI && !this.state.bothSidesIsInteractingFlag) {
            this.queryVoiceAlarmAndPlay();
        }

        this.shouldQueryNewAlarmAPI = true;
    };

    requestAllAlarm = () => {
        sendLogFn({ authKey: 'workbenches:textAllAlarm' });
        const { clickRelateIconFlag } = this.state;
        const { onSelectDescChange } = this.props;

        if (clickRelateIconFlag) {
            return;
        }

        onSelectDescChange();

        if (!this.props.selectedFaultDesc) {
            this.resetTablePagination(true);
        }
    };

    handleTableScroll = (event) => {
        const { clientHeight, scrollHeight, scrollTop } = event.target;

        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;

        const { pageSize, total, current } = this.tablePagination;

        const hasNextPageFlag = total > current * pageSize;

        if (isBottom && hasNextPageFlag) {
            this.setState({ loading: true });
            this.requestDataSource(this.tablePagination.current + 1);
        }
    };

    // 删除统一调用方法
    deleteFunction = async (alarmInfoList) => {
        const { userId, userName, loginId } = useLoginInfoModel.data;

        const alarmPropertiesList = alarmInfoList.map((item) => {
            const showData = _.omit(item, ['originData', 'index', 'checked']);
            const originRow = item.originData;
            const rowData = Object.keys(showData).reduce((accu, itemIn) => {
                return {
                    ...accu,
                    [itemIn]: originRow[itemIn].value || originRow[itemIn].lable,
                };
            }, {});
            return rowData;
        });

        const data = {
            operatorId: userId,
            operatorName: userName,
            loginId,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
            clientRequestInfo: encodeURI(
                JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            ),
            // alarmPropertiesList: [_.omit(row, 'originData')],
            alarmPropertiesList,
            operateType: 'alarm_cancel',
        };
        try {
            const res = await deleteAlarmItemApi(data);
            if (res.code === 0) {
                message.success('删除成功');

                this.resetTablePagination(true);
            } else {
                message.error('删除失败');
            }
            return true;
        } catch {
            message.error('接口错误');
            return new Error('接口错误');
        }
    };

    parentDeleteItem = (e, row) => {
        e.stopPropagation();
        Modal.confirm({
            title: '提示',
            content: '删除后，该电路下挂的所有告警均同步删除，是否继续？',
            okText: '是',
            cancelText: '否',
            onOk: async () => {
                try {
                    this.deleteFunction(row.alarmInfo);
                } catch (err) {
                    console.log(429, err);
                }
            },
            onCancel() {},
        });
    };

    exportAlarms = () => {
        sendLogFn({ authKey: 'workbenches:textAlarmExport' });
        exportAlarmApi({ sessionId: this.sessionIdCache }).then(createFileFlow);
    };

    switchLockFlag = (flag) => {
        this.setState({ lockFlag: flag });
    };

    handleLockChange = () => {
        if (this.state.lockFlag) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    };

    // 点击展开子项目
    onExpand = (expanded, record) => {
        const { expandedRowKeys } = this.state;
        if (expanded) {
            this.setState({ expandedRowKeys: [...expandedRowKeys, record[circuitRowKey]] });
        } else {
            const newList = expandedRowKeys.filter((item) => item !== record[circuitRowKey]);
            this.setState({ expandedRowKeys: newList });
        }
    };

    // 子表格选中修改更新父级数据
    handleSubSelectChange = (circuitItemId, newSelectedRowKeys) => {
        const { dataSource } = this.state;
        const circuitIndex = dataSource.findIndex((item) => item[circuitRowKey] === circuitItemId);

        const newAlarmInfo = dataSource[circuitIndex].alarmInfo.map((item) => {
            return {
                ...item,
                checked: newSelectedRowKeys.includes(item[alarmRowKey]),
            };
        });

        const nextData = produce(dataSource, (draft) => {
            draft[circuitIndex].alarmInfo = newAlarmInfo;
        });

        this.needExtractOrExpand = false;

        this.setState({
            dataSource: nextData,
        });
    };

    toggleFilterModalVisible = () => {
        this.setState((prev) => ({ filterModalVisible: !prev.filterModalVisible }));
    };

    onFilterConditionSave = async (e, values) => {
        sendLogFn({ authKey: 'workbenches:textAllFilter' });

        const alarmConfigs = transformFilterModalFields(values, 'save');

        await saveFilterConditionApi({ userId: useLoginInfoModel.data.userId, alarmConfigs });

        const fieldList = await getFieldsListApi({ userId: useLoginInfoModel.data.userId });

        this.alarmColumnsUserConfigCache = fieldList.userConfigs.alarmConfigs;
        // 筛选条件保存后刷新数据不查找告警发声接口,一定不发声
        this.shouldQueryNewAlarmAPI = false;
        this.setState({ filterModalVisible: false });

        // 刷新数据
        this.resetTablePagination(true);
    };

    changeChildrenColumns = (value) => {
        this.setState({
            childrenColumns: value,
        });
    };

    // 展开收起icon
    expandIconClick = () => {
        this.setState(
            (prev) => {
                return {
                    expandAllFlag: !prev.expandAllFlag,
                };
            },
            () => {
                this.executeExpandOrRetract();
            },
        );
    };

    // 执行展开逻辑
    executeExpandOrRetract = (specialKeys) => {
        const { expandAllFlag, dataSource } = this.state;

        if (specialKeys) {
            this.setState({
                expandedRowKeys: specialKeys,
            });
            return;
        }
        if (expandAllFlag) {
            // 没有全部展开时 点击展开
            this.setState({
                expandedRowKeys: dataSource.map((item) => item[circuitRowKey]),
            });
        } else {
            // 已经全部展开时 点击收起
            this.clearExpandedRowKeys();
        }
    };

    clearExpandedRowKeys = () => {
        this.setState({
            expandedRowKeys: [],
        });
    };

    // 批量删除
    batchDelete = () => {
        sendLogFn({ authKey: 'workbenches:textAlarmDelete' });

        const { dataSource, bothSidesIsInteractingFlag } = this.state;
        if (bothSidesIsInteractingFlag) {
            return;
        }

        const parentSelectRowKeys = dataSource.reduce((accu, item) => {
            if (item.alarmInfo.every((itemIn) => Boolean(itemIn.checked))) {
                return [...accu, item[circuitRowKey]];
            }
            return accu;
        }, []);

        const childrenSelectRowKeys = dataSource.reduce((accu, item) => {
            if (item.alarmInfo.some((itemIn) => Boolean(itemIn.checked))) {
                const newList = item.alarmInfo.filter((itemIn) => Boolean(itemIn.checked));
                return [...accu, ...newList];
            }
            return accu;
        }, []);

        // 无选中项
        if (!parentSelectRowKeys.length && !childrenSelectRowKeys.length) {
            message.warning('请选择至少一项电路或者告警！');
            return;
        }
        let content;
        // 勾选内容仅包含告警
        if (!parentSelectRowKeys.length && childrenSelectRowKeys.length) {
            content = '是否确认删除选中告警？';
        }
        // 勾选内容既包含告警也包含电路
        if (parentSelectRowKeys.length && childrenSelectRowKeys.length) {
            content = '批量删除后，选中告警及选中电路下的告警均全部删除，是否继续？';
        }

        let circuitOnly = true; // 是否仅选择了电路

        for (let i = 0; i < dataSource.length; i += 1) {
            if (dataSource[i].alarmInfo.some((itemIn) => !itemIn.checked) && dataSource[i].alarmInfo.some((itemIn) => itemIn.checked)) {
                circuitOnly = false;
                break;
            }
        }

        // 勾选内容仅包含电路
        if (circuitOnly) {
            content = '批量删除后，选中电路下的告警将全部删除，是否继续？';
        }

        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content,
            okText: '是',
            cancelText: '否',
            onOk: () => {
                this.deleteFunction(childrenSelectRowKeys);
            },
        });
    };

    changeCircuitConfigs = (data) => {
        this.setState({
            circuitConfigs: data,
        });
    };

    // 修改表格拖拽属性
    handleResize =
        (column) =>
        (e, { size }) => {
            const { circuitConfigs } = this.state;

            // 修改父表格宽度
            const newCircuitConfigs = circuitConfigs.map((item) => {
                if (item.code === column.dataIndex) {
                    return {
                        ...item,
                        width: size.width,
                    };
                }
                return {
                    ...item,
                };
            });

            this.setState({
                circuitConfigs: newCircuitConfigs,
            });

            // 修改子表格设置宽度
            const newAlarmConfigs = this.alarmColumnsUserConfigCache.map((item) => {
                if (item.code === actionsKey && item.code === column.dataIndex) {
                    return {
                        ...item,
                        width: size.width,
                    };
                }
                return {
                    ...item,
                };
            });
            updateUserConfigColumnApi({
                alarmConfigs: newAlarmConfigs,
                circuitConfigs: newCircuitConfigs,
                userId: useLoginInfoModel.data.userId,
            });
        };

    childrenDeleteItem = (item) => {
        sendLogFn({ authKey: 'workbenches:textAlarmDelete' });

        Modal.confirm({
            title: '提示',
            content: '是否确认删除？',
            okText: '是',
            cancelText: '否',
            onOk: async () => {
                this.deleteFunction([item]);
            },
            onCancel() {},
        });
    };

    // 初始设子表格置表头和列设置
    getFieldsList = async () => {
        const fieldList = await getFieldsListApi({ userId: useLoginInfoModel.data.userId });

        const { userConfigs } = fieldList;
        const columnsStateMap = {};
        const columnsList = [];
        const { alarmConfigs, circuitConfigs } = userConfigs;

        alarmConfigs.forEach((element) => {
            columnsStateMap[element.code] = {
                show: element.code === actionsKey && this.historyFlag ? false : element.show,
                fixed: element.fixed,
                order: element.order,
            };

            let column = {};

            // 操作项目单独处理
            if (element.code === actionsKey) {
                column = {
                    title: element.codeName,
                    dataIndex: element.code,
                    align: 'center',
                    width: element.width,
                    className: 'sub-box-actions',
                    // width: '8%',
                    // style: { width: 80, maxWidth: 80, minWidth: 80 },
                    render: (text, item) => [
                        <Tooltip title="删除" key="delete">
                            <DeleteSvg onClick={() => this.childrenDeleteItem(item)} className="alarm-delete-icon" />
                        </Tooltip>,
                    ],
                };
            } else {
                column = {
                    title: element.codeName,
                    dataIndex: element.code,
                    align: 'center',
                    width: element.width,
                    render: (text) => <EditTableItem text={text} />,
                };
            }
            columnsList.push(column);
        });
        this.alarmColumnsUserConfigCache = alarmConfigs;

        // 修改子表格表头
        this.changeChildrenColumns(columnsList);
        // 修改父表格列设置数据
        this.changeCircuitConfigs(circuitConfigs);

        const formatData = (list) => {
            const columnsMap = {};
            list.forEach((element) => {
                columnsMap[element.code] = {
                    show: element.show,
                    fixed: element.fixed,
                    order: element.order,
                };
            });
            return columnsMap;
        };

        this.setState({
            allColumnsState: {
                [circuitId]: formatData(circuitConfigs),
                [alarmId]: formatData(alarmConfigs),
            },
        });
        // 设置默认值
        if (!this.state.defaultColumnsMap) {
            this.setState({
                defaultColumnsMap: {
                    [circuitId]: formatData(circuitConfigs),
                    [alarmId]: formatData(alarmConfigs),
                },
            });
        }
    };
    handleRowClick = (record) => {
        this.setState({
            currentClickRow: record,
        });
    };

    rowClassName = (record) => {
        const { expandedRowKeys, currentClickRow } = this.state;
        let className = '';
        // 打开项目
        if (expandedRowKeys.includes(record[circuitRowKey])) {
            className = 'open-list';
        }
        // 选中项目
        if (record[circuitRowKey] === currentClickRow[circuitRowKey]) {
            className = `${className} select-list`;
        } else {
            className = className.replace('select-list', '');
        }
        return className;
    };

    // 该状态由props得出，之所以不当作一个派生状态，是想要左侧触发与右侧交互时，将rowSelection的展示延迟倒数据请求返回之后一并update
    judgeBothSidesIsInteractingFlag = () => {
        const { selectedFaultDesc, clickRelateIconFlag } = this.props;

        return selectedFaultDesc || clickRelateIconFlag;
    };

    queryVoiceAlarmAndPlay = () => {
        queryVoiceAlarmApi({
            userId: useLoginInfoModel.data.userId,
            type: this.props.mode === TabButtonEnum.CABLE ? 1 : 2,
        }).then((total) => {
            if (total > 0 && this.state.voiceFlag) {
                this.audioRef.current.play();
            }
        });
    };

    switchVoiceFlag = () => {
        this.setState((prev) => {
            return {
                voiceFlag: !prev.voiceFlag,
            };
        });
    };

    onColumnsChange = (value) => {
        this.setState({
            allColumnsState: value,
        });

        const newAlarmConfigs = this.alarmColumnsUserConfigCache.map((item) => {
            return {
                ...item,
                ...value[alarmId][item.code],
            };
        });

        const newCircuitConfigs = this.state.circuitConfigs.map((item) => {
            return {
                ...item,
                ...value[circuitId][item.code],
            };
        });

        updateUserConfigColumnApi({
            alarmConfigs: newAlarmConfigs,
            circuitConfigs: newCircuitConfigs,
            userId: useLoginInfoModel.data.userId,
        });
    };

    render() {
        const {
            containerHeight,
            lockFlag,
            loading,
            expandedRowKeys,
            dataSource,
            filterModalVisible,
            childrenColumns,
            alarmStatsData,
            circuitConfigs,
            expandAllFlag,
            tableLoading,
            allColumnsState,
            bothSidesIsInteractingFlag,
            voiceFlag,
            defaultColumnsMap,
        } = this.state;
        const { selectedRows, mode, clickRelateIconFlag } = this.props;

        const formatColumns = circuitConfigs.map((item, index) => {
            if (item.code === actionsKey) {
                return {
                    title: item.codeName,
                    dataIndex: item.code,
                    align: 'center',
                    width: item.width,
                    className: 'sub-box-actions',
                    onHeaderCell: (column) => ({
                        width: column.width || 120,
                        onResize: this.handleResize(column),
                        isLastColumn: index === circuitConfigs.length - 1,
                    }),
                    // width: '8%',
                    render: (text, items) => [
                        <Tooltip title="删除" key="delete">
                            <DeleteSvg onClick={(e) => this.parentDeleteItem(e, items)} className="alarm-delete-icon" />
                        </Tooltip>,
                    ],
                };
            }
            return {
                // ...item,
                title: item.codeName,
                dataIndex: item.code,
                align: 'center',
                width: item.width,
                render: (text) => <EditTableItem text={text} />,
                onHeaderCell: (column) => ({
                    width: column.width || 120,
                    onResize: this.handleResize(column),
                }),
            };
        });

        const newSelectRowKeys = dataSource.reduce((accu, item) => {
            if (item.alarmInfo.every((itemIn) => Boolean(itemIn.checked))) {
                return [...accu, item[circuitRowKey]];
            }
            return accu;
        }, []);

        const title = () => {
            if (mode === TabButtonEnum.CABLE) {
                return '海缆活动告警';
            }
            if (mode === TabButtonEnum.LANDCABLE) {
                return '陆缆通道监控活动告警';
            }
            if (mode === TabButtonHistoryEnum.CABLEHISTORY) {
                return '海缆告警';
            }
            if (mode === TabButtonHistoryEnum.LANDCABLEHISTORY) {
                return '陆缆通道监控告警';
            }
            return '';
        };
        // 点击了关联图标展示选择行，若没有点击则没有选中说明时也显示选择行
        const showRowSelection = !this.historyFlag && (!bothSidesIsInteractingFlag || clickRelateIconFlag);

        const parentColumnState = allColumnsState?.[circuitId] || {};
        const childrenColumnState = allColumnsState?.[alarmId] || {};

        const allColumnsData = [
            {
                id: circuitId,
                title: '电路字段',
                columns: formatColumns,
                columnState: parentColumnState,
            },
            {
                id: alarmId,
                title: '告警字段',
                columns: childrenColumns,
                columnState: childrenColumnState,
            },
        ];

        return (
            <div style={{ height: '100%' }} className="international-resource-monitor-alarm-list-wrapper" ref={this.containerRef}>
                <Spin size="small" spinning={loading} className="request-next-page-loading" />
                <FilterModal
                    visible={filterModalVisible}
                    contentProps={{
                        initialValues: transformFilterModalFields(
                            this.alarmColumnsUserConfigCache.filter((item) => Boolean(item.isSelect)),
                            'show',
                        ),
                    }}
                    onOk={this.onFilterConditionSave}
                    onCancel={() => {
                        this.setState({ filterModalVisible: false });
                    }}
                />
                {/* eslint-disable-next-line */}
                <audio preload ref={this.audioRef} src={`${constants.STATIC_PATH}/media/new-alarm-audio.mp3`} />
                <ProTable
                    dataSource={dataSource}
                    columns={formatColumns}
                    global={window}
                    tableClassName="alarm-table"
                    toolBarRender={() => {
                        return (
                            <Space className={`custom-toolbar-wrapper ${this.historyFlag && 'history-mode'}`} id="toolbar-space" size="middle">
                                {!this.historyFlag && (
                                    <Tooltip title={voiceFlag ? '关闭声音' : '打开声音'}>
                                        <img src={voiceFlag ? IconNotMuted : IconMuted} alt="" onClick={this.switchVoiceFlag} />
                                    </Tooltip>
                                )}
                                {/* <Tooltip title={expandAllFlag ? '收起' : '展开'}>
                                    <img src={expandAllFlag ? IconRetract : IconExpand} alt="" onClick={this.expandIconClick} />
                                </Tooltip> */}
                                <Tooltip title="告警筛选">
                                    <img src={IconTopFilter} alt="" onClick={this.toggleFilterModalVisible} />
                                </Tooltip>
                                <Tooltip title="导出">
                                    <img src={Icon15} alt="" onClick={this.exportAlarms} />
                                </Tooltip>
                                {!this.historyFlag && (
                                    <Tooltip title={lockFlag ? '解锁' : '锁定'}>
                                        <img
                                            src={lockFlag ? Icon16 : Icon16Open}
                                            onClick={() => {
                                                sendLogFn({ authKey: 'workbenches:textAlarmLocked' });
                                                this.switchLockFlag(!lockFlag);
                                            }}
                                            alt=""
                                        />
                                    </Tooltip>
                                )}
                                <Tooltip title="全部告警">
                                    <img src={Icon17} alt="" className={cls({ disabled: clickRelateIconFlag })} onClick={this.requestAllAlarm} />
                                </Tooltip>
                                {!this.historyFlag && (
                                    <Tooltip title="删除">
                                        <img
                                            className={cls({ disabled: bothSidesIsInteractingFlag })}
                                            src={IconBatchDelete}
                                            alt=""
                                            onClick={this.batchDelete}
                                        />
                                    </Tooltip>
                                )}
                                {!this.historyFlag && (
                                    <ColumnSetting
                                        allColumnsData={allColumnsData}
                                        onChange={this.onColumnsChange}
                                        defaultColumnsMap={defaultColumnsMap}
                                    >
                                        <Tooltip title="告警字段列设置">
                                            <img src={Icon14} className={cls({ disabled: bothSidesIsInteractingFlag })} alt="" />
                                        </Tooltip>
                                    </ColumnSetting>
                                )}
                            </Space>
                        );
                    }}
                    rowKey={circuitRowKey}
                    pagination={false}
                    actionRef={this.tableRef}
                    scroll={{ y: containerHeight - 90 }}
                    search={false}
                    rowSelection={showRowSelection && { ...this.rowSelection, selectedRowKeys: newSelectRowKeys }}
                    options={{
                        reload: false,
                        density: false,
                        setting: false,
                    }}
                    bordered={false}
                    toolbar={{
                        style: { marginBottom: '10px' },
                        title: <Title text={title()} subtitle={<AlarmStats data={alarmStatsData} />} />,
                    }}
                    tableAlertRender={false}
                    size="middle"
                    columnsState={{
                        value: parentColumnState,
                    }}
                    expandable={{
                        expandedRowKeys,
                        expandIcon: false,
                        expandedRowRender: (record) => {
                            return (
                                <SubList
                                    record={record}
                                    columns={childrenColumns}
                                    columnState={childrenColumnState}
                                    onSelectChange={(selectedRowKey) => this.handleSubSelectChange(record[circuitRowKey], selectedRowKey)}
                                    changeColumns={this.changeChildrenColumns}
                                    circuitConfigs={circuitConfigs}
                                    changeCircuitConfigs={this.changeCircuitConfigs}
                                    columnsConfigList={this.alarmColumnsUserConfigCache}
                                    parentSelectedRows={selectedRows}
                                    showRowSelection={showRowSelection}
                                />
                            );
                        },
                        expandRowByClick: true,
                        expandIconColumnIndex: -1,
                        onExpand: this.onExpand,
                        fixed: true,
                    }}
                    components={TableHeader}
                    onRow={(record) => ({
                        onClick: () => this.handleRowClick(record),
                    })}
                    rowClassName={this.rowClassName}
                    loading={tableLoading}
                />
            </div>
        );
    }
}

export default Index;
