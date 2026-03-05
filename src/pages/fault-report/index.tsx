/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { ProTable, Button, Icon, Tooltip, Modal, message } from 'oss-ui';
import { useHistory } from 'react-router-dom';
import { FormInstance } from 'antd/lib/form';
import { ActionType } from '@ant-design/pro-table';
import { MajorList } from '@Src/common/enum/majorFaultReportEnum';
import AuthButton from '@Components/auth-button';
import { useTableSelection, useNavigatePage, useAuth } from '@Src/hooks';
import AsyncExportModal from '@Src/pages/fault-report/components/async-export-modal';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import constants from '@Src/common/constants';
import { sendLogFn } from '@Pages/components/auth/utils';
import { authData } from '@Src/pages/network-fault-file/auth';
import KeepAlive from 'react-activation';
// import GlobalMessage from '@Src/common/global-message';
import { blobDownLoad } from '@Common/utils/download';
import moment from 'moment';
import ProcessBtns from '@Src/components/processBtns';
import FaultReportModal from '@Src/pages/troubleshooting-workbench/components/header/fault-report-modal';
import useEnumHooks from './enum-hooks';
import { columns } from './columns';
import { TableListItem, ReportTypeText, ReportType, FAILURE_REPORT_STATUS, PUBLIC_OPINION } from './type';
import {
    getFaultReportList,
    deleteFault,
    exportFaultReportList,
    faultReportExport,
    getProcessApi,
    exportDownloadApi,
    checkUserNameInCeneterApi,
    syncCentralizationApi,
} from './api';
import './index.less';
import useTablePagination from './useTablePagination';

interface Props {
    isMajorFaultReport?: boolean;
}

type TimerType = Omit<typeof setInterval, '__promisify__'>;
type StatusType = 'exception' | 'success' | 'normal' | 'active' | undefined;
interface AsyncListType {
    exportFormat: string;
    exportTime: string;
    exportTotal: string;
    exportState: string;
    exportSchedule: { status: StatusType; percent: number };
}

