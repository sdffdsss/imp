// import locales from "locales";
import React from 'react';
import { Cascader } from 'oss-ui';
import request from '@Common/api';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
        };
    }
    componentDidMount() {
        const { fieldSql, mapperId } = this.props;
        if (fieldSql) {
            this.getDataBySqlId(fieldSql, mapperId);
        }
    }

    getDictEntry(dictName) {
        const {
            login: { userId, systemInfo, userInfo },
        } = this.props;
        let zoneObj = {};
        if (dictName === 'province_id') {
            zoneObj.hasAdditionZone = false;
        }
        let userInfos = userInfo && JSON.parse(userInfo);

        if (systemInfo.currentZone?.zoneLevel === '5' && userInfos?.zones[0].zoneLevel === '1') {
            zoneObj = { zoneId: systemInfo.currentZone?.zoneId };
        }
        // return Promise.resolve(
        return request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: dictName === 'province_id' ? userId : '968628', // 地市用户查全国的地市
                ...zoneObj,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    if (systemInfo.currentZone?.zoneId) {
                        const zoneId = systemInfo.currentZone?.zoneId;
                        const zoneLevel = systemInfo.currentZone?.zoneLevel;
                        return res.data.filter((a) => (zoneLevel !== '1' && zoneLevel !== '5' ? a.key === zoneId : a.key !== zoneId));
                    }
                    return res.data;
                }
                return [];
            })
            .catch((err) => {
                console.error(err);
                // return [{ key: '-1489894494',value: '广东'}];
                return [];
            });
        // );
    }
    async getDataBySqlId(sqlId, mapperId) {
        console.log(sqlId, mapperId);
        const cascadeRequest = await request('common/getDictToPaasByName', {
            type: 'get',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                dictName: 'provinceRegionCity',
            },
        });
        // const allRes = await getData(sqlId, { showSuccessMessage: false, showErrorMessage: false }, {}, -1, data);
        // const allData = allRes?.data ?? [];
        // const provinceData = await this.getDictEntry('province_id');
        // const provinceData = await this.getDictEntry('province_id');
        const p = Promise.all([cascadeRequest, this.getDictEntry('province_id'), this.getDictEntry('region_id')]);
        p.then((resolveArrar) => {
            let options = [];
            const allRes = resolveArrar[0];
            let allData = allRes?.dataObject ?? [];
            const provinceData = resolveArrar[1];
            const regionData = resolveArrar[2];
            if (allData !== null && allData.length !== 0) {
                if (provinceData.length !== 0) {
                    allData = allData.filter((item) => {
                        const hasProvince = provinceData.find((provice) => {
                            const find = String(provice.key) === String(item.LEVEL_2_VALUE);
                            return find;
                        });
                        const hasRegion =
                            regionData.length === 0 ||
                            regionData.find((region) => {
                                const find = String(region.key) === String(item.LEVEL_1_VALUE);
                                return find;
                            });
                        return hasProvince && hasRegion;
                    });
                }
                options = allData.length !== 0 && this.getFormateData({ data: allData });
            }
            this.setState({ options }, () => {
                this.props.getRef && this.props.getRef(this);
            });
        });
        // getData(sqlId, { showSuccessMessage: false, showErrorMessage: false }, {}, -1, data).then((res) => {
        //     let options = [];
        //     if (res.data !== null) {
        //         options = this.getFormateData(res.data);
        //     }
        //     this.setState({ options });
        // });
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
                (parentValue === undefined || record[`LEVEL_${crruentlevel + 1}_VALUE`] === parentValue) &&
                (next === null || record[`LEVEL_${crruentlevel}_VALUE`] !== next[`LEVEL_${crruentlevel}_VALUE`])
            ) {
                if (crruentlevel === 0) {
                    if (!formateData.find((item) => item.value === record[`LEVEL_${crruentlevel}_VALUE`])) {
                        formateData.push({
                            label: record[`LEVEL_${crruentlevel}_LABEL`],
                            value: record[`LEVEL_${crruentlevel}_VALUE`],
                        });
                    }
                } else {
                    if (!formateData.find((item) => item.value === record[`LEVEL_${crruentlevel}_VALUE`])) {
                        formateData.push({
                            label: record[`LEVEL_${crruentlevel}_LABEL`],
                            value: record[`LEVEL_${crruentlevel}_VALUE`],
                            children: this.getFormateData({ data }, crruentlevel - 1, j, record[`LEVEL_${crruentlevel}_VALUE`]),
                        });
                    }
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
        const { operatorValue, onChange, fieldPlaceholder = '全部', disabled } = this.props;
        // console.log(operatorValue);
        return (
            <Cascader
                options={this.state.options}
                value={this.state.options.length > 0 ? operatorValue.value : null}
                placeholder={fieldPlaceholder}
                onChange={(value) => {
                    // console.log(value);
                    onChange(value);
                }}
                disabled={disabled}
                multiple
                changeOnSelect
                maxTagCount="responsive"
            />
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
