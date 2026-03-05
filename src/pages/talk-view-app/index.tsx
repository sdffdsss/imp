import React, { useEffect, useState } from 'react';
import TalkViewApp from '@Components/talk-view-app';
// import useLoginInfoModel from '@Src/hox';
import urlSearch from '@Common/utils/urlSearch';
import { getParams } from '@Components/talk-view-app/api';
import { ErrorBlock, SpinLoading } from 'antd-mobile';
console.log(window.location);
const urlData = urlSearch(window.location.href);

interface dataType {
    userId?: string;
    sheetNo?: string;
    title?: string;
}
const TalkViewAppIndex = () => {
    const [data, setData] = useState<dataType>({});
    const [dataFlag, setDataFlag] = useState(false);
    // const login = useLoginInfoModel();
    // const { userInfo } = login;
    // const userInfos = (userInfo && JSON.parse(userInfo)) || {};
    const getParamsData = async () => {
        const res = await getParams(urlData.params);
        if (res.data) {
            let field = {
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
    return (
        <div style={{ height: '100%' }}>
            {dataFlag ? (
                data.userId ? (
                    <TalkViewApp
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
                        <ErrorBlock title={<div>无权限访问</div>} description={<div></div>} />
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
export default TalkViewAppIndex;
