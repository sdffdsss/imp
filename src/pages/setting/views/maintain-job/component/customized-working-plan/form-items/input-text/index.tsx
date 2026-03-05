import React, { useEffect, useMemo, useRef, useState } from 'react';
import { _ } from 'oss-web-toolkits';
import { Input as InputUI } from 'oss-ui';
import { usePersistFn, useSetState } from 'ahooks';
import { useTableContext } from '../../context';

export const InputText = (props) => {
    const memoRef = useRef({ record: null });
    const inputRef = useRef<any>(null);
    const { onCellValueChange, state: tableState } = useTableContext();

    const [value, setValue] = useState(null);
    const [state, setState] = useSetState({ editing: false });

    const latest = useRef({ onChange: props.onChange, onPressEnter: props.onPressEnter, onBlur: props.onBlur });
    latest.current = {
        ...latest.current,
        onChange: props.onChange ?? _.noop,
        onPressEnter: props.onPressEnter ?? _.noop,
        onBlur: props.onBlur ?? _.noop,
    };

    const memoRecord: any = useMemo(() => {
        if (!_.isEqual(memoRef.current.record, props.record)) {
            memoRef.current.record = _.cloneDeep(props.record);
        }
        return memoRef.current.record;
    }, [props.record]);

    useEffect(() => {
        setValue((pre) => (pre === null ? memoRecord?.value : pre));
    }, [memoRecord]);

    useEffect(() => {
        if (state.editing && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [state.editing]);

    const onChange = usePersistFn((e) => {
        // eslint-disable-next-line prefer-destructuring
        const newValue = e.target.value;
        setValue(newValue);
    });

    const onFinished = () => {
        setState({ editing: false });

        const newValue = value;
        const newValueObject = {
            ..._.cloneDeep(props.record?.raw?.current ?? {}),
            value: newValue,
        };

        // _.set(newValueObject, 'showConfig.0.result', newValue);

        onCellValueChange({
            value: newValue,
            info: props.record?.raw,
            newValueObject,
        });
    };

    return tableState.editable && state.editing ? (
        <InputUI
            value={_.toString(value)}
            ref={inputRef}
            maxLength={50}
            onChange={(e) => onChange(e)}
            onPressEnter={(...args) => {
                latest.current.onPressEnter(...args);
                onFinished();
            }}
            onBlur={(...args) => {
                latest.current.onBlur(...args);
                onFinished();
            }}
        />
    ) : (
        <span style={{ display: 'inline-block', width: '100%', height: '100%' }} onClick={() => setState({ editing: true })}>
            <span style={{ lineHeight: 2 }}>{value || '-'}</span>
        </span>
    );
};
