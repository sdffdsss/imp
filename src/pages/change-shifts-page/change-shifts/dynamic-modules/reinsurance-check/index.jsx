import React, { Component } from 'react';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import ChangeShiftsEditTable from '@Pages/components/change-shifts-edit-table';
import ShiftChangeTypeEnum from '@Common/enum/shiftChangeTypeEnum';
import { getZonesNormalCase } from '@Common/utils/commonProvincesList';
import ViewModal from '@Pages/setting/views/reinsurance-record/compontent/view-modal';
import { ModalType } from '@Pages/setting/views/reinsurance-record/types';
import { sendLogFn } from '@Pages/components/auth/utils';
import columns from './columns';
import api from './api';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisabled: false,
            rowDetail: {},
            dictByFieldNameList: [],
            provinceList: [],
        };
    }

    componentDidMount() {
        this.getModalStuff();
    }

    getModalStuff = async () => {
        const res = await api.batchGetDictByFieldName([
            'dutyManagerProfession',
            'dutyManagerReinsuranceLogo',
            'dutyManagerReinsuranceType',
            'dutyManagerReinsuranceLevel',
            'dutyManagerReinsuranceUrgency',
        ]);
        if (res.code === 200) {
            this.setState({
                dictByFieldNameList: res.data,
            });
        }
        const { userInfo, systemInfo } = useLoginInfoModel.data;
        const info = JSON.parse(userInfo);
        getZonesNormalCase(info?.zones[0], systemInfo?.currentZone).then((ress) => {
            this.setState({
                provinceList: ress,
            });
        });
    };

    // 重保自查
    requestReinsuranceCheckSheet = async (pagetion) => {
        const { schedulingObj, pageType, loginInfo } = this.props;
        const { groupId, provinceId, workShiftId, dateTime, professionalTypes, professionalType, lastWorkShiftId } = schedulingObj || {};
        if (!professionalType) {
            return {};
        }
        const data = {
            specialtys: professionalTypes,
            workShiftId,
            groupId,
            provinceId,
            dateTime,
            pageSize: pagetion?.pageSize || 5,
            pageNum: pagetion?.current || 1,
            userId: loginInfo.userId,
        };
        const result = await api.getReinsuranceCheckSheet(data);
        result.pagination = {
            total: result?.total,
            pageSize: result?.pageSize,
            current: result?.current,
        };
        return result;
    };

    setModalVisabled = (bool) => {
        this.setState({
            modalVisabled: bool,
        });
    };

    setRowDetail = async (item) => {
        sendLogFn({ authKey: 'workbench-Workbench-ReInsurance-Detail' });
        // 如果是非创建 并且 有id，则发起请求
        if (!item) {
            this.setState({
                modalVisabled: false,
                rowDetail: undefined,
            });
            return;
        }
        if (item.applicationNumber) {
            const res = await api.queryReinsuranceRecordDetail({ applicationNumber: item.applicationNumber });
            if (res.code === 200) {
                this.setState({
                    modalVisabled: true,
                    rowDetail: res.data,
                });
            }
        }
    };

    render() {
        const { title, pattern, refreshFlag, pageType, moduleId } = this.props;
        const { modalVisabled, rowDetail, dictByFieldNameList, provinceList } = this.state;

        return (
            <>
                <ChangeShiftsEditTable
                    moduleId={moduleId}
                    title={title}
                    startRefreshData={refreshFlag}
                    columns={columns}
                    pattern={pattern}
                    tableColumnSettingConfigType="15"
                    rowKey="topic"
                    autoRefreshSetting={{ enable: true, interval: 60 * 3 * 1000 }}
                    refreshDataService={this.requestReinsuranceCheckSheet}
                    showRefreshButton={pageType !== ShiftChangeTypeEnum.DutyRecords}
                    showNewEmptyRow={false}
                    rowActions={[
                        {
                            type: 'view',
                            actionProps: {
                                handleView: async (item) => {
                                    this.setRowDetail(item);
                                },
                            },
                        },
                    ]}
                />
                {/* 重保记录查看 */}
                {modalVisabled && (
                    <ViewModal
                        modalVisabled={modalVisabled}
                        setModalVisabled={this.setModalVisabled}
                        modalType={ModalType.VIEW}
                        rowDetail={rowDetail}
                        setRowDetail={this.setRowDetail}
                        dictByFieldNameList={dictByFieldNameList}
                        // onLoad={() => {
                        //     actionRef.current.reload();
                        // }}
                        provinceList={provinceList}
                    />
                )}
            </>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
