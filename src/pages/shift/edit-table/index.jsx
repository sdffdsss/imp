import React, { PureComponent, useState, useRef, useContext, useEffect } from 'react';
import { Table, Form, Input } from 'oss-ui';

const EditableContext = React.createContext();
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
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex]
        });
    };

    const save = () => {
        try {
            const values = form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`
                    }
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

class index extends PureComponent {
    constructor(props) {
        super(props);
        // alert(this.props.shiftMode);
        // 判断是否是交接班
        let isConnect = false;
        if (this.props.shiftMode === '1') {
            isConnect = true;
        } else if (this.props.shiftMode === '2') {
            isConnect = false;
        }
        // 判断当前登录人状态，是否展示数据 1-值班长、2-普通岗位
        this.loginStatus = '1';
        this.columns = [
            {
                title: '岗位',
                dataIndex: 'gw',
                align: 'center'
            },
            {
                title: '交班人员',
                dataIndex: 'jbry',
                align: 'center'
            },
            {
                title: '接班人员',
                dataIndex: 'jbr',
                align: 'center'
            },
            {
                title: '交班时间',
                dataIndex: 'time',
                align: 'center'
            },
            {
                title: '交接描述',
                dataIndex: 'jjms',
                width: '20%',
                editable: isConnect,
                align: 'center'
            },
            {
                title: '交班方式',
                dataIndex: 'jbfs',
                align: 'center'
            }
            // {
            //    title: 'operation',
            // dataIndex: 'operation',
            // render: (text, record) =>
            // this.state.dataSource.length >= 1 ? (
            // <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
            // <a>Delete</a>
            // </Popconfirm>
            // ) : null,
            // },
        ];
        if (this.loginStatus === '1') {
            this.state = {
                dataSource: [
                    {
                        key: '0',
                        gw: '值班长',
                        jbry: '陶凯元',
                        jbr: '刘彤',
                        jjms: '交班',
                        time: '2020/09/20/08:28:10',
                        jbfs: '交接班'
                    },
                    {
                        key: '1',
                        gw: '普通值班岗',
                        jbry: '刘彤',
                        jbr: '吴熠',
                        jjms: '交班',
                        time: '2020/09/20/18:00:10',
                        jbfs: '交接班'
                    },
                    {
                        key: '2',
                        gw: '普通值班岗',
                        jbry: '吴熠',
                        jbr: '王芳',
                        jjms: '交班',
                        time: '2020/09/21/08:28:10',
                        jbfs: '交接班'
                    },
                    {
                        key: '3',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '4',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '5',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '6',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '7',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '8',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '9',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '10',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    },
                    {
                        key: '11',
                        gw: '值班长',
                        jbry: '王芳',
                        jbr: '陈海',
                        jjms: '替班',
                        time: '2020/09/21/18:00:30',
                        jbfs: '交接班'
                    }
                ],
                count: 12
            };
        } else {
            this.state = {};
        }
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key)
        });
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1
        });
    };

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData
        });
    };
    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell
            }
        };
        const columns = this.columns.map((col) => {
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
                    handleSave: this.handleSave
                })
            };
        });
        return (
            <div>
                {/* <Button */}
                {/* onClick={this.handleAdd} */}
                {/* type="primary" */}
                {/* style={{ */}
                {/* marginBottom: 16, */}
                {/* }} */}
                {/* > */}
                {/* Add a row */}
                {/* </Button> */}
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                />
            </div>
        );
    }
}

export default index;
