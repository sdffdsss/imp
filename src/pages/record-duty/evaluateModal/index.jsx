import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Input, Col, Row, Button, InputNumber, Upload, message, Form, Select } from 'oss-ui';
import moment from 'moment';
import { VirtualTable } from 'oss-web-common';
import Draggable from 'react-draggable';
import { blobDownLoad } from '@Common/utils/download';
import { saveModalData, dutyEvaluateExport, getModalData } from '../api';
import './index.less';

//sourceTableParams(接口请求参数 需传入 groupId,workShiftId,workDate)

//可编辑
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!editing) {
            setEditing(true);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        }
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            setEditing(false);
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={
                    title === '是否迟到'
                        ? [
                              {
                                  required: true,
                                  message: `请选择${title}`,
                              },
                          ]
                        : []
                }
            >
                {title === '得分(1-10)' ? (
                    <InputNumber
                        min={1}
                        max={10}
                        ref={inputRef}
                        style={{ width: '100%' }}
                        onPressEnter={save}
                        onBlur={save}
                        parser={(text) => {
                            if (/^\d+$/.test(text)) {
                                return text;
                            } else {
                                const result = parseInt(text);
                                if (Number.isNaN(result)) {
                                    return 10;
                                } else {
                                    return result;
                                }
                            }
                        }}
                    />
                ) : title === '是否迟到' ? (
                    <Select
                        ref={inputRef}
                        style={{ width: '100%' }}
                        options={[
                            { value: '是', label: '是' },
                            { value: '否', label: '否' },
                        ]}
                        onPressEnter={save}
                        onBlur={save}
                    />
                ) : (
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} maxLength={200} />
                )}
            </Form.Item>
        ) : (
            <div
                className={`editable-cell-value-wrap ${dataIndex === 'evaluator' ? 'evaluator' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (editable && !editing) {
                        toggleEdit(e);
                    }
                }}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const EvaluateModal = (props) => {
    const { userId, isEvaluateModalOpen, handleCancel, sourceTableParams, editable } = props;
    const [tableListData, setTableListData] = useState([]);
    const [saveFlag, setSaveFlag] = useState(false);

    //拖拽
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const draggleRef = useRef(null);
    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };
    //可编辑
    const handleSave = (row) => {
        const newData = [...tableListData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setTableListData(newData);
    };

    //保存
    const saveEvaluateData = () => {
        const sendData = [...tableListData];
        if (saveFlag) {
            return;
        }
        setSaveFlag(true);
        sendData.map((item) => {
            item.createBy = userId;
            item.isNew = item.isNew === null ? false : item.isNew;
            return item;
        });
        saveModalData(sendData).then((res) => {
            if (res.code === 200) {
                setSaveFlag(false);
                handleCancel();
            }
        });
    };
    useEffect(() => {
        getModalData(sourceTableParams).then((res) => {
            let resultData = res.data;
            resultData.map((item, index) => {
                item.key = index;
                item.isNew = item.isNew === 'true';
                return item;
            });
            setTableListData(resultData);
        });
    }, []);

    // 计算需要合并的行数
    const getMergeRows = (data) => {
        const mergeMap = {};
        data.forEach((item, index) => {
            const { dutyUserId } = item;
            if (!mergeMap[dutyUserId]) {
                mergeMap[dutyUserId] = {
                    start: index,
                    end: index,
                };
            } else {
                mergeMap[dutyUserId].end = index;
            }
        });
        return mergeMap;
    };

    const groupColumns = [
        {
            title: '值班人员',
            dataIndex: 'dutyUserName',
            key: 'dutyUserName',
            hideInSearch: true,
            align: 'center',
            ellipsis: false,
            width: 120,
            className: 'wrap-text-cell',
            onCell: (record, index) => {
                const mergeMap = getMergeRows(tableListData);
                const { dutyUserId } = record;
                const merge = mergeMap[dutyUserId];

                if (merge && merge.start === index) {
                    return {
                        rowSpan: merge.end - merge.start + 1,
                        style: {
                            verticalAlign: 'middle',
                            textAlign: 'center',
                        },
                    };
                }
                if (merge && merge.start !== index) {
                    return { rowSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '得分(1-10)',
            dataIndex: 'score',
            key: 'score',
            hideInSearch: true,
            align: 'center',
            ellipsis: false,
            width: 80,
            editable: editable,
            className: 'wrap-text-cell',
            onCell: (record) => ({
                record,
                editable: editable,
                dataIndex: 'score',
                title: '得分(1-10)',
                handleSave: handleSave,
            }),
        },
        {
            title: '评价',
            dataIndex: 'evaluate',
            key: 'evaluate',
            hideInSearch: true,
            align: 'left',
            ellipsis: false,
            width: 500,
            editable: editable,
            className: 'evaluate-column wrap-text-cell',
            onCell: (record) => ({
                record,
                editable: editable,
                dataIndex: 'evaluate',
                title: '评价',
                handleSave: handleSave,
            }),
        },
        {
            title: '是否迟到',
            dataIndex: 'ifLate',
            key: 'ifLate',
            hideInSearch: true,
            align: 'center',
            ellipsis: false,
            width: 80,
            editable: editable,
            className: 'wrap-text-cell',
            onCell: (record) => ({
                record,
                editable: editable,
                dataIndex: 'ifLate',
                title: '是否迟到',
                handleSave: handleSave,
            }),
        },
        {
            title: '评价人员',
            dataIndex: 'evaluator',
            key: 'evaluator',
            hideInSearch: true,
            align: 'center',
            ellipsis: false,
            width: 120,
            editable: editable,
            className: 'wrap-text-cell',
            render: (text, record) => (
                <div style={{ position: 'relative', width: '100%' }}>
                    <EditableCell record={record} editable={editable} dataIndex="evaluator" title="评价人员" handleSave={handleSave}>
                        {text}
                    </EditableCell>
                    <div
                        style={{
                            position: 'absolute',
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            width: '20px', // 固定按钮宽度
                        }}
                    >
                        {editable &&
                            (record.isNew ? (
                                <Button
                                    type="link"
                                    onClick={() => handleDeleteRow(record.key)}
                                    style={{
                                        padding: '0',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        height: '32px',
                                        lineHeight: '32px',
                                        minWidth: '20px',
                                    }}
                                >
                                    -
                                </Button>
                            ) : (
                                <Button
                                    type="link"
                                    onClick={() => handleAddRow(record.key)}
                                    style={{
                                        padding: '0',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        height: '32px',
                                        lineHeight: '32px',
                                        minWidth: '20px',
                                    }}
                                >
                                    +
                                </Button>
                            ))}
                    </div>
                </div>
            ),
        },
    ];
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = groupColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });
    const handleExport = async () => {
        if (tableListData.length > 0) {
            const params = {
                groupId: tableListData[0].groupId,
                workDate: tableListData[0].workDate,
                workShiftId: tableListData[0].workShiftId,
            };
            const res = await dutyEvaluateExport(params);
            blobDownLoad(res, `值班评价导出${moment().format('YYYYMMDDHHmmss')}.xlsx`);
        }
    };

    // 恢复原有handleAddRow逻辑，仅加强key生成和事件处理
    const handleAddRow = (key) => {
        const newData = [...tableListData];
        const currentIndex = newData.findIndex((item) => key === item.key);
        const currentUserName = newData[currentIndex].dutyUserName;
        const currentRecord = newData[currentIndex];

        // 找到当前值班人员的最后一行索引
        let lastIndex = currentIndex;
        for (let i = currentIndex + 1; i < newData.length; i++) {
            if (newData[i].dutyUserName === currentUserName) {
                lastIndex = i;
            } else {
                break;
            }
        }

        // 生成稳定唯一的key
        const newKey = `new_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const newRow = {
            ...currentRecord,
            key: newKey, // 使用新的稳定key
            evaluator: '',
            evaluate: '',
            isNew: true,
            score: '10',
            ifLate: '否',
            // 保持原有参数
            groupId: currentRecord.groupId,
            workDate: currentRecord.workDate,
            workShiftId: currentRecord.workShiftId,
        };

        // 保持原有插入位置
        newData.splice(lastIndex + 1, 0, newRow);
        setTableListData(newData);
    };

    // 保留原有删除行逻辑
    const handleDeleteRow = (key) => {
        const newData = [...tableListData];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
            newData.splice(index, 1);
            setTableListData(newData);
        }
    };

    return (
        <>
            <Modal
                title={
                    <div
                        style={{
                            width: '100%',
                            cursor: 'move',
                        }}
                        onMouseOver={() => {
                            if (disabled) {
                                setDisabled(false);
                            }
                        }}
                        onMouseOut={() => {
                            setDisabled(true);
                        }}
                        onFocus={() => {}}
                        onBlur={() => {}}
                    >
                        值班评价
                    </div>
                }
                modalRender={(modal) => (
                    <Draggable disabled={disabled} bounds={bounds} onStart={(event, uiData) => onStart(event, uiData)}>
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
                wrapClassName="evaluate-modal"
                footer={[]}
                visible={isEvaluateModalOpen}
                width={1000}
                destroyOnClose
                onCancel={handleCancel}
            >
                <Row className="re-load-height">
                    <Col span={24} className="re-load-height">
                        <div className="" style={{ height: '360px' }}>
                            <VirtualTable
                                components={components}
                                rowClassName={() => 'editable-row'}
                                rowKey={(record) => record._tempKey || record.key}
                                global={window}
                                columns={groupColumns}
                                dataSource={tableListData}
                                search={false}
                                onReset={false}
                                bordered
                                options={false}
                                tableAlertRender={false}
                                pagination={false}
                                scroll={{ x: 'max-content' }}
                                // headerTitle={'告警基本信息如下:'}
                                renderEmpty={<div>没有满足条件的数据</div>}
                            />
                        </div>
                    </Col>
                    <Col
                        span={24}
                        style={{
                            justifyContent: 'center',
                            display: editable ? 'flex' : 'none',
                            gap: 20,
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <Button type="primary" onClick={saveEvaluateData}>
                            保存
                        </Button>
                        <Button type="ghost" onClick={handleExport}>
                            导出
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default EvaluateModal;
