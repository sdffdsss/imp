import React from 'react';
import request from '@Common/api';
import FilterTree from './tree';
import FilterList from './list';
import PageContainer from '@Components/page-container';
import { getCommonOptionTypeWithSelectFilter } from './utils';
import './index.less';
import moment from 'moment';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            // 树形:tree、列表:list
            mode: 'list',
            data: []
        };
    }

    componentDidMount() {
        this.getFilterList();
    }

    // 获取列表
    getFilterList = (params = {}) => {
        request('sysadminFilter/basic-filters', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                context: {
                    RULE_TYPE_FLAG: true,
                    MODULE_ID: this.props.match.params.moduleId,
                    commonOptionType: getCommonOptionTypeWithSelectFilter(Number(this.props.match.params.moduleId)),
                    ...params
                },
                iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508'
            }
        }).then((res) => {
            if (res && Array.isArray(res.data)) {
                // TODO: 目前先手动按udpateTime排序
                const hasUpdateTimeArr = res.data.filter((item) => !!item.updateTime);
                const notUpdateTimeArr = res.data.filter((item) => !item.updateTime);
                const processUpdateTimeData = hasUpdateTimeArr.sort((a, b) => {
                    return moment(b.updateTime).valueOf() - moment(a.updateTime).valueOf();
                });
                const processCreateTimeData = notUpdateTimeArr.sort((a, b) => {
                    return moment(b.createTime || 0).valueOf() - moment(a.createTime || 0).valueOf();
                });
                console.log(processUpdateTimeData);
                this.setState({
                    data: [...processUpdateTimeData, ...processCreateTimeData]
                });
            }
        });
    };

    onModeChange(mode) {
        this.setState({
            mode
        });
    }

    render() {
        const { mode, data } = this.state;
        const searchParams = new URLSearchParams(this.props.location.search);
        let title = '过滤器管理';

        if (searchParams.get('type') === 'stats') {
            title = '统计范围管理';
        }

        return (
            <PageContainer title={title} showHeader={false}>
                {mode === 'tree' ? (
                    <FilterTree
                        onFresh={this.getFilterList}
                        history={this.props.history}
                        data={data}
                        moduleId={this.props.match.params.moduleId}
                        onModeChange={this.onModeChange.bind(this, 'list')}
                    />
                ) : (
                    <FilterList
                        data={data}
                        history={this.props.history}
                        moduleId={this.props.match.params.moduleId}
                        onFresh={this.getFilterList}
                        onModeChange={this.onModeChange.bind(this, 'tree')}
                    />
                )}
            </PageContainer>
        );
    }
}
