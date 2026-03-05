import React from 'react';
import { Tree, Input, Drawer, Descriptions, Spin, message } from 'oss-ui';
import constants from '@Common/constants';
import { useEnvironmentModel } from '@Src/hox';
import request from '@Common/api';
import AlarmQuery from '@Src/pages/search/alarm-query';
import { SearchBox, NetworkDom, ProcessingNetwork, TopoXmlRequestConfig, Toolbar } from 'oss-topo';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import './index.less';

let defaultResId = '001110000000000000019904';
let resType = '';
const dataList = [];

TopoXmlRequestConfig.setProxyUrl(
    process.env.NODE_ENV === 'production'
        ? window.BASE_PATH + useEnvironmentModel.data.environment.topoXmlProxyUrl
        : useEnvironmentModel.data.environment.topoXmlProxyUrl,
);
TopoXmlRequestConfig.setStaticPath(process.env.NODE_ENV === 'production' ? `${constants.STATIC_PATH}` : 'http://10.10.2.8:7002');
const resourceList = [
    {
        label: '类名',
        value: '',
    },
    {
        label: '网元ID',
        value: '',
    },
    {
        label: '归属EMS',
        value: '',
    },
    {
        label: '网元类型',
        value: '',
    },
    {
        label: '网元名称',
        value: '',
    },
    {
        label: 'EMSID',
        value: '',
    },
    {
        label: '机房ID',
        value: '',
    },
    {
        label: '局站ID',
        value: '',
    },
    {
        label: '系统ID',
        value: '',
    },
];
const { TreeNode } = Tree;
let dataTimeMessage = null;
let abnormalTimeMessage = null;
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            networkList: [],
            networkMixin: null,
            dataList: [],
            expandedKeys: [],
            defaultSelectedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            resourceVisible: false,
            treeData: [],
            totalTreeData: [],
            alarmDetailData: [],
            instanceIds: [],
            condition: {
                active_status: { operator: 'eq', value: [1] },
                org_severity: { operator: 'eq', value: [1, 2, 3, 4] },
                event_time: {
                    operator: 'between',
                    value: [moment().startOf('day'), moment()],
                },
                standard_alarm_id: { operator: 'eq', value: [] },
            },
            tableFlag: false,
            showAlarmQuery: true,
            custName: '',
            title: '',
            topoLoading: true,
        };
    }

    dataTimeOut = null;
    abnormalTimeOut = null;

    componentDidMount = () => {
        // this.getRegionTopoData();
        // this.getTreeData();
        this.getTreeProvincesData();
        //this.getSqlData();
    };
    getSqlData = () => {
        const { userInfo } = this.props.login;
        const userInfos = JSON.parse(userInfo);
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                pageSize: 100,
                dictName: 'province_id',
                en: false,
                modelId: 2,
                creator: userInfos.userId,
                hasAdditionZone: false,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && Array.isArray(res.data)) {
                let treeDataList = [];
                res.data.forEach((item) => {
                    let obj = {
                        title: item.value,
                        key: item.key,
                        level: 1,
                        children: [{ title: '', key: '' }],
                    };
                    treeDataList.push(obj);
                });
                this.setState(
                    {
                        //expandedKeys: [data[0].key],
                        //defaultSelectedKeys: [defaultResId],
                        //autoExpandParent: false,
                        treeData: treeDataList,
                        // totalTreeData: treeDataList,
                        //title: data[0].children[0].title,
                    },
                    () => {
                        this.getTreeData(treeDataList[0].key);
                    },
                );
            }
        });
    };

    getTreeData = (key) => {
        clearTimeout(this.dataTimeOut);
        clearTimeout(this.abnormalTimeOut);
        this.dataTimeOut = setTimeout(() => {
            dataTimeMessage = message.info('数据量较大,正在获取数据,请耐心等待', 0);
        }, 8000);
        this.abnormalTimeOut = setTimeout(() => {
            setTimeout(dataTimeMessage, 0);
            abnormalTimeMessage = message.warning('获取数据超时，请稍后重试或联系管理员', 0);
        }, 16000);
        const { treeData } = this.state;
        request('view/getTopo', {
            type: 'get',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            baseUrlType: 'topuUrl',
            data: {
                clientType: 'common',
                code: 'HWNFVLIST',
                result: 'xmlnew',
                resId: key,
            },
        })
            .then((res) => {
                if (res.data) {
                    clearTimeout(this.dataTimeOut);
                    clearTimeout(this.abnormalTimeOut);
                    const data = eval(`(${res.data})`);
                    let treeDataList = [];
                    let selectObj = [];
                    treeData.forEach((item) => {
                        if (item.key === key) {
                            let obj = {
                                ...item,
                                children: data.groups,
                            };
                            treeDataList.push(obj);
                            selectObj = data.groups;
                        } else {
                            treeDataList.push(item);
                        }
                    });
                    this.generateList(treeDataList);
                    defaultResId = selectObj[0]?.children[0]?.key;
                    this.setState(
                        {
                            expandedKeys: [selectObj[0]?.children[0]?.key],
                            defaultSelectedKeys: [defaultResId],
                            autoExpandParent: true,
                            treeData: treeDataList,
                            // totalTreeData: treeDataList,
                            title: selectObj[0]?.children[0]?.title,
                        },
                        () => {
                            this.getRegionTopoData({
                                resId: selectObj[0]?.children[0]?.title,
                                resType: selectObj[0]?.children[0]?.resType,
                            });
                        },
                    );
                    // this.getRegionTopoData();
                }
            })
            .catch((e) => {
                message.error('获取数据异常,请稍后重试或联系管理员');
            });
    };

    getTreeProvincesData = () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        request('group/findProvincesAndRegions', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '省地市信息查询失败查询失败',
            baseUrlType: 'groupUrl',
            data: {
                creator: userId,
                regionId: systemInfo.currentZone?.zoneId,
            },
        }).then((res) => {
            if (res && res.length > 0) {
                let treeDataList = [];
                res.forEach((item) => {
                    let obj = {
                        title: item.regionName,
                        key: item.regionId,
                        level: 1,
                        children: [{ title: '', key: '' }],
                    };
                    treeDataList.push(obj);
                });
                this.setState(
                    {
                        //expandedKeys: [data[0].key],
                        //defaultSelectedKeys: [defaultResId],
                        //autoExpandParent: false,
                        treeData: treeDataList,
                        // totalTreeData: treeDataList,
                        //title: data[0].children[0].title,
                    },
                    () => {
                        this.getTreeData(treeDataList[0].key);
                    },
                );
            }
        });
    };
    getRegionTopoData = (otherParams = {}) => {
        const config = {
            proxyParams: {
                result: 'xmlnew',
                clientType: 'common',
                code: 'HWNFVTOPO',
                resType: resType,
                resId: defaultResId,
                //redirectUrl: 'tiangongTopoUrl',
                ...otherParams,
            },
            proxyHeaders: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            serializationTypes: {
                clientTypes: [
                    {
                        key: 'nmsNeId',
                        type: 'string',
                    },
                    {
                        key: 'instanceIds',
                        type: 'string',
                    },
                    {
                        key: 'nativeId',
                        type: 'string',
                    },
                    {
                        key: 'protectionMode',
                        type: 'string',
                    },
                    {
                        key: 'className',
                        type: 'string',
                    },
                    {
                        key: 'emsName',
                        type: 'string',
                    },
                    {
                        key: 'resNeType',
                        type: 'string',
                    },
                    {
                        key: 'emsId',
                        type: 'string',
                    },
                    {
                        key: 'resId',
                        type: 'string',
                    },
                    {
                        key: 'resRoomId',
                        type: 'string',
                    },
                    {
                        key: 'resSiteId',
                        type: 'string',
                    },
                    {
                        key: 'resSysId',
                        type: 'string',
                    },
                ],
            },
            dataFormatter: (res) => {
                console.log('--------');
                console.log(res);
                return res;
            },
        };
        ProcessingNetwork(config).then((data) => {
            this.onSaveNetworkData(data);
        });
    };

    onSaveNetworkData = (data) => {
        this.resetNetworkUI(data);
    };

    onResetData = (newNetworkList, newNetworkMixin) => {
        this.setState({
            networkList: newNetworkList,
            networkMixin: newNetworkMixin,
        });
    };

    // doubleClickElement = (e) => {
    //     const date = e.element._clientMap;
    //     resourceList[0].value = e.element.getClient('className'); // 类名
    //     resourceList[1].value = date.cuid; // 网元ID
    //     resourceList[2].value = e.element.getClient('emsName'); // 归属EMS
    //     resourceList[3].value = e.element.getClient('resNeType'); // 网元类型
    //     resourceList[4].value = date.name; // 网元名称
    //     resourceList[5].value = e.element.getClient('emsId'); // EMSID
    //     resourceList[6].value = e.element.getClient('resRoomId'); // 机房ID
    //     resourceList[7].value = e.element.getClient('resSiteId'); // 局站ID
    //     resourceList[8].value = e.element.getClient('resSysId'); // 系统ID
    //     this.setState({
    //         resourceVisible: true,
    //     });
    // };

    openResourceList = (e) => {
        // eslint-disable-next-line no-underscore-dangle
        const date = e.lastData._clientMap;
        resourceList[0].value = e.lastData.getClient('className'); // 类名
        resourceList[1].value = date.cuid; // 网元ID
        resourceList[2].value = e.lastData.getClient('emsName'); // 归属EMS
        resourceList[3].value = e.lastData.getClient('resNeType'); // 网元类型
        resourceList[4].value = date.name; // 网元名称
        resourceList[5].value = e.lastData.getClient('emsId'); // EMSID
        resourceList[6].value = e.lastData.getClient('resRoomId'); // 机房ID
        resourceList[7].value = e.lastData.getClient('resSiteId'); // 局站ID
        resourceList[8].value = e.lastData.getClient('resSysId'); // 系统ID
        this.setState({
            resourceVisible: true,
        });
    };

    onClickElement = (e) => {
        const AlarmDataEntity = e.element.getClient('AlarmDataEntity');
        if (AlarmDataEntity && AlarmDataEntity.activeIds) {
            const condition = {
                active_status: { operator: 'eq', value: [1] },
                org_severity: { operator: 'eq', value: [1, 2, 3, 4] },
                event_time: {
                    operator: 'between',
                    value: [moment().startOf('day').add(-10, 'day'), moment()],
                },
                standard_alarm_id: { operator: 'eq', value: AlarmDataEntity.activeIds },
            };
            this.setState({
                condition,
                tableFlag: true,
            });
        }
    };
    openAlarmList = (data) => {
        const AlarmDataEntity = data.getClient('AlarmDataEntity');
        if (AlarmDataEntity && AlarmDataEntity.activeIds) {
            const condition = {
                active_status: { operator: 'eq', value: [1] },
                org_severity: { operator: 'eq', value: [1, 2, 3, 4] },
                event_time: {
                    operator: 'between',
                    value: [moment().startOf('day').add(-10, 'day'), moment()],
                },
                standard_alarm_id: { operator: 'eq', value: AlarmDataEntity.activeIds },
            };
            this.setState({
                condition,
                tableFlag: true,
            });
        }
    };
    onExpand = (expandedKeys, { node }) => {
        this.setState(
            {
                expandedKeys,
                autoExpandParent: false,
            },
            () => {
                if (node?.dataRef?.level === 1 && node.children[0].key === '') {
                    this.getTreeData(node?.dataRef?.key);
                }
            },
        );
    };

    // onChange = (e) => {
    //     const { totalTreeData } = this.state;
    //     this.generateList(totalTreeData);
    //     const { value } = e.target;
    //     if (value) {
    //         const newarr = totalTreeData[0].regionList.filter((item) => item.regionName.indexOf(value) > -1);
    //         const returnArr = this.state.totalTreeData.map((item) => {
    //             return {
    //                 ...item,
    //                 regionList: newarr,
    //             };
    //         });
    //         console.log(newarr);
    //         const expandedKeys = dataList
    //             .map((item) => {
    //                 if (item.title.indexOf(value) > -1) {
    //                     return this.getParentKey(item.key, this.state.totalTreeData);
    //                 }
    //                 return null;
    //             })
    //             .filter((item, i, self) => item && self.indexOf(item) === i);
    //         this.setState({
    //             treeData: returnArr,
    //             expandedKeys,
    //             searchValue: value,
    //             autoExpandParent: true,
    //         });
    //     } else {
    //         this.setState({
    //             treeData: this.state.totalTreeData,
    //             searchValue: '',
    //             autoExpandParent: true,
    //         });
    //     }
    // };

    onChange = (value) => {
        const { treeData } = this.state;
        const expandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return this.getParentKey(item.key, treeData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    generateList = (data) => {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const node = data[i];
                const { key } = node;
                const { title } = node;
                dataList.push({ key, title });
                if (node.children) {
                    this.generateList(node.children);
                }
            }
        }
    };

    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item) => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    onClose = () => {
        this.setState({
            resourceVisible: false,
        });
    };

    showDrawer = () => {
        this.setState({
            resourceVisible: true,
        });
    };
    treeSelect = (value, { node }) => {
        if (node?.dataRef?.level !== 1) {
            this.getRegionTopoData({ resId: node.titleName, resType: node.resType });

            this.setState({
                custName: node.custName,
                title: node.titleName,
                tableFlag: false,
                topoLoading: true,
            });
        }
    };
    resetNetworkUI = (networkMixin) => {
        const { proxyParams, network } = networkMixin;
        const { code } = proxyParams;
        const datas = network.getElementBox().getDatas();
        let instanceId = [];
        for (let i = 0; i < datas.size(); i++) {
            const element = datas.get(i);
            const type = element.getClient('type');
            this.setCommonUiStyle(element);
            switch (code) {
                case 'HWNFVTOPO':
                    if (type === 'link') {
                        const protectionMode = element.getClient('protectionMode');
                        if (protectionMode === '当前保护') {
                            element.setStyle('link.pattern', [8, 8]);
                        }
                    } else if (type === 'node') {
                        let data = {
                            instanceId: element.getClient('nativeId'),
                            cuid: element.getClient('resId'),
                        };
                        instanceId.push(data);
                        element.setStyle('alarm.color', '#ffffff');
                    }
                    break;
                default:
                    break;
            }
        }
        this.setState(
            {
                instanceIds: instanceId,
                topoLoading: false,
                networkMixin: networkMixin,
                networkList: [networkMixin],
            },
            () => {
                network.zoomOverview();
                network.zoomReset();
            },
        );
    };

    setCommonUiStyle = (element) => {
        const type = element.getClient('type');
        if (type === 'node') {
            element.setStyle('select.color', 'red');
        }
        if (element instanceof window.twaver.Group) {
            element.setStyle('group.shape', 'roundrect');
            element.setStyle('group.shape.roundrect.radius', 0);
            element.setStyle('group.fill.color', 'rgba(18,37,76,0.7)');
            element.setStyle('group.outline.width', 2);
            element.setStyle('group.outline.color', '#3668b4');
        }
        element.setStyle('label.linespacing', 20);
        element.setStyle('label.yoffset', 6);
    };

    contextMenuResetItems = (defaultItems) => {
        return [
            ...defaultItems.map((item) => {
                return {
                    ...item,
                    // eslint-disable-next-line consistent-return
                    visibleTypes: (data) => {
                        const type = data.getClient('type');
                        const isPool = data.getClient('isPool');
                        switch (item.id) {
                            case 'checkAlarm':
                                if (type === 'group') return false;
                                return true;
                            case 'checkResource':
                                if (type === 'node') return true;
                                return false;
                            case 'checkPerformance':
                                if (type === 'node' && isPool === 'false') return true;
                                return false;
                            default:
                                break;
                        }
                    },
                    action: (data, callback) => {
                        switch (item.id) {
                            case 'checkAlarm':
                                this.openAlarmList(data.lastData);
                                break;
                            case 'checkResource':
                                this.openResourceList(data);
                                break;
                            case 'checkPerformance':
                                callback({
                                    request: () => new Promise(),
                                    columns: [],
                                    title: '查看性能',
                                });
                                break;
                            default:
                                break;
                        }
                    },
                };
            }),
        ];
    };

    renderTreeNodes = (data) =>
        data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });

    loop = (data) => {
        const { searchValue } = this.state;
        let datas = data.map((item) => {
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
                return { title, key: item.key, level: item.level, children: this.loop(item.children) };
            }

            return {
                title,
                key: item.key,
                level: item.level,
                resType: item.resType,
                titleName: item.title,
            };
        });
        return datas;
    };

    onChangeValue = (e) => {
        this.setState({
            searchValue: e.target.value,
        });
    };

    render() {
        const {
            treeData,
            networkList,
            networkMixin,
            expandedKeys,
            autoExpandParent,
            resourceVisible,
            condition,
            tableFlag,
            showAlarmQuery,
            title,
            searchValue,
            topoLoading,
            instanceIds,
        } = this.state;
        const { Search } = Input;

        const {
            login: { systemInfo },
        } = this.props;
        console.log({ systemInfo });

        return (
            <>
                <div className="topo-monitor-alarm">
                    <div className="topo-monitor-content">
                        <div className="topo-monitor-left">
                            <div className="search-line">
                                <Search
                                    placeholder="请输入名称"
                                    value={searchValue}
                                    onSearch={this.onChange}
                                    enterButton
                                    onChange={this.onChangeValue}
                                />
                            </div>
                            <div className="filter-tree-list">
                                <Tree
                                    onExpand={this.onExpand}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    //treeData={this.loop(treeData)}
                                    onSelect={this.treeSelect}
                                >
                                    {this.renderTreeNodes(this.loop(treeData))}
                                </Tree>
                            </div>
                        </div>
                        <div className="topo-monitor-right">
                            <div className="alarm-monitoring-topo-container">
                                <div className="topo-monitor-right-title">
                                    {/* {custName ? `${custName}:` : ''} */}
                                    {title || ''}
                                </div>
                                {topoLoading && (
                                    <div className="example">
                                        <Spin />
                                    </div>
                                )}
                                {networkMixin && (
                                    <div className="alarm-monitoring-topo-toolbar-container">
                                        <Toolbar networkMixin={networkMixin} networkList={networkList} onRefresh={this.onResetData} />
                                    </div>
                                )}
                                {/* {networkMixin && (
                                    <div className="alarm-monitoring-topo-overview-container">
                                        <Overview networkMixin={networkMixin} networkList={networkList} onResetData={this.onResetData} />
                                    </div>
                                )} */}
                                {networkMixin && (
                                    <div className="alarm-monitoring-topo-search-container">
                                        <SearchBox networkMixin={networkMixin} />
                                    </div>
                                )}
                                {/* {networkMixin && (
                                    <div className="alarm-monitoring-topo-alarm-container">
                                        <Alarm
                                            networkMixin={networkMixin}
                                            showAlarmTable={false}
                                            otherParams={{ provinceId: -1, restForwardUrl: 'tiangongTopoAlarmUrl' }}
                                        />
                                    </div>
                                )} */}
                                {/* {networkMixin && <ContextMenu networkMixin={networkMixin} resetItems={this.contextMenuResetItems} />} */}
                                {networkMixin && (
                                    <NetworkDom
                                        networkMixin={networkMixin}
                                        // onDoubleClickElement={this.doubleClickElement}
                                        networkList={networkList}
                                        onResetData={this.onResetData}
                                        contextMenu
                                        searchBox={false}
                                        resetItems={this.contextMenuResetItems}
                                        topoTheme={systemInfo?.theme}
                                        alarm={{
                                            otherParams: {
                                                type: '5gCloud',
                                                provinceId: -1,
                                                restForwardUrl: 'tiangongTopoAlarmUrl',
                                                cloud5G: instanceIds,
                                            },
                                            showAlarmTable: false,
                                        }}
                                    />
                                )}
                                {/* <Button type="primary" onClick={this.showDrawer}>
                                        Open
                                    </Button> */}
                            </div>
                            <div className="failure-sheet-bottom-container" style={{ display: tableFlag ? 'block' : 'none' }}>
                                <div className="failure-sheet-bottom-container-close" onClick={() => this.setState({ tableFlag: false })}>
                                    关闭
                                </div>
                                {showAlarmQuery && <AlarmQuery mode="alarm-window" condition={condition} />}
                            </div>
                        </div>
                        <Drawer width="450" title="查看资源" placement="right" onClose={this.onClose} visible={resourceVisible}>
                            <Descriptions bordered className="resource-list" column={1}>
                                {Array.isArray(resourceList) &&
                                    resourceList.map((item) => <Descriptions.Item label={item.label}>{item.value}</Descriptions.Item>)}
                            </Descriptions>
                        </Drawer>
                    </div>
                </div>
            </>
        );
    }
}
// export default Index;

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
