import React, { useState } from 'react';
import FailProgressTimeline from '@Components/fail-progress-timeline';

const parseDataSource = (progressList, noticeList) => {
    const arr: any = [];
    progressList.forEach((item, index) => {
        const currNoticeList = noticeList.filter((notice) => {
            return (
                notice.noticeTime >= item.operateTime && (progressList[index + 1] ? notice.noticeTime < progressList[index + 1].operateTime : true)
            );
        });
        arr.push({
            ...item,
            noticeList: currNoticeList,
        });
    });
    return arr;
};
const Demo = () => {
    const [noticeDetail, setNoticeDetail] = useState([]);
    //发生通知、一级预警、二级预警、三级预警、周期预警1、故障恢复通知
    const noticeList = [
        {
            noticeType: '发生通知', //通知类型
            noticeTypeDesc: '发生通知', //通知类型描述
            noticeTime: '2023-02-05 09:53:10', //通知时间
            noticeRole: 'A角、B角、中心主任、管理员', //通知角色
            noticeId: '11', //通知Id
            msgId: '1', //消息id
        },
        {
            noticeType: '一级预警', //通知类型
            noticeTypeDesc: '一级预警', //通知类型描述
            noticeTime: '2023-02-05 09:54:10', //通知时间
            noticeRole: 'B角、中心主任、管理员', //通知角色
            noticeId: '12', //通知Id
            msgId: '2', //消息id
        },
        {
            noticeType: '二级预警', //通知类型
            noticeTypeDesc: '二级预警', //通知类型描述
            noticeTime: '2023-02-05 09:55:10', //通知时间
            noticeRole: 'A角', //通知角色
            noticeId: '13', //通知Id
            msgId: '3', //消息id
        },
        {
            noticeType: '三级级预警', //通知类型
            noticeTypeDesc: '三级级预警', //通知类型描述
            noticeTime: '2023-02-05 21:46:03', //通知时间
            noticeRole: 'A角、B角、管理员', //通知角色
            noticeId: '14', //通知Id
            msgId: '4', //消息id
        },
        {
            noticeType: '周期预警1', //通知类型
            noticeTypeDesc: '周期预警1', //通知类型描述
            noticeTime: '2023-02-05 21:47:03', //通知时间
            noticeRole: 'A角、B角、中心主任、管理员', //通知角色
            noticeId: '15', //通知Id
            msgId: '5', //消息id
        },
        {
            noticeType: '故障恢复通知', //通知类型
            noticeTypeDesc: '故障恢复通知', //通知类型描述
            noticeTime: '2023-02-08 14:49:21', //通知时间
            noticeRole: 'A角、B角', //通知角色
            noticeId: '16', //通知Id
            msgId: '6', //消息id
        },
        {
            noticeType: '故障恢复通知', //通知类型
            noticeTypeDesc: '故障恢复通知', //通知类型描述
            noticeTime: '2023-02-12 21:23:05', //通知时间
            noticeRole: 'A角、B角', //通知角色
            noticeId: '16', //通知Id
            msgId: '6', //消息id
        },
    ];

    const progressList = [
        {
            operater: '江苏综合监控',
            operateDetail: '2023-02-05 09:53:10,江苏综合监控(13022502000)将工单主送给黄虎-13064944326。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: '9ac9d652867b4e009b2f1814cffdc5b9',
            operateTime: '2023-02-05 09:53:10',
            activityName: '派单',
            operateType: '拟稿派单',
            files: [],
            processNode: '派单',
        },
        {
            operater: '黄虎',
            operateDetail: '2023-02-05 10:14:09，江苏省分公司-连云港市分公司-连云港代维-连云港市和勤通信技术有限公司的黄虎13064944326已受理。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: 'e9c819af93a54b349e7cf34d128ffbb2',
            operateTime: '2023-02-05 10:14:09',
            activityName: '受理',
            operateType: '受理',
            files: [],
            processNode: '受理',
        },
        {
            operater: '黄虎',
            operateDetail:
                '2023-02-05 21:47:03，江苏省分公司-连云港市分公司-连云港代维-连云港市和勤通信技术有限公司的黄虎13064944326已到达现场 ，经度【119.233637】，纬度【34.615312】，实际现场打点【否】。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: 'caf83d36cb1a4ff49248627867728588',
            operateTime: '2023-02-05 21:47:03',
            activityName: '处理',
            operateType: '现场打点',
            files: [],
            processNode: '处理',
        },
        {
            operater: '黄虎',
            operateDetail:
                '2023-02-05 21:48:43，江苏省分公司-连云港市分公司-连云港代维-连云港市和勤通信技术有限公司的黄虎13064944326进行了问题定位操作，反馈内容【弱电间线路故障，物业在处理】。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: '4361062e83404e7882dfe46073f3d8a8',
            operateTime: '2023-02-05 21:48:43',
            activityName: '处理',
            operateType: '阶段反馈',
            files: [
                {
                    createPName: '张三',
                    attId: 'd689eca636d24ccbae2c218ca79c524e',
                    createTime: '2023-02-05 21:48:26',
                    processId: '4361062e83404e7882dfe46073f3d8a8',
                    attGroupKey: '51d312e52a9d4a0aadc85d6b90598334',
                    sheetCreateTime: '2023-02-05 21:48:22',
                    createPCode: 'zhangsan',
                    attOrigName: '2023_02_05_10_37_30.jpg',
                    attSuffix: '.jpg',
                    processNode: '阶段反馈',
                },
            ],
            processNode: '处理',
        },
        {
            operater: '黄虎',
            operateDetail: '2023-02-05 21:48:46，江苏省分公司-连云港市分公司-连云港代维-连云港市和勤通信技术有限公司的黄虎13064944326已处理完毕。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: 'f45155af25294a5c99e4d7ac503723e1',
            operateTime: '2023-02-05 21:48:46',
            activityName: '处理',
            operateType: '处理完成',
            files: [],
            processNode: '处理',
        },
        {
            operater: '江苏综合监控',
            operateDetail: '2023-02-06 03:49:19，自动消障。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: 'd527110f0924431c834c9aa89ab83866',
            operateTime: '2023-02-05 21:48:47',
            activityName: '消障确认',
            operateType: '消障确认',
            files: [],
            processNode: '消障确认',
        },
        {
            operater: '黄虎',
            operateDetail:
                '2023-02-08 14:49:19，江苏省分公司-连云港市分公司-连云港代维-连云港市和勤通信技术有限公司的黄虎13064944326进行了定性处理。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: 'f51029541ca3477183bee61f70e8fb79',
            operateTime: '2023-02-06 03:49:21',
            activityName: '定性',
            operateType: '故障定性',
            files: [],
            processNode: '定性',
        },
        {
            operater: '王小冬',
            operateDetail:
                '2023-02-12 21:23:04，江苏省分公司-连云港市分公司-网络部的王小冬15651499165进行定性审核，审核结果【审核通过】，审核意见【同意】。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: 'eea9ca16d38a4d4e95a4ff431e620765',
            operateTime: '2023-02-08 14:49:21',
            activityName: '定性审核',
            operateType: '定性审核',
            files: [],
            processNode: '定性审核',
        },
        {
            operater: '王小冬',
            operateDetail: '已归档。',
            woId: '51d312e52a9d4a0aadc85d6b90598334',
            processId: '6ff62f24692e456389605c52f141b158',
            operateTime: '2023-02-12 21:23:05',
            activityName: '归档',
            operateType: '归档',
            files: [],
            processNode: '归档',
        },
    ];

    const finalData = parseDataSource(progressList, noticeList);
    console.log('====', finalData);

    const onNoticeChange = (item) => {
        console.log(204, item);
        const dataSource: any = [
            {
                key: 1,
                noticeRole: String(Math.random() * 10),
                noticeUser: `张三(13333333333)`,
            },
        ];
        setNoticeDetail(dataSource);
    };

    return <FailProgressTimeline finalData={finalData} onNoticeChange={onNoticeChange} noticeDetail={noticeDetail} />;
};
export default Demo;
