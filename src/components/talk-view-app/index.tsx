import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavBar, TextArea, SearchBar, InfiniteScroll, List, Checkbox, Button, Tabs, DotLoading, Grid, Image } from 'antd-mobile';
import {
    MoreOutline,
    AddCircleOutline,
    AddOutline,
    MinusOutline,
    BankcardOutline,
    PictureOutline,
    CameraOutline,
    DownOutline,
} from 'antd-mobile-icons';
import _reverse from 'lodash/reverse';
import _trim from 'lodash/trim';
import classnames from 'classnames';
import stompjs from 'stompjs';
import dayjs from 'dayjs';
import PinyinMatch from 'pinyin-match';
import { historyMessageAction, actionChatGroup, getUserList, actionAddUser, delUserChange, getUserDeatail, sheetNoSend } from './api';
// import constants from '@Common/constants';
import './style.less';
interface chatData {
    groupMsgNo: number;
    groupId: string;
    fromId: string;
    fromName: string;
    createTime: string;
    content: string;
    messageTypeId: string;
    messageType: string;
    messageUnera: boolean;
    messageUneraCount: number;
}
interface personChild {
    userId: string;
    userName: string;
}
interface groupDataType {
    groupName: string;
    groupCount: number;
}
interface userDataType {
    userId: string;
    userName: string;
    userMobile: string;
}
interface userDetailType {
    readCount: number;
    unreadCount: number;
    readInfo: userDataType[];
    unreadInfo: userDataType[];
}
let chataDataMap: chatData[] = [];
let userDataMap: userDataType[] = [];
let stompClient: any = null;
let historyPagetion = { pageNum: 0, totalPages: 0 };
let newCount: number = 0;
const filterAciton = (data, list, str) => {
    let flag = false;
    list.forEach((item) => {
        if (PinyinMatch.match(data[item], str)) {
            flag = true;
        }
    });
    return flag;
};
interface imageDataType {
    imageUrl: string;
    imageBase64: string;
}

