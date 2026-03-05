import React, { useEffect, useRef, useState } from 'react';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { getRegionList, getGroupInfo, checkGroupName, getCustomMonitorViews, getGropProfessionalModule } from './api';
import { ModalEnumType, ModeTypeTitle } from './types';
import moment from 'moment';
import { Col, ColumnsSortDrag, Form, Input, InputNumber, Modal, Radio, Row, Select, Spin, Table, message, Button, Icon } from 'oss-ui';
import CustomModalFooter from '@Components/custom-modal-footer';
import Field from '@ant-design/pro-field';
import { getInitialProvince } from './untils';
import EditMode from '../../../../group-manage/maintenance-edit';
import DateRangeTime from '@Components/date-range-time';
import { limitDecimals } from '@Common/format';
import formatReg from '@Common/formatReg';
import { DndDropdown } from '@Pages/components';
import { _ } from 'oss-web-toolkits';
import { BatchGetDictByFieldName } from '@Src/pages/setting/views/reinsurance-record/api';
import './index.less';

type Props = {
    className?: string;
    login: any;
    modalEnumType: ModalEnumType;
    rowDetail: any;
    groupFilterProvince: any;
    onSaveGroupSuccess: ({ _data, values, time }, type: number) => void;
    onModalCancel: () => void;
    provinceList: any[];
    centerList: any[];
    initValue: any;
    cacheGroupList: any[];
    updateGroupList: any[];
};
const INFO_TYPE = {
    default: 0,
    update: 1,
    cache: 2,
};
const readtTableConlumns = [
    {
        title: '视图名称',
        dataIndex: 'windowName',
    },
    {
        title: '创建人',
        dataIndex: 'operateUserName',
    },
];

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

