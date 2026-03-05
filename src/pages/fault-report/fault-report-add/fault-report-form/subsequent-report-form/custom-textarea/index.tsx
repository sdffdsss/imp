import React from 'react';
import { Selector } from 'antd-mobile';
import { Input } from 'oss-ui';
import { TextAreaProps } from 'oss-ui/es/input';

const { TextArea } = Input;
type CustomTextareaProps = {
    value?: any;
    onChange?: (value) => void;
    textAreaProps?: TextAreaProps;
    latestData?: '';
    radioFieldName: string;
    textFieldName: string;
    defaultRadioValue?: string;
    disableRadio?: boolean;
    isVisibleByFollow?: boolean;
};
const CustomTextarea: React.FC<CustomTextareaProps> = (props) => {
    const { value: propsValue, onChange, textAreaProps, radioFieldName, textFieldName, disableRadio, isVisibleByFollow } = props;

    const onRadioChange = (e) => {
        onChange?.({
            [radioFieldName]: e[0],
            [textFieldName]: value[textFieldName],
            fieldName: textFieldName,
            isRadioChange: true,
        });
    };

    const onTextAreaChange = (e) => {
        onChange?.({
            [radioFieldName]: value[radioFieldName],
            [textFieldName]: e.target.value,
            fieldName: textFieldName,
            isRadioChange: false,
        });
    };
    const value = propsValue || {};

    return (
        <>
            <div style={{ marginBottom: 10, marginTop: 2 }}>
                {!(isVisibleByFollow && value[radioFieldName] === 'no') && (
                    <Selector
                        disabled={disableRadio}
                        className="fault-report-form-selector"
                        onChange={onRadioChange}
                        value={[value[radioFieldName]]}
                        multiple={false}
                        options={[
                            { label: '不沿用上次报送内容', value: 'no' },
                            { label: '沿用上次报送内容', value: 'yes' },
                        ]}
                    />
                )}
            </div>
            <TextArea
                className="report-custom-textarea"
                style={{ height: '100%' }}
                onChange={onTextAreaChange}
                value={value[textFieldName]}
                {...textAreaProps}
                // hidden={value[radioFieldName] === 'yes'}
            />
        </>
    );
};
export default CustomTextarea;
