import React, { useEffect, useState, useRef } from 'react';
import { Tabs, Badge, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { sendLogFn } from '@Pages/components/auth/utils';
import actionss from '@Src/share/actions';
import { useLocation, useHistory } from 'react-router-dom';
import useLoginInfoModel from '@Src/hox';
import constants from '@Common/constants';
import GlobalMessage from '@Src/common/global-message';
import { MajorList } from '@Src/common/enum/majorFaultReportEnum';
import { useNavigatePage, useAuth, openRoute } from '@Src/hooks';
import { authData } from '@Src/pages/network-fault-file/auth';
import { getTemporaryRoute, getSelectCardTypeList, getFaultReportProcessCount, faultReportReadPending, syncCentralizationApi } from './api';
import { getFaultReportDetail } from '../fault-report/api';
import getColumns from './columns';
import FaultReportModal from '../troubleshooting-workbench/components/header/fault-report-modal';
import FaultReport from '../fault-report';
import './index.less';

const { TabPane } = Tabs;

interface TabItem {
    key: string;
    label: string;
    count: number;
    isShowBadge: boolean;
}

const Index: React.FC = () => {
    const [tabData, setTabData] = useState<TabItem[]>([]);
    const [columns, setColumns] = useState([]);
    const formRef = useRef();
    // 重新加载列表数据
    const tableRef = useRef();
    const [pageCurrent, setPageCurrent] = useState(1);
    const [pageTableSize, setPageTableSize] = useState(1);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('');
    const [title, setTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deviceTypeList, setDeviceTypeList] = useState([]);
    const [isView, setIsView] = useState(false);

    const memoryLocation = useLocation();
    const globalLocation = window.location;
    const memorySearchParamsIns = new URLSearchParams(memoryLocation.search);
    const globalSearchParamsIns = new URLSearchParams(globalLocation.search);
    const preActiveKey = memorySearchParamsIns.get('activeKey') || globalSearchParamsIns.get('activeKey');
    const [activeKey, setActiveKey] = useState(preActiveKey || '1');
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const { currentZone, userZoneInfo, userId, provinceId } = useLoginInfoModel();
    const { isHasAuth, isHasPathAuth } = useAuth();
    const { pushActions } = useNavigatePage();
    const noAuth = (currentZone.zoneLevel === '2' || currentZone.zoneLevel === '5') && userZoneInfo.zoneLevel === '1';
    const history = useHistory();

    const getTabCount = async () => {
        // 获取待办待阅已办已阅数量
        const countRes = await getFaultReportProcessCount({});
        setTabData([
            { key: '1', label: '我的待办', count: countRes?.data?.todoCount || 0, isShowBadge: true },
            { key: '3', label: '我的待阅', count: countRes?.data?.tobeReadCount || 0, isShowBadge: true },
            { key: '2', label: '我的已办', count: 0, isShowBadge: false },
            { key: '4', label: '我的已阅', count: 0, isShowBadge: false },
            { key: '5', label: '故障上报查询', count: 0, isShowBadge: false },
        ]);
    };

    const reloadTable = () => {
        if (tableRef?.current) {
            tableRef?.current?.reload();
            getTabCount();
        }
    };

    // 待阅已读
    const readPending = (data) => {
        if (data?.pendingReads?.length <= 0) {
            console.log('待阅已读：', 'pendingReads is empty');
            return;
        }
        faultReportReadPending(data).then((res) => {
            if (res.code === 200) {
                reloadTable();
            }
        });
    };

    const skip2NetWorkFaultFile = (id) => {
        pushActions(`/network-fault-file`, { flagId: id });
    };

    const handleSyncButton = async (flagId) => {
        const params = {
            flagIdList: [flagId],
            userId,
        };
        const res = await syncCentralizationApi(params);
        if (res.code === 200) {
            const editFlag = isHasAuth(authData.editFault) && isHasPathAuth('/unicom/network-fault-file');
            if (editFlag) {
                skip2NetWorkFaultFile(flagId);
            } else {
                message.success('同步成功');
            }
            if (tableRef?.current) {
                tableRef?.current?.reload();
            }
        } else {
            message.error(res.message);
        }
    };

    // 编辑&&查看
    const showUserEditViewClick = (record, key, curTitle) => {
        setEditType(key);
        setTitle(curTitle);
        setIsView(curTitle.indexOf('查看') >= 0);
        if (!record.flagId) {
            getFaultReportDetail({
                lifeType: 1,
                modelId: 2,
                standardAlarmId: record.standardAlarmId,
            }).then((res) => {
                setCurrentItem({ ...res.data, ...record });
            });
        } else {
            setCurrentItem(record);
        }

        // 更新待阅为已阅
        if (curTitle.indexOf('查看') >= 0 && activeKeyRef.current === '3') {
            readPending(record?.pendingReads);
            setIsModalOpen(true);
        } else if (curTitle.indexOf('上传附件') >= 0) {
            const flagId = record?.flagId ? `flagId=${record?.flagId}` : '';
            const status = record?.latestReportStatus ? `&status=${record?.latestReportStatus}` : '';
            const type = record?.faultDistinctionType ? `&type=${record?.faultDistinctionType}` : '';
            history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?${flagId}${status}${type}&isMajor=true&btnKey=${key}&activeKey=${activeKeyRef.current}`,
            );
        } else if (curTitle.indexOf('同步至集中存档') >= 0) {
            handleSyncButton(record.flagId);
        } else {
            setIsModalOpen(true);
        }
    };

    const getCols = (dutyProfessionalArr) => {
        const cols = getColumns({
            pageCurrent,
            pageTableSize,
            showUserEditViewClick,
            professionalList: dutyProfessionalArr || deviceTypeList,
            provinceId,
            noAuth,
            activeKey: activeKeyRef.current,
        });
        setColumns(cols);
    };

    const getBaseInfo = async () => {
        getTabCount();

        // 获取新增时的专业有关信息
        const res = await getSelectCardTypeList('faultReportDerivedRuleProfessionalType');
        const dutyProfessionalArr = [{ value: '全部', key: '-1' }, ...res.data['faultReportDerivedRuleProfessionalType']];
        setDeviceTypeList(dutyProfessionalArr);
        getCols(dutyProfessionalArr);
    };

    useEffect(() => {
        getBaseInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fn = ({ isActive }) => {
            console.log('待办任务tab :>> ', isActive);
            setTimeout(() => {
                const frameworkTab = document.querySelector('.framework-tab');
                const tabcontainer = frameworkTab.querySelector(':scope>div>.oss-ui-tabs-nav');
                if (isActive) {
                    if (tabcontainer) {
                        tabcontainer.style.display = 'flex';
                    }
                }
            }, 1200);
        };

        const frameworkTab = document.querySelector('.framework-tab');
        const tabcontainer = frameworkTab?.querySelector(':scope>div>.oss-ui-tabs-nav');
        if (window.location.pathname === '/unicom/home/troubleshooting-workbench/major-fault-report' && tabcontainer) {
            tabcontainer.style.display = 'flex';
        }

        GlobalMessage.on('activeChanged', fn);

        return () => {
            GlobalMessage.off('activeChanged', fn);
        };
    }, []);

    // 渲染带角标的Tab标签
    const renderTabLabel = (tab: TabItem) => (
        <div className="tab-label-wrapper">
            {tab.label}
            {tab.isShowBadge && <Badge count={tab.count} overflowCount={99} className="tab-badge" />}
        </div>
    );

    const sleep = (time) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, time);
        });
    };

    // 获取路由列表数据
    const getTemporaryRouteList = async (params) => {
        await sleep(500);
        const newParams = {
            ...params,
        };
        const data = {
            topic: params.topic || undefined,
            current: newParams.current,
            pageSize: newParams.pageSize,
            startTime: newParams.searchTime?.[0] || undefined,
            endTime: newParams.searchTime?.[1] || undefined,
            professionalTypeList:
                newParams.professionalType?.length > 0 && !newParams.professionalType?.includes('-1') ? newParams.professionalType : undefined,
            processStatus: parseFloat(activeKey),
        };
        setPageCurrent(newParams.current);
        setPageTableSize(newParams.pageSize);
        const res = await getTemporaryRoute(data);
        return {
            total: res?.total,
            data: res?.data || [],
        };
    };

    const onFaultReportCancel = () => {
        setCurrentItem(null);
        setIsView(false);
        setIsModalOpen(false);
        reloadTable();
    };
    useEffect(() => {
        getCols(deviceTypeList);
        reloadTable();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey]);

    const goToListPage = () => {
        sendLogFn({ authKey: 'faultSchedule:faultQuery' });
        const url = '/unicom/home/troubleshooting-workbench/fault-report';
        const openId = '300016';
        const { actions } = actionss;
        console.log('url', url, openId, actions);

        if (actions && actions.postMessage) {
            openRoute(url.slice(7), { operId: openId });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url}`);
        }
    };

    return (
        <>
            <Tabs activeKey={activeKey} onChange={setActiveKey} className="custom-tabs" style={{ height: 'calc(100% - 48px)' }}>
                {tabData.map((tab) => (
                    <TabPane key={tab.key} tab={renderTabLabel(tab)}>
                        {activeKey !== '5' && (
                            <VirtualTable
                                key={tab.key}
                                global={window}
                                toolBarRender={false}
                                columns={columns}
                                request={getTemporaryRouteList}
                                actionRef={tableRef}
                                formRef={formRef}
                                reloadTable={reloadTable}
                                scroll={{ x: 'max-content' }}
                            />
                        )}
                        {activeKey === '5' && <FaultReport isMajorFaultReport />}
                    </TabPane>
                ))}
            </Tabs>
            {isModalOpen && (
                <FaultReportModal
                    title={title}
                    visible={isModalOpen}
                    onCancel={onFaultReportCancel}
                    dataSource={currentItem}
                    isView={isView}
                    goToListPage={goToListPage}
                    setFaultReportDataSource={setCurrentItem}
                    setIsView={setIsView}
                    theme="white"
                    isMajor={editType.includes('major') || Object.keys(MajorList).includes(editType)}
                    btnKey={editType}
                />
            )}
        </>
    );
};

export default Index;
