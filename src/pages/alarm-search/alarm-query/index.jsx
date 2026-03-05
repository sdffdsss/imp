/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Icon, Menu, Space, Tooltip, message, Modal, Layout, Select, Form, Input, DatePicker, InputNumber } from 'oss-ui';
import PageContainer from '@Components/page-container';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import columnInfoModel from './common/hox';
import Tabs from './common/tab';
import AlarmQueryWindow from './alarm-query-window';
import AuthButton from '@Src/components/auth-button';
import './index.less';
import dayjs from 'dayjs';
import {
    getCustomSearchMenuDatas,
    customSearchDetail,
    delCustomSearch,
    getColTempleteDatas,
    setColumnsInfo,
    getAllColumns,
    getDefaultColumns,
    register,
    getAlarmCount,
    getAlarmDatas,
    exportAlarm,
} from './common/api';
import { createFileFlow } from '@Common/utils/download';
import SelectCondition from './common/select-condition';
import CustomSearch from '../alarm-query/custom-search-add';
import { _ } from 'oss-web-toolkits';
import { sendLogFn } from '@Pages/components/auth/utils';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.searchRef = React.createRef();
        this.state = {
            customSearchMenu: [],
            showCustomSearch: false,
            addOrEdit: '',
            customDetail: null,
            selectedKeys: '1',
            searchColumns: [],
            collapsed: false,
            colTempleteDatas: [],
            colTempFields: [],
            columnsInfo: [],
            customColTempFields: [],
            customColumnsInfo: [],
            allColumns: [],
            sessionId: '',
            dataCount: 0,
            alarmQueryWindowKey: '',
        };
    }
    limitDecimals = (value) => {
        return value.replace(/[^\d]+/g, '');
    };
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    };

    // 获取业务定制查询菜单
    getCustomSearchMenu = async () => {
        const { userId } = this.props.login;
        const res = await getCustomSearchMenuDatas(userId);
        const { addOrEdit } = this.state;
        const menu = [];
        if (res) {
            res.data.forEach((item, index) => {
                menu.push({
                    ...item,
                    id: index + 4,
                });
            });
            this.setState({ customSearchMenu: menu }, () => {
                // 新建保存成功后定位到第一条数据
                if (addOrEdit === 'add' && this.props.columnInfo.status === 'refresh') {
                    this.customMenuChange(menu[0]);
                    this.props.columnInfo.setSelectedKeys(`${menu[0].viewId}`);
                }
            });
        }
    };

    // 添加业务定制查询条件
    addCustomSearch = () => {
        this.setState({ showCustomSearch: true, addOrEdit: 'add' });
    };

    // 编辑业务定制查询条件
    editCustomSearch = async (e, item) => {
        e.stopPropagation();
        // 编辑时先将详情置空
        this.setState({ customDetail: null });
        // 编辑时保存key 用来定位
        this.props.columnInfo.setSelectedKeys(`${item.viewId}`);
        const res = await customSearchDetail(item.viewId);
        if (res && res.data) {
            this.setState({ customDetail: res.data });
        }
        this.setState({ showCustomSearch: true, addOrEdit: 'edit' });
    };

    // 取消业务定制保存
    onCancel = () => {
        const { addOrEdit, customDetail, customSearchMenu } = this.state;
        this.setState({ showCustomSearch: false });
        this.getColTData(this.props.login.userId, this.props.login.userName);

        if (addOrEdit) {
            this.props.columnInfo.setOpenKeys('customSearch');
            // 编辑时接口报错，点击取消，返回时定位到点击的数据
            if (!customDetail) {
                this.setState({ searchColumns: [] });
                this.props.columnInfo.setSelectedKeys(this.props.columnInfo.selectedKeys);
            }
            // 编辑保存成功，调用此方法获取点击的数据的列模板 列信息 查询字段信息
            if (addOrEdit === 'edit' && customDetail) {
                this.customMenuChange(customDetail);
            }
            // 点击新增，然后没有新增 直接取消，返回到第一条数据
            if (addOrEdit === 'add' && this.props.columnInfo.status === 'init') {
                this.customMenuChange(customSearchMenu[0]);
                this.props.columnInfo.setSelectedKeys(`${customSearchMenu[0].viewId}`);
            }
        }
    };

    // 删除定制查询字段
    customSearchDel = async (viewId) => {
        const res = await delCustomSearch(viewId, this.props.login.userId);
        if (res && res.data) {
            message.success('删除成功');
            this.getCustomSearchMenu();
        }
    };

    showDelModal = (viewId) => {
        Modal.confirm({
            title: '',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: `删除后数据不可恢复，确定删除？`,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                this.customSearchDel(viewId);
            },
            onCancel() {},
        });
    };
    // 菜单切换重置searchForm的值
    setSearchForm = () => {
        if (this.searchRef.current) {
            const searchParams = this.searchRef.current.getFieldsValue();
            _.forOwn(searchParams, (value, key) => {
                if (key === 'event_time') {
                    this.searchRef.current.setFieldsValue({ event_time: [dayjs().subtract(1, 'day').startOf('day'), dayjs().startOf('day')] });
                } else if (key === 'alarm_origin') {
                    this.searchRef.current.setFieldsValue({
                        alarm_origin: useEnvironmentModel.data.environment.associatedQueryFlag,
                    });
                } else if (key === 'filter_type') {
                    this.searchRef.current.setFieldsValue({
                        filter_type: 'myFilters',
                    });
                } else {
                    this.searchRef.current.setFieldsValue({ [`${key}`]: undefined });
                }
            });
        }
    };

    // 选中菜单（通用查询、按过滤器查询、按唯一标识查询） 改变key 值，获取查询列，列模板、列数据
    menuClick = async (e) => {
        if (e.key === '1') {
            sendLogFn({ authKey: 'workbenches:generalQuery' });
        } else if (e.key === '2') {
            sendLogFn({ authKey: 'workbenches:filterQuery' });
        }
        this.setState({ alarmQueryWindowKey: `${e.key}` }, () => {
            this.props.columnInfo.setSelectedKeys(`${e.key}`);
            const { colTempleteDatas } = this.state;
            this.setState({ selectedKeys: e.key, customDetail: [], searchColumns: Tabs[e.key - 1] && Tabs[e.key - 1].columns }, () => {
                this.setSearchForm();
            });
            if (this.myRef?.current?.getFieldValue('colTempId') !== (colTempleteDatas[0] && String(colTempleteDatas[0].templateId))) {
                this.myRef?.current?.setFieldsValue({ colTempId: colTempleteDatas[0] && String(colTempleteDatas[0].templateId) });
                this.selectColTemp(colTempleteDatas[0] && String(colTempleteDatas[0].templateId), colTempleteDatas, 'col'); // col---主页面的列模板变化
            }
        });
    };

    // 点击业务定制查询获取对应的列模板、列数据、查询数据
    customMenuChange = async (params) => {
        // 点击时保存每条数据的id，保存成功或者取消后 用来定位到该条数据
        this.props.columnInfo.setSelectedKeys(`${params.viewId}`);
        this.setState({ alarmQueryWindowKey: `${params.viewId}` });
        const { colTempleteDatas } = this.state;
        // 调用业务定制查询详情信息
        const res = await customSearchDetail(params.viewId);
        if (res && res.data) {
            this.setState({ customDetail: res.data });
            // 点击哪个定制查询，将告警工具栏的列模板重置为该条数据设置的列模板信息
            if (this.myRef.current) {
                this.myRef.current.setFieldsValue({ colTempId: String(res.data.columnTemplateId) });
            }
            // 点击时调用选择列模板方法，获取该条数据所选列模板对应的列字段
            this.selectColTemp(String(res.data.columnTemplateId), colTempleteDatas, 'col');
            const columns = [];
            const { fieldList } = res.data;
            const dateFormat = 'YYYY-MM-DD HH:mm:ss ';
            // 根据点击的业务查询，根据该条数据设置的二次查询字段，生成查询条件
            if (fieldList && !_.isEmpty(fieldList)) {
                fieldList.forEach((item) => {
                    columns.push({
                        dataIndex: item.fieldName,
                        hideInSearch: false,
                        hideInTable: true,
                        title: item.filedAlias,
                        valueType: item.isEnum === 1 ? 'enumeration' : item.dataType === 'date' ? 'dateTimeRange' : 'text',
                        renderFormItem: (key, { fieldProps }, form) => {
                            return item.isEnum === 1 ? (
                                <SelectCondition
                                    {...fieldProps}
                                    form={form}
                                    mode={item.fieldName === 'alarm_origin' ? '' : 'multiple'}
                                    title={item.filedAlias}
                                    label="txt"
                                    dictName={item.fieldName}
                                    searchName={item.fieldName}
                                />
                            ) : item.dataType === 'date' ? (
                                <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} format={dateFormat} showTime />
                            ) : item.dataType === 'integer' ? (
                                <InputNumber min={0} step={1} formatter={this.limitDecimals} parser={this.limitDecimals} />
                            ) : (
                                <Input placeholder={`请输入${item.filedAlias}`} />
                            );
                        },
                    });
                });
                // 保存查询条件
                // 因为每个查询条件不能联动，所以在切换的时候需要先将数据置空
                this.setState({ searchColumns: columns }, () => {
                    this.setSearchForm();
                });
            } else {
                this.setState({ searchColumns: [] });
            }
        }
    };

    // 选择列模板 获取列数据
    selectColTemp = async (value, colTempDatas, type) => {
        let colTemp = [];
        // 根据选择的列模板id 过滤出对应的列模板
        if (colTempDatas) {
            colTemp = colTempDatas.filter((column) => {
                return String(column.templateId) === value;
            });
        } else {
            colTemp = this.state.colTempleteDatas.filter((column) => {
                return String(column.templateId) === value;
            });
        }
        if (colTemp.length === 0) {
            return;
        }
        // 查询全量的列字段
        const allColumnsRes = await getAllColumns();
        const allColumns = [];
        if (allColumnsRes && allColumnsRes.data) {
            this.props.columnInfo.setColumnInfo(allColumnsRes.data);
            allColumnsRes.data.forEach((item, index) => {
                allColumns.push({
                    field: item.storeFieldName,
                    id: index + 1,
                    name: item.displayName,
                    width: 120,
                    fieldId: item.fieldId,
                });
            });
        }
        this.setState({ allColumns });
        // 从选中的列模板中解构出 列信息、列id
        const { columnsValue, templateId } = colTemp[0];
        if (columnsValue) {
            let columns = [];
            if (templateId === -1) {
                // 此处通过解析columnsValue,判断改列模板中包含哪些列字段
                columns = setColumnsInfo(columnsValue, allColumns, 'query');
            } else {
                columns = setColumnsInfo(columnsValue, allColumns);
            }
            // dataSource 用来存储列字段，在业务定制查询编辑或者新增时用来展示列字段
            const dataSource = columns.showInTableColumns.map((item, index) => {
                const { dataIndex, name } = item;
                return { dataIndex, name, number: index + 1 };
            });
            /**
             * type：customTemp 代表业务定制查询里面的列字段
             * type: col 代表告警工具栏的列字段
             */
            if (type === 'customTemp') {
                this.setState({ customColTempFields: dataSource, customColumnsInfo: columns.showInTableColumns });
            } else {
                this.setState({ columnsInfo: columns });
            }
        }
    };

    // 获取列模板数据
    getColTData = async (userId, userName) => {
        // 获取列模板接口
        const colTempRes = await getColTempleteDatas(userId);
        // 获取默认列模板接口
        const defaultColTempRes = await getDefaultColumns(userName);
        const colTempDatas = [];
        if (defaultColTempRes && defaultColTempRes.data) {
            colTempDatas.push({ columnsValue: defaultColTempRes.data.optionValue, templateId: -1, templateName: '默认模板' });
        }
        if (colTempRes && colTempRes.data) {
            colTempRes.data.forEach((item) => {
                colTempDatas.push({
                    columnsValue: item.columnsValue,
                    templateId: item.templateId,
                    templateName: item.templateName,
                });
            });

            this.setState({ colTempleteDatas: colTempDatas });
        }
        // 当没有编辑或者新增业务定制查询时 初始化查询默认列模板
        if (this.props.columnInfo.openKeys !== 'customSearch') {
            this.myRef?.current?.setFieldsValue({ colTempId: colTempDatas[0] && String(colTempDatas[0].templateId) });
            this.selectColTemp(colTempDatas[0] && String(colTempDatas[0].templateId), colTempDatas, 'col'); // col---主页面的列模板变化
        }
    };
    onHeaderRow = (column) => {
        this.setState({ columnsInfo: { showInTableColumns: column } });
    };

    // 分页查询
    getTableDatas = async (key, { current, pageSize }) => {
        const { sessionId, dataCount } = this.state;
        const startIndex = (current - 1) * pageSize;
        const dataRes = await getAlarmDatas(startIndex, pageSize, sessionId);
        if (dataRes && dataRes.data) {
            return {
                data: dataRes.data,
                success: true,
                total: dataCount,
            };
        }
        return {
            data: false,
            success: false,
            total: 0,
        };
    };
    onSubmit = async () => {
        const searchParams = this.searchRef.current.getFieldsValue();
        // 针对网元名称等select和input 组合框查询字段特殊处理
        const { inputSeleteType, prcDatas } = this.props.columnInfo;
        _.forOwn(searchParams, (params, key) => {
            if (params !== undefined) {
                if (inputSeleteType[`${key}_condition`]) {
                    searchParams[`${key}_condition`] = inputSeleteType[`${key}_condition`];
                } else {
                    searchParams[`${key}_condition`] = 'like';
                }
            }
        });
        // 省市区联动的特殊处理
        if (!_.isEmpty(prcDatas) && prcDatas[0]) {
            searchParams.province_id = prcDatas[0];
        }
        if (!_.isEmpty(prcDatas) && prcDatas[1]) {
            searchParams.region_id = prcDatas[1];
        }
        if (!_.isEmpty(prcDatas) && prcDatas[2]) {
            searchParams.city_id = prcDatas[2];
        }

        const {
            columnsInfo: { showInTableColumns },
            allColumns,
            searchColumns,
            customDetail,
            sessionId,
        } = this.state;
        // 调用注册接口
        const res = await register(this.props.login.userId, searchParams, showInTableColumns, allColumns, searchColumns, customDetail, sessionId);
        if (res) {
            this.setState({ sessionId: res });
            // 调用获取总量接口
            const countRes = await getAlarmCount(res);
            // 调用获取告警列表接口
            const dataRes = await getAlarmDatas(0, 50, res);
            if (countRes && countRes.data && dataRes && dataRes.data) {
                this.setState({ dataCount: countRes.data });
                return {
                    data: dataRes.data,
                    success: true,
                    total: countRes.data,
                };
            }
        }
        return {
            data: false,
            success: false,
            total: 0,
        };
    };

    // 导出告警
    alarmExport = async ({ type, alarmList, total }) => {
        const searchParams = this.searchRef.current.getFieldsValue();
        const {
            sessionId,
            columnsInfo: { showInTableColumns },
        } = this.state;
        const res = await exportAlarm({ showInTableColumns, sessionId, searchParams, exportType: type, alarmList, total });
        if (res && res.data) {
            const fileInfo = JSON.parse(res.data);
            if (fileInfo && fileInfo.fileUrl) {
                // window.open(fileInfo.fileUrl);
                createFileFlow(fileInfo.fileUrl);
            }
        }
    };
    componentDidMount() {
        this.getColTData(this.props.login.userId, this.props.login.userName);
        this.getCustomSearchMenu();
        // 获取第一个菜单的查询列数据
        this.setState({ searchColumns: Tabs[0].columns });
    }

    render() {
        const {
            customSearchMenu,
            addOrEdit,
            showCustomSearch,
            customDetail,
            selectedKeys,
            searchColumns,
            colTempleteDatas,
            customColumnsInfo,
            columnsInfo,
            customColTempFields,
            allColumns,
            alarmQueryWindowKey,
        } = this.state;
        const defaultProps = !this.props.columnInfo.openKeys ? {} : { openKeys: [this.props.columnInfo.openKeys] };
        return (
            <PageContainer showHeader={false} divider={false} title="告警查询" className="alarm-search-new">
                {!showCustomSearch && (
                    <Layout style={{ height: '100%' }}>
                        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} width={230}>
                            <Menu
                                mode="inline"
                                onClick={this.menuClick}
                                style={{ height: '100%' }}
                                {...defaultProps}
                                selectedKeys={[this.props.columnInfo.selectedKeys]}
                            >
                                {Tabs.map(({ tab, key }) => {
                                    const type =
                                        key === '1'
                                            ? 'SearchOutlined'
                                            : key === '2'
                                            ? 'FilterOutlined'
                                            : key === '3'
                                            ? 'VerifiedOutlined'
                                            : 'CalendarOutlined';
                                    return (
                                        <Menu.Item key={key} icon={<Icon antdIcon={true} type={type} />}>
                                            {tab}
                                        </Menu.Item>
                                    );
                                })}
                                <SubMenu
                                    key="customSearch"
                                    title={
                                        <span>
                                            <Icon antdIcon={true} type="CalendarOutlined" />
                                            <span>业务定制查询</span>
                                        </span>
                                    }
                                    onTitleClick={() => {
                                        this.props.columnInfo.setOpenKeys('');
                                    }}
                                >
                                    {customSearchMenu &&
                                        customSearchMenu.map((item) => {
                                            return (
                                                <Menu.Item
                                                    key={item.viewId}
                                                    onClick={(e) => {
                                                        e.domEvent.stopPropagation();
                                                        e.domEvent.preventDefault();
                                                        this.customMenuChange(item);
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Tooltip title={item.viewName}>
                                                            <span
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: '100px',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}
                                                            >
                                                                {item.viewName}
                                                            </span>
                                                        </Tooltip>
                                                        <Space>
                                                            <Tooltip title="编辑">
                                                                <AuthButton
                                                                    key="edit"
                                                                    onClick={(e) => {
                                                                        this.editCustomSearch(e, item);
                                                                    }}
                                                                    type="text"
                                                                    style={{ padding: 0 }}
                                                                    authKey="alarmQuery:edit"
                                                                >
                                                                    <Icon antdIcon={true} type="EditOutlined" />
                                                                </AuthButton>
                                                            </Tooltip>
                                                            <Tooltip title="删除">
                                                                <AuthButton
                                                                    key="delete"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        this.showDelModal(item.viewId);
                                                                    }}
                                                                    type="text"
                                                                    style={{ padding: 0 }}
                                                                    authKey="alarmQuery:delete"
                                                                >
                                                                    <Icon antdIcon={true} type="DeleteOutlined" />
                                                                </AuthButton>
                                                            </Tooltip>
                                                        </Space>
                                                    </div>
                                                </Menu.Item>
                                            );
                                        })}
                                </SubMenu>
                                <Menu.Item key="addMenu" className="addMenu" onClick={this.addCustomSearch}>
                                    <Tooltip title="添加定制查询">
                                        <AuthButton key="add" type="link" authKey="alarmQuery:add">
                                            <Icon antdIcon={true} type="PlusOutlined" style={{ fontSize: '20px' }} />
                                        </AuthButton>
                                    </Tooltip>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout>
                            <Content style={{ marginLeft: '16px' }} key={alarmQueryWindowKey}>
                                <AlarmQueryWindow
                                    showSearchPanel={true}
                                    searchColumns={searchColumns}
                                    showInTableColumns={columnsInfo.showInTableColumns}
                                    activeKey={selectedKeys}
                                    onSubmit={this.onSubmit}
                                    onChange={this.getTableDatas}
                                    onHeaderRow={this.onHeaderRow}
                                    searchRef={this.searchRef}
                                    alarmExport={this.alarmExport}
                                    alarmToolBarActive={null}
                                    toolBarRender={() => {
                                        const buttons = [
                                            <div className="toolBarButton">
                                                <Form ref={this.myRef}>
                                                    <Form.Item name="colTempId" label="列模板">
                                                        <Select
                                                            showSearch
                                                            placeholder="请选择"
                                                            optionFilterProp="children"
                                                            style={{ width: '15vw' }}
                                                            onChange={(value) => {
                                                                this.selectColTemp(value, null, 'col');
                                                            }}
                                                        >
                                                            {colTempleteDatas.map((item) => {
                                                                return <Select.Option key={item.templateId}>{item.templateName}</Select.Option>;
                                                            })}
                                                        </Select>
                                                    </Form.Item>
                                                </Form>
                                            </div>,
                                        ];
                                        return buttons;
                                    }}
                                />
                            </Content>
                        </Layout>
                    </Layout>
                )}
                {showCustomSearch && (
                    <CustomSearch
                        title={addOrEdit === 'add' ? '业务查询新增' : '业务查询编辑'}
                        onCancel={this.onCancel}
                        {...this.props}
                        getCustomSearchMenu={this.getCustomSearchMenu}
                        customDetail={customDetail}
                        addOrEdit={addOrEdit}
                        colTempleteDatas={colTempleteDatas}
                        showInTableColumns={customColumnsInfo}
                        selectColTemp={this.selectColTemp}
                        getColTData={this.getColTData}
                        colTempFields={customColTempFields}
                        customMenuChange={this.customMenuChange}
                        customSearchMenu={customSearchMenu}
                        allColumns={allColumns}
                    />
                )}
            </PageContainer>
        );
    }
}

export default withModel([useLoginInfoModel, columnInfoModel], (shareInfo) => ({
    login: shareInfo[0],
    columnInfo: shareInfo[1],
}))(Index);
