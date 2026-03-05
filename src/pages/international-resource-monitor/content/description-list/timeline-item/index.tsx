import { Timeline, Input } from 'oss-ui';
import React from 'react';
import cls from 'classnames';
import dotImg from './img/圆圈.png';
import { DescriptionItemDataType } from '../type';
import Tools from './tools';
import useItemState from './useItemState';

interface Iprops {
    onRelateClick: () => void;
    deleteItem: () => void;
    selectItem: () => void;
    saveItem: () => void;
    modifyItem: () => void;
    addItem: () => void;
    onTextAreaChange: (value) => void;
    item: DescriptionItemDataType;
    index: number;
    isSelected: boolean;
    isEditing: boolean;
}

const TimelineCard = (props: Iprops) => {
    const { deleteItem, saveItem, selectItem, modifyItem, addItem, onRelateClick, onTextAreaChange, item, isSelected, index } = props;
    const { faultDescription } = item;

    const { showAddButton, showContentMode } = useItemState(props);

    // 编辑按钮
    return (
        <Timeline.Item dot={<img src={dotImg} alt="图没了" />}>
            <div className="timeline-card-box">
                <div className="timeline-card-tool">
                    <div className="edit-tool-cube">
                        <span>{index}</span>
                    </div>
                    <Tools
                        showAddButton={showAddButton}
                        showContentMode={showContentMode}
                        saveItem={saveItem}
                        modifyItem={modifyItem}
                        onRelateClick={onRelateClick}
                        deleteItem={deleteItem}
                        addItem={addItem}
                        selectItem={selectItem}
                        isDelete={Boolean(item.isDelete)}
                    />
                </div>
                {showContentMode === 'edit' ? (
                    <div className="timeline-card-context edit">
                        <Input.TextArea
                            defaultValue={faultDescription}
                            className="timeline-card-edit-input"
                            maxLength={350}
                            onChange={(e) => onTextAreaChange(e.target.value)}
                        />
                    </div>
                ) : (
                    <div
                        className={cls('timeline-card-context', {
                            selected: isSelected,
                        })}
                        onClick={selectItem}
                    >
                        <div className="timeline-card-read-context">
                            <span>{faultDescription}</span>
                        </div>
                    </div>
                )}
            </div>
        </Timeline.Item>
    );
};

export default TimelineCard;
