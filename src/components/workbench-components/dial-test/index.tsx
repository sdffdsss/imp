import React from 'react';
import './style.less';
import {} from 'oss-ui';
import { OssColumnPlotChart } from 'oss-chart';

const data = [
    { x: '人工待拨', y: 3 },
    { x: '人工已拨', y: 4 },
    { x: '人工未拨通', y: 9 },
];

const machineData = [
    { x: '机器待拨', y: 3 },
    { x: '机器已拨', y: 4 },
    { x: '机器未拨通', y: 9 },
];

const config = {
    color: '#3195F2',
    xAxis: {
        label: { style: { fill: '#CBD3E1' } },
        line: {
            style: {
                stroke: '#CACACA',
                lineWidth: 1,
            },
        },
    },
    yAxis: {
        label: { style: { fill: '#CBD3E1' } },
        line: {
            style: {
                stroke: '#CACACA',
                lineWidth: 1,
                color: '#000000',
            },
        },
        grid: {
            line: {
                style: {
                    stroke: '#EFEFEF',
                    lineWidth: 1,
                    lineDash: [4, 5],
                    strokeOpacity: 0.7,
                    shadowColor: '#EFEFEF',
                    shadowBlur: 10,
                    cursor: 'pointer',
                },
            },
        },
    },
    legend: { itemName: { style: { fill: '#000' } } },
    columnStyle: {
        radius: 10,
    },
};

const DialTest = () => {
    return (
        <div className="dial-test-continer">
            {/* <div className="title">
                交接班待办
                <div className="title-jump">more {'>'}</div>
            </div> */}

            <div className="demo">
                <div className="demo-left">
                    <div className="left-title">
                        <div className="left-name">人工任务</div>
                        <div className="left-num">10</div>
                    </div>
                    <div className="left-title">
                        <div className="left-name">机器任务</div>
                        <div className="left-num">10</div>
                    </div>
                </div>

                <div className="demo-right">
                    <div className="picture-right">
                        <OssColumnPlotChart {...config} data={data} theme={{ maxColumnWidth: 12 }} />
                    </div>
                    <div className="picture-right">
                        <OssColumnPlotChart {...config} data={machineData} theme={{ maxColumnWidth: 12 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DialTest;
