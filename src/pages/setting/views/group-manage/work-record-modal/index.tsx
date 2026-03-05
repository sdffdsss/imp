import React, { useImperativeHandle, useState, useRef, forwardRef, useEffect } from 'react';
import { ProTable, Form, message } from 'oss-ui';
import { DndProvider } from 'react-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
// eslint-disable-next-line
import { HTML5Backend } from 'react-dnd-html5-backend';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import AddItem from './addItem';
import DefaultTemplate from './defaultTemplate';

interface Props {
    rows: any[];
}

export default forwardRef((props: Props, ref) => {
    const { rows } = props;

    const tempFieldKeysRef = useRef([]);
    const [form] = Form.useForm();

    const [dataSource, setDataSource] = useState<any[]>(rows);

    useEffect(() => {
        const values = {};

        rows.forEach((item) => {
            item?.workRecordConfig?.[1]?.forEach((itemConfig) => {
                itemConfig.forEach((itemC) => {
                    const { fieldKey, type, compProps } = itemC;
                    if (type === 'input') {
                        Object.assign(values, {
                            [fieldKey]: compProps.defaultValue,
                        });
                    }

                    if (type === 'select') {
                        Object.assign(values, {
                            [fieldKey]: compProps.defaultValue,
                        });
                    }

                    if (type === 'radio') {
                        Object.assign(values, {
                            [`${fieldKey}-0`]: compProps.options[0],
                            [`${fieldKey}-1`]: compProps.options[1],
                        });
                    }
                });
            });
        });

        form.setFieldsValue(values);
    }, [rows, form]);
    const addTemplate = (index, subIndex) => {
        const newData = produce(dataSource, (draft) => {
            draft[index].workRecordConfig[1].splice(subIndex + 1, 0, []);
        });

        setDataSource(newData);
    };

    const deleteTemplate = (index, subIndex) => {
        if (dataSource[index].workRecordConfig[1].length === 1) {
            message.warn('至少保留一条工作记录模板');

            return;
        }
        const newData = produce(dataSource, (draft) => {
            draft[index].workRecordConfig[1].splice(subIndex, 1);
        });
        setDataSource(newData);
    };

    const onTempFieldKeysChange = (fn) => {
        tempFieldKeysRef.current = fn(tempFieldKeysRef.current);
    };

    const onWorkRecordChange = (index, subIndex, data) => {
        const newData = produce(dataSource, (draft) => {
            draft[index].workRecordConfig[1].splice(subIndex, 1, data);
        });
        setDataSource(newData);
    };

    const columns: any = [
        {
            title: '分项目',
            dataIndex: 'subProject',
            key: 'subProject',
            hideInSearch: true,
            width: 200,
            align: 'center',
            ellipsis: true,
            render: (text) => text,
            onCell: (_) => {
                return {
                    rowSpan: _.rowSpanW,
                    colSpan: _.colSpanW,
                };
            },
        },
        {
            title: '计划执行时间',
            dataIndex: 'planExecTime',
            key: 'planExecTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '自定义巡检记录模版',
            dataIndex: 'template',
            key: 'template',
            width: 500,
            align: 'center',
            onCell: () => {
                return { style: { padding: '0 4px' } };
            },
            render: (_, record, index) => {
                return (
                    <AddItem
                        timeIndex={index}
                        row={record}
                        addTemplate={(subIndex) => addTemplate(index, subIndex)}
                        deleteTemplate={(subIndex) => deleteTemplate(index, subIndex)}
                        onChange={(subIndex, data) => onWorkRecordChange(index, subIndex, data)}
                        onTempFieldKeysChange={onTempFieldKeysChange}
                    />
                );
            },
        },
    ];

    const getValues = () => {
        const formValues = form.getFieldsValue();
        const newConfig = dataSource.map((item1) => {
            const [planExecTime, workRecordConfig] = item1.workRecordConfig;
            const newValue = workRecordConfig.map((item) => {
                return item.map((itemIn) => {
                    const newItem = _.cloneDeep(itemIn);

                    if (newItem.type === 'input') {
                        newItem.value = formValues[newItem.fieldKey] ? [formValues[newItem.fieldKey]] : [''];
                        newItem.compProps.defaultValue = newItem.value[0] || '';
                    }

                    if (newItem.type === 'select') {
                        newItem.value = formValues[newItem.fieldKey] ? [formValues[newItem.fieldKey]] : [undefined];
                    }

                    if (newItem.type === 'radio') {
                        if (!formValues[`${newItem.fieldKey}-0`] || !formValues[`${newItem.fieldKey}-1`]) {
                            message.warn('单选按钮内容不可为空!');
                            throw new Error('单选按钮内容不可为空');
                        }

                        if (formValues[`${newItem.fieldKey}-0`] === formValues[`${newItem.fieldKey}-1`]) {
                            message.warn('单选按钮两项内容不可相同!');
                            throw new Error('单选按钮两项内容不可相同');
                        }

                        newItem.value = [formValues[`${newItem.fieldKey}-0`] || '', formValues[`${newItem.fieldKey}-1`] || ''];
                        newItem.compProps.options = newItem.value;
                    }

                    return newItem;
                });
            });
            return [planExecTime, newValue];
        });

        return newConfig;
    };

    useImperativeHandle(ref, () => ({
        getValues,
    }));

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const { droppableId: sourceDroppableId, index: sourceIndex } = source;
        const [sourceTimeIndex, sourceRecordIndex] = sourceDroppableId.split('-');
        const { droppableId: destDroppableId, index: destIndex } = destination;
        const [destTimeIndex, destRecordIndex] = destDroppableId.split('-');

        const sourceData = dataSource[Number(sourceTimeIndex)].workRecordConfig[1][Number(sourceRecordIndex)][sourceIndex];
        const destDatas = dataSource[Number(destTimeIndex)].workRecordConfig[1][Number(destRecordIndex)];

        if ((sourceData.type === 'radio' && destDatas.length !== 0) || (destDatas.length === 1 && destDatas[0].type === 'radio')) {
            message.warning('单选按钮只能单独放置在一条模板中');

            return;
        }

        if (
            (sourceData.type === 'input' && sourceData.subtype === 'presets' && destDatas.length !== 0) ||
            (destDatas.length === 1 && destDatas[0].type === 'input' && destDatas[0].subtype === 'presets')
        ) {
            message.warning('预设内容文本域只能单独放置在一条模板中');

            return;
        }

        const newData = produce(dataSource, (draft) => {
            const [moveItem] = draft[Number(sourceTimeIndex)].workRecordConfig[1][Number(sourceRecordIndex)].splice(sourceIndex, 1);
            draft[Number(destTimeIndex)].workRecordConfig[1][Number(destRecordIndex)].splice(destIndex, 0, moveItem);
        });

        setDataSource(newData);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <DndProvider backend={HTML5Backend}>
                <div style={{ height: '100%', display: 'flex' }}>
                    <div style={{ width: '30%' }}>
                        <DefaultTemplate />
                    </div>
                    <div style={{ width: '70%' }}>
                        <Form form={form}>
                            <ProTable
                                rowKey="key"
                                columns={columns}
                                dataSource={dataSource}
                                search={false}
                                bordered
                                options={false}
                                tableAlertRender={false}
                                pagination={false}
                                scroll={{ y: 530 }}
                                toolBarRender={false}
                                size="small"
                            />
                        </Form>
                    </div>
                </div>
            </DndProvider>
        </DragDropContext>
    );
});
