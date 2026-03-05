import React, { useEffect, useMemo, useRef } from 'react';
import { _ } from 'oss-web-toolkits';
import { Input } from 'oss-ui';
import { usePersistFn, useSetState } from 'ahooks';
import { useTableContext } from '../../context';

const TextAreaUI = Input.TextArea;

const TextArea = (props) => {
    const memoRef = useRef({ record: null });
    const latest = useRef({ onChange: props.onChange });

    const { onCellValueChange, state: tableState } = useTableContext();

    const [state, setState] = useSetState({ value: props.record?.value });

    latest.current = {
        ...latest.current,
        onChange: props.onChange ?? _.noop,
    };

    const memoRecord: any = useMemo(() => {
        if (!_.isEqual(memoRef.current.record, props.record)) {
            memoRef.current.record = _.cloneDeep(props.record);
        }
        return memoRef.current.record;
    }, [props.record]);

    useEffect(() => {
        setState({ value: memoRecord?.value });
    }, [memoRecord, setState]);

    const onChange = usePersistFn((e) => {
        // eslint-disable-next-line prefer-destructuring
        const value = e.target.value;
        setState({ value });

        const newValueObject = {
            ..._.cloneDeep(props.record?.raw?.current ?? {}),
            value,
        };

        _.set(newValueObject, 'showConfig.0.result', value);

        onCellValueChange({
            value,
            info: props.record?.raw,
            newValueObject,
        });
    });

    return useMemo(() => {
        return <TextAreaUI maxLength={1000} onChange={onChange} disabled={!tableState.editable} value={state.value} />;
    }, [onChange, tableState.editable, state.value]);
};

export { TextArea };
