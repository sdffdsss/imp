import React from 'react';
import { Button } from 'oss-ui';
import IconButton from '../icon-button';
import TextButton from '../text-button';
import deleteImgBlue from '../img/icon-10.png';
import deleteImg from '../img/icon-2.png';
import editImg from '../img/icon-5.png';
import editImBlue from '../img/icon-13.png';
import saveImgBlue from '../img/icon-11.png';
import saveImg from '../img/icon-3.png';
import linkImgBlue from '../img/icon-4-1.png';
import linkImg from '../img/icon-4.png';

interface IProps {
    showAddButton: boolean;
    showContentMode: 'edit' | 'show' | 'history';
    onRelateClick: () => void;
    deleteItem: () => void;
    selectItem: () => void;
    saveItem: () => void;
    modifyItem: () => void;
    addItem: () => void;
    isDelete: boolean;
}
export default function Index(props: IProps) {
    const { isDelete, showContentMode, showAddButton, modifyItem, deleteItem, onRelateClick, saveItem, addItem } = props;

    // 默认监控按钮
    const monitorShowButtons = (
        <>
            <IconButton title="编辑" defaultImg={editImg} selectedImg={editImBlue} onClick={modifyItem} />
            <IconButton title="删除" defaultImg={deleteImg} selectedImg={deleteImgBlue} onClick={deleteItem} />

            {showAddButton && (
                <Button type="primary" onClick={addItem} className="discription-list-btn">
                    新增
                </Button>
            )}
        </>
    );

    // 历史记录按钮
    const historyButtons = (
        <>
            {isDelete && <IconButton title="删除" defaultImg={deleteImg} selectedImg={deleteImgBlue} onClick={deleteItem} />}
            {isDelete ? <TextButton>已恢复</TextButton> : <TextButton type="primary">运行中</TextButton>}
        </>
    );

    const monitorEditButtons = (
        <>
            <IconButton title="保存" defaultImg={saveImg} selectedImg={saveImgBlue} onClick={saveItem} />
            <IconButton title="删除" defaultImg={deleteImg} selectedImg={deleteImgBlue} onClick={deleteItem} />
            <IconButton title="关联告警" defaultImg={linkImg} selectedImg={linkImgBlue} onClick={onRelateClick} />

            {showAddButton && (
                <Button type="primary" onClick={addItem} className="discription-list-btn">
                    新增
                </Button>
            )}
        </>
    );

    if (showContentMode === 'history') {
        return historyButtons;
    }
    if (showContentMode === 'edit') {
        return monitorEditButtons;
    }

    return monitorShowButtons;
}
