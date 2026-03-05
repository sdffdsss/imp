import React from 'react';
import './index.less';

type Props = {
    title: string;
    className?: string;
    style?: React.CSSProperties;
    leftIcon?: React.ReactNode;
    rightBtnGroup?: Array<React.ReactNode>;
};

export default function Title(props: Props) {
    const { title, leftIcon, rightBtnGroup, className } = props;
    return (
        <h3 className={`title-container ${className || ''}`} style={props.style}>
            <div className="title-left">
                {leftIcon}
                {title}
            </div>
            <div className="title-right">{rightBtnGroup}</div>
        </h3>
    );
}
