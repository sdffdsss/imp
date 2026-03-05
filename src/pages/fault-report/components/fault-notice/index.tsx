import React from 'react';
import { Row, Col, Checkbox } from 'oss-ui';
import NoticeTable from './NoticeTable';
import NoticeTypeCheckbox from '../../fault-report-add/fault-report-form/first-report-form/report-notice/components/NoticeTypeCheckbox';
import LayoutItem from '../layout-item';
import FileDown from '../file-down';

import './index.less';

interface Props {
    data: {
        notificationType?: string;
        notificationUserInfos?: {
            userMobile?: string;
        }[];
        notificationContent?: string;
        notificationTel?: string;
        notificationDetailList?: [];
        whetherNotifyGNOC?: boolean;
    };
    fileData: { contentFiles: Array<any> };
}

const FaultNotice: React.FC<Props> = (props) => {
    const { data = {}, fileData = {} } = props;
    const { notificationUserInfos, notificationContent, notificationType, notificationTel, notificationDetailList, whetherNotifyGNOC } = data || {};
    // const { contentFiles } = fileData;
    const defaultCheckBox = notificationType?.split(',');

    const noticeTypeValue = {
        notificationType: defaultCheckBox || [],
        notificationDetailList: notificationDetailList || [],
    };
    const phoneList = notificationTel?.split(',');

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <LayoutItem name="通知内容" value={notificationContent} />
            </Col>
            <Col span={24}>
                <LayoutItem name="通知类型">
                    <NoticeTypeCheckbox dataSource={noticeTypeValue as any} disabled />
                </LayoutItem>
            </Col>
            <Col span={24}>
                <LayoutItem name="通知对象">
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            <Checkbox checked={whetherNotifyGNOC} disabled>
                                通知GNOC值班室
                            </Checkbox>
                        </div>
                        <NoticeTable dataSource={notificationUserInfos} phoneList={phoneList} />
                    </div>
                </LayoutItem>
            </Col>
        </Row>
    );
};

export default FaultNotice;
