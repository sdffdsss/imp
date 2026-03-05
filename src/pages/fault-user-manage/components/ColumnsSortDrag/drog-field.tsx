import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from 'oss-ui';
import './index.less';

const getItemStyle = (isDragging: boolean, draggableStyle: any, index: number) => ({
    userSelect: 'none',
    lineHeight: '24px',
    boxShadow: isDragging && '0px 0px 5px 0px #a5a5a5',
    ...draggableStyle,
});

interface BaseProps {
    checkedChange: (item: any, value: any) => void;
    columns: any[];
    item: {
        id: any;
        key: any;
    };
    index: number;
    checkedList: any[];
    showLeftNum: boolean;
    disabled?: boolean;
}

interface BaseStatesLeft {
    checked?: any;
}

class LeftDragField extends React.Component<BaseProps, BaseStatesLeft> {
    constructor(props: BaseProps) {
        super(props);
        this.state = {
            checked: null,
        };
    }

    componentDidUpdate(prevProps: BaseProps) {
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
        const { columns, item, index, showLeftNum, disabled } = this.props;
        const { checked } = this.state;
        return (
            <Draggable key={item.id} draggableId={`${item.id}`} index={index} isDragDisabled={!!disabled}>
                {(provided, snapshot) => (
                    <div
                        className={index % 2 === 0 ? 'drag-columns-one' : 'drag-columns-two'}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, index)}
                    >
                        <div className="columns-sort-drag-header">
                            <div className="columns-sort-drag-header-num-empty">
                                <Checkbox checked={checked === item.id} onChange={this.checkChange.bind(this, item)} disabled={disabled} />
                            </div>
                            {showLeftNum && <div className="columns-sort-drag-header-num">{index + 1}</div>}
                            <div className="columns-sort-drag-header-field">
                                {columns &&
                                    columns
                                        .filter((itemss) => !itemss.allOptionsHide)
                                        .map((items) => {
                                            const style = items.allOptionsWidth
                                                ? { width: items.allOptionsWidth }
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
                    </div>
                )}
            </Draggable>
        );
    }
}

interface DrogFieldProps {
    students: any;
    leftPagetions: any;
    checkedChange: (item: any[], field?: any) => void;
    columns: any[];
    leftAllChecked: any[];
    paging: boolean;
    showLeftNum: boolean;
    propsLeftPagetions: any;
    disabled?: boolean;
}

interface BaseStates {
    checkedList: any[];
}

class DrogField extends React.Component<DrogFieldProps, BaseStates> {
    constructor(props: DrogFieldProps) {
        super(props);
        this.state = {
            checkedList: [],
        };
    }

    shouldComponentUpdate(nextProps: DrogFieldProps, nextState: BaseStates) {
        if (
            this.props.students === nextProps.students &&
            this.props.leftPagetions === nextProps.leftPagetions &&
            this.props.leftAllChecked === nextProps.leftAllChecked &&
            this.state.checkedList === nextState.checkedList
        ) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps: DrogFieldProps) {
        if (this.props.students !== prevProps.students) {
            this.setState({ checkedList: [] });
        }
        if (this.props.leftAllChecked !== prevProps.leftAllChecked) {
            this.setState(
                {
                    checkedList: this.props.leftAllChecked,
                },
                () => {
                    this.props.checkedChange && this.props.checkedChange(this.props.leftAllChecked);
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
        const { columns, students, leftPagetions, paging, showLeftNum, propsLeftPagetions, disabled } = this.props;
        const { checkedList } = this.state;
        const maxNum = leftPagetions.pageNum * leftPagetions.pageSize;
        const minNum = leftPagetions.pageNum ? (leftPagetions.pageNum - 1) * leftPagetions.pageSize : 0;
        return students
            .filter((_item: any, index: number) => (paging || !propsLeftPagetions ? true : minNum <= index && index < maxNum))
            .map((item: any, index: number) => (
                <LeftDragField
                    checkedChange={this.checkedChange}
                    checkedList={checkedList}
                    item={item}
                    key={item.id}
                    showLeftNum={showLeftNum}
                    index={paging || !propsLeftPagetions ? index : index + minNum}
                    columns={columns}
                    disabled={disabled}
                />
            ));
    }
}

export default DrogField;
