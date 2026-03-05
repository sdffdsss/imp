/* eslint-disable consistent-return */
import request from '@Src/common/api';
import moment from 'moment';

const autoSendOrder = (data) => {
    return request('alarmmodel/filter/v1/filter/export/autoSendOrder', {
        type: 'get',
        baseUrlType: 'alarmModelUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        data,
    });
};

const getLeftRuleData = (data) => {
    return new Promise((reslove) => {
        request('model-cache/v1/getCacheForWorkbench', {
            type: 'get',
            baseUrlType: 'cacheUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取规则数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};

const getWorksheetAutoSend = (data) => {
    return new Promise((reslove) => {
        request('statis/getWorksheetHourRecordNow', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            defaultErrorMessage: '获取当日自动派单量统计数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};
// 按专业派单统计
const getWorksheetRuleSend = (data) => {
    return new Promise((reslove) => {
        request('statis/getWorksheetRuleSend', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            defaultErrorMessage: '获取当日自动派单量统计数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};
// 按省份派单统计
const getWorksheetRuleProvince = (data) => {
    return new Promise((reslove) => {
        request('statis/getWorksheetRuleProvince', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            defaultErrorMessage: '获取当日自动派单量统计数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};

const getWorksheetDayStatics = (data) => {
    return new Promise((reslove) => {
        request('statis/getWorksheetDayStatics', {
            type: 'post',
            baseUrlType: 'monitor',
            showSuccessMessage: false,
            defaultErrorMessage: '获取当日自动派单量统计数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};
const getExportProgressApi = (data) => {
    return request('alarmmodel/filter/v1/filter/export/getProcess', {
        type: 'get',
        baseUrlType: 'alarmModelUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        data,
    });
};
const fileDownLoadApi = (data) => {
    return request('alarmmodel/filter/v1/filter/export/download', {
        type: 'get',
        baseUrlType: 'alarmModelUrl',
        showSuccessMessage: false,
        showErrorMessage: false,
        defaultErrorMessage: '导出失败，请检查服务',
        responseType: 'blob',
        data,
    }).then((res) => {
        let fileName = '';
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;

        switch (data?.moduleId) {
            case '604':
                fileName = '高铁';
                break;
            case '605':
                fileName = '督办单';
                break;
            default:
                fileName = '';
                break;
        }
        downloadLink.download = `${fileName}派单规则导出${moment().format('YYYYMMDDHHmmss')}.xls`;
        // 触发点击事件执行下载
        downloadLink.click();
    });
};
export {
    autoSendOrder,
    getLeftRuleData,
    getWorksheetAutoSend,
    getWorksheetRuleSend,
    getWorksheetRuleProvince,
    getWorksheetDayStatics,
    getExportProgressApi,
    fileDownLoadApi,
};
