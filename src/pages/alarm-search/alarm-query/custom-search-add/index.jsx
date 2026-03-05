import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Input, Space, Icon, Select, Row, Col, Card, message, ColumnsSortDrag, Modal, Table } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import columnInfoModel from '../common/hox';
import PageContainer from '@Src/components/page-container';
import './index.less';
import shareActions from '@Src/share/actions';
import formatReg from '@Common/formatReg';
import SectionTitle from '@Src/components/filter-info-section-title';
import Enums from '@Common/enum';
import { getFilterByType, getDefaultSelectOptions, onOkCustomSearch, getRulesDetails } from '../common/api';
import FilterShow from './filter-show';
import { _ } from 'oss-web-toolkits';

const CustomSearch = (props) => {
    const { title, onCancel, getCustomSearchMenu, customDetail, addOrEdit, colTempleteDatas, colTempFields, selectColTemp, getColTData } = props;
    const login = useLoginInfoModel();
    const info = columnInfoModel();
    const myRef = useRef();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [initialValues, setInitialValues] = useState({
        creatorName: login.userName,
        filterType: 'MY',
        columnTemplateId: colTempleteDatas[0] && String(colTempleteDatas[0].templateId),
    });
    const [filterLists, setFilterLists] = useState([]);
    const [ruleDatas, setRuleDatas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [filterExpand, setFilterExpand] = useState(false);
    const [allOptions, setAllOptions] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);
    const [colTempModalShow, setColTempModalShow] = useState(false);

    // 跳转至列模板管理页面
    const gotoColTemplate = () => {
        const { actions, messageTypes } = shareActions;
        actions.postMessage(messageTypes.openRoute, {
            entry: '/alarm/setting/views/col-template',
        });
    };

    // 跳转至过滤器新建页面
    const gotoFilterNew = () => {
        const { actions, messageTypes } = shareActions;
        actions.postMessage(messageTypes.openRoute, {
            entry: '/alarm/alarm-rule-manage/rule-manage-new/1/list',
        });
    };

    // 获取“规则组”列表
    const getFilterLists = () => {
        const filterList = [];
        Enums.rulesMap.forEach((item) => {
            filterList.push({ value: item.moduleId, label: item.name });
        });
        setFilterLists(filterList);
    };

    // 获取规则全量数据
    const getAllRulesData = async (moduleId, type) => {
        const { userId } = login;
        const ruleDataList = [];
        const mineData = [];
        const othersData = [];
        setRuleDatas([]);
        const res = await getFilterByType(userId, moduleId);
        if (res && res.data) {
            res.data.forEach((item) => {
                ruleDataList.push({ value: item.filterId, label: item.filterName });
            });
            res.data
                .filter((item) => String(item.creatorId) === userId)
                .forEach((mine) => {
                    mineData.push({ value: mine.filterId, label: mine.filterName });
                });
            res.data
                .filter((item) => String(item.creatorId) !== userId)
                .forEach((other) => {
                    othersData.push({ value: other.filterId, label: other.filterName });
                });
            if (type === 'my') {
                setRuleDatas(mineData);
            } else if (type === 'other') {
                setRuleDatas(othersData);
            } else if (type === 'all') {
                setRuleDatas(ruleDataList);
            }
        } else {
            setRuleDatas([]);
        }
    };
    // 规则类型change
    const ruleTypeChange = async (value) => {
        if (myRef.current.getFieldValue('rules')) {
            if (value === '1') {
                getAllRulesData(myRef.current.getFieldValue('rules'), 'my');
            } else if (value === '2') {
                getAllRulesData(myRef.current.getFieldValue('rules'), 'other');
            } else {
                getAllRulesData(myRef.current.getFieldValue('rules'), 'all');
            }
        }
    };

    // 规则组change
    const fiterSelect = async (type) => {
        if (type) {
            if (myRef.current.getFieldValue('ruleType')) {
                if (myRef.current.getFieldValue('ruleType') === '1') {
                    getAllRulesData(type, 'my');
                } else if (myRef.current.getFieldValue('ruleType') === '2') {
                    getAllRulesData(type, 'other');
                } else {
                    getAllRulesData(type, 'all');
                }
            } else {
                getAllRulesData(type, 'all');
            }
        } else {
            setRuleDatas([]);
        }
    };

    // 刷新规则数据列表
    const reloadRuleDatas = async (type) => {
        if (type) {
            setLoading(true);
            const res = await getFilterByType(login.userId, type);
            setLoading(false);
            const ruleDataList = [];
            if (res && res.data) {
                setFilterExpand(false);
                myRef.current.setFieldsValue({ parentFilterId: '' });
                res.data.forEach((item) => {
                    ruleDataList.push({ value: item.filterId, label: item.filterName });
                });
                setRuleDatas(ruleDataList);
            } else {
                setRuleDatas([]);
            }
        }
    };

    // 获取二次查询字段的全量数据
    const getOptionsDatas = async () => {
        setAllOptions(props.allColumns);
    };

    // 获取二次查询字段默认已选字段

    const getDefaultSelectFields = async () => {
        const defaultSelectOptionDatas = [];
        const defaultOptionsRes = await getDefaultSelectOptions();
        if (defaultOptionsRes && defaultOptionsRes.data) {
            defaultOptionsRes.data.forEach((item, index) => {
                const optionItem = {
                    id: index + 3,
                    name: item.filedAlias,
                    field: item.fieldName,
                    orderField: 1,
                };
                defaultSelectOptionDatas.push(optionItem);
            });
            // if (!_.find(defaultSelectOptionDatas, (item) => item.field === 'alarm_origin')) {
            //     defaultSelectOptionDatas.push({ name: '关联告警标志', field: 'alarm_origin', id: 1, orderField: 1 });
            // }
            // if (!_.find(defaultSelectOptionDatas, (item) => item.field === 'event_time')) {
            //     defaultSelectOptionDatas.push({ name: '告警发生时间', field: 'event_time', id: 2, orderField: 1 });
            // }
            setSelectOptions(defaultSelectOptionDatas);
        }
    };

    // 刷新列模板数据
    const reloadColtempDatas = async (userId, userName) => {
        setLoading1(true);
        getColTData(userId, userName);
        setTimeout(() => {
            setLoading1(false);
        }, 500);
    };

    // 选择列模板 获取对应的列数据
    const selectCustomColTemp = (value, datas, type) => {
        selectColTemp(value, datas, type);
    };

    // 保存
    const onOk = () => {
        const fieldList = [];
        if (!_.find(selectOptions, (item) => item.field === 'alarm_origin') || !_.find(selectOptions, (item) => item.field === 'event_time')) {
            // message.warning('【关联告警标志(alarm_origin)和告警发生时间(event_time)】为必选二次查询字段');
            // return;
            fieldList.push({
                fieldName: 'alarm_origin',
                filedAlias: '关联查询',
                orderField: 1,
            });
            fieldList.push({
                fieldName: 'event_time',
                filedAlias: '告警发生时间',
                orderField: 1,
            });
        }
        const formInstance = myRef.current.getFieldsValue();
        selectOptions.forEach((item) => {
            fieldList.push({
                fieldName: item.field,
                filedAlias: item.name,
                orderField: 1,
            });
        });
        const data = {
            creator: login.userId,
            columnTemplateId: formInstance.columnTemplateId && Number(formInstance.columnTemplateId),
            isExport: 0,
            modelId: 2,
            parentFilterId: formInstance.parentFilterId && Number(formInstance.parentFilterId),
            viewDesc: formInstance.viewDesc,
            viewName: formInstance.viewName,
            fieldList,
        };
        if (addOrEdit === 'edit') {
            data.viewId = customDetail.viewId;
        }
        myRef.current.validateFields().then(async () => {
            const res = await onOkCustomSearch(data, addOrEdit);
            if (res && res.data) {
                message.success('保存成功');
                onCancel();
                getCustomSearchMenu();
                info.setStatus('refresh');
            }
        });
    };

    // 编辑时数据回填
    const getDeatailInfo = async () => {
        myRef.current.setFieldsValue({
            ...customDetail,
            parentFilterId: customDetail.parentFilterId && String(customDetail.parentFilterId),
            columnTemplateId: customDetail.columnTemplateId && String(customDetail.columnTemplateId),
            rules: customDetail.moduleId && String(customDetail.moduleId),
        });

        if (customDetail.moduleId) {
            fiterSelect(customDetail.moduleId);
        }
        if (customDetail.moduleId && customDetail.parentFilterId) {
            const res = await getRulesDetails(customDetail.moduleId, customDetail.parentFilterId);
            if (res && res.data) {
                if (String(res.data.creatorId) === login.userId) {
                    ruleTypeChange('1');
                    myRef.current.setFieldsValue({
                        ruleType: '1',
                    });
                } else {
                    ruleTypeChange('2');
                    myRef.current.setFieldsValue({
                        ruleType: '2',
                    });
                }
            }
        }
        const fieldList = [];
        setAllOptions(props.allColumns);
        if (customDetail.fieldList) {
            customDetail.fieldList.forEach((item, index) => {
                fieldList.push({
                    id: index + 1,
                    name: item.filedAlias,
                    field: item.fieldName,
                    orderField: 1,
                });
            });
            setSelectOptions(fieldList);
        }
    };
    useEffect(() => {
        getFilterLists();
        selectCustomColTemp(colTempleteDatas[0] && String(colTempleteDatas[0].templateId), null, 'customTemp');
        if (addOrEdit !== 'edit') {
            getDefaultSelectFields();
            getOptionsDatas();
        }
        if (addOrEdit === 'edit' && customDetail) {
            getDeatailInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Enums, customDetail]);

    return (
        <div className="alarm-search-custom-search" id="selectParent">
            <PageContainer
                gridContentStyle={{ height: `calc(100% - 68px)` }}
                title={
                    <div className="volume-title">
                        <span className="volume-form-box"></span>
                        <span>
                            <Space>
                                <Icon antdIcon={true} type="FileAddOutlined" style={{ fontSize: '20px' }} />
                                {title}
                            </Space>
                        </span>
                    </div>
                }
            >
                <Card className="alarm-columns-sort-drag">
                    <Row className="alarm-columns-sort-drag-content">
                        <Col span={24}>
                            <Form
                                ref={myRef}
                                labelAlign="right"
                                initialValues={initialValues}
                                labelCol={{ span: 6 }}
                                className="alarm-columns-sort-drag-form-1"
                            >
                                <Card size="small" bordered={false} title={<SectionTitle index={1} content={'基本信息'} />}>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label="业务查询名称"
                                                labelCol={{ span: 4 }}
                                                name="viewName"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '业务查询名称不可为空!',
                                                    },
                                                    { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                    {
                                                        pattern: formatReg.nameIuput,
                                                        message: '只包含汉字、数字、字母、下划线、中划线，且不能以下划线、中划线开头和结尾',
                                                    },
                                                    { max: 20, type: 'string', message: '名字长度不能超过20字' },
                                                ]}
                                            >
                                                <Input placeholder="" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item labelCol={{ span: 4 }} label="创建人" name="creatorName">
                                                <Input disabled={true} />
                                            </Form.Item>
                                        </Col>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    labelCol={{ span: 2 }}
                                                    label="描述"
                                                    name="viewDesc"
                                                    rules={[{ max: 50, type: 'string', message: '描述长度不能超过100字' }]}
                                                >
                                                    <Input.TextArea style={{ resize: 'none' }} maxLength={50} showCount={true} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Row>
                                </Card>
                                <Card size="small" bordered={false} title={<SectionTitle index={2} content={'查询过滤条件'} />}>
                                    <Row gutter={10}>
                                        <Col span={6}>
                                            <Form.Item labelCol={{ span: 8 }} label="过滤器类型" style={{ marginLeft: '0.3vw' }} name="rules">
                                                <Select
                                                    showSearch
                                                    placeholder="请选择"
                                                    allowClear
                                                    optionFilterProp="children"
                                                    onChange={() => {
                                                        fiterSelect(myRef.current.getFieldsValue().rules);
                                                        setFilterExpand(false);
                                                        myRef.current.setFieldsValue({ parentFilterId: null });
                                                    }}
                                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                >
                                                    {filterLists.map((item) => {
                                                        return <Select.Option key={item.value}>{item.label}</Select.Option>;
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item labelCol={{ span: 8 }} label="过滤方式" style={{ marginLeft: '0.3vw' }} name="ruleType">
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    placeholder="请选择"
                                                    optionFilterProp="children"
                                                    onChange={(value) => {
                                                        ruleTypeChange(value);
                                                        setFilterExpand(false);
                                                        myRef.current.setFieldsValue({ parentFilterId: null });
                                                    }}
                                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                >
                                                    {Enums.filterType.map((item) => {
                                                        return <Select.Option key={item.value}>{item.label}</Select.Option>;
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item labelCol={{ span: 6 }} name="parentFilterId" label="过滤器名称">
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    placeholder="请选择"
                                                    optionFilterProp="children"
                                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                    onChange={() => {
                                                        setFilterExpand(false);
                                                    }}
                                                    style={{ width: '15vw' }}
                                                >
                                                    {ruleDatas.map((item) => {
                                                        return <Select.Option key={item.value}>{item.label}</Select.Option>;
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}>
                                            <Button
                                                title="刷新"
                                                loading={loading}
                                                icon={
                                                    <Icon
                                                        antdIcon={true}
                                                        type={'RedoOutlined'}
                                                        onClick={() => {
                                                            reloadRuleDatas(myRef.current.getFieldsValue().rules);
                                                        }}
                                                    />
                                                }
                                            ></Button>
                                        </Col>
                                        <Col span={3}>
                                            <Button
                                                onClick={() =>
                                                    myRef.current.getFieldValue('parentFilterId')
                                                        ? setFilterExpand(!filterExpand)
                                                        : message.warning('请选择规则后查看')
                                                }
                                            >
                                                条件查看
                                                <Icon antdIcon={true} type={filterExpand ? 'CaretUpOutlined' : 'CaretDownOutlined'} />
                                            </Button>
                                        </Col>
                                        <Col span={3}>
                                            <Button
                                                onClick={() => {
                                                    gotoFilterNew();
                                                }}
                                                style={{ marginLeft: '-1.4vw' }}
                                            >
                                                新建
                                                <Icon antdIcon={true} type={'PlusOutlined'} />
                                            </Button>
                                        </Col>
                                        {filterExpand && myRef.current.getFieldValue('parentFilterId') && (
                                            <Row>
                                                <Col span={21} style={{ marginLeft: '7.6vw', marginBottom: '2vh' }}>
                                                    <FilterShow
                                                        filterId={myRef.current.getFieldValue('parentFilterId')}
                                                        moduleId={myRef.current.getFieldValue('filterType')}
                                                    ></FilterShow>
                                                </Col>
                                            </Row>
                                        )}
                                    </Row>
                                </Card>
                                <Card size="small" bordered={false} title={<SectionTitle index={3} content={'二次查询字段'} />}>
                                    <div style={{ color: 'red', margin: '10px 3vw 0' }}>
                                        提示：关联查询方式和告警发生时间为系统内置条件字段，无需设置!
                                    </div>
                                    <Row gutter={10}>
                                        <Col span={23} style={{ marginLeft: '3vw', marginBottom: '2vh' }}>
                                            <ColumnsSortDrag
                                                allOptionsList={allOptions}
                                                selectOptionsList={selectOptions}
                                                onChange={(value) => {
                                                    setSelectOptions(_.uniqBy(value, 'field'));
                                                }}
                                                allOptionsLabel="所有查询字段"
                                                selectOptionsLabel="已选查询字段"
                                                columns={[
                                                    {
                                                        key: 'name',
                                                        title: '名称',
                                                        width: 150,
                                                    },
                                                    {
                                                        key: 'field',
                                                        title: '字段',
                                                        width: 150,
                                                    },
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                                <Card size="small" bordered={false} title={<SectionTitle index={4} content={'查询列模板'} />}>
                                    <Row gutter={10}>
                                        <Col span={8} style={{ marginLeft: '0.3vw' }}>
                                            <Form.Item name="columnTemplateId" label="选择列模板" labelCol={{ span: 6 }}>
                                                <Select
                                                    showSearch
                                                    placeholder="请选择"
                                                    optionFilterProp="children"
                                                    onChange={(value) => {
                                                        selectCustomColTemp(value, null, 'customTemp');
                                                    }}
                                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                >
                                                    {colTempleteDatas.map((item) => {
                                                        return <Select.Option key={item.templateId}>{item.templateName}</Select.Option>;
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}>
                                            <Button
                                                title="刷新"
                                                loading={loading1}
                                                icon={
                                                    <Icon
                                                        antdIcon={true}
                                                        type={'RedoOutlined'}
                                                        onClick={() => {
                                                            reloadColtempDatas(login.userId, login.userName);
                                                        }}
                                                    />
                                                }
                                            ></Button>
                                        </Col>
                                        <Col span={2}>
                                            <Button
                                                icon={<Icon antdIcon={true} type={'SearchOutlined'} />}
                                                onClick={() => {
                                                    setColTempModalShow(true);
                                                }}
                                            >
                                                {' '}
                                                列模板查看
                                            </Button>
                                        </Col>
                                        <Modal
                                            title="列模板查看"
                                            width="50%"
                                            visible={colTempModalShow}
                                            onCancel={() => {
                                                setColTempModalShow(false);
                                            }}
                                            footer={[
                                                <div>
                                                    <Button
                                                        key="closeColTemp"
                                                        type="primary"
                                                        onClick={() => {
                                                            setColTempModalShow(false);
                                                        }}
                                                    >
                                                        关闭
                                                    </Button>
                                                </div>,
                                            ]}
                                        >
                                            <Table
                                                columns={[
                                                    {
                                                        dataIndex: 'number',
                                                        title: '序号',
                                                        width: 100,
                                                        align: 'center',
                                                    },
                                                    {
                                                        dataIndex: 'name',
                                                        title: '名称',
                                                        width: 100,
                                                        ellipsis: true,
                                                        align: 'center',
                                                    },
                                                    {
                                                        dataIndex: 'dataIndex',
                                                        title: '字段',
                                                        width: 100,
                                                        ellipsis: true,
                                                        align: 'center',
                                                    },
                                                ]}
                                                bordered
                                                dataSource={colTempFields}
                                                size="small"
                                                pagination={false}
                                                scroll={{ y: 350 }}
                                            ></Table>
                                        </Modal>
                                        <Col span={3}>
                                            <Button
                                                icon={<Icon antdIcon={true} type={'CalendarOutlined'} />}
                                                onClick={() => {
                                                    gotoColTemplate();
                                                }}
                                            >
                                                列模板管理
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Form>
                        </Col>
                    </Row>
                    <Row style={{ padding: '16px 0' }}>
                        <Col span={24}>
                            <div style={{ textAlign: 'center' }}>
                                <Space>
                                    <Button
                                        key="submit"
                                        type="primary"
                                        onClick={() => {
                                            onOk();
                                        }}
                                    >
                                        保存
                                    </Button>
                                    <Button
                                        key="back"
                                        onClick={() => {
                                            onCancel();
                                        }}
                                    >
                                        取消
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </PageContainer>
        </div>
    );
};
export default CustomSearch;
