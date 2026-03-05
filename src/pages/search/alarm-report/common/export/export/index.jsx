import xlsx from 'xlsx';
import { _ } from 'oss-web-toolkits';

/**
 * @description: 根据表格数据生成excel
 * @param {*} columns 表格的列
 * @param {*} dataSource 表格数据
 * @param {*} fileName excel名字
 * @param {*} filter 列显示过滤项
 * @param {*} merge 合并单元格配置
 * @param {*} headerMerge 合并表头数据
 * @param {*} cols 列宽度数据
 * @param {*} exportMode 导出模式，null|singleSheet|multipleSheet 默认singleSheet
 * @param {*} sheetNames 导出模式，multipleSheet 时 sheetNames
 * @return {*}
 */
const exportExcel = (columns, dataSource, fileName, filter = [], merge, headerMerge, cols, exportMode, sheetNames) => {
    const appendSheet = (columns, dataSource, fileName, filter = [], merge, headerMerge, cols, sheetName, wb) => {
        const headerData = [];
        const handleData = [];
        const showColumns = [];
        if (Array.isArray(filter) && filter.length > 0) {
            columns.forEach((item) => {
                if (_.includes(filter, item.dataIndex)) {
                    headerData.push(item.title);
                    showColumns.push(item.dataIndex);
                }
            });
        } else {
            columns.forEach((item) => {
                headerData.push(item.title);
                showColumns.push(item.dataIndex);
            });
        }
        dataSource.forEach((item) => {
            const tempArr = [];
            showColumns.forEach((key) => {
                tempArr.push(item[key]);
            });
            handleData.push(tempArr);
        });
        handleData.unshift(headerData);
        // const headerMerge = ['地市', '核心机楼', '', '', '', '', '', '传输机楼'];

        // const options = {
        //     '!cols': [{ wpx: 100 }, { wpx: 200 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }],
        // };
        // const merge = [
        //     // 纵向合并，范围是第1列的行1到行2
        //     { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        //     { s: { r: 0, c: 1 }, e: { r: 0, c: 6 } },
        //     { s: { r: 0, c: 7 }, e: { r: 0, c: 12 } },
        // ];

        // 初始化一个excel文件
        xlsx.utils.book_new();
        // 初始化一个excel文档，此时需要传入数据
        const ws_name = sheetName || fileName;
        if (headerMerge) {
            handleData.unshift(headerMerge);
        } else {
            // 默认把sheet名当成 报表标题， 改进点已有合并表头的 无法添加
            handleData.unshift([ws_name]);
            merge = [{ s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } }];
        }
        const ws = xlsx.utils.aoa_to_sheet(handleData);
        if (merge) {
            // 样式没起作用
            ws.A1.s = {
                // 为某个单元格设置单独样式
                font: {
                    name: '宋体',
                    sz: 24,
                    bold: true,
                    color: { rgb: 'FFFFAA00' },
                },
                alignment: { horizontal: 'center', vertical: 'center', wrap_text: true },
                fill: { bgcolor: { rgb: 'ffff00' } },
            };
            ws['!merges'] = merge;
        }

        cols && (ws['!cols'] = cols);
        // 将文档插入文件并定义名称
        const wbc = _.cloneDeep(wb);
        xlsx.utils.book_append_sheet(wbc, ws, ws_name);
        return wbc;
    };
    return new Promise((resolve, reject) => {
        try {
            let wb = xlsx.utils.book_new();
            if (exportMode && exportMode === 'multipleSheet') {
                sheetNames.forEach((value, index) => {
                    wb = appendSheet(
                        columns[index],
                        dataSource[index] || [],
                        fileName,
                        (filter = []),
                        merge[index] || null,
                        headerMerge[index] || null,
                        cols[index] || [],
                        sheetNames[index] || '',
                        wb
                    );
                });
            } else {
                wb = appendSheet(columns, dataSource, fileName, (filter = []), merge, headerMerge, cols, fileName, wb);
            }
            xlsx.writeFile(wb, `${fileName}.xlsx`);
            // 下载完毕
            resolve();
        } catch (error) {
            reject();
        }
    });
};

export default exportExcel;
