import request from '@Common/api';

import { alarmListConverter, fieldListConverter, fieldListSaveConverter, alarmFieldValueDict } from './converter';

// 获取
export const getAlarmDataSourceApi = (data) => {
    return request('seabedOpticalCable/queryActiveAlarm', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === '200') {
            return alarmListConverter(response.dataObject, { needMarkSelected: true });
        }
        return Promise.reject(response);
    });
};

// 获取右侧历史数据
export const getHistoryAlarm = (data) => {
    return request('seabedOpticalCable/queryHistoryAlarm', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === '200') {
            return alarmListConverter(response.dataObject);
        }
        return Promise.reject(response);
    });
};

// 获取
export const getEditAlarmDataSourceApi = (data) => {
    return request('seabedOpticalCable/queryEditAlarm', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === '200') {
            return alarmListConverter(response.dataObject, { needMarkSelected: true });
        }
        return Promise.reject(response);
    });
};

// 获取字段信息
export const getFieldsListApi = (data) => {
    return request('seabedOpticalCable/columnInit', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === '200' && response.dataObject) {
            return fieldListConverter(response.dataObject);
        }
        return Promise.reject(response);
    });
};

// 更新缓存列
export const updateUserConfigColumnApi = (data) => {
    return request('seabedOpticalCable/columnConfigSave', {
        type: 'post',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: fieldListSaveConverter(data),
    });
};

// 查询所有的故障数据
export const getQueryExplain = (params) => {
    return request('seabedOpticalCable/queryExplain', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        params,
    }).then((response) => {
        if (response.code === '200') {
            return response.dataObject;
        }
        return Promise.reject(response);
    });
};

// 新增数据
export const addQueryAllExplain = (data) => {
    return request('seabedOpticalCable/insert', {
        type: 'post',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
// 删除
export const deleteQueryExplain = (id) => {
    return request('seabedOpticalCable/delete', {
        type: 'delete',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: { id },
    });
};

// 删除历史故障
export const deleteHistoryQueryExplain = (id) => {
    return request('seabedOpticalCable/realDelete', {
        type: 'delete',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: { id },
    });
};

// 修改的api
export const updateQueryExplain = (data) => {
    return request('seabedOpticalCable/update', {
        type: 'post',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 右侧删除告警
export const deleteAlarmItemApi = (data) => {
    return request('alarmmodel/operate/v1/operate/rightclick', {
        type: 'post',
        baseUrlType: 'filterUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 导出
export const exportAlarmApi = (data) => {
    return request('seabedOpticalCable/exportAlarm', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.fileUrl) {
            return response.fileUrl;
        }
        return Promise.reject(response);
    });
};

// 查询字段字典值
export const queryAlarmFieldDictApi = (data) => {
    return request('seabedOpticalCable/queryDict', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (Array.isArray(response.dataObject)) {
            return alarmFieldValueDict(response.dataObject);
        }
        return Promise.reject(response);
    });
};

// 保存筛选条件
export const saveFilterConditionApi = (data) => {
    return request('seabedOpticalCable/conditionSave', {
        type: 'post',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 告警发声
export const queryVoiceAlarmApi = (data) => {
    return request('seabedOpticalCable/queryVoiceAlarm', {
        type: 'get',
        baseUrlType: 'filter',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    }).then((response) => {
        if (response.code === '200') {
            return response.total;
        }
        return Promise.reject(response);
    });
};
