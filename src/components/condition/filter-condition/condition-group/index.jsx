/* eslint-disable no-plusplus */
import React, { Fragment, PureComponent } from 'react';
import { Divider, Tooltip } from 'oss-ui';
// import DropZone from '../drop-zone';
import { _ } from 'oss-web-toolkits';
import ConditionValue from './condition-value';
import ConditionOperator from './condition-operator';
import ConditionAction from './condition-action';
import Logic from '../logic';
import { RightAngleLogicLine } from '../../../line';

export default class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            modelVisible: false,
            fieldList: [],
            choosedFieldName: '',
            handleDataIndex: 0,
        };
    }

    componentDidMount() {
        this.setState({
            lines: this.strokeLine(),
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.data.children !== prevProps.data.children) {
            this.setState({
                lines: this.strokeLine(),
            });
        }
    }

    // 画线
    strokeLine() {
        const { data, groupIndex } = this.props;
        const lines = [];

        for (let i = 0; i < data.children.length; i++) {
            lines.push(
                <RightAngleLogicLine
                    key={i}
                    lineColor="#d9d9d9"
                    from={`#edit-group-${groupIndex}-logic`}
                    to={`#edit-group-${groupIndex}-condition-${i}`}
                    fromAnchor="right"
                    toAnchor="left"
                    orientation="h"
                    lineWidth={1}
                    within={`#edit-conditions-${groupIndex}-wrapper`}
                />
            );
        }

        return lines;
    }

    render() {
        const { data, availableConditions, onChange, onConditionDelete, onConditionValueClear, groupIndex, onGroupLogicChange } = this.props;
        return (
            <div className="condition-group" id={`group-${groupIndex}`}>
                <div id={`edit-conditions-${groupIndex}-wrapper`} className={`conditions-wrapper${data.children.length > 1 ? ' has-logic' : ''}`}>
                    {data.children.length > 1 && (
                        <Logic logicalType={data.logicalType} onChange={onGroupLogicChange} id={`edit-group-${groupIndex}-logic`} />
                    )}
                    {data.children.map((item, index) => {
                        // let operatorOptions = [];
                        // 当前条件对应的在available中对应的属性
                        let currentConditionProps = null;
                        if (!_.isEmpty(item)) {
                            currentConditionProps = _.find(availableConditions, { fieldName: item.name });
                        }
                        return (
                            <Fragment key={`group-${groupIndex}-condition-${index}`}>
                                <div className="condition-wrapper" id={`edit-group-${groupIndex}-condition-${index}`}>
                                    <>
                                        <span className="condition-label">
                                            <Tooltip title={item.label}>{item.label}</Tooltip>
                                        </span>
                                        <div className="condition-operator-value">
                                            <div className="condition-operator-value-inner">
                                                <ConditionOperator
                                                    onChange={onChange}
                                                    // options={operatorOptions}
                                                    data={item}
                                                    index={index}
                                                    currentConditionProps={currentConditionProps}
                                                />
                                                <ConditionValue
                                                    data={item}
                                                    index={index}
                                                    onChange={onChange}
                                                    currentConditionProps={currentConditionProps}
                                                />
                                            </div>
                                        </div>
                                    </>
                                    <ConditionAction
                                        onConditionDelete={onConditionDelete}
                                        onConditionValueClear={onConditionValueClear}
                                        index={index}
                                    />
                                </div>
                                {index < data.children.length - 1 && <Divider style={{ margin: '16px 0' }} />}
                            </Fragment>
                        );
                    })}
                    {data.children.length > 1 && this.state.lines}
                </div>
            </div>
        );
    }
}
