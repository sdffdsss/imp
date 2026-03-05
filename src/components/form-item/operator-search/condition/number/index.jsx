// import locales from "locales";
import React from 'react';
import { InputNumber } from 'oss-ui';

const style = { width: '100%' };
export default class Index extends React.PureComponent {
    getInputNumberValue = ({ operatorValue }) => {
        let inputNumberValue = null;
        if (operatorValue && operatorValue.value && !Number.isNaN(operatorValue.value)) {
            inputNumberValue = Number(operatorValue.value);
        }
        return inputNumberValue;
    };
    render() {
        const inputNumberValue = this.getInputNumberValue(this.props);
        return <InputNumber style={style} value={inputNumberValue} onChange={this.props.onChange}></InputNumber>;
    }
}
