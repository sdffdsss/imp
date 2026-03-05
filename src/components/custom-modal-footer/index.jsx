import React from 'react';
import { Button, Row, Space } from 'oss-ui';
import PropTypes from 'prop-types';
import { _ } from 'oss-web-toolkits';
import AuthButton from '@Components/auth-button';
import './index.less';

const Index = (props) => {
    const { onOk, onCancel, cancelText, okText, confirmLoading, okType, cancelButtonProps, okButtonProps, render, authKey, extra } = props;
    return (
        <Row justify="center">
            {_.isFunction(render) ? (
                render()
            ) : (
                <Space size={20}>
                    {okText && authKey ? (
                        <AuthButton {...okButtonProps} authKey={authKey} addLog loading={confirmLoading} type={okType} onClick={onOk}>
                            {okText}
                        </AuthButton>
                    ) : (
                        <Button {...okButtonProps} confirmLoading={confirmLoading} type={okType} onClick={onOk}>
                            {okText}
                        </Button>
                    )}

                    <Button {...cancelButtonProps} onClick={onCancel}>
                        {cancelText}
                    </Button>
                </Space>
            )}
        </Row>
    );
};

Index.defaultProps = {
    // 所有选择项
    cancelButtonProps: {},
    // 取消按钮文字
    cancelText: '取消',
    // ok 按钮 props
    okButtonProps: {},
    // 确认按钮文字
    okText: '确定',
    // 确定按钮 loading
    confirmLoading: false,
    // 确认按钮类型
    okType: 'primary',
    // 点击遮罩层或右上角叉或取消按钮的回调 (Modal的onCancel事件也需要给，用于右上角x关闭modal)
    onCancel: () => {},
    // 点击确定回调
    onOk: () => {},
};

Index.propTypes = {
    // 所有选择项
    cancelButtonProps: PropTypes.object,
    // 取消按钮文字
    cancelText: PropTypes.node,
    // ok 按钮 props
    okButtonProps: PropTypes.object,
    // 确认按钮文字
    okText: PropTypes.node,
    // 确定按钮 loading
    confirmLoading: PropTypes.bool,
    // 确认按钮类型
    okType: PropTypes.string,
    // 点击遮罩层或右上角叉或取消按钮的回调 (Modal的onCancel事件也需要给，用于右上角x关闭modal)
    onCancel: PropTypes.func,
    // 点击确定回调
    onOk: PropTypes.func,
    // 自定义渲染内容
    render: PropTypes.func,
};

export default Index;
