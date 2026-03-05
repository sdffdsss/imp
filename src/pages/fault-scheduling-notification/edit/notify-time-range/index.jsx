import React, { useEffect, useState } from 'react';
import { Switch, Form, TimePicker, Select } from 'oss-ui';
import moment from 'moment';
import { Api } from '../../api';

export default function Index({ value, onChange, mode }) {
    const [enums, setEnums] = useState([]);
    const [form] = Form.useForm();
    const isView = mode === 'read';

    useEffect(() => {
        Api.getOutTimeOperationEnum().then((res) => {
            setEnums(res);
        });
    }, []);
    function onValuesChange(key, newValue) {
        onChange({ ...value, [key]: newValue });
    }

    return (
        <Form form={form} layout="inline">
            <Form.Item>
                <Switch
                    disabled={isView}
                    checked={value?.timeEnable}
                    onChange={(checked) => {
                        onValuesChange('timeEnable', checked);
                    }}
                />
            </Form.Item>
            <Form.Item label="时间段">
                <TimePicker.RangePicker
                    disabled={isView || !value?.timeEnable}
                    value={value?.timeRange || [moment('08:00:00', 'HH:mm:ss'), moment('18:00:00', 'HH:mm:ss')]}
                    format="HH:mm:ss"
                    onChange={(dates) => {
                        onValuesChange('timeRange', dates);
                    }}
                />
            </Form.Item>
            <Form.Item label="非通知时间段处理">
                <Select
                    style={{ width: 110 }}
                    disabled={isView || !value?.timeEnable}
                    value={value?.outTimeOperation || enums?.[0]?.value}
                    options={enums}
                    onChange={(newValue) => {
                        onValuesChange('outTimeOperation', newValue);
                    }}
                />
            </Form.Item>
        </Form>
    );
}
