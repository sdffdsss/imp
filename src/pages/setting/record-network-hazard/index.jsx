import React, { useState, useRef, useEffect } from 'react';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import { Button, Modal, message } from 'oss-ui';
import { blobDownLoad } from '@Common/utils/download';
import AuthButton from '@Src/components/auth-button';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import moment from 'moment';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { getNetworkHazardRecord, getProvinceList, deleteNetworkHazardRecord, networkHazardRecord, getProfessional, getVendorApi } from './api';
import getColumns from './columns';
import AddEditModal from './add-edit-modal';

const RecordNetworkHazard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userId, userName, provinceId } = useLoginInfoModel();
    const [provinceData, setProvinceData] = useState([]);
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const formRef = useRef(); // 表单的钩子
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [currentItem, setCurrentItem] = useState(null);
    const [professionalList, setProfessionalList] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [pagination, setPagination] = useState({});
    const [professionalTypeInitial, setProfessionalTypeInitial] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     *  新增
     */
    const handleAdd = () => {
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    /**
     * 取消按钮
     */
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    /**
     * 导出按钮
     */
    const handleExport = () => {
        const formValue = formRef?.current?.getFieldsValue(true);
        console.log('handleExport', formValue);
        const params = {
            // startTime: moment(formValue.searchTime?.[0]).format('YYYY-MM-DD HH:mm:ss'),
            // endTime: moment(formValue.searchTime?.[1]).format('YYYY-MM-DD HH:mm:ss'),
            // provinceId: formValue.provinceId,
            // invertedSection: formValue.invertedSection,
            // vendorIds: formValue.vendorIds,
            // recordStartTime: moment(formValue.recordTime?.[0]).format('YYYY-MM-DD HH:mm:ss'),
            // recordEndTime: moment(formValue.recordTime?.[1]).format('YYYY-MM-DD HH:mm:ss'),
            recordStartTime: formValue.recordTime?.[0] ? moment(formValue.recordTime?.[0]).format('YYYY-MM-DD HH:mm:ss') : null,
            recordEndTime: formValue.recordTime?.[1] ? moment(formValue.recordTime?.[1]).format('YYYY-MM-DD HH:mm:ss') : null,
            provinceId: formValue.provinceId.value,
            // professionalType: formValue.professionalType,
            professionalType:
                formValue.professionalType?.length > 0 && !formValue.professionalType.includes('-1')
                    ? formValue.professionalType?.join(',')
                    : undefined,
            impactSystem: formValue.impactSystem,
            pageIndex: formValue.pageIndex,
            pageSize: formValue.pageSize,
        };
        sendLogFn({ authKey: 'record-network-hazard:export' });
        networkHazardRecord(params).then((res) => {
            if (res) {
                blobDownLoad(res, `网络隐患记录${moment().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };

    /**
     * 编辑&&查看
     */
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
        sendLogFn({ authKey: 'record-network-hazard:check' });
    };

    // 重新加载列表数据
    const tableRef = useRef();
    const reloadTable = (type = 'edit') => {
        if (type === 'delete') {
            tableRef.current.reloadAndRest();
        }
        tableRef.current.reload();
    };

    /**
     * 删除
     * @param {*} record
     */
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                await deleteNetworkHazardRecord({ recordId: record.recordId });
                message.success('删除成功');
                reloadTable('delete');
            },
            onCancel() {},
        });
    };

    /**
     * 获取列表数据
     * @param {*} params
     * @returns
     */
    const getNetworkHazardRecordList = async (params) => {
        setPagination({
            current: params.current,
            pageSize: params.pageSize,
        });
        const formValue = formRef?.current?.getFieldsValue();
        const recordStartTime = formValue.recordTime?.[0] ? moment(formValue.recordTime?.[0]).format('YYYY-MM-DD HH:mm:ss') : undefined;
        const recordEndTime = formValue.recordTime?.[1] ? moment(formValue.recordTime?.[1]).format('YYYY-MM-DD HH:mm:ss') : undefined;
        const data = {
            pageIndex: params.current,
            pageSize: params.pageSize,
            recordStartTime,
            recordEndTime,
            provinceId: formValue.provinceId?.value,
            // professionalType: formValue.professionalType,
            professionalType:
                formValue.professionalType?.length > 0 && !formValue.professionalType.includes('-1')
                    ? formValue.professionalType?.join(',')
                    : undefined,
            impactSystem: formValue.impactSystem,
        };
        const res = await getNetworkHazardRecord(data);
        if (res && res.data) {
            return res;
        }
        return { data: [] };
    };

    /**
     * 获取归属省份
     */
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
    /**
     * 获取专业信息
     */
    const getProfessionalList = () => {
        getProfessional().then((res) => {
            if (res && res.data && res.data.professionalType) {
                const list = res.data.professionalType.map((item) => {
                    return {
                        label: item.value,
                        value: item.key,
                    };
                });
                setProfessionalList([{ label: '全部', value: '-1' }, ...list]);
            }
        });
    };

    /**
     * 获取厂家信息
     */
    const getVendorList = () => {
        getVendorApi().then((res) => {
            if (res && res.data) {
                const list = res.data.map((item) => {
                    return {
                        label: item.value,
                        value: item.key,
                    };
                });
                setVendorList(list);
            }
        });
    };

    useEffect(() => {
        getProvinceData();
        getProfessionalList();
        getVendorList();
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('professionalTypes')) {
            const professionalTypes = searchParams.get('professionalTypes').split(',');
            setProfessionalTypeInitial(professionalTypes);
            setLoading(false);
            formRef.current?.setFieldsValue({
                professionalType: professionalTypes,
            });

            formRef.current?.submit();
        } else {
            getDefaultGroupByUser().then((res) => {
                setProfessionalTypeInitial(res.professionalTypes);
                setLoading(false);
                formRef.current?.setFieldsValue({
                    professionalType: res.professionalTypes,
                });

                formRef.current?.submit();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 初始化时获取一次数据
    // useEffect(() => {
    //     formRef.current?.submit();
    // }, []);

    // 获取列表配置
    const columns = getColumns({
        showUserEditViewClick,
        delCurrentUserClick,
        provinceId: Number(provinceId),
        currProvince,
        recordTime: [],
        // recordTime: [moment().subtract('month', 1).startOf('month'), moment().endOf('day')],
        professionalList,
        pagination,
        professionalTypeInitial,
    });

    return (
        <>
            {!loading && (
                <VirtualTable
                    global={window}
                    toolBarRender={() => [
                        <AuthButton key="edit" onClick={handleAdd} authKey="record-network-hazard:add">
                            新增
                        </AuthButton>,
                        <Button onClick={handleExport}>导出</Button>,
                    ]}
                    columns={columns}
                    request={getNetworkHazardRecordList}
                    formRef={formRef}
                    rowKey="recordId"
                    actionRef={tableRef}
                />
            )}
            {isModalOpen && (
                <AddEditModal
                    isModalOpen={isModalOpen}
                    handleCancel={handleCancel}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    userId={userId}
                    userName={userName}
                    reloadTable={reloadTable}
                    currentItem={currentItem}
                    editType={editType}
                    professionalList={professionalList}
                    vendorList={vendorList}
                />
            )}
        </>
    );
};
export default RecordNetworkHazard;
