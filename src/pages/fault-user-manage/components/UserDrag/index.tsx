import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Row, Col, Input, Icon, Pagination, Button, Checkbox } from 'oss-ui';
import './index.less';

interface UserDragProps {
    allOptionsList?: any[];
    dataSel?: any[];
    onChange?: (list: any[]) => void;
    style?: React.CSSProperties;
    columns?: any[];
    allOptionsLabel?: string;
    selectOptionsLabel?: string;
    leftPagetions?: { pageSize: number; pageNum: number };
    request?: (params: any) => Promise<any>;
    searchParams?: { searchField: string; paging: boolean; pageSize: number };
    selectOptionsList?: any[];
    actionProps?: { showLeftSearch: boolean; showRightSearch: boolean; showLeftCheckbox?: boolean; showRightCheckbox?: boolean };
    isCreate?: boolean;
}

interface UserDragState {
    allOptionsList: any[];
    dataSel: any[];
    total: number;
    pageSize: number;
    pageNumber: number;
    searchKey: string;
    rightSearchKey: string;
    leftCheckedList: any[];
    rightCheckedList: any[];
    leftCheckAll: boolean;
    rightCheckAll: boolean;
    leftPush: boolean;
    rightPush: boolean;
}

const getListStyle = () => ({
    // background: '#fff',
    overflowY: 'auto',
    width: '100%',
    height: '100%',
});
// 设置样式
const getItemStyle = (isDragging, draggableStyle, index) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // color: '#fff',
    borderRadius: '3px',
    lineHeight: '24px',
    // 拖拽的时候背景变化
    // 拖拽的时候背景变化
    background: isDragging ? '#F4F4F4' : index % 2 === 0 ? '#F4F4F4' : '#FFFFFF',
    marginBottom: '3px',
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
const insert = (list, insertObj, endIndex) => {
    const result = Array.from(list);
    // 删除并记录 删除元素
    // const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, insertObj);
    return result;
};

class Default extends React.Component<UserDragProps, UserDragState> {
    static propTypes = {
        // 所有选择项
        allOptionsList: PropTypes.array,
        // 需要展示的项，即已选择的项
        dataSel: PropTypes.array,
        // 拖拽传递抛出展示项list集合
        onChange: PropTypes.func,
        style: PropTypes.object,
        // 列配置
        columns: PropTypes.array,
        // 左侧标题
        allOptionsLabel: PropTypes.string,
        // 右侧标题
        selectOptionsLabel: PropTypes.string,
        // 分页配置
        leftPagetions: PropTypes.object,
        // 数据请求函数
        request: PropTypes.func,
        // 搜索参数
        searchParams: PropTypes.object,
        // 已选数据 (兼容selectOptionsList)
        selectOptionsList: PropTypes.array,
        // 动作属性配置
        actionProps: PropTypes.object,
        // 是否是创建模式
        isCreate: PropTypes.bool,
    };
   
    static defaultProps = {
        allOptionsList: [],
        dataSel: [],
        style: {},
        columns: [],
        allOptionsLabel: '所有用户',
        selectOptionsLabel: '已选用户',
        leftPagetions: { pageSize: 20, pageNum: 1 },
        searchParams: { searchField: 'userName', paging: true, pageSize: 20 },
        selectOptionsList: [],
        actionProps: { showLeftSearch: true, showRightSearch: true, showLeftCheckbox: true, showRightCheckbox: true },
        isCreate: false,
    };
    componentDidMount() {
        // 移除初始数据加载，只在用户主动搜索时调用接口
    }

