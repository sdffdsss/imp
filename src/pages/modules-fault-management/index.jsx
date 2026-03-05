import React, { useState, useEffect } from 'react';
import './index.less';
import { Card, message } from 'oss-ui';
import shareActions from '@Src/share/actions';
import { useHistory } from 'react-router-dom';
import useLoginInfoModel from '@Src/hox';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import constants from '@Common/constants';

const list = [
    {
        name: '核心网专业',
        path: '/modules-fault-management/core-network',
        key: '1',
    },
    {
        name: 'ATM专业',
        path: '/modules-fault-management/atm',
        key: '9998',
    },
    {
        name: '互联网专业',
        path: '/modules-fault-management/intel',
        key: '9999',
    },
    {
        name: '大客户平台专业',
        path: '/modules-fault-management/bigCustom',
        key: '9997',
    },
    {
        name: '云监控专业',
        path: '/modules-fault-management/cloud',
        key: '80',
    },
];
// 组件
const ModulesFaultManagement = (props) => {
    const { userInfo } = useLoginInfoModel.data;
    const { operations = [] } = JSON.parse(userInfo);
    // const { provinceId } = props.location.state;
    const [dataSource] = useState(list);
    const [professionInit, setProfessionInit] = useState([]);
    const history = useHistory();
    const pushActions = (url, label, search) => {
        const hasAuth = operations?.find((item) => item.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom${url}`);

        if (!hasAuth) {
            message.warn(`您没有${label}的权限，请前往“功能角色”配置`);
            return;
        }

        const { actions, messageTypes } = shareActions;
        if (actions && actions.postMessage) {
            let entry = url;
            if (window.location.pathname.includes('/home-unicom')) {
                entry = `/unicom/home-unicom${url}`;
            } else {
                entry = `/unicom${url}`;
            }

            actions.postMessage(messageTypes.openRoute, {
                entry,
                search: {
                    ...search,
                },
            });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom${url}`);
        }
    };
    const toDetailPage = (params) => {
        pushActions(params.path, params.name);
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('professionalTypes')) {
            setProfessionInit(searchParams.get('professionalTypes').split(','));
        } else {
            getDefaultGroupByUser({ type: 1 }).then((res) => {
                setProfessionInit(res.professionalTypes.includes('-1') ? ['1', '9998', '9999', '9997', '80'] : res.professionalTypes);
            });
        }
    }, []);
    return (
        <div
            style={{
                paddingTop: '200px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Card
                title="选择专业"
                bordered={false}
                headStyle={{
                    fontSize: '18px',
                    color: 'white',
                    backgroundColor: '#1677FF',
                }}
                style={{
                    width: 600,
                }}
            >
                {dataSource.map((item) => {
                    return (
                        <p
                            className={`maintain-job-list${professionInit.includes(item.key) ? ' active' : ''}`}
                            onClick={() => {
                                toDetailPage(item);
                            }}
                        >
                            {item.name}
                        </p>
                    );
                })}
            </Card>
        </div>
    );
};

export default ModulesFaultManagement;
