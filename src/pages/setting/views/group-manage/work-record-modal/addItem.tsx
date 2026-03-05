import React, { FC, useState } from 'react';
import { Icon, Space, Input, Select, Radio, Form, message, Button } from 'oss-ui';
import { useDrop } from 'react-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import produce from 'immer';
import { nanoid } from '../production-plan-modal/utils';
import styles from './style.module.less';

interface Props {
    row: Record<string, any>;
    addTemplate: (index: number) => void;
    deleteTemplate: (index: number) => void;
    onChange: Function;
    onTempFieldKeysChange: (fn: Function) => any;
    timeIndex: number;
}

const DropTarget = (props) => {
    const { onChange, onTempFieldKeysChange, data, droppableId } = props;
    const [, drop] = useDrop({
        accept: 'box',
        drop: (item: any) => {
            if ((item.data.type === 'radio' && data.length !== 0) || (data.length === 1 && data[0].type === 'radio')) {
                message.warning('单选按钮只能单独放置在一条模板中');

                return;
            }

            if (
                (item.data.type === 'input' && item.data.subtype === 'presets' && data.length !== 0) ||
                (data.length === 1 && data[0].type === 'input' && data[0].subtype === 'presets')
            ) {
                message.warning('预设内容文本域只能单独放置在一条模板中');

                return;
            }
            const tempKey = nanoid();

            onTempFieldKeysChange((prev) => {
                if (item.data.type === 'radio') {
                    return [...prev, `${tempKey}-0`, `${tempKey}-1`];
                }

                return [...prev, tempKey];
            });
            const newItem = { ...item.data, fieldKey: tempKey };
            onChange([...data, newItem]);
        },
    });

    function handleDelete(index) {
        const newList = produce(data, (draft) => {
            draft.splice(index, 1);
        });
        onChange(newList);
    }

    return (
        <div ref={drop}>
            <Droppable droppableId={droppableId} direction="horizontal">
                {(provided1) => (
                    <div {...provided1.droppableProps} ref={provided1.innerRef} className={styles['template-item-content']}>
                        {data?.length > 0 ? (
                            data?.map((item, index) => {
                                const { type, subtype, fieldKey, compProps } = item;
                                const { wrapperStyle, ...otherCompProps } = compProps;

                                return (
                                    <Draggable key={fieldKey} draggableId={fieldKey} index={index} data={item}>
                                        {(provided2) => {
                                            if (type === 'input') {
                                                const presetsStyle = {
                                                    flex: 'auto',
                                                    marginRight: '12px',
                                                };
                                                const temp = {
                                                    ...provided2.draggableProps,
                                                    style: {
                                                        ...provided2.draggableProps.style,
                                                        ...(subtype === 'presets' ? presetsStyle : {}),
                                                    },
                                                };
                                                return (
                                                    <div className={styles['template-item-item-wrapper']} ref={provided2.innerRef} {...temp}>
                                                        <Form.Item noStyle name={fieldKey}>
                                                            <Input.TextArea {...otherCompProps} rows={1} autoSize={subtype !== 'presets'} />
                                                        </Form.Item>
                                                        <Icon
                                                            antdIcon
                                                            type="CloseCircleFilled"
                                                            className={styles['template-item-item-delete']}
                                                            onClick={() => handleDelete(index)}
                                                        />
                                                        <div className={styles['template-item-item-drag']} {...provided2.dragHandleProps}>
                                                            <Icon
                                                                antdIcon
                                                                type="HolderOutlined"
                                                                className={styles['template-item-item-drag-icon']}
                                                                // onClick={() => addTemplate(index)}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            if (type === 'select') {
                                                return (
                                                    <div
                                                        className={styles['template-item-item-wrapper']}
                                                        ref={provided2.innerRef}
                                                        {...provided2.draggableProps}
                                                    >
                                                        <Form.Item noStyle name={item.fieldKey}>
                                                            <Select {...item.compProps} />
                                                        </Form.Item>
                                                        <Icon
                                                            antdIcon
                                                            type="CloseCircleFilled"
                                                            className={styles['template-item-item-delete']}
                                                            onClick={() => handleDelete(index)}
                                                        />
                                                        <div className={styles['template-item-item-drag']} {...provided2.dragHandleProps}>
                                                            <Icon
                                                                antdIcon
                                                                type="HolderOutlined"
                                                                className={styles['template-item-item-drag-icon']}
                                                                // onClick={() => addTemplate(index)}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            if (type === 'radio') {
                                                const { options, ...otherProps } = item.compProps;
                                                return (
                                                    <div
                                                        className={styles['template-item-item-wrapper']}
                                                        ref={provided2.innerRef}
                                                        {...provided2.draggableProps}
                                                    >
                                                        <Space direction="vertical">
                                                            {item.compProps.options.map((itemIn, indexIn) => {
                                                                return (
                                                                    // eslint-disable-next-line
                                                                    <Radio key={indexIn} disabled>
                                                                        <Form.Item noStyle name={`${item.fieldKey}-${indexIn}`}>
                                                                            <Input defaultValue={itemIn} {...otherProps} />
                                                                        </Form.Item>
                                                                    </Radio>
                                                                );
                                                            })}
                                                        </Space>
                                                        <Icon
                                                            antdIcon
                                                            type="CloseCircleFilled"
                                                            style={{ right: '8px' }}
                                                            className={styles['template-item-item-delete']}
                                                            onClick={() => handleDelete(index)}
                                                        />
                                                        <div className={styles['template-item-item-drag']} {...provided2.dragHandleProps}>
                                                            <Icon
                                                                antdIcon
                                                                type="HolderOutlined"
                                                                className={styles['template-item-item-drag-icon']}
                                                                // onClick={() => addTemplate(index)}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return null;
                                        }}
                                    </Draggable>
                                );
                            })
                        ) : (
                            <div style={{ lineHeight: '28px', paddingBottom: '8px' }}>请拖动到此处</div>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );

    // return (
    //     <div ref={drop} className={styles['template-item-content']}>
    //         {droppedItems?.length ? (
    //             droppedItems.map((item, index) => {
    //                 if (item.type === 'input') {
    //                     return (
    //                         <div className={styles['template-item-item-wrapper']}>
    //                             <Form.Item noStyle name={item.fieldKey}>
    //                                 <Input.TextArea {...item.compProps} rows={1} />
    //                             </Form.Item>
    //                             <Icon
    //                                 antdIcon
    //                                 type="CloseCircleFilled"
    //                                 className={styles['template-item-item-delete']}
    //                                 onClick={() => handleDelete(index)}
    //                             />
    //                         </div>
    //                     );
    //                 }
    //                 if (item.type === 'select') {
    //                     return (
    //                         <div className={styles['template-item-item-wrapper']}>
    //                             <Form.Item noStyle name={item.fieldKey}>
    //                                 <Select {...item.compProps} />
    //                             </Form.Item>
    //                             <Icon
    //                                 antdIcon
    //                                 type="CloseCircleFilled"
    //                                 className={styles['template-item-item-delete']}
    //                                 onClick={() => handleDelete(index)}
    //                             />
    //                         </div>
    //                     );
    //                 }
    //                 if (item.type === 'radio') {
    //                     const { options, ...otherProps } = item.compProps;
    //                     return (
    //                         <div className={styles['template-item-item-wrapper']}>
    //                             <Space direction="vertical">
    //                                 {item.compProps.options.map((itemIn, indexIn) => {
    //                                     return (
    //                                         // eslint-disable-next-line
    //                                         <Radio key={indexIn} disabled>
    //                                             <Form.Item noStyle name={`${item.fieldKey}-${indexIn}`}>
    //                                                 <Input defaultValue={itemIn} {...otherProps} />
    //                                             </Form.Item>
    //                                         </Radio>
    //                                     );
    //                                 })}
    //                             </Space>
    //                             <Icon
    //                                 antdIcon
    //                                 type="CloseCircleFilled"
    //                                 style={{ right: '8px' }}
    //                                 className={styles['template-item-item-delete']}
    //                                 onClick={() => handleDelete(index)}
    //                             />
    //                         </div>
    //                     );
    //                 }

    //                 return null;
    //             })
    //         ) : (
    //             <div style={{ lineHeight: '28px', paddingBottom: '8px' }}>请拖动到此处</div>
    //         )}
    //     </div>
    // );
};

const AddItem: FC<Props> = (props) => {
    const { row, addTemplate, deleteTemplate, onChange, onTempFieldKeysChange, timeIndex } = props;
    const { workRecordConfig } = row;

    return workRecordConfig[1].map((item, index) => {
        return (
            <div
                key={item[0]?.fieldKey || nanoid()}
                className={`${styles['template-item-wrapper']} ${
                    index === workRecordConfig[1].length - 1 ? styles['template-item-wrapper-last'] : ''
                }`}
            >
                <DropTarget
                    data={item}
                    droppableId={`${timeIndex}-${index}`}
                    onChange={(data) => onChange(index, data)}
                    onTempFieldKeysChange={onTempFieldKeysChange}
                />
                <div className={styles['template-item-button-wrapper']}>
                    <Button
                        type="text"
                        onClick={() => deleteTemplate(index)}
                        icon={<Icon antdIcon type="MinusOutlined" className={styles['template-item-button']} />}
                    />
                    <Button
                        type="text"
                        onClick={() => addTemplate(index)}
                        icon={<Icon antdIcon type="PlusOutlined" className={styles['template-item-button']} />}
                    />
                </div>
            </div>
        );
    });
};

export default AddItem;
