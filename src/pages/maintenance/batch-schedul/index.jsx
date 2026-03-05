import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form, Select, message, Spin } from 'oss-ui';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import moment from 'moment';
import './index.less';
// import { roleSource } from './util';
import DateRangeTime from '@Components/date-range-time';
import api from '../api';

// const { RangePicker } = DatePicker;
const Index = forwardRef((props, ref) => {
    const { regionList } = props;
    const [form] = Form.useForm();
    const [copyRole, handleCopyRole] = useState(['all']);
    const [regionId, handleRegionId] = useState(['-1']);
    const [circle, handleCircle] = useState(0);
    const [loading, handleLoading] = useState(false);
    const [isToday, handleIsToday] = useState(false);
    const [cityList, handleCityList] = useState([]);
    const [roleSource, setRoleSource] = useState([]);

    const disabledDate = (current, disabledDates) => {
        return (
            (current && current < moment().startOf('day')) ||
            (current && current > moment().subtract('month', -1).endOf('month')) ||
            (current &&
                form.getFieldsValue().copyDate &&
                moment(current).format('YYYY-MM-DD') <= moment(form.getFieldsValue()?.copyDate[1])?.format('YYYY-MM-DD')) ||
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

    const getLogContext = (params) => {
        let logStr = '';
        logStr = `班组名称：${params?.ruleType}\n`;
        let regionNameStr = '';
        params?.regionIds?.forEach((item) => {
            if (String(item) === '-1') {
                regionNameStr += '全部、';
            } else {
                const region = regionList?.find((r) => String(r.regionId) === String(item));
                if (region) {
                    regionNameStr += `${region.regionName}、`;
                }
            }
        });
        regionNameStr = regionNameStr.slice(0, -1);
        let roles = '';
        params?.copyRoles?.forEach((item) => {
            const roleName = roleSource?.find((r) => String(r.id) === String(item))?.name;
            roles += `${roleName}、`;
        });
        roles = roles.slice(0, -1);
        logStr += `归属地市：${regionNameStr}\n批量排班开始日期：${params?.updateBeginDate}\n批量排班结束日期：${params?.updateEndDate}\n复制开始日期：${params?.copyBeginDate}\n复制结束日期：${params?.copyEndDate}\n复制周期：${circle}天\n复制角色：${roles}`;

        return logStr;
    };

    const getData = async (param) => {
        const { professional, province, region, team } = props.curSelParmExport;
        const { handleOk, mteamInfo, userId } = props;
        await form?.validateFields();
        const values = form.getFieldsValue();
        if (!values?.shcedulDate[1] || !values?.copyDate[1]) {
            return message.warn('请完善结束日期');
        }
        if (!values?.shcedulDate[0] || !values?.copyDate[0]) {
            return message.warn('请完善开始日期');
        }
        const params = {
            updateBeginDate: values.shcedulDate[0]?.format('YYYY-MM-DD'),
            updateEndDate: values.shcedulDate[1]?.format('YYYY-MM-DD') || values.shcedulDate[0]?.format('YYYY-MM-DD'),
            copyBeginDate: values.copyDate[0]?.format('YYYY-MM-DD'),
            copyEndDate: values.copyDate[1]?.format('YYYY-MM-DD') || values.copyDate[0]?.format('YYYY-MM-DD'),
            copyRoles: copyRole,
            provinceId: province?.regionId || mteamInfo?.provinceId,
            regionIds: regionId || mteamInfo?.regionId,
            professionalType: professional?.key || mteamInfo?.professionalId?.toString(),
            ruleType: team?.name || mteamInfo?.mteamName,
            operator: userId,
        };
        if (circle && circle > 62) {
            return message.error('复制周期不能大于62天');
        }
        if (!params.copyRoles.length) {
            return message.error('请选择专业');
        }
        handleLoading(true);
        api.updateWorkingScheduleBatch(params, param).then((res) => {
            handleLoading(false);
            const logStr = getLogContext(params);
            sendLogFn({ authKey: 'maintenanceConf:batchPushTrue', logContext: logStr });
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

    const handleRegionIdChange = (e) => {
        if (regionId && regionId.toString() === '-1' && e.toString() !== '-1') {
            handleRegionId(e.filter((item) => item !== '-1'));
            return;
        }
        if (e.find((item) => item === '-1') === '-1') {
            handleRegionId(['-1']);
            return;
        }
        handleRegionId(e);
    };

    const getCircle = (e) => {
        if (form.getFieldValue('shcedulDate') && form.getFieldsValue().shcedulDate[0] && form.getFieldsValue().shcedulDate[1]) {
            const shcedulDateStart = moment(form.getFieldsValue().shcedulDate[0]).format('YYYY-MM-DD');
            const shcedulDateEnd = moment(form.getFieldsValue().shcedulDate[1]).format('YYYY-MM-DD');
            if (
                moment(moment().format('YYYY-MM-DD')).isSameOrAfter(shcedulDateStart) &&
                moment(moment().format('YYYY-MM-DD')).isSameOrBefore(shcedulDateEnd)
            ) {
                console.log(1);
                handleIsToday(true);
            } else {
                handleIsToday(false);
            }
        } else {
            handleIsToday(false);
        }
        if (form.getFieldsValue().copyDate && e.copyDate) {
            const star = form.getFieldsValue().copyDate[0];
            const end = form.getFieldsValue().copyDate[1] || form.getFieldsValue().copyDate[0];
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            end && handleCircle(end.diff(star, 'day') + 1);
        }
    };
    const getwarningMessage = () => {
        if (moment().isSameOrBefore(moment().format('YYYY-MM-DD 07:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日9点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 07:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 12:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日14点开始生效';
        } else if (moment().isAfter(moment().format('YYYY-MM-DD 12:00:00')) && moment().isSameOrBefore(moment().format('YYYY-MM-DD 17:00:00'))) {
            return '此刻修改今日排班，不会立即生效，将于今日18点开始生效';
        } else {
            return '此刻修改今日排班，不会立即生效，将于明日9点开始生效';
        }
    };

    useEffect(() => {
        const { region } = props.curSelParmExport;
        // handleRegionId([region?.regionId])
        const newArr = [
            {
                regionId: '-1',
                regionName: '全部',
            },
        ];
        if (Array.isArray(regionList)) {
            regionList.map((item) => {
                newArr.push(item);
            });
        }
        handleCityList(newArr);
    }, [regionList, props.curSelParmExport]);

    useEffect(() => {
        api.getRolesDictionary().then((res) => {
            if (res?.data?.length) {
                const newArr = [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: 'day',
                        name: 'A角（白班）',
                    },
                    {
                        id: 'night',
                        name: 'A角（夜班）',
                    },
                    ...res.data
                        .filter((item) => item.dCode !== 'day')
                        .map((item) => {
                            return {
                                id: item.dCode,
                                name: item.dName,
                            };
                        }),
                ];
                setRoleSource(newArr);
            }
        });
    }, []);

    return (
        <div>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    onValuesChange={(e) => {
                        getCircle(e);
                    }}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item className="copy-role" label="归属地市">
                        <Select
                            value={regionId}
                            onChange={(e) => {
                                handleRegionIdChange(e);
                            }}
                            mode="multiple"
                        >
                            {cityList.map((item) => {
                                return (
                                    <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                        {item.regionName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="批量排班日期"
                        name="shcedulDate"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DateRangeTime format="YYYY-MM-DD" disabledDate={disabledDate} />
                    </Form.Item>
                    <Form.Item
                        label="复制日期"
                        name="copyDate"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DateRangeTime format="YYYY-MM-DD" disabledDate={disableCopyDate} />
                    </Form.Item>
                    <Form.Item label="复制周期" name="copyCircle">
                        {circle ? `${circle}天` : '暂无'}
                    </Form.Item>
                    <Form.Item label="复制角色" className="copy-role">
                        <Select
                            mode="multiple"
                            value={copyRole}
                            onChange={(e) => {
                                handleCopyRoleChange(e);
                            }}
                        >
                            {roleSource.map((item) => {
                                return (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
            {/* {isToday && <div style={{ color: 'red' }}>{getwarningMessage()}</div>} */}
        </div>
    );
});

export default Index;
