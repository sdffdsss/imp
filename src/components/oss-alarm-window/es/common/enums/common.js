var FILTER_EMUN = {
  ENABLE: {
    TRUE: 1,
    FALSE: 2
  },
  REVERSE: {
    TRUE: 1,
    FALSE: 2
  },
  ORDER: {
    ASC: 1,
    DESC: 2
  },
  ISPRIVATE: {
    TRUE: 1,
    FALSE: 2
  },
  COMPARETYPE: {
    EQ: 'eq',
    //等于
    LE: 'le',
    LT: 'lt',
    GE: 'ge',
    GT: 'gt',
    LIKE: 'like',
    IN: 'in',
    BETWEEN: 'between',
    ISNULL: 'is_null',
    NOTNULL: 'not_null'
  }
};
var numberOperator = [{
  id: 'le',
  key: 'le',
  name: function name() {
    return '<=';
  }
}, {
  id: 'ge',
  key: 'ge',
  name: function name() {
    return '>=';
  }
}, {
  id: 'eq',
  key: 'eq',
  name: function name() {
    return '=';
  }
}, {
  id: 'between',
  key: 'between',
  name: function name() {
    return '<>';
  }
}];
var strOperator = [{
  id: 'is_null',
  key: 'is_null',
  name: function name() {
    return '空';
  }
}, {
  id: 'not_null',
  key: 'not_null',
  name: function name() {
    return '非空';
  }
}, {
  id: 'like',
  key: 'like',
  name: function name() {
    return '模糊匹配';
  }
}, {
  id: 'in',
  key: 'in',
  name: function name() {
    return '包含';
  }
}];
var tableRowHeight = [{
  id: 'small',
  key: 18
}, {
  id: 'middle',
  key: 26
}, {
  id: 'default',
  key: 34
}];
export default {
  FILTER_EMUN: FILTER_EMUN,
  numberOperator: numberOperator,
  strOperator: strOperator,
  tableRowHeight: tableRowHeight
};