import Enums from '@Src/common/enum';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';

/**
 * 通过Id获取表单元素初始值
 * @param {规则动作} data
 * @param {规则动作Key} key
 */
const getInitValueBykey = (data, key) => {
    const tempObj = data.find((item) => item.key === key);
    if (_.isEmpty(tempObj)) {
        return false;
    }
    return tempObj.value;
};

// eslint-disable-next-line consistent-return
export const getEditValues = (initialValues) => {
    let newValues = {};
    if (initialValues && Array.isArray(initialValues)) {
        newValues = {
            ...newValues,
            isProjectAlarmNoProcess: Boolean(Number(getInitValueBykey(initialValues, 'restrain_projectalarm'))),
            selectedTask: getInitValueBykey(initialValues, 'autoTaskId'),
            selectedTaskName: getInitValueBykey(initialValues, 'autoTaskName'),
            delayTime: getInitValueBykey(initialValues, 'delayTime'),
            frequency: Number(getInitValueBykey(initialValues, 'frequency')),
        };

        const timeperiod = getInitValueBykey(initialValues, 'Timeperiod');
        if (timeperiod) {
            newValues = {
                ...newValues,
                isforwardTime: true,
                forwardTime: [moment(timeperiod.split('~')[0], 'HH:mm'), moment(timeperiod.split('~')[1], 'HH:mm')],
            };
        }

        const relationshipAction = getInitValueBykey(initialValues, 'related');
        // debugger;
        if (relationshipAction) {
            newValues = {
                ...newValues,
                relationshipAction: Number(relationshipAction),
            };
        }
        return newValues;
    }
};

export const initialValues = {
    belongRuleID: -1,
    isProjectAlarmNoProcess: true,
    delayTime: 30,
    isforwardTime: false,
    forwardTime: [moment('08:00', 'HH:mm'), moment('18:00', 'HH:mm')],
    relationshipAction: 1,
    frequency: 0,
    // selectedTask: '',
    // selectedTaskName: '',
};

export const columns = [
    {
        dataIndex: 'task_id',
        title: '任务id',
        width: 120,
    },
    {
        dataIndex: 'task_type',
        title: '任务类型',
        width: 200,
        render: (text) => {
            return Enums.taskMap.getName(text);
        },
    },
    {
        dataIndex: 'task_name',
        title: '任务名称',
        ellipsis: true,
        width: 200,
    },
    {
        dataIndex: 'object_name',
        title: '设备类型',
        width: 120,
    },
    {
        dataIndex: 'vendor_name',
        title: '厂家',
        width: 150,
    },
    {
        dataIndex: 'script_name',
        title: '任务脚本',
        width: 220,
    },
];

/**
 * 测试用
 */
