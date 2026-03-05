import React, { useState, useRef, useEffect, useMemo } from 'react';
import useLoginInfoModel from '@Src/hox';
import { Button, Icon, message } from 'oss-ui';
import ChangeShiftsEditTable, { RowAction, Pattern } from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { ALL_ENUMS, MODAL_TYPE } from '@Pages/network-cutover/type';
import { postMajorEnum, findGroupByCenter } from '@Pages/network-cutover/api';
import { sendLogFn } from '@Pages/components/auth/utils';
import { businessPlatformColumns, getCoreNetworkColumns, getInternetColumns, getAtmColumns, getColumns } from './columns';
import * as api from './api';
import CreateModal from './modal/index';
import './index.less';

/**
 * 交接班-网络割接自查
 * @param param0
 * @returns
 */
export default function Index({
    title,
    pattern,
    schedulingObj,
    currentProfessional,
    refreshFlag,
    pageType,
    loginInfo,
    saveItemInfoCheck,
    moduleId,
    provinceData,
}) {
    const [enums, setEnums] = useState<ALL_ENUMS>({});
    const ref = useRef<any>(null);
    // state
    const { groupId, workShiftId, dateTime } = schedulingObj || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editType, setEditType] = useState<MODAL_TYPE>(MODAL_TYPE.BUILD);
    const [initialValues, setInitialValues] = useState({});

    const { currentZone } = useLoginInfoModel();
    const [groupSourceEnum, setGroupSourceEnum] = useState([]); // 班组来源
    const [notCoreGroupSourceEnum, setNotCoreGroupSourceEnum] = useState([]); // 班组来源
    const { zoneId } = currentZone;
    function getColums() {
        let AColumns = getAtmColumns(enums);

        if (currentProfessional.value === '1') {
            AColumns = getCoreNetworkColumns(enums);
        } else if (currentProfessional.value === '9999') {
            AColumns = getInternetColumns(enums);
        } else if (currentProfessional.value === '85') {
            const { columns = [] } = getColumns({ enums });
            AColumns = columns.filter((item) => item.dataIndex !== 'action');
        }
        return AColumns;
    }

    async function handleAddModal() {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkCutoverCheck-Add' });
        setEditType(MODAL_TYPE.BUILD);
        setInitialValues({});
        setIsModalVisible(true);
    }

    async function handleEditModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkCutoverCheck-Edit' });
        setEditType(MODAL_TYPE.EDIT);

        setInitialValues(record);

        setIsModalVisible(true);
    }

    async function handleViewModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-NetworkCutoverCheck-Query' });
        setEditType(MODAL_TYPE.SEARCH);

        setInitialValues(record);

        setIsModalVisible(true);
    }

    async function handleModalClose() {
        setInitialValues({});
        setIsModalVisible(false);
    }

    async function handleOk() {
        setIsModalVisible(false);
        ref.current.refreshData();
    }

    /**
     * 转换请求参数，并获取列表数据
     * @param pagination 组件发出的请求参数
     * @returns
     */
    const getBusinessPlatformMonitorDaily = async (pagination) => {
        const { current: pageNum } = pagination;

        const data = {
            provinceId: zoneId,
            pageNum,
            ...pagination,
            groupId,
            workShiftId,
            dateTime,
            specialtys: [currentProfessional.value],
            userId: loginInfo.userId,
        };
        const res = await api.postCutoverList(data);
        const { current, pageSize, total } = res;
        const newRes = {
            ...res,
            pagination: { current, pageSize, total },
            data: Array.isArray(res.data)
                ? res.data?.map((item) => {
                      return {
                          ...item,
                          INDEX_COLUMN_DATAINDEX: item.index,
                      };
                  })
                : [],
        };
        return newRes;
    };

    function handleModalVisible(visible) {
        setIsModalVisible(visible);
    }
    const convertEnumData = (list) => {
        return list?.map((item) => {
            return {
                label: item.value,
                value: item.key,
            };
        });
    };
    const getEnums = async () => {
        const professionalEnum = await postMajorEnum([
            'dutyProfessional',
            'cutoverAckStatus',
            'cutover_profession',
            'cutover_classification',
            'cutover_finish_status',
            'operate_level',
            'isEffectBusiness',
            'recordSourcePlatform',
            'nmsType',
            'recordSource',
            'affiliatedNetwork',
            'completionStatus',
            'networkCutProfession',
        ]);
        setEnums({
            professionalEnum: convertEnumData(professionalEnum?.data?.dutyProfessional) || [],
            cutoverAckStatusEnum: convertEnumData(professionalEnum?.data?.cutoverAckStatus) || [],
            cutoverProfessionEnum: convertEnumData(professionalEnum?.data?.cutover_profession) || [],
            cutoverClassificationEnum: convertEnumData(professionalEnum?.data?.cutover_classification) || [],
            cutoverFinishStatusEnum: convertEnumData(professionalEnum?.data?.cutover_finish_status) || [],
            operateLevelEnum: convertEnumData(professionalEnum?.data?.operate_level) || [],
            isEffectBusinessEnum: convertEnumData(professionalEnum?.data?.isEffectBusiness) || [],
            recordSourcePlatformEnum: convertEnumData(professionalEnum?.data?.recordSourcePlatform) || [],
            nmsTypeEnum: convertEnumData(professionalEnum?.data?.nmsType) || [],
            recordSourceEnum: convertEnumData(professionalEnum?.data?.recordSource) || [],
            affiliatedNetworkEnum: convertEnumData(professionalEnum?.data?.affiliatedNetwork) || [],
            completionStatusEnum: convertEnumData(professionalEnum?.data?.completionStatus) || [],
            networkCutProfessionEnum: convertEnumData(professionalEnum?.data?.networkCutProfession) || [],
        });
    };
    const deleteClick = async (row) => {
        try {
            const res = await api.deleteCutover({ id: row?.id });
            if (res.code === 200) {
                message.success('删除成功');
            } else {
                message.error('删除失败');
            }
        } catch {
            message.error('接口错误');
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
        getEnums();
    }, []);
    useEffect(() => {
        // 班组来源
        findGroupByCenter({ operateUser: loginInfo.userId, professionalId: '1' }).then((res) => {
            setGroupSourceEnum(res.data);
        });
        // 班组来源
        findGroupByCenter({ operateUser: loginInfo.userId, professionalId: '9999' }).then((res) => {
            setNotCoreGroupSourceEnum(res.data);
        });
    }, [loginInfo.userId]);
    const tableColumns = useMemo(() => {
        return getColums();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enums]);
    const configTypeMap = {
        9998: 21,
        1: 22,
        9999: 23,
        85: 24,
    };

    return (
        <>
            <ChangeShiftsEditTable
                moduleId={moduleId}
                showNewEmptyRow={false}
                columns={tableColumns}
                pattern={pattern}
                needIndexColumn={currentProfessional.value === '1'}
                // @ts-ignore
                ref={ref}
                startRefreshData={refreshFlag}
                title={title}
                refreshDataService={getBusinessPlatformMonitorDaily}
                showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                toolBarRender={
                    pattern === Pattern.editable && (
                        <Button type="primary" disabled={currentZone.zoneLevel == '2'} ghost onClick={handleAddModal}>
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </Button>
                    )
                }
                autoRefreshSetting={{ interval: 3 * 60 * 1000, enable: true }}
                tableColumnSettingConfigType={configTypeMap[currentProfessional.value]}
                rowKey="id"
                rowActions={[
                    {
                        type: RowAction.edit,
                        actionProps: {
                            editMode: 'custom',
                            handleCustomEdit: handleEditModal,
                        },
                    },
                    {
                        type: RowAction.delete,
                        actionProps: {
                            handleDelete: async (record) => deleteClick(record),
                        },
                    },
                ]}
            />
            {isModalVisible && (
                <CreateModal
                    visible={isModalVisible}
                    onVisibleChange={handleModalVisible}
                    modalType={editType}
                    contentProps={{
                        initialValues,
                        professionType: String(currentProfessional.value),
                        enums,
                        groupSourceEnum,
                        notCoreGroupSourceEnum,
                    }}
                    onCancel={handleModalClose}
                    onOk={handleOk}
                    width={900}
                    bodyStyle={{ marginRight: 20 }}
                    handleSaveCheck={handleSaveCheck}
                    wrapClassName="change-shifts-add-modal-root"
                    provinceList={provinceData.map((item) => ({ label: item.regionName, value: item.provinceId }))}
                />
            )}
        </>
    );
}
