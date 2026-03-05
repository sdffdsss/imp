import React, { useState } from 'react';
import { Form, Input, message, Row, Col, Select, DatePicker } from 'oss-ui';
import api from '../api';
import moment from 'moment';

const { RangePicker } = DatePicker;

/** *
 * 脚本详情
 */
export default React.forwardRef((props, ref) => {
    const [dates, setDates] = useState(null);
    // const [value, setValue] = useState(null);

    React.useEffect(() => {
        if (ref.current) {
            showScript(props.curSelParmExport, props);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current]);
    /** *
     * 脚本 详情数据加载
     */
    const showScript = (val, prop) => {
        // api.getScriptsDesc(
        //     val,
        //     // (data) => {
        //     //     let description = '';
        //     //     if (!data.scriptDescription || data.scriptDescription.length === 0) {
        //     //         description = '未查询到脚本信息，请联系管理员。';
        //     //     } else {
        //     //         description = data.scriptDescription;
        //     //     }
        //     //     ref.current.setFieldsValue({
        //     //         description: description,
        //     //     });
        //     // },
        //     (data) => {
        //         ref.current.setFieldsValue({
        //             description: 123,
        //         });
        //     },
        //     (error) => {
        //         message.error(error.desc);
        //     }
        // );
        const { mteamInfo, mteamModel } = props;
        console.log(mteamInfo);
        if (val) {
            ref.current.setFieldsValue({
                provinceName: val.province?.regionName || mteamInfo.provinceName,
                regionName: val.region?.regionName || mteamInfo.regionName,
                professionName: val?.professional?.value || mteamInfo.professionalName,
                ruleType: val.team?.name || mteamInfo.mteamName,
                dateTime: [moment(val.dateTime, 'YYYY-MM-DD'), moment(val.dateTime, 'YYYY-MM-DD')],
            });
            setDates([moment(val.dateTime, 'YYYY-MM-DD'), moment(val.dateTime, 'YYYY-MM-DD')])
        }
    };
    const rangeConfig = {
        // rules: [
        //     {
        //         type: 'array',
        //         required: true,
        //         message: '请选择日期!',
        //     },
        // ],
    };

    const disabledDate = (current: Moment) => {
        if (!dates) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
        return !!tooEarly || !!tooLate;
    };

    return (
        <Form ref={ref} name="preTreatDesc">
            {/* <Form.Item name="description">
                <Input.TextArea autoSize={true}></Input.TextArea>
            </Form.Item> */}
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="归属省份" name="provinceName">
                        <Input autoSize={true} disabled={true}></Input>
                    </Form.Item>
                </Col>
                {props.flag !== 'export' && (
                    <Col span={12}>
                        <Form.Item label="归属地市" name="regionName">
                            <Input autoSize={true} disabled={true}></Input>
                        </Form.Item>
                    </Col>
                )}
            </Row>
            {props.flag !== 'export' && (
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="归属专业" name="professionName">
                            <Input autoSize={true} disabled={true}></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="班组" name="ruleType">
                            <Input autoSize={true} disabled={true}></Input>
                        </Form.Item>
                    </Col>
                </Row>
            )}
            {props.mteamModel !== 2 && props.flag !== 'export' && (
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item name="dateTime" label="日期" {...rangeConfig}>
                            <RangePicker style={{ width: '100%' }} disabledDate={disabledDate} onCalendarChange={(val) => setDates(val)} />
                        </Form.Item>
                    </Col>
                </Row>
            )}
            <span style={{ marginLeft: 40, color: 'red' }}>注：最多支持导出31天的排班表</span>
        </Form>
    );
});
