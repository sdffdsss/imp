/* eslint-disable @typescript-eslint/no-unused-expressions */
// import locales from "locales";
import React from 'react';
import { Icon, Menu, Popover, Button, Tooltip, message } from 'oss-ui';
// import { isEmpty, cloneDeep } from '';
import SortDrag from './alarm-query-setting';
import { _ } from 'oss-web-toolkits';
// import { getData } from './config/data.js';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import SearchProtable from './alarm-query-protable';
import searchInitConfig from './common/adaper/adapter_commonSearch';
// import searchForm from './config/config_searchForm';
import DataSourceAdapter from './common/adaper/adapter_dataSource';
import ColumnsAdapter from './common/adaper/adapter_columns';
import PageContainer from '../../../components/page-container';
import AlarmExportButton from '../../../components/alarm-export-alaquery';
import defaultConfig from './config/default';
import AlarmColumn, { defaultOption } from './alarm-column';
import { getSearchForm, customQueryDetail } from './common/adaper/adapter_searchForm';
import constants from '@Common/services/constants';
import urlSearch from '@Common/utils/urlSearch';
import moment from 'moment';
import _omit from 'lodash/omit';
import { logNew } from '@Common/api/service/log';
import { createFileFlow } from '@Common/utils/download';
import { sendLogFn } from '@Pages/components/auth/utils';
import { getDefaultProfession } from './api';
import './index.less';

const { mapperId } = defaultConfig;
const searchPrefix = 'search_';
// const { Header, Footer, Content } = Layout;
class Index extends React.PureComponent {
    constructor(prop) {
        super(prop);
        this.loadingState = {};
        this.onTabsChange = this.onTabsChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.alarmExport = this.alarmExport.bind(this);
        this.setHeaderRow = this.setHeaderRow.bind(this);
        this.setColumnsStateMap = this.setColumnsStateMap.bind(this);
        this.getInitConfig = this.getInitConfig.bind(this);
        this.menuClick = this.menuClick.bind(this);
        this.alarmExportWithMoreCondition = this.alarmExportWithMoreCondition.bind(this);
        this.typesDataList = {};
        // this.initWidth = this.initWidth.bind(this);
        this.state = {
            initConfig: [],
            activeKey: '1',
            search: {},
            loading: {},
            columns: {},
            columnsStateMap: {},
            dataSource: {},
            scroll: {},
            pagination: {},
            queryType: {},
            scrollY: window.innerHeight - 348,
            visibleSortDrag: false,
            menuName: null,
            viewId: null,
            menuOption: 'add', // 'del', 'edit' ,'add'
            dragSelectOptions: {},
            dragAllOptions: {},
            showInTableColumns: [],
            getAlarmColumn: null,
            alarmWindowModeCondChange: null,
            customFilterId: null,
            customQuery: false,
            columnTemplateId: defaultOption.templateId,
            alarmExportLoading: false,
            alarmExportDisable: true,
            menuCollapsed: false,
            seacrhFlag: false,
            operId: '',
        };

        this.adapter = {};
        // this.queryType = {};
        this.formParams = {};
        this.initCollapsed = {};
        this.searchCollapseHeight = {};
        this.searchSpreadHeight = {};
        this.searchItemNum = {};
        // console.info('backHome! ' + this.state.activeKey);
        this.scrollX = {};
        this.searchProtableRef = React.createRef();
        this.firstEnter = true;
    }
    alarmWindowModeCond = {};
    showInSearchColumns = {};
    showInTableColumns = {};
    formParamsStore = {};
    dragContainerRef = React.createRef();

    componentDidMount() {
        this.getInitConfig();
        //
        // if (this.porps.mode === 'alarm-window') {
        //     this.setState({ alarmWindowModeCond: this.porps.condition });
        // }
    }
    componentDidUpdate(preProps) {
        if (
            preProps.mode === 'alarm-window' &&
            JSON.stringify(preProps.condition) !== JSON.stringify(this.props.condition) &&
            Object.keys(this.props.condition).length !== 0
        ) {
            // this.alarmWindowModeCond = preProps.condition;
            this.setState({ alarmWindowModeCondChange: new Date().getTime() });
        }
        if (preProps.login.platFlag !== this.props.login.platFlag) {
            this.getInitConfig();
        }
    }

