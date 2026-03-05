import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, Input, message, Form, Button } from 'oss-ui';
import { ColumnType } from 'oss-ui/lib/table';
import { useUpdate } from 'ahooks';
import moment from 'moment';
import { useEnvironmentModel } from '@Src/hox';
import { sendLogFn } from '@Pages/components/auth/utils';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import Image from './img/sc1_u1173.png';
import TimeSelect from './components/TimeSelect';
import CommonWrapper from '../../components/common-wrapper';
import { Pattern } from '../enum';
import { getRoomInspection, saveRoomInspection } from './api';
import './index.less';

type TProps = {
    pattern: Pattern;
    title: React.ReactNode;
    [key: string]: any;
};

const Index = ({ pattern = Pattern.editable, title, schedulingObj, pageType, saveItemInfoCheck, moduleId }: TProps, ref) => {
    const { environment } = useEnvironmentModel();
    const { specialDutyGroupMap: { generalDutyGroupId } = {} } = environment;
    const [form] = Form.useForm();
    const update = useUpdate();
    useEffect(() => {
        if (schedulingObj?.groupId) {
            if (!schedulingObj?.dateTime) return;
            getRoomInspection({
                groupId: schedulingObj.groupId,
                workShiftId:
                    pageType === ShiftChangeTypeEnum.Takeover
                        ? schedulingObj?.lastTakeOrHandWorkShiftId || schedulingObj?.lastWorkShiftId
                        : schedulingObj?.workShiftId,
                dateTime: schedulingObj?.dateTime,
            }).then((res) => {
                if (Array.isArray(res?.data) && res.data.length > 0) {
                    const { inspectionTimeOne, inspectionTimeTwo, inspectionTimeThree } = res.data[0];
                    form.setFieldsValue({
                        ...res.data[0],
                        inspectionTimeOne: inspectionTimeOne ? moment(moment(inspectionTimeOne).format('HH:mm'), 'HH:mm') : null,
                        inspectionTimeTwo: inspectionTimeTwo ? moment(moment(inspectionTimeTwo).format('HH:mm'), 'HH:mm') : null,
                        inspectionTimeThree: inspectionTimeThree ? moment(moment(inspectionTimeThree).format('HH:mm'), 'HH:mm') : null,
                    });
                } else {
                    if (String(schedulingObj?.groupId) === String(generalDutyGroupId)) {
                        form.setFieldsValue({
                            computerRoom: '监控大厅',
                            inspectionResultOne: '',
                            inspectionResultTwo: '',
                            inspectionResultThree: '',
                            inspectionTimeOne: null,
                            inspectionTimeTwo: null,
                            inspectionTimeThree: null,
                        });
                    } else {
                        form.setFieldsValue({
                            computerRoom: '监控大厅',
                            inspectionResultOne: '巡检正常',
                            inspectionResultTwo: '巡检正常',
                            inspectionResultThree: '巡检正常',
                            inspectionTimeOne: moment('9:00', 'HH:mm'),
                            inspectionTimeTwo: moment('11:30', 'HH:mm'),
                            inspectionTimeThree: moment('16:30', 'HH:mm'),
                        });
                    }
                }
                update();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedulingObj?.groupId, schedulingObj?.dateTime, schedulingObj?.lastTakeOrHandWorkShiftId, schedulingObj?.workShiftId, pattern]);

    async function handleSave(value?: any) {
        let values = value;
        if (!value) {
            values = await form.validateFields();
        }
        sendLogFn({ authKey: 'workbench-Workbench-MachineRoomInspection-Save' });

        // 校验是否可保存值班信息
        const checkResult = await saveItemInfoCheck();

        if (!checkResult) {
            return { code: 500 };
        }
        const res = await saveRoomInspection(values.inspectionId ? 'update' : 'save', {
            ...values,
            groupId: schedulingObj?.groupId,
            workShiftId: schedulingObj?.shiftDutyId,
            dateTime: schedulingObj?.dateTime,
            inspectionTimeOne: values.inspectionTimeOne ? moment(values.inspectionTimeOne).format('YYYY-MM-DD HH:mm:ss') : null,
            inspectionTimeTwo: values.inspectionTimeTwo ? moment(values.inspectionTimeTwo).format('YYYY-MM-DD HH:mm:ss') : null,
            inspectionTimeThree: values.inspectionTimeThree ? moment(values.inspectionTimeThree).format('YYYY-MM-DD HH:mm:ss') : null,
        });
        if (res.code === 200) {
            if (value) {
                message.success('保存成功');
                return { code: 200 };
            }
            return { code: 200 };
        }
        return { code: 500, message: '保存失败' };
    }

    const columns: ColumnType<any>[] = [
        {
            title: '机房',
            dataIndex: 'computerRoom',
            width: '100px',
            align: 'center',
            render() {
                return <Form.Item name="computerRoom">{form.getFieldValue('computerRoom')}</Form.Item>;
            },
        },
        {
            title: '巡检时间',
            dataIndex: 'inspectionTimeOne',
            align: 'center',
            width: '165px',
            render: () => (
                <Form.Item name="inspectionTimeOne">
                    <TimeSelect pattern={pattern} />
                </Form.Item>
            ),
        },
        {
            title: '巡检结果',
            dataIndex: 'inspectionResultOne',
            align: 'center',
            render: () =>
                pattern === 'readonly' ? (
                    form.getFieldValue('inspectionResultOne')
                ) : (
                    <Form.Item
                        name="inspectionResultOne"
                        rules={[{ type: 'string', max: 500, message: '巡检结果不超过500字' }]}
                        validateTrigger="onSubmit"
                    >
                        <Input.TextArea rows={1} placeholder="请填写巡检结果" />
                    </Form.Item>
                ),
        },
        {
            title: '巡检时间',
            dataIndex: 'inspectionTimeTwo',
            align: 'center',
            width: '165px',
            render: () => (
                <Form.Item name="inspectionTimeTwo">
                    <TimeSelect pattern={pattern} />
                </Form.Item>
            ),
        },
        {
            title: '巡检结果',
            dataIndex: 'inspectionResultTwo',
            align: 'center',
            render: () =>
                pattern === 'readonly' ? (
                    form.getFieldValue('inspectionResultTwo')
                ) : (
                    <Form.Item
                        name="inspectionResultTwo"
                        rules={[{ type: 'string', max: 500, message: '巡检结果不超过500字' }]}
                        validateTrigger="onSubmit"
                    >
                        <Input.TextArea rows={1} placeholder="请填写巡检结果" />
                    </Form.Item>
                ),
        },
        {
            title: '巡检时间',
            dataIndex: 'inspectionTimeThree',
            align: 'center',
            width: '165px',
            render: () => (
                <Form.Item name="inspectionTimeThree">
                    <TimeSelect pattern={pattern} />
                </Form.Item>
            ),
        },
        {
            title: '巡检结果',
            dataIndex: 'inspectionResultThree',
            align: 'center',
            render: () =>
                pattern === 'readonly' ? (
                    form.getFieldValue('inspectionResultThree')
                ) : (
                    <Form.Item
                        name="inspectionResultThree"
                        rules={[{ type: 'string', max: 500, message: '巡检结果不超过500字' }]}
                        validateTrigger="onSubmit"
                    >
                        <Input.TextArea rows={1} placeholder="请填写巡检结果" />
                    </Form.Item>
                ),
        },
    ];

    if (pattern === Pattern.editable) {
        columns.push({
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            width: '50px',
            fixed: 'right',
            render: () => {
                return (
                    <div className="save-btn-wrapper">
                        <Button type="text" htmlType="submit">
                            <img src={Image} style={{ width: 14, height: 14 }} alt="save" className="room-inspection-save-img" />
                        </Button>
                    </div>
                );
            },
        });
    }

    useImperativeHandle(ref, () => {
        return {
            wrapperSave: handleSave,
        };
    });
    return (
        <CommonWrapper title={title} moduleId={moduleId}>
            <div className="cs-room-inspection--local" style={{ padding: '0 0 8px' }}>
                <Form form={form} name="roomInspection" onFinish={handleSave}>
                    <Form.Item name="inspectionId" hidden>
                        <Input />
                    </Form.Item>
                    <Table columns={columns} dataSource={[{ room: '监控大厅' }]} bordered pagination={false} size="middle" />
                </Form>
            </div>
        </CommonWrapper>
    );
};
export default forwardRef(Index);
