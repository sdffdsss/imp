import React, { useMemo } from 'react';
import { useRequest, useSetState } from 'ahooks';
import { Tabs, Col } from 'oss-ui';
import { _ } from 'oss-web-toolkits';

import { WorkingPlanTableItem } from './WorkingPlanTableItem';
import { getCustomWorkingPlanApi, getCustomWorkingPlanTabListApi } from './api';
import HeaderRender from './header-render';
import './index.less';

type TProps = {
    /**
     * 默认选中的tab, 默认是第一个
     */
    defaultTabActiveKey?: any;
    onTabChange?: (activeKey: any, info: any) => void;
    onCellSelectChange?: (value: any, info: { current: any; row: any; project: any }) => void;

    [key: string]: any;
};

export const CustomizedWorkingPlan = (props: TProps) => {
    const { data: tabList } = useRequest(() => getCustomWorkingPlanTabListApi(), {});

    const [state, setState] = useSetState({ activeKey: null as any, selectedTab: null as any });

    const tabActiveKey = useMemo(() => {
        if (_.isEmpty(tabList)) return null;
        if (_.isNil(state.activeKey)) {
            return props.defaultTabActiveKey ?? tabList![0].id;
        }
        return state.activeKey;
    }, [props.defaultTabActiveKey, state.activeKey, tabList]);

    const onTabChange = (activeKey: string) => {
        const selectedTab = tabList!.find((d) => d.id === activeKey);
        if (props.onTabChange) {
            props.onTabChange(activeKey, { tabList, item: selectedTab });
        }
        setState({ activeKey: Number(activeKey) });
    };

    const { data: sceneDetail } = useRequest(
        () => {
            return getCustomWorkingPlanApi({
                sceneId: tabActiveKey,
                sceneName: state.selectedTab?.label,
            });
        },
        {
            ready: !_.isNil(tabActiveKey),
            refreshDeps: [tabActiveKey],
        },
    );

    const { dataSourceList: dataSourceCollection, header } = sceneDetail || { dataSourceList: [], header: null };

    if (_.isEmpty(tabList)) return null;

    return (
        <Tabs className="customized-working-plan-root" onChange={onTabChange} activeKey={`${tabActiveKey}`}>
            {(tabList ?? []).map((item: any) => {
                return (
                    <Tabs.TabPane tab={item.label} key={item.id}>
                        <Col span={24}>
                            <div style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 520 - 36 }}>
                                <HeaderRender data={header} />
                                {(dataSourceCollection ?? []).map((source: any) => {
                                    return (
                                        <WorkingPlanTableItem
                                            key={_.get(source, 'project.projectId')}
                                            title={_.get(source, 'project.projectName')}
                                            dataSource={source.dataSource}
                                            columns={source.columns}
                                            project={source.project}
                                            onCellSelectChange={props.onCellSelectChange}
                                        />
                                    );
                                })}
                            </div>
                        </Col>
                    </Tabs.TabPane>
                );
            })}
        </Tabs>
    );
};
