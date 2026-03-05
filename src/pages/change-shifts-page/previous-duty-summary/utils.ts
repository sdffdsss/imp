import { _ } from 'oss-web-toolkits';

const columns = [
    {
        title: '模块',
        dataIndex: 'moduleName',
        align: 'center' as 'center',
        onCell: (record) => {
            return record.rowSpan < 0
                ? // 无需合并的行，返回{}
                  {}
                : {
                      // 需要合并的行，首行返回需要合并的行数，其他行返回0
                      rowSpan: record.rowSpan,
                  };
        },
    },
    {
        title: '类型 ',
        dataIndex: 'moduleTypeName',
        align: 'center' as 'center',
    },
    {
        title: '总数 ',
        dataIndex: 'totalCount',
        align: 'center' as 'center',
    },
    {
        title: '遗留 ',
        dataIndex: 'remainCount',
        align: 'center' as 'center',
    },
    {
        title: '处理 ',
        dataIndex: 'handleCount',
        align: 'center' as 'center',
    },
];

/**
 * 整理数据适配行合并
 * @param data  接口返回数据
 * @param colName  待合并的列名称
 * @returns  整理后数据
 */
const convertDataToRowSpan = (data, colName) => {
    // 首先分组
    const grouped = _.groupBy(data, (v) => v[`${colName}`]);
    // 其次合并，第一项占行，后续为0
    const result = Object.keys(grouped)
        .map((k) =>
            grouped[k].map((v, i, arr) => {
                const arrayLength = arr.length;
                return arrayLength > 1 ? { ...v, rowSpan: i === 0 ? arrayLength : 0 } : { ...v, rowSpan: -1 };
            }),
        )
        .flatMap((v) => v);

    return result;
};

export default {
    columns,
    convertDataToRowSpan,
};
