import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Icon, Modal, message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import AuthButton from '@Src/components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { getDutyBusinessFaultManagement, deleteDutyBusinessFaultManagement, getProvinceList, getNetworkFaultDict } from './api';
import AddEditModal from './add-edit-modal';
import getColumns from './columns';
import { majorType } from '../enum';

const AtmManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    // 业务类型 处理状态
    const [serviceType, setServiceType] = useState([]);
    const [processStatus, setProcessStatus] = useState([]);
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

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
        sendLogFn({ authKey: 'serviceFaultManagement:ATM' });
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
                await deleteDutyBusinessFaultManagement({ id: record.id });
                message.success('删除成功');
                reloadTable();
            },
            onCancel() {},
        });
    };
    // 表格配置
    const columns = getColumns({
        showUserEditViewClick,
        delCurrentUserClick,
        provinceId: Number(provinceId),
        searchTime: [],
        currProvince,
        serviceTypeEnum: serviceType,
        processStatusEnum: processStatus,
        pagination,
    });
    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 获取showOrder参数
    const formatSortParam = (sort) => {
        const orderFieldName = Object.keys(sort)[0];
        const orderType = sort[Object.keys(sort)[0]];

        if (orderFieldName === 'acceptTime') {
            return orderType === 'descend' ? 9 : 10;
        } else if (orderFieldName === 'faultRestoreTime') {
            return orderType === 'descend' ? 5 : 6;
        }
        return undefined;
    };

    // 获取业务故障核心网专业列表数据
    const getDutyBusinessFaultManagementList = (params, sort) => {
        const sortParam = formatSortParam(sort);
        setPagination({ current: params.current, pageSize: params.pageSize });
        const data = {
            current: params.current,
            pageSize: params.pageSize,
            provinceId: params.provinceId,
            majorId: majorType.atm,
            circuitCode: params.circuitCode || undefined,
            customName: params.customName || undefined,
            businessType: params.businessType || undefined,
            faultDescription: params.faultDescription || undefined,
            acceptStartTime: params.searchTime?.[0] ? moment(params.searchTime?.[0]).format('YYYY-MM-DD 00:00:00') : undefined,
            acceptEndTime: params.searchTime?.[1] ? moment(params.searchTime?.[1]).format('YYYY-MM-DD 23:59:59') : undefined,
            showOrder: sortParam,
        };
        return getDutyBusinessFaultManagement(data);
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
    // 获取业务故障对应的类型
    const getServiceFaultEnumData = async (str) => {
        const data = {};
        if (str === '业务类型') {
            data.type = 200110;
        } else if (str === '处理状态') {
            data.type = 200112;
        }
        const res = await getNetworkFaultDict(data);
        if (res && Array.isArray(res.data)) {
            const enumList = res.data;

            if (str === '业务类型') {
                setServiceType(enumList);
            } else if (str === '处理状态') {
                setProcessStatus(enumList);
            }
        }
    };
    useEffect(() => {
        getProvinceData();
        getServiceFaultEnumData('业务类型');
        getServiceFaultEnumData('处理状态');
    }, []);
    // 给表单项赋初始值
    useEffect(() => {
        formRef.current?.setFieldsValue({
            provinceId: Number(provinceId),
            searchTime: [],
        });
        formRef.current?.submit();
    }, []);

    return (
        <>
            <VirtualTable
                global={window}
                toolBarRender={() => [
                    <AuthButton authKey="serviceFaultManagement:add" onClick={handleAdd}>
                        <Icon antdIcon type="PlusOutlined" /> 新建
                    </AuthButton>,
                    // <Button onClick={handleExport}>导出</Button>,
                ]}
                columns={columns}
                request={getDutyBusinessFaultManagementList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
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
                    serviceTypeEnum={serviceType}
                    processStatusEnum={processStatus}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
        </>
    );
};

export default AtmManagement;
