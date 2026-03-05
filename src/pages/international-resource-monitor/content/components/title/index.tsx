import React, { CSSProperties } from 'react';
import styles from './index.module.less';

interface IProps {
    text?: React.ReactNode;
    subtitle?: React.ReactNode;
    tools?: React.ReactNode;
    style?: CSSProperties;
}
export default function Index({ style, text, subtitle, tools }: IProps) {
    return (
        <div className={styles['title-wrapper']} style={style}>
            <div className={styles['title-left-wrapper']}>
                <span>{text}</span>
                {subtitle}
            </div>
            {tools}
        </div>
    );
}
