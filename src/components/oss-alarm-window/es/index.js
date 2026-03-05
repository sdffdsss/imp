import AlarmWindow from './alarm-window';
import Demo from './demo';
import AlarmWindowWithProcessor from './alarm-window-processors';
import { Icon } from 'oss-ui';
Icon.createFromIconfontCN({
  scriptUrl: require('./public/iconfont/iconfont.js'),
  prefixCls: '' // 或者 直接调用 Icon.prefixCls = 'xxx';
});
export { AlarmWindow, AlarmWindowWithProcessor, Demo };