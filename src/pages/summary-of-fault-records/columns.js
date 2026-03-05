import React from 'react';
import { DatePicker, Icon, Tooltip, Select } from 'oss-ui';
import AuthButton from '@Src/components/auth-button';
import AuthButtonNew from '@Pages/components/auth/auth-button';

const { RangePicker } = DatePicker;

const SourceSelect = ({ value, onChange, form }) => {
    const professionalType = form?.getFieldValue?.('professionalType');

    React.useEffect(() => {
        if (professionalType?.length === 1 && professionalType?.[0] === '3') {
            if (value !== '1') {
                onChange?.('1');
            }
        } else {
            if (value !== '') {
                onChange?.('');
            }
        }
    }, [JSON.stringify(professionalType)]);

    const sourceOptions = [
        { value: '', label: '全部' },
        { value: '1', label: '页面录入' },
        { value: '0', label: '系统' },
    ];

    return (
        <Select placeholder="全部" maxTagCount="responsive" optionFilterProp="children" options={sourceOptions} value={value} onChange={onChange} />
    );
};

const getColumns = (props) => {
    const {
        showUserEditViewClick,
        historyViewClick,
        delCurrentUserClick,
        searchTime,
        professionalList,
        professionalType,
        pageTableSize,
        pageCurrent,
        source,
        activeKey,
    } = props;
    const formatRender = (text) => {
        if (typeof text === 'number') {
            return text === 1 ? '是' : '否';
        }
        return text;
    };
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 40,
            render: (text, row, index) => {
                return (pageCurrent - 1) * pageTableSize + index + 1;
            },
        },
        {
            title: '故障等级',
            dataIndex: 'faultLevel',

            ellipsis: false,
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '故障省份',
            dataIndex: 'provinceName',
            ellipsis: false,
            align: 'center',
            width: 80,
        },
        {
            title: '故障地点',
            dataIndex: 'faultLocation',
            search: false,
            align: 'center',
            ellipsis: false,
            width: 100,
        },
        {
            title: '影响系统名称(保护有效)',
            dataIndex: 'effectSystemNameProtectValid',
            search: false,
            align: 'center',
            ellipsis: false,
            width: 160,
        },
        {
            title: '影响系统名称(无保护)',
            dataIndex: 'effectSystemNameNoProtected',
            search: false,
            align: 'center',
            ellipsis: false,
            width: 160,
        },
        {
            title: '影响系统名称(保护失效)',
            dataIndex: 'effectSystemNameProtectLose',
            search: false,
            align: 'center',
            ellipsis: false,
            width: 160,
        },
        {
            title: '故障波道',

            dataIndex: 'faultChannel',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 100,
        },
        {
            title: '承载业务',
            dataIndex: 'bearerService',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 120,
        },
        {
            title: '设备厂商',
            dataIndex: 'deviceVendor',
            search: false,
            align: 'center',
            ellipsis: false,
            width: 100,
        },
        {
            title: '故障开始时间',
            dataIndex: 'faultStartTime',

            ellipsis: true,
            search: false,
            align: 'center',
            width: 140,
        },
        {
            title: '故障结束时间',
            dataIndex: 'faultEndTime',

            ellipsis: true,
            search: false,
            align: 'center',
            width: 140,
        },
        {
            title: '故障临时带通时间',
            dataIndex: 'faultTempTime',

            search: false,
            align: 'center',
            ellipsis: true,
            width: 150,
        },
        {
            title: '故障历时(分钟)',
            dataIndex: 'faultDurationMinutes',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 120,
        },
        {
            title: '是否影响业务',
            dataIndex: 'isEffectBusiness',

            search: false,
            align: 'center',
            ellipsis: false,
            width: 100,
            render: formatRender,
        },
        {
            title: '影响业务历时(分钟)',
            dataIndex: 'effectedBusinessTake',
            search: false,
            align: 'center',
            ellipsis: false,
            width: 150,
        },
        {
            title: '影响专线客户数量(条)',
            dataIndex: 'effectedCustomNum',
            search: false,
            align: 'center',
            ellipsis: false,
            width: 150,
        },
        {
            title: '故障属性',
            dataIndex: 'faultAttribute',

            ellipsis: false,
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '故障原因',
            dataIndex: 'faultReasonStr',
            ellipsis: false,
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '填报人',
            dataIndex: 'informant',

            ellipsis: false,
            search: false,
            align: 'center',
            width: 150,
        },
        {
            title: '班组来源',
            dataIndex: 'groupSource',
            ellipsis: false,
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '是否自动派单',
            dataIndex: 'isAutoDispatchText',

            ellipsis: true,
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '是否及时收到短信',
            dataIndex: 'isSmsIntimeText',

            ellipsis: true,
            search: false,
            align: 'center',
            width: 150,
        },
    ];
    const otherColumns = [
        {
            title: '自动派单存在问题',
            dataIndex: 'problemDispatch',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 150,
        },
        {
            title: 'OTDR测试断点及告警是否正常上报',
            dataIndex: 'isReportedNormally',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 160,
        },
        {
            title: '板卡/光模块',
            dataIndex: 'board',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 100,
        },
        {
            title: '尾纤',
            dataIndex: 'pigtail',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 70,
        },
        {
            title: '法兰盘/衰耗器',
            dataIndex: 'flange',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 110,
        },
        {
            title: '电源',
            dataIndex: 'powerSupply',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 70,
        },
        {
            title: '其他',
            dataIndex: 'other',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 100,
        },
        {
            title: '线路',
            dataIndex: 'line',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 90,
        },
        {
            title: '故障光缆名称',
            dataIndex: 'faultyOpticalCable',
            search: false,
            ellipsis: false,
            align: 'center',
            width: 100,
        },
    ];
    if (activeKey === '0') {
        columns.push(...otherColumns);
    }
    const lastColumns = [
        {
            title: '专业',
            dataIndex: 'profession',

            ellipsis: false,
            align: 'center',
            width: 100,
            search: false,
        },
        {
            title: '专业',
            align: 'center',
            dataIndex: 'professionalType',

            ellipsis: true,
            hideInTable: true,
            width: 60,
            initialValue: professionalType,
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
            title: '工单编号',
            dataIndex: 'sheetNo',

            ellipsis: false,
            search: true,
            align: 'center',
            width: 100,
        },
        {
            title: '来源',
            align: 'center',
            dataIndex: 'source',
            ellipsis: true,
            hideInTable: true,
            width: 60,
            initialValue: source,
            dependencies: ['professionalType'],
            renderFormItem: (_, { type, defaultRender, form, ...rest }, formInstance) => {
                const currentForm = form || formInstance;
                return <SourceSelect form={currentForm} {...rest} />;
            },
        },
        {
            title: '数据来源',
            dataIndex: 'sourceName',

            ellipsis: true,
            search: false,
            align: 'center',
            width: 150,
            render: (text) => {
                return text;
            },
        },
        {
            title: '时间',
            dataIndex: 'searchTime',
            order: 1,
            hideInTable: true,
            valueType: 'dateTimeRange',
            initialValue: searchTime,
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime />;
            },
        },
        /*        {
            title: '影响系统名称',
            dataIndex: 'effectSystem',
            search: false,
            align: 'center',
            ellipsis: true,
            width: 150,
        },
        {
            title: '是否保护',
            dataIndex: 'isProtected',
            search: false,
            align: 'center',
            ellipsis: true,
            width: 100,
            render: formatRender,
        },
        {
            title: '是否保护生效',
            dataIndex: 'isProtectedValid',
            search: false,
            align: 'center',
            ellipsis: true,
            width: 150,
            render: formatRender,
        },
        {
            title: '设备类型',
            dataIndex: 'deviceType',
            search: false,
            ellipsis: true,
            align: 'center',
            width: 100,
        },
        {
            title: '板卡类型',
            dataIndex: 'cardType',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '故障描述',
            dataIndex: 'bearerService',
            search: false,
            align: 'center',
            ellipsis: true,
            width: 100,
        },
        {
            title: '处理结果',
            dataIndex: 'faultReasonDesc',
            search: false,
            align: 'center',
            ellipsis: true,
            width: 100,
        },*/
        {
            title: '操作',
            dataIndex: 'rowKey',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 160,

            fixed: 'right',
            render: (text, row) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Tooltip title="编辑">
                            <AuthButton
                                key="edit"
                                onClick={() => showUserEditViewClick(row, 'edit')}
                                authKey="summaryOfFaultRecords:edit"
                                type="text"
                                antdIcon
                            >
                                <span className="">
                                    <Icon key="userEdit" antdIcon type="EditOutlined" />
                                </span>
                            </AuthButton>
                        </Tooltip>

                        <Tooltip title="查看">
                            <AuthButtonNew
                                key="show"
                                authKey="summary-of-fault-records:Check"
                                ignoreAuth
                                onClick={() => showUserEditViewClick(row, 'view')}
                                type="text"
                            >
                                <span className="">
                                    <Icon key="userEdit" antdIcon type="SearchOutlined" />
                                </span>
                            </AuthButtonNew>
                        </Tooltip>

                        <Tooltip title="故障记录操作历史查看">
                            <AuthButtonNew
                                key="history-view"
                                authKey="summary-of-fault-records:history-view"
                                onClick={() => historyViewClick(row, 'history-view')}
                                type="text"
                                antdIcon
                            >
                                <span>
                                    <Icon key="userHistoryView" antdIcon type="ClockCircleOutlined" />
                                </span>
                            </AuthButtonNew>
                        </Tooltip>

                        <Tooltip title="删除">
                            <AuthButton
                                key="delete"
                                onClick={() => delCurrentUserClick(row)}
                                authKey="summaryOfFaultRecords:delete"
                                type="text"
                                antdIcon
                                addLog
                            >
                                <span>
                                    <Icon key="userDel" antdIcon type="DeleteOutlined" />
                                </span>
                            </AuthButton>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    columns.push(...lastColumns);
    return columns;
};
export default getColumns;
