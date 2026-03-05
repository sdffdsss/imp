import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import { Button, Modal, message, Tabs } from 'oss-ui';
import urlSearch from '@Common/utils/urlSearch';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import { useColumnsState } from '@Src/hooks';
import { sendLogFn } from '@Pages/components/auth/utils';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import { blobDownLoad } from '@Common/utils/download';
import AuthButton from '@Src/components/auth-button';
import AuthButtonNew from '@Pages/components/auth/auth-button';
import { getProvince } from '@Common/utils/getProvince';
import getColumns from './columns';
import AddEditModal from './add-edit-modal';
import HistoryModal from './history-modal';
import { getTemporaryRoute, deleteTemporaryRoute, exportTemporaryRoute, queryColumnConfig, getSelectCardTypeList } from './api';
import './index.less';

const { TabPane } = Tabs;
const RecordTemporaryRoute = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const [provinceData, setProvinceData] = useState([]);
    //const [professionalList, setProfessionalList] = useState([]);
    const { userId, userName, provinceId } = useLoginInfoModel();
    const [deviceTypeList, setDeviceTypeList] = useState([]);
    const [cardTypeList, setCardTypeList] = useState([]);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [pageTableSize, setPageTableSize] = useState(1);
    const [source, setSource] = useState(null);
    const [equipmentManufacturerList, setEquipmentManufacturerList] = useState([]); //设备厂商
    const [professionInit, setProfessionInit] = useState([]);
    const [loading, setLoading] = useState(true);
    const formRef = useRef();
    const urlData = urlSearch(window.location.href);
    const columnsState = useColumnsState({ configType: 27 });
    const columnsStateGj = useColumnsState({ configType: 27 });
    let currProvince = provinceData.find((item) => item.value === provinceId);
    let defaultSearchTime = [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')];
    let defaultProvinceId = provinceId;
    let defaultProfessionalType;
    if (urlData.provinceId) {
        defaultProvinceId = urlData.provinceId;
        currProvince = provinceData.find((item) => item.value === urlData.provinceId);
        defaultProfessionalType = urlData.professionalType || undefined;
        defaultSearchTime = [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')];
    }
    const [activeKey, setActiveKey] = useState('0');
    // 新增
    const handleAdd = () => {
        sendLogFn({ authKey: 'workbench-Workbench-FaultRecordSummary-Add' });
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    // 重新加载列表数据
    const tableRef = useRef();
    const reloadTable = () => {
        tableRef.current?.reload();
    };

    // 导出
    const handleExport = async () => {
        try {
            const formValue = formRef?.current?.getFieldsValue(true);
            const res = await queryColumnConfig(userId, 27);
            let showTrueKeys = res
                .filter((item) => item.show === 1)
                .sort((a, b) => {
                    // fixed=1 排在最前
                    if (a.fixed === 1 && b.fixed !== 1) return -1;
                    if (a.fixed !== 1 && b.fixed === 1) return 1;

                    // fixed=2 排在最后
                    if (a.fixed === 2 && b.fixed !== 2) return 1;
                    if (a.fixed !== 2 && b.fixed === 2) return -1;

                    // 其他情况保持原顺序
                    return 0;
                })
                .map((item) => item.code);
            /*        const showTrueKeys = Object.entries(columnsState.value)
                .filter(([key, config]) => config.show === true)
                .map(([key, config]) => key);*/
            if (activeKey === '1') {
                showTrueKeys = showTrueKeys.filter(
                    (item) =>
                        ![
                            'problemDispatch',
                            'isReportedNormally',
                            'board',
                            'pigtail',
                            'flange',
                            'powerSupply',
                            'other',
                            'line',
                            'faultyOpticalCable',
                        ].includes(item),
                );
            }
            const params = {
                faultStartTime: formValue.searchTime ? moment(formValue.searchTime?.[0]).format('YYYY-MM-DD HH:mm:ss') : null,
                faultEndTime: formValue.searchTime ? moment(formValue.searchTime?.[1]).format('YYYY-MM-DD HH:mm:ss') : null,
                provinceNameLike: formValue?.provinceName,
                professionalTypeList:
                    formValue.professionalType && !formValue.professionalType?.includes('-1') ? formValue.professionalType : undefined,
                sheetNo: formValue.sheetNo ? formValue.sheetNo : null,
                dataProvince: provinceId,
                source: formValue.source,
                userId,
                fieldList: showTrueKeys,
                regionalScope: activeKey,
            };
            exportTemporaryRoute(params).then((res) => {
                if (res) {
                    const url = `故障记录汇总${activeKey === '1' ? '（国际）' : '（国内）'}${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                    blobDownLoad(res, url);
                }
            });
        } catch (error) {
            console.error('导出失败:', error);
            message.error('导出失败，请重试');
        }
    };

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
    };

    const historyViewClick = (record, type) => {
        setIsHistoryModalOpen(true);
        setCurrentItem(record);
    };

    // 删除
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                await deleteTemporaryRoute({ id: record.id, operator: userName });
                message.success('删除成功');
                reloadTable();
            },
            onCancel() {},
        });
    };

    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleHistoryCancel = () => {
        setIsHistoryModalOpen(false);
    };
    const sleep = (time) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, time);
        });
    };
    // 获取路由列表数据
    const getTemporaryRouteList = async (params, sort, filter) => {
        await sleep(500);
        const realParams = formRef?.current?.getFieldsValue(true);
        const newParams = {
            ...params,
            professionalType: realParams.professionalType || [],
            searchTime: [
                realParams.searchTime?.[0]?.format('YYYY-MM-DD HH:mm:ss') || '',
                realParams.searchTime?.[1]?.format('YYYY-MM-DD HH:mm:ss') || '',
            ],
            source: realParams.source || '',
            sheetNo: realParams.sheetNo || '',
            provinceName: realParams.provinceName || '',
        };
        const data = {
            provinceNameLike: newParams.provinceName,
            dataProvince: provinceId,
            source: newParams.source,
            current: newParams.current,
            pageSize: newParams.pageSize,
            faultStartTime: newParams.searchTime?.[0],
            faultEndTime: newParams.searchTime?.[1],
            sheetNo: newParams.sheetNo,
            professionalTypeList:
                newParams.professionalType?.length > 0 && !newParams.professionalType?.includes('-1')
                    ? newParams.professionalType?.join(',')
                    : undefined,
            regionalScope: activeKey,
        };
        setPageCurrent(newParams.current);
        setPageTableSize(newParams.pageSize);
        return getTemporaryRoute(data);
    };
    // 获取归属省份
    const getProvinceData = async () => {
        const options = await getProvince();
        console.log(options, '===opt');
        setProvinceData(options);
    };
    useEffect(async () => {
        getProvinceData();
        // 获取新增时的专业有关信息
        const res1 = await getSelectCardTypeList('dutyProfessional');
        //获取板卡类型
        const res2 = await getSelectCardTypeList('dutyCardType');
        //获取设备厂商列表
        const res3 = await getSelectCardTypeList('dutyVendor');
        const res4 = await getDefaultGroupByUser();
        //获取班组来源列表
        //const res5 = await getSelectCardTypeList('groupSource');

        setDeviceTypeList([{ value: '全部', key: '-1' }, ...res1.data['dutyProfessional']]);
        setCardTypeList(res2.data['dutyCardType']);
        setEquipmentManufacturerList(res3.data['dutyVendor']);
        setProfessionInit(res4.professionalTypes);
        // 如果专业只包含了传输网，那来源默认选中页面录入，其他情况，来源默认为全部
        // 传输网的 key 是 '3'，这里假设 res4.professionalTypes 是包含 key 的数组
        if (res4.professionalTypes?.length === 1 && res4.professionalTypes?.[0] === '3') {
            setSource('1'); // 页面录入
        } else {
            setSource(''); // 全部
        }
        setLoading(false);
        // formRef.current?.setFieldsValue({
        //     provinceId: Number(defaultProvinceId),
        //     searchTime: defaultSearchTime,
        //     professionalType: professionInit,
        //     // professionalType: (defaultProfessionalType && defaultProfessionalType?.split(',')) || [],
        // });
        formRef.current?.submit();
    }, []);
    // 给表单项赋初始值
    // useEffect(() => {
    //     formRef.current?.setFieldsValue({
    //         provinceId: Number(defaultProvinceId),
    //         searchTime: defaultSearchTime,
    //         professionalType: professionInit,
    //         // professionalType: (defaultProfessionalType && defaultProfessionalType?.split(',')) || [],
    //     });
    //     formRef.current?.submit();
    // }, []);

    // 获取列表配置
    const columns = getColumns({
        pageCurrent,
        pageTableSize,
        searchTime: defaultSearchTime,
        showUserEditViewClick,
        historyViewClick,
        delCurrentUserClick,
        provinceId: Number(defaultProvinceId),
        currProvince,
        professionalList: deviceTypeList,
        professionalType: professionInit,
        provinceData,
        source,
        // professionalType: (defaultProfessionalType && defaultProfessionalType?.split(',')) || [],
        activeKey: '0',
    });
    // 获取列表配置
    const columnsGj = getColumns({
        pageCurrent,
        pageTableSize,
        searchTime: defaultSearchTime,
        showUserEditViewClick,
        historyViewClick,
        delCurrentUserClick,
        provinceId: Number(defaultProvinceId),
        currProvince,
        professionalList: deviceTypeList,
        professionalType: professionInit,
        provinceData,
        source,
        // professionalType: (defaultProfessionalType && defaultProfessionalType?.split(',')) || [],
        activeKey: '1',
    });
    if (_.isEmpty(columnsState.value)) {
        return null;
    }
    return (
        <>
            <Tabs
                style={{ height: 'calc(100% - 48px)' }}
                defaultActiveKey={activeKey}
                onChange={(key) => {
                    setActiveKey(key);
                }}
            >
                <TabPane tab="国内" key="0">
                    {!loading && activeKey === '0' && (
                        <VirtualTable
                            global={window}
                            toolBarRender={() => [
                                <AuthButton authKey="summaryOfFaultRecords:add" onClick={handleAdd}>
                                    新增
                                </AuthButton>,
                                <AuthButtonNew onClick={handleExport} ignoreAuth authKey="summary-of-fault-records:export">
                                    导出
                                </AuthButtonNew>,
                            ]}
                            rowClassName="summary-of-fault-records-item"
                            columns={columns}
                            request={getTemporaryRouteList}
                            actionRef={tableRef}
                            formRef={formRef}
                            scroll={{ x: 'max-content' }}
                            columnsState={columnsState}
                        />
                    )}
                </TabPane>
                <TabPane tab="国际" key="1">
                    {!loading && activeKey === '1' && (
                        <VirtualTable
                            global={window}
                            toolBarRender={() => [
                                <AuthButton authKey="summaryOfFaultRecords:add" onClick={handleAdd}>
                                    新增
                                </AuthButton>,
                                <AuthButtonNew onClick={handleExport} ignoreAuth authKey="summary-of-fault-records:export">
                                    导出
                                </AuthButtonNew>,
                            ]}
                            rowClassName="summary-of-fault-records-item"
                            columns={columnsGj}
                            request={getTemporaryRouteList}
                            actionRef={tableRef}
                            formRef={formRef}
                            scroll={{ x: 'max-content' }}
                            columnsState={columnsStateGj}
                        />
                    )}
                </TabPane>
            </Tabs>

            {isModalOpen && (
                <AddEditModal
                    cardTypeList={cardTypeList}
                    deviceTypeList={deviceTypeList}
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
                    activeKey={activeKey}
                    equipmentManufacturerList={equipmentManufacturerList}
                />
            )}
            {isHistoryModalOpen && <HistoryModal isModalOpen={isHistoryModalOpen} handleCancel={handleHistoryCancel} currentItem={currentItem} />}
        </>
    );
};

export default RecordTemporaryRoute;
