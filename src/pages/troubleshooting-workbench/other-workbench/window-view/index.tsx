import React, { useEffect, useState } from 'react';
import constants from '@Src/common/constants';
import { useHistory } from 'react-router-dom';
import actionss from '@Src/share/actions';
import { message } from 'oss-ui';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import useLoginInfoModel from '@Src/hox';
import { logNew } from '@Common/api/service/log';
import { checkUserNameInCeneterApi } from '../api';
import { getManualReportDerivedRuleConfig, getOnDutyUserByProvinceId } from '../../api';
import { ReactComponent as WindowSvg1 } from '../img/u600.svg';
import { ReactComponent as WindowSvg2 } from '../img/u3255.svg';
import './style.less';

const tabSource = [
    {
        label: '值班记录',
        icon: 'iconu925',
        color: 'bg-9',
        path: '/unicom/management-home-page/change-shifts-page',
        src: '/images/交接班 6.png',
        openId: '300034',
        // disabled: true,
    },
    {
        label: '备品备件',
        icon: 'iconu958',
        color: 'bg-10',
        path: '/unicom/home/spare-parts',
        src: '/images/备品备件1.png',
        openId: '300039',
    },
    {
        label: '故障调度通知',
        icon: 'iconu958',
        color: 'bg-10',
        path: '/unicom/home/fault-scheduling-notification',
        src: '/images/故障调度通知.png',
        openId: '300040',
    },
    {
        label: '故障上报(新)',
        path: '/unicom/home/troubleshooting-workbench/fault-report/fault-report-add',
        src: '/images/troubleshooting-workbench/fault-report.png',
        openId: '300015',
    },
    {
        label: '故障上报',
        path: '/unicom/home/troubleshooting-workbench/fault-report/fault-report-add',
        src: '/images/troubleshooting-workbench/fault-report.png',
        openId: '300015',
    },
    {
        label: '故障上报查询',
        path: '/unicom/home/troubleshooting-workbench/fault-report',
        src: '/images/troubleshooting-workbench/fault-search.png',
        openId: '300016',
    },
];

const WindowViewIndex = () => {
    const history = useHistory();
    const { userInfo, userId, provinceId } = useLoginInfoModel();
    const [ruleConfig, setRuleConfig] = useState(null);
    const [onDutyUser, setOnDutyUser] = useState(false);

    const checkUserNameInCeneterData = async () => {
        const params = { operateUser: userId, provinceId };

        const result = await checkUserNameInCeneterApi(params);
        if (result.code === 200) {
            return true;
        }
        return false;
    };

    const getRuleConfig = async () => {
        const res = await getManualReportDerivedRuleConfig({ provinceId });
        if (res && res.data) {
            setRuleConfig(res.data);
        }
    };

    const getOnDutyUser = async () => {
        const res = await getOnDutyUserByProvinceId({ provinceId });
        if (res.rows?.length > 0) {
            const user = res.rows.find((item) => String(item.userId) === String(userId));
            if (user) {
                setOnDutyUser(true);
            }
        }
    };

    useEffect(() => {
        getRuleConfig();
        getOnDutyUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pushActions = async (url, label, openId, name) => {
        const { operations = [], zones } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
        if (zones[0].zoneId !== '0' && !(await checkUserNameInCeneterData()) && label === '故障上报') {
            message.warn('您不在监控中心的指定角色中，暂无上报权限');
            return;
        }
        if (!fieldFlag || !url) {
            message.warn(`您没有${label}权限，请联系管理员在角色管理中授权`);
            return;
        }
        if (label === '故障上报(新)' && !onDutyUser) {
            message.warn('非当班监控人员，无上报权限！');
            return;
        }
        switch (label) {
            case '值班记录':
                sendLogFn({ authKey: 'workbenches:sendSms' });
                break;
            case '备品备件':
                sendLogFn({ authKey: 'troubleshootingWorkbench:remark' });
                break;
            case '故障上报(新)':
            case '故障上报':
                sendLogFn({ authKey: 'troubleshootingWorkbench:faultHome' });
                break;
            case '故障调度通知':
                sendLogFn({ authKey: 'troubleshootingWorkbench:dipatchNotice' });
                break;
            default:
                break;
        }
        logNew(`调度工作台${name}`, openId);
        let param = {};
        if (label === '故障上报(新)') {
            param = {
                ruleConfig,
                isMajor: true,
                isFaultReportNew: true,
                btnKey: 'majorFaultReport:firstReportApplication',
                title: ruleConfig?.whetherFirstAutoReport ? '首报申请' : '手动上报',
            };
        }
        const { actions, messageTypes } = actionss;
        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: `${url}`,
                search: {
                    operId: openId,
                    ...param,
                },
            });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url}`);
        }
    };

    return (
        <div className="window-view-index-page oss-imp-alart-common-bg">
            {tabSource.map((item) => {
                return (
                    <div key={item.openId} className="setting-view-page">
                        <div className="setting-view-page-field-image" onClick={() => pushActions(item.path, item.label, item.openId, item.label)}>
                            <img height={64} width={64} alt={item.label} src={`${constants.STATIC_PATH}${item.src}`} />
                        </div>
                        <div className="setting-view-page-field-content">{item.label}</div>
                    </div>
                );
            })}
        </div>
    );
};
export default WindowViewIndex;
