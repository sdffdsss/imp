import React, { Fragment, useState } from 'react';
import { Modal, Input, Tree, Transfer, message, Spin } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';
import request from '@Src/common/api';
import './index.less';
const { TreeNode } = Tree;

const isChecked = (selectedKeys, eventKey) => {
    return selectedKeys.indexOf(eventKey) !== -1;
};

const includes = (arr1, arr2) => {
    return arr2.every((val) => arr1.includes(val));
};

const generateTree = (treeNodes = [], checkedKeys = [], searchKey = '', disabled, parentCanSelect) => {
    return treeNodes.map(({ children, title, ...props }) => {
        const index = title && title.indexOf(searchKey);
        const beforeStr = title && title.substr(0, index);
        const afterStr = title && title.substr(index + searchKey.length);
        const newTitle =
            index > -1 && searchKey !== '' ? (
                <span>
                    {beforeStr}
                    <span className="site-tree-search-value" style={{ color: '#f50' }}>
                        {searchKey}
                    </span>
                    {afterStr}
                </span>
            ) : (
                <span>{title || '--'}</span>
            );
        return (
            <TreeNode
                {...props}
                title={newTitle}
                disabled={checkedKeys.includes(`${props.key}`) || disabled}
                checkable={parentCanSelect ? true : props.subjoin2 === 'person'}
                key={props.key}
                height={333}
            >
                {generateTree(children, checkedKeys, searchKey, disabled, parentCanSelect)}
            </TreeNode>
        );
    });
};

