import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from 'oss-ui';
// import { ReactComponent as WindowSvg1 } from '../svgs/window-svg/u925.svg';
// import { ReactComponent as WindowSvg2 } from '../svgs/window-svg/u931.svg';
// import { ReactComponent as WindowSvg3 } from '../svgs/window-svg/u935.svg';
// import { ReactComponent as WindowSvg4 } from '../svgs/window-svg/u958.svg';
// import { ReactComponent as WindowSvg5 } from '../svgs/window-svg/gongdanchaxun.svg';
// import { ReactComponent as WindowSvg6 } from '../svgs/window-svg/gaojingchaxun.svg';
// import { ReactComponent as WindowSvg8 } from '../svgs/window-svg/gaojingchaxun2.svg';
// import { ReactComponent as WindowSvg7 } from '../svgs/window-svg/gongdanchaxun2.svg';
import actionss from '@Src/share/actions';
import classNames from 'classnames';
import constants from '@Common/constants';
import '../index.less';

const Index = (props) => {
    const { theme } = props;
    const history = useHistory();
    const pushActions = (url) => {
        if (!url) {
            return;
        }
        const { actions, messageTypes } = actionss;
        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
            });
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}${url}`);
        }
    };

    const tabSource = [
        {
            label: '交接班',
            icon: 'iconu925-copy',
            color: 'bg-9',
            path: '/unicom/management-home-page/change-shifts-page',
        },
        {
            label: '当班视图',
            icon: 'iconu931-copy',
            color: 'bg-10',
            path: '/unicom/home-unicom/alarm-window-unicom/duty-window',
        },
        {
            label: '自定义视图',
            icon: 'iconu935-copy',
            color: 'bg-11',
            path: '/unicom/home-unicom/alarm-window-unicom/custom-window',
        },
        {
            label: '告警查询',
            icon: 'icongaojingchaxun1-copy',
            color: 'bg-12',
            path: '/unicom/home-unicom/search/alarm-query',
        },
        {
            label: '工单查询',
            icon: 'icongongdanchaxun1-copy1',
            color: 'bg-10',
            path: '/unicom/home-unicom/failure-sheet',
        },
        {
            label: '超长告警查询',
            icon: 'icongaojingchaxun1-copy',
            color: 'bg-9',
            path: '/unicom/home-unicom/alarm-window-long',
        },
        {
            label: '超长工单查询',
            icon: 'icongongdanchaxun1-copy',
            color: 'bg-11',
            path: '/unicom/home-unicom/failure-sheet-long',
        },
        {
            label: '故障调度班表',
            icon: 'iconu958-copy ',
            color: 'bg-12',
            path: '/unicom/home-unicom/maintenance-quick-query',
        },
    ];
    const renderTabs = () => {
        return tabSource.map((item) => {
            return (
                <div
                    className="content"
                    onClick={() => {
                        pushActions(item.path);
                    }}
                    key={item.label}
                >
                    <div className={item.color ? classNames('icon', item.color) : 'icon'}>
                        <Icon type={item.icon} />
                    </div>
                    <div className="label">{item.label}</div>
                </div>
            );
        });
    };
    return (
        <div
            className="my-window oss-imp-alart-common-bg"
            // style={{ background: theme === "light" ? "white" : "" }}
        >
            <div className="header">常用窗口</div>
            <div className="my-window-container">{renderTabs()}</div>
        </div>
    );
};

export default Index;
