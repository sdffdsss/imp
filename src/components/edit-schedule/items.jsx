import React, { useState, useEffect } from "react";
import { Input, TimePicker, Select, Row, Col, message } from "oss-ui";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./index.less";
import moment from "moment";

const ScheduleItem = (props) => {
  const { data, index, canAdd, dataSource } = props;
  const { name, startTime, type, endTime } = data;
  const [nameSource, handleNameSource] = useState({});
  useEffect(() => {
    handleNameSource({
      itemName: name,
      itemStartTime: startTime,
      itemType: type,
      itemEndTime: endTime,
    });
  }, [data]);
  const handleAdd = (canAdd) => {
    if(!canAdd){
      return message.warn('当天排班需在翌日排班之前')
    }
    props.add && props.add();
  };
  const handleDel = () => {
    props.delete && props.delete();
  };
  const handleItemChange = (val, type) => {
    if (dataSource.find((item) => item.type === 1) && val === 1) {
      return message.warn("只允许选择一个翌日班次");
    }
    const data = nameSource;
    data[type] = val;
    handleNameSource(data);
    if (type === "itemType") {
      data.itemEndTime = null;
      handleNameSource(data);
    }
    props.itemChange && props.itemChange(data);
  };
  const disabledDate = (current) => {
    return type === 0 && current && current <= startTime;
  };
  return (
    <Row
      gutter={12}
      className="schedule-item"
      style={{ marginLeft: "0", marginRight: "0" }}
    >
      <Col span={6}>
        <Input
          className="item-input"
          value={nameSource.itemName}
          maxLength={20}
          onChange={(e) => {
            handleItemChange(e.target.value, "itemName");
          }}
        />
      </Col>
      <Col span={6}>
        <TimePicker
          className="item-time-picker"
          value={nameSource.itemStartTime}
          onChange={(e) => {
            handleItemChange(e, "itemStartTime");
          }}
          disabled={index !== 0}
        />
      </Col>
      <Col span={4}>
        <Select
          value={nameSource.itemType}
          onChange={(e) => {
            handleItemChange(e, "itemType");
          }}
          className="item-select"
        >
          <Select.Option value={0}>当天</Select.Option>
          <Select.Option value={1}>翌日</Select.Option>
        </Select>
      </Col>
      <Col span={6}>
        <TimePicker
          className="item-time-picker"
          value={nameSource.itemEndTime}
          onChange={(e) => {
            handleItemChange(e, "itemEndTime");
          }}
          disabledDate={disabledDate}
          showNow={false}
        />
      </Col>
      <Col span={2}>
        {index === 0 ? (
          <PlusOutlined
            onClick={() => {
              handleAdd(canAdd);
            }}
          />
        ) : (
          <DeleteOutlined
            onClick={() => {
              handleDel();
            }}
          />
        )}
      </Col>
    </Row>
  );
};

export default ScheduleItem;
