import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Select, Input, Button, Table, Radio, message } from 'oss-ui';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { getEnumApi, searchSheetNoApi } from '../api';
import './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SheetSelectModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (selectedSheet: any) => void;
    provinceOptions?: any[];
}

const SheetSelectModal: React.FC<SheetSelectModalProps> = ({ visible, onCancel, onConfirm, provinceOptions = [] }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [sheetList, setSheetList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<any>(null);
    const [enums, setEnums] = useState<any>({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });

    const { userZoneInfo, zoneLevelFlags, currentZone } = useLoginInfoModel();

    // 根据用户账号类型设置省份下拉的默认选中
    useEffect(() => {
        // 早期返回条件检查
        if (!visible || !currentZone || !provinceOptions.length) return;

        // 统一账号类型判断
        const zoneLevel = String(currentZone.zoneLevel);

        // 统一的值获取函数，确保与Option组件value一致
        const getOptionValue = (item: any) => (item.zoneId !== undefined ? item.zoneId : item.value);

        // 统一的省份匹配函数，支持多种数据类型
        const findProvinceMatch = (targetId: any) =>
            provinceOptions.find((item) => item.zoneId === targetId || item.value === targetId || String(item.zoneId) === String(targetId));

        // 设置表单值的统一函数
        const setProvinceValue = (option: any) => {
            if (option) {
                const setValue = getOptionValue(option);
                form.setFieldsValue({ provinceName: setValue });
            }
        };

        // 根据账号类型执行对应逻辑
        switch (zoneLevel) {
            case '1': // 集团账号
                if (provinceOptions.length > 0) {
                    const firstOption = provinceOptions[0];
                    // 使用setTimeout确保DOM渲染完成后再设置值
                    setTimeout(() => setProvinceValue(firstOption), 0);
                }
                break;

            case '2': // 省份账号
                const currentProvinceOption = findProvinceMatch(currentZone.zoneId);
                setProvinceValue(currentProvinceOption);
                break;

            case '3': // 地市账号
                const parentProvinceOption = findProvinceMatch(currentZone.parentId);
                setProvinceValue(parentProvinceOption);
                break;
        }
    }, [visible, currentZone, provinceOptions, form]);

    // 获取枚举数据
    const getEnums = async () => {
        try {
            const result = await getEnumApi(['eomsProfessionalType', 'eomsSheetType']);
            if (result.code === 200) {
                setEnums(result.data);
                // 设置专业默认值为第一个
                if (result.data.eomsProfessionalType && result.data.eomsProfessionalType.length > 0) {
                    // 设置工单来源默认值为集团工单
                    const groupSheetItem = result.data.eomsSheetType?.find((item: any) => item.value === '集团工单' || item.key === 'group');
                    form.setFieldsValue({
                        professional: result.data.eomsProfessionalType[0].key,
                        sheetSource: groupSheetItem ? groupSheetItem.key : result.data.eomsSheetType?.[0]?.key,
                    });
                }
            }
        } catch (error) {
            console.error('获取枚举数据失败:', error);
        }
    };

    // 获取工单列表
    const getSheetList = async (params: any = {}) => {
        setLoading(true);
        try {
            const formValues = form.getFieldsValue();
            const searchParams = {
                pageIndex: params.current || pagination.current,
                pageSize: params.pageSize || pagination.pageSize,
                startTime: formValues.dispatchTime?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
                endTime: formValues.dispatchTime?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
                professionalType: formValues.professional,
                eomsSheetType: formValues.sheetSource,
                sheetTitleOrNoKeyword: formValues.keyword,
                provinceName: (() => {
                    // 从provinceOptions中查找对应的省份，使用与显示相同的字段逻辑
                    if (formValues.provinceName) {
                        const province = provinceOptions.find(
                            (item: any) => item.zoneId === formValues.provinceName || item.value === formValues.provinceName,
                        );
                        return province ? province.zoneName || province.label : formValues.provinceName;
                    }
                    return formValues.provinceName || '集团';
                })(), // 使用表单选择的省份
            };

            const result = await searchSheetNoApi(searchParams);
            if (result.code === 200) {
                setSheetList(result.data || []);
                setPagination({
                    current: params.current || pagination.current,
                    pageSize: params.pageSize || pagination.pageSize,
                    total: result.total || 0,
                });
            }
        } catch (error: any) {
            console.error('获取工单列表失败:', error);
            const errorMessage = error?.data?.message || error?.response?.data?.message || error?.message || '网络请求失败，请稍后重试';
            message.warning(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 搜索
    const handleSearch = () => {
        setPagination({ ...pagination, current: 1 });
        getSheetList({ current: 1 });
    };

    // 重置
    const handleReset = () => {
        form.resetFields();
        // 重新设置默认值
        if (enums.eomsProfessionalType && enums.eomsProfessionalType.length > 0) {
            // 设置工单来源默认值为集团工单
            const groupSheetItem = enums.eomsSheetType?.find((item: any) => item.value === '集团工单' || item.key === 'group');
            form.setFieldsValue({
                professional: enums.eomsProfessionalType[0].key,
                sheetSource: groupSheetItem ? groupSheetItem.key : enums.eomsSheetType?.[0]?.key,
                dispatchTime: [moment().subtract(7, 'days'), moment()], // 默认最近7天
            });
        }
        setPagination({ ...pagination, current: 1 });
        getSheetList({ current: 1 });
    };

    // 表格列配置
    const columns = [
        {
            title: '工单编号',
            dataIndex: 'sheetNo',
            key: 'sheetNo',
            width: 150,
        },
        {
            title: '工单主题',
            dataIndex: 'sheetTitle',
            key: 'sheetTitle',
            width: 200,
        },
        {
            title: '专业',
            dataIndex: 'professionalTypeName',
            key: 'professionalTypeName',
            width: 100,
        },
        {
            title: '工单状态',
            dataIndex: 'sheetStatus',
            key: 'sheetStatus',
            width: 100,
        },
        {
            title: '派单时间',
            dataIndex: 'sheetCreateTime',
            key: 'sheetCreateTime',
            width: 150,
            sorter: (a, b) => new Date(a.sheetCreateTime).getTime() - new Date(b.sheetCreateTime).getTime(),
            defaultSortOrder: 'descend' as const,
        },
    ];

    // 行选择配置
    const rowSelection = {
        type: 'radio' as const,
        selectedRowKeys,
        onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedSheet(selectedRows[0] || null);
        },
    };

    // 表格分页变化
    const handleTableChange = (page: any) => {
        const newPagination = { ...pagination, current: page.current, pageSize: page.pageSize };
        setPagination(newPagination);
        getSheetList({ current: page.current, pageSize: page.pageSize });
    };

    // 确认选择
    const handleConfirm = () => {
        if (!selectedSheet) {
            message.warning('请选择一个工单');
            return;
        }
        // 直接返回选中的工单，所有校验逻辑交给父组件处理
        onConfirm(selectedSheet);
        handleCancel();
    };

    // 取消
    const handleCancel = () => {
        setSelectedRowKeys([]);
        setSelectedSheet(null);
        form.resetFields();
        onCancel();
    };

    useEffect(() => {
        if (visible) {
            getEnums();
            // 设置默认值
            form.setFieldsValue({
                dispatchTime: [moment().subtract(7, 'days'), moment()], // 默认最近7天
            });
        }
    }, [visible]);

    useEffect(() => {
        if (visible && Object.keys(enums).length > 0) {
            handleSearch();
        }
    }, [visible, enums]);

    return (
        <Modal
            title="选择工单"
            visible={visible}
            onCancel={handleCancel}
            width={1260}
            footer={[
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <Button key="cancel" onClick={handleCancel} style={{ marginRight: 16 }}>
                        取消
                    </Button>
                    <Button key="confirm" type="primary" onClick={handleConfirm}>
                        确认
                    </Button>
                </div>,
            ]}
        >
            <div className="sheet-select-modal">
                <Form form={form} layout="inline" className="search-form">
                    <Form.Item label="派单时间" name="dispatchTime" style={{ marginRight: 16 }}>
                        <RangePicker
                            showTime={{ format: 'HH:mm:ss' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder={['开始时间', '结束时间']}
                            style={{ width: 280 }}
                        />
                    </Form.Item>
                    <Form.Item label="专业" name="professional" style={{ marginRight: 16 }}>
                        <Select style={{ width: 120 }} placeholder="请选择">
                            {enums.eomsProfessionalType?.map((item: any) => (
                                <Option key={item.key} value={item.key}>
                                    {item.value}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="工单来源" name="sheetSource" style={{ marginRight: 16 }}>
                        <Select style={{ width: 120 }} placeholder="请选择">
                            {enums.eomsSheetType?.map((item: any) => (
                                <Option key={item.key} value={item.key}>
                                    {item.value}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="关键字" name="keyword" style={{ marginRight: 16 }}>
                        <Input placeholder="工单编号或工单主题" style={{ width: 120 }} />
                    </Form.Item>
                    <Form.Item label="省份" name="provinceName" style={{ marginRight: 16 }}>
                        <Select style={{ width: 120 }} placeholder="请选择">
                            {provinceOptions.map((item: any) => {
                                // 确保value与useEffect中设置的值完全一致
                                const optionValue = item.zoneId !== undefined ? item.zoneId : item.value;
                                return (
                                    <Option key={optionValue} value={optionValue}>
                                        {item.zoneName || item.label}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleSearch} style={{ marginRight: 8 }}>
                            搜索
                        </Button>
                        <Button onClick={handleReset}>重置</Button>
                    </Form.Item>
                </Form>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={sheetList}
                    loading={loading}
                    rowKey={(record) => record.sheetNo || record.id || Math.random().toString()}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条`,
                    }}
                    onChange={handleTableChange}
                    size="small"
                />
            </div>
        </Modal>
    );
};

export default SheetSelectModal;
