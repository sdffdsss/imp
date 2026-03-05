import React, { useEffect, useState } from 'react';
import { Timeline, Image } from 'oss-ui';
import { getViewData } from './api';
import './style.less';
import AutoScroll from '@Components/notice-auto-scroll';
import Blue from './blue.png';
import Yellow from './yellow.png';
import YellowDarkBlue from './yellow-darkBlue.png';
import BlueDarkBlue from './blue-darkBlue.png';
// import dayjs from 'dayjs';
import _sortBy from 'lodash/sortBy';
import { customAlphabet } from 'nanoid';
import useLoginInfoModel from '@Src/hox';

interface progressType {
    eventTime: string;
    clearTime: string | null;
    omcSplicingMessage: string;
    status: string;
    key: number;
}

const nanoid = customAlphabet('1234567890', 15);
const SheetProgressLine = (props) => {
    const login = useLoginInfoModel();
    const [progressInfo, setProgressInfo] = useState<progressType[]>([]);
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
                                !item.clearTime ? (props.theme === 'light' ? Yellow : YellowDarkBlue) : props.theme === 'light' ? Blue : BlueDarkBlue
                            }
                        />
                    }
                    key={item.key}
                >
                    <div className="alarm-progress-page-line-card">
                        {/* //todo:后期需替换 _.find(item.filterProperties,{key:'interrupt_time'}).value */}
                        <span className="alarm-progress-page-line-card-time">{item.eventTime}</span>
                        <span className="alarm-progress-page-line-card-title">{item.omcSplicingMessage}</span>
                        {/* //todo:后期需替换 _.find(item.filterProperties,{key:'recover_time'}).value */}
                        {item.clearTime && <span className="alarm-progress-page-line-card-end-time">{`${item.clearTime} 已恢复`}</span>}
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

    const getViewDataMap = async (regionId) => {
        const params = { regionId };
        const res = await getViewData(params);
        if (res.data) {
            setProgressInfo(
                res.data.map((item) => {
                    return {
                        ...item,
                        key: nanoid(),
                    };
                }),
            );
        }
        // console.log(res);
    };
    useEffect(() => {
        const provinceId = getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo);
        getViewDataMap(provinceId);
        // setProgressInfo([]);
        // if (props.sheetNo) {
        //     Api.getSheetDetail(props.sheetNo).then((res) => {
        //         setProgressInfo(res.data);
        //     });
        // }
    }, []);
    return (
        <div className="alarm-progress-page oss-imp-alart-common-bg">
            <div className="alarm-progress-page-line">
                <AutoScroll id="alarm-progresss-sheet">
                    <Timeline>{renderTimelineItem()}</Timeline>
                </AutoScroll>
            </div>
        </div>
    );
};
export default SheetProgressLine;
