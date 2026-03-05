import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import { Image, Tooltip } from 'oss-ui';
import gjzl from '../img/告警组合.svg';
import wqwq from '../img/未清除未确认.svg';
import wqyq from '../img/未清除已确认.svg';
import yqwq from '../img/已清除未确认.svg';
import yqyq from '../img/已清除已确认.svg';
import * as echarts from 'echarts';
let chartInstance;
const FaultList = (props) => {
  const { title, data, chartData } = props;
  const [alarmLsit, setAlarmLsit] = useState<any>([]);
  const [activeKey, setActiveKey] = useState('activeAlarmCount');
  const [total, setTotal] = useState(0);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartData && chartInstance) {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          position: function (point, params, dom, rect, size) {
            // 提示框位置
            let x = 0;
            let y = 0;
            if (point[0] + size.contentSize[0] + 10 > size.viewSize[0]) {
              x = point[0] - size.contentSize[0] - 10;
            } else {
              x = point[0] + 10;
            }
            if (point[1] + size.contentSize[1] + 10 > size.viewSize[1]) {
              y = point[1] - size.contentSize[1];
            } else {
              y = point[1] - 10;
            }
            return [x, y];
          },
          formatter: (params) => {
            const { name, data } = params[0];
            return `
                             <div style="font-size: 14px;font-family: font-weight: 500;color: #000;margin-right: 8px;">${name}</div>
                             <div style="font-size: 14px;font-family: font-weight: 500;color: #3377FF;">${data}</div>
                             `;
          },
          extraCssText:
            'display: flex;background-color:#fff;padding: 8px 10px;box-shadow: 1px 6px 15px 1px rgba(0,0,0,0.13);border-radius: 4px;filter: blur(undefinedpx);border:none;',
        },
        grid: {
          top: '15%', //上边距
          left: '4%', //左边距
          right: '4%', //右边距
          bottom: '5%', //下边距
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: chartData[activeKey]?.name,
          axisTick: {
            show: false, //隐藏X轴刻度
          },
          axisLine: {
            lineStyle: {
              color: '#CCCCCC',
            },
          },
          axisLabel: {
            show: true,
            margin: 10,
            textStyle: {
              color: 'rgba(0,0,0,0.45)',
              fontSize: 12,
            },
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '单位：数',
            min: 0,
            splitNumber: 3,
            nameGap: 15,
            nameTextStyle: {
              color: 'rgba(0,0,0,0.45)',
              fontSize: 12,
              align: 'center',
              verticalAlign: 'bottom',
            },
            axisLabel: {
              interVal: 0,
              margin: 2,
              color: 'rgba(0,0,0,0.65)',
              textStyle: {
                fontSize: 12,
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(223, 223, 223, 1)',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(223, 223, 223, 1)',
                type: 'dashed',
              },
            },
          },
        ],
        series: [
          {
            type: 'bar',
            data: chartData[activeKey]?.value,
            itemStyle: {
              color: '#1890FF',
              barBorderRadius: [6, 6, 6, 6],
            },
            barWidth: 12,
          },
        ],
      };

      chartInstance.setOption(option);
    }
  }, [activeKey, chartData]);
  useEffect(() => {
    if (data) {
      console.log(data);

      setTotal(data['activeAlarmCount']);
      setAlarmLsit(
        alarmDataEnum.map((item) => {
          return { ...item, count: data[item.key] };
        }),
      );
    }
  }, [data]);
  useEffect(() => {
    chartInstance = echarts.init(chartRef.current);

    window.onresize = () => {
      chartInstance.resize();
    };
    return () => {
      echarts.dispose(chartRef.current);
    };
  }, []);

  const alarmDataEnum = [
    {
      img: wqwq,
      count: 0,
      title: '未清除未确认',
      key: 'noClearNoConfirmCount',
    },
    {
      img: wqyq,
      count: 0,
      title: '未清除已确认',
      key: 'noClearYesConfirmCount',
    },
    {
      img: yqwq,
      count: 0,
      title: '已清除未确认',
      key: 'yesClearNoConfirmCount',
    },
    {
      img: yqyq,
      count: 0,
      title: '已清除已确认',
      key: 'yesClearYesConfirmCount',
    },
  ];

  return (
    <div className="alarm-statistics-page">
      <div className="duty-view-title">{title}</div>
      <div className="alarm-statistics-page-tab">
        <div className="alarm-statistics-page-tab-left">
          <Image src={gjzl} preview={false} />
          <div className="alarm-statistics-page-tab-left-total">
            <div
              className="count"
              onClick={() => {
                setActiveKey('activeAlarmCount');
              }}
            >
              {total}
            </div>
            <div className="title">{'告警总量'}</div>
          </div>
        </div>
        <div className="alarm-statistics-page-tab-right">
          {alarmLsit.map((item, i) => {
            const { img, count, title, key } = item;
            return (
              <div className="alarm-statistics-page-tab-right-item" key={key}>
                <div className="alarm-statistics-page-tab-right-item-insert">
                  <Image src={img} preview={false} />
                  <div className="alarm-statistics-page-tab-right-item-insert-right">
                    <div
                      className="count"
                      onClick={() => {
                        setActiveKey(key);
                      }}
                    >
                      {count}
                    </div>
                    <Tooltip title={title}>
                      <div className="title">{title}</div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="alarm-statistics-page-bar">
        <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );
};

export default FaultList;
