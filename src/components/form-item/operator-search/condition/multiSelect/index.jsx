/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable no-nested-ternary */
/**
 * 带搜索框的多选/单选select
 *  */

import React from 'react';
import { Tooltip, Select, Icon, Divider } from 'oss-ui';
// import DropdownSearchInput from './dropdownSearchInput';
// import DropdownCheckBox from './dropdownCheckBox';
import constants from '@Common/services/constants';

import getData from '@Common/services/dataService';
// import configUrl from '../../../../../pages/search/alarm-query/config/config_url';
import { getEntry } from '@Src/pages/search/alarm-query/common/adaper/adapter_searchForm';
import Version from '@Common/path/getVersion';
import Enums from '@Common/enum';
import getFilterByType from './filter';
import getRuleData from './rule';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

// const {  } = configUrl;
const needDropdownRender = false; // 是否需要自定义下拉多选搜索组件
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.maxTagCount = 2;
        this.state = {
            conditionOptions: props.conditionOptions,
            maxTagCount: props.fieldMaxDispalyCount ? props.fieldMaxDispalyCount : this.maxTagCount,
            sreachInputValue: null,
            operatorValue: this.props.dataIndex === 'filter_id' ? null : props?.operatorValue?.value !== null ? props?.operatorValue.value : [],
            allKey: false,
        };
        this.getFilterFromConstants = this.getFilterFromConstants.bind(this);
        this.filters = {
            allFilters: [],
            myFilters: [],
        };

        this.getFormateData = this.getFormateData.bind(this);
        this.cruuentFilterType = props.filterType;

        this.conditionOptionsAll = props.conditionOptions;
        // 多选是屏蔽默认 搜索框，单选相反使用它
        if (needDropdownRender) {
            // this.showSearch = this.props.fieldMode === 'multiple' ? false : this.props.fieldSearch;
        } else {
            this.showSearch = this.props.fieldSearch;
        }
        this.tooltipText = '无';

        //
        // this.myRef = React.createRef();
        this.focusSearch = false;
        this.lastSelectKeys = [];
        //
        this.sqlLast = {};
    }
    componentDidMount() {
        // this.props.initValueEnum(this.props.dataIndex, [{ ID: 1, TXT: '自定义级别' }]);
        const { fieldSql = '', dictName, type } = this.props;
        if (fieldSql && type) {
            // this.getDataBySqlId({ sqlId: fieldSql, dbName, mapperId });
            this.getDataByType({ type });
        } else if (dictName) {
            this.getDictName(dictName);
        } else if (this.props.fieldEnum) {
            // 目前表格数据字典转化 不依赖 此处数据，先注释
            // this.props.initValueEnum(this.props.dataIndex, this.props.fieldEnum, 'byEnum');
        }
        if (this.props.dataIndex === 'filter_id') {
            this.getFilterId();
        }
        if (this.props.dataIndex === 'filter_type') {
            // 2021-07-29 李曼要求先去掉规则
            // this.setState({
            //     conditionOptions: this.state.conditionOptions.concat(this.getFilterModuleMap())
            // });
        }
    }
    componentWillUnmount = () => {
        // this.setState = () => {
        // };
    };
    getFilterModuleMap() {
        const filterModul = Enums.filterModuleMap.map(({ id, name }) => ({ value: id, label: name }));
        return filterModul;
    }
    componentDidUpdate(preProps) {
        if (
            this.props.dataIndex === 'filter_id' &&
            this.props.filterType &&
            this.cruuentFilterType &&
            this.props.filterType !== this.cruuentFilterType
        ) {
            this.cruuentFilterType = this.props.filterType;
            // const conditionOptions = this.filters[this.cruuentFilterType] ?? [];
            const conditionOptions = this.getFilterFromConstants(this.cruuentFilterType) ?? [];
            this.setState({ conditionOptions });
            this.props.onChange(null);
            this.conditionOptionsAll = conditionOptions;
            if (constants.version === 'unicom' && (conditionOptions[0]?.value ?? null)) {
                this.props.onChange(conditionOptions[0]?.value);
                this.setState({ operatorValue: conditionOptions[0]?.value ?? null });
            }
        }

        const { operatorValue, type } = this.props;
        if (JSON.stringify(this.props.columnSearch) !== JSON.stringify(preProps.columnSearch)) {
            this.getDataByType({ type });
        }
        if (preProps.type !== type) {
            this.getDataByType({ type });
        }
        const operatorValueData = operatorValue?.value !== null ? operatorValue.value : [];
        if (JSON.stringify(operatorValueData) !== JSON.stringify(this.state.operatorValue)) {
            // if (dataIndex !== 'filter_id') {
            this.setState({ operatorValue: operatorValueData });
            // }
        }
    }
    getFilterFromConstants(type) {
        switch (type) {
            case 'allRules':
                let rules = [];
                const filterKeys = ['myFilters', 'allFilters'];
                for (const [key, value] of Object.entries(this.filters)) {
                    if (!filterKeys.includes(key)) {
                        rules = rules.concat(value);
                    }
                }
                return rules;
            default:
                return this.filters[this.cruuentFilterType];
        }
    }
    async getFilterId() {
        const {
            login: { userId },
        } = this.props;
        // 改为 Promise.All
        // const resALL = await getFilterByType(userId, 'ALL');
        // const resMY = await getFilterByType(userId, 'MY');
        // const resRule = await getRuleData(userId);
        // 'myFilters','allFilters','ruleFitlers'
        const { cruuentFilterType } = this;
        const typeString = {
            myFilters: getFilterByType(userId, 'MY'),
            allFilters: getFilterByType(userId, 'ALL'),
            ruleFitlers: getRuleData(userId),
        };
        // todo filter_id 分两组请求数据，当前选项组和全部选项组
        const promises = [typeString.allFilters, typeString.allFilters, typeString.ruleFitlers];
        Promise.all(promises).then((AllResp) => {
            const [resALL, resMY, resRule] = AllResp;
            this.filters.allFilters =
                resALL?.data?.map?.((data) => ({
                    value: data.filterId,
                    label: data.filterName,
                })) ?? [];
            this.filters.myFilters =
                resMY?.data?.map?.((data) => ({
                    value: data.filterId,
                    label: data.filterName,
                })) ?? [];
            Object.assign(this.filters, resRule);
        });
        let conditionOptions = await typeString[cruuentFilterType];
        conditionOptions =
            conditionOptions?.data?.map((data) => ({
                value: data.filterId,
                label: data.filterName,
            })) ?? [];
        // const conditionOptions = (this.getFilterFromConstants(this.cruuentFilterType) ?? []).slice(0, 100);
        const operatorValue = this.props?.operatorValue?.value !== null ? this.props?.operatorValue.value : [];

        this.setState({ conditionOptions, operatorValue });
        this.conditionOptionsAll = conditionOptions;

        // Object.assign(this.filters, resRule);
        // 本方法 didmount 调用后 cruuentFilterType 置为空，
        // 触发DidUpdate过滤器选项初始化
        // this.cruuentFilterType = null;
        if (constants.version === 'unicom' && (conditionOptions[0]?.value ?? null)) {
            this.props.onChange(conditionOptions[0]?.value);
        }
    }
    getDataBySqlId({ sqlId, dbName = constants.dbNames.NMOSDB, mapperId }) {
        const { sqlLast } = this;
        if (sqlLast.sqlId === sqlId && sqlLast.dbName === dbName) {
            return;
        }
        this.sqlLast = { sqlId, dbName };

        const data = {
            executeParam: {
                dataSourceName: dbName,
                parameter: {},
                sqlId: `com.boco.gutil.database.mapper.custom.CustomSqlMapper.${sqlId}`,
                statementType: 'select',
            },
            mapperFile: {
                mapperId: `${mapperId}${Version}`,
                moduleId: 'ossImpAlarmSqlModule',
                systemId: 'ossImpAlarmSqlSystem',
            },
        };

        getData(sqlId, { showSuccessMessage: false, showErrorMessage: false }, {}, -1, data).then((res) => {
            const conditionOptions = this.getFormateData(res.data);
            this.setState({ conditionOptions });
            this.conditionOptionsAll = conditionOptions;
        });
    }
    getDataByType({ type }) {
        const { columnSearch } = this.props;
        if (columnSearch[type]) {
            const conditionOptions = columnSearch[type].map((e) => {
                return { value: +e.dCode, label: e.dName };
            });
            this.setState({ conditionOptions });
            this.conditionOptionsAll = conditionOptions;
        } else {
            this.setState({ conditionOptions: [] });
        }
    }
    getDictName(enumId) {
        const {
            login: { userId },
        } = this.props;
        getEntry(enumId, userId).then((dict) => {
            const conditionOptions = dict?.data.map((dicts) => {
                return { value: dicts.key, label: dicts.value };
            });
            this.setState({ conditionOptions });
        });
    }
    getFormateData(data) {
        const formateData = [];
        if (data === null) {
            return formateData;
        }
        for (const item of data.data) {
            formateData.push({
                value: item.id,
                label: item.txt,
            });
        }
        return formateData;
    }
    filterConditionOptions(input) {
        let conditionOptions = null;
        if (input.length === 0) {
            conditionOptions = this.conditionOptionsAll;
        } else {
            const filtered = this.conditionOptionsAll.filter((item) => {
                return item.label.includes(input);
            });
            if (filtered) {
                conditionOptions = [].concat(filtered);
            }
        }
        //
        this.setState({ conditionOptions });
    }
    selectOnClick(flag) {
        const { conditionOptions } = this.state;
        let list = [];
        if (!flag) {
            list = conditionOptions.map((item) => item.value);
        }
        switch (this.props.dataIndex) {
            case 'filter_type':
                this.props.onFilterTypeChange(list);
                break;
            case 'is_undistributed_send_status':
                this.props.onIsSendStatusChange(list);
                break;
            case 'sheet_type':
                this.props.onSheetTypeChange(list);
                break;
            default:
        }
        this.props.onChange(list);
        this.setState({
            allKey: !flag,
        });
    }
    dropdownRender(menu) {
        if (this.props.fieldMode === 'multiple') {
            return (
                <>
                    <div
                        onClick={() => this.selectOnClick(this.state.allKey)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '5px 8px', cursor: 'pointer' }}
                    >
                        全部 {this.state.allKey ? <Icon antdIcon type="CheckOutlined" /> : null}
                    </div>
                    <div style={{ overflowY: 'auto' }}>{menu}</div>
                </>
            );
        }
        return menu;
    }
    handleChange(key = []) {
        const { conditionOptions } = this.state;
        if (key.length === conditionOptions.map((item) => item.value).length) {
            this.setState({
                allKey: true,
            });
        } else {
            this.setState({
                allKey: false,
            });
        }
        if (this.focusSearch) {
            this.restMaxTagCount(this.lastSelectKeys);
            this.props.onChange(this.lastSelectKeys);
        } else {
            this.lastSelectKeys = key;
            this.restMaxTagCount(key);
            this.props.onChange(key);
        }
        switch (this.props.dataIndex) {
            case 'filter_type':
                this.props.onFilterTypeChange(key);
                break;
            case 'is_undistributed_send_status':
                this.props.onIsSendStatusChange(key);
                break;
            case 'sheet_type':
                this.props.onSheetTypeChange(key);
                break;
            default:
        }
        // if (this.props.dataIndex === 'filter_type') {
        //     this.props.onFilterTypeChange(key);
        // }
    }
    // dropdownVisibleChange(open) {
    //     this.SearchInputRef.focus();
    // }
    getMaxTagPlaceholder(omittedValues) {
        this.setState({ maxTagCount: 0 });
        const total = this.state.maxTagCount + omittedValues.length;
        return `${total} 项`;
    }
    restMaxTagCount(value) {
        const maxTagCount = this.props.fieldMaxDispalyCount ? this.props.fieldMaxDispalyCount : this.maxTagCount;
        if (maxTagCount === value.length) {
            this.setState({ maxTagCount });
        }
    }
    getSelectedIcon() {
        return <Icon antdIcon={true} type="CheckOutlined" />;
    }
    getTestOptions() {
        const options = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 1000; i++) {
            options.push({ value: i, label: `${i}label` });
        }
        return options;
    }
    render() {
        const { valueType, fieldMode = '', fieldPlaceholder = '全部', disabled = false } = this.props;
        const { operatorValue, conditionOptions } = this.state;
        // this.props.operatorValue.value;

        if (valueType === 'enumeration' || conditionOptions.length > 0) {
            return (
                <>
                    <Tooltip placement="rightBottom" color="#FFF" title={this.tooltipText}></Tooltip>
                    <Select
                        disabled={disabled}
                        // maxTagCount={maxTagCount}
                        maxTagCount="responsive"
                        // maxTagPlaceholder={this.getMaxTagPlaceholder.bind(this)}
                        optionFilterProp="label"
                        mode={fieldMode}
                        showSearch={this.showSearch}
                        value={operatorValue}
                        // placeholder="请选择"
                        placeholder={fieldPlaceholder}
                        onChange={this.handleChange.bind(this)}
                        dropdownRender={this.dropdownRender.bind(this)}
                        options={this.state.conditionOptions}
                        allowClear={true}
                        showArrow={true}
                    ></Select>
                </>
            );
        }
        return <></>;
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