const TreeTransfer = ({
    dataSource,
    transferDataSource,
    targetKeys,
    searchKey,
    onSearchChange,
    expandedKeys,
    onExpand,
    autoExpandParent,
    onInputChange,
    loadData,
    loadedKeys,
    cellTitle,
    editedKeys,
    inputNumbers,
    handleSetLeader,
    disabled,
    selectUserList,
    parentCanSelect,
    ...restProps
}) => {
    const [spanVisible, handleSpanVisible] = useState();
    const handleDivEnter = (id) => {
        handleSpanVisible(id);
    };
    const handleDivLeave = () => {
        handleSpanVisible(false);
    };
    const filterOption = (inputValue, option) => option?.title?.indexOf(inputValue) > -1;

    // 选中项目处理
    const onCheck = async (e, checkedKeys, onItemSelect, onItemSelectAll) => {
        const { node } = e;
        const { children, subjoin2, props, key } = node;
        const { eventKey } = props;

        // 最大可以选择数据
        const maxLen = 500;

        let newChildren = children || [];

        // 子数据还没有加载时发送请求 获取子项目数据
        if (!loadedKeys.includes(key) && node.subjoin2 !== 'person') {
            const res = await loadData(node);
            newChildren = res.data;
        }

        // 点击父级选择框如果没有展开则展开，已展开则不处理
        const expandList = expandedKeys.includes(key) ? [...expandedKeys] : [...expandedKeys, key];
        // 先展开项目
        onExpand(expandList);

        // 如果当前项为人则单选
        if (subjoin2 === 'person') {
            // 是否已经选中
            const selectType = isChecked(checkedKeys, eventKey);
            // 限制可以选中最大人数
            if (checkedKeys.length >= maxLen && !selectType) {
                message.warning(`最多只可选中${maxLen}人`);
                return;
            }
            onItemSelect(eventKey, !selectType);
            return;
        }

        //  如果当前项为组则多选
        const selectChild = newChildren
            .filter((item) => {
                return item.subjoin2 === 'person';
            })
            .map((item) => item.key);

        // 判断是否当前已经全部选中
        const selectType = includes(checkedKeys, selectChild);

        // 限制可以选中最大人数
        if (selectChild.length > maxLen && !selectType) {
            message.warning(`此部门人数已超过最大可添加人数`);
            return;
        }

        // 限制可以选中最大人数
        if (checkedKeys.length + selectChild.length > maxLen && !selectType) {
            message.warning(`已选人员+此部门人数已超过最大可添加人数`);
            return;
        }

        onItemSelectAll(selectChild, !selectType);
    };

    return (
        <Transfer
            {...restProps}
            targetKeys={targetKeys}
            dataSource={transferDataSource}
            className="tree-transfer"
            showSearch
            disabled={disabled}
            filterOption={filterOption}
            render={(item) => {
                let defineLeader = '';
                if (selectUserList && Array.isArray(selectUserList)) {
                    defineLeader = selectUserList.find((item) => item?.isLeader === 1);
                }
                return (
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onMouseEnter={() => {
                            handleDivEnter(item.key);
                        }}
                        onMouseLeave={handleDivLeave}
                    >
                        {defineLeader && (defineLeader.userId === item.key || defineLeader.userIdNum === item.key) ? (
                            <span>{item.title}(组长)</span>
                        ) : (
                            <span>{item.title}</span>
                        )}
                        {spanVisible === item.key &&
                            !disabled &&
                            !(defineLeader && (defineLeader.userId === item.key || defineLeader.userIdNum === item.key)) && (
                                <a
                                    style={{ float: 'right' }}
                                    onClick={() => {
                                        handleSetLeader(item);
                                    }}
                                >
                                    设为组长
                                </a>
                            )}
                    </div>
                );
            }}
            showSelectAll={false}
        >
            {({ direction, onItemSelect, onItemSelectAll, selectedKeys }) => {
                if (direction === 'left') {
                    const checkedKeys = [...selectedKeys, ...targetKeys];
                    return (
                        <Fragment>
                            {/* <Search
                                style={{ marginBottom: 8 }}
                                placeholder="Search"
                                onSearch={(value) => {
                                    searchTreeChange(value);
                                }}
                            /> */}
                            <Input.Search
                                placeholder="部门人员查询,至少2个字符"
                                style={{ marginBottom: 8 }}
                                onSearch={(e) => onSearchChange(e)}
                                allowClear
                            />
                            <Tree
                                expandedKeys={expandedKeys}
                                onExpand={onExpand}
                                autoExpandParent={autoExpandParent}
                                blockNode
                                checkable={!disabled}
                                // checkStrictly
                                defaultExpandAll
                                checkedKeys={checkedKeys}
                                height={333}
                                loadData={loadData}
                                loadedKeys={loadedKeys}
                                // onCheck={(
                                //     _,
                                //     {
                                //         node: {
                                //             props: { eventKey },
                                //         },
                                //     },
                                // ) => {
                                //     onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                                // }}
                                // onSelect={(
                                //   _,
                                //   {
                                //     node: {
                                //       props: { eventKey },
                                //     },
                                //   }
                                // ) => {
                                //   onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                                // }}
                                onCheck={(checkedKeysValue, e) => onCheck(e, checkedKeys, onItemSelect, onItemSelectAll)}
                            >
                                {generateTree(dataSource, targetKeys, searchKey, disabled, parentCanSelect)}
                            </Tree>
                        </Fragment>
                    );
                }
            }}
        </Transfer>
    );
};
const getDataList = (data, list) => {
    data.forEach((item) => {
        if (!item) {
            return;
        }
        if (item.children) {
            let obj = _omit(item, 'children');
            if (!list.find((items) => items.key === obj.key)) {
                if (obj?.subjoin2 === 'person') {
                    obj.key = obj.otherInfo?.userIdNum;
                }
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

const getKeyDataList = (data) => {
    data.forEach((item) => {
        if (item.children) {
            if (item.subjoin2 === 'person') {
                item.key = item.otherInfo.userIdNum;
            }
            getKeyDataList(item.children);
        }
    });
};
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRow: {},
            targetKeys: [],
            searchKey: '',
            expandedKeys: [],
            autoExpandParent: true,
            transferDataSource: [],
            editUserRight: [],
            numbers: {},
            treeData: [],
            treeDataAll: [],
            editedKeys: {},
            loadedKeys: [],
            loading: false,
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.checkTree !== prevProps.checkTree) {
            this.setState({ targetKeys: this.props.checkTree }, () => {
                if (this.props.checkTree && this.props.checkTree.length > 0) {
                    if (Number(this.props.checkTree[0])) {
                        this.getUserGroupList({
                            provinceId: this.props.zoneId,
                            queryType: 'deptOruserIdNums',
                            ids: this.props.checkTree?.map((item) => (Number(item) ? Number(item) : item)),
                        });
                    } else {
                        this.getUserGroupList({
                            provinceId: this.props.zoneId,
                            queryType: 'deptOruserIds',
                            ids: this.props.checkTree?.map((item) => (Number(item) ? Number(item) : item)),
                        });
                    }
                }
            });
        }
        if (this.props.zoneId !== prevProps.zoneId) {
            this.restTreeData();
        }
    }
    componentDidMount() {
        this.getUserGroupList({
            provinceId: this.props.zoneId,
            queryType: 'rootNode',
        });
    }
    getUserGroupList = (data) => {
        const newId = data.newDeptId;
        delete data.newDeptId;
        this.setState({
            loading: true,
        });
        return request('alarmResourceByeoms/queryDeptTree', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取部门人员数据失败，请检查服务filterUrl',
            data,
        }).then((res) => {
            this.setState({
                loading: false,
            });
            if (res && res.data) {
                if (data.queryType === 'rootNode') {
                    const datas = res.data;
                    const transferData = [];
                    getDataList(datas, transferData);
                    this.setState({
                        transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                        treeData: this.disposeData(datas),
                        treeDataAll: datas,
                    });
                } else if (data.queryType === 'childrenNode') {
                    const { treeData } = this.state;
                    let dataPerson = res.data.map((item) => {
                        if (item?.subjoin2 === 'person') {
                            item.key = item.otherInfo.userIdNum || item.otherInfo.userId;
                            item = _omit(item, ['children']);
                        }
                        return item;
                    });
                    this.loopTreeData(treeData, newId, dataPerson);
                    const transferData = [];
                    getDataList(treeData, transferData);
                    if (!this.state.searchKey) {
                        this.setState({
                            transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                            treeData: this.disposeData(treeData),
                            treeDataAll: treeData,
                        });
                    } else {
                        this.setState({
                            transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                            treeData: this.disposeData(treeData),
                        });
                    }
                } else if (data.queryType === 'deptOruserName') {
                    let dataPerson = res.data.map((item) => {
                        if (item?.subjoin2 === 'person') {
                            item.key = item.otherInfo.userIdNum || item.otherInfo.userId;
                            item = _omit(item, ['children']);
                        }
                        return item;
                    });
                    const transferData = [];
                    getDataList(dataPerson, transferData);
                    const expandedKeys = [];
                    if (transferData) {
                        transferData.forEach((a) => {
                            // if (a.title.indexOf(data.name) > -1) {
                            //     expandedKeys.push(`D${a.parent}`);
                            // }
                            if (a.subjoin2 === 'dept') {
                                expandedKeys.push(a.key);
                            }
                        });
                    }
                    // const node = transferData.find(
                    //   (a) => a.title.indexOf(data.name) > -1
                    // );
                    // if (node) {
                    //   // expandedKeys.push(node.key);
                    //   expandedKeys.push(`D${node.parent}`);
                    // }
                    getKeyDataList(dataPerson);
                    this.setState({
                        expandedKeys,
                        loadedKeys: expandedKeys,
                        autoExpandParent: true,
                        transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                        treeData: this.disposeData(dataPerson),
                    });
                } else if (data.queryType === 'deptOruserIdNums') {
                    const datas = [];
                    res.data.forEach((item) => {
                        if (item) {
                            datas.push(item);
                        }
                    });
                    let dataPerson = res.data.map((item) => {
                        if (item?.subjoin2 === 'person') {
                            item.key = item.otherInfo.userIdNum || item.otherInfo.userId;
                            item = _omit(item, ['children']);
                        }
                        return item;
                    });
                    const transferData = [];
                    getDataList(dataPerson, transferData);
                    this.setState({
                        transferDataSource: this.concatArray(transferData, this.state.transferDataSource),
                        editUserRight: transferData,
                        targetKeys: transferData.map((a) => a.key),
                    });
                } else if (data.queryType === 'deptOruserIds') {
                    const datas = [];
                    res.data.forEach((item) => {
                        if (item) {
                            datas.push(item);
                        }
                    });
                    let dataPerson = res.data.map((item) => {
                        if (item?.subjoin2 === 'person') {
                            item.key = item.otherInfo.userIdNum || item.otherInfo.userId;
                            item = _omit(item, ['children']);
                        }
                        return item;
                    });
                    const transferData = [];
                    getDataList(dataPerson, transferData);
                    this.setState({
                        transferDataSource: this.concatArray(transferData, this.state.transferDataSource),
                        editUserRight: transferData,
                        targetKeys: transferData.map((a) => a.key),
                    });
                }
            }
            return res;
        });
    };
    concatArray = (first, second) => {
        let array = first.concat(second);
        let result = [];
        let obj = [];
        result = array.reduce((prev, cur) => {
            if (obj[cur.key]) {
            } else {
                obj[cur.key] = true;
                prev.push(cur);
            }
            return prev;
        }, []);
        return result;
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

    handleCancel = () => {
        const { onChange } = this.props;
        onChange(false);
        this.setState({
            numbers: {},
            editedKeys: {},
        });
        this.restTreeData();
    };

    // 树图保存时间
    handleOk = () => {
        const { onChange, cellData = {} } = this.props;
        const { targetKeys, numbers, transferDataSource } = this.state;
        let flag = true;
        const phoneExp = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/;
        const mobileExp = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[\d]))\d{8}$/;
        // targetKeys.forEach((item) => {
        //     if (!numbers[item]) {
        //         flag = false;
        //     }
        // });
        if (_isEmpty(numbers)) {
            flag = true;
        }
        if (flag) {
            let newNumbers = [];
            const editedPhoneNumber = {};
            targetKeys.forEach((item) => {
                Object.keys(numbers).forEach((itm) => {
                    if (itm == item) {
                        editedPhoneNumber[item] = numbers[itm];
                        return !newNumbers.includes(numbers[itm]) && newNumbers.push(numbers[itm]);
                    }
                });
            });
            // const result = newNumbers.every((item) => phoneExp.test(Number(item)) || mobileExp.test(Number(item)) || item === '-' || item === '');
            // if (!result) {
            //     return message.warn('号码格式不符合');
            // }
            const resultArr = [];
            targetKeys.forEach((key) => {
                const node = transferDataSource.find((item) => item.key === key);
                if (node.subjoin2 === 'person') {
                    if (!resultArr.some((v) => v.key === node.key)) {
                        resultArr.push(node);
                    }
                } else {
                    resultArr.push(node);
                }
            });
            const callback = onChange(true, resultArr, cellData, { [`${cellData.dataIndex}Tel`]: newNumbers.toString() }, true, editedPhoneNumber);
            if (!callback) {
                this.restTreeData();
            }
        } else {
            message.warn('请完善电话号码');
        }
    };

    onChange = (targetKeys) => {
        const { transferDataSource } = this.state;
        const resultArr = [];
        targetKeys.forEach((key) => {
            const node = transferDataSource.find((item) => item.key === key);
            if (node.subjoin2 === 'person') {
                if (!resultArr.some((v) => v.key === node.key)) {
                    resultArr.push(node);
                }
            } else {
                resultArr.push(node);
            }
        });
        const { change } = this.props;
        change && change(targetKeys, resultArr);
        this.setState({ targetKeys });
    };
    onSearchChange = (searchTest) => {
        const searchValue = searchTest.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        this.setState({ searchKey: searchValue });
        var reg = /^[\d]+$/;
        if (!searchValue) {
            const { treeDataAll } = this.state;
            const transferData = [];
            getDataList(treeDataAll, transferData);
            this.setState(
                {
                    transferDataSource: transferData,
                    treeData: treeDataAll,
                    loadedKeys: [],
                    expandedKeys: [],
                    autoExpandParent: false,
                },
                () => {
                    if (this.state.targetKeys && this.state.targetKeys.length > 0) {
                        this.getUserGroupList({
                            provinceId: this.props.zoneId,
                            queryType: 'deptOruserIdNums',
                            ids: this.state.targetKeys?.map((item) => Number(item)),
                        });
                    }
                },
            );
        } else {
            if (reg.test(searchValue)) {
                if (searchValue.length > 3) {
                    this.setState(
                        {
                            treeData: [],
                        },
                        () => {
                            this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'deptOruserName', name: searchValue });
                        },
                    );
                } else {
                    message.info('部门人员数据量较大，请至少输入4个数字查询');
                }
            } else {
                if (searchValue.length > 1) {
                    this.setState(
                        {
                            treeData: [],
                        },
                        () => {
                            this.getUserGroupList({
                                provinceId: this.props.zoneId,
                                queryType: 'deptOruserName',
                                name: searchValue,
                            });
                        },
                    );
                } else {
                    message.info('部门人员数据量较大，请至少输入2个字符查询');
                }
            }
        }
    };
    restTreeData = () => {
        this.setState(
            {
                transferDataSource: [],
                treeDataAll: [],
                editUserRight: [],
                treeData: [],
                targetKeys: [],
                loadedKeys: [],
                expandedKeys: [],
                autoExpandParent: false,
                numbers: {},
                editedKeys: {},
            },
            () => {
                this.getUserGroupList({
                    provinceId: this.props.zoneId,
                    queryType: 'rootNode',
                });
            },
        );
    };
    loadData = async (node) => {
        if (node.children && node.subjoin2 !== 'person') {
            return Promise.resolve();
        }
        if (node && node.subjoin2 !== 'person') {
            const res = await this.getUserGroupList({
                provinceId: this.props.zoneId,
                queryType: 'childrenNode',
                deptId: node?.key[0] === 'D' ? node?.key?.substr(1) : node?.key,
                newDeptId: node.key,
            });
            return res;
        }
        return Promise.resolve();
    };
    onExpand = (expandedKeys) => {
        const loadedKeysList = [...new Set([...this.state.loadedKeys, ...expandedKeys])];
        this.setState({
            expandedKeys,
            loadedKeys: loadedKeysList,
            autoExpandParent: false,
        });
    };

    onInputChange = (key, value, title, flag) => {
        let { numbers, editedKeys } = this.state;
        if (flag) {
            editedKeys[key] = flag;
        } else {
            delete editedKeys[key];
        }
        numbers[key] = value;
        this.setState({
            numbers,
            editedKeys,
        });
    };
    setLeader = (item) => {
        const { targetKeys, transferDataSource } = this.state;
        targetKeys.unshift(
            targetKeys.splice(
                targetKeys.findIndex((itm) => itm === item.key),
                1,
            )[0],
        );
        transferDataSource.forEach((itm) => {
            if (itm?.key === item.key) {
                itm.isLeader = 1;
            } else {
                itm.isLeader = 0;
            }
        });
        this.onChange(_.cloneDeep(targetKeys), _.cloneDeep(transferDataSource));
    };
    render() {
        const { targetKeys, searchKey, loadedKeys, expandedKeys, autoExpandParent, transferDataSource, treeData, editedKeys, numbers, loading } =
            this.state;
        const { disabled, selectUserList, parentCanSelect = false } = this.props;

        return (
            <Spin spinning={loading}>
                <div className="shcedule-transfer-container">
                    <TreeTransfer
                        disabled={disabled}
                        onInputChange={this.onInputChange}
                        dataSource={treeData}
                        transferDataSource={transferDataSource}
                        targetKeys={targetKeys}
                        onChange={this.onChange}
                        searchKey={searchKey}
                        onSearchChange={this.onSearchChange}
                        expandedKeys={expandedKeys}
                        onExpand={this.onExpand}
                        handleSetLeader={this.setLeader}
                        autoExpandParent={autoExpandParent}
                        editedKeys={editedKeys}
                        inputNumbers={numbers}
                        loadedKeys={loadedKeys}
                        loadData={this.loadData}
                        parentCanSelect={parentCanSelect}
                        selectUserList={selectUserList}
                    />
                </div>
            </Spin>
        );
    }
}
