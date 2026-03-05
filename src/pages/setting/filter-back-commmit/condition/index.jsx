import React, { PureComponent } from 'react';
import { Modal, Form, Input, Checkbox, Space, Tabs, message, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import request from '@Common/api';
import Y2S from './Y2S';
import H2M from './H2M';
import CommaIntegerWithRange from './comma-integer-with-range';
import RegExpComponent from './reg-exp';
import AlarmTitle from './alarm-title';
import CustomModalFooter from '@Components/custom-modal-footer';
import CommaInteger from './comma-integer';
import './index.less';

export default class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'normal',
            visible: props.visible,
            name: '',
            isNegative: false,
            normalList: [],
            advancedList: [],
            // 当前选中的左侧条件
            currentSelectedCondition: null,
            // 当前右侧显示的条件值列表 以所属的左侧条件id为key,value为{valueString:,valueStringList: ,}
            rightValues: {},
        };
    }

    componentDidMount() {
        const { conditionInfo } = this.props;

        request('sysadminFilter/item-types', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            data: {
                iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
                id: 6,
            },
        }).then((res) => {
            if (res && Array.isArray(res.data) && res.data.length > 0) {
                const normalList = res.data.filter((item) => item.valueType === 'CommaInteger');
                const advancedList = res.data.filter((item) => item.valueType !== 'CommaInteger');
                // 默认选中普通条件的第一个
                this.setState({
                    allList: res.data,
                    normalList,
                    advancedList,
                });
            }
        });

        if (conditionInfo) {
            this.setState({
                name: conditionInfo.name,
                isNegative: conditionInfo.isNegative,
                rightValues: conditionInfo.items.reduce((total, item) => {
                    total[item.type.id] = item;
                    return total;
                }, {}),
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible !== this.props.visible) {
            this.setState({ visible: this.props.visible });
        }
    }

    onNameChange = (e) => {
        this.setState({ name: e.target.value });
    };

    onNegativeChange = (e) => {
        this.setState({ isNegative: e.target.checked });
    };

    handleCancle = () => {
        this.setState({ visible: false });
        this.props.onVisibleChange(false);
    };

    // 编辑条件确认
    handleOk = () => {
        const { onConfirm } = this.props;
        const { rightValues, name, isNegative, allList } = this.state;
        const result = [];

        for (const valueItem in rightValues) {
            result.push({
                isNegative: false,
                ...rightValues[valueItem],

                type: {
                    ...rightValues[valueItem].type,
                    ...allList.find((item) => `${item.id}` === valueItem),
                },
            });
        }

        // 判空
        if (!name) {
            message.warning('请输入标题');

            return;
        }

        if (result.length === 0) {
            message.warning('选择条件');

            return;
        }

        this.setState({ visible: false });
        this.props.onVisibleChange(false);
        onConfirm({ name, isNegative, result });
    };

    onTabChange = (activeKey) => {
        this.setState({ activeKey, currentSelectedCondition: null });
    };

    // 左侧选中/不选中条件
    onLeftCheckedChange = (e) => {
        const { rightValues } = this.state;
        const rightCheckedResult = _.cloneDeep(rightValues);

        if (e.target.checked) {
            let valueString = '';
            let valueStringList = [];

            switch (e.target.value.valueType) {
                case 'Integer':
                case 'CommaIntegerWithRange':
                    valueString = ',0,';
                    valueStringList = ['0'];
                    break;
                case 'CommaText':
                case 'IntegerText':
                case 'RegExp':
                    valueString = 'NULL';
                    valueStringList = ['空'];
                    break;
                case 'TimeH2M':
                    valueString = '';
                    valueStringList = ['0:0', '0:0'];
                    break;
                case 'TimeY2S':
                    valueString = '';
                    valueStringList = [];
                    break;
                default:
                    break;
            }
            rightCheckedResult[e.target.value.id] = {
                type: {},
                valueString,
                valueStringList,
            };
        } else {
            delete rightCheckedResult[e.target.value.id];
        }

        this.setState({
            rightValues: rightCheckedResult,
            currentSelectedCondition: e.target.value,
        });
    };

    // 左侧点击标题
    onLeftSelectedChange = (data) => {
        this.setState({
            currentSelectedCondition: data,
        });
    };

    // 右侧普通条件值选中/不选中
    onRightNormalValuesChange = (e) => {
        const { rightValues, currentSelectedCondition } = this.state;
        const rightCheckedResult = _.cloneDeep(rightValues);
        const currentValue = rightCheckedResult[currentSelectedCondition.id];

        const currentValueStringArr = currentValue.valueString ? currentValue.valueString.split(',') : [];
        const currentValueStringListArr = currentValue.valueStringList;

        if (e.target.checked) {
            if (currentValue) {
                currentValue.valueString = currentValueStringArr.concat(e.target.value.id).join(',');
                currentValue.valueStringList = currentValueStringListArr.concat(e.target.value.name);
            } else {
                currentValue.valueString = `${e.target.value.id}`;
                currentValue.valueStringList = `${e.target.value.name}`;
            }
        } else {
            currentValue.valueString = currentValueStringArr.filter((item) => item !== `${e.target.value.id}`).join(',');
            currentValue.valueStringList = currentValueStringListArr.filter((item) => item !== e.target.value.name);
        }

        this.setState({ rightValues: rightCheckedResult });
    };

    // 右侧文本类型
    onRightTextChange = (e) => {
        const { rightValues, currentSelectedCondition } = this.state;
        const rightCheckedResult = _.cloneDeep(rightValues);

        rightCheckedResult[currentSelectedCondition.id] = {
            type: {},
            valueString: '',
            valueStringList: [],
        };

        let valueString = '';
        let valueStringList = [];

        if (e.target.value === 'NULL') {
            valueString = 'NULL';
            valueStringList = ['空'];
        } else if (e.target.value === 'NOTNULL') {
            valueString = 'NULL';
            valueStringList = ['空'];
            rightCheckedResult[currentSelectedCondition.id].isNegative = true;
        }

        rightCheckedResult[currentSelectedCondition.id].valueString = valueString;
        rightCheckedResult[currentSelectedCondition.id].valueStringList = valueStringList;

        this.setState({ rightValues: rightCheckedResult });
    };

    // 右侧文本类型为字符串匹配时的字符串
    onRegExpStrChange = (type, e) => {
        const { rightValues, currentSelectedCondition } = this.state;

        const rightCheckedResult = _.cloneDeep(rightValues);
        rightCheckedResult[currentSelectedCondition.id].valueString = e.target.value;
        rightCheckedResult[currentSelectedCondition.id].valueStringList = type ? e.target.value.split(type) : [e.target.value];

        this.setState({ rightValues: rightCheckedResult });
    };

    // 字符串匹配是否取反
    onTxtNegativeChange = (e) => {
        const { rightValues, currentSelectedCondition } = this.state;

        const rightCheckedResult = _.cloneDeep(rightValues);
        rightCheckedResult[currentSelectedCondition.id].isNegative = e.target.checked;

        this.setState({ rightValues: rightCheckedResult });
    };

    // 时间范围改变
    onTimeH2MChange = (time, timeString) => {
        const { rightValues, currentSelectedCondition } = this.state;

        const rightCheckedResult = _.cloneDeep(rightValues);

        const startTimeArr = timeString[0].split(':');
        const endTimeArr = timeString[1].split(':');

        const startSec = parseInt(startTimeArr[0], 10) * 60 + parseInt(startTimeArr[1], 10);
        const endSec = parseInt(endTimeArr[0], 10) * 60 + parseInt(endTimeArr[1], 10);
        // 时间
        rightCheckedResult[currentSelectedCondition.id].valueString = `${startSec},${endSec}`;
        rightCheckedResult[currentSelectedCondition.id].valueStringList = timeString;
        this.setState({ rightValues: rightCheckedResult });
    };

    // 数字类型操作符改变
    onNumberOperatorChange = (index, value) => {
        const { rightValues, currentSelectedCondition } = this.state;

        const rightCheckedResult = _.cloneDeep(rightValues);
        const valueStringArr = rightCheckedResult[currentSelectedCondition.id].valueString.split(',').slice(1, -1);
        let newValue = '';

        switch (value) {
            case 'lteq':
                newValue = '-0';
                break;
            case 'gteq':
                newValue = '0-';
                break;
            case 'eq':
                newValue = '0';
                break;
            case 'between':
                newValue = '0-0';
                break;
            default:
                newValue = '-0';
        }

        valueStringArr.splice(index, 1, newValue);
        rightCheckedResult[currentSelectedCondition.id].valueString = `,${valueStringArr.join(',')},`;
        rightCheckedResult[currentSelectedCondition.id].valueStringList = valueStringArr;

        this.setState({ rightValues: rightCheckedResult });
    };

    // 数字类型的值改变
    onNumberChange = (index, operator, type, value) => {
        const { rightValues, currentSelectedCondition } = this.state;

        const rightCheckedResult = _.cloneDeep(rightValues);
        const valueStringArr = rightCheckedResult[currentSelectedCondition.id].valueString.split(',').slice(1, -1);

        if (operator === 'lteq') {
            valueStringArr[index] = `-${value}`;
        } else if (operator === 'gteq') {
            valueStringArr[index] = `${value}-`;
        } else if (operator === 'eq') {
            valueStringArr[index] = `${value}`;
        } else if (operator === 'between') {
            const numberArr = valueStringArr[index].split('-');
            if (type === 'first') {
                valueStringArr[index] = `${value}-${numberArr[1]}`;
            } else {
                valueStringArr[index] = `${numberArr[0]}-${value}`;
            }
        }

        rightCheckedResult[currentSelectedCondition.id].valueString = `,${valueStringArr.join(',')},`;
        rightCheckedResult[currentSelectedCondition.id].valueStringList = valueStringArr;

        this.setState({ rightValues: rightCheckedResult });
    };

    onTimeYearSecChange = (date, dateString) => {
        const { rightValues, currentSelectedCondition } = this.state;

        const rightCheckedResult = _.cloneDeep(rightValues);
        rightCheckedResult[currentSelectedCondition.id] = { valueString: dateString, valueStringList: dateString };

        this.setState({ rightValues: rightCheckedResult });
    };

    onAlarmTitleChange = (rows) => {
        const { rightValues, currentSelectedCondition } = this.state;

        const rightCheckedResult = _.cloneDeep(rightValues);
        rightCheckedResult[currentSelectedCondition.id] = {
            valueString: rows.map((item) => item.id),
            valueStringList: rows.map((item) => item.name),
        };

        this.setState({ rightValues: rightCheckedResult });
    };

    onSearchCond = (event) => {
        const { allList } = this.state;

        this.setState({
            normalList: allList.filter(
                (item) => item.valueType === 'CommaInteger' && item.displayName.toLowerCase().includes(event.target.value.toLowerCase())
            ),
            advancedList: allList.filter(
                (item) => item.valueType !== 'CommaInteger' && item.displayName.toLowerCase().includes(event.target.value.toLowerCase())
            ),
        });
    };

    // 普通条件全选清空
    onCheckedOrNotAll = (type, list) => {
        const { rightValues, currentSelectedCondition } = this.state;
        const rightCheckedResult = _.cloneDeep(rightValues);
        const currentValue = rightCheckedResult[currentSelectedCondition.id];

        if (type === 'checkd') {
            currentValue.valueString = list.map((item) => item.id).join(',');
            currentValue.valueStringList = list.map((item) => item.name);
        } else if (type === 'clear') {
            currentValue.valueString = '';
            currentValue.valueStringList = [];
        }

        this.setState({ rightValues: rightCheckedResult });
    };

    // 数字类型增减操作 plus minus
    onNumberCountChange = (type = 'plus', index) => {
        const { rightValues, currentSelectedCondition } = this.state;
        const rightCheckedResult = _.cloneDeep(rightValues);
        const currentValue = rightCheckedResult[currentSelectedCondition.id];

        const valueStringArr = currentValue.valueString.split(',').slice(1, -1);

        if (type === 'plus') {
            valueStringArr.splice(index + 1, 0, '0');
        } else {
            valueStringArr.splice(index, 1);
        }

        this.setState({
            rightValues: {
                ...rightCheckedResult,
                [currentSelectedCondition.id]: {
                    ...currentValue,
                    valueString: `,${valueStringArr.join(',')},`,
                },
            },
        });
    };

    render() {
        const { visible, activeKey, normalList, advancedList, currentSelectedCondition, rightValues, isNegative, name } = this.state;
        const showConditionList = activeKey === 'normal' ? normalList : advancedList;

        // 右侧值类型 valueType
        const valueType = currentSelectedCondition && currentSelectedCondition.valueType ? currentSelectedCondition.valueType : '';
        // 右侧暂时禁用
        const disabled = !(currentSelectedCondition && rightValues[currentSelectedCondition.id]);
        // 条件的name 用于判断是否是告警标题类型
        const conditionName = currentSelectedCondition && rightValues[currentSelectedCondition.name];

        return (
            <Modal
                zIndex={1001}
                visible={visible}
                title="编辑"
                centered
                className="condition-modal-wrapper"
                width={970}
                onCancel={this.handleCancle}
                footer={<CustomModalFooter onCancel={this.handleCancle} onOk={this.handleOk} />}
            >
                <Form>
                    <Form.Item label="名称">
                        <Space>
                            <Input onChange={this.onNameChange} value={name} style={{ width: 220 }} />
                            <Checkbox onChange={this.onNegativeChange} checked={isNegative}>
                                取反
                            </Checkbox>
                        </Space>
                    </Form.Item>
                </Form>
                <Tabs activeKey={activeKey} onChange={this.onTabChange}>
                    <Tabs.TabPane tab="普通" key="normal"></Tabs.TabPane>
                    <Tabs.TabPane tab="高级" key="advanced"></Tabs.TabPane>
                </Tabs>
                <Space className="condition-wrapper" size={16}>
                    <div>
                        <Input suffix={<Icon antdIcon type="SearchOutlined" />} onChange={this.onSearchCond} />
                        <div className="condition-list">
                            {showConditionList.map((item, index) => {
                                const checked = !!rightValues[item.id];
                                return (
                                    <div kwy={index} className="condition-item">
                                        <Checkbox checked={checked} value={item} onChange={this.onLeftCheckedChange} />
                                        <span className={`name${checked ? ' active' : ''}`} onClick={this.onLeftSelectedChange.bind(this, item)}>
                                            {item.displayName}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="right-value-wrapper">
                        {/* 根据条件类型不同，右侧展示的条件选项不同 */}
                        {/* 普通条件 右侧条件值选择 */}
                        {valueType === 'CommaInteger' && (
                            <CommaInteger
                                key={`${currentSelectedCondition.id}-${valueType}`}
                                onRightNormalValuesChange={this.onRightNormalValuesChange}
                                rightValues={rightValues}
                                onCheckedOrNotAll={this.onCheckedOrNotAll}
                                onTxtNegativeChange={this.onTxtNegativeChange}
                                currentSelectedCondition={currentSelectedCondition}
                                disabled={disabled}
                            />
                        )}
                        {/* 空 非空 |分隔 */}
                        {(valueType === 'RegExp' || valueType === 'CommaText' || valueType === 'IntegerText') && (
                            <RegExpComponent
                                key={`${currentSelectedCondition.id}-${valueType}`}
                                splitType={valueType === 'RegExp' ? '|' : valueType === 'CommaText' ? ',' : ''}
                                disabled={disabled}
                                onTxtNegativeChange={this.onTxtNegativeChange}
                                onRegExpStrChange={this.onRegExpStrChange.bind(
                                    this,
                                    valueType === 'RegExp' ? '|' : valueType === 'CommaText' ? ',' : ''
                                )}
                                onRightTextChange={this.onRightTextChange}
                                rightValues={rightValues}
                                currentSelectedCondition={currentSelectedCondition}
                            />
                        )}
                        {/* 高级条件 选择时间范围 时分 */}
                        {valueType === 'TimeH2M' && (
                            <H2M
                                key={`${currentSelectedCondition.id}-${valueType}`}
                                disabled={disabled}
                                rightValues={rightValues}
                                currentSelectedCondition={currentSelectedCondition}
                                onChange={this.onTimeH2MChange}
                            />
                        )}
                        {/* 高级条件 选择操作类型 */}
                        {(valueType === 'CommaIntegerWithRange' || valueType === 'Integer') && (
                            <CommaIntegerWithRange
                                key={`${currentSelectedCondition.id}-${valueType}`}
                                disabled={disabled}
                                rightValues={rightValues}
                                currentSelectedCondition={currentSelectedCondition}
                                onNumberChange={this.onNumberChange}
                                onNumberOperatorChange={this.onNumberOperatorChange}
                                onNumberCountChange={this.onNumberCountChange}
                            />
                        )}
                        {/* 高级条件 选择时间范围 年 => 秒 */}
                        {valueType === 'TimeY2S' && (
                            <Y2S
                                key={`${currentSelectedCondition.id}-${valueType}`}
                                disabled={disabled}
                                rightValues={rightValues}
                                currentSelectedCondition={currentSelectedCondition}
                                onChange={this.onTimeYearSecChange}
                            />
                        )}

                        {/* 高级条件 告警标题 */}
                        {(valueType === 'ExtendStorage' || conditionName === 'alarm_title') && (
                            <AlarmTitle
                                key={`${currentSelectedCondition.id}-${valueType}`}
                                disabled={disabled}
                                onTxtNegativeChange={this.onTxtNegativeChange}
                                onChange={this.onAlarmTitleChange}
                                rightValues={rightValues}
                                currentSelectedCondition={currentSelectedCondition}
                            />
                        )}
                        {Object.keys(rightValues).length === 0 && (
                            <div className="oss-imp-alarm-empty" style={{ marginTop: '100px' }}>
                                <Icon type="iconzanwushuju" style={{ fontSize: 60, marginBottom: 5 }} />
                                <p style={{ fontSize: 14 }}>暂无数据</p>
                            </div>
                        )}
                    </div>
                </Space>
            </Modal>
        );
    }
}
