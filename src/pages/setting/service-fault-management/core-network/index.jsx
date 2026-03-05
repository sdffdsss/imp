import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Icon, Modal, message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import AuthButton from '@Src/components/auth-button';
import { blobDownLoad } from '@Common/utils/download';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import AddEditModal from './add-edit-modal';
import {
    getDutyBusinessFaultManagement,
    deleteDutyBusinessFaultManagement,
    exportDutyBusinessFaultManagement,
    getProvinceList,
    getNetworkFaultDict,
} from './api';
import getColumns from './columns';
//import UploadComp from '../modal';
import UploadComp from '../upload';
import { exportType, majorType } from '../enum';

const CoreNetworkManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    // 网络类型 专业网类型  申告类型  协调结果
    const [networkType, setNetworkType] = useState([]);
    const [professionalNetworkType, setProfessionalNetworkType] = useState([]);
    const [declarationType, setDeclarationType] = useState([]);
    const [coordinationResults, setCoordinationResults] = useState([]);
    const [pagination, setPagination] = useState({});
    const [importVisible, setImportVisible] = useState(false);

    const { userId, userName, provinceId } = useLoginInfoModel();
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const formRef = useRef();

    // 新增
    const handleAdd = () => {
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    // 导入
    const handleImport = () => {
        setImportVisible(true);
    };

    // 取消
    const handleImportCancel = () => {
        setImportVisible(false);
    };

    // 导出
    const handleExport = () => {
        const formValue = formRef?.current?.getFieldsValue(true);
        const params = {
            provinceId: formValue.provinceId,
            majorId: majorType.coreNetwork,
            networkType: formValue.networkType || undefined,
            professionalNetworkType: formValue.professionalNetworkType || undefined,
            coordinationResults: formValue.coordinationResults || undefined,
            declarationType: formValue.declarationType || undefined,
            coordinationProcessingStartTime: formValue.searchTime?.[0] ? moment(formValue.searchTime?.[0]).format('YYYY-MM-DD 00:00:00') : undefined,
            coordinationProcessingEndTime: formValue.searchTime?.[1] ? moment(formValue.searchTime?.[1]).format('YYYY-MM-DD 23:59:59') : undefined,
        };
        exportDutyBusinessFaultManagement(params).then((res) => {
            if (res) {
                blobDownLoad(res, `业务故障记录核心网${moment().format('YYYY-MM-DD')}.xlsx`);
            }
        });
    };

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
        sendLogFn({ authKey: 'serviceFaultManagement:CoreNetwork' });
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
        networkTypeEnum: networkType,
        professionalNetworkTypeEnum: professionalNetworkType,
        declarationTypeEnum: declarationType,
        coordinationResultsEnum: coordinationResults,
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

        if (orderFieldName === 'coordinationProcessingTime') {
            return orderType === 'descend' ? 7 : 8;
        }
        return undefined;
    };

    // 获取业务故障核心网专业列表数据
    const getDutyBusinessFaultManagementList = (params, sort) => {
        const sortParam = formatSortParam(sort);
        setPagination({
            current: params.current,
            pageSize: params.pageSize,
        });
        const data = {
            current: params.current,
            pageSize: params.pageSize,
            provinceId: params.provinceId,
            majorId: majorType.coreNetwork,
            networkType: params.networkType || undefined,
            professionalNetworkType: params.professionalNetworkType || undefined,
            coordinationResults: params.coordinationResults || undefined,
            declarationType: params.declarationType || undefined,
            coordinationProcessingStartTime: params.searchTime?.[0] ? moment(params.searchTime?.[0]).format('YYYY-MM-DD 00:00:00') : undefined,
            coordinationProcessingEndTime: params.searchTime?.[1] ? moment(params.searchTime?.[1]).format('YYYY-MM-DD 23:59:59') : undefined,
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
        switch (str) {
            case '网络类型':
                data.type = 200106;
                break;
            case '申告类型':
                data.type = 200107;
                break;
            case '专业网类型':
                data.type = 200111;
                break;
            case '协调结果':
                data.type = 200113;
                break;
            default:
                data.type = 200106;
                break;
        }
        const res = await getNetworkFaultDict(data);
        if (res && Array.isArray(res.data)) {
            const enumList = res.data;
            switch (str) {
                case '网络类型':
                    setNetworkType(enumList);
                    break;
                case '申告类型':
                    setDeclarationType(enumList);
                    break;
                case '专业网类型':
                    setProfessionalNetworkType(enumList);
                    break;
                case '协调结果':
                    setCoordinationResults(enumList);
                    break;
                default:
                    setNetworkType(enumList);
                    break;
            }
        }
    };
    useEffect(() => {
        getProvinceData();
        getServiceFaultEnumData('网络类型');
        getServiceFaultEnumData('申告类型');
        getServiceFaultEnumData('专业网类型');
        getServiceFaultEnumData('协调结果');
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
                    <AuthButton authKey="serviceFaultManagement:import" onClick={handleImport}>
                        <Icon antdIcon type="ExportOutlined" /> 批量导入
                    </AuthButton>,
                    <AuthButton authKey="serviceFaultManagement:export" onClick={handleExport}>
                        <Icon antdIcon type="ExportOutlined" /> 导出
                    </AuthButton>,
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
                    networkTypeEnum={networkType}
                    professionalNetworkTypeEnum={professionalNetworkType}
                    declarationTypeEnum={declarationType}
                    coordinationResultsEnum={coordinationResults}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}

            {importVisible && (
                <UploadComp
                    majorId={majorType.coreNetwork}
                    provinceId={provinceId}
                    userName={currentItem?.createdBy || userName}
                    type={exportType.coreNetwork}
                    handleCancel={handleImportCancel}
                    isModalOpen={importVisible}
                    onUploadResult={reloadTable}
                />
            )}
        </>
    );
};

export default CoreNetworkManagement;
