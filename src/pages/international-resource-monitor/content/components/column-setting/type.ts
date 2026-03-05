import type { ColumnFilterItem, ColumnType, CompareFn } from 'antd/lib/table/interface';
import type { LightWrapperProps } from '@ant-design/pro-form';
import type { ProSchema, ProSchemaComponentTypes, ProTableEditableFnType, SearchTransformKeyFn } from '@ant-design/pro-utils';

export type SettingOptionType = {
    draggable?: boolean;
    checkable?: boolean;
    showListItemOption?: boolean;
    checkedReset?: boolean;
    listsHeight?: number;
    extra?: React.ReactNode;
    children?: React.ReactNode;
    settingIcon?: React.ReactNode;
};

export type ExtraProColumnType<T> = Omit<ColumnType<T>, 'render' | 'children' | 'title' | 'filters' | 'onFilter' | 'sorter'> & {
    sorter?:
        | string
        | boolean
        | CompareFn<T>
        | {
              compare?: CompareFn<T>;
              /** Config multiple sorter order priority */
              multiple?: number;
          };
};

export type ProColumnType<T = unknown, ValueType = 'text'> = ProSchema<
    T,
    ExtraProColumnType<T> & {
        children?: ProColumns<T>[];
        index?: number;
        /**
         * 每个表单占据的格子大小
         *
         * @param 总宽度 = span* colSize
         * @param 默认为 1
         */
        colSize?: number;

        /** 搜索表单的默认值 */
        initialValue?: any;

        /** @name 是否缩略 */
        ellipsis?: ColumnType<T>['ellipsis'];
        /** @name 是否拷贝 */
        copyable?: boolean;

        /** @deprecated Use `search=false` instead 在查询表单中隐藏 */
        hideInSearch?: boolean;

        /** 在查询表单中隐藏 */
        search?:
            | false
            | {
                  /**
                   * Transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
                   *
                   * @name 转化值的key, 一般用于事件区间的转化
                   */
                  transform: SearchTransformKeyFn;
              };

        /** @name 在 table 中隐藏 */
        hideInTable?: boolean;

        /** @name 在新建表单中删除 */
        hideInForm?: boolean;

        /** @name 不在配置工具中显示 */
        hideInSetting?: boolean;

        /** @name 表头的筛选菜单项 */
        filters?: boolean | ColumnFilterItem[];

        /** @name 筛选的函数，设置为 false 会关闭自带的本地筛选 */
        onFilter?: boolean | ColumnType<T>['onFilter'];

        /** @name Form 的排序 */
        order?: number;

        /** @name 可编辑表格是否可编辑 */
        editable?: boolean | ProTableEditableFnType<T>;

        /** @private */
        listKey?: string;

        /** @name 只读 */
        readonly?: boolean;

        /** @name 列设置的 disabled */
        disable?:
            | boolean
            | {
                  checkbox: boolean;
              };
    },
    ProSchemaComponentTypes,
    ValueType,
    {
        lightProps?: LightWrapperProps;
    }
>;

export type ProColumns<T = any, ValueType = 'text'> = ProColumnType<T, ValueType>;

export const genColumnKey = (key?: string | number, index?: number | string): string => {
    if (key) {
        return Array.isArray(key) ? key.join('-') : key.toString();
    }
    return `${index}`;
};

export type ColumnsState = {
    show?: boolean;
    fixed?: 'right' | 'left' | undefined;
    order?: number;
    disable?:
        | boolean
        | {
              checkbox: boolean;
          };
};

export type ColumnStateType = {
    /**
     * 持久化的类型，支持 localStorage 和 sessionStorage
     *
     * @param localStorage 设置在关闭浏览器后也是存在的
     * @param sessionStorage 关闭浏览器后会丢失
     */
    persistenceType?: 'localStorage' | 'sessionStorage';
    /** 持久化的key，用于存储到 storage 中 */
    persistenceKey?: string;
    /** ColumnsState 的值，columnsStateMap将会废弃 */
    defaultValue?: Record<string, ColumnsState>;
    /** ColumnsState 的值，columnsStateMap将会废弃 */
    value?: Record<string, ColumnsState>;
    onChange?: (map: Record<string, ColumnsState>) => void;
};

export type ProTableProps<DataSource, U, ValueType = 'text'> = {
    /**
     * @name 列配置能力，支持一个数组
     */
    columns?: ProColumns<DataSource, ValueType>[];
    /**
     * @name 渲染 table
     */
    tableRender?: (
        props: ProTableProps<DataSource, U, ValueType>,
        defaultDom: JSX.Element,
        /** 各个区域的 dom */
        domList: {
            toolbar: JSX.Element | undefined;
            alert: JSX.Element | undefined;
            table: JSX.Element | undefined;
        },
    ) => React.ReactNode;

    /** @name 列状态的配置，可以用来操作列功能 */

    columnsState?: ColumnStateType;
};

export type DensitySize = 'middle' | 'small' | 'large' | undefined;
