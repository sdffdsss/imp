import React, { useState, useEffect, useRef, Fragment } from 'react';
import './style.less';
import {
    getShiftingOfDutyStatus,
    queryShiftingOfDutyNow,
    checkHandSubmit,
    shiftingOfDutyHandOver,
    checkTakeSubmit,
    shiftingOfDutyTakeOver,
    saveDutyMessage,
    deleteDutyMessage,
    getScheduleUserInfoStatic,
    getDutyContentStatic,
} from './api';
import useLoginInfoModel from '@Src/hox';
import { Timeline, List, Modal, Icon, message, Divider, Button, Input } from 'oss-ui';
import CuoWu from '@Src/pages/change-shifts-page/change-shifts/img/cuowu.png';
import Zwsj from '@Src/pages/change-shifts-page/change-shifts/img/zwsj.png';
import { ReactComponent as WindowSvg1 } from '../img/u62.svg';
import { ReactComponent as WindowSvg2 } from '../img/u95.svg';
import { customAlphabet } from 'nanoid';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import { ReactComponent as WindowSvg3 } from '../img/1.svg';
import { ReactComponent as WindowSvg4 } from '../img/2.svg';
import { logNew } from '@Common/api/service/log';
import urlSearch from '@Common/utils/urlSearch';
// import shareActions from '@Src/share/actions';
//import dayjs from 'dayjs';

