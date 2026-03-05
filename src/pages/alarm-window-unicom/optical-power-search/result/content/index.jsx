import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'oss-ui';
import Title from './components/title';
import Content from './components/content';
import FailPNG from './img/fail.png';
import LoadingGIF from './img/loading.gif';
import OpticalPowerIcon from './img/optical-power-1.png';
import { getOpticalPowerTaskResult } from '../../api';

import './index.less';

export default function Index({ params, source = 'item' }) {
    const [info, setInfo] = useState(null);
    const [status, setStatus] = useState('loading');

    const initTimerRef = useRef(null);
    const getResultFnRef = useRef(null);
    const failMessageRef = useRef('查询失败，请稍后重新下发查询任务');

    getResultFnRef.current = () => {
        getOpticalPowerTaskResult(params).then((res) => {
            if (res.code === 200) {
                if (res.data?.status === '0') {
                    clearInterval(initTimerRef.current);
                    setInfo(res.data.data);
                    setStatus('success');
                } else if (res.data?.status === '1' || res.data?.status === '2' || res.data?.status === '4') {
                    // 无操作 计时器依然存在
                    // 开启定时器
                    // initTimerRef.current = setInterval(() => {
                    //     getResultFnRef.current();
                    // }, 1000 * 3);
                } else {
                    failMessageRef.current = '查询失败，请稍后重新下发查询任务';
                    clearInterval(initTimerRef.current);
                    setStatus('fail');
                }
            } else {
                failMessageRef.current = res.message;
                clearInterval(initTimerRef.current);
                setStatus('fail');
            }
        });
    };

    useEffect(() => {
        if (params) {
            getResultFnRef.current();

            initTimerRef.current = setInterval(() => {
                getResultFnRef.current();
            }, 1000 * 3);
        }

        return () => {
            if (initTimerRef.current) {
                clearInterval(initTimerRef.current);
            }
        };
    }, [params]);

    return (
        <div className="optical-power-search-result-show-container">
            {status === 'loading' && (
                <div className="loading-status-wrapper">
                    <div className="loading-img">
                        <img src={LoadingGIF} alt="" />
                    </div>
                    <div className="loading-text">{source === 'item' ? '数据正在加载中，请您耐心等待......' : '数据正在查询中，请稍后查看...'}</div>

                    {source === 'item' && (
                        <div className="loading-tips">
                            <div className="loading-tips-text-1">温馨提示</div>
                            <div className="loading-tips-text-2">
                                可以稍后点击 流水窗上工具
                                <img src={OpticalPowerIcon} alt="" />
                                查看结果
                            </div>
                        </div>
                    )}
                </div>
            )}
            {status === 'success' && (
                <div className="success-status-wrapper">
                    <Title title="光功率详情" />
                    <Content label="定位信息描述" value={info?.locateInfo} />
                    <Content label="所在传输段" value={info?.transSegName} />
                    <Row>
                        <Col span={12}>
                            <Content label="传输系统" value={info?.transSystemName} />
                        </Col>
                        <Col span={12}>
                            <Content label="所在机房" value={info?.locatedRoom} />
                        </Col>
                        <Col span={12}>
                            <Content label="设备名称" value={info?.eqpLabel} />
                        </Col>
                        <Col span={12}>
                            <Content label="端口名称" value={info?.neLabel} />
                        </Col>
                        <Col span={8}>
                            <Content label="输出光功率 当前值" value={info?.outputPowerCurrent} />
                        </Col>
                        <Col span={8}>
                            <Content label="最小值" value={info?.outputPowerMin} />
                        </Col>
                        <Col span={8}>
                            <Content label="最大值" value={info?.outputPowerMax} />
                        </Col>
                        <Col span={8}>
                            <Content label="输入光功率 当前值" value={info?.inputPowerCurrent} />
                        </Col>
                        <Col span={8}>
                            <Content label="最小值" value={info?.inputPowerMin} />
                        </Col>
                        <Col span={8}>
                            <Content label="最大值" value={info?.inputPowerMax} />
                        </Col>
                        <Col span={8}>
                            <Content label="查询时间" value={info?.insertTime} />
                        </Col>
                    </Row>
                    <Title title="设备参数" />
                    <Row>
                        <Col span={12}>
                            <Content
                                label="区域"
                                value={
                                    !info?.provinceName && !info?.regionName
                                        ? '--'
                                        : !info?.provinceName && info?.regionName
                                        ? info?.regionName
                                        : info?.provinceName && !info?.regionName
                                        ? info?.provinceName
                                        : `${info?.provinceName}_${info?.regionName}`
                                }
                            />
                        </Col>
                        <Col span={12}>
                            <Content label="所属网管系统" value={info?.alarmSource} />
                        </Col>
                        <Col span={12}>
                            <Content label="所在机房" value={info?.locatedRoom} />
                        </Col>
                        <Col span={12}>
                            <Content label="节点类型" value={info?.nodeType} />
                        </Col>
                    </Row>
                </div>
            )}
            {status === 'fail' && (
                <div className="fail-status-wrapper">
                    <div className="fail-img">
                        <img src={FailPNG} alt="" />
                    </div>
                    <div className="fail-text">{failMessageRef.current}</div>
                </div>
            )}
        </div>
    );
}
