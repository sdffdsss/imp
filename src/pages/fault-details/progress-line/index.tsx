import React, { useEffect, useState } from 'react';
import { Timeline, Icon } from 'oss-ui';
import { Api } from '../api';
// import GlobalMessage from "@Src/common/global-message";
import AutoScroll from '@Components/auto-scroll';
import moment from 'moment';
import './style.less';
interface ViewProps {
    sheetNo: any;
    begin?: boolean;
}
interface ProgressInfo {
    activityName: string;
    operateType: string;
    operateTime: string;
    operater: string;
    operateDetail: string;
}
const progressInfoDef: ProgressInfo[] = [
    // {
    //     activityName: '',
    //     operateType: '',
    //     operateTime: '',
    //     operater: '',
    //     operateDetail: '',
    // },
];
let timer: NodeJS.Timeout;
const ProgressLine = (props: ViewProps) => {
    const [progressInfo, setProgressInfo] = useState<ProgressInfo[]>(progressInfoDef);
    const [refreshTime, handleRefreshTime] = useState('');
    const enumerIcon = (name) => {
        let iconType = '';
        switch (name) {
            case '拟稿派单':
                iconType = 'iconnigaopaidan';
                break;
            case '派单':
                iconType = 'iconpaidan1';
                break;
            case '受理':
                iconType = 'iconshouli';
                break;
            case '阶段反馈':
                iconType = 'iconjieduanfankui';
                break;
            case '转派':
                iconType = 'iconzhuanpai';
                break;
            case '现场打点':
                iconType = 'iconxianchangdadian';
                break;
            case '处理完成':
                iconType = 'iconchuliwancheng';
                break;
            case '挂起审核':
                iconType = 'iconguaqishenhe1';
                break;
            case '申请挂起':
                iconType = 'iconshenqingguaqi';
                break;
            case '故障定性':
                iconType = 'iconguzhangdingxing';
                break;
            case '消障确认':
                iconType = 'iconxiaozhangqueren';
                break;
            case '定性审核':
                iconType = 'icondingxingshenhe';
                break;
            case '派单评价':
                iconType = 'iconpaidanpingjia';
                break;
            case '解挂':
                iconType = 'iconjiegua1';
                break;
            case '已阅':
                iconType = 'iconyiyue';
                break;
            case '归档':
                iconType = 'iconguidang';
                break;
            default:
                iconType = 'iconmoren';
                break;
        }
        return iconType;
    };
    const renderTimelineItem = () => {
        return progressInfo.map((item) => {
            return (
                <Timeline.Item key={item.operateTime} dot={<Icon type={enumerIcon(item.operateType)} />} color="red">
                    <div className="progress-line-page-line-card">
                        <div className="progress-line-page-line-card-type">
                            <span className="progress-line-page-line-card-type-title">{item.operateType}</span>
                            {/* <span className="progress-line-page-line-card-type-time">{item.operateTime}</span> */}
                        </div>
                        <div className="progress-line-page-line-card-des">{item.operateDetail}</div>
                        {/* <div className="progress-line-page-line-card-name">
                            <span className="progress-line-page-line-card-name-time">{item.operater}</span>
                        </div> */}
                    </div>
                </Timeline.Item>
            );
        });
    };
    const handleTimer = () => {
        if (props.sheetNo) {
            Api.getFailProgress(props.sheetNo).then((res) => {
                setProgressInfo(res.data || progressInfoDef);
            });
        }
        timer = setTimeout(() => {
            handleRefreshTime(moment().format('YYYY-MM-DD HH:mm:ss'));
            handleTimer();
        }, 300000);
    };
    // const watchTabActiveChange = () => {
    //     GlobalMessage.off("activeChanged", null, null);
    //     GlobalMessage.on("activeChanged", ({ isActive }) => {
    //       if (!isActive) {
    //         clearTimeout(timer);
    //       }
    //     },null);
    // };
    useEffect(() => {
        handleRefreshTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, []);
    useEffect(() => {
        // watchTabActiveChange()
        if (props.sheetNo) {
            handleTimer();
        }
        return () => {
            clearTimeout(timer);
        };
    }, [props.sheetNo]);
    return (
        <div className="progress-line-page oss-imp-alart-common-bg">
            <div className="progress-line-page-header">
                {/* <Icon type="iconjinzhan" /> */}
                <span className="title">故障进展</span>
                {refreshTime !== '' && <span className="refreshTime">{`${refreshTime}`}</span>}
            </div>
            <div className="progress-line-page-line">
                <AutoScroll id="progress-line-page-line" begin={props.begin}>
                    <Timeline>{renderTimelineItem()}</Timeline>
                </AutoScroll>
            </div>
        </div>
    );
};
export default ProgressLine;
