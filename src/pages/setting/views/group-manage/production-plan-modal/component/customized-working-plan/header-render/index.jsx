import React from 'react';
import { Col, Typography, Row } from 'oss-ui';
import { _ } from 'oss-web-toolkits';

export default function Index({ data }) {
    if (!data) {
        return null;
    }
    return (
        <div style={{ margin: '0 10px' }}>
            <Typography.Title level={5} style={{ textAlign: 'center', margin: '10px 0' }}>
                {data?.title}
            </Typography.Title>
            {_.chunk(data?.fields || [], 2).map((itemRow) => {
                return (
                    <Row style={{ border: '1px solid #f0f0f0', minHeight: '64px' }} align="stretch">
                        {itemRow.map((itemCol) => {
                            return (
                                <>
                                    <Col span={3} style={{ borderRight: '1px solid #f0f0f0' }} />
                                    <Col
                                        span={4}
                                        style={{
                                            borderRight: '1px solid #f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            {itemCol.fieldName}
                                        </Typography.Title>
                                    </Col>
                                    <Col
                                        span={itemCol.fieldName === '填写人' ? 7 : 3}
                                        style={{
                                            borderRight: '1px solid #f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography.Title level={5} style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                            {/* eslint-disable-next-line react/no-danger */}
                                            <div dangerouslySetInnerHTML={{ __html: itemCol.value || '-' }} />
                                        </Typography.Title>
                                    </Col>
                                </>
                            );
                        })}
                    </Row>
                );
            })}
        </div>
    );
}
