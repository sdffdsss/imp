import React, { useState, useRef, useEffect, useMemo } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Icon, Modal, message } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { useColumnsState } from '@Src/hooks';
import moment from 'moment';
import AuthButton from '@Src/components/auth-button';
import { blobDownLoad } from '@Common/utils/download';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { getColumns, tableForm } from './columns';
import { getDutyBusinessFaultManagementPlatform, deleteDutyBusinessFaultManagementPlatform, getProvinceList, exportPlatform } from './api';
import AddEditModal from './add-edit-modal';
import './index.less';

const ProfesinalManagement = () => {
    const columnsState = useColumnsState({ configType: 20 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    const [pagination, setPagination] = useState({});

    const { userId, userName, provinceId } = useLoginInfoModel();
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const formRef = useRef();
    // 新增
    const handleAdd = () => {
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    // 导出
    const handleExport = () => {
        const formValue = formRef?.current?.getFieldsValue(true);

        const params = {
            provinceId: Number(provinceId),
            provinceName: currProvince.regionName,
            majorIdList: formValue.majorObj,
            faultClose: formValue.faultCloseName === -1 ? undefined : formValue.faultCloseName,
            faultName: formValue.faultNames || undefined,
            startTime: formValue.findTime?.[0] ? moment(formValue.findTime?.[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
            endTime: formValue.findTime?.[1] ? moment(formValue.findTime?.[1]).format('YYYY-MM-DD HH:mm:ss') : undefined,
        };
        exportPlatform(params).then((res) => {
            if (res) {
                blobDownLoad(res, `业务故障管理平台专业${moment().format('YYYY-MM-DD')}.xlsx`);
            }
        });
    };

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
        sendLogFn({ authKey: 'serviceFaultManagement:Professional' });
    };

    // 重加载
    const tableRef = useRef();
    const reloadTable = () => {
        tableRef.current.reload();
    };

    // 删除
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                const result = await deleteDutyBusinessFaultManagementPlatform({ id: record.id, deletedBy: userId });
                if (result.code === 200) {
                    message.success('删除成功');
                    reloadTable();
                } else {
                    message.error(result.message);
                }
            },
            onCancel() {},
        });
    };

    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 获取告警优化管理列表数据
    const getDutyBusinessFaultManagementList = (params) => {
        setPagination({
            current: params.current,
            pageSize: params.pageSize,
        });

        const data = {
            current: params.current,
            pageSize: params.pageSize,
            provinceId: Number(provinceId),
            provinceName: currProvince.regionName,
            majorIdList: params.majorObj,
            faultClose: params.faultCloseName === -1 ? undefined : params.faultCloseName,
            faultName: params.faultNames || undefined,
            startTime: params.findTime?.[0] ? moment(params.findTime?.[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
            endTime: params.findTime?.[1] ? moment(params.findTime?.[1]).format('YYYY-MM-DD HH:mm:ss') : undefined,
        };

        return getDutyBusinessFaultManagementPlatform(data);
    };
    // 获取归属省份
    const getProvinceData = async () => {
        const data = {
            creator: userId,
        };
        const res = await getProvinceList(data);
        if (res && Array.isArray(res)) {
            const list = res;
            setProvinceData(list);
        }
    };

    // 表格配置
    const columnsList = getColumns({
        showUserEditViewClick,
        delCurrentUserClick,
    });
    const columns = useMemo(() => {
        return [...columnsList, ...tableForm];
    }, [columnsList]);
    useEffect(() => {
        getProvinceData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 给表单项赋初始值
    useEffect(() => {
        formRef.current?.setFieldsValue({
            provinceId: Number(provinceId),
            searchTime: [],
        });
        formRef.current?.submit();
    }, []);

    if (_.isEmpty(columnsState.value)) {
        return null;
    }
    return (
        <>
            <VirtualTable
                global={window}
                toolBarRender={() => [
                    <AuthButton authKey="serviceFaultManagement:add" onClick={handleAdd}>
                        <Icon antdIcon type="PlusOutlined" /> 新建
                    </AuthButton>,
                    <AuthButton authKey="serviceFaultManagement:export" onClick={handleExport}>
                        <Icon antdIcon type="ExportOutlined" /> 导出
                    </AuthButton>,
                ]}
                columns={columns}
                request={getDutyBusinessFaultManagementList}
                actionRef={tableRef}
                formRef={formRef}
                columnsState={columnsState}
                rowClassName={(record) => {
                    // if (!record.faultRestoreTime) return 'service-fault-management-professional-table-row';
                    if (record.faultClose === 0) return 'row-red';
                    return '';
                }}
            />

            {isModalOpen && (
                <AddEditModal
                    editType={editType}
                    isModalOpen={isModalOpen}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    userName={currentItem?.createdBy || userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
        </>
    );
};

export default ProfesinalManagement;
