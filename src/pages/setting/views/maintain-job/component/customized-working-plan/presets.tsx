import { _ } from 'oss-web-toolkits';

/**
 * 服务端已经返回值
 */
enum HorizonAlignment {
    left = '左对齐',
    center = '居中对齐',
    right = '右对齐',
}

enum VerticalAlignment {
    top = '顶部对齐',
    middle = '居中对齐',
    bottom = '底部对齐',
}

enum ValueShowType {
    RawValue = '1', // 1表示原样显示
    Tags = '2', // 2表示人员显示，按show_config字段配置显示；
    Select = '3', // 3表示下拉框，按show_config字段配置显示；
    CurrentTime = '4', // 4表示如果为空则显示当前时间
    ALlWorkShiftUsers = '7', // 7表示所有值班人员展示，编辑态也不可编辑
}

const isValueEqual = (value1: any, value2: any) => {
    return _.isEqual(value1, value2) || _.isEqual(_.toString(value1), _.toString(value2));
};

const cellAlignment = (style: any) => {
    const result = {};

    if (isValueEqual(style.horizonAlign, HorizonAlignment.left)) {
        Object.assign(result, { justifyContent: 'flex-start' });
    } else if (isValueEqual(style.horizonAlign, HorizonAlignment.center)) {
        Object.assign(result, { justifyContent: 'center' });
    } else {
        Object.assign(result, { justifyContent: 'flex-end' });
    }

    if (isValueEqual(style.verticalAlign, VerticalAlignment.top)) {
        Object.assign(result, { alignItems: 'flex-start' });
    } else if (isValueEqual(style.verticalAlign, VerticalAlignment.middle)) {
        Object.assign(result, { alignItems: 'center' });
    } else {
        Object.assign(result, { alignItems: 'flex-end' });
    }
    return result;
};

// 可编辑列配置
const editableColumnsMapping = {
    // 网管告警监控
    '1': [
        //
        { dataIndex: '4', title: '时间', cellComponentType: 'timeSelect' },
        { dataIndex: '5', title: '执行人', cellComponentType: 'executorModal' },
        { dataIndex: '6', title: '结果', cellComponentType: 'selectResult' },
        { dataIndex: '7', title: '备注', cellComponentType: 'textarea' },
    ],
    // 日分析表
    '2': [
        //
        { dataIndex: '11', title: '日分析结果', cellComponentType: 'selectResult' },
        { dataIndex: '12', title: '存在问题及是否需要整改', cellComponentType: 'selectResult' },
        { dataIndex: '13', title: '执行人', cellComponentType: 'executorModal' },
        { dataIndex: '14', title: '备注', cellComponentType: 'textarea' },
    ],
    // NOC环境保持
    '3': [
        //
        { dataIndex: '21', title: '执行人', cellComponentType: 'executorModal' },
    ],
    // 值班人员交接班管理
    '4': [
        //
        { dataIndex: '28', title: '执行人', cellComponentType: 'executorModal' },
    ],

    // 故障工单管理
    '5': [
        //
        { dataIndex: '32', title: '派单总数', cellComponentType: 'inputText' },
        { dataIndex: '33', title: '异常工单数', cellComponentType: 'inputText' },
        { dataIndex: '34', title: '异常工单处理情况', cellComponentType: 'textarea' },
        { dataIndex: '35', title: '执行人', cellComponentType: 'executorModal' },
    ],
    // 割接及工程预约管理
    '6': [
        //
        { dataIndex: '41', title: '审核记录割接工单总数', cellComponentType: 'inputText' },
        { dataIndex: '42', title: '工程预约审批记录工单总数', cellComponentType: 'inputText' },
        { dataIndex: '43', title: '异常工单处理情况', cellComponentType: 'textarea' },
        { dataIndex: '44', title: '执行人', cellComponentType: 'executorModal' },
    ],
};

/**
 * 计算列宽，按照顺序进行配置
 */
