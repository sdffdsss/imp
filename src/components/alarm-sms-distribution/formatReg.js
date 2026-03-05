/* eslint-disable*/
export default {
    noEmpety: /^\S+$/, //不能有空格
    intNumberWithZero: /^-?\d+$/, //正整数负整数和0
    positiveInteger: /^[1-9]\d*$/, //匹配正整数
    negtiveInteger: /^-[1-9]\d*$/, //匹配负整数
    integer: /^-?[1-9]\d*$/, //匹配整数
    positiveIntegerWithZeroNew: /^0(0)|[^\d]+/g,
    positiveIntegerWithZero: /^[1-9]\d*|0$/, //匹配非负整数（正整数 + 0）
    negtiveIntegerWithZero: /^-[1-9]\d*|0$/, //匹配非正整数（负整数 + 0）
    positiveFloat: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, //匹配正浮点数
    negtiveFloat: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/, //匹配负浮点数
    float: /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, //匹配浮点数
    positiveFloatWithZero: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/, //匹配非负浮点数（正浮点数 + 0）
    negtiveFloatWithZero: /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/, //匹配非正浮点数（负浮点数 + 0）
    wordCheck: /^[A-Za-z]+$/, //匹配由26个英文字母组成的字符串
    capWordCheck: /^[A-Z]+$/, //匹配由26个英文字母的大写组成的字符串
    sWordCheck: /^[a-z]+$/, //匹配由26个英文字母的小写组成的字符串
    numberAndWord: /^[A-Za-z0-9]+$/, //匹配由数字和26个英文字母组成的字符串
    numberWithWord: /^\w+$/, //匹配由数字、26个英文字母或者下划线组成的字符串
    affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
    alphaNumeric: /^[A-Za-z0-9]+$/,
    caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
    creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
    dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
    eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
    hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
    hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
    ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
    nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
    timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
    ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
    url: /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
    usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/,
    http: /http(s)?:\/\//,
    nameIuput: /^(?!_)(?!.*?_$)(?!\-)(?!.*?\-$)[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/, //只含有汉字、数字、字母、下划线、中划线，不能以下划线、中划线开头和结尾
    matchFiled: /\<(.+?)\>/g,
    zhStr: /[^\x00-\xff]/g, //是否把包含中文字符
};
