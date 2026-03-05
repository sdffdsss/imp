import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Modal, message, Icon } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import moment from 'moment';
import { createFileFlow } from '@Common/utils/download';
import AuthButton from '@Src/components/auth-button';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import { getOperationRegistration, deleteOperationRegistration, exportOperationRegistration, getProvinceList, getProfessionalTypeList } from './api';
import AddEditModal from './add-edit-modal';
import getColumns from './columns';

const OperatorLogon = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    const [professionalData, setProfessionalData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [professionalTypeInitial, setProfessionalTypeInitial] = useState([]);
    const [loading, setLoading] = useState(true);

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
        const dateList = formValue.dateTimeRange;
        const params = {
            startTime: dateList?.[0] ? moment(dateList?.[0]).format('YYYY-MM-DD 00:00:00') : undefined,
            endTime: dateList?.[1] ? moment(dateList?.[1]).format('YYYY-MM-DD 00:00:00') : undefined,
            provinceId: formValue.provinceId,
            unitName: formValue.unitName,
            workReasons: formValue.workReasons,
            supportDepartment: formValue.supportDepartment,
            professionalTypeList: formValue.professionalType,
        };
        exportOperationRegistration(params).then((res) => {
            if (res && res.data && res.data.fileUrl) {
                const url = `${useEnvironmentModel.data.environment.dutyManagerUrl.direct}${res.data.fileUrl}`;
                createFileFlow(res.data.fileUrl, url);
            }
        });
    };

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
    };

    // 重加载
    const tableRef = useRef();
    const reloadTable = (type = 'edit') => {
        if (type === 'delete') {
            tableRef.current.reloadAndRest();
        }
        tableRef.current.reload();
    };

    // 删除
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                await deleteOperationRegistration({ id: record.id });
                message.success('删除成功');
                reloadTable('delete');
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
        professionalData,
        pagination,
        professionalTypeInitial,
    });
    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 获取操作日志列表数据
    const getOperationRegistrationList = (params, sort) => {
        setPagination({
            current: params.current,
            pageSize: params.pageSize,
        });
        const parStr = {};
        if (params.dateTimeRange.length > 0) {
            parStr.startTime = moment(params.dateTimeRange?.[0]).format('YYYY-MM-DD 00:00:00');
            parStr.endTime = moment(params.dateTimeRange?.[1]).format('YYYY-MM-DD 00:00:00');
        }
        let orderFlag = '';
        let fieldFlag = '';
        if (sort.dateTime) {
            orderFlag = sort.dateTime === 'descend' ? 'desc' : 'asc';
            fieldFlag = 'dateTime';
        } else {
            orderFlag = undefined;
            fieldFlag = undefined;
        }
        const data = {
            ...parStr,
            pageNum: params.current,
            pageSize: params.pageSize,
            provinceId: Number(provinceId),
            unitName: params.unitName,
            workReasons: params.workReasons,
            supportDepartment: params.supportDepartment,
            professionalType:
                params.professionalType?.length > 0 && !params.professionalType?.includes('-1') ? params.professionalType?.join(',') : '',
            orderFieldName: fieldFlag,
            orderType: orderFlag,
        };
        return getOperationRegistration(data);
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
    // 获取监控班组专业属性
    const getProfessionalData = async () => {
        const res = await getProfessionalTypeList({});
        if (res && Array.isArray(res.data)) {
            // const list = res.data.filter((item) => {
            //     return item.txt !== 'IP承载A网' && item.txt !== 'IP承载B网' && item.txt !== '数据网';
            // });
            setProfessionalData([{ txt: '全部', id: '-1' }, ...res.data]);
        }
    };
    useEffect(async () => {
        await getProvinceData();
        await getProfessionalData();
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('professionalTypes')) {
            const professionalTypes = searchParams.get('professionalTypes').split(',');
            setProfessionalTypeInitial(professionalTypes);
            setLoading(false);
            formRef.current?.setFieldsValue({
                provinceId: Number(provinceId),
                searchTime: [],
                professionalData,
            });

            formRef.current?.submit();
        } else {
            getDefaultGroupByUser().then((res) => {
                setProfessionalTypeInitial(res.professionalTypes);
                setLoading(false);
                formRef.current?.setFieldsValue({
                    provinceId: Number(provinceId),
                    searchTime: [],
                    professionalData,
                });
                formRef.current?.submit();
            });
        }
    }, []);

    return (
        <>
            {!loading && (
                <VirtualTable
                    global={window}
                    toolBarRender={() => [
                        <AuthButton authKey="recordOperatorLogon:add" onClick={handleAdd}>
                            <Icon antdIcon type="PlusOutlined" /> 新建
                        </AuthButton>,
                        <AuthButton authKey="recordOperatorLogon:export" onClick={handleExport}>
                            <Icon antdIcon type="ExportOutlined" />
                            导出
                        </AuthButton>,
                    ]}
                    columns={columns}
                    request={getOperationRegistrationList}
                    actionRef={tableRef}
                    formRef={formRef}
                    scroll={{ x: 'max-content' }}
                />
            )}
            {isModalOpen && (
                <AddEditModal
                    editType={editType}
                    isModalOpen={isModalOpen}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    userName={userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    professionalData={professionalData}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
        </>
    );
};

export default OperatorLogon;
