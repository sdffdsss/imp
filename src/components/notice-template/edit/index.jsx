/* eslint-disable no-param-reassign */
import React, { useCallback } from 'react';
import { Modal, Form, Input, Row, Col, Table, Icon, Typography, message } from 'oss-ui';
// import MenuItem from '@Src/components/flow/components/EditorContextMenu/MenuItem';
import request from '@Common/api';
import formatReg from '@Common/formatReg';
import '../index.less';
import { _ } from 'oss-web-toolkits';

export default (props) => {
    const { visible, onVisibleChange, type, templateInfo, reloadList, setSmsContentValue, modalContainer, noticeTemplateAddClassName, isWireless } =
        props;
    const [smsFieldsList, setSmsFieldsList] = React.useState([]);
    const [paging, setPaging] = React.useState({
        current: 1,
        pageIndex: 1,
        pageSize: 20,
        // simple: true,
        size: 'small',
        showLessItems: true,
        showSizeChanger: false,
    });
    const [loading, setLoading] = React.useState(false);
    const [smsTemplateLists, setSmsFieldsLists] = React.useState([]);
    const [rowId, setRowId] = React.useState('');
    const [rowClickId, setRowClickId] = React.useState([]);
    const [rowIds, setRowIds] = React.useState('');
    const [searchStr, handleSearchStr] = React.useState('');
    const [formRef] = Form.useForm();
    const createOrEditTemplate = (types, data, url) => {
        request(url, {
            type: types,
            baseUrlType: 'fault',
            showSuccessMessage: false,
            data: {
                templateContent: data.content,
                templateName: data.templateName,
                provinceId: data.provinceId,
                templateId: templateInfo?.templateId,
                templateType: data.templateType || templateInfo?.templateType,
                faultDistinctionType: isWireless ? 2 : 1,
            },
        })
            .then(() => {
                reloadList(data.content, data.templateName);
                if (props.type !== 'edit') {
                    setSmsContentValue(data.content);
                }
                message.success('保存成功');
                onVisibleChange(false);
            })
            .catch(() => {});
    };
    const onOk = () => {
        formRef.validateFields().then((values) => {
            if (type === 'alarmRightClick') {
                onVisibleChange(false, values);
                return;
            }
            if (values.templateName) {
                if (type === 'editItem' || type === 'edit') {
                    createOrEditTemplate(
                        'post',
                        { ...values, provinceId: props.provinceId, templateType: props.templateType },
                        'faultReport/editTemplate',
                    );
                } else {
                    createOrEditTemplate(
                        'post',
                        { ...values, provinceId: props.provinceId, templateType: props.templateType },
                        'faultReport/addTemplate',
                    );
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
        console.log(searchValue);
        setLoading(true);
        request(props.templateType === '5' ? 'alarmmodel/filter/v1/filter/smsfields' : 'faultReport/queryTemplateFields', {
            // fullUrl: `${serviceConfig.data.serviceConfig.otherService.filterUrl}`,
            type: 'get',
            baseUrlType: props.templateType === '5' ? 'filterUrl' : 'fault',
            showSuccessMessage: false,
            data: {
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
                fieldName: searchValue,
                pageIndex: pagings.current,
                pageSize: pagings.pageSize,
            },
        })
            .then((res) => {
                setLoading(false);
                if (res && res.data) {
                    setPaging({
                        current: res.pageIndex,
                        pageSize: res.pageSize,
                        total: res.total,
                        // simple: true,
                        size: 'small',
                        showLessItems: true,
                        showSizeChanger: false,
                    });
                    setSmsFieldsList(res.data.map((item) => ({ ...item, showAdd: false })));
                }
            })
            .catch(() => setLoading(false));
    };
    // const handleMenuClick = ({ item, key }) => {
    //     formRef.setFieldsValue({ content: `` });
    //     formRef.setFieldsValue({ templateName: key, content: item.props.content });
    // };

    const onAdd = (record) => {
        const currentContent = formRef.getFieldValue('content');

        if (rowClickId.find((item) => record[props.templateType === '5' ? 'dbField' : 'fieldKey'] === item)) {
            message.error('该字段已存在');
            return;
        }
        const newContent = `${currentContent}${record[props.templateType === '5' ? 'colNameZh' : 'fieldName']}:<${
            record[props.templateType === '5' ? 'dbField' : 'fieldKey']
        }>`;
        if (newContent.length > 600) {
            message.error('模版长度不超过600字');
            return;
        }
        setRowClickId(rowClickId.concat(record[props.templateType === '5' ? 'dbField' : 'fieldKey']));
        formRef.setFieldsValue({ content: newContent });
        formRef.validateFields(['content']);
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
                setRowId(record[props.templateType === '5' ? 'dbField' : 'fieldKey']);
                record.showAdd = true;
            },
            onMouseLeave: () => {
                setRowId('');
                record.showAdd = false;
            },
        };
    };
    const setRowClassName = (record) => {
        return record[props.templateType === '5' ? 'dbField' : 'fieldName'] === rowId ? 'clickRowStyls' : '';
    };
    const searhChange = (e) => {
        handleSearchStr(e.target.value);
        getSmsFieldsList({ current: 1, pageSize: 20 }, e.target.value);
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
                formRef.setFieldsValue({ templateName: record.label, content: record.templateContent });
                formRef.validateFields(['content']);
            },
        };
    };
    const pageChange = (pagination) => {
        getSmsFieldsList(pagination, searchStr);
        console.log(pagination);
    };
    // const searhChangeList = (e) => {
    //     window.console.log(e.target.value);
    // };
    const validatorContent = (val, callback) => {
        // const reg = formatReg.noEmpety;
        const matchReg = formatReg.matchFiled;
        const list = [];
        let result = null;
        do {
            result = matchReg.exec(val);

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            result && list.push(result[1]);
        } while (result);
        setRowClickId(list);
        if (_.isNil(val) || val === '') {
            throw new Error('模板内容不能为空');
        } else if (_.uniq(list).length !== list.length) {
            throw new Error('存在相同字段');
        } else {
            return callback();
        }
    };
    const editTypes = '通知';
    return (
        <Modal
            width={1000}
            bodyStyle={{ height: '450px' }}
            zIndex={1001}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            title={type === 'create' ? `${editTypes}模板` : `${editTypes}内容编辑`}
            getContainer={modalContainer}
            className={noticeTemplateAddClassName}
        >
            <Form
                form={formRef}
                // onFieldsChange={(changedFields) => {
                //     console.log(changedFields);
                //     formRef.validateFields(['content']);
                // }}
                // onValuesChange={(changedValues) => {
                //     console.log(changedValues);
                //     formRef.validateFields(['content']);
                // }}
                initialValues={{
                    templateName: templateInfo ? templateInfo.label : '',
                    content: templateInfo ? templateInfo.templateContent : '',
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
                                },
                            },
                        ]}
                    >
                        <Input style={{ width: '250px' }} disabled={type === 'editItem'} maxLength={200} />
                    </Form.Item>
                )}

                <Row gutter={16}>
                    {(type === 'edit' || type === 'alarmRightClick') && (
                        <>
                            <Form.Item name="templateName" hidden>
                                <Input />
                            </Form.Item>
                            <Col span={5}>
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
                                            suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }} />}
                                            style={{ width: 200, height: 28 }}
                                        />
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
                                                    ellipsis: true,
                                                },
                                            ]}
                                            dataSource={smsTemplateLists}
                                            onRow={onClickRows}
                                            scroll={{ y: 250 }}
                                            pagination={false}
                                        />
                                    ) : null}
                                </div>
                                {/* <Menu mode="vertical" onClick={handleMenuClick}>
                                    {smsTemplateLists.map((item) => {
                                        return (
                                            <Menu.Item key={item.label} content={item.value}>
                                                {item.label}
                                            </Menu.Item>
                                        );
                                    })}
                                </Menu> */}
                            </Col>

                            <Col span={8}>
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
                                            suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }} />}
                                            style={{ width: 200, height: 28 }}
                                        />
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
                                                    dataIndex: props.templateType === '5' ? 'colNameZh' : 'fieldName',
                                                    title: '名称',
                                                    width: 110,
                                                    ellipsis: true,
                                                },
                                                {
                                                    dataIndex: 'action',
                                                    title: '操作',
                                                    width: 30,
                                                    render: (text, record) =>
                                                        record.showAdd && <Icon type="icondaoru-2" onClick={() => onAdd(record)} />,
                                                },
                                            ]}
                                        />
                                    ) : null}
                                </div>
                            </Col>
                            <Col span={11}>
                                <Row justify="space-between">
                                    <Col span={22}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            <span> 模板详情</span> <span className="color-item">（长度不超过600字）</span>
                                        </Typography.Title>
                                    </Col>
                                    <Col span={2}>
                                        <Row align="middle" justify="end">
                                            <Icon type="iconqingchu" style={{ fontSize: '19px' }} onClick={clearText} />
                                        </Row>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="content"
                                    rules={[
                                        {
                                            validator: async (rule, val, callback) => {
                                                validatorContent(val, callback);
                                            },
                                        },
                                    ]}
                                >
                                    <Input.TextArea showCount maxLength={600} className="left-list-container-textarea" />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                    {(type === 'create' || type === 'editItem') && (
                        <>
                            {' '}
                            <Col span={8}>
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
                                            suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }} />}
                                            style={{ width: 200, height: 28 }}
                                        />
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
                                                    dataIndex: props.templateType === '5' ? 'colNameZh' : 'fieldName',
                                                    title: '名称',
                                                    width: 110,
                                                    ellipsis: true,
                                                },
                                                {
                                                    dataIndex: 'action',
                                                    title: '操作',
                                                    width: 30,
                                                    render: (text, record) =>
                                                        record.showAdd && <Icon type="icondaoru-2" onClick={() => onAdd(record)} />,
                                                },
                                            ]}
                                        />
                                    ) : null}
                                </div>
                            </Col>
                            <Col span={16}>
                                <Row justify="space-between">
                                    <Col span={22}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            <span> 模板详情</span> <span className="color-item">（长度不超过600字）</span>
                                        </Typography.Title>
                                    </Col>
                                    <Col span={2}>
                                        <Row align="middle" justify="end">
                                            <Icon type="iconqingchu" style={{ fontSize: '19px' }} onClick={clearText} />
                                        </Row>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="content"
                                    rules={[
                                        {
                                            validator: async (rule, val, callback) => {
                                                validatorContent(val, callback);
                                            },
                                        },
                                    ]}
                                >
                                    <Input.TextArea showCount maxLength={600} className="left-list-container-textarea" />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                </Row>
            </Form>
        </Modal>
    );
};
