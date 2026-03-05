const getDetailColumns = (props) => {
    const { specialtyTypeList } = props;

    const defaultColumns = {
        /**
         * 核心网专业---1
         */
        1: {
            网络故障工单: '网络故障工单',
            '网络故障工单（自查）': '网络故障工单（自查）',
            日常申告及投诉时间: '日常申告及投诉时间',
            割接调度单: '割接调度单',
            '网络割接（自查）': '网络割接（自查）',
            重保调度单: '重保调度单',
            '重保（自查）': '重保（自查）',
            工作记录新增: '工作记录新增',
            遗留问题: '遗留问题',
            无线基站大面积断站: '无线基站大面积断站',
        },

        /**
         * 传输网专业 ---3
         */
        3: {
            '网络割接(自查)': '网络割接(自查)',
            网络故障工单: '网络故障工单',
            协查单: '协查单',
            业务故障单: '业务故障单',
            重保调度单: '重保调度单',
            '重保（自查）': '重保（自查）',
            工作记录新增: '工作记录新增',
            遗留问题: '遗留问题',
        },

        /**
         * 互联网专业 ---9999
         */
        9999: {
            网络故障工单: '网络故障工单',
            '网络故障（自查）': '网络故障（自查）',
            协查单: '协查单',
            业务故障单: '业务故障单',
            割接调度单: '割接调度单',
            '网络割接（自查）': '网络割接（自查）',
            重保调度单: '重保调度单',
            '重保（自查）': '重保（自查）',
            工作记录新增: '工作记录新增',
            遗留问题: '遗留问题',
            安全事件记录: '安全事件记录',
        },

        /**
         * 业务平台专业 ----9996
         */
        9996: {
            业务故障单: '业务故障单',
            '网络割接（自查）': '网络割接（自查）',
            告警与优化: '告警与优化',
        },

        /**
         * 大客户专业 ---9997
         */
        9997: {
            协查单: '协查单',
            业务故障单: '业务故障单',
            微信群及保障事件: '微信群及保障事件',
            工作记录新增: '工作记录新增',
            遗留问题: '遗留问题',
        },

        /**
         * atm专业 --- 9998
         */
        9998: {
            网络故障工单: '网络故障工单',
            '网络故障（自查）': '网络故障（自查）',
            协查单: '协查单',
            业务故障单: '业务故障单',
            割接调度单: '割接调度单',
            '网络割接（自查）': '网络割接（自查）',
            重保调度单: '重保调度单',
            '重保（自查）': '重保（自查）',
            工作记录新增: '工作记录新增',
            遗留问题: '遗留问题',
        },

        /**
         *   其他专业
         */
        otherColumns: {
            网络故障工单: '网络故障工单',
            工作记录新增: '工作记录新增',
            重要通知新增: '重要通知新增',
        },
    };

    const columnMap = new Map();
    const getSpecialtyColumns = (specialty) => {
        switch (specialty) {
            case 1:
            case 9998:
            case 9999:
            case 9997:
            case 5:
                return defaultColumns[specialty];
            default:
                return defaultColumns.otherColumns;
        }
    };

    specialtyTypeList.forEach((type) => {
        const columns = getSpecialtyColumns(type);
        Object.keys(columns).forEach((key) => {
            if (!columnMap.has(key)) {
                columnMap.set(key, {
                    title: columns[key],
                    dataIndex: key,
                    ellipsis: true,
                    search: false,
                    align: 'center',
                });
            }
        });
    });

    const columnList = columnMap.values();

    return columnList.unshift({
        title: '',
        dataIndex: 'count',
        ellipsis: true,
        search: false,
        align: 'center',
    });
};
export const dutyManStaticicColumns = [
    {
        title: '值班人员',
        dataIndex: 'dutyUserName',
        ellipsis: true,
        search: false,
        align: 'center',
    },
    {
        title: '所属组织',
        dataIndex: 'groupName',
        ellipsis: true,
        search: false,
        align: 'center',
    },
    {
        title: '值班次数',
        dataIndex: 'dutyTimes',
        ellipsis: true,
        search: false,
        align: 'center',
    },
    {
        title: '手动接班次数',
        dataIndex: 'manualTransferTimes',
        ellipsis: true,
        search: false,
        align: 'center',
    },
    {
        title: '自动接班次数',
        dataIndex: 'autoTransferTimes',
        ellipsis: true,
        search: false,
        align: 'center',
    },
    {
        title: '工作记录条数',
        dataIndex: 'workRecordCount',
        ellipsis: true,
        search: false,
        align: 'center',
    },
    {
        title: '重要通知条数',
        dataIndex: 'importantNoticeCount',
        ellipsis: true,
        search: false,
        align: 'center',
    },
];

export default getDetailColumns;