export const initTaskData = [
    {
        taskId: 30009,
        subType: '活动告警触发',
        name: '华为_LTE小区不可用告警',
        objectName: 'ENodeB',
        vendorText: '华为',
        cmdline: 'LTECellUnavailable_1HW.groovy',
        description: '华为_LTE小区不可用告警',
    },
    {
        taskId: 30008,
        subType: '活动告警触发',
        name: '中兴_gNodeB退服',
        objectName: 'GNodeB',
        vendorText: '中兴',
        cmdline: 'GNodeBOutService5G_ZTE.groovy',
        description: '中兴_gNodeB退服',
    },
    {
        taskId: 30007,
        subType: '活动告警触发',
        name: '爱立信_网元链路断',
        objectName: 'GNodeB',
        vendorText: '爱立信',
        cmdline: 'NELinkBreak5G_ALX.groovy',
        description: '爱立信_网元链路断',
    },
    {
        taskId: 30005,
        subType: '活动告警触发',
        name: '中兴_DU小区退服',
        objectName: 'GNodeB',
        vendorText: '中兴',
        cmdline: 'DUServiceUnavailable5G_ZTE.groovy',
        description: '中兴_DU小区退服',
    },
    {
        taskId: 30004,
        subType: '活动告警触发',
        name: 'OSPF接口认证失败预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'OSPFInterfaceAuthenticationFailed.groovy',
        description: 'OSPF接口认证失败预处理',
    },
    {
        taskId: 30003,
        subType: '活动告警触发',
        name: 'linkDown智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'LinkDown.groovy',
        description: 'linkDown智能预处理',
    },
    {
        taskId: 30002,
        subType: '活动告警触发',
        name: '物理实体拔出告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'PhysicalEntityChange.groovy',
        description: '物理实体拔出告警智能预处理',
    },
    {
        taskId: 30001,
        subType: '活动告警触发',
        name: 'OSPF接口状态改变告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'OSPFInterfaceStateChange.groovy',
        description: 'OSPF接口状态改变告警智能预处理',
    },
    {
        taskId: 30000,
        subType: '活动告警触发',
        name: 'ISIS邻居状态变化告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'ISISNeighborStateChange.groovy',
        description: 'ISIS邻居状态变化告警智能预处理',
    },
    {
        taskId: 29999,
        subType: '活动告警触发',
        name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'SDHAndCREError.groovy',
        description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
    },
    {
        taskId: 29998,
        subType: '活动告警触发',
        name: '存储介质使用率超过预警极限告警预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'StorageMediumUsageExceedsLimit.groovy',
        description: '存储介质使用率超过预警极限告警预处理',
    },
    {
        taskId: 29997,
        subType: '活动告警触发',
        name: 'BGP状态改变告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'BGPStateChange.groovy',
        description: 'BGP状态改变告警智能预处理',
    },
    {
        taskId: 29996,
        subType: '活动告警触发',
        name: '中兴_gNodeB退服',
        objectName: 'GNodeB',
        vendorText: '中兴',
        cmdline: 'GNodeBOutService5G_ZTE.groovy',
        description: '中兴_gNodeB退服',
    },
    {
        taskId: 29995,
        subType: '活动告警触发',
        name: '爱立信_网元链路断',
        objectName: 'GNodeB',
        vendorText: '爱立信',
        cmdline: 'NELinkBreak5G_ALX.groovy',
        description: '爱立信_网元链路断',
    },
    {
        taskId: 29994,
        subType: '活动告警触发',
        name: '中兴_DU小区退服',
        objectName: 'GNodeB',
        vendorText: '中兴',
        cmdline: 'DUServiceUnavailable5G_ZTE.groovy',
        description: '中兴_DU小区退服',
    },
    {
        taskId: 29993,
        subType: '活动告警触发',
        name: 'OSPF接口认证失败预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'OSPFInterfaceAuthenticationFailed.groovy',
        description: 'OSPF接口认证失败预处理',
    },
    {
        taskId: 29992,
        subType: '活动告警触发',
        name: 'linkDown智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'LinkDown.groovy',
        description: 'linkDown智能预处理',
    },
    {
        taskId: 29991,
        subType: '活动告警触发',
        name: '物理实体拔出告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'PhysicalEntityChange.groovy',
        description: '物理实体拔出告警智能预处理',
    },
    {
        taskId: 29990,
        subType: '活动告警触发',
        name: 'OSPF接口状态改变告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'OSPFInterfaceStateChange.groovy',
        description: 'OSPF接口状态改变告警智能预处理',
    },
    {
        taskId: 29989,
        subType: '活动告警触发',
        name: 'ISIS邻居状态变化告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'ISISNeighborStateChange.groovy',
        description: 'ISIS邻居状态变化告警智能预处理',
    },
    {
        taskId: 29988,
        subType: '活动告警触发',
        name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'SDHAndCREError.groovy',
        description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
    },
    {
        taskId: 29987,
        subType: '活动告警触发',
        name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'SDHAndCREError.groovy',
        description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
    },
    {
        taskId: 29986,
        subType: '活动告警触发',
        name: '存储介质使用率超过预警极限告警预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'StorageMediumUsageExceedsLimit.groovy',
        description: '存储介质使用率超过预警极限告警预处理',
    },
    {
        taskId: 29985,
        subType: '活动告警触发',
        name: 'BGP状态改变告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'BGPStateChange.groovy',
        description: 'BGP状态改变告警智能预处理',
    },
    {
        taskId: 29984,
        subType: '活动告警触发',
        name: '中兴_gNodeB退服',
        objectName: 'GNodeB',
        vendorText: '中兴',
        cmdline: 'GNodeBOutService5G_ZTE.groovy',
        description: '中兴_gNodeB退服',
    },
    {
        taskId: 29983,
        subType: '活动告警触发',
        name: '爱立信_网元链路断',
        objectName: 'GNodeB',
        vendorText: '爱立信',
        cmdline: 'NELinkBreak5G_ALX.groovy',
        description: '爱立信_网元链路断',
    },
    {
        taskId: 29982,
        subType: '活动告警触发',
        name: '中兴_DU小区退服',
        objectName: 'GNodeB',
        vendorText: '中兴',
        cmdline: 'DUServiceUnavailable5G_ZTE.groovy',
        description: '中兴_DU小区退服',
    },
    {
        taskId: 29981,
        subType: '活动告警触发',
        name: 'OSPF接口认证失败预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'OSPFInterfaceAuthenticationFailed.groovy',
        description: 'OSPF接口认证失败预处理',
    },
    {
        taskId: 29980,
        subType: '活动告警触发',
        name: 'linkDown智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'LinkDown.groovy',
        description: 'linkDown智能预处理',
    },
    {
        taskId: 29979,
        subType: '活动告警触发',
        name: '物理实体拔出告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'PhysicalEntityChange.groovy',
        description: '物理实体拔出告警智能预处理',
    },
    {
        taskId: 29978,
        subType: '活动告警触发',
        name: 'OSPF接口状态改变告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'OSPFInterfaceStateChange.groovy',
        description: 'OSPF接口状态改变告警智能预处理',
    },
    {
        taskId: 29977,
        subType: '活动告警触发',
        name: 'ISIS邻居状态变化告警智能预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'ISISNeighborStateChange.groovy',
        description: 'ISIS邻居状态变化告警智能预处理',
    },
    {
        taskId: 29976,
        subType: '活动告警触发',
        name: 'SDH错误在设定时间内高于设定告警个数告警预处理',
        objectName: 'router',
        vendorText: '华为',
        cmdline: 'SDHAndCREError.groovy',
        description: 'SDH错误在设定时间内高于设定告警个数告警预处理',
    },
];
