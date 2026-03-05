/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Row, Col, Tabs, Button, Icon, Input, Select, message, Space, Popconfirm, Menu, Dropdown } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import getData from '../dataServiceUnicom';
import produce from 'immer';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import shareActions from '@Src/share/actions';
import ShiftingView from './shifting-view';
import './style.less';
import AlarmQuery from '@Src/pages/search/alarm-query';
import { groupApi } from '@Common/api/service/groupApi';
import { filterApi } from '@Common/api/service/filterApi';
import { failureSheetApi } from '@Common/api/service/failureSheetApi';
import { monitorApi } from '@Common/api/service/monitorApi';
import { unicomApi } from '@Common/api/service/unicomApi';
import { groupAlarmApi } from '@Common/api/service/groupAlarmApi';
import { getProvinceField } from './api';
import request from '@Common/api';

let count = 0;
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.actionRef = React.createRef();
        this.state = {
            firstLoad: true,
            provinceId: '',
            regionId: '',
            professionalType: '',
            sheetStatusId: '',
            // 数据库加载基础数据，数据库加载后，不再处理变更
            storeBySQL: {
                provinceList: [],
                regionList: [],
                sheetStatus: [],
                professional: [],
            },
            editFlag: {
                1: false,
                2: false,
                3: false,
            },
            addList: {
                1: [],
                2: [],
                3: [],
            },
            selectVaue: '1',
            announcement: {
                1: [],
                2: [],
                3: [],
            },
            tabValue: '1',
            loading: {
                1: false,
                2: false,
                3: false,
            },
            handOverList: [], // 交接班信息列表
            groupList: [],
            showGroup: null,
            dataSheetList: [],
            userIsNowDuty: false,
            tableFlag: false,
            dataFailSource: [],
            showAlarmQuery: true,
            condition: { sheet_no: { operator: 'eq', value: '' } },
            sheet_no: '', // 右键放置工单值
            provinceName: '',
            professionalTypeName: '',
            menu: (
                <Menu>
                    <Menu.Item
                        key="1"
                        onClick={() => {
                            this.clickSheetDetails();
                        }}
                    >
                        查看工单详情
                    </Menu.Item>
                </Menu>
            ),
        };
        this.updateList = {
            1: [],
            2: [],
            3: [],
        };
        this.zoneLevelEnums = {
            1: 'country',
            2: 'province',
            3: 'city',
            4: 'district',
            5: 'area',
        };
    }

    get columns() {
        return [
            {
                title: '工单编号',
                dataIndex: 'sheetNo',
                align: 'center',
                width: 200,
                ellipsis: true,
            },
            {
                title: '省份',
                dataIndex: 'provinceName',
                filters: true,
                onFilter: true,
                ellipsis: true,
                width: 80,
                align: 'center',
            },
            {
                title: '地市',
                dataIndex: 'regionName',
                filters: true,
                onFilter: true,
                ellipsis: true,
                align: 'center',
                width: 80,
            },
            {
                title: '工单标题',
                dataIndex: 'sheetTitle',
                align: 'center',
                width: 160,
                ellipsis: true,
            },
            {
                title: '派单类型',
                dataIndex: 'sendStatus',
                align: 'center',
                width: 100,
                ellipsis: true,
            },
            {
                title: '派单时间',
                dataIndex: 'forwardTime',
                align: 'center',
                width: 160,
                ellipsis: true,
            },
            {
                title: '工单状态',
                dataIndex: 'sheetStatus',
                filters: true,
                onFilter: true,
                ellipsis: true,
                align: 'center',
                width: 100,
            },
            {
                title: '专业',
                dataIndex: 'professionalType',
                filters: true,
                onFilter: true,
                ellipsis: true,
                width: 80,
                colSize: 1,
                align: 'center',
            },
            {
                title: '日期',
                dataIndex: 'dateTime',
                valueType: 'date',
                initialValue: moment(),
                ellipsis: true,
                width: 160,
            },
            {
                title: '当前处理人',
                dataIndex: 'person',
                align: 'center',
                width: 100,
                ellipsis: true,
            },
            {
                title: '告警数',
                dataIndex: 'alarmValue',
                align: 'center',
                width: 80,
                ellipsis: true,
            },
            {
                title: '未恢复告警数',
                dataIndex: 'unAlarmValue',
                align: 'center',
                width: 110,
                ellipsis: true,
            },
            {
                title: '主送人',
                dataIndex: 'masterMan',
                align: 'center',
                width: 90,
                ellipsis: true,
            },
            {
                title: '主送人电话',
                dataIndex: 'masterTel',
                align: 'center',
                width: 120,
                ellipsis: true,
            },
            // {
            //     title: '次送人',
            //     dataIndex: 'slaveMan',
            //     align: 'center',
            //     width: 90,
            //     ellipsis: true,
            // },
            // {
            //     title: '次送人电话',
            //     dataIndex: 'slaveTel',
            //     align: 'center',
            //     width: 120,
            //     ellipsis: true,
            // },
            {
                title: '抄送人',
                dataIndex: 'slaveMan',
                align: 'center',
                width: 90,
                ellipsis: true,
            },
            {
                title: '抄送人电话',
                dataIndex: 'slaveTel',
                align: 'center',
                width: 120,
                ellipsis: true,
            },
            {
                title: '短信通知人',
                dataIndex: 'smsMan',
                align: 'center',
                width: 100,
                ellipsis: true,
            },
        ];
    }

    save = async (data) => {
        let dataFlag = true;
        const param = data.map((item) => {
            return {
                executeParam: {
                    dataSourceName: 'nmosdb_mysql',
                    parameter: {
                        notice: item.value,
                        datetime: item.time,
                        proviceName: '1',
                        proviceId: '1',
                        regionCity: '1',
                        regionId: '1',
                        operator: '1',
                        type: this.state.tabValue,
                    },
                    sqlId: 'com.boco.gutil.database.mapper.custom.CustomSqlMapper.insertNoticeByType',
                    statementType: 'insert',
                },
                mapperFile: {
                    mapperId: 'alarmIndexFileGroup',
                    moduleId: 'alarmIndexFileModule',
                    systemId: 'alarmIndexFileSystem',
                },
            };
        });
        const res = await unicomApi.executeIdList(param);
        if (res.dealResult) {
            this.setState({
                addList: {
                    ...this.state.addList,
                    [this.state.tabValue]: [],
                },
            });
        } else {
            dataFlag = false;
        }
        return dataFlag;
    };
    getNotice = (type) => {
        const { announcement, loading } = this.state;
        this.setState({
            loading: {
                ...loading,
                [type]: true,
            },
        });
        getData('selectNoticeByType', { showSuccessMessage: false, showErrorMessage: false }, { type }).then((res) => {
            if (res.dealResult) {
                if (res.data && res.data.data) {
                    // let data = announcement[type];
                    this.setState({
                        announcement: {
                            ...announcement,
                            [type]: res.data.data,
                        },
                        loading: {
                            ...loading,
                            [type]: false,
                        },
                    });
                }
            } else {
                message.error('获取数据失败');
            }
        });
    };
    update = async (data) => {
        let dataFlag = false;
        const res = await unicomApi.executeIdList(
            data.map((item) => {
                return {
                    executeParam: {
                        dataSourceName: 'nmosdb_mysql',
                        parameter: item,
                        sqlId: 'com.boco.gutil.database.mapper.custom.CustomSqlMapper.updateNoticeByNoticeId',
                        statementType: 'insert',
                    },
                    mapperFile: {
                        mapperId: 'alarmIndexFileGroup',
                        moduleId: 'alarmIndexFileModule',
                        systemId: 'alarmIndexFileSystem',
                    },
                };
            }),
        );

        if (res.dealResult) {
            dataFlag = true;
        } else {
            dataFlag = false;
        }
        return dataFlag;
    };
    componentDidMount() {
        if (this.props.match && this.props.match.params.type) {
            this.setState({
                selectVaue: this.props.match.params.type,
            });
        }
        this.getNotice(this.state.tabValue);
        this.getLoginUserInfo();

        if (this.props.match.params.type === '2') {
            const data = [
                {
                    title: '无线网',
                    data: [
                        { name: '基站退服数', onDuty: 0, realTime: 0 },
                        { name: '待受理工单数', onDuty: 0, realTime: 0 },
                        { name: '待确认工单数', onDuty: 0, realTime: 0 },
                        { name: '超时工单数', onDuty: 0, realTime: 0 },
                    ],
                },
                {
                    title: '动环网',
                    data: [
                        { name: '动环机房断电', onDuty: 0, realTime: 0 },
                        { name: '待受理工单数', onDuty: 0, realTime: 0 },
                        { name: '待确认工单数', onDuty: 0, realTime: 0 },
                        { name: '超时工单数', onDuty: 0, realTime: 0 },
                    ],
                },
                {
                    title: '核心网',
                    data: [
                        { name: '核心网故障数', onDuty: 0, realTime: 0 },
                        { name: '待受理工单数', onDuty: 0, realTime: 0 },
                        { name: '待确认工单数', onDuty: 0, realTime: 0 },
                        { name: '超时工单数', onDuty: 0, realTime: 0 },
                    ],
                },
                {
                    title: '接入网',
                    data: [
                        { name: 'OLT设备中断个数', onDuty: 0, realTime: 0 },
                        { name: '待受理工单数', onDuty: 0, realTime: 0 },
                        { name: '待确认工单数', onDuty: 0, realTime: 0 },
                        { name: '超时工单数', onDuty: 0, realTime: 0 },
                    ],
                },
                {
                    title: '数据网',
                    data: [
                        { name: '数据网故障数', onDuty: 0, realTime: 0 },
                        { name: '待受理工单数', onDuty: 0, realTime: 0 },
                        { name: '待确认工单数', onDuty: 0, realTime: 0 },
                        { name: '超时工单数', onDuty: 0, realTime: 0 },
                    ],
                },
                {
                    title: '铁塔',
                    data: [
                        { name: '铁塔机房断电', onDuty: 0, realTime: 0 },
                        { name: '待受理工单数', onDuty: 0, realTime: 0 },
                        { name: '待确认工单数', onDuty: 0, realTime: 0 },
                        { name: '超时工单数', onDuty: 0, realTime: 0 },
                    ],
                },
            ];
            this.setState({ dataSheetList: data });
            this.interval = setInterval(() => this.initAlarmData(), 300000);
            this.initAlarmData();
        } else {
            this.intData();
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // 交接班相关

    /**
     * @description: 获取当前登陆用户角色问题
     * @param {*}
     * @return {*}
     */
    getLoginUserInfo = async () => {
        const { login } = this.props;
        const res = await monitorApi.getLoginUserInfo(login.userId);
        const level = this.zoneLevelEnums[res[0]?.zoneLevel];
        const zoneId = login.systemInfo?.currentZone?.zoneId;
        let para = {};
        if (zoneId) {
            para = {
                provinceId: zoneId,
                regionId: -1,
            };
        } else if (level === 'province') {
            para = {
                provinceId: res[0]?.zoneId,
                regionId: -1,
            };
        } else if (level === 'city') {
            para = {
                provinceId: res[0]?.parentZoneId,
                regionId: res[0]?.zoneId,
            };
        } else if (level === 'country') {
            para = {
                // provinceId: '1150126687', //默认山东
                // regionId: -1,
            };
        }
        this.getShiftingIfDutyUser(para);
    };

    /**
     * @description: 获取相关交接班信息
     * @param {*}
     * @return {*}
     */
    getShiftingIfDutyUser = async (para) => {
        const data = {
            operateUser: this.props.login.userId,
        };
        if (Object.keys(para).length > 0) {
            data.provinceId = para.provinceId;
        }

        const res = await groupApi.getShiftingIfDutyUser(data);
        this.setState(
            {
                groupList: res,
                showGroup: res[0] || {},
                userIsNowDuty: res[0]?.dutyPersonDto?.loginPerson,
            },
            () => {
                if (res.length) {
                    this.getHandoverGroupInfoList();
                }
            },
        );
    };

    /**
     * @description: 获取当前组下交接班信息
     * @param {*}
     * @return {*}
     */
    getHandoverGroupInfoList = async () => {
        const { showGroup } = this.state;
        if (!(showGroup && showGroup.groupId)) {
            return;
        }
        const res = await groupApi.getHandoverGroupInfoList(1, showGroup.groupId);
        const handleList =
            res &&
            Array(res.rows) &&
            res.rows.map((item) => {
                return {
                    ...item,
                    editMode: false,
                };
            });
        this.setState({
            handOverList: handleList || [],
        });
    };

    /**
     * @description: 监听选择组变化
     * @param {*}
     * @return {*}
     */
    onGroupChange = (value) => {
        const { groupList } = this.state;
        this.setState(
            {
                showGroup: _.find(groupList, { groupId: value }),
                userIsNowDuty: _.find(groupList, { groupId: value })?.dutyPersonDto?.loginPerson,
                // userIsNowDuty: true
            },
            () => {
                this.getHandoverGroupInfoList();
            },
        );
    };

    /**
     * @description: 新增交接班信息
     * @param {*}
     * @return {*}
     */
    onAddNewHandoverList = () => {
        const { handOverList } = this.state;
        const handleList = _.cloneDeep(handOverList);
        handleList.unshift({
            content: '',
            editMode: true,
        });
        this.setState({
            handOverList: handleList,
        });
    };

    /**
     * @description: 编辑交班信息
     * @param {*}
     * @return {*}
     */
    editHandOverItem = (item) => {
        const { handOverList } = this.state;
        const handleArr = produce(handOverList, (draft) => {
            const tempObj = _.find(draft, { contentId: item.contentId });
            tempObj.editMode = true;
        });
        this.setState({
            handOverList: handleArr,
        });
    };

    /**
     * @description: 输入框变化
     * @param {*}
     * @return {*}
     */
    onInputInfoChange = (item, index, e) => {
        const { handOverList } = this.state;
        const handleArr = produce(handOverList, (draft) => {
            // eslint-disable-next-line no-param-reassign
            draft[index].content = e.target.value;
        });
        this.setState({
            handOverList: handleArr,
        });
    };

    /**
     * @description: 更改信息
     * @param {*}
     * @return {*}
     */
    updateHandoverInfo = async (item) => {
        const { showGroup } = this.state;
        const { login } = this.props;
        const data = {
            content: item.content,
            regionId: showGroup.regionId || -1,
            regionName: showGroup.regionName || '',
            provinceId: showGroup.provinceId,
            provinceName: showGroup.provinceName,
            operateUser: login.userId,
            groupId: showGroup.groupId,
            groupName: showGroup.groupName,
        };
        if (item.contentId) {
            data.contentId = item.contentId;
        }
        await groupApi.updateOrInsertOne(data);
        this.getHandoverGroupInfoList();
    };
    /**
     * @description: 删除交班信息
     * @param {*}
     * @return {*}
     */
    deleteHandoverInfo = async (item, index) => {
        const { showGroup, handOverList } = this.state;
        if (!item.contentId) {
            const handleList = _.cloneDeep(handOverList);
            handleList.splice(index, 1);
            this.setState({
                handOverList: handleList,
            });
            return;
        }
        await groupApi.deleteOne(item.contentId, showGroup.groupId);
        this.getHandoverGroupInfoList();
    };

    /**
     * @description: 根据日期字符串
     * @param {*}
     * @return {*}
     */
    getTimeByStr = (str) => {
        return new Date(str).getTime();
    };

    /**
     * @description: 校验接班人是否有权限
     * @param {*}
     * @return {*}
     */
    handoverCheck = async () => {
        const { showGroup } = this.state;
        let data = false;
        const res = await monitorApi.handoverCheck(showGroup?.dutyPersonDto?.nextDutierCode);
        const permissionsList = res._embedded.operationIdsResourceList[0].operIds;
        if (this.state.selectVaue === '1') {
            permissionsList.forEach((item) => {
                if (item === 1100024000) {
                    data = true;
                }
            });
        }
        if (this.state.selectVaue === '2') {
            permissionsList.forEach((item) => {
                if (item === 1100026000) {
                    data = true;
                }
            });
        }
        return data;
    };

    /**
     * @description: 交班操作
     * @param {*}
     * @return {*}
     */
    handoverHandler = async () => {
        const { handOverList, showGroup, groupList } = this.state;
        const { provinceId, regionId, operateUser, groupId } = showGroup;
        let flag = true;
        handOverList.forEach((item) => {
            if (item.editMode) {
                flag = false;
            }
        });
        if (!flag) {
            message.error('有未保存的交班信息，请保存');
            return;
        }
        if (!showGroup?.dutyPersonDto?.nextDutierCode) {
            message.error('没有设置接班人员');
            return;
        }
        const dataFlag = await this.handoverCheck();
        if (!dataFlag) {
            message.error('交接失败，接班人无权限');
            return;
        }
        const data = await getProvinceField(provinceId, regionId, operateUser, groupId);
        if (data) {
            const list = groupList.map((item) => {
                if (item.groupId === groupId) {
                    return {
                        ...item,
                        dutyPersonDto: data,
                    };
                }
                return item;
            });
            this.setState({
                showGroup: {
                    ...showGroup,
                    dutyPersonDto: data,
                },
                groupList: list,
            });
        }
        const { actions } = shareActions;
        if (actions && actions.postMessage) {
            actions.postMessage('switchUser', {
                successorId: showGroup?.dutyPersonDto?.nextDutierCode,
            });
        }
        // 演示临时屏蔽掉
        // const newDateTime = new Date().getTime();
        // if (
        //     (newDateTime >= this.getTimeByStr(dateList[0]) && newDateTime <= this.getTimeByStr(dateList[1])) ||
        //     (newDateTime >= this.getTimeByStr(dateList[2]) && newDateTime <= this.getTimeByStr(dateList[3]))
        // ) {
        //     const { actions } = shareActions;
        //     actions &&
        //         actions.postMessage('switchUser', {
        //             successorId: showGroup?.dutyPersonDto?.nextDutierCode
        //         });
        // } else {
        //     message.error('当前时间不能交接班');
        // }
    };
    async intData() {
        const { storeBySQL } = this.state;
        const {
            login: { userId, systemInfo },
        } = this.props;
        const zoneId = systemInfo?.currentZone?.zoneId;
        const promises = [groupApi.getProvinces(userId, zoneId), filterApi.getProfessionList(userId), filterApi.getSheetStatus(userId)];
        let provinceId = '';
        let regionId = '';
        let professionalType = '';
        let sheetStatusId = '';
        const index = 0;
        const [provinceList = [], professional = [], sheetStatus = []] = await Promise.all(promises);
        storeBySQL.provinceList = provinceList;
        const professionalFilterKye = ['8', '3', '1', '14', '4', '12', '7', '26'];
        storeBySQL.professional = professional.filter((item) => professionalFilterKye.includes(item.key));
        if (professional.length > 0) {
            professionalType = professional[0].key;
        }

        const sheetFilterKey = ['2', '9', '8'];
        storeBySQL.sheetStatus = sheetStatus.filter((item) => sheetFilterKey.includes(item.key));
        // 取消"全部"选项，默认选中下拉框第一个选项
        if (storeBySQL.sheetStatus.length > 0) {
            sheetStatusId = storeBySQL.sheetStatus[0].key;
        }

        if (provinceList.length === 1) {
            provinceId = provinceList[index].regionId;
            storeBySQL.regionList = await groupApi.getRegions(provinceId, userId);
            if (storeBySQL.regionList.length === 1) {
                regionId = storeBySQL.regionList[index];
            }
        }
        if (systemInfo?.currentZone?.zoneId) {
            provinceId = systemInfo.currentZone.zoneId;
        }
        this.setState({ storeBySQL, provinceId, regionId, professionalType, sheetStatusId }, () => {
            this.actionRef.current.reload();
        });
    }

    loadData = async (params) => {
        const { provinceId, sheetStatusId, professionalType, firstLoad } = this.state;
        if (firstLoad) {
            this.setState({ firstLoad: false });
            return {
                success: true,
                data: [],
                total: 0,
            };
        }
        const { current, pageSize } = params;
        const { userId } = this.props.login;
        const parms = {
            province_id: provinceId,
            region_id: '',
            sheet_status: sheetStatusId,
            professional_type: professionalType,
            key_word: '',
            forward_start_time: '',
            forward_end_time: '',
            pageIndex: String(current),
            pageSize: String(pageSize),
            user_id: userId,
            sheet_time_out: '',
        };
        const args = {
            viewPageArgs: parms,
            viewItemId: 'orderStatisticsList',
            viewPageId: 'fault-order',
        };

        const result = await failureSheetApi.getFailureSheetList(args);
        const { rows, page } = result.viewItemData;
        return {
            success: true,
            data: rows,
            total: page.total,
        };
    };
    initAlarmData = async () => {
        const { userId, systemInfo } = this.props.login;
        const zoneId = systemInfo.currentZone?.zoneId;
        const dataSheetList = await groupAlarmApi.queryAlarmstat(userId, zoneId);
        this.setState({ dataSheetList });
    };
    onTabClick = (professionalType) => {
        this.setState({ professionalType }, () => {
            this.actionRef.current.reload();
        });
    };
    onSelectChange = (sheetStatusId) => {
        this.setState({ sheetStatusId }, () => {
            this.actionRef.current.reload();
        });
    };
    onClickRow = (sheetNo, forwardTime, provinceName, professionalType) => {
        const {
            login: { userInfo },
        } = this.props;
        const { storeBySQL } = this.state;
        count += 1;
        setTimeout(() => {
            if (count === 1) {
                const startTime = moment(forwardTime).add(-24, 'hour');
                const endTime = moment(forwardTime).add(24, 'hour');
                this.setState({
                    tableFlag: true,
                    // showAlarmQuery: false,
                    condition: {
                        sheet_no: { operator: 'eq', value: sheetNo },
                        event_time: {
                            operator: 'between',
                            value: [startTime, endTime],
                        },
                    },
                });
            } else if (count === 2) {
                const sheetDetailObj = {
                    sheetNo,
                    logInId: JSON.parse(userInfo).loginId,
                    provinceId: _.find(storeBySQL.provinceList, (item) => item.regionName === provinceName)?.regionId,
                    professionalType: _.find(storeBySQL.professional, (item) => item.value === professionalType)?.key,
                    forwardTime,
                };
                this.getSheetDetailsUrl(sheetDetailObj);
            }
            count = 0;
        }, 300);
    };
    getSheetDetailsUrl = (data) => {
        request('work/sheet/v1/getEmosUrl', {
            data,
            type: 'post',
            showSuccessMessage: false,
            baseUrlType: 'failureSheetExportUrl',
        })
            .then((res) => {
                if (res) {
                    if (res.code === 200) {
                        window.open(res.data);
                    } else {
                        message.warn(res.message);
                    }
                }
            })
            .catch(() => {});
    };
    onContextMenuRow = (sheetNo, provinceName, professionalType) => {
        this.setState({
            sheet_no: sheetNo,
            provinceName,
            professionalTypeName: professionalType,
        });
    };
    clickSheetDetails = () => {
        const {
            login: { userInfo },
        } = this.props;
        const { sheet_no, provinceName, professionalTypeName, storeBySQL } = this.state;
        if (sheet_no) {
            const sheetDetailObj = {
                sheetNo: sheet_no,
                logInId: JSON.parse(userInfo).loginId,
                provinceId: _.find(storeBySQL.provinceList, (item) => item.regionName === provinceName)?.regionId,
                professionalType: _.find(storeBySQL.professional, (item) => item.value === professionalTypeName)?.key,
            };
            this.getSheetDetailsUrl(sheetDetailObj);
        }
    };
    render() {
        const { TabPane } = Tabs;
        const {
            selectVaue,
            handOverList,
            groupList,
            showGroup,
            userIsNowDuty,
            tableFlag,
            showAlarmQuery,
            condition,
            dataSheetList,
            storeBySQL,
            sheetStatusId,
            menu,
        } = this.state;
        return (
            <div className="monitor-manage">
                <Row gutter={10} style={{ width: '100%', height: '100%' }}>
                    {selectVaue === '1' && (
                        <Col sm={16} xxl={18} style={{ height: '100%' }}>
                            <div className="monitor-manage-table">
                                <div className="monitor-manage-table-field-left oss-imp-alart-common-bg">
                                    <div className="monitor-manage-table-field-tabs">
                                        <Tabs
                                            defaultActiveKey="1"
                                            size="small"
                                            onTabClick={this.onTabClick}
                                            tabBarExtraContent={
                                                <Select value={sheetStatusId} style={{ width: '70px' }} onChange={this.onSelectChange.bind(this)}>
                                                    {/* <Select.Option value="all">全部</Select.Option>; */}
                                                    {storeBySQL.sheetStatus.map((sheetStatus) => {
                                                        return <Select.Option value={sheetStatus.key}>{sheetStatus.value}</Select.Option>;
                                                    })}
                                                </Select>
                                            }
                                        >
                                            {storeBySQL.professional.slice(0, 12).map((professional) => {
                                                return (
                                                    <TabPane
                                                        tab={
                                                            <span>
                                                                <span style={{ marginRight: 5 }}>{professional.value}</span>
                                                                {/* <Tag color="#f50">{professional.key}</Tag> */}
                                                            </span>
                                                        }
                                                        key={professional.key}
                                                    />
                                                );
                                            })}
                                        </Tabs>
                                    </div>
                                </div>
                                <Dropdown overlay={menu} trigger={['contextMenu']}>
                                    <div className="oss-imp-alarm-protable-search maintain-failure-sheet-top-wrapper failure-sheet-top-container">
                                        <VirtualTable
                                            rowKey="rosterIntId"
                                            global={window}
                                            columns={this.columns}
                                            actionRef={this.actionRef}
                                            onReset={false}
                                            request={this.loadData}
                                            onSizeChange="small"
                                            bordered
                                            dateFormatter="string"
                                            options={false}
                                            rowClassName={(record, index) =>
                                                index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double'
                                            }
                                            search={false}
                                            onRow={(record) => {
                                                return {
                                                    onClick: () => {
                                                        this.onClickRow(
                                                            record.sheetNo,
                                                            record.forwardTime,
                                                            record.provinceName,
                                                            record.professionalType,
                                                        );
                                                    },
                                                    onContextMenu: () => {
                                                        this.onContextMenuRow(record.sheetNo, record.provinceName, record.professionalType);
                                                    },
                                                };
                                            }}
                                        />
                                    </div>
                                </Dropdown>
                                <div className="failure-sheet-bottom-container" style={{ display: tableFlag ? 'block' : 'none' }}>
                                    <div className="failure-sheet-bottom-container-close" onClick={() => this.setState({ tableFlag: false })}>
                                        关闭
                                    </div>
                                    {showAlarmQuery && <AlarmQuery mode="alarm-window" condition={condition} />}
                                </div>
                            </div>
                        </Col>
                    )}
                    {selectVaue === '2' && (
                        <Col sm={16} xxl={18} style={{ height: '100%' }}>
                            <div className="monitor-manage-page oss-imp-alart-common-bg">
                                <ShiftingView dataSheetList={dataSheetList} />
                            </div>
                        </Col>
                    )}
                    <Col sm={8} xxl={6} style={{ height: '100%' }}>
                        <div className="monitor-manage-table">
                            <div className="monitor-manage-table-field-right oss-imp-alart-common-bg">
                                <div className="monitor-manage-table-right-tabs" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div
                                        style={{
                                            width: '100%',
                                            fontSize: '2vh',
                                            marginBottom: '15px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        交接班
                                    </div>
                                    <div style={{ height: 'calc(100% - 36px)' }}>
                                        <div className="handover-container">
                                            <section className="group-name">
                                                <span>班组名称</span>
                                                <Select
                                                    style={{ width: '75%', height: '30px', textAlign: 'center' }}
                                                    value={showGroup?.groupId}
                                                    onChange={this.onGroupChange}
                                                >
                                                    {Array.isArray(groupList) &&
                                                        groupList.map((item) => (
                                                            <Select.Option key={item.groupId} value={item.groupId}>
                                                                {item.groupName}
                                                            </Select.Option>
                                                        ))}
                                                </Select>
                                            </section>
                                            <section className="user-list">
                                                <section>当班人：{showGroup?.dutyPersonDto?.nowDutierName || '暂无'}</section>
                                                <section>接班人：{showGroup?.dutyPersonDto?.nextDutierName || '暂无'}</section>
                                            </section>
                                            <section className="info-list">
                                                <section className="info-list-button">
                                                    {userIsNowDuty && (
                                                        <Button type="primary" onClick={this.onAddNewHandoverList}>
                                                            新增
                                                        </Button>
                                                    )}
                                                </section>
                                                <section className="info-list-info">
                                                    {Array.isArray(handOverList) &&
                                                        handOverList.map((item, index) => {
                                                            return item.editMode ? (
                                                                <section className="info-list-info-item" key={item.contentId || index}>
                                                                    <section>
                                                                        <Input.TextArea
                                                                            value={item.content}
                                                                            style={{
                                                                                width: '80%',
                                                                            }}
                                                                            maxLength={240}
                                                                            autoSize
                                                                            onChange={this.onInputInfoChange.bind(this, item, index)}
                                                                        />
                                                                    </section>
                                                                    <section>
                                                                        {userIsNowDuty && (
                                                                            <Space>
                                                                                <section>
                                                                                    <Icon
                                                                                        type="SaveOutlined"
                                                                                        antdIcon
                                                                                        onClick={this.updateHandoverInfo.bind(this, item)}
                                                                                    />
                                                                                </section>
                                                                                <section>
                                                                                    <Popconfirm
                                                                                        placement="topLeft"
                                                                                        title="确认删除吗？"
                                                                                        onConfirm={this.deleteHandoverInfo.bind(this, item, index)}
                                                                                        okText="确定"
                                                                                        cancelText="取消"
                                                                                    >
                                                                                        <Icon type="CloseCircleOutlined" antdIcon />
                                                                                    </Popconfirm>
                                                                                </section>
                                                                            </Space>
                                                                        )}
                                                                    </section>
                                                                </section>
                                                            ) : (
                                                                <section className="info-list-info-item" key={item.contentID}>
                                                                    <section>
                                                                        {index + 1}.{item.content}
                                                                    </section>
                                                                    <section>
                                                                        {userIsNowDuty && (
                                                                            <Space>
                                                                                <section>
                                                                                    <Icon
                                                                                        type="EditOutlined"
                                                                                        antdIcon
                                                                                        onClick={this.editHandOverItem.bind(this, item)}
                                                                                    />
                                                                                </section>
                                                                                <section>
                                                                                    <Popconfirm
                                                                                        placement="topLeft"
                                                                                        title="确认删除吗？"
                                                                                        onConfirm={this.deleteHandoverInfo.bind(this, item, index)}
                                                                                        okText="确定"
                                                                                        cancelText="取消"
                                                                                    >
                                                                                        <Icon type="CloseCircleOutlined" antdIcon />
                                                                                    </Popconfirm>
                                                                                </section>
                                                                            </Space>
                                                                        )}
                                                                    </section>
                                                                </section>
                                                            );
                                                        })}
                                                </section>
                                            </section>
                                            <section className="handover-btn">
                                                {userIsNowDuty && (
                                                    <Button type="primary" onClick={this.handoverHandler}>
                                                        交班
                                                    </Button>
                                                )}
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
