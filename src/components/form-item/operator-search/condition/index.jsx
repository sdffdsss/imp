/* eslint-disable @typescript-eslint/no-unused-expressions */
// import locales from "locales";
import React from 'react';
import { Input } from 'oss-ui';
import MultiSelect from './multiSelect';
import MultiSelectFilter from './multiSelectFilter';
import MultiSelectSearch from './multiSelectSearch';
import DateTimeRange from './dateTimeRange';
import DateTime from './dateTime';
import DateComponent from './date';
import DateRange from './dateRange';
import SelectAndSelect from './selectAndSelect/index.tsx';
import SelectAndInput from './selectAndInput';
import NumberComponent from './number';
import Cascader from './cascader';
import TypePropss from './type-pross';
import moment from 'moment';

export default class Index extends React.PureComponent {
    render() {
        const { valueType, enumType, operatorValue, conditionOptions, title, fieldPlaceholder, dataIndex } = this.props;
        if (!valueType || valueType === 'text') {
            if (dataIndex === 'sheet_no') {
                // console.log(this.props.disabled);
                return (
                    <Input
                        value={operatorValue.value}
                        placeholder={fieldPlaceholder || `请输入${title}`}
                        disabled={this.props.disabled}
                        onChange={({ target: { value } }) => {
                            this.props.onChange && this.props.onChange({ value });
                        }}
                    />
                );
            }
            return (
                <Input
                    value={operatorValue.value}
                    placeholder={fieldPlaceholder || `请输入${title}`}
                    onChange={({ target: { value } }) => {
                        this.props.onChange && this.props.onChange({ value });
                    }}
                />
            );
        }
        if (valueType === 'newText') {
            return (
                <SelectAndInput
                    parentProps={this.props}
                    value={operatorValue.value}
                    placeholder={fieldPlaceholder || `请输入${title}`}
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}
                />
            );
        }
        // if (title === 'NEW派单状态') {
        //     console.log(this.props);
        // }
        if (valueType === 'newEnumeration') {
            return (
                <SelectAndSelect
                    {...this.props}
                    // onChange={(value) => {
                    //     this.props.onChange && this.props.onChange({ value });
                    // }}
                />
            );
        }
        // 多选如果没有待选项，将会变成输入框
        if (valueType === 'enumeration' || conditionOptions.length > 0) {
            if (enumType === 'search') {
                return (
                    <MultiSelectSearch
                        {...this.props}
                        onChange={(value) => {
                            this.props.onChange && this.props.onChange({ value });
                        }}
                    />
                );
            }
            if (dataIndex === 'filter_id') {
                return (
                    <MultiSelectFilter
                        {...this.props}
                        onChange={(value) => {
                            this.props.onChange && this.props.onChange({ value });
                        }}
                    />
                );
            }
            if (dataIndex === 'professional_type' || dataIndex === 'eqp_object_class') {
                return (
                    <TypePropss
                        {...this.props}
                        onChange={(value) => {
                            this.props.onChange && this.props.onChange({ value });
                        }}
                    />
                );
            }
            // this.props.dataIndex === 'filter_id';
            return (
                <MultiSelect
                    {...this.props}
                    onChange={(value) => {
                        this.props.onChange && this.props.onChange({ value });
                    }}
                />
            );
        }
        // 多选如果没有待选项，将会变成输入框
        if (valueType === 'cascader') {
            return (
                <Cascader
                    {...this.props}
                    onChange={(value) => {
                        this.props.onChange && this.props.onChange({ value });
                    }}
                />
            );
        }
        if (valueType === 'dateTimeRange') {
            if (dataIndex === 'event_time') {
                const disabledDate = (current) => {
                    // Can not select days before today and today
                    if (this.props.formItemProps.myProps.platform) {
                        return current && current > moment().endOf('day');
                    }
                    return (current && current > moment().endOf('day')) || current < moment().subtract(40, 'days').endOf('day');
                };
                return (
                    <DateTimeRange
                        {...this.props}
                        disabledDate={disabledDate}
                        onChange={(value) => {
                            this.props.onChange && this.props.onChange({ value });
                        }}
                    />
                );
            } else {
                return (
                    <DateTimeRange
                        {...this.props}
                        onChange={(value) => {
                            this.props.onChange && this.props.onChange({ value });
                        }}
                    />
                );
            }
        }
        if (valueType === 'dateTime') {
            return (
                <DateTime
                    {...this.props}
                    onChange={(value) => {
                        this.props.onChange && this.props.onChange({ value });
                    }}
                />
            );
        }
        if (valueType === 'date') {
            return (
                <DateComponent
                    {...this.props}
                    onChange={(value) => {
                        this.props.onChange && this.props.onChange({ value });
                    }}
                />
            );
        }
        if (valueType === 'dateRange') {
            return (
                <DateRange
                    {...this.props}
                    onChange={(value) => {
                        this.props.onChange && this.props.onChange({ value });
                    }}
                />
            );
        }
        if (valueType === 'number') {
            return (
                <NumberComponent
                    {...this.props}
                    onChange={(value) => {
                        this.props.onChange && this.props.onChange({ value });
                    }}
                />
            );
        }
        return (
            <Input
                value={operatorValue.value}
                placeholder={fieldPlaceholder}
                onChange={({ target: { value } }) => {
                    this.props.onChange && this.props.onChange({ value });
                }}
            />
        );
    }
}
