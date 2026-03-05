/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';
import { Transfer, Table, Row, Col, Button, Form, Select } from 'oss-ui';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { _ } from 'oss-web-toolkits';
import Field from '@ant-design/pro-field';
import MaintainEdit from '@Src/pages/maintain-team/edit';
import './index.less';
// import useLoginInfoModel from '@Src/hox';

// const { Option } = Select;

// Customize Table Transfer
const type = 'DraggableBodyRow';

const TableTransfer = ({
    leftColumns,
    rightColumns,
    onTransChange,
    mteamModelStateChange,
    tablePagination,
    tableLoading,
    dataSource,
    totalDataSource,
    targetKeys,
    provincesDic,
    firstprofessionsDataDic,
    queryDataList, // 调用父级查询方法
    curSelParm,
    pronince,
    disabled,
    dragChange,
    totalDataRow,
    leftSelRows,
    rightSelRows,
    onLeftSelRowsChange,
    onRightSelRowsChange,
    ...restProps
}) => {
    const formRef = React.createRef();
    const [form] = Form.useForm();
    const mode = disabled ? 'read' : 'edit';

    // const login = useLoginInfoModel();

    const onTransferChange = (selectedRowKeys, direction) => {
        console.log(selectedRowKeys);
        onTransChange && onTransChange(selectedRowKeys, direction === 'right' ? leftSelRows : rightSelRows);
    };

    const queryData = () => {
        formRef.current.validateFields().then((values) => {
            queryDataList(
                values.provinces || values.provinces === 0 ? values.provinces : '',
                values.firstprofessions ? values.firstprofessions : '',
                values.teamModel,
            );
        });
    };
    useEffect(() => {
        formRef.current.setFieldsValue({
            firstprofessions: Number(pronince.professionalType) || curSelParm.professionalType,
            provinces: parseInt(pronince.provinceId || curSelParm.provinceId, 10),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curSelParm.professionalType, curSelParm.provinceId, pronince.professionalType, pronince.provinceId]);
    const [data, setData] = useState(totalDataSource.filter((item) => targetKeys.includes(item.neId)));
    let [count, setCount] = useState(0);
    const [editRowData, setEditRowData] = useState(null);

    // const sourceToEnum = (source = {}) => {
    //     const arr = {};
    //     source?.map((item) => {
    //         arr[item.id] = { text: item.txt };
    //     });
    //     return arr;
    // };

    const DraggableBodyRow = ({ index, moveRow, className, style, ...restPropss }) => {
        const ref = useRef();
        const [{ isOver, dropClassName }, drop] = useDrop({
            accept: type,
            collect: (monitor) => {
                const { index: dragIndex } = monitor.getItem() || {};
                if (dragIndex === index) {
                    return {};
                }
                return {
                    isOver: monitor.isOver(),
                    dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
                };
            },
            drop: (item) => {
                moveRow(item.index, index);
            },
        });
        const [, drag] = useDrag({
            type,
            item: { index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });
        drop(drag(ref));

        return <tr ref={ref} className={`${className}${isOver ? dropClassName : ''}`} style={{ cursor: 'move', ...style }} {...restPropss} />;
    };

    const components = {
        body: {
            row: DraggableBodyRow,
        },
    };

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = data[dragIndex];
            setData(
                update(data, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRow],
                    ],
                }),
            );
            setCount((count += 1));
        },
        [data],
    );

    useEffect(() => {
        // console.log(count)
        dragChange && dragChange(data);
    }, [count]);

    useEffect(() => {
        const list = [];
        targetKeys.forEach((item) => {
            totalDataSource.forEach((itm) => {
                if (item === itm.neId) {
                    list.push(itm);
                }
            });
        });
        setData(list);
    }, [targetKeys, totalDataSource?.length]);

    const handleSearch = (row) => {
        setEditRowData({
            ...row,
            IsSearch: true,
            mteamDimensions: {
                label: row.dimensions,
                value: row.alarmsFieldsCond,
            },
        });
    };

    const onCancelHandler = () => setEditRowData(null);
    const onSaveHandler = () => setEditRowData(null);

    const nameRender = (text, record) => {
        return (
            <span
                style={{ color: '#4990E2', cursor: 'pointer' }}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleSearch(record);
                }}
            >
                {text}
            </span>
        );
    };

    // const getInitialProvince = (province, userInfo) => {
    //     const info = userInfo && JSON.parse(userInfo);
    //     let initialProvince = info.zones[0]?.zoneId;
    //     if (province) {
    //         return (initialProvince = province);
    //     }
    //     if (info.zones[0]?.zoneLevel === '3') {
    //         initialProvince = info.zones[0]?.parentZoneId;
    //     }
    //     return initialProvince;
    // };

    const currentProfession = form.getFieldsValue().firstprofessions;
    const currentProvince = form.getFieldsValue().provinces;
    return (
        <div className="auto-sheet-rule-right-table">
            <>
                <Form name="transferForm" ref={formRef} form={form} initialValues={{ teamModel: '1' }}>
                    <Row>
                        <Col span={3}>
                            <Form.Item name="firstprofessions" label="专业">
                                <Field
                                    mode={mode}
                                    render={() => {
                                        const str = '-';
                                        return <span>{str}</span>;
                                    }}
                                    renderFormItem={() => {
                                        return (
                                            <Select>
                                                {firstprofessionsDataDic.map((item) => {
                                                    return (
                                                        <Select.Option value={item.id} label={item.txt}>
                                                            {item.txt}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={1} />
                        <Col span={3}>
                            <Form.Item name="provinces" initialValues={{}} label="省份">
                                <Field
                                    mode={mode}
                                    render={() => {
                                        const str = '-';
                                        return <span>{str}</span>;
                                    }}
                                    renderFormItem={() => {
                                        return (
                                            <Select>
                                                {provincesDic
                                                    //   .filter((items) =>
                                                    //     getInitialProvince(
                                                    //       login.systemInfo?.currentZone
                                                    //         ?.zoneId,
                                                    //       login.userInfo
                                                    //     ) && !login.isAdmin
                                                    //       ? items.id ===
                                                    //         parseInt(getInitialProvince(
                                                    //             login.systemInfo?.currentZone
                                                    //               ?.zoneId,
                                                    //             login.userInfo
                                                    //           ),10)
                                                    //       : true
                                                    //   )
                                                    .map((item) => {
                                                        return (
                                                            <Select.Option value={item.id} label={item.txt}>
                                                                {item.txt}
                                                            </Select.Option>
                                                        );
                                                    })}
                                            </Select>
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={1} />
                        <Col span={3}>
                            <Form.Item name="teamModel" label="模式">
                                <Field
                                    mode={mode}
                                    render={() => {
                                        const str = '-';
                                        return <span>{str}</span>;
                                    }}
                                    renderFormItem={(value, record) => {
                                        return (
                                            <Select
                                                options={[
                                                    { label: '值班', value: '1' },
                                                    { label: '包机', value: '2' },
                                                ]}
                                            />
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={1} />
                        <Col span={4}>
                            <Button disabled={disabled} type="primary" onClick={queryData}>
                                查询
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Transfer {...restProps} dataSource={dataSource} targetKeys={targetKeys} onChange={onTransferChange} showSelectAll={false}>
                    {({ direction, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys, disabled: listDisabled }) => {
                        const columns = direction === 'left' ? leftColumns : rightColumns;
                        const rowSelection = {
                            getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
                            onSelectAll(selected, selectedRows) {
                                const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ neId }) => neId);
                                const diffKeys = selected
                                    ? _.difference(treeSelectedKeys, listSelectedKeys)
                                    : _.difference(listSelectedKeys, treeSelectedKeys);
                                onItemSelectAll(diffKeys, selected);
                            },
                            onSelect({ neId }, selected) {
                                onItemSelect(neId, selected);
                            },
                            onChange(selectedRowKeys, selectedRows) {
                                if (direction === 'left') {
                                    if (onLeftSelRowsChange) {
                                        onLeftSelRowsChange(selectedRows);
                                    }
                                } else {
                                    if (onRightSelRowsChange) {
                                        onRightSelRowsChange(selectedRows);
                                    }
                                }
                            },
                            selectedRowKeys: listSelectedKeys,
                        };
                        const xWidth = columns.reduce((total, item) => {
                            return total + item.width;
                        }, 0);
                        const columnmArr = [];
                        columns.map((item) => {
                            if (item.key === 'mteamName') {
                                columnmArr.push(Object.assign({}, item, { render: nameRender }));
                            } else {
                                columnmArr.push(item);
                            }
                        });
                        const yHeight = `${window.innerHeight - 300}px`;
                        const rightDataSource = totalDataSource.filter((item) => targetKeys.includes(item.neId));
                        if (rightDataSource.length) {
                            let mteamModelState = false;
                            rightDataSource.forEach((item) => {
                                if (rightDataSource[0].mteamModel?.toString() !== item.mteamModel?.toString()) {
                                    mteamModelState = true;
                                }
                            });
                            mteamModelStateChange(mteamModelState);
                        }
                        const leftDataSource = dataSource.map((item) => ({
                            ...item,
                            disabled: targetKeys.includes(item.neId),
                        }));

                        let newData = [];
                        newData = data.map((item) => ({
                            ...item,
                            // disabled: item.professionalId !== currentProfession || item.provinceId !== currentProvince,
                        }));
                        if (direction === 'left') {
                            return (
                                <Table
                                    rowSelection={disabled ? null : rowSelection}
                                    columns={columnmArr}
                                    dataSource={direction === 'left' ? leftDataSource : rightDataSource}
                                    size="small"
                                    loading={tableLoading}
                                    bordered
                                    scroll={leftDataSource.length > 20 && direction === 'left' ? { x: xWidth, y: yHeight } : {}}
                                    pagination={false}
                                    onRow={({ key, disabled: itemDisabled }) => ({
                                        onClick: () => {
                                            if (itemDisabled) return;
                                            onItemSelect(key, !listSelectedKeys.includes(key));
                                        },
                                    })}
                                />
                            );
                        } else {
                            return (
                                <DndProvider backend={HTML5Backend}>
                                    <span className="right-table-choose">{`${newData.length}项`}</span>
                                    <Table
                                        rowSelection={disabled ? null : rowSelection}
                                        columns={columnmArr}
                                        dataSource={newData.length ? newData : data}
                                        size="small"
                                        components={components}
                                        scroll={{ y: yHeight }}
                                        loading={tableLoading}
                                        pagination={false}
                                        onRow={(record, index) => ({
                                            index,
                                            moveRow,
                                        })}
                                    />
                                </DndProvider>
                            );
                        }
                    }}
                </Transfer>
                {editRowData && <MaintainEdit rowData={editRowData} onSave={onSaveHandler} onCancel={onCancelHandler} />}
            </>
        </div>
    );
};

export default TableTransfer;
