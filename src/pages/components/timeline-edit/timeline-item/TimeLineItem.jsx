import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
import { Timeline, Tooltip, Radio, message } from 'oss-ui';
import { useSetState } from 'ahooks';
import TimelineItemContent from './index';
import './index.less';

const TimelineItem = (props, ref) => {
    const { data: item, pattern, templateList, uploading, setUploading, onUploadProps, onSave } = props;

    const [state, setState] = useSetState({
        itemData: item,
        datePickerValue: moment(item ? item.operationTime : new Date()),
        datePickerVisible: false,
        currentTemplateId: undefined,
    });
    const onRadioCLick = () => {
        const { itemData } = state;

        if (itemData.recordId) {
            onSave({
                ...itemData,
                remainFlag: itemData.remainFlag === 1 ? 0 : 1,
            });
        }
        setState({
            itemData: {
                ...itemData,
                remainFlag: itemData.remainFlag === 1 ? 0 : 1,
            },
        });
    };
    const onThisCompleteChange = () => {
        const { itemData } = state;
        if (itemData.recordId) {
            onSave({
                ...itemData,
                finishedFlag: itemData.finishedFlag === 1 ? 0 : 1,
                remainFlag: itemData.finishedFlag === 0 ? itemData.remainFlag : 1,
            });
        }
        setState({
            itemData: {
                ...itemData,
                finishedFlag: itemData.finishedFlag === 1 ? 0 : 1,
                remainFlag: itemData.finishedFlag === 0 ? itemData.remainFlag : 1,
            },
        });
    };
    function handleUpload({ file }, data) {
        const { itemData } = state;
        if (uploading) {
            message.warning(`正在上传附件，请稍后操作`);
            return;
        }

        setUploading(true);
        onUploadProps(file).then((res) => {
            const newItem = { ...itemData, fileInfos: [res, ...data.fileInfos] };

            if (itemData.recordId) {
                onSave(newItem);
            }
            // if (!itemData.recordId) {
            setState({ itemData: newItem });
            // }
            // if (newAddEmptyData.length > 0 && !data.recordId) {
            //     setNewAddEmptyData([newItem]);
            // } else {
            //     onSaveProps?.([newItem]);
            // }

            // if (editingItem && editingItem.recordId === data.recordId) {
            //     setEditingItem(newItem);
            // }

            setUploading(false);
        });
    }
    useEffect(() => {
        const initState = {
            itemData: item,
            datePickerValue: moment(item ? item.operationTime : new Date()),
        };
        const findInitTemplate = templateList.find((itm) => itm.defaultFlag === 1);

        if (!item.recordId && findInitTemplate) {
            initState.itemData = {
                ...item,
                content: findInitTemplate.templateContent,
            };
            initState.currentTemplateId = findInitTemplate.templateId;
        } else {
            initState.currentTemplateId = undefined;
        }

        setState(initState);
        // eslint-disable-next-line
    }, [item]);
    const isRemain = state.itemData.remainFlag === 1;
    useImperativeHandle(ref, () => {
        return {
            itemData: state.itemData,
        };
    });
    return (
        <Timeline.Item
            key={item.recordId}
            className="timeline-item-a1"
            dot={
                <Tooltip
                    title={isRemain ? '遗留到下个班次' : '默认不遗留'}
                    // getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
                >
                    <Radio disabled={pattern === 'readonly'} style={{ marginRight: 0 }} checked={isRemain} onClick={onRadioCLick} />
                </Tooltip>
            }
        >
            <TimelineItemContent
                {...props}
                onUpload={handleUpload}
                data={state.itemData}
                state={state}
                setState={setState}
                onCompleteChange={onThisCompleteChange}
            />
        </Timeline.Item>
    );
};

export default forwardRef(TimelineItem);
