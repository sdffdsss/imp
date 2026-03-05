/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Input, Tree, message } from 'oss-ui';
import request from '@Src/common/api';
import _omit from 'lodash/omit';
const { Search } = Input;
const getDataList = (data, list) => {
    data.forEach((item) => {
        if (item.children) {
            let obj = _omit(item, 'children');
            if (!list.find((items) => items.key === obj.key)) {
                list.push(obj);
            }
            getDataList(item.children, list);
        } else {
            if (!list.find((items) => items.key === item.key)) {
                list.push(item);
            }
        }
    });
};
class GroupTree extends React.Component {
    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        checkedKeys: [],
        hisCheckKey: [],
        treeDataAll: [],
        treeData: [],
        userData: [],
        expandedKeysAll: [],
    };
    componentDidMount() {
        this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'rootNode' });
    }
    componentDidUpdate(prevProps) {
        if (this.props.groupKeys !== prevProps.groupKeys) {
            // const { treeData } = this.state;
            // const expandedKeysAll = [];
            // getDataList(treeData, expandedKeysAll);
            // const listKeys = this.props.groupKeys;
            // if (this.props.groupKeys.length > prevProps.groupKeys.length) {
            //     expandedKeysAll.forEach((item) => {
            //         if (this.props.groupKeys.includes(item.otherInfo?.userId)) {
            //             listKeys.push(item.key);
            //         }
            //     });
            // }
            this.setState({
                checkedKeys: this.props.groupKeys,
            });
        }
        if (this.props.reset !== prevProps.reset) {
            this.setState({
                expandedKeys: [],
                searchKey: '',
                autoExpandParent: true,
                checkedKeys: [],
            });
        }
    }
    //
    getUserGroupList = (data) => {
        const newId = data.newDeptId;
        delete data.newDeptId;
        return request('alarmResourceByeoms/queryDeptTree', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取部门人员数据失败，请检查服务filterUrl',
            data,
        }).then((res) => {
            if (res && res.data) {
                if (data.queryType === 'rootNode') {
                    const datas = res.data;
                    this.setState({ treeData: this.disposeData(datas), treeDataAll: datas });
                } else if (data.queryType === 'childrenNode') {
                    const { treeData } = this.state;
                    this.loopTreeData(treeData, newId, res.data);
                    if (!this.state.searchValue) {
                        this.setState({ treeData: this.disposeData(treeData), treeDataAll: treeData });
                    } else {
                        this.setState({ treeData: this.disposeData(treeData) });
                    }
                } else if (data.queryType === 'deptOruserName') {
                    const datas = res.data;
                    const expandedKeys = [];
                    this.loopTreeSearchKey(datas, expandedKeys);
                    const loadedKeys = expandedKeys.length > 0 ? [expandedKeys[0]] : [];
                    this.setState({ expandedKeys: expandedKeys, loadedKeys, autoExpandParent: true, treeData: this.disposeData(datas) });
                }
            }
            return;
        });
    };
    loopTreeData = (list, key, children) => {
        list.forEach((item) => {
            if (item.key === key) {
                item.children = children;
            } else if (item.children && item.children.length > 0) {
                this.loopTreeData(item.children, key, children);
            }
        });
    };

    //判断根节点取消三角
    disposeData = (dataList) => {
        return dataList.map((item) => {
            if (item.children) {
                if (item.subjoin2 === 'person') {
                    return {
                        ...item,
                        switcherIcon: <div></div>,
                        children: this.disposeData(item.children),
                    };
                } else {
                    return {
                        ...item,
                        children: this.disposeData(item.children),
                    };
                }
            }
            if (item.subjoin2 === 'person') {
                return {
                    ...item,
                    switcherIcon: <div></div>,
                };
            } else {
                return {
                    ...item,
                };
            }
        });
    };

    loopTreeSearchKey = (list, expandedKeys) => {
        const { searchValue } = this.state;
        list.forEach((item) => {
            if (item.title.indexOf(searchValue) > -1) {
                expandedKeys.push(`D${item.parent}`);
            } else if (item.children && item.children.length > 0) {
                this.loopTreeSearchKey(item.children, expandedKeys);
            }
        });
    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            loadedKeys: expandedKeys,
            autoExpandParent: false,
        });
    };
    onCheck = (keys, node) => {
        if (node.checked) {
            const listNodes = node.checkedNodes.filter((a) => a.subjoin2 === 'person');
            const list = listNodes.map((item) => {
                return {
                    key: item.key,
                    ...item.otherInfo,
                };
            });
            if (list.length > 0) {
                this.setState({ hisCheckKey: keys });
                this.props.changeTreeList(null, list, node.checked);
            } else {
                message.error('节点下没有人员');
            }
        } else {
            const { hisCheckKey } = this.state;
            const delKey = hisCheckKey.filter((a) => !keys.includes(a));
            this.props.changeTreeList(delKey, null, node.checked);
        }
    };
    onChange = (e) => {
        const { value } = e.target;
        this.setState({ searchValue: value });
    };
    onSearchChange = (searchTest) => {
        const searchValue = searchTest.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        var reg = /^[\d]+$/;
        if (!searchValue) {
            this.setState({ loadedKeys: [], expandedKeys: [], autoExpandParent: false, treeData: this.state.treeDataAll });
        } else {
            if (reg.test(searchValue)) {
                if (searchValue.length > 3) {
                    this.setState({ treeData: [] }, () => {
                        this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'deptOruserName', name: searchValue });
                    });
                } else {
                    message.info('部门人员数据量较大，请至少输入4个数字查询');
                }
            } else {
                if (searchValue.length > 1) {
                    this.setState({ treeData: [] }, () => {
                        this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'deptOruserName', name: searchValue });
                    });
                } else {
                    message.info('部门人员数据量较大，请输入2个字符查询');
                }
            }
        }
    };
    loadData = (node) => {
        if (node.children && node.children.length === 0 && node.subjoin2 !== 'person') {
            return this.getUserGroupList({
                provinceId: this.props.zoneId,
                queryType: 'childrenNode',
                deptId: node?.key[0] === 'D' ? node?.key?.substr(1) : node?.key,
                newDeptId: node.key,
            });
        }
        return Promise.resolve();
    };
    render() {
        const { searchValue, expandedKeys, loadedKeys, autoExpandParent, checkedKeys, treeData } = this.state;
        const height = window.innerHeight - 340;
        const loop = (data) =>
            data.map((item) => {
                const index = item.title?.indexOf(searchValue);
                const beforeStr = item.title?.substr(0, index);
                const afterStr = item.title?.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value" style={{ color: '#f50' }}>
                                {searchValue}
                            </span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{item.title}</span>
                    );
                if (item.children) {
                    return { ...item, title, children: loop(item.children) };
                }

                return {
                    ...item,
                    title,
                };
            });
        return (
            <div>
                <Search
                    style={{ marginBottom: 8 }}
                    placeholder="请输入名称"
                    onChange={this.onChange}
                    onSearch={(e) => this.onSearchChange(e)}
                    allowClear
                />
                <Tree
                    checkable
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={checkedKeys}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    treeData={loop(treeData)}
                    loadData={this.loadData}
                    loadedKeys={loadedKeys}
                    height={height}
                    loading={true}
                />
            </div>
        );
    }
}
export default GroupTree;
