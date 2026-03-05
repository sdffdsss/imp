import React from 'react';
import { useDrag } from 'react-dnd-cjs';
import useLoginInfoModel from '@Src/hox';
import './index.less';

const AccordionItem = ({ itemInfo }) => {
    const login = useLoginInfoModel();
    const theme = login?.systemInfo?.theme || 'light';
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'AccordionItem', ...itemInfo },
        end: () => {},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;

    return (
        <div ref={dragRef} className={`accordion-item accordion-item-${theme}`} style={{ opacity }}>
            <span className="type-name" title={itemInfo.fieldLabel}>
                {itemInfo.fieldLabel}
            </span>
        </div>
    );
};

export default AccordionItem;
