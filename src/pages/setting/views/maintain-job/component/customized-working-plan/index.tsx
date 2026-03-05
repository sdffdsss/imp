import React, {
    useImperativeHandle,
    useRef,
    useEffect,
    useLayoutEffect,
    // useMemo
} from 'react';
import {
    useRequest,
    // useSetState
} from 'ahooks';
import {
    // Tabs,
    Col,
    Button,
} from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import GlobalMessage from '@Src/common/global-message';

import { WorkingPlanTableItem } from './WorkingPlanTableItem';
import HeaderRender from './header-render';
import {
    getCustomWorkingPlanRecordApi,
    // getCustomWorkingPlanTabListApi
} from './api';
import { RootContextProvider } from './context';
import './index.less';

type TProps = {
    /**
     * 默认选中的tab, 默认是第一个
     */
    defaultTabActiveKey?: any;
    onTabChange?: (activeKey: any, info: any) => void;
    onCellSelectChange?: (value: any, info: { current: any; row: any; project: any }) => void;
    editable?: boolean;

    [key: string]: any;
};

export const CustomizedWorkingPlan = React.forwardRef((props: TProps, ref) => {
    // const { data: tabList } = useRequest(() => getCustomWorkingPlanTabListApi(), {});

    // const [state, setState] = useSetState({ activeKey: null as any, selectedTab: null as any });

    // const tabActiveKey = useMemo(() => {
    //     if (_.isEmpty(tabList)) return null;
    //     if (_.isNil(state.activeKey)) {
    //         return props.defaultTabActiveKey ?? tabList![0].id;
    //     }
    //     return state.activeKey;
    // }, [props.defaultTabActiveKey, state.activeKey, tabList]);

    // const onTabChange = (activeKey: string) => {
    //     const selectedTab = tabList!.find((d) => d.id === activeKey);
    //     if (props.onTabChange) {
    //         props.onTabChange(activeKey, { tabList, item: selectedTab });
    //     }
    //     setState({ activeKey });
    // };

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollTopRef = useRef(0);

    useEffect(() => {
        function fn({ isActive }) {
            if (isActive) {
                console.log('scrollTopRef.current', scrollTopRef.current);
                setTimeout(() => {
                    scrollContainerRef.current?.scrollTo(0, scrollTopRef.current || 0);
                }, 1000);
            }
        }
        GlobalMessage.on('activeChanged', null, fn);

        return () => {
            GlobalMessage.off('activeChanged', null, fn);
        };
    }, []);

    useLayoutEffect(() => {
        scrollContainerRef.current?.addEventListener('scroll', (event) => {
            console.log('firstfirstfirst', event.target.scrollTop);
            scrollTopRef.current = event.target.scrollTop || 0;
        });
    }, []);
    const customWorkingPlanRecordParams = {
        groupId: _.get(props, 'groupInfo.groupId'),
        workShiftId: _.get(props, 'groupInfo.workShiftId'),
        dateTime: _.get(props, 'groupInfo.dateTime'),
        workingPlanId: _.get(props, 'groupInfo.workingPlanId'),
        provinceId: _.get(props, 'groupInfo.provinceId'),
    };

    const { data: workingPlanRecord } = useRequest(
        () => {
            return getCustomWorkingPlanRecordApi({
                ..._.omit(customWorkingPlanRecordParams, ['workingPlanId']),
            });
        },
        {
            refreshDeps: [customWorkingPlanRecordParams.groupId, customWorkingPlanRecordParams.dateTime, customWorkingPlanRecordParams.workShiftId],
        },
    );

    useImperativeHandle(ref, () => ({
        getValues: () => {
            // console.log('log------------------------root', workingPlanRecord?.projects);
            return { projects: _.cloneDeep(workingPlanRecord?.projects ?? []), header: _.cloneDeep(workingPlanRecord?.header ?? null) };
        },
    }));

    // if (_.isEmpty(tabList)) return null;

    return (
        <RootContextProvider groupInfo={customWorkingPlanRecordParams} groupUsers={_.get(props, 'groupInfo.groupUsers')}>
            {/* <Tabs className="customized-working-plan-root" onChange={onTabChange} activeKey={tabActiveKey}>
                {(tabList ?? []).map((item: any) => {
                    return (
                        <Tabs.TabPane tab={item.label} key={item.id}> */}
            <div className="customized-working-plan-root" style={{ height: '100%' }}>
                <Col span={24} style={{ height: '100%' }}>
                    <div style={{ overflow: 'hidden', overflowY: 'auto', height: '100%' }} ref={scrollContainerRef}>
                        <div className="customized-working-plan-tools">
                            {props.editable && (
                                <Button className="customized-working-plan-tool-item" type="primary" onClick={props.onSave}>
                                    保存
                                </Button>
                            )}
                            <Button className="customized-working-plan-tool-item" onClick={props.onExport}>
                                导出
                            </Button>
                        </div>
                        <HeaderRender data={workingPlanRecord?.header} />
                        {(workingPlanRecord?.dataSourceList ?? []).map((source: any) => {
                            return (
                                <WorkingPlanTableItem
                                    key={_.get(source, 'project.projectId')}
                                    title={_.get(source, 'project.projectName')}
                                    dataSource={source.dataSource}
                                    columns={source.columns}
                                    project={source.project}
                                    onCellSelectChange={props.onCellSelectChange}
                                    projects={workingPlanRecord?.projects}
                                    editable={props.editable}
                                />
                            );
                        })}
                    </div>
                </Col>
            </div>
            {/* </Tabs.TabPane>
                    );
                })}
            </Tabs> */}
        </RootContextProvider>
    );
});
