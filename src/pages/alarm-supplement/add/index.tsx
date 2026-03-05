import React, { useEffect, useRef, useState } from 'react';
import { CommonTitle } from '@Components/common-title';
import './index.less';
import { Button, Col, DatePicker, Form, Icon, Input, message, Modal, Popconfirm, Radio, Row, Select, Switch } from 'oss-ui';
import moment from 'moment';
import DateRangeTime from '@Components/date-range-time';
import { filterApi } from '@Common/api/service/filterApi';
import { AlarmSheetJson, AlarmSheetParams, SelectOptionJson } from '@Src/common/interface/interface';
import { VirtualTable } from 'oss-web-common';
import { useHistory, useParams } from 'react-router-dom';
import Cascader from '@Components/form-item/operator-search/condition/cascader';
import defaultConfig from '@Src/pages/search/alarm-query/config/default';
import { supplementApi } from '@Src/common/api/service/supplementApi';
import { useLoading } from '@Src/common/utils/useLoading';
import useLoginInfoModel from '@Src/hox';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import { getUserProvinceName } from '@Common/utils/loginInfo';
import constants from '@Src/common/constants';
import AuthButton from '@Components/auth-button';

export default function AddSupplementTask() {
    const [networkList, setNetworkList] = useState<SelectOptionJson[]>([]);
    const [equipTypeList, setEquipTypeList] = useState<SelectOptionJson[]>([]);
    const [value, setValue] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<AlarmSheetJson[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const cascaderRef: { current: Cascader | null } = useRef();
    const [form] = Form.useForm();
    const history = useHistory();
    const actionRef: any = useRef();
    const login = useLoginInfoModel();
    const params = useParams();

    const columns = [
        {
            title: '省份',
            key: 'provinceName',
            dataIndex: 'provinceName',
        },
        {
            title: '地市',
            key: 'regionName',
            dataIndex: 'regionName',
        },
        {
            title: '区县',
            key: 'cityName',
            dataIndex: 'cityName',
        },
        {
            title: '专业',
            key: 'professionalTypeName',
            dataIndex: 'professionalTypeName',
        },
        {
            title: '对象类型',
            key: 'objectClass',
            dataIndex: 'objectClass',
        },
        {
            title: '工单标题',
            key: 'alarmTitle',
            dataIndex: 'alarmTitle',
            ellipsis: true,
        },
        {
            title: '告警发生时间',
            key: 'eventTime',
            dataIndex: 'eventTime',
        },
        {
            title: '厂家',
            key: 'vendorName',
            dataIndex: 'vendorName',
        },
        {
            title: '清除状态',
            key: 'alarmStatus',
            dataIndex: 'alarmStatus',
        },
        {
            title: '派单状态',
            key: 'sheetSendStatus',
            dataIndex: 'sheetSendStatus',
        },
        {
            title: '派单失败原因',
            key: 'failedReason',
            dataIndex: 'failedReason',
            ellipsis: true,
        },
        {
            title: '网元名称',
            key: 'eqpLabel',
            dataIndex: 'eqpLabel',
            ellipsis: true,
        },
        {
            title: '告警对象名称',
            key: 'neLabel',
            dataIndex: 'neLabel',
            ellipsis: true,
        },
    ];

    const commonTime = [
        {
            label: '近1小时',
            value: 1,
        },
        {
            label: '近2小时',
            value: 2,
        },
        {
            label: '近5小时',
            value: 5,
        },
        {
            label: '近12小时',
            value: 12,
        },
        {
            label: '近1天',
            value: 24,
        },
    ];

    const getNetworkList = async () => {
        const result = await filterApi.getProfessionList();
        setNetworkList(result.map((item) => ({ label: item.value, value: item.key })));
    };

    const [getEquipTypeList, equipLoading] = useLoading(async () => {
        const result = await filterApi.getDictEntry({ modelId: 2, pageSize: 2500, creator: login.userId, dictName: 'object_class' });
        setEquipTypeList(result.map((item) => ({ label: item.value, value: item.key })));
    });

    const getCityValues = (values: AlarmSheetParams) => {
        let { provinceIds, regionIds, cityIds } = values;
        let provinceId = provinceIds?.split(',') || [];
        let regionId = regionIds?.split(',') || [];
        const cityId = cityIds?.split(',') || [];
        const newValue: string[] = [];
        const { options } = cascaderRef.current?.state || {};
        const arr: any[] = [];
        options?.forEach((item: any) => {
            if (item?.children?.length) {
                item.children?.forEach((i: any) => {
                    if (i.children?.length) {
                        i.children.forEach((itm: any) => {
                            arr.push({ ...itm, path: [item.value, i.value, itm.value] });
                        });
                    }
                    arr.push({ ...i, path: [item.value, i.value] });
                });
            }
            arr.push({ ...item, path: [item.value] });
        });

        cityId?.forEach((item) => {
            const target = arr.find((i) => i.value === item);
            if (target) {
                newValue.push(target.path);
                const provinceSet = new Set(provinceId);
                provinceSet.delete(target.path[0]);
                const regionSet = new Set(regionId);
                regionSet.delete(target.path[1]);
                provinceId = Array.from(provinceSet);
                regionId = Array.from(regionSet);
            }
        });

        regionId?.forEach((item) => {
            const target = arr.find((i) => i.value === item);
            if (target) {
                newValue.push(target.path);
                const provinceSet = new Set(provinceId);
                provinceSet.delete(target.path[0]);
                provinceId = Array.from(provinceSet);
            }
        });

        provinceId?.forEach((item) => {
            const target = arr.find((i) => i.value === item);
            if (target) {
                newValue.push(target.path);
            }
        });

        setValue(newValue);
    };

    const getDetail = async () => {
        const result = await supplementApi.getSupplementTaskDetail(params.taskId);
        const { beginFrameTime, endFrameTime, cronTime, alarms, professionalType, objectClass, ...rest } = result;
        let dateTime: any = undefined;
        if (beginFrameTime && endFrameTime) {
            dateTime = [moment(beginFrameTime), moment(endFrameTime)];
        }
        const keys = alarms.map((item) => `${item.fp0}+${item.sheetType}`);
        setSelectedRowKeys(keys);
        const values = {
            ...rest,
            cronTime: cronTime ? moment(cronTime) : undefined,
            dateTime,
            professionalType: professionalType?.split(','),
            objectClass: objectClass?.split(','),
        };
        setDataSource(alarms as any);
        form?.setFieldsValue(values);
        getCityValues(result);
        actionRef.current?.reload();
    };

    useEffect(() => {
        getNetworkList();
        getEquipTypeList();
    }, []);

    const getProvinceInfo = (): any => {
        if (!value.length) {
            const { options } = cascaderRef.current?.state || {};
            if (Array.isArray(options)) {
                return { provinceIds: options.map((item) => item.value).join(',') };
            }
            return { provinceIds: getInitialProvince(login) };
        } else {
            const provinceId = new Set();
            const regionId = new Set();
            const cityId = new Set();

            const deleteProvinceId = new Set();
            const deleteRegionId = new Set();
            value.forEach((item) => {
                if (Array.isArray(item)) {
                    if (item[2]) {
                        cityId.add(item[2]);
                        deleteProvinceId.add(item[0]);
                        deleteRegionId.add(item[1]);
                    } else if (item[1]) {
                        regionId.add(item[1]);
                        deleteProvinceId.add(item[1]);
                    } else if (item[0]) {
                        provinceId.add(item[0]);
                    }
                }
            });
            Array.from(deleteProvinceId).forEach((item) => provinceId.delete(item));
            Array.from(deleteRegionId).forEach((item) => regionId.delete(item));
            const provinceIds = Array.from(provinceId).join(',');
            const regionIds = Array.from(regionId).join(',');
            const cityIds = Array.from(cityId).join(',');
            const result: any = {};
            cityIds && (result.cityIds = cityIds);
            regionIds && (result.regionIds = regionIds);
            provinceIds && (result.provinceIds = provinceIds);
            return result;
        }
    };

    const taskNameValidator = async (rule: any, value: string) => {
        const reg = /^[\(\)a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if (value && !reg.test(value)) {
            throw new Error('仅支持输入中文、英文、数字以及括号、下划线');
        }
    };

    const disabledDate = (current: moment.Moment) => {
        const start = moment().subtract(7, 'days');
        return current.isBefore(start);
    };

    const disabledCronTimeDate = (current: moment.Moment) => {
        const today = moment();
        today.set({ hours: 0, minutes: 0, seconds: 0 });
        return current.isBefore(today);
    };

    const range = (start: number, end: number) => {
        const result: number[] = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    const disabledTime = (date: any) => {
        const hours = moment().hours();
        const minutes = moment().minutes();
        const seconds = moment().seconds();

        if (moment().isSame(date, 'day')) {
            return {
                disabledHours: () => range(0, hours),
                disabledMinutes: () => (date.hours() === hours ? range(0, minutes) : []),
                disabledSeconds: () => (date.hours() === hours && date.minutes() === minutes ? range(0, seconds) : []),
            };
        } else {
            return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
            };
        }
    };

    const onFilterChange = (value: string[]) => {
        form?.setFieldsValue({ professionalType: value, objectClass: [] });
    };

    const selectAll = (field: string, options: SelectOptionJson[]) => {
        const value = form?.getFieldValue(field);
        if (!value || value.length !== options.length) {
            form?.setFieldsValue({ [field]: options.map((item) => item.value) });
        } else {
            form?.setFieldsValue({ [field]: [] });
        }
    };

    const goBack = () => {
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/alarm-supplement`);
    };

    const onCascaderChange = (value: any[]) => {
        setValue(value);
    };

    const onOk = async (authParams: any) => {
        const values = await form?.validateFields();
        if (!selectedRowKeys.length) {
            message.error('请至少选择1条告警');
            return;
        }
        if (!params?.taskId) {
            const result = await supplementApi.checkTaskName(values?.taskName, getInitialProvince(login));
            if (!result) {
                message.error('此任务名已存在，请修改');
                return;
            }
        }

        const { cronTime, dateTime, professionalType, objectClass, ...rest } = values;
        let beginFrameTime = undefined;
        let endFrameTime = undefined;
        let factBeginTime: string | undefined = undefined;
        if (dateTime && dateTime[0]) {
            beginFrameTime = dateTime[0]?.format('YYYY-MM-DD HH:mm:ss');
        }
        if (dateTime && dateTime[1]) {
            endFrameTime = dateTime[1]?.format('YYYY-MM-DD HH:mm:ss');
        }

        if (!values?.eventTimeFlag) {
            factBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        const alarms = selectedRowKeys.map((item) => {
            const target = dataSource.find((i) => i.uniqId === item);
            const { fp0, fp1, fp2, fp3, sheetType, sendVersion } = target || {};
            return { fp0, fp1, fp2, fp3, sheetType, sendVersion };
        });

        const param: AlarmSheetParams = {
            ...rest,
            provinceName: getUserProvinceName(login),
            ...getProvinceInfo(),
            provinceId: getInitialProvince(login),
            cronTime: cronTime ? cronTime.format('YYYY-MM-DD HH:mm:ss') : null,
            beginFrameTime,
            endFrameTime,
            factBeginTime,
            professionalType: professionalType?.join(','),
            objectClass: objectClass?.join(','),
            operateUser: login.userId,
            alarms,
        };

        if (params?.taskId) {
            param.taskId = params.taskId;
        }

        await supplementApi.saveSupplementTask(param, authParams);

        goBack();
    };

    const renderTitleRight = () => {
        return (
            <div style={{ height: 15 }}>
                <AuthButton type="primary" onClick={onOk} authKey={params?.taskId ? 'alarmSupplement:edit' : 'alarmSupplement:add'}>
                    完成
                </AuthButton>
                <Popconfirm title="是否确认返回任务管理列表？" onConfirm={goBack}>
                    <Button style={{ marginLeft: 10 }}>返回</Button>
                </Popconfirm>
            </div>
        );
    };

    const [tableRequest, tableLoading] = useLoading(async ({ pageSize, current }) => {
        const values = form?.getFieldsValue();
        const { dateTime, eventTimeFlag, professionalType, objectClass, factBeginTime, ...rest } = values;
        let beginFrameTime = undefined;
        let endFrameTime = undefined;
        if (dateTime && dateTime[0]) {
            beginFrameTime = dateTime[0]?.format('YYYY-MM-DD HH:mm:ss');
        }
        if (dateTime && dateTime[1]) {
            endFrameTime = dateTime[1]?.format('YYYY-MM-DD HH:mm:ss');
        }

        const param = {
            pageSize,
            pageNum: current,
            endFrameTime,
            beginFrameTime,
            factBeginTime: !eventTimeFlag ? factBeginTime : undefined,
            eventTimeFlag,
            professionalType: professionalType?.join(','),
            objectClass: objectClass?.join(','),
            provinceId: getInitialProvince(login),
            ...getProvinceInfo(),
            taskId: params?.taskId,
            ...rest,
        };

        const result = await supplementApi.getAlarmSheetInfo(param);
        const { rows, total } = result;
        const data = rows.map((item) => ({ ...item, uniqId: `${item.fp0}+${item.sheetType}` }));
        setDataSource(dataSource.concat(data));
        return { data, total };
    });

    const reload = () => {
        actionRef.current?.reloadAndRest();
    };

    const onSearch = () => {
        if (selectedRowKeys.length) {
            Modal.confirm({
                title: '提示',
                content: '查询条件已改变，已选告警将被清空，是否继续查询？',
                onOk: reload,
            });
        } else {
            reload();
        }
    };

    const setRowKeys = (keys: string[]) => {
        setSelectedRowKeys(keys.slice(0, 1000));
    };

    const onTableChange = (record: AlarmSheetJson, selected: boolean) => {
        const result = getSelectedRow(record, selected);
        setRowKeys(result);
    };

    const onTableChangeAll = (selected: boolean, selectedRows: AlarmSheetJson, changeRows: AlarmSheetJson) => {
        const result = getSelectedRow(changeRows, selected);
        setRowKeys(result);
    };

    const getSelectedRow = (record: AlarmSheetJson | AlarmSheetJson[], selected: boolean) => {
        const set = new Set(selectedRowKeys);
        const records = Array.isArray(record) ? record : [record];
        records.forEach((item) => {
            if (selected) {
                set.add(item.uniqId);
            } else {
                set.delete(item.uniqId);
            }
        });
        return Array.from(set);
    };

    const getRef = (ref: Cascader) => {
        cascaderRef.current = ref;
        if (params?.taskId) {
            getDetail();
        } else {
            reload();
        }
    };

    return (
        <div className="alarm-supplement-add">
            <Form form={form} labelCol={{ span: 6 }}>
                <CommonTitle title="任务设置" renderRight={renderTitleRight} />
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item
                            label="任务名称"
                            name="taskName"
                            rules={[
                                { required: true, message: '请输入任务名称' },
                                { max: 20, type: 'string', message: '长度不能超过20个字符' },
                                { validator: taskNameValidator },
                            ]}
                        >
                            <Input disabled={!!params?.taskId} />
                        </Form.Item>
                    </Col>
                    <Form.Item name="factBeginTime" style={{ display: 'none' }} initialValue={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <Input />
                    </Form.Item>
                    <Col>
                        <Form.Item
                            required
                            label="定时执行"
                            name="cronFlag"
                            initialValue={0}
                            labelCol={{ span: 14 }}
                            getValueFromEvent={(checked) => (checked ? 1 : 0)}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.cronFlag !== currentValues.cronFlag}>
                            {({ getFieldValue }) =>
                                getFieldValue('cronFlag') ? (
                                    <Form.Item name="cronTime" initialValue={moment()} rules={[{ required: true, message: '请选择执行时间' }]}>
                                        <DatePicker showTime disabledDate={disabledCronTimeDate} disabledTime={disabledTime} />
                                    </Form.Item>
                                ) : null
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <CommonTitle title="选择告警" />
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item label="发生时间" name="eventTimeFlag" initialValue={0}>
                            <Radio.Group disabled={!!params?.taskId}>
                                <Radio key={0} value={0}>
                                    时间段
                                </Radio>
                                <Radio key={1} value={1}>
                                    时间范围
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.eventTimeFlag !== currentValues.eventTimeFlag}>
                            {({ getFieldValue }) =>
                                getFieldValue('eventTimeFlag') === 0 ? (
                                    <Form.Item label="常用" name="timeSlot" initialValue={1}>
                                        <Select disabled={!!params?.taskId} style={{ width: '100%' }} options={commonTime} />
                                    </Form.Item>
                                ) : (
                                    <Form.Item name="dateTime" label="时间范围">
                                        <DateRangeTime
                                            showTime
                                            disabled={!!params?.taskId}
                                            format={'YYYY-MM-DD HH:mm:ss'}
                                            disabledDate={disabledDate}
                                        />
                                    </Form.Item>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button disabled={!!params?.taskId} onClick={onSearch} loading={tableLoading}>
                            查询
                        </Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item label="省市区">
                            <Cascader
                                getRef={getRef}
                                mapperId={defaultConfig.mapperId}
                                operatorValue={{ value }}
                                onChange={onCascaderChange}
                                disabled={!!params?.taskId}
                                fieldSql="alarmSearch_selectProvinceRegionCity"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.professionalType !== currentValues.professionalType}
                        >
                            {({ getFieldValue }) => (
                                <Form.Item label="专业" name="professionalType">
                                    <Select
                                        showSearch
                                        allowClear
                                        mode="multiple"
                                        options={networkList}
                                        optionFilterProp="label"
                                        style={{ width: '100%' }}
                                        disabled={!!params?.taskId}
                                        placeholder="全部"
                                        onChange={onFilterChange}
                                        maxTagCount={3}
                                        dropdownRender={(menu) => (
                                            <div>
                                                <div
                                                    className="supplement-select-all"
                                                    style={
                                                        getFieldValue('professionalType')?.length === networkList.length
                                                            ? { background: '#e6f7ff', fontWeight: 'bold' }
                                                            : {}
                                                    }
                                                    onClick={selectAll.bind(undefined, 'professionalType', networkList)}
                                                >
                                                    全部
                                                    {getFieldValue('professionalType')?.length === networkList.length ? (
                                                        <Icon antdIcon type="CheckOutlined" style={{ color: '#1890ff' }} />
                                                    ) : null}
                                                </div>
                                                {menu}
                                            </div>
                                        )}
                                    />
                                </Form.Item>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.objectClass !== currentValues.objectClass}>
                            {({ getFieldValue }) => (
                                <Form.Item label="对象类型" name="objectClass">
                                    <Select
                                        showSearch
                                        allowClear
                                        mode="multiple"
                                        maxTagCount={3}
                                        options={equipTypeList}
                                        optionFilterProp="label"
                                        style={{ width: '100%' }}
                                        loading={equipLoading}
                                        disabled={!!params?.taskId}
                                        placeholder="全部"
                                        dropdownRender={(menu) => (
                                            <div>
                                                <div
                                                    className="supplement-select-all"
                                                    style={
                                                        getFieldValue('objectClass')?.length === equipTypeList.length
                                                            ? { background: '#e6f7ff', fontWeight: 'bold' }
                                                            : {}
                                                    }
                                                    onClick={selectAll.bind(undefined, 'objectClass', equipTypeList)}
                                                >
                                                    全部
                                                    {getFieldValue('objectClass')?.length === equipTypeList.length ? (
                                                        <Icon antdIcon type="CheckOutlined" style={{ color: '#1890ff' }} />
                                                    ) : null}
                                                </div>
                                                {menu}
                                            </div>
                                        )}
                                    />
                                </Form.Item>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="工单标题" name="alarmTitle">
                            <Input allowClear disabled={!!params?.taskId} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <VirtualTable
                search={false}
                manualRequest
                global={window}
                columns={columns}
                request={tableRequest}
                actionRef={actionRef}
                pagination={{ defaultPageSize: 50 }}
                rowKey="uniqId"
                rowSelection={{
                    selectedRowKeys,
                    onSelect: onTableChange,
                    onSelectAll: onTableChangeAll,
                }}
            />
            <span style={{ marginLeft: 10 }}>{selectedRowKeys.length ? `已选：${selectedRowKeys.length}/1000 (最多选择1000条告警)` : ' '}</span>
        </div>
    );
}
