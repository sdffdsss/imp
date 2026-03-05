// import locales from "locales";
import React from 'react';
import { Checkbox } from 'oss-ui';

export default class Index extends React.PureComponent {
    render() {
        return (
            <Checkbox
                indeterminate={this.props.indeterminate}
                onChange={this.props.onCheckAllChange}
                checked={this.props.checkAll}
            >
                全选
            </Checkbox>
        );
    }
}
