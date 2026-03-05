// import locales from 'locales';
/**
 * 通用的下拉框选择数据组件  支持antd select的常用属性基础上做一层封装
 */
import React, { PureComponent } from 'react';
import request from '../../common/api';
import { Select, Spin } from 'oss-ui';
import PropTypes from 'prop-types';

import { _ } from 'oss-web-toolkits';

import Immutable from 'immutable';

class Default extends PureComponent {
    static propTypes = {
        // 数据来源类型 接口或本地写死数据
        dataSourceType: PropTypes.oneOf(['url', 'local']),
        // 每页数据量 默认每页10条
        pageSize: PropTypes.number,
        keyField: PropTypes.string,
        valueField: PropTypes.string,
        nameField: PropTypes.string,
        requestDataMethod: PropTypes.string,
        labelInValue: PropTypes.bool,
        maxTagCount: PropTypes.number,
        url: PropTypes.string,
        style: PropTypes.object,
        localDataSource: PropTypes.array,
        // 是否增加在数据头部增加全部选项
        addAllOption: PropTypes.bool
    };

    static defaultProps = {
        dataSourceType: 'url',
        // 数据源为本地数据时
        localDataSource: [],
        pageSize: 10,
        keyField: 'id',
        valueField: 'id',
        nameField: 'name',
        requestDataMethod: 'get',
        labelInValue: false,
        maxTagCount: 2,
        style: {},
        addAllOption: false,
        mode: 'default'
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            // 表格翻页数据
            pagination: {
                current: 1,
                pageSize: props.pageSize,
                total: 0
            },
            dataSource: [],
            hasNextPage: props.dataSourceType === 'url'
        };

        this.reload = _.debounce(this.reload.bind(this), 800);
    }

    componentDidMount() {
        this.reload();
    }

    reload(params = {}) {
        const { pagination, dataSource } = this.state;
        const { dataSourceType, url, pageSize, requestDataMethod, baseUrlType } = this.props;

        if (dataSourceType === 'url' && !url) {
            return;
        }

        if (dataSourceType === 'url') {
            this.setState({
                loading: true
            });

            const searchParams = _.extend({}, pagination, params);

            request(url, {
                type: requestDataMethod,
                data: searchParams,
                baseUrlType,
                showSuccessMessage: false
            }).then((res) => {
                if (Array.isArray(res.data)) {
                    this.setState({
                        loading: false,
                        pagination: { current: res.current, pageSize: res.pageSize, total: res.total },
                        dataSource: dataSource.concat(res.data) || [],
                        hasNextPage: !(res.data.length < pageSize)
                    });
                }
            });
        }
    }

    // 需要接口支持 关键词搜索字段为keyword  可以后期支持自定义参数字段
    handleSearch = (keyword) => {
        this.setState(
            {
                dataSource: [],
                loading: true
            },
            () => {
                this.reload({ current: 1, keyword });
            }
        );
    };

    onPopupScroll = (event) => {
        const { hasNextPage, pagination } = this.state;

        // 没有下一页不执行
        if (!hasNextPage) {
            return;
        }

        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom) {
            this.reload({ current: pagination.current + 1 });
        }
    };

    render() {
        const { keyField, nameField, valueField, dataSourceType, localDataSource, addAllOption, labelInValue = false, ...otherProps } = this.props;
        const { dataSource = [], loading } = this.state;
        let optionsDataSource = dataSourceType === 'local' ? localDataSource : dataSource;

        // 单选模式下是都需要添加全部选项
        if (addAllOption && otherProps.mode === 'default') {
            optionsDataSource = Immutable.merge(
                [
                    {
                        [nameField]: 'zxfc',
                        [keyField]: '',
                        [valueField]: ''
                    }
                ],
                optionsDataSource
            );
        }

        return (
            <Select
                className="common-select-wrapper"
                loading={loading}
                notFoundContent={loading ? <Spin size="small" /> : null}
                // getPopupContainer={(triggerNode) => triggerNode.parentElement}
                onSearch={this.handleSearch}
                onPopupScroll={this.onPopupScroll}
                labelInValue={labelInValue}
                {...otherProps}
            >
                {optionsDataSource.map((item) => (
                    <Select.Option
                        key={item[keyField]}
                        // value={item[valueField]}
                    >
                        {item[nameField]}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

export default Default;
