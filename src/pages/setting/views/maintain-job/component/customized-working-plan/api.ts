import { _ } from 'oss-web-toolkits';
import request from '@Common/api';

import { buildTableDataSourceWithProject } from './WorkingPlanTableItem';

/**
 * @doc http://10.10.2.8:9091/project/57/interface/api/22024
 * - "groupId": 1231751742,
 * - "workShiftId": 1001033,
 * - "dateTime": "2024-08-31"
 */
export const getCustomWorkingPlanRecordApi = async (data: any) => {
    // console.log('log---------------', data);

    try {
        const result = await request('group/findWorkingPlanRecord', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data: {
                ...data,
                // groupId: 1231751742,
                // workShiftId: 1001033,
                // dateTime: '2024-08-31',
            },
        });
        // @ts-ignore
        // const result = await import('./data-findWorkingPlanRecord.json');
        // console.log('log------------------', data);

        const projects = _.get(result, 'data.projects') ?? [];

        if (_.isEmpty(projects)) return { dataSourceList: [], projects: [], header: null };
        // console.log('log---------------', projects);
        const dataSourceList = projects.map((project: any) => {
            return buildTableDataSourceWithProject(project);
        });

        return { dataSourceList, projects: JSON.parse(JSON.stringify(projects)), header: _.get(result, 'data.header') ?? null };
    } catch (error) {
        //
        return Promise.resolve({
            dataSourceList: [],
            projects: [],
            header: null,
        });
    }
};

/**
 * @doc http://10.10.2.8:9091/project/57/interface/api/22042
 * projects
 * provinceId
 * groupId
 * workShiftId
 * workingPlanId
 * dateTime
 */
export const saveCustomWorkingPlanRecordApi = async (data: any) => {
    try {
        const result = await request('group/saveWorkingPlanRecord', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        });

        if (result.code === 200) {
            return { status: 'success', result };
        }

        return { status: 'error', result };
    } catch (error) {
        //
        return { status: 'error', result: error };
    }
};

/**
 * @doc http://10.10.2.8:9091/project/57/interface/api/22195
 */
export const getCustomWorkingPlanTabListApi = async () => {
    try {
        const result = await request('group/findCustomWorkingPlanScene', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
        });

        // 处理数据

        const data = _.get(result, 'data') ?? [];
        return data.map((d: any) => ({ raw: d, label: d.sceneName, id: `${d.sceneId}` }));
    } catch (error) {
        //
        return Promise.resolve([]);
    }
};
