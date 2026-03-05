import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, Row, Col, Input, Icon, message, Checkbox, Spin, Button, Image } from 'oss-ui';
import { Ellipsis } from 'antd-mobile';
import { actionChatGroup, getUserList, actionAddUser, historyMessageAction, sheetNoSend } from './api';
import request from '@Common/api';
import stompjs from 'stompjs';
import dayjs from 'dayjs';
import classnames from 'classnames';
import _reverse from 'lodash/reverse';
import constants from '@Common/constants';
import { useEnvironmentModel } from '@Src/hox';
import Editor from './editor';
import './style.less';
function uncodeUtf16(str) {
    console.log(str);
    const reg = /\&#.*?;/g;
    const result = str.replace(reg, function (char) {
        let H, L, code;
        if (char.length === 9) {
            code = parseInt(char.match(/[0-9]+/g));
            H = Math.floor((code - 0x10000) / 0x400) + 0xd800;
            L = ((code - 0x10000) % 0x400) + 0xdc00;
            return unescape('%u' + H.toString(16) + '%u' + L.toString(16));
        } else {
            return char;
        }
    });
    console.log(result);
    return result;
}

// const { TextArea } = Input;
interface personChild {
    userId: string;
    userName: string;
}
interface groupDataType {
    groupName: string;
    groupCount: number;
}
interface chatData {
    groupMsgNo: number;
    groupId: string;
    fromId: string;
    fromName: string;
    createTime: string;
    content: string;
    messageTypeId: string;
    messageType: string;
    size?: string;
}
interface userDataType {
    userId: string;
    userName: string;
    userMobile: string;
}
let stompClient: any = null;
let chataDataMap: chatData[] = [];
let userDataMap: userDataType[] = [];
let socketCount = 1;
let historyPagetion = { pageNum: 0, totalPages: 0 };
let pagetion = { page_num: 0, totalPages: 0 };
const TalkView = ({ userInfo, visible, closeChanage, viewType = false }) => {
    const [person, setPerson] = useState<personChild[]>([]);
    const [chatData, setChatData] = useState<chatData[]>([]);
    const [userData, setUserData] = useState<userDataType[]>([]);
    // const [inputClear, setInputClear] = useState<string | undefined>('');
    const [addFlag, setAddFlag] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [activeList, setActiveList] = useState<userDataType[]>([]);
    const isBottom: any = useRef(true);
    const searchName: any = useRef('');
    const sendMessage: any = useRef(true);
    const listLoading: any = useRef(false);
    // const [historyPagetion, setHistoryPagetion] = useState({ pageSize: 20, pageNum: 1, totalPages: 0 });
    const [groupData, setGrounpData] = useState<groupDataType>({ groupName: '', groupCount: 0 });
    const [loading, setLoading] = useState(false);
    const historyRef: any = useRef();
    const contentRef: any = useRef();
    const userRef: any = useRef(null);
    const readRef: any = useRef({});
    useEffect(() => {
        chataDataMap = [];
        userDataMap = [];
        historyPagetion = { pageNum: 0, totalPages: 0 };
        pagetion = { page_num: 0, totalPages: 0 };
        socketCount = 1;
    }, []);
    const sendMessagNo = (data) => {
        stompClient && stompClient.send(`/massCallBackRequest/${userInfo.groupId}`, {}, JSON.stringify(data));
    };
    const sendUserAdd = (data) => {
        stompClient.send(`/massMemberChangeRequest/${userInfo.groupId}`, {}, JSON.stringify(data));
    };
    const actionChatGroupData = useCallback(async (): Promise<void> => {
        const res = await actionChatGroup({ id: userInfo.groupId, groupName: userInfo.groupName, createUserId: userInfo.userId });
        if (res.data) {
            setGrounpData({ groupName: res.data.groupName, groupCount: res.data.members.length });
        }
        if (res?.data?.members) {
            setPerson(res.data.members);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const actionAddUserData = async (): Promise<void> => {
        const userIds = activeList.map((item) => item.userId);
        const res = await actionAddUser(userInfo.groupId, userIds);
        if (res.code !== 500) {
            setAddFlag(false);
            setActiveList([]);
            const data = {
                userIds,
            };
            sendUserAdd(data);
            // actionChatGroupData();
        } else {
            message.error(res.message);
        }
    };
    useEffect(() => {
        if (visible) {
            actionChatGroupData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    const getUserListData = async (num, name?: boolean) => {
        if (num === pagetion.page_num || listLoading.current) {
            return;
        }
        setLoading(true);
        listLoading.current = true;
        console.log(searchName.current);
        const data = {
            zoneLevel: userInfo.zoneLevel,
            zoneId: userInfo.zoneId,
            flag: 2,
            pageNum: num,
            userNameOrMobile: searchName.current,
            pageSize: 30,
            userAuthorityId: userInfo.userId,
            // loginId:''
        };
        const res = await getUserList(data);
        if (res) {
            const { current, totalPages } = res;
            pagetion = { page_num: current, totalPages };
        }

        if (res.data?.info) {
            const list = res.data?.info.map((item) => {
                return {
                    userId: item.userId,
                    userName: item.userName,
                    userMobile: item.userMobile,
                };
            });
            userDataMap = name ? list : userDataMap.concat(list);

            setUserData(userDataMap);
            setLoading(false);
            listLoading.current = false;
        } else {
            setLoading(false);
            listLoading.current = false;
        }
    };
    const historyMessageActionData = async (num): Promise<void> => {
        if (num === historyPagetion.pageNum) {
            return;
        }
        const res = await historyMessageAction(userInfo.groupId, 20, num);
        if (res.data.info) {
            const list = res.data.info.map((item) => {
                if (item.fromId === userInfo.userId) {
                    item.messageType = '1';
                } else {
                    item.messageType = '2';
                }
                return item;
            });
            _reverse(list || []);
            const { current, totalPages } = res;
            historyPagetion = { pageNum: current, totalPages };
            chataDataMap = list.concat(chataDataMap);
            setChatData(chataDataMap);
            if (num === 1 && chataDataMap.length > 0) {
                const data = {
                    id: chataDataMap[chataDataMap.length - 1]?.groupMsgNo,
                    fromId: userInfo.userId,
                };
                readRef.current = data;
                sendMessagNo(data);
                sendMessage.current = false;
                contentRef?.current?.scrollIntoView(false);
            }
        }
    };
    // useEffect(() => {
    //     historyMessageActionData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    //广播（一对多）
    const stompTopic = () => {
        //通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息（广播接收信息）
        stompClient.subscribe(`/mass/getResponse/${userInfo.groupId}`, (response) => {
            if (response.body) {
                const messageData = JSON.parse(response.body);
                if (chataDataMap.find((item) => item.groupMsgNo === messageData.groupMsgNo)) {
                    return;
                }
                if (messageData.fromId === userInfo.userId) {
                    messageData.messageType = '1';
                } else {
                    messageData.messageType = '2';
                }
                chataDataMap = chataDataMap.concat(messageData);
                setChatData(chataDataMap);
                if (isBottom.current) {
                    const data = {
                        id: chataDataMap[chataDataMap.length - 1]?.groupMsgNo,
                        fromId: userInfo.userId,
                    };
                    sendMessagNo(data);
                    // sendMessage.current = false;
                    contentRef?.current?.scrollIntoView(false);
                } else {
                    // setNewMessageCount(newCount);
                    // sendMessage.current = true;
                }
                contentRef?.current?.scrollIntoView(false);
                // contentRef?.current?.scrollTop(contentRef?.current?.scrollHeight);
                // contentRef?.current?.scrollIntoView(false);
            }
        });
        stompClient.subscribe(`/mass/memberChangeResponse/${userInfo.groupId}`, (response) => {
            if (response.body) {
                actionChatGroupData();
            }
        });
    };
    const sendTopic = (data) => {
        stompClient.send(`/massRequest/${userInfo.groupId}`, {}, JSON.stringify(data));
    };
    const sendEndter = (e) => {
        // if (e.keyCode === 13 && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        //     e.preventDefault();
        if (e) {
            const data = {
                groupId: userInfo.groupId,
                fromId: userInfo.userId,
                fromName: person.find((item) => item.userId === userInfo.userId)?.userName || userInfo.userName,
                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                content: e,
                messageTypeId: '1',
            };
            sendTopic(data);
            // setInputClear(undefined);
        } else {
            message.warning('发送内容不能为空');
        }
        // }
    };

    // const inputChange = (e) => {
    //     setInputClear(e.target.value);
    // };
    const sendWebScoket = () => {
        console.log(window.location);
        // const socket = 'ws://172.24.131.231:9011/chatUrlWs/chatroom';
        const socketUrl = useEnvironmentModel?.data?.environment?.chatUrlWsUrl;
        const socketType = useEnvironmentModel?.data?.environment?.chatUrlType;

        const socket = socketType
            ? `ws://${window.location.host}/znjk/${constants.CUR_ENVIRONMENT}${socketUrl}`
            : useEnvironmentModel?.data?.environment?.chatUrlWs;
        historyMessageActionData(1);
        stompClient = stompjs.client(socket); //使用STMOP子协议的WebSocket客户端
        stompClient.connect(
            {},
            (frame) => {
                //连接WebSocket服务端
                socketCount = 1;
                console.log('Connected:' + frame);
                if (readRef.current.id) {
                    sendMessagNo(readRef.current);
                    contentRef?.current?.scrollIntoView(false);
                }
                //广播接收信息
                stompTopic();
            },
            (errorCallBack) => {
                if (socketCount <= 5) {
                    console.log(errorCallBack);
                    console.log(`第${socketCount}次重连`);
                    socketCount++;
                    sendWebScoket();
                } else {
                    if (socketCount > 5) {
                        console.log('超过最大重连次数5次');
                    }
                }
            },
        );
    };
    const personAdd = () => {
        getUserListData(1, true);
        setAddFlag(true);
    };
    const checkChange = (field, checked) => {
        let list: userDataType[] = [];
        if (checked.target.checked) {
            list = [...activeList, field];
        } else {
            list = activeList.filter((item) => item.userId !== field.userId);
        }
        setActiveList(list);
    };
    const delActiveChange = (userId) => {
        const list: userDataType[] = activeList.filter((item) => item.userId !== userId);
        setActiveList(list);
    };
    const saveActiveChange = () => {
        actionAddUserData();
        searchName.current = '';
        setSearchValue('');
        setUserData([]);
        userDataMap = [];
        listLoading.current = false;
        pagetion = { page_num: 0, totalPages: 0 };
    };
    const cancelActiveChange = () => {
        setAddFlag(false);
        searchName.current = '';
        setActiveList([]);
        setSearchValue('');
        setUserData([]);
        userDataMap = [];
        listLoading.current = false;
        pagetion = { page_num: 0, totalPages: 0 };
    };

    // useEffect(() => {
    //     actionChatGroupData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    useEffect(() => {
        sendWebScoket();
        return () => {
            if (stompClient != null) {
                stompClient.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.target;
        isBottom.current = clientHeight + scrollTop >= scrollHeight - 20;
        const isTop = scrollTop < 20;
        if (isTop && historyPagetion.pageNum < historyPagetion.totalPages) {
            historyMessageActionData(historyPagetion.pageNum + 1);
        }
        if (isBottom.current && sendMessage.current) {
            // newCount = 0;
            // setNewMessageCount(0);
            // sendMessage.current = false;
            const data = {
                id: chataDataMap[chataDataMap.length - 1].groupMsgNo,
                fromId: userInfo.userId,
            };
            sendMessagNo(data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    useEffect(() => {
        if (historyRef?.current && historyPagetion.pageNum === 0) {
            historyRef?.current?.addEventListener('scroll', (e) => {
                onScroll(e);
            });
        }

        // return () => {
        //     userRef.current?.removeEventListener('scroll');
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const searchUserChange = (e) => {
        setSearchValue(e.target.value);
        searchName.current = e.target.value;
    };
    const searchUserSearch = () => {
        pagetion = { page_num: 0, totalPages: 0 };
        getUserListData(1, true);

        setUserData([]);
        userDataMap = [];
    };
    const onScrollUser = (event) => {
        const { clientHeight, scrollHeight, scrollTop } = event.target;
        const isBottomUser = clientHeight + scrollTop >= scrollHeight;
        console.log(isBottomUser);
        if (isBottomUser && pagetion.page_num < pagetion.totalPages) {
            getUserListData(pagetion.page_num + 1);
        }
    };
    useEffect(() => {
        if (userRef.current && pagetion.page_num === 0) {
            userRef?.current?.addEventListener('scroll', (e) => {
                onScrollUser(e);
            });
        }
        // return () => {
        //     userRef.current?.removeEventListener('scroll');
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addFlag]);
    const saveActiveImageChange = (imgUrl) => {
        const formName = person.find((item) => item.userId === userInfo.userId)?.userName || '无名';
        const data = {
            groupId: userInfo.groupId,
            fromId: userInfo.userId,
            fromName: formName,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            content: imgUrl,
            messageTypeId: '2',
        };
        sendTopic(data);
        // activeImgList.forEach((item) => {
        //     data.content = item.imageBase64;
        //     sendTopic(data);
        // });
        // setActiveImgList([]);
        // navBack(1);
    };
    const uploadFileChange = (name, id, status) => {
        if (status === 'loading' && chataDataMap.find((item) => item.groupMsgNo === id)) {
            return;
        }
        const formName = person.find((item) => item.userId === userInfo.userId)?.userName || '无名';
        const data = {
            groupId: userInfo.groupId,
            fromId: userInfo.userId,
            fromName: formName,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            content: name,
            messageTypeId: '3',
        };
        if (status === 'loading') {
            const loadingData = {
                ...data,
                groupMsgNo: id,
                messageType: '1',
                size: '上传中',
            };
            chataDataMap = chataDataMap.concat(loadingData);
            setChatData(chataDataMap);
            contentRef?.current?.scrollIntoView(false);
        }
        if (status === 'done') {
            chataDataMap = chataDataMap.filter((item) => item.groupMsgNo !== id);
            setChatData(chataDataMap);
            sendTopic(data);
            contentRef?.current?.scrollIntoView(false);
        }
        if (status === 'error') {
            chataDataMap = chataDataMap.map((item) => {
                if (item.groupMsgNo === id) {
                    item.size = '上传失败';
                }
                return item;
            });
            setChatData(chataDataMap);
            contentRef?.current?.scrollIntoView(false);
        }
    };
    const exportDown = (name) => {
        request('', {
            fullUrl: `${useEnvironmentModel?.data?.environment?.chatUrl.direct1}/${name}`,
            type: 'get',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                publicKey:
                    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDc7i0VItfwG/8PRZ8/AEe55QFGJMs8Zt9vNZ1VRP3Wr1NbvkhrihX6MerUOR+EbKu8hb91ue0YrLR+Lb3TBy2Ihyddwx2jCoZ2Cx67nRVaBQmWdwsOMhRviRVbOyflGdZ2oolw3b9kefK/UvuAAdLpPZzrl4FZWfm7FJrBLHyQQwIDAQAB',
                appToken:
                    'Ivf5n6o8CBu7CNpT45Gz+oWj9mcALzDJIWKqjkjMoMUk2RJi3KVeWITjwQ9jy55omysCxizJUnTKzwO1JheEPTA+CsyV+EcWMOmZNobMydaYTj1CUEVCSA0W0FvvnParUUTXRYbc2PzAbIiFTEhAra+hy0C4k0V7L9EV1ud9q/o=',
            },
            responseType: 'blob',
        }).then((xml) => {
            const blob = new Blob([xml], { type: 'application/octet-stream' });
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL;
            // //此处aa是你的网址
            const a: any = document.createElement('a');
            a.setAttribute('href', url.createObjectURL(blob));
            a.setAttribute('download', name); // download属性
            a.setAttribute('target', '_blank');

            document.body.appendChild(a);
            a.click();
        });
    };
    const sheetSend = async () => {
        const res = await sheetNoSend(userInfo.groupId);
        if (res?.data.length === 0) {
            message.warning(`无工单信息`);
            return;
        }
        const content = `[工单编号]：${res.data[0].sheetNo}\n[工单标题]：${res.data[0].sheetTitle}\n[故障描述]：${res.data[0].faultDesc}\n[发生时间]：${res.data[0].eventTime}`;
        const formName = person.find((item) => item.userId === userInfo.userId)?.userName || '无名';
        const data = {
            groupId: userInfo.groupId,
            fromId: userInfo.userId,
            fromName: formName,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            content: content,
            messageTypeId: '1',
        };
        sendTopic(data);
    };
    return (
        <div className="talk-view-page-chatops">
            <Modal
                title={
                    <div className="talk-view-page-chatops-title" title={groupData.groupName}>
                        <Ellipsis direction="middle" content={groupData.groupName} />
                    </div>
                }
                width={675}
                wrapClassName={viewType ? 'talk-view-page-Modal talk-view-page-Modal-list' : 'talk-view-page-Modal'}
                visible={visible}
                onCancel={() => closeChanage()}
                closable={!viewType}
                footer={null}
            >
                <div className="talk-view-page">
                    <Row style={{ width: '100%', height: '100%' }}>
                        <Col span={18} style={{ height: '100%', borderRight: '1px solid #f0f0f0' }}>
                            <Row style={{ width: '100%', height: '100%' }}>
                                <Col span={24} style={{ height: '70%' }}>
                                    <div className="talk-view-content" ref={historyRef}>
                                        {chatData &&
                                            chatData.map((item) => {
                                                return (
                                                    <div
                                                        key={item.createTime}
                                                        className={classnames('talk-view-content-field', item.messageType === '1' && 'my-talk')}
                                                    >
                                                        {item.messageType === '2' && (
                                                            <div className="talk-view-content-field-name">{item.fromName}</div>
                                                        )}
                                                        <div
                                                            className="talk-view-content-field-area"
                                                            style={{ padding: item.messageTypeId === '1' ? 10 : 0 }}
                                                        >
                                                            {item.messageTypeId === '1' ? (
                                                                <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginBottom: 0 }}>
                                                                    {uncodeUtf16(item.content)}
                                                                </pre>
                                                            ) : item.messageTypeId === '3' ? (
                                                                <div
                                                                    className="talk-view-content-field-area-file"
                                                                    onClick={() => (!item.size ? exportDown(item.content) : () => {})}
                                                                    title={item.content}
                                                                >
                                                                    <div className="talk-view-content-field-area-file-content">
                                                                        <div className="talk-view-content-field-area-file-content-status">
                                                                            <div className="talk-view-content-field-area-file-content-status-name">
                                                                                {item.content}
                                                                            </div>
                                                                            {item.size ? (
                                                                                <div className="talk-view-content-field-area-file-content-status-size">
                                                                                    上传中
                                                                                </div>
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                        </div>

                                                                        <div className="talk-view-content-field-area-file-content-img">
                                                                            <Icon type="FileOutlined" antdIcon />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Image src={item.content} />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        <div style={{ height: 1 }} ref={contentRef} />
                                    </div>
                                </Col>
                                <Col span={24} style={{ height: '30%' }}>
                                    <Editor
                                        sheetSend={sheetSend}
                                        uploadFileChange={uploadFileChange}
                                        onSaveChange={sendEndter}
                                        saveActiveImageChange={saveActiveImageChange}
                                    />
                                    {/* <TextArea
                                        onChange={inputChange}
                                        autoSize
                                        value={inputClear}
                                        style={{ minHeight: '100%' }}
                                        onKeyDown={sendEndter}
                                    /> */}
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6} style={{ height: '100%' }}>
                            <div className="talk-view-page-add">
                                <span>群成员 {groupData.groupCount}</span>
                                <span onClick={personAdd}>
                                    {' '}
                                    <Icon antdIcon type="UserAddOutlined" />
                                </span>
                            </div>
                            <div className="talk-view-page-person">
                                {person &&
                                    person.map((item) => {
                                        return (
                                            <div key={item.userId} className="talk-view-page-person-field">
                                                <Icon antdIcon type="iconziyuan6" />
                                                <span>{item.userName}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title={'添加群成员'}
                    width={600}
                    wrapClassName={'talk-view-page-person-Modal'}
                    visible={addFlag}
                    closable={false}
                    footer={null}
                >
                    <div className="talk-view-person-page">
                        <div className="talk-view-person-page-user">
                            <div style={{ padding: '0 10px' }}>
                                <Input.Search value={searchValue} onChange={(value) => searchUserChange(value)} onSearch={searchUserSearch} />
                            </div>
                            <div className="talk-view-person-page-user-list" ref={userRef}>
                                {userData &&
                                    userData.map((item) => {
                                        return (
                                            <div key={item.userId} className="talk-view-person-page-user-list-field">
                                                <Checkbox
                                                    checked={activeList.find((items) => items.userId === item.userId) ? true : false}
                                                    disabled={person.find((items) => items.userId === item.userId) ? true : false}
                                                    onChange={(checkValue) => checkChange(item, checkValue)}
                                                >
                                                    {item.userName}
                                                </Checkbox>
                                                <span>{item.userMobile}</span>
                                            </div>
                                        );
                                    })}
                                <div style={{ width: '100%', height: 30, textAlign: 'center' }}>
                                    <Spin spinning={loading}></Spin>
                                </div>
                            </div>
                        </div>
                        <div className="talk-view-person-page-action">
                            <div>已选择{activeList.length || 0}个联系人</div>
                            <div className="talk-view-person-page-action-list">
                                {activeList &&
                                    activeList.map((item) => {
                                        return (
                                            <div key={item.userId} className="talk-view-person-page-user-list-field">
                                                <div>
                                                    <span>{item.userName}</span>
                                                </div>
                                                <div>
                                                    <span>{item.userMobile}</span>
                                                </div>
                                                <div onClick={() => delActiveChange(item.userId)}>
                                                    <Icon antdIcon type="CloseCircleFilled" />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="talk-view-person-page-action-button">
                                <Button type="primary" onClick={() => saveActiveChange()} style={{ marginRight: 5 }}>
                                    确定
                                </Button>
                                <Button onClick={() => cancelActiveChange()}>取消</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </Modal>
        </div>
    );
};
export default TalkView;
