import React, { useRef } from 'react';
import { Modal } from 'oss-ui';
import ModalContent from './modal-content';
import { IProps } from './types';

/**
 * 出发点：目前项目中使用到的Modal组件的代码中，modal组件与主页面的交互逻辑不统一，但是不同页面又需要引用同一个modal，现有modal复用不方便或者modal内容需要复用。
 * 所以这里只是为了定义一种Modal业务的开发模式，实现modal组件与页面主体、modal框与内部内容逻辑解耦，提高复用性。
 * 模板代码！！！
 * 复制后继续修改文件  大部分修改应该集中在modal-content组件中
 */
const ModalWapper: React.FC<IProps> = ({ contentProps = {}, ...otherModalProps }) => {
    const modalContentRef = useRef<any>(null);

    return (
        <Modal title="通知失败详情" footer={null} {...otherModalProps}>
            <ModalContent ref={modalContentRef} {...contentProps} />
        </Modal>
    );
};

export default ModalWapper;
