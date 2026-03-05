import React, { Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Radio, InputNumber, Select, message, ColumnsSortDrag, Spin, Table, TimePicker, Button, Icon } from 'oss-ui';
import { editEnumType } from '../enum';
import CustomModalFooter from '@Components/custom-modal-footer';
import {
    getRegionList,
    getUserList,
    saveGroupInfo,
    getGroupInfo,
    checkGroupName,
    getCustomMonitorViews,
    getGropProfessionalModule,
    checkDeletedGroupUserApi,
} from '../api';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { _ } from 'oss-web-toolkits';
import { VirtualTable } from 'oss-web-common';
import { getInitialProvince } from '../utils';
import Field from '@ant-design/pro-field';
import EditMode from '../maintenance-edit';
import formatReg from '@Common/formatReg';
import { limitDecimals } from '@Common/format';
import DateRangeTime from '@Components/date-range-time';
import moment from 'moment';
import './index.less';
import { BatchGetDictByFieldName } from '../../reinsurance-record/api';
import { DndDropdown } from '@Pages/components';

const groupTypeList = [
    {
        label: '监控班组',
        value: 1,
    },
    {
        label: '调度班组',
        value: 2,
    },
];

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            regionList: [],
            userListModalVisible: false,
            selectedUserRowKeys: [],
            selectedUserRows: [],
            selectedFilters: [],
            userList: [],
            selectUserList: [],
            loading: false,
            confirmLoading: false,
            viewSearchStr: '',
            synAlarmType: 1,
            professionalModule: [],
        };
        this.userListColumns = [
            {
                title: '用户名',
                dataIndex: 'userName',
                align: 'center',
                width: 120,
                ellipsis: true,
            },
            {
                title: '手机号',
                dataIndex: 'mobilePhone',
                align: 'center',
                ellipsis: true,
            },
        ];
        this.filterColumns = [
            {
                title: '视图名称',
                key: 'windowName',
                align: 'center',
                ellipsis: true,
                width: 160,
            },
            {
                title: '创建人',
                key: 'userName',
                align: 'center',
                ellipsis: true,
                width: 160,
            },
        ];
        this.professionalTypesList = [];
    }

    componentDidMount() {
        this.loadGroupInfo();
        this.getProfessionalTypesList();
    }

    // 获取专业
    getProfessionalTypesList() {
        BatchGetDictByFieldName(['dutyManagerProfession']).then((res) => {
            this.professionalTypesList = res.data.dutyManagerProfession.map((item) => ({
                label: item.value,
                value: item.key,
            }));
        });
    }

    // 管理反显处理（需要 专业选择过后获取的管理数据和获取到的详情数据进行排序整理）
    reverseProfessionalModule = async (modules = []) => {
        const list = modules.map((item) => {
            // optionalFlag  0 不可选;1 可选;2 可选,默认选择;3 必选
            return {
                label: item.moduleName,
                checked: Boolean(item.checked),
                id: item.moduleId,
                disabled: item.optionalFlag === 0 || item.optionalFlag === 3 ? true : false,
            };
        });

        return list;
    };

    /**
     * @description: 加载组信息
     * @param {*}
     * @return {*}
     */

    loadGroupInfo = async () => {
        const { editType, editRow, groupFilterProvince, login } = this.props;
        if (editEnumType.EDIT === editType || editEnumType.READ === editType) {
            const data = {
                groupId: editRow.groupId,
            };
            const res = await getGroupInfo(data);
            if (res) {
                // 对查询出来的模块和反显回来的数据进行排序
                const professionalModule = await this.reverseProfessionalModule(res.modules ?? []);

                // 告警同步需求添加的额外字段
                const extraValue = {
                    synAlarmType: res.synAlarmType,
                    synAlarmDefaultHours: res.synAlarmDefaultHours || 0,
                    synAlarmDate: [],
                };
                if (res.synAlarmType === 3 && res.synAlarmBeginDate && res.synAlarmEndDate) {
                    extraValue.synAlarmDate = [moment(res.synAlarmBeginDate), moment(res.synAlarmEndDate)];
                }
                this.formRef.current.setFieldsValue({
                    province: {
                        label: res.provinceName,
                        value: res.provinceId,
                    },
                    region: {
                        value: res.regionId,
                        label: res.regionName,
                    },
                    center: {
                        value: res.centerId,
                        label: res.centerName,
                    },
                    groupType: {
                        value: res.groupType,
                        label: res.groupTypeName,
                    },
                    groupName: res.groupName,
                    professionalTypes: res?.professionalTypes ?? undefined,
                    modules: res.modules,
                    ...extraValue,
                });
                res.groupUserBeanList.unshift(
                    res.groupUserBeanList.splice(
                        res.groupUserBeanList.findIndex((itm) => itm.isLeader === 1),
                        1,
                    )[0],
                );
                this.setState({
                    synAlarmType: res.synAlarmType,
                    userList: res.groupUserBeanList.map((item) => item?.userId) || [],
                    selectUserList: res.groupUserBeanList,
                    selectedUserRowKeys: (Array.isArray(res.groupUserBeanList) && res.groupUserBeanList.map((item) => item?.userId)) || [],
                    selectedUserRows: res.groupUserBeanList,
                    selectedFilters:
                        Array.isArray(res.monitorViewList) &&
                        res.monitorViewList.map((item) => {
                            return {
                                ...item,
                                creator: item.userName,
                                id: item.windowId,
                                userName: item.operateUserName,
                            };
                        }),
                    professionalModule,
                });
            }
        } else {
            const userInfo = JSON.parse(login.userInfo);
            if (userInfo?.zones[0].zoneLevel === '3') {
                this.formRef.current.setFieldsValue({
                    province: {
                        label: groupFilterProvince?.regionName,
                        value: groupFilterProvince?.regionId,
                    },
                    region: { value: userInfo?.zones[0].zoneId, label: userInfo?.zones[0].zoneName },
                });
                this.getRegionList();
                return;
            }
            this.formRef.current.setFieldsValue({
                province: {
                    label: groupFilterProvince?.regionName,
                    value: groupFilterProvince?.regionId,
                },
                synAlarmType: 1,
                synAlarmDefaultHours: 0,
            });
            this.selectProvince(groupFilterProvince?.regionId);
        }
    };

    // 默认选择省本部
    selectProvince = async (value) => {
        const { login } = this.props;
        const data = {
            parentRegionId: value,
            creator: login.userId,
        };
        const res = await getRegionList(data);
        if (res.filter((item) => item.regionName === '省本部') && res.filter((item) => item.regionName === '省本部')[0]) {
            const regions = res.filter((item) => item.regionName === '省本部')[0];
            this.formRef.current.setFieldsValue({
                region: {
                    value: regions.regionId,
                    label: regions.regionName,
                },
            });
        } else {
            if (res.length > 0) {
                this.formRef.current.setFieldsValue({
                    region: { value: res[0].regionId, label: res[0].regionName },
                });
            }
        }
    };

    /**
     * @description: 加载过滤器
     * @param {*}
     * @return {*}
     */

    loadAllFilters = async (params) => {
        this.setState({
            loading: true,
        });
        const { login } = this.props;
        const userInfo = JSON.parse(login.userInfo);
        const zones = userInfo?.zones[0];
        const currentZoneId = zones?.zoneLevel === '3' ? zones?.parentZoneId : zones?.zoneId;
        const data = {
            ...params,
            current: params.pageNum,
            pageSize: 20,
            userId: login.userId,
            // 0:当班窗口
            // 1:自定义窗口
            // 2:全部窗口
            windowType: '1',
            showType: '2',
            ifUsed: 1,
            viewProvince: login?.systemInfo?.currentZone?.zoneId ? login?.systemInfo?.currentZone?.zoneId : currentZoneId,
        };
        const res = await getCustomMonitorViews(data);
        this.setState({
            loading: false,
        });
        return Promise.resolve({
            success: true,
            total: res.total,
            data: res.data.map((item) => {
                return {
                    ...item,
                    id: item.windowId,
                };
            }),
        });
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */

    onCancel = () => {
        this.props.onEditModalCancel();
    };

    /**
     * @description: 获取省份信息
     * @param {*}
     * @return {*}
     */

    getProvinceByForm = () => {
        const province = this.formRef.current?.getFieldValue('province');
        return province;
    };
    /**
     * @description: 获取地市信息
     * @param {*}
     * @return {*}
     */

    getRegionList = async () => {
        const { login } = this.props;

        const province = this.getProvinceByForm();
        if (!province || _.isEmpty(province)) return;
        const data = {
            parentRegionId: province.value,
            creator: login.userId,
        };
        try {
            const res = await getRegionList(data);
            if (Array.isArray(res)) {
                const userInfo = JSON.parse(login.userInfo);

                if (userInfo?.zones[0].zoneLevel === '3') {
                    this.formRef.current.setFieldsValue({
                        regionId: userInfo?.zones[0].zoneId,
                    });

                    this.setState({
                        regionList: res || [],
                    });
                    return;
                }
                if (Array.isArray(res.filter((item) => item.regionName === '省本部')) && res.filter((item) => item.regionName === '省本部')[0]) {
                    res.unshift(
                        ...res.splice(
                            res.findIndex((i) => i.regionName === '省本部'),
                            1,
                        ),
                    );
                }

                this.setState({
                    regionList: res || [],
                });
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };

    /**
     * @description: 监听省数据变化
     * @param {*}
     * @return {*}
     */

    onProvinceChange = (value) => {
        this.formRef.current.setFieldsValue({
            province: value,
            region: null,
        });
        this.selectProvince(value?.key);
        this.setState({
            regionList: [],
        });
    };

    /**
     * @description: 展示用户列表弹窗
     * @param {*}
     * @return {*}
     */

    showUserListModal = () => {
        if (!this.getProvinceByForm()) {
            message.error('请选择省份');
            return;
        }
        this.setState({
            userListModalVisible: true,
        });
    };

    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */

    onCloseUserModal = () => {
        this.setState({
            userListModalVisible: false,
            // selectedUserRowKeys: [],
            // selectedUserRows: []
        });
    };

    /**
     * @description: 获取用户列表
     * @param {*}
     * @return {*}
     */

    getUserList = async (params) => {
        const { regionList } = this.state;
        const { login } = this.props;
        const userInfo = JSON.parse(login.userInfo);
        const zones = userInfo?.zones[0];
        const provinceId = this.getProvinceByForm()?.value;
        const regionId = this.formRef.current.getFieldValue('region')?.value;
        const data = {
            ...params,
            creator: login.userId,
            zoneId:
                regionId && regionList.length && regionList.filter((item) => item.regionId === regionId)[0]?.regionName !== '省本部'
                    ? regionId
                    : provinceId,
        };
        if (zones.zoneLevel === '3') {
            data.zoneId = zones?.zoneId || regionId;
        }
        const res = await getUserList(data);
        if (res && Array.isArray(res.rows)) {
            return {
                success: true,
                total: res.total,
                data: res.rows,
            };
        }
        return {
            success: true,
            total: 0,
            data: [],
        };
    };

    /**
     * @description: 监听用户变化
     * @param {*}
     * @return {*}
     */

    onUserSelect = (record, selected) => {
        const { selectedUserRows } = this.state;
        let handleArr = [];
        if (selected) {
            handleArr = [...selectedUserRows, record];
        } else {
            handleArr = selectedUserRows.filter((item) => item.userId !== record.userId);
        }
        this.setState({
            selectedUserRows: handleArr,
            selectedUserRowKeys: handleArr.map((item) => item.userId),
        });
    };

    /**
     * @description: 监听穿梭框
     * @param {*}
     * @return {*}
     */

    onFilterSelectedChange = (selectedRows) => {
        this.setState({
            selectedFilters: selectedRows.map((item) => {
                return {
                    ...item,
                    filterAlias: item.alias,
                };
            }),
        });
    };
    /**
     * @description: 检查重名
     * @param {*}
     * @return {*}
     */

    checkGroupName = async (groupName, groupId) => {
        const data = {
            groupName,
            groupId,
        };
        const res = await checkGroupName(data);
        return res.code === 200;
    };

    /**
     * @description: 保存或编辑班组信息
     * @param {*}
     * @return {*}
     */

    onSave = (params) => {
        const { login, editType, editRow } = this.props;
        const { selectUserList, selectedFilters } = this.state;
        console.log('====params=');
        this.formRef.current.validateFields().then(async (values) => {
            if (values) {
                const data = {
                    provinceId: values?.province?.value,
                    provinceName: values?.province?.label,
                    regionId: values?.region?.value,
                    centerId: values?.center?.value,
                    regionName: values?.region?.label,
                    groupName: values?.groupName,
                    operateUser: login?.userId,
                    groupType: values?.groupType?.value,
                    groupUserBeanList:
                        Array.isArray(selectUserList) &&
                        selectUserList.map((user) => {
                            return {
                                userName: user?.zhName || user?.userName,
                                userId: user?.userIdNum || user?.userId,
                                mobilePhone: user?.mobilephone || user?.mobilePhone,
                                isLeader: user?.isLeader || 0,
                            };
                        }),
                    monitorViewList: selectedFilters.map((item, index) => {
                        return {
                            windowId: item.windowId,
                            windowName: item.windowName,
                            order: index + 1,
                        };
                    }),
                    synAlarmType: values.synAlarmType,
                    professionalTypes: values.professionalTypes || [],
                    modules: this.state.modulesList,
                };
                if (data.synAlarmType) {
                    if (data.synAlarmType === 2) {
                        if (!values.synAlarmDefaultHours && values.synAlarmDefaultHours !== 0) {
                            return message.warn('请选择默认时间段');
                        }
                        data.synAlarmDefaultHours = values.synAlarmDefaultHours;
                    } else if (data.synAlarmType === 3) {
                        if (!values.synAlarmDate || values.synAlarmDate.length !== 2 || !values.synAlarmDate[0] || !values.synAlarmDate[1]) {
                            return message.warn('请选择同步时间段');
                        }
                        data.synAlarmBeginDate = moment(values.synAlarmDate[0]).format('YYYY-MM-DD');
                        data.synAlarmEndDate = moment(values.synAlarmDate[1]).format('YYYY-MM-DD');
                    }
                }
                if (editEnumType.EDIT === editType) {
                    data.groupId = editRow?.groupId;
                }

                if (!selectUserList.length) {
                    return message.warn('至少选择一个组员');
                }

                if (!(await this.checkGroupName(values.groupName, editRow?.groupId))) {
                    message.error('班组名称重复');
                    return;
                }

                if (selectedFilters.length > 10) {
                    message.warn('最多选择10个自定义视图');
                    return;
                }

                this.setState({
                    confirmLoading: true,
                });
                const res = await saveGroupInfo(data, params);
                if (res?.code === 200) {
                    this.setState({
                        confirmLoading: false,
                    });
                    message.success('保存成功');
                    this.props.onSaveGroupSuccess();
                } else {
                    this.setState({
                        confirmLoading: false,
                    });
                    message.error(res.msg);
                }
            }
        });
    };

    readtTableConlumns = [
        {
            title: '视图名称',
            dataIndex: 'windowName',
        },
        {
            title: '创建人',
            dataIndex: 'operateUserName',
        },
    ];

    editChange = (e, v) => {
        const userList = [];
        if (v && Array.isArray(v)) {
            v.forEach((item) => {
                userList.push({ ...item.otherInfo, isLeader: item.isLeader });
            });
            this.setState({
                selectUserList: userList,
                userList: e,
            });
        }
    };

    handleViewSearchChange = (e, list) => {
        this.setState({
            viewSearchStr: e,
        });
    };

    handleDataSource = (list) => {
        const { viewSearchStr } = this.state;
        const newList = [];
        list.map((item) => {
            if (item.windowName?.indexOf(viewSearchStr) !== -1) {
                newList.push(item);
            }
        });
        return newList;
    };
    onRadioChange = (e) => {
        this.setState({ synAlarmType: e.target.value });
    };

    getGropModuleList = async (professionalTypes) => {
        const data = {
            professionalTypes: professionalTypes,
        };
        const res = await getGropProfessionalModule(data);

        if (res.code === 200) {
            const list = res.data.map((item) => {
                // optionalFlag  0 不可选;1 可选;2 可选,默认选择;3 必选
                return {
                    label: item.moduleName,
                    checked: item.optionalFlag === 2 || item.optionalFlag === 3 ? true : false,
                    id: item.moduleId,
                    disabled: item.optionalFlag === 0 || item.optionalFlag === 3 ? true : false,
                };
            });
            this.setState({
                professionalModule: list,
            });
            return list;
        }
        return [];
    };

    onFormChange = async (changedValues, allValues) => {
        if (changedValues.professionalTypes) {
            this.getGropModuleList(changedValues.professionalTypes);
        }
    };

    onSavemoduleGroup = (data) => {
        const modulesList = data.map((item, index) => {
            // optionalFlag  0 不可选;1 可选;2 可选,默认选择;3 必选
            const optionalFlagFormat = () => {
                let optionalFlag;
                // 禁用
                if (item.disabled) {
                    if (!item.checked) {
                        optionalFlag = 0;
                    } else {
                        optionalFlag = 3;
                    }
                } else {
                    // eslint-disable-next-line no-lonely-if
                    if (!item.checked) {
                        optionalFlag = 1;
                    } else {
                        optionalFlag = 2;
                    }
                }
                return optionalFlag;
            };
            return {
                moduleId: item.id,
                moduleName: item.label,
                checked: item.checked ? 1 : 0,
                optionalFlag: optionalFlagFormat(),
                orderId: index + 1,
            };
        });
        this.setState({
            modulesList,
        });
    };

    onEditConfirm = () => {
        const { editRow } = this.props;
        const { selectUserList } = this.state;

        const newUserList =
            Array.isArray(selectUserList) &&
            selectUserList.map((user) => {
                return {
                    userName: user?.zhName || user?.userName,
                    userId: user?.userIdNum || user?.userId,
                    mobilePhone: user?.mobilephone || user?.mobilePhone,
                    isLeader: user?.isLeader || 0,
                };
            });

        checkDeletedGroupUserApi({
            groupId: editRow.groupId,
            groupUserBeanList: newUserList,
        }).then((res) => {
            if (res.code === 200) {
                Modal.confirm({
                    title: '修改后，该班组所有班次的值班记录、值班日志查询的组件会即时更新。是否继续？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.onSave();
                    },
                });
            } else if (res.code === 201) {
                message.warn(res.message);
            } else if (res.code === 202) {
                Modal.confirm({
                    title: res.message,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        Modal.confirm({
                            title: '修改后，该班组所有班次的值班记录、值班日志查询的组件会即时更新。是否继续？',
                            okText: '确定',
                            cancelText: '取消',
                            onOk: () => {
                                this.onSave();
                            },
                        });
                    },
                });
            }
        });
        // return;

        // Modal.confirm({
        //     title: '修改后，该班组所有班次的值班记录、值班日志查询的组件会即时更新。是否继续？',
        //     okText: '确定',
        //     cancelText: '取消',
        //     onOk: () => {
        //         this.onSave();
        //     },
        // });
    };

    render() {
        const {
            selectUserList,
            viewSearchStr,
            regionList,
            userListModalVisible,
            selectedUserRowKeys,
            selectedFilters,
            userList,
            loading,
            confirmLoading,
            synAlarmType,
            professionalModule,
        } = this.state;
        const { editType, provinceList = [], centerList = [] } = this.props;
        const mode = editEnumType.READ === editType ? 'read' : 'edit';
        let title = '编辑';
        if (editEnumType.ADD === editType) {
            title = '新增';
        }
        if (editEnumType.READ === editType) {
            title = this.props.editRow?.groupName || '查看';
        }

        return (
            <Fragment>
                <Modal
                    visible={true}
                    width={1000}
                    title={title}
                    onCancel={this.onCancel}
                    maskClosable={false}
                    footer={
                        <CustomModalFooter
                            authKey={editEnumType.ADD === editType ? 'groupManage:add' : 'groupManage:edit'}
                            okText={mode === 'read' ? null : '确定'}
                            onOk={() => {
                                if (editEnumType.ADD === editType) {
                                    this.onSave();
                                } else {
                                    this.onEditConfirm();
                                }
                            }}
                            onCancel={this.onCancel}
                            confirmLoading={confirmLoading}
                        />
                    }
                >
                    <Spin spinning={confirmLoading}>
                        <Form ref={this.formRef} labelAlign="right" onValuesChange={this.onFormChange}>
                            <Row justify="space-around" gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="班组名称"
                                        name="groupName"
                                        rules={[
                                            { required: true, message: '请输入班组名称' },
                                            {
                                                max: 12,
                                                message: '值班班组名称最大长度12',
                                            },
                                        ]}
                                    >
                                        <Field
                                            mode={mode}
                                            renderFormItem={() => {
                                                return <Input maxLength={12} placeholder="请输入班组名称" />;
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item
                                                    label="归属省份"
                                                    name="province"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入归属省份名称',
                                                        },
                                                    ]}
                                                    labelCol={4}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            return <span>{getFieldValue('province')?.label || '-'}</span>;
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select allowClear onChange={this.onProvinceChange} labelInValue>
                                                                    {provinceList.map((province) => {
                                                                        if (
                                                                            province.regionId ===
                                                                            getInitialProvince(
                                                                                this.props.login.systemInfo?.currentZone?.zoneId,
                                                                                this.props.login.userInfo,
                                                                            )
                                                                        ) {
                                                                            return (
                                                                                <Select.Option
                                                                                    key={province.regionId}
                                                                                    value={province.regionId}
                                                                                    allowClear
                                                                                >
                                                                                    {province.regionName}
                                                                                </Select.Option>
                                                                            );
                                                                        }
                                                                    })}
                                                                </Select>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                                {/* <Col span={8}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item
                                                    label="归属地市"
                                                    name="region"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择归属地市/无'
                                                        }
                                                    ]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            return <span>{getFieldValue('region')?.label || '-'}</span>;
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select onFocus={this.getRegionList} allowClear labelInValue>
                                                                    {regionList.map((region) => {
                                                                        return (
                                                                            <Select.Option key={region.regionId} value={region.regionId}>
                                                                                {region.regionName}
                                                                            </Select.Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col> */}
                            </Row>
                            <Row justify="space-around" gutter={24}>
                                <Col span={12}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item
                                                    label="归属监控中心"
                                                    name="center"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择归属监控中心',
                                                        },
                                                    ]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            return <span>{getFieldValue('center')?.label || '-'}</span>;
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select allowClear labelInValue>
                                                                    {centerList.map((center) => {
                                                                        return (
                                                                            <Select.Option key={center.centerId} value={center.centerId}>
                                                                                {center.centerName}
                                                                            </Select.Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item
                                                    label="班组类型"
                                                    name="groupType"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择班组类型',
                                                        },
                                                    ]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            return <span>{getFieldValue('groupType')?.label || '-'}</span>;
                                                        }}
                                                        renderFormItem={() => {
                                                            return <Select allowClear labelInValue options={groupTypeList} />;
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item
                                                    label="专业"
                                                    name="professionalTypes"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择专业',
                                                        },
                                                    ]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            const proTypes = getFieldValue('professionalTypes') || [];
                                                            const professionalTypeSelecteds = proTypes.map((item) => {
                                                                return this.professionalTypesList.find((i) => i.value === item)?.label;
                                                            });
                                                            return <span>{professionalTypeSelecteds.join(';') || '-'}</span>;
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select
                                                                    allowClear
                                                                    mode="multiple"
                                                                    options={this.professionalTypesList}
                                                                    optionFilterProp="label"
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item noStyle>
                                        {!!professionalModule?.length && (
                                            <DndDropdown
                                                data={professionalModule}
                                                onSave={this.onSavemoduleGroup}
                                                fixedTop={1}
                                                // fixedBottom={2}
                                                triggerEl={<Button icon={<Icon antdIcon type="SettingOutlined" />} type="link" />}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="班组人员" required>
                                <EditMode
                                    visible={true}
                                    zoneId={getInitialProvince(this.props.login.systemInfo?.currentZone?.zoneId, this.props.login.userInfo)}
                                    change={this.editChange}
                                    selectUserList={selectUserList}
                                    checkTree={userList}
                                    disabled={mode === 'read'}
                                    parentCanSelect
                                />
                            </Form.Item>
                            <Form.Item label="关联视图">
                                <div className="group-view-container">
                                    {mode === 'read' ? (
                                        <Table columns={this.readtTableConlumns} dataSource={selectedFilters || []} />
                                    ) : (
                                        <Spin spinning={loading}>
                                            <Input.Search
                                                className="view-search"
                                                onChange={(e) => {
                                                    this.handleViewSearchChange(e.target.value, selectedFilters);
                                                }}
                                            />
                                            <ColumnsSortDrag
                                                style={{ width: '100%' }}
                                                columns={this.filterColumns}
                                                selectOptionsList={this.handleDataSource(selectedFilters)}
                                                onChange={this.onFilterSelectedChange}
                                                request={this.loadAllFilters}
                                                allOptionsLabel="所有自定义视图"
                                                selectOptionsLabel="展示自定义视图"
                                                searchParams={{
                                                    pageSize: 20,
                                                    paging: true,
                                                    searchField: 'windowName',
                                                }}
                                            />
                                        </Spin>
                                    )}
                                </div>
                            </Form.Item>
                            <div className="group-view-alarm">
                                <Form.Item label="告警同步" name="synAlarmType" required>
                                    <Radio.Group
                                        onChange={this.onRadioChange}
                                        disabled={editEnumType.READ === editType}
                                        defaultValue={1}
                                        options={[
                                            { label: '同步当前所有活动告警', value: 1 },
                                            { label: '默认时间段', value: 2 },
                                            { label: '请选择同步时间段', value: 3 },
                                        ]}
                                    ></Radio.Group>
                                </Form.Item>
                                <Row>
                                    <Col span={9}></Col>
                                    <Col span={15}>
                                        <Row>
                                            <Col span={9}>
                                                <Form.Item>
                                                    同步前
                                                    <Form.Item
                                                        name="synAlarmDefaultHours"
                                                        noStyle
                                                        rules={[
                                                            {
                                                                validator: async (rule, val) => {
                                                                    const reg = formatReg.positiveInteger;
                                                                    if (val && !reg.test(val)) {
                                                                        throw new Error(`必须为非负整数`);
                                                                    }
                                                                    // eslint-disable-next-line no-restricted-properties
                                                                },
                                                            },
                                                        ]}
                                                    >
                                                        <InputNumber
                                                            min={0}
                                                            maxLength={12}
                                                            disabled={editEnumType.READ === editType || synAlarmType !== 2}
                                                            formater={limitDecimals}
                                                            defaultValue={0}
                                                            parser={limitDecimals}
                                                        />
                                                    </Form.Item>
                                                    小时
                                                </Form.Item>
                                            </Col>
                                            <Col span={15}>
                                                <Form.Item name="synAlarmDate" noStyle shouldUpdate>
                                                    <DateRangeTime
                                                        size="small"
                                                        disabled={editEnumType.READ === editType || synAlarmType !== 3}
                                                        // disabledDate={true}
                                                        format="YYYY-MM-DD"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Spin>
                </Modal>
            </Fragment>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
