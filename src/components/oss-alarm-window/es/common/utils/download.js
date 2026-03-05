import request from '@Common/api';
import { useEnvironmentModel } from '@Src/hox';
export function download(file, fileName) {
  var url = file;
  if (typeof file !== 'string') {
    var URL = window.URL || window.webkitURL;
    url = URL.createObjectURL(file);
  }
  var a = document.createElement('a');
  a.href = url; // 文件流生成的url
  a.download = fileName; // 文件名
  a.click();
}
export function blobDownLoad(res, name) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'application/vnd.ms-excel;charset=utf-8';
  // blob文件流下载
  var blob = new Blob([res], {
    type: type
  });
  // 兼容不同浏览器的URL对象
  var url = window.URL || window.webkitURL || window.moxURL;
  // 创建下载链接
  var downloadHref = url.createObjectURL(blob);
  // 创建a标签并为其添加属性
  var downloadLink = document.createElement('a');
  downloadLink.href = downloadHref;
  downloadLink.download = name;
  // 触发点击事件执行下载
  downloadLink.click();
}
export function createFileFlow(fileUrl, requestUrl) {
  var url = "".concat(useEnvironmentModel.data.environment.filter.direct).concat(fileUrl);
  var name = fileUrl.replace('/static/', '');
  request(null, {
    type: 'get',
    fullUrl: requestUrl || url,
    showSuccessMessage: false,
    defaultErrorMessage: '导出失败，请检查服务',
    data: {},
    responseType: 'blob'
  }).then(function (ress) {
    blobDownLoad(ress, name);
  });
}