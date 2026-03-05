import React, { PureComponent } from 'react';
import { Form, Input, Checkbox, message, Select, Space, Badge } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
// import SelectNode from '@Src/pages/select-configurable';
import { makeCRC32 } from '@Common/utils';
import request from '@Common/api';
import Field from '@ant-design/pro-field';
import { useEnvironmentModel } from '@Src/hox';
import formatReg from '@Common/formatReg';
import { getInitialProvince } from '../utils';

const { TextArea } = Input;
const isUnicom = useEnvironmentModel?.data?.environment?.version === 'unicom';
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
    {
        label: '活动栏',
        value: '1',
        disabled: true,
    },
    {
        label: '确认栏',
        value: '2',
    },
    {
        label: '清除栏',
        value: '0',
    },
];
const alFlagplainOptions = [
    {
        label: '未清除未确认',
        value: '1',
        disabled: true,
    },
    {
        label: '未清除已确认',
        value: '2',
    },
    {
        label: '已清除未确认',
        value: '0',
    },
    {
        label: '已清除已确认',
        value: '3',
    },
];
const viewTypeOptions = {
    1: {
        text: '自定义视图',
    },
    2: {
        text: '监控中心视图',
    },
};
const windowTypeOptions = {
    1: {
        text: '未清除未确认',
        status: 'Success',
    },
    2: {
        text: '未清除已确认',
        status: 'Success',
    },
    0: {
        text: '已清除未确认',
        status: 'Success',
    },
    3: {
        text: '已清除已确认',
        status: 'Success',
    },
};
/**
 * 监控视图-新增-窗口信息
 */
