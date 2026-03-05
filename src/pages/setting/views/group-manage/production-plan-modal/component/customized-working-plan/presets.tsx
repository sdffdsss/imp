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

const cellTextStyle = (style: any) => {
    return {
        textAlign: isValueEqual(style.horizonAlign, HorizonAlignment.left) ? 'left' : ('center' as any),
    };
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
                width: 89,
                radio: 89 / designWidth,
            },
            {
                width: 150,
                // radio: 145 / designWidth,
            },
            {
                width: 96,
                radio: 96 / designWidth,
            },
            {
                width: 'auto',
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
                width: 150,
                // radio: 142 / designWidth,
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
                width: 162,
                radio: 162 / designWidth,
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
                width: 347,
                radio: 347 / designWidth,
            },
            {
                width: 395,
                radio: 395 / designWidth,
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
                width: 145,
                radio: 145 / designWidth,
            },
            {
                width: 154,
                radio: 154 / designWidth,
            },
            {
                width: 562,
                radio: 562 / designWidth,
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
    ProjectTableColumnsSettings,
    defaultValue,
    calculateColWidth,
    cellTextStyle,
};
