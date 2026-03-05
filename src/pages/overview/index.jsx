import React, { useState } from 'react';
import { useEffect } from 'react';
import './style.less';

const OverView = () => {
    const [alarm, setAlarm] = useState('200');
    const [fly, setFly] = useState('72');
    const [action, setAction] = useState('77');
    const [sheet, setSheet] = useState('26');
    useEffect(() => {
        const timer = setInterval(() => {
            setAlarm(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`);
            setFly(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`);
            setAction(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`);
            setSheet(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`);
        }, [1000]);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <div className="over-view-page-record">
            <div className="over-view-page-record-page">
                <div className="over-view-page-record-page-field">
                    <div className="over-view-page-record-page-field-img"></div>
                    <div className="over-view-page-record-page-field-context">
                        <div className="over-view-page-record-page-field-context-title">原始告警量</div>
                        <div className="over-view-page-record-page-field-context-num">4,{alarm}万条</div>
                    </div>
                </div>
                <div className="over-view-page-record-page-field">
                    <div className="over-view-page-record-page-field-img img-fly"></div>
                    <div className="over-view-page-record-page-field-context">
                        <div className="over-view-page-record-page-field-context-title">派单工单量</div>
                        <div className="over-view-page-record-page-field-context-num">4,{fly}万条</div>
                    </div>
                </div>
                <div className="over-view-page-record-page-field ">
                    <div className="over-view-page-record-page-field-img img-action"></div>
                    <div className="over-view-page-record-page-field-context">
                        <div className="over-view-page-record-page-field-context-title">自动派单率</div>
                        <div className="over-view-page-record-page-field-context-num">99.{action}%</div>
                    </div>
                </div>
                <div className="over-view-page-record-page-field " style={{ marginBottom: 0 }}>
                    <div className="over-view-page-record-page-field-img img-sheet"></div>
                    <div className="over-view-page-record-page-field-context">
                        <div className="over-view-page-record-page-field-context-title">派单成功率</div>
                        <div className="over-view-page-record-page-field-context-num">86.{sheet}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OverView;
