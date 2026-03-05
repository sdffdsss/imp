import React, { Component } from 'react';
// todo 联通暂时页面飞走了只显示空白页
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidCatch(error, info) {
        this.setState({
            error,
            errorInfo: info
        });
    }
    render() {
        if (this.state.errorInfo) {
            return <div></div>;
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
