import React from 'react';
import { DatePicker, Icon, Tooltip, Select } from 'oss-ui';
import AuthButtonNew from '@Pages/components/auth/auth-button';
import ApproveIcon from './images/card-approve-old.png';
import ReadIcon from './images/card-read.png';

const { RangePicker } = DatePicker;

const getColumns = (props) => {
    const { showUserEditViewClick, professionalList, pageTableSize, pageCurrent, provinceId, activeKey } = props;
    const getBtnImg = (key) => {
        let img = '';
        switch (key) {
            case 'majorFaultReport:firstReportApplication':
            case 'majorFaultReport:supplementalReportApplication':
            case 'majorFaultReport:supplementalReport':
            case 'majorFaultReport:progressReportSupplementalApplication':
            case 'majorFaultReport:progressReportSupplemental':
            case 'faultReport:upload':
            case 'majorFaultReport:upload':
                img = <Icon antdIcon type="PlusCircleOutlined" />;
                break;
            case 'majorFaultReport:firstReportEditApplication':
            case 'majorFaultReport:firstReportEdit':
            case 'majorFaultReport:progressReportEditApplication':
            case 'majorFaultReport:progressReportEdit':
            case 'majorFaultReport:finalReportEditApplication':
            case 'majorFaultReport:finalReportEdit':
                img = <Icon antdIcon type="EditOutlined" />;
                break;
            case 'majorFaultReport:firstReportApprove':
            case 'majorFaultReport:firstReportEditApprove':
            case 'majorFaultReport:progressReportApprove':
            case 'majorFaultReport:progressReportEditApprove':
            case 'majorFaultReport:finalReportApprove':
            case 'majorFaultReport:finalReportEditApprove':
                img = <img src={ApproveIcon} alt="" style={{ width: 12, height: 12, marginTop: -3 }} />;
                break;
            case 'faultReport:view':
            case 'majorFaultReport:view':
                img = <Icon antdIcon type="SearchOutlined" />;
                break;
            default:
                break;
        }
        return img;
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
            title: '故障主题',
            dataIndex: 'topic',
            ellipsis: false,
            align: 'center',
            width: 100,
        },
        {
            title: '专业',
            dataIndex: 'professionalTypeName',
            ellipsis: false,
            align: 'center',
            search: false,
            width: 80,
        },
        {
            title: '专业',
            align: 'center',
            dataIndex: 'professionalType',
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
            title: '省份',
            dataIndex: 'provinceName',
            ellipsis: false,
            align: 'center',
            search: false,
            width: 80,
        },

        {
            title: '故障发生时间',
            dataIndex: 'failureTime',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 140,
        },
        {
            title: '故障发生时间',
            dataIndex: 'searchTime',
            hideInTable: true,
            valueType: 'dateTimeRange',
            renderFormItem: () => {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime />;
            },
        },
        {
            title: '故障来源',
            dataIndex: 'sourceName',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 100,
        },
        {
            title: '状态',
            dataIndex: 'statusName',
            ellipsis: true,
            search: false,
            align: 'center',
            width: 150,
        },
        {
            title: '操作',
            dataIndex: 'rowKey',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 160,

            fixed: 'right',
            render: (text, row) => {
                const syncDisabled =
                    row.latestContinueType !== '终报' ||
                    row.syncState !== 0 ||
                    row.specialty === '16' ||
                    (provinceId === '0' && row.province !== provinceId);
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {row?.buttonList?.map((item) => {
                            const keyArr = item?.split('|');
                            return keyArr?.length === 2 ? (
                                <Tooltip title={keyArr[1]}>
                                    <AuthButtonNew
                                        key={keyArr[0]}
                                        onClick={() => showUserEditViewClick(row, keyArr[0], keyArr[1])}
                                        authKey={keyArr[0]}
                                        ignoreAuth
                                        type="text"
                                        antdIcon
                                    >
                                        {getBtnImg(keyArr[0])}
                                    </AuthButtonNew>
                                </Tooltip>
                            ) : (
                                ''
                            );
                        })}
                    </div>
                );
            },
        },
    ];
    return columns;
};
export default getColumns;
