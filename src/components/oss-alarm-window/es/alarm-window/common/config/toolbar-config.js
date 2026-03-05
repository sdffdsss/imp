import toolbarComponent from '../../../toolbar/toolbar-components';
import { _ } from 'oss-web-toolkits';
var config = [{
  key: 'ServiceConnectionInfo',
  title: '服务连接信息查看',
  icon: 'icona-xinxi2',
  disconnectIconLight: 'iconxinxihongdian',
  disconnectIconDarkBlue: 'icona-xinxi1',
  disconnectIcondark: 'iconxinxihongdian1',
  pageType: 'view',
  width: 800,
  component: toolbarComponent.ServiceConnectionInfo,
  formAction: function formAction(_ref) {
    var customAction = _ref.customAction,
      value = _ref.value;
    customAction(value);
  }
}, {
  key: 'ViewCurrentFilter',
  title: '过滤器条件',
  icon: 'iconguolv',
  pageType: 'view',
  width: 1000,
  component: toolbarComponent.FilterDetail
}, {
  key: 'AlarmSynchronization',
  title: '告警同步',
  icon: 'icontongbu1',
  pageType: 'form',
  component: toolbarComponent.AlarmSynchronization,
  width: 620,
  formAction: function formAction(_ref2) {
    var customAction = _ref2.customAction,
      value = _ref2.value;
    customAction(value);
  }
}, {
  key: 'AlarmSound',
  title: '告警发声',
  activeTitle: '告警静音',
  icon: 'iconfashengguanbi',
  activeIcon: 'iconfasheng',
  active: false,
  action: function action(_ref3) {
    var customAction = _ref3.customAction,
      toolbarItem = _ref3.toolbarItem;
    customAction(!toolbarItem.active);
  }
}, {
  key: 'AlarmLock',
  title: '锁定',
  activeTitle: '解锁',
  icon: 'iconjiesuo',
  activeIcon: 'iconsuoding',
  active: false,
  action: function action(_ref4) {
    var customAction = _ref4.customAction,
      toolbarItem = _ref4.toolbarItem;
    customAction(!toolbarItem.active);
  }
}, {
  key: 'AlarmTop',
  title: '置顶',
  activeTitle: '取消置顶',
  icon: 'iconzhiding',
  active: false,
  action: function action(_ref5) {
    var customAction = _ref5.customAction,
      selectRows = _ref5.selectRows;
    var topAlarmList = [];
    selectRows.forEach(function (item) {
      topAlarmList.push(item['alarm_id'].value);
    });
    customAction(topAlarmList);
  }
}, {
  key: 'AlarmExport',
  title: '告警导出',
  icon: 'icondaochu1',
  pageType: 'dropDown',
  dropdownMenus: [{
    value: 0,
    txt: 'csv'
  }, {
    value: 1,
    txt: 'excel'
  }, {
    value: 2,
    txt: 'html'
  }],
  formAction: function formAction(_ref6) {
    var customAction = _ref6.customAction,
      value = _ref6.value;
    customAction(value);
  }
}, {
  key: 'ColumnSettings',
  title: '列设置',
  icon: 'iconlieshezhi',
  pageType: 'form',
  width: 1100,
  component: toolbarComponent.ColumnSettings,
  formAction: function formAction(_ref7) {
    var customAction = _ref7.customAction,
      value = _ref7.value;
    customAction(value);
  }
}, {
  key: 'ShowAll',
  title: '取消筛选',
  icon: 'iconwhole-full',
  action: function action(_ref8) {
    var customAction = _ref8.customAction;
    customAction();
  }
}, {
  key: 'FoldingState',
  title: '展开',
  activeTitle: '折叠',
  active: false,
  icon: 'iconshouqi',
  action: function action(_ref9) {
    var customAction = _ref9.customAction,
      toolbarItem = _ref9.toolbarItem;
    customAction(!toolbarItem.active);
  }
}, {
  key: 'AssociatedAlarmFiltering',
  title: '关联告警过滤',
  active: false,
  icon: 'iconzidingyigaojingwailian',
  pageType: 'form',
  action: function action(_ref0) {
    var customAction = _ref0.customAction,
      toolbarItem = _ref0.toolbarItem;
    customAction(toolbarItem);
  }
}, {
  key: 'CustomFilter',
  title: '自定义过滤',
  active: false,
  icon: 'iconzidingyiguolv',
  pageType: 'form',
  component: toolbarComponent.CustomFilter,
  formAction: function formAction(_ref1) {
    var customAction = _ref1.customAction,
      value = _ref1.value;
    customAction(value);
  }
}, {
  key: 'CapacitySettings',
  title: '容量设置',
  icon: 'iconrongliangshezhi',
  component: toolbarComponent.CapacitySetting,
  pageType: 'form',
  width: 400,
  formAction: function formAction(_ref10) {
    var customAction = _ref10.customAction,
      value = _ref10.value;
    customAction(value.capacity);
  }
}, {
  key: 'tableSize',
  title: '密度',
  icon: 'iconliuliang',
  pageType: 'dropDown',
  dropdownMenus: [{
    value: 'small',
    txt: '紧凑'
  }, {
    value: 'middle',
    txt: '中等'
  }, {
    value: 'default',
    txt: '默认'
  }],
  dropdownProps: {
    placement: "bottomRight"
  },
  formAction: function formAction(_ref11) {
    var customAction = _ref11.customAction,
      value = _ref11.value;
    customAction(value);
  }
}];
export default config;