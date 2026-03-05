// import locales from "locales";
import React from 'react';
import { Checkbox, Row, Col } from 'oss-ui';
import CheckAll from './checkAll';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.checkedHis = [];
        this.state = {
            indeterminate: this.props.values.size !== this.props.options.length && this.props.values.size !== 0,
            checkAll: this.props.values.size === this.props.options.length,
        };
    }
    onCheckAllChange(e) {
        this.setState({
            indeterminate: false,
            checkAll: e.target.checked,
        });
        const checkValueList = [];
        for (const iterator of this.props.options) {
            // onSelect 方法为 menu 传入，单一传值，暂时不用
            //     this.props.onSelect(iterator.value, { selected: e.target.checked });
            checkValueList.push(iterator.value);
        }
        if (e.target.checked) {
            // 并集
            const checkAllList = Array.from(this.props.values).concat(checkValueList);
            this.props.allChange(Array.from(new Set(checkAllList)));
        } else {
            // 差集
            const notCheckinCrrunt = this.getDifferencNotInFormer(checkValueList, this.props.values);
            this.props.allChange(notCheckinCrrunt);
        }
    }
    handleCheckboxChange(event) {
        const currentOptions = this.props.options.map((item) => {
            return item.value;
        });
        const currentvalues = Array.from(this.props.values);
        const diff = this.getDifferencNotInFormer(currentvalues, currentOptions);
        if (diff.length === 0 || (diff.length === 1 && diff[0] === event.target.value)) {
            this.setState({
                indeterminate: !event.target.checked,
                checkAll: event.target.checked,
            });
        }
        if (diff.length > 1) {
            this.setState({
                indeterminate: true,
            });
        }
        if (currentvalues.length === 1) {
            this.setState({
                indeterminate: event.target.checked,
            });
        }
        this.props.onSelect(event.target.value, { selected: event.target.checked });
    }
    handleGroupChange(checkedList) {
        const currentOptions = this.props.options.map((item) => {
            return item.value;
        });
        if (this.props.dataSourceType === 'jsx') {
            this.setState({
                indeterminate: !!checkedList.length && checkedList.length < currentOptions.length,
                checkAll: checkedList.length === currentOptions.length,
            });
        } else {
            const currentvalues = Array.from(this.props.values);
            this.checkedHis = this.getSameEles(currentvalues, currentOptions);
            //
            const changeValue = this.getDifference(this.checkedHis, checkedList)[0];
            const selected = !(this.checkedHis.length > checkedList.length);
            // 通过对比获取 状态改变的项和状态
            this.props.onSelect(changeValue, { selected });
        }
    }
    // 获得本次新数据项：数组差集
    getDifference(array1, array2) {
        let difference = null;
        const a = new Set(array1);
        const b = new Set(array2);
        if (a.size > b.size) {
            difference = new Set([...a].filter((x) => !b.has(x)));
        } else {
            difference = new Set([...b].filter((x) => !a.has(x)));
        }
        return Array.from(difference);
    }
    // 获得本次新数据项：former 相对latter 的差集
    getDifferencNotInFormer(former, latter) {
        let difference = null;
        const a = new Set(former);
        const b = new Set(latter);
        difference = new Set([...b].filter((x) => !a.has(x)));
        return Array.from(difference);
    }
    // 获取数组交集
    getSameEles(arrayA, arrayB) {
        const setA = new Set(arrayA);
        const setB = new Set(arrayB);
        const sameEles = new Set([...setA].filter((x) => setB.has(x)));
        return Array.from(sameEles);
    }
    render() {
        const valueArray = Array.from(this.props.values);
        let jsx = null;
        const dropdownCheckBoxStyle = { maxHeight: this.props.height - 75, overflowY: 'auto', overflowX: 'hidden' };
        if (this.props.dataSourceType === 'jsx') {
            jsx = (
                <>
                    <div>
                        <Row gutter={[0, 8]}>
                            <Col span={24} offset={1}>
                                <CheckAll
                                    indeterminate={this.state.indeterminate}
                                    onCheckAllChange={this.onCheckAllChange.bind(this)}
                                    checkAll={this.state.checkAll}
                                ></CheckAll>
                            </Col>
                        </Row>
                    </div>
                    <div style={dropdownCheckBoxStyle}>
                        <Checkbox.Group
                            value={valueArray}
                            handleGroupChange={this.handleGroupChange.bind(this)}
                            style={{ width: '100%' }}
                        >
                            <Row gutter={[0, 8]}>
                                {this.props.options.map(({ value, label }) => (
                                    <Col span={24} offset={1}>
                                        <Checkbox value={value} onChange={this.handleCheckboxChange.bind(this)}>
                                            {label}
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </div>
                </>
            );
        } else {
            // this.props.dataSourceType === 'options' | null
            jsx = (
                <div style={dropdownCheckBoxStyle}>
                    <Checkbox.Group
                        options={this.props.options}
                        value={valueArray}
                        onChange={this.handleGroupChange.bind(this)}
                    ></Checkbox.Group>
                </div>
            );
        }

        return jsx;
    }
}
