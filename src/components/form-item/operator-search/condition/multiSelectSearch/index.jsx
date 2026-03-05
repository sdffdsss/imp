/**
 * 带搜索框的多选/单选select
 *  */

import React from 'react';
import { Tooltip, Icon, SelectSearch } from 'oss-ui';
// import DropdownSearchInput from './dropdownSearchInput';
// import DropdownCheckBox from './dropdownCheckBox';
// import request from '@Common/api';
import constants from '@Common/services/constants';

import getData from '@Common/services/dataService';
// import configUrl from '../../../../../pages/search/alarm-query/config/config_url';
import { getEntry } from '@Src/pages/search/alarm-query/common/adaper/adapter_searchForm';
import Version from '@Common/path/getVersion';
import Enums from '@Common/enum';
import getFilterByType from './filter';
// import getRuleData from './rule';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

// const { iceEndpoint_sysadmin, filter, rest_filters } = configUrl;

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.maxTagCount = 2;
        this.state = {
            conditionOptions: props.conditionOptions,
            maxTagCount: props.fieldMaxDispalyCount ? props.fieldMaxDispalyCount : this.maxTagCount,
            sreachInputValue: null,
            loading: false,
        };
        // this.fetch = this.fetch.bind(this);
        this.totalFilter = 9999;
        this.getFormateData = this.getFormateData.bind(this);
        this.cruuentFilterType = props.filterType;

        this.conditionOptionsAll = props.conditionOptions;
        // 多选是屏蔽默认 搜索框，单选相反使用它
        this.showSearch = props.fieldSearch;

        this.tooltipText = '无';

        //
        // this.myRef = React.createRef();
        this.focusSearch = false;
        this.lastSelectKeys = [];
        //
        this.sqlLast = {};
    }
    componentDidMount() {}
    // eslint-disable-next-line consistent-return
    fetch = (input, pageSize, pageNum) => {
        const { dataIndex, filterType } = this.props;
        if (dataIndex === 'filter_id') {
            // 总数不比当前最后一数据序号大，则停止请求
            if (this.totalFilter <= pageSize * (pageNum - 1)) {
                return new Promise((resolve) => {
                    resolve([]);
                });
            }
            this.setState({ loading: true });
            return this.getFilterId(input, pageSize, pageNum, filterType).then(({ currentFilter, total }) => {
                this.totalFilter = total;
                this.setState({ loading: false });
                return currentFilter;
            });
        }
    };
    getFilterModuleMap() {
        const filterModul = Enums.filterModuleMap.map(({ id, name }) => ({ value: id, label: name }));
        return filterModul;
    }
    getFilterId = async (input, pageSize, pageNum, filterType) => {
        const {
            login: { userId },
        } = this.props;
        // 'myFilters','allFilters','ruleFitlers'
        return getFilterByType(userId, input, pageSize, pageNum, filterType).then((res) => {
            const { data, total } = res;
            const currentFilter = data.map((item) => ({
                key: item.filterId,
                value: item.filterId,
                label: item.filterName,
            }));
            return { currentFilter, total };
        });
    };
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
        // console.info('getDataBySqlId :' + JSON.stringify(data));
        getData(sqlId, { showSuccessMessage: false, showErrorMessage: false }, {}, -1, data).then((res) => {
            const conditionOptions = this.getFormateData(res.data);
            this.setState({ conditionOptions });
            this.conditionOptionsAll = conditionOptions;
        });
    }
    getDictName(enumId) {
        getEntry(enumId).then((dict) => {
            const conditionOptions = dict?.data.map((dicts) => {
                return { key: dicts.key, value: dict.key, label: dicts.value };
            });
            return conditionOptions;
        });
    }
    getFormateData(data) {
        const formateData = [];
        if (data === null) {
            return formateData;
        }
        // eslint-disable-next-line no-restricted-syntax
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
    handleChange(key = []) {
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
        const { fetch } = this;
        const {
            valueType,
            operatorValue,

            fieldMode = '',
            fieldPlaceholder = '全部',
            disabled = false,
            dataIndex,
            filterType,
        } = this.props;
        const { loading } = this.state;
        // this.props.operatorValue.value;
        if (valueType === 'enumeration') {
            return (
                <>
                    <Tooltip placement="rightBottom" color="#FFF" title={this.tooltipText}></Tooltip>
                    <SelectSearch
                        disabled={disabled}
                        maxTagCount="responsive"
                        optionFilterProp="label"
                        mode={fieldMode}
                        showSearch={this.showSearch}
                        value={operatorValue.value !== null ? operatorValue.value : []}
                        placeholder={fieldPlaceholder}
                        onChange={this.handleChange.bind(this)}
                        allowClear={true}
                        showArrow={true}
                        loading={loading}
                        request={fetch}
                        key={dataIndex === 'filter_id' ? `${dataIndex}_${filterType}` : dataIndex}
                    ></SelectSearch>
                </>
            );
        }
        return <></>;
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
