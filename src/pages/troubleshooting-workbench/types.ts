export type workbenchType = 'group' | 'province' | 'other' | 'none';
// 1:负责人 2:分管领导 3:值班长 4:其他人员
export enum MonitorCenterRoleEnum {
    leader = 1,
    'department-leader',
    'onduty-leader',
    'other-role',
}
// 客服舆情信息专业
export const PUBLIC_OPINION = '16';
