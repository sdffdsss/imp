import React from 'react';
import { Drawer, Menu } from 'oss-ui';

export default class DrawerMenu extends React.PureComponent {
    state = {
        drawerVisible: false,
    };

    // componentDidMount() {
    //     window.addEventListener('mousemove', this.handleMouseMove);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener('mousemove', this.handleMouseMove);
    // }

    // handleMouseMove = (e) => {
    //     if (
    //         (!this.state.drawerVisible && window.innerWidth - e.clientX < 3) ||
    //         (this.state.drawerVisible && window.innerWidth - e.clientX < this.props.width)
    //     ) {
    //         this.setState({
    //             drawerVisible: true,
    //         });
    //     }
    // };

    render() {
        const {
            visible,
            onClose,
            onDrawerMenuClick,
            onDrawerMenuOpenChange,
            reportMenuSelectedKeys,
            reportMenuOpenKeys,
            reportMenus,
            title,
            width,
        } = this.props;

        return (
            <Drawer
                title={title}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={width}
                getContainer={false}
                // style={{ position: 'absolute' }}
            >
                <Menu
                    mode="inline"
                    onClick={onDrawerMenuClick}
                    onOpenChange={onDrawerMenuOpenChange}
                    selectedKeys={reportMenuSelectedKeys}
                    openKeys={reportMenuOpenKeys}
                >
                    {reportMenus}
                </Menu>
            </Drawer>
        );
    }
}
