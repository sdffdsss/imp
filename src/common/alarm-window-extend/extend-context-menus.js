import React from 'react';
import { Modal, message, Form, Input } from 'oss-ui';
import AlarmNotice from '@Components/alarm-notice';
import TicketCancellation from '@Components/ticket-cancellation';
import AddToSheet from '@Components/add-to-sheet';
import SheetDetail from '@Components/sheet-detail';
import { CompDevRes } from '@Components/comp-dev-res';
import request from '@Common/api';
import { useEnvironmentModel } from '@Src/hox';
import { setMaxDigits, RSAKeyPair, encryptedString } from './security';
import shareActions from '@Src/share/actions';
import dayjs from 'dayjs';
import { _ } from 'oss-toolkits';
import { getAbbrProv } from './util';

const createOrder = (data) => {
    return request('alarmmodel/EOMS/v1/createOrder', {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
    })
        .then((res) => {
            if (res?.data?.rtCode === '000' && res?.data?.url) {
                return res.data.url;
            }
            message.error(res.data.rtMessage);
            return null;
        })
        .catch(() => {
            message.error('创建工单失败!');
        });
};

const getOrderUrl = (actionRecords) => {
    return request('alarmmodel/EOMS/v1/getOrderUrl', {
        type: 'get',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '保存数据失败',
        data: {
            fp0: actionRecords[0].fp0.value,
            fp1: actionRecords[0].fp1.value,
            fp2: actionRecords[0].fp2.value,
            fp3: actionRecords[0].fp3.value,
        },
    })
        .then((res) => {
            if (res.code === 0 && res.data?.ticketUrl) {
                return res.data.ticketUrl;
            }
            message.error(res.message);
            return null;
        })
        .catch(() => {
            message.error('获取工单失败！');
        });
};
const getAuthToken = ({ userName, password }) => {
    // 公钥
    const keyM =
        '9489ac53a0ab8ff88538519e2c837279412d0869d198a3fbe8dc599631f225bba9b0e17457e1d3e6e9297fbbdac39b8b8961e5f0abb3ae31dd69a2b466111e1bdf6450fcd2b74c5c7797e691357aa8147ac09c98db8e47dfbc075340b043004d875ccf88562a31b87eeb97f2857f595b9c18492f218d0530ce5258a19e0c3091';
    const keyE = '10001';
    setMaxDigits(131);
    const key = new RSAKeyPair(keyE, '', keyM);
    const encryptionPassword = encryptedString(key, password);
    return request('alarmmodel/EOMS/v1/getAuthToken', {
        type: 'post',
        baseUrlType: 'filterUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        data: {
            userName,
            password: encryptionPassword,
        },
    })
        .then((res) => {
            if (res.code === 0) {
                return { ...res.data, saveUserName: userName, savePassword: password };
            }
            message.error(res.message);
            return null;
        })
        .catch(() => {
            message.error('用户信息认证失败！');
        });
};

const openOrderSheet = async (originData, result, close) => {
    const authData = await getAuthToken(result);
    if (authData && authData.access_token) {
        localStorage.setItem('saveUserName', authData.saveUserName);
        localStorage.setItem('savePassword', authData.savePassword);
        if (close) {
            close();
        }
        const orderUrl = await createOrder({ ...originData, userName: authData.userName });
        if (orderUrl) {
            window.open(`${orderUrl}&ticket=${authData.access_token}`);
        }
    } else {
        message.error('认证失败！');
    }
};

const openOrderDetail = async (actionRecords, result, close) => {
    const authData = await getAuthToken(result);
    if (authData && authData.access_token) {
        localStorage.setItem('saveUserName', authData.saveUserName);
        localStorage.setItem('savePassword', authData.savePassword);
        if (close) {
            close();
        }
        const orderUrl = await getOrderUrl(actionRecords);
        if (orderUrl) {
            window.open(`${orderUrl}&ticket=${authData.access_token}`);
        }
    } else {
        message.error('认证失败！');
    }
};

