import React, { useState, useRef } from 'react';
import { List, Badge, Progress, Divider } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { getfailueList, getUneradMessage } from './api';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { InfiniteScroll } from 'antd-mobile';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import { customAlphabet } from 'nanoid';
import TalkView from '@Components/talk-view';
import { useHistory } from 'react-router-dom';
import constants from '@Src/common/constants';
import UserLogo from '../userLogo.svg';
import './style.less';
dayjs.extend(relativeTime);
// const nanoid = customAlphabet('1234567890', 15);
const getTime = (time) => {
    if (!time) {
        return '';
    }
    if (dayjs().diff(dayjs(time), 'days') > 7) {
        return dayjs(time).format('MM/DD');
    }
    return dayjs(time).fromNow();
};
interface failueAllType {
    readCount?: number;
    totalCount?: number;
    unreadCount?: number;
}
const TalkViewList = () => {
    const login = useLoginInfoModel();
    const [loading, setLoading] = useState(true);
    const [failueData, setFailueData] = useState<any[]>([]);
    const [allData, setAllData] = useState<failueAllType>({});
    const pagetions = useRef({ pageNum: 0, total: 0, totalPages: 1 });
    const [sheetNoMessage, setSheetNoMessage] = useState({});
    const failueCountMap: any = useRef([]);
    const TalkData: any = useRef({});
    const history = useHistory();
    const [visibles, setVisibles] = useState(false);
    const { userId, systemInfo, userInfo, userName } = login;
    const userInfoParse = (userInfo && JSON.parse(userInfo)) || {};
    const userInfos = systemInfo?.currentZones?.zoneId
        ? systemInfo.currentZones
        : { zoneId: userInfoParse?.zones[0]?.zoneId, zoneName: userInfoParse?.zones[0]?.zoneName, zoneLevel: userInfoParse?.zones[0]?.zoneLevel };
    /**
     * 获取未读消息集合
     */
    const getMessageCount = async () => {
        const numData = {
            appKey: 'BOCO',
            params: JSON.stringify({
                groupIds: failueCountMap.current,
                userId: userInfoParse.loginId,
                timeStamp: dayjs().format('YYYYMMDDHHmmss'),
            }),
        };
        const resultNum = await getUneradMessage(numData);
        if (resultNum.data) {
            setSheetNoMessage(resultNum.data);
        }
    };
    const getFilueData = async (num) => {
        if (pagetions.current.pageNum === num || pagetions.current.pageNum >= pagetions.current.totalPages) {
            return;
        }
        const res = await getfailueList(userId, num);

        if (res.data) {
            const list = num !== 1 ? [...failueData, ...res.data.info] : res.data.info;
            setFailueData(list);
            failueCountMap.current = list.map((item) => item.groupId);
            getMessageCount();
            setAllData({
                readCount: res.data.readCount,
                totalCount: res.data.totalCount,
                unreadCount: res.data.unreadCount,
            });
        } else {
            setLoading(false);
        }
        if (res) {
            const { current, total, totalPages } = res;
            pagetions.current = {
                pageNum: current,
                total,
                totalPages,
            };
            setLoading(current < totalPages);
        }
    };
    const closeChanage = (flag) => {
        if (!flag) {
            setLoading(true);
            setFailueData([]);
            pagetions.current = { pageNum: 0, total: 0, totalPages: 1 };
            getFilueData(1);
        }

        setVisibles(flag);
    };
    const listItemClick = (field) => {
        TalkData.current = {
            userId: userId,
            sheetNo: field.groupId,
            sheetTitle: field.groupName,
            forwardTime: field.forwardTime,
        };
        history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-details`,
            state: { sheetInfo: TalkData.current, chatFlag: true, workBench: true },
        });
        // const jumpFaultDetails = (obj) => {

        // };
        // closeChanage(true);
    };

    return (
        <div className="talk-view-list-page-manage">
            <div className="talk-view-list-page-manage-proess">
                <Progress
                    type="circle"
                    percent={75}
                    strokeWidth={9}
                    width={145}
                    strokeColor={'#3377FF'}
                    format={() => {
                        return (
                            <div className="talk-view-list-page-manage-proess-pie">
                                <div className="title ">所有群聊</div>
                                <div className="value">{allData.totalCount || 0}</div>
                            </div>
                        );
                    }}
                />
                <div className="talk-view-list-page-manage-proess-content">
                    <div>
                        <span>
                            未读群聊 <span>{allData.unreadCount}</span>
                        </span>
                    </div>
                    <div>
                        <span>
                            已读群聊 <span>{allData.readCount}</span>
                        </span>
                    </div>
                </div>
            </div>
            <Divider style={{ margin: '10px 0 0 0' }} />
            <div id={'scrollableDiv'} style={{ flex: 1, overflowY: 'auto', padding: 5 }}>
                <List
                    dataSource={failueData}
                    renderItem={(item) => (
                        <List.Item key={item.groupId} onClick={() => listItemClick(item)}>
                            <List.Item.Meta
                                avatar={
                                    <Badge count={sheetNoMessage[item.groupId]}>
                                        <div className="talk-view-app-page-list-name">
                                            <img height={40} width={40} style={{ marginTop: 3 }} src={UserLogo} alt="userLogo" />
                                        </div>
                                    </Badge>
                                }
                                title={<div className="talk-view-app-page-list-content">{item.groupId}</div>}
                                description={
                                    <div className="talk-view-app-page-list-description">
                                        {' '}
                                        {!item.fromName
                                            ? ''
                                            : item.messageTypeId === '2'
                                            ? `${item.fromName}:【图片】`
                                            : `${item.fromName}: ${item.content}`}
                                    </div>
                                }
                            />
                            <div className="talk-view-app-page-list-time">{item.createTime ? getTime(item.createTime) : ''}</div>
                        </List.Item>
                    )}
                />
                <InfiniteScroll threshold={20} loadMore={() => getFilueData(pagetions.current.pageNum + 1)} hasMore={loading} />
                {TalkData.current.groupId && visibles && (
                    <TalkView
                        visible={visibles}
                        closeChanage={closeChanage}
                        userInfo={{
                            userId: TalkData.current.userId,
                            groupId: TalkData.current.groupId,
                            groupName: TalkData.current.groupName,
                            userName: userName,
                            zoneId: userInfos?.zoneId,
                            zoneName: userInfos?.zoneName,
                            zoneLevel: userInfos?.zoneLevel,
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default TalkViewList;
