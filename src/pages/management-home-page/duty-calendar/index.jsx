import React, { Fragment } from 'react';
import { Calendar, Form, Select, InputNumber, Icon, message } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import moment from 'moment';
import request from '@Common/api';
import { ReactComponent as WindowSvg1 } from '../img/u2175.svg';
import formatReg from '@Common/formatReg';
import { limitDecimals } from '@Common/format';
import { logNew } from '@Common/api/service/log';
import actionss from '@Src/share/actions';
import { withRouter } from 'react-router-dom';

class DutyCalendar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            scheduleList: [],
            validRange: [moment(new Date()).startOf('month'), moment(new Date()).endOf('month')],
            calendarValue: moment(new Date()),
            searchGroupOptions: [],
            numMonth: moment().format('MM'),
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getSearchGroupList();
        this.setState({
            openPage: { label: '值班日志查询', path: '/unicom/management-home-page/record-duty', openId: '300051' },
        });
    }

    /**
     * @description: 获取班组信息
     * @param {*}
     * @return {*}
     */
    getSearchGroupList = async () => {
        const res = await this.findGroupsByUser();
        if (res && Array.isArray(res.rows)) {
            // 默认选取第一个为显示班组
            const tempObj = res.rows[0];

            this.formRef.current?.setFieldsValue({
                group: tempObj?.groupId,
            });
            this.setState({
                searchGroupOptions: res && res.rows,
            });
            const {
                login: { userId },
            } = this.props;
            this.getScheduleFindListData({
                groupId: tempObj?.groupId,
                dateTime: moment().format('YYYY') + '-' + moment().format('MM') + '-01',
                operateUser: userId,
            });
        }
    };

    /**
     * @description: 获取当前省市下班组列表
     * @param {*}
     * @return {*}
     */
    findGroupsByUser = async (e) => {
        const {
            login: { userId, systemInfo, userInfo },
        } = this.props;

        const regionId = await this.getProvinceData();
        return new Promise((resolve) => {
            request('group/findGroupsByUser', {
                type: 'post',
                baseUrlType: 'groupUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取数据失败',
                data: {
                    operateUser: userId,
                    regionId: systemInfo.currentZone?.zoneId ? systemInfo.currentZone?.zoneId : regionId,
                },
            }).then((res) => {
                resolve(res);
            });
        });
    };

    // 获取归属省份
    getProvinceData = () => {
        const {
            login: { userId },
        } = this.props;
        return new Promise((resolve) => {
            request('group/findProvinces', {
                type: 'post',
                baseUrlType: 'groupUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取省份数据失败',
                data: {
                    creator: userId,
                },
            }).then((res) => {
                resolve(res[0].regionId);
            });
        });
    };

    /**
     * @description: 获取排班表信息列表
     * @param {*}
     * @return {*}
     */
    getScheduleFindListData = (data) => {
        request(`schedule/findListNew`, {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        }).then((res) => {
            if (res && Array.isArray(res.days)) {
                this.setState({
                    scheduleList: res.days,
                });
            }
        });
    };

    queryDalendarDayDutyRecords = (data) => {
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
    // handleShiftName = async (item, dateTime) => {
    //     let data = {
    //         workShiftId: item?.workShiftId,
    //         dateTime: dateTime,
    //     };
    //     const result = await this.queryDalendarDayDutyRecords(data);

    //     const { resultObj } = result || {};

    //     let schedulingObj = {
    //         centerName: resultObj?.monitorCenterName,
    //         dateTime,
    //         dutyRecord: resultObj?.dutyRecord || null,
    //         groupId: resultObj?.groupId,
    //         groupName: resultObj?.groupName,
    //         handOverTime: resultObj?.handOverTime || null,
    //         handOverType: resultObj?.handOverType || null,
    //         importanceInform: resultObj?.importanceInform || null,
    //         provinceName: resultObj?.provinceName,
    //         takeOverTime: dateTime,
    //         takeOverType: resultObj?.takeOverType || null,
    //         userId: resultObj?.userId,
    //         workShiftId: item?.workShiftId,
    //         workShiftName: resultObj?.workShiftName,
    //         workShiftUserNames: resultObj?.workShiftUserNames,
    //     };

    //     this.props.history.push({
    //         pathname: '/change-shifts-page/change-shifts',
    //         state: { type: 3, schedulingObj },
    //     });
    // };

    /**
     * @description: 重写日历表格
     * @param {*}
     * @return {*}
     */
    dateCellRender = (value) => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const listData = this.getListData(value);
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

        let isSame = moment(moment(value).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'), 'day');

        let isBefore = moment().isSameOrBefore(moment(value).format('YYYY-MM-DD'), 'day');

        return (
            <div className="schedule-list">
                <section className="date-info">{moment(value).format('DD')}</section>
                <section className="schedule-info-wrap">
                    <section className="schedule-info">
                        {newList.map((item) => {
                            if (item.userInfo?.mainId == userId) {
                                return (
                                    <section
                                        // onClick={() => this.handleShiftName(item, dateTime)}
                                        // onClick={showUserList.bind(this, item.userInfo, value, item.workShiftId, item)}
                                        // className={
                                        //     isSame
                                        //         ? 'schedule-info-wrap-field schedule-info-wrap-field-check'
                                        //         : isBefore
                                        //         ? 'schedule-info-wrap-field schedule-info-wrap-field-before'
                                        //         : 'schedule-info-wrap-field schedule-info-wrap-field-after'
                                        // }
                                        // style={
                                        //     dayObj.outstanding
                                        //         ? systemInfo.theme === 'light'
                                        //             ? { background: '#000000' }
                                        //             : { background: '#000000' }
                                        //         : {}
                                        // }
                                        className={`schedule-info-wrap-field cell-${moment(value).format('YYYY-MM-DD')}-${ind} `}
                                        style={{ minHeight: item.userInfo.length > 3 ? undefined : 72 }}
                                        key={item.workShiftId}
                                    >
                                        <span style={{ minWidth: '36px', textAlign: 'center' }}>{item.workShiftName}</span>
                                        {item.userInfo?.mainId == userId && <span title={item.userInfo?.mainName}>{item.userInfo?.mainName}</span>}
                                    </section>
                                );
                            } else {
                                return (
                                    <section
                                        // onClick={() => this.handleShiftName(item, dateTime)}
                                        // onClick={showUserList.bind(this, item.userInfo, value, item.workShiftId, item)}
                                        className={
                                            !isBefore ? 'schedule-info-wrap-field schedule-info-wrap-field-after' : 'schedule-info-wrap-field '
                                        }
                                        style={
                                            dayObj.outstanding
                                                ? systemInfo.theme === 'light'
                                                    ? { background: '#c4e5f9' }
                                                    : { background: '#1899e8' }
                                                : {}
                                        }
                                        key={item.workShiftId}
                                    >
                                        <span style={{ minWidth: '36px', textAlign: 'center' }}>{item.workShiftName}</span>
                                        {/* <span>: </span> */}
                                        <span style={!isBefore ? { color: '#BFBFBF' } : {}} title={item.userInfo?.mainName}>
                                            {item.userInfo?.mainName}
                                        </span>
                                    </section>
                                );
                            }
                        })}
                    </section>
                </section>
            </div>
        );
    };

    /**
     * @description: 获取日期数据
     * @param {*}
     * @return {*}
     */
    getListData = (value) => {
        const { scheduleList } = this.state;
        const listData = [];
        Array.isArray(scheduleList) &&
            scheduleList.forEach((item) => {
                if (moment(new Date(item.dateTime)).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) {
                    listData.push(item);
                }
            });
        return listData;
    };

    /**
     * @description: 重新r日历渲染头部
     * @param {*}
     * @return {*}
     */
    headerRender = () => {
        const { searchGroupOptions, numMonth } = this.state;
        return (
            <Form className="form-container" ref={this.formRef} onValuesChange={this.onValuesChange}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'end',
                    }}
                >
                    <div className="form-container-month">
                        {moment().format('YYYY')}年{numMonth}月
                    </div>
                    <Form.Item label="班组" name="group">
                        <Select
                            placeholder="请选择班组"
                            style={{ marginRight: '10px', width: '110px' }}
                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                            onChange={() => logNew(`值班管理值班日历`, '300053')}
                        >
                            {Array.isArray(searchGroupOptions) &&
                                searchGroupOptions.map((group) => {
                                    return (
                                        <Select.Option value={group.groupId} key={group.groupId} onChange={this.onGroupChange}>
                                            {group.groupName}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="" name="num">
                        <InputNumber
                            onChange={this.onNumChange}
                            formater={limitDecimals}
                            parser={limitDecimals}
                            min={parseInt(moment().format('MM')) - 2}
                            max={parseInt(moment().format('MM')) + 3}
                            defaultValue={moment().format('MM')}
                            style={{ marginRight: '10px', width: '50px' }}
                        />
                        <div>月</div>
                    </Form.Item>

                    {/* <Form.Item style={{ float: 'right' }}>
                        <Space>
                            <Button type="primary" onClick={searchData}>
                                查询
                            </Button>
                        </Space>
                    </Form.Item> */}
                </div>
            </Form>
        );
    };
    onValuesChange = (value) => {
        const {
            login: { userId },
        } = this.props;
        const { numMonth } = this.state;
        this.getScheduleFindListData({
            groupId: value.group,
            dateTime: moment().format('YYYY') + '-' + numMonth + '-01',
            operateUser: userId,
        });
    };

    onNumChange = (value) => {
        const {
            login: { userId },
        } = this.props;
        if (value) {
            this.setState(
                {
                    numMonth: value >= 10 ? value : '0' + value,
                    validRange: [
                        moment(value >= 10 ? moment().format('YYYY') + '-' + value + '-01' : moment().format('YYYY') + '-0' + value + '-01').startOf(
                            'month',
                        ),
                        moment(value >= 10 ? moment().format('YYYY') + '-' + value + '-01' : moment().format('YYYY') + '-0' + value + '-01').endOf(
                            'month',
                        ),
                    ],
                    calendarValue: moment(
                        new Date(value >= 10 ? moment().format('YYYY') + '-' + value + '-01' : moment().format('YYYY') + '-0' + value + '-01'),
                    ).startOf('month'),
                },
                () => {
                    const data = this.formRef.current.getFieldsValue();
                    this.getScheduleFindListData({
                        groupId: data.group,
                        dateTime: value >= 10 ? moment().format('YYYY') + '-' + value + '-01' : moment().format('YYYY') + '-0' + value + '-01',
                        operateUser: userId,
                    });
                },
            );
        }
    };

    render() {
        const { validRange, calendarValue } = this.state;
        return (
            <Fragment>
                <div className="duty-title-calendar">
                    <div style={{ paddingTop: '4px' }}>
                        <WindowSvg1 />
                    </div>

                    <div style={{ marginLeft: '4px', fontSize: '16px' }}>值班日历</div>
                </div>

                <div className="duty-calendar-container">
                    <Calendar
                        dateFullCellRender={this.dateCellRender}
                        headerRender={this.headerRender}
                        value={calendarValue}
                        validRange={validRange}
                    />
                </div>
            </Fragment>
        );
    }
}

export default withRouter(
    withModel(useLoginInfoModel, (login) => ({
        login,
    }))(DutyCalendar),
);
