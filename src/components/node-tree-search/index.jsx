import React from 'react';
import { Input, Tree } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import './style.less';
import request from '@Common/api';
import constants from '@Src/common/constants';

const dataList = [];
const generateList = (data) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, title } = node;
        dataList.push({ key, title });
        if (node.children) {
            generateList(node.children);
        }
    }
};

const buildTreeNode = (source, id = 'id', parentId = 'pid', children = 'children') => {
    const cloneData = _.clone(source);
    return cloneData.filter((parent) => {
        const parentNodes = cloneData.filter((child) => parent[parentId] === child[id]);
        const childNodes = cloneData.filter((child) => parent[id] === child[parentId] && child[id] !== child[parentId]);
        if (Array.isArray(childNodes) && childNodes.length > 0) {
            // eslint-disable-next-line no-param-reassign
            parent[children] = childNodes;
        }

        return parent[id] === parent[parentId] || parentNodes.length === 0;
    });
};

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.treeRef = React.createRef();
        this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            NodeTreeItem: null,
            selectedKeys: [],
            data: []
        };
        this.loadData();
    }
    loadData = () => {
        request('', {
            fullUrl: `${constants.MOCK_DATA_PATH}/treedataCity.json`,
            type: 'get'
        }).then((res) => {
            const handleData = res.goData.map((item) => {
                return { ...item, title: item.label, key: item.id };
            });
            this.setState({
                data: handleData
            });
            generateList(buildTreeNode(handleData));
        });
    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
            NodeTreeItem: null
        });
    };
    onRightClick = ({ event, node }) => {
        // window.console.log(node);
        // e.preventDefault();
        const x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
        const y = event.currentTarget.offsetTop;
        const nodeObj = this.state.data.find((item) => item.id === node.key);
        this.setState({
            NodeTreeItem: {
                pageX: x,
                pageY: y,
                id: node.props.eventKey,
                name: nodeObj.label
                // category: node.props.dataRef.category,
            },
            selectedKeys: [`${node.key}`]
        });
    };
    onSelect = () => {
        this.setState({
            NodeTreeItem: null
        });
    };
    runClick = (value) => {
        this.props.onRunClick && this.props.onRunClick(value);
        this.setState({
            NodeTreeItem: null
        });
    };

    onCheck = (_, { node: { key } }) => {
        // console.log(checkedNodes)
        this.props.onCheck(key);
    };

    onChange = (e) => {
        const { data } = this.state;
        const { value } = e.target;
        const expandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, buildTreeNode(data));
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true
        });
    };
    getTreeNodeMenu = () => {
        const { pageX, pageY } = { ...this.state.NodeTreeItem };
        const tmpStyle = {
            position: 'absolute',
            textAlign: 'center',
            left: `${pageX - 50}px`,
            top: `${pageY - 20}px`,
            color: '#000',
            padding: '0 15px'
        };
        return this.state.NodeTreeItem ? (
            <button style={tmpStyle} onClick={this.runClick.bind(this, this.state.NodeTreeItem)}>
                连接
            </button>
        ) : null;
    };
    onNodeDoubleClick = (event, node) => {
        const x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
        const y = event.currentTarget.offsetTop;
        const nodeObj = this.state.data.find((item) => item.id === node.key);
        this.setState({
            // NodeTreeItem: {
            //     pageX: x,
            //     pageY: y,
            //     id: node.props.eventKey,
            //     name: nodeObj.label,
            //     // category: node.props.dataRef.category,
            // },
            selectedKeys: [`${node.key}`]
        });
        this.runClick({
            pageX: x,
            pageY: y,
            id: node.props.eventKey,
            name: nodeObj.label
            // category: node.props.dataRef.category,
        });
    };
    render() {
        const { data, searchValue, expandedKeys, selectedKeys, autoExpandParent } = this.state;
        const { checkable, checkedKeys } = this.props;
        const loop = (data) =>
            data.map((item) => {
                const index = item.title.indexOf(searchValue);
                const beforeStr = item.title.substr(0, index);
                const afterStr = item.title.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{item.title}</span>
                    );
                if (item.children) {
                    return { title, key: item.key, children: loop(item.children) };
                }

                return {
                    title,
                    key: item.key
                };
            });
        return (
            <div style={{ height: '100%' }}>
                <Input.Search style={{ marginBottom: 8 }} placeholder="查询节点" onChange={this.onChange} />
                <div style={{ height: 'calc(100% - 40px)', overflowY: 'scroll', position: 'relative' }}>
                    <Tree
                        ref={this.treeRef}
                        treeData={loop(buildTreeNode(data))}
                        onExpand={this.onExpand}
                        selectedKeys={selectedKeys}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onRightClick={this.onRightClick}
                        checkable={checkable}
                        onSelect={this.onSelect}
                        onDoubleClick={this.onNodeDoubleClick}
                        onCheck={this.onCheck}
                        checkedKeys={checkedKeys}
                    />
                    {this.getTreeNodeMenu()}
                </div>
            </div>
        );
    }
}
