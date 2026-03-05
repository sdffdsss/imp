import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Input, Icon, Popover, Button, Divider, Form, InputNumber, Space, Pagination, Checkbox } from 'oss-ui';
import './index.less';
import { _ } from 'oss-web-toolkits';

const getListStyle = () => ({
    overflowY: 'auto',
    width: '100%',
    height: '100%',
});
// 设置样式
const getItemStyle = (isDragging, draggableStyle, index) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    lineHeight: '24px',
    // 拖拽的时候背景变化
    background: isDragging && '#236fab',
    ...draggableStyle,
});
// 重新记录数组顺序
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    // 删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    return result;
};
// 插入排序
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
// 所有列可拖动节点
class LeftDragField extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checked: null,
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.checkedList !== prevProps.checkedList) {
            const obj = this.props.checkedList.find((current) => current.id === this.props.item.id);
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
    checkChange = (item, e) => {
        const { checkedChange } = this.props;
        if (e.target.checked) {
            this.setState({
                checked: item.id,
            });
        } else {
            this.setState({
                checked: null,
            });
        }
        checkedChange && checkedChange(item, e.target.checked);
    };
    render() {
        const { columns, item, index } = this.props;
        const { checked } = this.state;
        return (
            <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
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
                                {/* <Icon antdIcon type="UnorderedListOutlined" /> */}
                                <Checkbox checked={checked === item.id} onChange={this.checkChange.bind(this, item)}></Checkbox>
                            </div>
                            <div className="columns-sort-drag-header-num">{index + 1}</div>
                            <div className="columns-sort-drag-header-field">
                                {columns &&
                                    columns
                                        .filter((itemss) => !itemss.allOptionsHide)
                                        .map((items) => {
                                            const style = items.allOptionsWidth
                                                ? {
                                                      width: items.allOptionsWidth,
                                                  }
                                                : items.width && {
                                                      width: items.width,
                                                  };
                                            return (
                                                <div
                                                    className="columns-sort-drag-header-field-info"
                                                    key={items.key}
                                                    // {...style}
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
// 展示列可拖动节点
class RightDragField extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            checked: null,
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.checkedList !== prevProps.checkedList) {
            const obj = this.props.checkedList.find((current) => current.id === this.props.item.id);
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
    nodeType = (items) => {
        let type;
        switch (items) {
            case 'alias':
                type = 'string';
                break;
            case 'width':
                type = 'number';
                break;

            default:
                type = 'string';
                break;
        }
        return type;
    };
    changeName = (flag, list, id, key, value) => {
        const newIdList = id.split('-');
        if (flag) {
            const data = {
                id: newIdList[newIdList.length - 1],
                key,
                value,
                stateKey: list,
            };
            this.props.onClildrenChange && this.props.onClildrenChange(data);
        }
        this.setState({
            visible: false,
        });
    };
    onPopoverChange = (key) => {
        this.setState({
            visible: key,
        });
    };
    checkChange = (item, e) => {
        const { checkedChange } = this.props;
        if (e.target.checked) {
            this.setState({
                checked: item.id,
            });
        } else {
            this.setState({
                checked: null,
            });
        }

        checkedChange && checkedChange(item, e.target.checked);
    };

    render() {
        const { columns, item, index } = this.props;
        const { visible, checked } = this.state;
        return (
            <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
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
                                <Checkbox onChange={this.checkChange.bind(this, item)} checked={checked === item.id}></Checkbox>
                                {/* <Icon antdIcon type="UnorderedListOutlined" /> */}
                            </div>
                            <div className="columns-sort-drag-header-num">{index + 1}</div>
                            {columns &&
                                columns
                                    .filter((itemss) => !itemss.selectOptionsHide)
                                    .map((items) => {
                                        const style = items.selectOptionsWidth
                                            ? {
                                                  width: items.selectOptionsWidth,
                                              }
                                            : items.width && {
                                                  width: items.width,
                                              };
                                        return (
                                            <div
                                                className="columns-sort-drag-header-field-info"
                                                key={items.key}
                                                style={style}
                                                title={!items.render && item[items.key]}
                                            >
                                                {items.render ? (
                                                    items.render(item.key, item)
                                                ) : items.editFlag ? (
                                                    <Popover
                                                        visible={visible == `selectOptionsList-${items.key}-${item.id}`}
                                                        content={
                                                            <EditNode
                                                                title={item[items.key]}
                                                                id={`selectOptionsList-${items.key}-${item.id}`}
                                                                name={items.key}
                                                                nodeType={this.nodeType(items.key)}
                                                                type="selectOptionsList"
                                                                changeName={this.changeName}
                                                            />
                                                        }
                                                        title={`编辑${items.title}`}
                                                        trigger="click"
                                                    >
                                                        <Button
                                                            type="link"
                                                            onClick={this.onPopoverChange.bind(this, `selectOptionsList-${items.key}-${item.id}`)}
                                                        >
                                                            {item[items.key]}
                                                        </Button>
                                                    </Popover>
                                                ) : (
                                                    item[items.key]
                                                )}
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
// 所有列可拖动节点
class DrogField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
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
    componentDidUpdate(prevProps) {
        if (this.props.students !== prevProps.students) {
            this.setState({
                checkedList: [],
            });
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
    checkedChange = (field, checked) => {
        let data = [];
        const { checkedList } = this.state;
        if (checked) {
            checkedList.push(field);
            data = checkedList;
        } else {
            const list = checkedList.filter((item) => field.id !== item.id);
            this.setState({
                checkedList: list,
            });
            data = list;
        }
        this.props.checkedChange && this.props.checkedChange(data);
    };
    render() {
        const { columns, students, leftPagetions } = this.props;
        const { checkedList } = this.state;
        const maxNum = leftPagetions.pageNum * leftPagetions.pageSize;
        const minNum = leftPagetions.pageNum ? (leftPagetions.pageNum - 1) * leftPagetions.pageSize : 0;
        return students
            .filter((item, index) => minNum <= index && index < maxNum)
            .map((item, index) => (
                <LeftDragField
                    checkedList={checkedList}
                    checkedChange={this.checkedChange}
                    item={item}
                    key={item.id}
                    index={index + minNum}
                    columns={columns}
                />
            ));
    }
}
// 展示列可拖动节点
class RightDropField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
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
    componentDidUpdate(prevProps) {
        if (this.props.students !== prevProps.students) {
            this.setState({
                checkedList: [],
            });
        }
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
    checkedChange = (field, checked) => {
        let data = [];
        const { checkedList } = this.state;
        if (checked) {
            checkedList.push(field);
            data = checkedList;
        } else {
            const list = checkedList.filter((item) => field.id !== item.id);
            this.setState({
                checkedList: list,
            });
            data = list;
        }

        this.props.checkedChange && this.props.checkedChange(data);
    };
    render() {
        const { columns, students, onClildrenChange } = this.props;
        const { checkedList } = this.state;
        return students.map((item, index) => (
            <RightDragField
                checkedList={checkedList}
                checkedChange={this.checkedChange}
                item={item}
                index={index}
                columns={columns}
                key={item.id}
                onClildrenChange={onClildrenChange}
            />
        ));
    }
}
// 可编辑组件
const EditNode = (props) => {
    const [name, setName] = useState(props.title);
    const [form] = Form.useForm();
    useEffect(() => {
        setName(props.title);
    }, [props.title]);
    const titleChange = (e) => {
        setName(e);
    };
    const titleSave = () => {
        props.changeName && props.changeName(true, props.type, props.id, props.name, name);
    };
    const titleCancel = () => {
        setName(props.title);
        props.changeName && props.changeName(false, props.type, props.id);
    };
    return (
        <>
            {props.nodeType === 'string' && (
                <Form name="basic" form={form} initialValues={{ name }} onFinish={titleSave}>
                    <Form.Item name="name" rules={[{ required: true, whitespace: true, message: '内容不能为空！' }]}>
                        <Input
                            onChange={(e) => titleChange(e.target.value)}
                            addonAfter={
                                <Fragment>
                                    <Button type="link" htmlType="submit">
                                        保存
                                    </Button>
                                    <Divider type="vertical" />
                                    <Button type="link" onClick={titleCancel}>
                                        取消
                                    </Button>
                                </Fragment>
                            }
                        />
                    </Form.Item>
                </Form>
            )}
            {props.nodeType === 'number' && (
                <Fragment>
                    <Space>
                        <InputNumber value={name} onChange={titleChange} min={1} />
                        <Button type="link" onClick={(e) => titleSave()}>
                            保存
                        </Button>
                        <Divider type="vertical" />
                        <Button type="link" onClick={titleCancel}>
                            取消
                        </Button>
                    </Space>
                </Fragment>
            )}
        </>
    );
};

class Default extends React.PureComponent {
    static propTypes = {
        // 所有选择项
        allOptionsList: PropTypes.array,
        // 需要展示的项
        selectOptionsList: PropTypes.array,
        // 左右项的名字
        allOptionsLabel: PropTypes.string,
        selectOptionsLabel: PropTypes.string,
        // 表头，列类目
        columns: PropTypes.array,
        // 拖拽传递抛出展示项list集合
        onChange: PropTypes.func,
        style: PropTypes.object,
        searchParams: PropTypes.object,
        request: PropTypes.func,
    };
    // allOptionsList/columns 格式

    /**
     * allOptionsList/columns格式
     * {
        id: 1 //主键不能重复 必填字段,
        name: '张三',
        field: 'zhangsan',
        alais:'狗蛋',
        width:'100'
        },
     */
    /**
     * columns 表头
     * 序号不在columns管理范围内，不支持重写
     * 默认值 (名称、字段、别名、宽)度自定义字段
     * 数据格式
     * {
     *    key:'1' 字符串类型，必填字段,不能重复 该字段和allOptionsList/selectOptionsList区域的
     *    title:'张三' 字符串类型,
     *    editFlag:false, //是否允许修改，修改为气泡窗的形式
     *    allOptionsHide:true  //boolean值类型  true的时候所有字段区域不展示该字段，默认为false 展示
     *    selectOptionsHide:true //boolean值类型 true的时候展示字段区域不展示改字段，默认为false 展示
     *    width:80  //自定义列宽属性通用属性，影响两边
     *    allOptionsWidth //所有字段区域列宽属性，设置此属性 通用width属性在此处失效
     *    selectOptionsWidth //展示字段区域列宽属性，设置此属性 通用width属性在此处失效
     * }
     */
    /**
     * request返回值类型为promise
     * resolve的结果数据格式
     * {
     *      data:[] 数据返回值集合,
     *      total:0 数据总量条数，如数据后端进行分页时传递，如后端为全量数据请传递null
     * }
     */
    static defaultProps = {
        allOptionsList: [],
        selectOptionsList: [],
        allOptionsLabel: '所有字段',
        selectOptionsLabel: '展示字段',
        columns: [
            {
                key: 'name',
                title: '名称',
                // allOptionsHide: true,
                // editFlag: true,
                // width: 160,
                // allOptionsWidth: 200,
            },
            {
                key: 'field',
                title: '字段',
                // editFlag: true,
                // selectOptionsHide: true,
            },
            {
                key: 'alias',
                title: '别名',
                // editFlag: true,
            },
            {
                key: 'width',
                title: '宽度',
            },
        ],
        style: {},
        searchParams: {
            searchField: 'word',
            paging: false,
        },
    };
    constructor(props) {
        super(props);
        this.state = {
            allOptionsList: props.request
                ? []
                : props.allOptionsList.filter((item) => !props.selectOptionsList.find((items) => `${item.id}` === `${items.id}`)),

            selectOptionsList: props.selectOptionsList,
            PopoverVisible: false,
            searchKey: '',
            leftPagetions: {
                pageSize: 20,
                pageNum: 1,
            },
            rightPagetions: {
                pageSize: 20,
                pageNum: 1,
            },
            leftPush: false,
            rightPush: false,
            leftCheckedList: [],
            rightCheckedList: [],
            indeterminate: false,
            rightCheckAll: false,
            rightAllChecked: [],
            rightAll: false,
            leftAll: false,
            leftAllChecked: [],
        };
        this.timer = null;
        this.dragRef = React.createRef(null);
    }
    componentDidMount() {
        const { leftPagetions, rightPagetions, allOptionsList } = this.state;
        if (this.dragRef && this.dragRef.current) {
            const dragHeig = parseInt(`${this.dragRef.current.clientHeight / 35}`, 10);
            const { request, searchParams } = this.props;
            if (dragHeig > leftPagetions.pageSize) {
                this.setState({
                    leftPagetions: {
                        ...leftPagetions,
                        pageSize: dragHeig,
                    },
                    rightPagetions: {
                        ...rightPagetions,
                        pageSize: dragHeig,
                    },
                    allLen: allOptionsList.length,
                });
            } else {
                this.setState({
                    allLen: allOptionsList.length,
                });
            }
            if (request) {
                const params = {
                    [searchParams.searchField]: '',
                    ...leftPagetions,
                    pageSize: dragHeig,
                };
                this.setState({
                    leftPagetions: {
                        ...leftPagetions,
                        pageSize: params.pageSize,
                    },
                });
                this.getRequest(params);
            }
        }
    }
    getRequest = async (params) => {
        const { request } = this.props;
        const { selectOptionsList } = this.state;
        const data = await request(params);
        this.setState({
            allOptionsList: data.data.filter((item) => !selectOptionsList.find((items) => `${item.id}` === `${items.id}`)),
            leftPush: false,
            leftCheckedList: [],
            leftAll: false,
            allLen: data.total ? data.total : data.data.filter((item) => !selectOptionsList.find((items) => `${item.id}` === `${items.id}`)).length,
        });
    };
    componentDidUpdate(prevProps) {
        if (this.props.selectOptionsList !== prevProps.selectOptionsList || this.props.allOptionsList !== prevProps.allOptionsList) {
            const { searchKey, allOptionsList, allLen } = this.state;
            const { request, searchParams } = this.props;
            if (request) {
                const list = allOptionsList.filter((item) => !this.props.selectOptionsList.find((items) => `${item.id}` === `${items.id}`));
                this.setState({
                    selectOptionsList: this.props.selectOptionsList,
                    allOptionsList: list,
                    allLen: searchParams.paging ? allLen : list.length,
                });
            } else {
                const list = this.props.allOptionsList
                    .filter((item) => !this.props.selectOptionsList.find((items) => `${item.id}` === `${items.id}`))
                    .filter((item) => {
                        const { name = '', field = '' } = item;
                        return (
                            searchKey.indexOf(name || field || '') !== -1 ||
                            (name && name.indexOf(searchKey) !== -1) ||
                            (field && field.indexOf(searchKey) !== -1)
                        );
                    });
                this.setState({
                    allOptionsList: list,
                    selectOptionsList: this.props.selectOptionsList,
                    allLen: list.length,
                });
            }
        }
    }
    // 拖拽放置函数
    onDragEnd = (result) => {
        const { searchParams } = this.props;
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const sInd = source.droppableId;
        const dInd = destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(this.state[sInd], source.index, destination.index);
            this.setState(
                {
                    [sInd]: items,
                },
                () => {
                    if (dInd === 'selectOptionsList') this.props.onChange && this.props.onChange(items);
                },
            );
        } else {
            const result = move(this.state[sInd], this.state[dInd], source, destination);
            const stateData = {
                [sInd]: result[sInd],
                [dInd]: result[dInd],
            };
            if (!searchParams.paging) {
                stateData.allLen = sInd === 'selectOptionsList' ? result[dInd].length : result[sInd].length;
            }
            this.setState(
                {
                    [sInd]: result[sInd],
                    [dInd]: result[dInd],
                    allLen: sInd === 'selectOptionsList' ? result[dInd].length : result[sInd].length,
                },
                () => {
                    if (dInd === 'selectOptionsList') this.props.onChange && this.props.onChange(result[dInd]);
                    if (sInd === 'selectOptionsList') this.props.onChange && this.props.onChange(result[sInd]);
                },
            );
        }
    };

    searchKeyChange = (e) => {
        this.setState({ searchKey: e.target.value });
    };

    onSearch = (e) => {
        const { selectOptionsList, leftPagetions } = this.state;
        const { allOptionsList, request, searchParams } = this.props;
        if (request) {
            this.setState(
                {
                    leftPagetions: {
                        ...leftPagetions,
                        pageNum: 1,
                    },
                },
                () => {
                    this.getRequest({
                        [searchParams.searchField]: e,
                        ...this.state.leftPagetions,
                    });
                },
            );
            return;
        }
        const list = this.props.allOptionsList
            .filter((item) => !selectOptionsList.find((items) => item.id === items.id))
            .map((item) => {
                const allObj = allOptionsList.find((current) => current.id === item.id);
                if (allObj) {
                    return allObj;
                }
                return item;
            });
        const dataList = list.filter(
            (item) => e.indexOf(item.name || item.field) !== -1 || item.name.indexOf(e) !== -1 || item.field.indexOf(e) !== -1,
        );
        this.setState({
            allOptionsList: dataList,
            leftPagetions: {
                ...leftPagetions,
                pageNum: 1,
            },
            leftPush: false,
            leftCheckedList: [],
            leftAll: false,
            allLen: dataList.length,
        });
    };
    onClildrenChange = (data) => {
        const list = this.state[data.stateKey].map((item) => {
            if (`${item.id}` === data.id) {
                return {
                    ...item,
                    [data.key]: data.value,
                };
            }
            return item;
        });
        this.setState(
            {
                [data.stateKey]: list,
            },
            () => {
                this.props.onChange && this.props.onChange(this.state.selectOptionsList);
            },
        );
    };
    pageChange = (pageNum, pageSize) => {
        const { searchParams, request } = this.props;
        const { searchKey } = this.state;
        if (request && searchParams?.paging) {
            const params = {
                [searchParams.searchField]: searchKey,
                pageNum,
                pageSize,
            };
            this.getRequest(params);
        }
        this.setState({
            leftPagetions: {
                pageNum,
                pageSize,
            },
            leftAll: false,
            leftAllChecked: [],
        });
    };
    rightpageChange = (pageNum, pageSize) => {
        this.setState({
            rightPagetions: {
                pageNum,
                pageSize,
            },
        });
    };
    checkedChangeLeft = (list) => {
        const { allOptionsList, leftPagetions } = this.state;
        const dataList = allOptionsList.filter(
            (item, index) => leftPagetions.pageNum - 1 <= index && leftPagetions.pageNum * leftPagetions.pageSize > index,
        );
        if (!_.isEmpty(list)) {
            if (list.length === dataList.length) {
                this.setState({
                    leftPush: true,
                    leftCheckedList: list,
                    leftAll: true,
                });
            } else {
                this.setState({
                    leftPush: true,
                    leftCheckedList: list,
                    leftAll: false,
                });
            }
        } else {
            this.setState({
                leftPush: false,
                leftCheckedList: list,
                leftAll: false,
            });
        }
    };
    checkedChangeRight = (list) => {
        if (!_.isEmpty(list)) {
            if (list.length === this.state.selectOptionsList.length) {
                this.setState({
                    rightPush: true,
                    rightCheckedList: list,
                    rightAll: true,
                });
            } else {
                this.setState({
                    rightPush: true,
                    rightCheckedList: list,
                    rightAll: false,
                });
            }
        } else {
            this.setState({
                rightPush: false,
                rightCheckedList: list,
                rightAll: false,
            });
        }
    };
    leftPushChange = () => {
        const { leftCheckedList, selectOptionsList, allOptionsList, leftPagetions } = this.state;
        const { searchParams } = this.props;
        const data = Array.from(selectOptionsList);
        const leftList = allOptionsList.filter((item) => !leftCheckedList.find((items) => items.id === item.id));
        const index = leftPagetions.pageNum ? (leftPagetions.pageNum - 1) * leftPagetions.pageSize : 0;
        data.splice(index, 0, ...leftCheckedList);
        const stateData = {
            allOptionsList: leftList,
            selectOptionsList: data,
            leftPush: false,
            leftCheckedList: [],
            leftAll: [],
            leftAllChecked: [],
        };
        if (!searchParams.paging) {
            stateData.allLen = leftList.length;
        }
        this.setState(
            {
                allOptionsList: leftList,
                selectOptionsList: data,
                leftPush: false,
                leftCheckedList: [],
                leftAll: [],
                leftAllChecked: [],
                allLen: leftList.length,
            },
            () => {
                this.props.onChange && this.props.onChange(data);
            },
        );
    };
    rightPushChange = () => {
        const { rightCheckedList, selectOptionsList, allOptionsList, rightPagetions } = this.state;
        const data = Array.from(allOptionsList);
        const rightList = selectOptionsList.filter((item) => !rightCheckedList.find((items) => items.id === item.id));
        const index = rightPagetions.pageNum ? (rightPagetions.pageNum - 1) * rightPagetions.pageSize : 0;
        data.splice(index, 0, ...rightCheckedList);
        const stateData = {
            allOptionsList: data,
            selectOptionsList: rightList,
            rightPush: false,
            rightCheckedList: [],
            rightAll: false,
            rightAllChecked: [],
            allLen: data.length,
        };
        if (!searchParams.paging) {
            stateData.allLen = data.length;
        }
        this.setState(
            {
                allOptionsList: data,
                selectOptionsList: rightList,
                rightPush: false,
                rightCheckedList: [],
                rightAll: false,
                rightAllChecked: [],
                allLen: data.length,
            },
            () => {
                this.props.onChange && this.props.onChange(rightList);
            },
        );
    };
    allRightCheckChange = (e) => {
        const { selectOptionsList } = this.state;
        if (e.target.checked) {
            this.setState({
                rightAllChecked: selectOptionsList,
                rightAll: e.target.checked,
            });
        } else {
            this.setState({
                rightAllChecked: [],
                rightAll: e.target.checked,
            });
        }
    };
    allLeftCheckChange = (e) => {
        const { allOptionsList, leftPagetions } = this.state;
        const list = allOptionsList.filter(
            (item, index) => leftPagetions.pageNum - 1 <= index && leftPagetions.pageNum * leftPagetions.pageSize > index,
        );
        if (e.target.checked) {
            this.setState({
                leftAllChecked: list,
                leftAll: e.target.checked,
            });
        } else {
            this.setState({
                leftAllChecked: [],
                leftAll: e.target.checked,
            });
        }
    };
    render() {
        const {
            allOptionsList,
            selectOptionsList,
            searchKey,
            leftPagetions,
            rightPush,
            rightPagetions,
            leftPush,
            rightAllChecked,
            rightAll,
            leftAll,
            leftAllChecked,
            allLen,
        } = this.state;
        const { style, columns, allOptionsLabel, selectOptionsLabel } = this.props;
        return (
            <div className="columns-sort-drag" style={style} id="sortDrag">
                <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                    <div className="columns-sort-drag-content" style={{ height: '100%' }}>
                        <div className="columns-sort-drag-content-left">
                            <div className="columns-sort-drag-search">
                                <span className="columns-sort-drag-search-title">{allOptionsLabel}</span>
                                <Input.Search
                                    style={{ flex: 'auto', width: 'auto' }}
                                    value={searchKey}
                                    onChange={this.searchKeyChange}
                                    onSearch={this.onSearch}
                                />
                            </div>
                            <div className="columns-sort-drag-list">
                                <div className="columns-sort-drag-list-page">
                                    <div className="columns-sort-drag-header columns-sort-drag-header-color">
                                        <div className="columns-sort-drag-header-num-empty">
                                            <Checkbox checked={leftAll} onChange={this.allLeftCheckChange}></Checkbox>
                                        </div>
                                        <div className="columns-sort-drag-header-num">序号</div>
                                        {columns &&
                                            columns
                                                .filter((itemss) => !itemss.allOptionsHide)
                                                .map((item) => {
                                                    const style = item.allOptionsWidth
                                                        ? { width: item.allOptionsWidth }
                                                        : item.width && {
                                                              width: item.width,
                                                          };
                                                    return (
                                                        <div className="columns-sort-drag-header-field-info" style={style} key={item.key}>
                                                            {item.title}
                                                        </div>
                                                    );
                                                })}
                                    </div>
                                    <div className="columns-sort-drag-list-content" style={{}} ref={this.dragRef}>
                                        <Droppable droppableId="allOptionsList" key="allOptionsList" direction="vertical">
                                            {(provided, snapshot) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
                                                    <DrogField
                                                        leftPagetions={leftPagetions}
                                                        students={allOptionsList}
                                                        columns={columns}
                                                        checkedChange={this.checkedChangeLeft}
                                                        leftAllChecked={leftAllChecked}
                                                    />
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                    <div className="pagingtions-field">
                                        <Pagination
                                            simple
                                            current={leftPagetions.pageNum}
                                            pageSize={leftPagetions.pageSize}
                                            total={allLen}
                                            onChange={this.pageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="columns-sort-drag-direction">
                            <Button size="small" type={leftPush ? 'primary' : 'default'} onClick={this.leftPushChange}>
                                <Icon antdIcon type="RightOutlined" style={{ color: leftPush && '#fff' }} />
                            </Button>
                            <Button size="small" style={{ marginTop: 10 }} type={rightPush ? 'primary' : 'default'} onClick={this.rightPushChange}>
                                <Icon antdIcon type="LeftOutlined" style={{ color: rightPush && '#fff' }} />
                            </Button>
                        </div>
                        <div className="columns-sort-drag-content-right">
                            <div className="columns-sort-drag-search">
                                <div className="columns-sort-drag-search-title">{selectOptionsLabel}</div>
                                {/* <div>
                                    <Button type="link" >批量操作</Button>
                                </div> */}
                            </div>
                            <div className="columns-sort-drag-list">
                                <div className="columns-sort-drag-list-page">
                                    <div className="columns-sort-drag-header columns-sort-drag-header-color">
                                        <div className="columns-sort-drag-header-num-empty">
                                            <Checkbox checked={rightAll} onChange={this.allRightCheckChange}></Checkbox>
                                        </div>
                                        <div className="columns-sort-drag-header-num">序号</div>

                                        {columns &&
                                            columns
                                                .filter((item) => !item.selectOptionsHide)
                                                .map((item) => {
                                                    const style = item.selectOptionsWidth
                                                        ? { width: item.selectOptionsWidth }
                                                        : item.width && {
                                                              width: item.width,
                                                          };
                                                    return (
                                                        <div className="columns-sort-drag-header-field-info" style={style} key={item.key}>
                                                            {item.title}
                                                        </div>
                                                    );
                                                })}
                                    </div>
                                    <div className="columns-sort-drag-list-content" style={{ height: 'calc(100% - 32px)' }}>
                                        <Droppable droppableId="selectOptionsList" direction="vertical" key="selectOptionsList">
                                            {(provided, snapshot) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
                                                    <RightDropField
                                                        rightAllChecked={rightAllChecked}
                                                        students={selectOptionsList}
                                                        rightPagetions={rightPagetions}
                                                        columns={columns}
                                                        onClildrenChange={this.onClildrenChange}
                                                        checkedChange={this.checkedChangeRight}
                                                    />
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DragDropContext>
            </div>
        );
    }
}
export default React.memo(Default);