interface RecordJson {
    content: string;
    userName: string;
    operationTime: string;
    key: string;
}
const { TextArea } = Input;
const urlData = urlSearch(window.location.href);
const ChangeShifts = (props) => {
    const [personnelState, setPersonnelState] = useState('1'); //0：班组人员无交接班,1：当班待交班人员,2：待接班人员,9：非班组成员
    const [timing, setTiming] = useState(5);
    const [editingKey, setEditingKey] = useState('');
    const [contentVal, setContentVal] = useState('');

    const [baseInfo, setBaseInfo] = useState({
        provinceName: '',
        groupName: '',
        workShiftName: '',
        workShiftUsersName: [],
        lastImportanceInform: '',
        dateTime: '',
        groupId: '',
        workShiftId: '',
        nextWorkShiftId: '',
        lastDateTime: '',
        lastWorkShiftId: '',
        importanceInform: '',
        centerName: '',
        mainName: '',
    });
    const [recordList, setRecordList] = useState<RecordJson[]>([]);
    const frameInfo = useLoginInfoModel();
    const { userInfo, systemInfo } = frameInfo;
    const timer: any = useRef();

    const [countdown, setCountdown] = useState<any>('00:00:00');

    let secondNum = 0;

    const userInfos = (userInfo && JSON.parse(userInfo)) || {};

    const formatSeconds = (value) => {
        const hh = parseInt(String(value / 3600)); //小时

        const shh = value - hh * 3600;

        const mm = parseInt(String(shh / 60));

        const ss = shh - mm * 60;

        setCountdown((hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss));
    };

    const startCountdown = () => {
        clearInterval(timer.current);
        timer.current = setInterval(() => {
            if (secondNum > 0) {
                formatSeconds(secondNum);
                secondNum--;
            }
            // setCountdown(dayjs(countdown, 'HH:mm:ss').subtract(1, 'second').format('HH:mm:ss'));
            // setCountdown(dayjs(dayjs(countdown, 'HH:mm:ss').subtract(1, 'second')).format('HH:mm:ss'));
        }, 1000);
    };

    const getShiftingOfDutyStatusData = async () => {
        if (urlData.provinceId) {
            const data = {
                operatorId: 867408,
                operatorName: '张笑',
            };
            const nanoid = customAlphabet('1234567890', 10);
            const resultLeft = await getScheduleUserInfoStatic(data);
            const resultRight = await getDutyContentStatic(data);
            setBaseInfo(Object.assign(resultLeft.data));
            setRecordList(
                resultRight?.rows?.map((item) => {
                    return {
                        ...item,
                        key: nanoid(),
                    };
                }),
            );
            setPersonnelState('1');
        } else {
            const data = {
                userId: userInfos.userId,
                regionId: systemInfo.currentZone?.zoneId,
            };
            // eslint-disable-next-line no-useless-concat
            // const date1 = dayjs(dayjs().format('YYYY-MM-DD').toString() + '' + '18:00:00');
            // formatSeconds(date1.diff(dayjs().format('YYYY-MM-DD HH:mm:ss'), 's'));

            const result = await getShiftingOfDutyStatus(data);

            if (result && result.resultCode) {
                setPersonnelState(result.resultCode);
                setBaseInfo(result.resultObj);
                setEditingKey('');
                if (result.resultCode === '1' || result.resultCode === '2') {
                    secondNum = result.resultObj?.timeCountDown?.split('|')[0];
                    if (secondNum > 0) {
                        startCountdown();
                    } else {
                        clearInterval(timer.current);
                        setCountdown('00:00:00');
                    }
                    const param = {
                        userId: userInfos.userId,
                        type: result.resultCode === '500' ? '0' : result.resultCode,
                        operationStatus: result.resultCode === '500' ? '0' : result.resultCode,
                        dutyStatus: result.resultCode === '500' ? '0' : result.resultCode,
                        ...result.resultObj,
                    };
                    const resultInfo = await queryShiftingOfDutyNow(param);
                    const nanoid = customAlphabet('1234567890', 10);

                    if (resultInfo && resultInfo.resultCode) {
                        setBaseInfo(Object.assign(resultInfo.resultObj, result.resultObj));
                        setRecordList(
                            resultInfo?.resultObj?.dutyRecords.map((item) => {
                                return {
                                    ...item,
                                    key: nanoid(),
                                };
                            }),
                        );
                        // if (result.resultCode === '1') {
                        //     if (resultInfo.resultObj.workEndTime > resultInfo.resultObj.workBeginTime) {
                        //         const date1 = dayjs().format('YYYY-MM-DD') + ' ' + resultInfo.resultObj.workEndTime;
                        //         secondNum = dayjs(date1).diff(dayjs(), 's');
                        //     } else {
                        //         const date1 = dayjs().add(1, 'day').format('YYYY-MM-DD') + ' ' + resultInfo.resultObj.workEndTime;
                        //         secondNum = dayjs(date1).diff(dayjs(), 's');
                        //     }
                        // }
                    } else {
                        setBaseInfo(resultInfo.resultObj);
                    }
                    setTimeout(() => {
                        const scrollDiv = document.querySelector('.demo-right');
                        if (scrollDiv?.scrollTop === 0 || scrollDiv?.scrollTop) {
                            scrollDiv.scrollTop = scrollDiv?.scrollHeight;
                        }
                    }, 100);
                }
            }
        }
    };

    useEffect(() => {
        clearInterval(timer.current);
        getShiftingOfDutyStatusData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
            } else {
                clearInterval(timer.current);
                getShiftingOfDutyStatusData();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startTiming = () => {
        let num = 5;
        const timers = setInterval(() => {
            num--;
            setTiming(num);

            if (num === 0) {
                clearInterval(timers);
                getShiftingOfDutyStatusData();
            }
        }, 1000);
    };

    //交班信息提交
    const saveHand = async () => {
        const data = {
            userId: userInfos.userId,
            dateTime: baseInfo?.dateTime, //本班次对应的开始时间
            groupId: baseInfo?.groupId, // 组ID
            workShiftId: baseInfo?.workShiftId,
            nextWorkShiftId: baseInfo?.nextWorkShiftId,
            lastDateTime: baseInfo?.lastDateTime,
            lastWorkShiftId: baseInfo?.lastWorkShiftId,
        };
        const result = await shiftingOfDutyHandOver(data);
        if (result && result.resultCode === '200') {
            //   props.history.push({ pathname: '/change-shifts-page/abnormal-page', state: { type: 6 } });
            setPersonnelState('6');
            startTiming();
        } else {
            message.warning(result.resultMsg);
        }
    };

    const handPrompt = async (code, messgae) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: messgae,
            okText: '确认',
            okButtonProps: code === '201' ? { prefixCls: 'oss-ui-btn' } : { prefixCls: 'oss-ui-btn', style: { display: 'none' } },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            className: props.theme === 'light' ? '' : 'work-bench-modal-confirm',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                if (code === '201') {
                    saveHand();
                }
            },
            onCancel: () => {
                if (code === '401') {
                    // props.history.push({ pathname: '/change-shifts-page' });
                    clearInterval(timer.current);
                    getShiftingOfDutyStatusData();
                }
            },
        });
    };

    //点击交班
    const handover = async () => {
        if (editingKey) {
            message.warning('当班记录未填写完整，请补充!');
        } else {
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                content: '是否确认交班？',
                okText: '确认',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                okType: 'danger',
                cancelText: '取消',
                className: props.theme === 'light' ? '' : 'work-bench-modal-confirm',
                prefixCls: 'oss-ui-modal',
                onOk: async () => {
                    const data = {
                        userId: userInfos.userId,
                        dateTime: baseInfo?.dateTime, //本班次对应的开始时间
                        groupId: baseInfo?.groupId, // 组ID
                        workShiftId: baseInfo?.workShiftId, //班次ID
                        nextWorkShiftId: baseInfo?.nextWorkShiftId,
                        lastDateTime: baseInfo?.lastDateTime,
                        lastWorkShiftId: baseInfo?.lastWorkShiftId,
                    };
                    logNew('监控工作台交接班待办组件', '300016');
                    const result = await checkHandSubmit(data);
                    if (result && result.resultCode === '200') {
                        //交班成功
                        saveHand();
                    } else if (result && result.resultCode === '400') {
                        handPrompt(result.resultCode, result.resultMsg);
                    } else if (result && result.resultCode === '401') {
                        handPrompt(result.resultCode, result.resultMsg);
                    } else if (result && result.resultCode === '201') {
                        handPrompt(result.resultCode, result.resultMsg);
                    } else {
                        message.warning(result.resultMsg);
                    }
                },
                onCancel() {},
            });
        }
    };

    //接班信息提交
    const saveTake = async () => {
        const data = {
            userId: userInfos.userId,
            dateTime: baseInfo?.dateTime, //本班次对应的开始时间
            groupId: baseInfo?.groupId, // 组ID
            workShiftId: baseInfo?.workShiftId, //班次ID
            nextWorkShiftId: baseInfo?.nextWorkShiftId,
            lastDateTime: baseInfo?.lastDateTime,
            lastWorkShiftId: baseInfo?.lastWorkShiftId,
        };
        const result = await shiftingOfDutyTakeOver(data);
        if (result && result.resultCode === '200') {
            //   props.history.push({ pathname: '/change-shifts-page/abnormal-page', state: { type: 7 } });
            setPersonnelState('7');
            startTiming();
        } else {
            message.warning(result.resultMsg);
        }
    };

    const takePrompt = async (code, messgae) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: messgae,
            okText: '确认',
            okButtonProps: code === '201' ? { prefixCls: 'oss-ui-btn' } : { prefixCls: 'oss-ui-btn', style: { display: 'none' } },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            className: props.theme === 'light' ? '' : 'work-bench-modal-confirm',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                if (code === '201') {
                    saveTake();
                }
            },
            onCancel: () => {
                if (code === '401') {
                    // props.history.push({ pathname: '/change-shifts-page' });
                    clearInterval(timer.current);
                    getShiftingOfDutyStatusData();
                }
            },
        });
    };

    //点击接班
    const accept = async () => {
        if (editingKey) {
            message.warning('当班记录未填写完整，请补充!');
        } else {
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                content: '是否确认接班？',
                okText: '确认',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                okType: 'danger',
                cancelText: '取消',
                prefixCls: 'oss-ui-modal',
                className: props.theme === 'light' ? '' : 'work-bench-modal-confirm',
                onOk: async () => {
                    const data = {
                        userId: userInfos.userId,
                        dateTime: baseInfo?.dateTime, //本班次对应的开始时间
                        groupId: baseInfo?.groupId, // 组ID
                        workShiftId: baseInfo?.workShiftId, //班次ID
                        nextWorkShiftId: baseInfo?.nextWorkShiftId,
                        lastDateTime: baseInfo?.lastDateTime,
                        lastWorkShiftId: baseInfo?.lastWorkShiftId,
                    };
                    logNew('监控工作台交接班待办组件', '300016');
                    const result = await checkTakeSubmit(data);
                    if (result && result.resultCode === '200') {
                        //接班成功
                        saveTake();
                    } else if (result && result.resultCode === '400') {
                        takePrompt(result.resultCode, result.resultMsg);
                    } else if (result && result.resultCode === '401') {
                        takePrompt(result.resultCode, result.resultMsg);
                    } else if (result && result.resultCode === '201') {
                        takePrompt(result.resultCode, result.resultMsg);
                    } else {
                        message.warning(result.resultMsg);
                    }
                },
                onCancel() {},
            });
        }
    };

    //保存当班记录信息
    const saveChangeShifts = async (dutyRecords) => {
        const data = {
            userId: userInfos.userId,
            dutyRecords,
            dateTime: baseInfo?.dateTime,
            shiftDutyId: baseInfo?.workShiftId,
            groupId: baseInfo?.groupId,
            modifyScope: 'record',
        };
        const result = await saveDutyMessage(data);
        if (result && result.resultCode === '200') {
            message.success('修改成功!');
        } else {
            message.error('修改失败!');
        }
    };
    // const jumpPage = () => {
    //     const { actions, messageTypes } = shareActions;
    //     if (actions?.postMessage) {
    //         actions.postMessage(messageTypes.openRoute, {
    //             entry: '/unicom/management-home-page/change-shifts-page',
    //         });
    //     }
    // };

    var search = document.querySelector('.record-text');
    (search as any)?.focus();

    const addData = () => {
        if (editingKey) {
            message.warning('请先保存工作记录再新增!');
        } else {
            const nanoid = customAlphabet('1234567890', 10);
            const key = nanoid();
            const editingObj = {
                key: key,
                operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                userName: userInfos.userName,
                userId: userInfos.userId,
                content: '',
                recordId: '',
            };
            const newOriginData = recordList ? [editingObj].concat(recordList as any) : [editingObj];
            setRecordList(newOriginData);
            setEditingKey(key);
            setContentVal('');

            setTimeout(() => {
                const scrollDiv = document.querySelector('.demo-right');
                if (scrollDiv?.scrollTop) {
                    scrollDiv.scrollTop = scrollDiv?.scrollHeight;
                }
            }, 0);
        }

        // this.props.changeOriginData(newOriginData);
        // this.setState({
        //     originData: newOriginData,
        //     editingKey: key,
        //     editingObj: editingObj,
        //     contentVal: '',
        // });
    };

    const onChangeText = (e) => {
        setContentVal(e.target.value);
    };

    const save = (record) => {
        const valueLength = contentVal ? contentVal.replace(/[^\x00-\xff]/g, 'aa').length : 0;
        if (valueLength > 0) {
            const index = recordList.findIndex((item) => record.key === item.key);
            if (index > -1) {
                logNew('监控工作台交接班待办组件', '300016');
                const item = recordList[index];
                recordList.splice(index, 1, {
                    ...item,
                    content: contentVal,
                });
                setEditingKey('');
                // saveChangeShifts(recordList);
                saveChangeShifts([{ ...item, content: contentVal }]);
            } else {
                setRecordList(recordList);
            }
        } else {
            message.warning('工作记录不能为空!');
        }
    };

    //删除值班记录
    const deleteDutyMessages = async (contentId) => {
        const data = {
            userId: userInfos.userId,
            shiftDutyId: baseInfo?.workShiftId,
            dateTime: baseInfo?.dateTime,
            contentId,
        };
        const result = await deleteDutyMessage(data);
        if (result && result.resultCode === '200') {
            message.success('删除成功!');
            getShiftingOfDutyStatusData();
        }
    };

    const delData = (record) => {
        if (editingKey) {
            message.warning('请先保存工作记录再删除!');
        } else {
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                content: '是否删除当条记录？',
                okText: '确认',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                okType: 'danger',
                cancelText: '取消',
                prefixCls: 'oss-ui-modal',
                className: props.theme === 'light' ? '' : 'work-bench-modal-confirm',
                onOk: async () => {
                    logNew('监控工作台交接班待办组件', '300016');
                    // const newData = _.remove(recordList, (o) => {
                    //     return o.key !== record.key;
                    // });
                    // setRecordList(newData);
                    // setEditingKey('');
                    // saveChangeShifts(newData);
                    deleteDutyMessages(record.recordId);
                },
                onCancel() {},
            });
        }
    };
    return (
        <div className="change-shifts-continer">
            {/* <div className="title">
                交接班待办
                <div
                    className="title-jump"
                    onClick={() => {
                        jumpPage();
                    }}
                >
                    more {'>'}
                </div>
            </div> */}
            {(personnelState === '1' || personnelState === '2') && (
                <div className="demo">
                    <div className="demo-left">
                        <div className="record-content">
                            <Timeline mode="left">
                                <Timeline.Item dot={<WindowSvg1 />} label="监控中心" position="left">
                                    {localStorage.getItem('monitorCenterName') || baseInfo.centerName}
                                </Timeline.Item>
                                <Timeline.Item dot={<WindowSvg1 />} label="监控班组" position="left">
                                    {localStorage.getItem('monitorGroupName') || baseInfo.groupName}
                                </Timeline.Item>
                                <Timeline.Item dot={<WindowSvg1 />} label="班次" position="left">
                                    {baseInfo.workShiftName}
                                </Timeline.Item>
                                <Timeline.Item dot={<WindowSvg1 />} className="left-name" label="本次值班人员" position="left">
                                    {/* {baseInfo?.workShiftUsersName?.toString()} */}
                                    {localStorage.getItem('onDutyUserName') || baseInfo?.mainName?.toString()}
                                </Timeline.Item>
                                <Timeline.Item dot={<WindowSvg1 />} className="left-content" label="重要通知" position="left">
                                    {baseInfo.importanceInform ? baseInfo.importanceInform : '无'}
                                </Timeline.Item>
                            </Timeline>
                        </div>
                        <div className="record-button">
                            <div
                                className="button-style"
                                onClick={() => {
                                    if (personnelState === '1') {
                                        handover();
                                    } else {
                                        accept();
                                    }
                                }}
                            >
                                <div className="button-style-word">{personnelState === '1' ? '交班' : '接班'}</div>
                                <div className="button-style-time">剩余时间</div>
                                <div className="button-style-count">{countdown ? countdown : '00:00'}</div>
                            </div>
                            {/* <div className="button-style">
                                {personnelState === '1' && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        shape="round"
                                        onClick={() => {
                                            handover();
                                        }}
                                    >
                                        交班
                                    </Button>
                                )}
                                {personnelState === '2' && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        shape="round"
                                        onClick={() => {
                                            accept();
                                        }}
                                    >
                                        接班
                                    </Button>
                                )}
                            </div>
                            <div className="button-time">
                                {personnelState === '1' && <span>交班剩余时间</span>}
                                {personnelState === '2' && <span>接班剩余时间</span>}
                                <div className="time-style">{countdown}</div>
                            </div> */}
                        </div>
                    </div>
                    <Divider style={{ height: 'auto' }} dashed type="vertical" />
                    {/* <div className="demo-right">{personnelState}</div> */}
                    <div className="demo-right">
                        {recordList && recordList.length > 0 ? (
                            <Fragment>
                                <div className="list-top">
                                    <List
                                        itemLayout="horizontal"
                                        size="large"
                                        dataSource={recordList}
                                        locale={{ emptyText: '暂无数据' }}
                                        renderItem={(item) => {
                                            const editable = item.key === editingKey;
                                            return (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<WindowSvg2 className="avatar-div" />}
                                                        title={
                                                            editable ? (
                                                                <div className="personnel-input">
                                                                    <TextArea
                                                                        value={contentVal}
                                                                        maxLength={2000}
                                                                        onChange={onChangeText}
                                                                        onPressEnter={onChangeText}
                                                                        className="record-text"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="personnel-card">{item.content}</div>
                                                            )
                                                        }
                                                        description={
                                                            <div className="table-description">
                                                                <div className="table-description-personnel">
                                                                    <div className="personnel-card">{item.userName}</div>
                                                                </div>
                                                                <div className="personnel-time">{item.operationTime}</div>
                                                            </div>
                                                        }
                                                    />
                                                    {personnelState === '1' ? (
                                                        editable ? (
                                                            <div style={{ display: 'flex' }}>
                                                                <Button
                                                                    onClick={() => save(item)}
                                                                    type="primary"
                                                                    size="small"
                                                                    className="bottom-style"
                                                                    style={{ marginRight: '10px', marginTop: '-2px' }}
                                                                >
                                                                    保存
                                                                </Button>
                                                                <div style={{ width: '20px' }} onClick={() => delData(item)}>
                                                                    {/* <Icon
                                                                    antdIcon
                                                                    key="icona-1"
                                                                    type="icona-1"
                                                                    style={{ fontSize: '20px', cursor: 'pointer' }}
                                                                /> */}
                                                                    <WindowSvg4 style={{ fontSize: '20px', cursor: 'pointer' }} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ width: '60px', display: 'flex' }}>
                                                                <div
                                                                    style={{ width: '30px' }}
                                                                    onClick={() => {
                                                                        if (editingKey) {
                                                                            message.warning('请先保存工作记录再新增!');
                                                                        } else {
                                                                            logNew('监控工作台交接班待办组件', '300016');
                                                                            setEditingKey(item.key);
                                                                            setContentVal(item.content);
                                                                        }
                                                                    }}
                                                                >
                                                                    <WindowSvg3
                                                                        style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
                                                                    />
                                                                </div>

                                                                <div style={{ width: '30px' }} onClick={() => delData(item)}>
                                                                    <WindowSvg4
                                                                        style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </List.Item>
                                            );
                                        }}
                                    />
                                    {personnelState === '1' && (
                                        <div className="list-bottom">
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    addData();
                                                }}
                                                className="bottom-style"
                                            >
                                                <Icon antdIcon type="PlusOutlined" />
                                                新增
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className="important-notice-nothing">
                                    <div className="important-notice-img" />
                                    <div className="important-notice-word">暂无当班记录</div>
                                </div>
                                {personnelState === '1' && (
                                    <div className="list-bottom">
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                addData();
                                            }}
                                            className="bottom-style"
                                        >
                                            <Icon antdIcon type="PlusOutlined" />
                                            新增
                                        </Button>
                                    </div>
                                )}
                            </Fragment>
                        )}
                    </div>
                </div>
            )}

            {(personnelState === '0' || personnelState === '9' || personnelState === '500') && (
                <div className="change-shifts-page-continer">
                    <div style={{ height: '60%', marginTop: '-4vh' }}>
                        <img src={CuoWu} alt="" className="change-shifts-page-img" style={{ height: '90%' }} />
                    </div>
                    <div>
                        <span className="change-shifts-page-word">对不起，您不是值班人员，无法交接班</span>
                    </div>
                </div>
            )}
            {personnelState === '6' && (
                <div className="change-shifts-page-continer">
                    <div style={{ height: '60%', marginTop: '-4vh' }}>
                        <img src={Zwsj} alt="" className="change-shifts-page-img" style={{ height: '90%' }} />
                    </div>
                    <div>
                        <span className="change-shifts-page-word">恭喜您交班成功!({timing}秒)</span>
                    </div>
                </div>
            )}
            {personnelState === '7' && (
                <div className="change-shifts-page-continer">
                    <div style={{ height: '60%', marginTop: '-4vh' }}>
                        <img src={Zwsj} alt="" className="change-shifts-page-img" style={{ height: '90%' }} />
                    </div>
                    <div>
                        <span className="change-shifts-page-word">恭喜您接班成功!({timing}秒)</span>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ChangeShifts;
