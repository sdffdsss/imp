import React, { useState, useEffect } from 'react';
import { Modal, List, message } from 'oss-ui';
import shareActions from '@Src/share/actions';
import { useHistory } from 'react-router-dom';
import './index.less';
import useLoginInfoModel from '@Src/hox';
import constants from '@Src/common/constants';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';

const list = [
    {
        name: '核心网专业',
        path: '/setting/service-fault-management/core-network',
        key: '1',
    },
    {
        name: 'ATM专业',
        path: '/setting/service-fault-management/atm',
        key: '9998',
    },
    {
        name: '大客户平台专业',
        path: '/setting/service-fault-management/big-customer',
        key: '9997',
    },
    {
        name: '平台专业',
        path: '/setting/service-fault-management/professional',
        key: '85',
    },
];
const ServiceFaultManagement = () => {
    const { userInfo } = useLoginInfoModel.data;
    const { operations = [] } = JSON.parse(userInfo);
    const [professionInit, setProfessionInit] = useState([]);
    const [dataSource] = useState(list);

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

    const onCancel = () => {
        const { actions, messageTypes } = shareActions;
        if (actions && actions.postMessage && messageTypes) {
            actions.postMessage(messageTypes.closeTabs, {
                entry: '/unicom/setting/service-fault-management',
            });
        }
    };

    const goToPage = (item) => {
        pushActions(item.path, item.name);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('professionalTypes')) {
            setProfessionInit(searchParams.get('professionalTypes').split(','));
        } else {
            getDefaultGroupByUser({ type: 1 }).then((res) => {
                setProfessionInit(res.professionalTypes.includes('-1') ? ['1', '9998', '9997', '85'] : res.professionalTypes);
            });
        }
    }, []);

    return (
        <Modal
            title="选择专业"
            footer={false}
            visible
            mask={false}
            centered
            onCancel={onCancel}
            zIndex={0}
            getContainer={false}
            maskClosable={false}
            wrapClassName="service-fault-management-modalWrap"
        >
            <List
                dataSource={dataSource}
                renderItem={(item) => (
                    <List.Item className={`service-fault-management-list${professionInit.includes(item.key) ? ' active' : ''}`}>
                        <div className="service-fault-management-item" onClick={() => goToPage(item)}>
                            {item.name}
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default ServiceFaultManagement;