    getSearchParams = () => {
        const { search } = window.location;
        const searchParams = new URLSearchParams(search);
        const overSkipType = searchParams.get('overSkipType');
        return {
            overSkipType,
        };
    };
    async getInitConfig(updata) {
        const { overSkipType } = this.getSearchParams();
        let initConfig = _.cloneDeep(searchInitConfig());
        if (useLoginInfoModel.data.platFlag) {
            initConfig[0].columns = initConfig[0].columnsPlatform;
        }
        // let initConfig = _.cloneDeep(searchForm);
        const { srcString } = useLoginInfoModel.data;
        const { userInfo, systemInfo } = this.props?.login;
        let userInfos = JSON.parse(userInfo);
        const urlData = urlSearch(srcString);
        if (urlData.operId) {
            this.setState({
                operId: urlData.operId,
            });
        }
        let seacrhFlag = false;
        console.log(urlData, '===id', this.firstEnter);
        if (this.firstEnter) {
            const res = await getDefaultProfession({ userId: this.props?.login.userId });
            if (res.data.length > 0) {
                const curProfessional = res.data[0].professional_type?.split(',').map((e) => +e);
                initConfig[0].columns.forEach((item) => {
                    if (item.key === 'professional_type' && !urlData.standard_alarm_id) {
                        item.defaultValue = {
                            value: curProfessional,
                        };
                    }
                });
            }
            this.firstEnter = false;
        }
        if (this.props.login.platFlag) {
            initConfig[0].columns.forEach((item) => {
                if (item.key === 'event_time') {
                    item.platform = true;
                }
            });
        }
        if (overSkipType === 'day') {
            initConfig[0].columns.forEach((item) => {
                if (item.key === 'event_time') {
                    item.defaultValue = {
                        value: [moment().startOf('day'), moment().endOf('day')],
                    };
                }
                if (item.key === 'alarm_title_text') {
                    item.defaultValue = {
                        operator: 'eq',
                        value: '[衍生关联]5G消息平台发生通断类故障,[衍生关联]VoLTE短信网关发生通断类故障,[衍生关联]集约化短信中心发生通断类故障,[衍生关联]视频彩铃平台发生通断类故障',
                    };
                }
            });
        }
        if (overSkipType === 'month') {
            initConfig[0].columns.forEach((item) => {
                // const timeEnum = ['event_time', 'cancel_time', 'intending_send_time'];
                // if (timeEnum.includes('item.key')) {
                if (item.key === 'event_time') {
                    item.defaultValue = {
                        value: [moment().startOf('month'), moment().endOf('month')],
                    };
                }
                if (item.key === 'alarm_title_text') {
                    item.defaultValue = {
                        operator: 'eq',
                        value: '[衍生关联]5G消息平台发生通断类故障,[衍生关联]VoLTE短信网关发生通断类故障,[衍生关联]集约化短信中心发生通断类故障,[衍生关联]视频彩铃平台发生通断类故障',
                    };
                }
            });
        }

        if (urlData.source === 'group-workbench-agent') {
            initConfig[0].columns.forEach((item) => {
                if (item.key === 'standard_alarm_id') {
                    item.defaultValue = { operator: 'eq', value: urlData.standardAlarmId || undefined };
                }
                if (item.key === 'event_time') {
                    item.defaultValue = {
                        value: [
                            moment(decodeURIComponent(urlData.alarmTime)).subtract(3, 'day').startOf('day'),
                            moment(decodeURIComponent(urlData.alarmTime)).add(3, 'day').endOf('day'),
                        ],
                    };
                    item.value = {
                        value: [
                            moment(decodeURIComponent(urlData.alarmTime)).subtract(3, 'day').startOf('day'),
                            moment(decodeURIComponent(urlData.alarmTime)).add(3, 'day').endOf('day'),
                        ],
                    };
                }
                if (item.key === 'alarm_title_text') {
                    item.defaultValue = { operator: 'eq', value: decodeURIComponent(urlData.alarmTitle) || '' };
                }
            });
            seacrhFlag = true;
        } else if (urlData.standard_alarm_id) {
            initConfig[0].columns.forEach((item) => {
                if (item.key === 'standard_alarm_id') {
                    item.defaultValue = { operator: 'eq', value: urlData.standard_alarm_id };
                }
                if (item.key === 'event_time') {
                    item.defaultValue = {
                        value: [moment(`${urlData.event_time} 00:00`), moment(`${urlData.event_time} 24:00`)],
                    };
                }
            });
            seacrhFlag = true;
        }
        if (userInfos?.zones[0]?.zoneId) {
            initConfig[0].columns.forEach((item) => {
                if (item.key === 'province_region_city') {
                    item.defaultValue = {
                        value: userInfos?.zones[0]?.zoneLevel === '3' ? [[userInfos?.zones[0]?.parentZoneId]] : [[userInfos?.zones[0]?.zoneId]],
                    };
                }
            });
        }
        if (systemInfo?.currentZone?.zoneId) {
            initConfig[0].columns.forEach((item) => {
                if (item.key === 'province_region_city') {
                    item.defaultValue = {
                        value:
                            systemInfo.currentZone.zoneLevel === '1' || systemInfo.currentZone.zoneLevel === '5'
                                ? []
                                : [[systemInfo.currentZone.zoneId]],
                    };
                }
            });
        }
        if (this.props.mode === 'alarm-window') {
            initConfig = initConfig.slice(0, 1);
        } else if (constants.version !== 'unicom') {
            const diyConfigs = await getSearchForm(initConfig, this.props?.login?.userId ?? -1);
            initConfig = [].concat(initConfig, diyConfigs);
        }

        const columnsState = {};
        const paginationState = {};
        const columnsStateMapState = {};
        // widthState = {},
        const loadingState = {};
        const queryTypeState = {};
        const searchState = {};
        const scrollState = {};
        const dragSelectOptionsState = {};
        const initCollapsedState = {};
        const {
            login: { userId },
            otherConfig = {},
        } = this.props;
        // let userInfos = userInfo && JSON.parse(userInfo);
        for (const iterator of initConfig) {
            let { config = {}, key, queryType, columns } = iterator;
            // 创建各自的数据源实例
            const dataSourceAdapter = new DataSourceAdapter();
            dataSourceAdapter.userId = userId;
            dataSourceAdapter.loginProvinceId = userInfos?.zones[0]?.zoneId;
            if (systemInfo?.currentZone?.zoneId) {
                dataSourceAdapter.loginProvinceId = systemInfo?.currentZone?.zoneId;
            }
            Object.keys(otherConfig).forEach((key) => {
                dataSourceAdapter.otherConfig[key] = otherConfig[key];
            });
            const columnsAdapter = new ColumnsAdapter({ mode: this.props.mode });

            if (this.props.mode === 'alarm-window') {
                // 接口报错，先注释
                // columnsAdapter.getColumnsInfo().then(() => {
                //     if (Object.keys(this.props.condition).length !== 0) {
                //         this.setState({ alarmWindowModeCondChange: new Date().getTime() });
                //     }
                // });
            }

            this.adapter[key] = { dataSourceAdapter, columnsAdapter };

            // 这里读取表头信息取消，改为列模板组件 inItTableHead 事件触发
            // const tableHead = await this.getTableHeadAsync(key);
            // const { showInTableColumns, columnsStateMap, width } = tableHead;

            columnsAdapter.getAllColumns_fieldIdNames();
            const showInTableColumns = [];
            const columnsStateMap = [];
            const width = 0;

            // columns 只在这里取一次数据； 全量的表单列定义
            // mapperId 查询表单的 sql下沉文件名
            columns = columns.map((column) => {
                return { ...column, mapperId: `${mapperId}` };
            });
            // 暂存以来，列模板改变时使用
            this.showInSearchColumns[key] = columns;
            this.showInTableColumns[key] = showInTableColumns;
            dragSelectOptionsState[key] = columns.map((item, index) => {
                return {
                    id: index + 1,
                    name: item.title,
                    field: item.dataIndex,
                };
            });
            // columns.mapperId = 'alarmQuery';
            columnsState[key] = columns.concat(showInTableColumns);
            columnsStateMapState[key] = columnsStateMap;
            scrollState[key] = { x: width };
            // 上面3行都是列模板改变时 会重新赋值的state columnsState\columnsStateMapState\scrollState
            // columnsAdapter.getColumnsInfo();
            // adapter 调用时使用key 取出它

            const search = { colNum: 4 };
            const configKeys = Object.keys(config);

            // 初始化 pro table search 表单配置 ================开始
            // search_ 前缀的属性取出 放到search 下
            for (const keys of configKeys) {
                if (keys.startsWith(searchPrefix)) {
                    search[keys.replace(searchPrefix, '')] = config[keys];
                }
            }
            // const searchProtable  = this.searchProtableRef.current;
            if (search?.span?.sm?.with && window.innerWidth < search.span.sm.with) {
                search.span = search.span.sm.span;
            } else {
                search.span = search?.span?.default ?? 6;
            }
            // search.span = parseInt(24 / search.colNum);
            search.collapsed = false;

            search.onCollapse = (collapsed) => {
                // let y = this.searchSpreadHeight[key];
                // if (collapsed) {
                //     y = this.searchCollapseHeight[key];
                // }
                this.setState({
                    search: { ...this.state.search, [key]: { ...this.state.search[key], collapsed } },
                    // scroll: { ...this.state.scroll, [key]: y },
                });
            };
            searchState[key] = search;

            // 初始化 pro table search 表单配置 ================结束
            queryTypeState[key] = queryType;

            // 默认10条数据
            const {
                pageConfig: { pageSize = 10 },
            } = dataSourceAdapter;

            paginationState[key] = { pageSize };

            // 子组件loading受控
            this.loadingState[key] = false;

            // 设置查询面板初始化状态，未初始化
            initCollapsedState[key] = false;

            // iterator.onSubmit = this.onSubmit;
        }
        // console.log(`columnsState = ${JSON.stringify(columnsState[1])}`);
        // console.log('columnsStatecolumnsState :>> ', initConfig);
        this.setState({
            initConfig,
            columns: columnsState,
            columnsStateMap: columnsStateMapState,
            search: searchState,
            scroll: scrollState,
            pagination: paginationState,
            loading: loadingState,
            dragSelectOptions: dragSelectOptionsState,
            dragAllOptions: dragSelectOptionsState,
            activeKey: '1',
            showInTableColumns: this.showInTableColumns[this.state.activeKey],
            columnTemplateId: defaultOption.templateId,
            seacrhFlag,
        });
        // 一下属性不会更改，所以不是state 属性
        this.queryType = queryTypeState;
        this.initCollapsed = initCollapsedState;
        // return initConfig;
        if (updata) {
            this.getAlarmColumnF();
        }
    }
    getAlarmColumnF() {
        const t = new Date().getTime();
        this.setState({ getAlarmColumn: t });
    }
    /**
     * 异步读取表头信息
     */
    getTableHeadAsync(key) {
        return new Promise((resolve) => {
            this.adapter[key].columnsAdapter.getAllColumns().then(({ showInTableColumns }) => {
                const getInitColumnsStateMap = this.adapter[key].columnsAdapter.getInitColumnsStateMap.bind(this.adapter[key].columnsAdapter);
                const { columnsStateMap, width } = getInitColumnsStateMap();
                if (showInTableColumns && showInTableColumns !== 'Error') {
                    resolve({ showInTableColumns, columnsStateMap, width });
                } else {
                    resolve({ showInTableColumns: [], columnsStateMap, width });
                }
            });
        });
    }

