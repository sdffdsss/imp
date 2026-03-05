import React, { FC } from 'react';
import { Menu, Popover } from 'oss-ui';
import { TabButtonEnum, TabButtonHistoryEnum } from '../../type';
import styles from './style.module.less';

interface Props {
    selectedTab?: TabButtonEnum | TabButtonHistoryEnum;
    id?: TabButtonEnum | TabButtonHistoryEnum;
    onClick?: (id: TabButtonEnum | TabButtonHistoryEnum) => void;
    type?: 'primary' | 'default';
    backgroundColor?: string;
    menuList?: { id: string; name: string }[];
}

const NavButton: FC<Props> = (props) => {
    const { selectedTab, onClick, type = 'default', backgroundColor, children, menuList, id } = props;

    // 当前项目是否选中
    const selected = selectedTab === id;

    const buttonClick = (clickId) => {
        onClick?.(clickId);
    };

    const handleMenuClick = (e) => {
        buttonClick(e.key);
    };

    // 有子元素
    if (menuList?.length) {
        // 当有子元素时，选中子元素父元素也选中
        const selectedFlag = selectedTab?.split('/')[0] === id;
        const content = (
            <Menu
                mode="vertical"
                className="nav-button-menu-box"
                onClick={handleMenuClick}
                defaultSelectedKeys={[menuList[0].id]}
                selectedKeys={[selectedTab] as string[]}
            >
                {menuList.map((item) => {
                    return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
                })}
            </Menu>
        );
        return (
            <Popover placement="right" content={content} trigger="click">
                <div
                    className={[styles['nav-button'], type && selectedFlag && styles['select-button']].join(' ')}
                    onClick={() => buttonClick(selectedFlag ? selectedTab : menuList[0].id)} // 子元素有选中项目则展示选中项，无则默认展示第一项
                    style={{ backgroundColor }}
                >
                    {children}
                </div>
            </Popover>
        );
    }

    // 无子元素
    return (
        <div
            className={[styles['nav-button'], type && selected && styles['select-button']].join(' ')}
            onClick={() => buttonClick(id)}
            style={{ backgroundColor }}
        >
            {children}
        </div>
    );
};

export default NavButton;
