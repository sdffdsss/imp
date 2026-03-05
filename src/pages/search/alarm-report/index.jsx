// import locales from "locales";
import React from 'react';
import { Button, Menu, Icon } from 'oss-ui';

import LeftMenu from './components/LeftMenu/index';
import DetailModal from './components/DetailModal/index';

import request from '@Common/api';
import constants from '@Common/constants';
import SearchProtable from '../../search/alarm-query/alarm-query-protable/';
import ConvertValueType from './common/convert/valueType';
import ConvertDefaultValue from './common/convert/defaultValue';
import Version from '@Common/path/getVersion';
import DataSourceAdapter from './common/adaper/adapter_dataSource';
import XmlAdapter from './common/adaper/adapter_xml';
import ExportXlsx from './common/export';
import PageContainer from '../../../components/page-container';

let protableKey = new Date().getTime();
let reportTitleContant = '';
export default class Index extends React.PureComponent {
    constructor(prop) {
        super(prop);
        this.onTabsChange = this.onTabsChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setHeaderRow = this.setHeaderRow.bind(this);
        this.setColumnsStateMap = this.setColumnsStateMap.bind(this);
        // this.initWidth = this.initWidth.bind(this);
        this.xmlAdapter = null;
        this.dataSourceAdapter = new DataSourceAdapter();
        this.state = {
            initConfig: [],
            activeKey: '1',
            search: {},
            loading: false,
            columns: [],
            columnsStateMap: {},
            dataSource: [],
            scroll: {},
            pagination: { pageSize: this.dataSourceAdapter.pageConfig.pageSize },

            drawerVisible: false,

            currentReport: '',

            reportMenus: null,
            reportMenuSelectedKeys: [],
            reportMenuOpenKeys: [],

            headerTitle: '',

            modalVisible: false,
            modalRecord: [],
            detailModalKey: new Date().getTime(),
            detailTitle: '',
            detaildbName: '',
            detailSql: {},
            detailCountSql: '',
            DetailColumns: [],
            DetailWhereCondition: '',
            scrollY: window.innerHeight - 348
        };

        this.formParams = {};
        this.initCollapsed = false;
        this.searchCollapseHeight = {};
        this.searchSpreadHeight = {};
        this.searchItemNum = {};

        this.convertDefaultValue = new ConvertDefaultValue();

        this.sql = '';
        this.countsql = '';
        this.paramsMode = {};

        this.protableContainer = React.createRef();
    }
    componentDidMount() {
        this.xmlAdapter = new XmlAdapter();
        this.getReportMenuData().then((menuData) => {
            const {
                reportMenus = null,
                reportMenuSelected: { keyPath }
            } = this.getReportMenu(menuData, '0');
            // 首次加载页面， 被选和被打开的菜单pathKeys 是同一个
            this.rootSubmenuKeys = this.getRootSubmenuKeys({ reportMenus });
            this.setState({
                reportMenus,
                reportMenuSelectedKeys: keyPath,
                reportMenuOpenKeys: keyPath
            });
            const selectedRptKey = [].concat(keyPath).pop().split('-').pop();

            this.getReportConfigByKey(selectedRptKey).then(
                ({ ReportTitle, sql, countsql, Conditions, Columns, detailSql, detailCountSql, DetailColumns, DetailColumns_group }) => {
                    const columns = this.convertColumns({
                        Conditions,
                        Columns,
                        detailSql,
                        detailCountSql,
                        DetailColumns,
                        DetailColumns_group
                    });
                    const headerTitle = this.getHeaderTitle(ReportTitle);
                    this.sql = sql;
                    this.countsql = countsql;
                    this.setState({ headerTitle, columns });
                }
            );
        });
        // throw new Error('手动抛出异常');
    }
    getRootSubmenuKeys = ({ reportMenus = [] }) => {
        const _rootSubmenuKeys = [];
        for (const it of reportMenus) {
            const {
                props: { children = [] }
            } = it;
            if (children.length > 0) {
                _rootSubmenuKeys.push(it.key);
            }
        }
        return _rootSubmenuKeys;
    };
    getReportMenu = (menuData, keyPrefix) => {
        const reportMenus = menuData.menuItem.map((menu, index) => {
            let key = `${keyPrefix}-${index}`;
            if (menu.menuItem) {
                const reportMenuItem = this.getReportMenu(menu, key);
                return {
                    reportMenus: (
                        <Menu.SubMenu key={key} title={menu.fileName}>
                            {reportMenuItem.reportMenus}
                        </Menu.SubMenu>
                    ),
                    reportMenuSelected: reportMenuItem.reportMenuSelected
                };
            }
            key = `${keyPrefix}-${menu.textName}`;
            return {
                reportMenus: <Menu.Item key={key}>{menu.fileName}</Menu.Item>,
                reportMenuSelected: menu.active ? { key, name: menu.fileName } : null
            };
        });
        const reportMenu = reportMenus.map((item) => {
            return item.reportMenus;
        });
        const selected =
            reportMenus.find((item) => {
                return item.reportMenuSelected != null;
            }) || {};
        let { reportMenuSelected = null } = selected;
        if (keyPrefix === '0') {
            reportMenuSelected = this.convertSelectedKeyPath(reportMenuSelected);
        }
        return { reportMenus: reportMenu, reportMenuSelected };
    };
    convertSelectedKeyPath = ({ key = '', name = '' }) => {
        const selectedKeyPath = [];
        if (key.length > 0) {
            const allIndex = key.split('-'); // .slice(1)
            for (const i in allIndex) {
                if (i !== '0') {
                    selectedKeyPath.push(allIndex.slice(0, Number(i) + 1).join('-'));
                }
            }
        }
        return { keyPath: selectedKeyPath, name };
    };
    getReportMenuData = () => {
        return request('', {
            fullUrl: `${constants.IMP_ALARM_REPORT}/menu/reportMenu${Version}.json`,
            type: 'get'
        });
    };

