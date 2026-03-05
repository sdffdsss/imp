import React, { FC } from 'react';
import { Icon } from 'oss-ui';
import styles from './style.module.less';
import NavButton from './nav-button';
import { TabButtonEnum, TabButtonHistoryEnum, TabList } from '../type';

interface ButtonListProps {
    selectedTab: TabButtonEnum | TabButtonHistoryEnum;
    changeTab: (data: TabButtonEnum | TabButtonHistoryEnum) => void;
    display: boolean;
    setDisplay: (data: boolean) => void;
}

const NavButtonList: FC<ButtonListProps> = (props) => {
    const { selectedTab, changeTab, display, setDisplay } = props;

    const buttonClick = (name: TabButtonEnum | TabButtonHistoryEnum) => {
        changeTab(name);
    };

    const iconClick = () => {
        setDisplay(!display);
    };

    const tabList = TabList.map((item) => {
        const { name, id, children } = item;

        return (
            <NavButton selectedTab={selectedTab} onClick={buttonClick} type="primary" key={id} menuList={children} id={id}>
                {name}
            </NavButton>
        );
    });

    return (
        <div className={styles['nav-list']}>
            {tabList}
            <NavButton onClick={iconClick} backgroundColor="#a7a9ab">
                {display ? <Icon type="LeftOutlined" antdIcon /> : <Icon type="RightOutlined" antdIcon />}
            </NavButton>
        </div>
    );
};

export default NavButtonList;
