import React from 'react';
import { ReactComponent as TotalSvg } from './imgs/total.svg';
import styles from './index.module.less';

export default function Index(props) {
    const { data } = props;
    const { level1, level2, level3, level4, levelTotal, circuitTotal } = data;

    const list = [
        {
            value: level1,
            color: '#DA241E',
        },
        {
            value: level2,
            color: '#F6A043',
        },
        {
            value: level3,
            color: '#F9EC39',
        },
        {
            value: level4,
            color: '#3377FF',
        },
        {
            title: <TotalSvg className={styles['alarm-stats-item-icon']} />,
            value: levelTotal,
        },
        {
            title: <span className={styles['alarm-stats-item-title']}>电路总数：</span>,
            value: circuitTotal,
        },
    ];

    return (
        <div>
            <div className={styles['alarm-stats-item']}>
                {list.map((item) => {
                    return (
                        <>
                            {item.title ? (
                                item.title
                            ) : (
                                <span className={styles['alarm-stats-item-warning-icon']} style={{ background: item.color }} />
                            )}
                            <span>{item.value}</span>
                        </>
                    );
                })}
            </div>
        </div>
    );
}
