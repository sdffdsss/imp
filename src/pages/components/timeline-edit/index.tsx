import React, { forwardRef, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Icon, Timeline, Modal, message, Spin } from 'oss-ui';
import { usePersistFn } from 'ahooks';
import { _ } from 'oss-web-toolkits';
// eslint-disable-next-line
import { InputRef } from 'antd';
import moment from 'moment';
import { sendLogFn } from '@Pages/components/auth/utils';
// import TimelineItemContent from './timeline-item';
import TimelineItem from './timeline-item/TimeLineItem';
import type { ComponentProps, ICustomItem } from './types';
import './index.less';

export * from './types';

const modifyScopeTypeName = {
    importance: '重要通知',
    record: '工作记录',
};
interface IProps extends ComponentProps {
    onEdit: (flag: string) => void;
    templateList: any[];
}

const Index = forwardRef((props: IProps, ref) => {
    const {
        modifyScope = 'record',
        pattern = 'readonly',
        showUserName = true,
        list,
        onSave: onSaveProps,
        onDelete: onDeleteProps,
        // @ts-ignore
        loginInfo,
        onUpload: onUploadProps,
        onDeleteFile: onDeleteFileProps,
        onDownload: onDownloadProps,
        onEdit,
        templateList,
        ...timelineProps
    } = props;
    const [editingItem, setEditingItem] = useState<ICustomItem | null>();
    const [uploading, setUploading] = useState(false);
    // const update = useUpdate();
    const contentEditAreaDomRef = useRef<InputRef>(null);
    const [newAddEmptyData, setNewAddEmptyData] = useState<ICustomItem[]>([]);
    const { userId, userName } = loginInfo;
    const timeLineItemRef = useRef<any>([]);
    const addNew = usePersistFn((isInit) => {
        if (uploading) {
            message.warning(`正在上传附件，请稍后操作`);
            return;
        }
        if (editingItem) {
            if (!isInit) {
                message.warning(`请先保存${modifyScopeTypeName[modifyScope]}再新增!`);
            }
            // contentEditAreaDomRef.current?.focus();

            return;
        }

        const newAddEmptyTemplateData: ICustomItem = {
            recordId: undefined,
            userName: pattern === 'readonly' ? '' : userName,
            userId,
            operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: '',
            finishedFlag: 1,
            remainFlag: 0,
            prevFlag: 0,
            fileInfos: [],
        };

        setNewAddEmptyData([newAddEmptyTemplateData]);
        setEditingItem(newAddEmptyTemplateData);
    });
    const clearEmptyData = usePersistFn(() => {
        setEditingItem(null);
        setNewAddEmptyData([]);
    });
    const saveAll = () => {
        const timeLineAllData = timeLineItemRef.current
            .filter((el) => el)
            .map((el) => {
                return el.itemData;
            });

        return {
            modifyScope,
            fieldName: modifyScope === 'record' ? 'dutyRecords' : 'importanceInforms',
            value: timeLineAllData,
        };
    };
    useImperativeHandle(ref, () => ({
        addNew,
        judgeIsEditing: function judgeIsEditing() {
            return !!editingItem;
        },
        clearEmptyData,
        upDateMap: saveAll,
    }));

    useEffect(() => {
        clearEmptyData();

        setTimeout(() => {
            if (list.length === 0) {
                addNew(true);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    // function onLegacyClick(item) {
    //     if (uploading) {
    //         message.warning(`正在上传附件，请稍后操作`);
    //         return;
    //     }
    //     const newItem = { ...item, remainFlag: item.remainFlag === 1 ? 0 : 1 };

    //     if (newAddEmptyData.length > 0 && !item.recordId) {
    //         setNewAddEmptyData([newItem]);
    //     } else {
    //         onSaveProps?.([newItem]);
    //     }
    //     if (editingItem && editingItem.recordId === item.recordId) {
    //         setEditingItem(newItem);
    //     }
    // }

    // function onCompleteChange(item) {
    //     if (uploading) {
    //         message.warning(`正在上传附件，请稍后操作`);
    //         return;
    //     }

    //     const newItem = { ...item, finishedFlag: item.finishedFlag === 1 ? 0 : 1, remainFlag: item.finishedFlag === 0 ? item.remainFlag : 1 };

    //     if (newAddEmptyData.length > 0 && !item.recordId) {
    //         setNewAddEmptyData([newItem]);
    //     } else {
    //         onSaveProps?.([newItem]);
    //     }
    //     if (editingItem && editingItem.recordId === item.recordId) {
    //         setEditingItem(newItem);
    //     }
    // }

    function onDelete(item) {
        if (uploading) {
            message.warning(`正在上传附件，请稍后操作`);
            return;
        }
        sendLogFn({ authKey: 'workbench-Workbench-WordRecord-Delete' });

        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: `确认删除该${modifyScopeTypeName[modifyScope]}吗？`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                if (!item.recordId) {
                    setEditingItem(null);
                    setNewAddEmptyData([]);
                    if (list.length === 0) {
                        setTimeout(() => {
                            addNew(true);
                        });
                    }
                } else {
                    onDeleteProps?.(item.recordId!);
                }
            },
            onCancel() {},
        });
    }

    // function onModifyClick(item) {
    //     if (uploading) {
    //         message.warning(`正在上传附件，请稍后操作`);
    //         return;
    //     }
    //     sendLogFn({ authKey: 'workbench-Workbench-WordRecord-Edit' });

    //     // if (editingItem) {
    //     //     message.warning(`请先保存${modifyScopeTypeName[modifyScope]}再编辑`);
    //     //     contentEditAreaDomRef.current?.focus();
    //     // } else {
    //     setEditingItem(item);
    //     // }
    // }

    // function onSave(item: ICustomItem) {
    //     if (uploading) {
    //         message.warning(`正在上传附件，请稍后操作`);
    //         return;
    //     }
    //     sendLogFn({ authKey: 'workbench-Workbench-WordRecord-Edit' });

    //     if (editingItem) {
    //         message.warning(`请先保存${modifyScopeTypeName[modifyScope]}再编辑`);
    //         // contentEditAreaDomRef.current?.focus();
    //     } else {
    //         setEditingItem(item);
    //     }
    // }

    function onSave(item: ICustomItem) {
        if (uploading) {
            message.warning(`正在上传附件，请稍后操作`);
            return;
        }
        sendLogFn({ authKey: 'workbench-Workbench-WordRecord-Edit' });

        if (item && item.content.length > 0) {
            onSaveProps?.([
                {
                    ...item,
                    // remainFlag: item.finishedFlag === 1 ? item.remainFlag : 1,
                },
            ]);
            setEditingItem(null);
            setNewAddEmptyData([]);
        } else {
            message.warning(`${modifyScopeTypeName[modifyScope]}不能为空!`);
        }
    }

    // function onTextAreaChange(event) {
    //     setEditingItem((prev) => Object.assign(prev as ICustomItem, { content: event?.target?.value }));
    //     update();
    // }
    // function onDateChange(time) {
    //     setEditingItem((prev) => Object.assign(prev as ICustomItem, { operationTime: time.format('YYYY-MM-DD HH:mm:ss') }));
    //     update();
    // }
    function handleDeleteFile(itemFile, indexFile, data) {
        if (uploading) {
            message.warning(`正在上传附件，请稍后操作`);
            return;
        }

        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '是否确认删除该附件？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                onDeleteFileProps(itemFile).then(() => {
                    const newItem = { ...data, fileInfos: data.fileInfos.filter((item, index) => index !== indexFile) };

                    if (newAddEmptyData.length > 0 && !data.recordId) {
                        setNewAddEmptyData([newItem]);
                    } else {
                        onSaveProps?.([newItem]);
                    }

                    if (editingItem && editingItem.recordId === data.recordId) {
                        setEditingItem(newItem);
                    }
                });
            },
            onCancel() {},
        });
    }

    // function handleUpload({ file }, data) {
    //     if (uploading) {
    //         message.warning(`正在上传附件，请稍后操作`);
    //         return;
    //     }

    //     setUploading(true);
    //     onUploadProps(file).then((res) => {
    //         const newItem = { ...data, fileInfos: [res, ...data.fileInfos] };

    //         if (newAddEmptyData.length > 0 && !data.recordId) {
    //             setNewAddEmptyData([newItem]);
    //         } else {
    //             onSaveProps?.([newItem]);
    //         }

    //         if (editingItem && editingItem.recordId === data.recordId) {
    //             setEditingItem(newItem);
    //         }

    //         setUploading(false);
    //     });
    // }
    function handleDownload(itemFile) {
        onDownloadProps(itemFile);
    }

    if (list.length === 0 && newAddEmptyData.length === 0) {
        return <Spin />;
    }

    return (
        <div className="timeline-edit-common-comp-wrapper">
            <Timeline {...timelineProps} mode="left">
                {[...newAddEmptyData, ...list].map((item, index) => {
                    return (
                        <TimelineItem
                            key={item.recordId}
                            ref={(el: any) => {
                                timeLineItemRef.current[index] = el;
                            }}
                            data={item}
                            uploading={uploading}
                            setUploading={setUploading}
                            onUploadProps={onUploadProps}
                            showUserName={showUserName}
                            contentEditAreaDomRef={contentEditAreaDomRef}
                            pattern={pattern}
                            editingItem={editingItem}
                            // onCompleteChange={onCompleteChange}
                            onSave={onSave}
                            onDelete={() => onDelete(item)}
                            onDeleteFile={handleDeleteFile}
                            onDownload={handleDownload}
                            // onUpload={handleUpload}
                            // onLegacyClick={onLegacyClick}
                            templateList={templateList}
                            modifyScope={modifyScope}
                            onFocus={() => onEdit?.('focus')}
                            onBlur={() => onEdit?.('blur')}
                        />
                    );
                })}
            </Timeline>
        </div>
    );
});

Index.defaultProps = {
    list: [],
};
export default Index;
