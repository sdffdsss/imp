import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Row, Col, Table, Icon, Typography, message } from 'oss-ui';
// import MenuItem from '@Src/components/flow/components/EditorContextMenu/MenuItem';
import request from '@Common/api';
import formatReg from '@Common/formatReg';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import { _ } from 'oss-web-toolkits';

export default (props) => {
    const { visible, type, templateInfo, reloadList, onCancel, moduleId } = props;
    const [smsFieldsList, setSmsFieldsList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [paging, setPaging] = useState({
        current: 1,
        pageSize: 20,
        size: 'small',
        showLessItems: true,
        showSizeChanger: false,
    });
    const [loading, setLoading] = useState(false);
    const frameInfo = useLoginInfoModel();
    const [rowId, setRowId] = useState('');
    const [rowClickId, setRowClickId] = useState([]);
    const [formRef] = Form.useForm();
    const createOrEditTemplate = (data) => {
        request('alarmmodel/notice/v1/template', {
            type: 'put',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                },
                alarmRuleNoticeTemplate: {
                    modifier: frameInfo.userId,
                    creator: frameInfo.userId,
                    templateName: templateInfo.templateName,
                    templateId: templateInfo.templateId,
                    templateDesc: templateInfo.templateDesc,
                    templateContent: data.content,
                },
            },
        })
            .then(() => {
                reloadList();
                message.success('保存成功');
                onCancel();
            })
            .catch(() => {});
    };
    const onOk = () => {
        formRef.validateFields().then((values) => {
            createOrEditTemplate(values);
        });
    };

    const getSmsFieldsList = (page, searchParams) => {
        setLoading(true);
        request('alarmmodel/filter/v1/filter/smsfields', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
                fieldName: searchParams,
                current: page.current,
                pageSize: page.pageSize,
            },
        })
            .then((res) => {
                setLoading(false);
                if (res && res.data) {
                    setPaging({
                        current: res.current,
                        pageSize: res.pageSize,
                        total: res.total,
                        size: 'small',
                        showLessItems: true,
                        showSizeChanger: false,
                    });
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
        getSmsFieldsList(paging, '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const pageChange = (pagination) => {
        getSmsFieldsList(pagination, searchValue);
    };

    const searhChange = (e) => {
        setSearchValue(e.target.value);
        getSmsFieldsList(paging, e.target.value);
    };

    const debounceSearch = useCallback(_.debounce(searhChange, 400), [paging]);

    const validatorContent = (val, callback) => {
        const reg = RegExp(/^\s+$/g);
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
        if (!val || reg.test(val)) {
            throw new Error('模板内容不能为空');
        } else if (_.uniq(list).length !== list.length) {
            throw new Error('存在相同字段');
        } else {
            return callback();
        }
    };
    const getEditModule = (id) => {
        switch (id) {
            case 14:
                return '外呼';
            case 70:
                return '邮件';
            default:
                return '通知';
        }
    };
    const editTypes = getEditModule(moduleId);
    return (
        <Modal
            width={'60%'}
            bodyStyle={{ height: '450px' }}
            zIndex={1001}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            title={type === 'create' ? `${editTypes}模板` : `${editTypes}内容编辑`}
        >
            <Form
                form={formRef}
                initialValues={{
                    templateName: templateInfo ? templateInfo.templateName : '',
                    content: templateInfo ? templateInfo.templateContent : '',
                }}
            >
                <Row gutter={16}>
                    <Col span={7}>
                        <Row>
                            <Col span={24}>
                                <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                    可导入字段
                                </Typography.Title>
                            </Col>
                        </Row>
                        <div className="sms-sheet-left-list">
                            <div>
                                <Input
                                    placeholder="请输入字段名称查询"
                                    onChange={(e) => {
                                        e.persist();
                                        debounceSearch(e);
                                    }}
                                    suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }}></Icon>}
                                    style={{ width: 200, height: 28, margin: '0.5vh 1.3vw ' }}
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
                                            ellipsis: true,
                                        },
                                        {
                                            dataIndex: 'action',
                                            title: '操作',
                                            width: 30,
                                            render: (text, record) => record.showAdd && <Icon type="icondaoru-2" onClick={() => onAdd(record)} />,
                                        },
                                    ]}
                                />
                            ) : null}
                        </div>
                    </Col>
                    <Col span={17}>
                        <Row justify="space-between">
                            <Col span={22}>
                                <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                    <span> 模板详情</span> <span className="color-item">（长度不超过600字节）</span>
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
                                {
                                    validator: (rule, value, callback) => {
                                        // eslint-disable-next-line no-control-regex
                                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                        if (valueLength > 600) {
                                            callback('总长度不能超过600位（1汉字=2位）');
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input.TextArea style={{ minHeight: 342, maxHeight: 342, resize: 'none' }} maxLength={601} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
