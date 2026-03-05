// import locales from "locales";
import React from 'react';
import { Select } from 'oss-ui';

export default class Index extends React.PureComponent {
    render() {
        return (
            <Select
                value={this.props.operatorValue.operator}
                onChange={(operator) => {
                    this.props.onChange({ operator });
                }}
            >
                {this.props.operatorOptions.map(({ key, value }) => (
                    <Select.Option key={key} value={key}>
                        {value}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}
