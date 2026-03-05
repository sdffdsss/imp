import React, { useRef } from 'react';
import ModalFooter from '@Components/custom-modal-footer';
import { Modal } from 'oss-ui';
import ModalContent from './modal-content';
import { IProps } from './types';
import { newAlarmView, updateAlarmView } from '../../../api';

/**
 * 出发点：目前项目中使用到的Modal组件的代码中，modal组件与主页面的交互逻辑不统一，但是不同页面又需要引用同一个modal，现有modal复用不方便或者modal内容需要复用。
 * 所以这里只是为了定义一种Modal业务的开发模式，实现modal组件与页面主体、modal框与内部内容逻辑解耦，提高复用性。
 * 模板代码！！！
 * 复制后继续修改文件  大部分修改应该集中在modal-content组件中
 */
const ModalWapper: React.FC<IProps> = ({ mode = 'new', contentProps = {}, ...otherModalProps }) => {
    const {
        onOk: onOkProps,
        onCancel,
        cancelText,
        okText,
        confirmLoading,
        okType,
        cancelButtonProps,
        okButtonProps,
        customFooterRender,
        okAuthKey,
    } = otherModalProps;

    const footerProps = {
        onCancel,
        cancelText,
        okText,
        confirmLoading,
        okType,
        cancelButtonProps,
        okButtonProps,
        render: customFooterRender,
        authKey: okAuthKey,
    };

    const modalContentRef = useRef<any>(null);

    async function onOk(e) {
        // // 调用内容组件抛出的某个事件 自定义后续行为
        const api = mode === 'new' ? newAlarmView : updateAlarmView;
        const values = await modalContentRef.current?.getValues();
        const res = await api(values);
        // 如果需要在确定按钮回传数据做其他处理则调用
        onOkProps?.(e, res);
    }

    function genTitle() {
        switch (mode) {
            case 'new':
                return '新建';
            case 'edit':
                return '编辑';
            default:
                return '查看';
        }
    }

    return (
        <Modal title={genTitle()} onCancel={onCancel} footer={<ModalFooter onOk={onOk} {...footerProps} />} {...otherModalProps}>
            <ModalContent ref={modalContentRef} {...contentProps} mode={mode} />
        </Modal>
    );
};

export default ModalWapper;
