/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Input, DatePicker, InputNumber, TimePicker, Button, Tooltip } from 'oss-ui';
import produce from 'immer';
import CommonSelect from '../select';
import GroupSelect from '../group-select';
import EditComp from '../edit';

class ConditionValue extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editVisible: false
        };
    }
    onInputChange = (e) => {
        const { onChange, data, index } = this.props;

        const newData = produce(data, (draft) => {
            draft.value = [e.target.value];
        });
        onChange(newData, index);
    };

    onSelectChange = (value) => {
        const { onChange, data, index } = this.props;
        let newValue = [];
        if (Array.isArray(value)) {
            newValue = value;
        } else {
            newValue = [value];
        }
        const newData = produce(data, (draft) => {
            draft.value = newValue;
        });
        onChange(newData, index);
    };

    onDateChange = (dateValue) => {
        const { onChange, data, index } = this.props;
        const newData = produce(data, (draft) => {
            draft.value = dateValue;
        });
        onChange(newData, index);
    };

    onNumberChange = (valueIndex, value) => {
        const { onChange, data, index } = this.props;

        const newData = produce(data, (draft) => {
            draft.value[valueIndex] = value;
        });
        onChange(newData, index);
    };

    onGroupSelectChange = (val) => {
        const { onChange, data, index } = this.props;
        const newData = produce(data, (draft) => {
            draft.value = val;
        });
        onChange(newData, index);
    };

    openModal = () => {
        this.setState({
            visible: true
        });
    };

    onGroupSelectModalClose = () => {
        this.setState({
            visible: false
        });
    };

    openEditModal = () => {
        this.setState({
            editVisible: true
        });
    };

    onEditModalClose = () => {
        this.setState({
            editVisible: false
        });
    };

    onEditChange = (val) => {
        const { onChange, data, index } = this.props;
        const newData = produce(data, (draft) => {
            draft.value = val;
        });
        onChange(newData, index);
    };

    render() {
        const { data } = this.props;
        const { visible, editVisible } = this.state;
        // 组选择
        if (data.compareType === 'groupSelect') {
            return (
                <>
                    <div className="condition-value">
                        <Tooltip title={data.value.map((val) => val.label).join(',')}>
                            <div className="group-select-input">
                                <Input value={data.value.map((val) => val.label).join(',')} placeholder="请输入" disabled />
                            </div>
                        </Tooltip>
                        <Button
                            onClick={this.openModal}
                            size="small"
                            type="primary"
                            style={{
                                marginLeft: '5px'
                            }}
                        >
                            组选择
                        </Button>
                    </div>
                    {visible && (
                        <GroupSelect data={data} onGroupSelectModalClose={this.onGroupSelectModalClose} onChange={this.onGroupSelectChange} />
                    )}
                </>
            );
        }
        // 高级设置
        if (data.enableAdvanceSetting === 1) {
            return (
                <div className="condition-value">
                    <Tooltip title={Array.isArray(data.value) && data.value.map((val) => val.label || val).join(',')}>
                        <div className="edit-input">
                            <Input.TextArea
                                onChange={this.onInputChange}
                                value={data?.value}
                                placeholder="请输入"
                                className="condition-value-textarea"
                                maxLength={1000}
                                disabled
                            />
                        </div>
                    </Tooltip>
                    <Button
                        onClick={this.openEditModal}
                        type="primary"
                        size="small"
                        style={{
                            marginLeft: '5px'
                        }}
                    >
                        编辑
                    </Button>
                    {editVisible && <EditComp data={data} onChange={this.onEditChange} onEditModalClose={this.onEditModalClose} />}
                </div>
            );
        }
        if (data?.isEnum === 1) {
            return (
                <div className="condition-value">
                    <Tooltip title={Array.isArray(data.value) && data.value.map((val) => val.label).join(',')}>
                        <CommonSelect
                            dictName={data.enumName}
                            onChange={this.onSelectChange}
                            maxTagTextLength={4}
                            maxTagCount="responsive"
                            keyField="key"
                            id="key"
                            label="value"
                            value={data.value}
                            placeholder="请选择"
                            labelInValue={true}
                            showSearch={true}
                            disabled={data.compareType === 'is_null' || data.compareType === 'not_null'}
                        ></CommonSelect>
                    </Tooltip>
                </div>
            );
        }
        if (data?.dataType === 'string') {
            return (
                <div className="condition-value">
                    <Tooltip title={Array.isArray(data.value) && data.value.map((val) => val.label || val).join(',')}>
                        <Input.TextArea
                            onChange={this.onInputChange}
                            value={data?.value}
                            placeholder="请输入"
                            className="condition-value-textarea"
                            disabled={data.compareType === 'is_null' || data.compareType === 'not_null'}
                        />
                    </Tooltip>
                </div>
            );
        }
        if (data?.dataType === 'integer' || data?.dataType === 'long') {
            if (data.compareType === 'between') {
                return (
                    <div className="condition-value">
                        <InputNumber
                            onChange={this.onNumberChange.bind(this, 0)}
                            value={data?.value[0]}
                            max={Math.pow(2, 31)}
                            min={0}
                            placeholder="请输入"
                        />
                        <InputNumber
                            onChange={this.onNumberChange.bind(this, 1)}
                            value={data?.value[1]}
                            min={data?.value[0]}
                            max={Math.pow(2, 31)}
                            placeholder="请输入"
                            disabled={!data?.value[0] && data?.value[0] !== 0}
                        />
                    </div>
                );
            }
            return (
                <div className="condition-value">
                    <InputNumber
                        onChange={this.onNumberChange.bind(this, 0)}
                        value={data?.value}
                        min={0}
                        max={Math.pow(2, 31)}
                        placeholder="请输入"
                    />
                </div>
            );
        }
        if (data?.dataType === 'date') {
            return (
                <div className="condition-value">
                    <DatePicker.RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={this.onDateChange}
                        value={data.value}
                        placeholder={['开始时间', '结束时间']}
                    />
                </div>
            );
        }
        if (data?.dataType === 'time') {
            return (
                <div className="condition-value">
                    <TimePicker.RangePicker
                        showTime
                        format="HH:mm"
                        onChange={this.onDateChange}
                        value={data.value}
                        placeholder={['开始时间', '结束时间']}
                    />
                </div>
            );
        }
        return <></>;
    }
}

export default ConditionValue;
