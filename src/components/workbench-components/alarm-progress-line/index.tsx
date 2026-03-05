import React, { useEffect, useState } from 'react';
import { Timeline, Image } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import Blue from './blue.png';
import Yellow from './yellow.png';
import Person from './person.png';
import YellowDarkBlue from './yellow-darkBlue.png';
import BlueDarkBlue from './blue-darkBlue.png';
import './style.less';
import { getViewData } from './api';
import AutoScroll from '@Components/notice-auto-scroll';
// import dayjs from 'dayjs';
import _sortBy from 'lodash/sortBy';
// import urlSearch from '@Common/utils/urlSearch';
const ProgressLine = (props) => {
    const login = useLoginInfoModel();
    const [progressInfo, setProgressInfo] = useState<any[]>([]);
    // const urlData = urlSearch(window.location.href);
    // console.log(props);
    // urlData.provinceId = '-662225376';

    const renderTimelineItem = () => {
        return progressInfo.map((item) => {
            return (
                <Timeline.Item
                    dot={
                        <Image
                            width={15}
                            height={15}
                            preview={false}
                            style={{ marginTop: '-2.5px', marginLeft: '-3px' }}
                            src={
                                item.interruptTime || item.recoverTime
                                    ? `${item.creator}` === login.userId
                                        ? Person
                                        : item.businessStatus !== 1
                                        ? props.theme === 'light'
                                            ? Yellow
                                            : YellowDarkBlue
                                        : props.theme === 'light'
                                        ? Blue
                                        : BlueDarkBlue
                                    : ''
                            }
                        />
                    }
                    key={item.monitorId}
                >
                    <div className="alarm-progress-page-line-card">
                        {/* //todo:后期需替换 _.find(item.filterProperties,{key:'interrupt_time'}).value */}
                        {item.interruptTime && (
                            <>
                                <span className="alarm-progress-page-line-card-time">
                                    {/* {item.filterProperties.find((items) => items.key === 'interrupt_time')?.value} */}
                                    {item.interruptTime}
                                </span>
                                <span className="alarm-progress-page-line-card-title">{item.monitorName}</span>
                            </>
                        )}
                        {/* //todo:后期需替换 _.find(item.filterProperties,{key:'recover_time'}).value */}
                        {item.businessStatus === 1 && item.recoverTime && (
                            // <span className="alarm-progress-page-line-card-end-time">{`${
                            //     item.filterProperties.find((items) => items.key === 'recover_time')?.value
                            // } 已恢复`}</span>
                            <span className="alarm-progress-page-line-card-end-time">{`${item.recoverTime} 已恢复`}</span>
                        )}
                    </div>
                </Timeline.Item>
            );
        });
    };
    const getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const provinceId = getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
        // const arr = [{ key: 'province_id', value: [provinceId] }];
        // const queryProperties = JSON.stringify(arr);
        const data = {
            current: 1,
            pageSize: 999,
            // modelId: 2,
            // moduleId: 999,
            // queryProperties,
            // creator: login.userId,
            // orderFieldName: 'businessStatus',
            // order: 2,
            userId: login.userId,
            provinceId: Number(provinceId),
        };
        getViewData(data).then((res) => {
            // console.log(res.data);

            // if (res && Array.isArray(res.data)) {
            //     const list = res.data.filter(
            //         (item) =>
            //             !item.filterProperties.find((items) => items.key === 'recover_time')?.value ||
            //             (item.filterProperties.find((items) => items.key === 'recover_time')?.value &&
            //                 dayjs().diff(item.filterProperties.find((items) => items.key === 'recover_time')?.value, 'hour') <= 2),
            //     );
            //     const data = _sortBy(list, (item) => {
            //         return -dayjs(item.filterProperties.find((items) => items.key === 'interrupt_time')?.value).unix();
            //     });
            //     setProgressInfo(data);
            // }
            setProgressInfo(res.data);
        });
        // if (urlData.provinceId) {
        //     getViewNewData({ province_id: urlData.provinceId }).then((res) => {
        //         if (res?.alarmList) {
        //             setProgressInfo(
        //                 res.alarmList.map((item) => {
        //                     return {
        //                         ...item,
        //                         monitorName: item.description,
        //                         interruptTime: item.eventTime,
        //                         recoverTime: item.clearTime,
        //                         businessStatus: Number(item.status) ? 0 : 1,
        //                     };
        //                 }),
        //             );
        //         }
        //     }); // 216 专项
        // } else {

        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="alarm-progress-page oss-imp-alart-common-bg">
            {/* <div className="alarm-progress-page-header">
                <span className="alarm-progress-page-header-title">告警流水监测</span>
                <Button className="alarm-progress-page-header-;" type="text">
                    {'more >'}
                </Button>
            </div> */}

            <div className="alarm-progress-page-line">
                <AutoScroll id="alarm-progresss-line">
                    <Timeline>{renderTimelineItem()}</Timeline>
                </AutoScroll>
            </div>
        </div>
    );
};
export default ProgressLine;
