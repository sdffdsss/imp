import React from 'react';
import { Icon, Form, Radio, Row, Col, Checkbox, Button } from 'oss-ui';
import request from '@Common/api';
import { withModel } from 'hox';
import api from './api';
import './style.less';
import useLoginInfoModel, { useAlarmWindowConfigModel } from '@Src/hox';
import { AlarmWindow } from '@Components/oss-alarm-window/es';
import { setColumnsInfo } from '../search/alarm-query/common/translate';
import { getAllAlarmColumns } from '@Src/pages/setting/views/col-template/common/rest';
import { customAlphabet } from 'nanoid';

// 数据库加载基础数据，数据库加载后，不再处理变更
const storeBySQL = {
    provinceList: [],
    regionList: [],
    professional: [],
};

// 当前查询使用参数
const curSelParm = {
    professionalType: '',
    provinceId: '',
    regionId: '',
    zoneLevel: '1',
};

// 告警时长
const orderTimeList = [
    { value: '1', label: '超30分钟' },
    { value: '2', label: '超1小时' },
    { value: '3', label: '超2小时' },
    { value: '4', label: '超4小时' },
];

const alarmConfig = {
    alarmContextMenu: useAlarmWindowConfigModel.data.environment.contextAndToolbar.longAlarmContextMenu,
    alarmToolBar: {
        active: ['tableSize'],
    },
};

