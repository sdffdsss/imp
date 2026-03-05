import React from 'react';
import { Cascader } from 'oss-ui';
import { getPRCDatas } from './api';
import columnInfoModel from './hox';
import { withModel } from 'hox';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
        };
    }

    onChange = (value) => {
        this.props.dataInfo.setPrcDatas(value);
    };

    getProvinceDatas = async () => {
        const provinceRes = await getPRCDatas();
        const provinceDatas = [];
        if (provinceRes && provinceRes.data) {
            provinceRes.data.forEach((item) => {
                provinceDatas.push({
                    value: item.regionId,
                    label: item.regionName,
                    isLeaf: false,
                });
            });
            this.setState({ options: provinceDatas });
        }
    };

    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // load options lazily
        const regionRes = await getPRCDatas(targetOption.value);
        targetOption.loading = false;
        const regionDatas = [];
        if (regionRes && regionRes.data) {
            regionRes.data.forEach((item) => {
                regionDatas.push({
                    value: item.regionId,
                    label: item.regionName,
                    isLeaf: false,
                });
            });
            targetOption.children = regionDatas;
            this.setState({ options: [...this.state.options] }, async () => {
                if (selectedOptions.length > 1 && selectedOptions[1]) {
                    const cityRes = await getPRCDatas(selectedOptions[0].value, selectedOptions[1].value);
                    const cityDatas = [];
                    if (cityRes && cityRes.data) {
                        cityRes.data.forEach((item) => {
                            cityDatas.push({
                                value: item.regionId,
                                label: item.regionName,
                            });
                        });
                        targetOption.children = cityDatas;
                        this.setState({ options: [...this.state.options] });
                    }
                }
            });
        }
    };

    componentDidMount() {
        this.getProvinceDatas();
    }

    render() {
        return <Cascader options={this.state.options} loadData={this.loadData} onChange={this.onChange} changeOnSelect />;
    }
}

export default withModel(columnInfoModel, (dataInfo) => ({
    dataInfo,
}))(Index);
