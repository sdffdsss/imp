import React, { PureComponent } from 'react';
import { Collapse } from 'oss-ui';
import Draggable from 'react-draggable';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { openFrameworkRouteFn } from '@Src/hooks';
import { pageEntrys } from '../constants';
import { ReactComponent as Path } from '../img/icon_menu-list.svg';
import IconActiveModuleAnchor from '../img/icon_active-module-anchor.png';
import './index.less';

class Index extends PureComponent {
    isDragging = false;

    constructor(props) {
        super(props);

        this.state = {
            finalShowPageEntrys: [],
        };
    }

    componentDidMount() {
        this.processPageEntrys();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.schedulingObj !== this.props.schedulingObj) {
            this.processPageEntrys();
        }
    }

    getSelectedModuleByGroup = () => {
        this.startCalcOffset();
    };

    judgeMenuPermission = (operName, key) => {
        const {
            parsedUserInfo: { operations },
        } = useLoginInfoModel.data;
        if (key) {
            return operations.some((item) => item.key === key);
        }
        return operations.some((item) => item.operName === operName);
    };

    processPageEntrys = () => {
        const { schedulingObj, history, operation, checkButtonDisabledFn, placePage } = this.props;
        const {
            groupId = '',
            provinceId = '',
            workingPlanId = '',
            workShiftId = '',
            dateTime = '',
            professionalTypes = [],
            workBeginTime,
            workEndTime,
        } = schedulingObj || {};

        const finalShowPageEntrys = [];

        pageEntrys.forEach((item) => {
            const { key, text } = item;
            let { url } = item;

            if (placePage === 'workbench') {
                url = `/home-unicom${url}`;
            }

            switch (key) {
                case 'MaintainJob':
                    if (this.judgeMenuPermission(text)) {
                        finalShowPageEntrys.push({
                            ...item,
                            jumpFn: () => {
                                openFrameworkRouteFn({
                                    history,
                                    url,
                                    search: {
                                        groupId,
                                        edit: operation === 'editable',
                                        provinceId,
                                        workingPlanId: workingPlanId || '',
                                        dateTime: dateTime || '',
                                        workShiftId: workShiftId || '',
                                    },
                                });
                            },
                        });
                    }
                    break;
                case 'PreviousDutySummary':
                    if (this.judgeMenuPermission(text)) {
                        finalShowPageEntrys.push({
                            ...item,
                            jumpFn: () => {
                                openFrameworkRouteFn({
                                    history,
                                    url,
                                    search: { groupId, dateTime, workShiftId, edit: operation === 'editable' },
                                });
                            },
                        });
                    }

                    break;

                case 'CallTestingRecord':
                    if (this.judgeMenuPermission(text) && checkButtonDisabledFn([85, 9996])) {
                        finalShowPageEntrys.push({
                            ...item,
                            jumpFn: () => {
                                openFrameworkRouteFn({
                                    history,
                                    url,
                                    search: { edit: operation === 'editable' },
                                });
                            },
                        });
                    }
                    break;

                case 'NMSAlarmMonitoring':
                    if (this.judgeMenuPermission(text) && checkButtonDisabledFn([1])) {
                        finalShowPageEntrys.push({
                            ...item,
                            jumpFn: () => {
                                openFrameworkRouteFn({
                                    history,
                                    url,
                                    search: {
                                        provinceId,
                                        groupId,
                                        dateTime: moment(dateTime).format('YYYY-MM-DD 00:00:00'),
                                        edit: operation === 'editable',
                                    },
                                });
                            },
                        });
                    }
                    break;

                case 'CutExecutionRecord':
                    if (this.judgeMenuPermission(text) && checkButtonDisabledFn([3])) {
                        finalShowPageEntrys.push({
                            ...item,
                            jumpFn: () => {
                                openFrameworkRouteFn({
                                    history,
                                    url,
                                    search: { provinceId, edit: operation === 'editable' },
                                });
                            },
                        });
                    }
                    break;
                case 'business-platform-monitor-daily':
                    if (this.judgeMenuPermission(text)) {
                        finalShowPageEntrys.push({
                            ...item,
                            jumpFn: () => {
                                openFrameworkRouteFn({
                                    history,
                                    url,
                                    search: {
                                        professionalType: professionalTypes.join(','),
                                        workBeginTime,
                                        workEndTime,
                                        groupId,
                                        workShiftId,
                                        dateTime,
                                    },
                                });
                            },
                        });
                    }
                    break;
                default:
                    if (this.judgeMenuPermission(text, key)) {
                        finalShowPageEntrys.push({
                            ...item,
                            jumpFn: () => {
                                openFrameworkRouteFn({
                                    history,
                                    url,
                                    search: key.includes('record-temporary-route') ? {} : { professionalTypes: professionalTypes.join(','), groupId },
                                });
                            },
                        });
                    }
                    break;
            }
        });

        this.setState({ finalShowPageEntrys });
    };

    execJumpTo = (item) => {
        item.jumpFn();
    };

    render() {
        const { dynamicModulesMergePro, onClickModule, initPosition, axis = 'y', isExpanded, curAnchorModuleId } = this.props;
        const { finalShowPageEntrys } = this.state;
        return (
            <Draggable
                axis={axis}
                bounds="parent"
                // disabled={isExpanded}
                scale={1}
                onDrag={() => {
                    this.isDragging = true;
                }}
                onStop={() => {
                    setTimeout(() => {
                        this.isDragging = false;
                    }, 0);
                }}
                handle=".expand-icon"
            >
                <div className={`change-shifts-navigation-list-menu${isExpanded ? ' expanded' : ''}`} style={initPosition || { right: 0, top: 0 }}>
                    <div
                        className="expand-icon"
                        onClick={() => {
                            if (this.isDragging) {
                                return;
                            }
                            this.props.handleExpandedChange();
                        }}
                    >
                        <Path />
                    </div>
                    {isExpanded && (
                        <div className="navigation-list-menu-inner">
                            <div className="inner-title">所有组件</div>
                            <div className="list-wrapper">
                                <div className="list-wrapper-inner">
                                    <Collapse defaultActiveKey={['1', '2']} ghost>
                                        <Collapse.Panel header="组件定位" key="1">
                                            <div className="module-list">
                                                {dynamicModulesMergePro.map((item) => {
                                                    const active = curAnchorModuleId === item.moduleId;
                                                    return (
                                                        <div
                                                            key={item.moduleId}
                                                            className={`module-item${active ? ' active' : ''}`}
                                                            onClick={() => {
                                                                if (curAnchorModuleId !== item.moduleId) {
                                                                    onClickModule(item.moduleId);
                                                                }
                                                            }}
                                                        >
                                                            {active && <img src={IconActiveModuleAnchor} alt="" />}
                                                            {item.moduleName}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Collapse.Panel>
                                        <Collapse.Panel header="快捷入口" key="2">
                                            <div className="other-entrys">
                                                {finalShowPageEntrys.map((item) => {
                                                    return (
                                                        <div className="entry-item" onClick={() => this.execJumpTo(item)}>
                                                            {item.text}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Collapse.Panel>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Draggable>
        );
    }
}

export default Index;
