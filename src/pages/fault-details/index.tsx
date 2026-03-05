// import React,{useEffect,useState}from 'react';
import React, { useEffect, useState } from 'react';
import constants from '@Src/common/constants';
import './style.less';
import SheetField from './sheet-field';
// import ProgressLine from './progress-line';
import { Button, Space } from 'oss-ui';
import ChatView from './chat-view';
import InfoBack from './info-back';
import MapPoint from '../map-point';
import FullIcon from './info-back/img/u3745.svg';
import exportIcon from './info-back/img/u4127.svg';
import FailProgressTimeline from '@Components/fail-progress-timeline';
import { parseDataSource } from './utils';
import { Api } from './api';
import { NoticeListItemType } from '@Components/fail-progress-timeline/type';
import { useHistory } from 'react-router-dom';

const FaultDetails = (props) => {
    // const login = useRef;
    const [sheetNo, setSheetNo] = useState('');
    const [sheetInfo, setSheetInfo] = useState({});
    const [chatVisible, setChageVisbile] = useState(false);
    const history = useHistory();
    const [modalVisible, setModalVisible] = useState(false);
    const [showFull, setShowFull] = useState<boolean>(false);
    // 调度通知列表
    const [noticeList, setNoticeList] = useState([]);
    const [noticeDetail, setNoticeDetail] = useState([]);
    let [progressList, setProgressList] = useState([]);
    // const [begin, setBegin] = useState(false);
    useEffect(() => {
        console.log(sheetNo);
        const sheet = props.sheetInfo || props?.location?.state?.sheetInfo;
        const sheetTest = {
            // sheetNo: 'JS网调【2022】网络故障0509-025236',
            sheetNo: 'JS网调【2022】网络故障0505-81762',
            sheetTitle: '无锡市无锡_无锡山明四村楼顶(B类)等[衍生关联]1个楼宇发生中断(W)',
            forwardTime: '2021-08-13 21:28:35',
            describe: '网元名称：WX_BH_ER_WMTiYuZhongXin3_W网元类型：RNC告警对象名称：无锡_无锡山明四村楼顶(B类)等告警对象类型',
        };
        setSheetNo(sheet?.sheetNo || sheetTest.sheetNo);
        setSheetInfo(sheet || sheetTest);
        setChageVisbile(props.sheetInfo?.chatFlag || props?.location?.state?.chatFlag);
        setTimeout(() => {
            setModalVisible(false);
        }, 0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.location?.state, props.sheetInfo]);

    const back = () => {
        if (props?.location?.state?.workBench) {
            history.push({ pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/work-bench` });
        } else {
            props.setShowType && props.setShowType('home');
            // history.push({ pathname: '/home/troubleshooting-workbench' });
        }
    };

    useEffect(() => {
        const sheet = props.sheetInfo || props?.location?.state?.sheetInfo;
        const data = {
            sheetNo: sheet?.sheetNo,
            forwardTime: sheet?.forwardTime,
        };
        Api.getFailProgress(data).then((res) => {
            setProgressList(res.data || []);
        });
        Api.getNoticeList(data).then((res) => {
            setNoticeList(res.data || []);
        });
    }, [props?.location?.state, props.sheetInfo]);

    // 获取通知详情
    const onNoticeChange = (item: NoticeListItemType) => {
        const sheet = props.sheetInfo || props?.location?.state?.sheetInfo;
        const data = {
            sheetNo: sheet?.sheetNo,
            noticeId: item.noticeId,
            noticeType: item.noticeType,
            msgId: item.msgId,
        };
        Api.getNoticeDetail(data).then((res) => {
            setNoticeDetail(res.data || []);
        });
    };

    const finalData = parseDataSource(progressList, noticeList);

    return (
        <div className="fault-details-page">
            <div className="fault-details-page-drawer">
                <FailProgressTimeline finalData={finalData} onNoticeChange={onNoticeChange} noticeDetail={noticeDetail} />
            </div>
            <div className="fault-details-page-info">
                <div
                    className="fault-details-page-info-sheet oss-imp-alart-common-bg"
                    // onMouseEnter={() => {
                    //     setModalVisible(true);
                    // }}
                    // onMouseLeave={() => {
                    //     setModalVisible(false);
                    // }}
                >
                    <SheetField
                        sheetNo={sheetNo}
                        closeModal={() => {
                            setModalVisible(false);
                        }}
                    />
                </div>
                {/* <div
                    className="fault-details-page-info-progress oss-imp-alart-common-bg"
                    onMouseEnter={() => {
                        setModalVisible(true);
                        setBegin(true);
                    }}
                    onMouseLeave={() => {
                        setModalVisible(false);
                        setBegin(false);
                    }}
                >
                    <ProgressLine sheetNo={sheetNo} begin={begin} />
                </div> */}
            </div>
            <div className={`fault-details-page-content ${showFull ? 'full-map' : ''}`}>
                <div className="fault-details-page-content-time">
                    <Space>
                        {/* <div
                            className="control-button"
                            onClick={() => {
                                setShowFull(!showFull);
                            }}
                        >
                            <Space>
                                <img src={!showFull ? FullIcon : exportIcon} alt="" />
                                <span>{showFull ? '还原' : '全屏'}</span>
                            </Space>
                        </div>
                        */}
                        <Button onClick={() => back()} type="primary">
                            返回首页
                        </Button>
                    </Space>
                </div>

                <div className={`fault-details-page-content-map oss-imp-alart-common-bg `}>
                    <MapPoint sheetInfo={sheetInfo} />
                </div>
            </div>
            <div className="fault-details-page-msg">
                <div className="fault-details-page-msg-chat">
                    <ChatView
                        onMouseEnter={() => {
                            setModalVisible(true);
                        }}
                        onMouseLeave={() => {
                            setModalVisible(false);
                        }}
                        chatVisible={chatVisible}
                        sheetInfo={sheetInfo}
                    />
                </div>
                <div className="fault-details-page-msg-notice ">
                    <InfoBack sheetNo={sheetNo} />
                </div>
            </div>
            {modalVisible ? (
                <div
                    className="modal-mask-view"
                    style={{
                        width: window.innerWidth,
                        height: window.innerHeight,
                    }}
                ></div>
            ) : null}
        </div>
    );
};
export default FaultDetails;
