import convertXml from 'xml-js';
import { _ } from 'oss-web-toolkits';
import request from '@Common/api';

// 获取所有告警列数据
export function getAllAlarmColumns() {
    return Promise.resolve(
        request('v1/alarm/column', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: {},
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res.data) {
                return res.data.map((item, index) => {
                    _.forOwn(item, (value, key) => {
                        item[key.toUpperCase()] = value;
                    });
                    return {
                        id: index + 1,
                        name: item.colNameZh,
                        field: item.dbField,
                        width: 120,
                        // alias: item.COL_NAME_ZH,
                    };
                });
            } 
                return [];
            
        })
    );
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
        const columnsValueArr = columnsValue.split('|');
        const columnsWidthsArr = columnsWidths.split('|');
        const showInTableColumns = columnsValueArr.map((item, index) => {
            const field = item.split('#')[0];
            const id = _.find(leftData, (l) => l.field === item.split('#')[0])?.id;
            const name = _.find(leftData, (l) => l.field === item.split('#')[0])?.name;
            const alias = item.split('#')[1] || _.find(leftData, (l) => l.field === field)?.name;

            const width = columnsWidthsArr[index] || 120;
            return {
                // ellipsis: false
                // hideInSearch: true
                // dataIndex: "rlocate_ne_name"
                // key: "rlocate_ne_name"
                // title: "告警远端对象名称"
                // valueType: 233
                // width: 280
                hideInSearch: true,
                ellipsis: false,
                dataIndex: field,
                key: field,
                // field: item.split('#')[0],
                id,
                title: name,
                alias,
                // alias: item.split('#')[1] || _.find(leftData, (l) => l.field === item.split('#')[0])?.name,
                width: Number(width),
            };
        });
        const width = showInTableColumns.reduce(function (total, item, index) {
            return total + (Number(item.width) || 120);
        }, 0);
        const columnsStateMap = {};
        showInTableColumns.forEach((element) => {
            columnsStateMap[element.dataIndex] = { show: true };
        });
        return {
            showInTableColumns,
            columnsStateMap,
            width,
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
        const _columnsInfo = (active ? active.data : '').split('|');
        const showInTableColumns = _columnsInfo
            .map((item, index) => {
                const field = item.split('#')[0];
                const name = _.find(leftData, (l) => l.field === field)?.name;
                const alias = item.split('#')[1] || _.find(leftData, (l) => l.field === field)?.name;
                const id = _.find(leftData, (l) => l.field === item.split('#')[0])?.id;
                const width = active.widths.split('|')[index] || 120;
                return {
                    // ellipsis: false
                    // hideInSearch: true
                    // dataIndex: "rlocate_ne_name"
                    // key: "rlocate_ne_name"
                    // title: "告警远端对象名称"
                    // valueType: 233
                    // width: 280
                    ellipsis: false,
                    hideInSearch: true,
                    dataIndex: field,
                    key: field,
                    // field,
                    title: name,
                    alias,
                    width: Number(width),
                };
            })
            .filter((s) => !!s);
        const width = showInTableColumns.reduce(function (total, item, index) {
            return total + (Number(item.width) || 120);
        }, 0);
        const columnsStateMap = {};
        showInTableColumns.forEach((element) => {
            columnsStateMap[element.dataIndex] = { show: true };
        });
        return {
            showInTableColumns,
            columnsStateMap,
            width,
            // confirmAlarmColumn: setColumns(confirm),
            // clearAlarmColumn: setColumns(clear),
        };
    
}
