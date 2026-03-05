import React, { useState, useCallback, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Button, Modal, message } from 'oss-ui';
import getColumns from './columns';
import AddEditModal from './add-edit-modal';
import { getTemporaryRoute, deleteTemporaryRoute, exportTemporaryRoute, getProvinceList, getDictEntry } from './api';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import moment from 'moment';
import { blobDownLoad } from '@Common/utils/download';
import AuthButton from '@Src/components/auth-button';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';

const RecordTemporaryRoute = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [columns, setColumns] = useState([]);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    const [professionalList, setProfessionalList] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [professionalTypeInitial, setProfessionalTypeInitial] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId, userName, provinceId } = useLoginInfoModel();
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const formRef = useRef();
    const operationContentList = [
        {
            key: 0,
            value: '打环',
        },
        {
            key: 1,
            value: '复位',
        },
        {
            key: 2,
            value: '系统切换',
        },
        {
            key: 3,
            value: '业务切换',
        },
        {
            key: 4,
            value: '开关激光器',
        },
        {
            key: 5,
            value: '光功率调整',
        },
    ];
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
            operationStartTime: formValue.searchTime?.[0].format('YYYY-MM-DD HH:mm:ss'),
            operationEndTime: formValue.searchTime?.[1].format('YYYY-MM-DD HH:mm:ss'),
            provinceId: formValue.provinceId
                ? typeof formValue.provinceId === 'object'
                    ? formValue.provinceId.value
                    : formValue.provinceId
                : provinceId,
            description: formValue.description,
            professionalType: formValue.professionalType?.length > 0 && !formValue.professionalType.includes('-1') ? formValue.professionalType : [],
        };
        sendLogFn({ authKey: 'networkOperationRecord:export' });
        exportTemporaryRoute(params).then((res) => {
            if (res) {
                const url = `网管操作记录${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                blobDownLoad(res, url);
            }
        });
    };

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
        sendLogFn({ authKey: 'networkOperationRecord:check' });
    };
    //删除
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                await deleteTemporaryRoute({ recordId: record.recordId });
                message.success('删除成功');
                reloadTable();
            },
            onCancel() {},
        });
    };
    // 重加载
    const tableRef = useRef();
    const reloadTable = () => {
        tableRef.current.reload();
    };

    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 获取路由列表数据
    const getTemporaryRouteList = (params, sort, filter) => {
        const data = {
            pageIndex: params.current,
            pageSize: params.pageSize,
            operationStartTime: params.searchTime?.[0],
            operationEndTime: params.searchTime?.[1],
            provinceId: params.provinceId ? (typeof params.provinceId === 'object' ? params.provinceId.value : params.provinceId) : provinceId,
            description: params.description,
            professionalType: params.professionalType?.length > 0 && !params.professionalType.includes('-1') ? params.professionalType : [],
        };
        setPageNum(params.current);
        setPageSize(params.pageSize);
        return getTemporaryRoute(data);
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
    useEffect(() => {
        // 表格配置
        setColumns(
            getColumns({
                pageNum: pageNum,
                pageSize: pageSize,
                professionalList: [{ value: '全部', key: '-1' }, ...professionalList],
                showUserEditViewClick,
                delCurrentUserClick,
                provinceId: Number(provinceId),
                searchTime: [moment().subtract(2, 'month').startOf('day'), moment().endOf('day')],
                currProvince,
                professionalTypeInitial,
            }),
        );
    }, [pageNum, professionalTypeInitial, professionalList]);
    // 给表单项赋初始值
    useEffect(async () => {
        await getProvinceData();
        const res = await getDictEntry();
        setProfessionalList(res);

        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('professionalTypes')) {
            const professionalTypes = searchParams.get('professionalTypes').split(',');

            setProfessionalTypeInitial(professionalTypes);
            setLoading(false);
            formRef.current?.setFieldsValue({
                provinceId: Number(provinceId),
                searchTime: [moment().subtract(2, 'month').startOf('day'), moment().endOf('day')],
                professionalType: professionalTypes,
            });

            formRef.current?.submit();
        } else {
            getDefaultGroupByUser().then((res) => {
                setProfessionalTypeInitial(res.professionalTypes);
                setLoading(false);
                formRef.current?.setFieldsValue({
                    provinceId: Number(provinceId),
                    searchTime: [moment().subtract(2, 'month').startOf('day'), moment().endOf('day')],
                    professionalType: res.professionalTypes,
                });
                formRef.current?.submit();
            });
        }
    }, []);

    return (
        <>
            {!loading && (
                <VirtualTable
                    options={{ pageSize: 1 }}
                    global={window}
                    toolBarRender={() => [
                        <AuthButton authKey="networkOperationRecord:add" onClick={handleAdd}>
                            新增
                        </AuthButton>,
                        <Button onClick={handleExport}>导出</Button>,
                    ]}
                    columns={columns}
                    request={getTemporaryRouteList}
                    actionRef={tableRef}
                    formRef={formRef}
                    scroll={{ x: 'max-content' }}
                />
            )}
            {isModalOpen && (
                <AddEditModal
                    provinceIdForModal={provinceId}
                    editType={editType}
                    isModalOpen={isModalOpen}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    userName={userName}
                    currProvince={currProvince}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                    professionalList={professionalList}
                    operationContentList={operationContentList}
                />
            )}
        </>
    );
};

export default RecordTemporaryRoute;
