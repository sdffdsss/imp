import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Icon, Modal, message } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import AuthButton from '@Src/components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { blobDownLoad } from '@Common/utils/download';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import AddEditModal from './add-edit-modal';
import {
    getAlarmOptimizationManagement,
    deleteAlarmOptimizationManagement,
    exportAlarmOptimizationManagement,
    getProvinceList,
    getProfessionalTypeList,
} from './api';
import getColumns from './columns';
import UploadComp from './upload/index';

const AlarmOptimizationManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    const [professionalData, setProfessionalData] = useState([]);
    const [importVisible, setImportVisible] = useState(false);
    const [pagination, setPagination] = useState({});
    const { userId, userName, provinceId } = useLoginInfoModel();
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const formRef = useRef();

    const [professionalTypeInitial, setProfessionalTypeInitial] = useState([]);
    const [loading, setLoading] = useState(true);

    const startFormat = 'YYYY-MM-DD 00:00:00';
    const endFormat = 'YYYY-MM-DD 23:59:59';

    // 重加载
    const tableRef = useRef();
    const reloadTable = (type = 'edit') => {
        if (type === 'delete') {
            tableRef.current.reloadAndRest();
        }
        tableRef.current.reload();
    };

    // 新增
    const handleAdd = () => {
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };
    // 批量导入
    const handleImport = () => {
        setImportVisible(true);
    };
    const closeImportModal = () => {
        setImportVisible(false);
    };

    const download = (url) => {
        console.log('down====', url);
        // const a = document.createElement('a');
        // a.href = useEnvironmentModel.data.environment.experienceUrl.direct + url;
        // a.download = '';
        // a.click();
    };
    // 导出
    const handleExport = () => {
        const formValue = formRef?.current?.getFieldsValue(true);
        const params = {
            provinceId: formValue.provinceId,
            professionIds: formValue.professionId,
            alarmPlatform: formValue.alarmPlatform,
            alarmTitle: formValue.alarmTitle,
            alarmLevel: formValue.alarmLevel,
            optimizationFlag: formValue.optimizationFlag,
            optimizationCompleteFlag: formValue.optimizationCompleteFlag,
            firstTimeStart: formValue.firstTime?.[0] ? moment(formValue.firstTime?.[0]).format(startFormat) : undefined,
            firstTimeEnd: formValue.firstTime?.[1] ? moment(formValue.firstTime?.[1]).format(endFormat) : undefined,
            lastTimeStart: formValue.lastTime?.[0] ? moment(formValue.lastTime?.[0]).format(startFormat) : undefined,
            lastTimeEnd: formValue.lastTime?.[1] ? moment(formValue.lastTime?.[1]).format(endFormat) : undefined,
            clearTimeStart: formValue.clearTime?.[0] ? moment(formValue.clearTime?.[0]).format(startFormat) : undefined,
            clearTimeEnd: formValue.clearTime?.[1] ? moment(formValue.clearTime?.[1]).format(endFormat) : undefined,
        };
        exportAlarmOptimizationManagement(params).then((res) => {
            if (res) {
                blobDownLoad(res, `告警与优化管理记录${moment().format('YYYY-MM-DD')}.xlsx`);
            }
        });
    };

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
        sendLogFn({ authKey: 'alarm-optimization-management:check' });
    };
    // 删除
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                await deleteAlarmOptimizationManagement({ id: record.id });
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
        professionalData,
        pagination,
        professionalTypeInitial,
    });
    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 获取告警优化管理列表数据
    const getAlarmOptimizationManagementList = (params, sort) => {
        setPagination({
            current: params.current,
            pageSize: params.pageSize,
        });
        let orderFlag = '';
        let fieldFlag = '';
        // let timeFlag = ''
        const sortFlag = Object.keys(sort);
        if (sortFlag.length > 0) {
            const fieldsName = sortFlag.toString();
            if (fieldsName === 'firstTime') {
                orderFlag = sort.firstTime === 'descend' ? 'desc' : 'asc';
                fieldFlag = 'first_time';
            } else if (fieldsName === 'clearTime') {
                orderFlag = sort.clearTime === 'descend' ? 'desc' : 'asc';
                fieldFlag = 'clear_time';
            } else if (fieldsName === 'lastTime') {
                orderFlag = sort.lastTime === 'descend' ? 'desc' : 'asc';
                fieldFlag = 'last_time';
            }
        } else {
            orderFlag = undefined;
            fieldFlag = undefined;
        }
        const data = {
            pageNum: params.current,
            pageSize: params.pageSize,
            provinceId: params.provinceId,
            professionIds: params.professionId?.length > 0 && !params.professionId.includes('-1') ? params.professionId?.join(',') : '',
            alarmPlatform: params.alarmPlatform,
            alarmTitle: params.alarmTitle,
            alarmLevel: params.alarmLevel,
            optimizationFlag: params.optimizationFlag,
            optimizationCompleteFlag: params.optimizationCompleteFlag,
            firstTimeStart: params.firstTime?.[0] ? moment(params.firstTime?.[0]).format(startFormat) : undefined,
            firstTimeEnd: params.firstTime?.[1] ? moment(params.firstTime?.[1]).format(endFormat) : undefined,
            lastTimeStart: params.lastTime?.[0] ? moment(params.lastTime?.[0]).format(startFormat) : undefined,
            lastTimeEnd: params.lastTime?.[1] ? moment(params.lastTime?.[1]).format(endFormat) : undefined,
            clearTimeStart: params.clearTime?.[0] ? moment(params.clearTime?.[0]).format(startFormat) : undefined,
            clearTimeEnd: params.clearTime?.[1] ? moment(params.clearTime?.[1]).format(endFormat) : undefined,
            orderFieldName: fieldFlag,
            orderType: orderFlag,
        };
        return getAlarmOptimizationManagement(data);
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
            const list = res.data;
            setProfessionalData([{ txt: '全部', id: '-1' }, ...list]);
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
                        <AuthButton authKey="alarmOptimizationManagement:add" onClick={handleAdd}>
                            <Icon antdIcon type="PlusOutlined" /> 新建
                        </AuthButton>,
                        // <AuthButton authKey="alarmOptimizationManagement:import" onClick={handleImport}>
                        //     <Icon antdIcon type="ImportOutlined" /> 批量导入
                        // </AuthButton>,
                        <AuthButton authKey="alarmOptimizationManagement:export" onClick={handleExport}>
                            <Icon antdIcon type="ExportOutlined" /> 导出
                        </AuthButton>,
                    ]}
                    columns={columns}
                    request={getAlarmOptimizationManagementList}
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
                    userName={currentItem?.createUserName || userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    professionalData={professionalData}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
            {importVisible && <UploadComp onColseUploadModal={closeImportModal} onImportSuccess={reloadTable} onDownload={download} />}
        </>
    );
};

export default AlarmOptimizationManagement;
