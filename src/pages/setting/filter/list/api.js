/* eslint-disable consistent-return */
import request from '@Src/common/api';
import moment from 'moment';

const autoSendOrder = (data) => {
    return new Promise((resolve, reject) => {
        request('alarmmodel/filter/v1/filter/export/autoSendOrder', {
            type: 'get',
            baseUrlType: 'alarmModelUrl',
            showSuccessMessage: false,
            showErrorMessage: false,
            defaultErrorMessage: '导出失败，请检查服务',
            responseType: 'blob',
            data,
        })
            .then((res) => {
                // type 为需要导出的文件类型，此处为xls表格类型
                const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                // 兼容不同浏览器的URL对象
                const url = window.URL || window.webkitURL || window.moxURL;
                // 创建下载链接
                const downloadHref = url.createObjectURL(blob);
                // 创建a标签并为其添加属性
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadHref;
                downloadLink.download = `${data?.moduleId == 604 ? '高铁' : ''}派单规则导出${moment().format('YYYYMMDDHHmmss')}.xls`;
                // 触发点击事件执行下载
                downloadLink.click();
                resolve(true);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

export { autoSendOrder };
