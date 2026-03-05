import { useEffect, useState, useRef } from 'react';
import { _ } from 'oss-web-toolkits';
import * as columnConfigApi from '@Common/api/service/columnConfig';
import useLoginInfoModel from '@Src/hox';

const fixedMap = {
    0: false,
    1: 'left',
    2: 'right',
};

interface IColumnConfigItem {
    code: string;
    order: number;
    fixed: 0 | 1 | 2;
    show: 0 | 1;
    [key: string]: any;
}

export const useColumnsState: (params: { configType?: string | number }) => Record<string, any> = ({ configType }) => {
    const [value, setValue] = useState({});
    const columnsConfigCache = useRef<IColumnConfigItem[]>([]);
    const { userId } = useLoginInfoModel();

    function onChange(newValue) {
        if (!configType) {
            return;
        }
        const newConfig = columnsConfigCache.current.map((item) => {
            const state = newValue[item.code];
            return {
                ...item,
                order: state.order,
                // eslint-disable-next-line no-nested-ternary
                fixed: state.fixed === 'left' ? 1 : state.fixed === 'right' ? 2 : 0,
                show: Number(state.show ?? true),
            };
        });
        setValue(newValue);
        columnConfigApi.saveColumnConfig({
            userId,
            configs: newConfig,
        });
    }

    useEffect(() => {
        if (!configType) {
            return;
        }
        columnConfigApi
            .queryColumnConfig({
                userId,
                configType,
            })
            .then((res) => {
                columnsConfigCache.current = res;
                setValue(
                    res.reduce((accu, item) => {
                        return { ...accu, [item.code]: { show: Boolean(item.show), fixed: fixedMap[String(item.fixed)], order: item.order } };
                    }, {}),
                );
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        value,
        onChange,
    };
};
