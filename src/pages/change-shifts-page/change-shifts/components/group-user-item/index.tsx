import React, { useEffect, useState } from 'react';
import { getUserAvatar } from '@Pages/components/avatar-edit/api';
import { Crypto } from 'oss-web-toolkits';
import styles from './index.module.less';

export default function Index({ style, data, refreshFlag }) {
    const [isUseDefault, setIsUseDefault] = useState(true);
    const [showImage, setShowImage] = useState('');

    useEffect(() => {
        if (data.userId) {
            getUserAvatar({ u: Crypto.AES.encrypt(data?.userId, 'boco!123') }).then((res) => {
                if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
                    setIsUseDefault(false);
                    setShowImage(res.data[0].avatar);
                } else {
                    setIsUseDefault(true);
                    setShowImage('');
                }
            });
        }
    }, [data.userId, refreshFlag]);

    return (
        <div style={style} className={styles['user-item']}>
            {isUseDefault ? (
                <div className={styles['name-avatar']}>
                    <div className={styles['name-avatar-div']}>{data.userName.slice(-2)}</div>
                </div>
            ) : (
                <img className={styles['img-avatar']} src={showImage} alt="" />
            )}
            <div className={styles['user-name']}>{data.userName}</div>
        </div>
    );
}
