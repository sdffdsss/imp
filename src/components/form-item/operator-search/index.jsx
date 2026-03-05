// import locales from "locales";
import React from 'react';
import { Row, Col } from 'oss-ui';
import Operator from './operator';
import Condition from './condition';

export default class Index extends React.PureComponent {
    render() {
        // let value = this.props.operatorValue;
        const { getOperatorAndFieldValue, changeSendStatus, updataFormParams, operatorOptions, onChange, column } = this.props;
        let { value = {} } = this.props;
        const onCurChange = (newValue) => {
            // 自定义的查询条件 会有多处触发onChange，此处做值得整合

            if (JSON.stringify(value) !== JSON.stringify(newValue)) {
                Object.assign(value, newValue);
                onChange(value);
            }
        };

        value = getOperatorAndFieldValue(value, onChange, operatorOptions, column);
        value = changeSendStatus(value, onChange, column);
        updataFormParams(column, value);

        if (this.props.showOperator) {
            return (
                <Row gutter={8}>
                    <Col className="gutter-row" span={8}>
                        <Operator {...this.props} operatorValue={value} onChange={onCurChange}></Operator>
                    </Col>
                    <Col className="gutter-row" span={16}>
                        <Condition {...this.props} operatorValue={value} onChange={onCurChange}></Condition>
                    </Col>
                </Row>
            );
        }
        return <Condition {...this.props} operatorValue={value} onChange={onCurChange}></Condition>;
    }
}
