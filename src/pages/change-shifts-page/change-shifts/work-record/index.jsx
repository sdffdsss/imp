import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Table, InputNumber, Popconfirm, Tooltip, Icon } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import { customAlphabet } from 'nanoid';

const { TextArea } = Input;

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = dataIndex === 'content' ? <TextArea /> : <Input disabled={true} />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            validator: (rule, value, callback) => {
                                // eslint-disable-next-line no-control-regex
                                const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                if (valueLength > 2000) {
                                    callback('值班记录内容不能超过4000位（1汉字=2位）');
                                } else {
                                    callback();
                                }
                            },
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const EditableTable = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState(props.originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    useEffect(() => {
        setData(props.originData);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.originData]);

    useEffect(() => {
        setEditingKey(props.editingKey);
        form.setFieldsValue({ ...props.editingObj });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.editingKey, props.editingObj]);

    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = (record) => {
        try {
            const formData = form.getFieldsValue();
            const valueLength = formData.content ? formData.content.replace(/[^\x00-\xff]/g, 'aa').length : 0;
            if (valueLength <= 2000) {
                const newData = [...data];
                const index = newData.findIndex((item) => record.key === item.key);

                if (index > -1) {
                    let item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        content: formData.content,
                    });
                    props.changeData(newData);
                    setData(newData);
                    setEditingKey('');
                } else {
                    // newData.push(row);
                    props.changeData(newData);
                    setData(newData);
                    setEditingKey('');
                }
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const delData = (record) => {
        const newData = _.remove(data, (o) => {
            return o.key !== record.key;
        });
        props.changeData(newData);
        setData(newData);
        setEditingKey('');
    };
    let columns = [
        {
            title: '日期',
            dataIndex: 'operationTime',
            width: '25%',
            editable: true,
            align: 'center',
        },
        {
            title: '值班人员',
            dataIndex: 'userName',
            width: '15%',
            editable: true,
            align: 'center',
        },
        {
            title: '值班记录',
            dataIndex: 'content',
            width: '40%',
            editable: true,
            align: 'center',
        },
        {
            title: '编辑',
            dataIndex: 'operation',
            align: 'center',
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            保存
                        </a>
                    </span>
                ) : (
                    props.operation === 'edit' && (
                        <span>
                            <Tooltip title="修改">
                                <Icon
                                    key="4"
                                    antdIcon={true}
                                    type="EditOutlined"
                                    onClick={() => edit(record)}
                                    style={{
                                        marginRight: 8,
                                    }}
                                    disabled={editingKey !== ''}
                                />
                            </Tooltip>
                            <Tooltip title="删除">
                                <Icon key="3" antdIcon={true} type="DeleteOutlined" onClick={() => delData(record)} disabled={editingKey !== ''} />
                            </Tooltip>
                        </span>
                    )
                );
            },
        },
    ];
    const components = {
        body: {
            cell: EditableCell,
        },
    };
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <VirtualTable
                components={components}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                x={100}
                global={window}
                options={false}
                search={false}
                pagination={false}
                dateFormatter="string"
            />
        </Form>
    );
};

class baseInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            operation: 'show',
            originData: [],
            editingKey: '',
            editingObj: {},
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        const { operation, originData } = this.props;
        this.setState({
            operation,
            originData,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.operation !== prevProps.operation || this.props.originData !== prevProps.originData) {
            const { operation, originData } = this.props;
            this.setState({
                operation,
                originData,
            });
        }
    }

    addData = () => {
        const {
            login: { userName, userId },
        } = this.props;
        let { originData } = this.state;
        const nanoid = customAlphabet('1234567890', 10);
        let key = nanoid();
        let editingObj = {
            key: key,
            operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            userName: userName,
            userId: userId,
            content: '',
        };
        let newOriginData = originData ? originData.concat([editingObj]) : [editingObj];
        this.props.changeOriginData(newOriginData);
        this.setState({
            originData: newOriginData,
            editingKey: key,
            editingObj: editingObj,
        });
    };

    changeData = (val) => {
        this.props.changeOriginData(val);
        this.setState({
            originData: val,
        });
    };

    render() {
        const { operation, originData, editingObj, editingKey } = this.state;
        return (
            <EditableTable
                editingObj={editingObj}
                editingKey={editingKey}
                operation={operation}
                originData={originData}
                changeData={this.changeData}
            />
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(baseInfo);
