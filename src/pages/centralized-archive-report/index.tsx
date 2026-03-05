import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import { Button, Form, Spin } from 'oss-ui';
import { usePersistFn } from 'ahooks';
import { blobDownLoad } from '@Common/utils/download';
import moment from 'moment';
import { useColumnsState } from '@Src/hooks';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import { getPageList, getAllZones, getEnumApi, exportApi, getRegionListApi } from './api';
import { getExistColumns } from './columns';
import { authData } from './auth';
import HeaderForm from './header-form';
import './index.less';

const NetworkFaultFile: FC = () => {
    const formRef = useRef<any>();
    const tableRef = useRef<any>();
    const { currentZone, zoneLevelFlags, userId, parsedUserInfo, userZoneInfo } = useLoginInfoModel();
    const [enums, setEnums] = useState<any>({});
    const [provinceList, setProvinceList] = useState<any>([]);
    const [cityList, setCityList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formExpand, setFormExpand] = useState(true);
    const columnsState = useColumnsState({ configType: 32 });
    const allZonesRef = useRef([]);
    const totalCountRef = useRef(0);
    const requestParamsRef = useRef(null);
    const [form] = Form.useForm();
    const [columns, setColumns] = useState([]);
    const [isFirst, setIsFirst] = useState(true);
    const [isQuerying, setIsQuerying] = useState(false);
    const [dateInfo, setDateInfo] = useState({
        statisticalTime: '',
        reportTimeBegin: '',
        reportTimeEnd: '',
        eventTimeBegin: '',
        eventTimeEnd: '',
    });

    const rootNetworkLayerOptions = useMemo(() => {
        const networkLayerRelation = {};
        if (enums.networkLayer && enums.rootCauseProfession) {
            // 动力环境，两核两关机房、本地网（含城域网/接入网）及联通云池
            networkLayerRelation['1'] = ['4', '6'];
            // 光缆线路,全国骨干网/一干、省网/二干、本地网（含城域网/接入网）及联通云池
            networkLayerRelation['2'] = ['2', '5', '6'];
            // 承载网-传输（设备），全国骨干网/一干、省网/二干、本地网（含城域网/接入网）及联通云池
            networkLayerRelation['3'] = ['2', '5', '6'];
            // 承载网-IP网，全国骨干网/一干、本地网（含城域网/接入网）及联通云池
            networkLayerRelation['4'] = ['2', '6'];
            // 核心网，集约化大区（含自管节点）、省网/二干
            networkLayerRelation['5'] = ['3', '5'];
            // 业务平台，总部直管网络、集约化大区（含自管节点）、省网/二干
            networkLayerRelation['6'] = ['1', '3', '5'];
            // 云资源，总部直管网络、集约化大区（含自管节点）、本地网（含城域网/接入网）及联通云池
            networkLayerRelation['7'] = ['1', '3', '6'];
            // 无线，本地网（含城域网/接入网）及联通云池
            networkLayerRelation['8'] = ['6'];
            // 宽带，本地网（含城域网/接入网）及联通云池
            networkLayerRelation['9'] = ['6'];
            // 国际网络，国际海缆、国际陆缆
            networkLayerRelation['10'] = ['7', '8'];
        }
        Object.keys(networkLayerRelation).forEach((key) => {
            networkLayerRelation[key] = networkLayerRelation[key].map((n) => enums.networkLayer.find((item) => item.key === n)).filter(Boolean);
        });
        return networkLayerRelation;
    }, [enums]);

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
        ]);
        return temp1?.data || {};
    });

    const getAllZonesFn = usePersistFn(async () => {
        const res = await getAllZones();

        const fullList = res?.['_embedded']?.zoneResourceList;

        return fullList || [];
    });
    const hasAuth = (authKey: string) => {
        const { operationsButton } = parsedUserInfo;
        const findAuth = operationsButton.find((item) => item.key === authKey);
        return !findAuth;
    };

    const fomartParams = (params) => {
        const returnParms = Object.entries(params).reduce(
            (accu, [key, value]) => {
                if (['haveMalfunction', 'isEffectBusiness', 'havePublicSentiment', 'hasRestored', 'causedByHidden'].includes(key)) {
                    let newValue;
                    if (!value || value === '0') {
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

                if (['reportTime'].includes(key) && value) {
                    console.log(value, 'value');
                    Object.assign(accu, {
                        reportTime: undefined,
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
            // 设置上报省份默认值
            let defaultProvinceArr: any = [];
            if (zoneLevelFlags.isCountryZone) {
                defaultProvinceArr = provinceList
                    .filter((item: any) => [1, 2].includes(item.zoneLevel))
                    ?.map((p: any) => {
                        return p.zoneId;
                    });
            } else {
                defaultProvinceArr = provinceList?.map((p: any) => {
                    return p.zoneId;
                });
            }
            Object.assign(returnParms, { reportProvince: defaultProvinceArr });
        } else {
            Object.assign(returnParms, { reportProvince: params.reportProvince });
        }

        if (currentZone.zoneLevel !== '1' && !returnParms.provinceId) {
            Object.assign(returnParms, { provinceId: currentZone.zoneId });
        }
        return returnParms;
    };
    const getNetWorkIdByName = (name: any) => {
        const net = enums?.networkLayer?.find((item: any) => item.value === name);
        return net?.key || '';
    };
    const convertData = (res: any) => {
        const result: any = [];
        res.forEach((item: any) => {
            const newItem: any = {
                provinceName: item?.provinceName,
                total: item?.total || '-',
                jiYueHuatotal: item?.jiYueHuatotal,
                shengNeitotal: item?.shengNeitotal,
            };
            item?.professions?.forEach((profession: any) => {
                profession?.networkLayers?.forEach((network: any) => {
                    const networkId = getNetWorkIdByName(network.name);
                    if (networkId) {
                        newItem[`col${profession.professionId}${networkId}`] = network.value;
                    }
                });
            });
            result.push(newItem);
        });
        return result;
    };

    const initExistCols = (key: any, val: any, first: boolean) => {
        const isReviewer = !hasAuth(authData.reviewFault);
        const isGroupLeader = userZoneInfo.zoneLevel === '1';
        let existCols = [];
        // 集团用户
        if (isReviewer && isGroupLeader && first) {
            existCols = getExistColumns(key, val, enums, rootNetworkLayerOptions);
        } else {
            existCols = getExistColumns(key, val, enums, null);
        }
        setColumns(existCols);
    };

    const getDefaultTime = () => {
        const curDay = moment().date();
        let startDate: any = '';
        let endDate: any = '';
        if (curDay < 10) {
            startDate = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD 00:00:00');
            endDate = moment().subtract(2, 'month').endOf('month').format('YYYY-MM-DD 23:59:59');
        } else {
            startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD 00:00:00');
            endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD 23:59:59');
        }
        let reportStart: any = '';
        let reportEnd: any = '';
        if (curDay < 10) {
            reportStart = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD 00:00:00');
            reportEnd = moment().subtract(1, 'month').format('YYYY-MM-09 23:59:59');
        } else {
            reportStart = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD 00:00:00');
            reportEnd = moment().format('YYYY-MM-09 23:59:59');
        }

        return {
            eventTimeBegin: startDate,
            eventTimeEnd: endDate,
            reportTimeBegin: reportStart,
            reportTimeEnd: reportEnd,
        };
    };

    const getList = async (params, option) => {
        let defaultTime: any = '';
        const isReviewer = !hasAuth(authData.reviewFault);
        const isGroupLeader = userZoneInfo.zoneLevel === '1';
        if (isFirst) {
            defaultTime = getDefaultTime();
        }
        const formParams = form?.getFieldsValue();
        if (enums?.rootCauseProfession && enums?.networkLayer && rootNetworkLayerOptions) {
            initExistCols(formParams?.rootCauseProfession || [], formParams.networkLayer || [], isFirst);
        }
        setIsQuerying(true);
        if (_.has(option, 'dataStateCn')) {
            Object.assign(params, { orderType: option.dataStateCn, orderFieldName: 'dataState' });
        }

        const formatFormParams = fomartParams(formParams);
        let newParams = { ...formatFormParams, ...params };
        if (defaultTime) {
            newParams = {
                ...newParams,
                reportTimeBegin: defaultTime?.reportTimeBegin || '',
                reportTimeEnd: defaultTime?.reportTimeEnd || '',
                eventTimeBegin: defaultTime?.eventTimeBegin || '',
                eventTimeEnd: defaultTime?.eventTimeEnd || '',
            };
        }
        newParams.searchDefault = isFirst;
        newParams.whetherJT = isFirst && isReviewer && isGroupLeader;
        requestParamsRef.current = newParams;
        const res = await getPageList(newParams);
        setIsQuerying(false);
        const newRes = convertData(res?.data?.provinceList || []);
        setDateInfo({
            statisticalTime: res?.data?.statisticalTime || '',
            reportTimeBegin: res?.data?.reportTimeBegin || '',
            reportTimeEnd: res?.data?.reportTimeEnd || '',
            eventTimeBegin: res?.data?.eventTimeBegin || '',
            eventTimeEnd: res?.data?.eventTimeEnd || '',
        });
        totalCountRef.current = res.total;
        setIsFirst(false);
        return {
            data: newRes,
            success: res.code === 200,
            total: res.total,
        };
    };

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
                    parentRegionId: changedValues.provinceId || currentZone?.zoneId,
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
        const res = await exportApi(requestParamsRef?.current);
        if (res) {
            blobDownLoad(res, `集中存档统计报表导出${moment().format('YYYYMMDDHHmmss')}.xlsx`);
        }
    }

    useEffect(() => {
        Promise.all([getAllZonesFn(), getEnumsFn()]).then((res) => {
            const [res1, res2] = res;

            const temp1 = res1.filter((item) => item.zoneName !== '省本部');
            allZonesRef.current = temp1;

            if (zoneLevelFlags.isCountryZone) {
                setProvinceList(temp1.filter((item: any) => [1, 2, 5].includes(item.zoneLevel)));
            } else if (zoneLevelFlags.isRegionZone) {
                setProvinceList(temp1.filter((item: any) => item.zoneId === Number(currentZone.zoneId)));
            } else if (zoneLevelFlags.isProvinceZone) {
                setProvinceList(temp1.filter((item: any) => item.zoneId === Number(currentZone.zoneId)));
            } else if (zoneLevelFlags.isCityZone) {
                setProvinceList(temp1.filter((item: any) => item.parentZoneId === Number(currentZone.zoneId)));
            }

            setEnums(res2);

            setLoading(false);
        });
        getProvinceUnderCitys();
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

    const sleep = (time: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, time);
        });
    };
    const tableRequest = async (params, option) => {
        // 进页面时会给表单赋值，这里延迟一下，防止获取不到参数
        await sleep(500);
        return getList(params, option);
    };

    if (loading) {
        return null;
    }
    let xWidth = 0;
    columns?.forEach((c) => {
        if (c.width) {
            xWidth += c.width;
        } else if (c.children?.length > 0) {
            xWidth += c.children.reduce((total, item) => {
                return total + (item.width || 120);
            }, 0);
        }
    });
    return (
        <div className="centralized-archive-report">
            <div className="centralized-archive-report-header">
                <HeaderForm
                    form={form}
                    formOptions={{ provinceList, cityList, enums }}
                    onValuesChange={onValuesChange}
                    onFinish={onFinish}
                    onReset={onReset}
                    formExpand={formExpand}
                    onExpandClick={() => setFormExpand(!formExpand)}
                    isLoading={isQuerying}
                    rootNetworkLayerOptions={rootNetworkLayerOptions}
                />
            </div>
            <div className="centralized-archive-report-body" style={{ height: formExpand ? 'calc(100% - 74px)' : 'calc(100% - 354px)' }}>
                <Spin wrapperClassName="spin-container" spinning={isQuerying} tip="数据正在努力统计中，请稍等......">
                    <VirtualTable
                        headerTitle={
                            <div className="table-header-title">
                                <span>{`统计时间：${dateInfo?.statisticalTime}`}</span>
                                <span className="sec-span">
                                    {`统计范围：故障发生时间为 ${dateInfo?.eventTimeBegin} 至 
                                ${dateInfo?.eventTimeEnd}，上报时间为：${dateInfo?.reportTimeBegin} 至 ${dateInfo?.reportTimeEnd}`}
                                </span>
                            </div>
                        }
                        global={window}
                        actionRef={tableRef}
                        formRef={formRef}
                        request={tableRequest}
                        columns={columns}
                        form={{
                            onValuesChange,
                        }}
                        rowKey="id"
                        tableAlertRender={false}
                        search={false}
                        columnsState={columnsState}
                        toolBarRender={() => [
                            <Button
                                key="export"
                                disabled={hasAuth(authData.exportFault)}
                                onClick={() => {
                                    onDownLoad();
                                }}
                            >
                                导出
                            </Button>,
                        ]}
                        pagination={false}
                        loading={false}
                        size="small"
                        options={{ density: false }}
                        scroll={{
                            x: xWidth + 100,
                        }}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default NetworkFaultFile;
