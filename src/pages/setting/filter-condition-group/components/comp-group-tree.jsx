import React from 'react';
import { Tree, Space, Icon, Tooltip } from 'oss-ui';
import DeleteComp from '../delete';
import { getGroupsData } from '../utils/api';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            // 当前选中的节点
            selectedNode: {},
            loading: true,
            expandedKeys: [],
            treeData: []
        };
    }

    componentDidMount() {
        this.handleData();
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.data !== this.props.data && this.props.data) || prevProps.selectedTreeKeys !== this.props.selectedTreeKeys) {
            this.handleData();
        }
        if(prevProps.data !== this.props.data && this.props.data && Array.isArray(this.props.data)){
            const { data } = this.props
            const newArr = []
            const treeData = data.map((group)=>{
                return {
                    key: `group${group.groupId}`,
                }
            })
            treeData.map(item=>{
                newArr.push(item.key)
            })
            this.setState({
                expandedKeys: newArr,
            });
        }
    }

    onReloadTable = (type) => {
        this.props.onReloadTable && this.props.onReloadTable(type);
    };

    /**
     * @description: 处理数据为树图所需要的数据
     * @param {*}
     * @return {*}
     */
    handleData = () => {
        const { selectedTreeKeys, data, selectedTreeNode, userInfo } = this.props;
        if (data && Array.isArray(data)) {
            const treeData = data.map((group) => {
                const tempArr =
                    Array.isArray(group.groupRes) &&
                    group.groupRes.map((groupNetwork) => {
                        const netWorkArr =
                            Array.isArray(groupNetwork.groupNetworkRes) &&
                            groupNetwork.groupNetworkRes.map((network) => {
                                return {
                                    key: `net${network.id}`,
                                    title: (
                                        <div className="tree-node-render">
                                            <span>{network.name}</span>
                                            {Array.isArray(selectedTreeKeys) && selectedTreeKeys.includes(`net${network.id}`) && (
                                                <Space>
                                                    <Tooltip title="编辑">
                                                        <Icon
                                                            antdIcon
                                                            type="EditOutlined"
                                                            onClick={this.editNetWorkGroup.bind(this, group, groupNetwork, network)}
                                                        />
                                                    </Tooltip>
                                                    <DeleteComp
                                                        type="tree"
                                                        buttonType="icon"
                                                        data={network}
                                                        userId={userInfo.userId}
                                                        selectedRow={selectedTreeNode}
                                                        onReloadTable={this.onReloadTable}
                                                    />
                                                </Space>
                                            )}
                                        </div>
                                    ),
                                    level: '2',
                                    groupType: group.groupId,
                                    groupNetWorkId: groupNetwork.groupNetworkId,
                                    id: network.id,
                                    name: network.name
                                };
                            });
                        return {
                            key: `groupNetwork${groupNetwork.groupNetworkId}`,
                            title: groupNetwork.groupNetworkName,
                            children: netWorkArr,
                            level: '1',
                            groupType: group.groupId,
                            id: groupNetwork.groupNetworkId,
                            name: groupNetwork.groupNetworkName
                        };
                    });
                return {
                    id: group.groupId,
                    name: group.groupName,
                    children: tempArr,
                    key: `group${group.groupId}`,
                    title: group.groupName,
                    level: '0'
                };
            });

            this.setState({
                treeData,
            });
        }
    };
    /**
     * @description: 编辑网元组
     * @param {*} networkGroup
     * @return {*}
     */
    editNetWorkGroup = async (group, groupNetwork, networkGroup, e) => {
        const { userInfo } = this.props;
        e.preventDefault();
        e.stopPropagation();
        try {
            const data = {
                current: 1,
                pageSize: 1,
                groupType: group.groupId,
                groupNetWorkType: groupNetwork.groupNetworkId,
                regionId: -1,
                groupId: networkGroup.id,
                userId: userInfo.userId
                // userId: -1,
            };
            const res = await getGroupsData(data);
            if (res && Array.isArray(res.data)) {
                const record = res.data[0] || {};
                this.props.editNetWorkGroup && this.props.editNetWorkGroup(1, record);
            }
        } catch (e) {}
    };

    /**
     * @description: 选中树节点操作
     * @param {*}
     * @return {*}
     */
    onTreeSelect = (selectedKeys, e) => {
        this.props.onTreeSelect && this.props.onTreeSelect(selectedKeys, e);
    };

    onLoadData = ({ key, children }) =>
    new Promise((resolve) => {
      if (children) {
          console.log(key,children)
        resolve();
        return;
      }
      console.log(key,children)
      resolve()
    //   this.handleData()
    });

    onExpand = (keys,{flag,node}) => {
        if(node.children){
            this.setState({
                expandedKeys:keys
            })
        }
    }

    render() {
        const { treeData, expandedKeys } = this.state;
        const { selectedKeys } = this.props;
        return (
            <>
                {Array.isArray(treeData) && treeData.length > 0 && (
                    <Tree
                        showLine={{ showLeafIcon: false }}
                        onSelect={this.onTreeSelect}
                        // defaultExpandAll
                        expandedKeys={expandedKeys}
                        treeData={treeData}
                        selectedKeys={selectedKeys}
                        // loadData={this.onLoadData}
                        onExpand={this.onExpand}
                    />
                )}
            </>
        );
    }
}
