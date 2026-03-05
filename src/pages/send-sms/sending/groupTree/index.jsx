/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Input, Tree, Pagination } from 'oss-ui';
import request from '@Src/common/api';
import _omit from 'lodash/omit';
const { Search } = Input;
const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i += 1) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    return parentKey;
};
const getParentKeys = (field, data, list) => {
    // let parentKey;
    let obj = data.find((item) => field.parent === item.key);
    if (obj) {
        list.push(obj.key);
        getParentKeys(obj, data, list);
    }
    return;
};
const getChildKeys = (field, data, list) => {
    // let parentKey;
    let obj = data.filter((item) => field.key === item.parent);
    if (obj && obj.length > 0) {
        obj.forEach((use) => {
            list.push(use.key);
            getChildKeys(use, data, list);
        });
    }
    return;
};
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
function dataToJson(one, data) {
    let kids;
    if (!one) {
        // 第1次递归
        kids = data.filter((item) => item.parent == 1);
    } else {
        kids = data.filter((item) => item.parent == one.key);
    }
    kids.forEach((item) => (item.children = dataToJson(item, data)));
    return kids.length ? kids : [];
}
class GroupTree extends React.Component {
    state = {
        expandedKeys: [],
        searchKey: '',
        autoExpandParent: true,
        checkedKeys: [],
        treeData: [],
        treeDataAll: [],
        expandedKeysAll: [],
        pageIndex: 1,
        pageSize: 50,
        total: 2200,
    };
    componentDidMount() {
        // this.getUserGroupList();
    }
    componentDidUpdate(prevProps) {
        if (this.props.groupKeys !== prevProps.groupKeys) {
            // const listKeys = [];
            // this.state.expandedKeysAll.forEach((item) => {
            //     if (this.props.groupKeys.includes(item.userId)) {
            //         listKeys.push(item.key);
            //     }
            // });
            this.setState({
                checkedKeys: this.props.groupKeys,
            });
        }
        if (this.props.zoneId !== prevProps.zoneId) {
            this.getUserGroupList();
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
    getUserGroupList = (searchContent) => {
        request('manualShortNote/queryShortNoteGroupList', {
            type: 'get',
            baseUrlType: 'noticeUrl',
            showSuccessMessage: false,
            data: {
                pageNum: 0,
                pageSize: 10000,
                operator: this.props.userId, //102624,
                regionId: this.props.zoneId, //254116531,
                searchContent,
            },
        }).then((res) => {
            if (res && res.data) {
                const treeData = this.loopTreeData(res.data);
                const expandedKeysAll = [];
                getDataList(treeData, expandedKeysAll);
                this.setState({ treeData: treeData, treeDataAll: treeData, expandedKeysAll });
            }
        });
    };
    loopTreeData = (dataList) => {
        return dataList.map((item) => {
            if (item.groupUsers) {
                return {
                    title: item.groupName,
                    key: item.groupId,
                    parent: 1,
                    children: this.loopUserData(item.groupUsers, item.groupId),
                };
            }
            return {
                title: item.groupName,
                key: item.groupId,
                parent: 1,
                ...item,
            };
        });
    };
    loopUserData = (dataList, groupId) => {
        return dataList.map((item, index) => {
            return {
                title: item.zhName,
                key: item.userId + groupId,
                parent: groupId,
                groupId,
                ...item,
            };
        });
    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    onCheck = (key, node) => {
        if (node.checked) {
            const list = node.checkedNodes.filter((a) => a.userId);
            if (list.length > 0) {
                const userlist = list.map((item) => {
                    return {
                        key: item.key,
                        deptId: item.deptId,
                        deptName: item.deptName,
                        mobilephone: item.mobilephone,
                        userId: item.userId,
                        zhName: item.zhName,
                    };
                });
                this.props.changeTreeList(key, userlist, node.checked);
            }
        } else {
            let delUserIds = [node.node.key];
            if (node.node.children && node.node.children.length > 0) {
                delUserIds = node.node.children.map((a) => a.key);
            }
            // const users = node.checkedNodes.filter((a) => !delUserIds.includes(a.userId));
            this.props.changeTreeList(delUserIds, node.node.children, node.checked);
            // this.props.changeTreeList(key, node.node.children, node.checked);
        }
    };
    onChange = (e) => {
        const { value } = e.target;
        this.setState({ searchKey: value });
    };
    onSearchChange = (searchKey) => {
        const { treeDataAll, expandedKeysAll } = this.state;
        const treeList = treeDataAll;
        if (searchKey.trim() === '') {
            this.setState({
                searchKey,
                autoExpandParent: true,
                treeData: treeList,
            });
            return;
        }
        const expandedKeys = expandedKeysAll
            .map((item) => {
                if (item.title && item.title.indexOf(searchKey) > -1) {
                    return getParentKey(item.key, treeList);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        const listKeys = expandedKeysAll.filter((item) => item.title && item.title.indexOf(searchKey) > -1);
        let list = listKeys.map((item) => item.key);
        listKeys.forEach((item) => {
            getParentKeys(item, expandedKeysAll, list);
            getChildKeys(item, expandedKeysAll, list);
        });

        let setList = new Set(list);
        let data = expandedKeysAll.filter((item) => setList.has(item.key));
        let lists = dataToJson(null, data);
        this.setState({
            searchKey,
            expandedKeys,
            autoExpandParent: true,
            treeData: lists,
        });
    };
    render() {
        const { searchKey, expandedKeys, autoExpandParent, checkedKeys, treeData, pageIndex, pageSize, total } = this.state;
        const height = window.innerHeight - 340;
        const loop = (data) =>
            data.map((item) => {
                const index = item.title?.indexOf(searchKey);
                const beforeStr = item.title?.substr(0, index);
                const afterStr = item.title?.substr(index + searchKey.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value" style={{ color: '#f50' }}>
                                {searchKey}
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
                    value={searchKey}
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
                    onCheck={this.onCheck}
                    treeData={loop(treeData)}
                    height={height}
                />
            </div>
        );
    }
}
export default GroupTree;
