// @ts-nocheck
import React from 'react';
import Atm from './atm';
import BusinessPlatform from './businessPlatform';
import CoreNetwork from './coreNetwork';
import Internet from './internet';
import { IProps } from './types';

/**
 * 出发点：目前项目中使用到的Modal组件的代码中，modal组件与主页面的交互逻辑不统一，但是不同页面又需要引用同一个modal，现有modal无法复用。
 * 所以这里只是为了固化一种Modal业务的开发模式，实现modal组件与页面主体逻辑解耦，提高复用性。
 * 模板代码！！！
 * 复制后继续修改文件  大部分修改应该集中在modal-content组件中
 */
const ModalWapper: React.FC<IProps> = ({ contentProps, onVisibleChange, ...otherProps }) => {
    const { professionType, initialValues, groupSourceEnum, notCoreGroupSourceEnum, ...otherContentProps } = contentProps;

    function getModalContent(key, props) {
        console.log(key, '==key');
        let content;
        switch (key) {
            case '9998':
                content = <Atm {...props} />;
                break;
            case '85':
                content = <BusinessPlatform {...props} />;
                break;
            case '1':
                content = <CoreNetwork {...props} groupSourceEnum={groupSourceEnum} />;
                break;
            case '9999':
            default:
                content = <Internet {...props} groupSourceEnum={notCoreGroupSourceEnum} />;
        }

        return content;
    }

    function setVisible(visible) {
        onVisibleChange(visible);
    }

    return getModalContent(professionType, { ...otherProps, ...otherContentProps, setVisible, openId: initialValues?.id });
};

export default ModalWapper;