const img = `data:image/png;base64,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`;
const imgData = [
    {
        imageUrl: '1',
        imageBase64: img,
    },
    {
        imageUrl: '2',
        imageBase64: img,
    },
    {
        imageUrl: '3',
        imageBase64: img,
    },
    {
        imageUrl: '4',
        imageBase64: img,
    },
    {
        imageUrl: '5',
        imageBase64: img,
    },
    {
        imageUrl: '6',
        imageBase64: img,
    },
];
const TalkViewApp = ({ userInfo }) => {
    const [person, setPerson] = useState<personChild[]>([]);
    const [inputClear, setInputClear] = useState<string | undefined>('');
    const [groupData, setGrounpData] = useState<groupDataType>({ groupName: '', groupCount: 0 });
    const [chatData, setChatData] = useState<chatData[]>([]);
    const [userData, setUserData] = useState<userDataType[]>([]);
    const [activeList, setActiveList] = useState<userDataType[]>([]);
    const [imageData] = useState(imgData);
    const [activeImgList, setActiveImgList] = useState<imageDataType[]>([]);
    const contentRef: any = useRef();
    const historyRef: any = useRef();
    const isBottom: any = useRef(true);
    const sendMessage: any = useRef(true);
    const personRef: any = useRef([]);
    const [hasMore, setHasMore] = useState(true);
    const searchName: any = useRef('');
    const [newMessageCount, setNewMessageCount] = useState(newCount);
    const [searchDel, setSearchDel] = useState('');
    const [pagetion, setPagetion] = useState({ page_num: 0, totalPages: 0 });
    const [userDetail, setUserDetail] = useState<userDetailType>({ readCount: 0, unreadCount: 0, readInfo: [], unreadInfo: [] });
    const [appType, setAppType] = useState(1);
    const [visible, setVisible] = useState(false);
    const sendMessagNo = (data) => {
        stompClient.send(`/massCallBackRequest/${userInfo.groupId}`, {}, JSON.stringify(data));
    };
    const stompTopic = useCallback(() => {
        //通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息（广播接收信息）
        stompClient.subscribe(`/mass/getResponse/${userInfo.groupId}`, (response) => {
            if (response.body) {
                const messageData = JSON.parse(response.body);
                if (messageData.fromId === userInfo.userId) {
                    console.log(personRef.current);
                    const flag = personRef.current.length - 1 > 0;
                    messageData.messageType = '1';
                    messageData.messageUnera = flag ? true : false;
                    messageData.messageUneraCount = flag ? personRef.current.length - 1 : 0;
                } else {
                    messageData.messageType = '2';
                    newCount++;
                }
                chataDataMap = chataDataMap.concat(messageData);
                setChatData(chataDataMap);
                console.log(messageData);
                // contentRef?.current?.scrollTop(contentRef?.current?.scrollHeight);
                if (isBottom.current) {
                    const data = {
                        id: chataDataMap[chataDataMap.length - 1].groupMsgNo,
                        fromId: userInfo.userId,
                    };
                    sendMessagNo(data);
                    sendMessage.current = false;
                    contentRef?.current?.scrollIntoView(false);
                } else {
                    setNewMessageCount(newCount);
                    sendMessage.current = true;
                }

                // console.log(historyRef?.current?.getBoundingClientRect().top());
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const historyMessageActionData = async (num): Promise<void> => {
        if (num === historyPagetion.pageNum) {
            return;
        }
        //历史消息接口
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
            if (num === 1) {
                const data = {
                    id: chataDataMap[chataDataMap.length - 1].groupMsgNo,
                    fromId: userInfo.userId,
                };

                sendMessagNo(data);
                sendMessage.current = false;
                contentRef?.current?.scrollIntoView(false);
            }
        }
    };
    const sendWebScoket = () => {
        const socket = 'ws://172.24.131.231:9011/chatUrlWs/chatroom';
        stompClient = stompjs.client(socket); //使用STMOP子协议的WebSocket客户端
        stompClient.connect(
            {},
            (frame) => {
                //连接WebSocket服务端
                historyMessageActionData(historyPagetion.pageNum + 1);
                console.log('Connected:' + frame);
                //广播接收信息
                stompTopic();
            },
            (errorCallBack) => {
                console.log(errorCallBack);
                sendWebScoket();
            },
        );
    };
    useEffect(() => {
        sendWebScoket();
        return () => {
            if (stompClient != null) {
                stompClient.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const actionChatGroupData = useCallback(async (): Promise<void> => {
        //获取群组信息接口
        const res = await actionChatGroup({ id: userInfo.groupId, groupName: userInfo.groupName, createUserId: userInfo.userId });
        if (res.data) {
            setGrounpData({ groupName: res.data.groupName, groupCount: res.data.members.length });
        }
        if (res?.data?.members) {
            personRef.current = res.data.members;
            setPerson(res.data.members);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo.groupId]);
    useEffect(() => {
        actionChatGroupData();
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
            newCount = 0;
            setNewMessageCount(0);
            sendMessage.current = false;
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
    const sheetRightClick = () => {
        setAppType(2);
    };
    const getUserListData = async (num, name?: boolean) => {
        const data = {
            zoneLevel: userInfo.zoneLevel,
            zoneId: userInfo.zoneId,
            flag: 2,
            pageNum: num,
            userNameOrMobile: searchName.current,
            pageSize: 30,
            // loginId:''
        };

        const res = await getUserList(data);
        if (res) {
            const { current, totalPages } = res;
            setPagetion({ page_num: current, totalPages });
            setHasMore(current < totalPages);
        }
        if (res.data?.info) {
            const list = res.data.info.map((item) => {
                return {
                    userId: item.userId,
                    userName: item.userName,
                    userMobile: item.userMobile,
                };
            });
            userDataMap = name ? list : userDataMap.concat(list);
            setUserData(userDataMap);
        }
    };
    const navBack = (value) => {
        setActiveList([]);
        searchName.current = '';
        setPagetion({ page_num: 0, totalPages: 0 });
        setAppType(value);
    };
    const addPerson = () => {
        setAppType(3);
        if (pagetion.page_num > 0) {
            return;
        }
        getUserListData(pagetion.page_num + 1);
    };
    const checkChange = (field, checked) => {
        let list: userDataType[] = [];
        if (checked) {
            list = [...activeList, field];
        } else {
            list = activeList.filter((item) => item.userId !== field.userId);
        }
        setActiveList(list);
    };
    const actionAddUserData = async (): Promise<void> => {
        const userIds = activeList.map((item) => item.userId);
        const res = await actionAddUser(userInfo.groupId, userIds);
        if (res.code !== 500) {
            setActiveList([]);
            navBack(2);
            actionChatGroupData();
        }
    };
    const saveActiveChange = () => {
        actionAddUserData();
    };
    const inputChange = (value) => {
        setInputClear(value);
    };
    const sendTopic = (data) => {
        contentRef?.current?.scrollIntoView(false);
        stompClient.send(`/massRequest/${userInfo.groupId}`, {}, JSON.stringify(data));
    };
    const sendTalk = () => {
        const formName = person.find((item) => item.userId === userInfo.userId)?.userName || '无名';
        const data = {
            groupId: userInfo.groupId,
            fromId: userInfo.userId,
            fromName: formName,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            content: inputClear,
            messageTypeId: '1',
        };
        sendTopic(data);
        setInputClear('');
    };
    const delActiveChange = async (ids?: string[]): Promise<void> => {
        const userIds = activeList.map((item) => item.userId);
        const res = await delUserChange(userInfo.groupId, ids || userIds);
        if (res.code !== 500) {
            setActiveList([]);
            navBack(2);
            actionChatGroupData();
        }
    };
    const messageUnera = async (id) => {
        setAppType(5);
        const res = await getUserDeatail(userInfo.groupId, userInfo.userId, id);
        if (res.data) {
            const list = chataDataMap.map((item) => {
                if (item.groupMsgNo === id) {
                    item.messageUneraCount = res.data.unreadCount;
                }
                return item;
            });
            setChatData(list);
            setUserDetail(res.data);
        }
    };
    const sheetSend = async () => {
        const res = await sheetNoSend(userInfo.groupId);
        if (res?.data.length === 0) {
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
    const searchUserChange = (value) => {
        searchName.current = value;
    };
    const searchUserSearch = () => {
        getUserListData(1, true);
        setHasMore(true);
        setUserData([]);
        userDataMap = [];
    };
    const delUserChanges = (value) => {
        setSearchDel(value);
    };
    const delUesrList = (data, search) => {
        console.log(search);
        const searchList = ['userName', 'userMobile'];
        const list = search ? data.filter((item) => filterAciton(item, searchList, search)) : data;
        console.log(list);
        return list;
    };
    const goBottom = () => {
        sendMessage.current = false;
        contentRef?.current?.scrollIntoView(false);
        newCount = 0;
        setNewMessageCount(0);
    };
    const imageChange = (field, checked) => {
        let list: any = [];
        if (checked) {
            list = activeImgList.concat(field);
        } else {
            list = activeImgList.filter((item) => item.imageUrl !== field.imageUrl);
        }
        setActiveImgList(list);
    };
    const saveActiveImageChange = () => {
        const formName = person.find((item) => item.userId === userInfo.userId)?.userName || '无名';
        const data = {
            groupId: userInfo.groupId,
            fromId: userInfo.userId,
            fromName: formName,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            content: '',
            messageTypeId: '2',
        };
        activeImgList.forEach((item) => {
            data.content = item.imageBase64;
            sendTopic(data);
        });
        setActiveImgList([]);
        navBack(1);
    };
    return (
        <div className="talk-view-app">
            {appType === 1 && (
                <div className="talk-view-app-page" onClick={() => setVisible(false)}>
                    <NavBar
                        back={null}
                        style={{
                            background: 'rgb(3,128,254)',
                            color: '#fff',
                        }}
                        right={<MoreOutline fontSize={18} onClick={() => sheetRightClick()} />}
                    >
                        {groupData.groupName}
                    </NavBar>

                    <div className="talk-view-content" ref={historyRef}>
                        {newMessageCount ? (
                            <div className="talk-view-content-unread" onClick={goBottom}>
                                <DownOutline />（{newMessageCount}） 新消息
                            </div>
                        ) : (
                            ''
                        )}

                        {chatData &&
                            chatData.map((item) => {
                                return (
                                    <div
                                        key={item.createTime}
                                        className={classnames('talk-view-content-field', item.messageType === '1' && 'my-talk')}
                                    >
                                        <div className="talk-view-content-field-name">
                                            {item.fromName ? item.fromName.substring(item.fromName.length - 2) : item.fromName}
                                        </div>
                                        <div className="talk-view-content-field-area">
                                            <div
                                                className="talk-view-content-field-area-content"
                                                style={{ padding: item.messageTypeId === '1' ? 10 : 0 }}
                                            >
                                                {item.messageTypeId === '1' ? item.content : <Image src={item.content} />}
                                            </div>
                                            {item.messageUnera && item.messageUneraCount && (
                                                <div className="talk-view-content-field-area-count" onClick={() => messageUnera(item.groupMsgNo)}>
                                                    {item.messageUneraCount}人未读
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        <div style={{ height: 0 }} ref={contentRef} />
                    </div>

                    <div className="talk-view-input">
                        <div className="talk-view-input-content">
                            <div className="talk-view-input-area">
                                <TextArea value={inputClear} onChange={inputChange} rows={1} autoSize={{ minRows: 1, maxRows: 5 }} />
                            </div>
                            {_trim(inputClear || '') ? (
                                <Button color="success" size="small" onClick={() => sendTalk()}>
                                    发送
                                </Button>
                            ) : (
                                <AddCircleOutline
                                    fontSize={18}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setVisible(true);
                                    }}
                                />
                            )}
                        </div>
                        {visible && (
                            <div className="talk-view-input-select">
                                <div className="talk-view-input-select-option">
                                    <PictureOutline fontSize={50} onClick={() => setAppType(6)} />
                                    <div>相册</div>
                                </div>
                                <div className="talk-view-input-select-option">
                                    <CameraOutline fontSize={50} />
                                    <div>拍摄</div>
                                </div>
                                <div className="talk-view-input-select-option">
                                    <BankcardOutline fontSize={50} onClick={() => sheetSend()} />
                                    <div>工单</div>
                                </div>
                            </div>
                        )}

                        {/* <ActionSheet visible={visible} actions={actions} onClose={() => setVisible(false)} /> */}
                    </div>
                </div>
            )}
            {appType === 2 && (
                <div className="talk-user-app-page">
                    <NavBar
                        onBack={() => navBack(1)}
                        style={{
                            background: 'rgb(3,128,254)',
                            color: '#fff',
                        }}
                    >
                        聊天信息（{groupData.groupCount}）
                    </NavBar>
                    <div className="talk-user-app-page-list">
                        {person &&
                            person.map((item) => {
                                return (
                                    <div className="talk-user-app-page-list-field" key={item.userId}>
                                        <div className="talk-user-app-page-list-field-name">
                                            {item.userName ? item.userName.substring(item.userName.length - 2) : item.userName}
                                        </div>
                                        <div className="talk-user-app-page-list-field-username">{item.userName}</div>
                                    </div>
                                );
                            })}
                        <div className="talk-user-app-page-list-field" key={'add'}>
                            <div className="talk-user-app-page-list-field-name">
                                <AddOutline onClick={() => addPerson()} />
                            </div>
                        </div>
                        <div className="talk-user-app-page-list-field" key={'delete'}>
                            <div className="talk-user-app-page-list-field-name">
                                <MinusOutline onClick={() => setAppType(4)} />
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '0 5px' }}>
                        <Button block color="danger" size="large" onClick={() => delActiveChange([userInfo.userId])}>
                            退出群聊
                        </Button>
                    </div>
                </div>
            )}
            {appType === 3 && (
                <div className="talk-user-app-list-page">
                    <NavBar
                        onBack={() => navBack(2)}
                        style={{
                            background: 'rgb(3,128,254)',
                            color: '#fff',
                        }}
                    >
                        选择联系人
                    </NavBar>
                    <div className="talk-user-app-list-page-search">
                        <div className="talk-user-app-list-page-search-input">
                            <SearchBar placeholder="搜索手机号/姓名" onChange={(value) => searchUserChange(value)} />
                        </div>
                        <div>
                            <Button size="small" color="primary" onClick={searchUserSearch}>
                                搜索
                            </Button>
                        </div>
                    </div>
                    {userData.length > 0 ? (
                        <div className="talk-user-app-list-page-list">
                            <List>
                                {userData &&
                                    userData.map((item) => {
                                        return (
                                            <List.Item key={item.userId} extra={item.userMobile}>
                                                <Checkbox
                                                    disabled={person.map((items) => items.userId).includes(item.userId)}
                                                    onChange={(checkValue) => checkChange(item, checkValue)}
                                                >
                                                    {item.userName}
                                                </Checkbox>
                                            </List.Item>
                                        );
                                    })}
                            </List>
                            <InfiniteScroll loadMore={() => getUserListData(pagetion.page_num + 1)} hasMore={hasMore} />
                        </div>
                    ) : (
                        <div className={'talk-view-placeholder'}>
                            <div className={'talk-view-loadingWrapper'}>
                                <DotLoading />
                            </div>
                            正在拼命加载数据
                        </div>
                    )}

                    {activeList.length ? (
                        <div className="talk-user-app-list-page-ok">
                            <Button color="primary" onClick={() => saveActiveChange()}>
                                确定({activeList.length})
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            )}
            {appType === 4 && (
                <div className="talk-user-app-list-page">
                    <NavBar
                        onBack={() => navBack(2)}
                        style={{
                            background: 'rgb(3,128,254)',
                            color: '#fff',
                        }}
                    >
                        移除联系人
                    </NavBar>
                    <div className="talk-user-app-list-page-search">
                        <div className="talk-user-app-list-page-search-input">
                            <SearchBar placeholder="搜索手机号/姓名" onChange={(value) => delUserChanges(value)} />
                        </div>
                    </div>
                    <div className="talk-user-app-list-page-list">
                        <List>
                            {person &&
                                delUesrList(person, searchDel).map((item) => {
                                    return (
                                        <List.Item key={item.userId}>
                                            <Checkbox
                                                disabled={userInfo.userId === item.userId}
                                                onChange={(checkValue) => checkChange(item, checkValue)}
                                            >
                                                {item.userName}
                                            </Checkbox>
                                        </List.Item>
                                    );
                                })}
                        </List>
                    </div>
                    {activeList.length ? (
                        <div className="talk-user-app-list-page-ok">
                            <Button color="primary" onClick={() => delActiveChange()}>
                                确定({activeList.length})
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            )}
            {appType === 5 && (
                <div className="talk-user-app-user-page">
                    <NavBar
                        onBack={() => navBack(1)}
                        style={{
                            background: 'rgb(3,128,254)',
                            color: '#fff',
                        }}
                    >
                        消息接收人列表
                    </NavBar>
                    <Tabs>
                        <Tabs.Tab title={`未读（${userDetail.unreadCount}）`} key="fruits">
                            <List>
                                {userDetail.unreadInfo &&
                                    userDetail.unreadInfo.map((item) => {
                                        return (
                                            <List.Item key={item.userId} extra={item.userMobile}>
                                                {item.userName}
                                            </List.Item>
                                        );
                                    })}
                            </List>
                        </Tabs.Tab>
                        <Tabs.Tab title={`已读（${userDetail.readCount}）`} key="vegetables">
                            <List>
                                {userDetail.readInfo &&
                                    userDetail.readInfo.map((item) => {
                                        return (
                                            <List.Item key={item.userId} extra={item.userMobile}>
                                                {item.userName}
                                            </List.Item>
                                        );
                                    })}
                            </List>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            )}
            {appType === 6 && (
                <div className="talk-user-app-list-page">
                    <NavBar
                        onBack={() => navBack(1)}
                        style={{
                            background: 'rgb(3,128,254)',
                            color: '#fff',
                        }}
                    >
                        图片列表
                    </NavBar>
                    <div className="talk-user-app-page-imageList">
                        <Grid columns={4} gap={3}>
                            {imageData &&
                                imageData.map((item) => (
                                    <Grid.Item key={item.imageUrl}>
                                        <div className="talk-user-app-page-image">
                                            <div className="talk-user-app-page-image-check">
                                                <Checkbox onChange={(checked) => imageChange(item, checked)} />
                                            </div>
                                            <Image width={'100%'} height={100} src={item.imageBase64} />
                                        </div>
                                    </Grid.Item>
                                ))}
                        </Grid>
                    </div>
                    {activeImgList.length ? (
                        <div className="talk-user-app-list-page-ok">
                            <Button color="primary" onClick={() => saveActiveImageChange()}>
                                确定({activeImgList.length})
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            )}
        </div>
    );
};
export default TalkViewApp;
