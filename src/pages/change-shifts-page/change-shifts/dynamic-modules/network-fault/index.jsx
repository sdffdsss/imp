import React, { Component, createRef } from 'react';
import { withModel } from 'hox';
import { Button, message, Space, Tooltip, Modal, Icon, Radio } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import AddEditModal from '@Src/pages/summary-of-fault-records/add-edit-modal';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import useLoginInfoModel from '@Src/hox';
import AuthButton from '@Pages/components/auth/auth-button';
import shareActions from '@Src/share/actions';
import constants from '@Src/common/constants';
import { sendLogFn } from '@Pages/components/auth/utils';
import { getProvince } from '@Common/utils/getProvince';
import columns, { getSupplementColumns } from './columns';
import api from './api';
import './index.less';

class Index extends Component {
    ref = createRef();
    formRef = createRef();
    paginationRef = { current: 1, pageSize: 20 };

    // 第一次调接口获取的网络故障工单数据

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [], // 网络故障遗留工单
            networkFaultFlag: true, // 网络故障首次请求
            visible: false,
            provinceData: [],
            cardTypeList: [],
            equipmentManufacturerList: [],
            currentItem: null,
            modalColumns: [],
            modalSelectedRows: [],
            isModalOpen: false, // 新增/编辑弹窗
            provinceList: [], // 省份列表
            deviceTypeList: [], // 设备类型列表
            selectedTab: 1,
            loading: props.schedulingObj.provinceId !== '0',
        };
    }

    componentDidMount() {
        const p1 = getProvince();
        const p2 = api.getSelectCardTypeList(['dutyProfessional', 'dutyCardType', 'dutyVendor']);

        Promise.all([p1, p2]).then((res) => {
            this.setState({
                provinceData: res[0],
                deviceTypeList: [{ value: '全部', key: '-1' }, ...res[1].data['dutyProfessional']],
                cardTypeList: res[1].data['dutyCardType'],
                equipmentManufacturerList: res[1].data['dutyVendor'],
            });
        });

        const { schedulingObj, loginInfo } = this.props;
        const { provinceId } = schedulingObj;

        if (provinceId !== '0') {
            api.getSelectedTab({ userId: loginInfo.userId }).then((res) => {
                this.setState({ selectedTab: res.data[0]?.switchType || 1, loading: false });
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.refreshFlag !== this.props.refreshFlag && !this.props.refreshFlag) {
            this.setState({
                networkFaultFlag: true,
                selectedRows: [],
            });
        }
    }

    /**
     * 打开故障记录汇总
     */
    jumpToList = () => {
        sendLogFn({ authKey: 'workbench-Workbench-FaultRecordSummary-Button' });
        const { actions, messageTypes } = shareActions;
        const { schedulingObj } = this.props;
        const { provinceId, professionalType } = schedulingObj || {};

        const { userInfo } = useLoginInfoModel.data;
        const { operations = [] } = JSON.parse(userInfo);

        if (actions?.postMessage && operations) {
            let url = `/unicom/summary-of-fault-records`;
            if (window.location.pathname.includes('/home-unicom')) {
                url = `/unicom/home-unicom/summary-of-fault-records`;
            }
            const flag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
            if (!flag) {
                message.warn(`您没有故障记录汇总权限，请联系管理员在角色管理中授权`);
                return;
            }

            actions.postMessage(messageTypes.openRoute, {
                entry: url,
                search: {
                    provinceId,
                    professionalType: professionalType || '',
                },
            });
        }
    };

    changeRowKeys = (val) => {
        this.setState(val, () => {
            // console.log('this.state.selectedRows :>> ', this.state.selectedRows);
            this.props.onSelectedKeysChange(this.state.selectedRows.map((item) => item.summaryId));
        });
    };
    // 1遗留 0不遗留
    saveRemainStateData = async (record, isRemain) => {
        const { schedulingObj } = this.props;

        const params = record.map((el) => {
            return { faultId: el.summaryId, isRemain, teamId: schedulingObj.groupId, workShiftId: schedulingObj.workShiftId };
        });
        const result = await api.saveRemainState(params);
        if (result.code === 200) {
            console.log('保存成功');
        }
    };
    onSelect = (record, selected) => {
        if (selected) {
            this.saveRemainStateData([record], 1);

            this.changeRowKeys((prev) => {
                return {
                    ...prev,
                    selectedRows: [...prev.selectedRows, record],
                };
            });
        } else {
            this.saveRemainStateData([record], 0);
            this.changeRowKeys((prev) => {
                return {
                    ...prev,
                    selectedRows: prev.selectedRows.filter((item) => item.summaryId !== record.summaryId),
                };
            });
        }
    };
    onSelectAll = (selected, selectedRows, changeRows) => {
        if (selected) {
            this.saveRemainStateData(changeRows, 1);
            this.changeRowKeys((prev) => {
                return {
                    ...prev,
                    selectedRows: _.uniqBy([...prev.selectedRows, ...changeRows], 'summaryId'),
                };
            });
        } else {
            this.saveRemainStateData(changeRows, 0);
            this.changeRowKeys((prev) => {
                return {
                    ...prev,
                    selectedRows: _.differenceBy(prev.selectedRows, changeRows, 'summaryId'),
                };
            });
        }
    };

    /**
     * 打开故障操作历史
     */
    jumpFaultOperationHistory = () => {
        sendLogFn({ authKey: 'workbench-Workbench-FaultRecordOperation-History' });
        const { actions, messageTypes } = shareActions;
        const { userInfo } = useLoginInfoModel.data;
        const { operations = [] } = JSON.parse(userInfo);

        if (actions?.postMessage && operations) {
            let url = `/unicom/change-shifts-page/fault-operation-history`;

            if (window.location.pathname.includes('/home-unicom')) {
                url = `/unicom/home-unicom/change-shifts-page/fault-operation-history`;
            }
            const flag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
            if (!flag) {
                message.warn(`您没有故障记录操作历史权限，请联系管理员在角色管理中授权`);
                return;
            }

            actions.postMessage(messageTypes.openRoute, {
                entry: url,
            });
        }
    };

    networkFaultSave = async (item) => {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkFaultOrder-Edit' });

        // 校验是否可保存值班信息
        const checkResult = await this.props.saveItemInfoCheck();

        if (!checkResult) {
            return;
        }

        const { loginInfo } = this.props;

        const { bearerService, faultEndTime, faultStartTime, faultReasonDesc, chaseInfo, summaryId, finishedFlag } = item;

        const param = {
            id: summaryId,
            bearerService,
            faultEndTime: faultEndTime ? moment(faultEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
            faultStartTime: faultStartTime ? moment(faultStartTime).format('YYYY-MM-DD HH:mm:ss') : '',
            faultReasonDesc,
            chaseInfo,
            operator: loginInfo.userName,
            dataProvince: loginInfo.provinceId,
            finishedFlag,
        };
        const result = await api.updateFaultSheet(param);

        if (result.code === 200) {
            message.success('保存成功');
        } else {
            message.error('保存失败');
        }
    };

    getProvinceData = async () => {
        const options = await getProvince();
        this.setState({
            provinceList: options,
        });
    };
    networkFaultDelete = async (item) => {
        // 校验是否可保存值班信息
        const checkResult = await this.props.saveItemInfoCheck();

        if (!checkResult) {
            return;
        }

        const { groupId } = this.props.schedulingObj || {};
        const { loginInfo } = this.props;

        const param = {
            id: item.summaryId,
            groupId,
            operator: loginInfo.userName,
            dataProvince: loginInfo.provinceId,
        };
        const result = await api.deleteFaultSheet(param);
        console.log(result);
    };

    requestNetworkFault = async (pagetion) => {
        const {
            login: { userId },
            schedulingObj,
            type,
            pageType,
        } = this.props;

        const { networkFaultFlag, selectedTab } = this.state;
        const { groupId, workShiftId, lastWorkShiftId, dateTime, provinceId, professionalTypes, provinceName, professionalNames } =
            schedulingObj || {};
        if (!professionalTypes) {
            return {};
        }
        const data = {
            userId,
            teamId: groupId,
            groupId,
            // teamId: '412223492',
            areaId: provinceId,
            provinceId,
            pageSize: pagetion?.pageSize || 5,
            pageNum: pagetion?.current || 1,
            workShiftId,
            dateTime,
            specialty: professionalTypes,
            specialtys: professionalTypes,
            showJT: provinceId !== '0' && selectedTab === 2 ? 1 : 0,
        };
        if (type === 3) {
            data.operationType = 2; // 历史数据
        }
        const result = await api.getTaskDetail(data);
        result.pagination = {
            total: result?.total,
            pageSize: result?.pageSize,
            current: result?.current,
        };

        // if (networkFaultFlag) {
        this.changeRowKeys((prev) => {
            const tempList = result.data?.filter((el) => el.isRemain === 1) || [];
            return {
                ...prev,
                networkFaultFlag: false,
                selectedRows: tempList,
            };
        });
        // }
        result.data = (result.data || []).map((e) => {
            return { ...e, key: e.summaryId };
        });
        return result;
    };

    supplementOrder = () => {
        const { provinceData } = this.state;
        const { schedulingObj } = this.props;

        const modalColumns = getSupplementColumns({
            provinceData,
            professionalTypes: [
                { label: '全部', value: '-1' },
                ...schedulingObj.professionalTypes.map((item, index) => ({ label: schedulingObj.professionalNames[index], value: item })),
            ],
            defaultProfession: '-1',
        });

        this.setState({
            modalColumns: modalColumns.concat({
                dataIndex: 'action',
                key: 'action',
                title: '操作',
                hideInSearch: true,
                width: 80,
                align: 'center',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <Tooltip title="查看" key="search" trigger={['hover', 'click']}>
                            <Icon
                                antdIcon
                                type="SearchOutlined"
                                onClick={() => {
                                    this.handleSearch(record);
                                }}
                            />
                        </Tooltip>
                    );
                },
            }),
            visible: true,
        });
    };

    handleSearch = (record) => {
        this.setState({ currentItem: record, isModalOpen: true });
    };

    supplementOrderRequest = async (params) => {
        const searchFormData = this.formRef.current.getFieldsValue();
        const { loginInfo, schedulingObj } = this.props;
        const { groupId, workShiftId, dateTime } = schedulingObj || {};

        this.paginationRef = {
            current: params.current,
            pageSize: params.pageSize,
        };
        const data = {
            current: params.current,
            pageSize: params.pageSize,
            userId: loginInfo.userId,
            groupId,
            workShiftId,
            dateTime,
            dataProvince: loginInfo.currentZone?.zoneId,
            faultStartTime: searchFormData.faultTime ? searchFormData.faultTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
            faultEndTime: searchFormData.faultTime ? searchFormData.faultTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
            profession: searchFormData.profession === '-1' ? undefined : searchFormData.profession,
            provinceId: searchFormData.provinceId,
            sheetNo: searchFormData.sheetNo,
            professionalTypeList: schedulingObj.professionalTypes,
        };
        const res = await api.getSupplementOrderApi(data);

        return {
            data: res.data,
            success: true,
            total: res.total,
        };
    };

    onModalSelect = (record, selected) => {
        if (selected) {
            this.setState((prev) => {
                return {
                    ...prev,
                    modalSelectedRows: [...prev.modalSelectedRows, record],
                };
            });
        } else {
            this.setState((prev) => {
                return {
                    ...prev,
                    modalSelectedRows: prev.modalSelectedRows.filter((item) => item.id !== record.id),
                };
            });
        }
    };
    onModalSelectAll = (selected, selectedRows, changeRows) => {
        if (selected) {
            this.setState((prev) => {
                return {
                    ...prev,
                    modalSelectedRows: _.uniqBy([...prev.modalSelectedRows, ...changeRows], 'id'),
                };
            });
        } else {
            this.setState((prev) => {
                return {
                    ...prev,
                    modalSelectedRows: _.differenceBy(prev.modalSelectedRows, changeRows, 'id'),
                };
            });
        }
    };

    sheetStay = () => {
        const {
            loginInfo: { userName, userId },
            schedulingObj,
        } = this.props;
        const { modalSelectedRows } = this.state;

        const sheetParam = {
            userId,
            creatorUser: userName,
            groupId: schedulingObj?.groupId, // 组ID
            workShiftId: schedulingObj?.workShiftId,
            dateTime: schedulingObj?.dateTime, // 本班次对应的开始时间
            dutyBeginTime: schedulingObj.workBeginTime,
            dutyEndTime: schedulingObj.workEndTime,
            leaveType: '1', // 网络故障工单遗留
            leaveContents: [{ 1: modalSelectedRows.map((item) => item.id) }],
        };

        return api.sheetStay(sheetParam);
    };

    onOk = () => {
        const { modalSelectedRows } = this.state;
        if (modalSelectedRows.length === 0) {
            message.warn('请选择工单');

            return;
        }
        if (modalSelectedRows.length > 10) {
            message.warn('补充上班次遗留工单，最多支持选择10条，请重新选择');

            return;
        }
        this.sheetStay().then((res) => {
            if (res.code === 200) {
                message.success(`补充上班次遗留工单成功，共${modalSelectedRows.length}条`);

                this.changeRowKeys((prev) => {
                    return {
                        ...prev,
                        selectedRows: [
                            ...prev.selectedRows,
                            ...modalSelectedRows.map((item) => ({
                                ...item,
                                summaryId: item.id,
                            })),
                        ],
                    };
                });

                setTimeout(() => {
                    this.onCancel();
                    this.ref.current.refreshData();
                });
            } else {
                message.error(res.message);
            }
        });
    };

    onCancel = () => {
        this.paginationRef = { current: 1, pageSize: 20 };
        this.setState({ visible: false, modalSelectedRows: [] });
    };

    saveSelectedTab = (event) => {
        this.setState(
            {
                selectedTab: event.target.value,
            },
            () => {
                this.ref.current.resetPaginationAndRefresh();
            },
        );
        api.setSelectedTab({ userId: this.props.loginInfo.userId, switchType: event.target.value });
    };

    render() {
        const { title, pattern, refreshFlag, pageType, moduleId, loginInfo, schedulingObj } = this.props;
        const { professionalNames = [], provinceName, provinceId, professionalName } = schedulingObj || {};
        const {
            selectedRows,
            visible,
            modalColumns,
            isModalOpen,
            cardTypeList,
            currentItem,
            deviceTypeList,
            provinceData,
            equipmentManufacturerList,
            modalSelectedRows,
            selectedTab,
            loading,
        } = this.state;

        const isProvinceGroupAndSelectedCountry = provinceId !== '0' && selectedTab === 2;

        if (loading) {
            return null;
        }

        return (
            <>
                <ChangeShiftsEditTable
                    ref={this.ref}
                    moduleId={moduleId}
                    columns={columns}
                    refreshDataService={this.requestNetworkFault}
                    pattern={pattern}
                    title={title}
                    titleSuffix={
                        provinceId !== '0' && (
                            <Radio.Group
                                optionType="button"
                                style={{ margin: '-5px 0 0 16px' }}
                                value={selectedTab}
                                onChange={this.saveSelectedTab}
                                size="small"
                                options={[
                                    {
                                        label: '省份',
                                        value: 1,
                                    },
                                    {
                                        label: '集团',
                                        value: 2,
                                    },
                                ]}
                            />
                        )
                    }
                    leftToolBarRender={
                        <Space>
                            {pageType === ShiftChangeTypeEnum.Handover && (
                                <Button disabled={isProvinceGroupAndSelectedCountry} onClick={this.supplementOrder}>
                                    补充工单
                                </Button>
                            )}
                            <AuthButton
                                sendLog
                                authKey="changeShiftsSetting:FaultOperationHistory"
                                disabled={isProvinceGroupAndSelectedCountry}
                                onClick={() => this.jumpFaultOperationHistory()}
                            >
                                故障记录操作历史
                            </AuthButton>
                            <Button disabled={isProvinceGroupAndSelectedCountry} onClick={this.jumpToList}>
                                故障记录汇总
                            </Button>
                        </Space>
                    }
                    showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                    startRefreshData={refreshFlag}
                    autoRefreshSetting={{ enable: true, interval: 120 * 1000 }}
                    showNewEmptyRow={false}
                    tableColumnSettingConfigType="11"
                    rowKey="summaryId"
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedRows.map((item) => item.summaryId),
                        onSelect: this.onSelect,
                        onSelectAll: this.onSelectAll,
                        getCheckboxProps: () => {
                            return {
                                disabled: pattern !== 'editable',
                            };
                        },
                        columnWidth: 40,
                        renderCell(checked, record, index, node) {
                            const isShow = selectedRows.find((e) => e.summaryId === record.summaryId);
                            if (isShow) {
                                return <Tooltip title="遗留到下个班次">{node}</Tooltip>;
                            }
                            return node;
                        },
                    }}
                    rowClassName={(record) => {
                        if (record.explainFlag === '上') {
                            return 'table-row-explain';
                        }
                        return 'table-row-default';
                    }}
                    rowActions={[
                        {
                            type: RowAction.edit,
                            actionProps: {
                                editMode: 'inline',
                                handleEditConfirm: this.networkFaultSave,
                            },
                        },
                        {
                            type: RowAction.delete,
                            actionProps: {
                                editMode: 'inline',
                                handleDelete: this.networkFaultDelete,
                            },
                        },
                    ]}
                    toolBarRender={
                        pattern === 'editable' &&
                        professionalNames.includes('传输网') &&
                        loginInfo.userZoneInfo.zoneLevel === '1' && (
                            <Button type="primary" ghost onClick={() => this.setState({ isModalOpen: true, currentItem: null })}>
                                <Icon antdIcon type="PlusOutlined" />
                                新增
                            </Button>
                        )
                    }
                    onForceSelectRow={(record, value) => {
                        if (!selectedRows.some((item) => item.summaryId === record.summaryId) && value === 0) {
                            this.saveRemainStateData([record], 1);
                            this.changeRowKeys((prev) => {
                                return {
                                    ...prev,
                                    selectedRows: [...prev.selectedRows, record],
                                };
                            });
                        }
                        const filterFlag = provinceName === '集团' && professionalNames.includes('传输网') && +record.professionalType === 3;

                        if (value === 1 && filterFlag) {
                            this.saveRemainStateData([record], 0);
                            this.changeRowKeys((prev) => {
                                return {
                                    ...prev,
                                    selectedRows: prev.selectedRows.filter((item) => item.summaryId !== record.summaryId),
                                };
                            });
                        }
                    }}
                    forceHideActionColumn={isProvinceGroupAndSelectedCountry}
                />
                <Modal
                    visible={visible}
                    maskClosable={false}
                    width={1400}
                    bodyStyle={{ padding: '0 16px', height: '600px' }}
                    title="补充工单"
                    destroyOnClose
                    onCancel={this.onCancel}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" onClick={this.onOk}>
                                确定
                            </Button>
                            <Button onClick={this.onCancel}>取消</Button>
                        </div>
                    }
                >
                    <div style={{ height: '100%' }}>
                        <VirtualTable
                            formRef={this.formRef}
                            className="supplement-order-table"
                            request={this.supplementOrderRequest}
                            columns={modalColumns}
                            search={{ collapsed: false, defaultCollapsed: false, collapseRender: false }}
                            size="small"
                            tableAlertRender={false}
                            global={window}
                            rowKey="id"
                            toolBarRender={false}
                            searchCollapsed={false}
                            rowSelection={{
                                type: 'checkbox',
                                columnWidth: 40,
                                selectedRowKeys: modalSelectedRows.map((item) => item.id),
                                onSelect: this.onModalSelect,
                                onSelectAll: this.onModalSelectAll,
                            }}
                        />
                    </div>
                </Modal>
                {isModalOpen && (
                    <AddEditModal
                        cardTypeList={cardTypeList}
                        deviceTypeList={deviceTypeList}
                        provinceIdForModal={loginInfo.provinceId}
                        editType={currentItem ? 'view' : 'add'}
                        isModalOpen={isModalOpen}
                        currentItem={currentItem}
                        provinceData={provinceData}
                        userId={loginInfo.userId}
                        userName={loginInfo.userName}
                        currProvince={provinceData.find((item) => item.value === loginInfo.provinceId)}
                        handleCancel={() => {
                            this.setState({ isModalOpen: false });
                        }}
                        equipmentManufacturerList={equipmentManufacturerList}
                        //initFormData={{ professionalType: professionalName === '传输网' ? '3' : undefined }}
                    />
                )}
            </>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