const getRecordDetail = (detailRes) => {
    const recordsDetail = [];
    if (detailRes && detailRes.length) {
        _.forEach(detailRes, (item) => {
            if (item?.alarmFieldList) {
                recordsDetail.push(
                    item.alarmFieldList.map((field) => ({
                        fieldName: field.field,
                        fieldValue: field.value,
                        fieldLabel: field.lable,
                    })),
                );
            } else {
                const newItem = {};
                _.forOwn(item, (value) => {
                    newItem.fieldName = value.field;
                    newItem.fieldValue = value.value;
                    newItem.fieldLabel = value.lable;
                });
                recordsDetail.push(newItem);
            }
        });
    }
    return recordsDetail;
};

export const extendContextMenu = [
    {
        name: '告警详情',
        key: 'NewAlarmDetails',
        component: null,
        type: 'normal',
        pageType: 'jump',
        action: () => {},
        shouldAction: (record, target) => {
            // 右键是否可用判断
            return record.alarm_id?.value === target.alarm_id?.value;
        },
    },
    {
        name: '告警查询',
        key: 'AlarmSearch',
        component: null,
        type: 'normal',
        pageType: 'jump',
        action: ({ actionRecords }) => {
            const standard_alarm_id = actionRecords[0]?.standard_alarm_id?.value;
            const event_time = actionRecords[0]?.event_time?.value;
            if (standard_alarm_id) {
                const { actions, messageTypes } = shareActions;
                let timer = null;
                actions.postMessage(messageTypes.closeTabs, {
                    entry: `/unicom/home-unicom/search/alarm-query`,
                });
                clearTimeout(timer);
                timer = setTimeout(() => {
                    actions.postMessage(messageTypes.openRoute, {
                        entry: `/unicom/home-unicom/search/alarm-query`,
                        search: {
                            standard_alarm_id,
                            event_time: dayjs(event_time).format('YYYY-MM-DD'),
                        },
                    });
                }, 1000);
            }

            console.log(actionRecords);
        },
        shouldAction: () => {
            // 右键是否可用判断
            return true;
        },
    },
    {
        name: '告警手工派单',
        key: 'EomsManualDispatch',
        parentKey: 'SheetOperation',
        component: null,
        type: 'normal',
        pageType: 'jump', // 右键类型：不定类型
        action: async ({ actionRecords, getRecordsDetail, frameInfo }) => {
            const thirdpart_access_token = localStorage.getItem('thirdpart_access_token');
            // const access_token = localStorage.getItem('access_token');
            const getRecordsDetailPromise = (records) => {
                return new Promise((resolve) => {
                    getRecordsDetail(records, (res, queryRes) => {
                        const recordsDetail = res ? getRecordDetail(res) : queryRes;
                        if (recordsDetail) {
                            resolve(recordsDetail);
                        }
                    });
                });
            };
            // 获取告警详情
            const result = await getRecordsDetailPromise(actionRecords);
            const originData = {
                alarmFieldSet: {
                    alarmFieldList: result[0],
                    alarmId: {
                        fp0: actionRecords[0].fp0.value,
                        fp1: actionRecords[0].fp1.value,
                        fp2: actionRecords[0].fp2.value,
                        fp3: actionRecords[0].fp3.value,
                    },
                },
                userName: frameInfo.userName,
            };
            if (thirdpart_access_token) {
                const orderUrl = await createOrder(originData);
                if (orderUrl) {
                    window.open(`${orderUrl}&ticket=${thirdpart_access_token}`);
                }
            } else {
                if (localStorage.getItem('saveUserName') && localStorage.getItem('savePassword')) {
                    openOrderSheet(originData, { userName: localStorage.getItem('saveUserName'), password: localStorage.getItem('savePassword') });
                    return;
                }
                const formRef = React.createRef();
                Modal.confirm({
                    title: '请输入账号信息',
                    centered: true,
                    bodyStyle: { overflow: 'hidden' },
                    content: (
                        <Form ref={formRef}>
                            <Form.Item
                                name="userName"
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 18,
                                }}
                                label="用户名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 18,
                                }}
                                label="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Form>
                    ),
                    onOk: (close) => {
                        formRef.current.validateFields().then((values) => {
                            openOrderSheet(originData, values, close);
                        });
                    },
                    onCancel: (close) => {
                        close();
                    },
                });
            }
        },
        shouldAction: (record, target) => {
            // 右键是否可用判断
            return record.alarm_id?.value === target.alarm_id?.value && target.send_status?.value !== '5' && target.send_status?.value !== '6';
        },
    },
    {
        name: '查看EOMS工单详情',
        key: 'EomsSheetCheck',
        parentKey: 'SheetOperation',
        component: null,
        type: 'normal',
        operateType: '',
        pageType: 'jump',
        action: async ({ actionRecords }) => {
            const thirdpart_access_token = localStorage.getItem('thirdpart_access_token');
            // const access_token = localStorage.getItem('access_token');
            if (thirdpart_access_token) {
                const orderUrl = await getOrderUrl(actionRecords);
                if (orderUrl) {
                    window.open(`${orderUrl}&ticket=${thirdpart_access_token}`);
                }
            } else {
                if (localStorage.getItem('saveUserName') && localStorage.getItem('savePassword')) {
                    openOrderDetail(actionRecords, {
                        userName: localStorage.getItem('saveUserName'),
                        password: localStorage.getItem('savePassword'),
                    });
                    return;
                }
                const formRef = React.createRef();
                Modal.confirm({
                    title: '请输入账号信息',
                    centered: true,
                    bodyStyle: { overflow: 'hidden' },
                    content: (
                        <Form ref={formRef}>
                            <Form.Item
                                name="userName"
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 18,
                                }}
                                label="用户名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 18,
                                }}
                                label="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Form>
                    ),
                    onOk: (close) => {
                        formRef.current.validateFields().then((values) => {
                            openOrderDetail(actionRecords, values, close);
                        });
                    },
                    onCancel: (close) => {
                        close();
                    },
                });
            }
        },
        shouldAction: (record, target) => {
            return record.alarm_id?.value === target.alarm_id?.value && !!target.send_status?.value && target.send_status?.value !== '0';
        },
    },
    {
        name: '告警重要通知',
        key: 'alarmNotice',
        component: AlarmNotice,
        type: 'normal',
        operateType: 'test', // 右键操作标识
        feedbackField: ['data'], // 右键提交时需要搜集的表单字段
        pageType: 'form',
        action: ({ data }) => {
            // 表单类型点击确认按钮时的动作
            request('v1/syncAlarmInfo', {
                type: 'post',
                baseUrlType: 'noticeUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '保存数据失败',
                data: data.operateProps.data,
            })
                .then((res) => {
                    if (res.code === 0) {
                        message.success('发布成功');
                    } else {
                        message.error(res.message);
                    }
                })
                .catch(() => {});
        },
        shouldAction: () => {
            // 右键是否可用判断
            return true;
        },
    },
    {
        name: '查看工单详情-联通',
        key: 'EomsSheetCheckUnicom',
        parentKey: 'SheetOperation',
        component: SheetDetail,
        type: 'normal',
        operateType: 'test', // 右键操作标识
        feedbackField: ['data'], // 右键提交时需要搜集的表单字段
        pageType: 'form', // 右键类型：表单
        preventModalCloseOnFailure: true,
        action: async ({ frameInfo, data, onCancel }) => {
            // return;
            // const getRecordsDetailPromise = (records) => {
            //     return new Promise((resolve) => {
            //         getRecordsDetail(records, (res) => {
            //             let recordsDetail = {};
            //             if (res && res[0]) {
            //                 if (res[0].alarmFieldList) {
            //                     recordsDetail = res[0].alarmFieldList;
            //                 } else {
            //                     recordsDetail = Object.values(res[0]);
            //                 }
            //             }
            //             if (recordsDetail) {
            //                 resolve(recordsDetail);
            //             }
            //         });
            //     });
            // };
            // const result = await getRecordsDetailPromise(actionRecords);

            const result = data?.operateProps?.data || {};
            const sheetNo = result.sheetNo;
            const professionalType = result.professionalType;
            const provinceId = result.provinceId;

            if (!sheetNo) {
                message.warn('未查询到工单号，请确认后再操作！');
                return;
            }
            // const url = `${useEnvironmentModel.data.environment.emosUrl}?sheetNo=${sheetNo}&userName=${frameInfo.loginId}`;
            // window.open(url);
            request('work/sheet/v1/getEmosUrl', {
                type: 'post',
                baseUrlType: 'failureSheetExportUrl',
                showSuccessMessage: false,
                showErrorMessage: true,
                data: {
                    logInId: result.loginId,
                    sheetNo,
                    professionalType,
                    provinceId,
                    forwardTime: result?.forwardTime,
                },
            }).then((res) => {
                if (res.code === 200) {
                    onCancel();
                    window.open(res.data);
                } else {
                    message.warn(res.message);
                }
            });
        },
        shouldAction: (record, target) => {
            // 右键是否可用判断
            // return record.alarm_id?.value === target.alarm_id?.value && !!target.send_status?.value && target.send_status?.value !== '0';
            return true;
        },
    },
    {
        name: '工单撤销-湖南联通',
        key: 'EomsTicketCancellationUnicom',
        parentKey: 'SheetOperation',
        component: TicketCancellation,
        type: 'normal',
        operateType: 'test', // 右键操作标识
        feedbackField: ['data'], // 右键提交时需要搜集的表单字段
        pageType: 'form', // 右键类型：表单
        action: ({ actionRecords, frameInfo, data }) => {
            const field = {
                fp0: actionRecords[0].fp0.value,
                fp1: actionRecords[0].fp1.value,
                fp2: actionRecords[0].fp2.value,
                fp3: actionRecords[0].fp3.value,
                ...data.operateProps.data,
                sheetNo: actionRecords[0].sheetNo?.value,
            };
            console.log(field);

            // const sheetNo = actionRecords[0].sheet_no?.value;
            // const url = `${useEnvironmentModel.data.environment.emosUrl}?sheetNo=${sheetNo}&userName=${frameInfo.loginId}`;
            // window.open(url);
        },
        shouldAction: () => {
            // 右键是否可用判断
            return true;
        },
    },
    {
        name: '追加告警到工单',
        key: 'AddToSheet',
        parentKey: 'SheetOperation',
        component: AddToSheet,
        type: 'normal',
        operateType: 'test', // 右键操作标识
        feedbackField: ['data'], // 右键提交时需要搜集的表单字段
        pageType: 'form', // 右键类型：表单
        preventModalCloseOnFailure: true,
        action: async ({ data, onCancel }) => {
            if (!data.operateProps.data.sheetNo) {
                message.error('工单号不能为空');
                return;
            }
            let operateType = 'alarm_manual_send';
            let datas = {
                ...data,
                operateProps: data.operateProps.data,
                operateType,
                configType: data.operateProps.data?.configType === '1' ? 0 : 2, // 0 故障单 2 督办单
            };
            request('alarmmodel/operate/v1/operate/alarm/dispatch', {
                type: 'post',
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,
                showErrorMessage: true,
                data: datas,
            }).then(() => {
                message.success('手工追单成功');
                onCancel();
            });
        },
        shouldAction: (record, target) => {
            return record.send_status?.value !== '5' && record.send_status?.value !== '6';
        },
    },
    {
        name: '拓扑查看',
        key: 'topologyView',
        component: null,
        type: 'normal',
        pageType: 'jump',
        action: async ({ actionRecords, getRecordsDetail, frameInfo }) => {
            console.log(actionRecords, getRecordsDetail, frameInfo);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const standard_alarm_id = actionRecords[0]?.standard_alarm_id?.value;
            let sourceValue = actionRecords[0]?.alarm_source && actionRecords[0]?.alarm_source.value;
            let professionalType = actionRecords[0]?.professional_type && actionRecords[0]?.professional_type.lable;
            let undoReason = actionRecords[0]?.undo_reason && actionRecords[0]?.undo_reason.lable;
            let eqpIdn = actionRecords[0]?.eqp_idn && actionRecords[0]?.eqp_idn.value;
            const recordAlarmDetailList = [];
            const getAlarmDetail = (sessionId, selectRowKey) => {
                return request('alarm/detail/v1/alarms', {
                    type: 'post',
                    baseUrlType: 'exportUrl',
                    data: [].concat(selectRowKey),
                    showSuccessMessage: false,
                    showErrorMessage: false,
                })
                    .then((res) => {
                        if (res) {
                            return res.data;
                        }
                        return [];
                    })
                    .catch(() => {
                        return [];
                    });
            };
            // 获取告警详情
            getAlarmDetail('', [standard_alarm_id]).then((res) => {
                if (res && res.length > 0) {
                    res.forEach((i) => {
                        const key = Object.keys(i)?.[0];
                        if (key && [standard_alarm_id].indexOf(key) > -1) {
                            recordAlarmDetailList.push(i[key]);
                        }
                    });
                    sourceValue = recordAlarmDetailList[0]?.alarm_source?.value;
                    professionalType = recordAlarmDetailList[0]?.professional_type?.lable;
                    undoReason = recordAlarmDetailList[0]?.undo_reason?.lable;
                    eqpIdn = recordAlarmDetailList[0]?.eqp_idn?.value;
                }
                console.log(professionalType, undoReason, eqpIdn, '===detail', sourceValue, recordAlarmDetailList);
                if (professionalType === '传输网' && (undoReason === '省内传输网间互联告警' || undoReason === '省内传输网内互联告警') && eqpIdn) {
                    const url = `${useEnvironmentModel.data.environment.alarmWindowTopoErGanUrl}`;
                    if (url) {
                        window.open(`${url}?prov=${getAbbrProv(recordAlarmDetailList[0]?.province_id?.lable)}&eqpdn=${eqpIdn}`);
                    }
                    return;
                }
                if (sourceValue) {
                    let url = '';
                    switch (sourceValue) {
                        case '智能排障（MBB）':
                            url = `${useEnvironmentModel.data.environment.alarmWindowTopoMMBUrl}`;
                            break;
                        case '智能排障（FBB）':
                            url = `${useEnvironmentModel.data.environment.alarmWindowTopoMMBUrl}`;
                            break;
                        case '智能排障(云核心网)':
                            url = `${useEnvironmentModel.data.environment.alarmWindowTopoCloudUrl}`;
                            break;
                        case '智能排障（骨干网故障诊断）':
                            url = `${useEnvironmentModel.data.environment.alarmWindowTopoUrl}`;
                            break;
                        default:
                            return message.warn('没有拓扑资源');
                    }
                    if (url) {
                        window.open(`${url}?alarmId=${actionRecords[0].standard_alarm_id.value}&eventTime=${actionRecords[0].event_time.value}`);
                    }
                }
            });
        },
        shouldAction: (record, target) => {
            // 右键是否可用判断
            return true;
        },
    },
    {
        name: '资源信息',
        key: 'CompDevResUnicom',
        parentKey: 'CompDevResAttr',
        component: CompDevRes,
        type: 'normal',
        operateType: 'test', // 右键操作标识
        feedbackField: ['data'], // 右键提交时需要搜集的表单字段
        pageType: 'view', // 右键类型：表单
        preventModalCloseOnFailure: true,
        action: async ({ actionRecords, frameInfo, data }) => {
            console.log(data, actionRecords);
        },
        shouldAction: (record, target) => {
            // 右键是否可用判断
            return true;
        },
    },
];
