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
