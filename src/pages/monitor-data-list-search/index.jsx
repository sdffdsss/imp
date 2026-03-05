/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Calendar, Button, Select, DatePicker, Space, message, Tooltip } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import actionss from '@Src/share/actions';
import { openRoute } from '@Src/hooks';
import request from '@Common/api';
import { urlSearchObjFormat } from '@Common/utils/urlSearchObjFormat';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import constants from '@Src/common/constants';
import { getCenterList } from './api';
import './index.less';

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
const emailPng = `${constants.STATIC_PATH}/images/email.png`;
const telephonePng = `${constants.STATIC_PATH}/images/telephone.png`;
const departPng = `${constants.STATIC_PATH}/images/depart.png`;
const formLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 17,
    },
};
const CustomTooltip = ({ data: item }) => (
    <div className="tooltip-content" style={{ color: 'rgb(51, 51, 51)' }}>
        <div style={{ marginBottom: 10 }}>
            <h3>{item?.userName}</h3>
            <div className="content-loginId">{item?.loginId}</div>
        </div>
        <div className="content-item">
            <img src={telephonePng} alt="" />
            <div>{item?.userMobile}</div>
        </div>
        <div className="content-item">
            <img src={emailPng} alt="" />
            <div>{item?.userEmail}</div>
        </div>
        <div className="content-item">
            <img src={departPng} alt="" />
            <div>{item?.deptName}</div>
        </div>
    </div>
);

