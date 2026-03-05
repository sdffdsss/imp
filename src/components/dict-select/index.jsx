import React from 'react';
import { Select, Spin } from 'oss-ui';
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
        addOptions: PropTypes.array,
        pageSize: PropTypes.number,
        labelInValue: PropTypes.bool,
    };

    static defaultProps = {
        dictName: '',
        id: 'status',
        label: 'text',
        placeholder: '请选择',
        maxTagCount: 1,
        mode: '',
        pageSize: 50,
        showSearch: true,
        addOptions: [],
        labelInValue: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            loading: true,
        };
        this.onSearch = _.debounce(this.onSearch, 500);
    }
    componentDidMount() {
        this.getSqlData();
    }
    componentDidUpdate(prevProps) {
        if (this.props.cityList !== prevProps.cityList) {
            if (this.props.cityList) {
                this.setState({
                    options: this.props.cityList.map((item) => {
                        return {
                            label: item.regionName,
                            value: Number(item.regionId),
                        };
                    }),
                });
            }
        }
    }

    componentWillUnmount = () => {
        this.setState = () => {
            return false;
        };
    };

    onSearch = (inputValue) => {
        this.getSqlData(inputValue);
    };

    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    getSqlData = (inputValue) => {
        const { dictName, id, label, login, addOptions, pageSize, cityList } = this.props;
        const { systemInfo, isAdmin } = login;
        this.setState({
            loading: true,
        });
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                pageSize,
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
                const handleData = res.data
                    .filter((item) =>
                        dictName === 'province_id'
                            ? this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo)
                                ? this.getInitialProvince(systemInfo?.currentZone?.zoneId, login.userInfo) === item.key
                                : true
                            : true,
                    )
                    .map((item) => {
                        return { label: item[label], value: Number(item[id]) };
                    });
                if (cityList && cityList[0]?.regionId !== '1') {
                    this.setState({
                        options: cityList.map((item) => {
                            return {
                                label: item.regionName,
                                value: Number(item.regionId),
                            };
                        }),
                        loading: false,
                    });
                } else {
                    this.setState({
                        options: [...addOptions, ...handleData],
                        loading: false,
                    });
                }
            } else {
                this.setState({
                    options: [...addOptions],
                    loading: false,
                });
            }
        });
    };

    onChange = (e) => {
        const { options } = this.state;
        let list = e;
        if (e && Array.isArray(e)) {
            if (e[e.length - 1] === '') {
                list = [''];
            } else if (e.find((item) => item === '') === '') {
                list = e.filter((item) => item !== '');
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.props.onChange && this.props.onChange(list, options);
    };

    render() {
        const { options, loading } = this.state;
        const { placeholder, maxTagCount, mode, showSearch, labelInValue, value, disabled } = this.props;
        const compProps = {
            showArrow: true,
            filterOption: false,
            align: 'left',
            options,
            placeholder,
            maxTagCount,
            mode,
            showSearch,
            labelInValue,
            value,
            notFoundContent: loading ? <Spin size="small" /> : null,
        };
        return (
            <Select
                {...compProps}
                onSelect={() => {
                    this.onSearch('');
                }}
                disabled={disabled}
                onSearch={this.onSearch}
                onChange={this.onChange}
                onFocus={() => this.getSqlData('')}
            />
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
