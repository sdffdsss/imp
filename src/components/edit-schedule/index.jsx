import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Row, Col, InputNumber } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import ScheduleItem from './items';
import moment from 'moment';
import './index.less';

const GroupSchedule = (props, ref) => {
    const [dataSource, handleDataSource] = useState([
        {
            name: '白班',
            startTime: moment('8:30:00', 'HH:mm:ss'),
            type: 0,
            endTime: moment('17:30:00', 'HH:mm:ss'),
        },
        {
            name: '晚班',
            startTime: moment('17:30:00', 'HH:mm:ss'),
            type: 1,
            endTime: moment('8:30:00', 'HH:mm:ss'),
        },
    ]);
    const [timeRange, handleTimeRange] = useState(Number);
    const [advanceTime, handleAdvanceTime] = useState(90);
    const [delayTime, handleDelayTime] = useState(90);
    const [canAdd, handleCanAdd] = useState(true);
    const handleScheDuleFormat = (val) => {
        const data = val;
        data.forEach((item, idx) => {
            if (idx !== 0) {
                data[idx].startTime = data[idx - 1].endTime;
            }
        });
        const list = _.cloneDeep(data);
        if (list.find((item) => item.type === 1)) {
            list.splice(list.findIndex((item) => item.type === 1) + 1);
        }
        handleDataSource(list);
    };
    useEffect(() => {
        if (props.rowData?.length) {
            console.log(
                props.rowData?.map((item) => {
                    return {
                        name: item.workShiftName,
                        startTime: moment(item.beginTime, 'HH:mm:ss'),
                        type: item.timeType,
                        endTime: moment(item.endTime, 'HH:mm:ss'),
                    };
                }),
            );
            handleScheDuleFormat(
                props.rowData?.map((item) => {
                    return {
                        name: item.workShiftName,
                        startTime: moment(item.beginTime, 'HH:mm:ss'),
                        type: item.timeType,
                        endTime: moment(item.endTime, 'HH:mm:ss'),
                    };
                }),
            );
        } else {
            handleScheDuleFormat(dataSource);
        }
    }, [props.rowData]);
    const handleAdd = (item, index) => {
        const data = _.cloneDeep(dataSource);
        data.push({
            name: '',
            startTime: dataSource[dataSource.length - 1]?.endTime,
            type: 0,
            endTime: null,
        });
        handleDataSource(data);
    };
    const handleDelete = (item, index) => {
        const data = _.cloneDeep(dataSource);
        data.splice(index, 1);
        handleScheDuleFormat(data);
    };
    const onItemChange = (val, index) => {
        const data = _.cloneDeep(dataSource);
        data[index].name = val.itemName;
        data[index].startTime = val.itemStartTime;
        data[index].type = val.itemType;
        data[index].endTime = val.itemEndTime;
        handleScheDuleFormat(data);
    };
    const getTimeRange = (data) => {
        const rangeList = data.map((item) => {
            const date1 = item.startTime;
            const date2 = item.endTime;
            if (!date1 || !date2) {
                return;
            }
            if (item.type === 1) {
                return date2.diff(date1, 'minute') + 1440;
            }
            return date2.diff(date1, 'minute');
        });
        handleTimeRange(Math.min.apply(Math, rangeList));
    };
    useEffect(() => {
        getTimeRange(dataSource);
        const newData = _.cloneDeep(dataSource);
        if (newData[newData.length - 1].type === 1) {
            handleCanAdd(false);
        } else {
            handleCanAdd(true);
        }
    }, [dataSource, advanceTime, delayTime]);
    useEffect(() => {
        const { getTimeRange } = props;
        getTimeRange && getTimeRange(timeRange);
        // if(timeRange && timeRange<=advanceTime){
        //   handleAdvanceTime(timeRange)
        // }
        // if(timeRange && timeRange<=delayTime){
        //   handleDelayTime(timeRange)
        // }
    }, [timeRange]);
    useEffect(() => {
        if (props.scheduleRange.rules && !props.scheduleRange.rules.length) {
            return;
        }
        if (
            (props.scheduleRange.advanceTime || props.scheduleRange.advanceTime === 0) &&
            (props.scheduleRange.delayTime || props.scheduleRange.delayTime === 0)
        ) {
            handleAdvanceTime(props.scheduleRange.advanceTime);
            handleDelayTime(props.scheduleRange.delayTime);
        }
    }, [props.scheduleRange]);

    const light = props.scheduleProps?.systemInfo?.theme === 'light';

    const listStyle = {
        backgroundColor: light ? 'rgb(238, 242, 245)' : '',
    };

    const containerStyle = {
        border: light ? '1px solid #ccc' : '',
    };

    const handleSchduleDatas = () => {
        const { handleSchduleData } = props;
        handleSchduleData &&
            handleSchduleData({
                date: dataSource,
                advanceTime,
                delayTime,
            });
    };

    useImperativeHandle(ref, () => ({
        getData: handleSchduleDatas,
    }));

    const limitNumber = (value) => {
        if (value === '0' || value === 0) {
            return value;
        }
        if (typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : '';
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : '';
        } else {
            return '';
        }
    };

    return (
        <div>
            <p>班次：</p>
            <div className="edit-schedule-container" style={containerStyle}>
                <Row className="schedule-list" style={listStyle}>
                    <Col span={6}>班次名称</Col>
                    <Col span={6}>开始时间</Col>
                    <Col span={10}>结束时间</Col>
                    <Col span={2}>操作</Col>
                </Row>
                {dataSource.map((item, index) => {
                    return (
                        <ScheduleItem
                            key={index}
                            dataSource={dataSource}
                            canAdd={canAdd}
                            data={item}
                            index={index}
                            add={() => {
                                handleAdd(item, index);
                            }}
                            delete={() => {
                                handleDelete(item, index);
                            }}
                            itemChange={(val) => {
                                onItemChange(val, index);
                            }}
                        />
                    );
                })}
            </div>
            {props.skipType !== 'header' ? (
                <>
                    <p>交接班时间：</p>
                    <Row style={{ height: '30px', lineHeight: '30px' }}>
                        <Col span={2}>提前</Col>
                        <Col span={3}>
                            <InputNumber min={0} formatter={limitNumber} parser={limitNumber} value={advanceTime} onChange={handleAdvanceTime} />
                        </Col>
                        <Col span={2}>分钟</Col>
                        <Col style={{ color: light ? 'red' : 'white' }} span={14}>
                            说明：如交/接班时间为17:00，若提前90分钟则到15:30之后可进行交接班。
                        </Col>
                    </Row>
                    <Row style={{ height: '30px', lineHeight: '30px', marginTop: '5px' }}>
                        <Col span={2}>延后</Col>
                        <Col span={3}>
                            <InputNumber min={0} formatter={limitNumber} parser={limitNumber} value={delayTime} onChange={handleDelayTime} />
                        </Col>
                        <Col span={2}>分钟</Col>
                        <Col style={{ color: light ? 'red' : 'white' }} span={14}>
                            说明：如交/接班时间为17:00，若延后90分钟则到18:30之前可进行交接班。
                        </Col>
                    </Row>
                </>
            ) : null}
        </div>
    );
};

export default GroupSchedule;
