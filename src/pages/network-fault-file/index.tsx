import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import moment from 'moment';
import { formatEditData } from './utils';
import { Modal, message, Tooltip, Button, Icon, Space, Form } from 'oss-ui';
import { usePersistFn } from 'ahooks';
import { blobDownLoad } from '@Common/utils/download';
import { useColumnsState, useNavigatePage } from '@Src/hooks';
import useLoginInfoModel from '@Src/hox';

import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import {
    getPageList,
    deleteFault,
    getAllZones,
    getEnumApi,
    downloadExportFile,
    exportApi,
    getExportProgressApi,
    getRegionListApi,
    deleteProcessApi,
    archivedStateEnableApi,
    deleteBatchApi,
    getSiteList,
} from './api';
// import { ActionType } from './type';
import { getColumns } from './columns';
import { authData } from './auth';
import FaultModal, { TMode } from './modal';
import ImportModal from './modal-import';
import ExamineModal from './examine-batch';
import ContactModal from './contact-modal';
import AsyncExportModal from './async-export-modal';
import HeaderForm from './header-form';
import './index.less';

const NetworkFaultFile: FC = () => {
    const formRef = useRef<any>();
    const tableRef = useRef<any>();

    const { getUrlSearchParams } = useNavigatePage();

    const { currentZone, zoneLevelFlags, userId, parsedUserInfo, userZoneInfo } = useLoginInfoModel();

    const [visible, setVisible] = useState(false);
    const [importVisible, setImportVisible] = useState(false);
    const [examineVisible, setExamineVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [enums, setEnums] = useState<any>({});
    const [exportVisible, setExportVisible] = useState(false);
    const [editType, setEditType] = useState<TMode>('new');
    const [initialValues, setInitialValues] = useState(null);

    const [provinceList, setProvinceList] = useState<any>([]);
    const [cityList, setCityList] = useState([]);
    const [specialtyLayer, setSpecialtyLayer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contactVisible, setContactVisible] = useState(false);

    const [formExpand, setFormExpand] = useState(true);
    const [asyncExportList, setAsyncExportList] = useState<any>([]);
    const columnsState = useColumnsState({ configType: 32 });

    const allZonesRef = useRef([]);
    const totalCountRef = useRef(0);
    const asyncExportTimerRef = useRef<any>(null);
    const requestParamsRef = useRef(null);
    const [form] = Form.useForm();
    const [siteList, setSiteList] = useState([]);
    const getEnumsFn = usePersistFn(async () => {
        const temp1 = await getEnumApi([
            'networkLayer',
            'rootCauseProfession',
            'faultLevel-net',
            'faultCauseType1',
            'faultCauseType2',
            'dataState',
            'dataSource',
            'cloudPoolType',
            'dhDeviceType',
        ]);
        return temp1?.data || {};
    });

    const getAllZonesFn = usePersistFn(async () => {
        const res = await getAllZones();

        const fullList = res?.['_embedded']?.zoneResourceList;

        return fullList || [];
    });
    const getAllSiteNameFn = async (param) => {
        const res = await getSiteList(param);
        setSiteList(res?.['_embedded']?.regionResourceList || []);
    };
    const hasAuth = (authKey: string) => {
        const { operationsButton } = parsedUserInfo;
        const findAuth = operationsButton.find((item) => item.key === authKey);
        return !findAuth;
    };
    const hasReviewAuth = !hasAuth(authData.reviewFault);
    const hasArchivedAuth = !hasAuth('network-fault-file:archived');
    const isGroupLeader = userZoneInfo.zoneLevel === '1';
    const buttonDisabled = useMemo(() => {
        if (userZoneInfo.zoneLevel === '5' && userZoneInfo.zoneId !== currentZone.zoneId) {
            return true;
        }
        return false;
        // eslint-disable-next-line
    }, []);

    const fomartParams = (params) => {
        const returnParms = Object.entries(params).reduce(
            (accu, [key, value]) => {
                if (['haveMalfunction', 'isEffectBusiness', 'havePublicSentiment', 'hasRestored', 'causedByHidden'].includes(key)) {
                    let newValue;
                    if (value === '0') {
                        newValue = undefined;
                    } else if (value === '2') {
                        newValue = '0';
                    } else {
                        newValue = '1';
                    }
                    Object.assign(accu, { [key]: newValue });
                }

                if (['eventTime'].includes(key) && value) {
                    console.log(value, 'value');
                    Object.assign(accu, {
                        eventTime: undefined,
                        eventTimeBegin: value[0].format('YYYY-MM-DD HH:mm:ss'),
                        eventTimeEnd: value[1].format('YYYY-MM-DD HH:mm:ss'),
                    });
                }
                if (['createTime'].includes(key) && value) {
                    console.log(value, 'value');
                    Object.assign(accu, {
                        createTime: undefined,
                        reportTimeBegin: value[0].format('YYYY-MM-DD HH:mm:ss'),
                        reportTimeEnd: value[1].format('YYYY-MM-DD HH:mm:ss'),
                    });
                }

                if (['provinceId', 'regionId'].includes(key)) {
                    Object.assign(accu, { [key]: value === 'all' ? undefined : value });
                }

                return accu;
            },
            { ...params },
        );

        if (!_.has(returnParms, 'reportProvince') || !params.reportProvince || returnParms.reportProvince.length === 0) {
            const returnProvinceList = provinceList.map((item) => item.zoneId);
            if (currentZone.zoneLevel !== '1') {
                returnProvinceList.push(0);
            }
            Object.assign(returnParms, { reportProvince: returnProvinceList });
        } else {
            Object.assign(returnParms, { reportProvince: params.reportProvince });
        }

        if (currentZone.zoneLevel !== '1' && !returnParms.provinceId) {
            Object.assign(returnParms, { provinceId: currentZone.zoneId });
        }
        return returnParms;
    };
    const getList = async (params, option) => {
        if (_.has(option, 'dataStateCn')) {
            Object.assign(params, { orderType: option.dataStateCn, orderFieldName: 'dataState' });
        }

        const formParams = form.getFieldsValue();
        const formatFormParams = fomartParams(formParams);
        requestParamsRef.current = { ...formatFormParams, ...params };

        console.log('初次请求参数', { formParams, formatFormParams, params });
        const res = await getPageList({ ...params, ...formatFormParams });

        totalCountRef.current = res.total;
        return {
            data: res.data || [],
            success: res.code === 200,
            total: res.total,
        };
    };

    // 删除列表项
    const deleteClick = (row) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除该数据吗?',
            onOk: async () => {
                try {
                    const res = await deleteFault(row?.id);
                    if (res.code === 200) {
                        message.success('删除成功');
                        if (tableRef.current) {
                            tableRef.current.reload();
                        }
                    } else {
                        message.error('删除失败');
                    }
                } catch {
                    message.error('接口错误');
                }
            },
            onCancel() {},
        });
    };

    const hasDeleteHandleAuth = (row) => {
        const isGroupReport = row.reportProvince === 0;
        const noGroupDeleteDisable =
            isGroupLeader ||
            (!isGroupLeader && hasReviewAuth && [3, 5].includes(row.dataState)) ||
            (!isGroupLeader && !hasReviewAuth && [3, 4, 5].includes(row.dataState));

        const groupDeleteDisable =
            (isGroupLeader && !hasReviewAuth && [5].includes(row.dataState)) ||
            (isGroupLeader && hasReviewAuth && [5].includes(row.dataState)) ||
            (!isGroupLeader && hasReviewAuth && [0, 3, 4, 5].includes(row.dataState)) ||
            (!isGroupLeader && !hasReviewAuth);

        const deleteDisabled =
            (isGroupReport ? groupDeleteDisable : noGroupDeleteDisable) ||
            (!isGroupReport && isGroupLeader && !hasReviewAuth && [5].includes(row.dataState) && specialtyLayer.includes(row.networkLayer)) ||
            buttonDisabled;
        // if ([5].includes(row.dataState) && hasArchivedAuth) {
        //     // 已归档有删除权限的均可删除
        //     return false;
        // }
        return deleteDisabled;
    };

    const deleteAllClick = () => {
        const filteredRows = selectedRows.filter((item) => !hasDeleteHandleAuth(item));

        Modal.confirm({
            title: '提示',
            content: '是否确认删除?',
            onOk: async () => {
                const params = {
                    userId,
                    recordIdList: filteredRows.map((item) => item.id),
                };
                const res = await deleteBatchApi(params);
                if (res.code === 200) {
                    if (!hasReviewAuth && !isGroupLeader) {
                        if (filteredRows.length > 0) {
                            message.success(`${filteredRows.length}条（草稿+待确认+省内驳回）数据删除成功`);
                        } else {
                            message.warn('没有可删除的数据(草稿+待确认+省内驳回)');
                        }
                    }
                    if (hasReviewAuth && !isGroupLeader) {
                        if (filteredRows.length > 0) {
                            message.success(`${filteredRows.length}条（草稿+待确认+省内驳回+集团驳回）数据删除成功`);
                        } else {
                            message.warn('没有可删除的数据(草稿+待确认+省内驳回+集团驳回)');
                        }
                    }
                    if (isGroupLeader) {
                        if (filteredRows.length > 0) {
                            message.success(`${filteredRows.length}条（草稿+待审核+集团驳回）数据删除成功`);
                        } else {
                            message.warn('没有可删除的数据(草稿+待审核+集团驳回)');
                        }
                    }

                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                    tableRef.current.reload();
                } else {
                    message.error(res.message);
                }
            },
            onCancel() {},
        });
    };

    const editClick = (row) => {
        setEditType('edit');
        const area = row.area ? (row.area === '中国' ? 'china' : 'overseas') : null;
        const provinceId = row.provinceId === null ? (row.area ? '--' : undefined) : row.provinceId;
        const regionId = row.regionId === null ? (row.area ? '--' : undefined) : row.regionId;

        setInitialValues({
            ...row,
            area,
            overseasArea: row?.area === '中国' ? undefined : row.area,
            eventDate: row.eventDate ? moment(row.eventDate) : null,
            eventTime: row.eventTime ? moment(row.eventTime) : null,
            businessEffectedStartTime: row.businessEffectedStartTime ? moment(row.businessEffectedStartTime) : null,
            clearTime: row.clearTime ? moment(row.clearTime) : null,
            businessRecoveryTime: row.businessRecoveryTime ? moment(row.businessRecoveryTime) : null,
            networkLayer: row.networkLayer ? String(row.networkLayer) : null,
            hasRestored: row.hasRestored,
            faultLevel: row.faultLevel ? String(row.faultLevel) : null,
            rootCauseProfession: row.rootCauseProfession ? String(row.rootCauseProfession) : null,
            faultCauseType1: row.faultCauseType1 ? String(row.faultCauseType1) : undefined,
            faultCauseType2: row.faultCauseType2 || row.faultCauseType2 === 0 ? String(row.faultCauseType2) : undefined,
            provinceId,
            regionId,
            modifier: userId,
        });
        setVisible(true);
    };
    const reviewClick = (row) => {
        setEditType('review');
        console.log(row, '===row');
        const area = row.area ? (row.area === '中国' ? 'china' : 'overseas') : null;
        const provinceId = row.provinceId === null ? (row.area ? '--' : undefined) : row.provinceId;
        const regionId = row.regionId === null ? (row.area ? '--' : undefined) : row.regionId;
        setInitialValues({
            ...row,
            area,
            overseasArea: row.area === '中国' ? undefined : row.area,
            eventDate: row.eventDate ? moment(row.eventDate) : null,
            eventTime: row.eventTime ? moment(row.eventTime) : null,
            businessEffectedStartTime: row.businessEffectedStartTime ? moment(row.businessEffectedStartTime) : null,
            clearTime: row.clearTime ? moment(row.clearTime) : null,
            businessRecoveryTime: row.businessRecoveryTime ? moment(row.businessRecoveryTime) : null,
            networkLayer: row.networkLayer ? String(row.networkLayer) : null,
            hasRestored: row.hasRestored,
            faultLevel: row.faultLevel ? String(row.faultLevel) : null,
            rootCauseProfession: row.rootCauseProfession ? String(row.rootCauseProfession) : null,
            faultCauseType1: row.faultCauseType1 ? String(row.faultCauseType1) : undefined,
            faultCauseType2: row.faultCauseType2 || row.faultCauseType2 === 0 ? String(row.faultCauseType2) : undefined,
            provinceId,
            regionId,
            pass: true,
        });
        setVisible(true);
    };
    const viewClick = (row) => {
        setEditType('view');

        const area = row.area ? (row.area === '中国' ? 'china' : 'overseas') : null;
        const provinceId = row.provinceId === null ? (row.area ? '--' : undefined) : row.provinceId;
        const regionId = row.regionId === null ? (row.area ? '--' : undefined) : row.regionId;
        setInitialValues({
            ...row,
            area,
            overseasArea: row.area === '中国' ? undefined : row.area,
            eventDate: row.eventDate ? moment(row.eventDate) : null,
            eventTime: row.eventTime ? moment(row.eventTime) : null,
            businessEffectedStartTime: row.businessEffectedStartTime ? moment(row.businessEffectedStartTime) : null,
            clearTime: row.clearTime ? moment(row.clearTime) : null,
            businessRecoveryTime: row.businessRecoveryTime ? moment(row.businessRecoveryTime) : null,
            networkLayer: row.networkLayer ? String(row.networkLayer) : null,
            hasRestored: row.hasRestored,
            faultLevel: row.faultLevel ? String(row.faultLevel) : null,
            rootCauseProfession: row.rootCauseProfession ? String(row.rootCauseProfession) : null,
            faultCauseType1: row.faultCauseType1 ? String(row.faultCauseType1) : undefined,
            faultCauseType2: row.faultCauseType2 || row.faultCauseType2 === 0 ? String(row.faultCauseType2) : undefined,
            provinceId,
            regionId,
        });
        setVisible(true);
    };
    const getArchivedStateEnableData = async () => {
        const res = await archivedStateEnableApi();
        if (res.code === 200) {
            setSpecialtyLayer(res.data.networkLayer.split(',').map((item) => Number(item)));
        }
    };

    const columns = [
        ...getColumns(provinceList, cityList, enums),
        {
            dataIndex: 'action',
            title: '操作',
            width: 120,
            fixed: 'right',
            hideInSearch: true,
            render: (text: string, row) => {
                /**
                 * 草稿 - 0
                 * 待确认 - 1
                 * 省内驳回 - 2
                 * 待审批 - 3
                 * 集团驳回 - 4
                 * 归档 - 5
                 */

                const hasEditAuth = !hasAuth(authData.editFault);
                const hasDeleteAuth = !hasAuth(authData.deleteFault);

                const isGroupReport = row.reportProvince === 0;

                const reviewDisable =
                    (isGroupLeader && [1, 2, 5].includes(row.dataState)) ||
                    (!isGroupLeader && isGroupReport && [3, 4, 5].includes(row.dataState)) ||
                    (!isGroupLeader && !isGroupReport && [3, 5].includes(row.dataState)) ||
                    [0].includes(row.dataState);

                const noGroupEditDisable =
                    (!isGroupLeader && !hasReviewAuth && [3, 4, 5].includes(row.dataState)) ||
                    (!isGroupLeader && hasReviewAuth && [3, 5].includes(row.dataState)) ||
                    (isGroupLeader && hasReviewAuth && [0, 1, 2, 5].includes(row.dataState)) ||
                    (isGroupLeader && !hasReviewAuth);

                const groupEditDisable =
                    (isGroupLeader && !hasReviewAuth && [5].includes(row.dataState)) ||
                    (isGroupLeader && hasReviewAuth && [5].includes(row.dataState)) ||
                    (!isGroupLeader && hasReviewAuth && [0, 3, 4, 5].includes(row.dataState)) ||
                    (!isGroupLeader && !hasReviewAuth);

                const editDisabled = (isGroupReport ? groupEditDisable : noGroupEditDisable) || buttonDisabled;

                const reviewDisabled = () => {
                    if (isGroupLeader && hasReviewAuth && [5].includes(row.dataState) && specialtyLayer.includes(row.networkLayer)) {
                        return false;
                    }
                    return reviewDisable;
                };
                const editDisabledFn = () => {
                    if ([5].includes(row.dataState) && hasArchivedAuth) {
                        return false;
                    }
                    if (isGroupLeader && hasReviewAuth && [5].includes(row.dataState) && specialtyLayer.includes(row.networkLayer)) {
                        return false;
                    }
                    return editDisabled;
                };
                const deleteDisbaledFn = () => {
                    if ([5].includes(row.dataState) && hasArchivedAuth) {
                        return false;
                    }
                    return hasDeleteHandleAuth(row);
                };

                return (
                    <Space>
                        {hasEditAuth && (
                            <Tooltip title="编辑" key="edit">
                                <Button disabled={editDisabledFn()} type="text" style={{ padding: 0 }} onClick={() => editClick(row)}>
                                    <Icon antdIcon type="EditOutlined" />
                                </Button>
                            </Tooltip>
                        )}
                        {hasDeleteAuth && (
                            <Tooltip title="删除" key="delete">
                                <Button disabled={deleteDisbaledFn()} type="text" style={{ padding: 0 }} onClick={() => deleteClick(row)}>
                                    <Icon antdIcon type="DeleteOutlined" />
                                </Button>
                            </Tooltip>
                        )}

                        <Tooltip title="查看" key="show">
                            <Button
                                type="text"
                                onClick={() => {
                                    viewClick(row);
                                }}
                                style={{ padding: 0 }}
                            >
                                <Icon antdIcon type="SearchOutlined" />
                            </Button>
                        </Tooltip>
                        {hasReviewAuth ? (
                            <Tooltip title="审核" key="review">
                                <Button
                                    disabled={reviewDisabled() || buttonDisabled}
                                    type="text"
                                    style={{ padding: 0 }}
                                    onClick={() => reviewClick(row)}
                                >
                                    <Icon antdIcon type="CheckCircleOutlined" />
                                </Button>
                            </Tooltip>
                        ) : null}
                    </Space>
                );
            },
        },
    ];

    const getProvinceUnderCitys = async () => {
        const formatList = (list) => {
            return list
                .filter((item) => {
                    const tList = [];
                    return !tList.includes(item.regionName);
                })
                .map((item) => {
                    return {
                        zoneId: item.regionId,
                        zoneName: item.regionName,
                    };
                });
        };

        // 集团用户直接查全国所有地市
        if (currentZone.zoneLevel === '1') {
            const res = await getRegionListApi({ creator: userId });
            setCityList(formatList(res));
            // 非集团用户查用户省份下所有地市
        } else {
            let reqList = provinceList.map((el) => {
                return getRegionListApi({
                    creator: '968617',
                    parentRegionId: el.zoneId,
                });
            });
            if (provinceList.length === 0) {
                reqList = [getRegionListApi({ creator: '968617', parentRegionId: currentZone.zoneId })];
            }
            const resList = await Promise.all(reqList);
            setCityList(formatList(resList.flat()));
        }
    };

    function onValuesChange(changedValues, allValues) {
        if (_.has(changedValues, 'provinceId')) {
            formRef.current?.setFieldsValue({ regionId: undefined });
            if (changedValues.provinceId !== 'all') {
                getRegionListApi({
                    creator: '968617',
                    parentRegionId: changedValues.provinceId || currentZone.zoneId,
                }).then((res) => {
                    setCityList(
                        res.map((item) => {
                            return {
                                zoneId: item.regionId,
                                zoneName: item.regionName,
                            };
                        }),
                    );
                });
            } else {
                getProvinceUnderCitys();
            }
        }
        if (!_.has(allValues, 'provinceId')) {
            getProvinceUnderCitys();
        }
    }

    async function onDownLoad() {
        const res = await downloadExportFile({ userId });
        const fileName = res.headers['content-disposition'].split("filename*=UTF-8''")[1];
        blobDownLoad(res, decodeURIComponent(fileName));
    }

    const getExportProgress = async () => {
        const result = await getExportProgressApi({ userId });
        if (result.code === 0 && result.data) {
            const { exportSize, exportTimeStr, exportType, progress, exportStatus } = result.data;
            const defaultStatus = {
                str: '',
                status: '',
            };
            if (exportStatus && progress === 100) {
                defaultStatus.str = '导出完成';
                defaultStatus.status = 'success';
            }
            if (exportStatus && progress !== 100) {
                defaultStatus.str = '正在导出';
                defaultStatus.status = 'active';
            }
            if (!exportStatus) {
                defaultStatus.str = '导出失败';
                defaultStatus.status = 'exception';
            }

            const list: any = {
                exportFormat: exportType,
                exportTime: exportTimeStr,
                exportTotal: exportSize,
                exportState: defaultStatus.str,
                exportSchedule: { status: defaultStatus.status, percent: progress },
            };
            setAsyncExportList([list]);

            if (progress < 100 && !asyncExportTimerRef.current && progress > 0) {
                asyncExportTimerRef.current = setInterval(() => {
                    getExportProgress();
                }, 2000);
            }
            if (progress === 100 || !exportStatus) {
                clearInterval(asyncExportTimerRef.current);
                asyncExportTimerRef.current = null;
            }
        } else {
            clearInterval(asyncExportTimerRef.current);
            asyncExportTimerRef.current = null;
        }
    };

    async function onExport() {
        await exportApi({ ...requestParamsRef.current, userId });

        if (asyncExportTimerRef.current) return;
        asyncExportTimerRef.current = setInterval(() => {
            getExportProgress();
        }, 2000);
    }
    const onAsyncDelete = async () => {
        Modal.confirm({
            title: '是否确认终止目前的导出任务？',

            okText: '是',
            cancelText: '否',
            onOk: async () => {
                await deleteProcessApi({ userId });
                setAsyncExportList([]);
            },
            onCancel: () => {},
        });
    };
    useEffect(() => {
        Promise.all([getAllZonesFn(), getEnumsFn()]).then((res) => {
            const [res1, res2] = res;

            const temp1 = res1.filter((item) => item.zoneName !== '省本部');
            allZonesRef.current = temp1;

            let siteParam: any = '';
            if (zoneLevelFlags.isCountryZone) {
                setProvinceList(temp1.filter((item) => [1, 2, 5].includes(item.zoneLevel)));
            } else if (zoneLevelFlags.isRegionZone) {
                setProvinceList(temp1.filter((item) => item.zoneId === Number(currentZone.zoneId)));
                siteParam = {
                    regionName: userZoneInfo?.zoneName,
                };
            } else if (zoneLevelFlags.isProvinceZone) {
                setProvinceList(temp1.filter((item) => item.zoneId === Number(currentZone.zoneId)));
                siteParam = {
                    provinceName: userZoneInfo?.zoneName,
                };
            } else if (zoneLevelFlags.isCityZone) {
                setProvinceList(temp1.filter((item: any) => item.parentZoneId === Number(currentZone.zoneId)));
                siteParam = {
                    regionName: userZoneInfo?.zoneName,
                };
            }

            getAllSiteNameFn(siteParam);
            setEnums(res2);

            setLoading(false);
        });
        getProvinceUnderCitys();
        getArchivedStateEnableData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onFinish = () => {
        // @ts-ignore
        tableRef.current?.reload();
    };
    const onReset = () => {
        // @ts-ignore
        tableRef.current?.reload();
    };
    const getSelectedRow = (record: any, selected: boolean) => {
        const set = new Set(selectedRowKeys); //  故障id
        const set2 = new Set(selectedRows); // 故障数据状态
        const records = Array.isArray(record) ? record : [record];
        records.forEach((item) => {
            if (selected) {
                set.add(item.id);
                set2.add(item);
            } else {
                set.delete(item.id);
                set2.delete(item);
            }
        });
        return [Array.from(set), Array.from(set2)];
    };

    const onTableChange = (record: any, selected: boolean) => {
        const result = getSelectedRow(record, selected);
        setSelectedRowKeys(result[0]);
        setSelectedRows(result[1]);
    };

    const onTableChangeAll = (selected: boolean, selectedRow: any, changeRows: any) => {
        const result = getSelectedRow(changeRows, selected);
        setSelectedRowKeys(result[0]);
        setSelectedRows(result[1]);
    };

    const rowSelection = () => {
        if (!hasAuth(authData.reviewFault) || !hasAuth(authData.deleteFault)) {
            return {
                selectedRowKeys,
                onSelect: onTableChange,
                onSelectAll: onTableChangeAll,
            };
        }
        return null;
    };

    const sleep = (time: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, time);
        });
    };
    const tableRequest = async (params, option) => {
        // 进页面时会给表单赋值，这里延迟一下，防止获取不到参数
        await sleep(100);
        return getList(params, option);
    };

    const skip2Init = async (flagId) => {
        const params = { relatedReportFlagId: flagId, current: 1, pageSize: 20 };
        const res = await getPageList(params);
        if (res.code === 200 && res.data.length > 0) {
            const [record] = res.data;
            editClick(record);
        }
    };

    useEffect(() => {
        const params = getUrlSearchParams();
        if (params.flagId) {
            skip2Init(params.flagId);
        }
        return () => {
            setVisible(false);
            setImportVisible(false);
            setExamineVisible(false);
            setContactVisible(false);
            setExportVisible(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return null;
    }

    return (
        <div className="network-fault-file">
            <div className="network-fault-file-header">
                <HeaderForm
                    form={form}
                    formOptions={{ provinceList, cityList, enums }}
                    onValuesChange={onValuesChange}
                    onFinish={onFinish}
                    onReset={onReset}
                    formExpand={formExpand}
                    onExpandClick={() => setFormExpand(!formExpand)}
                />
            </div>
            <div className="network-fault-file-body" style={{ height: formExpand ? 'calc(100% - 74px)' : 'calc(100% - 339px)' }}>
                <VirtualTable
                    global={window}
                    actionRef={tableRef}
                    formRef={formRef}
                    request={tableRequest}
                    columns={columns}
                    form={{
                        onValuesChange,
                    }}
                    rowKey="id"
                    rowSelection={rowSelection()}
                    tableAlertRender={false}
                    search={false}
                    columnsState={columnsState}
                    toolBarRender={() => [
                        <Button
                            key="examine"
                            style={{ display: !hasAuth(authData.reviewFault) ? 'block' : 'none' }}
                            disabled={selectedRowKeys.length === 0 || buttonDisabled}
                            onClick={() => {
                                setExamineVisible(true);
                            }}
                        >
                            批量审核
                        </Button>,
                        <Button
                            key="add"
                            disabled={hasAuth(authData.addFault) || buttonDisabled}
                            type="primary"
                            onClick={() => {
                                setEditType('new');
                                setInitialValues({
                                    haveMalfunction: 1,
                                    area: 'china',
                                    hasRestored: 1,
                                    eventTime: moment(),
                                    clearTime: null,
                                    faultDurationMinutes: undefined,
                                    businessEffectedDurationMinutes: undefined,
                                    eventDate: moment(),
                                    creator: userId,
                                    reportProvince: zoneLevelFlags.isCityZone ? Number(currentZone?.zoneId) : userZoneInfo?.zoneId,
                                    note: '',
                                    dataSource: 1, // 页面录入
                                });
                                setVisible(true);
                            }}
                        >
                            新建
                        </Button>,
                        <Button
                            key="import"
                            disabled={hasAuth(authData.importFault) || buttonDisabled}
                            onClick={() => {
                                setImportVisible(true);
                            }}
                        >
                            批量导入
                        </Button>,
                        <Button
                            key="export"
                            disabled={hasAuth(authData.exportFault)}
                            onClick={() => {
                                getExportProgress();
                                setExportVisible(true);
                            }}
                        >
                            导出
                        </Button>,
                        <Button
                            key="export"
                            style={{ display: hasAuth(authData.deleteFault) ? 'none' : 'block' }}
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => {
                                deleteAllClick();
                            }}
                        >
                            批量删除
                        </Button>,
                        <Button
                            key="icon"
                            icon={<Icon antdIcon type="TeamOutlined" />}
                            type="text"
                            color="default"
                            onClick={() => {
                                setContactVisible(true);
                            }}
                        />,
                    ]}
                />
            </div>

            <FaultModal
                width={1050}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
                destroyOnClose
                maskClosable={false}
                onOk={() => {
                    setVisible(false);
                    tableRef.current?.reload();
                }}
                mode={editType}
                customProps={{
                    isGroupLeader: userZoneInfo.zoneLevel === '1',
                    hasReviewAuth: !hasAuth(authData.reviewFault),
                }}
                contentProps={{
                    initialValues,
                    enums,
                    provinceList,
                    siteList,
                    onSwitchToEdit: (draftData: any, sheetNo: string) => {
                        // 关闭当前新增弹窗
                        setVisible(false);
                        
                        // 设置编辑模式
                        setEditType('edit');
                        
                        // 使用专门的编辑页面数据适配函数
                        const editInitialValues = formatEditData(draftData);
                        
                        // 确保工单编号也被设置
                        editInitialValues.associatedSheetNo = sheetNo;
                        
                        // 设置编辑的初始值
                        setInitialValues(editInitialValues);
                        
                        // 延迟打开编辑弹窗，确保状态更新完成
                        setTimeout(() => {
                            setVisible(true);
                        }, 100);
                    },
                }}
            />
            <ImportModal
                width={700}
                maskClosable={false}
                visible={importVisible}
                onCancel={() => {
                    tableRef.current?.reload();
                    setImportVisible(false);
                }}
                // @ts-ignore
                mode={editType}
                contentProps={{}}
                destroyOnClose
            />
            <ExamineModal
                width={700}
                maskClosable={false}
                visible={examineVisible}
                onCancel={() => {
                    tableRef.current?.reload();
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                    setExamineVisible(false);
                }}
                selectedRows={selectedRows}
            />
            <ContactModal
                width={700}
                maskClosable={false}
                visible={contactVisible}
                onCancel={() => {
                    setContactVisible(false);
                }}
            />
            <AsyncExportModal
                visible={exportVisible}
                onExport={onExport}
                exportList={asyncExportList}
                onDownLoad={onDownLoad}
                onClose={() => {
                    setExportVisible(false);
                }}
                onDelete={onAsyncDelete}
                total={totalCountRef.current}
            />
        </div>
    );
};

export default NetworkFaultFile;
