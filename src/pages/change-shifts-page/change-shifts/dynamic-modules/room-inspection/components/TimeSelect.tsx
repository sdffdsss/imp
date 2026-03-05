import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, List, TimePicker, Space, Button } from 'oss-ui';
import moment from 'moment';
import './time-select.less';
import { Pattern } from '../../enum';

const OverLay = ({ onCloseDropdown, selectedTime, onChange }) => {
    const [timeValue, setTimeValue] = useState(selectedTime);

    const quickData = (() => {
        const t: Array<string> = [];
        const currentTime = moment();

        if (currentTime.minute() < 30) {
            currentTime.add(1, 'h').minutes(0);
        } else if (currentTime.minute() > 30) {
            currentTime.add(1, 'h').minutes(30);
        }

        for (let i = 0; i < 5; i += 1) {
            t.push(currentTime.format('HH:mm'));
            if (i < 4) {
                currentTime.add(30, 'm');
            }
        }
        return t;
    })();
    return (
        <div className="room-inspection-dropdown-wrapper">
            <List
                bordered
                dataSource={quickData}
                renderItem={(item) => (
                    <List.Item
                        onClick={(e: any) => {
                            setTimeValue(moment(e.target.innerText, 'HH:mm'));
                        }}
                    >
                        {item}
                    </List.Item>
                )}
                header={<div className="room-inspection-quick-select">快速选择</div>}
                footer={
                    <Space direction="vertical" align="start">
                        <Space align="center">
                            <span>时间:</span>
                            <TimePicker
                                showNow={false}
                                allowClear={false}
                                format="HH:mm"
                                suffixIcon={null}
                                value={timeValue}
                                onChange={(time) => {
                                    setTimeValue(time);
                                }}
                            />
                        </Space>
                        <Space className="room-inspection-space">
                            <Button
                                // size="small"
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
                                    setTimeValue(moment());
                                }}
                            >
                                此刻
                            </Button>
                            <Button
                                size="small"
                                className="room-inspection-button"
                                onClick={() => {
                                    onCloseDropdown();
                                    onChange(timeValue);
                                }}
                            >
                                确定
                            </Button>
                        </Space>
                    </Space>
                }
            />
        </div>
    );
};

export default function App({ pattern, value, onChange = () => {} }: any) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const wrpRef: any = useRef(null);

    const [selectedTime, setSelectedTime] = useState(value);

    useEffect(() => {
        setSelectedTime(value);
    }, [value]);

    function closeDropdown() {
        setIsDropdownVisible(false);
    }

    function handleChange(newValue) {
        setSelectedTime(newValue);
        onChange(newValue);
    }
    return (
        <div ref={wrpRef}>
            <Dropdown
                placement="bottom"
                visible={isDropdownVisible}
                destroyPopupOnHide
                trigger={pattern === Pattern.readonly ? [] : ['click']}
                overlay={<OverLay onCloseDropdown={closeDropdown} selectedTime={selectedTime} onChange={handleChange} />}
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
                <div className="dropdownTrigger" style={{ cursor: pattern === Pattern.readonly ? 'normal' : 'pointer' }}>
                    {selectedTime ? selectedTime.format('HH:mm').toString() : '请选择时间'}
                </div>
            </Dropdown>
        </div>
    );
}
