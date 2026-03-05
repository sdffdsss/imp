/* eslint-disable no-nested-ternary */
import React from 'react';
import { Button, Input, Icon, Space, Tree, message, Spin } from 'oss-ui';
import Delete from '../delete';
import Export from '../export';
import History from '../history';
import FilterInfo from '@Src/components/filter-info';
import { _ } from 'oss-web-toolkits';
import { getCommonMsgWithSelectFilter } from '../utils';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import usePageInfo from '../hox';
import { FILTER_EMUN } from '../index';
import { getFilterInfo, enableFilter } from '../api';
import request from '@Common/api';
import './index.less';
import AuthButton from '@Src/components/auth-button';
import constants from '@Common/constants';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 过滤器
            allFilters: [],
            // 过滤器展示的树状数据
            showFillters: [],
            privateFilters: [],
            sharedFilters: [],
            // 当前选中的过滤器id
            selectedFilter: { moduleId: props.moduleId },
            expandedKeys: [],
            selectEnable: '',
            loading: false,
            userInfo: {},
            pagintions: {
                current: 1,
                pageSize: 20,
                total: 0,
            },
            searchValue: '',
        };
        this.msg = getCommonMsgWithSelectFilter(props.moduleId);
        this.currentSelectedFilter = undefined;
    }

    componentDidMount() {
        this.getAllFilters();
        const userInFo = JSON.parse(this.props.login.userInfo);
        const userInfo = {
            isAdmin: userInFo.isAdmin,
        };
        this.setState({
            userInfo,
        });
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

    /**
     * @description: 获取所有过滤器
     * @param {*}
     * @return {*}
     */

    getAllFilters = async (filterName) => {
        const { pagintions, searchValue } = this.state;
        const { login } = this.props;
        const { systemInfo } = login;
        this.setState({
            loading: true,
        });
        // const filters = await this.props.getFilterData({ current: 1, pageSize: 9999 });
        const newDate = {
            creator: this.props.login.userId,
            modelId: 2,
            moduleId: this.props.moduleId,
            current: pagintions.current,
            pageSize: pagintions.pageSize,
            filterName: filterName || searchValue,
            filterProvince: this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
        };
        request(`interruptalarm/filter/v1/filters`, {
            data: newDate,
            type: 'get',
            showSuccessMessage: false,
            defaultErrorMessage: '查询过滤器树图',
            baseUrlType: 'filterUrl',
        })
            .then((filters) => {
                if (filters.code === 0) {
                    this.setState({
                        allFilters: filters.data || [],
                        showFillters: this.formatFilterOrRuleData(filters.data, filterName),
                        expandedKeys: ['mine', 'share'],
                        loading: false,
                        pagintions: {
                            current: filters.current,
                            pageSize: filters.pageSize,
                            total: filters.total,
                        },
                    });
                    this.props.pageInfo.setLoadType('init');
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                });
            });
        // this.setState({
        //     allFilters: filters.data || [],
        //     showFillters: this.formatFilterOrRuleData(filters.data),
        //     expandedKeys: ['mine', 'share'],
        //     loading: false
        // });
        // this.props.pageInfo.setLoadType('init');
    };
    actionMore = () => {
        const {
            pagintions: { current },
        } = this.state;
        this.setState(
            {
                pagintions: {
                    ...this.state.pageintions,
                    current: parseInt(current, 10) + 1,
                },
            },
            () => {
                this.getAllFilters();
            },
        );
        // console.log(pagintions);
    };
    /**
     * @description: 过滤器分组
     * @param {*}
     * @return {*}
     */

    formatFilterOrRuleData = (data, filterName) => {
        const {
            moduleId,
            login: { userId },
        } = this.props;
        const { showFillters, pagintions, selectedFilter } = this.state;
        let allData = [
            {
                // TODO 这里key名字起的也有很大问题
                key: 'mine',
                title: Number(moduleId) === 1 ? `我的过滤器` : `已启用规则`,
                children: [],
            },
            {
                key: 'share',
                title: Number(moduleId) === 1 ? `共享过滤器` : `未启用规则`,
                children: [],
            },
        ];
        if (parseInt(pagintions.current, 10) !== 1) {
            allData = showFillters;
        }
        if (Array.isArray(data)) {
            if (Number(moduleId) === 1) {
                data.forEach((item) => {
                    if (String(item.creatorId) === String(userId)) {
                        if (!allData[0].children.find((record) => record.filterId === item.filterId)) {
                            // allData[0].children = [...allData[0].children, { ...item, key: item.filterId, title: item.filterName }];
                            allData[0].children.push({ ...item, key: item.filterId, title: item.filterName });
                        }
                    } else if (String(item.creatorId) !== String(userId) && item.isPrivate === 2) {
                        if (!allData[1].children.find((record) => record.filterId === item.filterId)) {
                            allData[1].children.push({ ...item, key: item.filterId, title: item.filterName });
                        }
                        // allData[1].children.push({ ...item, key: item.filterId, title: item.filterName });
                    }
                });
                if (!filterName && String(selectedFilter.creatorId) === String(userId)) {
                    if (!allData[0].children.find((record) => record.filterId === selectedFilter.filterId)) {
                        allData[0].children.push(selectedFilter);
                    }
                }
                if (!filterName && String(selectedFilter.creatorId) !== String(userId) && selectedFilter.isPrivate === 2) {
                    if (!allData[1].children.find((record) => record.filterId === selectedFilter.filterId)) {
                        allData[1].children.push(selectedFilter);
                    }
                }
            } else {
                data.forEach((item) => {
                    if (item.enable === 1) {
                        if (!allData[0].children.find((record) => record.filterId === item.filterId)) {
                            // allData[0].children = [...allData[0].children, { ...item, key: item.filterId, title: item.filterName }];
                            allData[0].children.push({ ...item, key: item.filterId, title: item.filterName });
                        }
                    } else if (!allData[1].children.find((record) => record.filterId === item.filterId)) {
                        allData[1].children.push({ ...item, key: item.filterId, title: item.filterName });
                    }
                    if (selectedFilter.filterId === item.filterId) {
                        // 为什么加这个代码？？因为selectedFilter 修改后没变，导致下面几行又把selectedFilter推到了一个数组里
                        this.currentSelectedFilter = item;
                    }
                    // 我这里断言 后端已经做好鉴权相关的操作
                    // eslint-disable-next-line no-lonely-if
                });
                if (!filterName && this.currentSelectedFilter?.filterId && this.currentSelectedFilter?.enable === 1) {
                    if (!allData[0].children.find((record) => record.filterId === this.currentSelectedFilter?.filterId)) {
                        allData[0].children.push(this.currentSelectedFilter);
                    }
                } else if (
                    !filterName &&
                    this.currentSelectedFilter?.filterId &&
                    !allData[1].children.find((record) => record.filterId === this.currentSelectedFilter?.filterId)
                ) {
                    allData[1].children.push(this.currentSelectedFilter);
                }
            }
        }

        const treeData = _.cloneDeep(allData, true);
        return treeData;
    };

    /**
     * @description: 过滤器搜索方法
     * @param {*} value 输入值
     * @return {*}
     */
    onSearch = (value) => {
        this.setState(
            {
                expandedKeys: ['mine', 'share'],
                showFillters: [],
                pagintions: {
                    ...this.state.pagintions,
                    current: 1,
                    total: 0,
                },
                searchValue: value,
            },
            () => {
                this.getAllFilters(value);
            },
        );
    };

    /**
     * @description:
     * @param {*} selectedKeys 选中节点的key
     * @param {*} e 选中节点
     * @return {*}
     */

    onSelect = (selectedKeys, e) => {
        // 根节点不触发选中
        if (selectedKeys.length !== 0) {
            if (!_.includes(['mine', 'share'], selectedKeys[0])) {
                this.setState({
                    selectedFilter: e.selectedNodes[0],
                });
                this.props.pageInfo.setSelectFilter(e.selectedNodes[0]);
            } else {
                this.setState({
                    selectedFilter: e.selectedNodes[0],
                });
            }
        } else {
            this.setState({
                selectedFilter: {},
            });
        }
    };

    /**
     * @description: 新建/编辑跳转
     * @param {*}
     * @return {*}
     */

    editFilterClick = (type) => {
        const { selectedFilter } = this.state;
        const { moduleId } = this.props;
        this.props.pageInfo.setLoadType('init');

        if (type === 'new') {
            this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/new/${moduleId}/new/tree`);
        } else if (type === 'edit') {
            if (!selectedFilter || !selectedFilter.filterId) {
                const msg = `请选择${this.msg}`;
                message.error(msg);
            } else {
                this.props.history.push(
                    `/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/${type}/${moduleId}/${selectedFilter.filterId}/tree`,
                );
            }
        } else if (!selectedFilter || !selectedFilter.filterId) {
            const msg = `请选择${this.msg}`;
            message.error(msg);
        } else {
            this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/filter/${type}/${moduleId}/${selectedFilter.filterId}/tree`);
        }
    };

    /**
     * @description: 展开收缩树节点
     * @param {*}
     * @return {*}
     */

    onExpand = (expandedKeys) => {
        this.setState({ expandedKeys });
    };

    /**
     * @description: 启停用按钮
     * @param {*}
     * @return {*}
     */
    onEnable = async () => {
        const { selectedFilter } = this.state;
        const { moduleId } = this.props;
        const {
            login: { userId },
        } = this.props;
        if (!selectedFilter || !selectedFilter.filterId) {
            const msg = `请选择${this.msg}`;
            message.error(msg);
            return;
        }

        // 获取过滤器信息
        const filterData = {
            moduleId,
            filterId: selectedFilter.filterId,
        };
        const enableData = {
            filterId: selectedFilter.filterId,
            modelId: 2,
            moduleId,
            modifier: userId,
        };
        if (FILTER_EMUN.ENABLE.TRUE === selectedFilter.enable) {
            const enableRes = await enableFilter('disable', enableData);
            if (enableRes && enableRes.data) {
                this.props.pageInfo.setLoadType('refresh');
                const res = await getFilterInfo(filterData);
                if (res && res.data) {
                    this.setState({
                        selectedFilter: res.data,
                    });
                }
            }
        } else {
            const enableRes = await enableFilter('enable', enableData);
            if (enableRes && enableRes.data) {
                this.props.pageInfo.setLoadType('refresh');
                const res = await getFilterInfo(filterData);
                if (res && res.data) {
                    this.setState({
                        selectedFilter: res.data,
                    });
                }
            }
        }
    };

    /**
     * @description: 删除过滤器回调
     * @param {*}
     * @return {*}
     */

    onDeleteFinish = () => {
        this.setState(
            {
                selectedFilter: {},
                pagintions: {
                    ...this.state.pagintions,
                    current: 1,
                },
            },
            () => {
                this.getAllFilters();
            },
        );
    };

    componentDidUpdate(prevProps) {
        if (prevProps.pageInfo.loadType !== this.props.pageInfo.loadType) {
            if (this.props.pageInfo.loadType === 'refresh' || this.props.pageInfo.loadType === 'reload') {
                this.getAllFilters();
                this.setState({ selectedFilter: _.cloneDeep(this.props.pageInfo.selectFilter) });
            }
        }
    }
    onRef = (ref) => {
        this.child = ref;
    };

    render() {
        const { showFillters, selectedFilter, expandedKeys, loading, userInfo, pagintions } = this.state;
        const {
            onModeChange,
            moduleId,
            login: { userId },
        } = this.props;
        return (
            <div className="filter-tree-mode-wrapper unicom-spaicing-style">
                <Spin spinning={loading}>
                    <div className="func-list oss-imp-alart-common-bg" style={{ padding: '6px' }}>
                        <Space style={{ paddingLeft: '16px' }}>
                            <AuthButton onClick={this.editFilterClick.bind(this, 'new')} authKey={this.props.buttonKes.add[moduleId]}>
                                <Icon antdIcon type="PlusOutlined" />
                                新建
                            </AuthButton>
                            {/* <Button onClick={this.onEnable.bind(this, 'enable')}>
                                <Icon
                                    antdIcon
                                    type={
                                        !selectedFilter.enable
                                            ? 'PauseCircleOutlined'
                                            : FILTER_EMUN.ENABLE.TRUE === selectedFilter.enable
                                            ? 'PlayCircleOutlined'
                                            : 'PauseCircleOutlined'
                                    }
                                />
                                {!selectedFilter.enable ? '启停' : FILTER_EMUN.ENABLE.TRUE === selectedFilter.enable ? '停用' : '启用'}
                            </Button> */}
                            {selectedFilter && (String(selectedFilter.creatorId) === userId || userInfo.isAdmin) && (
                                <AuthButton onClick={this.editFilterClick.bind(this, 'edit')} authKey={this.props.buttonKes.edit[moduleId]}>
                                    <Icon type="EditOutlined" antdIcon />
                                    编辑
                                </AuthButton>
                            )}

                            <AuthButton onClick={this.editFilterClick.bind(this, 'copy')} authKey={this.props.buttonKes.copy[moduleId]}>
                                <Icon type="CopyOutlined" antdIcon />
                                复制
                            </AuthButton>
                            {selectedFilter && (String(selectedFilter.creatorId) === userId || userInfo.isAdmin) && (
                                <Delete onFresh={this.onDeleteFinish} data={selectedFilter} moduleId={moduleId} buttonKes={this.props.buttonKes} />
                            )}

                            <Export data={selectedFilter} moduleId={moduleId} />
                            <History
                                onFresh={() => {
                                    this.getAllFilters();
                                    this.child.getFilterInfo();
                                }}
                                data={selectedFilter}
                                moduleId={moduleId}
                                buttonKes={this.props.buttonKes}
                            />
                            <Button onClick={onModeChange}>
                                <Icon antdIcon type="UnorderedListOutlined" />
                                列表
                            </Button>
                        </Space>
                    </div>
                    <div className="tree-mode-content-wrapper">
                        <div className="filter-tree-list">
                            <Input.Search
                                placeholder={moduleId === '1' ? '请输入过滤器名称' : '请输入规则名称'}
                                onSearch={this.onSearch}
                                enterButton
                                allowClear
                            />
                            <Tree
                                showLine={{ showLeafIcon: false }}
                                selectedKeys={[selectedFilter.key]}
                                onSelect={this.onSelect}
                                defaultExpandAll={true}
                                expandedKeys={expandedKeys}
                                treeData={showFillters}
                                onExpand={this.onExpand}
                            />
                            {pagintions.current * pagintions.pageSize < pagintions.total && (
                                <Button type="link" onClick={this.actionMore}>
                                    加载更多
                                </Button>
                            )}
                        </div>

                        <div className="filter-info-wrapper">
                            <FilterInfo onRef={this.onRef} data={selectedFilter} moduleId={moduleId} />
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
