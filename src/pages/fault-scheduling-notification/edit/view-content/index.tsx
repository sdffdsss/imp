import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Input, Select } from 'oss-ui';
import moment from 'moment';
import DatePickTime from '@Src/components/date-range-time';
import useLoginInfoModel from '@Src/hox';
import { Api } from '../../api';
import NotifyFailPersonListModal from './notify-fail-person-list';
import ImageLeft1 from './img/组合 233.png';
import ImageLeft2 from './img/组合 234.png';
import ImageLeft3 from './img/组合 235.png';
import ImageRight1 from './img/组合 106-1.png';
import ImageRight2 from './img/组合 236.png';
import ImageRight3 from './img/组合 106.png';
import './index.less';

const ViewContent = (props) => {
    const urlNoticeId = localStorage.getItem('noticeId');

    const [provinceList, setProvinceList] = useState<any>([]);
    const [citiesList, setCitiesList] = useState<any>([]);
    const [faultRecordList, setFaultRecordList] = useState<any>([]);

    const formRef = useRef<any>(null);
    const actionRef = useRef<any>(null);

    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);

    const [recordData, setRecordData] = useState<any>({
        successCount: 0,
        failCount: 0,
        recordCount: 0,
        sheetCount: 0,
    });

    const failReasonSelectArrayRef = useRef();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const { noticeId } = props;

    const warningLevelOption = [
        {
            label: '发生',
            value: 21,
        },
        {
            label: '一级',
            value: 1,
        },
        {
            label: '二级',
            value: 2,
        },
        {
            label: '三级',
            value: 3,
        },
        {
            label: '四级',
            value: 4,
        },
        {
            label: '五级',
            value: 5,
        },
        {
            label: '周期',
            value: 22,
        },
    ];

    const levelEnum = {
        21: '发生',
        22: '周期',
        23: '恢复',
        1: '一级',
        2: '二级',
        3: '三级',
        4: '四级',
        5: '五级',
    };

    const warningLevelEnum = {
        1: '一级',
        2: '二级',
        3: '三级',
        4: '四级',
        5: '五级',
    };

    useEffect(() => {
        // formRef?.current?.setFieldsValue({ time: [moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'), moment().format('YYYY-MM-DD HH:mm')] });
        getProvinceData();
        getFaultDictionaryData('fault_record_msg_status');
    }, []);

    const getProvinceData = async () => {
        const { userId, systemInfo } = useLoginInfoModel.data;
        const res = await Api.getProvinceData(userId);

        let provinceList = res || [];
        provinceList = provinceList.filter((item) => (systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true));
        setProvinceList(provinceList.map((item) => ({ label: item.regionName, value: item.regionId })) || []);
    };

    const provinceChange = async (value) => {
        formRef?.current?.setFieldsValue({ provinceId: value });
        const { userId } = useLoginInfoModel.data;
        const res = await Api.getProvinceRegions(value, userId);
        console.log(res);
        setCitiesList(res.map((item) => ({ label: item.regionName, value: item.regionId })));
    };

    const getFaultDictionaryData = async (dictName) => {
        const res = (await Api.getFaultDictionary(dictName)) || [];
        const data = res.data.map((item) => ({ label: item.dName, value: item.dCode }));
        switch (dictName) {
            case 'fault_record_msg_status':
                setFaultRecordList(data);
        }
    };

    const viewFailPersonList = (list) => {
        failReasonSelectArrayRef.current = list;
        setModalVisible(true);
    };

    const columns = useMemo(() => {
        return [
            {
                title: '序号',
                dataIndex: 'num',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                width: 40,
                render: (text, record, index) => index + 1 + (pageNum - 1) * pageSize,
            },

            {
                title: '通知时间',
                dataIndex: 'noticeTime',
                align: 'center',
                width: 120,
                hideInSearch: true,
            },
            {
                title: '通知方式',
                dataIndex: 'msgType',
                align: 'center',
                valueEnum: {
                    0: {
                        text: '全部',
                    },
                    1: {
                        text: 'IVR外呼',
                    },
                    2: {
                        text: 'chatops入群',
                    },
                    3: {
                        text: '短信通知',
                    },
                },
                initialValue: '0',
                order: -1,
                // renderFormItem: () => {
                //     return <Select options={[{ label: '全部', value: '0' }, { label: 'IVR外呼', value: '1' }, { label: 'chatops入群', value: '2' }, { label: '短信通知', value: '3' }]} />;
                // },
                render(text, record) {
                    return record.msgTypeName;
                },
            },
            {
                title: '通知状态',
                dataIndex: 'msgStatusName',
                align: 'center',
                width: 120,
                hideInSearch: true,
            },

            {
                title: '省份',
                dataIndex: 'provinceName',
                align: 'center',
                width: 60,

                hideInSearch: true,
            },

            {
                title: '地市',
                dataIndex: 'cityName',
                align: 'center',
                hideInSearch: true,

                width: 60,
            },
            {
                title: '工单编号',
                dataIndex: 'sheetNo',
                align: 'center',
                hideInSearch: true,
                width: 120,
            },
            {
                title: '工单标题',
                dataIndex: 'sheetTitle',
                align: 'center',
                hideInSearch: true,
                width: 120,
            },
            {
                title: '通知成功对象',
                dataIndex: 'noticeStatus',
                align: 'center',
                hideInSearch: true,
                width: 120,
                render: (text, record) => {
                    return record?.noticeStatus === 1 ? (record.noticePerson ? record.noticePerson : '-') : '-';
                },
            },
            {
                title: '通知失败对象',
                dataIndex: 'failPhones',
                align: 'center',
                hideInSearch: true,
                width: 120,
                render: (text, record) => {
                    if (text) {
                        return (
                            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => viewFailPersonList(record.failReasonSelectArray)}>
                                {text}
                            </span>
                        );
                    }
                    return '-';
                },
            },
            {
                title: '预警状态',
                dataIndex: 'labelValue',
                align: 'center',
                hideInSearch: true,
                width: 80,
                render: (text, record) => {
                    return (
                        <>
                            <span style={{ color: '#1890ff', textDecoration: 'underline' }}>{levelEnum[record?.labelValue]}</span>
                            <span>
                                {record?.earlyWarningLevelAll
                                    ? record?.earlyWarningLevelAll !== 0
                                        ? '/' + warningLevelEnum[record?.earlyWarningLevelAll]
                                        : ''
                                    : ''}
                            </span>
                        </>
                    );
                },
            },
            {
                title: '时间段',
                dataIndex: 'time',
                align: 'center',
                hideInTable: true,
                initialValue: [moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'), moment().format('YYYY-MM-DD HH:mm')],
                renderFormItem: () => {
                    return (
                        <DatePickTime
                            allowClear={false}
                            placeholder={['开始时间', '结束时间']}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                        />
                    );
                },
            },

            {
                title: '省份',
                dataIndex: 'provinceId',
                align: 'center',
                hideInTable: true,
                initialValue: '',
                renderFormItem: () => {
                    return <Select options={[{ label: '全部', value: '' }, ...provinceList]} optionFilterProp="label" onChange={provinceChange} />;
                },
            },
            {
                title: '地市',
                dataIndex: 'cityId',
                align: 'center',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select placeholder="" mode="multiple" maxTagCount={2} options={citiesList} optionFilterProp="label" showSearch allowClear />
                    );
                },
            },
            {
                title: '预警状态',
                dataIndex: 'earlyWarningLevel',
                align: 'center',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select placeholder="全部" mode="multiple" maxTagCount={2} optionFilterProp="label" options={warningLevelOption} allowClear />
                    );
                },
            },
            {
                title: '工单关键字',
                dataIndex: 'workSheet',
                align: 'center',
                hideInTable: true,
                renderFormItem: () => {
                    return <Input />;
                },
            },
            {
                title: '通知状态',
                dataIndex: 'msgStatus',
                align: 'center',
                hideInTable: true,
                renderFormItem: () => {
                    return (
                        <Select placeholder="全部" mode="multiple" maxTagCount={2} optionFilterProp="label" options={faultRecordList} allowClear />
                    );
                },
            },
            {
                title: '通知号码',
                dataIndex: 'noticeTelephone',
                align: 'center',
                hideInTable: true,
            },
        ];
    }, [provinceList, citiesList, warningLevelOption, pageNum, faultRecordList]);

    const getRecord = async (params) => {
        const { current, pageSize } = params;
        setPageNum(current);
        setPageSize(pageSize);
        const values = formRef.current?.getFieldsValue();
        const {
            time = [],
            provinceId,
            cityId = [],
            earlyWarningLevel = [],
            workSheet,
            msgStatus = [],
            noticeTelephone = '',
            notificationWays,
            msgType,
        } = values || {};

        const res = await Api.getNoticeRecord({
            pageNum: current,
            pageSize,
            beginTime: moment(time[0]).format('YYYY-MM-DD HH:mm'),
            endTime: moment(time[1]).format('YYYY-MM-DD HH:mm'),
            cityId: cityId.map((item) => Number(item)),
            workSheet,
            earlyWarningLevel,
            provinceId: provinceId ? Number(provinceId) : null,
            noticeId: urlNoticeId ? Number(urlNoticeId) : noticeId,
            msgStatus,
            noticeTelephone,
            notificationWays: notificationWays === '0' ? undefined : Number(notificationWays),
            msgType: msgType === '0' || !msgType ? undefined : [Number(msgType)],
        });

        console.log(res);

        const { datas, successCount, failCount, recordCount, sheetCount } = res.data || [];

        setRecordData({
            successCount,
            failCount,
            recordCount,
            sheetCount,
        });

        return {
            success: true,
            data: datas,
            total: recordCount,
        };
    };

    return (
        <div className="view-content-page">
            <div className="view-content-page-title">
                <div className="view-content-page-title-text">
                    <img src={ImageLeft1} alt="" className="view-content-page-title-text-img" />
                    <div className="title-center">
                        <div className="title-center-top">{recordData.recordCount || 0}</div>
                        <div className="title-center-text">通知次数</div>
                    </div>
                    <img src={ImageRight1} alt="" className="view-content-page-title-text-img2" />
                </div>
                <div className="view-content-page-title-text">
                    <img src={ImageLeft2} alt="" className="view-content-page-title-text-img" />
                    <div className="title-center">
                        <div className="title-center-top">{recordData.sheetCount || 0}</div>
                        <div className="title-center-text">故障工单数</div>
                    </div>
                    <img src={ImageRight2} alt="" className="view-content-page-title-text-img2" />
                </div>
                <div className="view-content-page-title-text">
                    <img src={ImageLeft3} alt="" className="view-content-page-title-text-img" />
                    <div className="title-center">
                        <div className="title-center-top">
                            {recordData.successCount || 0}/{recordData.failCount || 0}
                        </div>
                        <div className="title-center-text">通知成功/失败次数</div>
                    </div>
                    <img src={ImageRight3} alt="" className="view-content-page-title-text-img2" />
                </div>
            </div>
            <div style={{ height: 5, background: 'rgb(240, 242, 245)' }} />
            <div className="view-content-page-table">
                <VirtualTable
                    global={window}
                    tableAlertRender={false}
                    columns={columns}
                    actionRef={actionRef}
                    formRef={formRef}
                    request={getRecord}
                    search={{
                        span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 4, xxl: 4 },
                        labelWidth: 70,
                        // collapseRender: false,
                    }}
                    toolBarRender={false}
                />
            </div>
            <NotifyFailPersonListModal
                width={800}
                visible={modalVisible}
                destroyOnClose
                contentProps={{ data: failReasonSelectArrayRef.current }}
                onOk={() => {
                    setModalVisible(false);
                }}
                onCancel={() => {
                    setModalVisible(false);
                }}
            />
        </div>
    );
};

export default ViewContent;
