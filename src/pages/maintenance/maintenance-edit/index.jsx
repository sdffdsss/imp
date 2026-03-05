import React, { Fragment } from 'react';
import { Modal, Input, Tree, Transfer, message, Icon } from 'oss-ui';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';
import request from '@Src/common/api';
import moment from 'moment';
import { groupApi } from '../../../common/api/service/groupApi';
import { getTreeIdByProvice } from './utils';

const { TreeNode } = Tree;

const isChecked = (selectedKeys, eventKey) => {
    return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (treeNodes = [], checkedKeys = [], searchKey = '') => {
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
            <TreeNode {...props} title={newTitle} disabled={checkedKeys.includes(`${props.key}`)} key={props.key} height={333}>
                {generateTree(children, checkedKeys, searchKey)}
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
    cellData,
    editedKeys,
    inputNumbers,
    ...restProps
}) => {
    return (
        <Transfer
            {...restProps}
            targetKeys={targetKeys}
            dataSource={transferDataSource}
            className="tree-transfer"
            render={(item) => {
                if (targetKeys.includes(item.key)) {
                    const isUser = item.subjoin2 === 'person';
                    const editedNumber = cellData?.row[`${cellTitle}edit`] || {};
                    if (isUser) {
                        onInputChange(item.key, editedNumber[item.key] || item.telephone || item.subjoin1 || '-', cellTitle);
                    }
                    if (editedKeys[item.key] !== 'edit' && !isUser) {
                        onInputChange(item.key, editedNumber[item.key] || item.telephone, cellTitle);
                    }
                    return (
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <span>{item.title}</span>
                            {!isUser && (
                                <Input
                                    style={{ width: '150px', float: 'right' }}
                                    onChange={(e) => {
                                        onInputChange(item.key, e.target.value, cellTitle, 'edit');
                                    }}
                                    placeholder="请输入号码"
                                    key={inputNumbers[item.key]}
                                    defaultValue={inputNumbers[item.key] || item.telephone}
                                />
                            )}
                        </div>
                    );
                }
                return item.title;
            }}
            showSelectAll={false}
        >
            {({ direction, onItemSelect, selectedKeys }) => {
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
                                checkable
                                checkStrictly
                                defaultExpandAll
                                checkedKeys={checkedKeys}
                                height={333}
                                loadData={loadData}
                                loadedKeys={loadedKeys}
                                onCheck={(
                                    _,
                                    {
                                        node: {
                                            props: { eventKey },
                                        },
                                    },
                                ) => {
                                    onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                                }}
                                onSelect={(
                                    _,
                                    {
                                        node: {
                                            props: { eventKey },
                                        },
                                    },
                                ) => {
                                    onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                                }}
                            >
                                {generateTree(dataSource, targetKeys, searchKey)}
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
            buttonLoading: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.checkTree !== prevProps.checkTree) {
            this.setState({ targetKeys: this.props.checkTree }, () => {
                if (this.props.checkTree && this.props.checkTree.length > 0) {
                    this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'deptOruserIds', ids: this.props.checkTree });
                }
            });
        }
        if (this.props.zoneId !== prevProps.zoneId) {
            this.restTreeData();
        }
    }
    componentDidMount() {
        this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'rootNode' });
    }
    getUserGroupList = (data) => {
        const newId = data.newDeptId;
        delete data.newDeptId;

        this.setState({
            buttonLoading: true,
        });
        return request('alarmResourceByeoms/queryDeptTree', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取部门人员数据失败，请检查服务filterUrl',
            data: {
                ...data,
                provinceId: '0',
            },
        }).then((res) => {
            this.setState({
                buttonLoading: false,
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
                    this.loopTreeData(treeData, newId, res.data);
                    const transferData = [];
                    getDataList(treeData, transferData);
                    if (!this.state.searchKey) {
                        let treeId = getTreeIdByProvice(String(this.props.zoneId));
                        let treeIndex = res.data.findIndex((item) => item.key === treeId);
                        let proviceObj = res.data.filter((item) => item.key === treeId);
                        if (proviceObj && proviceObj.length > 0) {
                            this.setState(
                                {
                                    transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                                    treeData: this.disposeData(treeData),
                                    treeDataAll: treeData,
                                    autoExpandParent: true,
                                    expandedKeys: [...this.state.expandedKeys, treeId],
                                },
                                () => {
                                    if (treeIndex !== -1 && treeIndex > 13) {
                                        setTimeout(() => {
                                            console.log(document.getElementsByClassName('oss-ui-tree-list-holder'));
                                            document.getElementsByClassName('oss-ui-tree-list-holder')[0]?.scrollTo(0, (treeIndex - 1) * 22);
                                        }, 2000);
                                    }
                                    this.getUserGroupList({
                                        provinceId: this.props.zoneId,
                                        queryType: 'childrenNode',
                                        deptId: treeId.replace(/D/, ''),
                                    });
                                },
                            );
                        } else {
                            this.setState({
                                transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                                treeData: this.disposeData(treeData),
                                treeDataAll: treeData,
                            });
                        }
                    } else {
                        this.setState({
                            transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                            treeData: this.disposeData(treeData),
                        });
                    }
                } else if (data.queryType === 'deptOruserName') {
                    const datas = res.data;
                    const transferData = [];
                    getDataList(datas, transferData);
                    const expandedKeys = [];
                    if (transferData) {
                        transferData.forEach((a) => {
                            if (a.title.indexOf(data.name) > -1) {
                                expandedKeys.push(`D${a.parent}`);
                            }
                        });
                    }
                    // const node = transferData.findAll((a) => a.title.indexOf(data.name) > -1);
                    // if (node) {
                    //     // expandedKeys.push(node.key);
                    //     expandedKeys.push(`D${node.parent}`);
                    // }

                    this.setState({
                        expandedKeys,
                        loadedKeys: expandedKeys,
                        autoExpandParent: true,
                        //transferDataSource: this.concatArray(transferData, this.state.editUserRight),
                        transferDataSource: this.concatArray(transferData, this.state.transferDataSource),
                        treeData: this.disposeData(datas),
                    });
                } else if (data.queryType === 'deptOruserIds') {
                    const datas = res.data;
                    const transferData = [];
                    getDataList(datas, transferData);
                    this.setState({
                        transferDataSource: this.concatArray(transferData, this.state.transferDataSource),
                        editUserRight: transferData,
                        targetKeys: transferData.map((a) => a.key),
                    });
                }
            }
            return;
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

    checkUserInDept = async () => {
        const { targetKeys } = this.state;
        const filteredKeys = targetKeys.filter((item) => item[0] === 'D').map((item) => item.substr(1));
        let message = undefined;
        if (filteredKeys.length) {
            message = await groupApi.checkUserInDept(filteredKeys);
        }
        if (message) {
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
                content: message + ',是否确认操作?',
                okText: '确认',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                okType: 'danger',
                cancelText: '取消',
                prefixCls: 'oss-ui-modal',
                width: '350px',
                onOk: () => {
                    this.handleOk();
                },
                onCancel() {},
            });
        } else {
            this.handleOk();
        }
    };

    // 树图保存时间
    handleOk = async () => {
        const { cellData } = this.props;
        //判断当前时间是否为今天
        const isToday = moment(cellData?.row.dateTime).isSame(moment(), 'day');
        if (isToday) {
            // Modal.confirm({
            //     title: '提示',
            //     icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            //     content: this.getwarningMessage(),
            //     okText: '确认',
            //     okButtonProps: { prefixCls: 'oss-ui-btn' },
            //     cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            //     okType: 'danger',
            //     cancelText: '取消',
            //     prefixCls: 'oss-ui-modal',
            //     width: '350px',
            //     onOk: () => {
            this.saveData();
            //     },
            //     onCancel() {},
            // });
        } else {
            this.saveData();
        }
    };

    getwarningMessage = () => {
        if (moment().isSameOrBefore(moment().format('YYYY-MM-DD 07:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日9点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 07:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 12:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日14点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 12:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 17:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日18点开始生效';
        } else {
            return '此刻修改今日排班，不会立即生效，将于明日9点开始生效';
        }
    };

    getLogContext = (targetKeyRows) => {
        let logStr = '';
        const { oldCellData } = this.props;
        const oldUser = oldCellData?.row?.[oldCellData?.dataIndex] || '';
        let newUser = '';
        targetKeyRows.forEach((item) => {
            newUser += `${item.subjoin4},`;
        });
        newUser = newUser.slice(0, -1);
        if ((oldUser || newUser) && oldUser !== newUser) {
            logStr += `${oldCellData?.row?.professionalName || ''}-${oldCellData.title}：${oldUser || '空'}——${newUser || '空'}`;
        }
        return logStr;
    };

    saveData = () => {
        const { onChange, cellData } = this.props;
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
            // const result = newNumbers.every(
            //     (item) => phoneExp.test(Number(item)) || mobileExp.test(Number(item)) || item === '-' || item === '' || item === null,
            // );
            // if (!result) {
            //     return message.warn('号码格式不符合');
            // }
            let resultArr = [];
            targetKeys.forEach((key) => {
                const node = transferDataSource.find((item) => item.key === key);
                if (node?.subjoin2 === 'person') {
                    if (!resultArr.some((v) => v.otherInfo?.userId === node.otherInfo?.userId)) {
                        resultArr.push(node);
                    }
                } else {
                    resultArr.push(node);
                }
            });
            resultArr = resultArr.filter((e) => e); // 清除为空的数据
            const logStr = this.getLogContext(resultArr);
            const callback = onChange(
                true,
                resultArr,
                cellData,
                { [`${cellData.dataIndex}Tel`]: newNumbers.toString() },
                true,
                editedPhoneNumber,
                logStr,
            );
            if (!callback) {
                this.restTreeData();
            }
        } else {
            message.warn('请完善电话号码');
        }
    };

    onChange = (targetKeys) => {
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
                            queryType: 'deptOruserIds',
                            ids: this.state.targetKeys.filter((item) => item[0] === 'U' || item[0] === 'U').map((item) => item.substr(1)),
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
                            this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'deptOruserName', name: searchValue });
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
                this.getUserGroupList({ provinceId: this.props.zoneId, queryType: 'rootNode' });
            },
        );
    };
    loadData = (node) => {
        if (node.children && node.subjoin2 !== 'person') {
            return Promise.resolve();
        }
        if (node && node.subjoin2 !== 'person') {
            return this.getUserGroupList({
                provinceId: this.props.zoneId,
                queryType: 'childrenNode',
                deptId: node?.key[0] === 'D' ? node?.key?.substr(1) : node?.key,
                newDeptId: node.key,
            });
        }
        return Promise.resolve();
    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            loadedKeys: expandedKeys,
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
    render() {
        const { visible, cellData } = this.props;
        const {
            targetKeys,
            searchKey,
            loadedKeys,
            expandedKeys,
            autoExpandParent,
            transferDataSource,
            treeData,
            editedKeys,
            numbers,
            buttonLoading,
        } = this.state;
        return (
            <Modal
                destroyOnClose
                width={1200}
                title={`部门人员树图【${cellData.title}】`}
                visible={visible}
                onCancel={this.handleCancel}
                onOk={this.checkUserInDept}
                confirmLoading={buttonLoading}
            >
                <div>
                    <TreeTransfer
                        onInputChange={this.onInputChange}
                        dataSource={treeData}
                        transferDataSource={transferDataSource}
                        targetKeys={targetKeys}
                        onChange={this.onChange}
                        searchKey={searchKey}
                        onSearchChange={this.onSearchChange}
                        expandedKeys={expandedKeys}
                        onExpand={this.onExpand}
                        autoExpandParent={autoExpandParent}
                        cellTitle={cellData.dataIndex}
                        cellData={cellData}
                        editedKeys={editedKeys}
                        inputNumbers={numbers}
                        loadedKeys={loadedKeys}
                        loadData={this.loadData}
                    />
                </div>
            </Modal>
        );
    }
}
