/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { Fragment, useState, useRef, useEffect } from 'react';
import {
    Switch,
    Form,
    Row,
    Col,
    Modal,
    InputNumber,
    TimePicker,
    Select,
    DatePicker,
    Radio,
    Input,
    Button,
    Tabs,
    Table,
    Checkbox,
    message,
    Tag,
} from 'oss-ui';
import request from '@Common/api';
import SMSTemplate from '@Components/sms-template';
import Edit from '@Components/sms-template/edit';
import Immutable from 'immutable';
import { _ } from 'oss-web-toolkits';
import { getEditValues, initialValues } from './util';
import formatReg from '@Common/formatReg';
import { limitDecimals } from '@Common/format';
import Field from '@ant-design/pro-field';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';
import { VirtualTable } from 'oss-web-common';
import { useLoading } from '@Common/utils/useLoading';
import UserSelectModal from './user-select-modal';
import produce from 'immer';
import { usePersistFn } from 'ahooks';
import { getRolesDictionary, getSmsDictionary } from '../../api';

const sendSmsNoStr = `该告警是第<send_no>次发送短信`;
const { TabPane } = Tabs;

// const roles = [
//     {
//         value: 'A角',
//         label: 'A角',
//     },
//     {
//         value: 'B角',
//         label: 'B角',
//     },
//     {
//         value: '中心主任',
//         label: '中心主任',
//     },
//     {
//         value: '主管领导',
//         label: '主管领导',
//     },
//     {
//         value: '代维人员',
//         label: '代维人员',
//     },
//     {
//         value: '代维调度中心',
//         label: '代维调度中心',
//     },
//     {
//         value: '代维领导',
//         label: '代维领导',
//     },
//     {
//         value: '省份专业牵头人',
//         label: '省份专业牵头人',
//     },
//     {
//         value: '工单审核人',
//         label: '工单审核人',
//     },
// ];

