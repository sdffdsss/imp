import { fileDown } from '../api';
const downloadAccessory = async (obj) => {
    const res = await fileDown({
        annexId: obj.response || obj.id,
    });

    const contentDisposition = res.headers['content-disposition'];
    let fileName = decodeURIComponent(contentDisposition.split('=')[1]);
    // type 为需要导出的文件类型，此处为xls表格类型
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    // 兼容不同浏览器的URL对象
    const url = window.URL || window.webkitURL;
    // 创建下载链接
    const downloadHref = url.createObjectURL(blob);
    // 创建a标签并为其添加属性
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadHref;
    downloadLink.download = fileName;
    // 触发点击事件执行下载
    downloadLink.click();
};

export default downloadAccessory;
