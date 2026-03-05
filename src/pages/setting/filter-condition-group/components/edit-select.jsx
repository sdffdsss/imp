import React from 'react';
import { Select } from 'oss-ui';
import request from '@Src/common/api';
import PropTypes from 'prop-types';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import { getRegionList } from '../utils/api';
import { getInitialProvince } from '../utils/tools';

class Index extends React.PureComponent {
    static propTypes = {
        dictName: PropTypes.string,
        id: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        maxTagCount: PropTypes.number,
        mode: PropTypes.string,
        showSearch: PropTypes.bool,
        addOptions: PropTypes.array,
    };

    static defaultProps = {
        dictName: '',
        id: 'status',
        label: 'text',
        placeholder: '请选择',
        maxTagCount: 1,
        mode: 'multiple',
        showSearch: true,
        addOptions: [],
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
        const { dictName, id, label, login, addOptions, selectForm, showDefaultValue, dbFieldName } = this.props;
        // const { systemInfo } = login;
        // if (dictName === 'region_id') {
        //     return getRegionList({
        //         creator: login.userId,
        //         parentRegionId: getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo),
        //     }).then((res) => {
        //         if (res && Array.isArray(res)) {
        //             // debugger;
        //             const handleData = res.map((item) => {
        //                 // return <Select.Option key={Number(item[id])}>{item[label]}</Select.Option>;
        //                 return { label: item.regionName, value: item.regionName };
        //             });
        //             if (showDefaultValue && selectForm) {
        //                 selectForm?.current?.setFieldsValue({
        //                     [dictName]: handleData[0]?.value,
        //                 });
        //             }
        //             this.setState({
        //                 options: [...addOptions, ...handleData],
        //             });
        //         } else {
        //             this.setState({
        //                 options: [...addOptions],
        //             });
        //         }
        //     });
        // }
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                pageSize: 2500,
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
        }).then((res) => {
            if (res && Array.isArray(res.data)) {
                // debugger;
                const handleData = res.data.map((item) => {
                    // return <Select.Option key={Number(item[id])}>{item[label]}</Select.Option>;
                    return { label: item[label], value: Number(item[id]) || item[id] };
                });
                if (showDefaultValue && selectForm) {
                    console.log(1);
                    selectForm?.current?.setFieldsValue({
                        [dbFieldName]: handleData[0]?.value,
                    });
                }
                this.setState({
                    options: [...addOptions, ...handleData],
                });
            } else {
                this.setState({
                    options: [...addOptions],
                });
            }
        });
    };

    onChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    };

    onSelect = () => {
        const { showDefaultValue } = this.props;
        if (!showDefaultValue) {
            this.getSqlData();
        }
    };

    render() {
        const { options } = this.state;
        const { placeholder, maxTagCount, mode, showSearch, value, onChange } = this.props;
        const compProps = {
            placeholder,
            maxTagCount,
            mode,
            showArrow: true,
            optionFilterProp: 'children',
            align: 'left',
            options,
            showSearch,
            value,
            onChange,
        };
        return (
            <Select
                {...compProps}
                filterOption={(e, opt) => {
                    if (opt?.label?.indexOf(e) > -1) {
                        return true;
                    }
                }}
            />
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
