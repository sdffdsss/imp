import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'oss-ui';
import AuthButtonNew from '@Pages/components/auth/auth-button';
import ViewIcon from './images/card-view.png';
import AddIcon from './images/card-add.png';
import EditIcon from './images/card-edit.png';
import ApproveIcon from './images/card-approve.png';
import FaultReportModal from '@Src/pages/troubleshooting-workbench/components/header/fault-report-modal';
import UploadFile from '@Src/pages/major-fault-report/upload-file';

const Index: React.FC<{
    row: any;
    changeZIndex?: (bool: boolean) => void;
    theme: string;
    openMajorModal?: (item: any, type: string) => void;
    cardsDockedLeft: any;
    isScheduled?: boolean;
}> = ({ row, changeZIndex, theme, openMajorModal, isScheduled = true, cardsDockedLeft }) => {
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [editType, setEditType] = useState('');
    // const [title, setTitle] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [isView, setIsView] = useState(false);
    // const [isShowUploadFileModal, setIsShowUploadFileModal] = useState(false);
    const getBtnImg = (key) => {
        let img: any = '';
        switch (key) {
            case 'majorFaultReport:firstReportApplication':
            case 'majorFaultReport:supplementalReportApplication':
            case 'majorFaultReport:supplementalReport':
            case 'majorFaultReport:progressReportSupplementalApplication':
            case 'majorFaultReport:progressReportSupplemental':
            case 'faultReport:upload':
            case 'majorFaultReport:upload':
                if (isScheduled) {
                    img = <img src={AddIcon} alt="" style={{ width: 20, height: 20, marginRight: 8 }} />;
                } else {
                    img = <Icon antdIcon type="PlusCircleOutlined" />;
                }
                break;
            case 'majorFaultReport:firstReportEditApplication':
            case 'majorFaultReport:firstReportEdit':
            case 'majorFaultReport:progressReportEditApplication':
            case 'majorFaultReport:progressReportEdit':
            case 'majorFaultReport:finalReportEditApplication':
            case 'majorFaultReport:finalReportEdit':
                if (isScheduled) {
                    img = <img src={EditIcon} alt="" style={{ width: 20, height: 20, marginRight: 8 }} />;
                } else {
                    img = <Icon antdIcon type="EditOutlined" />;
                }
                break;
            case 'majorFaultReport:firstReportApprove':
            case 'majorFaultReport:firstReportEditApprove':
            case 'majorFaultReport:progressReportApprove':
            case 'majorFaultReport:progressReportEditApprove':
            case 'majorFaultReport:finalReportApprove':
            case 'majorFaultReport:finalReportEditApprove':
                img = ApproveIcon;
                if (isScheduled) {
                    img = <img src={ApproveIcon} alt="" style={{ width: 20, height: 20, marginRight: 8 }} />;
                } else {
                    img = <img src={ApproveIcon} alt="" style={{ width: 12, height: 12, marginTop: -3 }} />;
                }
                break;
            case 'faultReport:view':
            case 'majorFaultReport:view':
                if (isScheduled) {
                    img = <img src={ViewIcon} alt="" style={{ width: 20, height: 20, marginRight: 8 }} />;
                } else {
                    img = <Icon antdIcon type="SearchOutlined" />;
                }
                break;
            default:
                break;
        }
        return img;
    };
    const onFaultReportCancel = () => {
        setCurrentItem(null);
        setIsView(false);
        setIsModalOpen(false);
        changeZIndex?.(false);
    };

    return (
        <div style={{ display: 'flex' }}>
            {row?.buttonList?.map((item) => {
                const keyArr = item?.split('|');
                return keyArr?.length === 2 ? (
                    <Tooltip title={keyArr[1]}>
                        <AuthButtonNew
                            key={keyArr[0]}
                            style={{ width: 30 }}
                            onClick={() => {
                                openMajorModal(row, keyArr[0], keyArr[1]);
                                // if (theme !== 'white') {
                                //     setEditType(keyArr[0]);
                                //     setTitle(keyArr[1]);
                                //     setCurrentItem(row);
                                //     if (keyArr[1].indexOf('上传附件') >= 0) {
                                //         setIsShowUploadFileModal(true);
                                //     } else {
                                //         setIsModalOpen(true);
                                //     }
                                //     changeZIndex?.(true);
                                // } else {
                                //     openMajorModal(row, keyArr[0], keyArr[1]);
                                // }
                            }}
                            authKey={keyArr[0]}
                            ignoreAuth
                            type="text"
                            // antdIcon
                        >
                            {getBtnImg(keyArr[0])}
                        </AuthButtonNew>
                    </Tooltip>
                ) : (
                    ''
                );
            })}
            {/* {isModalOpen && (
                <FaultReportModal
                    title={title}
                    visible={isModalOpen}
                    onCancel={onFaultReportCancel}
                    dataSource={currentItem}
                    isView={isView}
                    // goToListPage={goToListPage}
                    setFaultReportDataSource={setCurrentItem}
                    setIsView={setIsView}
                    isMajor={editType.includes('major')}
                    theme={theme}
                    btnKey={editType}
                    cardsDockedLeft={cardsDockedLeft}
                />
            )}
            {isShowUploadFileModal && (
                <UploadFile visible={isShowUploadFileModal} setVisible={setIsShowUploadFileModal} flagId={currentItem?.flagId} />
            )} */}
        </div>
    );
};

export default Index;