    onChange(key, { current, pageSize }) {
        const { dataSourceAdapter, sql = '' } = this;
        const { dbName, sqlId } = sql;
        try {
            return dataSourceAdapter
                .queryDataSourceByPage({ dbName, sqlId, pageSize, current })
                .then((records) => {
                    const dataSource =
                        records?.data?.data ??
                        [].map((dataItem) => {
                            const convert = {};
                            for (const iterator in dataItem) {
                                // 驼峰转下划线 （数字不认为是驼峰）
                                convert[iterator.replace(/([A-Z])/g, '_$1').toLowerCase()] = dataItem[iterator];
                            }
                            return convert;
                        });
                    this.setState({
                        dataSource,
                        pagination: {
                            ...this.state.pagination,
                            current,
                            pageSize
                        }
                    });
                    return {
                        data: dataSource,
                        success: true,
                        total: this.state.pagination.total
                    };
                })
                .catch(() => {
                    return {
                        data: [],
                        success: false,
                        total: 0
                    };
                });
        } catch (error) {
            console.error(error);
        }
    }
    onSubmit(key, formParams = {}) {
        // 收缩查询表单
        const { search } = this.state;
        this.setState({
            search: {
                ...search,
                collapsed: true
            },
            loading: true
        });
        const { dataSourceAdapter, sql = '', countsql = '' } = this;
        return dataSourceAdapter
            .queryDataSource(formParams, sql, countsql)
            .then((data) => {
                if (data !== 'Error') {
                    const total = dataSourceAdapter.pageConfig.totalCount;
                    this.setState({
                        dataSource: data,
                        pagination: { ...this.state.pagination, total },
                        loading: false
                    });
                    return {
                        data,
                        success: true,
                        total
                    };
                }
                return {
                    data: [],
                    success: true,
                    total: 0
                };
            })
            .catch(() => {
                return {
                    data: [],
                    success: false,
                    total: 0
                };
            });
        // setTimeout(() => {
        //     this.setState({
        //         loading: false,
        //     });
        // }, 5000);
    }
    setColumnsStateMap(key, map) {
        this.setState({ columnsStateMap: { ...this.state.columnsStateMap, [key]: map } });
    }
    setHeaderRow(key, column) {
        // this.adapter[key].dataSourceAdapter.setHeaderRow(column);
    }
    setCollapsed(key) {
        const { search } = this.state;
        if (!this.initCollapsed && search.collapsed === false) {
            this.initCollapsed = true;
            this.setState({
                search: { ...search, collapsed: true }
            });
        }
    }
    // componentDidMount() {}
    onTabsChange(activeKey) {
        this.setState({
            activeKey
        });
    }
    onDrawerMenuClick = ({ item, key = '', keyPath = [], domEvent }) => {
        protableKey = new Date().getTime();
        this.setState({ reportMenuSelectedKeys: keyPath });
        this.getReportConfigByKey(key.split('-').pop()).then(
            ({ ReportTitle, sql, countsql, Conditions, Columns, detailSql, detailCountSql, DetailColumns, DetailColumns_group }) => {
                const detailTitle = `${ReportTitle}详情`;
                const columns = this.convertColumns({
                    Conditions,
                    Columns,
                    detailTitle,
                    detailSql,
                    detailCountSql,
                    DetailColumns,
                    DetailColumns_group
                });
                const headerTitle = this.getHeaderTitle(ReportTitle);
                this.sql = sql;
                this.countsql = countsql;
                this.setState({ headerTitle, columns, dataSource: [], drawerVisible: false });
            }
        );
    };
    onDrawerMenuOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find((key) => this.state.reportMenuOpenKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ reportMenuOpenKeys: openKeys });
        } else {
            this.setState({
                reportMenuOpenKeys: latestOpenKey ? [latestOpenKey] : []
            });
        }
    };
    getHeaderTitle = (reportTitle) => {
        reportTitleContant = reportTitle;
        return <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{reportTitle}</span>;
    };
    convertColumns = ({
        Conditions = [],
        Columns = [],
        // detailTitle = '详情',
        // detailSql,
        // detailCountSql = '',
        // DetailColumns = [],
        DetailColumns_group
    }) => {
        const _columns = [];
        const { columnRender } = this;
        for (const it of Conditions) {
            const { Name = '', Flag = '', ControlType = '', DefaultValue, DbName = null, sqlId = '' } = it;
            const { [ControlType]: valueType = 'text' } = ConvertValueType;
            const defaultValue = this.convertDefaultValue.mapping({ DefaultValue, ControlType });
            const column = {
                hideInTable: true,
                dataIndex: Flag,
                valueType,
                title: Name,
                fieldSql: sqlId,
                mapperId: 'reportSql'
            };
            if (defaultValue) {
                column.defaultValue = { value: defaultValue };
            }
            if (ControlType === 'MutiDropDown') {
                column.fieldMode = 'multiple';
            }
            if (DbName) {
                column.dbName = DbName;
            }
            _columns.push(column);
        }
        for (const it of Columns) {
            const { FieldName = '', DisplayName = '', IsSort = false, IsHasDetail, DetailWhereCondition, Width } = it;
            const columnItem = {
                hideInSearch: true,
                dataIndex: FieldName,
                title: DisplayName,
                IsSort,
                Width,
                mapperId: 'reportSql'
            };
            // DetailDbName, DetailSqlId, DetailCountSql, DetailCol;
            const { Title, DetailDbName, DetailSqlId, DetailCountSqlId, DetailCol } = DetailColumns_group?.[FieldName] ?? {};

            if (IsHasDetail && DetailSqlId && DetailCountSqlId && DetailCol.length > 0) {
                columnItem.render = columnRender.bind(this, Title, DetailDbName, DetailSqlId, DetailCountSqlId, DetailCol, DetailWhereCondition);
                columnItem.DetailWhereCondition = DetailWhereCondition;
            }
            _columns.push(columnItem);
        }
        return _columns;
    };
    columnRender = (detailTitle, detaildbName, detailSql, detailCountSql, DetailColumns, DetailWhereCondition, text, record, index, action) => {
        let buttonText = text;
        if (typeof buttonText === 'object') {
            buttonText = buttonText?.props?.title ? buttonText?.props?.title : buttonText?.props?.children;
        }

        return (
            <Button
                type="link"
                dataSet
                onClick={this.showDetail.bind(
                    this,
                    record,
                    detailTitle,
                    detaildbName,
                    detailSql,
                    detailCountSql,
                    DetailColumns,
                    DetailWhereCondition
                )}
            >
                {buttonText}
            </Button>
        );
    };
    showDetail = (record, detailTitle, detaildbName, detailSql, detailCountSql, DetailColumns, DetailWhereCondition) => {
        this.setState({
            modalVisible: true,
            modalRecord: record,
            detailModalKey: new Date().getTime(),
            detailTitle,
            detaildbName,
            detailSql,
            detailCountSql,
            DetailColumns,
            DetailWhereCondition
        });
    };
    modalHandleOk = (event) => {
        this.setState({ modalVisible: false });
    };
    modalHandleCancel = (event) => {
        this.setState({ modalVisible: false });
    };
    getReportConfigByKey = (key) => {
        const fullUrl = `${constants.IMP_ALARM_REPORT}/${key}.xml`;
        return this.xmlAdapter.loadXml({ fullUrl });
    };
    onSearchCollapse = (collapsed) => {
        this.setState({
            scrollY: collapsed ? window.innerHeight - 348 : window.innerHeight - 404
        });
    };
    exportTable = (formParams = {}) => {
        // 收缩查询表单
        let { search, loading, columns } = this.state;
        // if (loading) {
        //     return;
        // }
        search.collapsed = true;
        loading = true;
        this.setState({ search, loading });
        const { dataSourceAdapter, sql = '' } = this;
        dataSourceAdapter
            .queryDataSourceExport(formParams, sql)
            .then((data) => {
                if (data !== 'Error') {
                    this.setState({
                        loading: false
                    });
                    ExportXlsx(data, columns, reportTitleContant);
                }
            })
            .catch(() => {});
    };
    render() {
        const { onDrawerMenuClick, onDrawerMenuOpenChange } = this;
        const { reportMenuSelectedKeys, reportMenuOpenKeys, reportMenus } = this.state;

        const { onSubmit, onChange, setColumnsStateMap, setHeaderRow } = this;
        const { headerTitle, dataSource, columns, pagination, loading } = this.state;

        const {
            modalVisible,
            modalRecord,
            detailModalKey,
            detailTitle,
            detaildbName,
            detailSql,
            detailCountSql,
            DetailColumns,
            DetailWhereCondition,
            scrollY
        } = this.state;
        const xWidth =
            columns &&
            columns.reduce((total, item) => {
                return item.hideInSearch ? total + item.Width : total;
            }, 0);
        return (
            <PageContainer divider={false} title="告警统计" showHeader={false}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ width: '240px', marginRight: '10px' }}>
                        <LeftMenu
                            onDrawerMenuClick={onDrawerMenuClick}
                            onDrawerMenuOpenChange={onDrawerMenuOpenChange}
                            reportMenuSelectedKeys={reportMenuSelectedKeys}
                            reportMenuOpenKeys={reportMenuOpenKeys}
                            reportMenus={reportMenus}
                        ></LeftMenu>
                    </div>
                    <div style={{ width: 'calc(100% - 260px)' }} className="oss-imp-alarm-protable-search">
                        <SearchProtable
                            type="alarm-report"
                            id={protableKey}
                            needUpdate={true}
                            headerTitle={headerTitle}
                            dataSource={dataSource}
                            columns={columns}
                            options={false}
                            // columnsStateMap={columnsStateMap}
                            // searchConfig={search}
                            scroll={{ x: xWidth, y: scrollY }}
                            pagination={pagination}
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                            // pageSize={pageSize}
                            loading={loading}
                            onSubmit={onSubmit}
                            onChange={onChange}
                            setHeaderRow={setHeaderRow}
                            setColumnsStateMap={setColumnsStateMap}
                            search={{
                                onCollapse: this.onSearchCollapse,
                                span: 8,
                                optionRender: ({ searchText, resetText }, { form }) => {
                                    return [
                                        <Button
                                            key="searchText"
                                            type="primary"
                                            onClick={() => {
                                                form?.submit();
                                            }}
                                        >
                                            {searchText}
                                        </Button>,
                                        <Button
                                            key="resetText"
                                            onClick={() => {
                                                form?.resetFields();
                                            }}
                                        >
                                            {resetText}
                                        </Button>,
                                        <Button
                                            icon={<Icon antdIcon style={{ fontSize: '18px' }} type="DownloadOutlined" />}
                                            onClick={() => {
                                                const formParams = form?.getFieldsValue(true);
                                                this.exportTable(formParams);
                                            }}
                                        >
                                            导出
                                        </Button>
                                    ];
                                }
                            }}
                        ></SearchProtable>
                    </div>
                </div>
                <DetailModal
                    detailModalKey={detailModalKey}
                    width={'calc(100% - 260px)'}
                    title={detailTitle}
                    visible={modalVisible}
                    modalRecord={modalRecord}
                    detaildbName={detaildbName}
                    detailSql={detailSql}
                    detailCountSql={detailCountSql}
                    DetailColumns={DetailColumns}
                    DetailWhereCondition={DetailWhereCondition}
                    onOk={this.modalHandleOk}
                    onCancel={this.modalHandleCancel}
                ></DetailModal>
            </PageContainer>
        );
    }
}
