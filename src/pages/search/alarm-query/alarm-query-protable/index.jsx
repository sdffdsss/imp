/* eslint-disable @typescript-eslint/no-unused-expressions */
// import locales from "locales";
import React from 'react';
import { VirtualTable } from 'oss-web-common';
// import { ProTable } from 'oss-ui';

import './index.less';
import OperatorSearch from '../../../../components/form-item/operator-search';
import OperatorEnum from '@Common/enum/operatorEnum.js';
import { _ } from 'oss-web-toolkits';
import defaultConfig from '../config/default';
import AlarmQueryWindow from '../alarm-query-window';
import getDefaultValueForData from '../common/convert/defaultValue.js';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import request from '@Common/api';
// import constants from '@Common/services/constants';
const { rootClassName, dontSendFieldName, useAlarmWindow } = defaultConfig;
// let formParams = {};
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setColumnsStateMap = this.setColumnsStateMap.bind(this);
        this.updataFormParams = this.updataFormParams.bind(this);
        this.onHeaderRow = this.onHeaderRow.bind(this);
        this.state = {
            dataSource: [],
            columns: [],
            // columns: this.getColumnAndSearch(props),
            scroll: props.scroll,
            // scroll: { x: 0 },
            // search: true,
            // search: props.searchConfig,
            // pagination: { pageSize: props.pageSize },
            // columnsStateMap: {}, //列显示隐藏受控
            columnSearch: {},
        };
        this.searchItemNum = 0;
        // this.searchRowNum = 0;
        this.scrollX = 0;
        this.searchFlag = true;
        this.formParams = {};
        // this.columnsAdapter = new Columns();
    }

    onSubmit() {
        this.searchFlag = true;
        // const { onSubmit, id } = this.props;
        // console.info(`=========`);
        // console.info(`onSubmit formParams = ${JSON.stringify(formParams)}`);
        // onSubmit(id, formParams);
    }
    getInitColums(columns) {
        const _columns = columns.map((column) => {
            if (column.dataIndex === 'send_status') {
                column.disabled = false;
                return column;
            }
            return column;
        });
        return _columns;
    }
    componentDidMount() {
        let { columns = [] } = this.props;
        columns = this.getInitColums(columns);
        this.getAllColumnSearch(columns);
        this.setState({ columns: this.getColumnAndSearch(columns) });
    }
    async getAllColumnSearch(columns) {
        const types = columns
            .map((e) => e.type)
            .filter((e) => !!e)
            .concat([423, 424, 366, 367]); // 合并掉的表单项

        const res = await request('common/getDictToPaasByTypes', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                types,
            },
        });
        if (res && res.dataObject) {
            this.setState({
                columnSearch: res.dataObject,
            });
        }
    }
    componentDidUpdate(preProps, preState) {
        const {
            columns = [],
            scroll: { x },
        } = this.props;
        const { columns: crruentColumns, scroll: scrollState } = preState;
        const nextColumns = this.getColumnAndSearch(columns);
        if (`${JSON.stringify(crruentColumns)}` !== `${JSON.stringify(nextColumns)}`) {
            this.setState({ columns: this.getColumnAndSearch(columns), scroll: { ...scrollState, x } });
        }
    }
    getColumnAndSearch(columns) {
        const _columns = columns;
        const { getOperatorOptions, getCondOptions, renderFormItem } = this;
        const { colSize } = this.props.search;

        for (const column of _columns) {
            column.operatorOptions = getOperatorOptions(column);
            column.conditionOptions = getCondOptions(column);
            column.renderFormItem = renderFormItem;
            column.hideInTable = !column.hideInSearch;
            // if (ellipsisFieldName.includes(column.dataIndex)) {
            column.ellipsis = true;
            // }
            if (!column.hideInSearch) {
                this.searchItemNum++;
            }
            column.formItemProps = { myProps: { ...column } };
            column.colSize = column.colSize || colSize;
        }

        return _columns;
    }
    /**
     * 自定义渲染查询表单项
     * @param {*} restItem
     * @param {*} param1
     * @param {*} form
     */
    renderFormItem = (restItem) => {
        const { getOperatorAndFieldValue, changeSendStatus, updataFormParams, initValueEnum } = this;
        const { onIsSendStatusChange, onFilterTypeChange, onFieldTypeChange, onTypesDataList } = this.props;
        const { columnSearch } = this.state;
        // console.log('restItem', restItem);
        return (
            <OperatorSearch
                key={restItem.formItemProps.dataIndex}
                getOperatorAndFieldValue={getOperatorAndFieldValue}
                changeSendStatus={changeSendStatus}
                updataFormParams={updataFormParams}
                column={restItem.formItemProps.myProps}
                {...restItem.formItemProps.myProps}
                // operatorEnum={restItem.operatorEnum}
                // operatorValue={value}
                // onChange={(newValue) => {
                //     //自定义的查询条件 会有多处触发onChange，此处做值得整合
                //     Object.assign(value, newValue);
                //     onChange(value);
                // }}
                initValueEnum={initValueEnum}
                onFilterTypeChange={onFilterTypeChange}
                onFieldTypeChange={onFieldTypeChange}
                onTypesDataList={onTypesDataList}
                onIsSendStatusChange={onIsSendStatusChange}
                columnSearch={columnSearch}
                // onSheetTypeChange={(value) => onSheetTypeChange(columnSearch, value)}
            />
        );
    };
    /**
     * 初始化和onChenge 都会触发此方法，在提交表单的时候使用
     * 因为submit 方法的参数不包括收起的查询条件
     * @param {*} param0
     * @param {*} valueObj
     */
    updataFormParams({ dataIndex }, valueObj) {
        const { value } = valueObj;
        // console.log({ dataIndex }, valueObj);
        // 不能直接转boolean , 因为 0, '0' 是有效数据
        if (!Object.is(value, null) && !Object.is(value, undefined) && value.length !== 0 && !dontSendFieldName.includes(dataIndex)) {
            this.formParams[dataIndex] = valueObj;
            dataIndex === 'timeRange' && console.log(`updataFormParams: ${JSON.stringify(valueObj)}`);
        } else {
            delete this.formParams[dataIndex];
        }
    }
    /**
     *
     * @param {*} filterType 联动filterId
     */
    onFilterTypeChange = (filterType) => {
        const columnsIndex = this.state.columns.findIndex((column) => column.dataIndex === 'filter_id');
        const columns = _.cloneDeep(this.state.columns);
        const column = columns[columnsIndex];
        column.filterType = filterType;
        columns[columnsIndex] = column;
        this.setState({ columns });
    };
    /**
     *
     * @param {*} isSendStatus 联动 sendStatus
     */
    onIsSendStatusChange = (isSendStatus) => {
        console.log(isSendStatus);
        const columnsIndex = this.state.columns.findIndex((column) => column.dataIndex === 'send_status');
        const columnsSheetNoIndex = this.state.columns.findIndex((column) => column.dataIndex === 'sheet_no');
        const columns = _.cloneDeep(this.state.columns);
        const column = columns[columnsIndex];
        const columnSheet = columns[columnsSheetNoIndex];
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
        columns[columnsIndex] = column;
        columns[columnsSheetNoIndex] = columnSheet;
        this.setState({ columns });
    };
    /**
     *
     * @param {*} dataIndex 字典值 数据列名
     * @param {*} data  字典值映射关系
     * @param {*} type  字典值来源： 'byEnum' | 'bySql'
     */
    initValueEnum = (dataIndex, data, type) => {
        // valueEnum: {1 : { text: '已清除',value: 1}}
        let keyValue = null;
        switch (type) {
            case 'byEnum':
                keyValue = { key: 'key', value: 'value' };
                break;
            case 'bySql':
                keyValue = { key: 'id', value: 'txt' };
                break;
            default:
                keyValue = { key: 'id', value: 'txt' };
        }
        const columnsIndex = this.state.columns.findIndex((column) => column.dataIndex === dataIndex);
        const columns = _.cloneDeep(this.state.columns);
        const column = columns[columnsIndex];
        if (column && !column.valueEnum) {
            const cruuentEnum = {};
            for (const iterator of data) {
                cruuentEnum[iterator[keyValue.key]] = { text: iterator[keyValue.value], value: iterator[keyValue.key] };
            }
            column.valueEnum = cruuentEnum;

            columns[columnsIndex] = column;
            this.setState({ columns });
        }
    };
    /**
     * @function 获取查询表单的操作符枚举值
     * @param {any} column
     * @returns  operatorEnum
     */
    getOperatorOptions(column) {
        const { valueType = 'text', operatorKeys = [] } = column;

        let operatorEnum = OperatorEnum[valueType];
        if (operatorKeys.length > 0) {
            const filtered = operatorEnum.filter((item) => {
                return operatorKeys.includes(item.key);
            });
            // 指定枚举值，都不在约定枚举值内，使用约定枚举值
            operatorEnum = filtered.length > 0 ? filtered : operatorEnum;
        }
        return operatorEnum;
    }
    /**
     * @function 根据fieldEnum,fieldSelectAll,valueEnum 返回condition UI组件的 options 数据配置项
     */
    getCondOptions({ fieldEnum, valueEnum }) {
        const options = [];
        if (fieldEnum && fieldEnum.length > 0) {
            for (const item of fieldEnum) {
                const { key, value } = item;
                if (key !== undefined) {
                    options.push({ value: `${key}`, label: value });
                } else if (item.constructor === String) {
                    options.push({ value: item, label: item });
                }
            }
        } else if (valueEnum) {
            for (const [key, value] of Object.entries(valueEnum)) {
                options.push({ value: `${key}`, label: value.text });
            }
        }
        // if (options.length > 0 && fieldMode === 'multiple' && fieldSelectAll) {
        //     options.unshift({ value: 'all', label: '全部' });
        // }
        return options;
    }

    /**
     * @function 获取查询表单的操作符+查询值的默认值
     * @param {*} value
     * @param {*} onChange
     * @param {*} operatorEnum
     * @param {*} column
     * @returns
     */
    getOperatorAndFieldValue(value, onChange, operatorEnum, column) {
        if (Object.keys(value).length > 0) {
            return value;
        }
        // if (column.title === '派单状态') {
        //     console.log('operatorDefault', { value, onChange, operatorEnum, column });
        //     debugger;
        // }
        // 初次取值，读取默认值
        let operator = [];
        const { defaultValue = { operator: null, value: null }, valueType } = column;

        const operatorDefaultkey = defaultValue.operator;
        let operatorDefault = null;

        if (operatorDefaultkey) {
            operatorDefault = operatorEnum.find(function (item) {
                // 选项唯一和设定默认值 优先
                return item.key === operatorDefaultkey;
            });
        }
        if (operatorEnum.length === 1) {
            // 过滤后 选项唯一，则是默认值
            operator = operatorEnum[0];
        } else if (operatorDefault) {
            operator = operatorDefault;
        } else {
            operator = operatorEnum.find(function (item) {
                return item.default === 'default';
            });
        }
        operator = operator ? operator.key : null;

        let fieldDefaultValue = defaultValue.value !== undefined && defaultValue.value !== '' ? defaultValue.value : null;
        if (defaultValue.value === 'all') {
            fieldDefaultValue = column.conditionOptions.map((item) => {
                return item.value;
            });
        }
        fieldDefaultValue = getDefaultValueForData(defaultValue.value, valueType);
        const initValue = { operator, value: fieldDefaultValue };
        onChange && onChange(initValue);
        return initValue;
    }
    /**
     * @function 查询表单 联动: 1、[是否派单告警，派单状态]
     * @param {*} crruentValue
     * @param {*} onChange
     * @param {*} column
     * @returns
     */
    changeSendStatus = (crruentValue, onChange, column) => {
        const { dataIndex = '', disabled, defaultValue = { operator: null, value: null }, cascade } = column;
        let { operator, value, type } = crruentValue;
        switch (dataIndex) {
            case 'send_status':
                if (disabled) {
                    value = null;
                } else if (cascade) {
                    // 恢复默认值
                    let fieldDefaultValue = defaultValue.value !== undefined ? defaultValue.value : null;
                    if (defaultValue.value === 'all') {
                        fieldDefaultValue = column.conditionOptions.map((item) => {
                            return item.value;
                        });
                    }
                    value = fieldDefaultValue;
                    // 阻止下次 自身选择 值变成默认值；
                    this.props.sendStatusCascadeSwitch(false);
                    // cascade = false;
                    // const columns = this.state.columns.map((column) => {
                    //     if (column.dataIndex === 'send_status') {
                    //         column.cascade = cascade;
                    //         return column;
                    //     }
                    //     return column;
                    // });
                    // this.setState({ columns });
                }
                if (!_.isEqual(value, crruentValue.value)) {
                    onChange && onChange({ operator, value });
                }
                break;
            case 'sheet_no':
                if (disabled) {
                    value = '';
                }
                if (!_.isEqual(value, crruentValue.value)) {
                    onChange && onChange({ operator, value });
                }
                break;

            default:
                break;
        }
        return { operator, value, type };
    };
    onTabsChange() {}
    onChange() {
        this.searchFlag = false;
        // this.props.onChange(this.props.id, { current, pageSize });
    }
    onHeaderRow(column) {
        if (this.props.setHeaderRow) {
            this.props.setHeaderRow(this.props.id, column);
        }
        // this.dataSourceAdapter.setHeaderRow(column);
    }
    render() {
        const { columns, scroll } = this.state;
        // columns = columns.slice(1, 5);
        // console.info('columns' + JSON.stringify(columns));
        const {
            headerTitle = '',
            // loading,
            search,
            id,
            columnsStateMap,
            pagination,
            dataSource,
            options = false,
            toolBarRender = null,
            optionRender = null,
            type,
            onSubmit,
            onChange,
            showInTableColumns,
            showSearchPanel,
            alarmWindowModeCondChange,
            alarmQueryMode,
            alarmExport,
            alarmToolBarActive,
        } = this.props;
        const {
            login: { userId },
        } = this.props;
        return (
            <>
                {!_.isEmpty(columns) && (type === 'alarm-report' || !useAlarmWindow) && (
                    <div className={`${'oss-imp-alarm-protable-empty-show'}`}>
                        <VirtualTable
                            showSearchPanel
                            global={window} // 必填项
                            headerTitle={headerTitle}
                            // loading={loading}
                            key={id}
                            columns={columns}
                            size="small"
                            defaultData={[]}
                            dataSource={dataSource}
                            scroll={scroll}
                            search={search}
                            onSubmit={this.onSubmit}
                            tableClassName={rootClassName}
                            onHeaderRow={this.onHeaderRow}
                            options={options}
                            // onHeaderRow={(column, index) => {
                            //     this.dataSourceAdapter.setHeaderRow(column);
                            // }}
                            bordered
                            manualRequest={true}
                            columnsStateMap={columnsStateMap}
                            onColumnsStateChange={this.setColumnsStateMap}
                            onChange={this.onChange}
                            pagination={pagination}
                            request={(params) => {
                                if (this.searchFlag) {
                                    return this.props.onSubmit(id, { ...this.formParams, sheet_time_out: '', user_id: userId });
                                }
                                return this.props.onChange(id, {
                                    current: params.current,
                                    pageSize: params.pageSize,
                                    sheet_time_out: '',
                                    user_id: userId,
                                });
                            }}
                            form={{
                                labelAlign: 'right',
                                labelCol: {
                                    span: 7,
                                },
                            }}
                            rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                            toolBarRender={toolBarRender}
                            optionRender={optionRender}
                            style={{ height: '100%' }}
                        />
                    </div>
                )}
                {!_.isEmpty(columns) && type === 'alarm-query' && useAlarmWindow && (
                    <div key={id} style={{ height: '100%' }}>
                        <AlarmQueryWindow
                            alarmQueryMode={alarmQueryMode}
                            alarmWindowModeCondChange={alarmWindowModeCondChange}
                            showSearchPanel={showSearchPanel ? search : false}
                            searchColumns={columns}
                            showInTableColumns={showInTableColumns}
                            activeKey={id}
                            onSubmit={onSubmit}
                            onChange={onChange}
                            onHeaderRow={this.onHeaderRow}
                            formParams={this.formParams}
                            toolBarRender={toolBarRender}
                            alarmExport={alarmExport}
                            alarmToolBarActive={alarmToolBarActive}
                            seacrhFlag={this.props.seacrhFlag}
                            operId={this.props.operId}
                            // columns={columns}
                            // columnSearch={columnSearch}
                        />
                    </div>
                )}
            </>
        );
    }
    setColumnsStateMap(map) {
        this.props.setColumnsStateMap(this.props.id, map);
        this.setTableWidth(map);
    }
    setTableWidth(colArray) {
        const hideCol = [];
        for (const key in colArray) {
            if (colArray[key].show !== undefined && !colArray[key].show) {
                hideCol.push(key);
            }
        }
        const columns = _.cloneDeep(this.state.columns);
        let tableWidth = 0;
        for (const iterator of columns) {
            if (!hideCol.includes(iterator.dataIndex) && !iterator.hideInTable) {
                tableWidth += iterator.width;
            }
        }

        if (tableWidth) {
            this.setState({ scroll: { ...this.props.scroll, x: tableWidth } });
        }
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
