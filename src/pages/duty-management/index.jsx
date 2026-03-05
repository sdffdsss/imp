import React from 'react';
import './style.less';
import actionss from '@Src/share/actions';
import useLoginInfoModel from '@Src/hox';

const DutyManagement = (props) => {
    const login = useLoginInfoModel();
    const {
        systemInfo: { theme },
    } = login;
    const pushActions = (url) => {
        const { actions, messageTypes } = actionss;
        actions &&
            actions.postMessage &&
            actions.postMessage(messageTypes.openRoute, {
                entry: url,
            });
    };
    return (
        <div className={theme === 'light' ? 'duty-management-page' : 'duty-management-page duty-management-page-drakblue'}>
            <div className="duty-management-page-content">
                <div className="duty-management-page-content-field">
                    <div className="duty-management-page-field-image" onClick={() => pushActions(`/unicom/duty-management/monitor-setting`)}>
                        <img src={require(theme === 'light' ? './images/monitor-light.png' : './images/monitor-drakblue.png')} />
                        <span>监控中心设置</span>
                    </div>
                    {/* <div className='duty-management-page-field-work'>监控中心设置</div> */}
                </div>
                <div className="duty-management-page-content-field">
                    <div className="duty-management-page-field-image" onClick={() => pushActions(`/unicom/duty-management/core/group-manage`)}>
                        <img src={require(theme === 'light' ? './images/group-light.png' : './images/group-drakblue.png')} />
                        <span>监控班组设置</span>
                    </div>
                </div>
                <div className="duty-management-page-content-field">
                    <div className="duty-management-page-field-image" onClick={() => pushActions(`/unicom/duty-management/change-shifts-page`)}>
                        <img src={require(theme === 'light' ? './images/manage-light.png' : './images/group-drakblue.png')} />
                        <span style={{ paddingLeft: 34 }}>交接班</span>
                    </div>
                </div>

                <div className="duty-management-page-content-field">
                    <div className="duty-management-page-field-image" onClick={() => pushActions(`/unicom/duty-management/change-shifts-page`)}>
                        <img src={require(theme === 'light' ? './images/manage-light.png' : './images/group-drakblue.png')} />
                        <span style={{ paddingLeft: 34 }}>重保记录(自查)</span>
                    </div>
                </div>
            </div>
            <div className="duty-management-page-content" style={{ width: '56%' }}>
                <div className="duty-management-page-content-field">
                    <div className="duty-management-page-field-image" onClick={() => pushActions(`/unicom/duty-management/monitor-date-list-search`)}>
                        <img src={require(theme === 'light' ? './images/data-light.png' : './images/group-drakblue.png')} />
                        <span style={{ paddingLeft: 15 }}>监控值班表</span>
                    </div>
                </div>

                <div className="duty-management-page-content-field">
                    <div className="duty-management-page-field-image" onClick={() => pushActions(`/unicom/duty-management/record-duty`)}>
                        <img src={require(theme === 'light' ? './images/right-light.png' : './images/group-drakblue.png')} />
                        <span style={{ paddingLeft: 25 }}>值班记录</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DutyManagement;
