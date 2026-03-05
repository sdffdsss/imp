import React, { useCallback } from 'react';
import { Checkbox } from 'oss-ui';
import NoticeTypeItem from './NoticeTypeItem';
import { noticeTypeOptions } from '../../../../../type';

export interface NoticeTypeDataSource {
    notificationType: [];
    notificationDetailList: any[];
}

type Props = {
    dataSource: NoticeTypeDataSource;
    onChange?: (value: any) => void;
    disabled?: boolean;
};
const NoticeTypeCheckbox: React.FC<Props> = (props) => {
    const { dataSource, onChange = () => {}, disabled } = props;
    const { notificationType, notificationDetailList } = dataSource;
    // const [notificationType, setNotificationType] = useState(propsNotificationType);

    const onCheckboxChange = useCallback(
        (checkedValue: any) => {
            // 为新选中的通知类型创建默认详情对象
            const existingDetailList = notificationDetailList || [];
            const updatedDetailList = checkedValue.map((type: string) => {
                const existing = existingDetailList.find((item: any) => item.notificationType === type);
                if (existing) {
                    return existing;
                }
                // 为新选中的类型创建默认详情对象
                return {
                    notificationType: type,
                    notificationPeriodSwitch: false,
                    notificationStartTime: '06:00:00',
                    notificationEndTime: '22:00:00'
                };
            });
            
            onChange({
                ...dataSource,
                notificationType: checkedValue,
                notificationDetailList: updatedDetailList,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataSource],
    );
    const onNoticeTypeItemChange = useCallback(
        (v: any) => {
            const currentData = (notificationDetailList || []).find((i: any) => i.notificationType === v.notificationType);
            let finalNotificationDetailList: any = [];
            if (currentData) {
                finalNotificationDetailList = (notificationDetailList || []).map((item: any) => {
                    if (item.notificationType === v.notificationType) {
                        return {
                            ...v,
                        };
                    }
                    return item;
                });
            } else {
                finalNotificationDetailList = notificationDetailList.concat(v);
            }
            onChange({
                ...dataSource,
                notificationDetailList: finalNotificationDetailList,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataSource],
    );

    // useEffect(() => {
    //     setNotificationType(propsNotificationType);
    // }, [propsNotificationType]);

    return (
        <div className="notice-type-checkbox-container">
            <Checkbox.Group value={notificationType} onChange={onCheckboxChange} disabled={disabled}>
                {noticeTypeOptions.map((item: any) => {
                    const itemValue = (notificationDetailList || []).find((i: any) => i.notificationType === item.value);
                    return (
                        <NoticeTypeItem
                            disabled={!notificationType.includes(item.value as never) || disabled}
                            key={item.value}
                            data={item}
                            dataSource={itemValue}
                            onChange={onNoticeTypeItemChange}
                        />
                    );
                })}
            </Checkbox.Group>
        </div>
    );
};
export default NoticeTypeCheckbox;
