import React, { useRef, useState } from 'react';
import moment from 'moment';
import { VirtualTable } from 'oss-web-common';
import { Button, message, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { blobDownLoad } from '@Common/utils/download';
import AuthButton from '@Pages/components/auth/auth-button';
import { sendLogFn } from '@Pages/components/auth/utils';
import { useColumnsState } from '@Src/hooks';
import * as api from './api';
import { getColumns } from './columns';
import { getSearchParms } from './utils';
import CreateModal from './modal/index';
import './index.less';

const BusinessPlatformMonitorDaily: React.FC = () => {
    const { currentZone, userId, userName, mgmtZones, provinceId } = useLoginInfoModel();
    const columnsState = useColumnsState({ configType: 28 });
    const { zoneId } = currentZone;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editType, setEditType] = useState<'new' | 'edit' | 'view'>('new');
    const [currentItem, setCurrentItem] = useState(undefined);
    const [initialValues, setInitialValues] = useState({});
    const { professionalType, workBeginTime, workEndTime, groupId, workShiftId, dateTime } = getSearchParms([
        'professionalType',
        'workBeginTime',
        'workEndTime',
        'groupId',
        'workShiftId',
        'dateTime',
    ]);
    const formParams = useRef<any>({});
    const actionRef = useRef<any>();

    const getProvinceIds = () => {
        let provinceIds = provinceId;
        if (currentZone?.zoneLevel === '5') {
            provinceIds = mgmtZones
                .filter((item) => item.parentZoneId === provinceId)
                .map((item) => item.zoneId)
                .join(',');
        }
        return provinceIds;
    };

    const getBusinessPlatformMonitorDailyData = async (pagination) => {
        const provinceIds = getProvinceIds();

        if (professionalType && professionalType.length > 0) {
            const { current: pageNum } = pagination;

            const data = {
                provinceId: zoneId,
                pageNum,

                dutyBeginTime: workBeginTime,
                dutyEndTime: workEndTime,
                specialtys: professionalType,
                groupId,
                workShiftId,
                dateTime,
                userId,

                ...pagination,
                completion: pagination.completion === 'all' ? undefined : pagination.completion,
                provinceIds,
                watchman: pagination.watchMan,
            };
            formParams.current = data;
            const res = (await api.getBusinessPlatformMonitorDaily(data)) as any;
            const { current, pageSize, total } = res;
            res['pagination'] = { current, pageSize, total };

            return res;
        }
        return {
            data: [],
            pagination: {
                current: 1,
                pageSize: 5,
                total: 0,
            },
        };
    };
    async function handleOk(values) {
        // 校验是否可保存值班信息
        // const checkResult = await saveItemInfoCheck();

        // if (!checkResult) {
        //     setIsModalVisible(false);
        //     return;
        // }

        let res;
        try {
            if (editType === 'new') {
                res = await api.saveBusinessPlatformMonitorDaily({ groupId, workShiftId, dateTime, ...values });
            } else if (editType === 'edit') {
                res = await api.updateBusinessPlatformMonitorDaily({ ...(currentItem || {}), ...values });
            }
            if (res.code === 200) {
                message.success('保存成功');
                actionRef.current?.reload();
            } else {
                message.error('保存失败');
            }
            setIsModalVisible(false);
            return res;
        } catch (error) {
            message.error('保存失败');
            return res;
        }
    }
    async function handleModalClose() {
        setCurrentItem(undefined);
        setInitialValues({});
        setIsModalVisible(false);
    }
    async function handleAddModal() {
        sendLogFn({ authKey: 'workbench-Workbench-Business-platform-monitors-daily-Add' });
        setCurrentItem(undefined);
        setEditType('new');
        setInitialValues({
            provinceId: zoneId,
            watchMan: userName,
            time: moment(),
            professionalType: '85',
            completion: '否',
        });
        setIsModalVisible(true);
    }
    async function handleEditModal(record) {
        sendLogFn({ authKey: 'workbench-Workbench-Business-platform-monitors-daily-Edit' });
        setCurrentItem(record);
        setEditType('edit');
        setInitialValues({
            ...record,
            time: moment(record['time']),
            provinceId: zoneId,
            professionalType: record?.professionalType ? String(record?.professionalType) : '85',
        });
        setIsModalVisible(true);
    }
    const handleDeleteModal = async (record) => {
        const res = (await api.deleteBusinessPlatformMonitorDaily({ recordId: record.id })) as any;
        if (res.code === 200) {
            message.success('删除成功');
            actionRef.current?.reload();
        } else {
            message.error('删除失败');
        }
    };
    const handleExport = async () => {
        const provinceIds = getProvinceIds();
        const { recordContent, beginTime, endTime, completion, watchMan } = formParams.current;
        const params = {
            watchman: watchMan,
            recordContent,
            completion,
            beginTime: beginTime ? moment(beginTime).format('YYYY-MM-DD') : undefined,
            endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : undefined,
            provinceIds: provinceIds.split(','),
        };

        const res = await api.exportBusinessPlatformMonitorDaily(params);
        if (res) {
            blobDownLoad(res, `业务平台监控日报导出${moment().format('YYYYMMDDHHmmss')}.xlsx`);
        }
    };
    const columns = getColumns({ handleEditModal, handleDeleteModal });
    if (_.isEmpty(columnsState.value)) {
        return null;
    }
    return (
        <>
            <VirtualTable
                columns={columns}
                global={window}
                request={getBusinessPlatformMonitorDailyData}
                actionRef={actionRef}
                columnsState={columnsState}
                toolBarRender={() => {
                    return [
                        <AuthButton
                            ignoreAuth
                            authKey="workbench-Workbench-Business-platform-monitors-daily-Add"
                            type="primary"
                            onClick={handleAddModal}
                        >
                            <Icon antdIcon type="PlusOutlined" />
                            新增
                        </AuthButton>,
                        <Button onClick={handleExport}>导出</Button>,
                    ];
                }}
            />
            {isModalVisible && (
                <CreateModal
                    visible={isModalVisible}
                    mode={editType}
                    contentProps={{ initialValues }}
                    onCancel={handleModalClose}
                    onOk={handleOk}
                    wrapClassName="change-shifts-add-modal-root"
                />
            )}
        </>
    );
};
export default BusinessPlatformMonitorDaily;
