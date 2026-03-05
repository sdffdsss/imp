import React from 'react';
import { Icon, Tooltip, Button, DatePicker, Select, Input } from 'oss-ui';
import AuthButton from '@Components/auth-button';
import AllSelect from '@Src/components/all-select';
import type { ProColumns } from '@ant-design/pro-table';
import { MODAL_TYPE, ALL_ENUMS } from '../type';
import { authData } from '../auth';

const { RangePicker } = DatePicker;
interface Props {
    enums: ALL_ENUMS;
    deleteClick?: (row) => void;
    openModalClick?: (row, type: MODAL_TYPE) => void;
    theme?: string;
}

const getColumns = (props: Props) => {
    const { openModalClick, deleteClick, enums, theme } = props;

    const formColumns: ProColumns<any>[] = [
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTimeForm',
            order: 4,
            hideInTable: true,
            renderFormItem() {
                return <RangePicker placeholder={['起始时间', '结束时间']} showTime={{ format: 'HH:mm:ss' }} />;
            },
        },
        {
            title: '割接专业',
            dataIndex: 'professionTypeForm',
            hideInTable: true,
            order: 3,
            renderFormItem: () => {
                return <AllSelect options={enums.cutoverProfessionEnum} placeholder="全部" />;
            },
        },
        {
            title: '割接分类',
            dataIndex: 'typeForm',
            hideInTable: true,
            order: 2,
            renderFormItem: () => {
                return <Select options={[{ label: '全部', value: '-1' }, ...(enums.cutoverClassificationEnum || [])]} placeholder="全部" />;
            },
        },
        {
            title: '割接专题',
            dataIndex: 'themeForm',
            hideInTable: true,
            order: 1,
            initialValue: theme,
            renderFormItem: () => {
                return <Input placeholder="请输入" />;
            },
        },
    ];

    const renderEnumLabel = (key: string, text: any) => {
        return enums[key]?.find((el: any) => +el.value === +text)?.label || text;
    };
    const columns: ProColumns<any>[] = [
        {
            title: '序号',
            dataIndex: 'INDEX_COLUMN_DATAINDEX',
            align: 'center',
            width: 90,
            search: false,
            render: (_) => _,
        },
        {
            title: '割接主题',
            dataIndex: 'theme',

            align: 'center',
            search: false,
            width: 200,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '割接平台',
            dataIndex: 'cutoverPlatform',
            align: 'center',
            search: false,
            width: 200,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '大区省份',
            dataIndex: 'regionProvince',

            align: 'center',
            search: false,
            width: 200,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '割接专业',
            dataIndex: 'cutoverProfession',
            align: 'center',
            search: false,
            width: 150,
            render: (text) => renderEnumLabel('cutoverProfessionEnum', text),
        },
        {
            title: '割接分类',
            dataIndex: 'cutoverClassification',
            align: 'center',
            search: false,
            width: 150,
            render: (text) => renderEnumLabel('cutoverClassificationEnum', text),
        },
        {
            title: '操作级别',
            dataIndex: 'operateLevel',
            align: 'center',
            search: false,
            width: 150,
            render: (text) => renderEnumLabel('operateLevelEnum', text),
        },
        {
            title: '是否影响业务',
            dataIndex: 'isEffectBusiness',
            align: 'center',
            search: false,
            width: 150,
            render: (text) => renderEnumLabel('isEffectBusinessEnum', text),
        },
        {
            title: '割接开始时间',
            dataIndex: 'cutoverStartTime',
            align: 'center',
            search: false,
            width: 180,
            sorter: true,
        },
        {
            title: '割接结束时间',
            dataIndex: 'cutoverEndTime',

            align: 'center',
            search: false,
            width: 180,
            sorter: true,
        },
        {
            title: '操作人',
            dataIndex: 'operator',

            align: 'center',
            search: false,
            width: 150,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '操作人联系电话',
            dataIndex: 'operatorPhoneNumber',
            align: 'center',
            search: false,
            width: 180,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '记录来源',
            dataIndex: 'recordSource',
            align: 'center',
            search: false,
            width: 150,
            render: (text) => renderEnumLabel('recordSourcePlatformEnum', text),
        },
        {
            title: '工单编号',
            dataIndex: 'sheetNo',
            align: 'center',
            search: false,
            width: 250,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '工程预约',
            dataIndex: 'projectAppointment',

            align: 'center',
            search: false,
            width: 250,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '割接原因描述',
            dataIndex: 'cutoverReasonDesc',
            align: 'center',
            search: false,
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '业务影响描述',
            dataIndex: 'businessEffectDesc',
            align: 'center',
            search: false,
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '创建人',
            dataIndex: 'creator',

            align: 'center',
            search: false,
            width: 150,
        },
        {
            title: '割接是否完成',
            dataIndex: 'cutoverFinishStatus',
            align: 'center',
            search: false,
            width: 150,
            render: (text) => renderEnumLabel('cutoverFinishStatusEnum', text),
        },
        {
            title: '告警情况',
            dataIndex: 'alarmSituation',

            align: 'center',
            search: false,
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '割接确认人',
            dataIndex: 'cutoverAckMan',
            align: 'center',
            search: false,
            width: 150,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '备注',
            dataIndex: 'notes',

            align: 'center',
            search: false,
            width: 380,
            render: (text) => {
                return (
                    <div className="text-ellipsis" title={text as string}>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '割接地点',
            dataIndex: 'cutoverLocation',
            ellipsis: true,
            align: 'center',
            width: 250,
            fieldProps: (form, config) => {
                return {
                    ...config,
                    maxLength: 200,
                };
            },
            search: false,
        },
        {
            title: '是否展示在大屏',
            dataIndex: 'isShowOnBigScreen',
            ellipsis: true,
            align: 'center',
            width: 150,
            render: (_, row) => {
                return row.isShowOnBigScreen === 1 ? '是' : '否';
            },
            search: false,
        },
        {
            title: '割接总结',
            dataIndex: 'cutoverSummary',
            ellipsis: true,
            align: 'center',
            search: false,
            width: 300,
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            align: 'center',
            width: 140,
            fixed: 'right',
            className: 'action-columns',
            render: (text, row) => [
                <Tooltip title="编辑" key="edit">
                    <AuthButton authKey={authData.edit} onClick={() => openModalClick?.(row, MODAL_TYPE.EDIT)} type="text" logFalse>
                        <Icon antdIcon type="EditOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="删除" key="delete">
                    <AuthButton authKey={authData.delete} onClick={() => deleteClick?.(row)} type="text" logFalse>
                        <Icon antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>,
                <Tooltip title="查看" key="show">
                    <Button onClick={() => openModalClick?.(row, MODAL_TYPE.SEARCH)} type="text">
                        <Icon antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>,
            ],
        },
    ];
    return { formColumns, columns };
};

export default getColumns;
