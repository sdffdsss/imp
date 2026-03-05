import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from 'oss-ui';

const getItemStyle = (isDragging: boolean, draggableStyle: any, index: number) => ({
    userSelect: 'none',
    lineHeight: '24px',
    boxShadow: isDragging && '0px 0px 5px 0px #a5a5a5',
    ...draggableStyle,
});

interface BaseStates {
    checkedList: any[];
}

interface BaseProps {
    checkedChange: (item: any, value: any) => void;
    columns: any[];
    item: {
        id: any;
        key: any;
    };
    index: number;
    checkedList: any[];
    showRightNum: boolean;
    dragHolderMessag: any;
    disabled?: boolean;
}

type RightDragFieldProps = BaseProps & {
    onClildrenChange: (item: any) => void;
};

interface RightDragFieldState {
    checked?: any;
}

class RightDragField extends React.Component<RightDragFieldProps, RightDragFieldState> {
    constructor(props: RightDragFieldProps) {
        super(props);
        this.state = {
            checked: null,
        };
    }

    componentDidUpdate(prevProps: RightDragFieldProps) {
        const { checkedList } = this.props;
        if (checkedList !== prevProps.checkedList) {
            const obj = checkedList.find((current) => current.id === this.props.item.id);
            if (obj) {
                this.setState({
                    checked: obj.id,
                });
            } else {
                this.setState({
                    checked: null,
                });
            }
        }
    }

    checkChange = (item: any, e: any) => {
        if (this.props.disabled) return;
        const { checkedChange } = this.props;
        if (e.target.checked) {
            this.setState({ checked: item.id });
        } else {
            this.setState({ checked: null });
        }
        checkedChange && checkedChange({ ...item, index: this.props.index }, e.target.checked);
    };

    render() {
        const { columns, item, index, showRightNum, disabled } = this.props;
        const { checked } = this.state;
        return (
            <Draggable key={item.id} draggableId={`${item.id}`} index={index} isDragDisabled={!!disabled}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={index % 2 === 0 ? 'drag-columns-one' : 'drag-columns-two'}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, index)}
                    >
                        <div className="columns-sort-drag-header">
                            <div className="columns-sort-drag-header-num-empty">
                                <Checkbox onChange={this.checkChange.bind(this, item)} checked={checked === item.id} disabled={disabled} />
                            </div>
                            {showRightNum && <div className="columns-sort-drag-header-num">{index + 1}</div>}

                            {columns &&
                                columns
                                    .filter((itemss) => !itemss.selectOptionsHide)
                                    .map((items) => {
                                        const style = items.selectOptionsWidth
                                            ? { width: items.selectOptionsWidth }
                                            : items.width && { width: items.width };
                                        return (
                                            <div
                                                className="columns-sort-drag-header-field-info"
                                                key={items.key}
                                                style={style}
                                                title={!items.render && item[items.key]}
                                            >
                                                {items.render ? items.render(item.key, item) : item[items.key]}
                                            </div>
                                        );
                                    })}
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }
}

interface RightDropFieldProps {
    students: any;
    rightPagetions: any;
    checkedChange: (item: any[], field?: any) => void;
    columns: any[];
    onClildrenChange: (item: any[]) => void;
    rightAllChecked: any[];
    checkedList?: any[];
    checked?: any;
    showRightNum: boolean;
    propsRightPagetions: any;
    dragHolderMessag: string;
    disabled?: boolean;
}

class RightDropField extends React.Component<RightDropFieldProps, BaseStates> {
    constructor(props: RightDropFieldProps) {
        super(props);
        this.state = {
            checkedList: [],
        };
    }

    shouldComponentUpdate(nextProps: RightDropFieldProps, nextState: BaseStates) {
        if (
            this.props.students === nextProps.students &&
            this.props.rightPagetions === nextProps.rightPagetions &&
            this.props.rightAllChecked === nextProps.rightAllChecked &&
            this.state.checkedList === nextState.checkedList
        ) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps: RightDropFieldProps) {
        if (this.props.rightAllChecked !== prevProps.rightAllChecked) {
            this.setState(
                {
                    checkedList: this.props.rightAllChecked,
                },
                () => {
                    this.props.checkedChange && this.props.checkedChange(this.props.rightAllChecked);
                },
            );
        }
    }

    checkedChange = (field: any, checked: boolean) => {
        let data: any[] = [];
        const { checkedList } = this.state;
        if (checked) {
            checkedList.push(field);
            data = checkedList;
        } else {
            const list = checkedList.filter((item) => field.id !== item.id);
            this.setState({ checkedList: list });
            data = list;
        }
        this.props.checkedChange && this.props.checkedChange(data);
    };

    render() {
        const { students, columns, rightPagetions, onClildrenChange, showRightNum, propsRightPagetions, dragHolderMessag, disabled } = this.props;
        const { checkedList } = this.state;
        const maxNum = rightPagetions.pageNum * rightPagetions.pageSize;
        const minNum = rightPagetions.pageNum ? (rightPagetions.pageNum - 1) * rightPagetions.pageSize : 0;
        return students
            .filter((_item: any, index: number) => (propsRightPagetions && !propsRightPagetions.scroll ? minNum <= index && index < maxNum : true))
            .map((item: any, index: number) => (
                <RightDragField
                    checkedChange={this.checkedChange}
                    checkedList={checkedList}
                    item={item}
                    key={item.id}
                    showRightNum={showRightNum}
                    index={propsRightPagetions && !propsRightPagetions.scroll ? index + minNum : index}
                    columns={columns}
                    onClildrenChange={onClildrenChange}
                    dragHolderMessag={dragHolderMessag}
                    disabled={disabled}
                />
            ));
    }
}

export default RightDropField;
