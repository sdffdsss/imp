import React, { useState } from 'react';
import { Row, Col } from 'oss-ui';
import PageContainer from '@Components/page-container';
import AlarmLight from './alarm-light';
import AlarmWindow from './alarm-window';

const AlarmBoard = () => {
    const [currentLightInfo, setCurrentLight] = useState({});
    const onLightChange = (selectLight) => {
        setCurrentLight(selectLight);
    };
    return (
        <PageContainer divider showHeader={false}>
            <Row gutter={10} style={{ height: '100%' }}>
                <Col span={6} style={{ height: '100%' }}>
                    <AlarmLight onLightChange={onLightChange} />
                </Col>
                <Col span={18}>
                    <AlarmWindow lightInfo={currentLightInfo} />
                </Col>
            </Row>
        </PageContainer>
    );
};

export default AlarmBoard;
