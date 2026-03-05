import request from '@Common/api';
import { useEnvironmentModel } from '@Src/hox';
export function download(file, fileName) {
    let url = file;
    if (typeof file !== 'string') {
        const URL = window.URL || window.webkitURL;
        url = URL.createObjectURL(file);
    }
    const a = document.createElement('a');
    a.href = url; // 文件流生成的url
    a.download = fileName; // 文件名
    a.click();
}
export function blobDownLoad(res, name, type = 'application/vnd.ms-excel;charset=utf-8') {
    // blob文件流下载
    const blob = new Blob([res], { type });

    // 兼容不同浏览器的URL对象
    const url = window.URL || window.webkitURL || window.moxURL;
    // 创建下载链接
    const downloadHref = url.createObjectURL(blob);
    // 创建a标签并为其添加属性
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadHref;
    downloadLink.download = name;
    // 触发点击事件执行下载
    downloadLink.click();
}
export function createFileFlow(fileUrl, requestUrl) {
    const url = `${useEnvironmentModel.data.environment.filter.direct}${fileUrl}`;
    const name = fileUrl.replace('/static/', '');
    request(null, {
        type: 'get',
        fullUrl: requestUrl || url,
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        data: {},
        responseType: 'blob',
    }).then((ress) => {
        blobDownLoad(ress, name);
    });
}
