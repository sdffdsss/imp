import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
// import Icon from '@ant-design/icons';
import { Icon } from 'oss-ui';
import { ReactComponent as MessageSvg1 } from '../../svgs/icon/status2.svg';
import { ReactComponent as MessageSvg2 } from '../../svgs/icon/status3.svg';
import { ReactComponent as MessageSvg3 } from '../../svgs/icon/status1.svg';
import './index.less';

const Index = (props) => {
    const { alarmCountNum = {}, alarmCountNumFilter = {} } = props;
    const [theme, setTheme] = useState(props.theme);
    const numSource = [
        {
            key: 1,
            name: 'orgSeverity1',
            label: '一级告警',
            num: alarmCountNum.first?.orgSeverity1 || 0,
            color: 'red',
            backgroundColor: 'background-red',
            fontColor: 'color-red',
            backgroundColorDrakBlue: 'background-red-drak',
        },
        {
            key: 2,
            name: 'orgSeverity2',
            label: '二级告警',
            num: alarmCountNum.first?.orgSeverity2 || 0,
            color: 'orange',
            backgroundColor: 'background-orange',
            fontColor: 'color-orange',
            backgroundColorDrakBlue: 'background-orange-drak',
        },
        {
            key: 3,
            name: 'orgSeverity3',
            label: '三级告警',
            num: alarmCountNum.first?.orgSeverity3 || 0,
            color: 'yellow',
            backgroundColor: 'background-yellow',
            fontColor: 'color-yellow',
            backgroundColorDrakBlue: 'background-yellow-drak',
        },
        {
            key: 4,
            name: 'orgSeverity4',
            label: '四级告警',
            num: alarmCountNum.first?.orgSeverity4 || 0,
            color: 'blue',
            backgroundColor: 'background-blue',
            fontColor: 'color-blue',
            backgroundColorDrakBlue: 'background-blue-drak',
        },
    ];
    const tabSource = [
        // {
        //     label: '告警待办',
        //     key: 1,
        //     component: (
        //         <>
        //             <div className={theme === 'light' ? 'title' : 'title title-drakblue'}>告警待办</div>
        //             <div className="content">
        //                 <div>
        //                     {numSource.map((item) => {
        //                         return (
        //                             <div className={classNames('content-item', `item${item.key}`)} key={item.key}>
        //                                 <div className={theme === 'light' ? 'items items-drakblue' : 'items'}>
        //                                     <div className={classNames('icon-dot', item.color)} />
        //                                     {item.num}
        //                                 </div>
        //                             </div>
        //                         );
        //                     })}
        //                 </div>
        //             </div>
        //         </>
        //     ),
        // },
        {
            label: '告警待办',
            key: 1,
            icon: 'iconstatus2',
        },
        {
            label: '',
            key: 6,
            component: (
                <div className="content-article-container">
                    {numSource.map((item) => {
                        return (
                            <div className="content-article-tab">
                                <div className="content-article">
                                    <div className={classNames('icon-dot', item.color)} />
                                    <div
                                        className={classNames(
                                            'container-content',
                                            theme === 'light' ? item.backgroundColor : item.backgroundColorDrakBlue
                                        )}
                                    >
                                        <div className="container-content-title"> {item.label}</div>
                                        <div className={classNames('container-content-num', item.fontColor)}> {item.num}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ),
        },
        {
            label: '故障待办',
            key: 2,
            num: alarmCountNumFilter['sheet_status_2-3']?.statisticsValue,
            icon: 'iconstatus2',
            statisticsFieldName: 'sheet_status_2-3',
            statisticsPath: '/',
        },
        {
            label: '故障-待受理',
            key: 3,
            num: alarmCountNumFilter.sheet_status_2?.statisticsValue,
            icon: 'iconstatus3',
            statisticsFieldName: 'sheet_status_2',
            statisticsPath: '/2',
        },
        {
            label: '故障-处理中',
            key: 4,
            num: alarmCountNumFilter.sheet_status_3?.statisticsValue,
            icon: 'iconstatus1',
            statisticsFieldName: 'sheet_status_3',
            statisticsPath: '/3',
        },
    ];
    const [currentTab, handleCurrentTab] = useState(1);
    const handleTabClick = (item) => {
        handleCurrentTab(item.key);
        props?.handleCurrentTabs({ statisticsFieldName: item.statisticsFieldName, statisticsPath: item.statisticsPath });
    };
    const renderTabs = () => {
        return tabSource.map((item) => {
            return (
                <>
                    {!item.component && (
                        <div
                            className={theme === 'light' ? 'tab-content' : 'tab-content-drakblue'}
                            key={item.key}
                            onClick={() => {
                                handleTabClick(item);
                            }}
                        >
                            <div className={classNames('sub-title', 'radius', currentTab === item.key ? 'checked' : '')}>
                                {/* <Icon color={theme === 'light' ? 'rgb(178,218,258)' : '#1880CC'} type={item.icon} /> */}
                                <div className="sub-title-img">
                                    {item.key === 1 && <img src={require('../../img/gjdb.png')} alt="" style={{ width: '38px', height: '44px' }} />}
                                    {item.key === 2 && <img src={require('../../img/gzdb.png')} alt="" style={{ width: '38px', height: '44px' }} />}
                                    {item.key === 3 && <img src={require('../../img/dsl.png')} alt="" style={{ width: '38px', height: '44px' }} />}
                                    {item.key === 4 && <img src={require('../../img/clz.png')} alt="" style={{ width: '38px', height: '44px' }} />}
                                </div>
                                {item.key !== 1 && (
                                    <div className="right-content">
                                        <span className="title-num">{item.label}</span>
                                        <span className="title-label"> {item.num || 0}个</span>
                                    </div>
                                )}
                                {item.key === 1 && (
                                    <div className="right-content-first">
                                        <span className="title-num">{item.label}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {item.component}
                </>
            );
        });
    };
    useEffect(() => {
        if (props.currentTab) {
            props.currentTab(currentTab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTab, props.currentTab]);
    useEffect(() => {
        if (props.theme) {
            setTheme(props.theme);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.theme]);
    return <div className="tab-container">{renderTabs()}</div>;
};
export default Index;
