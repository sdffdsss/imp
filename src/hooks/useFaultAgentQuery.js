import { useRef } from 'react';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import request from '@Common/api';
import { getFaultReportRoleTypeName } from '@Pages/troubleshooting-workbench/api';
import moment from 'moment';
import constants from '@Common/constants';
import { _ } from 'oss-web-toolkits';

const keyMap = {
    prod: {
        app_key: '663683e8-3512-407c-8218-2a3d568703b1',
        app_secret: 'b927ec52c50f03827accdc488d12bc5f',
    },
    public: {
        app_key: '663683e8-3512-407c-8218-2a3d568703b1',
        app_secret: 'b927ec52c50f03827accdc488d12bc5f',
    },
    canary: {
        app_key: 'd7d4765c-f63a-4d9a-b02f-c41b8984e7f8',
        app_secret: 'c90af6b4bf6b1b255fb4922787186107',
    },
};

const STATICFAKEUSERID = useEnvironmentModel.data.environment.STATICFAKEUSERID || '$9753113579$';

export const useFaultAgentQuery = () => {
    const faultAgentIntentQueryApiRef = useRef(null);
    const ReportRoleTypeNameRef = useRef();
    const getTokenFnRef = useRef(null);

    const agentTokenRef = useRef();

    const { userId, userName, currentZone } = useLoginInfoModel();

    getTokenFnRef.current = async () => {
        // const env = process.env.DEPLOY_ENV || 'canary';
        const env = constants.CUR_ENVIRONMENT;
        const res = await request('/apigovernance/tokens/aksk', {
            type: 'post',
            baseUrlType: 'faultAgent',
            showErrorMessage: false,
            showSuccessMessage: false,
            data: {
                ...keyMap[env],
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        agentTokenRef.current = res?.AccessToken || '';
    };

    faultAgentIntentQueryApiRef.current = async (params) => {
        if (!ReportRoleTypeNameRef.current) {
            const temp = await getFaultReportRoleTypeName();
            ReportRoleTypeNameRef.current = temp.data || '';
        }

        if (!agentTokenRef.current) {
            await getTokenFnRef.current();
        }

        const { question, button_ai_flagId, button_ai_standardAlarmId, button_ai_buttonKey } = params;
        const res = await request('/assistant-engine/v1/intent-query', {
            type: 'post',
            baseUrlType: 'faultAgent',
            showErrorMessage: false,
            showSuccessMessage: false,
            data: {
                scene: 'FaultDispatchAgent',
                locale: 'zh',
                origin: 'Client',
                stream: false,
                remote_user_account: STATICFAKEUSERID,
                remote_system: '3rd_System',
                question,
                scene_params: {
                    ai_lui_source: '调度工作台',
                    ai_user_id: STATICFAKEUSERID,
                    ai_user_name: userName,
                    ai_province_id: currentZone.zoneId,
                    ai_province_name: currentZone.zoneName,
                    ai_role_type: ReportRoleTypeNameRef.current,
                    time_base: moment().format('YYYY-MM-DD HH:mm:ss'),
                    ai_dispatch_token: `Bearer ${localStorage.getItem('access_token')}`,
                    button_ai_flagId,
                    button_ai_standardAlarmId,
                    button_ai_buttonKey,
                },
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Agent-Token': `Bearer ${agentTokenRef.current}`,
            },
        });

        return _.get(res, 'scene_info.fault_event.action_params') || {};
    };

    return faultAgentIntentQueryApiRef.current;
};
