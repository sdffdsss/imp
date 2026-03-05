import React from 'react';
import { Menu } from 'oss-ui';
import './index.less';

export default class DrawerMenu extends React.PureComponent {
    render() {
        const {
            onDrawerMenuClick,
            onDrawerMenuOpenChange,
            reportMenuSelectedKeys,
            reportMenuOpenKeys,
            reportMenus,
        } = this.props;

        return (
            <Menu
                className={'alarm-report-oss-ui-menu'}
                mode="inline"
                onClick={onDrawerMenuClick}
                onOpenChange={onDrawerMenuOpenChange}
                selectedKeys={reportMenuSelectedKeys}
                openKeys={reportMenuOpenKeys}
            >
                {reportMenus}
            </Menu>
        );
    }
}
