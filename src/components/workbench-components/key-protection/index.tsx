import React from 'react';
import './style.less';
import { Progress } from 'oss-ui';
// import { OssPiePlotChart } from 'oss-chart';
import { VirtualTable } from 'oss-web-common';

// const data = [
//     { type: '常规', count: 8 },
//     { type: '个性', count: 4 },
// ];

const columns = [
    {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: 10,
        align: 'center',
    },
    {
        title: '故障数',
        key: 'fault',
        dataIndex: 'fault',
        width: 10,
        align: 'center',
    },
    {
        title: '遗留',
        key: 'num',
        dataIndex: 'num',
        width: 10,
        align: 'center',
    },
];

const dataSource = [
    { name: '五一劳动节', fault: '1', num: '1' },
    { name: '五一劳动节', fault: '1', num: '1' },
    { name: '五一劳动节', fault: '1', num: '1' },
];

/**
 * 这是在项目中用过的配置
 */
// const config = {
//     legend: { itemName: { style: { fill: '#000' } }, visible: false },
//     radius: 0.8,
//     innerRadius: 0.8,
//     pieStyle: {
//         lineWidth: 0,
//     },
//     label: {
//         autoHide: false,
//         visible: true,
//         type: 'spider', //标注线类型
//         content: '{name}{value}',
//         style: {
//             textAlign: 'center',
//             fill: '#000',
//             fontSize: 14,
//         },
//     },
//     interactions: [{ type: 'element-active' }],
//     statistic: {
//         title: {
//             style: {
//                 fontSize: 14,
//                 color: '#8E9297',
//             },
//             formatter: () => '所有重保',
//         },
//         content: {
//             style: {
//                 fontSize: 30,
//                 color: '#000000',
//             },
//             offsetY: 10,
//         },
//     },
// };

const DialTest = () => {
    return (
        <div className="key-protection-continer">
            {/* <div className="title">
                重保总结
                <div className="title-jump">more {'>'}</div>
            </div> */}

            <div className="demo">
                <div className="demo-left">
                    <div className="left-chart">
                        {/* <OssPiePlotChart {...config} data={data} /> */}
                        <Progress
                            type="circle"
                            percent={75}
                            strokeWidth={10}
                            format={() => {
                                return (
                                    <div className="view-component-home-page-tabs-progress-content">
                                        <div style={{ fontSize: '1.6vh', color: 'rgba(144,152,174)' }}>所有重保</div>
                                        <div style={{ fontSize: '3vh' }}>3</div>
                                    </div>
                                );
                            }}
                        />
                    </div>
                    <div className="left-title">
                        <div className="button-name">
                            <div className="name">常规重保</div>
                            <div className="num">1</div>
                        </div>
                        <div className="button-name">
                            <div className="name">个性重保</div>
                            <div className="num">1</div>
                        </div>
                    </div>
                </div>

                <div className="demo-right">
                    <div className="right-title">最近重保</div>
                    <div className="right-table">
                        <VirtualTable
                            scroll={false}
                            global={window}
                            pagination={false}
                            dataSource={dataSource}
                            columns={columns}
                            bordered={false}
                            search={false}
                            options={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DialTest;
