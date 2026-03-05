import chartEnums from './chart-enums';
// 引用这段代码用来注册自定义图形
import './bizchart-custom-shape';

// 导出工具方法
export { default as utils } from './chart-utils';

// 在项目中存在的组件 CompXXXChart
// 这些组件可以代发请求
export * from './comp-chart-beta';

// 基于plot 或者 bizchart api 开发费组件 OssXXXChart
// 纯组件
export * from './react-chart';

export { chartEnums };
