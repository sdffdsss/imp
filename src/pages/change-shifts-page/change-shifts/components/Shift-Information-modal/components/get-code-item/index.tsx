import React, { FC, useState, useRef, useEffect } from 'react';
import { Row, Col, Input, Button } from 'oss-ui';
import { FormInstance } from 'oss-ui/es/form';
import './style.less';

interface Props {
    name: string;
    getCallback: (value: string | number | undefined) => Promise<boolean>; // 获取按钮事件回调 返回 true 表示调用成功 false 表示调用失败
    value?: string | number;
    onChange?: (value: string | number | undefined) => void;
    second?: number; // 倒计时开始秒数默认61s
    buttonText?: string; // 右侧按钮文案 默认 获取验证码
    countdownType?: boolean; // 是否启用倒计时默认启用
    form?: FormInstance<any>;
    placeholder?: string;
    suffix?: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const GetCodeItem: FC<Props> = (props) => {
    const { name, value, onChange, second = 61, buttonText = '获取验证码', countdownType = true, form, placeholder, suffix, getCallback, disabled = false, className } = props;

    const cbSave = useRef<() => void>();
    const timer = useRef<any>();
    const [time, setTime] = useState<number>(second);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string | number | undefined>(undefined);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (inputValue !== undefined) {
            onChange?.(inputValue);
        }
    }, [inputValue, onChange]);

    useEffect(() => {
        // 页面销毁清除定时器
        return () => {
            clearInterval(timer?.current);
            timer.current = null;
        };
    }, []);

    useEffect(() => {
        // 定时器到时间销毁定时器
        if (time < 1) {
            clearInterval(timer?.current);
            timer.current = null;
            setTime(second);
        }
    }, [time, second]);

    cbSave.current = () => {
        setTime(time - 1);
    };

    const countdown = () => {
        // 没有启用倒计时则不进行倒计时处理
        if (!countdownType) {
            return;
        }
        if (timer.current) return;
        setTime(time - 1);
        timer.current = setInterval(() => {
            if (cbSave?.current) {
                cbSave?.current();
            }
        }, 1000);
    };

    const onHandle = async () => {
        // 有form则执行表单校验
        if (form) {
            form.validateFields([name])
                .then(async () => {
                    // 通过表单校验则执行后续逻辑
                    try {
                        setLoading(true);
                        const res = await getCallback(inputValue);
                        if (res) {
                            countdown();
                        }
                    } finally {
                        setLoading(false);
                    }
                })
                .catch((errorInfo) => {
                    // 没有过校验信息则抛出不执行
                    console.log(58, errorInfo);
                });
        } else {
          try {
            setLoading(true);
            const res = await getCallback(inputValue);
            if (res) {
                countdown();
            }
        } finally {
            setLoading(false);
        }
        }
    };

    return (
        <Row gutter={8}>
            <Col span={15}>
                <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={placeholder} suffix={suffix} disabled={disabled} className={className}/>
            </Col>
            <Col span={9}>
                {time < second ? (
                    <Button disabled className='get-code-item-button'>
                        {time}s
                    </Button>
                ) : (
                    <Button className='get-code-item-button' onClick={onHandle} loading={loading} disabled={!inputValue} type="primary">
                        {buttonText}
                    </Button>
                )}
            </Col>
        </Row>
    );
};

export default GetCodeItem;
