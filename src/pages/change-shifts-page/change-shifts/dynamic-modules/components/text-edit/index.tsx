import React, { useEffect, useState } from 'react';
import { Input, Button } from 'oss-ui';
import { sendLogFn } from '@Pages/components/auth/utils';
import { Pattern } from '../../enum';
import SaveImg from './img/sc1_u1173.png';
import style from './index.module.less';

type TProp = {
    pattern: Pattern;
    maxLength?: number;
    value?: Record<string, any>;
    onSave: Function;
    textChange?: Function;
};

export default function Index({ pattern, maxLength = 500, value = {}, onSave, textChange }: TProp) {
    const [inputLatestValue, setInputLatestValue] = useState<string>(value?.content);

    function handleSave() {
        onSave(inputLatestValue);
        sendLogFn({ authKey: 'workbench-Workbench-CriticalFailureCondition-Save' });
    }
    useEffect(() => {
        setInputLatestValue(value?.content);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value?.content]);
    if (pattern === 'readonly') {
        return <div className={style['readonly-dom']}>{value?.content || '无'}</div>;
    }
    return (
        <Input.Group compact style={{ paddingBottom: '10px' }}>
            <Input.TextArea
                value={inputLatestValue}
                maxLength={maxLength}
                autoSize={{ minRows: 1 }}
                style={{ width: 'calc(100% - 38px)' }}
                size="large"
                onChange={(e) => {
                    setInputLatestValue(e.target.value);
                    textChange?.(e.target.value);
                }}
            />
            <Button size="large" onClick={handleSave} style={{ height: '32px', border: '1px solid #d9d9d9' }}>
                <img src={SaveImg} alt="save-btn" style={{ width: 14, height: 14, transform: 'translateY(-2px)' }} />
            </Button>
        </Input.Group>
    );
}
