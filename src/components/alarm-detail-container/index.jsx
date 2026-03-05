import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Icon, Space } from 'oss-ui';
import AlarmDetails from './alarm-detail';
import request from '@Src/common/api';
import './index.less';

const AlarmDetailDrawer = (props) => {
    const { detailStatus, drawerData = {}, children, onAlarmDetailStatusChange } = props; // detailVisible,外部控制告警详情抽屉
    // status:open（打开）,close（关闭）,fold（收起不关闭）,unfold（展开，不是重新打开）,fixed（固定）,free（取消固定）
    const [showDetail, setShowDetail] = useState(null);

    const getAlarmDetail = (sessionId, selectRowKey) => {
        return request('flow/alarm-detail', {
            type: 'post',
            baseUrlType: 'viewItemUrl',
            data: {
                alarmIdList: [].concat(selectRowKey),
                sessionId
            },
            showSuccessMessage: false,
            showErrorMessage: false
        })
            .then((res) => {
                if (res) {
                    return res;
                }
                return [];
            })
            .catch(() => {
                return [];
            });
    };

    const onDetailShow = async ({ sessionId, selectRowKey }) => {
        let result = [];
        let targetAlarmDetail = {};
        if (props.getAlarmDetail) {
            result = await props.getAlarmDetail();
            targetAlarmDetail = result.find((item) => item.key === selectRowKey);
            setShowDetail(targetAlarmDetail || []);
        } else {
            result = await getAlarmDetail(sessionId, selectRowKey);
            targetAlarmDetail = result.find((item) => item.alarmId === selectRowKey);
            setShowDetail(targetAlarmDetail?.alarmFieldList || []);
        }
    };

    useEffect(() => {
        switch (detailStatus) {
            case 'close':
                setShowDetail(null);
                break;
            case 'fold':
                break;
            case 'unfold':
                onDetailShow(drawerData);
                break;
            case 'fixed':
                onDetailShow(drawerData);
                break;
            case 'free':
                onDetailShow(drawerData);
                break;
            default:
                onDetailShow(drawerData);
                break;
        }
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailStatus, drawerData]);

    const onDrawerClose = () => {
        onAlarmDetailStatusChange('close');
    };

    const onDrawerFold = () => {
        onAlarmDetailStatusChange('fold');
    };

    const onDrawerUnFold = () => {
        onAlarmDetailStatusChange('unfold');
    };

    const onDrawerFree = () => {
        onAlarmDetailStatusChange('free');
    };

    const onDrawerFixed = () => {
        onAlarmDetailStatusChange('fixed');
    };

    const drawerShow = useMemo(() => {
        return ['open', 'unfold', 'fixed', 'free'].includes(detailStatus);
    }, [detailStatus]);

    const drawerBarShow = useMemo(() => {
        return ['open', 'unfold', 'fold', 'free'].includes(detailStatus);
    }, [detailStatus]);

    return (
        <div className="alarm-detial-container">
            <div style={{ width: detailStatus === 'fixed' ? '80%' : '100%', height: 'inherit' }}>{children}</div>
            {drawerBarShow && (
                <div
                    className={detailStatus === 'fold' ? 'drawer-left-bar drawer-left-bar-fold' : 'drawer-left-bar drawer-left-bar-unfold'}
                    onClick={detailStatus === 'fold' ? onDrawerUnFold : onDrawerFold}
                >
                    <Icon className="drawer-left-bar-icon" antdIcon type={detailStatus === 'fold' ? 'CaretLeftOutlined' : 'CaretRightOutlined'} />
                </div>
            )}
            <Drawer
                className="open-drawer"
                title={
                    <div className="alarm-drawer-title">
                        <div>告警详情</div>
                        <Space>
                            {detailStatus === 'fixed' ? (
                                <Icon antdIcon type="PushpinTwoTone" onClick={onDrawerFree} />
                            ) : (
                                <Icon antdIcon type="PushpinOutlined" onClick={onDrawerFixed} />
                            )}
                            <Icon antdIcon type="CloseSquareOutlined" onClick={onDrawerClose} />
                        </Space>
                    </div>
                }
                placement="right"
                mask={false}
                maskClosable={false}
                closable={false}
                visible={drawerShow}
                width={'20%'}
                getContainer={false}
                style={{ position: 'absolute' }}
            >
                <AlarmDetails showDetail={showDetail}></AlarmDetails>
            </Drawer>
        </div>
    );
};
export default AlarmDetailDrawer;
