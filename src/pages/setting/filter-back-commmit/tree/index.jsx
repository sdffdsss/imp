// import locales from "locales";
import React from 'react';
import { Button, Input, Icon, Space, Tree, message } from 'oss-ui';
import request from '@Common/api';
import constants from '@Src/common/constants';
import Copy from '../copy';
import Delete from '../delete';
import Export from '../export';
import History from '../history';
import FilterInfo from '@Components/filter-info';
import './index.less';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 过滤器
            allFilters: props.data,
            // 过滤器展示的树状数据
            showFillters: this.formatFilters(props.data),
            privateFilters: [],
            sharedFilters: [],
            // 当前选中的过滤器id
            selectedFilter: null,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                allFilters: this.props.data,
                showFillters: this.formatFilters(this.props.data),
            });
        }
    }

    // 格式化过滤器数据为树形
    formatFilters = (data) => {
        const showFilters = [
            {
                key: 'mine',
                title: '我的过滤器',
                children: [],
            },
            {
                key: 'share',
                title: '共享过滤器',
                children: [],
            },
        ];

        data.forEach((item) => {
            if (item.owner.id === 3) {
                showFilters[0].children.push({ ...item, key: item.id, title: item.name });
            } else {
                showFilters[1].children.push({ ...item, key: item.id, title: item.name });
            }
        });

        return showFilters;
    };

    // 搜索
    onSearch = (value) => {
        const { allFilters } = this.state;

        const allFiltersTemp = allFilters.filter((item) => item.name.includes(value));

        this.setState({
            showFillters: this.formatFilters(allFiltersTemp),
        });
    };

    // 选中节点
    onSelect = (selectedKeys, e) => {
        request('sysadminFilter/filter-detail-name', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            data: {
                context: {
                    FILTER_ID: e.node.id,
                },
                iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
            },
        }).then((res) => {
            if (res && Array.isArray(res.data) && res.data.length > 0) {
                this.setState({
                    selectedFilter: res.data[0],
                });
            }
        });
    };

    // 新建/编辑跳转
    editFilterClick = (type) => {
        const { selectedFilter } = this.state;
        const { moduleId } = this.props;

        if (type === 'new') {
            this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/edit/${moduleId}/new`);
        } else {
            if (!selectedFilter) {
                this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/edit/${moduleId}/${selectedFilter.id}`);
            } else {
                message.error('请选择过滤器');
            }
        }
    };

    render() {
        const { showFillters, selectedFilter } = this.state;
        const { onModeChange, onFresh, moduleId } = this.props;

        return (
            <div className="tree-mode-wrapper">
                <div className="func-list oss-imp-alart-common-bg" style={{ padding: '10px' }}>
                    <Space style={{ paddingLeft: '16px' }}>
                        <Button onClick={this.editFilterClick.bind(this, 'new')}>
                            <Icon antdIcon type="PlusOutlined" />
                            新建
                        </Button>
                        <Button onClick={this.editFilterClick.bind(this, 'edit')}>
                            <Icon type="EditOutlined" antdIcon />
                            编辑
                        </Button>
                        <Copy moduleId={moduleId} onFresh={onFresh} data={selectedFilter} />
                        <Delete onFresh={onFresh} data={selectedFilter} />
                        <Export data={selectedFilter} />
                        <History data={selectedFilter} />
                        <Button onClick={onModeChange}>
                            <Icon antdIcon type="UnorderedListOutlined" />
                            列表
                        </Button>
                    </Space>
                </div>
                <div className="tree-mode-content-wrapper">
                    <div className="filter-tree-list">
                        <Input.Search placeholder="请输入过滤器名称" onSearch={this.onSearch} enterButton />
                        <Tree showLine={{ showLeafIcon: false }} onSelect={this.onSelect} defaultExpandAll={true} treeData={showFillters} />
                    </div>
                    <div className="filter-info-wrapper">
                        <FilterInfo data={selectedFilter} />
                    </div>
                </div>
            </div>
        );
    }
}
