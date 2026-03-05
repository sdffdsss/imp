// import React,{useEffect,useState}from 'react';
import React, { useRef, useEffect, useState } from 'react';
import useLoginInfoModel from '@Src/hox';
import { Icon, Modal, message, Badge } from 'oss-ui';
import AlarmSms from '@Src/components/alarm-sms-distribution';
import CustomModalFooter from '@Src/components/custom-modal-footer';
import { _ } from 'oss-web-toolkits';
import constants from '@Common/constants';
import { useHistory } from 'react-router-dom';
import actionss from '@Src/share/actions';
import { Api } from '../api';
import TalkView from '@Components/talk-view';
import { logNew } from '@Common/api/service/log';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import './style.less';
import dayjs from 'dayjs';
const ChatView = ({ sheetInfo, chatVisible, onMouseEnter, onMouseLeave }) => {
    const [smsVisible, setsmsVisible] = useState(false);

    const history = useHistory();
    const chatViewRef: any = useRef();
    const login = useLoginInfoModel();
    const [visible, setVisible] = useState(false);
    const [sheetNoMessage, setSheetNoMessage] = useState(0);
    const { userId, userName, systemInfo, userInfo } = login;
    const userInfoParse = (userInfo && JSON.parse(userInfo)) || {};
    const userInfos = systemInfo?.currentZones?.zoneId
        ? systemInfo.currentZones
        : { zoneId: userInfoParse?.zones[0]?.zoneId, zoneName: userInfoParse?.zones[0]?.zoneName, zoneLevel: userInfoParse?.zones[0]?.zoneLevel };
    useEffect(() => {
        // closeModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, smsVisible]);
    const messagePost = (values: any) => {
        const data = { operateProps: values, operatorId: userId, operatorName: userName };
        Api.messagePost(data)
            .then((res) => {
                if (res && res.data) {
                    //操作成功
                    message.success(`短信已发送，请查收。`);
                } else {
                    //操作失败
                    message.error(`短信发送失败：${res.message}`);
                }
                setsmsVisible(false);
            })
            .catch((err) => {
                console.error(`短信发送失败：${err.message}`);
            });
    };
    const onOk = () => {
        const formRef = _.cloneDeep(chatViewRef);
        formRef.current
            .validateFields()
            .then((values) => {
                if (!values.userList && !values.phoneList) {
                    message.error('短信接收人员不能为空');
                    return;
                }
                messagePost(values);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const getMessageCount = async () => {
        const numData = {
            appKey: 'BOCO',
            params: JSON.stringify({
                groupIds: [`${sheetInfo.sheetNo}`],
                userId: userInfoParse.loginId,
                timeStamp: dayjs().format('YYYYMMDDHHmmss'),
            }),
        };
        const resultNum = await Api.getUneradMessage(numData);
        if (resultNum) {
            setSheetNoMessage(resultNum.data[`${sheetInfo.sheetNo}`]);
        }
        console.log(resultNum);
    };
    useEffect(() => {
        sheetInfo.sheetNo && getMessageCount();
        // closeModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetInfo.sheetNo]);
    const pushActions = () => {
        logNew(`调度工作台工单详情`, '300044');
        sendLogFn({ authKey: 'troubleshootingWorkbench:msgHandle' });
        const url = `/unicom/home-unicom/send-sms`;
        const { actions, messageTypes } = actionss;
        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
                search: {
                    operId: '300044',
                },
            });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url.slice(7)}`);
        }
    };
    const closeChanage = (flag) => {
        sendLogFn({ authKey: 'troubleshootingWorkbench:groupTalk' });
        logNew(`调度工作台工单详情`, '300044');
        !flag && getMessageCount();
        setVisible(flag);
    };
    useEffect(() => {
        if (chatVisible && !visible) {
            closeChanage(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatVisible]);
    return (
        <>
            <div className="chat-view" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <Badge count={sheetNoMessage} offset={[-17, 10]}>
                    <div className="chat-view-chats oss-imp-alart-common-bg" onClick={() => closeChanage(true)}>
                        <div className="chat-img">
                            <Icon type="iconqunliao" />
                        </div>
                        <span className="title">在线群聊</span>
                    </div>
                </Badge>
                <div
                    className="chat-view-msg oss-imp-alart-common-bg"
                    // onClick={pushActions}
                    onClick={() => {
                        pushActions();
                    }}
                    // onClick={() => {
                    //     setsmsVisible(true);
                    // }}
                >
                    <div className="chat-img">
                        <Icon type="iconduanxinduban" />
                    </div>
                    <span className="title">短信督办</span>
                </div>
            </div>
            <Modal
                destroyOnClose
                visible={smsVisible}
                width={800}
                onCancel={() => {
                    setsmsVisible(false);
                }}
                footer={
                    <CustomModalFooter
                        confirmLoading={true}
                        onCancel={() => {
                            setsmsVisible(false);
                        }}
                        onOk={onOk}
                    />
                }
                title="短信通知"
            >
                {smsVisible && <AlarmSms userId={userId} systemInfo={systemInfo} type="sms" menuComponentFormRef={chatViewRef} />}
            </Modal>
            {sheetInfo.sheetNo && visible && (
                <TalkView
                    visible={visible}
                    closeChanage={closeChanage}
                    userInfo={{
                        userId: userId,
                        userName: userName,
                        groupId: sheetInfo.sheetNo,
                        groupName: sheetInfo.sheetTitle,
                        zoneId: userInfos?.zoneId,
                        zoneName: userInfos?.zoneName,
                        zoneLevel: userInfos?.zoneLevel,
                    }}
                />
            )}
        </>
    );
};
export default ChatView;
