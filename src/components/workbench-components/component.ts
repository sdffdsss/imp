// import type { ReactNode } from 'react';
// import ComPlaintPedding from './complaint-pedding';
// import MonitorPeddingAlarmWindow from './monitor-pedding-alarm-window';
import constants from '@Common/constants';
import DefaultComponent from './defaultComponent';
// import PatrolOperationPlan from './patrol-operation-plan';
// import SecantReceptionOffice from './secant-reception-office';
// import SecantReceptionOfficeDb from './secant-reception-office-db';
import ChangeShifts from './change-shifts';
import FaultCommand from './fault-command715';
// import KeyProtection from './key-protection';
// import CutOver from './cut-over';
// import DialTest from './dial-test';
// import FaultManage from './fault-manage';
// import FaultScheduling from './fault-scheduling';
import MonitorTitle from './monitor-title';
import MonitorVisual from './monitor-visual';
import AlarmProgressLine from './alarm-progress-line';
import SheetProgressLine from './sheet-progress-line';

interface PropsType {
    sheetNo?: string;
    optionValues?: string[];
    loading?: string;
    theme?: string;
}
interface SettingType {
    id: string;
    name: string;
}

interface ComponetType {
    id: string;
    name: string;
    key: string;
    title?: string;
    component: React.FC<PropsType>;
    config?: Record<string, any>;
    extra?: {
        type?: string | boolean;
        openUrl?: string;
        openId?: string;
        openName?: string;
        setting?: SettingType[];
        direction: string;
        loading?: boolean;
    };
}
export const componentEmus: ComponetType[] = [
    {
        id: '1',
        name: '交接班待办',
        key: 'change-shifts',
        extra: {
            type: 'openUrl',
            openUrl: `/unicom/home-unicom/setting/change-shifts-page`,
            openId: '300016',
            direction: 'left',
            loading: true,
        },
        component: ChangeShifts,
    },
    {
        id: '2',
        name: '调度待办',
        key: '',
        extra: {
            type: 'openUrl',
            openUrl: `/unicom/home/troubleshooting-workbench`,
            openId: '300019',
            direction: 'right',
            loading: true,
        },
        component: FaultCommand,
    },
    // {
    //     id: '3',
    //     name: '故障沟通待办',
    //     extra: {
    //         type: 'openUrl',
    //         openUrl: '/unicom/home/troubleshooting-workbench',
    //         direction: 'right',
    //     },
    //     component: FaultManage,
    // },
    // {
    //     id: '4',
    //     name: '故障调度任务',
    //     extra: {
    //         type: 'openUrl',
    //         openUrl: '/unicom/home/troubleshooting-workbench',
    //         direction: 'right',
    //     },
    //     component: FaultScheduling,
    // },
    {
        id: '5',
        name: '监控中心视图',
        key: 'monitor-center',
        extra: {
            type: false,
            openUrl: '',
            direction: 'right',
        },
        component: MonitorTitle,
    },
    // {
    //     id: '6',
    //     name: '监控待办-流水窗',
    //     title: '监控待办',
    //     extra: {
    //         type: 'openUrl',
    //         openUrl: '/unicom/home-unicom/alarm-window-unicom/duty-window',
    //         direction: 'left',
    //     },
    //     component: MonitorPeddingAlarmWindow,
    // },
    {
        id: '7',
        name: '监控待办可视化',
        key: 'monitor-todo',
        title: '监控待办',
        extra: {
            type: 'openUrl',
            openUrl: `/overview/overview-monitor`,
            direction: 'right',
            openId: '300022',
            loading: true,
        },
        component: MonitorVisual,
    },
    {
        id: '8',
        name: '告警流水中断监测',
        key: 'alarm-interrupt-monitor',
        extra: {
            type: 'openUrl',
            openUrl: `/unicom/alarm-interrupt-monitor/999`,
            openId: '300023',
            direction: 'right',
        },
        component: AlarmProgressLine,
    },
    {
        id: '9',
        name: '告警采集中断监测',
        key: 'alarm-collect-monitor',
        extra: {
            type: false,
            openUrl: '',
            direction: 'right',
        },
        component: SheetProgressLine,
    },

    // {
    //     id: '10',
    //     name: '投诉待办任务',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'left',
    //     },
    //     component: ComPlaintPedding,
    // },
    // {
    //     id: '11',
    //     name: '巡检作业计划',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'right',
    //     },
    //     component: PatrolOperationPlan,
    // },
    // {
    //     id: '12',
    //     name: '重保任务',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'right',
    //     },
    //     component: ComPlaintPedding,
    // },
    // {
    //     id: '13',
    //     name: '拨测待办任务',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'right',
    //     },
    //     component: DialTest,
    // },
    // {
    //     id: '14',
    //     name: '重保总结',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'right',
    //     },
    //     component: KeyProtection,
    // },
    // {
    //     id: '15',
    //     name: '割接总结',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'right',
    //     },
    //     component: CutOver,
    // },
    // {
    //     id: '17',
    //     name: '工程预约待办',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'left',
    //     },
    //     component: SecantReceptionOfficeDb,
    // },
    // {
    //     id: '16',
    //     name: '割接任务待办',
    //     extra: {
    //         type: false,
    //         openUrl: '',
    //         direction: 'left',
    //     },
    //     component: SecantReceptionOffice,
    // },
];

export const getComponetField = (id: string): ComponetType => {
    const field = componentEmus.find((item) => item.id === id) || { id: '', name: '', component: DefaultComponent };
    return field;
};
