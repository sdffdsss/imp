// import locales from "locales";
import React from 'react';
import { Cascader } from 'oss-ui';
import PropTypes from 'prop-types';
import getData from '@Common/services/dataService';

export default class Index extends React.PureComponent {
    static propTypes = {
        sqlId: PropTypes.string,
        value: PropTypes.array,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        sqlId: '',
        // value: null,
        placeholder: '全部',
    };

    constructor(props) {
        super(props);
        this.state = {
            options: [],
        };
    }
    componentDidMount() {
        this.getDataBySqlId();
    }
    getDataBySqlId() {
        getData(`${this.props.sqlId}`, { showSuccessMessage: false, showErrorMessage: false }).then((res) => {
            let options = [];
            if (res.data !== null) {
                options = this.getFormateData(res.data);
            }
            this.setState({ options });
        });
    }

    /**
     *
     * @param {*} param0  数据全集
     * @param {*} level 当前遍历层级，从高到低 2 1 0
     * @param {*} length 当前便利的数据长度
     * @param {*} parentValue 当前便利的父标识，防止多加数据
     * @returns 返回当前层级的数据
     */
    getFormateData({ data = [] }, level, length, parentValue) {
        const formateData = [];
        const crruentlevel = level !== undefined ? level : Object.keys(data[0]).length / 2 - 1;
        const size = length !== undefined ? length : data.length - 1;
        for (let j = 0; j <= size; j++) {
            const record = data[j];
            const next = j === size ? null : data[j + 1];
            if (!record) {
                // console.info('j = ' + j);
            }
            if (
                (parentValue === undefined || record[`level${  crruentlevel + 1  }Value`] === parentValue) &&
                (next === null || record[`level${  crruentlevel  }Value`] !== next[`level${  crruentlevel  }Value`])
            ) {
                if (crruentlevel === 0) {
                    formateData.push({
                        label: record[`level${  crruentlevel  }Label`],
                        value: record[`level${  crruentlevel  }Value`],
                    });
                } else {
                    formateData.push({
                        label: record[`level${  crruentlevel  }Label`],
                        value: record[`level${  crruentlevel  }Value`],
                        children: this.getFormateData({ data }, crruentlevel - 1, j, record[`level${  crruentlevel  }Value`]),
                    });
                }
            }
        }
        return formateData;
    }
    pushChilden(parnet, value, label) {
        parnet.push();
    }
    value = [];
    render() {
        const { value, onChange, placeholder } = this.props;
        return <Cascader options={this.state.options} value={value} placeholder={placeholder} onChange={onChange} changeOnSelect></Cascader>;
    }
}
