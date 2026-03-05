import React, { useState } from 'react';
import { Drawer, Button, Icon } from 'oss-ui';
import './index.less';

const DrawerButton: React.FC<{}> = (props) => {
    const { children } = props;
    const [visible, setVisible] = useState<boolean>(true);
    return (
        <div className="drawer-box">
            <Button className="drawer-outside-button" onClick={() => setVisible(true)}>
                工单流程 <Icon antdIcon type="UpOutlined" style={{ marginLeft: 10 }} />
            </Button>
            <Drawer
                placement="bottom"
                visible={visible}
                height={480}
                mask={false}
                onClose={() => setVisible(false)}
                title={
                    <Button className="drawer-inner-button" onClick={() => setVisible(false)}>
                        <Icon antdIcon type="DownOutlined" />
                    </Button>
                }
                className="drawer-button"
                closable={false}
                getContainer={false}
            >
                {children}
            </Drawer>
        </div>
    );
};

export default DrawerButton;
