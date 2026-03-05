import React, { useRef } from 'react';
import { Space, Form, Input, Select, Radio, Button, Icon } from 'oss-ui';
import styles from '../group-manage/work-record-modal/style.module.less';

const Item = (props) => {
    const { record, disabled, onChange, onAddRecord, onDeleteRecord, hasAddNewAuth } = props;

    const [form] = Form.useForm();
    const configCloneRef = useRef();
    configCloneRef.current = record.workRecordArray;

    return (
        <Form
            form={form}
            onValuesChange={(changeValues) => {
                const [key, value] = Object.entries(changeValues)[0];

                const outputValue = configCloneRef.current.reduce((accuRow, itemRow) => {
                    const temp1 = itemRow.reduce((accuCol, itemCol) => {
                        let { result } = itemCol;

                        if (itemCol.fieldKey === key) {
                            if (itemCol.type === 'radio') {
                                result = itemCol.compProps.options[value];
                            } else {
                                result = value;
                            }
                        }
                        return [
                            ...accuCol,
                            {
                                ...itemCol,
                                result: result || '',
                            },
                        ];
                    }, []);

                    return [...accuRow, temp1];
                }, []);

                onChange(outputValue);
            }}
        >
            {record.workRecordArray.map((itemRow, index) => {
                return (
                    <div
                        key={itemRow[0]?.fieldKey}
                        className={`${styles['template-item-wrapper']} ${styles['template-item-wrapper-no-button']} ${
                            index === record.workRecordArray.length - 1 ? styles['template-item-wrapper-last'] : ''
                        }`}
                    >
                        <div className={`${styles['template-item-content']} ${styles['template-item-content-paddingRight']}`}>
                            {itemRow.map((itemCol) => {
                                const { type, subtype, fieldKey, compProps } = itemCol;
                                if (type === 'input') {
                                    if (subtype === 'fixed') {
                                        const splitStrArr = itemCol.value[0]?.split('');

                                        return splitStrArr.map((itemStr, indexStr) => (
                                            <span
                                                className={
                                                    indexStr === splitStrArr.length - 1
                                                        ? styles['template-item-item-wrapper']
                                                        : styles['template-item-item-wrapper-no-margin']
                                                }
                                            >
                                                {itemStr}
                                            </span>
                                        ));
                                    }

                                    if (itemRow.length === 1) {
                                        return (
                                            <div className={styles['template-item-item-wrapper-block']}>
                                                <Form.Item noStyle name={fieldKey}>
                                                    <Input.TextArea
                                                        {...compProps}
                                                        style={{ ...(compProps.style || {}), width: '100%' }}
                                                        disabled={disabled}
                                                    />
                                                </Form.Item>
                                            </div>
                                        );
                                    }
                                    return (
                                        <span className={styles['template-item-item-wrapper']}>
                                            <Form.Item noStyle name={fieldKey}>
                                                <Input.TextArea {...compProps} disabled={disabled} />
                                            </Form.Item>
                                        </span>
                                    );
                                }
                                if (itemCol.type === 'select') {
                                    return (
                                        <span className={styles['template-item-item-wrapper']}>
                                            <Form.Item noStyle name={fieldKey}>
                                                <Select {...compProps} disabled={disabled} />
                                            </Form.Item>
                                        </span>
                                    );
                                }
                                if (type === 'radio') {
                                    return (
                                        <span className={styles['template-item-item-wrapper']}>
                                            <Form.Item noStyle name={`${fieldKey}`}>
                                                <Radio.Group
                                                    disabled={disabled}
                                                    defaultValue={compProps.options.findIndex((item) => item === compProps.defaultValue)}
                                                >
                                                    <Space direction="vertical">
                                                        {compProps.options.map((itemIn, indexIn) => {
                                                            return <Radio value={indexIn}>{itemIn}</Radio>;
                                                        })}
                                                    </Space>
                                                </Radio.Group>
                                            </Form.Item>
                                        </span>
                                    );
                                }

                                return null;
                            })}
                            {hasAddNewAuth && !record.canDelete && index === record.workRecordArray.length - 1 && (
                                <Button
                                    type="text"
                                    style={{ position: 'absolute', right: 0, top: '8px' }}
                                    onClick={onAddRecord}
                                    icon={<Icon antdIcon type="PlusOutlined" style={{ color: '#10a7f0', cursor: 'pointer' }} />}
                                />
                            )}
                            {hasAddNewAuth && record.canDelete && (
                                <Button
                                    type="text"
                                    style={{ position: 'absolute', right: 0, top: '8px' }}
                                    onClick={onDeleteRecord}
                                    icon={<Icon antdIcon type="MinusOutlined" style={{ color: '#10a7f0', cursor: 'pointer' }} />}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </Form>
    );
};

export default Item;
