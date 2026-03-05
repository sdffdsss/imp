/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { Fragment } from 'react';
// import BraftEditor from 'braft-editor'
import { Select } from 'oss-ui';
// import { ContentUtils } from 'braft-utils';

class BarBlockComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            optionData: this.props.blockProps.fieldDataList,
            selectValue: undefined
        };
    }
    componentDidMount() {
        console.log(123);
        const { onChangeValue, id } = this.props.blockProps;
        let blockData = {};
        const blockGetData = this.props.block.getData();
        if (blockGetData.get('selectValue')) {
            blockData = {
                selectValue: blockGetData.get('selectValue')
            };
        } else {
            if (this.props.blockProps?.fieldDataMap[id]) {
                blockData = {
                    selectValue: this.props.blockProps.fieldDataMap[id]
                };
            } else {
                blockData = {
                    selectValue: this.props.blockProps.fieldDataList[0].value
                };
            }
        }
        this.setState({
            selectValue: blockData.selectValue
        });
        onChangeValue && onChangeValue({ [id]: blockData.selectValue });
    }
    componentWillUnmount() {}
    // componentDidUpdate(prevProps) {
    //     const { onChangeValue, id } = this.props.blockProps;
    //     console.log(this.state.selectValue);
    //     console.log(id);
    //     onChangeValue && onChangeValue({ [id]: this.state.selectValue });
    // }
    onChange = (value) => {
        const { onChangeValue, id } = this.props.blockProps;
        onChangeValue && onChangeValue({ [id]: value });
        this.setState({
            selectValue: value
        });
    };
    render() {
        const { optionData, selectValue } = this.state;
        return (
            <Fragment>
                <Select
                    style={{ width: 120 }}
                    placeholder={'请选择字段'}
                    options={optionData}
                    onChange={this.onChange}
                    optionFilterProp="label"
                    value={selectValue || undefined}
                />
            </Fragment>
        );
    }
}
export default BarBlockComponent;
