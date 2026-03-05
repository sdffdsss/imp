import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Button, Modal, message } from 'oss-ui';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import moment from 'moment';
import { createFileFlow } from '@Common/utils/download';
import AuthButton from '@Src/components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import getColumns from './columns';
import AddEditModal from './add-edit-modal';
import { getProvince } from '@Common/utils/getProvince';
import { getTemporaryRoute, deleteTemporaryRoute, exportTemporaryRoute, getProvinceList } from './api';

const RecordTemporaryRoute = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    const { userId, userName, provinceId } = useLoginInfoModel();
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const formRef = useRef();
    const deleteOneRef = useRef(false);
    const [pagination, setPagination] = useState({});

    // 新增
    const handleAdd = () => {
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };
    const getProvinceData = async () => {
        const options = await getProvince();
        setProvinceData(options);
    };

    // 导出
    const handleExport = () => {
        const formValue = formRef?.current?.getFieldsValue(true);
        const params = {
            // startTime: moment(formValue.searchTime?.[0]).format('YYYY-MM-DD HH:mm:ss'),
            // endTime: moment(formValue.searchTime?.[1]).format('YYYY-MM-DD HH:mm:ss'),
            startTime: formValue.searchTime?.[0] ? moment(formValue.searchTime?.[0]).format('YYYY-MM-DD HH:mm:ss') : null,
            endTime: formValue.searchTime?.[1] ? moment(formValue.searchTime?.[1]).format('YYYY-MM-DD HH:mm:ss') : null,
            provinceId: formValue.provinceId,
            invertedSection: formValue.invertedSection,
            vendorIds: formValue.vendorIds,
            dataProvinceId: provinceId,
            reason: formValue.reason,
        };
        sendLogFn({ authKey: 'record-temporary-route:Export' });
        exportTemporaryRoute(params).then((res) => {
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
        sendLogFn({ authKey: 'record-temporary-route:Query' });
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
                await deleteTemporaryRoute({ id: record.id });
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
        pagination,
        provinceData,
    });
    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 获取路由列表数据
    const getTemporaryRouteList = (params) => {
        const paramsProvinceId = typeof params.provinceId === 'object' ? params.provinceId?.value : params.provinceId;
        setPagination({
            current: params.current,
            pageSize: params.pageSize,
        });
        const data = {
            pageNum: params.current,
            pageSize: params.pageSize,
            startTime: params.searchTime?.[0],
            endTime: params.searchTime?.[1],
            provinceId: paramsProvinceId,
            invertedSection: params.invertedSection,
            vendorIds: params.vendorIds?.join(','),
            dataProvinceId: provinceId,
            reason: params.reason,
        };

        return getTemporaryRoute(data);
    };
    useEffect(() => {
        getProvinceData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    // 给表单项赋初始值
    useEffect(() => {
        formRef.current?.setFieldsValue({
            // provinceId: Number(provinceId),
            // searchTime: [moment().subtract('month', 1).startOf('month'), moment().endOf('day')],
        });
        formRef.current?.submit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <VirtualTable
                global={window}
                toolBarRender={() => [
                    <AuthButton authKey="recordTemporaryRoute:add" onClick={handleAdd}>
                        新增
                    </AuthButton>,
                    <Button onClick={handleExport}>导出</Button>,
                ]}
                columns={columns}
                request={getTemporaryRouteList}
                actionRef={tableRef}
                formRef={formRef}
                rowKey="id"
                scroll={{ x: 'max-content' }}
            />
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
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
        </>
    );
};

export default RecordTemporaryRoute;
