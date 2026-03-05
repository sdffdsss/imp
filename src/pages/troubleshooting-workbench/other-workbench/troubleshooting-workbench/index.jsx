import React, { useEffect, useRef, useState } from 'react';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import Iframe from 'react-iframe';
import constants from '@Common/constants';
import BasicInfo from '../basic-info';
import WindowViewIndex from '../window-view';
import TroubleList from '../trouble-list';
import './style.less';

let timer = null;
const TroubleshootingWorkbench = (props) => {
    const ref = useRef();
    const { setShowType, setSheetInfo } = props;
    const [failMapInfo, setFailMapInfo] = useState({});
    const mapIframe = useRef(null);
    const frameInfo = useLoginInfoModel();
    useEffect(() => {
        window.addEventListener(
            'message',
            (e) => {
                if (e.data?.failMapParams) {
                    setFailMapInfo(e.data);
                }
            },
            false,
        );
        const el = ref.current;
        if (el) {
            el.addEventListener('wheel', (e) => {
                el.scrollTo({
                    left: el.scrollLeft + e.deltaY,
                    behavior: 'smooth',
                });
            });
        }
    }, []);
    useEffect(() => {
        timer = setTimeout(() => {
            mapIframe?.current?.contentWindow?.postMessage({ failMap: JSON.stringify(frameInfo) }, '*');
        }, 500);
    }, [frameInfo?.systemInfo?.theme]);
    const { protocol, src, port } = useEnvironmentModel?.data?.environment?.iframeSetting;
    const iframeSrc = `${window.location.origin}/znjk/${constants.CUR_ENVIRONMENT}/${src}`;
    return (
        <div className="troubleshooting-workbench-page">
            <div className="troubleshooting-workbench-page-content ">
                <div className="troubleshooting-workbench-page-content-list">
                    <div className="troubleshooting-workbench-page-info">
                        <div className="troubleshooting-workbench-page-info-field oss-imp-alart-common-bg">
                            <BasicInfo theme={frameInfo?.systemInfo?.theme} />
                        </div>

                        <div className="troubleshooting-workbench-page-info-start oss-imp-alart-common-bg">
                            <WindowViewIndex />
                        </div>
                    </div>
                    <div className="troubleshooting-workbench-page-content-list-sheet oss-imp-alart-common-bg">
                        <TroubleList setShowType={setShowType} setSheetInfo={setSheetInfo} failMapInfo={failMapInfo} />
                    </div>
                </div>
                <div
                    className="troubleshooting-workbench-page-content-map oss-imp-alart-common-bg"
                    ref={ref}
                    style={{
                        position: 'relative',
                    }}
                >
                    <div className="map-container">
                        <Iframe
                            onLoad={() => {
                                mapIframe.current = document.getElementById('mapIframe');
                                if (mapIframe.current) {
                                    clearTimeout(timer);
                                    timer = setTimeout(() => {
                                        console.log(localStorage.getItem('access_token'), '==token');
                                        mapIframe.current.contentWindow.postMessage({ failMap: JSON.stringify(frameInfo) }, '*');
                                        mapIframe.current.contentWindow.postMessage({ token: localStorage.getItem('access_token') }, '*');
                                    }, 500);
                                }
                            }}
                            id="mapIframe"
                            frameBorder="0"
                            height="100%"
                            width="100%"
                            scrolling="no"
                            loading="auto"
                            className="iframe-container"
                            url={iframeSrc}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TroubleshootingWorkbench;
