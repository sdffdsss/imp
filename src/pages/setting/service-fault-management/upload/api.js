import request from '@Common/api';
import moment from "moment";

/**
 * 大客户模板
 * @param {*} data
 * @returns
 */
const downloadBigCustomTemplate = () => {
    return request(`/shiftofdutyBusinessFaultManagement/downBigCustom`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
    });
};

/**
 * 核心网模板
 * @param {*} data
 * @returns
 */
const downloadCoreNetworkTemplate = () => {
    return request(`/shiftofdutyBusinessFaultManagement/downBusinessPlatform`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
    });
};

/**
 * 失败原因下载
 * @param {*} data
 * @returns
 */
const fileDownload = (data) => {
    return request(`/file/export?source=${data.source}`,
        {
            type: 'get',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            responseType: 'blob',
        }).then((res) => {
        console.log(res);
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // 兼容不同浏览器的URL对象
        // @ts-ignore
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        // downloadLink.download = `故障导出${moment().format('YYYYMMDDHHmmss')}.xls`;
        // 触发点击事件执行下载
        downloadLink.click();
    });
};

/**
 * 大客户导入
 * @param {*} data
 * @returns
 */
const importBigCustom = (data) => {
    return request(
        `/shiftofdutyBusinessFaultManagement/importBigCustom?createdBy=${data.createdBy}&provinceId=${data.provinceId}&majorId=${data.majorId}`,
        {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data: data.file,
        },
    );
};

/**
 * 核心网导入
 * @param {*} data
 * @returns
 */
const importCoreNetwork = (data) => {
    return request(
        `/shiftofdutyBusinessFaultManagement/importCoreNetwork?createdBy=${data.createdBy}&provinceId=${data.provinceId}&majorId=${data.majorId}`,
        {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data: data.file,
        },
    );
};

export default { fileDownload,downloadBigCustomTemplate, downloadCoreNetworkTemplate, importBigCustom, importCoreNetwork };