    // /**
    //  * 初始化表格宽度
    //  * @param {*} param0
    //  */
    // initWidth(key, { width = columnWith, hideInSearch = false }) {
    //     if (hideInSearch) {
    //         this.scrollX += width;
    //         this.setState({ scroll: { ...this.state.scroll, [key]: width } });
    //     }
    // }

    onChange(key, { current, pageSize }) {
        // current: 1 pageSize: 50 showSizeChanger: true total: 10
        const { dataSourceAdapter, columnsAdapter } = this.adapter[key];
        // todo:排序 需要服务支持
        const startIndex = (current - 1) * pageSize;
        // formParams 取出 以防列模板发生改变 需要重新注册
        const formParams = this.formParamsStore[key];
        const registParams = [formParams, this.queryType[key], columnsAdapter, this.showInTableColumns[key]];
        // return dataSourceAdapter
        //     .getAlarmData(formParams, this.queryType[key], columnsAdapter, this.showInTableColumns[key])
        return dataSourceAdapter
            ._getAlarm(startIndex, pageSize, registParams)
            .then((records) => {
                const dataSource = typeof records.data === 'string' ? JSON.parse(records.data) : records.data;
                // let pagination = this.state.pagination;
                this.setState({
                    // dataSource,
                    dataSource: { ...this.state.dataSource, [key]: dataSource },
                    // pagination: { ...pagination, current, pageSize },
                    pagination: {
                        ...this.state.pagination,
                        [key]: { ...this.state.pagination[key], current, pageSize },
                    },
                });
                return {
                    data: dataSource,
                    success: true,
                    total: this.state.pagination[key].total,
                };
            })
            .catch(() => {
                return {
                    data: [],
                    success: false,
                    total: 0,
                };
            });
    }
    alarmExport({ activeKey, currentPage, pageSize, type, alarmList, total }) {
        const { dataSourceAdapter } = this.adapter[activeKey];
        const startIndex = (currentPage - 1) * pageSize;
        dataSourceAdapter.exportAlarm({ startIndex, pageSize, exportType: type, alarmList, total }).then((data) => {
            if (constants.version === 'unicom') {
                // data.fileUrl && window.open(useEnvironmentModel.data.environment.filter.direct + data.fileUrl);
                data.fileUrl && createFileFlow(data.fileUrl);
            } else {
                const fileInfo = JSON.parse(data.data);
                // fileInfo.fileUrl && window.open(fileInfo.fileUrl);
                fileInfo.fileUrl && createFileFlow(fileInfo.fileUrl);
            }
        });
    }
    alarmExportWithMoreCondition(exportType, condPageSize, condCurrent, callback) {
        const { activeKey } = this.state;
        let {
            pagination: {
                [activeKey]: { current = 1, pageSize },
            },
        } = this.state;
        const { dataSourceAdapter } = this.adapter[activeKey];
        if (condPageSize) {
            pageSize = condPageSize;
        }
        if (condCurrent) {
            current = condCurrent;
        }
        const startIndex = (current - 1) * pageSize;
        this.setState({ alarmExportLoading: true });
        dataSourceAdapter
            .exportAlarm({ startIndex, pageSize, exportType })
            .then((data) => {
                // this.setState({ alarmExportLoading: false });
                if (data.fileUrl) {
                    createFileFlow(data.fileUrl);
                }
            })
            .catch(() => {
                // this.setState({ alarmExportLoading: false });
            })
            .finally(() => {
                this.setState({ alarmExportLoading: false });
                callback?.();
            });
    }