export default React.forwardRef((props, ref) => {
    const { modelType, mode = 'edit' } = props;
    const ENUMSNUMS = ['一', '二', '三', '四', '五'];
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [tabNum, setTabNum] = useState(
        // eslint-disable-next-line no-nested-ternary
        modelType === 'new'
            ? 1
            : props.initialValues && Array.isArray(props.initialValues) && props.initialValues.find((item) => item.key === 'frequency')
            ? props.initialValues.find((item) => item.key === 'frequency').value
            : 1,
    );
    const [optionKey, setOptionKey] = useState('');
    const [selectValue, setSelectValue] = useState(undefined);
    const [selectCancelValue, setSelectCancelValue] = useState(undefined);
    const [userGroupList, setUserGroupList] = useState([]);
    const [smsTemplateList, setSmsTemplateList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState({ rowKeys: [] });
    const [selectedRowData, setSelectedRows] = useState({});
    const [showTableData, setShowTableData] = useState({});
    const [userTableData, setUserTableData] = useState({ tableData: [] });
    const [tabKey, setTabKey] = useState('0');
    const [sendMode, setSendMode] = useState(0);
    const [provinceData, handleProvinceData] = useState([]);
    const [teamData, handleTeamData] = useState([]);

    // 手机号列表
    const [numList, handleNumList] = useState({});
    const [newNumValue, handleNewNumValue] = useState('');
    const [newNumMValue, handleNewNumMValue] = useState('');
    // 匹配班组手机号列表
    const [mTeamNumList, handleMTeamNumList] = useState({});
    // 选中用户弹窗
    const [userGroupVisible, handleUserGroupVisible] = useState(false);
    const [allCheck, setAllCheck] = useState(false);
    const [customNum, setCustomNum] = useState({});

    // 角色列表
    const [roles, setRoles] = useState([]);

    // 合并短信
    const [smsList, setSmsList] = useState([]);

    // const [sendSmsNo, setSendSmsNo] = useState(false);
    // const [mode, setMode] = useState('edit');
    const [form] = Form.useForm();

    const isEmailSendRule = props.moduleId === 70;

    React.useEffect(() => {
        if (userTableData[`tableData${tabKey}`] && selectedRowData[`${tabKey}`]) {
            const useableData = [];
            userTableData[`tableData${tabKey}`].forEach((i) => {
                if (i.mobilephone && i.mobilephone !== '') {
                    useableData.push(i);
                }
            });
            if (compare(selectedRowData[`${tabKey}`], useableData)) {
                setAllCheck(true);
            } else {
                setAllCheck(false);
            }
        } else {
            setAllCheck(false);
        }
    }, [selectedRowKeys, tabKey, userTableData]);

    const compare = (arrayA, arrayB) => {
        const res = arrayB.filter((item) => !arrayA.map((items) => items.userId).includes(item.userId));
        // let res = _.difference(arrayB, arrayA);
        if (res.length === 0) {
            return true;
        } else {
            return false;
        }
    };

    const handleNumTagClose = (e, field, index) => {
        e.preventDefault();
        const newList = _.cloneDeep(numList);
        newList[field.fieldKey]?.splice(index, 1);
        handleNumList(newList);
        setCustomNum(newList);
    };

    const closeCustomNum = (e, field, index) => {
        e.preventDefault();
        const newList = _.cloneDeep(numList);
        newList[field.fieldKey]?.splice(index, 1);
        setCustomNum(newList);
    };

    const handleMNumTagClose = (e, index1, index2) => {
        e.preventDefault();
        const newList = _.cloneDeep(mTeamNumList);
        newList[index1]?.splice(index2, 1);
        handleMTeamNumList(newList);
    };

    const addCustomNum = (field) => {
        const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
        if (customNum[field.fieldKey] && customNum[field.fieldKey].includes(newNumValue)) {
            return message.warn('手机号重复');
        }
        if (reg.test(newNumValue)) {
            const newList = _.cloneDeep(customNum);
            newList[field.fieldKey] = [...(newList[field.fieldKey] || []), newNumValue];
            handleNewNumValue('');
            handleNumList(newList);
            setCustomNum(newList);
        } else {
            message.warn('手机号格式不对');
        }
    };

    const handleAddNum = (field) => {
        const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
        if (numList[field.fieldKey] && numList[field.fieldKey].includes(newNumValue)) {
            return message.warn('手机号重复');
        }
        if (reg.test(newNumValue)) {
            const newList = _.cloneDeep(numList);
            newList[field.fieldKey] = [...(newList[field.fieldKey] || []), newNumValue];
            handleNewNumValue('');
            handleNumList(newList);
            setCustomNum(newList);
        } else {
            message.warn('手机号格式不对');
        }
    };

    const handleAddMNum = (field) => {
        const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;

        if (mTeamNumList[field.fieldKey] && mTeamNumList[field.fieldKey].includes(newNumMValue)) {
            return message.warn('手机号重复');
        }

        if (reg.test(newNumMValue)) {
            const newList = _.cloneDeep(mTeamNumList);
            newList[field.fieldKey] = [...(newList[field.fieldKey] || []), newNumMValue];
            handleNewNumMValue('');
            handleMTeamNumList(newList);
        } else {
            message.warn('手机号格式不对');
        }
    };

    const handleKeyPress = (type, filed) => {
        if (mode !== 'read') {
            if (type === 'custom') {
                handleAddNum(filed);
            } else {
                handleAddMNum(filed);
            }
        }
    };

    const popRender = (type, field) => {
        const reg = /^1([0-9]*)?$/;
        return (
            <div>
                <Input
                    disabled={mode === 'read'}
                    onPressEnter={() => {
                        handleKeyPress(type, field);
                    }}
                    placeholder="请输入手机号"
                    value={type === 'custom' ? newNumValue : newNumMValue}
                    onChange={(e) => {
                        if ((reg.test(e.target.value) && e.target.value.length < 12) || e.target.value === '') {
                            if (type === 'custom') {
                                handleNewNumValue(e.target.value);
                            } else {
                                handleNewNumMValue(e.target.value);
                            }
                        }
                    }}
                />
            </div>
        );
    };

    React.useEffect(() => {
        if (modelType !== 'new') {
            setTabNum(
                props.initialValues && Array.isArray(props.initialValues) && props.initialValues.find((item) => item.key === 'frequency')
                    ? props.initialValues.find((item) => item.key === 'frequency').value
                    : 1,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialValues]);

    React.useEffect(() => {
        if (sendMode !== 0) {
            return;
        }
        // if (!(modelType === 'new') && ref.current) {
        const editDefaultValues = getEditValues(props.initialValues);
        const editValues = form.getFieldsValue();
        const newList = _.cloneDeep(editValues.everyTimes) || _.cloneDeep(editDefaultValues.everyTimes);
        newList.map((item, index) => {
            return (item.temporaryNum = numList[index]?.toString());
        });
        ref?.current?.setFieldsValue({ everyTimes: newList });
        // }else {
        //     const editDefaultValues = getEditValues(props.initialValues);
        //     const editValues = form.getFieldsValue();
        //     const newList = _.cloneDeep(editValues.everyTimes) || _.cloneDeep(editDefaultValues.everyTimes)
        //     newList.map((item,index)=>{
        //         return item.temporaryNum = numList[index]?.toString()
        //     })
        //     ref?.current?.setFieldsValue({everyTimes: newList})
        // }
    }, [form, numList, props.initialValues, ref]);

    React.useEffect(() => {
        if (sendMode !== 3) {
            return;
        }
        const editDefaultValues = getEditValues(props.initialValues);
        const editValues = form.getFieldsValue();
        const newList = _.cloneDeep(editValues.everyTimes) || _.cloneDeep(editDefaultValues.everyTimes);
        newList.map((item, index) => {
            return (item.temporaryNum = mTeamNumList[index]?.toString());
        });
        ref?.current?.setFieldsValue({ everyTimes: newList });
    }, [mTeamNumList, ref, form, props.initialValues]);

    const [addUser, addUserLoading] = useLoading(async () => {
        await getUserTableData(tabKey, userGroupList[0]?.value);
        const values = form.getFieldValue('everyTimes');
        values.forEach((item) => {
            item.userGroup = userGroupList[0]?.value;
        });
        form.setFieldsValue({ everyTimes: [...values] });
        handleUserGroupVisible(true);
    });

    const getTeamInfo = (data) => {
        return new Promise((reslove) => {
            request('alarmResourceByeoms/queryMainTainTeamInfo', {
                type: 'post',
                baseUrlType: 'groupUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取班组数据失败，请检查服务filterUrl',
                data,
            }).then((res) => {
                reslove(res.rows);
            });
        });
    };

    // 获取维护班组列表
    const getTeam = (data) => {
        getTeamInfo({
            pageNumNew: 1,
            pageSizeNew: 9000,
            provinceId: data,
            userId: props.login.userId,
        }).then((res) => {
            if (res && Array.isArray(res)) {
                handleTeamData(res);
            }
        });
    };

    const setInitialValues = () => {
        if (!(modelType === 'new') && ref.current) {
            const editValues = getEditValues(props.initialValues);
            console.log(editValues, '==editValues');
            if (editValues.smsTitle && editValues.smsTitle.indexOf(sendSmsNoStr) !== -1) {
                const pattern = new RegExp(sendSmsNoStr, 'g');
                editValues.smsTitle = editValues.smsTitle.replace(pattern, '');
                editValues.sendNo = true;
            }
            ref.current.setFieldsValue(editValues);
            setSendMode(editValues.sendMode);

            const newList = _.cloneDeep(editValues.everyTimes);
            newList.map((item, index) => {
                if (item.temporaryNum) {
                    numList[index] = item.temporaryNum.split(',');
                }
            });
            if (editValues.sendMode === 3) {
                handleMTeamNumList(numList);
                getTeam(editValues.everyTimes[0]?.province.value);
            } else {
                handleNumList(numList);
                setCustomNum(numList);
            }
        }
    };

    const showSMSTemplateClick = () => {
        setVisible(true);
    };
    const showSMSTemplateEditClick = () => {
        setEditVisible(true);
    };
    const onEditVisibleChange = (isVisible) => {
        setEditVisible(isVisible);
    };
    const onCancel = () => {
        setVisible(false);
    };
    const tabNumChange = (value) => {
        if (/^[1-5]$/.test(value)) {
            setTabNum(value);
        }
        if (!value) {
            setTabNum(1);
        }
    };

    const getUserShowData = (ids) => {
        if (!ids) {
            return { data: [] };
        }
        // userIdList和groupId不可同时传
        return request('alarmmodel/filter/v1/filter/userinfo', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
                userIdList: ids,
            },
        });
    };

    const getUserTableData = async (key, groupId) => {
        if (!groupId) {
            return;
        }
        const res = await request('alarmmodel/filter/v1/filter/userinfo', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                groupId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        });
        if (res && res.data) {
            if (key != null) {
                setUserTableData({ ...userTableData, [`tableData${key}`]: res.data });
            } else {
                setUserTableData({ ...userTableData, tableData: res.data });
            }
        }
    };

    const getProvinces = () => {
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                pageSize: 50,
                dictName: 'province_id',
                en: false,
                modelId: 2,
                creator: props.login.userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                handleProvinceData(res.data);

                if (res.data.length === 1) {
                    getTeam(res.data[0].key);
                }
            }
        });
    };

    const userGroupChang = (value, option, key) => {
        const values = form.getFieldValue('everyTimes');
        values[key].userGroup = value;
        form.setFieldsValue({ everyTimes: [...values] });
        getUserTableData(key, value);
    };

    const getSmsTemplateList = (content, name) => {
        request('alarmmodel/filter/v1/filter/smsTemplate', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                userName: props.login.userName,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data) {
                setOptionKey(res.data.optionKey);
                if (res.data.smsTemplateList && res.data.smsTemplateList.length) {
                    const smsList = res.data.smsTemplateList.map((item) => ({
                        key: item.templateName,
                        label: item.templateName,
                        value: item.templateContent,
                    }));
                    if (selectValue === name && form && content) {
                        form.setFieldsValue({ smsTitle: content });
                    }
                    setSelectValue(undefined);
                    setSelectCancelValue(undefined);
                    // form.setFieldsValue({ smsTitle: '', cancelTitle: '' });
                    setSmsTemplateList(smsList);
                }
            } else if (res && !res.data) {
                // 后端没数据时无法返回optionKey，需要从上层获取
                setOptionKey(props.login.userName);
                setSmsTemplateList([]);
            }
        });
    };
    const renderTabs = usePersistFn(() => {
        const tabArr = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 1; i <= tabNum; i++) {
            tabArr.push({
                id: i,
                name: `第${ENUMSNUMS.find((item, index) => index + 1 === i)}次`,
                userGroup: undefined,
                times: i === 1 ? undefined : sendMode === 3 ? 1 : 0,
                userIds: '',
                province:
                    sendMode === 3 && provinceData.length === 1
                        ? {
                              label: provinceData[0].value,
                              value: provinceData[0].key,
                          }
                        : undefined,
            });
        }
        if (tabNum < form.getFieldValue('everyTimes').length) {
            const $newData = Immutable.fromJS(form.getFieldValue('everyTimes'));
            form.setFieldsValue({ everyTimes: $newData.setSize(tabNum).toJS() });
        } else if (form.getFieldValue('everyTimes').length === 1 && !form.getFieldValue('everyTimes')[0].id) {
            form.setFieldsValue({ everyTimes: tabArr });
        } else {
            form.setFieldsValue({
                everyTimes: _.unionBy(form.getFieldValue('everyTimes'), tabArr, 'id'),
            });
        }
    });

    const disabledDate = (current) => {
        // Can not select days before beigin date
        return current && current < form.getFieldValue('startForwardDate')?.endOf('day');
    };
    const disabledDateBegin = (current) => {
        // Can not select days after end date
        if (!form.getFieldValue('endForwardDate')) {
            return false;
        }
        return current && current > form.getFieldValue('endForwardDate');
    };

    const getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    const getUserGroupList = () => {
        const { login } = props;
        const provinceId = getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
        const info = login.userInfo && JSON.parse(login.userInfo);
        const { zones } = info;
        request('alarmmodel/filter/v1/filter/usergroup', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
                userId: props.login.userId,
                zoneId: provinceId,
                zoneLevel: zones[0].zoneLevel,
            },
        }).then((res) => {
            if (res && res.data) {
                const list = res.data.map((item) => ({
                    label: item.groupName,
                    value: item.groupId,
                }));
                setUserGroupList(list);
                const newEveryTimes = _.cloneDeep(form.getFieldValue('everyTimes')).map((item) => {
                    return { ...item, userGroup: list[0]?.value };
                });
                form.setFieldsValue({ everyTimes: newEveryTimes });
                getUserTableData(0, list[0]?.value);
            }
        });
    };

    const onAllCheck = (fieldName) => {
        if (allCheck) {
            const keyss = userTableData[`tableData${tabKey}`]
                .filter((item) => item.mobilephone)
                .map((i) => {
                    return i.userId;
                });
            const dataKeys = selectedRowKeys[`${fieldName}_rowKeys`] || [];
            const dataRows = selectedRowData[fieldName] || [];
            const newKeys = dataKeys.filter((item) => !keyss.includes(item));
            const newDataRows = dataRows.filter((item) => !keyss.includes(item.userId));
            rowChange(newKeys, newDataRows, fieldName);
        } else {
            // const keys = userTableData[`tableData${tabKey}`].map((i) => {
            //     if (i.mobilephone && i.mobilephone !== '') {
            //         return i.userId;
            //     }
            // });
            const keys = [];
            const newDataRows = [];
            userTableData[`tableData${tabKey}`].forEach((i) => {
                if (i.mobilephone && i.mobilephone !== '') {
                    keys.push(i.userId);
                    newDataRows.push(i);
                }
            });
            console.log(keys, newDataRows, fieldName);
            rowChange(keys, newDataRows, fieldName);
        }
    };

    const rowChange = (keys, selectedRows, fieldName) => {
        // let rows = []
        // let list = []
        // if (selectedRowData[fieldName] && selectedRowKeys[`${fieldName}_rowKeys`]) {
        //   rows = [...selectedRowData[fieldName]]
        //   list = [...selectedRowKeys[`${fieldName}_rowKeys`]]
        // }
        // if (list.includes(selectedRows.userId)) {
        //   _.pull(list, selectedRows.userId)
        //   _.pullAt(
        //     rows,
        //     rows.findIndex((item) => item.userId === selectedRows.userId),
        //   )
        // } else {
        //   list.push(selectedRows.userId)
        //   rows.push(selectedRows)
        // }
        const keyss = userTableData[`tableData${tabKey}`].map((i) => {
            return i.userId;
        });
        const dataKeys = selectedRowKeys[`${fieldName}_rowKeys`] || [];
        const dataRows = selectedRowData[fieldName] || [];
        const newKeys = dataKeys.filter((item) => !keyss.includes(item)) || [];
        const newDataRows = dataRows.filter((item) => !keyss.includes(item.userId)) || [];
        const data = {
            ...selectedRowData,
            [fieldName]: [...newDataRows, ...selectedRows],
        };
        setSelectedRows(data);

        setSelectedRowKeys({
            ...selectedRowKeys,
            [`${fieldName}_rowKeys`]: [...newKeys, ...keys],
        });

        const seleList = { ...selectedRowData, [fieldName]: selectedRows };
        const everyTimesList = _.cloneDeep(form.getFieldValue('everyTimes'));
        everyTimesList[fieldName].userIds = seleList[fieldName]?.map((item) => item.userId).join();
        form.setFieldsValue({ everyTimes: everyTimesList });
    };

    const setSmsContentValue = (value) => {
        form.setFieldsValue({ smsTitle: value });
        if (form.getFieldValue('isUseSmsTitle')) {
            form.setFieldsValue({
                cancelTitle: `告警已于<cancel_time>清除 ${value})}`,
            });
        }
    };
    React.useEffect(() => {
        if (isEmailSendRule) {
            updateSelectedUserDataFromNumChange();

            return;
        }
        renderTabs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabNum]);
    React.useEffect(() => {
        getUserGroupList();
        // getUserTableData();
        getSmsTemplateList();
        getProvinces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        setInitialValues();
        const keyObj = {};
        const defaultData = {};
        const everyList = form.getFieldValue('everyTimes') || [];
        form.getFieldValue('everyTimes').forEach((item, index) => {
            keyObj[`${index}_rowKeys`] = item.userIds ? item.userIds.split(',') : [];
        });
        Promise.all(
            everyList.map((item, index) => {
                if (item.userIds) {
                    return new Promise((resolve, reject) => {
                        getUserShowData(item.userIds).then((res) => {
                            resolve((defaultData[index] = _.uniqBy(res.data, 'userId')));
                        });
                    });
                }
            }),
        ).then((res) => {
            setShowTableData(res);
            setSelectedRows(res);
        });

        setSelectedRowKeys({ ...selectedRowKeys, ...keyObj });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialValues]);

    const handleProvinceChange = (e, field) => {
        const everyTimesValue = form.getFieldsValue().everyTimes;
        everyTimesValue[field.name].relatedMeTeam = [];
        everyTimesValue[field.name].receiver = [];
        everyTimesValue[field.name].province = e;
        form.setFieldsValue({
            everyTimes: everyTimesValue,
        });
        getTeam(e.value);
    };

    const handleRelatedMeTeamChange = (e, field) => {
        const everyTimesValue = form.getFieldsValue().everyTimes;
        everyTimesValue[field.name].relatedMeTeam = e;
        form.setFieldsValue({
            everyTimes: everyTimesValue,
        });
    };
    const smsTitleChange = (e) => {
        setSmsContentValue(e.target.value);
    };

    const changeTab = (activeKey) => {
        if (activeKey !== tabKey) {
            const list = form.getFieldValue('everyTimes');
            const smsFlag = !form.getFieldValue('notificationType')?.includes('1') && props.moduleId === 4; // 短信规则未勾选短信
            const newList = ref.current.getFieldsValue().everyTimes;
            const num = list.findIndex((item, index) => {
                if (index < activeKey) {
                    if (sendMode === 3) {
                        return !item.receiver || item.receiver.length === 0 || !item.relatedMeTeam || item.relatedMeTeam.length === 0;
                    }
                    return !item.userIds && !item.temporaryNum;
                }
            });
            if (num === -1 || smsFlag) {
                if (sendMode === 3) {
                    const num1 = list.slice(1, activeKey).findIndex((item) => {
                        return !item.times;
                    });

                    if (num1 > -1 && !smsFlag) {
                        message.error(`第${num1 + 2}次前转未设置时间间隔，请设置`);
                        return;
                    }
                }
                setTabKey(activeKey);
                if (sendMode === 3) {
                    if (list[activeKey].province) {
                        getTeam(list[activeKey].province.value);
                    } else {
                        if (provinceData.length === 1) {
                            const oldValue = form.getFieldsValue().everyTimes;
                            form.setFieldsValue({
                                everyTimes: produce(oldValue, (draft) => {
                                    // eslint-disable-next-line no-param-reassign
                                    draft[activeKey].province = {
                                        label: provinceData[0].value,
                                        value: provinceData[0].key,
                                    };
                                }),
                            });
                            getTeam(provinceData[0].key);
                        } else {
                            handleTeamData([]);
                        }
                    }
                } else {
                    getUserTableData(activeKey, newList[activeKey]?.userGroup || userGroupList[0]?.value);
                }
            } else {
                if (!smsFlag) {
                    message.error(`第${num + 1}次前转未设置用户，请设置`);
                }
            }
        }
    };
    const noEndDateChange = (e) => {
        if (e.target.checked) {
            form.setFieldsValue({ endForwardDate: null });
            form.validateFields(['endForwardDate']);
        }
    };

    const handleFormChange = (value) => {
        if (Object.keys(value).toString() === 'isUseSmsTitle') {
            if (value.isUseSmsTitle) {
                form.setFieldsValue({
                    cancelTitle: `告警已于<cancel_time>清除 ${form.getFieldValue('smsTitle')}`,
                });
            }
        }
        if (Object.keys(value).toString() === 'sendMode') {
            form.setFieldsValue({
                everyTimes: [],
            });
            setCustomNum({});
            setShowTableData({});
            handleNumList([]);
            handleMTeamNumList([]);
            setSendMode(value.sendMode);
            setSelectedRows([]);
            setSelectedRowKeys({});
            setTimeout(() => {
                renderTabs();
            });
        }
    };

    const onUserModalOk = (fieldName) => {
        const everyTimesList = _.cloneDeep(form.getFieldValue('everyTimes'));
        everyTimesList[fieldName].userIds = selectedRowData[fieldName]?.map((item) => item.userId).join();
        form.setFieldsValue({ everyTimes: everyTimesList });
        handleNumList({ ...customNum });
        handleNewNumValue('');
        handleUserGroupVisible(false);
        setShowTableData(selectedRowData);
    };

    const closeUserGroupModal = () => {
        handleNewNumValue('');
        setCustomNum({ ...numList });
        handleUserGroupVisible(false);
    };

    const handleDeleteUser = (values, key) => {
        const newData = JSON.parse(JSON.stringify(showTableData));
        const newKeys = JSON.parse(JSON.stringify(selectedRowKeys));
        const newSelectData = JSON.parse(JSON.stringify(selectedRowData));
        const newTimes = JSON.parse(JSON.stringify(form.getFieldValue('everyTimes')));
        const userIds = newTimes[key]?.userIds?.split(',');

        userIds.splice(
            userIds.findIndex((item) => item === values.userId),
            1,
        );

        const newTime = { ...newTimes[key], userIds: userIds.toString() };

        const newArr = [];
        newTimes.map((item) => {
            if (item.id === key + 1) {
                newArr.push(newTime);
            } else {
                newArr.push(item);
            }
        });

        form.setFieldsValue({ everyTimes: newArr });

        newData[key]?.splice(
            newData[key].findIndex((item) => item.userId === values.userId),
            1,
        );
        newSelectData[key]?.splice(
            newSelectData[key].findIndex((item) => item.userId === values.userId),
            1,
        );
        newKeys[`${key}_rowKeys`]?.splice(
            newKeys[`${key}_rowKeys`].findIndex((item) => item == values.userId),
            1,
        );

        setShowTableData({ ...showTableData, [key]: newData[key] });
        setSelectedRows({ ...selectedRowData, [key]: newSelectData[key] });
        setSelectedRowKeys({
            ...selectedRowKeys,
            [`${key}_rowKeys`]: newKeys[`${key}_rowKeys`],
        });
    };

    const isShowError = (data, name) => {
        const tableData = data[`tableData${name}`] ? data[`tableData${name}`] : data.tableData;
        let res = false;
        if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            res = tableData.some((item) => {
                return !item.mobilephone || item.mobilephone === '';
            });
        }
        return res;
    };

    const intervalValidate = async (rule, value) => {
        if (!value || value < 0 || !/^[0-9]*$/.test(value.toString()) || value.toString().length > 5) {
            throw new Error('请输入一个五位数以内的正整数');
        }
    };

    //#region 邮件发送规则模块处理代码
    const [tabKeyEmail, setTabKeyEmail] = useState({ agent: '0', copy: '0' });
    const [emailReceiverAddVisible, setEmailReceiverAddVisible] = useState(false);
    const emailReceiverAddModalRef = useRef(null);
    const addReceiverEmailDestTypeRef = useRef();
    const [selectedUserData, setSelectedUserData] = useState({
        agent: {
            0: {
                interval: 0,
                users: [],
                temps: [],
            },
        },
        copy: {
            0: {
                interval: 0,
                users: [],
                temps: [],
            },
        },
    });

    useEffect(() => {
        if (isEmailSendRule && modelType === 'edit') {
            const editDefaultValues = getEditValues(props.initialValues);
            const emailReceiverInfo = editDefaultValues.emailReceiverInfo;
            // 取出主送人和抄送人的值 格式化为selectedUserData的格式
            // 返回的是用户id 需要查找数据
            const agentValues = Object.values(emailReceiverInfo.agent) || [];
            const copyValues = Object.values(emailReceiverInfo.copy) || [];

            Promise.all([
                ...agentValues.map((item) => {
                    return new Promise((resolve, reject) => {
                        if (item.users) {
                            getUserShowData(item.users).then((res) => {
                                resolve(res.data);
                            });
                        } else {
                            resolve([]);
                        }
                    });
                }),
                ...copyValues.map((item) => {
                    return new Promise((resolve, reject) => {
                        if (item.users) {
                            getUserShowData(item.users).then((res) => {
                                resolve(res.data);
                            });
                        } else {
                            resolve([]);
                        }
                    });
                }),
            ]).then((res) => {
                const agentArr = res.slice(0, agentValues.length);
                const copyArr = res.slice(copyValues.length);
                agentArr.forEach((item, index) => {
                    emailReceiverInfo.agent[index].users = item;
                });
                copyArr.forEach((item, index) => {
                    emailReceiverInfo.copy[index].users = item;
                });
                console.log(emailReceiverInfo);
                setSelectedUserData(emailReceiverInfo);
            });
        }
    }, [props.initialValues]);

    useEffect(() => {
        form.setFieldsValue({ emailSendRuleReceiverInfo: selectedUserData });
    }, [selectedUserData]);

    useEffect(() => {
        getRolesDictionary().then((res) => {
            if (res && res.data) {
                setRoles(res.data.map((item) => ({ label: item.dName, value: item.dName })));
            }
        });
        getSmsDictionary().then((res) => {
            if (res && res.data) {
                setSmsList(res.data.map((item) => ({ label: item.fieldLabel, value: item.fieldName })));
            }
        });
    }, []);

    // 次数改变后 修改用户数据  在tabNumChange中调用
    function updateSelectedUserDataFromNumChange() {
        setSelectedUserData((prev) => {
            return produce(prev, (draft) => {
                const majorEntries = Object.entries(draft.agent);
                const prevTimes = majorEntries.length;

                if (tabNum < prevTimes) {
                    draft.agent = Object.fromEntries(Object.entries(draft.agent).slice(0, tabNum));
                    draft.copy = Object.fromEntries(Object.entries(draft.copy).slice(0, tabNum));
                } else {
                    function genNew(prevData) {
                        return Array(tabNum - prevTimes)
                            .fill(undefined)
                            .reduce((accu, item, index) => {
                                return {
                                    ...accu,
                                    [index + prevTimes]: {
                                        interval: 0,
                                        users: [],
                                        temps: [],
                                    },
                                };
                            }, prevData);
                    }

                    draft.agent = genNew(draft.agent);
                    draft.copy = genNew(draft.copy);
                }
            });
        });
    }

    function changeEmailTab(activeKey, type) {
        addReceiverEmailDestTypeRef.current = type;

        if (activeKey !== tabKeyEmail[type]) {
            const prevUsers = selectedUserData[type][tabKeyEmail[type]];

            if (prevUsers?.users.length > 0) {
                setTabKeyEmail((prev) => ({ ...prev, [type]: activeKey }));
            } else {
                message.error(`第${parseInt(tabKeyEmail[type]) + 1}次未设置用户，请设置`);
            }
        }
    }

    function handleEmailReceiverClick(type) {
        addReceiverEmailDestTypeRef.current = type;
        setEmailReceiverAddVisible(true);
    }

    function onEmailReceiverModalOk() {
        const temp = emailReceiverAddModalRef.current.getValues();

        setSelectedUserData((prev) => {
            return produce(prev, (draft) => {
                draft[addReceiverEmailDestTypeRef.current] = temp;
            });
        });

        setEmailReceiverAddVisible(false);
    }
    function onEmailReceiverModalCancel() {
        setEmailReceiverAddVisible(false);
    }

    function handleDeleteEmailUser(type, index) {
        setSelectedUserData((prev) => {
            return produce(prev, (draft) => {
                draft[type][tabKeyEmail[type]].users.splice(index, 1);
            });
        });
    }

    function handleDeleteEmailTempUser(type, index) {
        setSelectedUserData((prev) => {
            return produce(prev, (draft) => {
                draft[type][tabKeyEmail[type]].temps.splice(index, 1);
            });
        });
    }
    function handleEmailSendInterval(value, type) {
        setSelectedUserData((prev) => {
            return produce(prev, (draft) => {
                draft[type][tabKeyEmail[type]].interval = value;
            });
        });
    }

    const genEmailReceiversElement = () => {
        return (
            <Row>
                <Col span={20} offset={4}>
                    {[
                        { label: '主送人', value: 'agent' },
                        { label: '抄送人', value: 'copy' },
                    ].map((item) => {
                        return (
                            <Fragment key={item.value}>
                                <Button onClick={() => handleEmailReceiverClick(item.value)} disabled={mode === 'read'}>
                                    添加{item.label}
                                </Button>
                                <Tabs type="card" onChange={(activeKey) => changeEmailTab(activeKey, item.value)} activeKey={tabKeyEmail[item.value]}>
                                    {Object.values(selectedUserData[item.value]).map((itemIn, indexIn) => {
                                        return (
                                            <TabPane tab={`第${ENUMSNUMS[indexIn]}次`} key={indexIn}>
                                                {item.value === 'agent' && indexIn !== 0 && (
                                                    <Col span={16}>
                                                        <Form.Item labelCol={{ span: 8 }} label="时间间隔（分钟）">
                                                            <InputNumber
                                                                style={{ marginLeft: 5 }}
                                                                min={0}
                                                                formater={limitDecimals}
                                                                parser={limitDecimals}
                                                                value={itemIn.interval}
                                                                onChange={(value) => {
                                                                    handleEmailSendInterval(value, item.value);
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                )}
                                                <Table
                                                    rowKey={(record) => `${record.userId}`}
                                                    bordered
                                                    scroll={{ y: 230 }}
                                                    dataSource={itemIn.users}
                                                    pagination={false}
                                                    columns={[
                                                        {
                                                            dataIndex: 'groupNames',
                                                            title: '用户组',
                                                            width: 200,
                                                            ellipsis: true,
                                                        },
                                                        {
                                                            dataIndex: 'userName',
                                                            title: '用户名',
                                                        },
                                                        {
                                                            dataIndex: 'email',
                                                            title: '邮箱',
                                                            ellipsis: true,
                                                        },
                                                        {
                                                            dataIndex: 'option',
                                                            title: '操作',
                                                            width: 80,
                                                            render: (text, record, index) => {
                                                                return (
                                                                    <Button
                                                                        onClick={() => {
                                                                            handleDeleteEmailUser(item.value, index);
                                                                        }}
                                                                        disabled={mode === 'read'}
                                                                    >
                                                                        删除
                                                                    </Button>
                                                                );
                                                            },
                                                        },
                                                    ]}
                                                />
                                                <Form.Item label={`临时${item.label}邮箱`} labelCol={1} style={{ marginLeft: 0, marginTop: 10 }}>
                                                    <Row gutter={24}>
                                                        <Col span={20}>
                                                            <div className="phone-form-container">
                                                                {itemIn.temps?.map((itemTemp, index) => {
                                                                    return (
                                                                        <Tag
                                                                            key={index}
                                                                            onClose={(e) => {
                                                                                handleDeleteEmailTempUser(item.value, index);
                                                                            }}
                                                                            closable={mode !== 'read'}
                                                                        >
                                                                            {itemTemp}
                                                                        </Tag>
                                                                    );
                                                                })}
                                                            </div>
                                                            {/* <Form.Item noStyle>
                                                                <Input style={{ marginLeft: 5 }} allowClear />
                                                            </Form.Item> */}
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            </TabPane>
                                        );
                                    })}
                                </Tabs>
                            </Fragment>
                        );
                    })}
                    {/* 占位字段 */}
                    <Form.Item hidden name="emailSendRuleReceiverInfo"></Form.Item>
                    <Modal
                        width="80vw"
                        destroyOnClose
                        visible={emailReceiverAddVisible}
                        onCancel={onEmailReceiverModalCancel}
                        className="message-user-group-modal"
                        onOk={onEmailReceiverModalOk}
                    >
                        <UserSelectModal
                            ref={emailReceiverAddModalRef}
                            userGroupList={userGroupList}
                            ruleType="email"
                            mode={mode}
                            tabKey={tabKeyEmail[addReceiverEmailDestTypeRef.current]}
                            options={{ showInterval: addReceiverEmailDestTypeRef.current === 'agent' }}
                            initData={selectedUserData[addReceiverEmailDestTypeRef.current]}
                        />
                    </Modal>
                </Col>
            </Row>
        );
    };
    //#endregion

    return (
        <>
            <div style={{ marginBottom: '16px' }}>规则动作:</div>
            {/* <Radio.Group onChange={(e) => setMode(e.target.value)} value={mode}>
                <Radio value="read">只读</Radio>
                <Radio value="edit">编辑</Radio>
            </Radio.Group> */}
            <Form
                initialValues={initialValues} // , transformMode: props.moduleId
                labelCol={{ span: 4 }}
                form={form}
                ref={ref}
                onValuesChange={(e) => {
                    handleFormChange(e);
                }}
            >
                {props.moduleId === 4 && (
                    <Form.Item name="notificationType" labelCol={{ span: 4 }} label="通知方式" rules={[{ required: true, message: '不能为空' }]}>
                        <Checkbox.Group>
                            <Checkbox value="1">短信</Checkbox>
                            <Checkbox value="2">钉钉</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                )}
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Input.Group>
                                <Row gutter={8}>
                                    <Col span={10}>
                                        <Form.Item
                                            label="延迟时间（分钟）"
                                            name="delayTime"
                                            labelCol={{
                                                span: 12,
                                            }}
                                            rules={[
                                                { required: true, message: '不能为空' },
                                                {
                                                    validator: async (rule, val) => {
                                                        const reg = formatReg.positiveInteger;
                                                        if (val && !reg.test(val)) {
                                                            throw new Error(`必须为非负整数`);
                                                        }

                                                        // eslint-disable-next-line no-restricted-properties
                                                        const max = Math.pow(10, 12) - 1;
                                                        if (val && val > max) {
                                                            throw new Error(`可输入的最大值为${max}`);
                                                        }
                                                    },
                                                },
                                            ]}
                                        >
                                            <Field
                                                mode={mode}
                                                renderFormItem={() => {
                                                    return <InputNumber min={0} maxLength={12} formater={limitDecimals} parser={limitDecimals} />;
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    {props.moduleId === 4 && (
                                        <Col>
                                            <Form.Item name="isDisplayInSms" valuePropName="checked">
                                                <Checkbox disabled={mode === 'read'}>通知内容中显示</Checkbox>
                                            </Form.Item>
                                        </Col>
                                    )}
                                </Row>
                            </Input.Group>
                        );
                    }}
                </Form.Item>
                <Row gutter={24}>
                    <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        启用时间<span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={20}>
                        <Row>
                            <Col span={3}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item valuePropName="checked" name="modifyUseTime">
                                                <Field
                                                    mode={mode}
                                                    render={() => {
                                                        return getFieldValue('modifyUseTime') ? '开' : '关';
                                                    }}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Switch
                                                                checked={getFieldValue('modifyUseTime')}
                                                                size="small"
                                                                checkedChildren="开"
                                                                unCheckedChildren="关"
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                name="timePeriod"
                                                labelCol={{ span: 8 }}
                                                rules={[
                                                    {
                                                        validator: async (rule, val) => {
                                                            const remark = getFieldValue('modifyUseTime');
                                                            if (remark) {
                                                                if (!val) {
                                                                    throw new Error('不能为空');
                                                                }
                                                                if (val[0].format() === val[1].format()) {
                                                                    throw new Error('开始时间不能等于结束时间');
                                                                }
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Field
                                                    mode={mode}
                                                    valueType="timeRange"
                                                    text={getFieldValue('timePeriod')}
                                                    renderFormItem={() => {
                                                        return (
                                                            <TimePicker.RangePicker
                                                                format="HH:mm:ss"
                                                                disabled={!getFieldValue('modifyUseTime')}
                                                                placeholder={['开始日期', '结束日期']}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
                        {isEmailSendRule ? '发送日期' : '前转日期'}
                        <span style={{ margin: '0 8px 0 2px' }}>:</span>
                    </Col>
                    <Col span={20}>
                        <Row>
                            <Col span={3}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item valuePropName="checked" name="forwardDate">
                                                {/* <Switch size="small" checkedChildren="开" unCheckedChildren="关" onChange={forwardDateChange}></Switch> */}
                                                <Field
                                                    mode={mode}
                                                    render={() => {
                                                        return getFieldValue('forwardDate') ? '开' : '关';
                                                    }}
                                                    renderFormItem={() => {
                                                        return (
                                                            <Switch
                                                                checked={getFieldValue('forwardDate')}
                                                                size="small"
                                                                checkedChildren="开"
                                                                unCheckedChildren="关"
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                labelAlign="left"
                                                labelCol={{ span: 10 }}
                                                label="开始日期"
                                                name="startForwardDate"
                                                dependencies={['endForwardDate']}
                                                rules={[
                                                    {
                                                        validator: async (rule, val) => {
                                                            const switchforwardDate = getFieldValue('forwardDate');
                                                            if (switchforwardDate) {
                                                                if (!val) {
                                                                    throw new Error('开始时间不能为空');
                                                                }
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Field
                                                    mode={mode}
                                                    valueType="date"
                                                    text={getFieldValue('startForwardDate')}
                                                    renderFormItem={() => {
                                                        return (
                                                            <DatePicker
                                                                disabledDate={disabledDateBegin}
                                                                format="YYYY-MM-DD"
                                                                disabled={!getFieldValue('forwardDate')}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                {/* <Space> */}
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item
                                                name="endForwardDate"
                                                labelAlign="left"
                                                labelCol={{ span: 8 }}
                                                label="结束日期"
                                                rules={[
                                                    {
                                                        validator: async (rule, val, callback) => {
                                                            const remark = getFieldValue('forwardDate') && !getFieldValue('noEndDate');
                                                            if (remark) {
                                                                if (!val) {
                                                                    throw new Error('结束时间不能为空');
                                                                }
                                                            } else {
                                                                callback();
                                                            }
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Field
                                                    mode={mode}
                                                    valueType="date"
                                                    text={getFieldValue('endForwardDate')}
                                                    renderFormItem={() => {
                                                        return (
                                                            <DatePicker
                                                                disabledDate={disabledDate}
                                                                format="YYYY-MM-DD"
                                                                disabled={!getFieldValue('forwardDate') || getFieldValue('noEndDate')}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                                {/* </Space> */}
                            </Col>
                            <Col span={5}>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return (
                                            <Form.Item name="noEndDate" valuePropName="checked">
                                                <Checkbox
                                                    onChange={noEndDateChange}
                                                    disabled={!getFieldValue('forwardDate') || mode === 'read'}
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    无结束日
                                                </Checkbox>
                                                {/* <Field
                                                        mode={mode}
                                                        valueType='radio'
                                                        // render={() => {
                                                        //     return getFieldValue('noEndDate')?'无结束日':''
                                                        // }}
                                                        renderFormItem={() => {
                                                            return <Checkbox
                                                                onChange={noEndDateChange}
                                                                disabled={!getFieldValue('forwardDate')}
                                                                style={{ marginLeft: '8px' }}
                                                            >
                                                                无结束日
                                                            </Checkbox>
                                                        }}
                                                    /> */}
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {props.moduleId === 4 && (
                    <Row gutter={24}>
                        <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
                            合并通知<span style={{ margin: '0 8px 0 2px' }}>:</span>
                        </Col>
                        <Col span={20}>
                            <Row>
                                <Col span={3}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item valuePropName="checked" name="whetherSmsMerge">
                                                    <Field
                                                        mode={mode}
                                                        render={() => {
                                                            return getFieldValue('whetherSmsMerge') ? '开' : '关';
                                                        }}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Switch
                                                                    checked={getFieldValue('whetherSmsMerge')}
                                                                    size="small"
                                                                    checkedChildren="开"
                                                                    unCheckedChildren="关"
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                                <Col span={18}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                <Form.Item>
                                                    {getFieldValue('whetherSmsMerge') && (
                                                        <span style={{ color: 'red' }}>
                                                            打开后勾选下方类型，第一个告警发送通知后，在清除前，若发生同类型告警，不会发送通知
                                                        </span>
                                                    )}
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                                <Col span={20}>
                                    <Form.Item noStyle shouldUpdate>
                                        {({ getFieldValue }) => {
                                            return (
                                                getFieldValue('whetherSmsMerge') && (
                                                    <Form.Item name="smsMergeFields" labelCol={{ span: 8 }}>
                                                        <Field
                                                            mode={mode}
                                                            valueType="checkbox"
                                                            text={getFieldValue('smsMergeFields')?.map(
                                                                (e) => smsList?.find((ite) => ite.value === e)?.label,
                                                            )}
                                                            renderFormItem={() => {
                                                                return (
                                                                    <Checkbox.Group
                                                                        size="small"
                                                                        style={{ border: '0px' }}
                                                                        buttonStyle="solid"

                                                                        // onChange={this.onCheckboxChange}
                                                                    >
                                                                        {smsList.map((item) => {
                                                                            return (
                                                                                <Checkbox
                                                                                    value={item.value}
                                                                                    key={item.value}
                                                                                    disabled={!getFieldValue('whetherSmsMerge')}
                                                                                    style={{
                                                                                        width: item.length * 20 + 14,
                                                                                    }}
                                                                                >
                                                                                    {item.label}
                                                                                </Checkbox>
                                                                            );
                                                                        })}
                                                                    </Checkbox.Group>
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                )
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                )}

                <Form.Item label="告警发生模板" style={{ marginBottom: 0 }}>
                    <Input.Group>
                        <Row gutter={8}>
                            <Col>
                                <Field
                                    mode={mode}
                                    render={() => {
                                        return <span style={{ lineHeight: '30px' }}>{selectValue}</span>;
                                    }}
                                    renderFormItem={() => {
                                        return (
                                            <Select
                                                style={{ width: 120 }}
                                                onChange={(value, option) => {
                                                    setSelectValue(option?.value);
                                                    form.setFieldsValue({ smsTitle: option?.label });
                                                    if (form.getFieldValue('isUseSmsTitle')) {
                                                        form.setFieldsValue({
                                                            cancelTitle: `告警已于<cancel_time>清除 ${option?.label})}`,
                                                        });
                                                    }
                                                }}
                                                value={selectValue}
                                                placeholder="请选择模板"
                                            >
                                                {smsTemplateList.map((item) => {
                                                    return (
                                                        <Select.Option label={item.value} key={item.key} value={item.key}>
                                                            {item.label}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        );
                                    }}
                                />
                            </Col>
                            <Col>
                                <Button onClick={showSMSTemplateClick} disabled={mode === 'read'}>
                                    模板管理
                                </Button>
                            </Col>
                            <Col>
                                <Button onClick={showSMSTemplateEditClick} disabled={mode === 'read'}>
                                    编辑
                                </Button>
                            </Col>
                            {props.moduleId !== 14 && !isEmailSendRule && (
                                <>
                                    <Col>
                                        <Form.Item name="sendNo" valuePropName="checked">
                                            <Checkbox disabled={mode === 'read'}>发送次数提醒</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item name="isClearSMSContent" valuePropName="checked">
                                            <Checkbox style={{ marginLeft: '8px' }} disabled={mode === 'read'}>
                                                清除告警发通知
                                            </Checkbox>
                                        </Form.Item>
                                    </Col>
                                </>
                            )}

                            {editVisible && (
                                <Edit
                                    modalContainer={props.login.container}
                                    reloadList={getSmsTemplateList}
                                    smsTemplateList={smsTemplateList}
                                    type="edit"
                                    setSmsContentValue={setSmsContentValue}
                                    optionKey={optionKey}
                                    visible={editVisible}
                                    onVisibleChange={onEditVisibleChange}
                                    moduleId={props.moduleId}
                                />
                            )}
                        </Row>
                    </Input.Group>
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Form.Item name="smsTitle" wrapperCol={{ offset: 4 }} rules={[{ required: true, message: '不可为空' }]}>
                                <Field
                                    mode={mode}
                                    render={() => {
                                        return getFieldValue('smsTitle');
                                    }}
                                    renderFormItem={() => {
                                        return (
                                            <Input.TextArea
                                                maxLength={1024}
                                                onChange={smsTitleChange}
                                                autoSize={{ minRows: 4, maxRows: 5 }}
                                                allowClear
                                            />
                                        );
                                    }}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Form.Item
                                label="告警清除模版"
                                style={{ marginBottom: 0 }}
                                hidden={!getFieldValue('isClearSMSContent') || props.moduleId !== 4}
                            >
                                <Input.Group>
                                    <Row gutter={8}>
                                        <Col>
                                            <Field
                                                mode={mode}
                                                render={() => {
                                                    return <span style={{ lineHeight: '30px' }}>{selectValue}</span>;
                                                }}
                                                renderFormItem={() => {
                                                    return (
                                                        <Select
                                                            style={{ width: 120 }}
                                                            onChange={(value, option) => {
                                                                setSelectCancelValue(option?.value);
                                                                form.setFieldsValue({
                                                                    cancelTitle: `告警已于<cancel_time>清除  ${option?.label}`,
                                                                });
                                                            }}
                                                            value={selectCancelValue}
                                                            placeholder="请选择模板"
                                                            disabled={getFieldValue('isUseSmsTitle')}
                                                        >
                                                            {smsTemplateList.map((item) => {
                                                                return (
                                                                    <Select.Option label={item.value} key={item.key} value={item.key}>
                                                                        {item.label}
                                                                    </Select.Option>
                                                                );
                                                            })}
                                                        </Select>
                                                    );
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Item name="isUseSmsTitle" valuePropName="checked">
                                                <Checkbox style={{ marginLeft: '8px' }} disabled={mode === 'read'}>
                                                    使用告警发生模板
                                                </Checkbox>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Input.Group>
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Form.Item
                                name="cancelTitle"
                                hidden={!getFieldValue('isClearSMSContent') || props.moduleId !== 4}
                                wrapperCol={{ offset: 4 }}
                                rules={[
                                    {
                                        required: getFieldValue('isClearSMSContent'),
                                        message: '不可为空',
                                    },
                                ]}
                            >
                                <Field
                                    mode={mode}
                                    render={() => {
                                        return getFieldValue('cancelTitle');
                                    }}
                                    renderFormItem={() => {
                                        return (
                                            <Input.TextArea
                                                maxLength={1024}
                                                disabled={getFieldValue('isUseSmsTitle')}
                                                allowClear
                                                autoSize={{ minRows: 4, maxRows: 5 }}
                                            />
                                        );
                                    }}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>

                {!isEmailSendRule && (
                    <Form.Item label="同步创建过滤器" name="synchroFilter" valuePropName="checked">
                        <Switch size="small" checkedChildren="开" unCheckedChildren="关" disabled={mode === 'read'} />
                    </Form.Item>
                )}

                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Row gutter={8}>
                                <Col span={8}>
                                    <Form.Item
                                        labelCol={{
                                            span: 12,
                                        }}
                                        wrapperCol={{
                                            span: 8,
                                        }}
                                        label={`${isEmailSendRule ? '发送' : '前转'}次数`}
                                        name="frequency"
                                        rules={[{ required: true, message: '不能为空' }]}
                                    >
                                        {mode === 'read' ? (
                                            getFieldValue('frequency')
                                        ) : (
                                            <InputNumber onChange={tabNumChange} min={1} max={5} formater={limitDecimals} parser={limitDecimals} />
                                        )}
                                        {/* <Field
                                                mode={mode}
                                                renderFormItem={() => {
                                                    return <InputNumber onChange={tabNumChange} min={1} max={5} formater={limitDecimals} parser={limitDecimals} />
                                                }}
                                            /> */}
                                    </Form.Item>
                                </Col>
                                {props.moduleId === 4 && (
                                    <Col>
                                        <Form.Item name="unlimitedTime" valuePropName="checked">
                                            <Checkbox style={{ marginLeft: '8px' }} disabled={mode === 'read'}>
                                                不限次数
                                            </Checkbox>
                                        </Form.Item>
                                    </Col>
                                )}
                                {getFieldValue('unlimitedTime') && (
                                    <Col span={8}>
                                        <Form.Item
                                            labelCol={{ span: 12 }}
                                            label="时间间隔(分钟)"
                                            name="unlimiteInterval"
                                            rules={[{ validator: intervalValidate }]}
                                        >
                                            <Field mode={mode} renderFormItem={() => <InputNumber />} />
                                        </Form.Item>
                                    </Col>
                                )}
                            </Row>
                        );
                    }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                        getFieldValue('unlimitedTime') && (
                            <Form.Item
                                labelCol={{
                                    span: 4,
                                }}
                                colon={false}
                                label=" "
                            >
                                <span
                                    style={{
                                        flex: 1,
                                        color: 'red',
                                        display: 'block',
                                        wordBreak: 'break-all',
                                    }}
                                >
                                    勾选后，按设置的时间间隔，向最后一次前转的用户发送短信，直到告警清除；
                                </span>
                            </Form.Item>
                        )
                    }
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        return (
                            <Form.Item label="呼叫方式" name="sendMode" hidden={isEmailSendRule}>
                                <Field
                                    mode={mode}
                                    text={getFieldValue('sendMode')}
                                    valueEnum={{
                                        0: {
                                            text: '自定义发送',
                                        },
                                        1: {
                                            text: '外呼系统确定呼叫人员',
                                            disabled: true,
                                        },
                                        2: {
                                            text: '网元确定呼叫人员',
                                            disabled: true,
                                        },
                                        3: {
                                            text: '匹配班组规则',
                                            disabled: false,
                                        },
                                    }}
                                    renderFormItem={() => {
                                        return (
                                            <Radio.Group
                                                options={[
                                                    { label: '自定义发送', value: 0 },
                                                    {
                                                        label: '外呼系统确定呼叫人员',
                                                        value: 1,
                                                        disabled: true,
                                                    },
                                                    {
                                                        label: '网元确定呼叫人员',
                                                        value: 2,
                                                        disabled: true,
                                                    },
                                                    {
                                                        label: '匹配班组规则',
                                                        value: 3,
                                                        disabled: false,
                                                    },
                                                ]}
                                            />
                                        );
                                    }}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                {!isEmailSendRule && (
                    <Row>
                        <Col span={3}>
                            <div />
                        </Col>
                        <Col span={21}>
                            {sendMode === 3 ? (
                                <div style={{ minHeight: '200px', padding: '10px', border: '2px solid rgb(204, 204, 204)' }}>
                                    <Form.List name="everyTimes">
                                        {(fields) => {
                                            return (
                                                <Tabs type="card" onChange={changeTab} activeKey={tabKey}>
                                                    {fields.map((field) => {
                                                        return (
                                                            <TabPane
                                                                tab={`第${ENUMSNUMS.find((item, index) => index === field.name)}次`}
                                                                key={field.key}
                                                            >
                                                                {field.name !== 0 && (
                                                                    <Form.Item
                                                                        labelCol={{ span: mode === 'read' ? 5 : 4 }}
                                                                        label="时间间隔（分钟）"
                                                                        name={[field.name, 'times']}
                                                                        fieldKey={[field.fieldKey, 'times']}
                                                                        style={{ marginTop: '10px' }}
                                                                        required
                                                                    >
                                                                        <Field
                                                                            mode={mode}
                                                                            renderFormItem={() => {
                                                                                return (
                                                                                    <InputNumber
                                                                                        min={1}
                                                                                        formater={limitDecimals}
                                                                                        parser={limitDecimals}
                                                                                    />
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Form.Item>
                                                                )}
                                                                <div>
                                                                    {provinceData.length > 1 ? (
                                                                        <div style={{ marginTop: '10px' }}>
                                                                            <div style={{ overflow: 'auto' }}>
                                                                                <Form.Item noStyle shouldUpdate>
                                                                                    {() => {
                                                                                        return (
                                                                                            <Form.Item
                                                                                                label="选择省份"
                                                                                                labelCol={{ span: 4 }}
                                                                                                name={[field.name, 'province']}
                                                                                                required
                                                                                            >
                                                                                                <Field
                                                                                                    mode={mode}
                                                                                                    render={() => {
                                                                                                        return (
                                                                                                            <span>
                                                                                                                {form.getFieldValue([
                                                                                                                    'everyTimes',
                                                                                                                    field.name,
                                                                                                                    'province',
                                                                                                                ])?.label || '-'}
                                                                                                            </span>
                                                                                                        );
                                                                                                    }}
                                                                                                    renderFormItem={() => {
                                                                                                        return (
                                                                                                            <Select
                                                                                                                showSearch
                                                                                                                filterOption={(e, opt) => {
                                                                                                                    if (
                                                                                                                        opt?.children.indexOf(e) > -1
                                                                                                                    ) {
                                                                                                                        return true;
                                                                                                                    }
                                                                                                                }}
                                                                                                                style={{ width: 200 }}
                                                                                                                allowClear
                                                                                                                placeholder="请选择省份"
                                                                                                                labelInValue
                                                                                                                onChange={(e) => {
                                                                                                                    handleProvinceChange(e, field);
                                                                                                                }}
                                                                                                            >
                                                                                                                {provinceData.map((item) => {
                                                                                                                    return (
                                                                                                                        <Select.Option
                                                                                                                            key={item.key}
                                                                                                                            value={item.key}
                                                                                                                            name={item.name}
                                                                                                                        >
                                                                                                                            {item.value}
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
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <Form.Item hidden name={[field.name, 'province']} />
                                                                    )}
                                                                    <div style={{ marginTop: '10px' }}>
                                                                        <div style={{ overflow: 'auto' }}>
                                                                            <Form.Item
                                                                                label="维护班组"
                                                                                labelCol={{ span: 4 }}
                                                                                name={[field.name, 'relatedMeTeam']}
                                                                                required
                                                                            >
                                                                                {mode !== 'read' ? (
                                                                                    <Select
                                                                                        showSearch
                                                                                        filterOption={(e, opt) => {
                                                                                            if (opt?.children.indexOf(e) > -1) {
                                                                                                return true;
                                                                                            }
                                                                                        }}
                                                                                        // style={{ width: 260 }}
                                                                                        allowClear
                                                                                        placeholder="请选择维护班组"
                                                                                        mode="multiple"
                                                                                        maxTagCount={8}
                                                                                        labelInValue
                                                                                        onChange={(e) => {
                                                                                            handleRelatedMeTeamChange(e, field);
                                                                                        }}
                                                                                    >
                                                                                        {teamData.map((item) => {
                                                                                            return (
                                                                                                <Select.Option value={item.id}>
                                                                                                    {item.name}
                                                                                                </Select.Option>
                                                                                            );
                                                                                        })}
                                                                                    </Select>
                                                                                ) : (
                                                                                    form
                                                                                        .getFieldValue(['everyTimes', field.name, 'relatedMeTeam'])
                                                                                        ?.map((item) => {
                                                                                            return (
                                                                                                <Tag style={{ marginTop: '5px' }} key={item.value}>
                                                                                                    {item.label}
                                                                                                </Tag>
                                                                                            );
                                                                                        })
                                                                                )}
                                                                            </Form.Item>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ marginTop: '10px' }}>
                                                                        <div style={{ overflow: 'auto' }}>
                                                                            <Form.Item
                                                                                label="维护角色"
                                                                                labelCol={{ span: 4 }}
                                                                                name={[field.name, 'receiver']}
                                                                                required
                                                                            >
                                                                                {mode !== 'read' ? (
                                                                                    <Select
                                                                                        showSearch
                                                                                        optionFilterProp="label"
                                                                                        // style={{ width: 260 }}
                                                                                        allowClear
                                                                                        placeholder="请选择维护角色"
                                                                                        mode="multiple"
                                                                                        options={roles}
                                                                                        maxTagCount={8}
                                                                                    />
                                                                                ) : (
                                                                                    form
                                                                                        .getFieldValue(['everyTimes', field.name, 'receiver'])
                                                                                        ?.map((item, idx) => {
                                                                                            return (
                                                                                                <Tag style={{ marginTop: '5px' }} key={idx}>
                                                                                                    {item}
                                                                                                </Tag>
                                                                                            );
                                                                                        })
                                                                                )}
                                                                            </Form.Item>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Form.Item label="临时手机号码" labelCol={{ span: 4 }} style={{ marginTop: '10px' }}>
                                                                    {mode !== 'read' && (
                                                                        <Row gutter={24}>
                                                                            <Col span={8}>{popRender('mTeam', field)}</Col>
                                                                            <Col span={8} style={{ height: '40px' }}>
                                                                                <Button
                                                                                    disabled={mode === 'read'}
                                                                                    onClick={() => {
                                                                                        handleAddMNum(field);
                                                                                    }}
                                                                                    icon={<PlusOutlined />}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    )}
                                                                    <Row gutter={24}>
                                                                        <Col span={20}>
                                                                            <div className="phone-form-container">
                                                                                {mTeamNumList[field.name]?.map((item, index) => {
                                                                                    return (
                                                                                        <Tag
                                                                                            key={index}
                                                                                            onClose={(e) => {
                                                                                                handleMNumTagClose(e, field.name, index);
                                                                                            }}
                                                                                            closable={!(mode === 'read')}
                                                                                        >
                                                                                            {item}
                                                                                        </Tag>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                            <Form.Item noStyle name={[field.name, 'temporaryNum']} hidden>
                                                                                <Field
                                                                                    mode={mode}
                                                                                    renderFormItem={() => {
                                                                                        return (
                                                                                            <Input
                                                                                                style={{ marginLeft: 5, width: '90%' }}
                                                                                                allowClear
                                                                                            />
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                </Form.Item>
                                                            </TabPane>
                                                        );
                                                    })}
                                                </Tabs>
                                            );
                                        }}
                                    </Form.List>
                                </div>
                            ) : (
                                <Form.List name="everyTimes">
                                    {(fields) => {
                                        return (
                                            <>
                                                <Button onClick={addUser} loading={addUserLoading} disabled={mode === 'read'}>
                                                    添加用户
                                                </Button>
                                                <Tabs type="card" onChange={changeTab} activeKey={tabKey}>
                                                    {fields.map((field) => (
                                                        <TabPane tab={`第${ENUMSNUMS.find((item, index) => index === field.name)}次`} key={field.key}>
                                                            {field.name !== 0 && (
                                                                <Col span={16}>
                                                                    <Form.Item
                                                                        labelCol={{ span: 8 }}
                                                                        label="时间间隔（分钟）"
                                                                        name={[field.name, 'times']}
                                                                        fieldKey={[field.fieldKey, 'times']}
                                                                    >
                                                                        <Field
                                                                            mode={mode}
                                                                            renderFormItem={() => {
                                                                                return (
                                                                                    <InputNumber
                                                                                        style={{ marginLeft: 5 }}
                                                                                        min={0}
                                                                                        formater={limitDecimals}
                                                                                        parser={limitDecimals}
                                                                                    />
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                            )}
                                                            {showTableData[field.key] && (
                                                                <Table
                                                                    rowKey={(record) => `${record.userId}`}
                                                                    key={field.name}
                                                                    bordered
                                                                    scroll={{ y: 230 }}
                                                                    dataSource={showTableData[field.key] ? showTableData[field.key] : []}
                                                                    pagination={false}
                                                                    columns={[
                                                                        // {
                                                                        //     dataIndex:'groupId',
                                                                        //     title:'用户组',
                                                                        //     width:150,
                                                                        //     ellipsis: true,
                                                                        //     render:(text,record)=>{
                                                                        //         return userGroupList.filter(item=>item.value == text)[0]?.label
                                                                        //     }
                                                                        // },
                                                                        {
                                                                            dataIndex: 'groupNames',
                                                                            title: '用户组',
                                                                            width: 200,
                                                                            ellipsis: true,
                                                                        },
                                                                        {
                                                                            dataIndex: 'userName',
                                                                            title: '用户名',
                                                                            // width: 200,
                                                                        },
                                                                        {
                                                                            dataIndex: 'mobilephone',
                                                                            title: '电话',

                                                                            ellipsis: true,
                                                                        },
                                                                        {
                                                                            dataIndex: 'option',
                                                                            title: '操作',
                                                                            width: 80,
                                                                            render: (text, record) => {
                                                                                return (
                                                                                    <Button
                                                                                        onClick={() => {
                                                                                            handleDeleteUser(record, field.name);
                                                                                        }}
                                                                                        disabled={mode === 'read'}
                                                                                    >
                                                                                        删除
                                                                                    </Button>
                                                                                );
                                                                            },
                                                                        },
                                                                    ]}
                                                                />
                                                            )}
                                                            <Form.Item label="临时手机号码" labelCol={1} style={{ marginLeft: 0, marginTop: 10 }}>
                                                                {/* {mode !== 'read' && (
                                                            <Row gutter={24}>
                                                                <Col span={8}>{popRender('custom', field)}</Col>
                                                                <Col span={8} style={{ height: '40px' }}>
                                                                    <Button
                                                                        disabled={mode === 'read'}
                                                                        style={{}}
                                                                        onClick={() => {
                                                                            handleAddNum(field);
                                                                        }}
                                                                        icon={<PlusOutlined />}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        )} */}
                                                                <Row gutter={24}>
                                                                    <Col span={20}>
                                                                        <div className="phone-form-container">
                                                                            {numList[field.fieldKey]?.map((item, index) => {
                                                                                return (
                                                                                    <Tag
                                                                                        key={index}
                                                                                        onClose={(e) => {
                                                                                            handleNumTagClose(e, field, index);
                                                                                        }}
                                                                                        closable={!(mode === 'read')}
                                                                                    >
                                                                                        {item}
                                                                                    </Tag>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        <Form.Item
                                                                            noStyle
                                                                            name={[field.name, 'temporaryNum']}
                                                                            fieldKey={[field.fieldKey, 'temporaryNum']}
                                                                            hidden
                                                                        >
                                                                            <Field
                                                                                mode={mode}
                                                                                renderFormItem={() => {
                                                                                    return <Input style={{ marginLeft: 5 }} allowClear />;
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </Form.Item>
                                                        </TabPane>
                                                    ))}
                                                </Tabs>
                                                <Modal
                                                    width="80vw"
                                                    destroyOnClose
                                                    visible={userGroupVisible}
                                                    onCancel={closeUserGroupModal}
                                                    className="message-user-group-modal"
                                                    onOk={() => {
                                                        onUserModalOk(tabKey);
                                                    }}
                                                >
                                                    <Tabs type="card" style={{ flex: 1 }} onChange={changeTab} activeKey={tabKey}>
                                                        {fields.map((field) => (
                                                            <TabPane
                                                                tab={`第${ENUMSNUMS.find((item, index) => index === field.name)}次`}
                                                                key={field.key}
                                                            >
                                                                <div style={{ display: 'flex', height: '100%' }}>
                                                                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                                                                        <Form.Item noStyle shouldUpdate>
                                                                            {() => {
                                                                                return (
                                                                                    <Field
                                                                                        mode={mode}
                                                                                        render={() => {
                                                                                            return (
                                                                                                <Form.Item
                                                                                                    label="用户组"
                                                                                                    labelCol={{ span: 4 }}
                                                                                                    name={[field.name, 'userGroup']}
                                                                                                    fieldKey={[field.fieldKey, 'userGroup']}
                                                                                                >
                                                                                                    <Select
                                                                                                        showSearch
                                                                                                        optionFilterProp="label"
                                                                                                        style={{
                                                                                                            width: 120,
                                                                                                            margin: 5,
                                                                                                        }}
                                                                                                        // allowClear
                                                                                                        placeholder="请选择用户组"
                                                                                                        defaultValue={userGroupList[0]?.value}
                                                                                                        onChange={(...arg) => {
                                                                                                            userGroupChang(...arg, field.name);
                                                                                                        }}
                                                                                                        options={userGroupList}
                                                                                                    />
                                                                                                </Form.Item>
                                                                                            );
                                                                                        }}
                                                                                        renderFormItem={() => {
                                                                                            return (
                                                                                                <Form.Item
                                                                                                    label="用户组"
                                                                                                    labelCol={{ span: 4 }}
                                                                                                    name={[field.name, 'userGroup']}
                                                                                                    fieldKey={[field.fieldKey, 'userGroup']}
                                                                                                >
                                                                                                    <Select
                                                                                                        showSearch
                                                                                                        optionFilterProp="label"
                                                                                                        style={{
                                                                                                            width: 200,
                                                                                                            marginLeft: 3,
                                                                                                        }}
                                                                                                        // allowClear
                                                                                                        placeholder="请选择用户组"
                                                                                                        defaultValue={userGroupList[0]?.value}
                                                                                                        onChange={(...arg) => {
                                                                                                            userGroupChang(...arg, field.name);
                                                                                                        }}
                                                                                                        options={userGroupList}
                                                                                                    />
                                                                                                    <Button onClick={() => onAllCheck(field.name)}>
                                                                                                        {allCheck ? '取消全选' : '全选'}
                                                                                                    </Button>
                                                                                                </Form.Item>
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                );
                                                                            }}
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            hidden={true}
                                                                            name={[field.name, 'userIds']}
                                                                            fieldKey={[field.fieldKey, 'userIds']}
                                                                        >
                                                                            <Input allowClear />
                                                                        </Form.Item>
                                                                        <VirtualTable
                                                                            global={window}
                                                                            rowKey={(record) => `${record.userId}`}
                                                                            key={field.name}
                                                                            bordered
                                                                            search={false}
                                                                            options={false}
                                                                            rowSelection={{
                                                                                selectedRowKeys: selectedRowKeys[`${field.name}_rowKeys`]
                                                                                    ? selectedRowKeys[`${field.name}_rowKeys`]
                                                                                    : selectedRowKeys.rowKeys,
                                                                                onChange: (selectedRowKeys, selectedRows) => {
                                                                                    if (mode === 'read') {
                                                                                        return;
                                                                                    }
                                                                                    rowChange(selectedRowKeys, selectedRows, field.name);
                                                                                },
                                                                                getCheckboxProps: (record) => ({
                                                                                    disabled: record.mobilephone === '' || !record.mobilephone === '',
                                                                                }),
                                                                            }}
                                                                            dataSource={
                                                                                userTableData[`tableData${field.name}`]
                                                                                    ? userTableData[`tableData${field.name}`]
                                                                                    : userTableData.tableData
                                                                            }
                                                                            columns={[
                                                                                {
                                                                                    dataIndex: 'userName',
                                                                                    title: '用户名',
                                                                                    width: 200,
                                                                                },
                                                                                {
                                                                                    dataIndex: 'mobilephone',
                                                                                    title: '电话',
                                                                                    width: 200,
                                                                                    ellipsis: true,
                                                                                },
                                                                            ]}
                                                                        />
                                                                        {isShowError(userTableData, field.name) && (
                                                                            <div
                                                                                style={{
                                                                                    color: '#db2039',
                                                                                    marginLeft: 14,
                                                                                    position: 'relative',
                                                                                    top: -30,
                                                                                    width: 300,
                                                                                }}
                                                                            >
                                                                                该用户组下存在电话号码为空的用户，请修改!
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="message-user-modal-right">
                                                                        {field.name !== 0 && (
                                                                            <Form.Item
                                                                                labelCol={{ span: 5 }}
                                                                                label="时间间隔（分钟）"
                                                                                name={[field.name, 'times']}
                                                                                fieldKey={[field.fieldKey, 'times']}
                                                                            >
                                                                                <Field
                                                                                    mode={mode}
                                                                                    renderFormItem={() => {
                                                                                        return (
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                formater={limitDecimals}
                                                                                                parser={limitDecimals}
                                                                                            />
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                        <Form.Item noStyle shouldUpdate>
                                                                            {() => {
                                                                                return (
                                                                                    <Field
                                                                                        mode={mode}
                                                                                        renderFormItem={() => {
                                                                                            return (
                                                                                                <Form.Item
                                                                                                    label="临时手机号码"
                                                                                                    labelCol={{ span: 5 }}
                                                                                                    // name={[field.name, 'userGroup']}
                                                                                                    // fieldKey={[field.fieldKey, 'userGroup']}
                                                                                                >
                                                                                                    <Row>
                                                                                                        <Col>
                                                                                                            <Form.Item>
                                                                                                                {popRender('custom', field)}
                                                                                                            </Form.Item>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Button
                                                                                                                type="primary"
                                                                                                                disabled={mode === 'read'}
                                                                                                                onClick={() => {
                                                                                                                    addCustomNum(field);
                                                                                                                }}
                                                                                                            >
                                                                                                                添加
                                                                                                            </Button>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                </Form.Item>
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                );
                                                                            }}
                                                                        </Form.Item>
                                                                        <div className="tag-groups">
                                                                            {customNum[field.fieldKey]?.map((item, index) => {
                                                                                return (
                                                                                    <Tag
                                                                                        key={index}
                                                                                        onClose={(e) => {
                                                                                            closeCustomNum(e, field, index);
                                                                                        }}
                                                                                        closable={!(mode === 'read')}
                                                                                    >
                                                                                        {item}
                                                                                    </Tag>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TabPane>
                                                        ))}
                                                    </Tabs>
                                                </Modal>
                                            </>
                                        );
                                    }}
                                </Form.List>
                            )}
                        </Col>
                    </Row>
                )}
                {isEmailSendRule && genEmailReceiversElement()}
            </Form>

            <Modal
                title={props.moduleId === 14 ? '外呼模板管理' : '通知模板管理'}
                width={800}
                bodyStyle={{ height: '450px' }}
                onCancel={onCancel}
                visible={visible}
                destroyOnClose={true}
                getContainer={props.login.container}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={onCancel}> 关闭</Button>
                    </div>
                }
            >
                <SMSTemplate
                    moduleId={props.moduleId}
                    optionKey={optionKey}
                    login={props.login}
                    reloadList={getSmsTemplateList}
                    smsTemplateList={smsTemplateList}
                />
            </Modal>
        </>
    );
});
