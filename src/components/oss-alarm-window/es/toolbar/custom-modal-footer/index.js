function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Button, Row, Space } from 'oss-ui';
import PropTypes from 'prop-types';
import { _ } from 'oss-web-toolkits';
import "./index.css";
Index.defaultProps = {
  //所有选择项
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
  onCancel: function onCancel() {},
  // 点击确定回调
  onOk: function onOk() {}
};
Index.propTypes = {
  //所有选择项
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
  render: PropTypes.func
};
export default function Index(props) {
  var onOk = props.onOk,
    onCancel = props.onCancel,
    cancelText = props.cancelText,
    okText = props.okText,
    confirmLoading = props.confirmLoading,
    okType = props.okType,
    cancelButtonProps = props.cancelButtonProps,
    okButtonProps = props.okButtonProps,
    render = props.render;
  return /*#__PURE__*/React.createElement(Row, {
    justify: "center"
  }, /*#__PURE__*/React.createElement(Space, {
    size: 20
  }, _.isFunction(render) ? render() : /*#__PURE__*/React.createElement(React.Fragment, null, okText && /*#__PURE__*/React.createElement(Button, _extends({}, okButtonProps, {
    confirmLoading: confirmLoading,
    type: okType,
    onClick: onOk
  }), okText), /*#__PURE__*/React.createElement(Button, _extends({}, cancelButtonProps, {
    onClick: onCancel
  }), cancelText))));
}