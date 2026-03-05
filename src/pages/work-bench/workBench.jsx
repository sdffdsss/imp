import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateWorkStationConfiguration } from './api';
import WorkbenchComponent from '@Components/workbench-components';
import { _ } from 'oss-web-toolkits';
import './index.less';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging, draggableStyle, isEnd) => ({
    // userSelect: 'none',
    padding: 0,
    margin: `0 0 ${isEnd ? '10px' : '12px'} 0`,
    // border: "1px solid #ccc",
    display: 'flex',
    ...draggableStyle,
    cursor: 'auto',
    flex: 1,
});

const getListStyle = (isDraggingOver, direction) =>
    direction === 'left'
        ? {
              padding: '12px 12px 0 10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
          }
        : {
              padding: '12px 10px 0 0',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
          };

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsLeft: this.getItems('left'),
            itemsRight: this.getItems('right'),
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    getItems = (type, data) => {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        let newData = [];
        if (this.props) {
            const { defaultData } = this.props;
            newData = defaultData;
        } else if (data) {
            newData = data;
        }
        const itemList = [];
        newData.forEach((k) => {
            if (k.direction === type) {
                itemList.push({
                    id: k.id,
                    direction: k.direction,
                    config: k.config,
                });
            }
        });
        return itemList;
    };

    componentWillReceiveProps(pro) {
        // const { itemsLeft, itemsRight } = this.state;
        // console.log([...itemsLeft, ...itemsRight],pro.defaultData)
        if (pro.count !== this.props.count) {
            this.setState({
                itemsLeft: this.getItems('left', pro.defaultData),
                itemsRight: this.getItems('right', pro.defaultData),
            });
        }
    }

    // static getDerivedStateFromProps = (nextProps, state) => {
    //   if (!_.isEmpty(nextProps.defaultData)) {
    //     return new Index().getPropsData(nextProps, state);
    //   }
    //   return null;
    // };

    // isEqual(arr1, arr2) {
    //   return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
    // }

    // getPropsData = (nextProps, state) => {
    //   console.log(nextProps,state)
    //   if (
    //     this.isEqual(
    //       nextProps.defaultData.map((item) => item.id),
    //       [...state.itemsLeft, ...state.itemsRight].map((item) => item.id)
    //     )
    //   ) {
    //     return null;
    //   }
    //   return {
    //     itemsLeft: this.getItems("left", nextProps.defaultData),
    //     itemsRight: this.getItems("right", nextProps.defaultData),
    //   };
    // };

    handleToolsChange = (id, data) => {
        const { benchType } = this.props;
        const { itemsLeft, itemsRight } = this.state;
        const newList = [...itemsLeft, ...itemsRight];
        newList.forEach((item) => {
            if (item.id === '0') {
                item.config = data;
            }
        });
        this.setState(
            {
                itemsLeft: newList.filter((item) => item.direction === 'left'),
                itemsRight: newList.filter((item) => item.direction === 'right'),
            },
            () => {
                // return
                const params = benchType
                    ? {
                          configType: benchType,
                      }
                    : {
                          userId: this.props.login.userId,
                      };
                updateWorkStationConfiguration({
                    ...params,
                    workStationConfiguration: JSON.stringify(
                        newList.map((item) => ({
                            id: item.id,
                            direction: item.direction,
                            config: item.config,
                        })),
                    ),
                });
            },
        );
    };

    handleElement = (id) => {
        const { benchType, theme, onGroupChange } = this.props;

        return WorkbenchComponent({
            id,
            benchType,
            theme,
            onGroupChange,
        });
    };

    onDragEnd(result, direction) {
        const { itemsLeft, itemsRight } = this.state;
        const { benchType, handleDrag } = this.props;
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const itemsBoth = reorder(direction === 'left' ? itemsLeft : itemsRight, result.source.index, result.destination.index);
        const restList = direction === 'left' ? itemsRight : itemsLeft;
        const updateList = [...itemsBoth, ...restList];
        if (direction === 'left') {
            this.setState({
                itemsLeft: itemsBoth,
            });
        } else {
            this.setState({
                itemsRight: itemsBoth,
            });
        }

        handleDrag && handleDrag(updateList);

        const params = benchType
            ? {
                  configType: benchType,
              }
            : {
                  userId: this.props.login.userId,
              };
        updateWorkStationConfiguration({
            ...params,
            workStationConfiguration: JSON.stringify(
                updateList.map((item) => ({
                    id: item.id,
                    direction: item.direction,
                    config: item.config,
                })),
            ),
        });
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    minHeight: '800px',
                    minWidth: '1024px',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: '76%',
                    }}
                >
                    <DragDropContext onDragEnd={(e) => this.onDragEnd(e, 'left')}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, 'left')}>
                                    {this.state.itemsLeft.map((item, index) => {
                                        return (
                                            <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={item.id === '0'}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className="item-div"
                                                        ref={provided.innerRef}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style,
                                                            index === this.state.itemsLeft.length - 1,
                                                        )}
                                                    >
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                            style={{
                                                                width: '100%',
                                                                height: '50px',
                                                                position: 'absolute',
                                                                zIndex: 10,
                                                            }}
                                                        />
                                                        {this.handleElement(item.id, item.config)}
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
                </div>
                <div
                    style={{
                        height: '100%',
                        width: '24%',
                    }}
                >
                    <DragDropContext onDragEnd={(e) => this.onDragEnd(e, 'right')}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, 'right')}>
                                    {this.state.itemsRight.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className="item-div"
                                                    ref={provided.innerRef}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style,
                                                        index === this.state.itemsRight.length - 1,
                                                    )}
                                                >
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        style={{
                                                            width: '100%',
                                                            height: '50px',
                                                            position: 'absolute',
                                                            zIndex: 10,
                                                        }}
                                                    />
                                                    {this.handleElement(item.id, item.config)}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        );
    }
}

export default Index;
