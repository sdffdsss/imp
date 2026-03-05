/**
 * 带搜索框的多选/单选select
 *  */

import React from 'react';
import { Tooltip, SelectSearch, Icon, Divider } from 'oss-ui';
import constants from '@Common/services/constants';
import configUrl from '../../../../../pages/search/alarm-query/config/config_url';
import Enums from '@Common/enum';
import getFilterByType from './filter';
import getRuleData from './rule';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

const { iceEndpoint_sysadmin, filter, rest_filters } = configUrl;
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            conditionOptions: null,
            sreachInputValue: null,
            operatorValue: null,
            loading: false,
        };
        this.getFilterFromConstants = this.getFilterFromConstants.bind(this);
        this.filters = {
            allFilters: [],
            myFilters: [],
        };

        this.getFormateData = this.getFormateData.bind(this);
        this.cruuentFilterType = props.filterType;

        this.showSearch = this.props.fieldSearch;
        this.tooltipText = '无';

        this.focusSearch = false;
        this.lastSelectKeys = [];
        //
        this.sqlLast = {};
    }
    componentDidMount() {
        // this.getFilterId();
    }
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };
    getFilterModuleMap() {
        const filterModul = Enums.filterModuleMap.map(({ id, key, name }) => ({ value: id, label: name }));
        return filterModul;
    }
    fetch = (input, pageSize, pageNum) => {
        const { filterType } = this.props;
        // 总数不比当前最后一数据序号大，则停止请求
        if (this.totalFilter <= pageSize * (pageNum - 1)) {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }
        this.setState({ loading: true });
        return this.getFilterId(input, pageSize, pageNum, filterType).then(({ currentFilter, total }) => {
            this.totalFilter = total;
            this.setState({ loading: false });
            return currentFilter;
        });
    };
    getFilterId = async (input, pageSize, pageNum, filterType) => {
        const {
            login: { userId },
        } = this.props;
        // 'myFilters','allFilters','ruleFitlers'
        return getFilterByType(userId, input, pageSize, pageNum, filterType).then((res) => {
            const { data, total } = res;
            const currentFilter = data.map((data) => ({
                key: data.filterId,
                value: data.filterId,
                label: data.filterName,
            }));
            return { currentFilter, total };
        });
    };
    getFilterFromConstants(type) {
        switch (type) {
            case 'allRules':
                let rules = [];
                const filterKeys = ['myFilters', 'allFilters'];
                for (let [key, value] of Object.entries(this.filters)) {
                    if (!filterKeys.includes(key)) {
                        rules = rules.concat(value);
                    }
                }
                return rules;
            default:
                return this.filters[this.cruuentFilterType];
        }
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

    handleChange(key = []) {
        if (this.focusSearch) {
            this.props.onChange(this.lastSelectKeys);
        } else {
            this.lastSelectKeys = key;
            this.props.onChange(key);
        }
    }
    getSelectedIcon() {
        return <Icon antdIcon={true} type="CheckOutlined" />;
    }
    render() {
        const { valueType, fieldMode = '', fieldPlaceholder = '全部', disabled = false, dataIndex, filterType } = this.props;
        const { operatorValue, loading } = this.state;
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
                        value={operatorValue}
                        placeholder={fieldPlaceholder}
                        onChange={this.handleChange.bind(this)}
                        allowClear={true}
                        showArrow={true}
                        loading={loading}
                        request={this.fetch}
                        key={`${dataIndex}_${filterType}`}
                    ></SelectSearch>
                </>
            );
        }
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
