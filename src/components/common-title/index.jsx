import React from 'react';
import './index.less';

export function CommonTitle(props) {
    const { title, renderRight } = props;
    return (
        <p className="common-title">
            <span>{title}</span>
            {renderRight ? renderRight() : null}
        </p>
    )
}