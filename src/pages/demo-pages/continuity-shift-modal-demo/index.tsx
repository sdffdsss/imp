import React, { useState } from 'react';
import { Button, Space } from 'oss-ui';
import ShifInformationModal from '../../change-shifts-page/change-shifts/components/Shift-Information-modal';

const ComponentDemp = () => {
    const [visible, setVisible] = useState<boolean>(false);
    return (
        <div style={{ margin: 20 }}>
            <ShifInformationModal
                visible={visible}
                setVisible={setVisible}
                handleSwitchUser={() => {}}
                defaultData={{
                    dateTime: '2023-08-01',
                    groupId: '-1682742427',
                    workShiftId: '1000475',
                }}
            />
            <Space>
                <Button onClick={() => setVisible(true)}>连续性交接班</Button>
            </Space>
        </div>
    );
};

export default ComponentDemp;
