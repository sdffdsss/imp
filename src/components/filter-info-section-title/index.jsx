import React from 'react';
import { Divider } from 'oss-ui';
import './index.less';

export default (props) => {
    return (
        <div className="filter-info-section-title">
            <Divider type="vertical" />
            <span className="order-with-border">{props.index}</span>
            <span className="title-behind-order">{props.content}</span>
        </div>
    );
};
