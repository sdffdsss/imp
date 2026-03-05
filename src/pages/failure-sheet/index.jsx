import React from 'react';
import {
    Icon,
    Input,
    DatePicker,
    Form,
    Radio,
    Row,
    Col,
    Checkbox,
    Button,
    Space,
    Menu,
    Dropdown,
    getSheetStatusInfo,
    message,
    Tooltip,
} from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import request from '@Common/api';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import moment from 'moment';
import AlarmQuery from '@Src/pages/search/alarm-query';
import AlarmExportButton from '@Src/components/alarm-export';
import DateRangeTime from '@Components/date-range-time';
import { logNew } from '@Common/api/service/log';
import urlSearch from '@Common/utils/urlSearch';
import { createFileFlow } from '@Common/utils/download';
import zoneLevelEnum from '@Common/enum/zoneLevel';
import { sendLogFn } from '@Pages/components/auth/utils';
import { _ } from 'oss-web-toolkits';
import api from './api';
import AsyncExportModal from './async-export-modal';
import './style.less';

// 数据库加载基础数据，数据库加载后，不再处理变更
const storeBySQL = {
    provinceList: [],
    regionList: [],
    sheetStatus: [],
    professional: [],
};

// 当前查询使用参数
const curSelParm = {
    professionalType: '',
    // sheetStatusId: '',
    provinceId: '',
    sheet_type: '1',
    regionId: '',
    dateTime: '',
    keyWord: '',
    startTime: '',
    endTime: '',
    zoneLevel: '1',
};
const plainOptions = [
    // {
    //     value: 'all',
    //     label: '全部',
    // },
    {
        value: '1',
        label: '故障工单',
    },
    {
        value: '6',
        label: '高铁工单',
    },
    {
        value: '7',
        label: '督办工单',
    },
];
const alarmOptions = [
    {
        value: 'all',
        label: '全部',
    },
    {
        value: '0',
        label: '已清除',
    },
    {
        value: '1',
        label: '未清除',
    },
];
// 工单状态默认数据
let sheetStatusList = [];

// 省份原始数据
let provinceListOriginal = [];

const { RangePicker } = DatePicker;

let count = 0;
class Index extends React.PureComponent {
    formRef = React.createRef();
    asyncExportTimer = null;
    fileSrc = '';
    sheetTypeMap = {
        故障工单: 'sheet_no',
        督办工单: 'supv_sheet_no',
        高铁工单: 'subway_sheet_no',
    };

    constructor(props) {
        super(props);
        this.state = {
            publishColumns: [],
            dataSource: [],
            loading: false,
            scrollY: window.innerHeight - 300,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            operId: '',
            sheet_no: '', // 右键放置工单值
            showAlarmQuery: true, // 是否展示告警流水窗
            condition: { sheet_no: { operator: 'eq', value: '' } },
            // 选择下拉状态 //0-无收起，1-折叠状态，2-展开状态
            downState: {
                provinceState: 0,
                regionState: 0,
                professionalState: 0,
            },
            tableFlag: false, // 是否展示告警流水窗弹窗
            isDataBlank: false, // 是否展示无数据提示文字
            asyncExportModalVisible: false,
            asyncExportList: [],
            exportBtnFlag: false,
            menu: (
                <Menu>
                    <Menu.Item
                        key="1"
                        onClick={() => {
                            this.clickSheetDetails();
                        }}
                    >
                        查看工单详情
                    </Menu.Item>
                </Menu>
            ),
        };
    }

