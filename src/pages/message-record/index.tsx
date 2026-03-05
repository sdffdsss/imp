// import React,{useEffect,useState}from 'react';
import React, { PureComponent } from 'react';
import { Select, Form, Input, Tooltip, Icon, Button, message } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import DateRangeTime from '@Components/date-range-time';
import { blobDownLoad } from '@Src/common/utils/download';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import AsyncExportModal from './async-export-modal';
import { Api } from './api';
import Details from './details';
import './style.less';

interface Props {
    login: {
        userId: any;
        systemInfo: any;
        zoneLevelFlags: any;
        currentZone: any;
    };
}
interface States {
    provinceList: any[];
    deFaultProvinceId: any;
    regionList: any[];
    professionalList: any[];
    columns: any[];
    loading: boolean;
    visible: boolean;
    ivrDetails: any[];
    curQueryParams: any;
    exportVisible: boolean;
    asyncExportList: any[];
    curSendWays: any;
    sendRuleProvinceId: any;
    allProvinceList: any[];
    allZoneList: any[];
}
class IvrRuleRecord extends PureComponent<Props, States> {
    formRef: any = React.createRef();
    exportRef: any = React.createRef();
    total: number = 0;
    asyncExportTimer: any = null;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            provinceList: [],
            deFaultProvinceId: '',
            regionList: [],
            professionalList: [],
            columns: [],
            visible: false,
            ivrDetails: [],
            curQueryParams: {},
            exportVisible: false,
            asyncExportList: [],
            curSendWays: 2,
            sendRuleProvinceId: '',
            allProvinceList: [],
            allZoneList: [],
        };
    }
    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            login: { userId, systemInfo, currentZone },
            login,
        } = this.props;
        let param: any = '';
        if (String(currentZone?.zoneLevel) === '5') {
            param = { parent_zone_id: currentZone?.zoneId };
        }
        Promise.all([Api.getProvinceData(userId), Api.getDictEntry('professional_type', userId), Api.getAllZones(), Api.getZones(param)]).then(
            (res) => {
                if (res) {
                    let provinceList = res[0] || [];
                    provinceList = provinceList.filter((item) =>
                        systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
                    );
                    const sendRuleProvinceId = provinceList[0]?.regionId;
                    let deFaultProvinceId: any;
                    const professionalList = res[1]?.data || [];
                    const allZoneList = res[2]?.['_embedded']?.zoneResourceList;
                    const temp1 = allZoneList.filter((item) => item.zoneName !== '省本部');
                    let provinceArr: any = [];
                    if (login?.zoneLevelFlags?.isCountryZone) {
                        provinceArr = temp1.filter((item: any) => [1, 2, 5].includes(item.zoneLevel));
                    } else if (login?.zoneLevelFlags?.isRegionZone) {
                        provinceArr = temp1.filter((item: any) => item.zoneId === Number(currentZone?.zoneId));
                        if (String(currentZone?.zoneLevel) === '5') {
                            const countryProvince = res[3]?.['_embedded']?.zoneResourceList;
                            provinceArr = provinceArr.concat(countryProvince);
                        }
                        deFaultProvinceId = provinceArr?.map((item: any) => item.zoneId);
                    } else if (login?.zoneLevelFlags?.isProvinceZone) {
                        provinceArr = temp1.filter((item: any) => item.zoneId === Number(currentZone?.zoneId));
                        deFaultProvinceId = provinceArr?.map((item: any) => item.zoneId);
                    } else if (login?.zoneLevelFlags?.isCityZone) {
                        provinceArr = temp1.filter((item: any) => item.parentZoneId === Number(currentZone?.zoneId));
                        deFaultProvinceId = provinceArr?.map((item: any) => item.zoneId);
                    }
                    this.setState(
                        { provinceList, deFaultProvinceId, professionalList, sendRuleProvinceId, allProvinceList: provinceArr, allZoneList: temp1 },
                        () => {
                            this.getColumns();
                            if (this.formRef && this.formRef.current) {
                                this.formRef.current.submit();
                            }
                        },
                    );
                }
            },
        );
    };
    selectProvince = (provinceId) => {
        const { allZoneList } = this.state;
        // 取集团
        const temp1 = allZoneList.filter((item) => provinceId.includes(item.zoneId) && String(item.zoneLevel) === '1');
        // 取大区
        const temp2 = allZoneList.filter((item) => provinceId.includes(item.zoneId) && String(item.zoneLevel) === '5');
        // 取地市
        const temp3 = allZoneList.filter((item) => provinceId.includes(item.parentZoneId) && String(item.zoneLevel) === '3');
        const temp4 = [...temp1, ...temp2, ...temp3];
        this.setState(
            {
                regionList: temp4,
            },
            () => {
                this.getColumns();
                this.formRef.current.setFieldsValue({ provinceId, cityIds: undefined });
            },
        );
    };
    sendWaysChange = (val) => {
        this.setState(
            {
                curSendWays: val,
            },
            () => {
                this.getColumns();
                this.formRef.current.setFieldsValue({ sendWays: val });
            },
        );
    };
    sendRuleProvinceChange = (val) => {
        this.setState({
            sendRuleProvinceId: val,
        });
    };
    getColumns = () => {
        const { provinceList, regionList, professionalList, curSendWays, sendRuleProvinceId, allProvinceList } = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'number',
                key: 'number',
                align: 'center',
                hideInSearch: true,
                ellipsis: true,
                width: 60,
                render: (text, record, index) => {
                    return index + 1;
                },
            },
            {
                title: '发送时间',
                hideInTable: true,
                dataIndex: 'callTime',
                align: 'center',
                ellipsis: true,
                width: 120,
                initialValue: [moment().subtract(1, 'day').startOf('day'), moment().endOf('day')],
                renderFormItem: (item, { fieldProps }, form) => {
                    return <DateRangeTime {...fieldProps} form={form} format="YYYY-MM-DD HH:mm:ss" placeholder={['开始日期', '结束日期']} showTime />;
                },
            },
            {
                title: '告警省份',
                align: 'center',
                dataIndex: 'provinceId',
                hideInTable: true,
                ellipsis: true,
                width: 60,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            allowClear
                            mode="multiple"
                            maxTagCount="responsive"
                            placeholder="全部"
                            onChange={(value) => {
                                this.selectProvince(value);
                            }}
                            optionFilterProp="children"
                        >
                            {allProvinceList.map((item) => {
                                return (
                                    <Select.Option value={item.zoneId} key={item.zoneId} label={item.zoneName}>
                                        {item.zoneName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '告警地市',
                align: 'center',
                dataIndex: 'cityIds',
                hideInTable: true,
                ellipsis: true,
                width: 60,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            placeholder="全部"
                            mode="multiple"
                            defaultValue={[]}
                            maxTagCount="responsive"
                            allowClear
                            optionFilterProp="children"
                        >
                            {regionList.map((item) => {
                                return (
                                    <Select.Option value={item.zoneId} key={item.zoneId} label={item.zoneName}>
                                        {item.zoneName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '省份',
                align: 'center',
                dataIndex: 'provinceName',
                hideInSearch: true,
                width: 60,
                ellipsis: true,
            },
            {
                title: '地市',
                align: 'center',
                dataIndex: 'cityName',
                hideInSearch: true,
                width: 60,
                ellipsis: true,
            },
            {
                title: '专业',
                align: 'center',
                dataIndex: 'professionalTypes',
                ellipsis: true,
                hideInTable: true,
                width: 60,
                renderFormItem: () => {
                    return (
                        <Select showSearch placeholder="全部" mode="multiple" maxTagCount="responsive" allowClear optionFilterProp="children">
                            {professionalList.map((item) => {
                                return (
                                    <Select.Option value={item.key} key={item.key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '专业',
                align: 'center',
                dataIndex: 'professionalTypeName',
                hideInSearch: true,
                ellipsis: true,
                // hideInTable: true,
                width: 60,
            },
            {
                title: '发送号码',
                hideInTable: true,
                dataIndex: 'mobiles',
                align: 'center',
                renderFormItem: () => {
                    return (
                        <Form.Item
                            name="mobiles"
                            label=""
                            rules={[
                                {
                                    validator: async (rule, val, callback) => {
                                        // const reg = new RegExp('^1[3578][0-9]{9}(,1[3578][0-9]{9})*$');
                                        const reg = new RegExp('^[0-9]{0,11}(,[0-9]{0,11})*$');
                                        if (reg.test(val) || !val) {
                                            callback();
                                        } else {
                                            throw new Error('请输入正确格式');
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="请输入完整手机号，多个请用逗号隔开" allowClear />
                        </Form.Item>
                    );
                },
            },

            {
                title: '告警网管ID',
                align: 'center',
                dataIndex: 'standardAlarmId',
                width: 120,
                ellipsis: true,
            },
            {
                title: '发送方式',
                align: 'center',
                hideInSearch: true,
                dataIndex: 'sendWayName',
                width: 100,
                ellipsis: true,
            },
            {
                title: '短信规则名称',
                align: 'center',
                hideInSearch: true,
                dataIndex: 'sendRule',
                width: 120,
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <div
                            onClick={this.showModal.bind(this, record)}
                            title={text}
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: '#1677ff',
                            }}
                        >
                            {text}
                        </div>
                    );
                },
            },
            {
                title: '前转次数',
                align: 'center',
                hideInSearch: true,
                dataIndex: 'sendCount',
                width: 60,
                ellipsis: true,
            },
            {
                title: '发送号码',
                align: 'center',
                dataIndex: 'sendMobiles',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
                render: (text, record) => {
                    try {
                        const mobelList = JSON.parse(record.sendMobiles.replaceAll('，', ',').replaceAll(':', ',')).join(',') || '-';
                        return mobelList;
                    } catch (e) {
                        console.log(e);
                        return '-';
                    }
                },
            },
            {
                title: '发送时间',
                align: 'center',
                dataIndex: 'sendTime',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
            },
            {
                title: '发送正文',
                align: 'center',
                dataIndex: 'sendText',
                hideInTable: true,
                width: 120,
                ellipsis: true,
            },
            {
                title: '发送正文',
                align: 'center',
                dataIndex: 'sendTxt',
                hideInSearch: true,
                width: 120,
                ellipsis: true,
            },
            {
                title: '规则名称',
                align: 'center',
                hideInTable: true,
                dataIndex: 'sendRule',
                width: 120,
            },

            {
                title: '发送方式',
                align: 'center',
                dataIndex: 'sendWays',
                width: 90,
                hideInTable: true,
                ellipsis: true,
                initialValue: 2,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            placeholder="全部"
                            // mode="multiple"
                            maxTagCount="responsive"
                            optionFilterProp="children"
                            onChange={(value) => {
                                this.sendWaysChange(value);
                            }}
                            options={[
                                { label: '自动发送', value: 2 },
                                { label: '人工发送', value: 1 },
                            ]}
                        />
                    );
                },
            },
            {
                title: '规则所属省份',
                align: 'center',
                dataIndex: 'sendRuleProvince',
                hideInTable: true,
                hideInSearch: curSendWays !== 2,
                ellipsis: true,
                width: 60,
                initialValue: sendRuleProvinceId,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            optionFilterProp="children"
                            onChange={(value) => {
                                this.sendRuleProvinceChange(value);
                            }}
                        >
                            {provinceList.map((item) => {
                                return (
                                    <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                        {item.regionName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'sendDetail',
                hideInSearch: true,
                fixed: 'right',
                width: 60,
                align: 'center',
                render: (text, row) => {
                    return (
                        <Tooltip title="查看呼叫详情">
                            <span onClick={this.showModal.bind(this, row)}>
                                <Icon type="SearchOutlined" antdIcon />
                            </span>
                        </Tooltip>
                    );
                },
            },
        ];
        this.setState({ columns });
    };
    showModal = (Row) => {
        console.log(Row);
        // let details: any = [];
        // Row.sendMobiles &&
        //     JSON.parse(Row.sendMobiles).forEach((item) => {
        //         details.push({ phone: item, callTime: Row.sendTime, sendResult: Row.sendResult, sendResultMessage: Row.sendResultMessage });
        //     });
        this.setState({
            visible: true,
            ivrDetails: Row.sendMobilesDetail,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
            ivrDetails: [],
        });
    };
    onExport = () => {
        const { curQueryParams } = this.state;
        const { login } = this.props;
        console.log(curQueryParams);
        if (this.exportRef.current) return;
        this.exportRef.current = true;
        Api.exportIvrRecord({ ...curQueryParams, ...{ userId: login.userId } })
            .then((res) => {
                this.exportRef.current = false;
                // type 为需要导出的文件类型，此处为xls表格类型
                const blob = new Blob([res]);
                // 兼容不同浏览器的URL对象
                const url = window.URL || window.webkitURL;
                // 创建下载链接
                const downloadHref = url.createObjectURL(blob);
                // 创建a标签并为其添加属性
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadHref;
                downloadLink.download = '短信发送记录.xlsx';
                // 触发点击事件执行下载
                downloadLink.click();
            })
            .catch(() => {
                this.exportRef.current = false;
            });
    };

    onExportButtonApiHandle = async () => {
        const { curQueryParams } = this.state;
        const { login } = this.props;
        const params = {
            ...curQueryParams,
            ...{ userId: login.userId },
        };
        const res = await Api.getExportAllFileApi(params);
        if (res.code === 0) {
            this.getExportProgress();
        }
    };

    onExportButtonClick = () => {
        this.getExportProgress();
        this.setState({ exportVisible: true });
    };
    /**
     * 异步导出参考
     */
    getExportProgress = async () => {
        const {
            login: { userId },
        } = this.props;
        const result = await Api.getExportProgressApi({ userId });
        if (result.code === 0 && result.data) {
            const { total, exportTimeStr, progress, status, fileSrc } = result.data;
            const defaultStatus = {
                str: '',
                status: '',
            };
            if (status && progress === 100) {
                defaultStatus.str = '导出完成';
                defaultStatus.status = 'success';
            }
            if (status && progress !== 100) {
                defaultStatus.str = '正在导出';
                defaultStatus.status = 'active';
            }

            if (!status || status === '导出异常') {
                defaultStatus.str = '导出失败';
                defaultStatus.status = 'exception';
            }

            const list = {
                exportFormat: 'Excel',
                exportTime: exportTimeStr,
                exportTotal: total,
                exportState: defaultStatus.str,
                fileName: fileSrc,
                exportSchedule: { status: defaultStatus.status, percent: progress },
            };
            this.setState({
                asyncExportList: [list],
            });
            if (progress < 100 && !this.asyncExportTimer) {
                this.asyncExportTimer = setInterval(() => {
                    this.getExportProgress();
                }, 2000);
            }
            if (progress === 100 || !status) {
                clearInterval(this.asyncExportTimer);
                this.asyncExportTimer = null;
            }
        }
    };
    getList = (params) => {
        const { curSendWays, sendRuleProvinceId, deFaultProvinceId } = this.state;
        const {
            provinceId = [],
            callTime,
            cityIds = [],
            current,
            professionalType = [],
            sendMobiles = '',
            sendRule = '',
            sendTxt = '',
            standardAlarmId = '',
            sendRuleProvince,
            sendWays,
            ...queryParams
        } = params;
        let sendProvinceId = !sendRuleProvinceId || sendRuleProvinceId === '' ? undefined : sendRuleProvinceId;
        if (curSendWays !== 2) {
            sendProvinceId = undefined;
        }
        const data = {
            ...queryParams,
            provinceIds: !provinceId || provinceId?.length === 0 || provinceId === '' ? deFaultProvinceId : provinceId,
            // regionIds: regionId?.join(',') || '',
            // professionalTypes: professionalType || [],
            cityIds: cityIds.length === 0 ? undefined : cityIds,
            pageNum: current,
            professionalType: professionalType.length === 0 ? undefined : professionalType,
            sendMobiles: sendMobiles === '' ? undefined : sendMobiles,
            sendRule: sendRule === '' ? undefined : sendRule,
            sendTxt: sendTxt === '' ? undefined : sendTxt,
            standardAlarmId: standardAlarmId === '' ? undefined : standardAlarmId,
            sendWays: !sendWays || sendWays === '' ? undefined : [sendWays],
            sendRuleProvince: sendProvinceId,
        };
        if (callTime && callTime.length === 2 && callTime[0] && callTime[1]) {
            data.sendTimeBegin = moment(callTime[0]).format('YYYY-MM-DD HH:mm:ss');
            data.sendTimeEnd = moment(callTime[1]).format('YYYY-MM-DD HH:mm:ss');
        } else {
            message.error('请选择发送时间');
            return;
        }
        this.setState({ loading: true, curQueryParams: data });

        return Api.getIvrRecord(data)
            .then((res) => {
                if (res && Array.isArray(res.data)) {
                    this.setState({ loading: false });
                    this.total = res.total;
                    return {
                        success: true,
                        total: res.total,
                        data: res.data,
                    };
                } else {
                    this.setState({ loading: false });

                    return {
                        success: true,
                        total: 0,
                        data: [],
                    };
                }
            })
            .catch(() => {
                this.setState({ loading: false });
                return {
                    success: true,
                    total: 0,
                    data: [],
                };
            });
    };
    onDownLoadHandle = async (record) => {
        const {
            login: { userId },
        } = this.props;
        const params = { userId, fileName: record.fileName };
        const res = await Api.onExport(params);
        blobDownLoad(res, record.fileName);
    };
    onExportModalClose = () => {
        this.setState({ exportVisible: false });
    };

    handleReset = () => {
        if (this.state.curSendWays !== 2) {
            this.setState(
                {
                    curSendWays: 2,
                },
                () => {
                    this.getColumns();
                },
            );
        }
    };

    render() {
        const { columns, loading, visible, ivrDetails, exportVisible, asyncExportList } = this.state;

        return (
            <>
                <div className="ivr-rule-record">
                    <VirtualTable
                        rowKey="num"
                        global={window}
                        tableAlertRender={false}
                        manualRequest={true}
                        loading={loading}
                        scroll={{
                            x: 300,
                        }}
                        search={{
                            span: 6,
                            labelWidth: 80,
                            // collapseRender: false,
                        }}
                        searchCollapsed
                        onReset={this.handleReset}
                        request={this.getList}
                        // options={false}
                        bordered
                        columns={columns}
                        formRef={this.formRef}
                        toolBarRender={() => [
                            <Button
                                key="1"
                                onClick={() => {
                                    if (this.total > 30000) {
                                        this.onExportButtonClick();
                                    } else {
                                        this.onExport();
                                    }
                                }}
                            >
                                <Icon antdIcon type="ExportOutlined" />
                                导出Excel
                            </Button>,
                        ]}
                    />
                </div>

                <AsyncExportModal
                    visible={exportVisible}
                    onExport={() => this.onExportButtonApiHandle()}
                    onClose={() => this.onExportModalClose()}
                    onDownLoad={(record) => this.onDownLoadHandle(record)}
                    total={this.total}
                    exportList={asyncExportList}
                />

                {visible && <Details visible={visible} ivrDetails={ivrDetails} handleCancel={this.handleCancel} />}
            </>
        );
    }
}
export default withModel([useLoginInfoModel], (info) => ({
    login: info[0],
}))(IvrRuleRecord);
