import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, message } from 'oss-ui';
import actionss from '@Src/share/actions';
// import classNames from 'classnames';
import './index.less';
import constants from '@Common/constants';
import { ReactComponent as WindowSvg1 } from '../img/u2179.svg';
import useLoginInfoModel from '@Src/hox';
import { logNew } from '@Common/api/service/log';
const MenuEntry = (props) => {
    const { userInfo } = useLoginInfoModel();
    const history = useHistory();
    const pushActions = (url, label, openId, name) => {
        const { operations = [] } = JSON.parse(userInfo);
        const fieldFlag = operations.find((items) => items.path === String(`/znjk/${constants.CUR_ENVIRONMENT}/main${url}`));
        if (!fieldFlag || !url) {
            message.warn(`您没有${label}权限，请联系管理员在角色管理中授权`);
            return;
        }
        logNew(`值班管理${name}`, openId);
        const { actions, messageTypes } = actionss;
        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
                search: {
                    operId: openId,
                },
            });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url}`);
        }
    };

    const tabSource = [
        {
            label: '交接班',
            icon: 'iconu925',
            color: 'bg-9',
            path: `/unicom/management-home-page/change-shifts-page`,
            imgUrl: 'jjb',
            openId: '300047',
        },
        {
            label: '值班日志查询',
            icon: 'icongongdanchaxun1',
            color: 'bg-12',
            path: `/unicom/management-home-page/record-duty`,
            imgUrl: 'zbrzcx',
            openId: '300051',
        },
        {
            label: '值班班表',
            icon: 'icongaojingchaxun1',
            color: 'bg-12',
            path: `/unicom/management-home-page/monitor-date-list-search`,
            imgUrl: 'zbbb',
            openId: '300049',
        },
        {
            label: '值班班组设置',
            icon: 'iconu931',
            color: 'bg-10',
            path: `/unicom/management-home-page/core/group-manage`,
            imgUrl: 'zbbzsz',
            openId: '300048',
        },
        {
            label: '监控中心设置',
            icon: 'iconu935',
            color: 'bg-11',
            path: `/unicom/management-home-page/monitor-setting`,
            imgUrl: 'jkzxsz',
            openId: '300050',
        },
        {
            label: '故障上报',
            icon: 'iconu935',
            // color: 'bg-11',
            path: `/unicom/home/troubleshooting-workbench/fault-report/fault-report-add`,
            imgUrl: 'fault-report',
            openId: '300015',
        },
    ];
    const renderTabs = () => {
        return tabSource.map((item) => {
            return (
                <div className="content" key={item.label}>
                    {/* <div
                        className={item.color ? classNames('icon', item.color) : 'icon'}
                        onClick={() => {
                            pushActions(item.path);
                        }}
                    >
                        <Icon type={item.icon} />
                    </div> */}
                    <div
                        onClick={() => {
                            pushActions(item.path, item.label, item.openId, item.label);
                        }}
                    >
                        <img height={100} width={100} src={require(`../img/${item.imgUrl}.png`)} />
                    </div>
                    <div className="label">{item.label}</div>
                </div>
            );
        });
    };
    return (
        <div className="my-window">
            <div className="header">
                <div style={{ paddingTop: '4px' }}>
                    <WindowSvg1 />
                </div>
                <div style={{ marginLeft: '4px', fontSize: '16px' }}>常用窗口</div>
            </div>
            <div className="my-window-container">{renderTabs()}</div>
        </div>
    );
};

export default MenuEntry;
