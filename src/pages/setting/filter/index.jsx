import React from 'react';
import FilterTree from './tree';
import FilterList from './list';
import PageContainer from '@Components/page-container';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import { getFilterList } from './api';
import './index.less';

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
const buttonKes = {
    enable: {
        1: 'alarmFilters:add',
        4: 'forwardRuleManage:add',
        70: 'emailSendRuleManage:add',
        8: 'alarmSound:add',
        64: 'autpInDispatch:add',
        14: 'ivrRuleManage:enable',
    },
    add: {
        1: 'alarmFilters:add',
        4: 'forwardRuleManage:add',
        70: 'emailSendRuleManage:add',
        8: 'alarmSound:add',
        64: 'autpInDispatch:add',
        14: 'ivrRuleManage:add',
        63: 'alarmFollowUpRuleManage:add',
    },
    edit: {
        1: 'alarmFilters:edit',
        4: 'forwardRuleManage:edit',
        70: 'emailSendRuleManage:edit',
        8: 'alarmSound:edit',
        64: 'autpInDispatch:edit',
        14: 'ivrRuleManage:edit',
        63: 'alarmFollowUpRuleManage:edit',
    },
    tree: {
        1: 'alarmFilters:tree',
        4: 'forwardRuleManage:tree',
        70: 'emailSendRuleManage:tree',
        8: 'alarmSound:tree',
        64: 'autpInDispatch:tree',
        14: 'ivrRuleManage:tree',
        63: 'alarmFollowUpRuleManage:tree',
    },
    copy: {
        1: 'alarmFilters:copy',
        4: 'forwardRuleManage:copy',
        70: 'emailSendRuleManage:copy',
        8: 'alarmSound:copy',
        64: 'autpInDispatch:copy',
        14: 'ivrRuleManage:copy',
        63: 'alarmFollowUpRuleManage:copy',
    },
    delete: {
        1: 'alarmFilters:delete',
        4: 'forwardRuleManage:delete',
        70: 'emailSendRuleManage:delete',
        8: 'alarmSound:delete',
        64: 'autpInDispatch:delete',
        14: 'ivrRuleManage:delete',
        63: 'alarmFollowUpRuleManage:delete',
    },
    export: {
        1: 'alarmFilters:export',
        4: 'forwardRuleManage:export',
        70: 'emailSendRuleManage:export',
        8: 'alarmSound:export',
        64: 'autpInDispatch:export',
        14: 'ivrRuleManage:export',
        63: 'alarmFollowUpRuleManage:export',
    },
    history: {
        1: 'alarmFilters:history',
        4: 'forwardRuleManage:history',
        70: 'emailSendRuleManage:history',
        8: 'alarmSound:history',
        64: 'autpInDispatch:history',
        14: 'ivrRuleManage:history',
        63: 'alarmFollowUpRuleManage:history',
    },
    batchDelete: {
        1: 'alarmFilters:batchDelete',
    },
};
class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            // 树形:tree、列表:list
            mode: props.match.params.mode, // 'list',
        };
    }

    /**
     * @description: 获取过滤器列表数据
     * @param {*} params 分页，查询项等参数
     * @param {*} params 排序等参数
     * @param {*} filters
     * @return {*}
     */
    getFilterData = async (params, sorter, filters) => {
        const { moduleId } = this.props.match.params;
        const {
            login: { userId },
        } = this.props;

        let queryParam = {
            modelId: 2,
            moduleId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
            creator: userId,
            filterProvince: params.filterProvince,
            ..._.omitBy(params, (value, key) => !value || _.endsWith(key, 'queryProperties') || key === 'province_id'),
        };
        if (queryParam.filterProvince && Array.isArray(queryParam.filterProvince)) {
            queryParam = {
                ...queryParam,
                filterProvince: queryParam.filterProvince ? queryParam.filterProvince?.join(',') : '',
            };
        }
        //  特殊查询参数处理
        const queryProperties = [];

        _.each(params, (value, key) => {
            if (
                _.isArray(value) &&
                value.length > 0 &&
                value[0] !== '' &&
                _.endsWith(key, 'queryProperties') &&
                key !== 'professional_type_queryProperties'
            ) {
                const newkey = _.replace(key, '_queryProperties', '');
                // if (newkey === 'province_id') {
                //     filterProvince = value?.join(',');
                // } else if (newkey === 'professional_type') {
                //     filterProfessional = value?.join(',');
                // }
                queryProperties.push({ key: newkey, value });
            } else if (_.isArray(value) && value.length > 0 && key === 'province_id') {
                queryProperties.push({ key, value });
            }
        });

        if (queryProperties.length > 0) {
            queryParam.queryProperties = JSON.stringify(queryProperties);
        }

        if (!_.isEmpty(sorter)) {
            _.forIn(sorter, (value, key) => {
                queryParam.orderFieldName = key;
                queryParam.order = value === 'ascend' ? FILTER_EMUN.ORDER.ASC : FILTER_EMUN.ORDER.DESC;
            });
        }
        const formatterFilters = _.pickBy(filters, (item) => item);
        if (formatterFilters && !_.isEmpty(formatterFilters)) {
            queryParam = { ...queryParam, ...formatterFilters };
        }

        if (params.province_id || params.province_id === 0) {
            queryParam.filterProvince = params.province_id;
        }
        if (params.professional_type_queryProperties && Array.isArray(params.professional_type_queryProperties)) {
            queryParam.filterProfessional = params.professional_type_queryProperties.toString();
        }

        if (!queryParam.filterProfessional) {
            delete queryParam.filterProfessional;
        }

        const res = await getFilterList(queryParam);
        if (res?.data) {
            const { current, pageSize } = params;
            const dataWithIndex = (res?.data || []).map((item, index) => {
                return {
                    ...item,
                    index: index + (current - 1) * pageSize + 1,
                };
            });
            return {
                data: dataWithIndex,
                success: true,
                total: res?.total || 0,
            };
        }
        return {
            data: [],
            success: true,
            total: 0,
        };
    };

    /**
     * @description: 树形列表切换
     * @param {*} mode list: 列表 tree树形
     * @return
     */

    onModeChange = () => {
        const { mode } = this.state;
        this.setState({
            mode: mode === 'tree' ? 'list' : 'tree',
        });
    };

    render() {
        const { mode } = this.state;
        return (
            <PageContainer showHeader={false}>
                {mode === 'tree' ? (
                    <FilterTree
                        history={this.props.history}
                        getFilterData={this.getFilterData}
                        moduleId={this.props.match.params.moduleId}
                        onModeChange={this.onModeChange}
                        buttonKes={buttonKes}
                    />
                ) : (
                    <FilterList
                        getFilterData={this.getFilterData}
                        history={this.props.history}
                        moduleId={this.props.match.params.moduleId}
                        onModeChange={this.onModeChange}
                        buttonKes={buttonKes}
                    />
                )}
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