const MonitorDateList = (props) => {
    const [schedulingObj, setSchedulingObj] = useState({});
    // const history = createBrowserHistory()

    // 查询项相关
    const [searchGroupOptions, setSearchGroupOptions] = useState([]);
    const [centerSource, getCenterSource] = useState([]);

    // 排班表日志相关
    const [calendarValue, setCalendarValue] = useState(moment(new Date()));
    const [validRange, setValidRange] = useState([moment(new Date()).startOf('month'), moment(new Date()).endOf('month')]);
    const [scheduleList, setScheduleList] = useState([]);
    const formRef = useRef();
    const cellRef = useRef();
    const userInfo = useLoginInfoModel();
    // 导出时间
    // const [rangePickTime,setRangePickTime] = useState([])

    useEffect(() => {
        (async () => {
            let needSetGroup = true;
            let needSetCenter = true;
            if (userInfo.zoneLevelFlags.isCountryZone) {
                const res = await getDefaultGroupByUser();

                if (res.groupId) {
                    formRef.current?.setFieldsValue({
                        group: res.groupId,
                    });
                    needSetGroup = false;
                }

                if (res.centerId) {
                    formRef.current?.setFieldsValue({
                        centerId: res.centerId,
                    });
                    needSetCenter = false;
                }
            }
            await getCenterData(needSetCenter);
            await getSearchGroupList(needSetGroup);
            searchData();
        })();
    }, []);
    /**
     * @description: 获取班组信息
     * @param {*}
     * @return {*}
     */
    const getSearchGroupList = async (needSetGroup = true) => {
        const dataInfo = formRef.current.getFieldsValue();
        if (!dataInfo.centerId) {
            return;
        }
        const res = await getGroupList(dataInfo.centerId);
        if (res && Array.isArray(res.rows)) {
            if (needSetGroup) {
                // 默认选取第一个为显示班组
                const tempObj = res.rows[0];
                formRef.current.setFieldsValue({
                    group: tempObj?.groupId,
                });
            }
            setSearchGroupOptions(res && res.rows);
        }
    };

    /**
     * @description: 获取监控中心信息
     * @param {*}
     * @return {*}
     */
    const getCenterData = async (needSetCenter) => {
        const { systemInfo } = userInfo;
        const userInfos = (userInfo.userInfo && JSON.parse(userInfo.userInfo)) || {};
        const res = await getCenterList({
            associatedGroupId: '',
            provinceId: systemInfo?.currentZone?.zoneId
                ? systemInfo?.currentZone?.zoneId
                : userInfos?.zones[0]?.zoneLevel === '3'
                ? userInfos?.zones[0]?.zoneLevel_2Id
                : userInfos?.zones[0]?.zoneId,
        });
        if (res && Array.isArray(res.data)) {
            getCenterSource(res.data);
            if (needSetCenter) {
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
            }
        });
    };
    /**
     * @description: 重新r日历渲染头部
     * @param {*}
     * @return {*}
     */
    const headerRender = () => {
        return (
            <Form
                className="form-container"
                ref={formRef}
                initialValues={{
                    dateTime: moment(moment(new Date()).format('YYYY-MM')),
                }}
                layout="inline"
                {...formLayout}
            >
                <Form.Item label="月份" name="dateTime" style={{ flex: 1 }}>
                    <DatePicker picker="month" disabledDate={disabledDate} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="监控中心" name="centerId" style={{ flex: 1 }}>
                    <Select placeholder="监控中心" onChange={() => getSearchGroupList()} style={{ width: '100%' }}>
                        {Array.isArray(centerSource) &&
                            centerSource.map((center) => {
                                return (
                                    <Select.Option value={center.centerId} key={center.centerId}>
                                        {center.centerName}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                </Form.Item>
                <Form.Item label="班组" name="group" style={{ flex: 1 }}>
                    <Select placeholder="请选择班组" style={{ width: '100%' }}>
                        {Array.isArray(searchGroupOptions) &&
                            searchGroupOptions.map((group) => {
                                return (
                                    <Select.Option value={group.groupId} key={group.groupId}>
                                        {group.groupName}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                </Form.Item>
                <Form.Item label="班组类型" name="groupType" style={{ flex: 1 }}>
                    <Select placeholder="请选择班组类型" options={groupTypeList} />
                </Form.Item>

                <Form.Item style={{ float: 'right' }}>
                    <Space>
                        <Button type="primary" onClick={searchData}>
                            查询
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        );
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
            // dateTime: '2024-08-01',
            // groupId: -2127600091,
            // centerId: -1234780682,
            dateTime: data.dateTime,
            groupId: data.group,
            centerId: data.centerId,
            groupType: data.groupType,
        });
    };

    /**
     * @description: 设置查询不可选用日期
     * @param {*}
     * @return {*}
     */
    const disabledDate = (current) => {
        return current && (current <= moment(new Date()).subtract(2, 'months') || current >= moment(new Date()).add(3, 'months'));
    };

    /**
     * @description: 获取日期数据
     * @param {*}
     * @return {*}
     */
    const getListData = (value) => {
        const listData = [];
        Array.isArray(scheduleList) &&
            scheduleList.forEach((item) => {
                if (moment(new Date(item.dateTime)).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) {
                    listData.push(item);
                }
            });
        return listData;
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
     * @description: 点击排班跳转至详情页
     */
    const handleShiftName = async (item, dateTime) => {
        let data = {
            workShiftId: item?.workShiftId,
            dateTime: dateTime,
        };
        const result = await queryDalendarDayDutyRecords(data);

        const { resultObj } = result || {};

        const { workShiftUsersName } = resultObj || {};

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
        if (workShiftUsersName.length <= 0) return message.info('当前排班没有排班信息');
        console.log('schedulingObj', schedulingObj);
        pushActions({ ...schedulingObj });
    };

    /**
     * @description: 重写日历表格
     * @param {*}
     * @return {*}
     */
    const dateCellRender = (value) => {
        const { systemInfo, userId } = userInfo;
        const listData = getListData(value);
        // let dayObj = {
        //     type: 'day',
        //     mainId: '',
        //     mainName: '',
        // };
        // let nightObj = {
        //     type: 'night',
        //     mainId: '',
        //     mainName: '',
        // };
        // Array.isArray(listData) &&
        //     listData.forEach((item) => {
        //         if (item.type === 'day') {
        //             dayObj = item;
        //         }
        //         if (item.type === 'night') {
        //             nightObj = item;
        //         }
        //     });
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
                                    onClick={isOverdue ? () => handleShiftName(item, dateTime) : undefined}
                                    className={!isBefore ? 'schedule-info-wrap-field schedule-info-wrap-field-after' : 'schedule-info-wrap-field '}
                                    // className={`schedule-info-wrap-field cell-${moment(value).format('YYYY-MM-DD')}-${ind} `}
                                    // style={
                                    //     dayObj.outstanding
                                    //         ? systemInfo.theme === 'light'
                                    //             ? { background: '#c4e5f9' }
                                    //             : { background: '#1899e8' }
                                    //         : {}
                                    // }
                                    style={{
                                        minHeight,
                                        // minHeight: maxLength > 8 ? 72 + (maxLength - 8) * 7 : 72,
                                    }}
                                    key={item.workShiftId}
                                >
                                    {item.userInfo.map((ite) => {
                                        return (
                                            <Tooltip overlayClassName="calendar-tooltip" title={<CustomTooltip data={ite} />}>
                                                <span
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: contentPadding,
                                                    }}
                                                >
                                                    {ite?.userName}
                                                </span>
                                            </Tooltip>
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
        <div className="home-unicon-monitor-date-container">
            <Calendar dateFullCellRender={dateCellRender} headerRender={headerRender} value={calendarValue} validRange={validRange} />
        </div>
    );
};

export default MonitorDateList;
