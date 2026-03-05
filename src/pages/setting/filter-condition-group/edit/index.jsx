/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable no-empty */
import React, { useEffect, useState, useRef } from 'react';
import { Form, Switch, Input, Divider, DatePicker, Checkbox, Row, Col, message, Spin, Select, ProTable, Button, Modal, Icon } from 'oss-ui';
import formatReg from '@Common/formatReg';
import SelectCondition from '../components/comp-select';
import SelectConditionAll from '../components/comp-select-all';
import { getGroupDictDataByType, addGroups, updateGroups, searchGroupFields, searchSpecificNeIds } from '../utils/api';
import ConditionselectComp from './negroup/neSelect';
import produce from 'immer';
import { _ } from 'oss-web-toolkits';
import SelectComp from '../components/edit-select';
import moment from 'moment';
import CustomModalFooter from '@Components/custom-modal-footer';

import './index.less';

/**
 * 新增/修改界面
 * @param {true/false} editState 编辑状态  true 编辑  false 新建
 * @param {*} editRow  界面初始值
 * @param {*} enumObj 表单枚举数
 */
const EditComp = (props) => {
    /*
     * 新增/修改界面
     * editState 编辑状态  true 编辑  false 新建
     * editRow  界面初始值
     * enumObj 表单枚举数
     */
    const { editStatus, userInfo, addGroupNetWorkType, addGroupName, editRow, groupType, onProvinceChange, cityList, initialProvince } = props;
    const [neColumns, setNeColumns] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedDelRowKeys, setSelectedDelRowKeys] = useState([]);
    const [addNemodalVisible, setAddNeModalVisible] = useState(false);
    const [addNeList, setAddNeList] = useState([]);
    const [delNeList, setDelNeList] = useState([]);
    const [addNeLoading, setAddNeLoading] = useState(false);
    const [neName, setNeName] = useState(false);

    const groupNeRef = useRef();
    const formRef = useRef();

    /**
     * @description: 关闭修改网元组弹窗
     * @param {*}
     * @return {*}
     */
    const closeEditModal = () => {
        props.closeModal();
    };

    const groupNetWorkType = editStatus === 1 ? editRow.groupNetWorkType : addGroupNetWorkType;
    const groupTypeName = editStatus === 1 ? editRow.groupNetWorkTypeName : addGroupName;

    useEffect(() => {
        if (formRef.current) {
            if (editStatus === 1) {
                const data = {
                    ...editRow,
                    enableEndTime: editRow.enableEndTime ? moment(editRow.enableEndTime) : null,
                    enableStartTime: editRow.enableStartTime ? moment(editRow.enableStartTime) : null,
                    groupAdapterType: editRow.groupAdapterType ? editRow.groupAdapterType.split(',').map((item) => Number(item)) : [],
                    enable: editRow.enableDefine ? 1 : 0,
                    provinceId: editRow.groupProvince,
                    professionType: editRow.groupProfessional?.split(',') || [],
                };

                formRef.current.setFieldsValue(data);
                groupNeRef.current.reload();
            } else {
                const data = {
                    provinceId: Number(initialProvince),
                    enable: true,
                };
                formRef.current.setFieldsValue(data);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editStatus, props.editRow]);

    useEffect(() => {
        getNetGroupFieldsList();
        getApplicationOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * @description: 获取列表
     * @logic 拿到数据后先将数据与新增缓存数据合并,然后再将删除缓存的数据去除
     * @param {*}
     * @return {*}
     */
    const getNeListHandler = async (value) => {
        try {
            const data = {
                groupNetWorkType,
                groupId: editRow?.groupId,
                groupType,
                orderField: '',
                orderType: 0,
                filterFieldMap: { undefined },
                searchLikeParamMap: { ne_name: neName || undefined },
                pageSize: value.pageSize || 20,
                current: value.current || 1,
            };
            console.log(value, '==val');
            let res = {};
            if (!editRow?.groupId) {
                res.data = [];
            } else {
                res = await searchSpecificNeIds(data);
            }
            if (res && Array.isArray(res.data)) {
                const arr = [...addNeList, ...res.data];
                delNeList.forEach((item) => {
                    _.pull(arr, _.find(arr, { neId: item }));
                });
                return {
                    success: true,
                    data: arr,
                    total: (res?.total || 0) + addNeList.length - delNeList.length,
                };
            }
            const arr = [...addNeList];
            delNeList.forEach((item) => {
                _.pull(arr, _.find(arr, { neId: item }));
            });
            return {
                success: true,
                data: arr,
                total: arr.length,
            };
        } catch (e) {}
    };

    /**
     * @description: 获取网元组表头字段
     * @param {*}
     * @return {*}
     */
    const getNetGroupFieldsList = async () => {
        const data = {
            groupNetWorkType,
            groupType,
        };
        // 获取该专业类型的columns
        try {
            const res = await searchGroupFields(data);
            let columns = [];
            if (res && Array.isArray(res.data)) {
                columns = res.data.map((item) => {
                    const tempObj = {
                        ...item,
                        width: item.columnSize || 100,
                        dataIndex: item.msgFieldName,
                        hideInTable: !item.displayFlag,
                        title: item.labelName,
                        hideInSearch: item.searchFlag,
                        align: 'center',
                        ellipsis: true,
                        orderId: item.orderId,
                    };
                    if (!item.enumFlag) {
                        tempObj.renderFormItem = () => {
                            return <SelectComp dictName={item.dbFieldName} label="value" id="key" userId={userInfo.userId} />;
                        };
                    }
                    return tempObj;
                });
            }
            setNeColumns(_.orderBy(columns, ['orderId'], ['asc']));
        } catch (e) {}
    };

    const getApplicationOptions = async () => {
        try {
            const data = {
                applicationType: 'group_application_type',
            };
            const res = await getGroupDictDataByType(data);
            if (res && res.data && Array.isArray(res.data)) {
                const handleArr = res.data.map((item) => {
                    return {
                        value: item.dictValue,
                        label: item.dictNameCn,
                    };
                });
                setOptions(handleArr);
            }
        } catch (e) {}
    };

    /**
     * @description: 监听表格删除功能
     * @param {*} selectedRowKeys
     * @param {*} rows
     * @return {*}
     */
    const onDelNeSelectChange = (selectedRowKeys) => {
        setSelectedDelRowKeys(selectedRowKeys);
    };

    const inputChange = (e) => {
        setNeName(e.target.value);
    };

    /**
     * @description: 打开新增网元
     * @param {*}
     * @return {*}
     */
    const queryNeList = () => {
        if (0 < neName?.length && neName?.length < 2) {
            message.warning('请至少输入2个字搜索');
            return;
        }
        groupNeRef.current.reload();
    };

    /**
     * @description: 打开新增网元
     * @param {*}
     * @return {*}
     */
    const showAddNeModal = () => {
        setAddNeModalVisible(true);
    };

    /**
     * @description: 关闭新增网元弹窗
     * @param {*}
     * @return {*}
     */
    const closeAddNeModal = () => {
        setAddNeModalVisible(false);
    };

    /**
     * @description: 点击保存按钮
     * @param {*}
     * @return {*}
     */
    const handleSave = (param) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content:
                editStatus === 1
                    ? '本次编辑后，若用其过滤告警，不会立刻生效，会在明日1点生效'
                    : '本次新增后，若用其过滤告警，不会立刻生效，会在明日1点生效',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            width: '350px',
            onOk: () => {
                formRef.current.validateFields().then((value) => {
                    const allList = value.professionList || [];
                    const professionList = allList.map((item) => item.key);
                    const params = {
                        ...value,
                        enableStartTime: value.enableStartTime ? moment(value.enableStartTime).format('YYYY-MM-DD') : '',
                        enableEndTime: value.enableEndTime ? moment(value.enableEndTime).format('YYYY-MM-DD') : '',
                        deleteNetWorkDataList: delNeList,
                        groupNetworkDataList: addNeList,
                        groupAdapterType: value.groupAdapterType.join(','),
                        groupId: editStatus === 1 ? editRow?.groupId || -1 : -1,
                        groupNetWorkType,
                        createUserId: editStatus === 0 ? userInfo.userId : -1,
                        modifyUserId: userInfo.userId,
                        enable: value.enable ? 1 : 0,
                        enableDate: value.enableDate ? 1 : 0,
                        enableLimited: value.enableLimited ? 1 : 0,
                        groupType,
                        regionId: value.regionId,
                        netWorkGroupProvince: value.provinceId,
                        netWorkGroupProfessional: value.professionType?.toString() || '',
                    };
                    if (params.netWorkGroupProfessional === 'all') {
                        params.netWorkGroupProfessional = professionList?.toString() || '';
                    }
                    delete params.provinceId;
                    delete params.professionType;
                    delete params.professionList;
                    console.log(params);
                    submitEditGroupHandler(params, param);
                });
            },
            onCancel() {},
        });
    };

    /**
     * @description: 提交
     * @param {*}
     * @return {*}
     */
    const submitEditGroupHandler = async (data, params) => {
        setAddNeLoading(true);
        let res = null;
        try {
            if (editStatus === 1) {
                res = await updateGroups(data, params);
            } else {
                res = await addGroups(data, params);
            }
            if (res) {
                closeEditModal();
                setAddNeLoading(false);
                props.onReloadTable();
            }
        } catch (e) {
            setAddNeLoading(false);
        }
    };

    /**
     * @description: 批量提交删除
     * @logic 先判断有没有删除新增缓存里的数据， 如果有则从新增缓存将数据删除掉， 如果没有则存入删除缓存中
     * @param {*}
     * @return {*}
     */
    const delNeHandler = () => {
        if (!Array.isArray(selectedDelRowKeys) || selectedDelRowKeys.length === 0) {
            message.error('请选择要删除的数据');
            return;
        }
        const delList = [];
        const nextData = produce(addNeList, (draft) => {
            if (Array.isArray(selectedDelRowKeys)) {
                selectedDelRowKeys.forEach((item) => {
                    if (_.find(draft, { neId: item })) {
                        _.pull(draft, _.find(draft, { neId: item }));
                    } else {
                        delList.push(item);
                    }
                });
            }
        });
        setAddNeList(nextData);
        setDelNeList(delList);
    };

    /**
     * @description: 批量选择网元
     * @param {*} selectedOptionsRows
     * @return {*}
     */
    const onAddNeHandler = (selectedOptionsRows) => {
        groupNeRef.current.reset();
        handleAddData(selectedOptionsRows);
    };

    /**
     * @description: 处理新增数据
     * @logic 先查找删除的缓存数据中有没有新增回来的，如果有则将删除缓存中的数据清除， 如果没有则判断新增缓存数据中有无重复添加
     * @param {*}
     * @return {*}
     */
    const handleAddData = (selectedOptionsRows) => {
        const addList = _.cloneDeep(addNeList);
        const nextData = produce(delNeList, (draft) => {
            if (Array.isArray(selectedOptionsRows)) {
                selectedOptionsRows.forEach((neObj) => {
                    if (draft.includes(neObj.neId)) {
                        _.pull(draft, neObj.neId);
                    } else if (!_.find(addList, { neId: neObj.neId })) {
                        addList.unshift(neObj);
                    }
                });
            }
        });
        setDelNeList(nextData);
        setAddNeList(addList);
    };

    /**
     * @description: 禁用时清空结束日期的值
     * @param {*}
     * @return {*}
     */
    const onEndLimitDateHandler = () => {
        const dataInfo = formRef.current.getFieldsValue();
        const newDataInfo = {
            ...dataInfo,
            enableEndTime: null,
        };
        formRef.current.setFieldsValue(newDataInfo);
    };
    useEffect(() => {
        groupNeRef.current.reset();
    }, [addNeList, delNeList]);
    useEffect(() => {
        onProvinceChange(editRow.groupProvince || null);
    }, []);
    return (
        <Modal
            centered={true}
            destroyOnClose={true}
            width={900}
            title={editStatus === 1 ? `编辑` : `新建`}
            visible={true}
            bodyStyle={{
                maxHeight: 'calc(100vh - 162px)',
            }}
            footer={
                <CustomModalFooter
                    authKey={editStatus === 1 ? 'networkGroup:edit' : 'networkGroup:add'}
                    onOk={handleSave}
                    onCancel={closeEditModal}
                />
            }
            onCancel={closeEditModal}
        >
            <Spin spinning={addNeLoading} tip="保存数据中">
                <Form name="negroup" ref={formRef} labelAlign="right">
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="groupName"
                                label="名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入组名称',
                                    },
                                    { pattern: formatReg.noEmpety, message: '名称中不能存在空格' },
                                    {
                                        validator: (rule, value, callback) => {
                                            // eslint-disable-next-line no-control-regex
                                            const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                            // eslint-disable-next-line no-useless-escape
                                            const reg = RegExp(/[\|\\\*^%$#@↵+=?？~!！【】[,，、。.;；<>《》‘’“”'"……`{}\/\]]+/);
                                            let mes = '';
                                            if (reg.test(value)) {
                                                mes = `字符只支持-_:：（）()&`;
                                            }
                                            if (valueLength > 64) {
                                                mes = '总长度不能超过64位（1汉字=2位）';
                                            }
                                            if (mes) {
                                                callback(mes);
                                            } else {
                                                callback();
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder="请输入组名称" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="provinceId"
                                label="归属省份"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择省份',
                                    },
                                ]}
                            >
                                <SelectCondition
                                    mode=""
                                    label="value"
                                    id="key"
                                    dictName="province_id"
                                    onChange={(e) => {
                                        onProvinceChange(e);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="regionId"
                                label="归属地市"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择地市',
                                    },
                                ]}
                            >
                                <SelectCondition
                                    cityList={cityList}
                                    mode=""
                                    label="value"
                                    id="key"
                                    dictName="region_id"
                                    addOptions={[{ label: '全省', value: -1 }]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Form.Item hidden name="professionList" />
                        <Col span={8}>
                            <Form.Item
                                name="professionType"
                                label="归属专业"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择归属专业',
                                    },
                                ]}
                            >
                                <SelectConditionAll
                                    form={formRef.current}
                                    mode="multiple"
                                    title="归属专业"
                                    label="txt"
                                    dictName="professional_type"
                                    searchName="professionType"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="groupAdapterType"
                                label="应用"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择应用',
                                    },
                                ]}
                            >
                                <Select options={options} maxTagCount={1} mode="multiple" maxTagTextLength={4} />
                                {/* <SelectCondition mode="signal" label="txt" dictName="org_severity" /> */}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="enable" valuePropName="checked">
                                <Checkbox>启用</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4}>
                            <Form.Item label="启用日期" valuePropName="checked" name="enableDate">
                                <Switch checkedChildren="开" unCheckedChildren="关" size="small"></Switch>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item className="neGroup-timeContent">
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                name="enableStartTime"
                                                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                                rules={[
                                                    {
                                                        validator: async (rule, val) => {
                                                            const remark = getFieldValue('enableDate');
                                                            if (remark) {
                                                                if (!val) {
                                                                    throw new Error('不能为空');
                                                                }
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    disabledDate={(current) => {
                                                        // Can not select days after end date
                                                        if (!getFieldValue('enableEndTime')) {
                                                            return false;
                                                        }
                                                        return current && current > moment(getFieldValue('enableEndTime'));
                                                    }}
                                                    format="YYYY-MM-DD"
                                                    placeholder="开始日期"
                                                    disabled={!getFieldValue('enableDate')}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>-</span>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                name="enableEndTime"
                                                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                                rules={[
                                                    {
                                                        validator: async (rule, val) => {
                                                            const remark = getFieldValue('enableDate') && !getFieldValue('enableLimited');
                                                            if (remark) {
                                                                if (!val) {
                                                                    throw new Error('不能为空');
                                                                }
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    disabledDate={(current) => {
                                                        // Can not select days before beigin date
                                                        // moment().endOf('day');
                                                        return current && current < moment(getFieldValue('enableStartTime')).endOf('day');
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    format="YYYY-MM-DD"
                                                    placeholder="结束日期"
                                                    disabled={!getFieldValue('enableDate') || getFieldValue('enableLimited')}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item noStyle shouldUpdate>
                                {({ getFieldValue }) => {
                                    return (
                                        <Form.Item
                                            name="enableLimited"
                                            // className="neGroup-item-display neGroup-item-margin neGroup-item-font"
                                            valuePropName="checked"
                                        >
                                            <Checkbox disabled={!getFieldValue('enableDate')} onChange={onEndLimitDateHandler}>
                                                无结束日
                                            </Checkbox>
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="描述"
                                rules={[
                                    { pattern: formatReg.noEmpety, message: '不可为空格' },
                                    { max: 200, type: 'string', message: '总长度不能超过200位（1汉字=2位）' },
                                ]}
                            >
                                <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Divider
                    dashed
                    style={{
                        margin: '2px 0',
                    }}
                />
                <div className="network-table-container">
                    <ProTable
                        headerTitle={`${groupTypeName}`}
                        rowSelection={{
                            selectedDelRowKeys,
                            onChange: onDelNeSelectChange,
                        }}
                        tableAlertRender={false}
                        tableAlertOptionRender={false}
                        request={getNeListHandler}
                        actionRef={groupNeRef}
                        columns={neColumns}
                        borderd="true"
                        global={window}
                        options={false}
                        search={false}
                        rowKey="neId"
                        size="small"
                        scroll={{ y: window.innerHeight - 500 }}
                        toolbar={{
                            actions: [
                                <Input
                                    key="neName"
                                    placeholder="请输入网元名称查找"
                                    onChange={inputChange}
                                    style={{ display: editStatus === 1 ? 'block' : 'none' }}
                                />,
                                <Button key="select" type="primary" onClick={queryNeList} style={{ display: editStatus === 1 ? 'block' : 'none' }}>
                                    查找
                                </Button>,
                                <span />,
                                <Button key="add" type="primary" onClick={showAddNeModal}>
                                    添加
                                </Button>,
                                <Button key="delete" type="primary" onClick={delNeHandler}>
                                    删除
                                </Button>,
                            ],
                        }}
                    />
                </div>
                {addNemodalVisible && (
                    <ConditionselectComp
                        columns={neColumns}
                        onCloseModal={closeAddNeModal}
                        onAddNeHandler={onAddNeHandler}
                        groupNetWorkType={groupNetWorkType}
                        groupType={groupType}
                        groupNetWorkTypeName={groupTypeName}
                        userInfo={userInfo}
                    />
                )}
            </Spin>
        </Modal>
    );
};

export default EditComp;
