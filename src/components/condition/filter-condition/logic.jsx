import React from 'react';
import { Select } from 'oss-ui';

const logicRelation = [
    { key: 'and', name: '与' },
    { key: 'or', name: '或' },
];

class Logic extends React.PureComponent {
    render() {
        const { logicalType, id, onChange, disabledGroupLogicType = false } = this.props;

        return (
            <div id={id} className="logic-select">
                <Select
                    options={logicRelation.map((item) => ({
                        label: item.name,
                        value: item.key,
                    }))}
                    disabled={disabledGroupLogicType}
                    value={logicalType}
                    onChange={onChange}
                ></Select>
            </div>
        );
    }
}

export default Logic;
