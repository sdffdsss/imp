/* eslint-disable no-self-assign */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Form, Button, Input, Message, Collapse, Layout, Space, Icon, Select, Row, Col, Switch, Card, Table, Radio } from 'oss-ui';

import useLoginInfoModel from '@Src/hox';

import request from '@Common/api';
import formatReg from '@Common/formatReg';
import PageContainer from '@Src/components/page-container';
import CustomModalFooter from '@Components/custom-modal-footer';
import shareActions from '@Src/share/actions';

import { getViewInfoForEdit, addSearchFormDiy, delSearchFormDiy, updateSearchFormDiy } from '../common/adaper/adapter_searchForm';
import BoderNav from './border-nav';
import ConditionSetting from './condition-setting';
import FilterSelect from './filter-select';
import FilterShow from './filter-show';
import QueryColumn from './query-column';
import './index.less';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
let columnTemplateId = null;
let creatorId = null;
const SortDrag = (props) => {
    const refInput = useRef();
    const refForm = useRef();
    const [tabName, setTabName] = useState('');
    const [title, setTitle] = useState('业务查询');
    // const [allOptions, setAllOptions] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);
    const [thisId, setThisId] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [periodDisabled, setPeriodDisabled] = useState(false);
    const [period, setPeriod] = useState([]);
    const frameInfo = useLoginInfoModel();
    creatorId = frameInfo.userId;
    const [formInitialValues, setFormInitialValues] = useState({ creatorName: frameInfo.userName, filterType: 'MY' });
    const [downColumns, setDownColumns] = useState([]);
    const [downDataSource, setDownDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // const [filter, setFilter] = useState(null);
    const [searchType, onSearchTypeChange] = useState(0);
    const [selectConditions, setSelectConditions] = useState([]);
    const [editData, setEditData] = useState(null);
    const [settingForm] = Form.useForm();
    // useEffect(() => {
    //     if (!searchType) {
    //         setSelectOptions([]);
    //     }
    // }, [searchType]);

    useEffect(() => {
        if (props.menuOption === 'down') {
            setDownColumns([
                {
                    title: '文件名',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record, index) => {
                        return (
                            <Button
                                type="link"
                                onClick={() => {
                                    handleDown(index);
                                }}
                            >
                                {text}
                            </Button>
                        );
                    }
                }
            ]);
            const _dataSource = [];
            for (let i = 0; i < 50; i++) {
                _dataSource.push({ name: `文件名${new Date().getTime()}.xlxs`, key: i });
            }
            setDownDataSource(_dataSource);
        }
        if (!['del', 'down'].includes(props.menuOption) && props.visibleSortDrag) {
            // const { allOptions } = props;
            // setAllOptions(allOptions);
            // 默认展示条件: 时间范围
            if (props.menuOption === 'add') {
                setTitle('业务查询新增');
                setPeriodDisabled(true);
                creatorId = frameInfo.userId;
                // setSelectOptions(allOptions.slice(0, 1));
            } else if (props.menuOption === 'edit') {
                setTitle('业务查询编辑');
                // setTabName(props.menuName);
                props.viewId &&
                    getViewInfoForEdit(props.viewId).then((editData) => {
                        // creatorId = editData.creator;
                        settingForm.setFieldsValue(editData);
                        setEditData(editData);
                        // setSelectConditions(editData.fieldList);
                    });
                // const selectedMenu = getViewInfoForEdit(viewId)?.find((item) => {
                //     return item.tab === props.menuName;
                // });
                setThisId(props.viewId);
                // const selected = allOptions.filter((otp) => {
                //     let selectOption = selectedMenu.columns.find((sel) => {
                //         return sel.dataIndex === otp.field;
                //     });
                //     return selectOption;
                // });
                // setSelectOptions(selected);
            } else if (props.menuOption === 'conf') {
                setSelectOptions(props.selectOptions);
            }
        }
    }, [frameInfo.userId, handleDown, props.menuOption, props.selectOptions, props.viewId, props.visibleSortDrag, settingForm]);

    const onTabChange = (e) => {
        setTabName(e.target.value);
    };
    const handleCancel = () => {
        setTabName('');
        // setAllOptions([]);
        setSelectOptions([]);
        props.onCancel();
    };
    const handleOk = (type) => {
        refForm.current.validateFields(['viewName', 'viewDesc', 'creatorName', 'parentFilterId']).then((values) => {
            setLoading(true);
            const { viewName, viewDesc, creatorName, parentFilterId, isExport = 0 } = values;
            const fieldList = selectOptions.map(({ field: dataIndex, name, dataType, defaultValue = null, enumName }, index) => ({
                filedAlias: name,
                fieldName: dataIndex,
                orderField: index + 2
            }));
            const timeOption = fieldList.find(({ fieldName }) => {
                return fieldName === 'event_time';
            });
            const alarmOriginOption = fieldList.find(({ fieldName }) => {
                return fieldName === 'alarm_origin';
            });
            // 检查已选项强制在数组头部添加关联查询
            if (!alarmOriginOption) {
                fieldList.unshift({ filedAlias: '关联查询', fieldName: 'alarm_origin', orderField: 1 });
            }
            // 检查已选项强制在数组头部添加时间范围
            if (!timeOption) {
                fieldList.unshift({ filedAlias: '告警发生时间', fieldName: 'event_time', orderField: 0 });
            }
            if (props.menuOption === 'add' || type === 'save') {
                // dataType: "enum"
                // enumName: "enum_id"
                // field: "enum_id"
                // id: 2
                // name: "枚举类型条件"
                addSearchFormDiy({
                    creator: creatorId,
                    viewName,
                    viewDesc,
                    fieldList,
                    parentFilterId,
                    columnTemplateId,
                    isExport,
                    modelId: 2
                })
                    .then((msg) => {
                        Message.success('保存成功！');
                        props.getInitConfig(1);
                        handleCancel();
                    })
                    .catch((msg) => {
                        Message.warning('内部错误，请联系管理员！');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else if (props.menuOption === 'edit') {
                updateSearchFormDiy({
                    creator: editData.creator,
                    fieldList,
                    viewId: editData.viewId,
                    viewName,
                    viewDesc,
                    parentFilterId,
                    columnTemplateId,
                    isExport,
                    modelId: 2
                })
                    .then((msg) => {
                        Message.success('修改成功！');
                        props.getInitConfig(1);
                        handleCancel();
                    })
                    .catch((msg) => {
                        Message.warning('内部错误，请联系管理员！');
                        // Message.warning(msg);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else if (props.menuOption === 'conf') {
                props.searchFormSet(selectOptions);
                setLoading(false);
                handleCancel();
            }
        });
    };
    const handleDel = () => {
        delSearchFormDiy(props.viewId, frameInfo.userId)
            .then((response) => {
                const { code, data, message } = response;
                if (code === 0) {
                    Message.success('删除成功！');
                } else {
                    Message.warning(message);
                }
                props.onCancel();
                props.getInitConfig(1);
            })
            .catch((response) => {
                // Message.warning('服务内部错误，请联系管理员！');
                props.onCancel();
                props.getInitConfig(1);
            });
    };
    const setSelectChange = (selected) => {
        setSelectOptions(selected);
    };
    useEffect(() => {
        refForm?.current?.validateFields(['exportPeriod']);
    }, [periodDisabled]);

    const exportChange = (checked) => {
        setPeriodDisabled(!checked);
        !checked && setPeriod(null);
    };
    const periodChange = (value) => {
        // setPeriod(value);
    };
    const handleDown = useCallback((key) => {
        if (key !== undefined) {
            alert(key);
        } else {
            alert(selectedRowKeys);
        }

        // delSearchFormDiy(props.menuName)
        //     .then((msg) => {
        //         Message.success(msg);
        //         props.onCancel();
        //         props.getInitConfig(1);
        //     })
        //     .catch((msg) => {
        //         Message.warning(msg);
        //         props.onCancel();
        //         props.getInitConfig(1);
        //     });
    });
    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };
    const [filterExpand, setFilterExpand] = useState(false);
    // const [filterAddVisible, setFilterAddVisible] = useState(false);
    // const filterLookChange = (expand) => {
    //     setFilterExpand(expand);
    // };
    const setFilterAddVisible = () => {
        const { actions, messageTypes } = shareActions;
        actions.postMessage(messageTypes.openRoute, {
            entry: '/alarm/setting/filter/new/1/new/list/close-tab'
        });
    };
    return (
        // 'del', 'edit' ,'add'
        <>
            {!['del', 'down'].includes(props.menuOption) && (
                <PageContainer
                    gridContentStyle={{ height: `calc(100% - 68px)` }}
                    title={
                        <div className="volume-title">
                            <span className="volume-form-box"></span>
                            <span>
                                <Space>
                                    <Icon
                                        antdIcon={true}
                                        type={props.menuOption === 'add' ? 'FileAddOutlined' : 'EditOutlined'}
                                        style={{ fontSize: '20px' }}
                                    />
                                    {title}
                                </Space>
                            </span>
                        </div>
                    }
                >
                    <Card className="alarm-columns-sort-drag">
                        <Row className="alarm-columns-sort-drag-content">
                            <Col span={24}>
                                {/* <Layout className="alarm-columns-sort-drag">
                                    <Content> */}
                                <Form
                                    ref={refForm}
                                    form={settingForm}
                                    initialValues={formInitialValues}
                                    labelAlign="right"
                                    labelCol={{ span: 6 }}
                                    className="alarm-columns-sort-drag-form-1"
                                >
                                    <BoderNav navTabs={['基本信息', '查询过滤条件', '二次查询字段', '查询列模板']}>
                                        <>
                                            <Row>
                                                {props.menuOption !== 'conf' && [
                                                    <Col span={12}>
                                                        <Form.Item
                                                            label="业务查询名称"
                                                            labelCol={{ span: 6 }}
                                                            name="viewName"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '业务查询名称不可为空!'
                                                                },
                                                                { pattern: formatReg.noEmpety, message: '不可为空格' },
                                                                {
                                                                    pattern: formatReg.nameIuput,
                                                                    message:
                                                                        '只包含汉字、数字、字母、下划线、中划线，且不能以下划线、中划线开头和结尾'
                                                                },
                                                                { max: 20, type: 'string', message: '名字长度不能超过20字' }
                                                            ]}
                                                        >
                                                            <Input ref={refInput} value={tabName} onChange={onTabChange} placeholder="" />
                                                        </Form.Item>
                                                    </Col>,
                                                    <Col span={12}>
                                                        <Form.Item label="创建人" name="creatorName">
                                                            <Select disabled={true} />
                                                        </Form.Item>
                                                    </Col>
                                                ]}
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Form.Item
                                                        labelCol={{ span: 3 }}
                                                        label="描述"
                                                        name="viewDesc"
                                                        rules={[{ max: 50, type: 'string', message: '描述长度不能超过100字' }]}
                                                    >
                                                        <Input.TextArea style={{ resize: 'none' }} maxLength={50} showCount={true} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </>
                                        <>
                                            <Row gutter={10}>
                                                <FilterSelect
                                                    menuOption={props.menuOption}
                                                    editData={editData}
                                                    setFilterExpand={setFilterExpand}
                                                    settingForm={settingForm}
                                                ></FilterSelect>
                                                <Col span={4}>
                                                    <Form.Item
                                                        // label=""
                                                        // labelAlign="right"
                                                        labelCol={{ span: 23 }}
                                                        name="filterLook"
                                                    >
                                                        <Button
                                                            onClick={() =>
                                                                settingForm.getFieldValue('parentFilterId') !== null &&
                                                                settingForm.getFieldValue('parentFilterId') !== undefined
                                                                    ? setFilterExpand(!filterExpand)
                                                                    : ''
                                                            }
                                                        >
                                                            过滤器条件查看
                                                            <Icon
                                                                antdIcon={true}
                                                                type={filterExpand ? 'CaretUpOutlined' : 'CaretDownOutlined'}
                                                                // style={{ fontSize: '20px' }}
                                                            />
                                                        </Button>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item name="filterAdd">
                                                        <Button onClick={() => setFilterAddVisible()}>
                                                            过滤器新建
                                                            <Icon antdIcon={true} type={'PlusOutlined'} />
                                                        </Button>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {filterExpand &&
                                                settingForm.getFieldValue('parentFilterId') !== null &&
                                                settingForm.getFieldValue('parentFilterId') !== undefined && (
                                                    <Row>
                                                        <Col span={3}></Col>
                                                        <Col span={21}>
                                                            <FilterShow filter={settingForm.getFieldValue('parentFilterId')}></FilterShow>
                                                        </Col>
                                                    </Row>
                                                )}
                                        </>
                                        <ConditionSetting
                                            menuOption={props.menuOption}
                                            selectConditions={editData?.fieldList ?? null}
                                            onSelectChange={setSelectChange}
                                        ></ConditionSetting>

                                        {props.menuOption === 'edit' && editData && (
                                            <QueryColumn
                                                key="QueryColumnEdit"
                                                templateChange={(Id) => {
                                                    columnTemplateId = Id;
                                                }}
                                                columnTemplateId={editData?.columnTemplateId ?? null}
                                            ></QueryColumn>
                                        )}
                                        {props.menuOption !== 'edit' && (
                                            <QueryColumn
                                                key="QueryColumnAdd"
                                                templateChange={(Id) => {
                                                    columnTemplateId = Id;
                                                }}
                                            ></QueryColumn>
                                        )}
                                        {/* todo 定时导出需求目前没明确 暂时注释 
                                    <Row> 
                                        <Col sm={6} md={4}>
                                            <Form.Item label="定时导出" labelCol={{ span: 12 }} name="exportFlag">
                                                <Switch onChange={exportChange} checkedChildren="开启" unCheckedChildren="关闭" />
                                            </Form.Item>
                                        </Col>
                                        <Col sm={6} md={4}>
                                            <Form.Item
                                                label="时间粒度"
                                                labelCol={{ sm: 12 }}
                                                name="exportPeriod"
                                                rules={[{ required: !periodDisabled, message: '时间粒度不可为空!' }]}
                                            >
                                                <Select value={period} disabled={periodDisabled} onChange={periodChange}>
                                                    <Option value="day">日</Option>
                                                    <Option value="week">周</Option>
                                                    <Option value="month">月</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row> */}
                                    </BoderNav>
                                </Form>

                                {/* </Form.Item> */}
                                {props.menuOption === 'conf' && (
                                    // <Form.Item>
                                    <Collapse ghost>
                                        <Collapse.Panel header="业务查询另存为" key="1">
                                            <Input
                                                value={tabName}
                                                onChange={onTabChange}
                                                placeholder="业务查询名称"
                                                addonAfter={
                                                    <Button
                                                        onClick={() => {
                                                            handleOk('save');
                                                        }}
                                                    >
                                                        保存
                                                    </Button>
                                                }
                                            />
                                        </Collapse.Panel>
                                    </Collapse>
                                    // </Form.Item>
                                )}
                            </Col>
                        </Row>
                        <Row style={{ padding: '16px 0' }}>
                            <Col span={24}>
                                <div style={{ textAlign: 'center' }}>
                                    <Space>
                                        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                                            保存
                                        </Button>
                                        <Button key="back" onClick={handleCancel}>
                                            取消
                                        </Button>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </PageContainer>
            )}
            {props.menuOption === 'del' && (
                <Modal
                    title="提示"
                    visible={props.visibleSortDrag}
                    // onOk={this.ModalHandleOk}
                    onCancel={props.onCancel}
                    // className="alarm-query-form-sort-drag-modal-del"
                    footer={<CustomModalFooter onCancel={props.onCancel} onOk={handleDel} />}
                    // destroyOnClose={true}
                    maskClosable={false}
                    getContainer={frameInfo.container}
                >
                    <p>删除后数据不可恢复，确定删除？</p>
                </Modal>
            )}
            {props.menuOption === 'down' && (
                <Modal
                    title="下载列表"
                    visible={props.visibleSortDrag}
                    // onOk={this.ModalHandleOk}
                    onCancel={props.onCancel}
                    // className="alarm-query-form-sort-drag-modal-del"
                    footer={<CustomModalFooter onCancel={props.onCancel} okText="下载" onOk={handleDown} />}
                    // destroyOnClose={true}
                    maskClosable={false}
                    getContainer={frameInfo.container}
                >
                    <Table
                        rowSelection={rowSelection}
                        columns={downColumns}
                        dataSource={downDataSource}
                        size="small"
                        pagination={{ responsive: true, showSizeChanger: false }}
                    ></Table>
                </Modal>
            )}
        </>
    );
};
export default SortDrag;
