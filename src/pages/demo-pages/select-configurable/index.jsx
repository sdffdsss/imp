/* eslint-disable @typescript-eslint/no-shadow */
import React, { Fragment } from 'react';
import { Select, Divider, Input, Icon, Popover, Button } from 'oss-ui';
import { customAlphabet } from 'nanoid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Option } = Select;

const PopoverContent = ({ parameter, optionsChange }) => {
    const onDragStart = () => {};
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const sIndex = source.index;
        const eIndex = destination.index;
        if (sIndex !== eIndex) {
            optionsChange(result.draggableId, sIndex, eIndex);
        }
    };
    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <Droppable droppableId="droppable-1" type="PERSON">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div>
                            {parameter.options.map((item, index) => (
                                <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : '#ffffff' }}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Icon antdIcon type="MenuUnfoldOutlined" style={{ marginRight: '5px' }} />
                                            {item.label}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 数据样式
            parameter: {
                selectKey: undefined, // 选择值
                options: [],
            },
            name: '',
            selectVal: '',
            buttonState: 'add', // 按钮新增修改状态
            rowObj: {
                id: '',
                label: '',
            },
        };
    }
    componentDidMount() {
        const { parameter } = this.props;
        if (parameter) {
            this.setState({
                parameter,
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.parameter !== prevProps.parameter) {
            this.setState({
                parameter: this.props.parameter,
            });
        }
    }

    onNameChange = (event) => {
        this.setState({
            name: event.target.value,
        });
    };

    // nameEditChange = (event) => {
    //     event.stopPropagation();
    //     this.setState({
    //         rowName: event.target.value,
    //     });
    // };

    bannedClick = (event) => {
        event.stopPropagation();
    };

    addItem = () => {
        const { name, parameter } = this.state;
        if (name) {
            const nanoid = customAlphabet('1234567890', 15);
            const optionsObj = { label: name, id: nanoid(), sort: parameter.options.length + 1 };
            parameter.options.push(optionsObj);
            this.setState(
                {
                    parameter: {
                        selectKey: parameter.selectKey,
                        options: parameter.options,
                    },
                    name: '',
                },
                () => {
                    if (this.props.onChange) {
                        this.props.onChange(this.state.parameter, 'add', optionsObj);
                    }
                },
            );
        }
    };

    editItem = (key, label, e) => {
        e.stopPropagation();
        this.setState({
            selectVal: key,
            name: label,
            buttonState: 'edit', // 按钮新增修改状态
            rowObj: {
                id: key,
                label,
            },
        });
    };

    saveItem = (e) => {
        e.stopPropagation();
        let obj = {};
        const { parameter, rowObj, name } = this.state;
        const optionsList = parameter.options.map((item) => {
            if (item.id === rowObj.id) {
                obj = {
                    ...item,
                    label: name,
                };
                return {
                    ...item,
                    label: name,
                };
            }
            return {
                ...item,
            };
        });
        this.setState(
            {
                parameter: {
                    selectKey: parameter.selectKey,
                    options: optionsList,
                },
                name: '',
                selectVal: '',
                buttonState: 'add', // 按钮新增修改状态
                rowObj: {
                    id: '',
                    label: '',
                },
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.parameter, 'edit', obj);
                }
            },
        );
    };

    delItem = (key, e) => {
        e.stopPropagation();
        const { parameter } = this.state;

        const obj = parameter.options.find((item) => item.id === key);
        const optionsList = parameter.options.filter((obj) => obj.id !== key);
        const sortOptions = optionsList.map((item, index) => {
            return {
                ...item,
                sort: index + 1,
            };
        });

        this.setState(
            {
                parameter: {
                    selectKey: key === parameter.selectKey ? '' : parameter.selectKey,
                    options: sortOptions,
                },
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.parameter, 'del', obj);
                }
            },
        );
    };

    undoItem = (e) => {
        e.stopPropagation();
        this.setState({
            name: '',
            selectVal: '',
            buttonState: 'add', // 按钮新增修改状态
            rowObj: {
                id: '',
                label: '',
            },
        });
    };

    selectChange = (e) => {
        const { parameter } = this.state;
        this.setState(
            {
                parameter: {
                    selectKey: e,
                    options: parameter.options,
                },
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.parameter, 'change');
                }
            },
        );
    };

    optionsChange = (id, sIndex, eIndex) => {
        const { parameter } = this.state;
        const result = Array.from(parameter.options);
        // 删除并记录 删除元素
        const [removed] = result.splice(sIndex, 1);
        // 将原来的元素添加进数组
        result.splice(eIndex, 0, removed);
        const sortOptions = result.map((item, index) => {
            return {
                ...item,
                sort: index + 1,
            };
        });
        this.setState(
            {
                parameter: {
                    selectKey: parameter.selectKey,
                    options: sortOptions,
                },
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.parameter, 'sort');
                }
            },
        );
    };

    render() {
        const { name, parameter, selectVal, buttonState } = this.state;
        return (
            <Fragment>
                <Select
                    style={{ width: 240 }}
                    value={parameter.selectKey}
                    optionLabelProp="label"
                    onChange={this.selectChange}
                    dropdownRender={(menu) => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Input style={{ flex: 'auto' }} value={name} onChange={this.onNameChange} />
                                {buttonState === 'add' ? (
                                    <Button
                                        type="link"
                                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                        onClick={this.addItem}
                                    >
                                        <Icon antdIcon type="PlusOutlined" />
                                        新增
                                    </Button>
                                ) : (
                                    <Button
                                        type="link"
                                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                        onClick={this.saveItem}
                                    >
                                        <Icon type="iconbaocun" className="icon-style" />
                                        保存
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                >
                    {parameter.options.map((item) => (
                        <Option value={item.id} label={item.label}>
                            <div>
                                {item.id === selectVal ? (
                                    <Input
                                        type="text"
                                        style={{ width: '50%' }}
                                        value={item.label}
                                        // onChange={this.nameEditChange}
                                        // onClick={this.bannedClick}
                                    />
                                ) : (
                                    item.label
                                )}
                                {item.id === selectVal ? (
                                    ''
                                ) : (
                                    <Button type="link" onClick={this.delItem.bind(this, item.id)} style={{ float: 'right' }}>
                                        <Icon antdIcon type="DeleteOutlined" />
                                    </Button>
                                )}
                                {item.id === selectVal ? (
                                    <Button type="link" onClick={this.undoItem} style={{ float: 'right' }}>
                                        <Icon antdIcon type="RollbackOutlined" />
                                        撤销
                                    </Button>
                                ) : (
                                    <Button type="link" onClick={this.editItem.bind(this, item.id, item.label)} style={{ float: 'right' }}>
                                        <Icon antdIcon type="EditOutlined" />
                                    </Button>
                                )}
                            </div>
                        </Option>
                    ))}
                </Select>
                <Popover content={<PopoverContent parameter={parameter} optionsChange={this.optionsChange} />}>
                    <Button type="primary">排序</Button>
                </Popover>
            </Fragment>
        );
    }
}
