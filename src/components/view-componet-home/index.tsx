import React from 'react';
import { Col, Row } from 'oss-ui';
import WorkbenchComponents from '@Components/workbench-components';
import './style.less';

const ViewComponentHome = () => {
    return (
        <div className="view-component-home-page">
            <Row gutter={[8, 8]}>
                <Col span={16}>
                    <WorkbenchComponents id="0" theme={''} />
                </Col>
                <Col span={16}>
                    <WorkbenchComponents id="10" theme={''} />
                </Col>
                <Col span={8}>
                    <WorkbenchComponents id="11" theme={''} />
                </Col>
                <Col span={16}>
                    <WorkbenchComponents id="16" theme={''} />
                </Col>
                <Col span={16}>
                    <WorkbenchComponents id="17" theme={''} />
                </Col>
            </Row>
        </div>
    );
};
export default ViewComponentHome;
