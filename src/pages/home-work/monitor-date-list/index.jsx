/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef, useCallback, forwardRef, useMemo } from 'react';
import {
    Form,
    Calendar,
    Button,
    Modal,
    Table,
    Tooltip,
    Select,
    DatePicker,
    Input,
    Space,
    Icon,
    message,
    Upload,
    ColumnsSortDrag,
    Transfer,
    Spin,
} from 'oss-ui';
import dayjs from 'dayjs';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import request from '@Common/api';
import qs from 'qs';
import { _ } from 'oss-web-toolkits';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import {
    getCenterList,
    updateRule,
    autoSchedule,
    getRule,
    createImportTemplate,
    downloadFailReasonApi,
    findScheduleListByShiftForeman,
    findShiftForemanGroupUserList,
    getShiftForemanRule,
    saveShiftForemanRule,
} from './api';
import { getInitialProvince, defineScheduleData } from './utils';
import BatchSchedul from './batch-schedul';
import AuthButton from '@Src/components/auth-button';
import AutoSchedule from './schedule';
import GroupSchedule from '../../../components/edit-schedule';
import ScheduleTransfer from './shcedule-transfer';
import constants from '@Src/common/constants';
import CustomModalFooter from '@Src/components/custom-modal-footer';
import ChangeShifts from '../../change-shifts-page/change-shifts';
import { blobDownLoad } from '@Common/utils/download';
import actionss from '@Src/share/actions';
import { openRoute } from '@Src/hooks';
import { urlSearchObjFormat } from '@Common/utils/urlSearchObjFormat';
import './index.less';

const { RangePicker } = DatePicker;

const MyChild = forwardRef(GroupSchedule);
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

