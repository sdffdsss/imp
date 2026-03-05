import React, { useState, useRef, useMemo } from 'react';
import { Dropdown, List, Space, Button, DatePicker, Row, Col } from 'oss-ui';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import { useTableContext } from '../../context';

import './index.less';

const formatString = 'HH:mm';

const OverLay = ({ onCloseDropdown, selectedTime, planExecTime, onChange }) => {
    // console.log('log---------------------', { selectedTime, planExecTime });

    const [timeValue, setTimeValue] = useState<any>(selectedTime && selectedTime !== '-' ? moment(`2024-01-01 ${selectedTime}`) : undefined);

    const quickData = [
        moment(`2024-01-01 ${planExecTime}`).subtract(1, 'h').format(formatString),
        moment(`2024-01-01 ${planExecTime}`).subtract(30, 'm').format(formatString),
        moment(`2024-01-01 ${planExecTime}`).format(formatString),
        moment(`2024-01-01 ${planExecTime}`).add(30, 'm').format(formatString),
        moment(`2024-01-01 ${planExecTime}`).add(1, 'h').format(formatString),
    ];

    return (
        <div className="real-exec-time-dropdown-content">
            <List
                bordered
                dataSource={quickData}
                renderItem={(item) => (
                    <List.Item
                        onClick={() => {
                            setTimeValue(moment(item, 'HH:mm'));
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
                            <Col span={7} style={{ lineHeight: '28px' }}>
                                时间:
                            </Col>
                            <Col span={17}>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    // showTime
                                    picker="time"
                                    showNow={false}
                                    allowClear={false}
                                    format={formatString}
                                    suffixIcon={null}
                                    value={timeValue}
                                    onChange={(time) => {
                                        // console.log('log---------------------------', time);
                                        // @ts-ignore
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
                                    onChange(cur.format(formatString));
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
                    </div>
                }
            />
        </div>
    );
};

function TimeSelectImp(props: any) {
    const { onCellValueChange, state: tableState } = useTableContext();
    const { value, onChange = _.noop, record } = props;

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const wrpRef: any = useRef(null);

    const [selectedTime, setSelectedTime] = useState(value || record.value);

    // useEffect(() => {
    //     setSelectedTime(value);
    // }, [value]);

    function closeDropdown() {
        setIsDropdownVisible(false);
    }

    function handleChange(newValue) {
        const valueString = _.isString(newValue) ? newValue : moment(newValue).format(formatString).toString();
        const resultValue = newValue === null ? '-' : valueString;
        setSelectedTime(resultValue);
        onChange(resultValue);
        onCellValueChange({
            value: '',
            info: record.raw,
            newValueObject: {
                ...(record.raw?.current ?? {}),
                value: resultValue,
            },
        });
    }

    const planExecTime = useMemo(() => {
        return ['', '-'].includes(record.value) || _.isNil(record.value) ? _.get(record, 'showConfig.0.result') : record.value;
    }, [record]);

    const selectedTimeString = ['', '-'].includes(selectedTime) || _.isNil(selectedTime) ? planExecTime : selectedTime;

    return (
        <div ref={wrpRef} className="custom-plan-real-exec-time-dropdown-wrapper">
            <Dropdown
                placement="bottom"
                visible={isDropdownVisible}
                destroyPopupOnHide
                trigger={['click']}
                disabled={!tableState.editable}
                overlay={
                    <OverLay
                        //
                        selectedTime={selectedTimeString}
                        planExecTime={planExecTime}
                        onCloseDropdown={closeDropdown}
                        onChange={handleChange}
                    />
                }
                overlayClassName="dropdown-wrapper"
                getPopupContainer={() => {
                    return wrpRef.current;
                }}
                onVisibleChange={() => {
                    setIsDropdownVisible(!isDropdownVisible);
                }}
                overlayStyle={{
                    width: '100%',
                    backgroundColor: '#fff',
                }}
            >
                <div className="dropdownTrigger">{selectedTime}</div>
            </Dropdown>
        </div>
    );
}

export const TimeSelect = (props: any) => {
    const memoRef = useRef({ record: null });
    const latest = useRef({ onChange: props.onChange });
    latest.current = {
        ...latest.current,
        onChange: props.onChange ?? _.noop,
    };

    const memoRecord = useMemo(() => {
        if (!_.isEqual(memoRef.current.record, props.record)) {
            memoRef.current.record = _.cloneDeep(props.record);
        }
        return memoRef.current.record;
    }, [props.record]);

    return useMemo(() => <TimeSelectImp onChange={(...args) => latest.current.onChange(...args)} record={memoRecord} />, [memoRecord]);
};
