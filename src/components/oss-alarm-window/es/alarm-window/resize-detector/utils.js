import { debounce, throttle } from 'lodash';
export var patchResizeHandler = function patchResizeHandler(resizeCallback, refreshMode, refreshRate, refreshOptions) {
  switch (refreshMode) {
    case 'debounce':
      return debounce(resizeCallback, refreshRate, refreshOptions);
    case 'throttle':
      return throttle(resizeCallback, refreshRate, refreshOptions);
    default:
      return resizeCallback;
  }
};
export var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};
export var isSSR = function isSSR() {
  return typeof window === 'undefined';
};
export var isDOMElement = function isDOMElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
};
export var createNotifier = function createNotifier(onResize, setSize, handleWidth, handleHeight) {
  return function (_ref) {
    var width = _ref.width,
      height = _ref.height;
    setSize(function (prev) {
      if (prev.width === width && prev.height === height) {
        // skip if dimensions haven't changed
        return prev;
      }
      if (prev.width === width && !handleHeight || prev.height === height && !handleWidth) {
        // process `handleHeight/handleWidth` props
        return prev;
      }
      if (onResize && isFunction(onResize)) {
        onResize(width, height);
      }
      return {
        width: width,
        height: height
      };
    });
  };
};