const MonitorDateList = (props) => {
    const cRef = useRef();
    const scheduleRef = useRef();
    const [groupSettingDialogVisible, setGroupSettingDialogVisible] = useState(false);
    const [scheduleVisible, setScheduleVisible] = useState(false);

    // 查询项相关
    const [, setZoneLevel] = useState(1);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);
    const [searchGroupOptions, setSearchGroupOptions] = useState([]);
    const [centerSource, getCenterSource] = useState([]);
    const [centerListData, setCenterListData] = useState([]);
    const [currentCenterId, setCurrentCenterId] = useState(0);
    // 班组相关
    const [groupList, setGroupList] = useState([]);
    const [groupInfo, setGroupInfo] = useState([]);
    const [groupChoosed, setGroupChoosed] = useState({
        groupName: '',
        groupId: 0,
    });
    const [editGroup, setEditGroup] = useState(undefined);
    const [groupUserList, setGroupUserList] = useState([]);

    // 班组人员相关
    const [modifyGroupUserDialogVisible, setmodifyGroupUserDialogVisible] = useState(false);
    const [provinceUserList, setProvinceUserList] = useState([]);
    const [addGroupUserList, setAddGroupUserList] = useState([]);
    const [addGroupUserSelectedRowKeys, setAddGroupUserSelectedRowKeys] = useState([]);
    const [delGroupUserSelectedRowKeys, setDelGroupUserSelectedRowKeys] = useState([]);
    const [delGroupUser, setDelGroupUser] = useState([]);

    // 排班表日志相关
    const [calendarValue, setCalendarValue] = useState(moment(new Date()));
    const [validRange, setValidRange] = useState([moment(new Date()).startOf('month'), moment(new Date()).endOf('month')]);
    const [scheduleUser, setScheduleUser] = useState(null);
    const [scheduleUserList, setScheduleUserList] = useState([]);
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleUserSelectedRowKeys, setScheduleUserSelectedRowKeys] = useState([]);
    // transfer
    const [transferIds, handleTransferIds] = useState([]);
    const [transferRows, handleTransferRows] = useState([]);
    const [scheduleInfo, setScheduleInfo] = useState({
        type: 'day',
        dateTime: '',
    });
    const formRef = useRef();
    const userInfo = useLoginInfoModel();
    const systemZone = userInfo.systemInfo.currentZone;
    let { zoneId, zoneName } = systemZone ?? JSON.parse(userInfo.userInfo).zones[0];
    if (userInfo.zoneLevelFlags.isCityZone) {
        zoneId = JSON.parse(userInfo.userInfo).zones[0].zoneLevel_2Id;
    }
    const [searchUserName, setSearchUserName] = useState('');
    const [searchMobilePhone, setSearchMobilePhone] = useState('');
    const [importVisible, setImportVisible] = useState(false);
    const [errorData, setErrorData] = useState('');
    const [failReasonPath, setFailReasonPath] = useState('');
    const [pagination, setPagination] = useState({
        total: 0,
        pageSize: 10,
        current: 1,
    });
    // 导出模态框
    const [exportVisible, handleExportVisible] = useState(false);
    // 导出时间
    const [exportTime, handleExportTime] = useState([]);
    // 批量排班模态框
    const [schedulVisible, handleSchedulVisible] = useState(false);
    // 修改班次
    const [scheduleData, handleScheduleData] = useState({});
    const [scheduleTimeRange, handleScheduleTimeRange] = useState(Number);
    // 自动排班
    const [autoScheduleVisible, handleAutoSchedulVisible] = useState(false);
    const [editScheduleVisible, handleEditSchedulVisible] = useState(false);
    const [autoScheduleData, handleAutoScheduleData] = useState({});
    const [autoScheduleLoading, handleAutoScheduleLoading] = useState(false);
    //
    const [currentWorkId, handleCurrentWorkId] = useState(Number);
    const errorFormRef = useRef();
    // 导出类型
    const [exportType, setExportType] = useState('telephone');

    const [changeShiftsVisible, setChangeShiftsVisible] = useState(false);
    const [schedulingObj, setSchedulingObj] = useState({});

    const { skipType = 'noHeader' } = props.location.state || {};
    const [skipGroupId, setSkipGroupId] = useState();
    const [shiftForemanRule, setShiftForemanRule] = useState({});

    const skipData = useMemo(() => {
        const centerName = centerListData.find((item) => item.centerId === currentCenterId)?.centerName;
        return {
            centerName,
            groupName: '值班长班组',
            provinceName: zoneName,
        };
    }, [autoScheduleVisible, importVisible]);

    const scheduleColumns = [
        {
            title: '姓名',
            dataIndex: 'userName',
        },
        {
            title: '电话',
            dataIndex: 'mobilePhone',
            ellipsis: true,
        },
    ];
    const zoneLevelEnums = {
        // 区域级别(1-全国，2-省，3-地市，4-区县，5-大区)
        1: 'country',
        2: 'province',
        3: 'city',
        4: 'district',
        5: 'area',
    };
    const userColumns = [
        {
            title: '姓名',
            dataIndex: 'userName',
            width: 160,
        },
        {
            title: '电话',
            dataIndex: 'mobilePhone',
            ellipsis: true,
        },
    ];

    const propsData = props?.location?.state?.scheduleInfo || {};
    const [scheduleRes, handleScheduleRes] = useState(props?.location?.state?.scheduleRes || {});
    const [scheduleRange, handleScheduleRange] = useState(props?.location?.state?.scheduleRange || {});
    const newData = {
        ...propsData,
        centerId: propsData.centerId,
        groupId: propsData.groupId,
        pageNum: 1,
        pageSize: 40,
        provinceId: propsData.provinceId,
        regionId: propsData.regionId,
        groupType: propsData.groupType,
    };

    useEffect(() => {
        getSearchInfo();
        searchData();
        getCenterListData();

        // getProvinceData();
    }, []);
    useEffect(() => {
        onFindScheduleListByShiftForeman();
    }, [currentCenterId]);
    //  查询监控中心列表数据
    const getCenterListData = async () => {
        const data = {
            provinceId: Number(zoneId),
            associatedGroupId: '',
        };
        const res = await getCenterList(data);
        if (res.code === 0) {
            setCenterListData(res.data);
            setCurrentCenterId(res.data[0].centerId);
            formRef.current.setFieldsValue({
                centerId: res.data[0].centerId,
            });
        }
    };

    // 查询值班长班组班表数据
    const onFindScheduleListByShiftForeman = async () => {
        const centerId = formRef.current?.getFieldValue('centerId');
        const date = formRef.current?.getFieldValue('dateTime');
        if (skipType !== 'header') return;
        if (centerListData.length === 0) return;
        const { userId } = userInfo;
        const data = {
            provinceId: Number(zoneId),
            provinceName: zoneName,
            dateTime: date.format('YYYY-MM-DD'),
            centerId,
            operateUser: Number(userId),
        };
        const res = await findScheduleListByShiftForeman(data);
        if (res.code === 0) {
            setScheduleList(res.data.days);
            setSkipGroupId(res.data.groupId);
        }
    };
    const onGetShiftForemanRule = async () => {
        const params = {
            groupId: skipGroupId,
        };
        const res = await getShiftForemanRule(params);

        if (res.code === 0) {
            setShiftForemanRule(res.data);
        }
    };
    // 排班日历相关

    /**
     * @description: 获取当前登陆用户查询条件信息
     * @param {*}
     * @return {*}
     */
    const getSearchInfo = () => {
        const { systemInfo } = userInfo;
        request(`api/users/${userInfo.userId}/userType`, {
            type: 'get',
            baseUrlType: 'monitorUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
        }).then(async (res) => {
            if (res && Array.isArray(res)) {
                const level = zoneLevelEnums[res[0]?.zoneLevel];
                setZoneLevel(level);
                // 获取省信息
                let provinceObj = {
                    value: level === 'province' ? res[0]?.zoneId : level === 'city' ? res[0]?.parentZoneId : '',
                };
                if (level === 'province') {
                    provinceObj.label = res[0]?.zoneName;
                }
                // if(level === 'country'){
                //     provinceObj = {
                //         label = res[0]?.zoneName,
                //         value
                //     }
                // }
                // 获取登陆用户市信息
                let cityObj = {
                    // value: -1,
                    // label: '无'
                };
                if (systemInfo?.currentZone?.zoneId) {
                    provinceObj = { value: systemInfo.currentZone.zoneId, label: systemInfo.currentZone.zoneName };
                }
                if (level === 'city') {
                    cityObj = {
                        value: res[0]?.zoneId,
                        label: res[0]?.zoneName,
                    };
                }
                // getProvinceRegions(getInitialProvince({}, userInfo.userInfo));
                const dataInfo = {
                    province: provinceObj,
                    city: cityObj,
                    dateTime: moment(moment(new Date()).format('YYYY-MM')),
                };
                formRef.current.setFieldsValue(dataInfo);
                // 需显示默认班组
                // getSearchGroupList();
            }
        });
    };
    /**
     * @description: 获取省列表
     * @param {*}
     * @return {*}
     */
    const getProvinceData = () => {
        const { systemInfo } = userInfo;
        console.log(userInfo);
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                creator: userInfo.userId,
            },
        }).then((res) => {
            let list = res;
            let field = {};
            if (systemInfo?.currentZone?.zoneId) {
                list = res.filter((item) => systemInfo?.currentZone?.zoneId === item.regionId);
                field = { regionName: systemInfo?.currentZone?.zoneName, regionId: systemInfo?.currentZone?.zoneId };
            } else {
                field = list.filter((item) => item.regionId === getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo.userInfo))[0] || {};
            }
            formRef.current.setFieldsValue({
                province: { value: field.regionId, label: field.regionName },
            });
            getProvinceRegions(field.regionId);
            setProvinceOptions(list);
        });
    };

    /**
     * @description: 获取省名称通过id
     * @param {*}
     * @return {*}
     */
    const getProvinceNameById = (id) => {
        if (!id) {
            return '';
        }
        return _.find(provinceOptions, { regionId: id })?.regionName || '';
    };

    /**
     * @description: 获取地市数据
     * @param {*}
     * @return {*}
     */
    const getProvinceRegions = (provinceId) => {
        if (!provinceId || provinceId === '') {
            return;
        }
        request('group/findProvinceRegions', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                parentRegionId: provinceId,
                creator: userInfo.userId,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const handleList = res || [];
                setRegionOptions(handleList);
                const dataInfo = formRef.current.getFieldsValue();
                const str = res.filter((item) => item.regionName === '省本部')[0];
                if (str) {
                    dataInfo.city = {
                        value: str?.regionId,
                        label: str?.regionName,
                    };
                } else if (res[0]) {
                    dataInfo.city = {
                        value: res[0].regionId,
                        label: res[0].regionName,
                    };
                }
                formRef.current.setFieldsValue(dataInfo);
                getSearchGroupList();
            }
        });
    };

    /**
     * @description: 获取班组信息
     * @param {*}
     * @return {*}
     */
    const getSearchGroupList = async (e) => {
        const dataInfo = formRef.current.getFieldsValue();
        try {
            const res = await getGroupList(e);
            if (res && Array.isArray(res.rows)) {
                // 默认选取第一个为显示班组
                const tempObj = res.rows[0];
                dataInfo.group = {
                    label: tempObj?.groupName,
                    value: tempObj?.groupId,
                };
                formRef.current.setFieldsValue(dataInfo);
                setSearchGroupOptions(res && res.rows);
                if (res.rows.length > 0) {
                    getCenterData(dataInfo.group);
                    getScheduleFindListData({
                        dateTime: moment(moment(new Date()).format('YYYY-MM')),
                        ...newData,
                    });
                } else {
                    setScheduleList([]);
                }
            }
        } catch (e) {
            message.error('出错了，请联系管理员');
        }
    };

    /**
     * @description: 获取监控中心信息
     * @param {*}
     * @return {*}
     */
    const getCenterData = async (e) => {
        const dataInfo = formRef.current.getFieldsValue();
        try {
            const res = await getCenterList({
                associatedGroupId: e?.value,
                provinceId: dataInfo.province.value,
            });
            if (res && Array.isArray(res.data)) {
                getCenterSource(res.data);
                if (res.data[0]?.centerId) {
                    formRef.current.setFieldsValue({
                        centerId: res.data[0].centerId,
                    });
                } else {
                    formRef.current.setFieldsValue({
                        centerId: '',
                    });
                }
            }
        } catch (e) {
            message.error('出错了，请联系管理员');
        }
    };

    /**
     * @description: 获取排班表信息列表
     * @param {*}
     * @return {*}
     */
    const getScheduleFindListData = (data) => {
        if (!data.dateTime) {
            return;
        }
        if (skipType === 'header') return;

        request(`schedule/findListNew`, {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                groupId: data?.groupId,
                dateTime: moment(data.dateTime).startOf('month').format('YYYY-MM-DD'),
                centerId: data?.centerId,
                groupType: data?.groupType,
            },
        }).then((res) => {
            if (res && Array.isArray(res.days)) {
                setScheduleList(res.days);
                const listData = getListData(moment().subtract('days', -1), res.days);
                handleScheduleRes(listData[0]?.workShiftList);
            }
        });
        // request(`schedule/findList`, {
        //     type: 'post',
        //     baseUrlType: 'groupUrl',
        //     showSuccessMessage: false,
        //     defaultErrorMessage: '获取数据失败',
        //     data: {
        //         pageSize: 40,
        //         pageNum: 1,
        //         provinceId: data?.provinceId,
        //         regionId: data?.regionId,
        //         groupId: data?.groupId,
        //         dateTime: moment(data.dateTime).startOf('month').format('YYYY-MM-DD'),
        //         centerId: data?.centerId,
        //     },
        // }).then((res) => {
        //     if (res && Array.isArray(res.rows)) {
        //         setScheduleList(res.rows);
        //     }
        // });
    };

    /**
     * @description: 省份选择
     * @param {*}
     * @return {*}
     */
    const selectProvince = (province) => {
        // 选择之后重置地市 班组选择框
        const dataInfo = formRef.current.getFieldsValue();
        dataInfo.city = {
            value: -1,
            label: '无',
        };
        dataInfo.group = {};
        // formRef.current.setFieldsValue(dataInfo);
        getProvinceRegions(province.value);
    };

    /**
     * @description: 选择城市
     * @param {*}
     * @return {*}
     */
    const onSelectCity = () => {
        const dataInfo = formRef.current.getFieldsValue();
        dataInfo.group = {};
        formRef.current.setFieldsValue(dataInfo);
        getSearchGroupList();
    };

    /**
     * @description: 重新r日历渲染头部
     * @param {*}
     * @return {*}
     */
    const headerRender = () => {
        const { isAdmin, userId } = JSON.parse(userInfo.userInfo);
        const { operateUser } = newData;
        const isShow = userId === operateUser || isAdmin;
        return (
            <Form
                className="form-container"
                ref={formRef}
                onValuesChange={(e) => {
                    handleFormChange(e);
                }}
                initialValues={{
                    dateTime: moment(moment(new Date()).format('YYYY-MM')),
                    group: newData.groupName,
                    centerId: newData.centerName,
                }}
                style={{ marginBottom: '-20px' }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* <Space> */}
                    <Form.Item label="归属省份" name="province" hidden>
                        <Select
                            placeholder="请选择归属省份"
                            labelInValue
                            style={{ width: '110px' }}
                            // disabled={zoneLevel !== 'country'}
                            onChange={selectProvince}
                        >
                            {Array.isArray(provinceOptions) &&
                                provinceOptions.map((province) => {
                                    return (
                                        <Select.Option value={province.regionId} key={province.regionId}>
                                            {province.regionName}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="归属地市" name="city" hidden>
                        <Select
                            placeholder="请选择归属地市"
                            // disabled={zoneLevel !== 'country' && zoneLevel !== 'province'}
                            labelInValue
                            style={{ width: '110px' }}
                            onChange={onSelectCity}
                        >
                            {Array.isArray(regionOptions) &&
                                regionOptions.map((region) => {
                                    return (
                                        <Select.Option value={region.regionId} key={region.regionId}>
                                            {region.regionName}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="班组" name="group">
                        {skipType === 'header' ? <span>值班长班组</span> : <span>{newData?.groupName}</span>}
                        {/* <span>{newData?.groupName}</span> */}
                        {/* <Input value={newData.groupName} /> */}
                    </Form.Item>
                    <Form.Item label="监控中心" name="centerId">
                        {skipType === 'header' ? (
                            <Select className="form-select-style">
                                {centerListData.map((el) => {
                                    return (
                                        <Select.Option value={el.centerId} key={el.centerId}>
                                            {el.centerName}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        ) : (
                            <span>{newData?.centerName}</span>
                        )}
                        {/* <span>{newData?.centerName}</span> */}
                    </Form.Item>
                    <Form.Item label="月份" name="dateTime">
                        <DatePicker picker="month" disabledDate={disabledDate} />
                    </Form.Item>
                    <Form.Item label="班组类型" name="groupType">
                        {skipType === 'header' ? <span>监控班组</span> : <span>{newData?.groupTypeName}</span>}
                    </Form.Item>
                    <Form.Item style={{ float: 'right' }}>
                        <Space>
                            <Button onClick={handleBack}>返回</Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    if (skipType === 'header') {
                                        const centerId = formRef.current?.getFieldValue('centerId');
                                        onFindScheduleListByShiftForeman();
                                        setCurrentCenterId(centerId);
                                    }
                                    searchData();
                                }}
                            >
                                查询
                            </Button>
                        </Space>
                    </Form.Item>
                    {/* </Space> */}
                </div>
                <div>
                    <Space style={{ float: 'right' }}>
                        {/* <Form.Item
                            style={{
                                marginLeft: '40px'
                            }}
                        >
                            <Button type="primary" onClick={showGroupSettingDialog}>
                                班组设置
                            </Button>
                        </Form.Item> */}
                        {isShow && (
                            <Form.Item>
                                <AuthButton
                                    type="primary"
                                    onClick={() => {
                                        onGetShiftForemanRule();
                                        getUserGroup();
                                    }}
                                    authKey={'monitorDateList:autoschedule'}
                                >
                                    自动排班
                                </AuthButton>
                            </Form.Item>
                        )}
                        {isShow && (
                            <Form.Item>
                                <AuthButton
                                    type="primary"
                                    onClick={() => {
                                        onGetShiftForemanRule();
                                        handleSchedulVisible(true);
                                    }}
                                    authKey={'monitorDateList:batchPush'}
                                >
                                    批量排班
                                </AuthButton>
                            </Form.Item>
                        )}
                        {isShow && (
                            <Form.Item>
                                <AuthButton authKey={'monitorDateList:import'} addLog={true} type="primary" onClick={(params) => importFile(params)}>
                                    导入
                                </AuthButton>
                            </Form.Item>
                        )}
                        <Form.Item>
                            <AuthButton
                                type="primary"
                                authKey={'monitorDateList:export'}
                                onClick={() => {
                                    const dataInfo = formRef.current.getFieldsValue();
                                    if (!dataInfo?.province?.value && !newData?.provinceId && newData?.provinceId !== 0) {
                                        message.error('请在筛选项中选择省份');
                                        return;
                                    }
                                    setGroupInfo(dataInfo);
                                    getRangePickDefaultTime();
                                    handleExportVisible(true);
                                }}
                            >
                                导出
                            </AuthButton>
                        </Form.Item>
                        {isShow && (
                            <Form.Item>
                                <AuthButton
                                    type="primary"
                                    onClick={() => {
                                        onGetShiftForemanRule();
                                        handleEditSchedulVisible(true);
                                    }}
                                    authKey="monitorDateList:editschedule"
                                >
                                    修改班次
                                </AuthButton>
                            </Form.Item>
                        )}
                    </Space>
                </div>
            </Form>
        );
    };

    /**
     * @description: 打开导入弹窗
     * @param {*}
     * @return {*}
     */
    const importFile = (params) => {
        const dataInfo = formRef.current.getFieldsValue();
        if (!dataInfo?.province?.value && !newData?.provinceId && newData?.provinceId !== 0) {
            message.error('请在筛选项中选择省份');
            return;
        }
        setImportVisible(true);
        setErrorData('');
        setGroupInfo(dataInfo);
    };

    /**
     * @description: 导入文件
     * @param {*}
     * @return {*}
     */
    const handleImportFile = (data) => {
        const dataInfo = formRef.current.getFieldsValue();
        const { file } = data;
        const params = new FormData();
        params.append('files', file);

        const originData = {
            provinceName: newData.provinceName || getProvinceNameById(groupInfo?.province?.value),
            centerName: newData.centerName,
            groupName: newData.groupName,
            operateUser: userInfo.userId,
            shiftForemanFlag: 0,
        };
        console.log({ originData });
        if (skipType === 'header') {
            originData.provinceName = zoneName;
            originData.centerName = skipData.centerName;
            originData.groupName = '值班长班组';
            originData.shiftForemanFlag = 1;
        }
        const dataStr = qs.stringify(originData);

        request(`schedule/importDutyUserInfo?${dataStr}`, {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data: params,
        }).then((res) => {
            if (res.resultCode === '200') {
                if (res.resultObj?.allNum === res.resultObj?.successNum) {
                    setImportVisible(false);
                    message.success('导入数据成功');
                    const dataField = formRef.current.getFieldsValue();
                    if (skipType === 'header') {
                        onFindScheduleListByShiftForeman();
                    } else {
                        getScheduleFindListData({
                            dateTime: dataField.dateTime,
                            ...newData,
                        });
                    }
                } else {
                    setErrorData(`导入完成：成功${res.resultObj?.successNum}条，失败${res.resultObj?.failNum}条`);
                    setFailReasonPath(res.resultObj?.errorFilePath);
                }
            } else {
                setErrorData(res.resultMsg);
                setFailReasonPath(res.resultObj?.errorFilePath);
            }
        });
    };

    const handleFormChange = (e) => {
        return;
        if (e.group) {
            getCenterData({ value: e.group.value });
        }
        // if(e.centerId){
        //     console.log(e)
        //     getSearchGroupList(e.centerId)
        // }
    };

    /**
     * @description: 关闭导入弹窗
     * @param {*}
     * @return {*}
     */
    const onImportCancel = () => {
        setImportVisible(false);
        if (errorData !== '') {
            onFindScheduleListByShiftForeman();
            setErrorData('');
        }
    };

    /**
     * @description: 导出文件
     * @param {*}
     * @return {*}
     */
    const exportFile = (params) => {
        const dataInfo = formRef.current.getFieldsValue();
        const starTime = exportTime[0]?.format('YYYY-MM-DD') || null;
        const endTime = exportTime[1]?.format('YYYY-MM-DD') || null;
        const data = {
            provinceId: newData.provinceId,
            provinceName: newData.provinceName,
            groupId: newData.groupId,
            groupName: newData.groupName,
            centerId: newData.centerId,
            dayTimeBegin: starTime,
            dayTimeEnd: endTime,
            exportType,
            shiftForemanFlag: 0,
        };
        if (skipType === 'header') {
            data.provinceId = Number(zoneId);
            data.provinceName = zoneName;
            data.groupName = '值班长班组';
            data.shiftForemanFlag = 1;
            data.groupId = skipGroupId;
            data.centerId = currentCenterId;
        }
        if (!data.dayTimeEnd || !data.dayTimeBegin) {
            return message.error('请选择时间');
        }
        request('schedule/exportDutyUserInfo', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '导出数据失败',
            data,
            responseType: 'blob',
            handlers: {
                params,
            },
        }).then((res) => {
            const b = new Blob([res]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(b);
            link.download = `排班信息 ${exportType === 'account' ? 'A' : 'B'}${moment().format('YYYYMMDDHHmmss')}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(link.href);
            handleExportVisible(false);
        });
    };

    const handleBack = () => {
        // props.history.goBack();
        props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/setting/core/group-manage`);
    };

    /**
     * @description: 查询数据
     * @param {*}
     * @return {*}
     */
    const searchData = () => {
        const data = formRef.current.getFieldsValue();
        if (!data?.dateTime) {
            message.error('日期为必填筛选项');
            return;
        }
        setCalendarValue(moment(data.dateTime).startOf('month'));
        setValidRange([moment(data.dateTime).startOf('month'), moment(data.dateTime).endOf('month')]);
        getScheduleFindListData({
            dateTime: data.dateTime,
            ...newData,
        });
    };

    /**
     * @description: 设置查询不可选用日期
     * @param {*}
     * @return {*}
     */
    const disabledDate = (current) => {
        return current && (current <= moment(new Date()).subtract(2, 'months') || current >= moment(new Date()).add(1, 'months'));
    };

    /**
     * @description: 设置日历不可选用日期
     * @param {*}
     * @return {*}
     */
    const calendarDisabledDate = (current) => {
        // console.log(current);
        return current && current <= moment(new Date()).add(-24, 'hours').endOf('days');
        // return current && current <= moment(new Date()).endOf('days');
    };

    /**
     * @description: 获取日期数据
     * @param {*}
     * @return {*}
     */
    const getListData = (value, days) => {
        let list = days || scheduleList;
        const listData = [];
        Array.isArray(list) &&
            list.forEach((item) => {
                if (moment(new Date(item.dateTime)).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) {
                    listData.push(item);
                }
            });
        return listData;
    };

    // const isSameWeek = (date1, date2) => {
    //     return moment(date1).isSame(moment(date2), 'week');
    // };

    /**
     * @description: 重写日历表格
     * @param {*}
     * @return {*}
     */
    const dateCellRender = (value) => {
        const { systemInfo, userId } = userInfo;
        const listData = getListData(value);
        let dayObj = {
            type: 'day',
            mainId: '',
            mainName: '',
        };
        let nightObj = {
            type: 'night',
            mainId: '',
            mainName: '',
        };
        Array.isArray(listData) &&
            listData.forEach((item) => {
                if (item.type === 'day') {
                    dayObj = item;
                }
                if (item.type === 'night') {
                    nightObj = item;
                }
            });
        const newList = listData[0]?.workShiftList || [];
        const { dateTime } = listData[0] || {};
        const isOverdue = moment(value).valueOf() + 86400000 < moment(new Date()).valueOf();
        const isSame = moment(moment(value).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'), 'day');

        const isBefore = moment().isSameOrBefore(moment(value).format('YYYY-MM-DD'), 'day');
        const isWeekend = [0, 6].includes(moment(listData[0]?.dateTime).day());
        const isMonday = [1].includes(moment(listData[0]?.dateTime).day());
        let maxLength = _.max(newList.map((e) => e.userInfo.length));
        newList.forEach((item) => {
            item.userInfo.forEach((ite) => {
                if (ite.userName?.length > 8) {
                    maxLength += 2.5;
                } else if (ite.userName?.length > 4) {
                    maxLength += 1.5;
                }
            });
        });
        let minHeight = 72;
        let contentPadding = '0 7px';
        if (window.innerHeight > 800) {
            minHeight = maxLength > 8 ? 72 + (maxLength - 8) * 9 : 72;
            contentPadding = '0 7px';
        } else {
            minHeight = maxLength > 6 ? 72 + (maxLength - 6) * 10 : 72;
            contentPadding = '0 3px';
        }
        return (
            <div className={`schedule-list ${isWeekend ? 'weekend' : 'noWeekend'} ${isMonday ? 'monday' : ''} ${isSame ? 'curDay' : ''}`}>
                {isMonday && (
                    <div className="left-edge">
                        {newList.map((item) => {
                            return (
                                <section title={item.workShiftName} className="left-edge-shift">
                                    {item.workShiftName.length > 6 ? item.workShiftName.slice(0, 6) : item.workShiftName}
                                </section>
                            );
                        })}
                    </div>
                )}
                <section style={isOverdue ? { color: 'rgba(0, 0, 0, 0.25)' } : { color: '#1890FF' }} className="date-info">
                    {moment(value).format('DD')}
                </section>
                <section className="schedule-info-wrap">
                    <section className="schedule-info">
                        {newList.map((item) => {
                            return (
                                <section
                                    // onClick={() => this.handleShiftName(item, dateTime)}
                                    // onClick={showUserList.bind(this, item.userInfo, value, item.workShiftId, item)}
                                    onClick={
                                        isOverdue
                                            ? () => handleShiftName(item, dateTime)
                                            : showUserList.bind(this, item.userInfo, value, item.workShiftId, item)
                                    }
                                    className={!isBefore ? 'schedule-info-wrap-field schedule-info-wrap-field-after' : 'schedule-info-wrap-field '}
                                    style={{
                                        minHeight,
                                    }}
                                    key={item.workShiftId}
                                >
                                    {item.userInfo.map((ite) => {
                                        return (
                                            <span
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: contentPadding,
                                                }}
                                            >
                                                {ite?.userName}
                                            </span>
                                        );
                                    })}
                                </section>
                            );
                        })}
                    </section>
                </section>
            </div>
        );
    };

    const getUserGroup = async () => {
        let res;
        if (skipType === 'header') {
            const params = { groupId: skipGroupId };
            res = await findShiftForemanGroupUserList(params);
        } else {
            res = await getGroupUserListById(newData.groupId);
        }
        if (res && Array.isArray(res.rows)) {
            const newList = [];
            res.rows.map((item) => {
                return newList.push({
                    key: item.userId,
                    ...item,
                });
            });
            setScheduleUserList(newList);
            handleAutoSchedulVisible(true);
        }
    };

    /**
     * @description: 点击排班人员打开弹窗
     * @param {*}
     * @return {*}
     */
    const showUserList = async (item, value, id, datas) => {
        const { isAdmin, userId, operationsButton = [] } = JSON.parse(userInfo.userInfo);
        const { operateUser } = newData;
        const isShow = userId === operateUser || isAdmin;
        if (!isShow) {
            return;
        }
        if (!operationsButton.find((item) => item.key === 'monitorDateList:push')) {
            message.error('无单个排班权限');
            return;
        }
        console.log(datas);
        if (moment().format('YYYY-MM-DD') >= moment(value).format('YYYY-MM-DD') && moment().format('HH:mm:ss') > datas.beginTime) {
            return message.error('已超过修改时间');
        }
        const dataInfo = formRef.current.getFieldsValue();
        if (!dataInfo?.dateTime) {
            message.error('请在筛选条件中输入时间');
            setScheduleUserList([]);
            return;
        }

        setGroupInfo(dataInfo);
        setScheduleVisible(true);
        setScheduleUser(null);
        setScheduleInfo({
            // type: item.type,
            dateTime: value,
            // uniqueRdn: item.uniqueRdn,
        });
        handleCurrentWorkId(id);
        if (skipType === 'header') {
            const params = { groupId: skipGroupId };
            const res = await findShiftForemanGroupUserList(params);
            if (res.code === 0) {
                const newList = [];
                res.rows.map((item) => {
                    return newList.push({
                        key: item.userId,
                        ...item,
                    });
                });
                setScheduleUserList(newList);
                setScheduleUser({
                    ...item,
                    userName: item.userName,
                });
                setScheduleUserSelectedRowKeys(_.uniq(item.map((e) => e.userId.toString())));
            }
            return;
        }
        try {
            const res = await getGroupUserListById(newData.groupId);
            if (res && Array.isArray(res.rows)) {
                const newList = [];
                res.rows.map((item) => {
                    return newList.push({
                        key: item.userId,
                        ...item,
                    });
                });
                setScheduleUserList(newList);
                setScheduleUser({
                    ...item,
                    userName: item.userName,
                });
                setScheduleUserSelectedRowKeys(_.uniq(item.map((e) => e.userId.toString())));
            }
        } catch (e) {
            message.error('出错了，请联系管理员');
        }
    };

    /**
     * @description: 关闭排班人员弹窗
     * @param {*}
     * @return {*}
     */
    const onScheduleCancel = () => {
        setScheduleUserSelectedRowKeys([]);
        setScheduleVisible(false);
    };

    /**
     * @description: 选中单个选项
     * @param {*}
     * @return {*}
     */
    const onScheduleChange = (selectedRowKeys, selectedRows) => {
        setScheduleUserSelectedRowKeys(selectedRowKeys);
        setScheduleUser(selectedRows && selectedRows[0]);
    };

    const onTransferChange = (selectedRowKeys, selectedRows) => {
        let curArr = [];
        const newKeys = [...selectedRowKeys];
        const news = [...transferIds];
        if (selectedRowKeys.length > transferIds.length) {
            const arr = news.concat(newKeys);
            arr?.forEach((item) => {
                if (newKeys.find((ite) => ite === item)) {
                    curArr.push(item);
                }
            });
        } else {
            curArr = newKeys;
        }
        handleTransferIds(_.uniq(curArr));
        handleTransferRows(selectedRows && selectedRows);
    };
    /**
     * @description:  设置排班人员
     * @param {*}
     * @return {*}
     */
    const onScheduleOk = (params) => {
        if (!transferRows.length) {
            message.error('请选择值班人员');
            return;
        }
        let apiUrl = 'schedule/saveOneNew';
        const userLists = [];
        transferIds.forEach((ite) => {
            const cur = scheduleUserList.find((e) => e.userId === ite);
            if (cur) {
                userLists.push(cur);
            }
        });
        console.log(userLists, '==list', transferIds, scheduleUserList);
        const data = {
            provinceId: newData.provinceId,
            provinceName: newData.provinceName,
            groupName: newData.groupName,
            groupId: newData.groupId,
            operateUser: userInfo.userId,
            dateTime: moment(scheduleInfo.dateTime).format('YYYY-MM-DD'),
            workShiftId: currentWorkId,
            // users: scheduleUserList
            //     .filter((itm) => transferIds.includes(itm.userId))
            //     .map((item) => {
            //         return {
            //             mainName: item.userName,
            //             mainId: item.userId,
            //             mainTel: item.mobilePhone,
            //         };
            //     }),
            users: userLists.map((item) => {
                return {
                    mainName: item.userName,
                    mainId: item.userId,
                    mainTel: item.mobilePhone,
                };
            }),
        };
        if (skipType === 'header') {
            apiUrl = 'schedule/saveShiftForemanSchedule';
            data.groupId = skipGroupId;
            data.provinceId = Number(zoneId);
            data.provinceName = zoneName;
            data.groupName = '值班长班组';
        }
        scheduleInfo.uniqueRdn && (data.uniqueRdn = scheduleInfo.uniqueRdn);
        request(apiUrl, {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存数据失败',
            data,
            handlers: {
                params,
            },
        }).then((res) => {
            if (res.code === 200 || res.code === 201) {
                if (res.code === 201) {
                    message.success(res.message);
                }
                setScheduleVisible(false);

                const dataField = formRef.current.getFieldsValue();
                if (skipType === 'header') {
                    onFindScheduleListByShiftForeman();
                } else {
                    getScheduleFindListData({
                        dateTime: dataField.dateTime,
                        ...newData,
                    });
                }
                setScheduleUserSelectedRowKeys([]);
            } else {
                message.warn(res.message);
            }
        });
    };

    // 班组设置相关

    /**
     * @description: 打开班组设置弹窗
     * @param {*}
     * @return {*}
     */
    // const showGroupSettingDialog = async () => {
    //     const dataInfo = formRef.current.getFieldsValue();
    //     if (!dataInfo?.province?.value) {
    //         message.error('请在筛选项中选择省份');
    //         return;
    //     }
    //     setGroupSettingDialogVisible(true);
    //     // 初始化 新增删除数组，暂存列表，新增输入框, 选中的班组
    //     setGroupInfo(dataInfo);
    //     setGroupChoosed({ groupId: '', groupName: '' });
    //     renderGroupList();
    // };

    /**
     * @description: 渲染弹窗中的班组列表
     * @param {*}
     * @return {*}
     */
    const renderGroupList = async () => {
        try {
            const res = await getGroupList();
            if (res && Array.isArray(res.rows)) {
                setGroupList(res.rows);
                setGroupChoosed(res.rows[0] || { groupId: '', groupName: '' });
                getGroupUserList(res.rows[0]);
            }
        } catch (e) {
            message.error('出错了，请联系管理员');
        }
    };

    /**
     * @description: 获取当前省市下班组列表
     * @param {*}
     * @return {*}
     */
    const getGroupList = async (e) => {
        const dataInfo = await formRef.current.getFieldsValue();
        return new Promise((resolve) => {
            request('group/findGroupList', {
                type: 'post',
                baseUrlType: 'groupUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取数据失败',
                data: {
                    pageNum: 1,
                    pageSize: 9999,
                    provinceId: dataInfo?.province?.value,
                    regionId: dataInfo?.city?.value,
                    centerId: e || '',
                },
            }).then((res) => {
                resolve(res);
            });
        });
    };

    // 新增一个班组
    const addGroup = () => {
        const list = [...groupList];
        const newGroup = {
            groupId: '',
            groupName: '',
        };
        list.unshift({ ...newGroup });
        setGroupList(list);
        setEditGroup(newGroup);
    };

    // 编辑名称
    const editName = useCallback(
        (e) => {
            const group = { ...editGroup };
            group.groupName = e.target.value;
            setEditGroup(group);
        },
        [editGroup],
    );

    // 取消编辑
    const cancelEdit = () => {
        if (!editGroup) return;
        if (editGroup.groupId === '') {
            const list = [...groupList];
            list.shift();
            setGroupList(list);
        }
        setEditGroup(undefined);
    };

    /**
     * @description: 点击新增班组按钮或编辑icon
     * @param {*}
     * @return {*}
     */
    const showAddGroupInput = (item) => {
        // 如果正在编辑则不添加新的班组或编辑其他班组
        if (editGroup) return;
        item ? setEditGroup({ ...item }) : addGroup();
    };

    // 取消事件冒泡
    const stopPop = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    /**
     * @description: 保存班组数据
     * @param {*}
     * @return {*}
     */
    const onSaveGroupOk = async () => {
        if (!editGroup) return;
        const modifyGroupName = editGroup.groupName;
        const modifyGroupId = editGroup.groupId;
        if (modifyGroupName === '') {
            message.error('未输入班组名称');
            return;
        }
        if (!(await validataGroupName(modifyGroupName))) {
            message.error('不能添加重复名字的班组');
            return;
        }
        const dataInfo = formRef.current.getFieldsValue();
        const data = {
            provinceId: dataInfo?.province?.value,
            provinceName: dataInfo?.province?.label || getProvinceNameById(dataInfo?.province?.value),
            operateUser: userInfo.userId,
            groupName: modifyGroupName,
            groupId: modifyGroupId,
        };
        if (dataInfo?.city?.value && dataInfo?.city?.value !== -1) {
            data.regionId = dataInfo.city.value;
            data.regionName = dataInfo.city.label || '';
        }
        request('group/saveOneGroup', {
            type: 'post',
            baseUrlType: 'groupUrl',
            defaultSuccessMessage: modifyGroupId === '' ? '新增班组成功' : '修改班组成功',
            defaultErrorMessage: '保存数据失败',
            data,
        }).then(() => {
            renderGroupList();
            setEditGroup(undefined);
        });
    };

    /**
     * @description: 校验班组名称是否重复
     * @param {*}
     * @return {*}
     */
    const validataGroupName = (groupName) => {
        return new Promise((resolve) => {
            request('group/checkGroupName', {
                type: 'post',
                baseUrlType: 'groupUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '校验数据失败',
                data: {
                    groupName,
                },
            }).then((res) => {
                resolve(res.code === 200);
            });
        });
    };

    /**
     * @description: 删除班组
     * @param {*}
     * @return {*}
     */
    const deleteGroup = () => {
        Modal.confirm({
            title: '删除班组',
            content: '是否删除选中班组',
            onOk() {
                request('schedule/days7BeforeGroupIdIsExist', {
                    type: 'post',
                    baseUrlType: 'groupUrl',
                    showSuccessMessage: false,
                    defaultErrorMessage: '删除数据失败',
                    data: { groupId: groupChoosed.groupId },
                }).then((res) => {
                    if (res.resultCode === '500') {
                        message.error('当前时间已经存在排班,不能删除');
                    } else {
                        request('group/deleteGroupOne', {
                            type: 'post',
                            baseUrlType: 'groupUrl',
                            defaultSuccessMessage: '删除数据成功',
                            defaultErrorMessage: '删除数据失败',
                            data: { groupId: groupChoosed.groupId },
                        }).then(() => {
                            renderGroupList();
                        });
                    }
                });
            },
        });
    };

    /**
     * @description: 选中班组
     * @param {*}
     * @return {*}
     */
    const chooseGroupItem = (item) => {
        setDelGroupUserSelectedRowKeys([]);
        setDelGroupUser([]);
        setGroupChoosed(item);
        getGroupUserList(item);
    };

    /**
     * @description: 通过groupId获取人员列表获取
     * @param {*} groupId
     * @return {*}
     */
    const getGroupUserListById = (groupId) => {
        if (!groupId) {
            return;
        }
        return new Promise((resolve) => {
            request('group/findGruopUserList', {
                type: 'post',
                baseUrlType: 'groupUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取数据失败',
                data: {
                    groupId,
                    pageNum: 1,
                    pageSize: 9999,
                },
            }).then((res) => {
                resolve(res);
            });
        });
    };

    /**
     * @description: 获取当前班组下的人员列表
     * @param {*}
     * @return {*}
     */
    const getGroupUserList = async (item) => {
        const choosedGroup = item;
        if (!(choosedGroup && choosedGroup.groupId)) {
            return;
        }
        try {
            const res = await getGroupUserListById(choosedGroup.groupId);
            if (res && Array.isArray(res.rows)) {
                setGroupUserList(res.rows);
            } else {
                setGroupUserList([]);
            }
        } catch (e) {
            message.error('出错了，请联系管理员');
        }
    };

    /**
     * @description: 新增人员弹窗
     * @param {*}
     * @return {*}
     */
    const showAddNewUserDialog = () => {
        if (!groupChoosed.groupName) {
            message.error('没有选择操作的班组');
            return;
        }
        setmodifyGroupUserDialogVisible(true);
        getFindUserInfoList();
    };

    const getFindUserInfoList = (pageInfo) => {
        const paginationInfo = pageInfo || pagination;
        const dataInfo = formRef.current.getFieldsValue();
        request('group/findUserInfoList', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                zoneId: dataInfo?.city?.value === -1 ? dataInfo?.province?.value : dataInfo.city.value,
                userName: searchUserName,
                mobilePhone: searchMobilePhone,
                pageNumNew: paginationInfo.current,
                pageSizeNew: paginationInfo.pageSize,
            },
        }).then((res) => {
            setPagination({
                ...paginationInfo,
                total: res.total,
            });
            setProvinceUserList(res.rows);
            const groupArr = groupUserList.map((item) => {
                return item.userId;
            });
            const addarr = addGroupUserList.map((item) => {
                return item.userId;
            });
            const arr = [...groupArr, ...addarr];
            setAddGroupUserSelectedRowKeys(arr);
        });
    };

    /**
     * @description: 新增人员弹窗查询
     * @param {*}
     * @return {*}
     */
    const searchAddNewUserDialog = () => {
        getFindUserInfoList();
    };

    /**
     * @description: 新增人员弹窗表格分页变化
     * @param {*}
     * @return {*}
     */
    const userHandleTableChange = (paginationInfo) => {
        getFindUserInfoList(paginationInfo);
        setPagination(() => {
            getFindUserInfoList(paginationInfo);
            return paginationInfo;
        });
    };

    /**
     * @description: 新增人员弹窗查询输入
     * @param {*}
     * @return {*}
     */
    const searchUserNameChange = (e) => {
        setSearchUserName(e.target.value);
    };
    const searchMobilePhoneChange = (e) => {
        setSearchMobilePhone(e.target.value);
    };

    /**
     * @description: 关闭修改人员弹窗
     * @param {*}
     * @return {*}
     */
    const onCloseModifyDialogClose = () => {
        setmodifyGroupUserDialogVisible(false);
        setAddGroupUserList([]);
    };

    /**
     * @description: 监听新增人员选择
     * @param {*}
     * @return {*}
     */
    const onAddUserChange = (selectedRowKeys, selectedRows) => {
        const list = selectedRows.filter((user) => {
            return !_.find(groupUserList, { userId: user.userId });
        });
        setAddGroupUserList([...addGroupUserList, ...list]);
        setAddGroupUserSelectedRowKeys(selectedRowKeys);
    };

    /**
     * @description: 禁用已选人员勾选
     * @param {*} record
     * @return {*}
     */
    const getCheckboxProps = (record) => {
        return {
            disabled: Boolean(_.find(groupUserList, { userId: record.userId })),
        };
    };

    /**
     * @description: 保存新增用户操作
     * @param {*}
     * @return {*}
     */
    const onModifyGroupUserSave = async () => {
        const data = addGroupUserList.map((user) => {
            return {
                mobilePhone: user.mobilePhone,
                userId: user.userId,
                userName: user.userName,
                groupId: groupChoosed.groupId,
                operateUser: userInfo.userId,
            };
        });
        request('group/saveGroupUserBatch', {
            type: 'post',
            baseUrlType: 'groupUrl',
            defaultSuccessMessage: '新增人员成功',
            defaultErrorMessage: '新增人员失败',
            data,
        }).then(() => {
            setmodifyGroupUserDialogVisible(false);
            getGroupUserList(groupChoosed);
            setAddGroupUserList([]);
        });
    };

    /**
     * @description: 选中用户变化
     * @param {*}
     * @return {*}
     */
    const onDelUserChange = (selectedRowKeys, selectedRows) => {
        setDelGroupUserSelectedRowKeys(selectedRowKeys);
        setDelGroupUser(selectedRows);
    };

    /**
     * @description: 删除用户列表
     * @param {*}
     * @return {*}
     */
    const delGroupUserHandler = () => {
        if (delGroupUser.length === 0) {
            message.error('请选择人员');
            return;
        }
        Modal.confirm({
            title: '删除人员',
            content: '是否删除选中人员',
            onOk() {
                const data = delGroupUser.map((user) => {
                    return {
                        groupId: groupChoosed.groupId,
                        userId: user.userId,
                    };
                });
                request('group/deleteGroupUserBatch', {
                    type: 'post',
                    baseUrlType: 'groupUrl',
                    defaultSuccessMessage: '删除人员成功',
                    defaultErrorMessage: '删除人员失败',
                    data,
                }).then(() => {
                    getGroupUserList(groupChoosed);
                    setDelGroupUser([]);
                });
            },
        });
    };

    /**
     * @description: 关闭班组设置管理
     * @param {*}
     * @return {*}
     */
    const onGroupSettingCancel = () => {
        setGroupSettingDialogVisible(false);
        // 关闭班组设置弹框时如果有正在编辑的班组应将编辑取消
        editGroup && cancelEdit();
    };
    const handleSchedul = (params) => {
        if (cRef?.current) {
            cRef?.current.getData(params);
        }
    };
    const getRangePickDefaultTime = () => {
        const dataInfo = formRef.current.getFieldsValue();
        if (dataInfo.dateTime) {
            handleExportTime([
                moment(moment(dataInfo.dateTime).startOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                moment(moment(dataInfo.dateTime).endOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
            ]);
        }
    };
    const handleAutoSchedule = (params) => {
        if (!autoScheduleData.beginDate || !autoScheduleData.endDate) {
            return message.warn('请完善时间');
        }
        handleAutoScheduleLoading(true);
        if (
            autoScheduleData &&
            autoScheduleData.userGroup &&
            Array.isArray(autoScheduleData.userGroup) &&
            autoScheduleData.userGroup.every((item) => item?.userGroup.length)
        ) {
            const data = {
                provinceId: newData.provinceId, // 省份id
                provinceName: newData.provinceName, // 省份名称
                groupName: newData.groupName, // 班组名称
                groupId: newData.groupId, // 班组id
                operateUser: userInfo.userId, // 操作人员id
                beginDate: autoScheduleData.beginDate.format('YYYY-MM-DD'), // 排班开始时间
                endDate: autoScheduleData.endDate.format('YYYY-MM-DD'), // 排班结束时间
                shiftForemanFlag: 0,
                teams: autoScheduleData.userGroup.map((item) => {
                    return {
                        users: item?.userGroup.map((itm) => {
                            return {
                                mainName: itm.userName,
                                mainId: itm.userId,
                                mainTel: itm.mobilePhone,
                            };
                        }),
                    };
                }),
            };
            if (skipType === 'header') {
                data.provinceId = Number(zoneId);
                data.provinceName = zoneName;
                data.groupName = '值班长班组';
                data.shiftForemanFlag = 1;
                data.groupId = skipGroupId;
            }
            autoSchedule(data, params).then((res) => {
                if (res.code === 200 || res.code === 201) {
                    if (res.code === 201) {
                        message.success(res.message);
                    }
                    handleAutoScheduleLoading(false);
                    const dataField = formRef.current.getFieldsValue();
                    if (skipType === 'header') {
                        onFindScheduleListByShiftForeman();
                    } else {
                        getScheduleFindListData({
                            dateTime: dataField.dateTime,
                            ...newData,
                        });
                    }
                    handleAutoSchedulVisible(false);
                } else {
                    message.warn(res.message);
                    handleAutoScheduleLoading(false);
                    handleAutoSchedulVisible(false);
                }
            });
        } else {
            handleAutoScheduleLoading(false);
            message.warn('请完善组员');
        }
    };
    const handleEditSchedule = () => {
        scheduleRef.current.getData();
    };
    const getSchduleData = (e) => {
        const { advanceTime, delayTime } = e;
        if (advanceTime + delayTime >= scheduleTimeRange) {
            return message.warn('提前时间+延后时间不能大于班次中最小的时间跨度');
        }
        if (defineScheduleData(e) === 'success') {
            const { date } = e;
            const rules = date.map((item) => {
                return {
                    workShiftName: item.name,
                    beginTime: moment(item.startTime).format('HH:mm:ss'),
                    endTime: moment(item.endTime).format('HH:mm:ss'),
                    timeType: item.type,
                };
            });
            const data = {
                groupId: newData.groupId,
                rules,
                advanceTime,
                delayTime,
            };
            Modal.confirm({
                title: '提醒',
                okText: '确认',
                cancelText: '取消',
                content: (
                    <>
                        <div>修改后，次日及以后的所有班次将全部更新，对应的已经排过的班也将同步清空;</div>
                        <div>同时“自定义作业计划(按班次设置)”的内容也将同步清空。</div>
                        <div>是否继续？</div>
                    </>
                ),
                onOk: () => {
                    if (skipType === 'header') {
                        data.groupId = skipGroupId;
                        saveShiftForemanRule(data).then((res) => {
                            if (res.code === 0) {
                                onFindScheduleListByShiftForeman();
                                handleEditSchedulVisible(false);
                                handleScheduleRange(data);
                            }
                        });
                    } else {
                        updateRule(data).then((res) => {
                            if (res) {
                                const dataField = formRef.current.getFieldsValue();
                                getScheduleFindListData({
                                    dateTime: dataField.dateTime,
                                    ...newData,
                                });
                                handleEditSchedulVisible(false);
                                handleScheduleRange(data);
                            }
                        });
                    }
                },
            });
        } else {
            message.warn(defineScheduleData(e));
        }
    };

    const getTimeRange = (e) => {
        handleScheduleTimeRange(e);
    };
    const getAutoScheduleData = (e) => {
        handleAutoScheduleData(e);
    };

    const queryDalendarDayDutyRecords = (data) => {
        return new Promise((reslove) => {
            request('shiftingOfDuty/queryDalendarDayDutyRecords', {
                type: 'GET',
                baseUrlType: 'groupUrl',
                showSuccessMessage: false,
                defaultErrorMessage: false,
                data,
            }).then((res) => {
                reslove(res);
            });
        });
    };

    /**
     * 下载模板
     */
    const downloadTemplate = (type) => {
        const data = {
            provinceId: newData.provinceId,
            provinceName: newData.provinceName,
            groupId: newData.groupId,
            groupName: newData.groupName,
            centerId: newData.centerId,
            importType: type,
        };
        if (skipType === 'header') {
            data.provinceId = Number(zoneId);
            data.provinceName = zoneName;
            data.groupName = '值班长班组';
            data.centerId = currentCenterId;
            data.shiftForemanFlag = 1;
            data.groupId = skipGroupId;
        }
        const dataField = formRef.current.getFieldsValue();
        data.dateTime = dataField.dateTime.format('YYYY-MM-DD');

        createImportTemplate(data).then((result) => {
            blobDownLoad(result, type === 'account' ? `账号导入模板.xlsx` : `姓名/手机导入模板.xlsx`);
        });
    };

    /**
     * 下载失败原因
     */
    const downloadFailReason = () => {
        downloadFailReasonApi(failReasonPath);
    };

    /**
     * @description: 点击排班跳转至详情页
     */
    const handleShiftName = async (item, dateTime) => {
        let data = {
            workShiftId: item?.workShiftId,
            dateTime: dateTime,
        };
        const result = await queryDalendarDayDutyRecords(data);

        const { resultObj } = result || {};

        const { workShiftUsersName = [] } = resultObj || {};

        if (workShiftUsersName.length <= 0) {
            if (skipType === 'header') {
                return message.info('已超过修改时间');
            }
            return message.info('当前排班没有排班信息');
        }

        let schedulingObj = {
            centerName: resultObj?.monitorCenterName,
            dateTime,
            dutyRecord: resultObj?.dutyRecord || null,
            groupId: resultObj?.groupId,
            groupName: resultObj?.groupName,
            handOverTime: resultObj?.handOverTime || null,
            handOverType: resultObj?.handOverType || null,
            importanceInform: resultObj?.importanceInform || null,
            provinceName: resultObj?.provinceName,
            takeOverTime: dateTime,
            takeOverType: resultObj?.takeOverType || null,
            userId: resultObj?.userId,
            workShiftId: item?.workShiftId,
            workShiftName: resultObj?.workShiftName,
            workShiftUserNames: resultObj?.workShiftUserNames,
        };

        setSchedulingObj({ ...schedulingObj });
        // setChangeShiftsVisible(true);
        if (workShiftUsersName.length <= 0) return message.info('当前排班没有排班信息');
        console.log('schedulingObj', schedulingObj);
        pushActions({ ...schedulingObj });
    };

    const getChangeShiftsVisible = (e) => {
        setChangeShiftsVisible(e);
    };
    const pushActions = (data) => {
        const { actions } = actionss;
        const searchObj = _.pick(data, ['groupId', 'workShiftId']);
        if (actions?.postMessage) {
            openRoute('/duty-record-detail', { ...searchObj, dateTime: data.takeOverTime });
        } else {
            props.history.push(
                `/znjk/${constants.CUR_ENVIRONMENT}/unicom/duty-record-detail?${urlSearchObjFormat(
                    { ...searchObj, dateTime: data.takeOverTime },
                    'str',
                )}`,
            );
        }
    };

    return (
        <>
            <div className="home-unicon-monitor-date-container" style={changeShiftsVisible ? { display: 'none' } : undefined}>
                <Calendar
                    dateFullCellRender={dateCellRender}
                    headerRender={headerRender}
                    // disabledDate={calendarDisabledDate}
                    value={calendarValue}
                    validRange={validRange}
                />
                <Modal
                    title="班组设置"
                    visible={groupSettingDialogVisible}
                    width="970px"
                    style={{
                        height: '500px',
                    }}
                    footer={[<Button onClick={onGroupSettingCancel}>关闭</Button>]}
                    onCancel={onGroupSettingCancel}
                >
                    <div className="area-container">
                        <section>
                            省份：
                            {(groupInfo && groupInfo.province && groupInfo.province.label) ||
                                getProvinceNameById(groupInfo && groupInfo.province && groupInfo.province?.value)}
                        </section>
                        {groupInfo && groupInfo.city && groupInfo.city.label && groupInfo.city.value !== -1 && (
                            <section>地市： {groupInfo && groupInfo.city && groupInfo.city.label}</section>
                        )}
                    </div>
                    <div className="setting-info-container">
                        <section className="group-list">
                            <section className="group-list-button">
                                <Space>
                                    <Button type="primary" size="small" onClick={showAddGroupInput.bind(this, null)}>
                                        新增班组
                                    </Button>
                                    <Button type="primary" size="small" onClick={deleteGroup}>
                                        删除
                                    </Button>
                                </Space>
                            </section>
                            <section className="group-list-container">
                                {Array.isArray(groupList) &&
                                    groupList.map((item) => (
                                        <section
                                            className={groupChoosed.groupName === item.groupName ? 'group-item group-item-choosed' : 'group-item'}
                                            key={item.groupId}
                                            onClick={chooseGroupItem.bind(this, item)}
                                        >
                                            {editGroup && item.groupId === editGroup.groupId ? (
                                                <div onClick={stopPop} className="group-eidt-wrapper">
                                                    <Input onChange={editName} value={editGroup.groupName} className="edit-name-ipt" allowClear />
                                                    <Icon antdIcon type="CheckOutlined" onClick={onSaveGroupOk} className="group-operation" />
                                                    <Icon antdIcon type="CloseOutlined" onClick={cancelEdit} className="group-operation" />
                                                </div>
                                            ) : (
                                                <>
                                                    <Tooltip title={item.groupName}>{item.groupName.substr(0, 15)}</Tooltip>
                                                    <Icon type="EditOutlined" title="编辑" antdIcon onClick={showAddGroupInput.bind(this, item)} />
                                                </>
                                            )}
                                        </section>
                                    ))}
                            </section>
                        </section>
                        <section className="user-table">
                            <section className="group-list-button">
                                <Space>
                                    <Button type="primary" size="small" onClick={showAddNewUserDialog}>
                                        新增人员
                                    </Button>
                                    <Button type="primary" size="small" onClick={delGroupUserHandler}>
                                        删除
                                    </Button>
                                </Space>
                            </section>
                            <Table
                                columns={userColumns}
                                dataSource={groupUserList}
                                bordered
                                rowKey="userId"
                                size="small"
                                pagination={false}
                                scroll={{ y: 350 }}
                                rowSelection={{
                                    type: 'checkbox',
                                    onChange: onDelUserChange,
                                    selectedRowKeys: delGroupUserSelectedRowKeys,
                                }}
                            />
                        </section>
                    </div>
                </Modal>
                <Modal
                    title="人员列表"
                    visible={modifyGroupUserDialogVisible}
                    width="700px"
                    onOk={onModifyGroupUserSave}
                    onCancel={onCloseModifyDialogClose}
                >
                    <Input
                        style={{ width: '110px', margin: '10px' }}
                        onChange={searchUserNameChange}
                        value={searchUserName}
                        placeholder="请输入姓名"
                        allowClear
                    />
                    <Input
                        style={{ width: '110px', margin: '10px' }}
                        onChange={searchMobilePhoneChange}
                        value={searchMobilePhone}
                        placeholder="请输入电话"
                        allowClear
                    />
                    <Button style={{ margin: '10px' }} type="primary" onClick={searchAddNewUserDialog}>
                        查询
                    </Button>
                    <Table
                        dataSource={provinceUserList}
                        columns={userColumns}
                        pagination={pagination}
                        onChange={userHandleTableChange}
                        size="small"
                        scroll={{ y: 350 }}
                        rowSelection={{
                            type: 'checkbox',
                            onChange: onAddUserChange,
                            selectedRowKeys: addGroupUserSelectedRowKeys,
                            getCheckboxProps,
                        }}
                        rowKey="userId"
                        bordered
                    />
                </Modal>
                <Modal
                    title="值班人员选择"
                    visible={scheduleVisible}
                    onOk={onScheduleOk}
                    destroyOnClose
                    onCancel={onScheduleCancel}
                    footer={
                        <CustomModalFooter
                            okButtonProps={{ logFalse: true }}
                            authKey={'monitorDateList:push'}
                            onCancel={onScheduleCancel}
                            onOk={onScheduleOk}
                        />
                    }
                >
                    <div className="monitor-transfer-container">
                        <ScheduleTransfer
                            columns={scheduleColumns}
                            dataSource={scheduleUserList}
                            targetKeys={scheduleUserSelectedRowKeys}
                            onTransferChange={onTransferChange}
                        />
                    </div>
                </Modal>
                <Modal title="导入" visible={importVisible} onCancel={onImportCancel} footer={null}>
                    <div className="area-container">
                        <section style={{ width: '150px' }}>
                            归属省份：
                            {skipType === 'header' ? skipData.provinceName : newData.provinceName || getProvinceNameById(groupInfo?.province?.value)}
                        </section>
                        <section>归属监控中心：{skipType === 'header' ? skipData.centerName : newData?.centerName}</section>
                    </div>
                    <div className="area-container">
                        <section style={{ width: '300px' }}>班组：{skipType === 'header' ? '值班长班组' : newData.groupName}</section>
                    </div>
                    <div className="area-container">
                        <Space>
                            附件：
                            <Upload customRequest={handleImportFile} showUploadList={false} multiple={false} maxCount={1} accept=".xls, .xlsx">
                                <Button type="primary">上传</Button>
                            </Upload>
                        </Space>
                        <Space>
                            <Button type="link" onClick={() => downloadTemplate('account')}>
                                按账号导入模板下载
                            </Button>
                            <Button type="link" onClick={() => downloadTemplate('telephone')}>
                                按姓名/手机号导入模板下载
                            </Button>
                        </Space>
                    </div>
                    {errorData ? (
                        <div>
                            <Space>
                                <span
                                    style={{
                                        color: 'red',
                                        lineHeight: '26px',
                                    }}
                                >
                                    {`${errorData?.replace(/\\n/g, ' \n')}`}
                                </span>
                                {failReasonPath ? (
                                    <Button type="link" onClick={downloadFailReason}>
                                        失败原因下载
                                    </Button>
                                ) : null}
                            </Space>
                        </div>
                    ) : null}
                </Modal>
                <Modal
                    title="导出"
                    visible={exportVisible}
                    onCancel={() => {
                        handleExportVisible(false);
                    }}
                    onOk={() => {
                        exportFile();
                    }}
                    footer={
                        <CustomModalFooter
                            authKey={'monitorDateList:export'}
                            onCancel={() => handleExportVisible(false)}
                            onOk={(params) => exportFile(params)}
                        />
                    }
                >
                    <div className="area-container">
                        <section style={{ width: '150px' }}>
                            归属省份：
                            {skipType === 'header' ? skipData.provinceName : newData.provinceName || getProvinceNameById(groupInfo?.province?.value)}
                        </section>
                    </div>
                    <div className="area-container">
                        <section style={{ width: '300px' }}>班组：{skipType === 'header' ? '值班长班组' : newData.groupName}</section>
                    </div>
                    <div className="area-container">
                        <section style={{ width: '400px' }}>
                            日期：
                            <RangePicker
                                value={exportTime}
                                format="YYYY-MM-DD"
                                onChange={(e) => {
                                    handleExportTime(e);
                                }}
                            />
                        </section>
                    </div>
                    <div className="area-container">
                        <section style={{ width: '400px' }}>
                            导出方式：
                            <Select
                                placeholder="请选择导出方式"
                                labelInValue
                                style={{ width: '150px' }}
                                multiple={false}
                                defaultValue={exportType}
                                onChange={(e) => {
                                    setExportType(e.value);
                                }}
                            >
                                <Select.Option value={'account'} key={'account'}>
                                    按账号导出
                                </Select.Option>
                                ,
                                <Select.Option value={'telephone'} key={'telephone'}>
                                    按姓名/手机号导出
                                </Select.Option>
                            </Select>
                        </section>
                    </div>
                </Modal>
                <Modal
                    title="批量排班"
                    visible={schedulVisible}
                    onCancel={() => {
                        handleSchedulVisible(false);
                    }}
                    onOk={(params) => {
                        handleSchedul(params);
                    }}
                    footer={
                        <CustomModalFooter
                            authKey={'monitorDateList:batchPush'}
                            onCancel={() => handleSchedulVisible(false)}
                            onOk={(params) => handleSchedul(params)}
                        />
                    }
                    destroyOnClose
                >
                    <BatchSchedul
                        skipType={skipType}
                        curSelParmExport={newData}
                        ref={cRef}
                        handleOk={(res) => {
                            if (res.code === 200 || res.code === 201) {
                                message.success(res.message);
                                handleSchedulVisible(false);
                                const dataField = formRef.current.getFieldsValue();
                                if (skipType === 'header') {
                                    onFindScheduleListByShiftForeman();
                                } else {
                                    getScheduleFindListData({
                                        dateTime: dataField.dateTime,
                                        ...newData,
                                    });
                                }
                            } else {
                                message.error(res.message);
                            }
                        }}
                        skipGroupId={skipGroupId}
                        scheduleRes={skipType === 'header' ? shiftForemanRule.rules : scheduleRes}
                    />
                </Modal>
                <Modal
                    width={800}
                    title="自动排班"
                    visible={autoScheduleVisible}
                    onCancel={() => {
                        handleAutoSchedulVisible(false);
                    }}
                    onOk={() => {
                        handleAutoSchedule();
                    }}
                    footer={
                        <CustomModalFooter
                            authKey="monitorDateList:autoschedule"
                            onCancel={() => handleAutoSchedulVisible(false)}
                            onOk={(params) => handleAutoSchedule(params)}
                        />
                    }
                    destroyOnClose
                >
                    <Spin tip="加载中..." spinning={autoScheduleLoading}>
                        <AutoSchedule
                            columns={scheduleColumns}
                            userSource={scheduleUserList}
                            rowData={skipType === 'header' ? skipData : newData}
                            scheduleRes={skipType === 'header' ? shiftForemanRule.rules : scheduleRes}
                            getAutoScheduleData={getAutoScheduleData}
                        />
                    </Spin>
                </Modal>
                <Modal
                    destroyOnClose
                    width={800}
                    title="修改班次"
                    visible={editScheduleVisible}
                    onCancel={() => {
                        handleEditSchedulVisible(false);
                    }}
                    onOk={() => {
                        handleEditSchedule();
                    }}
                    footer={
                        <CustomModalFooter
                            authKey={'monitorDateList:editschedule'}
                            onCancel={() => handleEditSchedulVisible(false)}
                            onOk={(params) => handleEditSchedule(params)}
                        />
                    }
                    maskClosable={false}
                >
                    <MyChild
                        ref={scheduleRef}
                        scheduleProps={userInfo}
                        handleSchduleData={getSchduleData}
                        getTimeRange={getTimeRange}
                        rowData={skipType === 'header' ? shiftForemanRule.rules : scheduleRes}
                        scheduleRange={skipType === 'header' ? shiftForemanRule : scheduleRange}
                        skipType={skipType}
                    />
                </Modal>
            </div>
            {changeShiftsVisible ? (
                <ChangeShifts
                    history={props.history}
                    schedulingObj={schedulingObj}
                    getChangeShiftsVisible={getChangeShiftsVisible}
                    type={ShiftChangeTypeEnum.DutyRecords}
                />
            ) : null}
        </>
    );
};

export default MonitorDateList;
