import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Row, Col, Table, Icon, Typography, message } from 'oss-ui';

// import serviceConfig from '../../../hox';
// import Common from '../../../common';
import formatReg from './formatReg';
import request from '@Common/api';

import { _ } from 'oss-web-toolkits';

const SmsEdit = (props) => {
    const { visible, onVisibleChange, type, templateInfo, selectedFields } = props;
    const [smsFieldsList, setSmsFieldsList] = useState([]);
    const [paging, setPaging] = useState({
        size: 'small',
        showLessItems: true,
        showSizeChanger: false,
    });
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);

    const [rowId, setRowId] = useState('');
    const [rowClickId, setRowClickId] = useState([]);

    const [formRef] = Form.useForm();
    const onOk = () => {
        formRef.validateFields().then((values) => {
            if (type === 'alarmRightClick') {
                onVisibleChange(false, values, rowClickId);
                return;
            }
        });
    };

    const onCancel = () => {
        onVisibleChange(false);
    };
    const getSmsFieldsList = (page, searchValue) => {
        setLoading(true);
        request('alarmmodel/filter/v1/filter/smsfields', {
            // fullUrl: `${serviceConfig.data.serviceConfig.otherService.filterUrl}`,
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
                fieldName: searchValue,
                current: 1,
                pageSize: 500,
            },
        })
            .then((res) => {
                setLoading(false);
                if (res && res.data) {
                    setSmsFieldsList(res.data.map((item) => ({ ...item, showAdd: false })));
                }
            })
            .catch(() => setLoading(false));
    };

    const onAdd = (record) => {
        const currentContent = formRef.getFieldValue('content') ? formRef.getFieldValue('content') : '';

        if (rowClickId.find((item) => record.dbField === item)) {
            message.error('该字段已存在');
            return;
        }
        const newContent = `${currentContent}${record.colNameZh}:<${record.dbField}>`;
        if (newContent.length > 600) {
            message.error('模版长度不超过600字');
            return;
        }
        setRowClickId(rowClickId.concat(record.dbField));
        formRef.setFieldsValue({ content: newContent });
        formRef.validateFields(['content']);
    };
    const clearText = () => {
        setRowClickId([]);
        formRef.setFieldsValue({ content: `` });
        formRef.validateFields(['content']);
    };

    useEffect(() => {
        getSmsFieldsList(paging);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (formRef && selectedFields && smsFieldsList.length && formRef.getFieldValue('content') === '') {
            setRowClickId(selectedFields);
            const currentContent = formRef.getFieldValue('content') ? formRef.getFieldValue('content') : '';
            const newContent = `${currentContent}${selectedFields
                .map((item) => {
                    const fieldRecord = smsFieldsList.find((record) => record.dbField === item);
                    if (fieldRecord) {
                        return `${fieldRecord.colNameZh}:<${fieldRecord.dbField}>`;
                    } else {
                        return '';
                    }
                })
                .join('')}`;
            formRef.setFieldsValue({ content: newContent });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formRef, selectedFields, smsFieldsList]);

    const onClickRow = (record) => {
        const copyRecord = record;
        return {
            onMouseEnter: () => {
                setRowId(record.dbField);
                copyRecord.showAdd = true;
            },
            onMouseLeave: () => {
                setRowId('');
                copyRecord.showAdd = false;
            },
        };
    };
    const setRowClassName = (record) => {
        return record.dbField === rowId ? 'clickRowStyls' : '';
    };

    const searhChange = (e) => {
        setSearchValue(e.target.value);
        getSmsFieldsList(paging, e.target.value);
    };

    const debounceSearch = useCallback(_.debounce(searhChange, 400), [paging]);

    const validatorContent = (val, callback) => {
        const reg = formatReg.noEmpety;
        const matchReg = formatReg.matchFiled;
        const list = [];
        let result = '';
        do {
            result = matchReg.exec(val);
            if (result) {
                list.push(result[1]);
            }
        } while (result);
        setRowClickId(list);
        if (val === '') {
            throw new Error('模板内容不能为空');
        } else if (!reg.test(val)) {
            throw new Error('模板内容不能有空格');
        } else if (_.uniq(list).length !== list.length) {
            throw new Error('存在相同字段');
        } else {
            return callback();
        }
    };
    return (
        <Modal
            width={'60%'}
            bodyStyle={{ height: '450px' }}
            zIndex={1001}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            title={type === 'create' ? '短信模板' : '短信内容编辑'}
        >
            <Form
                form={formRef}
                initialValues={{
                    templateName: templateInfo ? templateInfo.templateName : '',
                    content: templateInfo ? templateInfo.templateContent : '',
                }}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Row>
                            <Col span={24}>
                                <Typography.Title
                                    style={{
                                        fontSize: '12px',
                                        lineHeight: '24px',
                                    }}
                                    level={5}
                                >
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
                                    style={{ width: 272, height: 28 }}
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
                                    columns={[
                                        {
                                            dataIndex: 'colNameZh',
                                            title: '名称',
                                            width: 110,
                                            ellipsis: true,
                                        },
                                        {
                                            dataIndex: 'action',
                                            title: '操作',
                                            width: 30,
                                            render: (text, record) =>
                                                record.showAdd && <Icon type="LoginOutlined" antdIcon onClick={() => onAdd(record)} />,
                                        },
                                    ]}
                                />
                            ) : null}
                        </div>
                    </Col>
                    <Col span={16}>
                        <Row justify="space-between">
                            <Col span={22}>
                                <Typography.Title
                                    style={{
                                        fontSize: '12px',
                                        lineHeight: '24px',
                                    }}
                                    level={5}
                                >
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
                                    },
                                },
                            ]}
                        >
                            <Input.TextArea
                                showCount
                                maxLength={600}
                                autoSize={{ minRows: 2, maxRows: 10 }}
                                className="left-list-container-textarea"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default SmsEdit;
