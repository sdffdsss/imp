import React, { FC, useState } from 'react';
import { Input, Icon, Tooltip } from 'oss-ui';

interface Props {
    text: string;
}

const EditTableItem: FC<Props> = (props) => {
    const { text } = props;

    const [renderText, setRenderText] = useState<string>(text);
    const [editType, setEditType] = useState<boolean>(false);

    const onSave = (e) => {
        e.stopPropagation();
        setEditType(false);
    };

    const onCancel = (e) => {
        e.stopPropagation();
        setRenderText(text);
        setEditType(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setRenderText(value);
    };

    return (
        <>
            {editType ? (
                <Input
                    defaultValue={renderText}
                    style={{ width: '150px' }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={onChange}
                    suffix={
                        <>
                            <Tooltip title="保存">
                                <span onClick={onSave}>
                                    <Icon antdIcon style={{ cursor: 'pointer' }} type="CheckOutlined" />
                                </span>
                            </Tooltip>
                            <Tooltip title="取消">
                                <span onClick={onCancel}>
                                    <Icon antdIcon style={{ cursor: 'pointer' }} type="CloseOutlined" />
                                </span>
                            </Tooltip>
                        </>
                    }
                />
            ) : (
                <span onDoubleClick={() => setEditType(true)} onClick={(e) => e.stopPropagation()}>
                    {renderText}
                </span>
            )}
        </>
    );
};

export default EditTableItem;
