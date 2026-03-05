import React from 'react';

import styles from './index.module.less';

export default function Index({ label, content, style = {} }) {
    return (
        <div className={styles['pre-message']} style={style}>
            <div className={styles['label']}>{label}</div>
            <div className={styles['content']}>{content}</div>
        </div>
    );
}
