import convertXml from 'xml-js';
import { _ } from 'oss-web-toolkits';
import request from '@Src/common/api';

export const getSubAlarm = (record) => {
    const data = {
        alarmId: record?.standard_alarm_id,
        startTime: record?.event_time,
    };
    // const data = { alarmId: '1592793354_3173106655_3347580412_2097460319', startTime: '2022-04-21 23:54:13' };

    return request('sysadminAlarm/subAlarmPage', {
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
        data,
        baseUrlType: 'filter',
    })
        .then((res) => {
            if (res.data) {
                return res.data;
            }
            return [];
        })
        .catch(() => {
            return [];
        });
};
// 获取所有告警列数据
export function getAllAlarmColumns() {
    return request('v1/alarm/columns', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: {},
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    }).then((res) => {
        if (res.data) {
            return res.data.map((item) => {
                return {
                    ...item,
                    ...{
                        id: item.fieldId,
                        name: item.displayName,
                        field: item.storeFieldName,
                        width: 120,
                        alias: item.displayName,
                    },
                };
            });
        }
        return [];
    });
}
// 获取所有告警列数据
export function getActiveColumns(viewId) {
    return request(`v1/monitor-view/${viewId}`, {
        type: 'get',
        showSuccessMessage: false,
        showErrorMessage: false,
        baseUrlType: 'monitorSetUrl',
    }).then((res) => {
        if (res.data) {
            return res.data.columnsValue;
        }
        return '';
    });
}
// 获取当前用户默认列数据
export function getUserDefaultColumns(userName) {
    const queryParam = {
        optionKey: `${userName}.AlarmBandColumntemplate`,
    };
    return request('v1/template/search-alarm-column', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: queryParam,
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    })
        .then((res) => {
            if (res.data && _.get(res, 'data.optionValue')) {
                return _.get(res, 'data.optionValue');
            }
            return null;
        })
        .catch(() => {
            return null;
        });
}

// 获取当前用户默认告警查询列数据
export function getUserQueryDefaultColumns(userName) {
    const queryParam = {
        optionKey: `${userName}.QueryAlarmBandOption`,
    };
    return request('v1/template/search-alarm-column', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: queryParam,
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    })
        .then((res) => {
            if (res.data && _.get(res, 'data.optionValue')) {
                return _.get(res, 'data.optionValue');
            }
            return null;
        })
        .catch(() => {
            return null;
        });
}

// 获取0号列模板数据
export function getTemplateColumnsById(id, userId) {
    const queryParam = {
        current: 1,
        pageSize: 100000,
        showType: '',
        userName: '',
        templateName: '',
        orderType: '',
        orderFieldName: '',
        templateId: id || 0,
        userId,
    };
    return request('v1/template/alarm-column', {
        type: 'get',
        baseUrlType: 'monitorSetUrl',
        data: queryParam,
        // 是否需要显示失败消息提醒
        showErrorMessage: true,
    })
        .then((res) => {
            if (_.get(res, 'data', []).length) {
                return _.get(res, 'data[0].columnsValue');
            }
            return null;
        })
        .catch(() => {
            return null;
        });
}

export function setColumnsInfo(xml, leftData, type) {
    const options = { ignoreComment: true, nativeTypeAttributes: true };
    const xmlData = convertXml.xml2js(xml, options);
    if (type === 'query') {
        const columnsValue = _.get(xmlData, `elements[0].attributes.Columns`, '').toString();
        const columnsWidths = _.get(xmlData, `elements[0].attributes.ColumnWidths`, '').toString();
        if (columnsValue === 0) {
            return {
                queryAlarmColumnDefault: [],
            };
        }
        return {
            queryAlarmColumnDefault: columnsValue.split('|').map((item, index) => ({
                id: _.find(leftData, (l) => l.field === item.split('#')[0])?.id,
                field: item.split('#')[0],
                name: _.find(leftData, (l) => l.field === item.split('#')[0])?.name,
                alias: item.split('#')[1] || _.find(leftData, (l) => l.field === item.split('#')[0])?.name,
                width: columnsWidths.split('|')[index] || 120,
            })),
        };
    }
    const columnsValue = _.get(xmlData, `elements[0].elements`, []).map((s) => ({
        name: s.name,
        data: _.get(s, `elements[0].attributes.Columns`, '').toString(),
        widths: _.get(s, `elements[0].attributes.ColumnWidths`, '').toString(),
    }));
    const active = _.find(columnsValue, (s) => s.name === 'ActiveBandSetting');
    // const confirm = _.find(columnsValue, (s) => s.name === 'ConfirmBandSetting');
    // const clear = _.find(columnsValue, (s) => s.name === 'ClearBandSetting');
    // const cleardAck = _.find(columnsValue, (s) => s.name === 'CleardAckBandSetting');

    const setColumns = (columnsInfo) => {
        return (columnsInfo ? columnsInfo.data : '')
            .split('|')
            .filter((s) => _.find(leftData, (l) => l.field === s.split('#')[0]))
            .map((item, index) => {
                const field = item.split('#')[0];
                const name = _.find(leftData, (l) => l.field === field)?.name;
                const alias = item.split('#')[1] || _.find(leftData, (l) => l.field === field)?.name;
                return {
                    id: _.find(leftData, (l) => l.field === item.split('#')[0])?.id,
                    field,
                    name,
                    alias,
                    width: columnsInfo.widths.split('|')[index] || 120,
                };
            });
    };
    return {
        activeAlarmColumn: setColumns(active),
        // confirmAlarmColumn: setColumns(confirm),
        // clearAlarmColumn: setColumns(clear),
        // cleardAckAlarmColumn: setColumns(cleardAck),
    };
}

export function setColumnsIndex(columns, leftData) {
    return columns.map((item) => ({
        ...item,
        id: _.find(leftData, (l) => l.field === item.field.split('#')[0])?.id,
    }));
}
export const getAlarmRecord = (selectRowKey) => {
    return request('alarm/detail/v1/alarms', {
        type: 'post',
        baseUrlType: 'filter',
        data: selectRowKey,
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};

export const getTableData = (params) => {
    return request('sysadminAlarm/record-new-page', {
        type: 'post',
        baseUrlType: 'filter',
        data: params,
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};

export const getSpecialtyOptionsApi = (params) => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        data: params,
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};
