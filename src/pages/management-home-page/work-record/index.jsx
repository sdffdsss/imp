import React, { Fragment, createRef } from 'react';
import './style.less';
import { Collapse, Button, Icon, Input, message, Modal } from 'oss-ui';
import { ReactComponent as WindowSvg1 } from '../img/u224.svg';
import WorkRecords from './work-records';
import UploadFile from './upload-file';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import TimelineEdit from '@Pages/components/timeline-edit';
import { queryShiftingOfDutyNow, saveDutyMessage, deleteDutyMessage } from '../api';

const { Panel } = Collapse;
const { TextArea } = Input;
import { customAlphabet } from 'nanoid';
import CuoWu from '@Src/pages/change-shifts-page/change-shifts/img/noData.png';

class WorkRecord extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            originData: [],
            originDataVal: [],
            importanceInforms: [], //重要通知
            importanceInformsTemp: [], //重要通知
            schedulingObj: {}, //服务端所需班组状态。
            fileInfos: [], //文件数据
            type: 1, //类型1-交班，2-接班,3-值班记录查看
            activeKey: ['1', '2', '3'],
            editNotice: false,
            addRecord: true,
            baseInfo: {}, //基本信息
        };
    }

    workRecordsRef = createRef();
    importanceInformsRef = createRef();

    componentDidMount() {
        var search = document.querySelector('.record-text-area');
        search?.focus();
        if (this.props.state && this.props.state.type) {
            this.setState(
                {
                    type: this.props.state?.type,
                    schedulingObj: this.props.state.schedulingObj,
                },
                () => {
                    this.getdataInfo();
                    // setTimeout(() => {
                    this.addubtitleWord('1');
                    // }, 1000);
                },
            );
        }
    }

    getdataInfo = async () => {
        const {
            login: { userId },
        } = this.props;
        const { schedulingObj, type } = this.state;
        let data = {
            userId: userId,
            // dateTime: schedulingObj?.dateTime?.toString(),
            isDuty: type.toString(),
            groupId: schedulingObj?.groupId,
            workShiftId: schedulingObj?.workShiftId,
            nextWorkShiftId: schedulingObj?.nextTakeOrHandWorkShiftId,
            dateTime: schedulingObj?.dateTime,
            timeType: schedulingObj?.timeType,
            operationStatus: type.toString(),
            dutyStatus: type.toString(),
        };
        let result = await queryShiftingOfDutyNow(data);

        let fileInfos = [];
        const nanoid = customAlphabet('1234567890', 10);
        result?.resultObj?.fileInfos?.forEach((item, index) => {
            fileInfos.push({
                uid: item.fileId,
                name: item.fileName,
                status: 'done',
                url: item.url,
                userId: item.userId,
                operationTime: item.operationTime,
                fileId: item.fileId,
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
        });
        this.setState(
            {
                baseInfo: {
                    ...result?.resultObj,
                },
                originData: result?.resultObj?.dutyRecords,
                importanceInforms: result?.resultObj?.importanceInforms,
                fileInfos,
                schedulingObj: {
                    ...schedulingObj,
                    provinceId: result?.resultObj?.provinceId,
                },
                addRecord: true,
            },
            () => {
                // this.child.clearEditingKey();
            },
        );
    };

    workRecordRef = (ref) => {
        this.child = ref;
    };

    //修改工作记录
    changeOriginData = (val, type) => {
        this.setState(
            {
                originDataVal: val,
            },
            () => {
                this.saveChangeShifts('record');
            },
        );
    };

    //新增工作记录
    addubtitleWord = (key) => {
        this.workRecordsRef.current.addNew();
    };

    //修改重要通知
    handleSaveImportanceInforms = (val) => {
        this.setState(
            {
                importanceInformsTemp: val,
            },
            () => {
                this.saveChangeShifts('importance');
            },
        );
    };

    //修改附件
    changefile = (newFileList, newFileListVal) => {
        this.setState(
            {
                fileInfos: newFileList,
                fileInfosVal: newFileListVal,
            },
            () => {
                this.saveChangeShifts('file');
            },
        );
    };

    //修改附件
    changeCollapse = (val, obj) => {
        this.setState({
            activeKey: val,
        });
    };

    //保存当班记录信息
    // saveChangeShifts = async () => {
    //     const { addRecord } = this.state;
    //     if (addRecord) {
    //         Modal.confirm({
    //             title: '提示',
    //             icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
    //             content: '是否保存编辑信息？',
    //             okText: '确认',
    //             okButtonProps: { prefixCls: 'oss-ui-btn' },
    //             cancelButtonProps: { prefixCls: 'oss-ui-btn' },
    //             okType: 'danger',
    //             cancelText: '取消',
    //             prefixCls: 'oss-ui-modal',
    //             onOk: async () => {
    //                 const { importantNotice, schedulingObj, originData, fileInfos } = this.state;
    //                 const {
    //                     login: { userId },
    //                 } = this.props;
    //                 let fileList = [];
    //                 fileInfos.forEach((item, index) => {
    //                     fileList.push({
    //                         fileName: item.name,
    //                         userId: item.userId ? item.userId : userId,
    //                         operationTime: item.operationTime ? item.operationTime : '',
    //                     });
    //                 });
    //                 let data = {
    //                     userId,
    //                     importanceInform: importantNotice,
    //                     fileInfos: fileList,
    //                     dutyRecords: originData,
    //                     dateTime: schedulingObj?.dateTime,
    //                     shiftDutyId: schedulingObj?.workShiftId,
    //                     groupId: schedulingObj?.groupId,
    //                 };
    //                 let result = await saveDutyMessage(data);
    //                 if (result && result.resultCode === '200') {
    //                     message.success('保存成功!');
    //                     this.getdataInfo();
    //                 } else {
    //                     message.error('保存失败，请刷新后重试!');
    //                 }
    //             },
    //             onCancel() {},
    //         });
    //     } else {
    //         message.warning('有未保存的工作记录，请先保存再操作！');
    //     }
    // };

    //保存当班记录信息
    saveChangeShifts = async (modifyScope) => {
        const { importanceInforms, importanceInformsTemp, schedulingObj, originDataVal, fileInfos, baseInfo, fileInfosVal } = this.state;
        const {
            login: { userId },
        } = this.props;
        let fileList = [];
        fileInfosVal?.forEach((item, index) => {
            fileList.push({
                fileName: item.name,
                userId: item.userId ? item.userId : userId,
                operationTime: item.operationTime ? item.operationTime : '',
                fileId: item.fileId ? item.fileId : '',
            });
        });
        let data = {
            userId,
            // importanceInform: importanceInforms,
            importanceInforms: importanceInformsTemp,
            fileInfos: fileList,
            dutyRecords: originDataVal,
            dateTime: schedulingObj?.dateTime,
            shiftDutyId: schedulingObj?.workShiftId,
            groupId: schedulingObj?.groupId,
            modifyScope,
            contentId: baseInfo?.contentId,
        };
        let result = await saveDutyMessage(data);
        if (result && result.resultCode === '200') {
            message.success('保存成功!');

            this.setState({
                importanceInformsTemp: [],
                originDataVal: [],
            });

            this.getdataInfo();
        } else {
            message.error('保存失败，请刷新后重试!');
        }
    };

    delData = async (contentId, modifyScope) => {
        const {
            login: { userId },
        } = this.props;
        const { schedulingObj } = this.state;
        let data = {
            userId,
            dateTime: schedulingObj?.dateTime, //本班次对应的开始时间
            shiftDutyId: schedulingObj?.workShiftId, //班次ID
            contentId,
            modifyScope,
        };
        let result = await deleteDutyMessage(data);
        if (result && result.resultCode === '200') {
            message.success('删除成功!');
            this.getdataInfo();
        } else {
            message.error('删除失败，请刷新后重试!');
        }
    };

    changeNotice = (val, key) => {
        const { activeKey } = this.state;
        this.setState(
            {
                editNotice: val,
                activeKey: [key, ...activeKey],
            },
            () => {
                if (!val) {
                    this.saveChangeShifts('importance');
                }
            },
        );
    };
    render() {
        const { originData, importanceInforms, schedulingObj, fileInfos, activeKey, editNotice, type } = this.state;
        const { login } = this.props;
        return (
            <Fragment>
                <div className="duty-title-calendar">
                    <div style={{ paddingTop: '4px' }}>
                        <WindowSvg1 />
                    </div>

                    <div style={{ marginLeft: '4px', fontSize: '16px' }}>值班记录</div>
                </div>

                <div className="management-work-record-continer">
                    <Collapse
                        bordered={false}
                        defaultActiveKey={['1', '2', '3']}
                        expandIcon={(obj) =>
                            obj.isActive ? <Icon antdIcon type="CaretDownOutlined" /> : <Icon antdIcon type="CaretRightOutlined" />
                        }
                        activeKey={activeKey}
                        onChange={this.changeCollapse}
                        //   expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}

                        className="work-record-collapse"
                        expandIconPosition="right"
                    >
                        <Panel
                            header={
                                <div className="collapse-title">
                                    <div className="collapse-title-block"></div>
                                    <div>工作记录</div>
                                </div>
                            }
                            key="1"
                            className="work-record-panel"
                            extra={
                                type === 1 && (
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.addubtitleWord('1');
                                        }}
                                        className="panel-button"
                                    >
                                        <Icon antdIcon type="PlusOutlined" />
                                        新增
                                    </Button>
                                )
                            }
                        >
                            <TimelineEdit
                                ref={this.workRecordsRef}
                                modifyScope="record"
                                list={originData}
                                pattern="editable"
                                loginInfo={login}
                                onSave={this.changeOriginData}
                                onDelete={(id) => this.delData(id, 'record')}
                            />
                        </Panel>
                        <Panel
                            header={
                                <div className="collapse-title">
                                    <div className="collapse-title-block"></div>
                                    <div>重要通知</div>
                                </div>
                            }
                            key="2"
                            className="work-record-panel"
                            extra={
                                type === 1 && (
                                    <Button
                                        // className="panel-button"
                                        style={{ color: 'rgba(46, 160, 247, 1)', border: '1px solid rgba(46, 160, 247, 1)' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.importanceInformsRef.current.addNew();
                                        }}
                                    >
                                        <Icon antdIcon type="PlusOutlined" />
                                        新增
                                    </Button>
                                )
                            }
                        >
                            <TimelineEdit
                                ref={this.importanceInformsRef}
                                modifyScope="importance"
                                showLabel={false}
                                list={importanceInforms}
                                loginInfo={login}
                                pattern="editable"
                                onSave={this.handleSaveImportanceInforms}
                                onDelete={(id) => this.delData(id, 'importance')}
                            />
                        </Panel>
                        <Panel
                            header={
                                <div className="collapse-title">
                                    <div className="collapse-title-block"></div>
                                    <div>上传附件</div>
                                </div>
                            }
                            key="3"
                            className="work-record-panel"
                        >
                            <div className="upload-file-continer">
                                <UploadFile
                                    delData={this.delData}
                                    schedulingObj={schedulingObj}
                                    fileInfos={fileInfos}
                                    changefile={this.changefile}
                                    type={type}
                                />
                                <span style={{ color: '#FF2A44' }}>
                                    附件支持上传文件（word/excel/ppt/pdf/wps）和图片（BMP/JPEG/PNG）；每个附件不超过10M；最多上传6个附件
                                </span>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                {/* <div className="work-record-button">
                    {type === 1 && (
                        <Button
                            type="primary"
                            onClick={() => {
                                this.saveChangeShifts();
                            }}
                        >
                            保存
                        </Button>
                    )}
                </div> */}
            </Fragment>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(WorkRecord);
