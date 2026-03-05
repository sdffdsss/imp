import React from 'react';
import { Select } from 'oss-ui';
import request from '@Src/common/api';
import PropTypes from 'prop-types';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';

class Index extends React.PureComponent {
    static propTypes = {
        dictName: PropTypes.string,
        id: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        maxTagCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        mode: PropTypes.string,
        showSearch: PropTypes.bool,
        labelInValue: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        dictName: '',
        id: 'status',
        label: 'text',
        placeholder: '请选择',
        maxTagCount: 1,
        mode: 'multiple',
        showSearch: true,
        labelInValue: true,
        disabled: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            options: [],
        };
        this.onSearch = _.debounce(this.onSearch, 500);
    }
    componentDidMount() {
        this.getSqlData();
    }

    onSearch = (inputValue) => {
        this.getSqlData(inputValue);
    };

    getSqlData = (inputValue) => {
        const { dictName, id, label, login } = this.props;
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                pageSize: 100,
                dictName,
                en: false,
                modelId: 2,
                value: inputValue,
                creator: login.userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        })
            .then((res) => {
                if (res && Array.isArray(res.data)) {
                    // debugger;
                    const handleData = res.data.map((item) => {
                        // return <Select.Option key={Number(item[id])}>{item[label]}</Select.Option>;
                        return { label: item[label], value: item[id] };
                    });
                    this.setState({
                        options: handleData,
                    });
                } else {
                    this.setState({
                        options: [],
                    });
                }
            })
            .catch((err) => {});
    };

    onChange = (e) => {
        this.props.onChange && this.props.onChange(e);
    };

    resetInputValue = () => {
        this.setState(
            {
                inputValue: '',
            },
            this.onSearch()
        );
    };

    render() {
        const { options } = this.state;
        const { placeholder, maxTagCount, mode, showSearch, labelInValue, disabled, onChange, value } = this.props;
        const compProps = {
            placeholder,
            maxTagCount,
            mode,
            showArrow: true,
            optionFilterProp: 'children',
            // onFocus: this.getSqlData,
            align: 'left',
            options,
            showSearch,
            labelInValue,
            disabled,
            onChange,
            value,
        };
        return <Select {...compProps} onSearch={this.onSearch} filterOption={false} onFocus={this.resetInputValue}></Select>;
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
