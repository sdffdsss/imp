import React, { useMemo, useRef } from 'react';
import { _ } from 'oss-web-toolkits';

const RootContext = React.createContext({ groupInfo: {} as any, groupUsers: [] as any[] });

const RootContextProvider = (props) => {
    const memoRef = React.useRef({ groupInfo: null });

    const memoGroupInfo = useMemo(() => {
        if (_.isEmpty(props.groupInfo)) {
            return null;
        }
        if (!_.isEqual(memoRef.current.groupInfo, props.groupInfo)) {
            memoRef.current.groupInfo = _.cloneDeep(props.groupInfo);
        }

        return memoRef.current.groupInfo;
    }, [props.groupInfo]);

    const value = useMemo(() => {
        return {
            groupInfo: memoGroupInfo,
            groupUsers: props.groupUsers,
        };
    }, [memoGroupInfo, props.groupUsers]);

    return <RootContext.Provider value={value}>{props.children}</RootContext.Provider>;
};

const useRootContext = () => {
    return React.useContext(RootContext);
};

const TableContext = React.createContext({ onCellValueChange: _.noop, state: { editable: false } });

const TableProvider = (props: any) => {
    const latest = useRef({ onCellValueChange: props.onCellValueChange ?? _.noop });
    latest.current = {
        ...latest.current,
        onCellValueChange: props.onCellValueChange ?? _.noop,
    };
    const value = useMemo(() => {
        return {
            onCellValueChange: (...args) => {
                latest.current.onCellValueChange(...args);
            },
            state: {
                editable: !!props.editable,
            },
        };
    }, [props.editable]);
    return <TableContext.Provider value={value}>{props.children}</TableContext.Provider>;
};

const useTableContext = () => {
    return React.useContext(TableContext);
};

export {
    //
    RootContextProvider,
    useRootContext,
    TableProvider,
    useTableContext,
};
