import React, { FC } from 'react';
import styles from './style.module.less';

interface Props {
    type?: 'primary' | 'default';
    style?: Record<string, any>;
}

const TextButton: FC<Props> = (props) => {
    const { type = 'default', style, children } = props;

    return (
        <div className={[styles['text-button'], type === 'primary' && styles['text-button-primary']].join(' ')} style={style}>
            {children}
        </div>
    );
};

export default TextButton;
