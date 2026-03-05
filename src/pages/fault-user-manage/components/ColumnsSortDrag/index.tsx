import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Input, Button, Pagination, Checkbox, message, Icon, Spin } from 'oss-ui';
import DrogField from './drog-field';
import RightDropField from './right-drag-field';
import { _ } from 'oss-web-toolkits';

const getListStyle = (data?: any) => ({
    overflowY: 'auto',
    width: '100%',
    height: '100%',
});

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const move = (source: any[], destination: any[], droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const filterAciton = (data: any, list: string[], str: string) => {
    const q = String(str ?? '').trim().toLowerCase();
    if (!q) return true;

    return list.some((key) => {
        const v = data?.[key];
        return String(v ?? '').toLowerCase().includes(q);
    });
};

interface ColumnsSortDragProps {
    leftPagetions?: {
        pageSize: number;
        pageNum: number;
    };
    rightPagetions?: {
        pageSize: number;
        pageNum: number;
        scroll: boolean;
        total: number;
    };
    allOptionsList: any[];
    selectOptionsList: any[];
    onChange: (value: any) => void;
    style?: React.CSSProperties;
    columns: any[];
    allOptionsLabel?: string;
    selectOptionsLabel?: string;
    actionProps: {
        showLeftSearch: boolean;
        showRightSearch: boolean;
        showLeftNum: boolean;
        showRightNum: boolean;
    };
    request?: any;
    searchParams?: any;
    maxField?: number | undefined;
    maxFieldMessage: string;
    dragHolderMessag: string;
    isCreate?: any;
    selectAction?: (value: any, type: string) => void;
    onPagetionRightChange?: (paging: any, searchName?: any) => void;
    disabled?: boolean;
}

interface ColumnsSortDragStates {
    leftPagetions: {
        pageSize: number;
        pageNum: number;
    };
    rightPagetions: {
        pageSize: number;
        pageNum: number;
        scroll?: boolean;
        total?: number;
    };
    allOptionsList: any[];
    selectOptionsList: any[];
    PopoverVisible: boolean;
    searchKey: string;
    leftPush: boolean;
    rightPush: boolean;
    leftCheckedList: any[];
    rightCheckedList: any[];
    rightCheckAll: boolean;
    rightAllChecked: any[];
    rightAll: any;
    leftAll: any;
    leftAllChecked: any[];
    allLen: any;
    rightSearchKey: any;
    leftLoad: boolean;
    rightLoad: boolean;
}

class ColumnsSortDrag extends React.Component<ColumnsSortDragProps, ColumnsSortDragStates> {
    timer: any;
    dragRef: any;
    scrollDiv: any = null;

    static propTypes = {
        allOptionsList: PropTypes.array,
        selectOptionsList: PropTypes.array,
        allOptionsLabel: PropTypes.string,
        selectOptionsLabel: PropTypes.string,
        columns: PropTypes.array,
        onChange: PropTypes.func,
        style: PropTypes.object,
        paging: PropTypes.bool,
        searchParams: PropTypes.object,
        request: PropTypes.func,
    };

    static defaultProps = {
        allOptionsList: [],
        selectOptionsList: [],
        allOptionsLabel: '所有字段',
        selectOptionsLabel: '展示字段',
        columns: [],
        onChange: () => {},
        style: {},
        paging: true,
        showRightPagination: false,
        searchParams: {
            searchField: 'word',
            paging: false,
        },
        leftPagetions: {
            pageSize: 20,
            pageNum: 1,
        },
        rightPagetions: false,
        actionProps: { showLeftSearch: true, showRightSearch: false, showLeftNum: true, showRightNum: true },
        maxFieldMessage: '超过最大放置数',
        dragHolderMessag: false,
        disabled: false,
    };

    constructor(props: ColumnsSortDragProps) {
        super(props);

        this.state = {
            allOptionsList: props.request
                ? []
                : props.allOptionsList.filter((item) => !props.selectOptionsList.find((items) => `${item.id}` === `${items.id}`)),
            selectOptionsList: props.selectOptionsList,
            PopoverVisible: false,
            searchKey: '',
            leftPagetions: props.leftPagetions || { pageSize: 20, pageNum: 1 },
            rightPagetions: props.rightPagetions || {
                pageSize: 20,
                pageNum: 1,
            },
            leftPush: false,
            rightPush: false,
            leftCheckedList: [],
            rightCheckedList: [],
            rightCheckAll: false,
            rightAllChecked: [],
            rightAll: false,
            leftAll: false,
            leftAllChecked: [],
            allLen: 0,
            rightSearchKey: '',
            leftLoad: false,
            rightLoad: false,
        };
        this.timer = null;
        this.dragRef = React.createRef();
    }

    onScroll = (event: any) => {
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        const {
            rightPagetions: { pageNum, pageSize, total },
        } = this.state;
        if (isBottom && total && pageNum * pageSize < total) {
            this.props?.onChange(this.props.selectOptionsList);
            this.props?.onPagetionRightChange && this.props?.onPagetionRightChange(pageNum + 1, this.state.rightSearchKey);
            this.setState({
                rightLoad: true,
            });
        }
    };

    componentDidMount() {
        const { leftPagetions, rightPagetions, allOptionsList } = this.state;

        this.scrollDiv = document.querySelector(
            '.columns-sort-drag-content-right div.columns-sort-drag-list-new-content div[data-rbd-droppable-id="selectOptionsList"]',
        );

        rightPagetions?.scroll &&
            this.scrollDiv &&
            this.scrollDiv.addEventListener('scroll', (e: any) => {
                this.onScroll(e);
            });

        if (this.dragRef && this.dragRef.current) {
            const dragHeig = parseInt((this.dragRef.current.clientHeight / 35).toString(), 10);
            const { request, searchParams, isCreate } = this.props as any;
            this.setState({
                rightLoad: !isCreate,
            });

            if (dragHeig > leftPagetions.pageSize) {
                this.setState({
                    leftPagetions: {
                        ...leftPagetions,
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
                        pageSize: searchParams.pageSize ? searchParams.pageSize : dragHeig,
                    },
                });
                this.getRequest(params);
            }
        }
    }

    getRequest = async (params?: any) => {
        const { request, searchParams } = this.props as any;
        this.setState({
            leftLoad: true,
        });

        const finalParams = params || {
            [searchParams.searchField]: this.state.searchKey,
            ...this.state.leftPagetions,
        };

        const data = await request(finalParams);
        const { selectOptionsList } = this.state;
        this.setState({
            allOptionsList: data?.data.filter((item: any) => !selectOptionsList.find((items: any) => `${item.id}` === `${items.id}`)) || [],
            leftPush: false,
            leftCheckedList: [],
            leftAll: false,
            leftAllChecked: [],
            leftLoad: false,
            allLen:
                searchParams?.paging && data?.total
                    ? data.total
                    : data?.data.filter((item: any) => !selectOptionsList.find((items: any) => `${item.id}` === `${items.id}`)).length || 0,
        });
    };

    componentDidUpdate(prevProps: ColumnsSortDragProps) {
        if (this.props.selectOptionsList !== prevProps.selectOptionsList || this.props.allOptionsList !== prevProps.allOptionsList) {
            const { searchKey, allOptionsList, allLen, leftPagetions, rightPagetions } = this.state;
            const { request, searchParams } = this.props as any;

            if (this.props.selectOptionsList !== prevProps.selectOptionsList) {
                if (rightPagetions?.scroll) {
                    this.setState({
                        selectOptionsList: this.props.selectOptionsList,
                        rightPagetions: this.props.rightPagetions
                            ? {
                                  scroll: true,
                                  pageSize: (this.props.rightPagetions as any).pageSize,
                                  pageNum: (this.props.rightPagetions as any)?.pageNum,
                                  total: (this.props.rightPagetions as any).total,
                              }
                            : rightPagetions,
                        rightLoad: false,
                        rightPush: false,
                        rightCheckedList: [],
                        rightAll: false,
                        rightAllChecked: [],
                    });
                } else {
                    this.setState({
                        selectOptionsList: this.props.selectOptionsList,
                        rightLoad: false,
                        rightPagetions: {
                            ...rightPagetions,
                            pageNum: 1,
                        },
                    });
                }
            }

            if (request) {
                const list = allOptionsList.filter((item: any) => !this.props.selectOptionsList.find((items: any) => `${item.id}` === `${items.id}`));
                this.setState({
                    allOptionsList: list,
                    allLen: searchParams.paging ? allLen : list.length,
                });
            } else {
                const list = this.props.allOptionsList
                    .filter((item: any) => !this.props.selectOptionsList.find((items: any) => `${items.id}` === `${item.id}`))
                    .filter((item: any) => {
                        const { name = '', field = '' } = item;
                        return (
                            searchKey.indexOf(name || field || '') !== -1 ||
                            (name && name.indexOf(searchKey) !== -1) ||
                            (field && field.indexOf(searchKey) !== -1)
                        );
                    });
                this.setState({
                    allOptionsList: list,
                    allLen: list.length,
                    leftPagetions: {
                        ...leftPagetions,
                        pageNum: 1,
                    },
                    rightCheckedList: [],
                    rightAll: false,
                    rightAllChecked: [],
                });
            }
        }
    }

    onDragEnd = (result: any) => {
        const { searchParams } = this.props as any;
        const { source, destination } = result;
        if (!destination) {
            return;
        }

        const sInd = source.droppableId;
        const dInd = destination.droppableId;

        if (sInd === dInd) {
            const list = reorder((this.state as any)[dInd], source.index, destination.index);
            this.setState(
                {
                    [dInd]: list,
                } as any,
                () => {
                    if (dInd === 'selectOptionsList') this.props.onChange && this.props.onChange(list);
                },
            );
        } else {
            const resultObj = move((this.state as any)[sInd], (this.state as any)[dInd], source, destination);
            const stateData: any = {
                [sInd]: resultObj[sInd],
                [dInd]: resultObj[dInd],
            };

            if (!searchParams.paging) {
                stateData.allLen = sInd === 'selectOptionsList' ? resultObj[dInd].length : resultObj[sInd].length;
            }

            this.setState(stateData, () => {
                if (dInd === 'selectOptionsList') this.props.onChange && this.props.onChange(resultObj[dInd]);
                if (sInd === 'selectOptionsList') this.props.onChange && this.props.onChange(resultObj[sInd]);
            });
        }
    };

    searchKeyChange = (e: any) => {
        const value = e?.target?.value ?? '';
        this.setState({ searchKey: value });
    };

    onSearch = (e: any) => {
        const { leftPagetions } = this.state;
        const { request, searchParams } = this.props as any;
        if (request) {
            this.setState(
                {
                    searchKey: e,
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
        }
    };

    pageChange = (pageNum: number, pageSize: number) => {
        const { searchParams, request } = this.props as any;
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
                ...this.state.leftPagetions,
                pageNum,
                pageSize,
            },
        });
    };

    checkedChangeLeft = (list: any[]) => {
        this.setState({ leftCheckedList: list, leftPush: list.length > 0 });
    };

    checkedChangeRight = (list: any[]) => {
        this.setState({ rightCheckedList: list, rightPush: list.length > 0 });
    };

    leftPushChange = () => {
        const { leftCheckedList, selectOptionsList, allOptionsList, leftPagetions } = this.state;
        const { searchParams } = this.props as any;
        const data = Array.from(selectOptionsList);
        const leftList = allOptionsList.filter((item: any) => !leftCheckedList.find((items: any) => items.id === item.id));
        const index = leftPagetions.pageNum ? (leftPagetions.pageNum - 1) * leftPagetions.pageSize : 0;
        data.splice(index, 0, ...leftCheckedList);

        const stateData: any = {
            allOptionsList: leftList,
            selectOptionsList: data,
            leftPush: false,
            leftCheckedList: [],
            leftAll: false,
            leftAllChecked: [],
        };

        if (!searchParams.paging) {
            stateData.allLen = leftList.length;
        }

        this.setState(stateData, () => {
            this.props.onChange && this.props.onChange(data);
        });
    };

    rightPushChange = () => {
        const { rightCheckedList, selectOptionsList, allOptionsList, rightPagetions } = this.state;
        const { searchParams } = this.props as any;
        const data = Array.from(allOptionsList);
        const rightList = selectOptionsList.filter((item: any) => !rightCheckedList.find((items: any) => items.id === item.id));
        const index = rightPagetions.pageNum ? (rightPagetions.pageNum - 1) * rightPagetions.pageSize : 0;
        data.splice(index, 0, ...rightCheckedList);

        const stateData: any = {
            allOptionsList: data,
            selectOptionsList: rightList,
            rightPush: false,
            rightCheckedList: [],
            rightAll: false,
            rightAllChecked: [],
        };
        if (!searchParams.paging) {
            stateData.allLen = data.length;
        }

        this.setState(stateData, () => {
            this.props.onChange && this.props.onChange(rightList);
        });
    };

    allRightCheckChange = (e: any) => {
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

    allLeftCheckChange = (e: any) => {
        const { allOptionsList, leftPagetions } = this.state;
        const { request, searchParams } = this.props as any;
        let list: any[] = [];
        if (request && searchParams?.paging) {
            list = allOptionsList;
        } else {
            list = allOptionsList.filter((item: any, index: number) => leftPagetions.pageNum - 1 <= index && leftPagetions.pageNum * leftPagetions.pageSize > index);
        }

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

    onRightSearch = (valueOrEvent: any) => {
        const keyword =
            typeof valueOrEvent === 'string'
                ? valueOrEvent
                : valueOrEvent?.target?.value !== undefined
                ? valueOrEvent.target.value
                : '';

        this.setState({ rightSearchKey: keyword }, () => {
            if ((this.props as any).searchParams?.searchRight) {
                this.props?.onPagetionRightChange && this.props?.onPagetionRightChange(1, keyword);
            }
        });
    };

    filterSelectOption = (selectOptionsList: any[]) => {
        if ((this.props as any)?.searchParams?.searchRight) {
            return selectOptionsList;
        }
        const { rightSearchKey } = this.state;
        const { columns } = this.props;
        let searchList = columns.filter((item: any) => item.search).map((item: any) => item.key);
        if (_.isEmpty(searchList)) {
            searchList = ['loginId', 'userName', 'userMobile'];
        }
        const dataList = rightSearchKey ? selectOptionsList.filter((item) => filterAciton(item, searchList, rightSearchKey)) : selectOptionsList;
        return dataList;
    };

    onClildrenChange = (_data: any) => {
        if (!this.props.selectAction) return;
        this.props.selectAction(_data, _data.stateKey);
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
            leftLoad,
            rightLoad,
        } = this.state;

        const {
            style,
            columns,
            allOptionsLabel,
            selectOptionsLabel,
            request,
            searchParams,
            leftPagetions: propsLeftPagetions,
            rightPagetions: propsRightPagetions,
            actionProps,
            dragHolderMessag,
            disabled,
        } = this.props as any;

        const { showLeftSearch = true, showRightSearch = false, showLeftNum = true, showRightNum = true } = actionProps;
        const selectLen = selectOptionsList.length;

        return (
            <div className="columns-sort-drag-new" style={style} id="sortDrag">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="columns-sort-drag-content" style={{ height: '100%' }}>
                        <div className="columns-sort-drag-content-left">
                            <div className="columns-sort-drag-search">
                                <span className="columns-sort-drag-search-title">{allOptionsLabel}</span>
                                {showLeftSearch && (
                                    <Input.Search
                                        allowClear
                                        style={{ flex: 'auto', width: 'auto' }}
                                        value={searchKey}
                                        onChange={this.searchKeyChange}
                                        onSearch={this.onSearch}
                                        disabled={disabled}
                                    />
                                )}
                            </div>
                            <div className="columns-sort-drag-list-new">
                                <Spin spinning={leftLoad} wrapperClassName={'columns-sort-drag-spin'}>
                                    <div
                                        className="columns-sort-drag-list-new-page"
                                        style={propsLeftPagetions ? { height: 'calc(100% - 25px)' } : { height: '100%' }}
                                    >
                                        <div className="columns-sort-drag-header columns-sort-drag-header-color">
                                            <div className="columns-sort-drag-header-num-empty">
                                                <Checkbox checked={leftAll} onChange={this.allLeftCheckChange} disabled={disabled} />
                                            </div>
                                            {showLeftNum && <div className="columns-sort-drag-header-num">序号</div>}
                                            {columns &&
                                                columns
                                                    .filter((itemss: any) => !itemss.allOptionsHide)
                                                    .map((item: any) => {
                                                        const styles = item.allOptionsWidth
                                                            ? { width: item.allOptionsWidth }
                                                            : item.width && {
                                                                  width: item.width,
                                                              };
                                                        return (
                                                            <div className="columns-sort-drag-header-field-info" style={styles} key={item.key}>
                                                                {item.title}
                                                            </div>
                                                        );
                                                    })}
                                        </div>
                                        <div className="columns-sort-drag-list-new-content" ref={this.dragRef}>
                                            <Droppable droppableId="allOptionsList" key="allOptionsList" direction="vertical">
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
                                                        <DrogField
                                                            leftPagetions={leftPagetions}
                                                            students={allOptionsList}
                                                            columns={columns}
                                                            checkedChange={this.checkedChangeLeft}
                                                            leftAllChecked={leftAllChecked}
                                                            paging={request && searchParams?.paging}
                                                            showLeftNum={showLeftNum}
                                                            propsLeftPagetions={propsLeftPagetions}
                                                            disabled={disabled}
                                                        />
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </div>
                                    {propsLeftPagetions && (
                                        <div className="pagingtions-field">
                                            <Pagination
                                                simple
                                                current={leftPagetions.pageNum}
                                                pageSize={leftPagetions.pageSize}
                                                total={allLen}
                                                onChange={this.pageChange}
                                                disabled={disabled}
                                            />
                                        </div>
                                    )}
                                </Spin>
                            </div>
                        </div>

                        <div className="columns-sort-drag-direction">
                            <Button size="small" type={leftPush ? 'primary' : 'default'} onClick={this.leftPushChange} disabled={disabled}>
                                <Icon antdIcon type="RightOutlined" style={leftPush ? { color: '#fff' } : {}} />
                            </Button>
                            <Button
                                size="small"
                                style={{ marginTop: 10 }}
                                type={rightPush ? 'primary' : 'default'}
                                onClick={this.rightPushChange}
                                disabled={disabled}
                            >
                                <Icon antdIcon type="LeftOutlined" style={rightPush ? { color: '#fff' } : {}} />
                            </Button>
                        </div>

                        <div className="columns-sort-drag-content-right">
                            <div className="columns-sort-drag-search">
                                <div className="columns-sort-drag-search-title">{selectOptionsLabel}</div>
                                {showRightSearch && (
                                    <Input.Search
                                        allowClear
                                        style={{ flex: 'auto', width: 'auto' }}
                                        value={this.state.rightSearchKey}
                                        onChange={(e: any) => this.setState({ rightSearchKey: e?.target?.value ?? '' })}
                                        onSearch={this.onRightSearch}
                                        disabled={disabled}
                                    />
                                )}
                            </div>
                            <div className="columns-sort-drag-list-new">
                                <Spin spinning={rightLoad} wrapperClassName={'columns-sort-drag-spin'}>
                                    <div
                                        className="columns-sort-drag-list-new-page"
                                        style={
                                            propsRightPagetions && !(propsRightPagetions as any).scroll
                                                ? { height: 'calc(100% - 25px)' }
                                                : { height: '100%' }
                                        }
                                    >
                                        <div className="columns-sort-drag-header columns-sort-drag-header-color">
                                            <div className="columns-sort-drag-header-num-empty">
                                                <Checkbox checked={rightAll} onChange={this.allRightCheckChange} disabled={disabled} />
                                            </div>
                                            {showRightNum && <div className="columns-sort-drag-header-num">序号</div>}

                                            {columns &&
                                                columns
                                                    .filter((item: any) => !item.selectOptionsHide)
                                                    .map((item: any) => {
                                                        const styles = item.selectOptionsWidth
                                                            ? { width: item.selectOptionsWidth }
                                                            : item.width && {
                                                                  width: item.width,
                                                              };
                                                        return (
                                                            <div className="columns-sort-drag-header-field-info" style={styles} key={item.key}>
                                                                {item.title}
                                                            </div>
                                                        );
                                                    })}
                                        </div>
                                        <div className="columns-sort-drag-list-new-content">
                                            <Droppable droppableId="selectOptionsList" direction="vertical" key="selectOptionsList">
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
                                                        <RightDropField
                                                            rightAllChecked={rightAllChecked}
                                                            students={this.filterSelectOption(selectOptionsList)}
                                                            rightPagetions={rightPagetions}
                                                            columns={columns}
                                                            showRightNum={showRightNum}
                                                            onClildrenChange={this.onClildrenChange}
                                                            checkedChange={this.checkedChangeRight}
                                                            propsRightPagetions={propsRightPagetions}
                                                            dragHolderMessag={dragHolderMessag}
                                                            disabled={disabled}
                                                        />
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </div>
                                    {propsRightPagetions && !(propsRightPagetions as any).scroll ? (
                                        <div className="pagingtions-field">
                                            <Pagination
                                                simple
                                                current={rightPagetions.pageNum}
                                                pageSize={rightPagetions.pageSize}
                                                total={selectLen}
                                                onChange={(pageNum: number, pageSize: number) => {
                                                    this.setState({
                                                        rightPagetions: { ...rightPagetions, pageNum, pageSize },
                                                    });
                                                }}
                                                disabled={disabled}
                                            />
                                        </div>
                                    ) : null}
                                </Spin>
                            </div>
                        </div>
                    </div>
                </DragDropContext>
            </div>
        );
    }
}

export default React.memo(ColumnsSortDrag);