    getPropsCondition(condition) {
        return condition;
    }

    onSubmit(key, params = {}, pageSize) {
        // 会改变字段名称的表单项
        const paramsEnum = ['new_send_status', 'new_sheet_status', 'new_sheet_no'];
        const formParams = {};
        if (!this.queryType) return;

        // const paramsClone = _.cloneDeep(params);

        // if (paramsClone.hasOwnProperty('sheet_type')) {
        //     const sheetType = paramsClone.sheet_type.value;

        //     if (paramsClone.hasOwnProperty('new_send_status')) {
        //         const fieldMap = {
        //             1: 'send_status',
        //             6: 'subway_send_status',
        //             7: 'supv_send_status',
        //         };

        //         formParams[fieldMap[sheetType]] = _.omit(paramsClone.new_send_status, 'type');
        //     }

        //     if (paramsClone.hasOwnProperty('new_sheet_status')) {
        //         const fieldMap = {
        //             1: 'sheet_status',
        //             6: 'subway_sheet_status',
        //             7: 'supv_sheet_status',
        //         };
        //         formParams[fieldMap[sheetType]] = _.omit(paramsClone.new_sheet_status, 'type');
        //     }
        //     if (paramsClone.hasOwnProperty('new_sheet_no')) {
        //         const fieldMap = {
        //             1: 'sheet_no',
        //             6: 'subway_sheet_no',
        //             7: 'supv_sheet_no',
        //         };
        //         formParams[fieldMap[sheetType]] = _.omit(paramsClone.new_sheet_no, 'type');
        //     }
        // }

        Object.entries(params).forEach(([k, value]) => {
            if (paramsEnum.includes(k)) {
                formParams[value.type] = _.omit(value, 'type');
            } else {
                formParams[k] = _.omit(value, 'type');
            }
        });

        console.log(formParams);

        // 收缩查询表单;
        const { search, loading } = this.state;
        if (this.loadingState[key]) {
            return;
        }
        if (key === '2' && !formParams.filter_id) {
            message.warning('请选择过滤器再查询');
            this.setState({
                loading: { ...this.state.loading, [key]: false },
                alarmExportDisable: false,
                dataSource: [],
            });
            this.loadingState[key] = false;
            // return Promise((resolve) => {
            //     resolve({
            //         data: [],
            //         success: false,
            //         total: 0,
            //     });
            // });
            const datas = new Promise((resolve) => {
                resolve({
                    data: [],
                    success: true,
                    total: 0,
                });
            });
            return datas;
        }
        search[key].collapsed = true;
        this.loadingState[key] = true;
        loading[key] = true;
        this.setState({ search, loading });
        const { dataSourceAdapter, columnsAdapter } = this.adapter[key];
        // formParams 需要保存一下，供dataSourceAdapter._getAlarm 调用时重新注册使用
        let condition = formParams;
        if (this.state.customQuery && this.state.customFilterId !== -1) {
            // customFilterId;
            condition.filter_id = { operator: 'in', value: this.state.customFilterId };
        }
        // if (condition.professional_type && !condition.eqp_object_class) {
        //     condition.eqp_object_class = {
        //         operator: 'in',
        //         value: this.typesDataList?.eqp_object_class?.map((item) => item.value) || [],
        //     };
        // }
        if (condition.is_undistributed_send_status) {
            if (condition.is_undistributed_send_status.value === '-1') {
                if (!condition.sheet_no) {
                    condition.sheet_no = {
                        operator: 'not_null',
                        value: 'IS_NOT_NULL',
                    };
                }
            } else {
                if (!condition.sheet_no) {
                    condition.sheet_no = {
                        operator: 'null',
                        value: 'IS_NULL',
                    };
                }
            }
            condition = _omit(condition, ['is_undistributed_send_status']);
        }

        this.formParamsStore[key] = condition;

        if (this.props.mode === 'alarm-window') {
            condition = this.props.condition;
            if (Object.keys(condition).length === 0) {
                return new Promise((resolve) => {
                    resolve(0);
                });
            }
        }
        if (condition.province_region_city) {
            if (condition.province_region_city.value.length > 0) {
                let list = [[], [], []];
                condition.province_region_city.value.forEach((item) => {
                    item?.forEach((item, index) => {
                        list[index] = [...list[index], item];
                    });
                });
                let data = list
                    .filter((item) => item.length > 0)
                    .map((item) => {
                        let listSet = new Set(item);
                        return [...listSet];
                    });
                condition.province_region_city.value = [...data];
            }
        }
        return dataSourceAdapter
            .getAlarmData(condition, this.queryType[key], columnsAdapter, this.showInTableColumns[key], pageSize)
            .then((data) => {
                if (data !== 'RegisterError') {
                    // this.setState({});
                    const total = dataSourceAdapter.pageConfig.totalCount;
                    // let pagination = this.state.pagination[key];
                    // pagination['total'] = total;

                    // let pagination = this.state.pagination;
                    // pagination[key]['total'] = total;

                    this.setState({
                        dataSource: { ...this.state.dataSource, [key]: data },
                        pagination: { ...this.state.pagination, [key]: { ...this.state.pagination[key], total } },
                        loading: { ...this.state.loading, [key]: false },
                        alarmExportDisable: false,
                    });
                    this.loadingState[key] = false;
                    return {
                        data,
                        success: true,
                        total,
                    };
                }
                this.loadingState[key] = false;
                return {
                    data: [],
                    success: false,
                    total: 0,
                };
            })
            .catch(() => {
                this.loadingState[key] = false;
                this.setState({
                    dataSource: [],
                });
                return {
                    data: [],
                    success: false,
                    total: 0,
                };
            });
    }
    setColumnsStateMap(key, map) {
        this.setState({ columnsStateMap: { ...this.state.columnsStateMap, [key]: map } });
    }
    setHeaderRow(key, column) {
        this.adapter[key].dataSourceAdapter.setHeaderRow(column);
    }
    setCollapsed(key) {
        const { search } = this.state;
        if (!this.initCollapsed[key] && search[key].collapsed === false) {
            this.initCollapsed[key] = true;
            this.setState({
                search: { ...search, [key]: { ...search[key], collapsed: true } },
            });
        }
    }
    // componentDidMount() {}
    onTabsChange(activeKey) {
        this.setState({
            activeKey,
        });
    }
    menuClick = ({ item, key, keyPath }) => {
        console.log(key);
        if (key === '1') {
            sendLogFn({ authKey: 'workbenches:generalQuery' });
        } else if (key === '2') {
            sendLogFn({ authKey: 'workbenches:filterQuery' });
        }

        if (this.state.operId) {
            logNew('告警查询', this.state.operId);
        } else {
            logNew('监控工作台告警查询', '300005');
        }
        if (keyPath[1] === 'customQuery') {
            const columnsState = this.state.columns;
            customQueryDetail(item?.props?.viewId, this.props.login).then(({ columns, customFilterId, columnTemplateId }) => {
                const _columns = { ...columnsState, [key]: columns };
                this.setState({
                    activeKey: key,
                    columns: _.cloneDeep(_columns),
                    customFilterId,
                    customQuery: true,
                    columnTemplateId,
                });
            });
        } else {
            if (key === '1') {
                this.firstEnter = true;
                this.getInitConfig();
                return;
            }
            this.setState({
                activeKey: key,
                customFilterId: null,
                customQuery: false,
                columnTemplateId: defaultOption.templateId,
                alarmExportDisable: true, // 切换后进入未查询状态，禁用新建 导出任务
            });
        }
    };
    onSearchCollapse = (collapsed) => {
        this.setState({
            scrollY: collapsed ? window.innerHeight - 348 : window.innerHeight - 404,
        });
    };
    alarmColumnChange = ({ showInTableColumns, columnsStateMap, width }) => {
        // columns 只在这里取一次数据；
        // columns 查询表单的 sql下沉文件名
        // 暂存以来，列模板改变时使用
        const { activeKey } = this.state;
        const columns = this.showInSearchColumns[activeKey];

        const columnsState = _.cloneDeep(this.state.columns);
        const columnsStateMapState = _.cloneDeep(this.state.columnsStateMap);
        const scrollState = _.cloneDeep(this.state.scroll);

        // columns.mapperId = 'alarmQuery';
        // 暂存 起来供业务查询定制、和查询数据使用
        this.showInTableColumns[activeKey] = showInTableColumns;
        columnsState[activeKey] = columns.concat(showInTableColumns);
        columnsStateMapState[activeKey] = columnsStateMap;
        scrollState[activeKey] = { x: width };
        this.setState({
            columns: columnsState,
            columnsStateMap: columnsStateMapState,
            scroll: scrollState,
            showInTableColumns,
        });
    };
    alarmQueryMenuOptions = (menuOption, menuName, viewId) => {
        this.setState({ visibleSortDrag: true, menuOption, menuName, viewId });
    };
    ModalHandleOk = () => {
        this.setState({ visibleSortDrag: false });
    };
    ModalHandleCancel = () => {
        this.setState({ visibleSortDrag: false });
    };
    searchFormSet = (selectOptions) => {
        const { activeKey } = this.state;
        const searchColumns = this.showInSearchColumns[activeKey];
        const tableColumns = this.showInTableColumns[activeKey];
        // {
        //     id: 1,
        //     name: '',
        //     field: 'zhangsan',
        // },
        const dragSelectOptions = _.cloneDeep(this.state.dragSelectOptions);
        dragSelectOptions[activeKey] = selectOptions;

        const dataIndexArr = selectOptions.map((opt) => {
            return opt.field;
        });
        const search = searchColumns.filter((item) => {
            return dataIndexArr.indexOf(item.dataIndex) >= 0;
        });
        const columnsState = _.cloneDeep(this.state.columns);
        columnsState[activeKey] = search.concat(tableColumns);
        this.setState({ columns: columnsState, dragSelectOptions });
    };
    /**
     *
     * @param {*} filterType 联动filterId
     */
    onFilterTypeChange = (filterType) => {
        // let columnsIndex = this.state.columns.findIndex((column) => column.dataIndex === 'filter_id');
        // let columns = cloneDeep(this.state.columns);
        // let column = columns[columnsIndex];
        // column['filterType'] = filterType;
        // columns[columnsIndex] = column;
        // this.setState({ columns });

        let { columns, activeKey } = this.state;
        const searchColumns = this.showInSearchColumns[activeKey];
        const tableColumns = this.showInTableColumns[activeKey];
        const columnsIndex = searchColumns.findIndex((column) => column.dataIndex === 'filter_id');
        // let column = searchColumns[columnsIndex];
        // column['filterType'] = filterType;
        searchColumns[columnsIndex].filterType = filterType;
        this.showInSearchColumns[activeKey] = searchColumns;
        columns[activeKey] = searchColumns.concat(tableColumns);
        columns = _.cloneDeep(columns);
        this.setState({ columns });
    };
    onFieldTypeChange = (filterType, fieldKey, value) => {
        let { columns, activeKey } = this.state;
        const searchColumns = this.showInSearchColumns[activeKey];
        const tableColumns = this.showInTableColumns[activeKey];
        const columnsIndex = searchColumns.findIndex((column) => column.dataIndex === fieldKey);
        // let column = searchColumns[columnsIndex];
        // column['filterType'] = filterType;
        searchColumns[columnsIndex].fieldType = filterType;
        searchColumns[columnsIndex].fieldValue = value;
        this.showInSearchColumns[activeKey] = searchColumns;
        columns[activeKey] = searchColumns.concat(tableColumns);
        columns = _.cloneDeep(columns);
        this.setState({ columns });
    };
    onTypesDataList = (type, data) => {
        this.typesDataList = {
            ...this.typesDataList,
            [type]: data,
        };
    };
    /**
     *
     * @param {*} isSendStatus 联动 sendStatus
     */
    onIsSendStatusChange = (isSendStatus) => {
        let { columns, activeKey } = this.state;
        const searchColumns = this.showInSearchColumns[activeKey];
        const tableColumns = this.showInTableColumns[activeKey];
        const columnsIndex = searchColumns.findIndex((column) => column.dataIndex === 'send_status');
        const column = searchColumns[columnsIndex];
        const columnsSheetNoIndex = searchColumns.findIndex((column) => column.dataIndex === 'sheet_no');
        const columnSheet = searchColumns[columnsSheetNoIndex];
        switch (isSendStatus) {
            case 0:
            case '0':
                column.disabled = true;
                columnSheet.disabled = true;
                break;
            default:
                column.disabled = false;
                column.cascade = true;
                columnSheet.disabled = false;
                columnSheet.cascade = true;
                break;
        }
        searchColumns[columnsSheetNoIndex] = columnSheet;
        searchColumns[columnsIndex] = column;
        this.showInSearchColumns[activeKey] = searchColumns;
        columns[activeKey] = searchColumns.concat(tableColumns);
        columns = _.cloneDeep(columns);
        this.setState({ columns });
    };
    sendStatusCascadeSwitch = (cascade) => {
        let { columns, activeKey } = this.state;
        const searchColumns = this.showInSearchColumns[activeKey];
        const tableColumns = this.showInTableColumns[activeKey];
        const columnsIndex = searchColumns.findIndex((column) => column.dataIndex === 'send_status');
        const column = searchColumns[columnsIndex];
        column.cascade = cascade;
        searchColumns[columnsIndex] = column;
        this.showInSearchColumns[activeKey] = searchColumns;
        columns[activeKey] = searchColumns.concat(tableColumns);
        columns = _.cloneDeep(columns);
        this.setState({ columns });
    };
    collapsedHandle = () => {
        this.setState({ menuCollapsed: !this.state.menuCollapsed });
    };
    getAlarmToolBarActive = () => {
        const { alarmToolBarActive } = this.props;
        if (alarmToolBarActive) {
            return alarmToolBarActive;
        }
        return constants.version === 'unicom' ? ['ColumnSettings', 'tableSize'] : null;
    };