class index extends PureComponent {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        const defaultBarType = props.unicomFlag ? ['1', '2', '0', '3'] : ['1', '2', '0'];
        this.state = {
            windowName: _.get(props, 'cacheData.windowName', null) || _.get(props, 'rowData.windowName', null),
            windowAttribute: String(_.get(props, 'cacheData.windowAttribute', null) || _.get(props, 'rowData.windowAttribute', '0')),
            windowType: props.addType === '2' ? '2' : String(_.get(props, 'cacheData.windowType', 1) || _.get(props, 'rowData.windowType', 1)),
            ifUsed: String(_.get(props, 'cacheData.ifUsed', null) || _.get(props, 'rowData.ifUsed', '0')),
            childwindowShow: String(_.get(props, 'cacheData.childwindowShow', null) || _.get(props, 'rowData.childwindowShow', '0')),
            note: _.get(props, 'cacheData.note', null) || _.get(props, 'rowData.note', null),
            parameter: {
                selectKey: _.get(props, 'rowData.centerViewId', null), // 选择值
                options: [],
            },
            centerViewId: _.get(props, 'rowData.centerViewId', null),
            windowBarType: _.get(props, 'cacheData.windowBarType', '')
                ? String(_.get(props, 'cacheData.windowBarType', '')).split(',')
                : defaultBarType,
            provinceData: [],
            regionId: String(_.get(props, 'cacheData.viewProvince', '') || _.get(props, 'rowData.viewProvince', '')),
            professionData: [],
            professionType:
                (_.get(props, 'cacheData.professionType', '') !== '' ? _.get(props, 'cacheData.professionType', '')?.split(',') : undefined) ||
                undefined,
        };
    }

    componentDidMount() {
        console.log(this.props.cacheData);
        if (this.props.rowData && !this.props.cacheData.professionType) {
            const { viewProfessional } = this.props.rowData;
            this.setState({
                professionType: viewProfessional && viewProfessional.length > 0 ? viewProfessional?.split(',') : undefined,
            });
        }
        if (this.props.rowData && !this.props.cacheData.windowBarType) {
            const { windowBarType } = this.props.rowData;
            const defaultBarType = this.props.unicomFlag ? ['1', '2', '0', '3'] : ['1', '2', '0'];
            this.setState({
                windowBarType: windowBarType ? String(windowBarType).split(',') : defaultBarType,
            });
        }
        // this.getSelectData();
        if (isUnicom) {
            this.getProvinceData();
            this.getprofession();
        }
    }

    /**
     * 窗口名称
     */
    onWindowNameChange = (e) => {
        this.setState(
            {
                windowName: e.target.value,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };
    /**
     * 窗口属性
     */
    onWindowAttributeChange = (e) => {
        this.setState(
            {
                windowAttribute: e.target.value,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };
    /**
     * 窗口分类
     */
    onWindowTypeChange = (e) => {
        this.setState(
            {
                windowType: e.target.value,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };
    /**
     * 是否启用
     */
    onIfUsedChange = (e) => {
        this.setState(
            {
                ifUsed: e.target.value,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };
    /**
     * 是否显示清除栏
     */
    onChildwindowShowChange = (e) => {
        this.setState(
            {
                childwindowShow: e.target.value,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };
    /**
     * 备注
     */
    onNoteChange = (e) => {
        this.setState(
            {
                note: e.target.value,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };

    onFinish = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    handleCancel = () => {
        this.props.onCancel();
    };

    getSelectData = (selectKey) => {
        const { userInfo } = this.props;
        request(`v1/center-view/${userInfo.userProvinceId}`, {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res.data) {
                const list = res.data.map((item) => {
                    return {
                        field: item,
                        label: item.name,
                        id: item.id,
                    };
                });
                this.setState({
                    parameter: {
                        selectKey: selectKey || this.state.parameter.selectKey,
                        options: list,
                    },
                });
            }
        });
    };
    addAction = (data, selectKey) => {
        const {
            userInfo: { userId },
            userInfo,
        } = this.props;
        const viewsTypeId = makeCRC32(new Date().getTime() + userId);
        const obj = {
            creator: userId,
            id: viewsTypeId,
            modifier: userId,
            name: data.label,
            orderNum: 1,
            provinceId: userInfo.userProvinceId,
            provinceName: userInfo.userProvinceName,
        };
        request('v1/center-view', {
            type: 'post',
            baseUrlType: 'monitorSetUrl',
            data: obj,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then(() => {
                this.getSelectData(selectKey);
            })
            .catch(() => {
                this.getSelectData(selectKey);
            });
    };
    editAction = (data, selectKey) => {
        const {
            userInfo: { userId },
        } = this.props;

        const obj = {
            creator: data.field.creator,
            id: data.id,
            modifier: userId,
            name: data.label,
            orderNum: data.field.orderNum,
            provinceId: data.field.provinceId,
            provinceName: data.field.provinceName,
        };
        request('v1/center-view', {
            type: 'put',
            baseUrlType: 'monitorSetUrl',
            data: obj,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then(() => {
                this.getSelectData(selectKey);
            })
            .catch(() => {
                this.getSelectData(selectKey);
            });
    };
    delAction = (data, selectKey) => {
        const {
            userInfo: { userId },
        } = this.props;
        request(`v1/center-view/${data.id}/${userId}`, {
            type: 'delete',
            baseUrlType: 'monitorSetUrl',

            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then(() => {
                this.getSelectData(selectKey);
            })
            .catch(() => {
                this.getSelectData(selectKey);
            });
    };
    sortAction = (data, selectKey) => {
        const {
            userInfo: { userId },
        } = this.props;
        const list = data.options.map((item) => {
            return {
                id: item.id,
                orderNum: item.sort,
            };
        });
        request(`v1/center-view/orderNum`, {
            type: 'put',
            baseUrlType: 'monitorSetUrl',
            data: { orderList: list, userId },
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        })
            .then(() => {
                this.getSelectData(selectKey);
            })
            .catch(() => {
                this.getSelectData(selectKey);
            });
    };
    selectChange = (list, type, field) => {
        const { selectKey } = list;
        if (type === 'add') {
            this.addAction(field, selectKey);
        }
        if (type === 'edit') {
            this.editAction(field, selectKey);
        }
        if (type === 'del') {
            this.delAction(field, selectKey);
        }
        if (type === 'change') {
            this.setState(
                {
                    centerViewId: selectKey,
                },
                () => {
                    this.props.onDataChange(this.state);
                },
            );
        }
        if (type === 'sort') {
            this.sortAction(list, selectKey);
        }
    };
    windowTypeChange = (field, checkedValue) => {
        // console.log(checkedValue);
        this.setState(
            {
                [field]: checkedValue,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };

    // 获取归属省份
    getProvinceData = () => {
        const {
            userInfo: { userId },
            login,
        } = this.props;
        const { systemInfo } = login;
        const { regionId } = this.state;
        const provinceId = systemInfo?.currentZone?.zoneId;
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
                provinceId,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                this.setState(
                    {
                        provinceData: res,
                        regionId: !regionId || regionId === 'null' ? getInitialProvince(provinceId, login?.userInfo) : regionId,
                    },
                    () => {
                        this.props.onDataChange(this.state);
                    },
                );
            }
        });
    };
    handleProvinceChange = (e) => {
        this.setState(
            {
                regionId: e,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };
    // 获取归属专业
    getprofession = () => {
        const {
            userInfo: { userId },
        } = this.props;
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 100,
                dictName: 'professional_type',
                en: false,
                modelId: 2,
                creator: userId,
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                const list = res.data;
                list.unshift({ key: 'all', value: '全部' });
                this.setState(
                    {
                        professionData: list,
                    },
                    () => {
                        this.props.onDataChange(this.state);
                    },
                );
            }
        });
    };
    handleProfessionType = (e) => {
        const { professionType } = this.state;
        if (professionType && professionType.toString() === 'all' && e.toString() !== 'all') {
            this.setState(
                {
                    professionType: e.filter((item) => item !== 'all'),
                },
                () => {
                    this.props.onDataChange(this.state);
                },
            );
            return;
        }
        if (e.find((item) => item === 'all') === 'all') {
            this.setState(
                {
                    professionType: ['all'],
                },
                () => {
                    this.props.onDataChange(this.state);
                },
            );
            return;
        }
        this.setState(
            {
                professionType: e,
            },
            () => {
                this.props.onDataChange(this.state);
            },
        );
    };

    render() {
        const {
            windowName,
            windowAttribute,
            windowType,
            ifUsed,
            childwindowShow,
            note,
            parameter,
            windowBarType,
            ackFlag,
            provinceData,
            regionId,
            professionData,
            professionType,
        } = this.state;
        const { isEdit, unicomFlag, userInfo, formRef, addType } = this.props;
        const initialValues = {
            WINDOW_NAME: windowName,
            WINDOW_ATTRIBUTE: windowAttribute,
            WINDOW_TYPE: windowType,
            IF_USED: ifUsed,
            CHILDWINDOW_SHOW: childwindowShow,
            NOTE: note,
            windowBarType,
            ackFlag,
        };
        return (
            <div>
                <Form labelAlign="right" initialValues={initialValues} onFinish={this.onFinish} ref={formRef || this.formRef}>
                    <Form.Item
                        name="WINDOW_NAME"
                        label="视图名称"
                        rules={[
                            { required: true, message: '请输入视图名称!' },
                            { pattern: formatReg.noSpecialSymbol, message: '视图名称不可存在特殊符号' },
                            {
                                // validator: (rule, value, callback) => {
                                //     const valueLength = value ? value.replace(/[^\\x00-\xff]/g, 'aa').length : 0;
                                //     if (valueLength > 15) {
                                //         callback(`窗口名称总长度不能超过15位（1汉字=2位）`);
                                //     } else if (!value || (value && !value.trim())) {
                                //         message.error(`窗口名称必填，请填写后保存!`);
                                //         callback();
                                //     } else {
                                //         callback();
                                //     }
                                // },

                                max: 15,
                                message: '监控视图名称最大长度15',
                            },
                        ]}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 6 }}
                    >
                        {/* {isEdit ? (
                            <Input maxLength={15} allowClear style={{ width: 200 }} onChange={this.onWindowNameChange} value={windowName} />
                        ) : (
                            <span>{windowName}</span>
                        )} */}
                        <Field
                            style={{ width: 200 }}
                            onChange={this.onWindowNameChange}
                            value={windowName}
                            allowClear
                            valueType="text"
                            mode={isEdit ? 'edit' : 'read'}
                            renderFormItem={() => {
                                return <Input maxLength={15} placeholder="请输入视图名称" />;
                            }}
                        />
                        {/* <Input disabled={!isEdit} ></Input> */}
                    </Form.Item>
                    <Form.Item
                        name="WINDOW_ATTRIBUTE"
                        label="是否共享"
                        rules={[{ required: true, message: '请选择是否共享!' }]}
                        labelCol={{ span: 4 }}
                    >
                        <Field
                            mode={isEdit ? 'edit' : 'read'}
                            onChange={this.onWindowAttributeChange}
                            value={windowAttribute}
                            valueType="radio"
                            valueEnum={{
                                0: {
                                    text: '否',
                                    // status: 'Error'
                                },
                                1: {
                                    text: '是',
                                    // status: 'Success'
                                },
                            }}
                        />
                        {/* <Radio.Group disabled={!isEdit} style={{ width: '100%' }} onChange={this.onWindowAttributeChange} value={windowAttribute}>
                            <Radio value={'0'} span={4}>
                                否
                            </Radio>
                            <Radio value={'1'} span={4}>
                                是
                            </Radio>
                        </Radio.Group> */}
                    </Form.Item>
                    <Form.Item label="视图分类" labelCol={{ span: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div>
                                <Form.Item name="WINDOW_TYPE" noStyle>
                                    <Field
                                        mode={'read'}
                                        onChange={this.onWindowTypeChange}
                                        value={windowType}
                                        valueType="radio"
                                        valueEnum={
                                            addType !== '2'
                                                ? {
                                                      1: {
                                                          text: '自定义视图',
                                                      },
                                                  }
                                                : {
                                                      2: {
                                                          text: '监控中心视图',
                                                      },
                                                  }
                                        }
                                        // valueEnum={
                                        //     unicomFlag && userInfo.isAdmin
                                        //         ? { ...viewTypeOptions, 2: { text: '监控中心视图', status: 'Success' } }
                                        //         : viewTypeOptions
                                        // }
                                    />
                                    {/* <Radio.Group disabled={!isEdit} style={{ width: '100%' }} onChange={this.onWindowTypeChange} value={windowType}>
                                        <Radio value={'0'} span={4}>
                                            当班窗口
                                        </Radio>
                                        <Radio value={'1'} span={4}>
                                            自定义窗口
                                        </Radio>
                                        {unicomFlag && userInfo.isAdmin && (
                                            <Radio value={'2'} span={4}>
                                                监控中心视图
                                            </Radio>
                                        )}
                                    </Radio.Group> */}
                                </Form.Item>
                            </div>
                            {/* {windowType === '2' && isEdit && addType !== '2' ? (
                                <div>
                                    <Form.Item noStyle>
                                        <SelectNode onChange={this.selectChange} parameter={parameter} />
                                    </Form.Item>
                                </div>
                            ) : (
                                <div />
                            )} */}
                        </div>
                    </Form.Item>
                    {addType !== '2' && (
                        <Form.Item label="视图栏类型" name="windowBarType" labelCol={{ span: 4 }}>
                            {isEdit ? (
                                <CheckboxGroup
                                    options={unicomFlag ? alFlagplainOptions : plainOptions}
                                    value={windowBarType}
                                    onChange={this.windowTypeChange.bind(this, 'windowBarType')}
                                />
                            ) : (
                                <Field
                                    mode={'read'}
                                    onChange={this.onWindowTypeChange}
                                    value={windowBarType}
                                    valueType="checkbox"
                                    render={(r, d) => {
                                        return (
                                            <Space>
                                                {alFlagplainOptions.map((item) => {
                                                    if (Array.isArray(r) && r.includes(item.value)) {
                                                        return <Badge color={'green'} text={item.label} />;
                                                    }
                                                })}
                                            </Space>
                                        );
                                    }}
                                    valueEnum={windowTypeOptions}
                                />
                            )}
                        </Form.Item>
                    )}
                    {/* <Form.Item label="确认状态" name="ackFlag" labelCol={{ span: 4 }}>
                        <CheckboxGroup options={alFlagplainOptions} value={ackFlag} onChange={this.windowTypeChange.bind(this, 'ackFlag')} />
                    </Form.Item> */}
                    <Form.Item name="IF_USED" label="是否启用" labelCol={{ span: 4 }}>
                        <Field
                            mode={isEdit ? 'edit' : 'read'}
                            onChange={this.onIfUsedChange}
                            value={ifUsed}
                            valueType="radio"
                            valueEnum={{
                                0: {
                                    text: '否',
                                    // status: 'Error'
                                },
                                1: {
                                    text: '是',
                                    // status: 'Success'
                                },
                            }}
                        />
                        {/* <Radio.Group disabled={!isEdit} style={{ width: '100%' }} onChange={this.onIfUsedChange} value={ifUsed}>
                            <Radio value={'0'} span={4}>
                                否
                            </Radio>
                            <Radio value={'1'} span={4}>
                                是
                            </Radio>
                        </Radio.Group> */}
                    </Form.Item>
                    {/* <Form.Item name="CHILDWINDOW_SHOW" label="清除栏" labelCol={{ span: 4 }}>
                        <Radio.Group
                            disabled={!isEdit}
                            style={{ width: '100%' }}
                            onChange={this.onChildwindowShowChange}
                            value={childwindowShow}
                        >
                            <Radio value={'0'} span={4}>
                                不显示
                            </Radio>
                            <Radio value={'1'} span={4}>
                                显示
                            </Radio>
                        </Radio.Group>
                    </Form.Item> */}
                    <Form.Item
                        label="归属省份"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 6 }}
                        name="provinceName"
                        rules={[{ required: true, message: '请选择归属省份!' }]}
                    >
                        <Field
                            mode={isEdit ? 'edit' : 'read'}
                            renderFormItem={() => {
                                const { login } = this.props;
                                const { systemInfo } = login;
                                const provinceId = systemInfo?.currentZone?.zoneId;
                                return (
                                    <Select
                                        onChange={this.handleProvinceChange}
                                        style={{ width: '100%' }}
                                        value={regionId}
                                        filterOption={(item, itm) => {
                                            return itm.children?.includes(item);
                                        }}
                                        showSearch={true}
                                    >
                                        {provinceData
                                            .filter((items) => items.regionId === getInitialProvince(provinceId, login?.userInfo))
                                            .map((item) => (
                                                <Select.Option key={item.regionId} value={item.regionId}>
                                                    {item.regionName}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                );
                            }}
                            render={() => {
                                return (
                                    <span>
                                        {provinceData.map((item) => {
                                            if (
                                                item.regionId === regionId &&
                                                String(
                                                    _.get(this.props, 'cacheData.viewProvince', '') || _.get(this.props, 'rowData.viewProvince', ''),
                                                ) !== 'null'
                                            ) {
                                                return item.regionName;
                                            }
                                        })}
                                    </span>
                                );
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="归属专业"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 6 }}
                        name="professionName"
                        rules={[{ required: true, message: '请选择归属专业!' }]}
                    >
                        <Field
                            mode={isEdit ? 'edit' : 'read'}
                            renderFormItem={() => {
                                return (
                                    <Select
                                        onChange={this.handleProfessionType}
                                        style={{ width: '100%' }}
                                        value={professionType}
                                        mode="multiple"
                                        filterOption={(item, itm) => {
                                            return itm.children?.includes(item);
                                        }}
                                    >
                                        {professionData.map((item) => (
                                            <Select.Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                );
                            }}
                            render={() => {
                                const arr = [];
                                professionData.map((item) => {
                                    if (professionType?.includes(item.key)) {
                                        return arr.push(item.value);
                                    }
                                });
                                return <span>{arr.toString()}</span>;
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="NOTE"
                        label="备注信息"
                        labelCol={{ span: 4 }}
                        rules={[
                            {
                                validator: (rule, value, callback) => {
                                    const valueLength = value ? value.replace(/[^\\x00-\xff]/g, 'aa').length : 0;
                                    if (valueLength > 255) {
                                        callback(`备注信息总长度不能超过255位（1汉字=2位）`);
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Field mode={isEdit ? 'edit' : 'read'} valueType="textarea" onChange={this.onNoteChange} value={note} allowClear />
                        {/* <TextArea disabled={!isEdit} onChange={this.onNoteChange} value={note} allowClear /> */}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default index;
