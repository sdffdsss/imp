import React, { Component, createRef } from 'react';
import { withModel } from 'hox';
import { Modal, Input, Typography, Button } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import ChangeShiftsEditTable from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { sendLogFn } from '@Pages/components/auth/utils';
import columns from './columns';
import api from './api';
import './index.less';

class Index extends Component {
    ref = createRef();
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRow: {},
        };
    }
    // 割接工单
    requestCutSheet = async (pagetion) => {
        const { login, schedulingObj, pageType } = this.props;
        const { groupId, workShiftId, lastWorkShiftId, professionalTypes, professionalType, dateTime, workBeginTime, workEndTime } =
            schedulingObj || {};

        const { currentZone, userId } = login;
        const { zoneId } = currentZone;

        if (!professionalType) {
            return {};
        }
        const data = {
            specialtys: professionalTypes,
            provinceId: zoneId,
            groupId,
            workShiftId,
            dateTime,
            pageSize: pagetion?.pageSize || 5,
            pageNum: pagetion?.current || 1,
            dutyBeginTime: workBeginTime,
            dutyEndTime: workEndTime,
            userId,
        };
        const result = await api.getCutSheet(data);
        result.pagination = {
            total: result?.total,
            pageSize: result?.pageSize,
            current: result?.current,
        };
        return result;
    };

    onOk = () => {
        if (this.props.pattern === 'readonly') {
            this.setState({ visible: false });
        } else {
            api.saveCutSheet({ ...this.state.editRow, syncModifyLargeScreen: true }).then((res) => {
                if (res.code === 200) {
                    this.setState({ visible: false });
                    this.ref.current.refreshData();
                }
            });
        }
    };

    onCancel = () => {
        this.setState({ visible: false });
    };

    onDoubleClick = (record) => {
        this.setState({ editRow: record, visible: true });
    };

    jumpCutInfoPlan = () => {
        api.getCutInfoPlanApi({
            logInId: this.props.loginInfo.loginId,
        }).then((res) => {
            if (res.code === 200 && res.data) {
                window.open(res.data);
            }
        });
    };

    getTransmissionDetailUrl = (record) => {
        api.getTransmissionDetailUrlApi({ sheetNumber: record.sheetNumber, logInId: this.props.loginInfo.loginId }).then((res) => {
            if (res.code === 200 && res.data) {
                window.open(res.data);
            }
        });
    };

    render() {
        const { title, pattern, refreshFlag, pageType, moduleId, schedulingObj } = this.props;
        const { visible, editRow } = this.state;
        const { professionalTypes, provinceId } = schedulingObj || {};

        const finalColumns = columns.map((item) => {
            if (item.dataIndex === 'review') {
                return {
                    ...item,
                    render: (text, record) => {
                        return <div onDoubleClick={() => this.onDoubleClick(record)}>{text}</div>;
                    },
                };
            }
            if (item.dataIndex === 'sheetNumber') {
                return {
                    ...item,
                    render: (text, record) => {
                        return (
                            <a
                                onClick={() => {
                                    sendLogFn({ authKey: 'workbench-Workbench-Shift-CutoverDispatch-Detail' });
                                    this.getTransmissionDetailUrl(record);
                                }}
                            >
                                {text}
                            </a>
                        );
                    },
                };
            }
            return {
                ...item,
            };
        });

        return (
            <>
                <ChangeShiftsEditTable
                    moduleId={moduleId}
                    title={title}
                    columns={finalColumns}
                    rowKey="sheetNo"
                    pattern={pattern}
                    needIndexColumn
                    startRefreshData={refreshFlag}
                    autoRefreshSetting={{ enable: true, interval: 60 * 10 * 1000 }}
                    showNewEmptyRow={false}
                    refreshDataService={this.requestCutSheet}
                    ref={this.ref}
                    showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                    rowActions={[]}
                    tableColumnSettingConfigType="16"
                    toolBarRender={
                        String(provinceId) === '0' && professionalTypes.includes(3)
                            ? [<Button onClick={this.jumpCutInfoPlan}>割接信息计划</Button>]
                            : []
                    }
                />
                <Modal
                    visible={visible}
                    title="割接审核"
                    onCancel={this.onCancel}
                    bodyStyle={{ height: 400, display: 'flex', flexDirection: 'column' }}
                    width={700}
                    maskClosable={false}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={this.onCancel} style={{ marginRight: '30px' }}>
                                取消
                            </Button>
                            <Button onClick={this.onOk} type="primary">
                                确定
                            </Button>
                        </div>
                    }
                >
                    <Typography.Title level={5}>请输入审核结果：</Typography.Title>
                    <div style={{ flex: 'auto', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-22px', right: 0, color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                            {editRow?.review?.length || 0} / 200
                        </div>
                        <Input.TextArea
                            disabled={pattern === 'readonly'}
                            maxLength={200}
                            style={{ height: '100%', fontSize: '14px' }}
                            value={editRow?.review}
                            onChange={(e) => {
                                this.setState({
                                    editRow: {
                                        ...editRow,
                                        review: e.target.value,
                                    },
                                });
                            }}
                        />
                    </div>
                </Modal>
            </>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
