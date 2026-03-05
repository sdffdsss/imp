import React from 'react';
import { Select } from 'oss-ui';
import './index.less';

const ValueByMapBox = (props) => {
    const { showSearch, optionFilterProp, mode, options, value, onChange } = props;

    const onChangeAlarmSpecialized = (newValue) => {
        const tempValue = { ...value, alarmProfessional: newValue };
        onChange(tempValue);
    };
    const onChangeRootCauseSpecialty = (newValue) => {
        const tempValue = { ...value, rootCauseSpecialty: newValue };
        onChange(tempValue);
    };
    return (
        <div className="value-by-map-box">
            <div className="value-by-map-box-alarm">
                <div className="value-by-map-box-title">告警专业</div>
                <Select
                    showSearch={showSearch}
                    optionFilterProp={optionFilterProp}
                    mode={mode}
                    options={options}
                    value={value?.alarmProfessional}
                    onChange={onChangeAlarmSpecialized}
                />
            </div>
            <div className="value-by-map-box-root-cause">
                <div className="value-by-map-box-title">根因专业</div>
                <Select
                    showSearch={showSearch}
                    optionFilterProp={optionFilterProp}
                    mode={mode}
                    options={options}
                    value={value?.rootCauseSpecialty}
                    onChange={onChangeRootCauseSpecialty}
                />
            </div>
        </div>
    );
};
export default ValueByMapBox;
