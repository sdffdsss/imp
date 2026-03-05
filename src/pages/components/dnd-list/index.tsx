import React, { useState, FC, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const idKey = Symbol('id');

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

type ItemType = Record<string, any>;

interface Props {
    data: ItemType[]; // 排序数据
    render: (item: ItemType) => JSX.Element; // 每个单项自定义渲染
    onChange?: (data: ItemType[]) => void; // 排序后回调
}

const DndList: FC<Props> = (props) => {
    const { data, render, onChange } = props;
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const datas = data.map((item, index) => {
            return {
                ...item,
                [idKey]: `item-${index}`,
            };
        });
        setItems(datas);
    }, [data]);

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const currentTtems: any = reorder(items, result.source.index, result.destination.index);

        onChange?.(currentTtems);

        setItems(currentTtems);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items.map((item, index) => {
                            return (
                                <Draggable
                                    key={item[idKey]}
                                    draggableId={item[idKey]}
                                    index={index}
                                    // isDragDisabled={item.disabled} // false 禁止拖拽
                                >
                                    {(provided2) => (
                                        <div ref={provided2.innerRef} {...provided2.draggableProps} {...provided2.dragHandleProps}>
                                            {render(item)}
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DndList;