    componentDidMount() {
        const { srcString } = useLoginInfoModel.data;
        const urlData = urlSearch(srcString);
        if (urlData.operId) {
            this.setState({
                operId: urlData.operId,
            });
        }
        this.intData();
    }
    async intData() {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const zoneId = systemInfo?.currentZone?.zoneId;
        curSelParm.provinceId = '';
        curSelParm.sheet_type = '1';
        provinceListOriginal = await api.getProvinceData(userId, zoneId);
        storeBySQL.provinceList.push(...provinceListOriginal);
        if (systemInfo?.currentZone?.zoneLevel === '1') {
            storeBySQL.provinceList.unshift({
                creator: null,
                parentRegionId: '0',
                regionId: '1',
                regionLevel: 0,
                regionName: '集团',
                zoneIds: null,
            });
            storeBySQL.provinceList.unshift({
                creator: null,
                parentRegionId: '',
                regionId: 'all',
                regionLevel: 0,
                regionName: '全部',
                zoneIds: null,
            });
        }
        if (systemInfo?.currentZone?.zoneLevel === '5') {
            storeBySQL.provinceList.unshift({
                creator: null,
                parentRegionId: '',
                regionId: 'all',
                regionLevel: 0,
                regionName: '全部',
                zoneIds: null,
            });
        }
        if (storeBySQL.provinceList.length > 0) {
            curSelParm.provinceId = storeBySQL.provinceList[0].regionId;
            curSelParm.regionId = '';
            if (curSelParm.provinceId) {
                if (systemInfo?.currentZone?.zoneLevel === '1' || systemInfo?.currentZone?.zoneLevel === '5') {
                    storeBySQL.regionList = [
                        {
                            creator: null,
                            parentRegionId: '',
                            regionId: 'all',
                            regionLevel: 0,
                            regionName: '全部',
                            zoneIds: null,
                        },
                    ];
                } else {
                    if (systemInfo?.currentZone?.zoneId) {
                        curSelParm.provinceId = systemInfo.currentZone.zoneId;
                    }
                    storeBySQL.regionList = await api.getProvinceRegions(curSelParm.provinceId, userId);
                    storeBySQL.regionList.unshift({
                        creator: null,
                        parentRegionId: '',
                        regionId: 'all',
                        regionLevel: 0,
                        regionName: '全部',
                        zoneIds: null,
                    });
                }
            }
        }
        curSelParm.professionalType = '';
        storeBySQL.professional = await api.getDictEntry('professional_type', userId);
        storeBySQL.professional.unshift({
            dictName: '',
            key: 'all',
            modelId: 2,
            valid: 1,
            value: '全部',
            valueEn: 'Wireless Network',
        });
        curSelParm.sheetStausId = '';
        storeBySQL.sheetStatus = await api.getDictEntry('sheet_status', userId);
        if (storeBySQL.sheetStatus.length > 0) {
            curSelParm.sheetStausId = storeBySQL.sheetStatus[0].key;
        }
        sheetStatusList = storeBySQL.sheetStatus.filter(
            (item) =>
                item.key === '1' ||
                item.key === '2' ||
                item.key === '3' ||
                item.key === '4' ||
                item.key === '5' ||
                item.key === '7' ||
                item.key === '12' ||
                item.key === '13' ||
                item.key === '15' ||
                item.key === '23',
        );
        // sheetStatusList = await api.getSheetStatusInfo(userId);
        sheetStatusList.unshift({
            dictName: '',
            id: 'all',
            key: 'all',
            modelId: 2,
            valid: 1,
            txt: '全部',
            value: '全部',
            valueEn: 'Wireless Network',
        });

        const initProvinceName = [];
        const initRegionName = [];
        const initProfessional = [];
        const initSheetStatus = [];
        storeBySQL.provinceList.forEach((item) => {
            initProvinceName.push(item.regionId);
        });
        storeBySQL.regionList.forEach((item) => {
            initRegionName.push(item.regionId);
        });

        if (systemInfo?.currentZone?.zoneLevel === '1') {
            initProfessional.push('3');
        } else {
            storeBySQL.professional.forEach((item) => {
                initProfessional.push(item.key);
            });
        }

        sheetStatusList.forEach((item) => {
            initSheetStatus.push(item.key);
        });

        curSelParm.startTime = moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss');
        curSelParm.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // if (systemInfo?.currentZone?.zoneId) {
        //     curSelParm.provinceId = systemInfo.currentZone.zoneId;
        // }
        this.formRef.current.setFieldsValue({
            provinceName: initProvinceName,
            regionName: initRegionName,
            professionalName: initProfessional,
            dateTime: [moment().subtract(24, 'hours'), moment()],
            sheet_type: '1',
            alarmState: ['all', '0', '1'],
            sheetStatus: initSheetStatus,
        });

        this.setPublishColumns();
        this.loadData();
    }
    // 专业下拉修改事件
    changeProfessional = (id) => {
        curSelParm.professionalType = id;
        this.setPublishColumns();
    };
    // 省份下拉修改事件
    async changeProvince(val) {
        const {
            login: { systemInfo },
        } = this.props;
        const id = val;
        curSelParm.provinceId = id;
        // if (systemInfo?.currentZone?.zoneLevel === '1' || systemInfo?.currentZone?.zoneLevel === '5') {
        //     const id = val;
        //     curSelParm.provinceId = id;
        // } else {
        //     const id = val;
        //     const {
        //         login: { userId },
        //     } = this.props;
        //     curSelParm.provinceId = id;
        //     storeBySQL.regionList = await api.getProvinceRegions(curSelParm.provinceId.join(','), userId);
        //     storeBySQL.regionList.unshift({
        //         creator: null,
        //         parentRegionId: '',
        //         regionId: 'all',
        //         regionLevel: 0,
        //         regionName: '全部',
        //         zoneIds: null,
        //     });
        //     const initRegionName = [];
        //     storeBySQL.regionList.forEach((item) => {
        //         initRegionName.push(item.regionId);
        //     });
        //     this.formRef.current.setFieldsValue({
        //         regionName: initRegionName,
        //     });
        // }
        this.setPublishColumns();
    }
    // 地市下拉修改事件
    changeRegion = (id) => {
        curSelParm.regionId = id;
        this.setPublishColumns();
    };

    /**
     * @description checkbox 全选 change事件
     * @param {Object} e checkbox change event
     * @param {Object[]} list 源数据列表
     * @param {String} formField form表单字段值
     * @param {String} keyField 源数据key字段
     * @param {Boolean} isRegion 是否是地市
     */
    onCheckAllChange = (e, list, formField, keyField, isRegion) => {
        // 在onChange时修改form表单的值会导致短期多次render，视图更新被禁止，添加延时器以解决该问题
        const {
            login: { systemInfo },
        } = this.props;

        setTimeout(() => {
            const keyList = [];
            if (e.target.checked) {
                list.forEach((item) => {
                    keyList.push(item[keyField]);
                });
                this.formRef.current.setFieldsValue({
                    [formField]: keyList,
                });
                if (formField === 'professionalName' && systemInfo?.currentZone?.zoneLevel === '1') {
                    const wirelessObj = storeBySQL.professional.filter((item) => {
                        return item.key === '8';
                    });
                    if (wirelessObj) {
                        this.formRef.current.setFieldsValue({
                            dateTime: [moment().subtract(24, 'hours'), moment()],
                        });
                    }
                }
            } else {
                this.formRef.current.setFieldsValue({
                    [formField]: [],
                });
            }
            if (isRegion) {
                curSelParm.regionId = keyList;
                this.setPublishColumns();
            }
        }, 0);
    };

