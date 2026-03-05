// import locales from "locales";
import React from 'react';
import { _ } from 'oss-web-toolkits';
import { Input, Icon, Space, Tree, message, Button } from 'oss-ui';
import FilterInfo from '@Src/components/filter-info';
import AuthButton from '@Src/components/auth-button';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import Delete from '../delete';
// import Export from '../export';
import History from '../history';
import './index.less';
import { getCommonMsgWithSelectFilter } from '../utils';
import { autoSendOrder, getExportProgressApi, fileDownLoadApi } from './api';
import AsyncExportModal from '../async-export-modal';
import { filterTypeOptions } from '@Src/pages/auto-sheet-rule/enum';
import constants from '@Src/common/constants';

let reload = false;
class Index extends React.PureComponent {
    asyncExportTimer = null;
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
            userInfo: {},
            filterName: undefined,
            asyncExportModalVisible: false,
            asyncExportList: [],
            totalNum: 0,
        };
        this.msg = getCommonMsgWithSelectFilter(props.moduleId);
    }
    componentDidMount() {
        this.getAllFilters();
        const userInFo = JSON.parse(this.props.login.userInfo);
        const userInfo = {
            // userProvinceId:
            //     zoneInfo &&
            //     zoneInfo[0]?.zoneLevel &&
            //     (parseInt(zoneInfo[0].zoneLevel, 10) === 1 ? zoneInfo[0]?.zoneId : zoneInfo[0].zoneLevel_2Id),
            // groupUser: zoneInfo && zoneInfo[0]?.zoneLevel ? parseInt(zoneInfo[0].zoneLevel, 10) === 1 : false,
            // userId: this.props.login.userId,
            // userName: this.props.login.userName,
            // userProvinceName: zoneInfo && zoneInfo[0]?.zoneName,
            // userMobile: userInFo.userMobile,
            isAdmin: userInFo.isAdmin,
        };
        this.setState({
            userInfo,
        });
    }
    componentDidUpdate(prevProps) {
        if (reload !== this.props?.history?.location?.state?.reload && this.props?.history?.location?.state?.reload) {
            this.getAllFilters();
            this.onReload();
            reload = true;
        }
        if (prevProps.moduleId !== this.props.moduleId) {
            this.getAllFilters();
            this.onReload();
            reload = true;
        }
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

    getAllFilters = async () => {
        const { login } = this.props;
        const { systemInfo } = login;
        const filters = await this.props.getFilterData({
            current: 1,
            pageSize: 99999,
            filterProvince: this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
        });
        this.setState({
            allFilters: filters.data,
            showFillters: this.formatFilterOrRuleData(filters.data),
            expandedKeys: ['mine', 'share'],
            totalNum: filters.total,
        });
    };
    onReload = () => {
        this.setState({
            selectedFilter: {},
            expandedKeys: ['mine', 'share'],
        });
    };
    formatFilterOrRuleData = (data) => {
        const {
            moduleId,
            login: { userId },
        } = this.props;
        const ruleNameList = [];
        filterTypeOptions.forEach((item) => {
            ruleNameList.push(+item.value);
        });

        const allData = [
            {
                // TODO 这里key名字起的也有很大问题
                key: 'mine',
                title: ruleNameList.includes(+moduleId) ? `我的规则` : `已启用规则`,
                children: [],
            },
            {
                key: 'share',
                title: ruleNameList.includes(+moduleId) ? `共享规则` : `未启用规则`,
                children: [],
            },
        ];

        if (Array.isArray(data)) {
            data.forEach((item) => {
                if (String(item.creatorId) === String(userId)) {
                    allData[0].children.push({ ...item, key: item.filterId, title: item.filterName });
                } else {
                    // 我这里断言 后端已经做好鉴权相关的操作
                    allData[1].children.push({ ...item, key: item.filterId, title: item.filterName });
                }
            });
        }

        return allData;
    };

    // 搜索
    onSearch = (value) => {
        const { allFilters } = this.state;
        const allFiltersTemp = allFilters.filter((item) => item.filterName.includes(value));
        this.setState({
            expandedKeys: ['mine', 'share'],
            showFillters: this.formatFilterOrRuleData(allFiltersTemp),
            filterName: value,
        });
    };

    // 选中节点
    onSelect = (selectedKeys, e) => {
        // 根节点不触发选中
        if (!_.includes(['mine', 'share'], selectedKeys[0]) && e?.selectedNodes[0]) {
            this.setState({
                selectedFilter: e.selectedNodes[0],
            });
        }
    };

    // 新建/编辑跳转
    editFilterClick = (type) => {
        const { selectedFilter } = this.state;
        // const moduleIdList = [];
        // filterTypeOptions.forEach((item)=>{
        //     moduleIdList.push(+item.value);
        // })

        const { moduleId } = this.props;
        // if (moduleIdList.includes(+moduleId)) {
        //     moduleId = 10;
        // }

        if (type === 'new') {
            reload = false;
            this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/new/${moduleId}/new/tree`);
        } else if (!selectedFilter || !selectedFilter.filterId) {
            const msg = `请选择${this.msg}`;
            message.error(msg);
        } else {
            reload = false;
            this.props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/auto-sheet-rule/${type}/${moduleId}/${selectedFilter.filterId}/tree`);
        }
    };
    onExpand = (expandedKeys) => {
        this.setState({ expandedKeys });
    };

    sendOrder = async () => {
        const { filterName, totalNum } = this.state;
        const {
            moduleId,
            login: { userId, systemInfo },
            login,
        } = this.props;
        const params = {
            modelId: 2,
            moduleId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
            creator: userId,
            filterName,
            filterProvince: this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
            userId,
            exportType: 'excel',
            exportSize: totalNum,
        };
        if (!filterName) {
            delete params.filterName;
        }
        await autoSendOrder(params);
    };
    getExportProgress = async () => {
        const {
            login: { userId },
        } = this.props;
        const result = await getExportProgressApi({ userId });
        if (result.code === 0) {
            const { exportSize, exportTimeStr, exportType, progress, exportStatus } = result.data;
            const defaultStatus = {
                str: '',
                status: '',
            };
            if (exportStatus && progress === 100) {
                defaultStatus.str = '导出完成';
                defaultStatus.status = 'success';
            }
            if (exportStatus && progress !== 100) {
                defaultStatus.str = '正在导出';
                defaultStatus.status = 'active';
            }
            if (!exportStatus) {
                defaultStatus.str = '导出失败';
                defaultStatus.status = 'exception';
            }
            const list = {
                exportFormat: exportType,
                exportTime: exportTimeStr,
                exportTotal: exportSize,
                exportState: defaultStatus.str,
                exportSchedule: { status: defaultStatus.status, percent: progress },
            };
            this.setState({
                asyncExportList: [list],
            });
            if (progress < 100 && !this.asyncExportTimer && progress > 0) {
                this.asyncExportTimer = setInterval(() => {
                    this.getExportProgress();
                }, 2000);
            }
            if (progress === 100 || !exportStatus) {
                clearInterval(this.asyncExportTimer);
                this.asyncExportTimer = null;
            }
        }
    };
    // eslint-disable-next-line consistent-return
    onExport = () => {
        this.sendOrder();
        this.asyncExportTimer = setInterval(() => {
            this.getExportProgress();
        }, 2000);
    };
    onDownLoad = async () => {
        const {
            login: { userId },
            moduleId,
        } = this.props;
        await fileDownLoadApi({ userId, moduleId });
    };
    onClose = () => {
        clearInterval(this.asyncExportTimer);
        this.asyncExportTimer = null;
    };
    getAuthKey = () => {
        // const { moduleId } = this.props;

        // switch (moduleId) {
        //     case '604':
        //         return 'crhSheetRuleManage';
        //     case '605':
        //         return 'superviseSheetRuleManage';
        //     default:
        //     }
        return 'sheetRuleManage';
    };
    render() {
        const { showFillters, selectedFilter, expandedKeys, userInfo, asyncExportModalVisible, asyncExportList, totalNum } = this.state;
        const {
            onModeChange,
            moduleId,
            login: { userId },
        } = this.props;
        const authKey = this.getAuthKey();

        return (
            <div className="tree-mode-wrapper unicom-spaicing-style">
                <div className="func-list oss-imp-alart-common-bg" style={{ padding: '6px' }}>
                    <Space style={{ paddingLeft: '16px' }}>
                        <AuthButton onClick={this.editFilterClick.bind(this, 'new')} authKey={`${authKey}:add`}>
                            <Icon antdIcon type="PlusOutlined" />
                            新建
                        </AuthButton>
                        {selectedFilter && (String(selectedFilter.creatorId) === userId || userInfo.isAdmin) && (
                            <AuthButton onClick={this.editFilterClick.bind(this, 'edit')} authKey={`${authKey}:edit`}>
                                <Icon type="EditOutlined" antdIcon />
                                编辑
                            </AuthButton>
                        )}

                        <AuthButton onClick={this.editFilterClick.bind(this, 'copy')} authKey={`${authKey}:copy`}>
                            <Icon type="CopyOutlined" antdIcon />
                            复制
                        </AuthButton>
                        {selectedFilter && (String(selectedFilter.creatorId) === userId || userInfo.isAdmin) && (
                            <Delete onFresh={this.getAllFilters} onReload={this.onReload} login={this.props.login} data={selectedFilter} />
                        )}
                        <AuthButton
                            authKey={`${authKey}:export`}
                            onClick={() => {
                                this.getExportProgress();
                                this.setState({ asyncExportModalVisible: true });
                            }}
                        >
                            <Icon antdIcon type="ExportOutlined" />
                            导出
                        </AuthButton>
                        <History onFresh={this.getAllFilters} data={selectedFilter} moduleId={moduleId} />
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
                            onSelect={this.onSelect}
                            defaultExpandAll={true}
                            expandedKeys={expandedKeys}
                            treeData={showFillters}
                            onExpand={this.onExpand}
                        />
                    </div>
                    <div className="filter-info-wrapper">
                        <FilterInfo data={selectedFilter} moduleId={moduleId} />
                    </div>
                </div>
                <AsyncExportModal
                    visible={asyncExportModalVisible}
                    setVisible={(v) => this.setState({ asyncExportModalVisible: v })}
                    onExport={() => this.onExport()}
                    exportList={asyncExportList}
                    onDownLoad={() => this.onDownLoad()}
                    onClose={() => this.onClose()}
                    total={totalNum}
                />
            </div>
        );
    }
}

export default withModel([useLoginInfoModel], (shareInfo) => ({
    login: shareInfo[0],
}))(Index);
