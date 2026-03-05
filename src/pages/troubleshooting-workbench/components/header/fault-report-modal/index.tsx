import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'oss-ui';
import FaultReportModalAdd from './components/fault-report-modal-add';

import './index.less';

type FaultReportModalAddProps = {
    flagId?: string;
    dataSource?: any;
    onCancel?: any;
    faultReportStatus?: string;
    source?: number;
    isView?: boolean;
    isWireless?: boolean;
    standardAlarmId?: string;
    goToListPage?: any;
    theme?: string; // 主题 ''| white
    title?: string; // 弹窗标题
    isMajor?: boolean; // 是否重大故障上报
    btnKey?: string; // 弹窗确认按钮key
    isFaultReportNew?: boolean; // 是否新的故障上报
    isManual?: boolean; // 是否手动上报
};

const FaultReportModal = (props) => {
    const [iframeData, setIframeData] = useState<FaultReportModalAddProps>({
        isView: false,
        dataSource: null,
        onCancel: undefined,
        goToListPage: undefined,
        theme: '',
        isWireless: false,
    });
    const timerRef: any = useRef();
    const {
        visible,
        onCancel = () => {},
        dataSource,
        isView,
        goToListPage,
        setFaultReportDataSource,
        setIsView,
        isWireless,
        updateCardList,
        title, // 弹窗标题
        isMajor = false,
        btnKey, // 弹窗确认按钮key
        isFaultReportNew, // 是否新的故障上报
        isManual, // 是否手动上报
    } = iframeData?.dataSource ? iframeData : props;

    const { latestReportStatus, flagId, source, standardAlarmId } = dataSource || {};

    const iframeListener = (e) => {
        window?.parent?.postMessage({ accept: true }, '*');
        if (e.data?.dataSource) {
            setIframeData({
                isView: e.data?.isView,
                dataSource: e.data?.dataSource,
                theme: e.data?.theme,
                isWireless: e.data?.isWireless,
                onCancel: () => {
                    return window?.parent?.postMessage({ cancel: true }, '*');
                },
                goToListPage: () => {
                    return window?.parent?.postMessage({ cancel: true }, '*');
                },
            });
        }
    };

    useEffect(() => {
        window.addEventListener('message', iframeListener, false);
        return () => {
            window.removeEventListener('message', iframeListener);
        };
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            const overViewContainer: any = document.querySelector("div[data-name='oss-imp-unicom']");
            if (overViewContainer) {
                overViewContainer.parentNode.style.padding = '0px';
            }
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
        };
    }, []);

    return iframeData?.dataSource ? (
        // <div className="fault-report-modal frame-modal">
        <div className={`fault-report-modal${iframeData.theme ? `-${iframeData.theme}` : ''} frame-modal`}>
            <FaultReportModalAdd
                onCancel={onCancel}
                faultReportStatus={latestReportStatus}
                flagId={flagId}
                dataSource={dataSource}
                source={source}
                isView={isView}
                standardAlarmId={standardAlarmId}
                goToListPage={goToListPage}
                isIframe
                isWireless={isWireless}
                updateCardList={updateCardList}
                title={title}
                isMajor={isMajor}
                btnKey={btnKey}
                theme={props.theme}
                isFaultReportNew={isFaultReportNew}
                isManual={isManual}
            />
        </div>
    ) : (
        <Modal
            visible={visible}
            width={props.cardsDockedLeft ? 'calc(100% - 636px)' : 1250}
            height={props.cardsDockedLeft ? 'calc(100% - 280px)' : 815}
            className={`fault-report-modal${props.theme ? `-${props.theme}` : ''}`}
            style={{
                position: 'relative',
                left: props.cardsDockedLeft ? -270 : 0,
                top: props.cardsDockedLeft ? 257 : undefined,
            }}
            bodyStyle={{ padding: 0 }}
            footer={null}
            onCancel={onCancel}
            destroyOnClose
            // getContainer={false}
            maskClosable={false}
        >
            <FaultReportModalAdd
                onCancel={onCancel}
                faultReportStatus={latestReportStatus}
                flagId={flagId}
                dataSource={dataSource}
                source={source}
                isView={isView}
                standardAlarmId={standardAlarmId}
                goToListPage={goToListPage}
                setFaultReportDataSource={setFaultReportDataSource}
                setIsView={setIsView}
                updateCardList={updateCardList}
                title={title}
                isMajor={isMajor}
                btnKey={btnKey}
                theme={props.theme}
                isFaultReportNew={isFaultReportNew}
                isManual={isManual}
            />
        </Modal>
    );
};
export default FaultReportModal;
