import React from 'react';
import { Checkbox, Switch, TimePicker } from 'oss-ui';
import moment from 'moment';

import './NoticeTypeItem.less';

type Props = {
    data: any;
    dataSource: any;
    onChange: (value: any) => void;
    disabled?: boolean;
};
const NoticeTypeItem: React.FC<Props> = (props) => {
    const { data = {}, dataSource, disabled, onChange } = props;
    const { notificationPeriodSwitch, notificationStartTime, notificationEndTime } = dataSource || {};
    const timePickerValue: any = [moment(notificationStartTime || '06:00:00', 'HH:mm:ss'), moment(notificationEndTime || '22:00:00', 'HH:mm:ss')];

    const onNotificationPeriodSwitchChange = (checked: boolean) => {
        onChange({
            ...dataSource,
            notificationType: data.value,
            notificationPeriodSwitch: checked,
            notificationStartTime: dataSource?.notificationStartTime || '06:00:00',
            notificationEndTime: dataSource?.notificationEndTime || '22:00:00',
        });
    };
    const onTimePickerChange = (time, timeString) => {
        console.log(time, timeString);

        onChange({
            ...dataSource,
            notificationType: data.value,
            notificationPeriodSwitch: dataSource?.notificationPeriodSwitch || false,
            notificationStartTime: timeString?.[0] || '06:00:00',
            notificationEndTime: timeString?.[1] || '22:00:00',
        });
    };

    return (
        <div className="notice-type-item-container">
            <div className="notice-type-item-checkbox">
                <Checkbox key={data.value} value={data.value}>
                    {data.label}
                </Checkbox>
            </div>

            <div className="notice-type-item-text">通知时段：</div>

            <div className="notice-type-item-switch">
                <Switch disabled={disabled} checked={notificationPeriodSwitch} onChange={onNotificationPeriodSwitchChange} />
            </div>

            <div className="notice-type-item-time-picker">
                <TimePicker.RangePicker
                    disabled={disabled || !notificationPeriodSwitch}
                    value={timePickerValue}
                    onChange={onTimePickerChange}
                    allowClear={false}
                    getPopupContainer={(triggerNode) => triggerNode.parentElement as any}
                />
            </div>
        </div>
    );
};
export default NoticeTypeItem;
