import exportExcel from './export';

const index = (dataSource, orgcolumns, headerTitle) => {
    const _columns = orgcolumns.filter(({ hideInSearch }) => {
        return hideInSearch;
    });
    const _columnsP = _columns.map(({ title, dataIndex }) => {
        return {
            title,
            key: dataIndex,
            dataIndex,
        };
    });
    const colsP = _columns.map(({ Width }) => {
        return { wpx: Width };
    });
    // const { columns, merge, headerMerge, cols } = exportConfig;
    // return exportExcel(_columns, dataSource, '导出标题', [], merge, headerMerge, cols);
    return exportExcel(_columnsP, dataSource, headerTitle, [], null, null, colsP);
};
// const exportConfig = {
//     headerMerge: ['地市', '核心机楼', '', '', '', '', '', '传输机楼'],
//     cols: [
//         { wpx: 60 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//         { wpx: 100 },
//     ],
//     merge: [
//         { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
//         { s: { r: 0, c: 1 }, e: { r: 0, c: 6 } },
//         { s: { r: 0, c: 7 }, e: { r: 0, c: 12 } },
//     ],
//     columns: [
//         {
//             title: '地市',
//             key: 'regionName',
//             dataIndex: 'regionName',
//         },
//         {
//             title: '停电信息次数',
//             key: 'hxDdTimes',
//             dataIndex: 'hxDdTimes',
//         },
//     ],
// };
export default index;
