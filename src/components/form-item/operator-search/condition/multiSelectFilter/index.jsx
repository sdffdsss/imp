/* eslint-disable no-case-declarations */
/**
 * 带搜索框的多选/单选select
 *  */

import React from 'react';
import { Tooltip, Select, Icon, message } from 'oss-ui';
import constants from '@Common/services/constants';
// import configUrl from '../../../../../pages/search/alarm-query/config/config_url';
import Enums from '@Common/enum';
import getFilterByType from './filter';
import getRuleData from './rule';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

// const { iceEndpoint_sysadmin, filter, rest_filters } = configUrl;
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            conditionOptions: null,
            sreachInputValue: null,
            operatorValue: null,
        };
        this.getFilterFromConstants = this.getFilterFromConstants.bind(this);
        this.filters = {
            allFilters: [],
            myFilters: [],
        };

        this.getFormateData = this.getFormateData.bind(this);
        // this.cruuentFilterType = props.filterType;

        this.showSearch = this.props.fieldSearch;
        this.tooltipText = '无';

        this.focusSearch = false;
        this.lastSelectKeys = [];
        //
        this.sqlLast = {};
    }
    getFilterData = async () => {
        const { login } = this.props;
        const zoneId = this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
        const typeString = {
            myFilters: 'MY',
            allFilters: 'ALL',
        };
        const promises = [
            getFilterByType(login.userId, 1, zoneId, typeString.allFilters),
            getFilterByType(login.userId, 1, zoneId, typeString.myFilters),
        ];
        await Promise.all(promises).then((AllResp) => {
            // const [resALL, resMY, resRule] = AllResp;
            const [resALL, resMY] = AllResp;
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
            // Object.assign(this.filters, resRule);
        });
        this.getFilterId();
    };
    componentDidMount() {
        this.getFilterData();
        // this.getFilterId();
    }
    getFilterModuleMap() {
        const filterModul = Enums.filterModuleMap.map(({ id, name }) => ({ value: id, label: name }));
        return filterModul;
    }
    componentDidUpdate(prevProps) {
        // const { cruuentFilterType } = this;
        const { filterType } = this.props;

        // const { conditionOptions } = this.state;
        if (filterType !== prevProps.filterType) {
            // this.cruuentFilterType = this.props.filterType;
            // const conditionOptions = this.filters[this.cruuentFilterType] ?? [];
            // eslint-disable-next-line @typescript-eslint/no-shadow
            // const conditionOptions = this.getFilterFromConstants(this.cruuentFilterType) ?? [];
            // this.setState({ conditionOptions });
            // this.props.onChange(null);
            // // 联通版本 切换过滤器类型，默认选中第一个
            // if (constants.version === 'unicom' && (conditionOptions[0]?.value ?? null)) {
            //     this.props.onChange(conditionOptions[0]?.value);
            //     this.setState({ operatorValue: conditionOptions[0]?.value ?? null });
            // }
            // this.setState({ operatorValue: conditionOptions[0]?.value ?? null });
            this.getFilterId();
        }
        // viewMode向view的数据流
        const { operatorValue } = this.props;
        // const operatorValueData = operatorValue?.value !== null ? operatorValue.value : [];
        if (operatorValue !== prevProps.operatorValue) {
            this.setState({ operatorValue: operatorValue?.value });
        }
    }
    getFilterFromConstants(type) {
        switch (type) {
            case 'allRules':
                let rules = [];
                const filterKeys = ['myFilters', 'allFilters'];
                // eslint-disable-next-line no-restricted-syntax
                for (const [key, value] of Object.entries(this.filters)) {
                    if (!filterKeys.includes(key)) {
                        rules = rules.concat(value);
                    }
                }
                return rules;
            default:
                return this.filters[this.props.filterType];
        }
    }
    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };
    async getFilterId() {
        const { filterType } = this.props;
        // const zoneId = this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
        // const typeString = {
        //     myFilters: 'MY',
        //     allFilters: 'ALL'
        // };

        // todo filter_id 分两组请求数据，当前选项组和全部选项组
        // const promises = [typeString.allFilters, typeString.myFilters, typeString.ruleFitlers];

        let conditionOptions = this.filters[filterType] || [];
        // conditionOptions =
        //     conditionOptions?.data?.map((data) => ({
        //         value: data.filterId,
        //         label: data.filterName
        //     })) ?? [];
        // // // const conditionOptions = (this.getFilterFromConstants(this.cruuentFilterType) ?? []).slice(0, 100);
        // const operatorValue = this.props?.operatorValue?.value !== null ? this.props?.operatorValue.value : [];

        this.setState({ conditionOptions }, () => {
            this.setState({ operatorValue: conditionOptions[0]?.value });
        });

        // // Object.assign(this.filters, resRule);
        // // 本方法 didmount 调用后 cruuentFilterType 置为空，
        // // 触发DidUpdate过滤器选项初始化
        // // this.cruuentFilterType = null;
        this.props.onChange(conditionOptions[0]?.value || undefined);
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
            this.props.onChange(this.lastSelectKeys);
        } else {
            if (key.length > 3) {
                message.warning('最多选择3个过滤器');
                return;
            }
            this.lastSelectKeys = key;
            this.props.onChange(key);
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
    selectOnClick(flag) {
        const { conditionOptions } = this.state;
        let list = [];
        if (!flag) {
            list = conditionOptions.map((item) => item.value);
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
    render() {
        const { valueType, fieldMode = '', fieldPlaceholder = '全部', disabled = false } = this.props;
        const { operatorValue, conditionOptions } = this.state;
        if (valueType === 'enumeration' || conditionOptions.length > 0) {
            return (
                <>
                    <Tooltip placement="rightBottom" color="#FFF" title={this.tooltipText} />
                    <Select
                        disabled={disabled}
                        maxTagCount="responsive"
                        optionFilterProp="label"
                        mode={fieldMode}
                        showSearch={this.showSearch}
                        value={operatorValue}
                        placeholder={fieldPlaceholder}
                        dropdownRender={this.dropdownRender.bind(this)}
                        onChange={this.handleChange.bind(this)}
                        options={this.state.conditionOptions}
                        allowClear={true}
                        showArrow={true}
                    />
                </>
            );
        }
        return <></>;
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
