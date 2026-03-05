import { Switch, Form, InputNumber, Space, Typography } from 'oss-ui';
import React from 'react';

interface Iprops {
    isControlled: boolean;
    mode: string;
    disableControlled?: string;
    onSwitchChange: (value: number, key: string, index?: number) => void;
    levelIndex?: number;
}
const VoiceControlledReplay: React.FC<Iprops> = (props) => {
    const { isControlled, onSwitchChange, levelIndex, disableControlled, mode } = props;
    const isView = mode === 'read';
    const controlled = disableControlled as string;

    const voiceSwitchChange = (value: boolean) => {
        onSwitchChange(value ? 1 : 0, 'busySwith', levelIndex);
    };
    const redialCountChange = (value) => {
        onSwitchChange(value, 'redialCount', levelIndex);
    };
    const redialDistanceChange = (value) => {
        onSwitchChange(value, 'redialDistance', levelIndex);
    };
    /**
     * @description 这个是会受外部switch影响的
     */
    const ControlledReplay = (
        <Space>
            <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                    return (
                        <Form.Item initialValue={false} name={`${controlled}Switch`} valuePropName="checked">
                            <Switch onChange={voiceSwitchChange} disabled={isView || !getFieldValue(controlled)} />
                        </Form.Item>
                    );
                }}
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                    const isDisableInput = !(getFieldValue(`${controlled}Switch`) && getFieldValue(controlled));
                    return (
                        <Space align="start">
                            <Form.Item label="重拨次数" name={`${controlled}ReplayCount`}>
                                <InputNumber min={0} max={999999} precision={0} disabled={isView || isDisableInput} onChange={redialCountChange} />
                            </Form.Item>
                            <Form.Item
                                label="重拨间隔"
                                name={`${controlled}ReplayInterval`}
                                // rules={[{ required: true, message: '重播间隔为必填项！' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={999999}
                                    precision={0}
                                    controls={false}
                                    disabled={isView || isDisableInput}
                                    onChange={redialDistanceChange}
                                />
                            </Form.Item>
                            <Typography.Text style={{ lineHeight: '28px' }}>分钟</Typography.Text>
                        </Space>
                    );
                }}
            </Form.Item>
        </Space>
    );
    /**
     * @description 这个是不会受外部switch影响的
     */
    const NoControlledReplay = (
        <Space>
            <Form.Item initialValue={false} name={`${controlled}Switch`} valuePropName="checked">
                <Switch disabled={isView} onChange={voiceSwitchChange} />
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                    return (
                        <Space align="start">
                            <Form.Item label="重拨次数" name={`${controlled}ReplayCount`}>
                                <InputNumber
                                    min={0}
                                    max={999999}
                                    precision={0}
                                    onChange={redialCountChange}
                                    disabled={isView || !getFieldValue(`${controlled}Switch`)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="重拨间隔"
                                name={`${controlled}ReplayInterval`}
                                // rules={[{ required: true, message: '重播间隔为必填项！' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={999999}
                                    precision={0}
                                    controls={false}
                                    onChange={redialDistanceChange}
                                    disabled={isView || !getFieldValue(`${controlled}Switch`)}
                                />
                            </Form.Item>
                            <Typography.Text style={{ lineHeight: '28px' }}>分钟</Typography.Text>
                        </Space>
                    );
                }}
            </Form.Item>
        </Space>
    );

    return isControlled ? ControlledReplay : NoControlledReplay;
};

export default VoiceControlledReplay;
