import React, { useCallback } from 'react';
import { Modal, Form, Input, Row, Col, Table, Icon, Typography, message } from 'oss-ui';
import request from '@Common/api';
import formatReg from '@Common/formatReg';
import '../index.less';
import { _ } from 'oss-web-toolkits';

export default (props) => {
    const { visible, onVisibleChange, type, templateInfo, reloadList, optionKey, setSmsContentValue, modalContainer, onValuesChange } = props;
    const [smsFieldsList, setSmsFieldsList] = React.useState([]);
    const [paging, setPaging] = React.useState({
        current: 1,
        pageSize: 20,
        size: 'small',
        showLessItems: true,
        showSizeChanger: false
    });
    const [loading, setLoading] = React.useState(false);
    const [smsTemplateLists, setSmsFieldsLists] = React.useState([]);
    const [rowId, setRowId] = React.useState('');
    const [rowClickId, setRowClickId] = React.useState([]);
    const [rowIds, setRowIds] = React.useState('');
    const [formRef] = Form.useForm();
    const createOrEditTemplate = (atype, data) => {
        request('alarmmodel/filter/v1/filter/smsTemplate', {
            type: atype,
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                optionKey,
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                },
                smsTemplate: {
                    templateContent: data.content,
                    templateName: type === 'create' || type === 'edit' ? data.templateName : templateInfo.label,
                    newTemplateName: data.templateName
                }
            }
        })
            .then(() => {
                reloadList();
                if (props.type !== 'edit') {
                    setSmsContentValue(data.content);
                }
                message.success('保存成功');
                onVisibleChange(false);
                onValuesChange(data.content);
            })
            .catch(() => {
                // message.error('共享订阅模板已经存在!');
            });
    };
    const onOk = () => {
        formRef.validateFields().then((values) => {
            if (type === 'alarmRightClick') {
                onVisibleChange(false, values);
                return;
            }
            if (values.templateName) {
                if (type === 'editItem' || type === 'edit') {
                    createOrEditTemplate('put', values);
                } else {
                    createOrEditTemplate('post', values);
                }
                onVisibleChange(false);
            } else {
                message.error('请选择模板');
            }
        });
    };

    const onCancel = () => {
        onVisibleChange(false);
    };
    const getSmsFieldsList = (pagings, searchValue) => {
        setLoading(true);
        request('alarmmodel/filter/v1/filter/smsfields', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                }),
                fieldName: searchValue,
                current: pagings.current,
                pageSize: pagings.pageSize
            }
        })
            .then((res) => {
                setLoading(false);
                if (res && res.data) {
                    setPaging({
                        current: res.current,
                        pageSize: res.pageSize,
                        total: res.total,
                        // simple: true,
                        size: 'small',
                        showLessItems: true,
                        showSizeChanger: false
                    });
                    setSmsFieldsList(res.data.map((item) => ({ ...item, showAdd: false })));
                }
            })
            .catch(() => setLoading(false));
    };

    const onAdd = (record) => {
        const currentContent = formRef.getFieldValue('content');

        if (rowClickId.find((item) => record.dbField === item)) {
            message.error('该字段已存在');
        } else {
            setRowClickId(rowClickId.concat(record.dbField));
            formRef.setFieldsValue({ content: `${currentContent}${record.colNameZh}:<${record.dbField}>` });
            formRef.validateFields(['content']);
        }
    };
    const clearText = () => {
        setRowClickId([]);
        formRef.setFieldsValue({ content: `` });
        formRef.validateFields(['content']);
    };

    React.useEffect(() => {
        getSmsFieldsList(paging);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setSmsFieldsLists(props.smsTemplateList || []);
    }, [props.smsTemplateList]);

    const onClickRow = (record) => {
        return {
            onMouseEnter: () => {
                setRowId(record.dbField);
                const obj = record;
                obj.showAdd = true;
                // record.showAdd = true;
            },
            onMouseLeave: () => {
                setRowId('');
                const obj = record;
                obj.showAdd = false;
                // record.showAdd = false;
            }
        };
    };
    const setRowClassName = (record) => {
        return record.dbField === rowId ? 'clickRowStyls' : '';
    };
    const searhChange = (e) => {
        getSmsFieldsList(paging, e.target.value);
    };
    const searhListChange = (e) => {
        let newArr = [];

        if (e.target.value) {
            newArr = props.smsTemplateList.filter((item) => item.label.includes(e.target.value));
        } else {
            newArr = props.smsTemplateList;
        }
        setSmsFieldsLists(newArr);
    };
    const debounceListSearch = useCallback(_.debounce(searhListChange, 400), []);
    const debounceSearch = useCallback(_.debounce(searhChange, 400), [paging]);
    const setRowClassNames = (record) => {
        return record.label === rowIds ? 'clickRowStyls' : '';
    };
    const onClickRows = (record) => {
        return {
            onClick: () => {
                setRowIds(record.label);
                setRowClickId([]);
                formRef.setFieldsValue({ content: `` });
                formRef.setFieldsValue({ templateName: record.label, content: record.value });
                formRef.validateFields(['content']);
            }
        };
    };
    const pageChange = (pagination) => {
        getSmsFieldsList(pagination);
    };

    const validatorContent = (val, callback) => {
        const reg = formatReg.noEmpety;
        const matchReg = formatReg.matchFiled;
        const list = [];
        let result = null;
        do {
            result = matchReg.exec(val);

            if (result) {
                list.push(result[1]);
            }
        } while (result);
        setRowClickId(list);
        if (_.isNil(val) || !reg.test(val)) {
            throw new Error('模板内容不能为空');
        } else if (_.uniq(list).length !== list.length) {
            throw new Error('存在相同字段');
        } else {
            return callback();
        }
    };
    return (
        <Modal
            width={1000}
            bodyStyle={{ height: '450px' }}
            zIndex={1001}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            title={type === 'create' ? '共享订阅模板' : '共享订阅内容编辑'}
            getContainer={modalContainer}
        >
            <Form
                form={formRef}
                initialValues={{
                    templateName: templateInfo ? templateInfo.label : '',
                    content: templateInfo ? templateInfo.value : ''
                }}
            >
                {(type === 'create' || type === 'editItem') && (
                    <Form.Item
                        name="templateName"
                        label="模板名称"
                        rules={[
                            { required: true, message: '名称不能为空' },
                            {
                                validator: async (rule, val, callback) => {
                                    const reg = formatReg.noEmpety;
                                    if (reg.test(val) || !val) {
                                        callback();
                                    } else {
                                        throw new Error('名称不能为空格或带有空格');
                                    }
                                }
                            }
                        ]}
                    >
                        {/* disabled={type === 'editItem'} */}
                        <Input style={{ width: '250px' }} maxLength={200} />
                    </Form.Item>
                )}

                <Row gutter={16}>
                    {(type === 'edit' || type === 'alarmRightClick') && (
                        <>
                            <Form.Item name="templateName" hidden>
                                <Input />
                            </Form.Item>
                            <Col span={6}>
                                <Row>
                                    <Col span={24}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            模板列表
                                        </Typography.Title>
                                    </Col>
                                </Row>
                                <div className="left-list-container">
                                    <div className="left-list-container-search">
                                        <Input
                                            placeholder="请输入列表名称查询"
                                            onChange={(e) => {
                                                e.persist();
                                                debounceListSearch(e);
                                            }}
                                            suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }}></Icon>}
                                            style={{ width: 200, height: 28 }}
                                        ></Input>
                                    </div>
                                    {smsTemplateLists.length ? (
                                        <Table
                                            className="left-list-container-table"
                                            size="small"
                                            showHeader={false}
                                            rowClassName={setRowClassNames}
                                            columns={[
                                                {
                                                    dataIndex: 'label',
                                                    title: '名称',
                                                    ellipsis: true
                                                }
                                            ]}
                                            dataSource={smsTemplateLists}
                                            onRow={onClickRows}
                                            scroll={{ y: 250 }}
                                            pagination={false}
                                        />
                                    ) : null}
                                </div>
                            </Col>

                            <Col span={6}>
                                <Row>
                                    <Col span={24}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            可导入字段
                                        </Typography.Title>
                                    </Col>
                                </Row>
                                <div className="left-list-container">
                                    <div className="left-list-container-search">
                                        <Input
                                            placeholder="请输入字段名称查询"
                                            onChange={(e) => {
                                                e.persist();
                                                debounceSearch(e);
                                            }}
                                            suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }}></Icon>}
                                            style={{ width: 200, height: 28 }}
                                        ></Input>
                                    </div>
                                    {smsFieldsList.length ? (
                                        <Table
                                            size="small"
                                            onRow={onClickRow}
                                            rowClassName={setRowClassName}
                                            showHeader={false}
                                            scroll={{ y: 250 }}
                                            dataSource={smsFieldsList}
                                            pagination={paging}
                                            loading={loading}
                                            onChange={pageChange}
                                            columns={[
                                                {
                                                    dataIndex: 'colNameZh',
                                                    title: '名称',
                                                    width: 110,
                                                    ellipsis: true
                                                },
                                                {
                                                    dataIndex: 'action',
                                                    title: '操作',
                                                    width: 30,
                                                    render: (text, record) =>
                                                        record.showAdd && <Icon type="icondaoru-2" onClick={() => onAdd(record)} />
                                                }
                                            ]}
                                        />
                                    ) : null}
                                </div>
                            </Col>
                            <Col span={12}>
                                <Row justify="space-between">
                                    <Col span={22}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            <span> 模板详情</span> <span className="color-item">（长度不超过600字）</span>
                                        </Typography.Title>
                                    </Col>
                                    <Col span={2}>
                                        <Row align="middle" justify="end">
                                            <Icon type="iconqingchu" style={{ fontSize: '19px' }} onClick={clearText}></Icon>
                                        </Row>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="content"
                                    rules={[
                                        {
                                            validator: async (rule, val, callback) => {
                                                validatorContent(val, callback);
                                            }
                                        }
                                    ]}
                                >
                                    <Input.TextArea disabled={true} showCount maxLength={600} className="left-list-container-textarea" />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                    {(type === 'create' || type === 'editItem') && (
                        <>
                            {' '}
                            <Col span={6}>
                                <Row>
                                    <Col span={24}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            可导入字段
                                        </Typography.Title>
                                    </Col>
                                </Row>
                                <div className="left-list-container">
                                    <div className="left-list-container-search">
                                        <Input
                                            placeholder="请输入字段名称查询"
                                            onChange={(e) => {
                                                e.persist();
                                                debounceSearch(e);
                                            }}
                                            suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }}></Icon>}
                                            style={{ width: 200, height: 28 }}
                                        ></Input>
                                    </div>
                                    {smsFieldsList.length ? (
                                        <Table
                                            size="small"
                                            onRow={onClickRow}
                                            rowClassName={setRowClassName}
                                            showHeader={false}
                                            scroll={{ y: 250 }}
                                            dataSource={smsFieldsList}
                                            pagination={paging}
                                            loading={loading}
                                            onChange={pageChange}
                                            columns={[
                                                {
                                                    dataIndex: 'colNameZh',
                                                    title: '名称',
                                                    width: 110,
                                                    ellipsis: true
                                                },
                                                {
                                                    dataIndex: 'action',
                                                    title: '操作',
                                                    width: 30,
                                                    render: (text, record) =>
                                                        record.showAdd && <Icon type="icondaoru-2" onClick={() => onAdd(record)} />
                                                }
                                            ]}
                                        />
                                    ) : null}
                                </div>
                            </Col>
                            <Col span={18}>
                                <Row justify="space-between">
                                    <Col span={22}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            <span> 模板详情</span> <span className="color-item">（长度不超过600字）</span>
                                        </Typography.Title>
                                    </Col>
                                    <Col span={2}>
                                        <Row align="middle" justify="end">
                                            <Icon type="iconqingchu" style={{ fontSize: '19px' }} onClick={clearText}></Icon>
                                        </Row>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="content"
                                    rules={[
                                        {
                                            validator: async (rule, val, callback) => {
                                                validatorContent(val, callback);
                                            }
                                        }
                                    ]}
                                >
                                    <Input.TextArea disabled={true} showCount maxLength={600} className="left-list-container-textarea" />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                </Row>
            </Form>
        </Modal>
    );
};
