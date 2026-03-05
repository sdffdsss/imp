import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import { DatePicker, Form, Select, message, Spin } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import DateRangeTime from '@Components/date-range-time';
import { updateWorkingScheduleBatch } from '../api';
import './index.less';
// import { roleSource } from "./util";

const { RangePicker } = DatePicker;
const Index = forwardRef((props, ref) => {
    const { scheduleRes, skipType, skipGroupId } = props;
    const [form] = Form.useForm();
    const userInfo = useLoginInfoModel();
    const [copyRole, handleCopyRole] = useState(['all']);
    const [circle, handleCircle] = useState(0);
    const [loading, handleLoading] = useState(false);
    const [roleSource, handleRoleSource] = useState([{ workShiftName: '全部', workShiftId: 'all' }]);
    const disabledDate = (current, disabledDates) => {
        // Can not select days before today
        return (
            (current && current < moment().startOf('day').subtract('days', -1)) ||
            (current && current > moment().endOf('month').subtract('month', -1).endOf('month')) ||
            (current && form.getFieldsValue().copyDate && current < moment(form.getFieldsValue().copyDate[1]).subtract('days', -1)) ||
            (disabledDates && disabledDates(current))
        );
    };
    const disableCopyDate = (current, disabledDates) => {
        return (
            (current && current > moment().endOf('month').subtract('month', -1).endOf('month')) ||
            (current && form.getFieldsValue().shcedulDate && current > form.getFieldsValue().shcedulDate[0]) ||
            (disabledDates && disabledDates(current))
        );
    };

    const getData = async (param) => {
        const { systemInfo } = userInfo;
        const { provinceId, regionId, groupId, operateUser } = props.curSelParmExport;
        const { handleOk } = props;
        await form?.validateFields();
        const values = form.getFieldsValue();
        if (!values.shcedulDate[0] || !values.shcedulDate[1]) {
            message.warn('请选择批量排班日期');
            return;
        }
        if (!values.copyDate[0] || !values.copyDate[1]) {
            message.warn('请选择复制日期');
            return;
        }
        const params = {
            updateBeginDate: values.shcedulDate[0]?.format('YYYY-MM-DD'),
            updateEndDate: values.shcedulDate[1]?.format('YYYY-MM-DD') || values.shcedulDate[0]?.format('YYYY-MM-DD'),
            copyBeginDate: values.copyDate[0]?.format('YYYY-MM-DD'),
            copyEndDate: values.copyDate[1]?.format('YYYY-MM-DD') || values.copyDate[0]?.format('YYYY-MM-DD'),
            copyTypes: copyRole,
            provinceId,
            regionId,
            groupId,
            operateUser,
            shiftForemanFlag: 0,
        };
        if (skipType === 'header') {
            params.provinceId = Number(systemInfo.currentZone.zoneId);
            params.provinceName = systemInfo.currentZone.zoneName;
            params.groupName = '值班长班组';
            params.shiftForemanFlag = 1;
            params.groupId = skipGroupId;
        }
        if (params.copyTypes?.toString() === 'all') {
            const arr = [];
            roleSource.map((item) => {
                if (item.workShiftId !== 'all') {
                    return arr.push(item.workShiftId);
                }
            });
            delete params.copyTypes;
            params.copyTypes = arr;
        }
        if (circle && circle > 90) {
            return message.error('复制周期不能大于90天');
        }
        if (!params.copyTypes.length) {
            return message.error('请选择排班类型');
        }
        handleLoading(true);
        updateWorkingScheduleBatch(params, param).then((res) => {
            handleLoading(false);
            handleOk(res);
        });
    };

    useImperativeHandle(ref, () => ({
        getData,
    }));

    const handleCopyRoleChange = (e) => {
        if (copyRole && copyRole.toString() === 'all' && e.toString() !== 'all') {
            handleCopyRole(e.filter((item) => item !== 'all'));
            return;
        }
        if (e.find((item) => item === 'all') === 'all') {
            handleCopyRole(['all']);
            return;
        }
        handleCopyRole(e);
    };

    const getCircle = (e) => {
        if (form.getFieldsValue().copyDate && e.copyDate) {
            const star = form.getFieldsValue().copyDate[0];
            const end = form.getFieldsValue().copyDate[1] || form.getFieldsValue().copyDate[0];
            return end && handleCircle(end.diff(star, 'day') + 1);
        }
    };

    useEffect(() => {
        if (scheduleRes && Array.isArray(scheduleRes)) {
            console.log(scheduleRes);
            const a = _.cloneDeep(scheduleRes);
            a.unshift({ workShiftName: '全部', workShiftId: 'all' });
            handleRoleSource(a);
        }
    }, [scheduleRes]);

    return (
        <div style={{ height: '180px' }}>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    onValuesChange={(e) => {
                        getCircle(e);
                    }}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item
                        label="批量排班日期"
                        name="shcedulDate"
                        initialValue={[null, null]}
                        rules={[
                            {
                                required: true,
                                message: '请选择批量排班日期',
                            },
                        ]}
                    >
                        <DateRangeTime format="YYYY-MM-DD" disabledDate={disabledDate} />
                    </Form.Item>
                    <Form.Item
                        label="复制日期"
                        name="copyDate"
                        initialValue={[null, null]}
                        rules={[
                            {
                                required: true,
                                message: '请选择复制日期',
                            },
                        ]}
                    >
                        <DateRangeTime format="YYYY-MM-DD" disabledDate={disableCopyDate} onChange={(val) => console.log(val)} />
                    </Form.Item>
                    <Form.Item label="复制周期" name="copyCircle">
                        {circle ? `${circle}天` : '暂无'}
                    </Form.Item>
                    <Form.Item label="待排班班次" className="copy-role">
                        <Select
                            mode="multiple"
                            value={copyRole}
                            onChange={(e) => {
                                handleCopyRoleChange(e);
                            }}
                            listHeight={105}
                        >
                            {roleSource.map((item) => {
                                return (
                                    <Select.Option value={item.workShiftId} key={item.workShiftId}>
                                        {item.workShiftName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
});

export default Index;
