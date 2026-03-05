import React from 'react';
import { Icon, Form, Radio, Row, Col, Checkbox, Button, Menu, Dropdown, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import request from '@Common/api';
import { withModel } from 'hox';
import AlarmQuery from '@Src/pages/search/alarm-query';
import { createFileFlow } from '@Common/utils/download';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
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
    sheetStatusId: '',
    provinceId: '',
    regionId: '',
    zoneLevel: '1',
};

// 工单查询默认值
const orderTimeList = [
    { value: '30', label: '超30分钟' },
    { value: '180', label: '超3小时' },
    { value: '540', label: '超9小时' },
    { value: '1440', label: '超24小时' },
    { value: '4320', label: '超72小时' },
];
// 工单状态默认数据
let sheetStatusList = [];

let count = 0;

class Index extends React.PureComponent {
    formRef = React.createRef();
    asyncExportTimer = null;
    fileSrc = '';
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
            showAlarmQuery: true,
            condition: { sheet_no: { operator: 'eq', value: '' } },
            sheet_no: '', // 右键放置工单值
            // 选择下拉状态 //0-无收起，1-折叠状态，2-展开状态
            downState: {
                provinceState: 0,
                regionState: 0,
                professionalState: 0,
            },
            tableFlag: false,
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
        this.intData();
        this.interval = setInterval(() => this.loadData(), 50 * 60 * 1000);
    }
    async intData() {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const zoneId = systemInfo.currentZone?.zoneId;
        curSelParm.provinceId = '';
        storeBySQL.provinceList = await api.getProvinceData(userId, zoneId);
        if (storeBySQL.provinceList.length > 0) {
            curSelParm.provinceId = storeBySQL.provinceList[0].regionId;
            curSelParm.regionId = '';
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

        sheetStatusList = await api.getSheetStatusInfo(userId);
        sheetStatusList.unshift({
            dictName: '',
            id: 'all',
            modelId: 2,
            valid: 1,
            txt: '全部',
            valueEn: 'Wireless Network',
        });

        const initRegionName = [];
        const initProfessional = [];
        const initSheetStatus = [];
        storeBySQL.regionList.forEach((item) => {
            initRegionName.push(item.regionId);
        });
        storeBySQL.professional.forEach((item) => {
            initProfessional.push(item.key);
        });
        sheetStatusList.forEach((item) => {
            initSheetStatus.push(item.id);
        });
        if (systemInfo?.currentZone?.zoneId) {
            curSelParm.provinceId = systemInfo.currentZone.zoneId;
        }
        this.formRef.current.setFieldsValue({
            provinceName: curSelParm.provinceId,
            regionName: initRegionName,
            professionalName: initProfessional,
            orderTime: '30',
            sheetStatus: initSheetStatus,
        });

        this.setPublishColumns();
        this.loadData();
    }
    // 省份下拉修改事件
    async changeProvince(e) {
        const id = e.target.value;
        const {
            login: { userId },
        } = this.props;
        curSelParm.provinceId = id;
        storeBySQL.regionList = await api.getProvinceRegions(curSelParm.provinceId, userId);
        storeBySQL.regionList.unshift({
            creator: null,
            parentRegionId: '',
            regionId: 'all',
            regionLevel: 0,
            regionName: '全部',
            zoneIds: null,
        });

        const initRegionName = [];
        storeBySQL.regionList.forEach((item) => {
            initRegionName.push(item.regionId);
        });
        this.formRef.current.setFieldsValue({
            regionName: initRegionName,
        });
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
                clearInterval(this.interval);
                this.interval = setInterval(() => this.loadData(), 50 * 60 * 1000);
            },
        );
    }
    // 地市下拉修改事件
    changeRegion = (id) => {
        curSelParm.regionId = id;
        this.setState(
            {
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                },
            },
            () => {
                setTimeout(() => {
                    this.loadData();
                    clearInterval(this.interval);
                    this.interval = setInterval(() => this.loadData(), 50 * 60 * 1000);
                }, 0);
            },
        );
    };
    // 专业、工单状态、工单时长选择查询
    changeProfessional = () => {
        this.setState(
            {
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                },
            },
            () => {
                setTimeout(() => {
                    this.loadData();
                    clearInterval(this.interval);
                    this.interval = setInterval(() => this.loadData(), 50 * 60 * 1000);
                }, 0);
            },
        );
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
        setTimeout(() => {
            const keyList = [];
            if (e.target.checked) {
                list.forEach((item) => {
                    keyList.push(item[keyField]);
                });
                this.formRef.current.setFieldsValue({
                    [formField]: keyList,
                });
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
        const keyList = [];
        list.forEach((item) => {
            keyList.push(item[keyField]);
        });
        setTimeout(() => {
            const value = this.formRef.current.getFieldValue(formField);
            if (e.target.checked) {
                if (!value.includes('all') && value.length === list.length - 1) {
                    this.formRef.current.setFieldsValue({
                        [formField]: keyList,
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

    loadData = () => {
        const { pagination } = this.state;
        const query = this.formRef.current.getFieldsValue();
        const { regionName, professionalName, sheetStatus } = query;
        if (!regionName.length || !professionalName.length || !sheetStatus.length) {
            return;
        }
        const region_id = regionName.includes('all') ? '' : regionName.join(',');
        const professional_type = professionalName.includes('all') ? '' : professionalName.join(',');
        let sheet_status = '';
        if (query.sheetStatus?.length > 0) {
            query.sheetStatus = query.sheetStatus.filter((item) => item !== 'all');
            sheet_status = query.sheetStatus.join(',');
        }
        const parms = {
            province_id: curSelParm.provinceId === 'all' ? '' : curSelParm.provinceId,
            region_id,
            sheet_status,
            professional_type,
            sheet_time_out: query.orderTime,
            pageIndex: String(pagination.current),
            pageSize: String(pagination.pageSize),
            sheet_type: '1',
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
        });

        request('work/sheet/v1/getViewItemData', {
            data: args,
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '超长工单查询失败',
            baseUrlType: 'failureSheetUrl',
        })
            .then((res) => {
                if (res?.data?.viewItemData?.rows) {
                    dataSource = res.data.viewItemData.rows;
                    const getPagination = res.data.viewItemData.page;
                    this.setState({
                        dataSource: dataSource || [],
                        loading: false,
                        pagination: { ...getPagination, current: Number(pagination.current) },
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
    onPageChange = (pagination) => {
        this.setState({ pagination }, () => {
            this.loadData();
            clearInterval(this.interval);
            this.interval = setInterval(() => this.loadData(), 5 * 60 * 1000);
        });
    };

    onClickRow = (sheetNo, forwardTime, provinceName, professionalType) => {
        const {
            login: { userInfo },
        } = this.props;
        count += 1;
        setTimeout(() => {
            if (count === 1) {
                const startTime = moment(forwardTime).add(-24, 'hour');
                const endTime = moment(forwardTime).add(24, 'hour');
                this.setState({
                    tableFlag: true,
                    // showAlarmQuery: false,
                    condition: {
                        sheet_no: { operator: 'eq', value: sheetNo },
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
        }, 500);
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
        this.setState({
            sheet_no: sheetNo,
        });
    };
    clickSheetDetails = () => {
        const {
            login: { userInfo },
        } = this.props;
        const { sheet_no, dataSource } = this.state;
        if (sheet_no) {
            const sheetObj = _.find(dataSource, (item) => item.sheetNo === sheet_no);
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

    isChinese = (temp) => {
        const re = /[^\u4E00-\u9FA5]/;
        if (re.test(temp)) return false;
        return true;
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

        const province_id = provinceName;
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
            pageIndex: String(current),
            pageSize: String(100000),
            user_id: `${userId}overLong`,
            sheet_time_out: query.orderTime,
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
        const params = { userId: `${userId}overLong` };

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
                if (result.message === '导出数据超 2 万，请重新选择导出范围') {
                    defaultStatus.str += '，导出数据超 2 万，请重新选择导出范围';
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
        const {
            login: { userId },
        } = this.props;
        // const url = `http://172.24.131.231:9011/failureSheetDownLoadUrl/work/sheet/v1/export?fileName=${this.fileSrc}`;
        const url = `${failureSheetExportUrl.direct}/work/sheet/v1/export?fileName=${this.fileSrc}&userId=${userId}overLong`;
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
        const { provinceList, regionList, professional } = storeBySQL;
        const { systemInfo } = this.props.login;
        const selectWidth = (window.innerWidth * 23) / 24 - 60;
        let downWidthPro = 0;
        let newProvince = [];
        let { provinceState } = downState;
        if (provinceState !== 2) {
            provinceList.forEach((pro) => {
                downWidthPro += pro.regionName.length * 13 + 14;
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
            <div className="failure-sheet-continer">
                <div className="failure-sheet-top-select ">
                    <Form name="validate_other" ref={this.formRef}>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="orderTime" label="工单时长">
                                    <Radio.Group
                                        size="small"
                                        style={{ border: '0px' }}
                                        onChange={this.changeProfessional.bind(this)}
                                        buttonStyle="solid"
                                    >
                                        {orderTimeList.map((item) => {
                                            return (
                                                <Radio.Button
                                                    value={item.value}
                                                    type="text"
                                                    bordered={false}
                                                    style={{ width: 80, textAlign: 'center' }}
                                                >
                                                    {item.label}
                                                </Radio.Button>
                                            );
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={23}>
                                <Form.Item name="provinceName" label="省份">
                                    <Radio.Group size="small" style={{ border: '0px' }} onChange={this.changeProvince.bind(this)} buttonStyle="solid">
                                        {newProvince
                                            .filter((item) =>
                                                systemInfo?.currentZone?.zoneId ? item.regionId === systemInfo?.currentZone?.zoneId : true,
                                            )
                                            .map((item) => {
                                                return (
                                                    <Radio.Button
                                                        value={item.regionId}
                                                        type="text"
                                                        bordered={false}
                                                        style={{ width: item.regionName.length * 13 + 14, textAlign: 'center' }}
                                                    >
                                                        {item.regionName}
                                                    </Radio.Button>
                                                );
                                            })}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                {provinceState === 1 && (
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
                                                        onChange={(e) => this.onCheckAllChange(e, regionList, 'regionName', 'regionId', true)}
                                                    >
                                                        {item.regionName}
                                                    </Checkbox>
                                                );
                                            }
                                            return (
                                                <Checkbox
                                                    value={item.regionId}
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
                                {regionState === 1 && (
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
                                    <Checkbox.Group size="small" onChange={this.changeProfessional.bind(this)}>
                                        {professional.map((item) => {
                                            return item.key === 'all' ? (
                                                <Checkbox
                                                    value={item.key}
                                                    style={{ width: this.getByteLen(item.value) * 13 + 28 }}
                                                    onChange={(e) => this.onCheckAllChange(e, professional, 'professionalName', 'key')}
                                                >
                                                    {item.value}
                                                </Checkbox>
                                            ) : (
                                                <Checkbox
                                                    value={item.key}
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
                        <Row>
                            <Col span={24}>
                                <Form.Item name="sheetStatus" label="工单状态">
                                    <Checkbox.Group size="small" onChange={this.changeProfessional.bind(this)}>
                                        {sheetStatusList.map((item) => {
                                            return item.id === 'all' ? (
                                                <Checkbox
                                                    value={item.id}
                                                    style={{ width: this.getByteLen(item.txt) * 13 + 28 }}
                                                    onChange={(e) => this.onCheckAllChange(e, sheetStatusList, 'sheetStatus', 'id')}
                                                >
                                                    {item.txt}
                                                </Checkbox>
                                            ) : (
                                                <Checkbox
                                                    value={item.id}
                                                    style={{ width: this.getByteLen(item.txt) * 13 + 28 }}
                                                    onChange={(e) => this.onCheckNormalChange(e, sheetStatusList, 'sheetStatus', 'id')}
                                                >
                                                    {item.txt}
                                                </Checkbox>
                                            );
                                        })}
                                    </Checkbox.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                        <Button
                            onClick={() => {
                                this.asyncGetExportProgress();
                                this.setState({ asyncExportModalVisible: true });
                            }}
                        >
                            导出
                        </Button>
                    </div>
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
                                        this.onClickRow(record.sheetNo, record.forwardTime, record.provinceName, record.professionalType);
                                    },
                                    onContextMenu: () => {
                                        this.onContextMenuRow(record.sheetNo);
                                    },
                                };
                            }}
                            renderEmpty={<div>没有满足条件的数据</div>}
                        />
                    </div>
                </Dropdown>
                <div className="failure-sheet-bottom-container" style={{ display: tableFlag ? 'block' : 'none' }}>
                    <div className="failure-sheet-bottom-container-close" onClick={() => this.setState({ tableFlag: false })}>
                        关闭
                    </div>
                    {showAlarmQuery && <AlarmQuery mode="alarm-window" condition={condition} />}
                </div>
                <AsyncExportModal
                    visible={asyncExportModalVisible}
                    onClose={() => this.asyncExportOnClose()}
                    onExport={() => this.onExport()}
                    exportList={asyncExportList}
                    onDownLoad={() => this.onAsyncDownload()}
                    exportBtnFlag={this.state.exportBtnFlag}
                />
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
