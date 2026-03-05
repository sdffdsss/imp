import React from 'react';
import { useDrop } from 'react-dnd-cjs';
import classnames from 'classnames';

const DropZone = ({ index, onDrop }) => {
    const [{ canDrop }, drop] = useDrop({
        accept: 'AccordionItem',
        drop: (item) => {
            onDrop(item, index);
            return { name: 'DropZone' };
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    });

    return (
        <div ref={drop} className={classnames('drop-target', { active: canDrop })}>
            请将过滤条件拖至框内
        </div>
    );
};
export default DropZone;