    // onSheetTypeChange = (columnSearch, value) => {
    //     let { columns } = this.state;
    //     const { activeKey } = this.state;
    //     const searchColumns = this.showInSearchColumns[activeKey];
    //     const tableColumns = this.showInTableColumns[activeKey];
    //     const columnsIndex = searchColumns.findIndex((column) => column.dataIndex === 'new_send_status');
    //     const column = searchColumns[columnsIndex];

    //     const columnsSheetStatusIndex = searchColumns.findIndex((columnTemp) => columnTemp.dataIndex === 'new_sheet_status');
    //     const columnSheet = searchColumns[columnsSheetStatusIndex];

    //     const sendStatusOptionsMap = {
    //         1: 52,
    //         6: 367,
    //         7: 424,
    //     };
    //     const sheetStatusOptionsMap = {
    //         1: 55,
    //         6: 366,
    //         7: 423,
    //     };
    //     // const temp1 = columnSearch?.[sendStatusOptionsMap[value]];

    //     // const temp2 = columnSearch?.[sheetStatusOptionsMap[value]];

    //     // column.fieldEnum = _.uniqBy(temp1, 'dCode').map((item) => ({ key: item.dCode, value: item.dName }));
    //     // columnSheet.fieldEnum = _.uniqBy(temp2, 'dCode').map((item) => ({ key: item.dCode, value: item.dName }));
    //     column.type = sendStatusOptionsMap[value];
    //     columnSheet.type = sheetStatusOptionsMap[value];

