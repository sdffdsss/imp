import React, { FC, useState, useRef } from 'react';
import { Modal, List, Badge } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { getfailueList, getUneradMessage } from './api';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { InfiniteScroll } from 'antd-mobile';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { customAlphabet } from 'nanoid';
import TalkView from '@Components/talk-view';
import { useHistory } from 'react-router-dom';
import constants from '@Src/common/constants';
import './style.less';
dayjs.extend(relativeTime);
const nanoid = customAlphabet('1234567890', 15);
const getTime = (time) => {
    // switch(time){
    //     case: dayjs(time).
    // }
    if (dayjs().diff(dayjs(time), 'days') > 7) {
        return dayjs(time).format('MM/DD');
    }
    return dayjs(time).fromNow();
};
interface TalkProps {
    visible: boolean;
    onVisible: (e) => void;
    workBench?: boolean;
    setShowType?: (e) => void;
    setSheetInfo?: (e) => void;
}
// instanceof failueType  {

// }
const TalkViewList: FC<TalkProps> = ({ visible, onVisible, workBench, setShowType, setSheetInfo }) => {
    const login = useLoginInfoModel();
    const [loading, setLoading] = useState(true);
    const [failueData, setFailueData] = useState<any[]>([]);
    const pagetions = useRef({ pageNum: 0, total: 0, totalPages: 1 });
    const [sheetNoMessage, setSheetNoMessage] = useState({});
    const failueCountMap: any = useRef([]);
    const TalkData: any = useRef({});
    const history = useHistory();
    const [visibles, setVisibles] = useState(false);
    const [currentKey, setCurrentKey] = useState<any>(null);
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
        console.log(resultNum);
    };
    const getFilueData = async (num) => {
        // console.log(num);
        if (pagetions.current.pageNum === num || pagetions.current.pageNum >= pagetions.current.totalPages) {
            return;
        }
        const res = await getfailueList(userId, num);

        if (res.data) {
            const list = num !== 1 ? [...failueData, ...res.data.info] : res.data.info;
            setFailueData(list);
            failueCountMap.current = list.map((item) => item.groupId);
            getMessageCount();
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
        console.log(res);
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
        console.log(105, field);
        TalkData.current = {
            userId: userId,
            sheetNo: field.groupId,
            sheetTitle: field.groupName,
            forwardTime: field.forwardTime,
        };
        if (setShowType) {
            setSheetInfo && setSheetInfo({ ...TalkData.current, chatFlag: true });
            setShowType('detail');
        } else {
            history.push({
                pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-details`,
                state: { sheetInfo: TalkData.current, chatFlag: true, workBench },
            });
        }

        // const jumpFaultDetails = (obj) => {

        // };
        // closeChanage(true);
    };

    return (
        <Modal
            title={'会话列表'}
            getContainer={false}
            footer={null}
            wrapClassName="talk-view-list-page"
            visible={visible}
            maskClosable={false}
            onCancel={() => onVisible(false)}
        >
            <div id={'scrollableDiv'} style={{ height: 500, overflowY: 'auto', padding: 5 }}>
                {/* <InfiniteScroll
                    dataLength={pagetions.current.total}
                    next={() => getFilueData(pagetions.current.pageNum + 1)}
                    hasMore={pagetions.current.pageNum < pagetions.current.totalPages}
                    loader={
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <Spin />
                        </div>
                    }
                    endMessage={<Divider plain>没有更多了</Divider>}
                    scrollableTarget="scrollableDiv"
                > */}
                <List
                    dataSource={failueData}
                    renderItem={(item, index) => (
                        <List.Item
                            key={`${item.groupId}-${index}`}
                            onClick={() => {
                                setCurrentKey(`${item.groupId}-${index}`);
                                listItemClick(item);
                            }}
                            className={currentKey === `${item.groupId}-${index}` ? 'selected-item' : ''}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Badge overflowCount={999} count={sheetNoMessage[item.groupId]}>
                                        <div className="talk-view-app-page-list-name">
                                            {item.groupId
                                                ? item.groupId
                                                      .substring(item.groupId.length - 4)
                                                      .split('')
                                                      .map((items) => {
                                                          return <div key={`${nanoid()}`}>{items}</div>;
                                                      })
                                                : item.groupId}
                                        </div>
                                    </Badge>
                                }
                                title={<div>{item.groupId}</div>}
                                description={
                                    item.fromName
                                        ? item.messageTypeId === '2'
                                            ? `${item.fromName}:【图片】`
                                            : `${item.fromName}: ${item.content}`
                                        : ''
                                }
                            />
                            <div>{item.createTime ? getTime(item.createTime) : ''}</div>
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
        </Modal>
    );
};
export default TalkViewList;