const FaultReport: React.FC<Props & { derived?: boolean; faultReportDerivedRuleId?: string }> = (props) => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('');
    const [title, setTitle] = useState('');
    const [isView, setIsView] = useState(false);

    const actionRef = useRef<ActionType>();
    const formRef = useRef<FormInstance>();
    const { provinceId, userInfo, systemInfo, currentZone, userId, userZoneInfo } = useLoginInfoModel();
    const parseUserInfo = userInfo && JSON.parse(userInfo);
    const searchParamRef = useRef({});
    const { derived, isMajorFaultReport, faultReportDerivedRuleId } = props; // 来源是已上报故障

    const history = useHistory();

    const allEnumData = useEnumHooks({ province: provinceId });
    const backToList = localStorage.getItem('backToList');
    const isWireless = window.location.href.indexOf('isWireless') !== -1;

    const [asyncExportModalVisible, setAsyncExportModalVisible] = useState(false);
    const asyncExportTimer = useRef<TimerType | null>(null);
    const [asyncExportList, setAsyncExportList] = useState<AsyncListType[]>([]);
    const { selectedRows, setSelectedRows, onSelect, onSelectAll, clearSelection } = useTableSelection('flagId');
    const page = useTablePagination();
    const { pushActions } = useNavigatePage();
    const { isHasAuth, isHasPathAuth } = useAuth();
    const noAuth = (currentZone.zoneLevel === '2' || currentZone.zoneLevel === '5') && userZoneInfo.zoneLevel === '1';
    // 获取列表数据
    const getFaultReportListData = async (params, sorter, filters) => {
        sendLogFn({ authKey: 'troubleshootingWorkbench:faultSearch' });
        const queryParam = {
            ...params,
            beginReportTime: params.failureTime?.[0],
            endReportTime: params.failureTime?.[1],
            pageNum: params.current,
            current: undefined,
            reportUser: parseUserInfo?.userId,
            syncStates: params.syncState?.map((el) => +el),
            // faultReportStatus: params.faultReportStatus?.join(','),
        };
        if (derived && faultReportDerivedRuleId) {
            queryParam.faultReportDerivedRuleId = faultReportDerivedRuleId;
        }
        if (!isWireless) {
            queryParam.faultDistinctionType = 1;
        }
        delete queryParam.syncState;

        searchParamRef.current = queryParam;
        sessionStorage.setItem('faultReportSearchParam', JSON.stringify(queryParam));

        const res = await getFaultReportList(queryParam);

        if (res?.data) {
            const { current, pageSize } = params;
            const dataWithIndex = (res?.data || []).map((item, index) => {
                return {
                    ...item,
                    index: index + (current - 1) * pageSize + 1,
                };
            });

            return {
                data: dataWithIndex,
                success: true,
                total: res?.total || 0,
                pageNum: params.current,
                pageSize: params.pageSize,
            };
        }
        return {
            data: [],
            success: true,
            total: 0,
            pageNum: params.current,
            pageSize: params.pageSize,
        };
    };

    // 设置查询表单值
    const setFormValue = () => {
        formRef.current?.setFieldsValue({
            province: provinceId,
        });
    };

    useEffect(() => {
        if (provinceId) {
            setFormValue();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId]);

    useEffect(() => {
        return () => {
            const mytooltipList = document.querySelectorAll('.oss-ui-tooltip'); // 获取页面所有tooltip的dom集合
            // 分别遍历让所有的悬浮框隐藏
            mytooltipList.forEach((value: any) => {
                value.style.display = 'none';
            });
        };
    }, []);

    const deleteConfirm = async (row) => {
        try {
            const params = {
                flagId: row?.flagId,
                faultReportStatus: row?.faultReportStatus,
            };
            const res = await deleteFault(params);
            if (res.code === 200) {
                actionRef?.current?.reload();
                message.success(`${row.flagId}删除成功`);
            } else {
                message.error(`${row.flagId}删除失败`);
            }
        } catch (error) {
            message.warn('服务器繁忙，请稍后再试');
        }
    };

    const getProcessData = async () => {
        const params = { userId };
        const res = await getProcessApi(params);
        if (res && res.data) {
            const { progress, exportType, exportTimeStr, exportSize, exportStatus } = res.data;
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
                exportSchedule: { status: defaultStatus.status as StatusType, percent: progress },
            };

            setAsyncExportList([list]);
            if (progress < 100 && !asyncExportTimer.current && progress > 0) {
                asyncExportTimer.current = setInterval(() => {
                    getProcessData();
                }, 2000);
            }
            if (progress === 100) {
                clearInterval(asyncExportTimer.current as number);
                asyncExportTimer.current = null;
            }
        }
    };

    const onExport = async () => {
        const params = sessionStorage.getItem('faultReportSearchParam');
        const res = await faultReportExport(params);
        if (res.data) {
            message.success('操作成功');
            asyncExportTimer.current = setInterval(() => {
                getProcessData();
            }, 2000);
        }
        if (!res.data) {
            message.error(res.message);
        }
    };
    const onExportDownLoad = async () => {
        const params = { userId };
        await exportDownloadApi(params);
    };
    const buttonDelete = async (row) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            // content: `是否确认删除${this.msg}:【${data.filterName}】？`,
            content: '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            width: '350px',
            onOk: () => {
                deleteConfirm(row);
            },
            onCancel() {},
        });
    };

    const goDetail = (row) => {
        sendLogFn({ authKey: 'faultSchedule:faultQueryCheck' });

        if (row) {
            page.setCatchPageIndex(page.pageSize * (page.current - 1) + row.index);
        }
        if (isMajorFaultReport) {
            history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-detail?flagId=${
                    row?.flagId
                }&faultReportStatus=${row?.faultReportStatus}&standardAlarmId=${
                    row?.standardAlarmId
                }&isMajor=${isMajorFaultReport}&btnKey=${editType}&activeKey=${isMajorFaultReport ? 5 : ''}`,
            );
        } else {
            history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-detail?flagId=${
                    row?.flagId
                }&faultReportStatus=${row?.faultReportStatus}&standardAlarmId=${row?.standardAlarmId}&isView=${true}`,
            );
        }
    };

    const checkUserNameInCeneterData = async () => {
        const params = { operateUser: userId, provinceId };

        const result = await checkUserNameInCeneterApi(params);
        if (result.code === 200) {
            return true;
        }
        return false;
    };
    const add = async (row?) => {
        const flagId = row?.flagId ? `flagId=${row?.flagId}` : '';
        const status = row?.latestReportStatus ? `&status=${row?.latestReportStatus}` : '';
        const type = row?.faultDistinctionType ? `&type=${row?.faultDistinctionType}` : '';
        if (parseUserInfo.zones[0].zoneId !== '0' && !(await checkUserNameInCeneterData())) {
            message.warn('您不在监控中心的指定角色中，暂无上报权限');
            return;
        }
        if (row) {
            page.setCatchPageIndex(page.pageSize * (page.current - 1) + row.index);
        }
        if (isMajorFaultReport) {
            history.push(
                `/znjk/${
                    constants.CUR_ENVIRONMENT
                }/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?${flagId}${status}${type}&activeKey=${
                    isMajorFaultReport ? 5 : ''
                }`,
            );
        } else {
            history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?${flagId}${status}${type}`,
            );
        }
    };
    const skip2NetWorkFaultFile = (id) => {
        pushActions(`/network-fault-file`, { flagId: id });
    };
    // const onSyncNotice = (flagIds) => {
    //     message.success({
    //         className: 'fault-report-message-success-a',
    //         content: (
    //             <div className="fault-report-modal-success">
    //                 <div>上报成功！已同步至网络故障集中存档！</div>
    //                 <div className="fault-report-modal-success-link" onClick={() => skip2NetWorkFaultFile(flagIds)}>
    //                     {'>>前往补充故障信息'}
    //                 </div>
    //             </div>
    //         ),
    //     });
    // };
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
            actionRef?.current?.reload();
        } else {
            message.error(res.message);
        }
    };
    /**
     * 导出
     */
    const exportExcel = () => {
        exportFaultReportList(searchParamRef.current).then((res) => {
            blobDownLoad(res, `故障查询导出${moment().format('YYYYMMDDHHmmss')}.xlsx`);
        });
    };

    const authKey = 'faultReport';
    // 集团用户
    const isGroup = provinceId === '0';

    const optionsColumns = [
        {
            title: '操作',
            valueType: 'option',
            align: 'center',
            fixed: 'right',
            width: 120,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            render: (text, row, _, action) => {
                const disabled =
                    row.specialty === PUBLIC_OPINION || (isGroup && row.province !== provinceId) || row.alarmStatus === '已取消' || noAuth;
                const ifWireless = row.faultDistinctionType === 2 && row.source === 0;
                const syncDisabled =
                    (row.latestContinueType !== '终报' ||
                        row.syncState !== 0 ||
                        row.specialty === '16' ||
                        (isGroup && row.province !== provinceId)) &&
                    row.taskName !== '终报修改待审核';

                return derived
                    ? [
                          <Button
                              type="text"
                              style={{ padding: 0 }}
                              onClick={() => openMajorModal({ ...row, index: _ + 1 }, 'view', '查看')}
                              disabled={String(row.latestReportStatus) === FAILURE_REPORT_STATUS.FIRST_DRAFT}
                          >
                              <Tooltip title="查看">
                                  <Icon antdIcon type="SearchOutlined" />
                              </Tooltip>
                          </Button>,
                      ]
                    : [
                          row.buttonList ? (
                              <ProcessBtns row={row} theme="white" isScheduled={false} openMajorModal={openMajorModal} />
                          ) : (
                              row.reportStatusName !== '续报待审核' &&
                              row.faultReportStatus !== '2' && (
                                  <AuthButton
                                      type="text"
                                      style={{ padding: 0 }}
                                      onClick={() => add({ ...row, index: _ + 1 })}
                                      // disabled={row.latestContinueType === ReportTypeText[ReportType.FINAL_REPORT] || (isGroup && row.province !== provinceId)}
                                      disabled={disabled}
                                      authKey={ifWireless ? 'wireless-middle-screen:continueReport' : `${authKey}:continue`}
                                  >
                                      <Tooltip title="追加">
                                          <Icon antdIcon type="PlusCircleOutlined" />
                                      </Tooltip>
                                  </AuthButton>
                              )
                          ),
                          <Button
                              type="text"
                              style={{ padding: 0 }}
                              onClick={() => goDetail({ ...row, index: _ + 1 })}
                              disabled={String(row.latestReportStatus) === FAILURE_REPORT_STATUS.FIRST_DRAFT}
                          >
                              <Tooltip title="查看">
                                  <Icon antdIcon type="SearchOutlined" />
                              </Tooltip>
                          </Button>,
                          <AuthButton
                              type="text"
                              style={{ padding: 0, display: row.faultReportStatus === '2' ? 'none' : 'inline-block' }}
                              onClick={() => handleSyncButton(row.flagId)}
                              authKey="troubleshootingWorkbench:sync"
                              disabled={syncDisabled || noAuth || isWireless}
                          >
                              <Tooltip title="同步至集中存档">
                                  <Icon antdIcon type="CloudSyncOutlined" />
                              </Tooltip>
                          </AuthButton>,
                          // <AuthButton
                          //     type="text"
                          //     style={{ padding: 0 }}
                          //     onClick={() => buttonDelete(row)}
                          //     authKey={`${authKey}:delete`}
                          //     disabled={row.province !== provinceId}
                          // >
                          //     <Tooltip title="删除">
                          //         <Icon antdIcon type="DeleteOutlined" />
                          //     </Tooltip>
                          // </AuthButton>,
                      ];
            },
        },
    ];

    const isProvinceZone = currentZone?.zoneLevel === '2' || parseUserInfo?.zones?.[0]?.zoneLevel === '2';
    const isCityZone = parseUserInfo?.zones?.[0]?.zoneLevel === '3';

    const finalEnumData = useMemo(() => {
        const { regionList, cityParentRegionList } = allEnumData;
        let finalRegionList;
        if (isProvinceZone) {
            finalRegionList = regionList;
        } else if (isCityZone) {
            // parseUserInfo?.zones?.[0]?.parentZoneId
            finalRegionList = cityParentRegionList;
        } else {
            finalRegionList = [
                {
                    regionName: currentZone?.zoneName || parseUserInfo?.zones?.[0]?.zoneName,
                    regionId: currentZone?.zoneId || parseUserInfo?.zones?.[0]?.zoneId,
                },
            ];
        }
        return {
            ...allEnumData,
            regionList: finalRegionList,
            derived,
        };
    }, [allEnumData, isProvinceZone, isCityZone, currentZone, parseUserInfo]);

    const currentColumns: any = [...columns(finalEnumData), ...optionsColumns];
    currentColumns[0] = {
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        width: 72,
        align: 'center',
        render: (text, record, index) => (page.current - 1) * page.pageSize + index + 1,
    };
    // 重置时需要设置默认的归属省份
    const onReset = () => {
        if (provinceId) {
            setFormValue();
        }
    };
    const syncAllHandle = async () => {
        const params = {
            flagIdList: selectedRows.map((item) => item.flagId),
            userId,
        };
        const res = await syncCentralizationApi(params);
        if (res.code === 200) {
            if (res.data === 0) {
                message.success('已勾选的数据中，无可同步的数据(已终报&&未同步)');
            } else {
                message.success(`${res.data}条（已终报&&未同步）数据同步成功`);
            }
            actionRef?.current?.reload();
            clearSelection();
        } else {
            message.error(res.message);
        }
    };
    const syncAll = () => {
        Modal.confirm({
            content: '是否确认同步至网络故障集中存档？',
            okText: '是',
            cancelText: '否',
            onOk: () => {
                syncAllHandle();
            },
        });
    };
    const openMajorModal = (item, type, titles) => {
        setCurrentItem(item);
        setEditType(type);
        setTitle(titles);
        setIsView(titles.indexOf('查看') >= 0);
        if (titles.indexOf('上传附件') >= 0) {
            const flagId = item?.flagId ? `flagId=${item?.flagId}` : '';
            const status = item?.latestReportStatus ? `&status=${item?.latestReportStatus}` : '';
            const faultDistinctionType = item?.faultDistinctionType ? `&type=${item?.faultDistinctionType}` : '';
            const btnKey = type ? `&btnKey=${type}` : '';
            if (isMajorFaultReport) {
                history.push(
                    `/znjk/${
                        constants.CUR_ENVIRONMENT
                    }/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?${flagId}${status}${faultDistinctionType}${btnKey}&activeKey=${
                        isMajorFaultReport ? 5 : ''
                    }`,
                );
            } else {
                history.push(
                    `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report/fault-report-add?${flagId}${status}${faultDistinctionType}${btnKey}`,
                );
            }
        } else {
            setIsModalOpen(true);
        }
    };
    const reloadTable = () => {
        actionRef?.current?.reload();
    };
    const onFaultReportCancel = () => {
        setCurrentItem(null);
        setIsView(false);
        setIsModalOpen(false);
        setEditType('');
        reloadTable();
    };
    useEffect(() => {
        const loadReady: any = [];
        currentColumns.forEach((item) => {
            if (item.dataIndex === 'specialty' || item.dataIndex === 'reportStatusName') {
                loadReady.push(_.isEmpty(item.valueEnum));
            }
        });
        if (!loadReady.includes(true)) {
            setLoading(true);
        }
    }, [currentColumns]);
    useEffect(() => {
        if (backToList === 'yes') {
            setTimeout(() => {
                actionRef?.current?.reload();
            }, 200);
            localStorage.removeItem('backToList');
        }
    }, [backToList]);

    const tableScroll = derived
        ? { x: 'max-content' as const, y: 420 }
        : { x: 'max-content' as const, y: isMajorFaultReport ? 360 : window.innerHeight - 400 };

    return (
        <div className={derived ? 'fault-report-page fault-report-derived' : 'fault-report-page'}>
            {loading && (
                <ProTable<TableListItem>
                    formRef={formRef}
                    columns={currentColumns}
                    request={getFaultReportListData}
                    actionRef={actionRef}
                    rowKey="flagId"
                    defaultSize="small"
                    bordered
                    search={{
                        span: 6,
                        labelWidth: 100,
                    }}
                    onReset={onReset}
                    rowSelection={
                        derived
                            ? false
                            : {
                                  selectedRowKeys: selectedRows.map((item) => item.flagId),
                                  onSelect,
                                  onSelectAll,
                              }
                    }
                    pagination={page}
                    scroll={tableScroll}
                    tableAlertRender={false}
                    toolBarRender={() =>
                        derived
                            ? [
                                  <Button
                                      type="default"
                                      onClick={() => {
                                          setAsyncExportModalVisible(true);
                                          getProcessData();
                                          // exportExcel();
                                      }}
                                  >
                                      <Icon antdIcon type="ExportOutlined" />
                                      导出
                                  </Button>,
                              ]
                            : [
                                  <AuthButton
                                      key="1"
                                      type="default"
                                      onClick={() => syncAll()}
                                      authKey="troubleshootingWorkbench:sync"
                                      disabled={selectedRows.length === 0}
                                  >
                                      批量同步
                                  </AuthButton>,
                                  <AuthButton key="3" type="default" disabled={isWireless} onClick={() => add()} authKey={`${authKey}:add`}>
                                      <Icon antdIcon type="PlusOutlined" />
                                      新增
                                  </AuthButton>,
                                  <Button
                                      type="default"
                                      onClick={() => {
                                          setAsyncExportModalVisible(true);
                                          getProcessData();
                                          // exportExcel();
                                      }}
                                  >
                                      <Icon antdIcon type="ExportOutlined" />
                                      导出
                                  </Button>,
                              ]
                    }
                />
            )}
            <AsyncExportModal
                visible={asyncExportModalVisible}
                onClose={() => {
                    setAsyncExportModalVisible(false);
                    clearInterval(asyncExportTimer.current as number);
                    asyncExportTimer.current = null;
                }}
                onDownLoad={onExportDownLoad}
                onExport={onExport}
                exportList={asyncExportList}
            />
            {isModalOpen && (
                <FaultReportModal
                    title={title}
                    visible={isModalOpen}
                    onCancel={onFaultReportCancel}
                    dataSource={currentItem}
                    isView={isView}
                    // goToListPage={goToListPage}
                    setFaultReportDataSource={setCurrentItem}
                    setIsView={setIsView}
                    isMajor={editType.includes('major') || Object.keys(MajorList).includes(editType)}
                    theme={'white'}
                    btnKey={editType}
                />
            )}
        </div>
    );
};

export default FaultReport;
