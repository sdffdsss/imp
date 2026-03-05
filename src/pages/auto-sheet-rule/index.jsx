import React from 'react';
import request from '@Src/common/api';
// import { message } from 'oss-ui';

import PageContainer from '@Components/page-container';
import { _ } from 'oss-web-toolkits';
import './index.less';
// import formatReg from '@Common/formatReg';

import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import qs from 'qs';
import KeepAlive from 'react-activation';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import FilterTree from './tree';
import FilterList from './list';
import { filterTypeOptions } from '@Src/pages/auto-sheet-rule/enum';

export const FILTER_EMUN = {
    ENABLE: {
        TRUE: 1,
        FALSE: 2,
    },
    REVERSE: {
        TRUE: 1,
        FALSE: 2,
    },
    ORDER: {
        ASC: 1,
        DESC: 2,
    },
    ISPRIVATE: {
        TRUE: 1,
        FALSE: 2,
    },
    COMPARETYPE: {
        EQ: 'eq', // 等于
        LE: 'le',
        LT: 'lt',
        GE: 'ge',
        GT: 'gt',
        LIKE: 'like',
        IN: 'in',
        BETWEEN: 'between',
        ISNULL: 'is_null',
        NOTNULL: 'not_null',
        MIX: 'mix',
    },
};

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 树形:tree、列表:list
            mode: props.match.params.mode, // 'list',
            searchValue: {},
            currentModuleId: '10',
        };
    }

    // 获取过滤器数据——全量/分页
    getFilterData = (params, sorter, filters) => {
        const localId = localStorage.getItem('moduleId');
        let { currentModuleId } = this.state;
        if (localId) {
            currentModuleId = localId;
            this.setState({
                currentModuleId: localId,
            });
        }
        const {
            login: { userId },
        } = this.props;
        let queryParam = {
            modelId: 2,
            moduleId: currentModuleId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
            creator: userId,
            filterProvince: params.filterProvince || getInitialProvince(this.props.login),
            ..._.omitBy(params, (value, key) => !value || _.endsWith(key, 'queryProperties') || key === 'province_id' || key === 'moduleName'),
        };

        //  特殊查询参数处理
        const queryProperties = [];
        _.each(params, (value, key) => {
            if (_.isArray(value) && value.length > 0 && _.endsWith(key, 'queryProperties')) {
                const newkey = _.replace(key, '_queryProperties', '');
                queryProperties.push({ key: newkey, value });
            } else if (_.isArray(value) && value.length > 0 && key === 'province_id') {
                queryProperties.push({ key, value });
            }
        });
        if (queryProperties.length > 0) {
            queryParam.queryProperties = JSON.stringify(queryProperties);
        }
        // debugger;
        if (!_.isEmpty(sorter)) {
            _.forIn(sorter, (value, key) => {
                queryParam.orderFieldName = key;
                queryParam.order = value === 'ascend' ? FILTER_EMUN.ORDER.ASC : FILTER_EMUN.ORDER.DESC;
            });
        }
        const formatterFilters = _.pickBy(filters, (item) => item);
        if (JSON.stringify(formatterFilters) !== '{}') {
            queryParam = { ...queryParam, ...formatterFilters };
        }
        if (queryParam.filterProfessional === 'all') {
            delete queryParam.filterProfessional;
        }
        if (queryParam.filterProvince === 'all') {
            delete queryParam.filterProvince;
        }
        // if(!queryParam.filterProvince){
        //     message.warn('请选择省份')
        //     return {
        //         data: [],
        //         success: false,
        //         total: 0,
        //     };
        // }

        this.setState({
            searchValue: queryParam,
        });

        const url = `alarmmodel/filter/v1/filters?${qs.stringify(queryParam, {
            arrayFormat: 'indices',
            encode: true,
        })}`;
        return Promise.resolve(
            request(url, {
                type: 'get',
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取数据失败',
            }).then((res) => {
                const { current, pageSize } = params;
                const dataWithIndex = (res.data || []).map((item, index) => {
                    return {
                        index: index + (current - 1) * pageSize + 1,
                        ...item,
                    };
                });
                return {
                    data: dataWithIndex,
                    success: true,
                    total: res.total,
                };
            }),
        );
        // }
    };

    onModeChange = () => {
        const { mode } = this.state;
        this.setState({
            mode: mode === 'tree' ? 'list' : 'tree',
        });
    };
    onModuleIdChange = (id) => {
        localStorage.setItem('moduleId', id);
        this.setState({ currentModuleId: id });
    };

    render() {
        const { mode, searchValue, currentModuleId } = this.state;
        const searchParams = new URLSearchParams(this.props.location.search);
        // const moduleIdList = [10, 604, 605];
        const moduleIdList = [];
        filterTypeOptions.forEach((item) => {
            moduleIdList.push(+item.value);
        });

        const moduleId = moduleIdList.includes(+this.props.match.params.moduleId) ? currentModuleId : this.props.match.params.moduleId;
        let title = '过滤器管理';

        if (searchParams.get('type') === 'stats') {
            title = '统计范围管理';
        }

        return (
            <PageContainer title={title} showHeader={false}>
                {mode === 'tree' ? (
                    <KeepAlive id="tree" when>
                        <FilterTree
                            key={Date.now()}
                            history={this.props.history}
                            getFilterData={this.getFilterData}
                            moduleId={moduleId}
                            onModeChange={this.onModeChange}
                        />
                    </KeepAlive>
                ) : (
                    <KeepAlive id="list" when>
                        <FilterList
                            getFilterData={this.getFilterData}
                            history={this.props.history}
                            moduleId={moduleId}
                            onModuleIdChange={(id) => this.onModuleIdChange(id)}
                            onModeChange={this.onModeChange}
                            searchValue={searchValue}
                        />
                    </KeepAlive>
                )}
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
