import React, { useEffect, useState } from 'react';
import request from '@Common/api';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { PaperClipOutlined } from '@ant-design/icons';
import { Timeline } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import { createFileFlow } from '@Common/utils/download';
import AutoScroll from '../../../components/notice-auto-scroll';

const Index = (props) => {
    const { theme } = props;
    const login = useLoginInfoModel();
    const userInfo = JSON.parse(login.userInfo);
    const zoneId = login.systemInfo.currentZone?.zoneId;
    const zones = userInfo?.zones[0];
    const currentZoneId = zones?.zoneLevel === '3' ? zones?.parentZoneId : zones?.zoneId;
    // 公告数据
    const [noticeData, handleNoticeData] = useState([]);
    useEffect(() => {
        request(`homepage/announcement/v1/notice/toShow`, {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: {
                provinceId: !!(userInfo.isAdmin && login.userId === 0) ? null : zoneId ? zoneId : currentZoneId,
                status: '2',
            },
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                const data = res.data.map((item) => {
                    return {
                        ...item,
                        key: item.noticeId,
                        time: moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
                        title: item.noticeTitle,
                        field: item.noticeText,
                    };
                });
                if (_.isEqual(data, noticeData)) {
                    return;
                }
                handleNoticeData(data);
            }
        });
    }, []);
    const downLoad = (name, id) => {
        const url = `${useEnvironmentModel.data.environment.monitorSetUrl.direct}/homepage/announcement/v1/export?fileName=${name}&noticeId=${id}`;
        return fileSrc && createFileFlow(name, url);
        // const link = document.createElement('a');
        // link.href = `${useEnvironmentModel.data.environment.monitorSetUrl.direct}/homepage/announcement/v1/export?fileName=${name}&noticeId=${id}`; // window.URL.createObjectURL(result.fileurl);
        // link.click();
        // window.URL.revokeObjectURL(link.href);
    };
    const handleDownLoad = (name, id) => {
        downLoad(name, id);
    };
    const renderFileList = (item) => {
        if (item.fileList && Array.isArray(item.fileList)) {
            return item.fileList.map((itm) => (
                <div className="download" key={itm}>
                    <PaperClipOutlined />
                    <span
                        onClick={() => {
                            handleDownLoad(itm, item.noticeId);
                        }}
                    >
                        {itm}
                    </span>
                </div>
            ));
        }
    };
    return (
        <div
            className="notice"
            // style={{ background: theme === "light" ? "white" : "" }}
        >
            <div className="header">公告</div>
            <AutoScroll>
                <Timeline mode="left">
                    {noticeData.map((item) => {
                        return (
                            <Timeline.Item className="timeline" style={{ width: '100%' }} key={item.key}>
                                <div className="notice-timeline-time" style={{ width: '100%' }}>
                                    {item.time}
                                </div>
                                <div style={{ width: '100%' }}>
                                    <b>{item.isGroup === 'true' ? `【集团】${item.title}` : item.title}</b>
                                </div>
                                <div style={{ width: '90%' }}>{item.field}</div>
                                <div style={{ width: '90%' }}>{renderFileList(item)}</div>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </AutoScroll>
        </div>
    );
};

export default Index;
