import React, { useEffect, useState } from 'react';
import { Timeline, Card } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import request from '@Common/api';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { PaperClipOutlined } from '@ant-design/icons';
import { createFileFlow } from '@Common/utils/download';
import AutoScroll from '@Components/notice-auto-scroll';
import timeHeader from '../img/time-line-header.png';
import timeHeaderDarkBlue from '../img/time-line-header-darkblue.png';
import Management from './management.jsx';
import './index.less';

const Index = (props) => {
    const { theme, location, history, onModuleModify, isManagementButtonVisible } = props;
    const login = useLoginInfoModel();
    const userInfo = JSON.parse(login.userInfo);
    const { currentZone } = login;
    const { zoneId } = currentZone;
    // 公告数据
    const [noticeData, handleNoticeData] = useState([]);
    useEffect(() => {
        request(`homepage/announcement/v1/notice/toShow`, {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: {
                provinceId: !!(userInfo.isAdmin && login.userId === 0) ? null : zoneId,
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
        return createFileFlow(name, url);
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
        <div className="workbench-top-right-notice">
            <Card
                className="card-extra"
                title={
                    <span className="view-component-home-card">
                        <span>公告</span>
                        {isManagementButtonVisible && (
                            <Management
                                theme={theme}
                                location={location}
                                history={history}
                                onSave={onModuleModify}
                                isManagementButtonVisible={isManagementButtonVisible}
                            />
                        )}
                    </span>
                }
                bordered={false}
            >
                <AutoScroll>
                    <Timeline mode="left">
                        {noticeData.map((item: any) => {
                            return (
                                <Timeline.Item className="work-bench-timeline" style={{ width: '100%' }} key={item.key}>
                                    <img className="time-line-header" src={theme === 'light' ? timeHeader : timeHeaderDarkBlue} alt={item.title} />
                                    <div className="notice-timeline-time" style={{ width: '100%' }}>
                                        {item.time}
                                    </div>
                                    <div style={{ width: '100%', marginLeft: '10px', fontSize: '14px' }}>
                                        <b>{item.isGroup === 'true' ? `【集团】${item.title}` : item.title}</b>
                                    </div>
                                    <div
                                        style={{
                                            width: '90%',
                                            color: theme === 'light' ? '#666666' : '#8a8ea6',
                                            marginLeft: '10px',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {item.field}
                                    </div>
                                    <div style={{ width: '90%', marginLeft: '10px' }}>{renderFileList(item)}</div>
                                </Timeline.Item>
                            );
                        })}
                    </Timeline>
                </AutoScroll>
            </Card>
        </div>
    );
};

export default Index;
