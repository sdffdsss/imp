import React, { useState, useRef, useEffect } from 'react';
import useLoginInfoModel from '@Src/hox';
import { useTableSelection } from '@Src/hooks';
import { Button, Icon, Tooltip } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import ChangeShiftsEditTable, { RowAction } from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import './index.less';
import AddEditModal from '@Pages/setting/service-fault-management/big-customer/add-edit-modal';
import { sendLogFn } from '@Pages/components/auth/utils';
import { columns } from './columns';
import * as api from './api';

/**
 * 交接班-微信群及保障事件
 * @returns
 */
export default function Index({
    title,
    pattern,
    schedulingObj,
    onSelectedKeysChange,
    pageType,
    refreshFlag,
    saveItemInfoCheck,
    provinceData,
    moduleId,
}) {
    const { currentZone, userName, userId, provinceId } = useLoginInfoModel();
    const { selectedRows, setSelectedRows, onSelect, onSelectAll, noSelectedRows } = useTableSelection('id');

    const ref = useRef<any>(null);
    const firstRefreshFlagRef = useRef(true);

    const { groupId, workShiftId, lastWorkShiftId, dateTime, professionalType } = schedulingObj || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editType, setEditType] = useState<any>('add');
    const [currentItem, setCurrentItem] = useState(undefined);
    // 受理方式 业务类型
    const [acceptMethod, setAcceptMethod] = useState([]);
    const [businessType, setBusinessType] = useState([]);

    // const [provinceData, setProvinceData] = useState<Array<any>>([]);
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const [initialValues, setInitialValues] = useState({});

    const { zoneId } = currentZone;

    // 获取归属省份
    // async function getProvinceData() {
    //     const data = {
    //         creator: userId,
    //     };
    //     const res = await api.getProvinceList(data);
    //     if (res && Array.isArray(res)) {
    //         const list = res;
    //         setProvinceData(list);
    //     }
    // }

    async function handleAddModal() {
        sendLogFn({ authKey: 'workbench-Workbench-WechatSafeguardEvent-Add' });
        // @ts-ignore
        setEditType('add');
        setCurrentItem(undefined);
        setIsModalVisible(true);
    }

    async function handleEditModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-WechatSafeguardEvent-Edit' });
        setEditType('edit');
        setIsModalVisible(true);
        setCurrentItem(record);
    }

    async function handleViewModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-WechatSafeguardEvent-Check' });
        setEditType('view');
        setIsModalVisible(true);
        setCurrentItem(record);
    }

    async function handleModalClose() {
        setCurrentItem(undefined);
        setInitialValues({});
        setIsModalVisible(false);
    }

    useEffect(() => {
        if (refreshFlag === false) {
            firstRefreshFlagRef.current = true;
            setSelectedRows([]);
        }
    }, [refreshFlag]);

    /**
     * 转换请求参数，并获取列表数据
     * @param pagination 组件发出的请求参数
     * @returns
     */
    const getBusinessFaultCheck = async (pagination) => {
        if (professionalType?.length > 0) {
            const { current: pageNum } = pagination;

            const data = {
                provinceId: zoneId,
                ...pagination,
                pageNum,
                majorIds: 9997, // 大客户平台专业
                groupId,
                workShiftId,
                dateTime,
                userId,
            };

            const res = await api.getBusinessWechatEvent(data);

            const { current, pageSize, total } = res;
            res['pagination'] = { current, pageSize, total };
            setSelectedRows((prev) => {
                const newSelectedRows = _.uniqBy([...prev, ...res.data?.filter((e) => e.explainFlag === '上')], 'id');
                const currentSelect = newSelectedRows.filter((e) => noSelectedRows.current.every((item) => item.id !== e.id));
                return currentSelect;
            });

            return res;
        }
        return [];
    };

    const reloadTable = async () => {
        ref.current.refreshData();
    };

    // 获取业务故障对应的类型
    const getServiceFaultEnumData = async (str) => {
        const data: any = {};
        switch (str) {
            case '受理方式':
                data.type = 200109;
                break;
            case '业务类型':
                data.type = 200110;
                break;
            default:
                data.type = 200109;
                break;
        }
        const res = await api.getNetworkFaultDict(data);
        if (res && Array.isArray(res.data)) {
            const enumList = res.data;
            switch (str) {
                case '受理方式':
                    setAcceptMethod(enumList);
                    break;
                case '业务类型':
                    setBusinessType(enumList);
                    break;
                default:
                    setAcceptMethod(enumList);
                    break;
            }
        }
    };

    async function handleSaveCheck() {
        // 校验是否可保存值班信息
        const checkResult = await saveItemInfoCheck();

        if (!checkResult) {
            setIsModalVisible(false);
            return false;
        }

        return true;
    }

    useEffect(() => {
        // getProvinceData();
        getServiceFaultEnumData('受理方式');
        getServiceFaultEnumData('业务类型');
    }, []);

    useEffect(() => {
        onSelectedKeysChange(selectedRows.map((item) => item.id));
    }, [selectedRows]);

    return (
        <>
            <ChangeShiftsEditTable
                moduleId={moduleId}
                showNewEmptyRow={false}
                columns={columns}
                pattern={pattern}
                // @ts-ignore
                ref={ref}
                title={title}
                startRefreshData={refreshFlag && professionalType?.length > 0}
                refreshDataService={getBusinessFaultCheck}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                toolBarRender={
                    pattern === 'editable' && (
                        <Button type="primary" ghost onClick={handleAddModal}>
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </Button>
                    )
                }
                autoRefreshSetting={{ interval: 3 * 60 * 1000, enable: true }}
                rowKey="id"
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRows.map((item) => item.id),
                    onSelect,
                    onSelectAll,
                    getCheckboxProps: () => ({
                        disabled: pattern !== 'editable',
                    }),
                    columnWidth: 25,
                    renderCell(checked, record, index, node) {
                        const isShow = selectedRows.find((e) => e.id === record.id);
                        if (isShow) {
                            return <Tooltip title="遗留到下个班次">{node}</Tooltip>;
                        }
                        return node;
                    },
                }}
                rowActions={[
                    {
                        type: RowAction.edit,
                        actionProps: {
                            editMode: 'custom',
                            handleCustomEdit: handleEditModal,
                        },
                    },
                    {
                        type: RowAction.view,
                        actionProps: {
                            handleView: handleViewModal,
                        },
                    },
                ]}
            />
            {isModalVisible && (
                <AddEditModal
                    editType={editType}
                    isModalOpen={isModalVisible}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    userName={userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    acceptMethodEnum={acceptMethod}
                    businessTypeEnum={businessType}
                    handleCancel={handleModalClose}
                    reloadTable={reloadTable}
                    handleSaveCheck={handleSaveCheck}
                    wrapClassName="change-shifts-add-modal-root"
                />
            )}
        </>
    );
}
