import React from 'react';

type Props = {
    title: string;
    className?: string;
    style?: React.CSSProperties;
    leftIcon?: React.ReactNode;
    rightBtnGroup?: Array<React.ReactNode>;
};

export default function Title(props: Props) {
    const { title } = props;
    return (
        <div className="success-title-container">
            <div className="title-left">
                <em className="title-prefix" />
                {title}
            </div>
        </div>
    );
}
