// import locales from "locales";
import React from 'react';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {}

    render() {
        return (
            <>
                <div>告警设置</div>
            </>
        );
    }
}
