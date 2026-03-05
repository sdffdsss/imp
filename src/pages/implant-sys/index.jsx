import React, { useRef } from 'react';
import Iframe from 'react-iframe';
import { useEnvironmentModel } from '@Src/hox';
let timer = null;
const Index = (index) => {
    const mapIframe = useRef(null);
    const { implantAddress } = useEnvironmentModel?.data?.environment;
    const token = `Bearer ${localStorage.getItem('access_token')}`;

    const iframeSrc = `${implantAddress}token=${token}`;
    return (
        <div className="implant-sys" style={{ width: '100%', height: '100%' }}>
            <Iframe
                onLoad={() => {
                    mapIframe.current = document.getElementById('mapIframe');
                    if (mapIframe.current) {
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            mapIframe.current.contentWindow.postMessage({ token }, '*');
                        }, 500);
                    }
                }}
                id="mapIframe"
                frameBorder="0"
                height="100%"
                width="100%"
                scrolling="no"
                loading={'auto'}
                className="iframe-container"
                // 接收到的 Iframe 的URL地址
                url={iframeSrc}
            />
        </div>
    );
};

export default Index;
