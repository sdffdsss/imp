import React from 'react';
import { Tree, Input, Drawer, Button, Descriptions, Table, Spin, message, Icon } from 'oss-ui';
import constants from '@Common/constants';
import { useEnvironmentModel } from '@Src/hox';
import request from '@Common/api';
import AlarmQuery from '@Src/pages/search/alarm-query';
import { Toolbar, SearchBox, Overview, NetworkDom, Alarm, ProcessingNetwork, ContextMenu, AutoLayout, TopoXmlRequestConfig } from 'oss-topo';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import './index.less';

let defaultResId = '001110000000000000019904';
const code = 'TOPOSERVICE';
const defaultResType = 'CIRCUIT';
const dataList = [];
let provinceId = '';
let dataTimeMessage = null;
let abnormalTimeMessage = null;
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
            instanceIds: {},
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
            provinceName: '',
            cityName: '',
            countyName: '',
            isBack: false,
            frontParams: null,
        };
    }

    dataTimeOut = null;
    abnormalTimeOut = null;

    componentDidMount = () => {
        // this.getRegionTopoData();
        // this.getTreeData();
        this.getTreeProvincesData();
    };
    getTreeData = () => {
        request('view/getTopo', {
            type: 'get',
            showSuccessMessage: false,
            defaultErrorMessage: '电路信息查询失败',
            baseUrlType: 'topuUrl',
            data: {
                clientType: 'common',
                code: 'CIRCUITLIST',
                redirectUrl: 'tiangongTopoUrl',
            },
        }).then((res) => {
            if (res.data) {
                const data = eval(`(${res.data})`);
                // var data = [{ children: [{ key: '', custName: '', title: '' }], key: '', title: '' }];
                defaultResId = data[0].children[0].key;

                this.setState(
                    {
                        expandedKeys: [data[0].key],
                        defaultSelectedKeys: [defaultResId],
                        autoExpandParent: false,
                        treeData: data,
                        totalTreeData: data,
                        custName: data[0].children[0].custName,
                        title: data[0].children[0].title,
                    },
                    () => {
                        this.getRegionTopoData();
                    },
                );
            }
        });
    };
    getTreeProvincesData = () => {
        clearTimeout(this.dataTimeOut);
        clearTimeout(this.abnormalTimeOut);
        this.dataTimeOut = setTimeout(() => {
            dataTimeMessage = message.info('数据量较大,正在获取数据,请耐心等待', 0);
        }, 8000);
        this.abnormalTimeOut = setTimeout(() => {
            setTimeout(dataTimeMessage, 0);
            abnormalTimeMessage = message.warning('获取数据超时，请稍后重试或联系管理员', 0);
        }, 16000);
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
        }).then((data) => {
            if (data && data.length > 0) {
                clearTimeout(this.dataTimeOut);
                clearTimeout(this.abnormalTimeOut);
                defaultResId = data[0].regionId;
                provinceId = data[0].provinceId;
                this.generateList(data);
                this.setState(
                    {
                        expandedKeys: [data[0].regionId],
                        defaultSelectedKeys: [defaultResId],
                        autoExpandParent: false,
                        treeData: data,
                        totalTreeData: data,
                        custName: data[0].regionName,
                        title: data[0].regionName,
                        provinceName: data[0].regionLevel1Name,
                        cityName: data[0].regionLevel2Name,
                        countyName: data[0].regionLevel3Name,
                    },
                    () => {
                        this.getRegionTopoData();
                    },
                );
            }
        });
    };
    getRegionTopoData = (otherParams = {}) => {
        const { provinceName, cityName, countyName, isBack } = this.state;
        const params = Object.assign(
            {
                result: 'xmlnew',
                clientType: 'common',
                code: 'HWIPRANTOPOSERVICE',
                resType: defaultResType,
                provinceId: provinceId,
                provinceName: provinceName,
                cityName: cityName,
                countyName: countyName,
                redirectUrl: 'tiangongTopoUrl',
            },
            otherParams,
        );

        if (params.code === 'HWIPRANTOPOSERVICE') {
            this.setState({ isBack: false, frontParams: params });
        } else {
            this.setState({ isBack: true });
        }

        const config = {
            proxyParams: params,
            proxyHeaders: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            serializationTypes: [],
        };
        ProcessingNetwork(config).then((data) => {
            this.onSaveNetworkData(data);
        });
    };

    onSaveNetworkData = (data) => {
        // 保存数据\
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
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
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

    onChange = (e) => {
        const { value } = e.target;
        const { treeData } = this.state;
        const expandedKeys = dataList
            .map((item) => {
                if (item.regionName.indexOf(value) > -1) {
                    return this.getParentKey(item.regionId, treeData);
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
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { regionId } = node;
            const { regionName } = node;
            dataList.push({ regionId, regionName });
            if (node.regionList) {
                this.generateList(node.regionList);
            }
        }
    };

    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.regionList) {
                if (node.regionList.some((item) => item.regionId === key)) {
                    parentKey = node.regionId;
                } else if (this.getParentKey(key, node.regionList)) {
                    parentKey = this.getParentKey(key, node.regionList);
                }
            }
        }
        return parentKey;
    };

    loop = (data) => {
        return data.map((item) => {
            const index = item.regionName.indexOf(this.state.searchValue);
            const beforeStr = item.regionName.substr(0, index);
            const afterStr = item.regionName.substr(index + this.state.searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className="site-tree-search-value">{this.state.searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.regionName}</span>
                );
            if (item.regionList) {
                return {
                    title,
                    provinceId: item.provinceId,
                    key: item.regionId,
                    type: item.parentRegionId,
                    children: this.loop(item.regionList),
                    custName: item.regionName,
                    regionLevel1Name: item.regionLevel1Name,
                    regionLevel2Name: item.regionLevel2Name,
                    regionLevel3Name: item.regionLevel3Name,
                };
            }

            return {
                title,
                key: item.regionId,
                type: item.parentRegionId,
                custName: title,
                provinceId: item.provinceId,
                regionLevel1Name: item.regionLevel1Name,
                regionLevel2Name: item.regionLevel2Name,
                regionLevel3Name: item.regionLevel3Name,
            };
        });
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
        provinceId = node.provinceId;

        this.setState(
            {
                custName: node.custName,
                title: node.title,
                tableFlag: false,
                topoLoading: true,
                provinceName: node.regionLevel1Name,
                cityName: node.regionLevel2Name,
                countyName: node.regionLevel3Name,
            },
            () => {
                if (node.type === '0') {
                    this.getRegionTopoData({ resId: value[0], resType: 'EMS' });
                } else {
                    this.getRegionTopoData({ resId: value[0] });
                }
            },
        );
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
                case 'HWIPRANTOPOSERVICE':
                    if (type === 'link') {
                        const protectionMode = element.getClient('protectionMode');
                        if (protectionMode === '当前保护') {
                            element.setStyle('link.pattern', [8, 8]);
                        }
                    } else if (type === 'node') {
                        let codeVal = {
                            nodeId: element.getId(),
                            neName: element.getClient('name'),
                        };
                        instanceId.push(codeVal);
                        element.setStyle('alarm.color', '#ffffff');
                    }
                    break;
                default:
                    break;
            }
        }
        console.log(instanceId);
        this.setState(
            {
                topoLoading: false,
                instanceIds: instanceId,
                networkMixin: networkMixin,
                networkList: [networkMixin],
            },
            () => {
                setTimeout(() => {
                    network.zoomOverview();
                    network.zoomReset();
                });
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

    doubleClick = (e) => {
        const { isBack } = this.state;
        if (e.element._clientMap.type === 'node' && !isBack) {
            this.getRegionTopoData({ resId: e.element._clientMap.name, code: 'HWIPRANNETOPOSERVICE' });
        }
    };

    turnBack = () => {
        const { frontParams } = this.state;

        this.getRegionTopoData(frontParams);
    };

    render() {
        const {
            treeData,
            networkList,
            networkMixin,
            expandedKeys,
            autoExpandParent,
            resourceVisible,
            searchValue,
            alarmDetailData,
            condition,
            tableFlag,
            showAlarmQuery,
            custName,
            title,
            topoLoading,
            isBack,
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
                                <Search placeholder="请输入名称" onChange={this.onChange} enterButton />
                            </div>
                            <div className="filter-tree-list">
                                <Tree
                                    onExpand={this.onExpand}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    treeData={this.loop(treeData)}
                                    onSelect={this.treeSelect}
                                />
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
                                {networkMixin && isBack && (
                                    <div className="alarm-monitoring-topo-back-button">
                                        <Icon antdIcon type="RollbackOutlined" onClick={this.turnBack} />
                                    </div>
                                )}

                                {/* {networkMixin && (
                                    <div className="alarm-monitoring-topo-toolbar-container">
                                        <AutoLayout networkMixin={networkMixin} />
                                        <Toolbar networkMixin={networkMixin} networkList={networkList} onRefresh={this.onResetData} />
                                    </div>
                                )} */}
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
                                {networkMixin && instanceIds && (
                                    <NetworkDom
                                        networkMixin={networkMixin}
                                        // onDoubleClickElement={this.doubleClickElement}
                                        networkList={networkList}
                                        onResetData={this.onResetData}
                                        onDoubleClickElement={this.doubleClick}
                                        contextMenu
                                        searchBox={false}
                                        resetItems={this.contextMenuResetItems}
                                        topoTheme={systemInfo?.theme}
                                        alarm={{
                                            otherParams: {
                                                type: 'satisfyUserdefined',
                                                provinceId: -1,
                                                restForwardUrl: 'tiangongTopoAlarmUrl',
                                                datas: instanceIds,
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
