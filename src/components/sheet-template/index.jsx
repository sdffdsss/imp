import React from 'react';
import { Button, Modal, Form, Input, Row, Col, Table, Icon, Typography, message, Space, Tooltip, Popconfirm } from 'oss-ui';
import request from '@Common/api';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import usePageInfoModel from '@Pages/alarm-rule-manage/rule-manage-new/common/hox.js';
import { _ } from 'oss-web-toolkits';
import formatReg from '@Common/formatReg';
import './index.less';

/**
 * 派单规则-工单模板管理界面
 */
class Index extends React.PureComponent {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 20,
            sheetTitleFoucs: false, // 用来表示工单标题/故障描述哪个文本框被选中
            faultDescFoucs: false, // 用来表示工单标题/故障描述哪个文本框被选中
            paging: {
                current: 1,
                pageSize: 20,
                size: 'small',
                showLessItems: true,
                showSizeChanger: false
            },
            loading: false,
            sheetTemplateLists: [], // 模板列表数组
            sheetTemplateDetailLists: {}, // 选中的模板列表字段详情
            sheetFieldsList: [], // 字段列表数组
            searchSheetFieldsList: [],
            setRowId: '',
            rowClickTitleId: [], // 工单标题文本框数组
            rowClickFaultId: [], // 故障描述文本框数组
            rowIds: '', // 用来标识模板列被选中的字段
            templateId: '', // 模板Id字段
            createOrEdit: 'create', // 切换新建和编辑
            sheetFields: '',
            templateFields: '',
            optionKey: '',
            serachSmsList: [],
            templateName: '',
            rowData: {}
        };
    }
    // 获取模板列表详情
    getSheetTemplateDetailLists = (templateId) => {
        const { tempType } = this.props;
        let url = '';
        let query = {};
        if (tempType === 'voice' || tempType === 'sms') {
            url = 'alarmmodel/notice/v1/template';
            query = {
                templateId
            };
        } else {
            url = `alarmmodel/filter/dispatch/v1/sheet/template?templateId=${templateId}`;
            query = {};
        }
        request(url, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: query
        })
            .then((res) => {
                if (res && res.data) {
                    this.setState({ sheetTemplateDetailLists: res.data });
                }
            })
            .catch(() => {});
    };

    // 点击具体的模板列表字段获取模板详情
    selectTempListRow = (record) => {
        // eslint-disable-next-line no-param-reassign
        record.modify = '';
        return {
            onClick: () => {
                this.getSheetTemplateDetailLists(record.templateId);
                this.setState({
                    rowIds: record.templateName,
                    templateName: record.templateName,
                    rowData: record
                });
            }
        };
    };
    // 选中模板高亮显示
    setRowClassNames = (record) => {
        const { rowIds } = this.state;
        return record.templateName === rowIds ? 'clickRowStyls' : '';
    };
    // 获取模板列表
    getSheetTemplateLists = (params) => {
        const { tempType } = this.props;
        let url = '';
        let data = {};
        if (tempType === 'sms' || tempType === 'voice') {
            url = 'alarmmodel/notice/v1/templates';
            data = {
                creator: this.props.login.userId,
                templateName: params,
                needAll: true
            };
            if (tempType === 'sms') {
                data.templateType = '1';
            } else {
                data.templateType = '2';
            }
        } else {
            url = `alarmmodel/filter/dispatch/v1/sheet/templates?templateName=${params}`;
            data = {};
        }

        request(url, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data
        })
            .then((res) => {
                if (res && res.data) {
                    this.setState({ sheetTemplateLists: res.data });
                }
            })
            .catch(() => {});
    };

    // 搜索模板列表
    searchTempList = (event) => {
        this.setState({ templateFields: event.target.value });
        this.getSheetTemplateLists(event.target.value);
    };

    // 获取字段列表
    getSheetFieldsList = (params, searchValue) => {
        this.setState({ loading: true });
        const { current, pageSize } = params;
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
                current,
                pageSize
            }
        })
            .then((res) => {
                this.setState({ loading: false });
                if (res && res.data) {
                    const paging = {
                        current: res.current,
                        pageSize: res.pageSize,
                        total: res.total,
                        size: 'small',
                        showLessItems: true,
                        showSizeChanger: false
                    };
                    // 添加属性，用来控制导入图标的显示和隐藏
                    const sheetFieldsList = res.data.map((item) => ({ ...item, showAdd: false }));
                    this.setState({
                        sheetFieldsList,
                        paging
                    });
                }
            })
            .catch(() => this.setState({ loading: false }));
    };

    // 搜索输入字段列表
    searchSheetFieldsList = (event) => {
        this.setState({ sheetFields: event.target.value });
        const { paging } = this.state;
        this.getSheetFieldsList(paging, event.target.value);
    };

    // 改变页码获取字段列表
    pageChange = (pagination) => {
        this.getSheetFieldsList(pagination, this.state.sheetFields);
    };

    // 改变工单标题的聚焦状态
    changeTitleFoucs = () => {
        this.setState({ sheetTitleFoucs: true, faultDescFoucs: false });
    };
    // 改变故障描述的聚焦状态
    changeFaultFoucs = () => {
        this.setState({ sheetTitleFoucs: false, faultDescFoucs: true });
    };

    // 点击字段列表的导入图标，将对应字段添加到工单标题或者故障表述文本框中
    onAdd = (record) => {
        const { rowClickTitleId, rowClickFaultId, sheetTitleFoucs, faultDescFoucs } = this.state;
        const { tempType } = this.props;
        if (!sheetTitleFoucs && !faultDescFoucs) {
            if (tempType === 'sheet') {
                message.error('请选中【工单标题】或【故障描述】后导入');
            } else {
                message.error('请选中【模板内容】后导入');
            }

            return;
        }
        if (sheetTitleFoucs) {
            const formInstance = this.formRef.current.getFieldValue('sheetTitle');
            if (rowClickTitleId.find((item) => record.dbField === item)) {
                message.error('该字段已存在');
                return;
            }
            this.setState({ rowClickTitleId: rowClickTitleId.concat(record.dbField) });
            this.formRef.current.setFieldsValue({ sheetTitle: `${formInstance}${record.colNameZh}:<${record.dbField}>` });
            this.formRef.current.validateFields(['sheetTitle']);
        }
        if (faultDescFoucs) {
            const formInstance = this.formRef.current.getFieldValue('faultDesc');
            if (rowClickFaultId.find((item) => record.dbField === item)) {
                message.error('该字段已存在');
            } else {
                this.setState({ rowClickFaultId: rowClickFaultId.concat(record.dbField) });
                this.formRef.current.setFieldsValue({ faultDesc: `${formInstance}${record.colNameZh}:<${record.dbField}>` });
                this.formRef.current.validateFields(['faultDesc']);
            }
        }
    };

    validatorContent = (val, callback, type) => {
        const matchReg = formatReg.matchFiled;
        const list = [];
        let result = '';
        do {
            result = matchReg.exec(val);
            if (result) {
                list.push(result[1]);
            }
        } while (result);
        if (_.uniq(list).length !== list.length) {
            throw new Error('存在相同字段');
        } else {
            if (type === 'desc') {
                this.setState({ rowClickFaultId: list });
            } else {
                this.setState({ rowClickTitleId: list });
            }
            return callback();
        }
    };

    // 鼠标进入/移出 控制字段列表导出图标显示隐藏
    onClickRow = (record) => {
        return {
            onMouseEnter: () => {
                this.setState({ setRowId: record.dbField });
                // eslint-disable-next-line no-param-reassign
                record.showAdd = true;
            },
            onMouseLeave: () => {
                this.setState({ setRowId: '' });
                // eslint-disable-next-line no-param-reassign
                record.showAdd = false;
            }
        };
    };
    /**
     * @description: 点击确认操作
     * @param {*}
     * @return {*}
     */
    onOk = () => {
        const { templateId, createOrEdit } = this.state;
        const {
            login: { userId },
            tempType
        } = this.props;
        // 收集form表单的数据
        this.formRef.current.validateFields().then((values) => {
            const coypValues = values;
            let query = {};
            let url = '';
            coypValues.templateId = templateId;
            coypValues.userId = userId;
            if ((tempType === 'sms' || tempType === 'voice') && createOrEdit !== 'edit') {
                url = 'alarmmodel/notice/v1/template';
                query = {
                    requestInfo: {
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token')
                    },
                    alarmRuleNoticeTemplate: {
                        creator: coypValues.userId,
                        templateName: coypValues.templateName,
                        templateType: '1',
                        templateDesc: coypValues.templateDesc,
                        templateContent: coypValues.faultDesc
                    }
                };
                if (tempType === 'sms') {
                    query.alarmRuleNoticeTemplate.templateType = '1';
                } else {
                    query.alarmRuleNoticeTemplate.templateType = '2';
                }
            } else if ((tempType === 'voice' || tempType === 'sms') && createOrEdit === 'edit') {
                url = 'alarmmodel/notice/v1/template';
                query = {
                    requestInfo: {
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token')
                    },
                    alarmRuleNoticeTemplate: {
                        modifier: coypValues.userId,
                        creator: coypValues.userId,
                        templateName: coypValues.templateName,
                        templateId: coypValues.templateId,
                        templateDesc: coypValues.templateDesc,
                        templateContent: coypValues.faultDesc
                    }
                };
            } else {
                url = 'alarmmodel/filter/dispatch/v1/sheet/template';
                query = {
                    requestInfo: {
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token')
                    },
                    sheetTemplate: {
                        creator: coypValues.userId,
                        templateName: coypValues.templateName,
                        templateId: coypValues.templateId,
                        templateDesc: coypValues.templateDesc,
                        orderTitleRule: coypValues.sheetTitle,
                        orderContentRule: coypValues.faultDesc
                    }
                };
            }

            if (createOrEdit === 'edit') {
                this.createOrEditTemplate('PUT', query, url);
            } else {
                this.createOrEditTemplate('POST', query, url);
            }
        });
    };

    // 新增或者编辑请求
    createOrEditTemplate = (type, data, url) => {
        const { paging } = this.state;
        this.setState({ loading: true });
        request(url, {
            type,
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data
        })
            .then((res) => {
                if (res.data) {
                    message.success('保存成功', 5, () => {
                        this.setState({ loading: false });
                    });
                    this.formRef.current.setFieldsValue({
                        templateName: '',
                        faultDesc: '',
                        sheetTitle: '',
                        templateDesc: ''
                    });
                    this.getSheetFieldsList(paging, '');
                    this.getSheetTemplateLists('');
                    this.setState({ rowIds: '', sheetFields: '', templateFields: '', rowClickTitleId: [], rowClickFaultId: [], serachSmsList: [] });
                    this.props.pageInfo.setLoadType('refresh');
                } else {
                    message.error('保存失败');
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    };
    // 编辑时的回调
    editItem = () => {
        const {
            sheetTemplateDetailLists: { orderTitleRule, orderContentRule, templateDesc, templateContent },
            templateName,
            rowData
        } = this.state;
        const coypRowData = { ...rowData };
        _.forOwn(coypRowData, (index, key) => {
            if (key === 'modify') {
                coypRowData[key] = 'edit';
            }
        });
        this.setState({ rowData: coypRowData }, () => {
            _.forOwn(this.state.rowData, (index, key) => {
                if (key === 'modify' && this.state.rowData[key] === 'edit') {
                    this.setState({ templateId: this.state.rowData.templateId });
                }
            });
        });
        if (templateName) {
            this.setState({ loading: true, createOrEdit: 'edit' });
            setTimeout(() => {
                this.setState({ loading: false });
                this.formRef.current.setFieldsValue({
                    templateName,
                    faultDesc: orderContentRule || templateContent,
                    sheetTitle: orderTitleRule,
                    templateDesc
                });
            }, 500);
        } else {
            message.warning('请选择模板进行编辑');
        }
    };

    // 新增时
    newClick = () => {
        this.formRef.current.setFieldsValue({
            templateName: '',
            faultDesc: '',
            sheetTitle: '',
            templateDesc: ''
        });
        this.setState({
            rowIds: '',
            templateName: '',
            loading: true,
            sheetFields: '',
            templateFields: '',
            serachSmsList: [],
            rowClickFaultId: [],
            rowClickTitleId: []
        });
        this.getSheetTemplateLists('');
        setTimeout(() => {
            this.setState({ loading: false });
        }, 100);
        const { createOrEdit } = this.state;
        if (createOrEdit !== 'create') {
            this.setState({ createOrEdit: 'create' });
        }
    };

    // 删除时的回调
    deleteItem = () => {
        const {
            sheetTemplateDetailLists: { templateName, templateId },
            paging
        } = this.state;
        const { tempType } = this.props;
        let url = '';
        let data = {};
        if (tempType === 'sms' || tempType === 'voice') {
            url = 'alarmmodel/notice/v1/template';
            data = {
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                },
                templateIdList: [templateId],
                templateType: '1'
            };
            if (tempType === 'sms') {
                data.templateType = '1';
            } else {
                data.templateType = '2';
            }
        } else {
            url = 'alarmmodel/filter/dispatch/v1/sheet/template';
            data = {
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token')
                },
                templateId
            };
        }
        if (templateName) {
            request(url, {
                type: 'DELETE',
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,

                data
            })
                .then((res) => {
                    if (res) {
                        if (res.message === '删除成功' || !res.message) {
                            message.success(res.message || '删除成功');
                        } else {
                            message.error(res.message, 10);
                        }
                        this.getSheetFieldsList(paging, '');
                        this.getSheetTemplateLists('');
                        this.formRef.current.setFieldsValue({
                            templateName: '',
                            faultDesc: '',
                            sheetTitle: '',
                            templateDesc: ''
                        });
                        this.setState({ sheetFields: '', templateFields: '', templateName: '', rowIds: '' });
                        this.props.pageInfo.setLoadType('refresh');
                    }
                })
                .catch(() => {});
        }
    };

    deleteMessage = () => {
        message.warning('请选择模板进行删除');
    };
    componentDidMount() {
        const { paging } = this.state;
        // 初始化获取字段列表
        this.getSheetFieldsList(paging, '');
        // 初始化模板列表
        this.getSheetTemplateLists('');
        this.formRef.current.setFieldsValue({
            templateName: '',
            faultDesc: '',
            sheetTitle: '',
            templateDesc: ''
        });
    }

    render() {
        const { sheetTemplateLists, sheetFieldsList, paging, loading, sheetFields, templateFields, templateName, serachSmsList } = this.state;
        const { visible, onCancel, lookOrCreate, templateDetailLists, tempType, title } = this.props;

        return (
            <div className="sheet-temp">
                <Modal
                    centered
                    title={title}
                    visible={visible}
                    width={lookOrCreate === 'add' ? '80%' : '60%'}
                    onCancel={onCancel}
                    footer={[
                        <div>
                            {lookOrCreate === 'look' && (
                                <Button key="back" onClick={onCancel}>
                                    关闭
                                </Button>
                            )}
                            {lookOrCreate !== 'look' && (
                                <div>
                                    {' '}
                                    <Button key="ok" type="primary" onClick={this.onOk}>
                                        确定
                                    </Button>
                                    <Button key="cancel" onClick={onCancel}>
                                        取消
                                    </Button>
                                </div>
                            )}
                        </div>
                    ]}
                >
                    <Form ref={this.formRef}>
                        {lookOrCreate === 'add' && (
                            <>
                                <Row gutter={16}>
                                    <Col span={3}>
                                        <Typography.Title style={{ fontSize: '12px', lineHeight: '24px' }} level={5}>
                                            模板列表:
                                        </Typography.Title>
                                    </Col>
                                    <Col span={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography.Title style={{ fontSize: '15px', lineHeight: '24px' }} level={5}>
                                            <Space size="small">
                                                <Tooltip title="新增">
                                                    <Icon onClick={this.newClick} type="iconxinjian1"></Icon>
                                                </Tooltip>
                                                <Tooltip title="编辑">
                                                    <Icon onClick={this.editItem} type="iconbianji1"></Icon>
                                                </Tooltip>
                                                {templateName && (
                                                    <Popconfirm title="确定删除该模板?" onConfirm={this.deleteItem}>
                                                        <Tooltip title="删除">
                                                            <Icon type="icontrash" style={{ fontSize: 19, display: 'flex', alignItems: 'center' }} />
                                                        </Tooltip>
                                                    </Popconfirm>
                                                )}
                                                {!templateName && (
                                                    <Tooltip title="删除" onClick={this.deleteMessage}>
                                                        <Icon type="icontrash" style={{ fontSize: 19, display: 'flex', alignItems: 'center' }} />
                                                    </Tooltip>
                                                )}
                                            </Space>
                                        </Typography.Title>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item
                                            name="templateName"
                                            label="模板名称"
                                            rules={[
                                                {
                                                    required: true
                                                    // message: '名称不能为空',
                                                },
                                                {
                                                    validator: (rule, value, callback) => {
                                                        // eslint-disable-next-line no-control-regex
                                                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                                        if (valueLength > 64) {
                                                            callback('总长度不能超过64位（1汉字=2位）');
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }
                                            ]}
                                        >
                                            <Input style={{ width: '15.5vw' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item
                                            name="templateDesc"
                                            label="模板描述："
                                            labelCol={{ span: 4 }}
                                            rules={[
                                                {
                                                    validator: (rule, value, callback) => {
                                                        // eslint-disable-next-line no-control-regex
                                                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                                        if (valueLength > 64) {
                                                            callback('总长度不能超过64位（1汉字=2位）');
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }
                                            ]}
                                        >
                                            <Input style={{ width: '28vw' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} className="sheet-left">
                                    <Col span={6}>
                                        <div className="left-list-container1">
                                            <div className="left-list-container-search">
                                                <Input
                                                    placeholder="请输入列表名称查询"
                                                    suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }}></Icon>}
                                                    style={{ width: '16.4vw', height: 28 }}
                                                    onChange={this.searchTempList}
                                                    value={templateFields}
                                                ></Input>
                                            </div>
                                            {sheetTemplateLists.length !== 0 && serachSmsList.length === 0 ? (
                                                <Table
                                                    bordered
                                                    className="left-list-container-table"
                                                    size="small"
                                                    showHeader={false}
                                                    rowClassName={this.setRowClassNames}
                                                    onRow={this.selectTempListRow}
                                                    columns={[
                                                        {
                                                            dataIndex: 'templateName',
                                                            title: '名称',
                                                            ellipsis: true
                                                        }
                                                    ]}
                                                    dataSource={sheetTemplateLists}
                                                    scroll={{ y: '44vh' }}
                                                    pagination={false}
                                                />
                                            ) : null}
                                            {(tempType === 'sms' || tempType === 'voice') && serachSmsList.length !== 0 ? (
                                                <Table
                                                    bordered
                                                    className="left-list-container-table"
                                                    size="small"
                                                    showHeader={false}
                                                    rowClassName={this.setRowClassNames}
                                                    onRow={this.selectTempListRow}
                                                    columns={[
                                                        {
                                                            dataIndex: 'templateName',
                                                            title: '名称',
                                                            ellipsis: true
                                                        }
                                                    ]}
                                                    dataSource={serachSmsList}
                                                    scroll={{ y: '44vh' }}
                                                    pagination={false}
                                                />
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col span={7} className="middle-sheet">
                                        <Row>
                                            <Col>
                                                <div style={{ marginLeft: '0.7vw' }}>
                                                    <span>字段列表：</span>
                                                </div>
                                            </Col>
                                            <Col span={17}>
                                                <div className="left-list-container1">
                                                    <div className="left-list-container-search">
                                                        <Input
                                                            placeholder="请输入字段名称查询"
                                                            suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }}></Icon>}
                                                            style={{ width: '14vw' }}
                                                            onChange={this.searchSheetFieldsList}
                                                            value={sheetFields}
                                                        ></Input>
                                                    </div>
                                                    {sheetFieldsList.length !== 0 ? (
                                                        <Table
                                                            size="small"
                                                            showHeader={false}
                                                            onRow={this.onClickRow}
                                                            scroll={{ y: '41vh' }}
                                                            dataSource={sheetFieldsList}
                                                            pagination={paging}
                                                            loading={loading}
                                                            onChange={this.pageChange}
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
                                                                        record.showAdd && (
                                                                            <Icon type="icondaoru-2" onClick={this.onAdd.bind(this, record)} />
                                                                        )
                                                                }
                                                            ]}
                                                        />
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={11}>
                                        <Row>
                                            <Col span={24}>
                                                {!(tempType === 'sms' || tempType === 'voice') && (
                                                    <Form.Item
                                                        name="sheetTitle"
                                                        label="工单标题"
                                                        labelCol={{ span: 4 }}
                                                        rules={[
                                                            { required: true, message: '工单标题不能为空' },
                                                            {
                                                                validator: async (rule, val, callback) => {
                                                                    this.validatorContent(val, callback, 'title');
                                                                }
                                                            }
                                                        ]}
                                                    >
                                                        <Input.TextArea
                                                            maxLength={200}
                                                            style={{ width: '28vw', height: 66 }}
                                                            onClick={this.changeTitleFoucs}
                                                        />
                                                    </Form.Item>
                                                )}
                                            </Col>
                                        </Row>
                                        <Row className="temp_content">
                                            <Col>
                                                <span style={{ marginLeft: '6vw' }}>(长度不超过600个字)</span>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    name="faultDesc"
                                                    label={tempType === 'sms' || tempType === 'voice' ? '模板内容' : '故障描述：'}
                                                    labelCol={{ span: 4 }}
                                                    rules={[
                                                        { required: true, message: '不能为空' },
                                                        {
                                                            validator: (rule, value, callback) => {
                                                                if (value.length > 600) {
                                                                    callback('长度不超过600个字');
                                                                } else {
                                                                    callback();
                                                                }
                                                            }
                                                        },
                                                        {
                                                            validator: async (rule, val, callback) => {
                                                                this.validatorContent(val, callback, 'desc');
                                                            }
                                                        }
                                                    ]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Input.TextArea
                                                        onClick={this.changeFaultFoucs}
                                                        maxLength={601}
                                                        style={{
                                                            minHeight: tempType === 'sms' || tempType === 'voice' ? '49vh' : '39vh',
                                                            maxHeight: tempType === 'sms' || tempType === 'voice' ? '49vh' : '39vh',
                                                            resize: 'none'
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {lookOrCreate === 'look' && (
                            <div className="temp_look">
                                <Row>
                                    <Col span={10}>
                                        <Form.Item label="模板名称：">
                                            <Input style={{ width: 200 }} disabled value={templateDetailLists.templateName} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={14}>
                                        <Form.Item label="模板描述：">
                                            <Input disabled value={templateDetailLists.templateDesc} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {!(tempType === 'sms' || tempType === 'voice') && (
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item label="工单标题：">
                                                <Input.TextArea style={{ height: 66 }} disabled value={templateDetailLists.orderTitleRule} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )}
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={tempType === 'sms' || tempType === 'voice' ? '模板内容' : '故障描述'}>
                                            <Input.TextArea
                                                style={{ height: 246 }}
                                                disabled
                                                value={templateDetailLists.orderContentRule || templateDetailLists.templateContent}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default withModel([useLoginInfoModel, usePageInfoModel], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1]
}))(Index);
