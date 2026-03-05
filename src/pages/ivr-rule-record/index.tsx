// import React,{useEffect,useState}from 'react';
import React, { PureComponent } from 'react';
import { Select, Form, Input, Tooltip, Icon, Button, message } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { Api } from './api';
import DateRangeTime from '@Components/date-range-time';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import Details from './details';
import './style.less';
interface Props {
    login: {
        userId: any;
        systemInfo: any;
    };
}
interface States {
    provinceList: any[];
    provinceId: string;
    regionList: any[];
    professionalList: any[];
    columns: any[];
    loading: boolean;
    visible: boolean;
    ivrDetails: any[];
    curQueryParams: any;
}
class IvrRuleRecord extends PureComponent<Props, States> {
    formRef: any = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            provinceList: [],
            regionList: [],
            professionalList: [],
            columns: [],
            provinceId: '',
            visible: false,
            ivrDetails: [],
            curQueryParams: {},
        };
    }
    componentDidMount() {
        this.initData();
    }
    initData = () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        Promise.all([Api.getProvinceData(userId), Api.getDictEntry('professional_type', userId)]).then((res) => {
            if (res) {
                let provinceList = res[0] || [];
                provinceList = provinceList.filter((item) =>
                    systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
                );
                const provinceId = provinceList[0]?.regionId;
                const professionalList = res[1]?.data || [];
                Api.getProvinceRegions(provinceId, userId).then((regionList) => {
                    this.setState({ provinceList, regionList, professionalList, provinceId }, () => {
                        this.getColumns();
                        if (this.formRef && this.formRef.current) {
                            this.formRef.current.submit();
                        }
                    });
                });
            }
        });
    };
    selectprovince = (provinceId) => {
        const {
            login: { userId },
        } = this.props;
        Api.getProvinceRegions(provinceId, userId).then((regionList) => {
            this.setState({ regionList, provinceId }, () => {
                this.getColumns();
            });
        });
    };
    getColumns = () => {
        const { provinceList, provinceId, regionList, professionalList } = this.state;
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
                title: '呼叫时间',
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
                title: '省份',
                align: 'center',
                dataIndex: 'provinceId',
                hideInTable: true,
                ellipsis: true,
                width: 60,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            onChange={(value) => {
                                this.selectprovince(value);
                            }}
                            defaultValue={provinceId}
                            optionFilterProp="children"
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
                title: '地市',
                align: 'center',
                dataIndex: 'regionId',
                hideInTable: true,
                ellipsis: true,
                width: 60,
                renderFormItem: () => {
                    return (
                        <Select showSearch placeholder="全部" mode="multiple" maxTagCount="responsive" allowClear optionFilterProp="children">
                            {regionList.map((item) => {
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
                dataIndex: 'regionName',
                hideInSearch: true,
                width: 60,
                ellipsis: true,
            },
            {
                title: '专业',
                align: 'center',
                dataIndex: 'professionalType',
                ellipsis: true,
                // hideInTable: true,
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
                title: '呼叫号码',
                hideInTable: true,
                dataIndex: 'phoneList',
                align: 'center',
                renderFormItem: () => {
                    return (
                        <Form.Item
                            name="phoneList"
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
                title: '呼叫方式',
                align: 'center',
                hideInSearch: true,
                dataIndex: 'ivrType',
                width: 100,
                ellipsis: true,
            },
            {
                title: 'IVR规则名称',
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
                dataIndex: 'sendNum',
                width: 60,
                ellipsis: true,
            },
            {
                title: '呼叫号码',
                align: 'center',
                dataIndex: 'phoneList',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
            },
            {
                title: '呼叫时间',
                align: 'center',
                dataIndex: 'callTime',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
            },
            {
                title: '呼叫正文',
                align: 'center',
                dataIndex: 'callText',
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
                title: '呼叫方式',
                align: 'center',
                dataIndex: 'ivrType',
                width: 90,
                hideInTable: true,
                ellipsis: true,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            placeholder="全部"
                            // mode="multiple"
                            maxTagCount="responsive"
                            allowClear
                            optionFilterProp="children"
                            options={[
                                { label: '自动外呼', value: 1 },
                                { label: '人工外呼', value: 2 },
                            ]}
                        />
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'ivrDetails',
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
        this.setState({
            visible: true,
            ivrDetails: Row.ivrDetails,
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
        Api.exportIvrRecord(curQueryParams).then((res) => {
            // type 为需要导出的文件类型，此处为xls表格类型
            const blob = new Blob([res]);
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL;
            // 创建下载链接
            const downloadHref = url.createObjectURL(blob);
            // 创建a标签并为其添加属性
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadHref;
            downloadLink.download = 'IVR呼叫记录.xlsx';
            // 触发点击事件执行下载
            downloadLink.click();
        });
    };
    getList = (params) => {
        const { provinceId } = this.state;
        const { regionId, professionalType, callTime, ...queryParams } = params;
        const data = {
            ...queryParams,
            provinceId,
            regionIds: regionId?.join(',') || '',
            professionalTypes: professionalType?.join(',') || '',
        };
        if (callTime && callTime.length === 2 && callTime[0] && callTime[1]) {
            data.startCallTime = moment(callTime[0]).format('YYYY-MM-DD HH:mm:ss');
            data.endCallTime = moment(callTime[1]).format('YYYY-MM-DD HH:mm:ss');
        } else {
            message.error('请选择呼叫时间');
            return;
        }
        this.setState({ loading: true, curQueryParams: data });

        return Api.getIvrRecord(data)
            .then((res) => {
                if (res && Array.isArray(res.data)) {
                    this.setState({ loading: false });
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
    render() {
        const { columns, loading, visible, ivrDetails } = this.state;
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
                        // searchCollapsed={false}
                        request={this.getList}
                        // options={false}
                        bordered
                        columns={columns}
                        formRef={this.formRef}
                        toolBarRender={() => [
                            <Button key="1" onClick={this.onExport}>
                                <Icon antdIcon type="ExportOutlined" />
                                导出Excel
                            </Button>,
                        ]}
                    />
                </div>
                {visible && <Details visible={visible} ivrDetails={ivrDetails} handleCancel={this.handleCancel} />}
            </>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(IvrRuleRecord);
