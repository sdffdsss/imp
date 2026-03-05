import React, { FC, useEffect, useState } from 'react';
import { Modal, List, message } from 'oss-ui';
import shareActions from '@Src/share/actions';
import constants from '@Common/constants';
import useLoginInfoModel from '@Src/hox';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import style from './style.module.less';
import { usePush } from './usePush';
import { sendLogFn } from '@Src/pages/components/auth/utils';

interface Props {}
const list = [
    {
        name: '核心网专业',
        path: '/network-cutover/core',
        key: '1',
    },
    {
        name: 'ATM专业',
        path: '/network-cutover/ATM',
        key: '9998',
    },
    {
        name: '平台专业',
        path: '/network-cutover/business',
        key: '85',
    },
    {
        name: '传输网专业',
        path: '/network-cutover/transmission',
        key: '3',
    },
    {
        name: '互联网专业',
        path: '/network-cutover/internet',
        key: '9999',
    },
    {
        name: '云资源专业',
        path: '/network-cutover/cloud',
        key: '10000',
    },
];
const NetworkCutover: FC<Props> = () => {
    const [pushActions] = usePush();

    const { userInfo } = useLoginInfoModel.data;
    const { operations = [] } = JSON.parse(userInfo);
    const [professionInit, setProfessionInit] = useState([]);
    const [dataSource] = useState(list);

    const goToPage = (item) => {
        const hasAuth = operations?.find((operation) => operation.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom${item.path}`);

        switch (item.name) {
            case '核心网专业':
                sendLogFn({ authKey: 'networkCutoverCore' });
                break;
            case 'ATM专业':
                sendLogFn({ authKey: 'networkCutoverATM' });
                break;
            case '平台专业':
                sendLogFn({ authKey: 'networkCutoverBusiness' });
                break;
            case '传输网专业':
                sendLogFn({ authKey: 'networkCutoverTransmission' });
                break;
            case '互联网专业':
                sendLogFn({ authKey: 'networkCutoverInternet' });
                break;
            case '云资源专业':
                sendLogFn({ authKey: 'networkCutoverCloud' });
                break;
            default:
                break;
        }

        if (!hasAuth) {
            message.warn(`您没有${item.name}的权限，请前往“功能角色”配置`);
            return;
        }

        pushActions(item.path, item.name);
    };

    const onCancel = () => {
        const { actions, messageTypes } = shareActions;
        if (actions && actions.postMessage && messageTypes) {
            actions.postMessage(messageTypes.closeTabs, {
                entry: `/unicom/network-cutover`,
            });
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('professionalTypes')) {
            setProfessionInit(searchParams.get('professionalTypes').split(','));
        } else {
            getDefaultGroupByUser({ type: 1 }).then((res) => {
                setProfessionInit(res.professionalTypes.includes('-1') ? ['1', '9998', '85', '3', '9999'] : res.professionalTypes);
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
            wrapClassName={style.modalWrap}
        >
            <List
                dataSource={dataSource}
                renderItem={(item) => (
                    <List.Item className={(professionInit.includes(item.key) ? [`${style.list}`, `${style.active}`] : [`${style.list}`]).join(' ')}>
                        <div className={style.item} onClick={() => goToPage(item)}>
                            {item.name}
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default NetworkCutover;
