import moment from 'moment';
import { Form, Input, Popconfirm, Table, Icon } from 'oss-ui';
import React, { useContext, useEffect, useRef, useState } from 'react';
import produce from 'immer';

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
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const ProcessesModal = (props) => {
    const { handleDataSource, defautDataSource, editType } = props;

    const [dataSource, setDataSource] = useState(defautDataSource || []);

    const handleDelete = (index) => {
        const tempDatas = produce(dataSource, (draft) => {
            draft.splice(index, 1);
        });
        setDataSource(tempDatas);
        handleDataSource(tempDatas);
    };

    const handleAdd = () => {
        const newData = {
            createdTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            processPeople: '记录人',
            processContent: '处理过程',
        };
        const tempDatas = [...dataSource, newData];

        setDataSource(tempDatas);
        handleDataSource(tempDatas);
    };

    function defaultColumns() {
        const columns = [
            {
                title: '时间',
                dataIndex: 'createdTime',
                editable: true,
            },
            {
                title: '记录人',
                dataIndex: 'processPeople',
                editable: true,
            },
            {
                title: '处理内容',
                dataIndex: 'processContent',
                editable: true,
            },
        ];
        if (editType !== 'view') {
            columns.push({
                title: <Icon key="userAdd" antdIcon type="PlusOutlined" onClick={handleAdd} />,
                dataIndex: 'operation',
                render: (_, record, index) =>
                    dataSource.length >= 1 ? (
                        <Popconfirm title="是否确认删除?" onConfirm={() => handleDelete(index)}>
                            <Icon key="userDel" antdIcon type="DeleteOutlined" />
                        </Popconfirm>
                    ) : null,
            });
        }
        return columns;
    }

    const handleSave = (row, index) => {
        const tempDatas = [...dataSource];
        const item = tempDatas[index];
        tempDatas.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(tempDatas);
        handleDataSource(tempDatas);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns().map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record, index) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: (row) => {
                    handleSave(row, index);
                },
            }),
        };
    });
    return (
        <div>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                rowKey="id"
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />
        </div>
    );
};

export default ProcessesModal;