const designWidth = 1377;
const ProjectTableColumnsSettings = [
    {
        projectName: '网管告警监控',
        projectId: '1',
        columns: [
            {
                width: 142,
                radio: 142 / designWidth,
            },
            {
                width: 206,
                radio: 206 / designWidth,
            },
            {
                width: 77,
                radio: 77 / designWidth,
            },
            {
                width: 150,
                // radio: 89 / designWidth,
            },
            {
                width: 'auto',
                // radio: 145 / designWidth,
            },
            {
                width: 96,
                radio: 96 / designWidth,
            },
            {
                width: 540,
                radio: 540 / designWidth,
            },
        ],
    },
    {
        projectName: '日分析表',
        projectId: '2',
        columns: [
            {
                width: 142,
                radio: 142 / designWidth,
            },
            {
                width: 265,
                radio: 265 / designWidth,
            },
            {
                width: 80,
                radio: 80 / designWidth,
            },
            {
                width: 97,
                radio: 97 / designWidth,
            },
            {
                width: 162,
                radio: 162 / designWidth,
            },
            {
                width: 'auto',
                // radio: 142 / designWidth,
            },
            {
                width: 430,
                radio: 430 / designWidth,
            },
        ],
    },
    {
        projectName: 'NOC环境保持',
        projectId: '3',
        columns: [
            {
                width: 142,
                radio: 142 / designWidth,
            },
            {
                width: 265,
                radio: 265 / designWidth,
            },
            {
                width: 80,
                radio: 80 / designWidth,
            },
            {
                width: 97,
                radio: 97 / designWidth,
            },
            {
                width: 200,
                radio: 200 / designWidth,
            },
            {
                width: 395,
                radio: 395 / designWidth,
            },
        ],
    },
    {
        projectName: '值班人员交接班管理',
        projectId: '4',
        columns: [
            {
                width: 112,
                radio: 112 / designWidth,
            },
            {
                width: 128,
                radio: 128 / designWidth,
            },
            {
                width: 73,
                radio: 73 / designWidth,
            },
            {
                width: 144,
                radio: 144 / designWidth,
            },
            {
                width: 350,
                radio: 350 / designWidth,
            },
            {
                width: 370,
                radio: 370 / designWidth,
            },
        ],
    },
    {
        projectName: '故障工单管理',
        projectId: '5',
        columns: [
            {
                width: 124,
                radio: 124 / designWidth,
            },
            {
                width: 77,
                radio: 77 / designWidth,
            },
            {
                width: 142,
                radio: 142 / designWidth,
            },
            {
                width: 160,
                radio: 160 / designWidth,
            },
            {
                width: 180,
                radio: 180 / designWidth,
            },
            {
                width: 500,
                radio: 500 / designWidth,
            },
        ],
    },
    {
        projectName: '割接及工程预约管理',
        projectId: '6',
        columns: [
            {
                width: 124,
                radio: 124 / designWidth,
            },
            {
                width: 77,
                radio: 77 / designWidth,
            },
            {
                width: 142,
                radio: 142 / designWidth,
            },
            {
                width: 160,
                radio: 160 / designWidth,
            },
            {
                width: 180,
                radio: 180 / designWidth,
            },
            {
                width: 550,
                radio: 550 / designWidth,
            },
        ],
    },
];
const calculateColWidth = (presetCol: any, col: any, tableWidth: number) => {
    let width = 'radio' in presetCol ? tableWidth * presetCol.radio : presetCol.width;

    if (_.isNumber(width) && _.has(presetCol, 'minWidth') && _.has(presetCol, 'maxWidth')) {
        width = _.clamp(width, presetCol.minWidth, presetCol.maxWidth);
    }

    if (_.isNaN(width)) {
        width = null;
    }

    return width ?? col.width ?? 'auto';
};
const defaultValue = {
    EMPTY_ARRAY: Object.freeze([]),
    EMPTY_OBJECT: Object.freeze({}),
};

export {
    //
    HorizonAlignment,
    VerticalAlignment,
    ValueShowType,
    isValueEqual,
    cellAlignment,
    editableColumnsMapping,
    ProjectTableColumnsSettings,
    defaultValue,
    calculateColWidth,
};
