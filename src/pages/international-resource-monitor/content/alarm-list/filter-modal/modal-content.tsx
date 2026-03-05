import React, { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'oss-ui';
import type { IModalContentProps } from './types';
import FieldItem from './field-item';
import styles from './style.module.less';

export default forwardRef((props: IModalContentProps, ref) => {
    const [form] = Form.useForm();
    const { initialValues } = props;

    useImperativeHandle(ref, () => ({
        getValues: () => {
            const values = form.getFieldsValue();

            return values.fields;
        },
    }));

    // UI部分是form，可以是任何内容 目前业务大部分modal中是form
    return (
        <div className={styles['filter-modal-content-form']}>
            <div className={styles['column-header-wrapper']}>
                <div className={styles['column-name']}>所在列</div>
                <div className={styles['column-operator']}>操作</div>
                <div className={styles['column-value']}>字段值</div>
            </div>
            <Form
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 12,
                }}
                form={form}
                initialValues={{ fields: initialValues }}
            >
                <Form.List name="fields">
                    {(fields) => {
                        return (
                            <>
                                {fields.map((field) => {
                                    return (
                                        <Form.Item noStyle name={[field.name]}>
                                            <FieldItem />
                                        </Form.Item>
                                    );
                                })}
                            </>
                        );
                    }}
                </Form.List>
            </Form>
        </div>
    );
});
