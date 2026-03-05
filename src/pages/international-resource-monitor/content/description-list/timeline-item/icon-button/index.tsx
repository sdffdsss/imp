import React, { FC, useState } from 'react';
import { Tooltip } from 'oss-ui';

import styles from './style.module.less';

interface Props {
    title: string;
    defaultImg: string;
    selectedImg: string;
    onClick?: () => void;
}

const IconButton: FC<Props> = (props) => {
    const { title, defaultImg, selectedImg, onClick } = props;

    const [isEnter, setIsEnter] = useState<boolean>(false);

    return (
        <Tooltip title={title}>
            <div className={styles['img-btn']} onClick={() => onClick?.()}>
                <img
                    src={isEnter ? selectedImg : defaultImg}
                    alt="图没了"
                    onMouseEnter={() => setIsEnter(true)}
                    onMouseLeave={() => setIsEnter(false)}
                />
            </div>
        </Tooltip>
    );
};

export default IconButton;
