import React from 'react';
import { Button, Image, message } from 'oss-ui';
import shareActions from '@Src/share/actions';
import constants from '@Src/common/constants';
import TreeCube from '../tree-cube';
import './index.less';

const DetailContentBox = (props) => {
    const { monitorCenterName, monitorGroupList, dispatchGroupList, monitorCenterPersonnelNum, monitorCenterId, operations, provinceId, closeModal } =
        props;

    /**
     * @discription 分配宽度的函数
     * @returns 左右比例
     */
    const computeBoxWidth = () => {
        const temp = { left: 1, right: 1 };
        if (monitorGroupList.length > 4 && dispatchGroupList.length === 0) {
            temp.left = 8;
        } else if (monitorGroupList.length === 0 && dispatchGroupList.length > 4) {
            temp.right = 8;
        }
        return temp;
    };
    // 跳转至overview
    const goOverview = () => {
        const hasAuthority = operations?.find((record) => record.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/overview/digital-twin`);
        if (!hasAuthority) {
            message.warn('您没有监控大厅权限，请联系管理员在角色管理中授权');
            return;
        }
        let timer;
        const { actions, messageTypes } = shareActions;
        closeModal();
        clearTimeout(timer);
        timer = setTimeout(() => {
            actions?.postMessage?.(messageTypes.openRoute, {
                entry: `/overview/digital-twin`,
                extraContent: { search: { provinceId, monitorCenterId } },
            });
        }, 1000);
    };
    // 跳值班长工作台
    const goDutyBench = () => {
        let timer;
        const { actions, messageTypes } = shareActions;
        // if (!actions || typeof actions?.postMessage !== 'function' || !messageTypes) return;
        actions?.postMessage(messageTypes.closeTabs, {
            entry: `/unicom/duty-monitor-view`,
        });
        closeModal();
        clearTimeout(timer);
        timer = setTimeout(() => {
            actions?.postMessage?.(messageTypes.openRoute, {
                entry: `/unicom/duty-monitor-view`, // 跳转值班长工作台
                search: { provinceId },
            });
        }, 1000);
    };

    // 跳值班人工作台
    const jumpBenchMonitorGroup = (groupId) => {
        let timer;
        // 监控班组
        const { actions, messageTypes } = shareActions;
        // if (!actions || typeof actions?.postMessage !== 'function' || !messageTypes) return;
        const hasAuthority = operations?.find((record) => record.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom/monitor-view`);
        if (!hasAuthority) {
            message.warn('您没有值班人工作台权限，请联系管理员在角色管理中授权');
            return;
        }
        actions?.postMessage?.(messageTypes.closeTabs, {
            entry: `/unicom/monitor-view`,
        });
        closeModal();
        clearTimeout(timer);
        timer = setTimeout(() => {
            actions?.postMessage(messageTypes.openRoute, {
                entry: `/unicom/monitor-view`, // 跳转值班人工作台
                search: {
                    groupId,
                },
            });
        }, 1000);
    };

    const jumpBenchDispatchGroup = () => {
        let timer;
        // 调度班组
        const { actions, messageTypes } = shareActions;
        // if (!actions || typeof actions?.postMessage !== 'function' || !messageTypes) return;
        const hasAuthority = operations?.find(
            (record) => record.path === `/znjk/${constants.CUR_ENVIRONMENT}/main/unicom/home/troubleshooting-workbench`,
        );
        if (!hasAuthority) {
            message.warn('您没有调度工作台权限，请联系管理员在角色管理中授权');
            return;
        }
        actions?.postMessage?.(messageTypes.closeTabs, {
            entry: `/unicom/home/troubleshooting-workbench`,
        });
        closeModal();
        clearTimeout(timer);
        timer = setTimeout(() => {
            actions?.postMessage?.(messageTypes.openRoute, {
                entry: `/unicom/home/troubleshooting-workbench`, // 跳转值班长工作台
                search: { provinceId },
            });
        }, 1000);
    };
    const goGroupManage = () => {
        let timer;
        const { actions, messageTypes } = shareActions;
        const hasAuthority = operations?.find((record) => record.path === '/unicom/management-home-page/core/group-manage');
        if (!hasAuthority) {
            message.warn('您没有权限，请联系管理员在角色管理中授权');
            return;
        }
        actions?.postMessage?.(messageTypes.closeTabs, {
            entry: `/unicom/management-home-page/core/group-manage`,
        });
        closeModal();
        clearTimeout(timer);
        timer = setTimeout(() => {
            actions?.postMessage?.(messageTypes.openRoute, {
                entry: `/unicom/management-home-page/core/group-manage`,
                search: { needInitAddModal: true },
            });
        }, 1000);
    };
    return (
        <div className="detail-content-box">
            <div className="detail-btn-box">
                <Button className="detail-btn-box-btn" onClick={() => goOverview()}>
                    <div className="btn-image">
                        <Image width="37px" preview={false} src={`${constants.IMAGE_PATH}/monitor/监控人员数.png`} />
                    </div>

                    <div className="btn-content">
                        <div className="btn-content-text">{monitorCenterName}</div>
                        <div>
                            <span className="btn-content-num">{monitorCenterPersonnelNum}</span>&nbsp;人
                        </div>
                    </div>
                </Button>
            </div>
            <div className="detail-image-box">
                <Image width="5px" preview={false} src={`${constants.IMAGE_PATH}/monitor/直线 7.png`} />
            </div>
            <div className="detail-btn-box">
                <Button className="detail-btn-box-btn" onClick={() => goDutyBench()}>
                    <Image width="30px" preview={false} src={`${constants.IMAGE_PATH}/monitor/值班班组.png`} />
                    <div className="btn-content">
                        <div>值班长工作台</div>
                    </div>
                </Button>
            </div>
            <div className="detail-image-box">
                <Image width="5px" preview={false} src={`${constants.IMAGE_PATH}/monitor/直线 7.png`} />
            </div>
            <div className="detail-tree-box">
                <div className="detail-tree-box-left" style={{ flex: computeBoxWidth().left }}>
                    <div className="left-title">
                        <span>监控班组</span>
                    </div>
                    <div className="tree-content-box">
                        {monitorGroupList.length !== 0 ? (
                            monitorGroupList.map((item) => {
                                const { monitorGroupId, monitorGroupName, monitorGroupPersonnelNum } = item;
                                return (
                                    <TreeCube
                                        key={monitorGroupId}
                                        monitorGroupName={monitorGroupName}
                                        monitorGroupPersonnelNum={monitorGroupPersonnelNum}
                                        onclick={() => jumpBenchMonitorGroup(monitorGroupId)}
                                    />
                                );
                            })
                        ) : (
                            <div className="add-team-or-group">
                                <div className="click-add-box" onClick={() => goGroupManage()}>
                                    <Image width="36px" preview={false} src={`${constants.IMAGE_PATH}/monitor/添加.png`} />
                                    <span>新增班组</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="detail-tree-box-right" style={{ flex: computeBoxWidth().right }}>
                    <div className="right-title">
                        <span>调度班组</span>
                    </div>
                    <div className="tree-content-box">
                        {dispatchGroupList.length !== 0 ? (
                            dispatchGroupList.map((item) => {
                                const { monitorGroupId, monitorGroupName, monitorGroupPersonnelNum } = item;
                                return (
                                    <TreeCube
                                        key={monitorGroupId}
                                        monitorGroupName={monitorGroupName}
                                        monitorGroupPersonnelNum={monitorGroupPersonnelNum}
                                        onclick={jumpBenchDispatchGroup}
                                    />
                                );
                            })
                        ) : (
                            <div className="add-team-or-group">
                                <div className="click-add-box" onClick={() => goGroupManage()}>
                                    <Image width="36px" preview={false} src={`${constants.IMAGE_PATH}/monitor/添加.png`} />
                                    <span>新增班组</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailContentBox;
