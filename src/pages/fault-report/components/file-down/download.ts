import { downloadByEmosAnnex } from '@Src/pages/fault-report/api';

const downloadAccessory = async (obj) => {
    const dataCodes = {
        filePath: obj.folderName,
    };
    const res = await downloadByEmosAnnex(dataCodes);
    // type 为需要导出的文件类型，此处为xls表格类型
    const blob = new Blob([res]);
    // 兼容不同浏览器的URL对象
    const url = window.URL || window.webkitURL;
    // 创建下载链接
    const downloadHref = url.createObjectURL(blob);
    // 创建a标签并为其添加属性
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadHref;
    downloadLink.download = obj.originalFileName;
    // 触发点击事件执行下载
    downloadLink.click();
};

export default downloadAccessory;
