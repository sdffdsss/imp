import React, { useMemo, useRef } from 'react';
import { _ } from 'oss-web-toolkits';
import { Select } from 'oss-ui';
import { useTableContext } from '../../context';

const SelectResultImp = (props: any) => {
    const { onCellValueChange, state: tableState } = useTableContext();
    const valueObject = _.get(props, 'record.raw.current') ?? {};
    const select = _.get(valueObject, 'showConfig.0') ?? {};

    const defaultValue = select.result;
    const options = select.value.map((value) => ({ value, label: value }));

    return (
        <Select
            //
            bordered={false}
            defaultValue={defaultValue}
            options={options}
            style={{ width: '100%' }}
            disabled={!tableState.editable}
            onChange={(value) => {
                const newValueObject = {
                    ..._.cloneDeep(props.record.raw?.current ?? {}),
                    value,
                };

                _.set(newValueObject, 'showConfig.0.result', value);

                onCellValueChange({
                    value,
                    info: props.record.raw,
                    newValueObject,
                });
            }}
        />
    );
};

export const SelectResult = (props) => {
    const memoRef = useRef({ record: null });
    const latest = useRef({ onChange: props.onChange });
    latest.current = {
        ...latest.current,
        onChange: props.onChange ?? _.noop,
    };

    const memoRecord = useMemo(() => {
        if (!_.isEqual(memoRef.current.record, props.record)) {
            memoRef.current.record = _.cloneDeep(props.record);
        }
        return memoRef.current.record;
    }, [props.record]);

    return useMemo(() => <SelectResultImp onChange={(...args) => latest.current.onChange(...args)} record={memoRecord} />, [memoRecord]);
};
