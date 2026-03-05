import React, { useEffect, useState } from 'react';
import { DatePicker, Icon, Button, Tooltip, Modal, Select } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import Detail from '../result/content';
import { getOpticalPowerList, getZones, getCityUserBelongProvince } from '../api';

import './index.less';

function TextShow({ text }) {
    return (
        <Tooltip title={text}>
            <div className="max-show-two-rows">{text}</div>
        </Tooltip>
    );
}

export default function Index({ visible, setVisible }) {
    const { userId, currentZone, zoneLevelFlags } = useLoginInfoModel();
    const [loading, setLoading] = useState(true);
    const [isShowDetail, setIsShowDetail] = useState(false);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [detailParams, setDetailParams] = useState(null);
    const formRef = useState(null);
    const paginationRef = useState({ current: 1, pageSize: 15 });
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 80,
            align: 'center',
            hideInSearch: true,
            render(text, record, index) {
                return ((paginationRef.current?.current || 1) - 1) * (paginationRef.current?.pageSize || 15) + (index + 1);
            },
        },
        {
            title: '省份名称',
            dataIndex: 'provinceId',
            width: 90,
            align: 'center',
            order: 6,
            initialValue: '-1',
            renderFormItem: () => {
                // console.log('fieldProps', fieldProps, form.getFieldsValue());
                return <Select options={provinceOptions} />;
            },
            render(text, record) {
                return <TextShow text={record.provinceName} />;
            },
        },
        {
            title: '地市名称',
            dataIndex: 'regionId',
            width: 90,
            align: 'center',
            order: 5,
            initialValue: '-1',
            renderFormItem: () => {
                return <Select options={cityOptions} />;
            },
            render(text, record) {
                return <TextShow text={record.regionName} />;
            },
        },
        {
            title: '所属传输系统',
            dataIndex: 'transSystemName',
            valueType: 'text',
            width: 250,
            align: 'center',
            hideInSearch: false,
            order: 3,
            render(text) {
                return <TextShow text={text} />;
            },
        },
        {
            title: '网元名称',
            dataIndex: 'eqpLabel',
            valueType: 'text',
            width: 250,
            align: 'center',
            hideInSearch: false,
            order: 2,
            render(text) {
                return <TextShow text={text} />;
            },
        },
        {
            title: '定位信息描述',
            dataIndex: 'locateInfo',
            valueType: 'text',
            width: 350,
            align: 'center',
            hideInSearch: false,
            order: 1,
            render(text) {
                return <TextShow text={text} />;
            },
        },
        {
            title: '任务下发状态',
            dataIndex: 'taskStatus',
            width: 90,
            align: 'center',
            order: 4,
            initialValue: '-1',
            renderFormItem: () => {
                return (
                    <Select
                        options={[
                            { label: '全部', value: '-1' },
                            { label: '成功', value: 1 },
                            { label: '失败', value: 0 },
                        ]}
                    />
                );
            },
            render(text, record) {
                const textShow = text === 1 ? '成功' : '失败';
                if (text === 0) {
                    return (
                        <Tooltip title={record.taskFailureReason} overlayStyle={{ maxWidth: '270px' }}>
                            <div className="max-show-two-rows">{textShow}</div>
                        </Tooltip>
                    );
                }
                return <TextShow text={textShow} />;
            },
        },
        {
            title: '查询时间',
            dataIndex: 'searchTime',
            width: 180,
            align: 'center',
            hideInSearch: false,
            hideInTable: true,
            initialValue: [moment().startOf('day'), moment().endOf('day')],
            order: 7,
            renderFormItem: () => {
                return <DatePicker.RangePicker placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD HH:mm:ss" showTime />;
            },
        },
        {
            title: '查询时间',
            dataIndex: 'insertTime',
            width: 140,
            align: 'center',
            hideInSearch: true,
            hideInTable: false,
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: 60,
            align: 'center',
            hideInSearch: true,
            fixed: 'right',
            render(text, record) {
                return (
                    <Button
                        disabled={record.taskStatus === 0}
                        type="text"
                        style={{ padding: 0 }}
                        onClick={() => {
                            setDetailParams({ taskId: record.taskId, resourceId: record.idn });
                            setIsShowDetail(true);
                        }}
                    >
                        <Icon antdIcon type="SearchOutlined" />
                    </Button>
                );
            },
        },
    ];

    function getCityOptions(zoneId) {
        getZones({ zone_level: 3, parent_zone_id: zoneId }).then((res) => {
            // eslint-disable-next-line no-underscore-dangle
            const arr = res?._embedded?.zoneResourceList;
            if (Array.isArray(arr)) {
                setCityOptions([
                    { label: '全部', value: '-1' },
                    ...arr.reduce((accu, item) => {
                        if (item.zoneName === '省本部') {
                            return accu;
                        }
                        return [...accu, { label: item.zoneName, value: item.zoneId }];
                    }, []),
                ]);
            }
        });
    }

    useEffect(() => {
        if (visible) {
            if (zoneLevelFlags.isCountryOrRegionZone) {
                Promise.all([
                    getZones({ zone_level: 2, parent_zone_id: currentZone.zoneId }),
                    getZones({ zone_level: 3, parent_zone_id: currentZone.zoneId }),
                ]).then((res) => {
                    const [res1, res2] = res;
                    // eslint-disable-next-line no-underscore-dangle
                    const arr1 = res1?._embedded?.zoneResourceList;
                    // eslint-disable-next-line no-underscore-dangle
                    const arr2 = res2?._embedded?.zoneResourceList;
                    if (Array.isArray(arr1)) {
                        setProvinceOptions([{ label: '全部', value: '-1' }, ...arr1.map((item) => ({ label: item.zoneName, value: item.zoneId }))]);
                    }
                    if (Array.isArray(arr2)) {
                        setCityOptions([
                            { label: '全部', value: '-1' },
                            ...arr2.reduce((accu, item) => {
                                if (item.zoneName === '省本部') {
                                    return accu;
                                }
                                return [...accu, { label: item.zoneName, value: item.zoneId }];
                            }, []),
                        ]);
                    }
                    setLoading(false);
                });
            } else {
                Promise.all([getZones({ zone_level: 2, parent_zone_id: '0' }), getZones({ zone_level: 3, parent_zone_id: currentZone.zoneId })]).then(
                    (res) => {
                        const [res1, res2] = res;
                        // eslint-disable-next-line no-underscore-dangle
                        const arr1 = res1?._embedded?.zoneResourceList;
                        // eslint-disable-next-line no-underscore-dangle
                        const arr2 = res2?._embedded?.zoneResourceList;

                        if (Array.isArray(arr1)) {
                            const belongProvince = arr1.find((item) => item.zoneId.toString() === currentZone.zoneId.toString());
                            setProvinceOptions([
                                { label: '全部', value: '-1' },
                                { label: belongProvince?.zoneName, value: belongProvince?.zoneId?.toString() },
                            ]);
                        }
                        if (Array.isArray(arr2)) {
                            setCityOptions([
                                { label: '全部', value: '-1' },
                                ...arr2.reduce((accu, item) => {
                                    if (item.zoneName === '省本部') {
                                        return accu;
                                    }
                                    return [...accu, { label: item.zoneName, value: item.zoneId }];
                                }, []),
                            ]);
                        }

                        setLoading(false);
                    },
                );
            }
        } else {
            setLoading(true);
        }
    }, [visible]);

    async function request(params) {
        const searchFormData = formRef.current.getFieldsValue();

        paginationRef.current = {
            current: params.current,
            pageSize: params.pageSize,
        };
        const data = {
            current: params.current,
            pageSize: params.pageSize,
            provinceId: searchFormData.provinceId === '-1' ? undefined : searchFormData.provinceId,
            regionId: searchFormData.regionId === '-1' ? undefined : searchFormData.regionId,
            eqpLabel: searchFormData.eqpLabel || '',
            locateInfo: searchFormData.locateInfo || '',
            taskStatus: searchFormData.taskStatus === '-1' ? undefined : searchFormData.taskStatus,
            transSystemName: searchFormData.transSystemName || '',
            startTime: moment(searchFormData.searchTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(searchFormData.searchTime[1]).format('YYYY-MM-DD HH:mm:ss'),
            userId,
        };
        const res = await getOpticalPowerList(data);

        return {
            data: res.data,
            success: true,
            total: res.total,
        };
    }

    function onValuesChange(changedValues) {
        if (changedValues.hasOwnProperty('provinceId')) {
            getCityOptions(changedValues.provinceId === '-1' ? currentZone.zoneId : changedValues.provinceId);
            formRef.current?.setFieldsValue({ regionId: '-1' });
        }
    }
    return (
        <Modal
            visible={visible}
            maskClosable={false}
            width={1300}
            bodyStyle={{ padding: '16px 16px 0 16px', height: '600px' }}
            title={
                isShowDetail ? (
                    <div>
                        <span
                            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '20px' }}
                            onClick={() => {
                                setDetailParams(null);
                                setIsShowDetail(false);
                            }}
                        >
                            &lt;&lt;&nbsp;返回
                        </span>
                        查看详情
                    </div>
                ) : (
                    '光功率查询历史记录'
                )
            }
            footer={null}
            onCancel={() => {
                setIsShowDetail(false);
                setDetailParams(null);
                setLoading(true);
                setVisible(false);
            }}
            className="optical-power-search-list-table-wrapper"
        >
            {!loading && (
                <>
                    <div style={{ display: isShowDetail ? 'none' : 'block', height: '100%' }}>
                        <VirtualTable
                            formRef={formRef}
                            onReset={() => {
                                getCityOptions(currentZone.zoneId);
                            }}
                            form={{ span: 6, onValuesChange }}
                            pagination={{ pageSizeOptions: [15, 50, 100], defaultPageSize: 15 }}
                            size="small"
                            columns={columns}
                            global={window}
                            toolBarRender={false}
                            request={request}
                            search={{
                                defaultCollapsed: false,
                                className: 'optical-power-search-list-table-search-form',
                                collapseRender: false,
                            }}
                            searchCollapsed={false}
                        />
                    </div>
                    {isShowDetail && <Detail source="list" params={detailParams} />}
                </>
            )}
        </Modal>
    );
}