const filterColumns = [
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

function Index(props: Props) {
    const {
        modalEnumType,
        rowDetail,
        groupFilterProvince,
        login,
        onSaveGroupSuccess,
        onModalCancel,
        provinceList,
        centerList,
        initValue,
        cacheGroupList = [],
        updateGroupList = [],
    } = props;
    const uniqGroupList = _.uniqBy([...cacheGroupList, ...updateGroupList], 'title');
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [selectUserList, setSelectUserList] = useState<
        {
            zhName?: any;
            userName?: any;
            userId?: any;
            mobilePhone?: any;
            isLeader?: any;
            userIdNum?: any;
            mobilephone?: any;
        }[]
    >([]);
    const [selectedFilters, setSelectedFilters] = useState<
        {
            windowId?: any;
            windowName?: any;
        }[]
    >([]);
    // const [regionList, setRegionList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userList, setUserList] = useState([]);
    const [synAlarmType, setSynAlarmType] = useState<number>(1);
    const [viewSearchStr, setViewSearchStr] = useState<string>('');
    const [professionalList, setProfessionalList] = useState<any[]>([]);
    const [professionalModule, setProfessionalModule] = useState<any[]>([]);
    const [modulesList, setModulesList] = useState<any[]>([]);
    // const [selectedUserRowKeys, setSelectedUserRowKeys] = useState([]);
    // const [selectedUserRows, setsSelectedUserRows] = useState([]);

    const isCreate = modalEnumType === ModalEnumType.CREATE;
    const isDiabled = modalEnumType === ModalEnumType.VIEW;
    const mode = ModalEnumType.VIEW === modalEnumType ? 'read' : 'edit';
    const title = ModeTypeTitle[modalEnumType];

    const initFormValue = isCreate
        ? {
              ...initValue,
          }
        : {
              ...initValue?.values,
          };

    // 管理反显处理（需要 专业选择过后获取的管理数据和获取到的详情数据进行排序整理）
    const reverseProfessionalModule = (modules = []): any => {
        const list = modules.map((item) => {
            // optionalFlag  0 不可选;1 可选;2 可选,默认选择;3 必选
            return {
                label: item.moduleName,
                checked: Boolean(item.checked),
                id: item.moduleId,
                disabled: item.optionalFlag === 0 || item.optionalFlag === 3,
            };
        });

        return list;
    };

    const formRef: any = useRef();
    /**
     * @description: 加载组信息
     * @param {*}
     * @return {*}
     */

    const loadGroupInfo = async () => {
        if (ModalEnumType.EDIT === modalEnumType || ModalEnumType.VIEW === modalEnumType) {
            // 有组id 并且不在更新组中，才初始化赋值
            if ([INFO_TYPE.update, INFO_TYPE.cache].includes(rowDetail?.type)) {
                console.log('rowDetail', initValue);
                setSelectedFilters(
                    Array.isArray(initValue?._data?.monitorViewList) &&
                        initValue?._data?.monitorViewList.map((item) => {
                            return {
                                ...item,
                                creator: item.userName,
                                id: item.windowId,
                                userName: item.operateUserName,
                            };
                        }),
                );
                setSynAlarmType(initValue?._data?.synAlarmType);
                setUserList(initValue?._data?.groupUserBeanList.map((item) => item?.userId) || []);
                setSelectUserList(initValue?._data?.groupUserBeanList);
                setProfessionalModule(reverseProfessionalModule(initValue?._data?.modules || []));
                return;
            }
            const data = {
                groupId: rowDetail.groupId,
            };
            const res = await getGroupInfo(data);
            if (res) {
                //告警同步需求添加的额外字段
                const extraValue: {
                    synAlarmType: number;
                    synAlarmDefaultHours: any;
                    synAlarmDate: any[];
                } = {
                    synAlarmType: res.synAlarmType,
                    synAlarmDefaultHours: res.synAlarmDefaultHours || 0,
                    synAlarmDate: [],
                };
                if (res.synAlarmType === 3 && res.synAlarmBeginDate && res.synAlarmEndDate) {
                    extraValue.synAlarmDate = [moment(res?.synAlarmBeginDate), moment(res?.synAlarmEndDate)];
                }
                formRef.current.setFieldsValue({
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

                    professionalTypes: res.professionalTypes,
                    ...extraValue,
                });
                res.groupUserBeanList.unshift(
                    res.groupUserBeanList.splice(
                        res.groupUserBeanList.findIndex((itm) => itm.isLeader === 1),
                        1,
                    )[0],
                );

                setProfessionalModule(reverseProfessionalModule(res.modules || []));
                setSynAlarmType(res.synAlarmType);
                setUserList(res.groupUserBeanList.map((item) => item?.userId) || []);
                setSelectUserList(res.groupUserBeanList);
                // setSelectedUserRowKeys((Array.isArray(res.groupUserBeanList) && res.groupUserBeanList.map((item) => item?.userId)) || []);
                // setsSelectedUserRows(res.groupUserBeanList);
                setSelectedFilters(
                    Array.isArray(res.monitorViewList) &&
                        res.monitorViewList.map((item) => {
                            return {
                                ...item,
                                creator: item.userName,
                                id: item.windowId,
                                userName: item.operateUserName,
                            };
                        }),
                );
            }
        } else {
            const userInfo = JSON.parse(login.userInfo);
            if (userInfo?.zones[0].zoneLevel === '3') {
                formRef.current.setFieldsValue({
                    province: {
                        label: groupFilterProvince?.regionName,
                        value: groupFilterProvince?.regionId,
                    },
                    region: { value: userInfo?.zones[0].zoneId, label: userInfo?.zones[0].zoneName },
                });
                handleGetRegionList();
                return;
            }
            formRef.current.setFieldsValue({
                province: {
                    label: groupFilterProvince?.regionName,
                    value: groupFilterProvince?.regionId,
                },
                synAlarmType: 1,
                synAlarmDefaultHours: 0,
            });
            selectProvince(groupFilterProvince?.regionId);
        }
    };

    const handleCancle = () => {
        onModalCancel && onModalCancel();
    };
    const getProvinceByForm = () => {
        const province = formRef.current?.getFieldValue('province');
        return province;
    };
    // 获取地市信息

    const handleGetRegionList = async () => {
        const province = getProvinceByForm();
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
                    formRef.current.setFieldsValue({
                        regionId: userInfo?.zones[0].zoneId,
                    });

                    // setRegionList(res || [])
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
                // setRegionList(res || [])
            }
        } catch (e) {}
    };
    // 检查重名
    const onCheckGroupName = async (groupName, groupId) => {
        const data = {
            groupName,
            groupId,
        };
        const res = await checkGroupName(data);
        return res.code === 200;
    };

    // 保存
    const handleSave = async (params) => {
        const values = await formRef.current.validateFields();

        if (values) {
            const data: any = {
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
                professionalTypes: values.professionalTypes,
                modules: modulesList,
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
            if (ModalEnumType.EDIT === modalEnumType) {
                data.groupId = rowDetail?.groupId;
            }

            if (!selectUserList.length) {
                return message.warn('至少选择一个组员');
            }

            if (!(await onCheckGroupName(values.groupName, rowDetail?.groupId))) {
                message.error('班组名称重复');
                return;
            }
            if (cacheGroupList.length > 8) {
                message.error('单次新增班组最多不超过8');
                return;
            }

            if (modalEnumType === ModalEnumType.CREATE) {
                if (uniqGroupList.find((item) => item._data.groupName === values.groupName)) {
                    message.error('班组名称重复');
                    return;
                }
            } else if (modalEnumType === ModalEnumType.EDIT) {
                const otherList = uniqGroupList.filter((item) => item._data.groupName !== rowDetail.title);

                if (otherList.find((item) => item._data.groupName === values.groupName)) {
                    message.error('班组名称重复');
                    return;
                }
            }
            // if (cacheGroupList?.length || updateGroupList?.length) {
            //     const cachegroupNameIndex = cacheGroupList
            //         ?.filter((item) => Boolean(item))
            //         .findIndex((item) => item?._data?.groupName === values.groupName);
            //     const updategroupNameInex = updateGroupList
            //         ?.filter((item) => Boolean(item))
            //         .findIndex((item) => item?._data?.groupName === values.groupName);
            //     if ((cacheGroupList?.length && !(cachegroupNameIndex === -1)) || (updateGroupList?.length && !(updategroupNameInex === -1))) {
            //         message.error('班组名称重复');
            //         return;
            //     }
            // }

            if (selectedFilters.length > 10) {
                message.warn('最多选择10个自定义视图');
                return;
            }

            setConfirmLoading(false);

            onSaveGroupSuccess(
                {
                    _data: data,
                    values,
                    time: initValue?.time ? initValue?.time : new Date().getTime(),
                },
                rowDetail?.type,
            );
            handleCancle();
        }
    };
    // 默认选择省本部
    const selectProvince = async (value) => {
        const data = {
            parentRegionId: value,
            creator: login.userId,
        };
        const res = await getRegionList(data);
        if (res.filter((item) => item.regionName === '省本部') && res.filter((item) => item.regionName === '省本部')[0]) {
            const regions = res.filter((item) => item.regionName === '省本部')[0];
            formRef.current.setFieldsValue({
                region: {
                    value: regions.regionId,
                    label: regions.regionName,
                },
            });
        } else {
            if (res.length > 0) {
                formRef.current.setFieldsValue({
                    region: { value: res[0].regionId, label: res[0].regionName },
                });
            }
        }
    };

    // 监听省数据变化
    const onProvinceChange = (value) => {
        formRef.current.setFieldsValue({
            province: value,
            region: null,
        });
        selectProvince(value?.key);
        // setRegionList([])
    };

    //
    const editChange = (e, v) => {
        const userList: any[] = [];
        if (v && Array.isArray(v)) {
            v.forEach((item) => {
                userList.push({ ...item.otherInfo, isLeader: item.isLeader });
            });
            setSelectUserList(userList);
            setUserList(e);
        }
    };
    //
    const handleViewSearchChange = (e, list) => {
        setViewSearchStr(e);
    };

    //
    const handleDataSource = (list) => {
        const newList: any = [];
        list.map((item) => {
            if (item.windowName?.indexOf(viewSearchStr) !== -1) {
                newList.push(item);
            }
        });
        return newList;
    };

    // 监听穿梭框

    const onFilterSelectedChange = (selectedRows) => {
        setSelectedFilters(
            selectedRows.map((item) => {
                return {
                    ...item,
                    filterAlias: item.alias,
                };
            }),
        );
    };
    // 加载过滤器
    const loadAllFilters = async (params) => {
        setLoading(true);
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
        setLoading(false);
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
    //
    const onRadioChange = (e) => {
        setSynAlarmType(e.target.value);
    };
    const getProfessionalModuleData = async (professionalTypes) => {
        const res = await getGropProfessionalModule({ professionalTypes });
        if (res.code === 200) {
            const list = res.data.map((item) => {
                // optionalFlag  0 不可选;1 可选;2 可选,默认选择;3 必选
                return {
                    label: item.moduleName,
                    checked: !!(item.optionalFlag === 2 || item.optionalFlag === 3),
                    id: item.moduleId,
                    disabled: !!(item.optionalFlag === 0 || item.optionalFlag === 3),
                };
            });
            setProfessionalModule(list);
        }
    };
    const onFormChange = (changedValues, allValues) => {
        if (changedValues?.professionalTypes) {
            getProfessionalModuleData(changedValues?.professionalTypes);
        }
    };
    const onSavemoduleGroup = (data) => {
        const tmodulesList = data.map((item, index) => {
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
        setModulesList(tmodulesList);
    };
    useEffect(() => {
        loadGroupInfo();
        BatchGetDictByFieldName(['dutyManagerProfession']).then((res) => {
            const result = res.data.dutyManagerProfession.map((item) => ({
                label: item.value,
                value: item.key,
            }));
            setProfessionalList(result);
        });
    }, []);

    return (
        <>
            <Modal
                className={props.className ?? ''}
                visible
                width={1000}
                title={title}
                onCancel={handleCancle}
                maskClosable={false}
                footer={
                    <CustomModalFooter
                        authKey={ModalEnumType.CREATE === modalEnumType ? 'groupManage:add' : 'groupManage:edit'}
                        okText={isDiabled ? null : '确定'}
                        onOk={handleSave}
                        onCancel={handleCancle}
                        confirmLoading={confirmLoading}
                    />
                }
            >
                <Spin spinning={confirmLoading}>
                    <Form ref={formRef} labelAlign="right" initialValues={initFormValue} labelCol={{ span: 6 }} onValuesChange={onFormChange}>
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

                                                // labelCol={4}
                                            >
                                                <Field
                                                    mode={mode}
                                                    render={() => {
                                                        return <span>{getFieldValue('province')?.label || '-'}</span>;
                                                    }}
                                                    renderFormItem={() => {
                                                        if (isCreate) {
                                                            return (
                                                                <Select disabled allowClear onChange={onProvinceChange} labelInValue>
                                                                    {provinceList.map((province): React.ReactNode | void => {
                                                                        if (
                                                                            province.regionId ===
                                                                            getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo)
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
                                                        } else {
                                                            return <Select disabled></Select>;
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
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
                                                            <Select disabled allowClear labelInValue>
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
                                                            return professionalList.find((i) => i.value === item)?.label;
                                                        });
                                                        return <span>{professionalTypeSelecteds.join(';') || '-'}</span>;
                                                    }}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Select allowClear mode="multiple" options={professionalList} optionFilterProp="label" />
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
                                            onSave={(value) => onSavemoduleGroup(value)}
                                            fixedTop={1}
                                            // fixedBottom={2}
                                            triggerEl={<Button icon={<Icon antdIcon type="SettingOutlined" />} type="link" />}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-around" gutter={24}>
                            <Col span={24} style={{ paddingLeft: 8 }}>
                                <Form.Item label="班组人员" required labelCol={{ span: 3 }}>
                                    <EditMode
                                        visible={true}
                                        zoneId={getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo)}
                                        change={editChange}
                                        selectUserList={selectUserList}
                                        checkTree={userList}
                                        disabled={mode === 'read'}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-around" gutter={24}>
                            <Col span={24} style={{ paddingLeft: 8 }}>
                                <Form.Item label="关联视图" labelCol={{ span: 3 }}>
                                    <div className="group-view-container">
                                        {mode === 'read' ? (
                                            <Table columns={readtTableConlumns} dataSource={selectedFilters || []} />
                                        ) : (
                                            <Spin spinning={loading}>
                                                <Input.Search
                                                    className="view-search"
                                                    onChange={(e) => {
                                                        handleViewSearchChange(e.target.value, selectedFilters);
                                                    }}
                                                />
                                                <ColumnsSortDrag
                                                    style={{ width: '100%' }}
                                                    columns={filterColumns}
                                                    selectOptionsList={handleDataSource(selectedFilters)}
                                                    onChange={onFilterSelectedChange}
                                                    request={loadAllFilters}
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
                            </Col>
                        </Row>
                        <div className="group-view-alarm">
                            <Form.Item label="告警同步" name="synAlarmType" required>
                                <Radio.Group
                                    onChange={onRadioChange}
                                    disabled={isDiabled}
                                    defaultValue={1}
                                    options={[
                                        { label: '同步当前所有活动告警', value: 1 },
                                        { label: '默认时间段', value: 2 },
                                        { label: '请选择同步时间段', value: 3 },
                                    ]}
                                />
                            </Form.Item>
                            <Row>
                                <Col span={9} />
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
                                                        disabled={isDiabled || synAlarmType !== 2}
                                                        // formater={limitDecimals}
                                                        defaultValue={0}
                                                        parser={limitDecimals}
                                                    />
                                                </Form.Item>
                                                小时
                                            </Form.Item>
                                        </Col>
                                        <Col span={15}>
                                            <Form.Item name="synAlarmDate" noStyle shouldUpdate>
                                                <DateRangeTime size="small" disabled={isDiabled || synAlarmType !== 3} format="YYYY-MM-DD" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
