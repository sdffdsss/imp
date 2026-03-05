import React, { useState, useRef } from 'react';
import { Dropdown, List, Space, Button, DatePicker, Row, Col } from 'oss-ui';
import moment from 'moment';
import './time-select.less';

const OverLay = ({ onCloseDropdown, selectedTime, planExecTime, onChange }) => {
    const [timeValue, setTimeValue] = useState(selectedTime ? moment(selectedTime, 'YYYY-MM-DD HH:mm:ss') : undefined);

    const quickData = [
        moment(planExecTime).subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss'),
        moment(planExecTime).subtract(30, 'm').format('YYYY-MM-DD HH:mm:ss'),
        planExecTime,
        moment(planExecTime).add(30, 'm').format('YYYY-MM-DD HH:mm:ss'),
        moment(planExecTime).add(1, 'h').format('YYYY-MM-DD HH:mm:ss'),
    ];

    return (
        <div className="real-exec-time-dropdown-content">
            <List
                bordered
                dataSource={quickData}
                renderItem={(item) => (
                    <List.Item
                        onClick={() => {
                            setTimeValue(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                            onChange(item);
                            onCloseDropdown();
                        }}
                    >
                        {item}
                    </List.Item>
                )}
                header={<div className="room-inspection-quick-select">快速选择</div>}
                footer={
                    <div>
                        <Row style={{ width: '100%', marginBottom: '8px' }}>
                            <Col span={6} style={{ lineHeight: '28px' }}>
                                时间:
                            </Col>
                            <Col span={18}>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    showTime
                                    showNow={false}
                                    allowClear={false}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    suffixIcon={null}
                                    value={timeValue}
                                    onChange={(time) => {
                                        setTimeValue(time);
                                    }}
                                />
                            </Col>
                        </Row>
                        <Space className="room-inspection-space" style={{ width: '100%' }}>
                            <Button
                                size="small"
                                className="room-inspection-button"
                                onClick={() => {
                                    onCloseDropdown();
                                    onChange(null);
                                    setTimeValue(null);
                                }}
                            >
                                清空
                            </Button>
                            <Button
                                size="small"
                                className="room-inspection-button"
                                onClick={() => {
                                    const cur = moment();
                                    setTimeValue(cur);
                                    onCloseDropdown();
                                    onChange(cur.format('YYYY-MM-DD HH:mm:ss'));
                                }}
                            >
                                此刻
                            </Button>
                            <Button
                                size="small"
                                className="room-inspection-button"
                                onClick={() => {
                                    onCloseDropdown();
                                    onChange(timeValue?.format('YYYY-MM-DD HH:mm:ss'));
                                }}
                            >
                                确定
                            </Button>
                        </Space>
                    </div>
                }
            />
        </div>
    );
};

export default function App({ value, onChange = () => {}, record }: any) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const wrpRef: any = useRef(null);

    const [selectedTime, setSelectedTime] = useState(value);

    // useEffect(() => {
    //     setSelectedTime(value);
    // }, [value]);

    function closeDropdown() {
        setIsDropdownVisible(false);
    }

    function handleChange(newValue) {
        setSelectedTime(newValue);
        onChange(newValue);
    }

    return (
        <div ref={wrpRef} className="real-exec-time-dropdown-wrapper">
            <Dropdown
                placement="bottom"
                visible={isDropdownVisible}
                destroyPopupOnHide
                trigger={['click']}
                overlay={
                    <OverLay onCloseDropdown={closeDropdown} selectedTime={selectedTime} planExecTime={record.planExecTime} onChange={handleChange} />
                }
                overlayClassName="dropdown-wrapper"
                getPopupContainer={() => wrpRef.current}
                onVisibleChange={() => {
                    setIsDropdownVisible(!isDropdownVisible);
                }}
                overlayStyle={{
                    width: '100%',
                    backgroundColor: '#fff',
                }}
            >
                <div className="dropdownTrigger">{selectedTime || '-'}</div>
            </Dropdown>
        </div>
    );
}
