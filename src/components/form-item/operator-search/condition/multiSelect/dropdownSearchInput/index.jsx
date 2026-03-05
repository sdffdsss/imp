// import locales from "locales";
import React from 'react';
import { Input, Icon } from 'oss-ui';

export default class Index extends React.PureComponent {
    inputRef = null;
    myRef = (el) => (this.inputRef = el);
    focus = () => {
        this.inputRef.focus();
    };
    componentDidMount() {
        setTimeout(this.focus, 200);
    }
    componentDidUpdate() {
        // setTimeout(this.focus, 200);
    }
    render() {
        return (
            <>
                <Input
                    ref={this.myRef}
                    value={this.props.sreachInputValue}
                    prefix={<Icon antdIcon={true} type="SearchOutlined" />}
                    allowClear={true}
                    placeholder="输入关键字"
                    onChange={({ target: { value } }) => {
                        this.props.onSearch(value.trimStart());
                    }}
                    onFocus={this.props.onFocusSearch}
                    onBlur={this.props.onBlurSearch}
                />
            </>
        );
    }
}
