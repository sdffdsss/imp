/* eslint-disable no-plusplus */
import React from 'react';
import { Tree, Input, Drawer, Descriptions, Radio, Pagination, Button, Icon, Spin } from 'oss-ui';
import constants from '@Common/constants';
import { useEnvironmentModel } from '@Src/hox';
import request from '@Common/api';
import AlarmQuery from '@Src/pages/search/alarm-query';
import { SearchBox, NetworkDom, ProcessingNetwork, TopoXmlRequestConfig } from 'oss-topo';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import './index.less';

let defaultResId = '001110000000000000019904';
const code = 'TOPOSERVICE';
let defaultResType = 'CIRCUIT';
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
            tabShrink: true,
            treeData: [],
            totalTreeData: [],
            alarmDetailData: [],
            nmsNeId: [],
            condition: {
                // active_status: { operator: 'eq', value: [1] },
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
            radioValue: 'CIRCUITLIST',
            pageIndex: 1,
            pageSize: 50,
            total: 1,
            treeLoading: true,
            topoLoading: true,
            instanceIds: [],
            otherConfig: {},
        };
    }

    dataTimeOut = null;
    abnormalTimeOut = null;

    componentDidMount = () => {
        // this.getRegionTopoData();
        this.getTreeData();
    };

    getTreeData = () => {
        clearTimeout(this.dataTimeOut);
        clearTimeout(this.abnormalTimeOut);
        this.dataTimeOut = setTimeout(() => {
            dataTimeMessage = message.info('数据量较大,正在获取数据,请耐心等待', 0);
        }, 8000);
        this.abnormalTimeOut = setTimeout(() => {
            setTimeout(dataTimeMessage, 0);
            abnormalTimeMessage = message.warning('获取数据超时，请稍后重试或联系管理员', 0);
        }, 16000);
        const { radioValue, pageIndex, pageSize, searchValue } = this.state;
        request('view/getTopo', {
            type: 'get',
            showSuccessMessage: false,
            defaultErrorMessage: '电路信息查询失败',
            baseUrlType: 'topuUrl',
            data: {
                clientType: 'common',
                code: radioValue,
                redirectUrl: 'tiangongTopoUrl',
                pageSize,
                pageIndex,
                inputName: searchValue,
            },
        }).then((res) => {
            if (res.data) {
                clearTimeout(this.dataTimeOut);
                clearTimeout(this.abnormalTimeOut);
                // eslint-disable-next-line no-eval
                const data = eval(`(${res.data})`);
                // var data = [{ children: [{ key: '', custName: '', title: '' }], key: '', title: '' }];
                defaultResId = data.children[0]?.key;
                this.setState({
                    expandedKeys: [data.key],
                    treeLoading: false,
                    defaultSelectedKeys: [defaultResId],
                    autoExpandParent: false,
                    treeData: data.children,
                    totalTreeData: data.children,
                    custName: data.children[0]?.custName,
                    title: data.children[0]?.title,
                    pageIndex: data.pageIndex,
                    pageSize: data.pageSize,
                    total: data.total,
                });
                this.getRegionTopoData();
            }
        });
    };

    getRegionTopoData = (otherParams = {}) => {
        const { radioValue } = this.state;
        if (radioValue === 'CIRCUITLIST') {
            defaultResType = 'CIRCUIT';
        } else if (radioValue === 'EMSLIST') {
            defaultResType = 'EMS';
        } else if (radioValue === 'SYSTEMLIST') {
            defaultResType = 'SYSTEM';
        }
        const config = {
            proxyParams: {
                result: 'xmlnew',
                clientType: 'common',
                code,
                resType: defaultResType,
                resId: defaultResId,
                redirectUrl: 'tiangongTopoUrl',
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
                    {
                        key: 'provinceName',
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
        // 保存数据
        this.setState(
            {
                networkMixin: data,
                networkList: [data],
            },
            () => {
                this.resetNetworkUI();
            },
        );
    };

    onResetData = (newNetworkList, newNetworkMixin) => {
        this.setState({
            networkList: newNetworkList,
            networkMixin: newNetworkMixin,
        });
    };

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
                // active_status: { operator: 'eq', value: [1] },
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
                tabShrink: true,
            });
        }
    };
    openAlarmList = (data) => {
        const provinceName = data.getClient('provinceName');
        const AlarmDataEntity = data.getClient('AlarmDataEntity');
        if (AlarmDataEntity && AlarmDataEntity.activeIds) {
            const condition = {
                // active_status: { operator: 'eq', value: [1] },
                org_severity: { operator: 'eq', value: [1, 2, 3, 4] },
                event_time: {
                    operator: 'between',
                    value: [moment().startOf('day').add(-10, 'day'), moment()],
                },
                standard_alarm_id: { operator: 'eq', value: AlarmDataEntity?.activeIds },
            };
            this.setState({
                condition,
                tableFlag: true,
                otherConfig: { topoFlag: 1, topoProvinceName: provinceName },
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
    //     this.generateList(this.state.totalTreeData);
    //     const { value } = e.target;
    //     if (value) {
    //         const newarr = this.state.totalTreeData[0].children.filter((item) => item.title.indexOf(value) > -1);
    //         const returnArr = this.state.totalTreeData.map((item) => {
    //             return {
    //                 ...item,
    //                 children: newarr,
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
        this.setState(
            {
                searchValue: value,
                pageIndex: 1,
                pageSize: 50,
                total: 1,
            },
            () => {
                this.getTreeData();
            },
        );
    };

    onChangeValue = (e) => {
        this.setState({
            searchValue: e.target.value,
        });
    };

    generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { key } = node;
            const { title } = node;
            dataList.push({ key, title });
            if (node.children) {
                this.generateList(node.children);
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

    loop = (data) => {
        return data.map((item) => {
            const index = item.title.indexOf(this.state.searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + this.state.searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className="site-tree-search-value">{this.state.searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
            const { custName } = item;
            if (item.children) {
                return { title, key: item.key, type: item.type, children: this.loop(item.children), custName: item.custName };
            }

            return {
                title,
                key: item.key,
                type: item.type,
                custName,
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
        if (node.type === '0') {
            this.getRegionTopoData({ resId: value[0], resType: 'EMS' });
        } else {
            this.getRegionTopoData({ resId: value[0] });
        }
        this.setState({
            custName: node.custName,
            title: node.title,
            tableFlag: false,
            topoLoading: true,
        });
    };
    resetNetworkUI = () => {
        const { proxyParams, network } = this.state.networkMixin;
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { code } = proxyParams;
        const datas = network.getElementBox().getDatas();
        let nodeNmsNeId = [];
        for (let i = 0; i < datas.size(); i++) {
            const element = datas.get(i);
            const type = element.getClient('type');
            this.setCommonUiStyle(element);
            switch (code) {
                case 'TOPOSERVICE':
                    if (type === 'link') {
                        const protectionMode = element.getClient('protectionMode');
                        if (protectionMode === '当前保护') {
                            element.setStyle('link.pattern', [8, 8]);
                        }
                    } else if (type === 'node') {
                        nodeNmsNeId.push(element.getClient('nmsNeId'));
                        element.setStyle('alarm.color', '#ffffff');
                    }
                    break;
                default:
                    break;
            }
        }
        setTimeout(() => {
            this.setState({
                nmsNeId: nodeNmsNeId,
                topoLoading: false,
            });
            network.zoomOverview();
            network.zoomReset();
        });
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

    onRadioChange = (e) => {
        this.setState(
            {
                radioValue: e.target.value,
                tableFlag: false,
                searchValue: '',
                pageIndex: 1,
                pageSize: 50,
                total: 1,
                topoLoading: true,
            },
            () => {
                this.getTreeData();
            },
        );
    };

    onPageChange = (current) => {
        this.setState(
            {
                pageIndex: current,
            },
            () => {
                this.getTreeData();
            },
        );
    };

    itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <Button size="small">上一页</Button>;
        }
        if (type === 'next') {
            return <Button size="small">下一页</Button>;
        }
        return originalElement;
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
            condition,
            tableFlag,
            showAlarmQuery,
            custName,
            title,
            radioValue,
            pageIndex,
            pageSize,
            total,
            tabShrink,
            nmsNeId,
            treeLoading,
            topoLoading,
            otherConfig,
        } = this.state;
        const { Search } = Input;

        const {
            login: { systemInfo },
        } = this.props;

        return (
            <>
                <div className="topo-monitor-alarm">
                    <div className="topo-monitor-content">
                        <div className="topo-monitor-left">
                            <div className="search-radio">
                                <Radio.Group onChange={this.onRadioChange} value={radioValue}>
                                    <Radio value={'CIRCUITLIST'}>电路</Radio>
                                    <Radio value={'EMSLIST'}>EMS</Radio>
                                    <Radio value={'SYSTEMLIST'}>传输系统</Radio>
                                </Radio.Group>
                            </div>
                            <div className="search-line">
                                {treeLoading && (
                                    <div className="example">
                                        <Spin />
                                    </div>
                                )}
                                {!treeLoading && (
                                    <Search
                                        placeholder="请输入名称"
                                        value={searchValue}
                                        onSearch={this.onChange}
                                        enterButton
                                        onChange={this.onChangeValue}
                                    />
                                )}
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
                            <div className="filter-tree-page">
                                <Pagination
                                    simple
                                    defaultCurrent={pageIndex}
                                    total={total}
                                    defaultPageSize={pageSize}
                                    pageSize={pageSize}
                                    current={pageIndex}
                                    onChange={this.onPageChange}
                                    itemRender={this.itemRender}
                                />
                            </div>
                        </div>
                        <div className="topo-monitor-right">
                            <div className="alarm-monitoring-topo-container">
                                <div className="topo-monitor-right-title">
                                    {custName ? `${custName}:` : ''}
                                    {title || ''}
                                </div>
                                {topoLoading && (
                                    <div className="example">
                                        <Spin />
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
                                {networkMixin && (
                                    <NetworkDom
                                        networkMixin={networkMixin}
                                        //onDoubleClickElement={this.doubleClickElement}
                                        networkList={networkList}
                                        onResetData={this.onResetData}
                                        contextMenu
                                        searchBox={false}
                                        resetItems={this.contextMenuResetItems}
                                        topoTheme={systemInfo?.theme}
                                        alarm={{
                                            otherParams: { type: 'satisfyNew', provinceId: -1, restForwardUrl: 'tiangongTopoAlarmUrl', nmsNeId },
                                            showAlarmTable: false,
                                        }}
                                    />
                                )}
                                {/* <Button type="primary" onClick={this.showDrawer}>
                                        Open
                                    </Button> */}
                            </div>
                            {tableFlag && (
                                <div
                                    className="failure-sheet-bottom-container"
                                    style={{ display: tableFlag ? 'block' : 'none', marginBottom: tabShrink ? '0px' : '-240px' }}
                                >
                                    <div className="failure-sheet-bottom-container-close" onClick={() => this.setState({ tableFlag: false })}>
                                        关闭
                                    </div>

                                    {tabShrink && (
                                        <div className="failure-sheet-bottom-container-shrink" onClick={() => this.setState({ tabShrink: false })}>
                                            <Icon antdIcon={true} type="DownOutlined" />
                                        </div>
                                    )}
                                    {!tabShrink && (
                                        <div className="failure-sheet-bottom-container-shrink" onClick={() => this.setState({ tabShrink: true })}>
                                            <Icon antdIcon={true} type="UpOutlined" />
                                        </div>
                                    )}
                                    {showAlarmQuery && <AlarmQuery mode="alarm-window" otherConfig={otherConfig} condition={condition} />}
                                </div>
                            )}
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
