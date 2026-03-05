/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Input, Table } from "oss-ui";
import DateRangeTime from "@Components/date-range-time";
import { _ } from "oss-web-toolkits";
import ScheduleItem from "./items";
import moment from "moment";
import "./index.less";

const Nzh = require("nzh");
const nzhcn = Nzh.cn;   

const GroupSchedule = (props) => {
  const [form] = Form.useForm();
  const [scheduleTime, handleScheduleTime] = useState([]);
  const [dataSource, handleDataSource] = useState([
    {
      userGroup: [],
    },
  ]);
  const handleAdd = (item, index) => {
    const data = _.cloneDeep(dataSource);
    data.push({
      userGroup: [],
    });
    handleDataSource(data);
  };
  const [exampleColumns, handleExampleColumns] = useState([]);
  const [exampleSource, handleExampleSource] = useState([]);
  const handleDelete = (item, index) => {
    const data = _.cloneDeep(dataSource);
    data.splice(index, 1);
    handleDataSource(data);
  };
  const disabledDate = (current, disabledDates) => {
    // Can not select days before today
    return (
      (current && current < moment().startOf("day").subtract("day", -1)) ||
      (current &&
        current > moment().endOf("month").subtract("month", -2).endOf("month"))
    );
  };
  const onItemChange = (val, index) => {
    const data = _.cloneDeep(dataSource);
    data[index].userGroup = val;
    handleDataSource(data);
  };

  // 处理排班示例数据
  const handleExampleData = (schedule, data) => {
    //schedule 班次数据 data 数据源
    const a = data.length;
    const b = schedule.length;
    let count = 1;
    let test = [];
    for (let i = 0; i < 7; i += 1) {
      test[i] = [];
      for (let j = 0; j < b; j += 1) {
        test[i][j] = count;
        if (count < a) {
          count += 1;
        } else {
          count = 1;
        }
      }
    }
    const newList = {};
    const newData = [];
    if (Array.isArray(schedule)) {
      schedule.map((item, index) => {
        for (let i = 0; i < 7; i += 1) {
          newList[i] = `第${nzhcn.encodeS(test[i][index])}组`;
        }
        return newData.push({
          scheduleName: item.workShiftName,
          ...newList,
        });
      });
    }
    handleExampleSource(newData);
  };

  useEffect(() => {
    if (scheduleTime && scheduleTime[1] && scheduleTime[0] && dataSource) {
      props.getAutoScheduleData &&
        props.getAutoScheduleData({
          userGroup: dataSource,
          beginDate: scheduleTime[0],
          endDate: scheduleTime[1],
        });
      const list = [
        {
          title: "班次",
          dataIndex: "scheduleName",
        },
        {
          title: (
            <div>
              <p>星期</p>
              <p>日期</p>
            </div>
          ),
        },
      ];
      const newTime = _.cloneDeep(scheduleTime[0])
      for (let i = 0; i <= 6; i += 1) {
        const a = newTime.startOf("day").subtract("day", -1);
        list.push({
          title: (
            <div>
              <p>{`周${nzhcn.encodeS(a.day() || 7)}`}</p>
              <p>{`${a.get("month") + 1}月${a.get("date")}日`}</p>
            </div>
          ),
          dataIndex: i,
        });
      }
      handleExampleColumns(list);
      handleExampleData(props.scheduleRes, dataSource);
    }
  }, [props.scheduleRes, scheduleTime, dataSource]);
  return (
    <div>
      <Form
        labelAlign="right"
        form={form}
        initialValues={{
          provinceId: props.rowData.provinceName,
          groupId: props.rowData.groupName,
          centerId: props.rowData.centerName,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              label="归属省份"
              name="provinceId"
              required
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              label="监控班组"
              name="groupId"
              required
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              label="归属监控中心"
              name="centerId"
              required
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              label="排班时间"
              name="scheduleTime"
              required
            >
              <DateRangeTime
                disabledDate={disabledDate}
                value={scheduleTime}
                onChange={(e) => {
                  handleScheduleTime(e);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 3 }}
              label="排班人员"
              name="scheduleMan"
              required
            >
              <div className="auto-schedule-container">
                {dataSource.map((item, index) => {
                  return (
                    <ScheduleItem
                      key={index}
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
                      {...props}
                    />
                  );
                })}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "center", marginBottom: "20px" }}>
            <Button
              type="primary"
              onClick={() => {
                handleAdd();
              }}
            >
              新增排班组
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 3 }} label="排班示例">
              <Table
                pagination={false}
                columns={exampleColumns}
                dataSource={exampleSource}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default GroupSchedule;
