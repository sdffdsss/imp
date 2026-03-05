import React, { useState, useEffect } from 'react';
import getUrlSearch from '@Common/utils/urlSearch';
import classNames from 'classnames';
import FaultDetails from '@Pages/fault-details';

import TroubleshootingWorkbench from './troubleshooting-workbench';
import './index.less';

export default function Index() {
    const [showType, setShowType] = useState('home');
    const [sheetInfo, setSheetInfo] = useState({
        // sheetNo: 'JS网调【2023】网络故障0205-149020',
        // faultType: -1,
        // sheetTitle: '连云港市:【LYG-DH-ZX-东海瑞嘉花园-BBU1-FL(东海县美麟大公馆8#楼顶弱电井室分位置点)】发生[衍生关联]同一基站多条重要告警(一级告警)',
        // sheetStatus: null,
        // operator: '江苏综合监控',
        // dispatchTime: '',
        // provinceId: '-662225376',
        // regionId: '-512224765',
    });

    useEffect(() => {
        const urlData = getUrlSearch(window.location.href);
        if (urlData.sheetNo) {
            setSheetInfo(urlData);
            setShowType('detail');
        }
    }, []);

    return (
        <div className="trouble-workbench">
            <div className={classNames('page-part', showType !== 'home' ? 'hide-dom' : undefined)}>
                <TroubleshootingWorkbench setShowType={setShowType} setSheetInfo={setSheetInfo} />
            </div>
            <div className="page-part">{sheetInfo && showType === 'detail' && <FaultDetails sheetInfo={sheetInfo} setShowType={setShowType} />}</div>
        </div>
    );
}
