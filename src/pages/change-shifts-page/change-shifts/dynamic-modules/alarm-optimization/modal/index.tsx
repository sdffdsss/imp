import React, { useRef } from 'react';
import ModalFooter from '@Components/custom-modal-footer';
import { Modal } from 'oss-ui';
import moment from 'moment';
import ModalContent from './modal-content';
import { IProps } from './types';

/**
 * 出发点：目前项目中使用到的Modal组件的代码中，modal组件与主页面的交互逻辑不统一，但是不同页面又需要引用同一个modal，现有modal无法复用。
 * 所以这里只是为了固化一种Modal业务的开发模式，实现modal组件与页面主体逻辑解耦，提高复用性。
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
        visible,
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
        // 调用内容组件抛出的某个事件 自定义后续行为
        const values = await modalContentRef.current?.getValues();

        values['firstTime'] = values.firstTime ? moment(values.firstTime).format('YYYY-MM-DD HH:mm:ss') : undefined;
        values['lastTime'] = values.lastTime ? moment(values.lastTime).format('YYYY-MM-DD HH:mm:ss') : undefined;
        values['createTime'] = values.createTime ? moment(values.createTime).format('YYYY-MM-DD HH:mm:ss') : undefined;
        values['clearTime'] = values.clearTime ? moment(values.clearTime).format('YYYY-MM-DD HH:mm:ss') : undefined;
        values['provinceId'] = values.province?.value;
        values['provinceName'] = values.province?.label;
        values['professionId'] = values.professional?.value;
        values['professionName'] = values.professional?.label;

        // 如果需要在确定按钮回传数据做其他处理则调用
        onOkProps?.(values);
    }

    function genTitle() {
        switch (mode) {
            case 'new':
                return '告警与优化管理';
            case 'edit':
            default:
                return '编辑';
        }
    }

    return (
        <Modal
            visible={visible}
            title={genTitle()}
            onCancel={onCancel}
            destroyOnClose
            footer={<ModalFooter onOk={onOk} {...footerProps} />}
            {...otherModalProps}
        >
            <ModalContent ref={modalContentRef} {...contentProps} mode={mode} />
        </Modal>
    );
};

export default ModalWapper;
