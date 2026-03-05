import React, { FC, cloneElement } from 'react';
import { Form, Input } from 'oss-ui';
import { EditableCellProps } from './types';
import { MARK_NEW_EMPTY_ROW_DATA, TEMP_FIELD_SUFFIX } from '../../constants';

const EditableCell: FC<EditableCellProps> = ({
    editing,
    inlineEditProps,
    dataIndex,
    title,
    record,
    disabled,
    index,
    children,
    tableCompFunc,
    ...restProps
}) => {
    const { editComponentSetting } = inlineEditProps || {};
    const { component, ...componentProps } = editComponentSetting || {};

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={record.hasOwnProperty(MARK_NEW_EMPTY_ROW_DATA) ? `${dataIndex}${TEMP_FIELD_SUFFIX}` : dataIndex}
                    style={{ margin: 0 }}
                >
                    {component ? (
                        cloneElement(component as React.ReactElement, { disabled, record, tableCompFunc, ...componentProps })
                    ) : (
                        <Input.TextArea disabled={disabled} maxLength={300} rows={1} {...componentProps} />
                    )}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
export default EditableCell;
