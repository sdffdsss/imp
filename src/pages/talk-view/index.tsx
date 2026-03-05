import React, { useState, useEffect } from 'react';
import TalkView from '@Components/talk-view';
// import useLoginInfoModel from '@Src/hox';
import urlSearch from '@Common/utils/urlSearch';
import { getParams } from '@Components/talk-view/api';
import { Result, Spin } from 'oss-ui';
const urlData = urlSearch(window.location.href);
interface dataType {
    userId?: string;
    sheetNo?: string;
    title?: string;
}
const TalkViewIndex = () => {
    // const login = useLoginInfoModel();
    // const { userInfo } = login;
    // const userInfos = (userInfo && JSON.parse(userInfo)) || {};
    const [data, setData] = useState<dataType>({});
    const [dataFlag, setDataFlag] = useState(false);
    // const login = useLoginInfoModel();
    // const { userInfo } = login;
    // const userInfos = (userInfo && JSON.parse(userInfo)) || {};
    const getParamsData = async () => {
        const res = await getParams(urlData.params);
        if (res.data) {
            const field = {
                userId: res.data.createUserId,
                sheetNo: res.data.id,
                title: res.data.groupName,
            };
            setData(field);
            setDataFlag(true);
        } else {
            if (res.code === 1001) {
                setData({});
                setDataFlag(true);
            }
        }

        // console.log(res);
    };
    useEffect(() => {
        if (urlData.params) {
            getParamsData();
        }
    }, []);
    const closeChange = () => {
        window.parent?.postMessage({ talkView: JSON.stringify({ visible: false }) }, '*');
        // window.addEventListener(
        //     'message',
        //     (e) => {
        //         console.log(e.data);
        //         // if (!e.data.talkView) return;
        //         // 发送消息给iframe
        //         window.parent.postMessage({ talkView: JSON.stringify({ visible: false }) }, '*');
        //     },
        //     false
        // );
    };
    return (
        <div>
            {dataFlag ? (
                data.userId ? (
                    <TalkView
                        visible={true}
                        closeChanage={closeChange}
                        viewType={true}
                        userInfo={{
                            userId: data.userId || '1669436',
                            groupId: (data.sheetNo && decodeURI(data.sheetNo)) || 'JS网调【2022】网络故障0422-70238',
                            groupName:
                                (data.title && decodeURI(data.title)) ||
                                '柜号=0, 框号=91, 槽号=0, 新城金郡11栋L900发生射频单元CPRI接口异常告警(三级告警)',
                            zoneId: '0',
                            // zoneName: userInfos?.zones[0]?.zoneName,
                            zoneLevel: '1',
                        }}
                    />
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Result title={<div>无权限访问</div>} status={'error'} />
                    </div>
                )
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin />
                </div>
            )}
        </div>
    );
};
export default TalkViewIndex;