    fetchData = async () => {
        const { request, searchParams, leftPagetions } = this.props;
        const { pageNumber, pageSize, searchKey } = this.state;
        
        if (request) {
            try {
                const params = {
                    ...(searchParams || {}),
                    pageNum: leftPagetions?.pageNum || pageNumber,
                    pageSize: leftPagetions?.pageSize || pageSize,
                };
                
                // Add search context if available
                if (searchKey && searchParams?.searchField) {
                    params[searchParams.searchField] = searchKey;
                }
                
                const response = await request(params);
                if (response && response.data) {
                    // 从response.data中获取用户列表，并过滤掉已选用户
                    const currentDataSel = this.props.selectOptionsList || this.props.dataSel || [];
                    const userList = response.data.filter(
                        (item: any) => !currentDataSel.find((items: any) => `${item.userId}` === `${items.userId}`)
                    );
                    this.setState({
                        allOptionsList: userList,
                        total: response.total,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }
    };
    myRef: React.RefObject<any>;
    rightSearchRef: React.RefObject<any>;

    constructor(props: UserDragProps) {
        super(props);
        const pageSize = props.leftPagetions?.pageSize || 20;
        const pageNumber = props.leftPagetions?.pageNum || 1;
        // 初始化 state
        this.state = {
            allOptionsList: [],
            dataSel: props.dataSel || [],
            total: 0,
            pageSize: pageSize,
            pageNumber: pageNumber,
            searchKey: '',
            rightSearchKey: '',
            leftCheckedList: [],
            rightCheckedList: [],
            leftCheckAll: false,
            rightCheckAll: false,
            leftPush: false,
            rightPush: false,
        };
        
        this.myRef = React.createRef();
        this.rightSearchRef = React.createRef();
    }
    componentDidUpdate(prevProps: UserDragProps) {
        const currentDataSel = this.props.selectOptionsList || this.props.dataSel || [];
        const prevDataSel = prevProps.selectOptionsList || prevProps.dataSel || [];
        const { searchKey, allOptionsList } = this.state;
        
        if (currentDataSel !== prevDataSel) {
            // 当已选用户列表变化时，重新过滤所有用户列表
            const userList = allOptionsList.filter(
                (item) =>
                    !currentDataSel.find((items) => `${item.userId}` === `${items.userId}`) &&
                    !(searchKey !== undefined && searchKey !== '' && `${item.userName}`.indexOf(searchKey) < 0),
            );
            this.setState({
                allOptionsList: userList,
                dataSel: currentDataSel,
                total: userList.length,
                pageNumber: 1,
            });
        }
    }
    // 拖拽放置函数
    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        // 单一区域
        if (result.destination.droppableId === result.source.droppableId) {
            const list = reorder(this.state[result.destination.droppableId as keyof UserDragState] as any[], result.source.index, result.destination.index);
            this.setState(
                {
                    [result.destination.droppableId]: list,
                } as any,
                () => {
                    if (result.destination.droppableId === 'dataSel') this.props.onChange && this.props.onChange(list);
                },
            );
        } else {
            // 跨区域
            const interObj = (this.state[result.source.droppableId as keyof UserDragState] as any[])[result.source.index];
            const list = (this.state[result.source.droppableId as keyof UserDragState] as any[]).filter((item: any) => item.userId !== interObj.userId);
            const interList = insert(this.state[result.destination.droppableId as keyof UserDragState] as any[], interObj, result.destination.index);
            this.setState(
                {
                    [result.source.droppableId]: list,
                    [result.destination.droppableId]: interList,
                } as any,
                () => {
                    if (result.destination.droppableId === 'dataSel') this.props.onChange && this.props.onChange(interList);
                    if (result.source.droppableId === 'dataSel') this.props.onChange && this.props.onChange(list);
                },
            );
        }
    };
    onSearch = (e: string) => {
        const { request, searchParams } = this.props;
        const { searchKey } = this.state;
        
        if (request) {
            // If request prop is available, refetch data with search
            this.setState({ searchKey: e });
            this.fetchData();
        } else {
            // Otherwise use local filtering
            const allOptionsList = this.props.allOptionsList || [];
            const { dataSel, pageNumber, pageSize } = this.state;
            const list = allOptionsList.filter((item) => !dataSel.find((items) => item.userId === items.userId));

            const dataList = list.filter((item) => {
                const searchValue = e || searchKey;
                if (!searchValue) return true;
                
                // Support searching in multiple fields based on columns config
                const { columns = this.getDefaultColumns() } = this.props;
                return columns.some((column) => {
                    if (column.search === false) return false;
                    const fieldValue = item[column.key];
                    return fieldValue && fieldValue.toString().indexOf(searchValue) !== -1;
                });
            });
            
            const lastDataList = dataList.filter((item, index) => (pageNumber - 1) * pageSize <= index && index < pageNumber * pageSize);
            this.setState({
                allOptionsList: lastDataList,
                total: dataList.length,
                searchKey: e,
            });
        }
    };

    searchKeyChange = (e: any) => {
        this.setState({ searchKey: e.target.value });
    };

    rightSearchKeyChange = (e: any) => {
        this.setState({ rightSearchKey: e.target.value });
    };

    onRightSearch = (e: string) => {
        const { dataSel } = this.state;
        const searchContext = e;
        
        if (!searchContext) {
            // If search is empty, show all selected users
            const currentDataSel = this.props.selectOptionsList || this.props.dataSel || [];
            this.setState({ dataSel: currentDataSel });
        } else {
            // Filter selected users based on search
            const currentDataSel = this.props.selectOptionsList || this.props.dataSel || [];
            const filteredDataSel = currentDataSel.filter((item) => 
                item.userName && item.userName.indexOf(searchContext) !== -1
            );
            this.setState({ dataSel: filteredDataSel });
        }
    };

    getRoleType = (roleType) => {
        let typeName = '-';
        const roleTypeValue = roleType || '0';
        switch (Number(roleTypeValue)) {
            case 1:
                typeName = '管理员';
                break;
            case 2:
                typeName = '内置';
                break;
            case 3:
                typeName = '普通用户';
                break;
            case 4:
                typeName = '维护';
                break;
            default:
                // typeName = '-';
                break;
        }
        return typeName;
    };

    onPageChange = (page: number, pageSize: number) => {
        const { request } = this.props;
        this.setState(
            {
                pageNumber: page,
                pageSize: pageSize,
            },
            () => {
                if (request) {
                    this.fetchData();
                } else {
                    this.paginationFilter();
                }
            },
        );
    };

    // 左侧复选框处理
    onLeftCheckAllChange = (e: any) => {
        const checked = e.target.checked;
        const { allOptionsList } = this.state;
        const checkedList = checked ? allOptionsList.map(item => item.userId) : [];
        this.setState({
            leftCheckAll: checked,
            leftCheckedList: checkedList,
            leftPush: checkedList.length > 0
        });
    };

    onLeftCheckboxChange = (userId: string, checked: boolean) => {
        const { leftCheckedList } = this.state;
        const newCheckedList = checked 
            ? [...leftCheckedList, userId]
            : leftCheckedList.filter(id => id !== userId);
        
        this.setState({
            leftCheckedList: newCheckedList,
            leftCheckAll: newCheckedList.length === this.state.allOptionsList.length,
            leftPush: newCheckedList.length > 0
        });
    };

    // 右侧复选框处理
    onRightCheckAllChange = (e: any) => {
        const checked = e.target.checked;
        const { dataSel } = this.state;
        const checkedList = checked ? dataSel.map(item => item.userId) : [];
        this.setState({
            rightCheckAll: checked,
            rightCheckedList: checkedList,
            rightPush: checkedList.length > 0
        });
    };

    onRightCheckboxChange = (userId: string, checked: boolean) => {
        const { rightCheckedList } = this.state;
        const newCheckedList = checked 
            ? [...rightCheckedList, userId]
            : rightCheckedList.filter(id => id !== userId);
        
        this.setState({
            rightCheckedList: newCheckedList,
            rightCheckAll: newCheckedList.length === this.state.dataSel.length,
            rightPush: newCheckedList.length > 0
        });
    };

    // 移动按钮处理
    leftPushChange = () => {
        const { leftCheckedList, dataSel, allOptionsList } = this.state;
        const itemsToMove = allOptionsList.filter(item => leftCheckedList.includes(item.userId));
        const newDataSel = [...dataSel, ...itemsToMove];
        const newAllOptionsList = allOptionsList.filter(item => !leftCheckedList.includes(item.userId));
        
        this.setState({
            dataSel: newDataSel,
            allOptionsList: newAllOptionsList,
            leftCheckedList: [],
            leftCheckAll: false,
            leftPush: false,
            total: newAllOptionsList.length
        }, () => {
            this.props.onChange && this.props.onChange(newDataSel);
        });
    };

    rightPushChange = () => {
        const { rightCheckedList, dataSel, allOptionsList } = this.state;
        const itemsToMove = dataSel.filter(item => rightCheckedList.includes(item.userId));
        const newAllOptionsList = [...allOptionsList, ...itemsToMove];
        const newDataSel = dataSel.filter(item => !rightCheckedList.includes(item.userId));
        
        this.setState({
            dataSel: newDataSel,
            allOptionsList: newAllOptionsList,
            rightCheckedList: [],
            rightCheckAll: false,
            rightPush: false,
            total: newAllOptionsList.length
        }, () => {
            this.props.onChange && this.props.onChange(newDataSel);
        });
    };

    paginationFilter = () => {
        const { pageNumber, pageSize, searchKey } = this.state;
        const lastDatas = this.getFilterUsers(pageNumber, pageSize, searchKey);
        this.setState({
            allOptionsList: lastDatas.allOptionsList,
            total: lastDatas.total,
        });
    };

    getFilterUsers = (pageNumber: number, pageSize: number, searchKey?: string) => {
        const allOptionsList = this.props.allOptionsList || [];
        const dataSel = this.props.selectOptionsList || this.props.dataSel || [];
        const currentSearchKey = searchKey !== undefined ? searchKey : this.state?.searchKey || '';
        const list = allOptionsList.filter((item) => !dataSel.find((items) => item.userId === items.userId));

        const dataList = list.filter(
            (item) => !(currentSearchKey !== undefined && currentSearchKey !== '' && `${item.userName}`.indexOf(currentSearchKey) < 0),
        );
        const lastDataList = dataList.filter((item, index) => (pageNumber - 1) * pageSize <= index && index < pageNumber * pageSize);
        return {
            allOptionsList: lastDataList,
            total: dataList.length,
        };
    };

    getDefaultColumns = () => {
        return [
            {
                key: 'index',
                title: '序号',
                width: 60,
                render: (text: any, record: any, index: number) => index + 1
            },
            {
                key: 'loginId',
                title: '用户名',
                 width: 60,
                search: true,
                render: (text: any, record: any) => record.loginId || record.userName
            },
            {
                key: 'userName',
                title: '姓名',
                 width: 60,
                search: true,
                render: (text: any, record: any) => record.userName
            },
            {
                key: 'roleType',
                 width: 100,
                title: '用户级别',
                render: (text: any, record: any) => {
                    const roleType = record && record.roleType ? record.roleType : '';
                    return this.getRoleType(roleType);
                }
            },
            {
                key: 'deptName',
                 width: 100,
                title: '所属部门',
                render: (text: any, record: any) => {
                    return record.extraFields && record.extraFields.deptName ? record.extraFields.deptName : '';
                }
            }
        ];
    };

    render() {
        const { allOptionsList, dataSel, searchKey, rightSearchKey, leftCheckedList, rightCheckedList, leftCheckAll, rightCheckAll, leftPush, rightPush } = this.state;
        const { style, allOptionsLabel = '所有用户', selectOptionsLabel = '已选择用户', actionProps, columns = this.getDefaultColumns() } = this.props;
        const showLeftSearch = actionProps?.showLeftSearch !== false;
        const showRightSearch = actionProps?.showRightSearch !== false;
        const showLeftCheckbox = actionProps?.showLeftCheckbox !== false;
        const showRightCheckbox = actionProps?.showRightCheckbox !== false;
        
        return (
            <div className="columns-sort-drag-old" style={style}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Row gutter={16} style={{ height: '100%' }}>
                        <Col span={showLeftCheckbox || showRightCheckbox ? 11 : 12} style={{ height: '100%' }}>
                            <div className="columns-sort-drag-search">
                                <div className="columns-sort-drag-search-title">{allOptionsLabel}</div>
                                {showLeftSearch && <Input.Search 
                                    allowClear
                                    style={{ width: 'calc(100% - 64px)' }} 
                                    maxLength={8} 
                                    value={searchKey}
                                    onChange={this.searchKeyChange}
                                    onSearch={this.onSearch} 
                                />}
                            </div>
                            <div className="columns-sort-drag-list">
                                <div className="columns-sort-drag-header columns-sort-drag-header-color">
                                    <div className="columns-sort-drag-header-num-empty">
                                        {showLeftCheckbox && (
                                            <Checkbox 
                                                checked={leftCheckAll} 
                                                onChange={this.onLeftCheckAllChange}
                                            />
                                        )}
                                    </div>
                                    {columns.map((column) => (
                                        <div key={column.key} className="columns-sort-drag-header-field-info" style={{ width: column.width }}>
                                            {column.title}
                                        </div>
                                    ))}
                                </div>
                                <div className="columns-sort-drag-list-content">
                                    <Droppable droppableId="allOptionsList" direction="vertical">
                                        {(provided, snapshot) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
                                                {allOptionsList.map((item, index) => (
                                                    <Draggable key={item.userId} draggableId={`${item.userId}`} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, index)}
                                                            >
                                                                <div className="columns-sort-drag-header">
                                                                    <div className="columns-sort-drag-header-num-empty">
                                                                        {showLeftCheckbox ? (
                                                                            <Checkbox 
                                                                                checked={leftCheckedList.includes(item.userId)}
                                                                                onChange={(e) => this.onLeftCheckboxChange(item.userId, e.target.checked)}
                                                                            />
                                                                        ) : (
                                                                            <Icon antdIcon type="UnorderedListOutlined" />
                                                                        )}
                                                                    </div>
                                                                    {columns.map((column) => (
                                                                        <div
                                                                            key={column.key}
                                                                            className="columns-sort-drag-header-field-info"
                                                                            style={{ width: column.width }}
                                                                            title={column.render ? column.render(null, item, index) : item[column.key]}
                                                                        >
                                                                            {column.render ? column.render(null, item, index) : item[column.key]}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                            <Pagination
                                size="small"
                                simple
                                defaultCurrent={this.state.pageNumber}
                                current={this.state.pageNumber}
                                total={this.state.total}
                                pageSize={this.state.pageSize}
                                onChange={this.onPageChange}
                                showTotal={(e) => {
                                    return `共 ${e} 条`;
                                }}
                            />
                        </Col>
                        {(showLeftCheckbox || showRightCheckbox) && (
                            <Col span={2} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Button 
                                    size="small" 
                                    type={leftPush ? 'primary' : 'default'} 
                                    onClick={this.leftPushChange}
                                    disabled={leftCheckedList.length === 0}
                                >
                                    <Icon antdIcon type="RightOutlined" style={leftPush ? { color: '#fff' } : {}} />
                                </Button>
                                <Button 
                                    size="small" 
                                    style={{ marginTop: 10 }} 
                                    type={rightPush ? 'primary' : 'default'} 
                                    onClick={this.rightPushChange}
                                    disabled={rightCheckedList.length === 0}
                                >
                                    <Icon antdIcon type="LeftOutlined" style={rightPush ? { color: '#fff' } : {}} />
                                </Button>
                            </Col>
                        )}
                        <Col span={10} style={{ height: '100%' }}>
                            <div className="columns-sort-drag-search">
                                <div className="columns-sort-drag-search-title">{selectOptionsLabel}</div>
                                {showRightSearch && <Input.Search 
                                    allowClear
                                    style={{ width: 'calc(100% - 64px)' }} 
                                    maxLength={8} 
                                    value={rightSearchKey}
                                    onChange={this.rightSearchKeyChange}
                                    onSearch={this.onRightSearch} 
                                />}
                            </div>
                            <div className="columns-sort-drag-list">
                                <div className="columns-sort-drag-header columns-sort-drag-header-color">
                                    <div className="columns-sort-drag-header-num-empty">
                                        {showRightCheckbox && (
                                            <Checkbox 
                                                checked={rightCheckAll} 
                                                onChange={this.onRightCheckAllChange}
                                            />
                                        )}
                                    </div>
                                    {columns.map((column) => (
                                        <div key={column.key} className="columns-sort-drag-header-field-info" style={{ width: column.width }}>
                                            {column.title}
                                        </div>
                                    ))}
                                </div>
                                <div className="columns-sort-drag-list-content">
                                    <Droppable droppableId="dataSel" direction="vertical">
                                        {(provided, snapshot) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
                                                {dataSel.map((item, index) => (
                                                    <Draggable key={item.userId} draggableId={`${item.userId}`} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, index)}
                                                            >
                                                                <div className="columns-sort-drag-header">
                                                                    <div className="columns-sort-drag-header-num-empty">
                                                                        {showRightCheckbox ? (
                                                                            <Checkbox 
                                                                                checked={rightCheckedList.includes(item.userId)}
                                                                                onChange={(e) => this.onRightCheckboxChange(item.userId, e.target.checked)}
                                                                            />
                                                                        ) : (
                                                                            <Icon antdIcon type="UnorderedListOutlined" />
                                                                        )}
                                                                    </div>
                                                                    {columns.map((column) => (
                                                                        <div
                                                                            key={column.key}
                                                                            className="columns-sort-drag-header-field-info"
                                                                            style={{ width: column.width }}
                                                                            title={column.render ? column.render(null, item, index) : item[column.key]}
                                                                        >
                                                                            {column.render ? column.render(null, item, index) : item[column.key]}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </DragDropContext>
            </div>
        );
    }
}
export default Default;
