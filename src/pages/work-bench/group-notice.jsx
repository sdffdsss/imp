import React, { useEffect, useState } from 'react';
import request from '@Common/api';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { PaperClipOutlined } from '@ant-design/icons';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import { createFileFlow } from '@Common/utils/download';
import AutoScroll from '../../components/notice-auto-scroll';
import constants from '@Src/common/constants';

const Index = (props) => {
    const { theme, location, history } = props;
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
        // const link = document.createElement('a');
        // link.href = `${useEnvironmentModel.data.environment.monitorSetUrl.direct}/homepage/announcement/v1/export?fileName=${name}&noticeId=${id}`; // window.URL.createObjectURL(result.fileurl);
        // link.click();
        // window.URL.revokeObjectURL(link.href);
        const url = `${useEnvironmentModel.data.environment.monitorSetUrl.direct}/homepage/announcement/v1/export?fileName=${name}&noticeId=${id}`; // window.URL.createObjectURL(result.fileurl);
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
    // const onSave = (type, value, params) => {
    //     const { onSave } = props;
    //     onSave && onSave(type, value, params);
    // };
    return (
        <div
            className="notice"
            style={{
                height: 'calc(100% - 5px)',
                width: 'calc(100% - 20px)',
                padding: 12,
            }}
            // style={{ background: theme === "light" ? "white" : "" }}
        >
            {/* <div
                style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#424242',
                }}
            >
                <span className="notice-title">公告</span>
                <Tools theme={theme} location={location} history={history} onSave={onSave} />
            </div> */}
            <AutoScroll>
                <div className="group-time-line" mode="left">
                    {noticeData.map((item) => {
                        return (
                            <div className="work-bench-timeline" style={{ width: '100%', display: 'flex' }} key={item.key}>
                                <div>
                                    <img className="time-line-header" src={constants.IMAGE_PATH + '/group-workbench/ring.png'} />
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div className="group-notice-content">
                                        <div>
                                            <b>{item.isGroup === 'true' ? `【集团】${item.title}` : item.title}</b>
                                        </div>
                                        <div className="notice-timeline-time">{item.time}</div>
                                    </div>

                                    <div
                                        className="notice-detail"
                                        style={{ width: '90%', color: theme === 'light' ? '#666666' : '#8a8ea6', marginLeft: '10px' }}
                                    >
                                        {item.field}
                                    </div>
                                    <div className="notice-detail" style={{ width: '90%', marginLeft: '10px' }}>
                                        {renderFileList(item)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AutoScroll>
        </div>
    );
};

export default Index;
