import React from 'react';
import { Select } from 'oss-ui';
import request from '@Src/common/api';
import PropTypes from 'prop-types';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { getInitialProvince } from '../utils/tools'
import { withModel } from 'hox';

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
            loading: false
        };
        this.onSearch = _.debounce(this.onSearch, 500);
    }
    componentDidMount() {
        this.getSqlData();
    }

    componentWillReceiveProps(props){
        if(props.cityList){
            this.getSqlData({},props.cityList)
        }
    }

    onSearch = (inputValue) => {
        this.getSqlData(inputValue);
    };

    getSqlData = (inputValue,list) => {
        const { dictName, id, label, login, addOptions, selectForm, showDefaultValue } = this.props;
        const { systemInfo } = login
        const initProvince = getInitialProvince(systemInfo?.currentZone?.zoneId,login.userInfo)
        if(list && dictName === 'region_id'){
            if (list && Array.isArray(list)) {
                // debugger;
                const handleData = list.map((item) => {
                    // return <Select.Option key={Number(item[id])}>{item[label]}</Select.Option>;
                    return { label: item.regionName, value: Number(item.regionId) || item.regionId };
                });
                if(showDefaultValue && selectForm){
                    selectForm?.current?.setFieldsValue({
                        [dictName]: handleData[0]?.value
                    })
                }
                this.setState({
                    options: [...addOptions, ...handleData],
                });
            } else {
                this.setState({
                    options: [...addOptions],
                });
            }
            return
        }

        if(dictName === 'region_id'){
            return
        }

        this.setState({
            loading:true
        })


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
            this.setState({
                loading:false
            })
            if (res && Array.isArray(res.data)) {
                // debugger;
                const handleData = []
                if(dictName === 'province_id'){
                    res.data.map((item) => {
                        if(item.key === initProvince){
                            return handleData.push({ label: item[label], value: Number(item[id]) });
                        }
                    });
                }else {
                    res.data.map((item) => {
                        return handleData.push({ label: item[label], value: Number(item[id]) || item[id] });
                    });
                }
                if(showDefaultValue && selectForm){
                    selectForm?.current?.setFieldsValue({
                        [dictName]: handleData[0]?.value
                    })
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
        const { showDefaultValue } = this.props
        if(!showDefaultValue){
            this.getSqlData()
        }
    }

    render() {
        const { options, loading } = this.state;
        const { placeholder, maxTagCount, mode, showSearch, value, onChange } = this.props;
        const compProps = {
            placeholder: "全部",
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
        return <Select {...compProps} loading={loading} filterOption={(e, opt) => {
            if (opt?.label?.indexOf(e) > -1) {
                return true;
            }
        }} />;
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
