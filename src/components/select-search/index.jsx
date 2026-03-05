import React from 'react';
import { Select } from 'oss-ui';
import getData from '@Common/services/dataService';
import PropTypes from 'prop-types';

export default class Index extends React.PureComponent {

    static propTypes = {
        sqlId: PropTypes.string,
        id: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        maxTagCount: PropTypes.number,
        mode: PropTypes.string
    }

    static defaultProps = {
        sqlId: '',
        id: '',
        label: '',
        placeholder: '请选择',
        maxTagCount: 1,
        mode: 'multiple'
    }

    constructor(props) {
        super(props)
        this.state = {
            options: [],
        }
    }

    getSqlData = () => {
        const { sqlId, id, label } = this.props;
        getData(sqlId, { showSuccessMessage: false, showErrorMessage: false }, {}, -1, {}).then(res => {
            if(res.data && res.data.data && Array.isArray(res.data.data)) {
                const handleData = res.data.data.map(item => {
                    return (
                        <Select.Option
                            key={item[id]} 
                        >
                            {item[label]}
                        </Select.Option>
                    )
                })
                this.setState({
                    options: handleData
                })
            }
        }).catch(err => {

        })
    }

    onChange = (e) => {
        this.props.onChange && this.props.onChange(e)
    }

    render() {
        const { options } = this.state;
        const { placeholder, maxTagCount, mode } = this.props;
        return (
            <Select
                allowClear
                mode={mode}
                placeholder={placeholder}
                showArrow
                align='left'
                onChange={this.onChange}
                optionFilterProp='children'
                maxTagCount={maxTagCount}
                onFocus={this.getSqlData}
            >
                {options}
            </Select>
        )
    }
}