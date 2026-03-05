import React, { useEffect, useState } from 'react';
import urlSearch from '@Common/utils/urlSearch';
import { getParams } from './api';
import { ErrorBlock, SpinLoading } from 'antd-mobile';
import { Modal } from 'oss-ui';
import TalkViewListWeb from '@Components/talk-view-list-web';
const urlData = urlSearch(window.location.href);

let viewType = '2';
interface dataType {
    userId?: string;
    loginId?: string;
    zoneId?: string;
    zoneLevel?: string;
}
window.addEventListener(
    'message',
    (e) => {
        console.log(e.data);
        if (!e.data.talkViewList) return;
        const talkData = JSON.parse(e.data.talkViewList);
        viewType = talkData.viewType;
        // 发送消息给iframe
        // window.parent.postMessage({ talkView: JSON.stringify({ visible: false }) }, '*');
    },
    false,
);
const TalkViewList = () => {
    const [data, setData] = useState<dataType>({});
    const [dataFlag, setDataFlag] = useState(false);
    // const viewType: any = useRef('2');
    // const { userInfo } = login;
    // const userInfos = (userInfo && JSON.parse(userInfo)) || {};
    const getParamsData = async () => {
        const res = await getParams(urlData.params);
        if (res.data && res.data?.appToken) {
            const field = {
                userId: res.data.createUserId,
                loginId: res.data.loginId,
                zoneId: res.data.zoneId,
                zoneLevel: res.data.zoneLevel,
                // userName: res.dta.createUserName,
            };
            setData(field);
            setDataFlag(true);
        } else {
            if (res.code === 1001) {
                setData({});
                setDataFlag(true);
            }
            if (res.code === 401) {
                setData({});
                setDataFlag(true);
            }
        }
    };
    useEffect(() => {
        if (urlData.params) {
            getParamsData();
        } else {
            setData({});
            setDataFlag(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div style={{ height: '100%' }}>
            {dataFlag ? (
                data.userId ? (
                    viewType === '1' ? (
                        <Modal
                            title={'会话列表'}
                            footer={null}
                            wrapClassName="talk-view-list-page"
                            visible={true}
                            onCancel={() => {
                                window.parent.postMessage({ talkViewList: JSON.stringify({ visible: false }) }, '*');
                            }}
                        >
                            <TalkViewListWeb
                                userInfo={{
                                    userId: data.userId || '1669436',
                                    loginId: data.loginId,
                                    zoneId: data.zoneId,
                                    // zoneName: userInfos?.zones[0]?.zoneName,
                                    zoneLevel: data.zoneLevel,
                                }}
                                height={500}
                            />
                        </Modal>
                    ) : (
                        viewType === '2' && (
                            <div className="talk-view-list-page">
                                <TalkViewListWeb
                                    userInfo={{
                                        userId: data.userId || '1669436',
                                        loginId: data.loginId,
                                        zoneId: data.zoneId,
                                        // zoneName: userInfos?.zones[0]?.zoneName,
                                        zoneLevel: data.zoneLevel,
                                    }}
                                    height={'100%'}
                                />
                            </div>
                        )
                    )
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ErrorBlock title={<div>无权限访问</div>} description={<div />} />
                    </div>
                )
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SpinLoading />
                </div>
            )}
        </div>
    );
};
export default TalkViewList;