    /**
     * @description checkbox普通选项change事件
     * @param {Object} e checkbox change event
     * @param {Object[]} list 源数据列表
     * @param {String} formField form表单字段值
     * @param {String} keyField 源数据key字段
     */
    onCheckNormalChange = (e, list, formField, keyField) => {
        const {
            login: { systemInfo },
        } = this.props;
        const keyList = [];
        list.forEach((item) => {
            keyList.push(item[keyField]);
        });
        setTimeout(() => {
            const value = this.formRef.current.getFieldValue(formField);
            console.log(value);
            if (e.target.checked) {
                if (!value.includes('all') && value.length === list.length - 1) {
                    this.formRef.current.setFieldsValue({
                        [formField]: keyList,
                    });
                }
                if (systemInfo?.currentZone?.zoneLevel === '1' && formField === 'professionalName' && e.target.value === '8') {
                    this.formRef.current.setFieldsValue({
                        dateTime: [moment().subtract(24, 'hours'), moment()],
                    });
                }
            } else if (value.includes('all')) {
                value.shift();
                this.formRef.current.setFieldsValue({
                    [formField]: [...value],
                });
            }
        }, 0);
    };

    // 地市下拉修改事件
    // changesheetStaus = (id) => {
    //     curSelParm.sheetStatusId = id;
    //     this.setPublishColumns();
    // };
    // 查询事件
    searchData = () => {
        if (this.state.operId) {
            logNew('工单查询', this.state.operId);
        } else {
            logNew('监控工作台工单查询', '300004');
        }
        const query = this.formRef.current.getFieldsValue();
        const { regionName, professionalName, sheetStatus, provinceName } = query;
        if (!provinceName.length) {
            message.error('省份查询条件不能为空');
            return;
        }
        if (!regionName.length) {
            message.error('地市查询条件不能为空');
            return;
        }
        if (!professionalName.length) {
            message.error('专业查询条件不能为空');
            return;
        }
        if (!sheetStatus.length) {
            message.error('工单状态查询条件不能为空');
            return;
        }

        curSelParm.keyWord = query.keyWord ? query.keyWord : '';
        // curSelParm.sheet_type = query.sheet_type.includes('all') || !query.sheet_type.length ? '' : query.sheet_type.join(',');
        curSelParm.startTime = '';
        curSelParm.endTime = '';
        if (query.dateTime && query.dateTime[0]) {
            curSelParm.startTime = moment(query.dateTime[0]).format('YYYY-MM-DD HH:mm:ss');
            curSelParm.endTime = moment(query.dateTime[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        this.setState(
            {
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                },
            },
            () => {
                this.loadData();
            },
        );
    };
    exportData = (exportType, condPageSize) => {
        const query = this.formRef.current.getFieldsValue();
        curSelParm.keyWord = query.keyWord ? query.keyWord : '';
        curSelParm.startTime = '';
        curSelParm.endTime = '';
        if (query.dateTime && query.dateTime[0]) {
            curSelParm.startTime = moment(query.dateTime[0]).format('YYYY-MM-DD HH:mm:ss');
            curSelParm.endTime = moment(query.dateTime[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        this.exportRepuest(exportType, condPageSize);
    };
    setPublishColumns = () => {
        const publishColumns = [
            {
                title: '工单编号',
                dataIndex: 'sheetNo',
                align: 'center',
                ellipsis: true,
                width: 230,
                hideInSearch: true,
            },
            {
                title: '省份',
                dataIndex: 'provinceName',
                filters: true,
                onFilter: true,
                hideInTable: false,
                ellipsis: true,
                width: 80,
                align: 'center',
            },
            {
                title: '地市',
                dataIndex: 'regionName',
                filters: true,
                onFilter: true,
                hideInTable: false,
                ellipsis: true,
                align: 'center',
                width: 80,
            },

            {
                title: '关键字',
                dataIndex: 'keyWord',
                hideInTable: true,
                ellipsis: true,
                renderFormItem: () => {
                    return <Input placeholder="工单编号或者工单标题或者主送人" />;
                },
            },
            {
                title: '工单标题',
                dataIndex: 'sheetTitle',
                align: 'center',
                width: 160,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '派单类型',
                dataIndex: 'sendStatus',
                align: 'center',
                width: 100,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '派单时间',
                dataIndex: 'forwardTime',
                align: 'center',
                width: 160,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '工单类型',
                dataIndex: 'sheetType',
                align: 'center',
                width: 160,
                hideInSearch: true,
                ellipsis: true,
                render: (text) => {
                    return text || '-';
                },
            },
            {
                title: '工单状态',
                dataIndex: 'sheetStatus',
                filters: true,
                onFilter: true,
                hideInTable: false,
                ellipsis: true,
                align: 'center',
                width: 100,
            },
            {
                title: '专业',
                dataIndex: 'professionalType',
                filters: true,
                onFilter: true,
                hideInTable: false,
                ellipsis: true,
                width: 80,
                colSize: 1,
                align: 'center',
            },
            {
                title: '日期',
                dataIndex: 'dateTime',
                valueType: 'date',
                initialValue: moment(),
                hideInTable: true,
                ellipsis: true,
                width: 160,
                renderFormItem: () => {
                    return <RangePicker showTime />;
                },
            },
            {
                title: '当前处理人',
                dataIndex: 'person',
                align: 'center',
                width: 100,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '告警数',
                dataIndex: 'alarmValue',
                align: 'center',
                width: 80,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '未恢复告警数',
                dataIndex: 'unAlarmValue',
                align: 'center',
                width: 110,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '主送人',
                dataIndex: 'masterMan',
                align: 'center',
                width: 80,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '主送人电话',
                dataIndex: 'masterTel',
                align: 'center',
                width: 120,
                hideInSearch: true,
                ellipsis: true,
            },
            // {
            //     title: '次送人',
            //     dataIndex: 'slaveMan',
            //     align: 'center',
            //     width: 80,
            //     hideInSearch: true,
            //     ellipsis: true,
            // },
            // {
            //     title: '次送人电话',
            //     dataIndex: 'slaveTel',
            //     align: 'center',
            //     width: 120,
            //     hideInSearch: true,
            //     ellipsis: true,
            // },
            {
                title: '抄送人',
                dataIndex: 'copyMan',
                align: 'center',
                width: 80,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '抄送人电话',
                dataIndex: 'copyTel',
                align: 'center',
                width: 120,
                hideInSearch: true,
                ellipsis: true,
            },
            {
                title: '短信通知人',
                dataIndex: 'smsMan',
                align: 'center',
                width: 100,
                hideInSearch: true,
                ellipsis: true,
            },
        ];
        this.setState({
            publishColumns,
        });
    };

    onSheetTypeChange = (e) => {
        curSelParm.sheet_type = e.target.value;
    };

    loadData = () => {
        const {
            login: { userId, systemInfo },
        } = this.props;

        const zoneLevel = systemInfo?.currentZone?.zoneLevel;
        const { pagination } = this.state;
        const query = this.formRef.current.getFieldsValue();
        const { regionName, professionalName, sheetStatus, alarmState, provinceName } = query;
        if (!provinceName.length) {
            message.error('省份查询条件不能为空');
            return;
        }
        if (!regionName.length) {
            message.error('地市查询条件不能为空');
            return;
        }
        if (!professionalName.length) {
            message.error('专业查询条件不能为空');
            return;
        }
        if (!sheetStatus.length) {
            message.error('工单状态查询条件不能为空');
            return;
        }
        let province_id = '';
        if (zoneLevel === zoneLevelEnum.company) {
            province_id = provinceName.includes('all') ? '' : provinceName.join(',');
        } else {
            const provinceList = provinceListOriginal.map((item) => {
                return item.regionId;
            });
            province_id = provinceName.includes('all') ? provinceList.join(',') : provinceName.join(',');
        }

        const region_id = regionName.filter((item) => item !== 'all').join(',');

        const professional_type = professionalName.includes('all') ? '' : professionalName.join(',');
        let sheet_status = '';
        if (sheetStatus?.length > 0) {
            const sheetStatusTemp = sheetStatus.filter((item) => item !== 'all');
            sheet_status = sheetStatusTemp.join(',');
        }
        let alarm_status = '';
        if (alarmState) {
            alarm_status = alarmState.includes('all') ? '' : alarmState.join(',');
        }
        const parms = {
            province_id,
            region_id,
            //   sheet_status: curSelParm.sheetStatusId === 'all' ? '' : curSelParm.sheetStatusId,
            professional_type,
            key_word: curSelParm.keyWord,
            forward_start_time: curSelParm.startTime,
            forward_end_time: curSelParm.endTime,
            pageIndex: String(pagination.current),
            pageSize: String(pagination.pageSize),
            user_id: userId,
            sheet_time_out: '',
            sheet_type: curSelParm.sheet_type || '',
            sheet_status,
            alarm_status,
        };
        const args = {
            viewPageArgs: parms,
            viewItemId: 'orderStatisticsList',
            viewPageId: 'fault-order',
        };

        let dataSource = [];
        this.setState({
            dataSource,
            loading: true,
            isDataBlank: false,
        });

        request('work/sheet/v1/getViewItemData', {
            data: args,
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '工单信息失败',
            baseUrlType: 'failureSheetUrl',
        })
            .then((res) => {
                if (res?.data?.viewItemData?.rows) {
                    dataSource = res.data.viewItemData.rows;
                    const getPagination = res.data.viewItemData.page;
                    this.setState({
                        dataSource: dataSource || [],
                        loading: false,
                        isDataBlank: !!(dataSource && dataSource.length === 0),
                        pagination: { ...getPagination, current: Number(getPagination.current) },
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                });
            });
    };
    /**
     *
     * @param {导出文件类型} exportType  1|2|3   csv|excel|html
     * @param {指定导出记录数，全选的时候会传1w} condPageSize
     * @returns
     */
    exportRepuest = () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        let {
            pagination: { current, pageSize },
        } = this.state;
        const query = this.formRef.current.getFieldsValue();
        const { regionName, professionalName, sheetStatus, alarmState, provinceName } = query;
        if (!regionName.length || !professionalName.length) {
            message.error('至少选择一个地市和专业');
            return;
        }

        const province_id =
            provinceName.includes('all') && systemInfo.currentZone?.zoneLevel === '1' ? '' : provinceName.filter((e) => e !== 'all').join(',');
        const region_id = regionName.includes('all') ? '' : regionName.join(',');
        const professional_type = professionalName.includes('all') ? '' : professionalName.join(',');
        let sheet_status = '';
        if (sheetStatus?.length > 0) {
            const sheetStatusTemp = sheetStatus.filter((item) => item !== 'all');
            sheet_status = sheetStatusTemp.join(',');
        }
        let alarm_status = '';
        if (alarmState) {
            alarm_status = alarmState.includes('all') ? '' : alarmState.join(',');
        }

        const parms = {
            province_id,
            region_id,
            //    sheet_status: curSelParm.sheetStatusId === 'all' ? '' : curSelParm.sheetStatusId,
            professional_type,
            key_word: curSelParm.keyWord,
            forward_start_time: curSelParm.startTime,
            forward_end_time: curSelParm.endTime,
            pageIndex: String(current),
            pageSize: String(100000),
            user_id: userId,
            sheet_time_out: '',
            sheet_type: curSelParm.sheet_type || '',
            sheet_status,
            alarm_status,
        };
        const args = {
            userId,
            viewPageArgs: parms,
            viewItemId: 'orderStatisticsList',
            viewPageId: 'fault-order',
            exportType: 1,
        };
        // work/sheet/v1/export
        request('work/sheet/v1/export', {
            data: args,
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '工单导出失败',
            baseUrlType: 'failureSheetExportUrl',
        });
        // .then((data) => {
        //     const { failureSheetExportUrl } = useEnvironmentModel.data.environment;
        //     if (data.data && failureSheetExportUrl) {
        //         // window.open(`${failureSheetExportUrl.direct}/work/sheet/v1/export?fileName=${data.data}`);
        //         const url = `${failureSheetExportUrl.direct}/work/sheet/v1/export?fileName=${data.data}`;
        //         createFileFlow(data.data, url);
        //     }
        // })
        // .catch(() => {});
    };
    onPageChange = (pagination) => {
        this.setState({ pagination }, () => {
            this.loadData();
        });
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */
    closeModal = () => {
        this.setState({
            modalVisible: false,
        });
    };

    onClickRow = (record) => {
        const { sheetNo, forwardTime, provinceName, professionalType, sheetType } = record;
        const { sheetTypeMap } = this;

        console.log(record);
        sendLogFn({ authKey: 'workbenches:orderQueryAlarmwindow' });
        // if (this.state.operId) {
        //     logNew('工单查询', this.state.operId);
        // } else {
        //     logNew('监控工作台工单查询', '300004');
        // }
        const {
            login: { userInfo },
        } = this.props;
        count += 1;

        setTimeout(() => {
            if (count === 1) {
                const startTime = moment(forwardTime).add(-72, 'hour');
                const endTime = moment(forwardTime).add(72, 'hour');
                this.setState({
                    tableFlag: true,
                    // showAlarmQuery: false,
                    condition: {
                        [sheetTypeMap[sheetType]]: { operator: 'eq', value: sheetNo },
                        event_time: {
                            operator: 'between',
                            value: [startTime, endTime],
                        },
                    },
                });
            } else if (count === 2) {
                const sheetDetailObj = {
                    sheetNo,
                    logInId: JSON.parse(userInfo).loginId,
                    provinceId: _.find(storeBySQL.provinceList, (item) => item.regionName === provinceName)?.regionId,
                    professionalType: _.find(storeBySQL.professional, (item) => item.value === professionalType)?.key,
                    forwardTime,
                };
                this.getSheetDetailsUrl(sheetDetailObj);
            }
            count = 0;
        }, 300);
    };

    getSheetDetailsUrl = (data) => {
        request('work/sheet/v1/getEmosUrl', {
            data,
            type: 'post',
            showSuccessMessage: false,
            baseUrlType: 'failureSheetExportUrl',
        })
            .then((res) => {
                if (res) {
                    if (res.code === 200) {
                        window.open(res.data);
                    } else {
                        message.warn(res.message);
                    }
                }
            })
            .catch(() => {});
    };

    onContextMenuRow = (sheetNo) => {
        sendLogFn({ authKey: 'workbenches:showOrderDetail' });
        this.setState({
            sheet_no: sheetNo,
        });
    };

    clickSheetDetails = () => {
        if (this.state.operId) {
            logNew('工单查询', this.state.operId);
        } else {
            logNew('监控工作台工单查询', '300004');
        }
        const {
            login: { userInfo },
        } = this.props;
        const { sheet_no, dataSource } = this.state;
        if (sheet_no) {
            const sheetObj = _.find(dataSource, (item) => item.sheetNo === sheet_no);
            console.log(sheetObj);
            console.log(storeBySQL.professional);
            const sheetDetailObj = {
                sheetNo: sheet_no,
                logInId: JSON.parse(userInfo).loginId,
                provinceId: _.find(storeBySQL.provinceList, (item) => item.regionName === sheetObj.provinceName)?.regionId,
                professionalType: _.find(storeBySQL.professional, (item) => item.value === sheetObj.professionalType)?.key,
            };
            this.getSheetDetailsUrl(sheetDetailObj);
        }
    };

    changProvinceDown = (id) => {
        const { downState } = this.state;
        let province = 0;
        if (id === '1') {
            province = 2;
        } else {
            province = 1;
        }
        this.setState({
            downState: {
                ...downState,
                provinceState: province,
            },
        });
    };

    changRegionDown = (id) => {
        const { downState } = this.state;
        let region = 0;
        if (id === '1') {
            region = 2;
        } else {
            region = 1;
        }
        this.setState({
            downState: {
                ...downState,
                regionState: region,
            },
        });
    };

    changProfessionalDown = (id) => {
        const { downState } = this.state;
        let professional = 0;
        if (id === '1') {
            professional = 2;
        } else {
            professional = 1;
        }
        this.setState({
            downState: {
                ...downState,
                professionalState: professional,
            },
        });
    };

    // 获取字符串长度
    getByteLen = (val) => {
        let len = 0;
        for (let i = 0; i < val.length; i += 1) {
            const a = val.charAt(i);
            if (this.isChinese(a)) {
                len += 1;
            } else {
                len += 0.7;
            }
        }
        return len;
    };

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    disabledDate = (current, disabledDates) => {
        // Can not select days before today
        const {
            login: { systemInfo },
        } = this.props;

        let startDays = 6;
        if (systemInfo?.currentZone?.zoneLevel === '1') {
            const professionalKeys = this.formRef.current.getFieldValue('professionalName');
            if (professionalKeys) {
                const wxval = professionalKeys.find((item) => {
                    return item === '8';
                });
                if (wxval) {
                    startDays = 2;
                }
            }
        }
        return (
            (current && current < moment(moment().subtract('days', startDays).format('YYYY-MM-DD 00:00:00'))) ||
            (current && current > moment(moment().subtract('days', -1).format('YYYY-MM-DD 00:00:00')))
        );
    };

    disabledTime = (date) => {
        if (date == null) {
            return {};
        }
        const start = moment().subtract('days', 6);
        const isDisabled = date < start || date.format('YYYY-MM-DD') === start.format('YYYY-MM-DD');
        const hours = start.hours();
        const minutes = start.minutes();
        const seconds = start.seconds();
        return {
            disabledHours: () => (isDisabled ? this.range(0, hours) : []),
            disabledMinutes: () => (isDisabled ? this.range(0, minutes) : []),
            disabledSeconds: () => (isDisabled ? this.range(0, seconds) : []),
        };
    };
    isChinese = (temp) => {
        const re = /[^\u4E00-\u9FA5]/;
        if (re.test(temp)) return false;
        return true;
    };

    asyncExportOnClose = () => {
        this.setState({ asyncExportModalVisible: false });
        clearInterval(this.asyncExportTimer);
        this.asyncExportTimer = null;
    };
    onExport = () => {
        message.success('操作成功');
        this.setState({
            exportBtnFlag: true,
        });
        this.exportData();
        this.asyncExportTimer = setInterval(() => {
            this.asyncGetExportProgress();
        }, 2000);
    };

    asyncGetExportProgress = async () => {
        const {
            login: { userId },
        } = this.props;
        const params = { userId: userId.toString() };

        const result = await api.getExportProgressApi(params);

        if (result && result.data) {
            const { total, exportTimeStr, exportType = 'excel', progress, fileSrc, status } = result.data;
            const defaultStatus = {
                str: '',
                status: '',
            };
            if (status === '导出完成') {
                defaultStatus.str = '导出完成';
                defaultStatus.status = 'success';
            }
            if (status === '正在导出') {
                defaultStatus.str = '正在导出';
                defaultStatus.status = 'active';
            }
            if (status === '导出异常') {
                defaultStatus.str = '导出失败';
                if (result.message === '导出数据超 50 万，请重新选择导出范围') {
                    defaultStatus.str += '，导出数据超 50 万，请重新选择导出范围';
                }
                if (result.message === '数据量为0，无法导出！') {
                    defaultStatus.str += '，数据量为0，无法导出！';
                }
                defaultStatus.status = 'exception';
            }

            const list = {
                exportFormat: exportType,
                exportTime: exportTimeStr,
                exportTotal: total,
                exportState: defaultStatus.str,
                exportSchedule: { status: defaultStatus.status, percent: progress },
            };
            this.setState({
                asyncExportList: [list],
                exportBtnFlag: false,
            });
            if (progress < 100 && !this.asyncExportTimer && progress > 0) {
                this.asyncExportTimer = setInterval(() => {
                    this.asyncGetExportProgress();
                }, 2000);
            }
            if (progress === 100 || status === '导出异常') {
                this.fileSrc = fileSrc;
                clearInterval(this.asyncExportTimer);
                this.asyncExportTimer = null;
            }
        } else {
            clearInterval(this.asyncExportTimer);
            this.asyncExportTimer = null;
            this.setState({
                asyncExportList: [],
                exportBtnFlag: false,
            });
        }
    };
    onAsyncDownload = () => {
        const { failureSheetExportUrl } = useEnvironmentModel.data.environment;
        const url = `${failureSheetExportUrl.direct}/work/sheet/v1/export?fileName=${this.fileSrc}`;
        createFileFlow(this.fileSrc, url);
    };
    render() {
        const {
            publishColumns,
            dataSource,
            loading,
            pagination,
            tableFlag,
            showAlarmQuery,
            condition,
            downState,
            menu,
            asyncExportModalVisible,
            asyncExportList,
        } = this.state;
        const xWidth = publishColumns.reduce((total, item) => {
            return total + item.width;
        }, 0);

        const { provinceList: storeList, regionList, professional } = storeBySQL;
        const { systemInfo, userZoneInfo } = this.props.login;
        const selectWidth = (window.innerWidth * 23) / 24 - 60;
        let downWidthPro = 0;
        let newProvince = [];
        let { provinceState } = downState;
        const provinceList = _.uniqBy(storeList, 'regionId');
        if (provinceState !== 2) {
            provinceList.forEach((pro) => {
                downWidthPro += pro.regionName.length * 13 + 28;
                if (downWidthPro < selectWidth) {
                    newProvince.push(pro);
                }
            });
            if (newProvince.length === provinceList.length) {
                provinceState = 0;
            } else {
                provinceState = 1;
            }
        } else {
            newProvince = provinceList;
        }
        newProvince = _.uniqBy(newProvince, 'regionId');

        let newRegion = [];
        let downWidthReg = 0;
        let { regionState } = downState;
        if (regionState !== 2) {
            regionList.forEach((pro) => {
                downWidthReg += pro.regionName.length * 13 + 28;
                if (downWidthReg < selectWidth) {
                    newRegion.push(pro);
                }
            });
            if (newRegion.length === regionList.length) {
                regionState = 0;
            } else {
                regionState = 1;
            }
        } else {
            newRegion = regionList;
        }

        const selectWidthPros = (window.innerWidth * 23) / 24 - 60;
        let newProfessional = [];
        let downWidthPros = 0;
        let { professionalState } = downState;
        if (professionalState !== 2) {
            professional.forEach((pro) => {
                downWidthPros += this.getByteLen(pro.value) * 13 + 28;
                if (downWidthPros < selectWidthPros) {
                    newProfessional.push(pro);
                }
            });
            if (newProfessional.length === professional.length) {
                professionalState = 0;
            } else {
                professionalState = 1;
            }
        } else {
            newProfessional = professional;
        }

        return (
            <>
                <div className="failure-sheet-continer">
                    <div className="failure-sheet-top-select ">
                        <Form name="validate_other" ref={this.formRef}>
                            <Row>
                                <Col span={23}>
                                    <Form.Item name="provinceName" label="省份">
                                        {/* <Radio.Group size="small" style={{ border: '0px' }} onChange={this.changeProvince.bind(this)} buttonStyle="solid">
                                        {newProvince.map((item) => {
                                            return (
                                                <Radio.Button
                                                    value={item.provinceId}
                                                    key={item.provinceId}
                                                    type="text"
                                                    bordered={false}
                                                    style={{ width: item.regionName.length * 13 + 14 }}
                                                >
                                                    {item.regionName}
                                                </Radio.Button>
                                            );
                                        })}
                                    </Radio.Group> */}
                                        <Checkbox.Group size="small" onChange={this.changeProvince.bind(this)}>
                                            {provinceList.map((item) => {
                                                if (item.regionId === 'all') {
                                                    return (
                                                        <Checkbox
                                                            value={item.regionId}
                                                            key={item.regionId}
                                                            onChange={(e) => this.onCheckAllChange(e, provinceList, 'provinceName', 'regionId', true)}
                                                        >
                                                            {item.regionName}
                                                        </Checkbox>
                                                    );
                                                } else {
                                                    return (
                                                        <Checkbox
                                                            value={item.regionId}
                                                            key={item.regionId}
                                                            disabled={
                                                                userZoneInfo?.zoneLevel === '2' ||
                                                                userZoneInfo?.zoneLevel === '3' ||
                                                                systemInfo?.currentZone?.zoneLevel === '2'
                                                            }
                                                            onChange={(e) => this.onCheckNormalChange(e, provinceList, 'provinceName', 'regionId')}
                                                            style={
                                                                newProvince.includes(item)
                                                                    ? { width: item.regionName.length * 13 + 28 }
                                                                    : { width: 0, height: 0, overflow: 'hidden' }
                                                            }
                                                        >
                                                            {item.regionName}
                                                        </Checkbox>
                                                    );
                                                }
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={1}>
                                    {provinceState === 1 && newProvince.length > 20 && (
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                this.changProvinceDown('1');
                                            }}
                                        >
                                            <Icon type="DownOutlined" antdIcon />
                                            展开
                                        </Button>
                                    )}
                                    {provinceState === 2 && (
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                this.changProvinceDown('2');
                                            }}
                                        >
                                            <Icon type="UpOutlined" antdIcon />
                                            收起
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={23} />
                            </Row>
                            <Row>
                                <Col span={23}>
                                    <Form.Item name="regionName" label="地市">
                                        <Checkbox.Group size="small" onChange={this.changeRegion.bind(this)} value={['-915232913', '-706006321']}>
                                            {regionList.map((item) => {
                                                if (item.regionId === 'all') {
                                                    return (
                                                        <Checkbox
                                                            value={item.regionId}
                                                            key={item.regionId}
                                                            disabled={
                                                                systemInfo?.currentZone?.zoneLevel === '1' ||
                                                                systemInfo?.currentZone?.zoneLevel === '5'
                                                                    ? true
                                                                    : false
                                                            }
                                                            onChange={(e) => this.onCheckAllChange(e, regionList, 'regionName', 'regionId', true)}
                                                        >
                                                            {item.regionName}
                                                        </Checkbox>
                                                    );
                                                }
                                                return (
                                                    <Checkbox
                                                        value={item.regionId}
                                                        key={item.regionId}
                                                        onChange={(e) => this.onCheckNormalChange(e, regionList, 'regionName', 'regionId')}
                                                        style={
                                                            newRegion.includes(item)
                                                                ? { width: item.regionName.length * 13 + 28 }
                                                                : { width: 0, height: 0, overflow: 'hidden' }
                                                        }
                                                    >
                                                        {item.regionName}
                                                    </Checkbox>
                                                );
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={1}>
                                    {regionState === 1 && regionList.length > 20 && (
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                this.changRegionDown('1');
                                            }}
                                        >
                                            <Icon type="DownOutlined" antdIcon />
                                            展开
                                        </Button>
                                    )}
                                    {regionState === 2 && (
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                this.changRegionDown('2');
                                            }}
                                        >
                                            <Icon type="UpOutlined" antdIcon />
                                            收起
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={23}>
                                    <Form.Item name="professionalName" label="专业">
                                        <Checkbox.Group size="small">
                                            {professional.map((item) => {
                                                return item.key === 'all' ? (
                                                    <Checkbox
                                                        value={item.key}
                                                        key={item.key}
                                                        style={{ width: this.getByteLen(item.value) * 13 + 28 }}
                                                        onChange={(e) => this.onCheckAllChange(e, professional, 'professionalName', 'key')}
                                                    >
                                                        {item.value}
                                                    </Checkbox>
                                                ) : (
                                                    <Checkbox
                                                        value={item.key}
                                                        key={item.key}
                                                        style={
                                                            newProfessional.includes(item)
                                                                ? { width: this.getByteLen(item.value) * 13 + 28 }
                                                                : { width: 0, height: 0, overflow: 'hidden' }
                                                        }
                                                        onChange={(e) => this.onCheckNormalChange(e, professional, 'professionalName', 'key')}
                                                    >
                                                        {item.value}
                                                    </Checkbox>
                                                );
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={1}>
                                    {professionalState === 1 && (
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                this.changProfessionalDown('1');
                                            }}
                                        >
                                            <Icon type="DownOutlined" antdIcon />
                                            展开
                                        </Button>
                                    )}
                                    {professionalState === 2 && (
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                this.changProfessionalDown('2');
                                            }}
                                        >
                                            <Icon type="UpOutlined" antdIcon />
                                            收起
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '6px' }}>
                                <Col span={24}>
                                    <Form.Item label="工单类型" name="sheet_type">
                                        <Radio.Group
                                            options={plainOptions}
                                            defaultValue={curSelParm.sheet_type}
                                            value={curSelParm.sheet_type}
                                            onChange={this.onSheetTypeChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item name="sheetStatus" label="工单状态">
                                        <Checkbox.Group size="small">
                                            {sheetStatusList.map((item) => {
                                                return item.key === 'all' ? (
                                                    <Checkbox
                                                        value={item.key}
                                                        key={item.key}
                                                        // style={{ width: this.getByteLen(item.txt) * 13 + 28 }}
                                                        onChange={(e) => this.onCheckAllChange(e, sheetStatusList, 'sheetStatus', 'key')}
                                                    >
                                                        {item.value}
                                                    </Checkbox>
                                                ) : (
                                                    <Checkbox
                                                        value={item.key}
                                                        key={item.key}
                                                        // style={{ width: this.getByteLen(item.txt) * 13 + 28 }}
                                                        onChange={(e) => this.onCheckNormalChange(e, sheetStatusList, 'sheetStatus', 'key')}
                                                    >
                                                        {item.value}
                                                    </Checkbox>
                                                );
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '6px' }}>
                                <Col span={24}>
                                    <Form.Item label="告警状态" name="alarmState">
                                        <Checkbox.Group>
                                            {alarmOptions.map((item) => {
                                                return (
                                                    <Checkbox
                                                        value={item.value}
                                                        key={item.value}
                                                        onChange={(e) => {
                                                            if (item.value === 'all') {
                                                                this.onCheckAllChange(e, alarmOptions, 'alarmState', 'value');
                                                            } else {
                                                                this.onCheckNormalChange(e, alarmOptions, 'alarmState', 'value');
                                                            }
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Checkbox>
                                                );
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '6px' }}>
                                <Col span={6}>
                                    <Form.Item name="keyWord" label="关键字">
                                        <Input placeholder="工单编号或工单标题或主送人或当前处理人" />
                                    </Form.Item>
                                </Col>
                                <Col span={1} />
                                <Col span={6}>
                                    <Form.Item name="dateTime" label="日期" initialValue={[moment().subtract(24, 'hours'), moment()]}>
                                        <DateRangeTime
                                            showTime
                                            allowClear={false}
                                            format={'YYYY-MM-DD HH:mm:ss'}
                                            disabledDate={this.disabledDate}
                                            disabledTime={this.disabledTime}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={9} />
                                <Col span={2}>
                                    <Form.Item>
                                        <Space>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                onClick={() => {
                                                    this.searchData();
                                                }}
                                            >
                                                查询
                                            </Button>
                                            <Tooltip title="导出">
                                                <Icon
                                                    antdIcon
                                                    type="icondaochu1"
                                                    onClick={() => {
                                                        this.asyncGetExportProgress();
                                                        this.setState({ asyncExportModalVisible: true });
                                                    }}
                                                />
                                            </Tooltip>
                                            {/* <AlarmExportButton
                                            loading={loading}
                                            html={false}
                                            exportLimits={1000000}
                                            tooltip="导出"
                                            exportAllMsg=""
                                            onExport={this.exportData}
                                        /> */}
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <Dropdown overlay={menu} trigger={['contextMenu']}>
                        <div
                            className={`oss-imp-alarm-protable-search maintain-failure-sheet-top-wrapper failure-sheet-top-container ${
                                !loading && 'oss-imp-alarm-protable-empty-show'
                            }`}
                        >
                            <VirtualTable
                                rowKey="rosterIntId"
                                global={window}
                                columns={publishColumns}
                                dataSource={dataSource}
                                onChange={this.onPageChange}
                                onReset={false}
                                scroll={{ x: xWidth }}
                                pagination={pagination}
                                loading={loading}
                                bordered
                                dateFormatter="string"
                                options={false}
                                rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                                search={false}
                                onRow={(record) => {
                                    return {
                                        onClick: () => {
                                            this.onClickRow(record);
                                        },
                                        onContextMenu: () => {
                                            this.onContextMenuRow(record.sheetNo);
                                        },
                                    };
                                }}
                                // tableRender={isDataBlank ? () => <div>没有满足条件的数据</div> : false}
                                renderEmpty={<div>没有满足条件的数据</div>}
                            />
                        </div>
                    </Dropdown>

                    <div className="failure-sheet-bottom-container" style={{ display: tableFlag ? 'block' : 'none' }}>
                        {/* <div onClick={() => console.log(condition)}>123</div> */}
                        <div className="failure-sheet-bottom-container-close" onClick={() => this.setState({ tableFlag: false })}>
                            关闭
                        </div>
                        {showAlarmQuery && (
                            <AlarmQuery operId={this.state.operId ? '300044' : '400002'} mode="alarm-window" search={false} condition={condition} />
                        )}
                    </div>
                    {/* {isDataBlank && <div className="failure-sheet-data-blank">没有满足条件的数据</div>} */}
                </div>
                <AsyncExportModal
                    visible={asyncExportModalVisible}
                    onClose={() => this.asyncExportOnClose()}
                    onExport={() => this.onExport()}
                    exportList={asyncExportList}
                    onDownLoad={() => this.onAsyncDownload()}
                    exportBtnFlag={this.state.exportBtnFlag}
                />
            </>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
