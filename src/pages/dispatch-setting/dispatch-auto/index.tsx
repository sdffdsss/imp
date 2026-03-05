import React, { useEffect } from 'react';
import { Tree, Icon, Modal, Tooltip } from 'oss-ui';
// import type { DataNode } from 'antd/es/tree';
import { useSetState } from 'ahooks';
import useLoginInfoModel from '@Src/hox';
import { getParentNodeAPi, getChildrenNodeAPi, deleteRuleAPi } from '../api';
import EditRight from '../edit';
import '../style.less';

const DispatchSetting = () => {
    const [state, setState] = useSetState({
        draftTree: true,
        publishedTree: true,
        moduleId: 303,
        filterId: 0,
        isDraft: true,
        curRule: '',
        draftNodeList: [] as any,
        publishNodeList: [] as any,
        draftExpand: [] as any,
        publishExpand: [] as any,
        draftSelected: [] as any,
        publishSelected: [] as any,
    });
    const login = useLoginInfoModel();
    // 每次更新 调这个接口
    const getChildrenTreeData = async (val, bool, filterName, isPublish) => {
        const params = {
            modelId: 2,
            moduleId: val,
            isDraft: bool,
        };
        const res = await getChildrenNodeAPi(params);
        if (res.data) {
            if (bool) {
                const nodeIndex = state.draftNodeList.findIndex((e) => e.key === val);
                if (nodeIndex > -1) {
                    state.draftNodeList[nodeIndex].children = res.data.map((e) => {
                        return {
                            title: (
                                <div className="tree-son-title">
                                    <span>{e.nodeName}</span>
                                    <Tooltip title="删除">
                                        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                                        <div onClick={(event) => deleteDraft(event, e, true)}>
                                            <Icon type="DeleteOutlined" antdIcon style={{ fontSize: 14 }} />
                                        </div>
                                    </Tooltip>
                                </div>
                            ),
                            key: e.nodeId,
                            filterId: e.nodeId,
                        };
                    });
                }
                if (!state.draftExpand.includes(val)) {
                    state.draftExpand = [...state.draftExpand, val];
                }
                state.publishSelected = [];
                if (filterName) {
                    const selItem = res.data.find((e) => e.nodeName === filterName);
                    if (selItem) {
                        state.draftSelected = [selItem.nodeId];
                    }
                }
                setState({
                    draftNodeList: [...state.draftNodeList],
                    publishNodeList: [...state.publishNodeList],
                    draftExpand: [...state.draftExpand],
                    publishExpand: [...state.publishExpand],
                    draftSelected: filterName ? [...state.draftSelected] : [],
                    publishSelected: filterName ? [...state.publishSelected] : [],
                    isDraft: bool,
                    moduleId: val,
                    filterId: filterName ? state.draftSelected[0] || state.publishSelected[0] : 0,
                });
            } else {
                const nodeIndex = state.publishNodeList.findIndex((e) => e.key === val);
                if (nodeIndex > -1) {
                    state.publishNodeList[nodeIndex].children = res.data.map((e) => {
                        return {
                            title: (
                                <div className="tree-son-title">
                                    <span>{e.nodeName}</span>
                                    {e.moduleId !== 302 && (
                                        <Tooltip title="删除">
                                            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                                            <div onClick={(event) => deleteDraft(event, e, false)}>
                                                <Icon type="DeleteOutlined" antdIcon style={{ fontSize: 14 }} />
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>
                            ),
                            key: e.nodeId,
                            filterId: e.nodeId,
                        };
                    });
                }
                if (!state.publishExpand.includes(val)) {
                    state.publishExpand = [...state.publishExpand, val];
                }
                state.draftSelected = [];
                if (filterName) {
                    const selItem = res.data.find((e) => e.nodeName === filterName);
                    if (selItem) {
                        state.publishSelected = [selItem.nodeId];
                    }
                }
                if (isPublish) {
                    setState({
                        isDraft: bool,
                    });
                }
                setState({
                    publishNodeList: [...state.publishNodeList],
                    publishExpand: [...state.publishExpand],
                });
            }
        }
    };
    const confirmDelete = async (item, bool) => {
        const param = {
            moduleId: item.moduleId,
            modelId: 2,
            isDraft: bool,
            userId: login.userId,
            filterId: item.nodeId,
        };
        const res = await deleteRuleAPi(param);
        if (res.data) {
            getChildrenTreeData(item.moduleId, bool, '');
        }
    };
    const deleteDraft = (e, item, bool) => {
        e.stopPropagation();
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '是否确认删除？',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                confirmDelete(item, bool);
            },
            onCancel() {},
        });
    };
    const onSelect = async (val, bool) => {
        const ruleArr = [301, 302, 303];
        if (ruleArr.includes(val[0])) {
            getChildrenTreeData(val[0], bool, '');
        } else {
            // 只改变filterId edit 请求
            if (bool) {
                setState({
                    draftSelected: val,
                    publishSelected: [],
                });
            } else {
                setState({
                    draftSelected: [],
                    publishSelected: val,
                });
            }
            setState({
                filterId: val[0],
                isDraft: bool,
            });
        }
    };
    const expandKeys = (val, bool) => {
        if (bool) {
            setState({
                draftExpand: val,
            });
        } else {
            setState({
                publishExpand: val,
            });
        }
    };
    const getTreeNode = async () => {
        const res = await getParentNodeAPi();
        const draftNodeList = res.data?.draftParentTreeNodeList.map((e) => {
            return { ...e, key: e.moduleId, children: [], title: <span className="tree-title">{e.nodeName}</span> };
        });
        const publishNodeList = res.data?.parentTreeNodeList.map((e) => {
            return { ...e, key: e.moduleId, children: [], title: <span className="tree-title">{e.nodeName}</span> };
        });
        if (res.data) {
            setState({
                draftNodeList,
                publishNodeList,
            });
        }
    };
    useEffect(() => {
        getTreeNode();
    }, []);
    const { draftTree, publishedTree, moduleId, filterId, isDraft, curRule, draftNodeList, publishNodeList } = state;
    return (
        <div className="dispatch-setting-page" style={{ height: '100%' }}>
            <div className="dispatch-setting-page-left">
                <section>
                    <div className="draft title-head" onClick={() => setState({ draftTree: !draftTree })}>
                        草稿
                    </div>
                    {draftTree && (
                        <Tree
                            treeData={draftNodeList}
                            onSelect={(val) => onSelect(val, true)}
                            showLine={{ showLeafIcon: false }}
                            autoExpandParent
                            expandedKeys={state.draftExpand}
                            onExpand={(val) => expandKeys(val, true)}
                            selectedKeys={state.draftSelected}
                        />
                    )}
                </section>
                <section>
                    <div className="published title-head" onClick={() => setState({ publishedTree: !publishedTree })}>
                        已发布
                    </div>
                    {publishedTree && (
                        <Tree
                            treeData={publishNodeList}
                            onSelect={(val) => onSelect(val, false)}
                            showLine={{ showLeafIcon: false }}
                            expandedKeys={state.publishExpand}
                            autoExpandParent
                            onExpand={(val) => expandKeys(val, false)}
                            selectedKeys={state.publishSelected}
                        />
                    )}
                </section>
            </div>
            <div className="dispatch-setting-page-right">
                <EditRight getChildrenTreeData={getChildrenTreeData} moduleId={moduleId} isDraft={isDraft} filterId={filterId} curRule={curRule} />
            </div>
        </div>
    );
};
export default DispatchSetting;