const deleteSessionId = '';
class Index extends React.PureComponent {
    formRef = React.createRef();
    formContainerRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            publishColumns: [],
            dataSource: [],
            loading: false,
            scrollY: window.innerHeight - 300,
            pagination: {
                current: 1,
                pageSize: 50,
                total: 0,
            },
            // 选择下拉状态 //0-无收起，1-折叠状态，2-展开状态
            downState: {
                provinceState: 0,
                regionState: 0,
                professionalState: 0,
            },
            fieldIds: [],
        };
    }

    componentDidMount() {
        // this.setPublishColumns();
        this.intData();
        this.interval = setInterval(() => this.loadData(), 50 * 60 * 1000);
        this.reCaclcScrollY();
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

        const initRegionName = [];
        const initProfessional = [];
        storeBySQL.regionList.forEach((item) => {
            initRegionName.push(item.regionId);
        });
        storeBySQL.professional.forEach((item) => {
            initProfessional.push(item.key);
        });
        if (systemInfo?.currentZone?.zoneId) {
            curSelParm.provinceId = systemInfo.currentZone.zoneId;
        }
        this.formRef.current.setFieldsValue({
            provinceName: curSelParm.provinceId,
            regionName: initRegionName,
            professionalName: initProfessional,
            orderTime: '1',
        });

        this.setPublishColumns();
        // this.loadData();
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
        // if (storeBySQL.regionList.length > 0) {
        //     curSelParm.regionId = storeBySQL.regionList[0].regionId;
        // }
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
                    pageSize: 50,
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
        setTimeout(() => {
            this.setState(
                {
                    pagination: {
                        current: 1,
                        pageSize: 50,
                        total: 0,
                    },
                },
                () => {
                    this.loadData();
                    clearInterval(this.interval);
                    this.interval = setInterval(() => this.loadData(), 50 * 60 * 1000);
                },
            );
        }, 0);
    };
    // 专业、工单状态、工单时长选择查询
    changeProfessional = () => {
        setTimeout(() => {
            this.setState(
                {
                    pagination: {
                        current: 1,
                        pageSize: 50,
                        total: 0,
                    },
                },
                () => {
                    this.loadData();
                    clearInterval(this.interval);
                    this.interval = setInterval(() => this.loadData(), 50 * 60 * 1000);
                },
            );
        }, 0);
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

    // 查询事件
    searchData = () => {
        this.loadData();
    };
    async setPublishColumns() {
        /*  */
        const {
            login: { userName },
        } = this.props;
        const res = await request('v1/template/search-alarm-column', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: { optionKey: `${userName}.QueryAlarmBandOption` },
            // 是否需要显示失败消息提醒
            showErrorMessage: false,
            showSuccessMessage: false,
        });
        if (res.data && res.data.optionValue) {
            const allCol = await getAllAlarmColumns();
            const columns = setColumnsInfo(res.data.optionValue, allCol, 'query');
            const setFieldIds = [];
            columns.showInTableColumns.forEach((item) => {
                setFieldIds.push(item.id);
            });
            if (!setFieldIds.includes(35)) {
                setFieldIds.push(35);
            }
            this.setState(
                {
                    publishColumns: this.formatColumns(columns.showInTableColumns, allCol),
                    fieldIds: setFieldIds,
                },
                () => {
                    this.loadData();
                },
            );

            // this.setState({
            //     publishColumns: columns.showInTableColumns.map((item) => {
            //         let otherRender = (text) => {
            //             // if (!text) {
            //             //     return '';
            //             // }
            //             return text?.lable || text?.value;
            //         };
            //         if (item.dataIndex === 'fp0') {
            //             otherRender = (text, record) => {
            //                 if (!text) {
            //                     return '';
            //                 }
            //                 let msg = text?.lable || text?.value;
            //                 if (record.org_severity) {
            //                     let color;
            //                     let textColor = '#fff';
            //                     if (record.org_severity.value === '1') {
            //                         color = '#EB3223';
            //                     }
            //                     if (record.org_severity.value === '2') {
            //                         color = '#F1A83C';
            //                     }
            //                     if (record.org_severity.value === '3') {
            //                         color = '#FFFD56';
            //                         textColor = '#000';
            //                     }
            //                     if (record.org_severity.value === '4') {
            //                         color = '#54B3FF';
            //                     }
            //                     msg = (
            //                         <div
            //                             style={{
            //                                 backgroundColor: color,
            //                                 textAlign: 'center',
            //                                 margin: -8,
            //                                 height: 35,
            //                                 lineHeight: '35px',
            //                                 color: textColor
            //                             }}
            //                         >
            //                             {text.lable}
            //                         </div>
            //                     );
            //                 }
            //                 return msg;
            //             };
            //         } else if (item.dataIndex === 'org_severity') {
            //             otherRender = (text, record) => {
            //                 if (!text) {
            //                     return '';
            //                 }
            //                 let msg = text?.lable || text?.value;
            //                 let color;
            //                 let textColor = '#fff';
            //                 if (record.org_severity.value === '1') {
            //                     color = '#EB3223';
            //                 }
            //                 if (record.org_severity.value === '2') {
            //                     color = '#F1A83C';
            //                 }
            //                 if (record.org_severity.value === '3') {
            //                     color = '#FFFD56';
            //                     textColor = '#000';
            //                 }
            //                 if (record.org_severity.value === '4') {
            //                     color = '#54B3FF';
            //                 }
            //                 msg = (
            //                     <div
            //                         style={{
            //                             backgroundColor: color,
            //                             textAlign: 'center',
            //                             margin: -8,
            //                             position: 'relative',
            //                             height: 35,
            //                             lineHeight: '35px',
            //                             color: textColor
            //                         }}
            //                     >
            //                         {text.lable}
            //                     </div>
            //                 );
            //                 return msg;
            //             };
            //         }
            //         return {
            //             ...item,
            //             field: item.dataIndex,
            //             render: otherRender
            //         };
            //     })
            // });
        } else {
            // console.log('没有取到告警查询模板');
        }
    }

    // format方法和流水窗处保持一致
    formatColumns = (datas, allCol) => {
        if (!allCol || !allCol.length || !datas || !datas.length) {
            return [];
        }

        let nextDatas = datas.filter((item) => _.find(allCol, (col) => col.field === item.dataIndex) && item.dataIndex !== 'fp0');
        nextDatas.unshift({
            title: '',
            alias: '',
            dataIndex: 'fp0',
            width: 50,
            ellipsis: true,
            field: 'fp0',
            sortFieldId: 'fp0',
            id: 71,
        });
        const { needFp } = useAlarmWindowConfigModel.data.environment;
        nextDatas = nextDatas.map((item) => {
            const columnItem = _.find(allCol, (col) => col.field === item.dataIndex);
            return {
                title: item.alias || item.title,
                dataIndex: item.dataIndex,
                render: (text, record) => {
                    if (!text) {
                        return '';
                    }
                    let msg = text?.lable || text?.value;
                    if (item.dataIndex === 'org_severity' || item.dataIndex === 'fp0') {
                        const colors = {
                            1: { backgroundColor: '#eb3223', color: '#fff' },
                            2: { backgroundColor: '#f1a83c', color: '#fff' },
                            3: { backgroundColor: '#fffd56', color: '#000' },
                            4: { backgroundColor: '#54b3ff', color: '#fff' },
                        };
                        msg = (
                            <div
                                style={{
                                    backgroundColor: colors[record.org_severity?.value]?.backgroundColor,
                                    textAlign: 'center',
                                    margin: -8,
                                    position: 'relative',
                                    height: 35,
                                    lineHeight: '35px',
                                    color: colors[record.org_severity?.value]?.color,
                                    padding: '0 8px',
                                }}
                            >
                                {(needFp && item.dataIndex === 'fp0') || item.dataIndex === 'org_severity'
                                    ? record[item.dataIndex]?.lable || record[item.dataIndex]?.value
                                    : ''}
                            </div>
                        );
                    }
                    return msg;
                },
                width: item.width || 120,
                ellipsis: true,
                sorter: false,
                field: item.dataIndex,
                valueType: columnItem.id,
                sortFieldId: columnItem.id,
                id: columnItem.id,
            };
        });
        return nextDatas;
    };

    loadData = () => {
        const {
            login: { userId, userInfo, systemInfo },
        } = this.props;
        const { pagination, fieldIds } = this.state;
        const query = this.formRef.current.getFieldsValue();
        const { regionName, professionalName } = query;
        if (!regionName.length || !professionalName.length) {
            return;
        }
        let userInfos = userInfo && JSON.parse(userInfo);
        const region_id = regionName.includes('all') ? regionName.filter((folder) => folder !== 'all') : regionName;
        const professional_type = professionalName.includes('all') ? professionalName.filter((folder) => folder !== 'all') : professionalName;
        // const parms = {
        //     province_id: curSelParm.provinceId === 'all' ? '' : curSelParm.provinceId,
        //     region_id,
        //     professional_type,
        //     forward_start_time: curSelParm.startTime,
        //     forward_end_time: curSelParm.endTime,
        //     sheet_time_out: query.orderTime,
        //     pageIndex: String(pagination.current),
        //     pageSize: String(pagination.pageSize)
        // };
        // const args = {
        //     viewPageArgs: parms,
        //     viewItemId: 'orderStatisticsList',
        //     viewPageId: 'fault-order'
        // };

        const sessionId = `${new Date().getTime()}`;
        const newParams = {
            fieldConditions: {
                conditionList: [
                    { fieldId: 137, type: 'eq', value: query.provinceName, values: [query.provinceName] }, // 省份
                    { fieldId: 90, type: 'in', value: '', values: region_id }, // 地市
                    { fieldId: 23, type: 'in', value: '', values: professional_type }, // 专业
                    { fieldId: 100, type: 'eq', value: query.orderTime, values: [query.orderTime] }, // 告警时长
                ],
            },
            fieldIds,
            sessionId,
            deleteSessionId: deleteSessionId || '',
            userId,
            pageSize: pagination.pageSize,
            startIndex: (pagination.current - 1) * pagination.pageSize,
            loginProvinceId: systemInfo?.currentZone?.zoneId || userInfos?.zones[0]?.zoneId,
        };
        this.setState({
            dataSource: [],
            loading: true,
        });
        let dataSource = [
            // {
            //     key: '11111_22222_33333_44444',
            //     alarm_id: { lable: '11111_22222_33333_44444', value: '11111_22222_33333_44444', field: 'alarm_id', num: '-1' },
            //     fp0: { lable: '11111', value: '11111', field: 'fp0', num: '71' },
            //     org_severity: { lable: '一级告警', value: '1', field: 'org_severity', num: '55' },
            //     professional_type: { lable: '传输网', value: '4', field: 'professional_type', num: '64' },
            //     region_id: { lable: '安徽省', value: '4', field: 'region_id', num: '65' }
            // },
        ];

        // this.setState({
        //     dataSource,
        //     loading: false
        // });
        const nanoid = customAlphabet('1234567890', 15);
        request('sysadminAlarm/record-page-longtime', {
            data: newParams,
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '查询超长告警失败',
            baseUrlType: 'filter',
        })
            .then((res) => {
                dataSource = res.data.map((item) => {
                    return {
                        key: nanoid().toString(),
                        alarm_id: {
                            lable: `${item.fp0.value}_${item.fp1.value}_${item.fp2.value}_${item.fp3.value}`,
                            value: `${item.fp0.value}_${item.fp1.value}_${item.fp2.value}_${item.fp3.value}`,
                            field: 'alarm_id',
                            num: '-1',
                        },
                        ...item,
                    };
                });
                // const paginationNew = res.data.page;
                this.setState({
                    dataSource,
                    loading: false,
                    pagination: {
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: res.total,
                    },
                    // pagination: { ...paginationNew, current: Number(paginationNew.current) }
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    dataSource: [],
                });
            });
        /*  */
    };

    handleFetch = (pageObj) => {
        this.setState(
            {
                pagination: {
                    current: pageObj.current,
                    pageSize: pageObj.pageSize,
                    total: pageObj.total,
                },
            },
            () => {
                this.loadData();
                clearInterval(this.interval);
                this.interval = setInterval(() => this.loadData(), 5 * 60 * 1000);
            },
        );
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
        this.reCaclcScrollY();
    };

    reCaclcScrollY = () => {
        setTimeout(() => {
            const formContainerHeight = this.formContainerRef.current?.clientHeight;
            const rootContainer = document.querySelector('#imp-unicom-content-root');
            this.setState({ scrollY: rootContainer.clientHeight - formContainerHeight - 70 });
        }, 50);
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
        this.reCaclcScrollY();
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
        this.reCaclcScrollY();
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

    render() {
        const { publishColumns, dataSource, loading, pagination, downState, scrollY } = this.state;
        // const xWidth = publishColumns.reduce((total, item) => {
        //     return total + item.width;
        // }, 0);
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

        // 与流水窗不通用的方法集合，由外部传入
        const extendEventMap = {
            // 工具栏列设置
            // ColumnSettings: (value) => {},
            // 工具栏导出接口调用
            // AlarmExport: (value) => {},
            // 右键时获取告警详情事件，records：已选告警
            // onContextMenuClick: async (records, callback) => {},
            // 双击时获取告警详情时间
            onTableDoubleClick: async () => {
                alert('1111111111');
            },
        };
        /*  */
        return (
            <div className="alarm-window-continer-long">
                <div className="failure-sheet-top-select " ref={this.formContainerRef}>
                    <Form name="validate_other" ref={this.formRef}>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="orderTime" label="告警时长">
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
                                        {provinceList
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
                                {provinceState === 1 &&
                                    provinceList.filter((item) =>
                                        systemInfo?.currentZone?.zoneId ? item.regionId === systemInfo?.currentZone?.zoneId : true,
                                    ).length > 20 && (
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
                    </Form>
                </div>
                <div className="oss-imp-alarm-protable-search alarm-window-long-wrapper">
                    <AlarmWindow
                        // ref={alarmWindowRef}
                        loading={loading}
                        statisticsItems={[]}
                        columns={publishColumns}
                        // allCol={allCol}
                        // useCol={useCol}
                        // fullColumnsDict={allCol}
                        winType={'active'}
                        toolBarStatus={{}}
                        pagination={{
                            current: pagination.current,
                            position: 'bottom',
                            defaultCurrent: 1,
                            pageSize: pagination.pageSize,
                            size: 'small',
                            total: pagination.total,
                            showTotal: (total) => `共 ${total} 条`,
                        }}
                        onFetch={this.handleFetch}
                        dataSource={dataSource}
                        // scroll={{ y: (frameInfo?.container?.offsetHeight || window.innerHeight) - 233 }}
                        scrollY={scrollY}
                        contextAndToolbar={alarmConfig}
                        extendEventMap={extendEventMap}
                        // extendContextMenu={extendContextMenu}
                        // toolBarRender={props.toolBarRender}
                        // frameInfo={frameInfoForAlarmWindow}
                        defaultSize={'small'}
                        theme={systemInfo?.theme}
                        onDoubleClick={() => {}}
                    />
                </div>
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
