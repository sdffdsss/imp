import React from 'react';
import { Row, Col, Card, Space } from 'oss-ui';
import './index.less';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    componentDidUpdate() {}
    render() {
        const { navTabs, children } = this.props;
        const crruChildren = children.filter((ch) => ch);
        return (
            <>
                {React.Children.map(crruChildren, (child, index) => (
                    <>
                        <Row gutter={[0, 15]}>
                            <Col span={24}>
                                <Card className="alarm-form-setting-boder-card" bordered={false} size="small">
                                    <div className="alarm-form-setting-boder-card-inline">
                                        <Space>
                                            <div className="alarm-form-setting-boder-card-number">
                                                <span>{index + 1}</span>{' '}
                                            </div>
                                            <span>{navTabs[index]}</span>
                                        </Space>
                                    </div>
                                </Card>
                            </Col>
                            <Col className="alarm-form-setting-number-line" span={24}>
                                {child}
                            </Col>
                        </Row>
                    </>
                ))}
            </>
        );
    }
}
