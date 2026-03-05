import { Icon, Modal, Tooltip } from 'oss-ui';
import React, { useState } from 'react';
import './index.less';
import GroupInfoModal from './group-info';
import { ModalEnumType } from './group-info/types';

const INFO_TYPE = {
    default: 0,
    update: 1,
    cache: 2,
};
type Props = {
    detail: {
        title: string;
        labelGroup: string[];
        groupLeader: string;
        groupId?: number;
        type?: number;
    };
    provinceList: any[];
    onDelete: (id: string) => void;
    cacheGroupList: any[];
    updateGroupList: any[];
    disabled: boolean;
    onUpdate: ({ _data, values }) => void;
    groupFilterProvince: any;
};

export default function Index(props: Props) {
    const { detail, provinceList, onDelete, cacheGroupList, disabled, onUpdate, groupFilterProvince, updateGroupList } = props;
    const { title = '', labelGroup = [], groupLeader = '-', groupId = undefined, type = 0 } = detail;
    const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
    const [groupInfoType, setGroupInfoType] = useState<ModalEnumType>(0);

    const getInitValue = () => {
        // return {}
        if (![INFO_TYPE.cache, INFO_TYPE.update].includes(type)) {
            return {};
        } else {
            const _rowDetail = [...cacheGroupList, ...updateGroupList].find((item) => item?._data?.groupName === title);
            return _rowDetail || {};
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '确认删除该条记录吗',
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            width: '350px',
            onOk: () => {
                onDelete && onDelete(title);
            },
            onCancel() {},
        });
    };

    return (
        <>
            <div className="desc">
                <div className="desc-title">
                    <div className="desc-title-text">
                        <Tooltip title={title}>{title}</Tooltip>
                    </div>
                    <div className="desc-right-btn">
                        {!disabled && (
                            <>
                                <span
                                    className="desc-icon"
                                    onClick={() => {
                                        console.log(detail);
                                        setShowGroupInfoModal(true);
                                        setGroupInfoType(1);
                                    }}
                                >
                                    <Icon antdIcon type="EditOutlined" />
                                </span>
                                <span
                                    className="desc-icon"
                                    onClick={() => {
                                        handleDelete();
                                    }}
                                >
                                    <Icon antdIcon type="DeleteOutlined" />
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <p className="desc-group-leader">
                        <span className="desc-group-label">组长</span>
                        <span className="desc-group-name">{groupLeader || '--'}</span>
                    </p>
                    <div className="desc-group-member">
                        <span className="desc-group-label" style={{ display: 'inline-block', width: 27, height: '100%' }}>
                            组员
                        </span>
                        <div className="desc-group-member-item">
                            {labelGroup.map((item) => (
                                <div className="desc-group-name desc-group-member-name">{item}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showGroupInfoModal && (
                <GroupInfoModal
                    className="monitor-setting-edit-group-info-modal"
                    modalEnumType={groupInfoType}
                    onSaveGroupSuccess={(callback, type) => {
                        console.log(callback, type);
                        onUpdate && onUpdate(callback);
                    }}
                    rowDetail={detail}
                    onModalCancel={() => {
                        setGroupInfoType(0);
                        setShowGroupInfoModal(false);
                    }}
                    provinceList={provinceList}
                    groupFilterProvince={groupFilterProvince}
                    centerList={[]}
                    initValue={getInitValue()}
                    cacheGroupList={cacheGroupList}
                    updateGroupList={updateGroupList}
                />
            )}
        </>
    );
}
