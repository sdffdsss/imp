import { _ } from 'oss-web-toolkits';
import request from '@Common/api';

import { buildTableDataSourceWithProject } from './WorkingPlanTableItem';

/**
 * @doc http://10.10.2.8:9091/project/57/interface/api/21943
 */
export const getCustomWorkingPlanApi = async (data: any) => {
    try {
        const result = await request('group/getCustomWorkingPlan', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data,
        });

        const projects = _.get(result, 'data.projects') ?? [];

        if (_.isEmpty(projects)) return { dataSourceList: [], header: null };

        const dataSourceList = projects.map((project: any) => buildTableDataSourceWithProject(project));

        return { dataSourceList, header: _.get(result, 'data.header') ?? null };
    } catch (error) {
        //
        return Promise.resolve({ dataSourceList: [], header: null });
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