    //     searchColumns[columnsIndex] = column;
    //     searchColumns[columnsSheetStatusIndex] = columnSheet;
    //     this.showInSearchColumns[activeKey] = searchColumns;
    //     columns[activeKey] = searchColumns.concat(tableColumns);
    //     columns = _.cloneDeep(columns);
    //     this.setState({ columns });
    // };

    render() {
        const {
            onSubmit,
            onChange,
            setColumnsStateMap,
            setHeaderRow,
            alarmColumnChange,
            alarmQueryMenuOptions,
            alarmExport,
            alarmExportWithMoreCondition,
            collapsedHandle,
            getAlarmToolBarActive,
        } = this;
        const {
            initConfig,
            columnsStateMap,
            activeKey,
            dataSource,
            columns,
            search,
            scroll,
            pagination,
            // loading,
            scrollY,
            showInTableColumns,
            alarmExportLoading,
            alarmExportDisable,
            menuCollapsed,
            seacrhFlag,
        } = this.state;
        this.showInSearchColumns[activeKey] = columns[activeKey];
        // const baseWith = constants.version === 'unicom' ? 135 : 260;
        let menuCls = 'alarm-query-container-menu';
        const protableSearchCls = 'oss-imp-alarm-protable-search';
        let collapsedContainerCls = 'oss-imp-alarm-collapsed-container oss-imp-alarm-collapsed-container-open';
        if (constants.version === 'unicom') {
            menuCls = 'alarm-query-container-menu-unicom';
        }
        if (this.props.mode === 'alarm-window') {
            menuCls = 'alarm-query-container-menu-window';
            // protableSearchCls = 'oss-imp-alarm-protable-search-window';
        }
        if (menuCollapsed) {
            collapsedContainerCls = 'oss-imp-alarm-collapsed-container oss-imp-alarm-collapsed-container-close';
        }
        // this.props.mode === 'alarm-window' ? { display: 'none' } : { width: `${baseWith}px`, marginRight: '10px' };
        // const tableStyle = this.props.mode === 'alarm-window' ? { width: 'calc(100% - 20px)' } : null;
        // if (constants.version === 'unicom') {
        //     protableSearchCls = 'oss-imp-alarm-protable-search oss-imp-alarm-protable-search-unicom';
        // }
        const totalCount = this.adapter[this.state.activeKey]?.dataSourceAdapter?.pageConfig?.totalCount;
        const sessionId = this.adapter[this.state.activeKey]?.dataSourceAdapter?._sessionId;
        const toolBar = getAlarmToolBarActive();
        const {
            login: { userId },
        } = this.props;
        return (
            <PageContainer showHeader={false} divider={false} title="告警查询">
                {this.state.visibleSortDrag && (
                    <SortDrag
                        visibleSortDrag={this.state.visibleSortDrag}
                        activeKey={activeKey}
                        onOk={this.ModalHandleOk}
                        onCancel={this.ModalHandleCancel}
                        getInitConfig={this.getInitConfig}
                        menuOption={this.state.menuOption}
                        menuName={this.state.menuName}
                        viewId={this.state.viewId}
                        searchFormSet={this.searchFormSet}
                        selectOptions={this.state.dragSelectOptions[activeKey]}
                        allOptions={this.state.dragAllOptions['1']}
                    />
                )}
                {!this.state.visibleSortDrag && !_.isEmpty(initConfig) && (
                    <div className="alarm-query-container" style={{}}>
                        {!menuCollapsed && (
                            <div className={menuCls}>
                                <Menu
                                    mode="inline"
                                    // inlineCollapsed={menuCollapsed}
                                    selectedKeys={[activeKey]}
                                    onClick={this.menuClick}
                                    style={{ height: '100%' }}
                                >
                                    {this.state.initConfig
                                        .filter((item) => {
                                            return item.queryType !== 'customQuery';
                                        })
                                        .map(({ tab, key }) => {
                                            const type = key === '2' ? 'FilterOutlined' : 'CalendarOutlined';
                                            return (
                                                <Menu.Item key={key} icon={<Icon antdIcon={true} type={type} />}>
                                                    {tab}
                                                </Menu.Item>
                                            );
                                        })}
                                    {constants.version !== 'unicom'
                                        ? [
                                              <Menu.SubMenu
                                                  key="customQuery"
                                                  icon={<Icon antdIcon={true} type="CalendarOutlined" />}
                                                  title="业务定制查询"
                                              >
                                                  {this.state.initConfig
                                                      .filter((item) => {
                                                          return item.queryType === 'customQuery';
                                                      })
                                                      .map(({ tab, key, id: viewId, menuOptions = ['del', 'edit'] }) => {
                                                          return (
                                                              <Menu.Item
                                                                  className="custom-query-menu-item"
                                                                  //   style={{ display: 'flex', alignItems: 'center' }}
                                                                  key={key}
                                                                  viewId={viewId}
                                                              >
                                                                  <Icon antdIcon={true} type="CalendarOutlined" />
                                                                  <Tooltip title={tab}>
                                                                      <span
                                                                          className="custom-query-menu-name"
                                                                          //   style={{ textOverflow: 'ellipsis', display: 'inline-block', overflow: 'hidden' }}
                                                                      >
                                                                          {tab}
                                                                      </span>
                                                                  </Tooltip>

                                                                  <div className="alarm-query-opt-icon">
                                                                      {menuOptions.map((option, index) => {
                                                                          // 'del', 'edit' ,'add'
                                                                          // alarmQueryMenuOptions_del
                                                                          let label = '操作';
                                                                          let iconType = 'EditOutlined';
                                                                          switch (option) {
                                                                              case 'edit':
                                                                                  label = '编辑';
                                                                                  iconType = 'EditOutlined';
                                                                                  break;
                                                                              case 'del':
                                                                                  label = '删除';
                                                                                  iconType = 'DeleteOutlined';
                                                                                  break;
                                                                              case 'down':
                                                                                  label = '下载';
                                                                                  iconType = 'DownloadOutlined';
                                                                                  break;
                                                                              case 'add':
                                                                              default:
                                                                                  label = '增加';
                                                                                  break;
                                                                          }
                                                                          return (
                                                                              <Popover key={index} trigger="hover" content={label}>
                                                                                  <Icon
                                                                                      antdIcon={true}
                                                                                      type={iconType}
                                                                                      style={{ fontSize: '15px' }}
                                                                                      onClick={(e) => {
                                                                                          alarmQueryMenuOptions(`${option}`, `${tab}`, `${viewId}`);
                                                                                          e.stopPropagation();
                                                                                          e.preventDefault();
                                                                                      }}
                                                                                  />
                                                                              </Popover>
                                                                          );
                                                                      })}
                                                                  </div>
                                                              </Menu.Item>
                                                          );
                                                      })}
                                              </Menu.SubMenu>,
                                              <Menu.Item key="alarm-query-add-menu">
                                                  <Button
                                                      className="alarm-query-add-button"
                                                      // style={{ width: '100%' }}
                                                      type="link"
                                                      icon={
                                                          <Icon
                                                              className="alarm-query-add-button-icon"
                                                              antdIcon={true}
                                                              type="PlusOutlined"
                                                              style={{ fontSize: '20px' }}
                                                          />
                                                      }
                                                      onClick={(e) => {
                                                          alarmQueryMenuOptions('add');
                                                          e.stopPropagation();
                                                          e.preventDefault();
                                                      }}
                                                  />
                                              </Menu.Item>,
                                          ]
                                        : null}
                                </Menu>
                            </div>
                        )}

                        <div className={collapsedContainerCls}>
                            <Button
                                className="oss-imp-alarm-collapsed-btn"
                                onClick={collapsedHandle}
                                type="text"
                                icon={
                                    <Icon
                                        className="oss-imp-alarm-collapsed-btn-icon"
                                        antdIcon={true}
                                        type={menuCollapsed ? 'DoubleRightOutlined' : 'DoubleLeftOutlined'}
                                        style={{ fontSize: '12px' }}
                                    />
                                }
                            />
                        </div>

                        {/* <div style={tableStyle} className="oss-imp-alarm-protable-search"> */}
                        <div className={protableSearchCls}>
                            {!this.state.visibleSortDrag && (
                                <SearchProtable
                                    // ref={this.searchProtableRef}
                                    alarmQueryMode={this.props.mode}
                                    alarmWindowModeCondChange={this.state.alarmWindowModeCondChange}
                                    type="alarm-query"
                                    // type="alarm-report"
                                    showSearchPanel={this.props.mode !== 'alarm-window'}
                                    search={
                                        this.props.search || {
                                            onCollapse: this.onSearchCollapse,
                                            span: search[activeKey]?.span ? search[activeKey]?.span : 8,
                                            labelWidth: search[activeKey]?.labelWidth ? search[activeKey]?.labelWidth : 80,
                                            colSize: search[activeKey]?.colSize ? search[activeKey]?.colSize : 1,
                                        }
                                    }
                                    seacrhFlag={seacrhFlag}
                                    dataSource={dataSource[activeKey]}
                                    key={activeKey}
                                    id={activeKey}
                                    options={{ reload: true, setting: true, fullScreen: false }}
                                    columns={columns[activeKey]}
                                    showInTableColumns={showInTableColumns}
                                    columnsStateMap={columnsStateMap[activeKey]}
                                    // searchConfig={search[activeKey]}
                                    scroll={{ x: scroll[activeKey]?.x ?? null, y: scrollY }}
                                    pagination={pagination[activeKey]}
                                    loading={this.loadingState[activeKey]}
                                    onSubmit={onSubmit}
                                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                                    onChange={onChange}
                                    setHeaderRow={setHeaderRow}
                                    setColumnsStateMap={setColumnsStateMap}
                                    operId={!this.props.search ? this.props.operId : null}
                                    toolBarRender={() => {
                                        const toolbarButton = [
                                            <AlarmColumn
                                                key="alarmColumn"
                                                width={260}
                                                label={'列模板：'}
                                                getAlarmColumn={this.state.getAlarmColumn}
                                                alarmColumnChange={alarmColumnChange}
                                                columnTemplateId={this.state.columnTemplateId}
                                            />,
                                        ];
                                        if (constants.version === 'unicom') {
                                            toolbarButton.push(
                                                <AlarmExportButton
                                                    html={false}
                                                    sessionId={sessionId}
                                                    userId={userId}
                                                    loading={alarmExportLoading}
                                                    onExport={alarmExportWithMoreCondition}
                                                    exportDisable={alarmExportDisable}
                                                    totalCount={totalCount}
                                                    exportDisableMsg="请先查询数据成功再执行导出"
                                                />,
                                            );
                                        }
                                        return <section className="alarm-query-toolbar-render-container">{toolbarButton}</section>;
                                    }}
                                    alarmToolBarActive={toolBar}
                                    alarmExport={alarmExport}
                                    onIsSendStatusChange={this.onIsSendStatusChange}
                                    onFilterTypeChange={this.onFilterTypeChange}
                                    onFieldTypeChange={this.onFieldTypeChange}
                                    onTypesDataList={this.onTypesDataList}
                                    sendStatusCascadeSwitch={this.sendStatusCascadeSwitch}
                                    // onSheetTypeChange={this.onSheetTypeChange}
                                />
                            )}
                        </div>
                    </div>
                )}
            </PageContainer>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
